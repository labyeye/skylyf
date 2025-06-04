// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    console.log("Login attempt:", email);
    
    // Find user by email
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // For testing, accept 'admin123' directly without bcrypt
    if (password === 'admin123') {
      console.log("Login successful with direct password");
      
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET || 'skylyf_secret_key_2023',
        { expiresIn: '1h' }
      );
      
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    }
    
    // Or continue with bcrypt compare
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.log("Bcrypt error:", err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (!result) {
        console.log("Password mismatch");
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      console.log("Login successful with bcrypt");
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET || 'skylyf_secret_key_2023',
        { expiresIn: '1h' }
      );
      
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    });
  });

// Verify token middleware
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  
  if (!bearerHeader) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    
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

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});