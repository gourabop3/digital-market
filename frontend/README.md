# 🛍️ CodeDukan - Digital Marketplace

A complete full-stack e-commerce platform for selling digital products like scripts, source codes, and digital assets. Built with modern technologies and ready for production deployment.

## ✨ Features

### 🎯 Core Functionality
- **User Authentication** - Registration, login, logout, password reset
- **Product Catalog** - Browse, search, filter digital products
- **Shopping Cart** - Add, remove, update cart items
- **Payment Processing** - Razorpay integration for Indian payments
- **Order Management** - Track orders, download purchased products
- **Admin Panel** - Manage products, orders, and users

### 🛡️ Security & Performance
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting and CORS protection
- Input validation and sanitization
- MongoDB with optimized indexes
- Error handling and logging

### 📱 User Experience
- Responsive design for all devices
- Modern UI with shadcn/ui components
- Real-time cart updates
- Toast notifications
- Search and filtering
- Product reviews and ratings

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** TanStack React Query
- **Routing:** React Router DOM
- **HTTP Client:** Axios

### Backend (Node.js + Express)
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT tokens
- **Payment:** Razorpay integration
- **File Upload:** Cloudinary
- **Email:** Nodemailer
- **Security:** Helmet, CORS, Rate limiting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Razorpay account
- Cloudinary account (optional)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd codedukan
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ..
   npm install
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 🌐 Deployment

This project is optimized for deployment on Render. See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Quick Deploy to Render

1. **Backend:**
   - Create new Web Service
   - Connect GitHub repo
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables

2. **Frontend:**
   - Create new Static Site
   - Set build command: `npm install && npm run build`
   - Set publish directory: `dist`
   - Add environment variables

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack React Query
- React Router DOM
- Axios
- React Hook Form
- Zod validation

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcryptjs
- Razorpay
- Cloudinary
- Nodemailer
- Express Validator

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search` - Search products
- `GET /api/products/categories` - Get categories

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/item/:id` - Update cart item
- `DELETE /api/cart/item/:id` - Remove from cart

### Orders & Payments
- `POST /api/orders/create-razorpay-order` - Create payment order
- `POST /api/orders/verify-payment` - Verify payment
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order details

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=your_frontend_url
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Frontend (.env)
```env
VITE_API_URL=your_backend_url/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 🧪 Testing

### Payment Testing (Razorpay)
Use these test card numbers:
- **Success:** 4111 1111 1111 1111
- **Failure:** 4000 0000 0000 0002
- **CVV:** Any 3 digits
- **Expiry:** Any future date

## 📈 Features Roadmap

- [ ] Advanced search with filters
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Discount codes/coupons
- [ ] Affiliate program
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced admin features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing to the codebase

## 📞 Contact

For questions or support, please reach out through:
- GitHub Issues
- Email: support@codedukan.com

---

**Built with ❤️ for the developer community**
