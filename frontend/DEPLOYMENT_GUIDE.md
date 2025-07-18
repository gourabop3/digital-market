# CodeDukan - Full Stack Deployment Guide

This guide will help you deploy the complete CodeDukan digital marketplace with Node.js/Express backend and React frontend on Render.

## 🏗️ Project Structure

```
project/
├── backend/                 # Node.js Express API
│   ├── models/             # MongoDB models
│   ├── controllers/        # API controllers
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── scripts/           # Database scripts
│   ├── package.json       # Backend dependencies
│   └── server.js          # Main server file
├── src/                   # React frontend
├── package.json          # Frontend dependencies
└── README.md
```

## 🔧 Prerequisites

1. **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/cloud/atlas)
2. **Razorpay Account** - [Sign up here](https://razorpay.com/)
3. **Cloudinary Account** - [Sign up here](https://cloudinary.com/) (for image uploads)
4. **Render Account** - [Sign up here](https://render.com/)
5. **GitHub Repository** - Push your code to GitHub

## 📊 MongoDB Atlas Setup

1. **Create a Cluster:**
   - Log in to MongoDB Atlas
   - Create a new cluster (free tier is fine)
   - Choose your preferred cloud provider and region

2. **Database Access:**
   - Go to "Database Access" → "Add New Database User"
   - Create a user with "Read and write to any database" permission
   - Save the username and password

3. **Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0)

4. **Get Connection String:**
   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string (replace `<password>` with your actual password)

## 💳 Razorpay Setup

1. **Create Account:**
   - Sign up at [Razorpay](https://razorpay.com/)
   - Complete KYC verification for live mode

2. **Get API Keys:**
   - Go to Settings → API Keys
   - Copy your Key ID and Key Secret
   - For testing, use test keys (starts with `rzp_test_`)

3. **Webhook Setup (Optional but Recommended):**
   - Go to Settings → Webhooks
   - Add webhook URL: `https://your-backend-domain.onrender.com/api/orders/webhook`
   - Select events: `payment.captured`, `payment.failed`, `refund.processed`

## ☁️ Cloudinary Setup

1. **Create Account:**
   - Sign up at [Cloudinary](https://cloudinary.com/)

2. **Get Credentials:**
   - Go to Dashboard
   - Copy Cloud Name, API Key, and API Secret

## 🚀 Render Deployment

### Step 1: Deploy Backend

1. **Create Web Service:**
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** `codedukan-backend`
     - **Environment:** `Node`
     - **Region:** Choose closest to your users
     - **Branch:** `main`
     - **Root Directory:** `backend` (if backend is in a subfolder)
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

2. **Environment Variables:**
   Add these environment variables in Render:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codedukan
   JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters-long
   JWT_EXPIRE=30d
   CLIENT_URL=https://your-frontend-domain.onrender.com
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=secure_admin_password
   ```

3. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the backend URL (e.g., `https://codedukan-backend.onrender.com`)

### Step 2: Deploy Frontend

1. **Create Static Site:**
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name:** `codedukan-frontend`
     - **Branch:** `main`
     - **Root Directory:** `.` (project root)
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** `dist`

2. **Environment Variables:**
   Add these environment variables:
   ```
   VITE_API_URL=https://your-backend-domain.onrender.com/api
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
   ```

3. **Deploy:**
   - Click "Create Static Site"
   - Wait for deployment to complete

## 🔄 Post-Deployment Setup

### 1. Update Backend CORS

Make sure your backend's CORS configuration includes your frontend domain:

```javascript
// In backend/server.js
app.use(cors({
  origin: [
    'http://localhost:5173', // Development
    'https://your-frontend-domain.onrender.com' // Production
  ],
  credentials: true
}));
```

### 2. Seed Database (Optional)

Create an admin user and sample products:

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set environment variables (create .env file locally)
# Run seed script
npm run seed
```

### 3. Test the Application

1. **Backend Health Check:**
   - Visit: `https://your-backend-domain.onrender.com/api/health`
   - Should return: `{"success": true, "message": "CodeDukan API is running!"}`

2. **Frontend:**
   - Visit your frontend URL
   - Test user registration and login
   - Test adding products to cart
   - Test payment flow (use Razorpay test cards)

## 🧪 Testing Payments

Use these Razorpay test cards:

- **Success:** 4111 1111 1111 1111
- **Failure:** 4000 0000 0000 0002
- **CVV:** Any 3 digits
- **Expiry:** Any future date

## 🛠️ Troubleshooting

### Common Issues

1. **Backend Won't Start:**
   - Check environment variables are set correctly
   - Verify MongoDB connection string
   - Check Render logs for specific errors

2. **Frontend Can't Connect to Backend:**
   - Verify `VITE_API_URL` points to correct backend URL
   - Check CORS configuration in backend
   - Ensure backend is running and accessible

3. **Payment Issues:**
   - Verify Razorpay credentials
   - Check webhook URL is accessible
   - Test with Razorpay test cards

4. **Database Connection Issues:**
   - Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
   - Check database user permissions
   - Verify connection string format

### Render Free Tier Limitations

- **Sleep Mode:** Free services sleep after 15 minutes of inactivity
- **Build Time:** Limited build minutes per month
- **Bandwidth:** Limited bandwidth

**Solutions:**
- Use a service like UptimeRobot to ping your backend every 14 minutes
- Consider upgrading to paid plans for production use

## 📈 Production Optimizations

1. **Database Indexing:**
   - Ensure MongoDB indexes are created for better performance

2. **Image Optimization:**
   - Use Cloudinary's automatic optimizations
   - Implement lazy loading for images

3. **Caching:**
   - Implement Redis for session storage
   - Add CDN for static assets

4. **Monitoring:**
   - Set up error tracking (Sentry)
   - Monitor API performance
   - Set up uptime monitoring

## 🔒 Security Checklist

- [ ] Strong JWT secret (minimum 32 characters)
- [ ] Secure admin password
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] HTTPS enabled (automatic on Render)
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection

## 📞 Support

If you encounter issues:

1. Check Render logs for error details
2. Verify all environment variables
3. Test API endpoints individually
4. Check database connectivity
5. Review payment gateway settings

## 🎉 Success!

Your full-stack CodeDukan application should now be live and functional with:

- ✅ User authentication
- ✅ Product catalog
- ✅ Shopping cart
- ✅ Razorpay payments
- ✅ Order management
- ✅ Admin functionality
- ✅ File uploads
- ✅ Email notifications

**Frontend URL:** https://your-frontend-domain.onrender.com
**Backend URL:** https://your-backend-domain.onrender.com

Enjoy your digital marketplace! 🚀