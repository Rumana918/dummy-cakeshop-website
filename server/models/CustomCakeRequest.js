import mongoose from 'mongoose';

const customCakeRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true
  },
  occasion: {
    type: String,
    required: [true, 'Occasion is required'],
    default: 'Birthday'
  },
  flavor: {
    type: String,
    required: [true, 'Preferred flavor is required'],
    default: 'Classic Vanilla'
  },
  size: {
    type: String,
    required: [true, 'Estimated size or servings is required'],
    default: '1 kg (6-8 servings)'
  },
  designDescription: {
    type: String,
    required: [true, 'Design description is required']
  },
  referenceImages: [{
    type: String
  }],
  deliveryDate: {
    type: String,
    required: [true, 'Delivery date is required']
  },
  deliveryTimeSlot: {
    type: String,
    default: 'Morning (10 AM - 1 PM)'
  },
  quotePrice: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Quoted', 'Accepted', 'Rejected', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

customCakeRequestSchema.index({ status: 1, createdAt: -1 });

const CustomCakeRequest = mongoose.model('CustomCakeRequest', customCakeRequestSchema);
export default CustomCakeRequest;
