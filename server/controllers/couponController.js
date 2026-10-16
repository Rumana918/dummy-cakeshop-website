import Coupon from '../models/Coupon.js';

// @desc    Apply coupon code
// @route   POST /api/coupons/apply
export const applyCoupon = async (req, res, next) => {
  try {
    const { code, orderTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit has been reached' });
    }

    const total = Number(orderTotal) || 0;
    if (total < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percent') {
      discount = Math.round((total * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully! Saved ₹${discount}`,
      discount,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coupon (Admin)
// @route   POST /api/coupons
export const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      expiryDate,
      usageLimit,
      isActive
    } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A coupon with this code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType: discountType || 'percent',
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      expiryDate: new Date(expiryDate),
      usageLimit: Number(usageLimit) || 100,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Update coupon (Admin)
// @route   PUT /api/coupons/:id
export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      expiryDate,
      usageLimit,
      isActive
    } = req.body;

    if (code) coupon.code = code.toUpperCase();
    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = Number(discountValue);
    if (minOrderValue !== undefined) coupon.minOrderValue = Number(minOrderValue);
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount ? Number(maxDiscount) : null;
    if (expiryDate) coupon.expiryDate = new Date(expiryDate);
    if (usageLimit !== undefined) coupon.usageLimit = Number(usageLimit);
    if (isActive !== undefined) coupon.isActive = Boolean(isActive);

    const updated = await coupon.save();
    res.json({ success: true, coupon: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    next(error);
  }
};
