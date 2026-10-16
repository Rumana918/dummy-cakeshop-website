import Category from '../models/Category.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    const isAdmin = req.query.all === 'true';
    const query = isAdmin ? {} : { isActive: true };
    const categories = await Category.find(query).sort({ order: 1, name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category (Admin)
// @route   POST /api/categories
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, order } = req.body;
    let categoryImage = image || '';

    if (req.file) {
      categoryImage = await uploadToCloudinary(req.file.buffer, 'sweet_whisk/categories');
    }

    const slug = slugify(name);
    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: categoryImage,
      order: Number(order) || 0
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { name, description, image, isActive, order } = req.body;

    if (name) {
      category.name = name;
      category.slug = slugify(name);
    }
    if (description !== undefined) category.description = description;
    if (image) category.image = image;
    if (isActive !== undefined) category.isActive = Boolean(isActive);
    if (order !== undefined) category.order = Number(order);

    if (req.file) {
      category.image = await uploadToCloudinary(req.file.buffer, 'sweet_whisk/categories');
    }

    const updated = await category.save();
    res.json({ success: true, category: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
