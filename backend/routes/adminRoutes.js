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
import seedProducts from '../scripts/seedProducts.js';

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
    // DON'T hash the password manually - let the User model do it
    let user = await User.findOne({ email });
    if (user) {
      user.password = password; // Raw password - will be hashed by pre-save middleware
      user.role = 'admin';
      user.isVerified = true;
      user.isActive = true;
      user.name = 'Admin User';
      await user.save();
    } else {
      user = await User.create({
        name: 'Admin User',
        email,
        password: password, // Raw password - will be hashed by pre-save middleware
        role: 'admin',
        isVerified: true,
        isActive: true
      });
    }
    res.json({ 
      success: true, 
      message: 'Admin user created/updated successfully', 
      email,
      credentials: {
        email: 'admin@codedukan.com',
        password: 'admin123456'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// TEMPORARY: Seed CodeDukan products
router.post('/seed-products', async (req, res) => {
  const SECRET_KEY = 'codedukan_seed_secret';
  if (req.query.key !== SECRET_KEY) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const products = await seedProducts(false); // Don't exit process
    res.json({ success: true, message: 'CodeDukan products seeded successfully', count: products.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// TEMPORARY: Seed CodeDukan products
router.post('/seed-products', async (req, res) => {
  const SECRET_KEY = 'codedukan_seed_secret';
  if (req.query.key !== SECRET_KEY) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const products = await seedProducts(false); // Don't exit process
    res.json({ success: true, message: 'CodeDukan products seeded successfully', count: products.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;