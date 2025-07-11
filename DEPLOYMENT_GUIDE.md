# Deployment Guide

This guide covers deployment strategies for the ResetCorp web application across different hosting platforms.

## 🚀 Deployment Overview

The application consists of two main components:
- **Frontend**: React application (Vite build)
- **Backend**: Node.js/Express API server

## 📋 Prerequisites

Before deployment, ensure you have:

- [ ] Environment variables configured
- [ ] Database connection established
- [ ] Email service credentials set up
- [ ] File upload directory configured
- [ ] SSL certificates (for production)

## 🌐 Frontend Deployment

### Vercel Deployment (Recommended)

Vercel is the recommended platform for React applications due to its excellent performance and ease of use.

#### Step 1: Prepare for Deployment

1. **Build the application**
   ```bash
   cd client
   npm run build
   ```

2. **Create `vercel.json` configuration**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

3. **Set environment variables in Vercel**
   - Go to your project settings in Vercel
   - Add the following environment variables:
     ```
     VITE_API_URL=https://your-backend-domain.com/api
     VITE_UPLOAD_URL=https://your-backend-domain.com/uploads
     ```

#### Step 2: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from the client directory**
   ```bash
   cd client
   vercel --prod
   ```

4. **Or connect GitHub repository**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will automatically deploy on every push to main branch

#### Step 3: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

### Netlify Deployment

#### Step 1: Prepare for Deployment

1. **Create `netlify.toml` in the client directory**
   ```toml
   [build]
     base = "client"
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Set environment variables in Netlify**
   - Go to Site settings > Environment variables
   - Add the same environment variables as Vercel

#### Step 2: Deploy to Netlify

1. **Connect to Git repository**
   - Connect your GitHub repository to Netlify
   - Set build settings as specified in `netlify.toml`

2. **Or deploy manually**
   ```bash
   cd client
   npm run build
   # Upload the dist folder to Netlify
   ```

### GitHub Pages Deployment

#### Step 1: Configure for GitHub Pages

1. **Update `vite.config.js`**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/',
     build: {
       outDir: 'dist'
     }
   })
   ```

2. **Create GitHub Actions workflow**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '18'
             cache: 'npm'
             cache-dependency-path: client/package-lock.json
         
         - name: Install dependencies
           run: |
             cd client
             npm ci
         
         - name: Build
           run: |
             cd client
             npm run build
         
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./client/dist
   ```

## 🖥️ Backend Deployment

### Render Deployment (Recommended)

Render provides excellent free tier hosting for Node.js applications.

#### Step 1: Prepare for Deployment

1. **Create `render.yaml` in the root directory**
   ```yaml
   services:
     - type: web
       name: resetcorp-backend
       env: node
       plan: free
       buildCommand: cd server && npm install
       startCommand: cd server && npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: MONGODB_URI
           sync: false
         - key: JWT_SECRET
           sync: false
         - key: EMAIL_USER
           sync: false
         - key: EMAIL_PASS
           sync: false
   ```

2. **Update `server/package.json`**
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

#### Step 2: Deploy to Render

1. **Connect GitHub repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New Web Service"
   - Connect your GitHub repository

2. **Configure the service**
   - **Name**: `resetcorp-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`

3. **Set environment variables**
   - Go to Environment tab
   - Add all required environment variables:
     ```
     NODE_ENV=production
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_app_password
     CORS_ORIGIN=https://your-frontend-domain.com
     ```

### Railway Deployment

#### Step 1: Prepare for Railway

1. **Create `railway.json` in the server directory**
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "healthcheckPath": "/api/health",
       "healthcheckTimeout": 100,
       "restartPolicyType": "ON_FAILURE"
     }
   }
   ```

#### Step 2: Deploy to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy**
   ```bash
   railway login
   cd server
   railway init
   railway up
   ```

3. **Set environment variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set MONGODB_URI=your_mongodb_connection_string
   # Add all other required variables
   ```

### Heroku Deployment

#### Step 1: Prepare for Heroku

1. **Create `Procfile` in the server directory**
   ```
   web: npm start
   ```

2. **Update `package.json`**
   ```json
   {
     "engines": {
       "node": "18.x"
     }
   }
   ```

#### Step 2: Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and deploy**
   ```bash
   heroku login
   cd server
   heroku create your-app-name
   git push heroku main
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   # Add all other required variables
   ```

## 🗄️ Database Deployment

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster

2. **Configure database**
   - Create a database user
   - Whitelist your IP addresses
   - Get your connection string

3. **Update environment variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resetcorp?retryWrites=true&w=majority
   ```

