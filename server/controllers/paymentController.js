import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    if (process.env.RAZORPAY_KEY_ID !== 'rzp_test_placeholder') {
      try {
        razorpayInstance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET
        });
      } catch (e) {
        console.warn('[Razorpay Warning]: Could not initialize Razorpay instance:', e.message);
      }
    }
  }
  return razorpayInstance;
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const razorpay = getRazorpayInstance();
    const amountInPaisa = Math.round(order.totalAmount * 100);

    if (razorpay) {
      const options = {
        amount: amountInPaisa,
        currency: 'INR',
        receipt: order.orderNumber,
        notes: {
          orderId: order._id.toString(),
          customerEmail: req.user.email
        }
      };

      const razorpayOrder = await razorpay.orders.create(options);

      order.paymentDetails = {
        razorpayOrderId: razorpayOrder.id
      };
      await order.save();

      return res.json({
        success: true,
        isMock: false,
        key: process.env.RAZORPAY_KEY_ID,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          receipt: razorpayOrder.receipt
        },
        order
      });
    }

    // Fallback: Sandbox / Development simulation mode
    const mockRazorpayOrderId = 'order_mock_' + Date.now();
    order.paymentDetails = {
      razorpayOrderId: mockRazorpayOrderId
    };
    await order.save();

    res.json({
      success: true,
      isMock: true,
      key: 'rzp_test_placeholder',
      razorpayOrder: {
        id: mockRazorpayOrderId,
        amount: amountInPaisa,
        currency: 'INR',
        receipt: order.orderNumber
      },
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isMock
    } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (isMock || process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder') {
      // Simulate successful payment verification in sandbox mode
      order.paymentStatus = 'Completed';
      order.paymentDetails = {
        razorpayOrderId: razorpay_order_id || 'order_mock_' + Date.now(),
        razorpayPaymentId: razorpay_payment_id || 'pay_mock_' + Date.now(),
        razorpaySignature: 'simulated_valid_signature'
      };
      order.orderStatus = 'Confirmed';
      order.trackingHistory.push({
        status: 'Confirmed',
        timestamp: new Date(),
        note: 'Payment received via UPI/Cards (Sandbox Mode). Baking scheduled!'
      });

      await order.save();
      return res.json({ success: true, message: 'Payment verified successfully (Mock)', order });
    }

    // Real Razorpay signature verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      order.paymentStatus = 'Completed';
      order.paymentDetails = {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      };
      order.orderStatus = 'Confirmed';
      order.trackingHistory.push({
        status: 'Confirmed',
        timestamp: new Date(),
        note: `Payment verified (${razorpay_payment_id}). Order confirmed!`
      });

      await order.save();
      res.json({ success: true, message: 'Payment verified successfully', order });
    } else {
      order.paymentStatus = 'Failed';
      await order.save();
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    next(error);
  }
};
