import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI, couponAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sw_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('sw_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [deliveryDate, setDeliveryDate] = useState(() => {
    // Tomorrow by default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const [deliverySlot, setDeliverySlot] = useState('Morning (9:00 AM - 12:00 PM)');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sw_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('sw_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('sw_coupon');
    }
  }, [coupon]);

  // Sync cart with backend when user logs in
  useEffect(() => {
    const syncUserCart = async () => {
      if (isAuthenticated) {
        try {
          if (cartItems.length > 0) {
            const res = await cartAPI.sync(cartItems);
            if (res.data?.cart?.items) {
              setCartItems(res.data.cart.items);
            }
          } else {
            const res = await cartAPI.get();
            if (res.data?.cart?.items) {
              setCartItems(res.data.cart.items);
            }
          }
        } catch (err) {
          console.warn('Cart sync warning:', err.message);
        }
      }
    };
    syncUserCart();
  }, [isAuthenticated]);

  // Add item to cart
  const addToCart = (product, options = {}) => {
    const weight = options.weight || (product.variants?.[0]?.weight || '500g');
    const price = options.price || (product.variants?.find(v => v.weight === weight)?.price || product.basePrice);
    const flavor = options.flavor || (product.flavors?.[0] || 'Classic');
    const messageOnCake = options.messageOnCake || '';
    const quantity = Number(options.quantity) || 1;
    const selectedDate = options.deliveryDate || deliveryDate;

    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => {
        const prodId = item.product?._id || item.product;
        return (
          prodId === product._id &&
          item.weight === weight &&
          item.flavor === flavor &&
          item.messageOnCake === messageOnCake
        );
      });

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            _id: 'cart_' + Date.now() + Math.random().toString(36).substring(2, 7),
            product: {
              _id: product._id,
              name: product.name,
              slug: product.slug,
              images: product.images,
              basePrice: product.basePrice,
              isEggless: product.isEggless
            },
            name: product.name,
            image: product.images?.[0] || '',
            weight,
            price,
            flavor,
            messageOnCake,
            quantity,
            deliveryDate: selectedDate
          }
        ];
      }
    });

    toast.success(`Added "${product.name}" to your cart! 🍰`, {
      style: {
        background: '#FFF9F3',
        color: '#8A5A64',
        border: '1px solid #F4A7B9'
      }
    });
  };

  // Update quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item._id === itemId ? { ...item, quantity } : item))
    );
  };

  // Remove item
  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item._id !== itemId));
    toast('Item removed from cart', { icon: '🗑️' });
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    localStorage.removeItem('sw_cart');
    localStorage.removeItem('sw_coupon');
  };

  // Apply coupon
  const applyCouponCode = async (code) => {
    try {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const res = await couponAPI.apply(code, subtotal);
      setCoupon({
        code: res.data.coupon.code,
        discount: res.data.discount,
        details: res.data.coupon
      });
      toast.success(res.data.message || 'Coupon applied successfully! 🎉');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to apply coupon');
      return false;
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setCoupon(null);
    toast('Coupon removed');
  };

  // Calculations
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const itemsPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = itemsPrice >= 999 || itemsPrice === 0 ? 0 : 50;
  const discountAmount = coupon ? Math.min(itemsPrice, coupon.discount) : 0;
  const totalAmount = Math.max(0, itemsPrice + deliveryFee - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        itemsPrice,
        deliveryFee,
        discountAmount,
        totalAmount,
        coupon,
        deliveryDate,
        deliverySlot,
        setDeliveryDate,
        setDeliverySlot,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon: applyCouponCode,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
