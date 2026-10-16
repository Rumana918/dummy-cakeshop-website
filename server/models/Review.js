import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    default: ''
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required']
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

reviewSchema.index({ product: 1, isApproved: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
