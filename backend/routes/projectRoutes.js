import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create project (Admin only)
router.post('/', protect, adminOnly, createProject);

// Get all projects (Admin only - will only see their own)
router.get('/', protect, adminOnly, getAllProjects);

// Get project by ID (Admin only - will only see if they own it)
router.get('/:id', protect, adminOnly, getProjectById);

// Update project (Admin only - will only update if they own it)
router.put('/:id', protect, adminOnly, updateProject);

// Delete project (Admin only - will only delete if they own it)
router.delete('/:id', protect, adminOnly, deleteProject);

export default router;
