import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to get or create cart
const getOrCreateCart = async (userId, guestId) => {
  let cart;
  if (userId) {
    cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
  } else if (guestId) {
    cart = await Cart.findOne({ guestId });
    if (!cart) {
      cart = await Cart.create({ guestId, items: [] });
    }
  }
  return cart;
};

// @desc    Get cart
// @route   GET /api/cart
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const guestId = req.headers['x-guest-id'] || req.query.guestId;

    if (!userId && !guestId) {
      return res.json({ success: true, cart: { items: [] } });
    }

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId }).populate('items.product');
    } else {
      cart = await Cart.findOne({ guestId }).populate('items.product');
    }

    if (!cart) {
      return res.json({ success: true, cart: { items: [] } });
    }

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, weight, flavor, messageOnCake, quantity, price, deliveryDate } = req.body;
    const userId = req.user ? req.user._id : null;
    const guestId = req.headers['x-guest-id'] || req.body.guestId;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isAvailable) {
      return res.status(404).json({ success: false, message: 'Product is unavailable' });
    }

    let finalPrice = Number(price);
    if (!finalPrice || isNaN(finalPrice)) {
      const variant = product.variants?.find(v => v.weight === (weight || '500g'));
      finalPrice = variant ? variant.price : product.basePrice;
    }

    const cart = await getOrCreateCart(userId, guestId);
    if (!cart) {
      return res.status(400).json({ success: false, message: 'Could not access cart' });
    }

    // Check if item with same product, weight, flavor and message already exists
    const existingIndex = cart.items.findIndex(item =>
      item.product.toString() === productId &&
      item.weight === (weight || '500g') &&
      item.flavor === (flavor || 'Classic') &&
      item.messageOnCake === (messageOnCake || '')
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity) || 1;
    } else {
      cart.items.push({
        product: productId,
        weight: weight || '500g',
        flavor: flavor || 'Classic',
        messageOnCake: messageOnCake || '',
        quantity: Number(quantity) || 1,
        price: finalPrice,
        deliveryDate: deliveryDate || ''
      });
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');

    res.json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity / details
// @route   PUT /api/cart/:itemId
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const userId = req.user ? req.user._id : null;
    const guestId = req.headers['x-guest-id'] || req.query.guestId;

    const query = userId ? { user: userId } : { guestId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    if (quantity !== undefined) {
      if (Number(quantity) <= 0) {
        cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
      } else {
        item.quantity = Number(quantity);
      }
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
export const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const guestId = req.headers['x-guest-id'] || req.query.guestId;

    const query = userId ? { user: userId } : { guestId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const guestId = req.headers['x-guest-id'] || req.query.guestId;

    const query = userId ? { user: userId } : { guestId };
    await Cart.findOneAndUpdate(query, { items: [] });

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync guest cart with user account upon login
// @route   POST /api/cart/sync
export const syncCart = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Must be logged in to sync' });
    }

    const { localItems } = req.body;
    let userCart = await Cart.findOne({ user: req.user._id });
    if (!userCart) {
      userCart = await Cart.create({ user: req.user._id, items: [] });
    }

    if (Array.isArray(localItems) && localItems.length > 0) {
      for (const item of localItems) {
        const prodId = item.product?._id || item.product;
        const existing = userCart.items.find(i =>
          i.product.toString() === prodId &&
          i.weight === item.weight &&
          i.flavor === item.flavor
        );

        if (existing) {
          existing.quantity += item.quantity || 1;
        } else {
          userCart.items.push({
            product: prodId,
            weight: item.weight || '500g',
            flavor: item.flavor || 'Classic',
            messageOnCake: item.messageOnCake || '',
            quantity: item.quantity || 1,
            price: item.price,
            deliveryDate: item.deliveryDate || ''
          });
        }
      }
      await userCart.save();
    }

    const populated = await Cart.findById(userCart._id).populate('items.product');
    res.json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};
