import express from 'express';
import {
  createTask,
  getAllTasks,
  getTasksByProject,
  getMyTasks,
  getTaskById,
  getTaskByCode,
  updateTask,
  deleteTask,
  requestTaskAccess,
  getAllTaskRequests,
  respondToTaskRequest,
  getAdminStats
} from '../controllers/taskController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/stats', protect, adminOnly, getAdminStats);
router.post('/', protect, adminOnly, createTask);
router.get('/all', protect, adminOnly, getAllTasks);
router.get('/project/:projectId', protect, adminOnly, getTasksByProject);
router.get('/requests', protect, adminOnly, getAllTaskRequests);
router.put('/requests/:requestId', protect, adminOnly, respondToTaskRequest);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, adminOnly, deleteTask);

// User routes
router.get('/my-tasks', protect, getMyTasks);
router.post('/request', protect, requestTaskAccess);

// Shared routes
router.get('/code/:code', protect, getTaskByCode);
router.get('/:id', protect, getTaskById);

export default router;
