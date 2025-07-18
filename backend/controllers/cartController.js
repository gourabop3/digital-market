import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get cart items for user
// @route   GET /api/cart
// @access  Private
export const getCartItems = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images status');

    if (!cart) {
      return res.json({
        success: true,
        data: {
          items: [],
          totalAmount: 0,
          totalItems: 0
        }
      });
    }

    // Filter out inactive products
    cart.items = cart.items.filter(item => 
      item.product && item.product.status === 'active'
    );

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );

    await cart.save();

    res.json({
      success: true,
      data: {
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.items.reduce((total, item) => total + item.quantity, 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart items'
    });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists and is active
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );

    await cart.save();
    
    // Populate and return updated cart
    await cart.populate('items.product', 'name price images');

    res.json({
      success: true,
      message: 'Item added to cart',
      data: {
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.items.reduce((total, item) => total + item.quantity, 0)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error adding item to cart'
    });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );

    await cart.save();
    await cart.populate('items.product', 'name price images');

    res.json({
      success: true,
      message: 'Cart item updated',
      data: {
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.items.reduce((total, item) => total + item.quantity, 0)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating cart item'
    });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove item
    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );

    await cart.save();
    await cart.populate('items.product', 'name price images');

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: {
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.items.reduce((total, item) => total + item.quantity, 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart'
    });
  }
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      data: {
        items: [],
        totalAmount: 0,
        totalItems: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart'
    });
  }
});