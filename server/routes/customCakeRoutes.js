import express from 'express';
import {
  createCustomRequest,
  getMyCustomRequests,
  getAllCustomRequests,
  updateCustomRequest
} from '../controllers/customCakeController.js';
import { protect, adminOnly, optionalAuth } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, upload.array('referenceImages', 4), createCustomRequest);
router.get('/my', protect, getMyCustomRequests);

// Admin
router.get('/', protect, adminOnly, getAllCustomRequests);
router.put('/:id', protect, adminOnly, updateCustomRequest);

export default router;
