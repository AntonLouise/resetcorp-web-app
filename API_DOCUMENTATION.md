# API Documentation

This document provides comprehensive information about all API endpoints in the ResetCorp web application.

## 🔐 Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📋 Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-backend-domain.com/api`

## 🔑 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get User Profile
```http
GET /auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update User Profile
```http
PUT /auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+1234567890"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user"
  }
}
```

## 🛍️ Product Endpoints

### Get All Products
```http
GET /products
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `search` (optional): Search in product names and descriptions
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

**Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "category": "Electronics",
      "image": "product-image.jpg",
      "stock": 50,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Product by ID
```http
GET /products/:id
```

**Response (200):**
```json
{
  "success": true,
  "product": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "category": "Electronics",
    "image": "product-image.jpg",
    "stock": 50,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create Product (Admin Only)
```http
POST /products
```

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
name: Product Name
description: Product description
price: 99.99
category: Electronics
stock: 50
image: [file upload]
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "category": "Electronics",
    "image": "product-image.jpg",
    "stock": 50
  }
}
```

### Update Product (Admin Only)
```http
PUT /products/:id
```

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
name: Updated Product Name
description: Updated description
price: 149.99
category: Electronics
stock: 75
image: [file upload] (optional)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Updated Product Name",
    "description": "Updated description",
    "price": 149.99,
    "category": "Electronics",
    "image": "updated-image.jpg",
    "stock": 75
  }
}
```

### Delete Product (Admin Only)
```http
DELETE /products/:id
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## 🛒 Cart Endpoints

### Get User Cart
```http
GET /cart
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "cart": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "items": [
      {
        "productId": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "Product Name",
        "price": 99.99,
        "quantity": 2,
        "image": "product-image.jpg"
      }
    ],
    "total": 199.98
  }
}
```

### Add Item to Cart
```http
POST /cart/add
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "quantity": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "cart": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "items": [...],
    "total": 199.98
  }
}
```

### Update Cart Item Quantity
```http
PUT /cart/update/:productId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart updated successfully",
  "cart": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "items": [...],
    "total": 299.97
  }
}
```

### Remove Item from Cart
```http
DELETE /cart/remove/:productId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "cart": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "items": [...],
    "total": 99.99
  }
}
```

### Clear Cart
```http
DELETE /cart/clear
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

## 📦 Order Endpoints

### Create Order
```http
POST /orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "total": 199.98
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "items": [...],
    "shippingAddress": {...},
    "total": 199.98,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get User Orders
```http
GET /orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by order status

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "items": [...],
      "total": 199.98,
      "status": "completed",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25
  }
}
```

### Get Order by ID
```http
GET /orders/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "order": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "items": [...],
    "shippingAddress": {...},
    "total": 199.98,
    "status": "completed",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🎯 Service Endpoints

### Get All Services
```http
GET /services
```

**Response (200):**
```json
{
  "success": true,
  "services": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Service Name",
      "description": "Service description",
      "price": 199.99,
      "duration": "2 hours",
      "category": "Cleaning",
      "image": "service-image.jpg"
    }
  ]
}
```

### Get Service by ID
```http
GET /services/:id
```

**Response (200):**
```json
{
  "success": true,
  "service": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Service Name",
    "description": "Service description",
    "price": 199.99,
    "duration": "2 hours",
    "category": "Cleaning",
    "image": "service-image.jpg"
  }
}
```

### Create Service (Admin Only)
```http
POST /services
```

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
name: Service Name
description: Service description
price: 199.99
duration: 2 hours
category: Cleaning
image: [file upload]
```

**Response (201):**
```json
{
  "success": true,
  "message": "Service created successfully",
  "service": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Service Name",
    "description": "Service description",
    "price": 199.99,
    "duration": "2 hours",
    "category": "Cleaning",
    "image": "service-image.jpg"
  }
}
```

## 📧 Email Endpoints

### Send Contact Form
```http
POST /emails/contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "General Inquiry",
  "message": "I have a question about your services."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

### Send Quote Request
```http
POST /emails/quote
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "service": "House Cleaning",
  "details": "3 bedroom house, weekly cleaning"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Quote request sent successfully"
}
```

## 📁 File Upload Endpoints

### Upload Image
```http
POST /upload/image
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
image: [file upload]
```

**Response (200):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "filename": "uploaded-image.jpg",
  "url": "/uploads/uploaded-image.jpg"
}
```

## 🔧 Admin Endpoints

### Get All Users (Admin Only)
```http
GET /admin/users
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search by name or email

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50
  }
}
```

### Get All Orders (Admin Only)
```http
GET /admin/orders
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by order status

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "items": [...],
      "total": 199.98,
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25
  }
}
```

### Update Order Status (Admin Only)
```http
PUT /admin/orders/:id/status
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "status": "shipped",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 📊 Dashboard Endpoints

### Get Dashboard Stats (Admin Only)
```http
GET /admin/dashboard
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "totalOrders": 75,
    "totalRevenue": 15000.00,
    "pendingOrders": 12,
    "recentOrders": [...],
    "topProducts": [...],
    "monthlyRevenue": [...]
  }
}
```

## ⚠️ Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Access denied. Please login."
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 🔄 Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per 15 minutes
- **Email endpoints**: 3 requests per hour
- **General API**: 100 requests per 15 minutes

When rate limit is exceeded:
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

## 📝 Testing the API

### Using cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Get products with token
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Import the API collection
2. Set the base URL: `http://localhost:5000/api`
3. Use the login endpoint to get a token
4. Set the token in the Authorization header for subsequent requests

## 🔐 Security Notes

- All passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- File uploads are restricted to images only
- Input validation is performed on all endpoints
- CORS is configured for specific origins only
- Rate limiting prevents API abuse

---

**Last Updated**: December 2024
**API Version**: 1.0.0 