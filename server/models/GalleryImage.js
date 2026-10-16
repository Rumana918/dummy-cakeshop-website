import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Weddings', 'Birthdays', 'Anniversaries', 'Cupcakes', 'Pastries', 'Custom Cakes'],
    default: 'Pastries'
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  description: {
    type: String,
    default: ''
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);
export default GalleryImage;
