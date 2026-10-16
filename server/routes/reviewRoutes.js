import express from 'express';
import {
  addReview,
  getAllReviews,
  toggleApproveReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/product/:id', protect, addReview);

// Admin Routes
router.get('/', protect, adminOnly, getAllReviews);
router.patch('/:id/approve', protect, adminOnly, toggleApproveReview);
router.delete('/:id', protect, adminOnly, deleteReview);

export default router;
