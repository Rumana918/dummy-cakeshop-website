import GalleryImage from '../models/GalleryImage.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get all gallery images
// @route   GET /api/gallery
export const getGallery = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    const images = await GalleryImage.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: images.length, images });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload new gallery image (Admin)
// @route   POST /api/gallery
export const createGalleryImage = async (req, res, next) => {
  try {
    const { title, category, description, imageUrl, isFeatured } = req.body;
    let finalImageUrl = imageUrl;

    if (req.file) {
      finalImageUrl = await uploadToCloudinary(req.file.buffer, 'sweet_whisk/gallery');
    }

    if (!finalImageUrl) {
      return res.status(400).json({ success: false, message: 'Please provide an image' });
    }

    const image = await GalleryImage.create({
      title: title || 'Bakery Creation',
      category: category || 'Pastries',
      imageUrl: finalImageUrl,
      description: description || '',
      isFeatured: Boolean(isFeatured)
    });

    res.status(201).json({ success: true, image });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery image (Admin)
// @route   DELETE /api/gallery/:id
export const deleteGalleryImage = async (req, res, next) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image removed from gallery' });
  } catch (error) {
    next(error);
  }
};
