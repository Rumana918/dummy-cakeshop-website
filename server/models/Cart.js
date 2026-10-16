import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  weight: {
    type: String,
    default: '500g'
  },
  flavor: {
    type: String,
    default: 'Classic'
  },
  messageOnCake: {
    type: String,
    default: '',
    maxlength: 100
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  deliveryDate: {
    type: String,
    default: ''
  }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    sparse: true
  },
  guestId: {
    type: String,
    sparse: true
  },
  items: [cartItemSchema]
}, {
  timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
