import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price must be positive']
  },
  variants: [variantSchema],
  flavors: [{
    type: String,
    trim: true
  }],
  isEggless: {
    type: Boolean,
    default: false
  },
  ingredients: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    required: true,
    default: 20,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.9,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, basePrice: 1, rating: -1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
