import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// Protect routes - verify JWT token
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized - user not found');
      }

      if (!req.user.isActive) {
        res.status(401);
        throw new Error('Account is deactivated');
      }

      // Update last login
      req.user.lastLogin = new Date();
      await req.user.save();
      
      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401);
      throw new Error('Not authorized - invalid token');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized - no token provided');
  }
});

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};

// Optional auth - doesn't throw error if no token
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Silent fail for optional auth
      req.user = null;
    }
  }

  next();
});

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};