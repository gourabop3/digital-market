import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// GET /api/products - Get all products
router.get('/', getAllProducts);

// GET /api/products/:id - Get single product
router.get('/:id', getProductById);

// POST /api/products - Create product (admin only)
router.post('/', protect, admin, createProduct);

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', protect, admin, updateProduct);

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', protect, admin, deleteProduct);

export default router;