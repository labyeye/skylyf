// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize WooCommerce API
const WooCommerce = new WooCommerceRestApi({
  url: process.env.WOO_STORE_URL,
  consumerKey: process.env.WOO_CONSUMER_KEY,
  consumerSecret: process.env.WOO_CONSUMER_SECRET,
  wpAPI: true,
  version: 'wc/v3'
});

// Mock database for users (in a real app, you'd use a real database)
const users = [
  {
    id: 1,
    email: 'admin@skylyf.com',
    password: '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', // hashed version of 'admin123'
    name: 'Admin User'
  },    
  {
    id: 2,
    email: 'user@skylyf.com',
    password: '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', // hashed version of 'admin123'
    name: 'Regular User'
  }
];

// WooCommerce Customer Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Generate a random temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Create customer in WooCommerce
    const customerData = {
      email: email,
      password: tempPassword,
      username: email.split('@')[0], // Use part of email as username
    };

    const response = await WooCommerce.post('customers', customerData);
    
    // Send email with temporary password (you'll need to implement this)
    // For now, we'll just return the temp password in the response
    res.json({
      message: 'Registration successful',
      tempPassword: tempPassword // In production, remove this and implement email sending
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Failed to register user',
      error: error.message
    });
  }
});

// WooCommerce Customer Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get customer by email
    const response = await WooCommerce.get('customers', {
      email: email
    });

    const customers = response.data;
    
    if (customers.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const customer = customers[0];
    
    // In a real implementation, you would verify the password
    // For now, we'll just return a success response
    res.json({
      message: 'Login successful',
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.first_name + ' ' + customer.last_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Failed to login',
      error: error.message
    });
  }
});

// JWT middleware
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) return res.status(403).json({ message: 'No token provided.' });
  try {
    const token = bearerHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'skylyf_secret_key_2023');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected route example (to verify the token is working)
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({
    message: 'Protected data',
    user: req.user
  });
});

// User profile endpoint (useful after login)
app.get('/api/user/profile', verifyToken, (req, res) => {
  const userId = req.user.id;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name
  });
});

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const response = await WooCommerce.get('products');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const response = await WooCommerce.get('products/categories');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const response = await WooCommerce.get('orders');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get WooCommerce customer by ID (protected)
app.get('/api/customers/:id', verifyToken, async (req, res) => {
  if (parseInt(req.params.id) !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const response = await WooCommerce.get(`customers/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update WooCommerce customer by ID (protected)
app.put('/api/customers/:id', verifyToken, async (req, res) => {
  if (parseInt(req.params.id) !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const response = await WooCommerce.put(`customers/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});