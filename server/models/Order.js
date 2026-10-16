import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  weight: { type: String, default: '500g' },
  flavor: { type: String, default: 'Classic' },
  messageOnCake: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  deliveryDate: { type: String, default: '' }
}, { _id: true });

const trackingHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  deliverySlot: {
    type: String,
    default: 'Anytime (10:00 AM - 7:00 PM)'
  },
  deliveryDate: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Razorpay'],
    required: true,
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentDetails: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Baking', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  itemsPrice: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  couponCode: { type: String, default: '' },
  notes: { type: String, default: '' },
  cancelledAt: Date,
  cancelReason: String,
  trackingHistory: [trackingHistorySchema]
}, {
  timestamps: true
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
