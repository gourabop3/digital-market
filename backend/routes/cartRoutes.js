import express from 'express';
const router = express.Router();

// GET /api/cart - Get cart items
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Cart endpoint working',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// POST /api/cart - Add to cart
router.post('/', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Add to cart endpoint working'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

export default router;