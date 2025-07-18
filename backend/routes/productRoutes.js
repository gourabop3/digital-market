import express from 'express';
const router = express.Router();

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Products endpoint working',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Single product endpoint working',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

export default router;