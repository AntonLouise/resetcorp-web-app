# ResetCorp Web Application

A full-stack e-commerce platform built with React frontend and Node.js/Express backend, featuring user authentication, product management, shopping cart functionality, admin panel, and email services.

## 🚀 Features

### User Features
- **Authentication**: User registration, login, and profile management
- **Product Catalog**: Browse products with search and filtering
- **Shopping Cart**: Add/remove items, quantity management
- **Checkout Process**: Secure payment flow
- **Service Booking**: Book various services
- **Contact Form**: Customer support integration
- **User Profile**: Order history and account management

### Admin Features
- **Dashboard**: Analytics and overview
- **Product Management**: CRUD operations for products
- **Order Management**: View and manage orders
- **User Management**: Admin user accounts
- **Service Management**: CRUD operations for services
- **Email Integration**: Automated email notifications

## 🏗️ Architecture

### Frontend (React + Vite)
```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context for state management
│   ├── pages/          # Route components
│   ├── services/       # API service functions
│   └── assets/         # Static assets
```

### Backend (Node.js + Express)
```
server/
├── controllers/        # Business logic
├── middleware/         # Custom middleware
├── models/            # Database models
├── routes/            # API route definitions
├── services/          # External service integrations
└── utils/             # Utility functions
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **Supabase** - Additional database services
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email services
- **Helmet** - Security headers

### Security & Performance
- **Rate Limiting** - API protection
- **Input Validation** - Data sanitization
- **CORS** - Cross-origin resource sharing
- **XSS Protection** - Security headers

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance
- Email service credentials

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resetcorp-web-app
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client && npm install
   
   # Install server dependencies
   cd ../server && npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both `client/` and `server/` directories:
   
   **Server Environment Variables:**
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   
   # Email (choose one)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # File Upload
   UPLOAD_PATH=./uploads
   
   # CORS
   CORS_ORIGIN=http://localhost:5173
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

   **Client Environment Variables:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_UPLOAD_URL=http://localhost:5000/uploads
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if local)
   mongod
   
   # Run database migrations (if any)
   cd server
   npm run seed
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1: Start backend
   cd server
   npm run dev
   
   # Terminal 2: Start frontend
   cd client
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:5173/admin

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Set build command: `npm install`
4. Set start command: `npm start`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/admin/orders` - Get all orders (admin)

### Service Endpoints
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)

## 🔧 Development Guidelines

### Code Style
- Use ESLint for code linting
- Follow React best practices
- Use meaningful component and variable names
- Add JSDoc comments for complex functions

### Git Workflow
1. Create feature branches from `main`
2. Use descriptive commit messages
3. Submit pull requests for review
4. Ensure all tests pass before merging

### Testing
- Write unit tests for utility functions
- Test API endpoints with tools like Postman
- Perform integration testing for critical flows

## 🔮 Future Improvements

### High Priority
- [ ] **Testing Suite**: Implement comprehensive unit and integration tests
- [ ] **Performance Optimization**: 
  - Implement React.memo for expensive components
  - Add lazy loading for routes
  - Optimize image loading and compression
- [ ] **Security Enhancements**:
  - Add CSRF protection
  - Implement request signing
  - Add API key authentication for admin routes
- [ ] **Error Handling**: 
  - Implement global error boundary
  - Add detailed error logging
  - Create user-friendly error messages

### Medium Priority
- [ ] **Real-time Features**:
  - WebSocket integration for live order updates
  - Real-time chat support
  - Live inventory tracking
- [ ] **Advanced Search**:
  - Elasticsearch integration
  - Filter by multiple criteria
  - Search suggestions and autocomplete
- [ ] **Payment Integration**:
  - Stripe payment processing
  - PayPal integration
  - Multiple currency support
- [ ] **Mobile App**: React Native version

### Low Priority
- [ ] **Analytics Dashboard**:
  - Google Analytics integration
  - Custom analytics for sales tracking
  - User behavior analysis
- [ ] **Multi-language Support**:
  - Internationalization (i18n)
  - RTL language support
- [ ] **Advanced Admin Features**:
  - Bulk operations
  - Advanced reporting
  - User role management
- [ ] **SEO Optimization**:
  - Meta tags management
  - Sitemap generation
  - Structured data markup

### Technical Debt
- [ ] **Code Refactoring**:
  - Extract reusable components
  - Implement proper TypeScript
  - Add proper error boundaries
- [ ] **Database Optimization**:
  - Add database indexing
  - Implement connection pooling
  - Add database migrations
- [ ] **Monitoring & Logging**:
  - Implement application monitoring
  - Add structured logging
  - Performance metrics tracking

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure CORS_ORIGIN is set correctly
- Check that frontend URL matches allowed origins

**Database Connection Issues**
- Verify MongoDB connection string
- Check network connectivity
- Ensure MongoDB service is running

**File Upload Issues**
- Check upload directory permissions
- Verify file size limits
- Ensure proper MIME type validation

**Email Service Issues**
- Verify email credentials
- Check SMTP settings
- Test with different email providers

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Last Updated**: December 2024
**Version**: 1.0.0
