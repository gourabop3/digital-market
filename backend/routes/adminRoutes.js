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

// TEMPORARY: Seed or update admin user (REMOVE AFTER USE)
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

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

// TEMPORARY: Seed or update admin user (REMOVE AFTER USE)
router.post('/seed-admin', async (req, res) => {
  // Change this to something only you know
  const SECRET_KEY = 'codedukan_seed_secret';
  if (req.query.key !== SECRET_KEY) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const email = 'admin@codedukan.com';
    const password = 'admin123456';
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.findOne({ email });
    if (user) {
      user.password = hashedPassword;
      user.role = 'admin';
      user.isEmailVerified = true;
      await user.save();
    } else {
      user = await User.create({
        name: 'Admin User',
        email,
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true
      });
    }
    res.json({ success: true, message: 'Admin user seeded/updated', email });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;