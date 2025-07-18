import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: [500, 'Review comment cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [200, 'Product title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      'Payment Gateway',
      'Color Prediction',
      'Gaming Scripts',
      'Source Code',
      'Vue.js',
      'React.js',
      'Node.js',
      'PHP Scripts',
      'Mobile Apps',
      'Web Applications',
      'Other'
    ]
  },
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Price cannot be negative']
  },
  salePrice: {
    type: Number,
    required: [true, 'Sale price is required'],
    min: [0, 'Price cannot be negative']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    alt: String
  }],
  downloadFiles: [{
    name: String,
    url: String,
    size: String,
    type: String
  }],
  demoUrl: {
    type: String,
    match: [/^https?:\/\/.+/, 'Demo URL must be valid']
  },
  features: [String],
  requirements: [String],
  tags: [String],
  isOnSale: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 999,
    min: [0, 'Stock cannot be negative']
  },
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String]
}, {
  timestamps: true
});

// Indexes for performance
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ rating: -1 });
productSchema.index({ salePrice: 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice > this.salePrice) {
    return Math.round(((this.originalPrice - this.salePrice) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  return this.images && this.images.length > 0 ? this.images[0].url : null;
});

// Update rating when reviews change
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.numReviews = this.reviews.length;
  }
};

// Pre-save middleware to update rating
productSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.updateRating();
  }
  next();
});

// Static method to get featured products
productSchema.statics.getFeatured = function(limit = 10) {
  return this.find({ isFeatured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('createdBy', 'name');
};

// Static method to get products by category
productSchema.statics.getByCategory = function(category, limit = 20) {
  return this.find({ category, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('createdBy', 'name');
};

// Instance method to check if user can download
productSchema.methods.canUserDownload = function(userId) {
  // This would be used with order verification
  return true; // Placeholder - implement with order checking
};

export default mongoose.model('Product', productSchema);