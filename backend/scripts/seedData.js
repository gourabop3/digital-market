import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

// Load environment variables
dotenv.config();

// Sample data (passwords will be hashed during seeding)
const usersData = [
  {
    name: 'Admin User',
    email: process.env.ADMIN_EMAIL || 'admin@codedukan.com',
    password: process.env.ADMIN_PASSWORD || 'admin123456',
    role: 'admin',
    isVerified: true
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    isVerified: true
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    isVerified: true
  }
];

const products = [
  {
    name: 'Premium Web Development Course',
    description: 'Complete full-stack web development course with React, Node.js, and MongoDB.',
    price: 2999,
    category: 'Courses',
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500'
    ],
    tags: ['web development', 'react', 'nodejs', 'mongodb'],
    featured: true,
    status: 'active',
    downloadUrl: 'https://example.com/course-materials',
    fileSize: '2.5 GB',
    requirements: ['Basic HTML/CSS knowledge', 'JavaScript fundamentals'],
    features: [
      '50+ video lectures',
      'Source code included',
      'Certificate of completion',
      'Lifetime access'
    ]
  },
  {
    name: 'UI/UX Design Templates Pack',
    description: 'Professional UI/UX design templates for web and mobile applications.',
    price: 1499,
    category: 'Templates',
    images: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500',
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=500'
    ],
    tags: ['ui design', 'ux design', 'templates', 'figma'],
    featured: true,
    status: 'active',
    downloadUrl: 'https://example.com/ui-templates',
    fileSize: '500 MB',
    requirements: ['Figma or Sketch software'],
    features: [
      '20+ screen designs',
      'Figma source files',
      'Icon pack included',
      'Commercial license'
    ]
  },
  {
    name: 'Python Data Science Toolkit',
    description: 'Complete toolkit for data science with Python including libraries and datasets.',
    price: 1999,
    category: 'Tools',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500'
    ],
    tags: ['python', 'data science', 'machine learning', 'pandas'],
    featured: false,
    status: 'active',
    downloadUrl: 'https://example.com/python-toolkit',
    fileSize: '1.2 GB',
    requirements: ['Python 3.8+', 'Basic programming knowledge'],
    features: [
      'Pre-configured environment',
      'Sample datasets',
      'Jupyter notebooks',
      'Documentation included'
    ]
  },
  {
    name: 'Mobile App Icon Set',
    description: 'Collection of 500+ high-quality mobile app icons in multiple formats.',
    price: 799,
    category: 'Graphics',
    images: [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500',
      'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=500'
    ],
    tags: ['icons', 'mobile app', 'graphics', 'vector'],
    featured: false,
    status: 'active',
    downloadUrl: 'https://example.com/icon-set',
    fileSize: '100 MB',
    requirements: ['Vector graphics software'],
    features: [
      '500+ unique icons',
      'Multiple formats (SVG, PNG)',
      'Organized categories',
      'Lifetime updates'
    ]
  },
  {
    name: 'WordPress Theme Bundle',
    description: 'Premium WordPress themes for business, portfolio, and e-commerce websites.',
    price: 3499,
    category: 'Themes',
    images: [
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500',
      'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=500'
    ],
    tags: ['wordpress', 'themes', 'website', 'responsive'],
    featured: true,
    status: 'active',
    downloadUrl: 'https://example.com/wp-themes',
    fileSize: '800 MB',
    requirements: ['WordPress 5.0+', 'Basic WordPress knowledge'],
    features: [
      '10 premium themes',
      'Responsive design',
      'Page builder included',
      '1 year support'
    ]
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    console.log('Existing data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    // Hash passwords before creating users
    const users = await Promise.all(
      usersData.map(async (userData) => ({
        ...userData,
        password: await bcrypt.hash(userData.password, 10)
      }))
    );
    
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users seeded`);
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Seed products
const seedProducts = async () => {
  try {
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products seeded`);
    return createdProducts;
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Main seed function
const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await clearData();
    
    // Seed new data
    await seedUsers();
    await seedProducts();
    
    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Admin credentials:');
    console.log(`Email: ${process.env.ADMIN_EMAIL || 'admin@codedukan.com'}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123456'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seed if this script is executed directly
if (process.argv[1].endsWith('seedData.js')) {
  seedData();
}

export default seedData;