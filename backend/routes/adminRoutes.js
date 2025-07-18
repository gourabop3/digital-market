import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  getDashboardStats,
  getSystemStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
} from '../controllers/adminController.js';

const router = express.Router();

// GET /api/admin/dashboard - Admin dashboard
router.get('/dashboard', protect, admin, getDashboardStats);

// GET /api/admin/stats - System stats
router.get('/stats', protect, admin, getSystemStats);

// GET /api/admin/users - Get all users
router.get('/users', protect, admin, getAllUsers);

// GET /api/admin/users/:id - Get user by ID
router.get('/users/:id', protect, admin, getUserById);

// PUT /api/admin/users/:id/role - Update user role
router.put('/users/:id/role', protect, admin, updateUserRole);

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', protect, admin, deleteUser);

export default router;