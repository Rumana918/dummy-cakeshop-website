import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Helper to slugify
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// @desc    Get all products with filters & pagination
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      eggless,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isAvailable: true };

    // Category filter (by slug or ObjectId)
    if (category && category !== 'all') {
      const catDoc = await Category.findOne({
        $or: [{ slug: category.toLowerCase() }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }]
      });
      if (catDoc) {
        query.category = catDoc._id;
      }
    }

    // Search query
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { flavors: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    // Eggless filter
    if (eggless === 'true') {
      query.isEggless = true;
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { basePrice: 1 };
    else if (sort === 'price-high') sortOption = { basePrice: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = Number(page) || 1;
    const pageSize = Number(limit) || 12;
    const skip = (pageNum - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      products,
      page: pageNum,
      pages: Math.ceil(total / pageSize) || 1,
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isAvailable: true })
      .populate('category', 'name slug')
      .limit(8);

    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get best-seller products
// @route   GET /api/products/best-sellers
export const getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({ isBestSeller: true, isAvailable: true })
      .populate('category', 'name slug')
      .limit(8);

    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const isId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const query = isId ? { _id: req.params.id } : { slug: req.params.id };

    const product = await Product.findOne(query).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Cake not found' });
    }

    // Fetch approved reviews
    const reviews = await Review.find({ product: product._id, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    // Fetch related products in the same category
    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isAvailable: true
    }).limit(4);

    res.json({
      success: true,
      product,
      reviews,
      related
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      basePrice,
      variants,
      flavors,
      isEggless,
      ingredients,
      stock,
      images,
      isFeatured,
      isBestSeller,
      isAvailable
    } = req.body;

    let parsedVariants = variants;
    if (typeof variants === 'string') {
      try { parsedVariants = JSON.parse(variants); } catch (e) { parsedVariants = []; }
    }

    let parsedFlavors = flavors;
    if (typeof flavors === 'string') {
      try { parsedFlavors = JSON.parse(flavors); } catch (e) { parsedFlavors = flavors.split(',').map(s => s.trim()); }
    }

    let productImages = Array.isArray(images) ? images : (images ? [images] : []);

    // Handle uploaded files if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedUrl = await uploadToCloudinary(file.buffer, 'sweet_whisk/products');
        productImages.push(uploadedUrl);
      }
    }

    if (productImages.length === 0) {
      productImages = ['https://lh3.googleusercontent.com/aida-public/AB6AXuDVpULMsjNNStgGGl9ON5NQfN_H6uurOrBYeVKbSaWwSjWiGYY5BV5a6R2l3u_fdoNRmnEUcMqI6LSDzO9dgHP_-i0d23eRl1QEBApjWki7DkGCNsKdCUUDGCBPLdd6s_iXFbfYZ9T4jysgnlEPVpyfR6JAtxUTe9gZSD7qljPxVVV4bOzC2fjUh4PQgk5Olx-21zGtrM-I51CZ0mIPpKf-J-IIT8D-PkSmnJ76GKBJB76DJM69jfpw'];
    }

    const slug = slugify(name) + '-' + Math.floor(1000 + Math.random() * 9000);

    const product = await Product.create({
      name,
      slug,
      description,
      category,
      basePrice: Number(basePrice),
      variants: parsedVariants && parsedVariants.length > 0 ? parsedVariants : [
        { weight: '500g', price: Number(basePrice) },
        { weight: '1kg', price: Math.round(Number(basePrice) * 1.85) },
        { weight: '2kg', price: Math.round(Number(basePrice) * 3.5) }
      ],
      flavors: parsedFlavors || ['Classic'],
      isEggless: Boolean(isEggless),
      ingredients: ingredients || '',
      stock: Number(stock) || 20,
      images: productImages,
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      name,
      description,
      category,
      basePrice,
      variants,
      flavors,
      isEggless,
      ingredients,
      stock,
      images,
      isFeatured,
      isBestSeller,
      isAvailable
    } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (basePrice !== undefined) product.basePrice = Number(basePrice);
    if (isEggless !== undefined) product.isEggless = Boolean(isEggless);
    if (ingredients !== undefined) product.ingredients = ingredients;
    if (stock !== undefined) product.stock = Number(stock);
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
    if (isBestSeller !== undefined) product.isBestSeller = Boolean(isBestSeller);
    if (isAvailable !== undefined) product.isAvailable = Boolean(isAvailable);

    if (variants) {
      try {
        product.variants = typeof variants === 'string' ? JSON.parse(variants) : variants;
      } catch (e) {
        // keep old variants
      }
    }

    if (flavors) {
      try {
        product.flavors = typeof flavors === 'string' ? JSON.parse(flavors) : flavors;
      } catch (e) {
        product.flavors = flavors.split(',').map(s => s.trim());
      }
    }

    // Handle existing images passed back
    if (images) {
      product.images = Array.isArray(images) ? images : [images];
    }

    // Handle newly uploaded files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedUrl = await uploadToCloudinary(file.buffer, 'sweet_whisk/products');
        product.images.push(uploadedUrl);
      }
    }

    const updatedProduct = await product.save();
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product availability (Admin)
// @route   PATCH /api/products/:id/toggle-availability
export const toggleAvailability = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.json({ success: true, isAvailable: product.isAvailable, product });
  } catch (error) {
    next(error);
  }
};
