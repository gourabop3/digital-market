import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import { generateToken } from '../middleware/auth.js';
import { sendEmail } from '../utils/email.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(error => error.msg).join(', '));
  }

  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findByEmail(email);
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    verificationToken,
    isVerified: process.env.NODE_ENV === 'development' // Auto-verify in dev
  });

  if (user) {
    // Create empty cart for user
    await Cart.create({ user: user._id });

    // Send verification email (in production)
    if (process.env.NODE_ENV === 'production') {
      try {
        const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
        await sendEmail({
          to: user.email,
          subject: 'Welcome to CodeDukan - Verify Your Email',
          template: 'welcome',
          data: {
            name: user.name,
            verifyUrl
          }
        });
      } catch (error) {
        console.error('Email sending failed:', error);
        // Don't fail registration if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        },
        token: generateToken(user._id)
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(error => error.msg).join(', '));
  }

  const { email, password } = req.body;

  // Find user by email and include password for comparison
  const user = await User.findByEmail(email).select('+password');

  if (user && (await user.comparePassword(password))) {
    // Check if account is active
    if (!user.isActive) {
      res.status(401);
      throw new Error('Account is deactivated. Please contact support.');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          avatar: user.avatar,
          lastLogin: user.lastLogin
        },
        token: generateToken(user._id)
      }
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          avatar: user.avatar,
          isVerified: user.isVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(error => error.msg).join(', '));
  }

  const user = await User.findById(req.user._id);

  if (user) {
    // Check if email is being changed and if it's already taken
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findByEmail(req.body.email);
      if (emailExists) {
        res.status(400);
        throw new Error('Email already in use');
      }
      user.isVerified = false; // Require re-verification for email change
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.avatar = req.body.avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          address: updatedUser.address,
          avatar: updatedUser.avatar,
          isVerified: updatedUser.isVerified
        }
      }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(error => error.msg).join(', '));
  }

  const { email } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    res.status(404);
    throw new Error('User not found with this email');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  // Send reset email
  try {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - CodeDukan',
      template: 'passwordReset',
      data: {
        name: user.name,
        resetUrl
      }
    });

    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(error => error.msg).join(', '));
  }

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful',
    data: {
      token: generateToken(user._id)
    }
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    res.status(400);
    throw new Error('Invalid verification token');
  }

  user.isVerified = true;
  user.verificationToken = undefined;

  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401);
    throw new Error('Refresh token required');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error('Invalid refresh token');
    }

    res.json({
      success: true,
      data: {
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(401);
    throw new Error('Invalid refresh token');
  }
});