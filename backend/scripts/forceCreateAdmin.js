import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

async function forceCreateAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codedukan');
    console.log('✅ Connected to MongoDB');

    const email = 'admin@codedukan.com';
    const password = 'admin123456';

    // Delete existing admin if any
    await User.deleteOne({ email });
    console.log('🗑️  Deleted any existing admin user');

    // Create password hash with explicit salt rounds
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('🔒 Password hashed with', saltRounds, 'rounds');

    // Create new admin user
    const admin = await User.create({
      name: 'Admin User',
      email: email,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Role:', admin.role);
    console.log('✅ Verified:', admin.isVerified);
    console.log('🟢 Active:', admin.isActive);

    // Test password comparison
    const passwordMatch = await bcrypt.compare(password, admin.password);
    console.log('🧪 Password test:', passwordMatch ? 'PASS' : 'FAIL');

    if (!passwordMatch) {
      console.error('❌ Password test failed! This indicates a hashing issue.');
    }

    // Test login simulation
    console.log('\n🔍 Testing login simulation...');
    const testUser = await User.findOne({ email }).select('+password');
    if (testUser) {
      const loginTest = await testUser.comparePassword(password);
      console.log('🧪 Login simulation:', loginTest ? 'PASS' : 'FAIL');
      
      if (loginTest) {
        console.log('🎉 Admin user is ready for login!');
      } else {
        console.error('❌ Login simulation failed!');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

forceCreateAdmin();