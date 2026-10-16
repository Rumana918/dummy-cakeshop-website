import express from 'express';
import {
  submitContact,
  getMessages,
  markAsRead,
  deleteMessage
} from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContact);

// Admin Routes
router.get('/', protect, adminOnly, getMessages);
router.patch('/:id/read', protect, adminOnly, markAsRead);
router.delete('/:id', protect, adminOnly, deleteMessage);

export default router;
