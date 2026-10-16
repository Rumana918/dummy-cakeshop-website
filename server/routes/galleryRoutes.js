import express from 'express';
import {
  getGallery,
  createGalleryImage,
  deleteGalleryImage
} from '../controllers/galleryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getGallery);
router.post('/', protect, adminOnly, upload.single('image'), createGalleryImage);
router.delete('/:id', protect, adminOnly, deleteGalleryImage);

export default router;
