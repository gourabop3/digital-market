import express from 'express';
import {
  createRazorpayOrder,
  verifyPayment,
  handlePaymentFailure,
  getRazorpayKey,
  createRefund,
  handleWebhook
} from '../controllers/paymentController.js';
import {
  getUserOrders,
  getOrderById,
  downloadProduct,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Payment routes
router.get('/razorpay-key', getRazorpayKey);
router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyPayment);
router.post('/payment-failed', protect, handlePaymentFailure);
router.post('/webhook', handleWebhook);

// Order management routes
router.get('/my-orders', protect, getUserOrders);
router.get('/:orderId', protect, getOrderById);
router.get('/:orderId/download/:productId', protect, downloadProduct);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.put('/:orderId/status', protect, admin, updateOrderStatus);
router.post('/:orderId/refund', protect, admin, createRefund);

export default router;