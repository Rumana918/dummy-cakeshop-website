import Review from '../models/Review.js';
import Product from '../models/Product.js';

// Helper to recalculate product rating
const updateProductStats = async (productId) => {
  const reviews = await Review.find({ product: productId, isApproved: true });
  const numReviews = reviews.length;
  const rating = numReviews > 0
    ? Number((reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews).toFixed(1))
    : 5.0;

  await Product.findByIdAndUpdate(productId, { rating, numReviews });
};

// @desc    Add review for product
// @route   POST /api/products/:id/reviews
export const addReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this delicious bake!' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      title: title || '',
      comment,
      isApproved: true
    });

    await updateProductStats(productId);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been published.',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle review approval (Admin)
// @route   PATCH /api/reviews/:id/approve
export const toggleApproveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isApproved = !review.isApproved;
    await review.save();

    await updateProductStats(review.product);

    res.json({ success: true, isApproved: review.isApproved, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);
    await updateProductStats(productId);

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
