import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  downloadUrl: String,
  downloadCount: {
    type: Number,
    default: 0
  },
  maxDownloads: {
    type: Number,
    default: 5
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'upi', 'netbanking', 'card', 'wallet'],
    default: 'razorpay'
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  billingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  invoice: {
    number: String,
    url: String,
    generatedAt: Date
  },
  notes: String,
  refundId: String,
  refundAmount: Number,
  refundReason: String,
  completedAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

// Index for performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ razorpayOrderId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `CD${timestamp.slice(-6)}${random}`;
  }
  next();
});

// Instance method to mark as paid
orderSchema.methods.markAsPaid = function(paymentDetails) {
  this.paymentStatus = 'paid';
  this.status = 'completed';
  this.completedAt = new Date();
  
  if (paymentDetails) {
    this.razorpayPaymentId = paymentDetails.razorpay_payment_id;
    this.razorpaySignature = paymentDetails.razorpay_signature;
  }
  
  return this.save();
};

// Instance method to mark as failed
orderSchema.methods.markAsFailed = function(reason) {
  this.paymentStatus = 'failed';
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.notes = reason || 'Payment failed';
  
  return this.save();
};

// Instance method to initiate refund
orderSchema.methods.initiateRefund = function(amount, reason) {
  this.paymentStatus = 'refunded';
  this.status = 'refunded';
  this.refundAmount = amount || this.totalAmount;
  this.refundReason = reason;
  
  return this.save();
};

// Static method to get user orders
orderSchema.statics.getUserOrders = function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return this.find({ user: userId })
    .populate('items.product', 'title images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get order by number
orderSchema.statics.getByOrderNumber = function(orderNumber) {
  return this.findOne({ orderNumber })
    .populate('user', 'name email')
    .populate('items.product', 'title images downloadFiles');
};

// Virtual for formatted order number
orderSchema.virtual('formattedOrderNumber').get(function() {
  return `#${this.orderNumber}`;
});

// Virtual for order total in formatted currency
orderSchema.virtual('formattedTotal').get(function() {
  return `₹${this.totalAmount.toLocaleString('en-IN')}`;
});

export default mongoose.model('Order', orderSchema);