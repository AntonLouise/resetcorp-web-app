# ResetCorp Web App - Setup Guide

This guide will help you set up the ResetCorp Web App project on your local machine for the first time.

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your system:

### Required Software
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** - [Yarn installation guide](https://yarnpkg.com/getting-started/install)
- **Git** - [Download here](https://git-scm.com/)

### Optional but Recommended
- **MongoDB Compass** (GUI for MongoDB) - [Download here](https://www.mongodb.com/products/compass)
- **VS Code** or your preferred code editor
- **Postman** or **Insomnia** for API testing

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/AntonLouise/resetcorp-web-app.git
cd resetcorp-web-app
```

### 2. Install Dependencies

#### Install Server Dependencies
```bash
cd server
npm install
```

#### Install Client Dependencies
```bash
cd ../client
npm install
```

### 3. Environment Configuration

#### Backend Environment Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create a `.env` file by copying the example:
   ```bash
   cp env.production.example .env
   ```

3. Copy the provided `.env` file with configuration


### 3. Run the Application

#### Start the Backend Server
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000`

#### Start the Frontend Client
Open a new terminal window:
```bash
cd client
npm run dev
```
The client will start on `http://localhost:5173`

### 4. Initial Setup (If there is no admin yet)

#### Create Admin User
1. Navigate to the server directory
2. Run the admin creation script:
   ```bash
   node createAdmin.js
   ```
3. Follow the prompts to create your first admin user

#### Seed Services (Optional)
To populate the database with sample services:
```bash
npm run seed
```

## 🔧 Development Workflow

### Running in Development Mode
- **Backend**: `npm run dev` (uses nodemon for auto-restart)
- **Frontend**: `npm run dev` (uses Vite for hot reload)

### Building for Production
- **Frontend**: `npm run build`
- **Backend**: `npm start`

### Available Scripts

#### Backend Scripts (in server directory)
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample services

#### Frontend Scripts (in client directory)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build for production with production mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
resetcorp-web-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   └── services/      # API service functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── package.json
└── README.md
```

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use strong, unique JWT secrets
- Keep API keys secure

### Database Security
- Use strong passwords for database connections
- Enable MongoDB authentication
- Use connection string with authentication

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
If you get "port already in use" errors:
- Change the port in the `.env` file
- Kill the process using the port: `npx kill-port 5000`

#### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string
- Verify network connectivity

#### CORS Issues
- Ensure `CORS_ORIGIN` in `.env` matches your frontend URL
- For development: `http://localhost:5173`

#### Module Not Found Errors
- Run `npm install` in both client and server directories
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Getting Help
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that MongoDB and Supabase are properly configured

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)

## 🚀 Deployment

For deployment instructions, see:
- `VERCEL_DEPLOYMENT_GUIDE.md` - Deploy to Vercel
- `RENDER_DEPLOYMENT_GUIDE.md` - Deploy to Render
- `RENDER_QUICK_START.md` - Quick deployment guide

---

**Happy Coding! 🎉**

If you encounter any issues during setup, please check the troubleshooting section or create an issue in the repository. 