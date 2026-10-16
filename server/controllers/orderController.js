import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../utils/email.js';

// Helper to generate readable order number
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SW-${dateStr}-${randomChars}`;
};

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      orderItems,
      shippingAddress,
      deliverySlot,
      deliveryDate,
      paymentMethod,
      couponCode,
      notes
    } = req.body;

    const itemsToProcess = items || orderItems;

    if (!itemsToProcess || itemsToProcess.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.phone) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required' });
    }

    if (!deliveryDate) {
      return res.status(400).json({ success: false, message: 'Delivery date is required' });
    }

    // Calculate item total & verify stock
    let itemsPrice = 0;
    const verifiedItems = [];

    for (const item of itemsToProcess) {
      const product = await Product.findById(item.product?._id || item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }

      const itemTotal = item.price * item.quantity;
      itemsPrice += itemTotal;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        image: item.image || product.images[0],
        weight: item.weight || '500g',
        flavor: item.flavor || 'Classic',
        messageOnCake: item.messageOnCake || '',
        quantity: item.quantity,
        price: item.price,
        deliveryDate: item.deliveryDate || deliveryDate
      });
    }

    // Delivery charge calculation (Free above 999, else 50)
    const deliveryFee = itemsPrice >= 999 ? 0 : 50;

    // Coupon discount calculation
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gte: new Date() }
      });

      if (coupon && itemsPrice >= coupon.minOrderValue) {
        if (coupon.discountType === 'percent') {
          discount = Math.round((itemsPrice * coupon.discountValue) / 100);
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }

        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const totalAmount = Math.max(0, itemsPrice + deliveryFee - discount);
    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items: verifiedItems,
      shippingAddress,
      deliverySlot: deliverySlot || 'Morning (9:00 AM - 12:00 PM)',
      deliveryDate,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'Razorpay' ? 'Pending' : 'Pending',
      orderStatus: 'Pending',
      itemsPrice,
      deliveryFee,
      discount,
      totalAmount,
      couponCode: couponCode || '',
      notes: notes || '',
      trackingHistory: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: 'Order placed successfully and received by bakery.'
        }
      ]
    });

    // Clear user cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Send confirmation email
    sendOrderConfirmationEmail(order, req.user);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const isId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const query = isId ? { _id: req.params.id } : { orderNumber: req.params.id };

    const order = await Order.findOne(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images basePrice');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only allow customer who placed it or an admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (Customer, only while Pending)
// @route   PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (order.orderStatus !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already '${order.orderStatus}'. Please contact bakery support directly.`
      });
    }

    order.orderStatus = 'Cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = req.body.reason || 'Cancelled by customer';
    order.trackingHistory.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: req.body.reason || 'Cancelled by customer'
    });

    await order.save();
    res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder previous order items into cart
// @route   POST /api/orders/:id/reorder
export const reorder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    for (const item of order.items) {
      cart.items.push({
        product: item.product,
        weight: item.weight,
        flavor: item.flavor,
        messageOnCake: item.messageOnCake,
        quantity: item.quantity,
        price: item.price
      });
    }

    await cart.save();
    res.json({ success: true, message: 'Items added to cart' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, paymentMethod, search, date } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.recipientName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status) {
      order.orderStatus = status;
      order.trackingHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Status updated to ${status}`
      });

      if (status === 'Delivered') {
        order.paymentStatus = 'Completed';
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    // Send status update email to customer
    if (order.user && order.user.email) {
      sendOrderStatusEmail(order, order.user.email);
    }

    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    next(error);
  }
};
