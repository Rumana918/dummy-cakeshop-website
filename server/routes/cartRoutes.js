import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  syncCart
} from '../controllers/cartController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getCart);
router.post('/', optionalAuth, addToCart);
router.put('/:itemId', optionalAuth, updateCartItem);
router.delete('/:itemId', optionalAuth, removeCartItem);
router.delete('/', optionalAuth, clearCart);
router.post('/sync', protect, syncCart);

export default router;
