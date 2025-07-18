import express from 'express';
const router = express.Router();

// GET /api/admin/dashboard - Admin dashboard
router.get('/dashboard', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Admin dashboard endpoint working',
      data: {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// GET /api/admin/users - Get all users
router.get('/users', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Admin users endpoint working',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

export default router;