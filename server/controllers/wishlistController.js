import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'category', select: 'name slug' }
    });

    res.json({
      success: true,
      wishlist: user.wishlist || []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    const populatedUser = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'category', select: 'name slug' }
    });

    res.json({
      success: true,
      message: 'Added to your favorites!',
      wishlist: populatedUser.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    const populatedUser = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'category', select: 'name slug' }
    });

    res.json({
      success: true,
      message: 'Removed from favorites',
      wishlist: populatedUser.wishlist
    });
  } catch (error) {
    next(error);
  }
};
