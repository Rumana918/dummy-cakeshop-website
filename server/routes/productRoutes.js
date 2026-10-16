import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getBestSellers,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleAvailability
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/:id', getProductById);

// Admin Routes
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.patch('/:id/toggle-availability', protect, adminOnly, toggleAvailability);

export default router;
