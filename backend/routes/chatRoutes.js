import express from 'express';
import { getTaskChats, createChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:taskId', protect, getTaskChats);
router.post('/', protect, createChat);

export default router;
