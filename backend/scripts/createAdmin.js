import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codedukan');
    console.log('✅ Connected to MongoDB');

    const email = 'admin@codedukan.com';
    const password = 'admin123456';

    // Check if admin already exists
    let admin = await User.findOne({ email });
    
    if (admin) {
      console.log('⚠️  Admin user already exists, updating...');
      // Update existing admin
      const hashedPassword = await bcrypt.hash(password, 12);
      admin.password = hashedPassword;
      admin.role = 'admin';
      admin.isVerified = true;
      admin.name = 'Admin User';
      await admin.save();
      console.log('✅ Admin user updated successfully!');
    } else {
      console.log('📝 Creating new admin user...');
      // Create new admin
      const hashedPassword = await bcrypt.hash(password, 12);
      
      admin = await User.create({
        name: 'Admin User',
        email: email,
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        isActive: true
      });
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n🎯 Admin Login Credentials:');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Role:', admin.role);
    console.log('✅ Verified:', admin.isVerified);
    console.log('\n🚀 You can now login to admin panel at /admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();