### Supabase (Alternative)

1. **Create Supabase project**
   - Go to [Supabase](https://supabase.com)
   - Create a new project

2. **Configure database**
   - Set up your database schema
   - Get your connection details

3. **Update environment variables**
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 📧 Email Service Configuration

### Gmail SMTP

1. **Enable 2-factor authentication**
2. **Generate app password**
3. **Set environment variables**
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

### Resend (Alternative)

1. **Create Resend account**
   - Go to [Resend](https://resend.com)
   - Create an account and get API key

2. **Set environment variables**
   ```
   RESEND_API_KEY=your_resend_api_key
   ```

## 🔐 Security Configuration

### SSL/HTTPS

1. **Vercel/Netlify**: Automatic SSL
2. **Render/Railway**: Automatic SSL
3. **Heroku**: Automatic SSL for paid plans

### Environment Variables Security

1. **Never commit sensitive data**
   - Add `.env` to `.gitignore`
   - Use environment variables in production

2. **Use strong secrets**
   ```bash
   # Generate JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### CORS Configuration

Update your backend CORS settings for production:

```javascript
const allowedOrigins = [
  'https://your-frontend-domain.com',
  'https://your-frontend-domain.vercel.app'
];
```

## 📊 Monitoring and Logging

### Application Monitoring

1. **Health Check Endpoint**
   ```javascript
   app.get('/api/health', (req, res) => {
     res.status(200).json({ 
       status: 'ok', 
       timestamp: new Date().toISOString() 
     });
   });
   ```

2. **Error Logging**
   ```javascript
   // Add to your error handler
   console.error('Error:', error);
   // Consider using services like Sentry for production
   ```

### Performance Monitoring

1. **Add performance monitoring**
   ```javascript
   const morgan = require('morgan');
   app.use(morgan('combined'));
   ```

2. **Database monitoring**
   - Monitor MongoDB Atlas metrics
   - Set up alerts for high usage

## 🔄 Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      
      - name: Install dependencies
        run: |
          cd client
          npm ci
      
      - name: Build
        run: |
          cd client
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./client

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Render
        run: |
          curl -X POST "https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys" \
            -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}" \
            -H "Content-Type: application/json"
```

## 🐛 Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for syntax errors

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names and values
   - Verify no trailing spaces

3. **Database Connection**
   - Verify connection string format
   - Check network connectivity
   - Ensure database is accessible

4. **CORS Errors**
   - Update CORS configuration for production domains
   - Check frontend URL in backend CORS settings

5. **File Upload Issues**
   - Verify upload directory permissions
   - Check file size limits
   - Ensure proper MIME type validation

### Performance Optimization

1. **Frontend Optimization**
   - Enable gzip compression
   - Use CDN for static assets
   - Implement lazy loading

2. **Backend Optimization**
   - Enable compression middleware
   - Implement caching strategies
   - Optimize database queries

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Load Balancing**
   - Use multiple server instances
   - Implement session sharing
   - Configure sticky sessions

2. **Database Scaling**
   - Consider MongoDB Atlas M10+ for better performance
   - Implement read replicas
   - Use connection pooling

### Vertical Scaling

1. **Server Resources**
   - Upgrade to paid plans for more resources
   - Monitor CPU and memory usage
   - Optimize application code

## 🔄 Backup and Recovery

### Database Backups

1. **MongoDB Atlas**
   - Enable automated backups
   - Set up point-in-time recovery
   - Test restore procedures

2. **Application Data**
   - Backup uploaded files
   - Export critical data regularly
   - Test recovery procedures

## 📞 Support and Maintenance

### Monitoring Tools

1. **Application Performance Monitoring**
   - [Sentry](https://sentry.io) - Error tracking
   - [New Relic](https://newrelic.com) - Performance monitoring
   - [LogRocket](https://logrocket.com) - Session replay

2. **Uptime Monitoring**
   - [UptimeRobot](https://uptimerobot.com)
   - [Pingdom](https://pingdom.com)
   - [StatusCake](https://statuscake.com)

### Maintenance Schedule

1. **Weekly**
   - Check application logs
   - Monitor performance metrics
   - Review error reports

2. **Monthly**
   - Update dependencies
   - Review security patches
   - Backup verification

3. **Quarterly**
   - Performance optimization
   - Security audit
   - Feature updates

---

**Remember**: Always test deployments in a staging environment before going to production. Keep your deployment configurations in version control and document any custom configurations. 