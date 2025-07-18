import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/orders/create-razorpay-order
// @access  Private
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { items, billingAddress } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No items provided');
  }

  // Validate and calculate total amount
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }

    if (!product.isActive) {
      res.status(400);
      throw new Error(`Product is not available: ${product.title}`);
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for: ${product.title}`);
    }

    const itemTotal = product.salePrice * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      product: product._id,
      title: product.title,
      price: product.salePrice,
      quantity: item.quantity
    });
  }

  // Create order in database
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    billingAddress,
    status: 'pending',
    paymentStatus: 'pending'
  });

  // Create Razorpay order
  const razorpayOrderOptions = {
    amount: Math.round(totalAmount * 100), // Convert to paise
    currency: 'INR',
    receipt: order.orderNumber,
    notes: {
      orderId: order._id.toString(),
      userId: req.user._id.toString()
    }
  };

  try {
    const razorpayOrder = await razorpay.orders.create(razorpayOrderOptions);
    
    // Update order with Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          currency: order.currency
        },
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key: process.env.RAZORPAY_KEY_ID
        }
      }
    });

  } catch (error) {
    // Delete the order if Razorpay order creation fails
    await Order.findByIdAndDelete(order._id);
    
    res.status(500);
    throw new Error('Failed to create payment order: ' + error.message);
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify-payment
// @access  Private
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
    res.status(400);
    throw new Error('Missing payment verification data');
  }

  // Find the order
  const order = await Order.findById(orderId).populate('items.product');
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to verify this payment');
  }

  // Verify signature
  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest('hex');

  if (razorpay_signature !== expectedSign) {
    // Mark order as failed
    await order.markAsFailed('Payment signature verification failed');
    
    res.status(400);
    throw new Error('Invalid payment signature');
  }

  try {
    // Verify payment with Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    if (payment.status === 'captured') {
      // Mark order as paid
      await order.markAsPaid({
        razorpay_payment_id,
        razorpay_signature
      });

      // Update product download counts and reduce stock
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.downloads += item.quantity;
          product.stock = Math.max(0, product.stock - item.quantity);
          await product.save();
        }
      }

      // Clear user's cart
      const cart = await Cart.findOne({ user: req.user._id });
      if (cart) {
        await cart.clearCart();
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          order: {
            _id: order._id,
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            totalAmount: order.totalAmount
          }
        }
      });

    } else {
      await order.markAsFailed(`Payment status: ${payment.status}`);
      
      res.status(400);
      throw new Error('Payment not captured');
    }

  } catch (error) {
    await order.markAsFailed('Payment verification failed');
    
    res.status(500);
    throw new Error('Payment verification failed: ' + error.message);
  }
});

// @desc    Handle payment failure
// @route   POST /api/orders/payment-failed
// @access  Private
export const handlePaymentFailure = asyncHandler(async (req, res) => {
  const { orderId, reason } = req.body;

  if (!orderId) {
    res.status(400);
    throw new Error('Order ID is required');
  }

  const order = await Order.findById(orderId);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  await order.markAsFailed(reason || 'Payment failed');

  res.json({
    success: true,
    message: 'Payment failure recorded',
    data: {
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus
      }
    }
  });
});

// @desc    Get Razorpay key
// @route   GET /api/orders/razorpay-key
// @access  Public
export const getRazorpayKey = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      key: process.env.RAZORPAY_KEY_ID
    }
  });
});

// @desc    Create refund
// @route   POST /api/orders/:orderId/refund
// @access  Private (Admin)
export const createRefund = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { amount, reason } = req.body;

  const order = await Order.findById(orderId);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.paymentStatus !== 'paid') {
    res.status(400);
    throw new Error('Cannot refund unpaid order');
  }

  if (!order.razorpayPaymentId) {
    res.status(400);
    throw new Error('No payment ID found for refund');
  }

  const refundAmount = amount || order.totalAmount;

  try {
    const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
      amount: Math.round(refundAmount * 100), // Convert to paise
      notes: {
        reason: reason || 'Refund requested',
        orderId: order._id.toString()
      }
    });

    // Update order
    order.refundId = refund.id;
    await order.initiateRefund(refundAmount, reason);

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      data: {
        refund: {
          id: refund.id,
          amount: refundAmount,
          status: refund.status
        },
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          refundAmount: order.refundAmount
        }
      }
    });

  } catch (error) {
    res.status(500);
    throw new Error('Refund failed: ' + error.message);
  }
});

// @desc    Webhook handler for Razorpay events
// @route   POST /api/orders/webhook
// @access  Public (but secured with webhook secret)
export const handleWebhook = asyncHandler(async (req, res) => {
  const webhookSignature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSignature || !webhookSecret) {
    res.status(400);
    throw new Error('Invalid webhook request');
  }

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (webhookSignature !== expectedSignature) {
    res.status(400);
    throw new Error('Invalid webhook signature');
  }

  const { event, payload } = req.body;

  try {
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;
      case 'refund.processed':
        await handleRefundProcessed(payload.refund.entity);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper functions for webhook events
const handlePaymentCaptured = async (payment) => {
  const order = await Order.findOne({ razorpayOrderId: payment.order_id });
  if (order && order.paymentStatus === 'pending') {
    await order.markAsPaid({
      razorpay_payment_id: payment.id
    });
  }
};

const handlePaymentFailed = async (payment) => {
  const order = await Order.findOne({ razorpayOrderId: payment.order_id });
  if (order && order.paymentStatus === 'pending') {
    await order.markAsFailed('Payment failed via webhook');
  }
};

const handleRefundProcessed = async (refund) => {
  const order = await Order.findOne({ refundId: refund.id });
  if (order) {
    order.status = 'refunded';
    order.paymentStatus = 'refunded';
    await order.save();
  }
};