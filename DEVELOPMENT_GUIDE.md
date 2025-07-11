# Development Guide

This guide provides comprehensive information for developers working on the ResetCorp web application.

## 🏗️ Project Structure

### Frontend Structure
```
client/src/
├── components/          # Reusable UI components
│   ├── AdminRoute.jsx   # Admin route protection
│   ├── AnimatedBackground.jsx
│   ├── ConfirmModal.jsx # Confirmation dialogs
│   ├── ContactModal.jsx # Contact form modal
│   ├── Navbar.jsx       # Navigation component
│   ├── ProtectedRoute.jsx # Route protection
│   ├── QuoteModal.jsx   # Quote request modal
│   └── ServiceDetailModal.jsx
├── context/             # React Context providers
│   ├── AuthContext.jsx  # Authentication state
│   └── CartContext.jsx  # Shopping cart state
├── pages/               # Route components
│   ├── admin/           # Admin panel pages
│   ├── Home.jsx         # Landing page
│   ├── login.jsx        # Authentication
│   ├── products.jsx     # Product catalog
│   ├── services.jsx     # Service booking
│   └── ...
├── services/            # API service functions
│   ├── api.js           # Base API configuration
│   ├── authService.js   # Authentication API calls
│   ├── productService.js # Product API calls
│   └── ...
└── assets/              # Static assets
```

### Backend Structure
```
server/
├── controllers/         # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── ...
├── middleware/          # Custom middleware
│   ├── auth.js          # Authentication middleware
│   ├── admin.js         # Admin authorization
│   ├── rateLimit.js     # Rate limiting
│   ├── validation.js    # Input validation
│   └── errorHandler.js  # Error handling
├── models/              # Database models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── ...
├── routes/              # API route definitions
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   └── ...
├── services/            # External service integrations
│   ├── emailService.js
│   └── emailServiceAlternative.js
├── utils/               # Utility functions
│   ├── generateToken.js
│   └── sendEmail.js
└── config/              # Configuration files
    ├── database.js
    ├── security.js
    ├── supabase.js
    └── upload.js
```

## 📝 Coding Standards

### JavaScript/React Standards

#### Component Structure
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Component definition
const ComponentName = ({ prop1, prop2 }) => {
  // 3. State and hooks
  const [state, setState] = useState(null);
  const navigate = useNavigate();

  // 4. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 5. Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // 6. Render
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
};

// 7. PropTypes (if not using TypeScript)
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

export default ComponentName;
```

#### Naming Conventions
- **Components**: PascalCase (e.g., `ProductCard.jsx`)
- **Files**: camelCase for utilities, PascalCase for components
- **Variables**: camelCase (e.g., `userName`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Functions**: camelCase (e.g., `handleSubmit`)

#### State Management
```javascript
// Use Context for global state
const AuthContext = createContext();

// Use local state for component-specific data
const [localState, setLocalState] = useState(initialValue);

// Use useReducer for complex state logic
const [state, dispatch] = useReducer(reducer, initialState);
```

### Backend Standards

#### Controller Structure
```javascript
// 1. Imports
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// 2. Controller functions
const getProducts = async (req, res) => {
  try {
    // 3. Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 4. Business logic
    const products = await Product.find({});

    // 5. Response
    res.status(200).json(products);
  } catch (error) {
    // 6. Error handling
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProducts
};
```

#### Error Handling
```javascript
// Always use try-catch blocks
try {
  // Async operations
} catch (error) {
  console.error('Error description:', error);
  res.status(500).json({ 
    message: 'User-friendly error message',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}
```

## 🔧 Development Workflow

### Git Workflow

1. **Create Feature Branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/feature-name
   ```

2. **Make Changes**
   - Write code following standards
   - Add tests if applicable
   - Update documentation

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add user authentication feature"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/feature-name
   # Create pull request on GitHub
   ```

### Commit Message Convention
```
type(scope): description

Examples:
feat(auth): add JWT token refresh functionality
fix(products): resolve image upload issue
docs(readme): update installation instructions
style(navbar): improve responsive design
refactor(api): simplify product controller logic
test(auth): add unit tests for login function
```

### Code Review Checklist
- [ ] Code follows project standards
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Security considerations addressed
- [ ] Performance implications considered
- [ ] Documentation updated
- [ ] Tests added/updated

## 🧪 Testing Guidelines

### Frontend Testing
```javascript
// Component testing example
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';

describe('ProductCard', () => {
  test('renders product information correctly', () => {
    const product = {
      name: 'Test Product',
      price: 99.99,
      image: 'test-image.jpg'
    };

    render(<ProductCard product={product} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  test('calls onAddToCart when add to cart button is clicked', () => {
    const mockAddToCart = jest.fn();
    const product = { id: 1, name: 'Test Product' };

    render(<ProductCard product={product} onAddToCart={mockAddToCart} />);
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(mockAddToCart).toHaveBeenCalledWith(product);
  });
});
```

### Backend Testing
```javascript
// API endpoint testing example
const request = require('supertest');
const app = require('../app');

describe('Product API', () => {
  test('GET /api/products returns all products', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/products creates new product', async () => {
    const newProduct = {
      name: 'Test Product',
      price: 99.99,
      description: 'Test description'
    };

    const response = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect(201);

    expect(response.body.name).toBe(newProduct.name);
  });
});
```

## 🔒 Security Best Practices

### Frontend Security
```javascript
// Sanitize user inputs
const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, '');
};

// Validate data before sending to API
const validateForm = (formData) => {
  const errors = {};
  if (!formData.email.includes('@')) {
    errors.email = 'Invalid email format';
  }
  return errors;
};
```

### Backend Security
```javascript
// Input validation middleware
const validateProduct = [
  body('name').trim().isLength({ min: 1 }).escape(),
  body('price').isFloat({ min: 0 }),
  body('description').trim().escape()
];

// Rate limiting
const rateLimit = require('express-rate-limit');
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});
```

## 📊 Performance Optimization

### Frontend Optimization
```javascript
// Lazy loading components
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Debouncing API calls
const debouncedSearch = useCallback(
  debounce((query) => {
    searchProducts(query);
  }, 300),
  []
);
```

### Backend Optimization
```javascript
// Database indexing
// Add to models/Product.js
productSchema.index({ name: 'text', description: 'text' });

// Caching frequently accessed data
const cache = new Map();
const getCachedProduct = async (id) => {
  if (cache.has(id)) {
    return cache.get(id);
  }
  const product = await Product.findById(id);
  cache.set(id, product);
  return product;
};
```

## 🐛 Debugging Tips

### Frontend Debugging
```javascript
// Use React DevTools
// Add debug logging
console.log('Component state:', state);

// Use error boundaries
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
}
```

### Backend Debugging
```javascript
// Add detailed logging
const logger = require('morgan');
app.use(logger('combined'));

// Use debug package for specific modules
const debug = require('debug')('app:auth');
debug('User login attempt:', { email: req.body.email });
```

## 📚 Useful Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools) - React debugging
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [VS Code Extensions](https://marketplace.visualstudio.com/) - Code quality tools

### Learning Resources
- [JavaScript Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [React Patterns](https://reactpatterns.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Remember**: Always prioritize code quality, security, and user experience. When in doubt, refer to this guide or ask the team for clarification. 