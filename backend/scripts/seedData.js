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

// Note: Products are now seeded using the dedicated seedProducts.js script
// Run: node scripts/seedProducts.js to add all CodeDukan products
const products = [];

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