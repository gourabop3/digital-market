import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

// CodeDukan Products Data
const codedukanProducts = [
  // Payment Gateway Products
  {
    title: "Razorpay Payment Gateway Integration Script",
    description: "Complete Razorpay payment gateway integration with Node.js, React, and PHP. Includes webhook handling, payment verification, refund functionality, and comprehensive dashboard. Perfect for e-commerce websites and subscription-based applications.",
    shortDescription: "Complete Razorpay integration script with dashboard and webhook handling",
    category: "Payment Gateway",
    originalPrice: 4999,
    salePrice: 2999,
    images: [
      { url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600", alt: "Payment Gateway" },
      { url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600", alt: "Dashboard" }
    ],
    demoUrl: "https://demo.codedukan.com/razorpay-demo",
    features: [
      "Complete Razorpay integration",
      "Payment verification system",
      "Webhook handling",
      "Refund functionality",
      "Admin dashboard",
      "Multi-currency support",
      "Mobile responsive",
      "Full source code"
    ],
    requirements: [
      "Node.js 14+",
      "React 16+",
      "MongoDB or MySQL",
      "Razorpay account",
      "Basic JavaScript knowledge"
    ],
    tags: ["razorpay", "payment gateway", "nodejs", "react", "php"],
    isFeatured: true,
    downloadFiles: [
      { name: "Frontend React App", url: "/downloads/razorpay-frontend.zip", size: "45 MB", type: "zip" },
      { name: "Backend Node.js API", url: "/downloads/razorpay-backend.zip", size: "25 MB", type: "zip" },
      { name: "PHP Version", url: "/downloads/razorpay-php.zip", size: "15 MB", type: "zip" },
      { name: "Documentation", url: "/downloads/razorpay-docs.pdf", size: "5 MB", type: "pdf" }
    ]
  },
  {
    title: "Stripe Payment Integration Complete Package",
    description: "Advanced Stripe payment integration with subscription management, invoice generation, customer portal, and comprehensive analytics. Includes both one-time payments and recurring billing solutions.",
    shortDescription: "Advanced Stripe integration with subscription management",
    category: "Payment Gateway",
    originalPrice: 5999,
    salePrice: 3499,
    images: [
      { url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600", alt: "Stripe Integration" },
      { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", alt: "Analytics Dashboard" }
    ],
    demoUrl: "https://demo.codedukan.com/stripe-demo",
    features: [
      "Stripe Elements integration",
      "Subscription management",
      "Customer portal",
      "Invoice generation",
      "Payment analytics",
      "Webhook security",
      "Multi-payment methods",
      "Tax calculation"
    ],
    requirements: [
      "Node.js 16+",
      "Next.js or React",
      "Stripe account",
      "PostgreSQL/MongoDB",
      "Modern browser"
    ],
    tags: ["stripe", "payment", "subscription", "nextjs", "nodejs"],
    isFeatured: true
  },

  // Color Prediction Games
  {
    title: "Color Prediction Game - Complete Source Code",
    description: "Full-featured color prediction game with real money betting, wallet system, referral program, admin panel, and payment gateway integration. Includes mobile app and web version with live results.",
    shortDescription: "Complete color prediction game with betting and wallet system",
    category: "Color Prediction",
    originalPrice: 12999,
    salePrice: 7999,
    images: [
      { url: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=600", alt: "Color Game" },
      { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", alt: "Game Interface" }
    ],
    demoUrl: "https://demo.codedukan.com/color-prediction",
    features: [
      "Real money betting system",
      "Multi-color prediction",
      "Wallet & withdrawal system",
      "Referral program",
      "Live game results",
      "Admin control panel",
      "Payment gateway integration",
      "Mobile responsive design",
      "User dashboard",
      "Transaction history"
    ],
    requirements: [
      "PHP 7.4+",
      "MySQL 5.7+",
      "Apache/Nginx",
      "SSL certificate",
      "Payment gateway account"
    ],
    tags: ["color prediction", "betting game", "php", "gambling", "wallet system"],
    isFeatured: true
  },
  {
    title: "Win Go Color Game - Advanced Version",
    description: "Professional Win Go style color prediction game with multiple game periods, advanced betting options, commission system, and comprehensive admin panel. Includes both web and mobile app versions.",
    shortDescription: "Advanced Win Go color game with multiple periods and betting options",
    category: "Color Prediction",
    originalPrice: 15999,
    salePrice: 9999,
    images: [
      { url: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=600", alt: "Win Go Game" },
      { url: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=600", alt: "Mobile App" }
    ],
    demoUrl: "https://demo.codedukan.com/wingo-demo",
    features: [
      "Multiple game periods (1min, 3min, 5min)",
      "Advanced betting system",
      "Auto-result generation",
      "Commission structure",
      "Agent/Distributor system",
      "Real-time notifications",
      "Secure wallet system",
      "Multi-language support",
      "Mobile app (Android)",
      "Complete admin panel"
    ],
    requirements: [
      "PHP 8.0+",
      "Laravel Framework",
      "MySQL 8.0+",
      "Redis for caching",
      "Flutter for mobile app"
    ],
    tags: ["wingo", "color prediction", "laravel", "flutter", "betting"],
    isFeatured: true
  },

  // Gaming Scripts
  {
    title: "Online Casino Script - Multi-Game Platform",
    description: "Complete online casino platform with multiple games including slots, poker, blackjack, roulette, and color prediction. Features user management, payment integration, and comprehensive admin controls.",
    shortDescription: "Multi-game casino platform with slots, poker, and card games",
    category: "Gaming Scripts",
    originalPrice: 25999,
    salePrice: 15999,
    images: [
      { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600", alt: "Casino Games" },
      { url: "https://images.unsplash.com/photo-1596838132731-3301c3317?w=600", alt: "Game Lobby" }
    ],
    demoUrl: "https://demo.codedukan.com/casino-demo",
    features: [
      "Multiple casino games",
      "Slot machine games",
      "Card games (Poker, Blackjack)",
      "Roulette wheel",
      "Live dealer support",
      "User wallet system",
      "Bonus & promotions",
      "VIP system",
      "Multi-currency support",
      "Mobile responsive"
    ],
    requirements: [
      "PHP 8.0+",
      "Node.js for real-time features",
      "MySQL/PostgreSQL",
      "WebSocket support",
      "SSL certificate"
    ],
    tags: ["casino", "gaming", "slots", "poker", "gambling"],
    isFeatured: true
  },
  {
    title: "Ludo King Clone - Multiplayer Game",
    description: "Complete Ludo game clone with multiplayer functionality, tournaments, coins system, and social features. Includes both web and mobile app versions with real-time gameplay.",
    shortDescription: "Multiplayer Ludo game with tournaments and coin system",
    category: "Gaming Scripts",
    originalPrice: 8999,
    salePrice: 5499,
    images: [
      { url: "https://images.unsplash.com/photo-1606503153255-59d8b8b13607?w=600", alt: "Ludo Game" },
      { url: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600", alt: "Multiplayer" }
    ],
    demoUrl: "https://demo.codedukan.com/ludo-demo",
    features: [
      "4-player multiplayer",
      "Real-time gameplay",
      "Tournament system",
      "Coins & rewards",
      "Friend system",
      "Chat functionality",
      "Leaderboards",
      "Daily challenges",
      "Mobile app included",
      "Offline mode"
    ],
    requirements: [
      "Node.js with Socket.IO",
      "React/React Native",
      "MongoDB",
      "Real-time server",
      "Mobile development tools"
    ],
    tags: ["ludo", "multiplayer", "game", "nodejs", "react native"],
    isFeatured: false
  },

  // React.js Applications
  {
    title: "React E-commerce Dashboard Template",
    description: "Modern and responsive React.js admin dashboard template specifically designed for e-commerce businesses. Features advanced charts, inventory management, order tracking, and customer analytics.",
    shortDescription: "Modern React admin dashboard for e-commerce with analytics",
    category: "React.js",
    originalPrice: 3999,
    salePrice: 2499,
    images: [
      { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", alt: "Dashboard" },
      { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600", alt: "Analytics" }
    ],
    demoUrl: "https://demo.codedukan.com/react-dashboard",
    features: [
      "Modern React 18",
      "TypeScript support",
      "Responsive design",
      "Chart.js integration",
      "Data tables",
      "Dark/Light mode",
      "Multi-language",
      "Export functionality",
      "Real-time updates",
      "Mobile optimized"
    ],
    requirements: [
      "Node.js 16+",
      "React 18+",
      "TypeScript",
      "Modern browser",
      "Basic React knowledge"
    ],
    tags: ["react", "dashboard", "ecommerce", "typescript", "admin panel"],
    isFeatured: false
  },
  {
    title: "React Social Media App - Complete Source",
    description: "Full-featured social media application built with React.js and Node.js. Includes posts, stories, messaging, video calls, and advanced social features with real-time updates.",
    shortDescription: "Complete social media app with React, messaging, and video calls",
    category: "React.js",
    originalPrice: 9999,
    salePrice: 6499,
    images: [
      { url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600", alt: "Social App" },
      { url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600", alt: "Chat Interface" }
    ],
    demoUrl: "https://demo.codedukan.com/social-app",
    features: [
      "User authentication",
      "Post creation & sharing",
      "Stories feature",
      "Real-time messaging",
      "Video/Audio calls",
      "Friend system",
      "News feed algorithm",
      "Media upload",
      "Notifications",
      "Mobile responsive"
    ],
    requirements: [
      "React 18+",
      "Node.js with Express",
      "Socket.IO",
      "MongoDB",
      "WebRTC for calls"
    ],
    tags: ["react", "social media", "nodejs", "realtime", "webrtc"],
    isFeatured: false
  },

  // Node.js Applications
  {
    title: "Node.js REST API Boilerplate - Production Ready",
    description: "Complete Node.js REST API boilerplate with authentication, authorization, validation, logging, testing, and deployment configurations. Includes Docker setup and CI/CD pipeline.",
    shortDescription: "Production-ready Node.js API boilerplate with authentication",
    category: "Node.js",
    originalPrice: 2999,
    salePrice: 1499,
    images: [
      { url: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600", alt: "API Development" },
      { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", alt: "Code Structure" }
    ],
    features: [
      "Express.js framework",
      "JWT authentication",
      "Role-based authorization",
      "Input validation",
      "Error handling",
      "Logging system",
      "Testing setup",
      "Docker configuration",
      "API documentation",
      "Rate limiting"
    ],
    requirements: [
      "Node.js 16+",
      "MongoDB/PostgreSQL",
      "Redis (optional)",
      "Docker (optional)",
      "Basic Node.js knowledge"
    ],
    tags: ["nodejs", "express", "api", "jwt", "boilerplate"],
    isFeatured: false
  },
  {
    title: "Node.js Microservices Architecture",
    description: "Complete microservices architecture implementation with Node.js, Docker, Kubernetes, API Gateway, service discovery, and monitoring. Perfect for scalable enterprise applications.",
    shortDescription: "Enterprise microservices architecture with Node.js and Docker",
    category: "Node.js",
    originalPrice: 12999,
    salePrice: 8999,
    images: [
      { url: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600", alt: "Microservices" },
      { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600", alt: "Architecture" }
    ],
    features: [
      "Microservices pattern",
      "API Gateway",
      "Service discovery",
      "Docker containers",
      "Kubernetes deployment",
      "Monitoring & logging",
      "Circuit breaker",
      "Event-driven architecture",
      "Database per service",
      "CI/CD pipeline"
    ],
    requirements: [
      "Node.js 18+",
      "Docker & Kubernetes",
      "Multiple databases",
      "Message queue (RabbitMQ/Kafka)",
      "Advanced Node.js knowledge"
    ],
    tags: ["nodejs", "microservices", "docker", "kubernetes", "architecture"],
    isFeatured: true
  },

  // PHP Scripts
  {
    title: "Laravel E-commerce Complete Solution",
    description: "Full-featured e-commerce solution built with Laravel. Includes multi-vendor support, payment gateways, inventory management, and comprehensive admin panel with advanced features.",
    shortDescription: "Complete Laravel e-commerce with multi-vendor support",
    category: "PHP Scripts",
    originalPrice: 8999,
    salePrice: 5999,
    images: [
      { url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600", alt: "E-commerce" },
      { url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600", alt: "Shopping Cart" }
    ],
    features: [
      "Multi-vendor marketplace",
      "Product catalog",
      "Shopping cart",
      "Payment integration",
      "Order management",
      "Inventory tracking",
      "Customer reviews",
      "SEO optimized",
      "Mobile responsive",
      "Admin dashboard"
    ],
    requirements: [
      "PHP 8.0+",
      "Laravel 9+",
      "MySQL 8.0+",
      "Composer",
      "Apache/Nginx"
    ],
    tags: ["laravel", "ecommerce", "php", "multivendor", "marketplace"],
    isFeatured: true
  },
  {
    title: "PHP School Management System",
    description: "Comprehensive school management system with student enrollment, fee management, attendance tracking, grade book, timetable management, and parent portal.",
    shortDescription: "Complete school management system with student and fee management",
    category: "PHP Scripts",
    originalPrice: 6999,
    salePrice: 4499,
    images: [
      { url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600", alt: "School System" },
      { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600", alt: "Education" }
    ],
    features: [
      "Student management",
      "Fee management",
      "Attendance system",
      "Grade book",
      "Timetable creation",
      "Parent portal",
      "Teacher dashboard",
      "Library management",
      "Transport management",
      "Reports generation"
    ],
    requirements: [
      "PHP 7.4+",
      "MySQL 5.7+",
      "Bootstrap 5",
      "jQuery",
      "Web server"
    ],
    tags: ["php", "school management", "education", "mysql", "bootstrap"],
    isFeatured: false
  },

  // Mobile Apps
  {
    title: "Flutter E-commerce Mobile App",
    description: "Complete e-commerce mobile app built with Flutter. Features product browsing, cart management, payment integration, order tracking, and user authentication with beautiful UI.",
    shortDescription: "Complete Flutter e-commerce app with payment integration",
    category: "Mobile Apps",
    originalPrice: 7999,
    salePrice: 4999,
    images: [
      { url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600", alt: "Mobile App" },
      { url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600", alt: "Shopping App" }
    ],
    features: [
      "Flutter framework",
      "Cross-platform (iOS/Android)",
      "Product catalog",
      "Cart & checkout",
      "Payment gateway",
      "User authentication",
      "Order tracking",
      "Push notifications",
      "Offline support",
      "Beautiful UI/UX"
    ],
    requirements: [
      "Flutter 3.0+",
      "Dart programming",
      "Android Studio/Xcode",
      "Firebase account",
      "Mobile development setup"
    ],
    tags: ["flutter", "mobile app", "ecommerce", "dart", "cross-platform"],
    isFeatured: false
  },
  {
    title: "React Native Food Delivery App",
    description: "Complete food delivery application with React Native. Includes restaurant listings, menu management, cart system, real-time order tracking, and delivery boy app.",
    shortDescription: "Complete food delivery app with React Native and real-time tracking",
    category: "Mobile Apps",
    originalPrice: 9999,
    salePrice: 6999,
    images: [
      { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600", alt: "Food Delivery" },
      { url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600", alt: "Mobile Food App" }
    ],
    features: [
      "Customer app",
      "Restaurant app",
      "Delivery boy app",
      "Real-time tracking",
      "Payment integration",
      "Menu management",
      "Order management",
      "Rating & reviews",
      "Push notifications",
      "Map integration"
    ],
    requirements: [
      "React Native 0.70+",
      "Node.js backend",
      "MongoDB/PostgreSQL",
      "Google Maps API",
      "Payment gateway account"
    ],
    tags: ["react native", "food delivery", "mobile app", "realtime", "maps"],
    isFeatured: true
  },

  // Web Applications
  {
    title: "Vue.js Project Management Tool",
    description: "Comprehensive project management application built with Vue.js 3. Features task management, team collaboration, time tracking, Gantt charts, and advanced reporting.",
    shortDescription: "Complete project management tool with Vue.js and team collaboration",
    category: "Web Applications",
    originalPrice: 6999,
    salePrice: 4499,
    images: [
      { url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600", alt: "Project Management" },
      { url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600", alt: "Team Collaboration" }
    ],
    features: [
      "Task management",
      "Team collaboration",
      "Time tracking",
      "Gantt charts",
      "File sharing",
      "Real-time updates",
      "Project templates",
      "Reports & analytics",
      "Mobile responsive",
      "Dark mode"
    ],
    requirements: [
      "Vue.js 3+",
      "Node.js backend",
      "PostgreSQL/MongoDB",
      "Socket.IO",
      "Modern browser"
    ],
    tags: ["vuejs", "project management", "collaboration", "nodejs", "realtime"],
    isFeatured: false
  },
  {
    title: "CRM System - Customer Relationship Management",
    description: "Complete CRM system for managing customer relationships, sales pipeline, lead tracking, email marketing, and analytics. Built with modern web technologies.",
    shortDescription: "Complete CRM system with sales pipeline and lead management",
    category: "Web Applications",
    originalPrice: 11999,
    salePrice: 7999,
    images: [
      { url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600", alt: "CRM System" },
      { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600", alt: "Sales Dashboard" }
    ],
    features: [
      "Customer management",
      "Sales pipeline",
      "Lead tracking",
      "Email marketing",
      "Task automation",
      "Analytics & reports",
      "Contact management",
      "Deal tracking",
      "Integration APIs",
      "Mobile app"
    ],
    requirements: [
      "React/Vue.js",
      "Node.js/Laravel",
      "MySQL/PostgreSQL",
      "Email service",
      "Cloud hosting"
    ],
    tags: ["crm", "sales", "customer management", "marketing", "business"],
    isFeatured: true
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

// Get admin user for createdBy field
const getAdminUser = async () => {
  try {
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('Creating admin user...');
      admin = await User.create({
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL || 'admin@codedukan.com',
        password: process.env.ADMIN_PASSWORD || 'admin123456',
        role: 'admin',
        isVerified: true
      });
    }
    return admin._id;
  } catch (error) {
    console.error('Error getting admin user:', error);
    process.exit(1);
  }
};

// Seed products
const seedProducts = async (exitOnComplete = true) => {
  try {
    // Connect to DB if not already connected
    if (!mongoose.connection.readyState) {
      await connectDB();
    }
    
    const adminId = await getAdminUser();
    
    // Clear existing products
    await Product.deleteMany();
    console.log('Existing products cleared');
    
    // Add createdBy field to all products
    const productsWithCreator = codedukanProducts.map(product => ({
      ...product,
      createdBy: adminId,
      updatedBy: adminId
    }));
    
    // Insert new products
    const createdProducts = await Product.insertMany(productsWithCreator);
    console.log(`✅ ${createdProducts.length} CodeDukan products seeded successfully!`);
    
    // Display summary
    console.log('\n📊 Products Summary:');
    const categories = {};
    createdProducts.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });
    
    console.log('\n🎯 Featured Products:');
    const featured = createdProducts.filter(p => p.isFeatured);
    featured.forEach(product => {
      console.log(`   ⭐ ${product.title} - ₹${product.salePrice}`);
    });
    
    console.log('\n🚀 All CodeDukan products are now available in your project!');
    
    if (exitOnComplete) {
      process.exit(0);
    }
    
    return createdProducts;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    if (exitOnComplete) {
      process.exit(1);
    }
    throw error;
  }
};

// Run seed if this script is executed directly
if (process.argv[1].endsWith('seedProducts.js')) {
  seedProducts();
}

export default seedProducts;