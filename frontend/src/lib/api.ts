import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Auth token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Initialize token from localStorage
const storedToken = localStorage.getItem('token');
if (storedToken) {
  setAuthToken(storedToken);
}

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      setAuthToken(null);
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  avatar?: string;
  isVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  images: Array<{
    url: string;
    publicId?: string;
    alt?: string;
  }>;
  downloadFiles?: Array<{
    name: string;
    url: string;
    size: string;
    type: string;
  }>;
  demoUrl?: string;
  features?: string[];
  requirements?: string[];
  tags?: string[];
  isOnSale: boolean;
  isFeatured: boolean;
  isActive: boolean;
  stock: number;
  downloads: number;
  rating: number;
  numReviews: number;
  reviews?: Array<{
    user: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  updatedAt: Date;
}

export interface Order {
  _id: string;
  user: string;
  orderNumber: string;
  items: Array<{
    product: Product;
    title: string;
    price: number;
    quantity: number;
    downloadUrl?: string;
    downloadCount: number;
    maxDownloads: number;
  }>;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  billingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Auth API
export const authAPI = {
  // Register
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get profile
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<ApiResponse> => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
};

// Products API
export const productsAPI = {
  // Get all products
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    featured?: boolean;
  }): Promise<ApiResponse<{ products: Product[]; pagination: any }>> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get product by ID
  getProduct: async (id: string): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get categories
  getCategories: async (): Promise<ApiResponse<{ categories: Array<{ name: string; count: number }> }>> => {
    const response = await api.get('/products/categories');
    return response.data;
  },
};

// Cart API
export const cartAPI = {
  // Get cart
  getCart: async (): Promise<ApiResponse<{ cart: Cart }>> => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add to cart
  addToCart: async (productId: string, quantity: number = 1): Promise<ApiResponse<{ cart: Cart }>> => {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },

  // Update cart item
  updateCartItem: async (productId: string, quantity: number): Promise<ApiResponse<{ cart: Cart }>> => {
    const response = await api.put(`/cart/item/${productId}`, { quantity });
    return response.data;
  },

  // Remove from cart
  removeFromCart: async (productId: string): Promise<ApiResponse<{ cart: Cart }>> => {
    const response = await api.delete(`/cart/item/${productId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async (): Promise<ApiResponse> => {
    const response = await api.delete('/cart');
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  // Get Razorpay key
  getRazorpayKey: async (): Promise<ApiResponse<{ key: string }>> => {
    const response = await api.get('/orders/razorpay-key');
    return response.data;
  },

  // Create Razorpay order
  createRazorpayOrder: async (orderData: {
    items: Array<{ product: string; quantity: number }>;
    billingAddress: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  }): Promise<ApiResponse<{
    order: Order;
    razorpayOrder: {
      id: string;
      amount: number;
      currency: string;
      key: string;
    };
  }>> => {
    const response = await api.post('/orders/create-razorpay-order', orderData);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;
  }): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.post('/orders/verify-payment', paymentData);
    return response.data;
  },

  // Handle payment failure
  handlePaymentFailure: async (orderId: string, reason?: string): Promise<ApiResponse> => {
    const response = await api.post('/orders/payment-failed', { orderId, reason });
    return response.data;
  },

  // Get user orders
  getUserOrders: async (page: number = 1, limit: number = 10): Promise<ApiResponse<{ orders: Order[]; pagination: any }>> => {
    const response = await api.get(`/orders/my-orders?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get order by ID
  getOrder: async (orderId: string): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Download product
  downloadProduct: async (orderId: string, productId: string): Promise<Blob> => {
    const response = await api.get(`/orders/${orderId}/download/${productId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;