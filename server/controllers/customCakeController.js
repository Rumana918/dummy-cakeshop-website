import CustomCakeRequest from '../models/CustomCakeRequest.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { sendCustomCakeQuoteEmail } from '../utils/email.js';

// @desc    Create a custom cake request
// @route   POST /api/custom-requests
export const createCustomRequest = async (req, res, next) => {
  try {
    const {
      customerName,
      contactName,
      name,
      email,
      contactEmail,
      phone,
      contactPhone,
      occasion,
      flavor,
      size,
      tierCount,
      servings,
      designDescription,
      description,
      deliveryDate,
      deliveryTimeSlot,
      deliveryTime,
      referenceImages
    } = req.body;

    const finalName = customerName || contactName || name || (req.user ? req.user.name : '');
    const finalEmail = email || contactEmail || (req.user ? req.user.email : '');
    const finalPhone = phone || contactPhone || (req.user ? req.user.phone : '');
    const finalDescription = designDescription || description || '';
    const finalDate = deliveryDate || '';
    const finalSize = size || (tierCount ? `${tierCount} (${servings || 10} servings)` : '1 kg (6-8 servings)');
    const finalSlot = deliveryTimeSlot || deliveryTime || 'Morning (10 AM - 1 PM)';

    if (!finalName || !finalEmail || !finalPhone || !finalDescription || !finalDate) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, Phone, Description, Delivery Date)'
      });
    }

    const images = Array.isArray(referenceImages) ? referenceImages : (referenceImages ? [referenceImages] : []);

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedUrl = await uploadToCloudinary(file.buffer, 'sweet_whisk/custom_cakes');
        images.push(uploadedUrl);
      }
    }

    const customRequest = await CustomCakeRequest.create({
      user: req.user ? req.user._id : null,
      customerName: finalName,
      email: finalEmail,
      phone: finalPhone,
      occasion: occasion || 'Birthday',
      flavor: flavor || 'Classic Vanilla',
      size: finalSize,
      designDescription: finalDescription,
      referenceImages: images,
      deliveryDate: finalDate,
      deliveryTimeSlot: finalSlot,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Custom cake inquiry submitted successfully! Our head baker will review and quote shortly.',
      customRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get custom requests for logged in user
// @route   GET /api/custom-requests/my
export const getMyCustomRequests = async (req, res, next) => {
  try {
    const requests = await CustomCakeRequest.find({
      $or: [{ user: req.user._id }, { email: req.user.email }]
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all custom requests (Admin)
// @route   GET /api/custom-requests
export const getAllCustomRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const requests = await CustomCakeRequest.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Update custom request status / price quote (Admin)
// @route   PUT /api/custom-requests/:id
export const updateCustomRequest = async (req, res, next) => {
  try {
    const { status, quotePrice, adminNotes } = req.body;
    const request = await CustomCakeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Custom cake request not found' });
    }

    if (status) request.status = status;
    if (quotePrice !== undefined) request.quotePrice = Number(quotePrice);
    if (adminNotes !== undefined) request.adminNotes = adminNotes;

    await request.save();

    // If quote has been updated or status set to Quoted, send email
    if (quotePrice && (status === 'Quoted' || request.status === 'Quoted')) {
      sendCustomCakeQuoteEmail(request);
    }

    res.json({ success: true, message: 'Custom request updated', request });
  } catch (error) {
    next(error);
  }
};
