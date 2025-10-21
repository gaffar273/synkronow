import express from 'express';
import {
  getAllUsers,
  getUserById,
  getUsersByAccessCode,
  updateUser,
  deleteUser,
  updateUserAccessCode,
  getUserStats,
  updateUserPassword
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only routes
router.get('/', protect, adminOnly, getAllUsers);
router.get('/stats', protect, adminOnly, getUserStats);
router.get('/access-code/:accessCode', protect, adminOnly, getUsersByAccessCode);
router.delete('/:id', protect, adminOnly, deleteUser);
router.patch('/:id/access-code', protect, adminOnly, updateUserAccessCode);

// Protected routes
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.put('/:id/password', protect, updateUserPassword);

export default router;
