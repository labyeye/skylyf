// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

// Load environment variables
dotenv.config();

// PayU Payment Configuration
const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || 'cOOwyH';
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || 'GVDShzBRUjcUFz5CqA40YenHy8VdwoQZ';
const PAYU_TEST_MODE = process.env.PAYU_TEST_MODE === 'false' ? false : true; // Default to true for testing
const PAYU_BASE_URL = PAYU_TEST_MODE 
  ? 'https://test.payu.in/_payment' 
  : 'https://secure.payu.in/_payment';

console.log('PayU Test Mode:', PAYU_TEST_MODE ? 'ENABLED' : 'DISABLED');
console.log('Using PayU URL:', PAYU_BASE_URL);
console.log('PayU Merchant Key:', PAYU_MERCHANT_KEY);
console.log('PayU Merchant Salt:', PAYU_MERCHANT_SALT ? PAYU_MERCHANT_SALT.substring(0, 10) + '...' : 'NOT SET');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve test page
app.get('/test-payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-payment.html'));
});

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));

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
    // Request up to 50 products instead of the default limit
    const response = await WooCommerce.get('products', {
      per_page: 50
    });
    res.json(response.data);
  } catch (error) {
    console.log('Error fetching products from WooCommerce:', error.message);
    console.log('Serving mock products instead');
    // Fallback to mock products if WooCommerce API fails
    const fs = require('fs');
    const path = require('path');
    const mockProductsPath = path.join(__dirname, 'products.json');
    try {
      const mockProducts = JSON.parse(fs.readFileSync(mockProductsPath, 'utf8'));
      res.json(mockProducts);
    } catch (mockError) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
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

// Get user's orders by email
app.get('/api/orders/user/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    console.log('Fetching orders for user:', userEmail);
    
    // First, try to find the customer by email to get their ID
    let customerId = null;
    try {
      const customerResponse = await WooCommerce.get('customers', {
        email: userEmail,
        per_page: 1
      });
      
      if (customerResponse.data && customerResponse.data.length > 0) {
        customerId = customerResponse.data[0].id;
        console.log('Found customer ID:', customerId);
      }
    } catch (customerError) {
      console.log('Could not find customer by email, will search orders directly');
    }
    
    let orders = [];
    
    // If we found a customer ID, get orders by customer ID
    if (customerId) {
      try {
        const orderResponse = await WooCommerce.get('orders', {
          customer: customerId,
          per_page: 50,
          orderby: 'date',
          order: 'desc'
        });
        orders = orderResponse.data;
        console.log(`Found ${orders.length} orders by customer ID`);
      } catch (customerOrderError) {
        console.log('Error fetching by customer ID, falling back to search');
      }
    }
    
    // If no orders found by customer ID or no customer ID, search by billing email
    if (orders.length === 0) {
      console.log('Searching orders by billing email...');
      const searchResponse = await WooCommerce.get('orders', {
        per_page: 100, // Get more orders to search through
        orderby: 'date',
        order: 'desc'
      });
      
      // Filter orders by billing email
      orders = searchResponse.data.filter(order => 
        order.billing && 
        order.billing.email && 
        order.billing.email.toLowerCase() === userEmail.toLowerCase()
      );
      console.log(`Found ${orders.length} orders by email search`);
    }
    
    console.log(`Total orders found for user ${userEmail}: ${orders.length}`);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
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

// PayU Payment Integration
const crypto = require('crypto');

// Generate PayU hash according to PayU specification
// Formula: SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
// When UDFs are empty: SHA512(key|txnid|amount|productinfo|firstname|email|||||||||||SALT)
function generatePayUHash(txnid, amount, productinfo, firstname, email, udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '') {
  // Make sure to sanitize and trim the inputs
  const key = PAYU_MERCHANT_KEY.toString().trim();
  txnid = (txnid || '').toString().trim();
  amount = (amount || '').toString().trim();
  productinfo = (productinfo || '').toString().trim();
  firstname = (firstname || '').toString().trim();
  email = (email || '').toString().trim();
  udf1 = (udf1 || '').toString().trim();
  udf2 = (udf2 || '').toString().trim();
  udf3 = (udf3 || '').toString().trim();
  udf4 = (udf4 || '').toString().trim();
  udf5 = (udf5 || '').toString().trim();
  const salt = PAYU_MERCHANT_SALT.toString().trim();
  
  // PayU hash formula according to documentation:
  // If UDFs are provided: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
  // If UDFs are empty: key|txnid|amount|productinfo|firstname|email|||||||||||SALT (11 empty pipes)
  let hashString;
  
  // Check if any UDF is provided
  const hasUdfs = udf1 || udf2 || udf3 || udf4 || udf5;
  
  if (hasUdfs) {
    // With UDFs: 6 empty pipes after udf5
    hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  } else {
    // Without UDFs: 11 empty pipes after email
    hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  }
  
  console.log('PayU Hash string:', hashString);
  console.log('Hash string length:', hashString.length);
  console.log('Number of delimiters:', (hashString.match(/\|/g) || []).length);
  console.log('Has UDFs:', hasUdfs);
  
  // Using SHA-512 as required by PayU
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');
  console.log('Generated PayU Hash:', hash);
  
  return hash;
}

// Generate PayU response hash for verification (reverse hash)
// Formula: SHA512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
// When UDFs are empty: SHA512(SALT|status|||||||||||email|firstname|productinfo|amount|txnid|key)
function generatePayUResponseHash(status, txnid, amount, productinfo, firstname, email, udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '') {
  const salt = PAYU_MERCHANT_SALT.toString().trim();
  status = (status || '').toString().trim();
  txnid = (txnid || '').toString().trim();
  amount = (amount || '').toString().trim();
  productinfo = (productinfo || '').toString().trim();
  firstname = (firstname || '').toString().trim();
  email = (email || '').toString().trim();
  udf1 = (udf1 || '').toString().trim();
  udf2 = (udf2 || '').toString().trim();
  udf3 = (udf3 || '').toString().trim();
  udf4 = (udf4 || '').toString().trim();
  udf5 = (udf5 || '').toString().trim();
  const key = PAYU_MERCHANT_KEY.toString().trim();
  
  // PayU response hash formula (reverse order):
  // Check if any UDF is provided
  const hasUdfs = udf1 || udf2 || udf3 || udf4 || udf5;
  
  let responseHashString;
  
  if (hasUdfs) {
    // With UDFs: SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
    responseHashString = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  } else {
    // Without UDFs: SALT|status|||||||||||email|firstname|productinfo|amount|txnid|key
    responseHashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  }
  
  console.log('PayU Response Hash string:', responseHashString);
  console.log('Response hash string length:', responseHashString.length);
  console.log('Number of delimiters in response:', (responseHashString.match(/\|/g) || []).length);
  console.log('Response has UDFs:', hasUdfs);
  
  return crypto.createHash('sha512').update(responseHashString).digest('hex');
}

// Helper function to verify critical transaction parameters
// This should be used to verify that the response parameters match the original request
function verifyCriticalParams(responseData, originalTxnData) {
  const criticalParams = ['txnid', 'amount', 'productinfo', 'firstname', 'email'];
  
  for (const param of criticalParams) {
    if (responseData[param] !== originalTxnData[param]) {
      console.log(`Critical parameter mismatch: ${param}`);
      console.log(`Original: ${originalTxnData[param]}, Response: ${responseData[param]}`);
      return false;
    }
  }
  
  return true;
}

// Test endpoint to validate PayU hash generation with known values
app.get('/api/test-payu-hash', (req, res) => {
  console.log('Testing PayU hash generation...');
  
  // Test with your actual merchant credentials
  const testParams = {
    key: PAYU_MERCHANT_KEY,
    txnid: '123456789',
    amount: '10.00',
    productinfo: 'Test Product',
    firstname: 'John',
    email: 'john@example.com'
  };
  
  console.log('Using Merchant Key:', PAYU_MERCHANT_KEY);
  console.log('Using Merchant Salt:', PAYU_MERCHANT_SALT.substring(0, 10) + '...');
  
  // Test without UDFs (should use 11 empty pipes)
  console.log('\n=== Testing WITHOUT UDFs ===');
  const hashWithoutUdf = generatePayUHash(
    testParams.txnid,
    testParams.amount,
    testParams.productinfo,
    testParams.firstname,
    testParams.email
  );
  
  console.log('Hash without UDFs:', hashWithoutUdf);
  
  // Test with UDFs
  console.log('\n=== Testing WITH UDFs ===');
  const hashWithUdf = generatePayUHash(
    testParams.txnid,
    testParams.amount,
    testParams.productinfo,
    testParams.firstname,
    testParams.email,
    'udf1_value',
    'udf2_value'
  );
  
  console.log('Hash with UDFs:', hashWithUdf);
  
  // Test response hash
  console.log('\n=== Testing Response Hash ===');
  const responseHash = generatePayUResponseHash(
    'success',
    testParams.txnid,
    testParams.amount,
    testParams.productinfo,
    testParams.firstname,
    testParams.email
  );
  
  console.log('Response hash:', responseHash);
  
  res.json({
    message: 'PayU hash test completed with merchant credentials',
    testParams: {
      ...testParams,
      key: PAYU_MERCHANT_KEY,
      salt: PAYU_MERCHANT_SALT.substring(0, 10) + '...' // Only show partial salt for security
    },
    results: {
      hashWithoutUdf,
      hashWithUdf,
      responseHash
    }
  });
});

// Initiate PayU Payment
app.post('/api/payment/initiate', async (req, res) => {
  try {
    const { 
      txnid, 
      amount, 
      productinfo, 
      firstname, 
      email, 
      phone,
      lastname = '',
      address1 = '',
      address2 = '',
      city = '',
      state = '',
      country = '',
      zipcode = '',
      udf1 = '',
      udf2 = '',
      udf3 = '',
      udf4 = '',
      udf5 = '',
      cartItems = []
    } = req.body;

    console.log('Payment initiation request received:', req.body);

    // Validate required fields
    if (!txnid || amount === undefined || !productinfo || !firstname || !email || !phone) {
      console.log('Missing required payment parameters');
      return res.status(400).json({ error: 'Missing required payment parameters' });
    }

    // Handle free orders (amount = 0)
    const orderAmount = parseFloat(amount);
    if (orderAmount === 0) {
      console.log('Free order detected, creating order directly without payment');
      
      try {
        // Create WooCommerce order directly for free orders
        const orderData = {
          payment_method: 'free',
          payment_method_title: 'Free Order',
          set_paid: true,
          status: 'completed',
          billing: {
            first_name: firstname,
            last_name: lastname,
            address_1: address1,
            address_2: address2,
            city: city,
            state: state,
            postcode: zipcode,
            country: country,
            email: email,
            phone: phone
          },
          shipping: {
            first_name: firstname,
            last_name: lastname,
            address_1: address1,
            address_2: address2,
            city: city,
            state: state,
            postcode: zipcode,
            country: country
          },
          line_items: cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            name: item.name,
            price: item.price
          })),
          meta_data: [
            {
              key: 'transaction_id',
              value: txnid
            },
            {
              key: 'payment_type',
              value: 'free_order'
            }
          ]
        };

        const orderResponse = await WooCommerce.post('orders', orderData);
        console.log('Free order created successfully:', orderResponse.data.id);

        return res.json({
          success: true,
          free_order: true,
          order_id: orderResponse.data.id,
          txnid: txnid,
          amount: '0.00',
          status: 'completed',
          message: 'Order created successfully - No payment required',
          redirect_to: 'order_success'
        });

      } catch (orderError) {
        console.error('Failed to create free order:', orderError);
        return res.status(500).json({ 
          error: 'Failed to create free order',
          details: orderError.message 
        });
      }
    }

    // Generate hash using PayU specification
    const hash = generatePayUHash(txnid, amount, productinfo, firstname, email, udf1, udf2, udf3, udf4, udf5);

    // Set success and failure URLs - Updated for mobile app and better handling
    // For development, use ngrok or a public URL that PayU can reach
    const baseUrl = process.env.SERVER_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const surl = `${baseUrl}/api/payment/success`;
    const furl = `${baseUrl}/api/payment/failure`;
    
    console.log('Base URL:', baseUrl);
    console.log('Success URL:', surl);
    console.log('Failure URL:', furl);

    // Response for payment integration
    const response = {
      key: PAYU_MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      lastname,
      address1,
      address2,
      city,
      state,
      country,
      zipcode,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      hash,
      surl,
      furl,
      payment_url: PAYU_BASE_URL,
      service_provider: 'payu_paisa'
    };
    
    console.log('Payment initiation response:', response);
    res.json(response);
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Payment Success Callback
app.post('/api/payment/success', async (req, res) => {
  // Store transaction details, update order status, etc.
  console.log('=== PAYMENT SUCCESS CALLBACK ===');
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  console.log('Request Method:', req.method);
  
  try {
    // Verify the hash signature from PayU
    const receivedHash = req.body.hash;
    
    if (!receivedHash) {
      console.log('No hash received from PayU');
      return res.status(400).json({ status: 'error', message: 'No hash received' });
    }
    
    // Extract UDF parameters from response
    const udf1 = req.body.udf1 || '';
    const udf2 = req.body.udf2 || '';
    const udf3 = req.body.udf3 || '';
    const udf4 = req.body.udf4 || '';
    const udf5 = req.body.udf5 || '';
    
    // Generate response hash for verification using the new function
    const calculatedHash = generatePayUResponseHash(
      req.body.status,
      req.body.txnid,
      req.body.amount,
      req.body.productinfo,
      req.body.firstname,
      req.body.email,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5
    );
    
    console.log('Received hash:', receivedHash);
    console.log('Calculated hash:', calculatedHash);
    
    if (receivedHash !== calculatedHash) {
      console.log('Hash verification failed');
      console.log('Status:', req.body.status);
      console.log('TxnID:', req.body.txnid);
      console.log('Amount:', req.body.amount);
      console.log('ProductInfo:', req.body.productinfo);
      console.log('FirstName:', req.body.firstname);
      console.log('Email:', req.body.email);
      
      // Don't fail on hash mismatch in test mode, just log it
      if (PAYU_TEST_MODE) {
        console.log('WARNING: Hash verification failed but continuing in test mode');
      } else {
        return res.status(400).json({ status: 'error', message: 'Hash verification failed' });
      }
    }
    
    console.log('Hash verification successful (or bypassed in test mode)');
    
    // Create order in WooCommerce
    const orderData = {
      payment_method: 'payu',
      payment_method_title: 'PayU Payment Gateway',
      set_paid: true,
      status: 'processing',
      billing: {
        first_name: req.body.firstname,
        last_name: req.body.lastname || '',
        email: req.body.email,
        phone: req.body.phone
      },
      meta_data: [
        {
          key: 'payu_transaction_id',
          value: req.body.txnid
        },
        {
          key: 'payu_payment_id',
          value: req.body.payuMoneyId || req.body.mihpayid
        },
        {
          key: 'payu_status',
          value: req.body.status
        }
      ]
    };

    const orderResponse = await WooCommerce.post('orders', orderData);
    console.log('Order created successfully:', orderResponse.data.id);

    // Redirect to mobile app success screen
    const redirectUrl = `skylyf://payment-success?txnid=${req.body.txnid}&order_id=${orderResponse.data.id}&status=success`;
    
    // For web testing, redirect to a success page
    const webRedirectUrl = `/payment-success.html?txnid=${req.body.txnid}&order_id=${orderResponse.data.id}&status=success`;
    
    // Try to redirect to mobile app, fallback to web
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Successful</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f8ff; }
          .success-container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .success-icon { color: #4CAF50; font-size: 60px; margin-bottom: 20px; }
          .success-title { color: #2E7D32; font-size: 24px; margin-bottom: 10px; }
          .success-message { color: #666; margin-bottom: 20px; }
          .order-details { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .redirect-button { background: #5C2D91; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; text-decoration: none; display: inline-block; margin: 10px; }
          .redirect-info { color: #888; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="success-container">
          <div class="success-icon">✅</div>
          <h1 class="success-title">Payment Successful!</h1>
          <p class="success-message">Your order has been placed successfully.</p>
          
          <div class="order-details">
            <strong>Order ID:</strong> ${orderResponse.data.id}<br>
            <strong>Transaction ID:</strong> ${req.body.txnid}<br>
            <strong>Amount:</strong> ₹${req.body.amount}
          </div>
          
          <a href="${redirectUrl}" class="redirect-button">Open in App</a>
          
          <div class="redirect-info">
            Redirecting you back to the app...
          </div>
        </div>
        
        <script>
          // Try to redirect to mobile app
          setTimeout(() => {
            window.location.href = '${redirectUrl}';
          }, 3000);
          
          // Fallback: close window after 10 seconds
          setTimeout(() => {
            window.close();
          }, 10000);
        </script>
      </body>
      </html>
    `);

  } catch (orderError) {
    console.error('Failed to create order:', orderError);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Order Creation Failed</title></head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #f44336;">Order Creation Failed</h1>
        <p>Payment was successful but order creation failed.</p>
        <p>Transaction ID: ${req.body.txnid}</p>
        <p>Please contact support.</p>
      </body>
      </html>
    `);
  }
});

// Payment Failure Callback
app.post('/api/payment/failure', async (req, res) => {
  console.log('Payment Failure Callback:', req.body);
  
  // Verify the hash signature from PayU
  const receivedHash = req.body.hash;
  
  // Extract UDF parameters from response
  const udf1 = req.body.udf1 || '';
  const udf2 = req.body.udf2 || '';
  const udf3 = req.body.udf3 || '';
  const udf4 = req.body.udf4 || '';
  const udf5 = req.body.udf5 || '';
  
  // Generate response hash for verification using the new function
  const calculatedHash = generatePayUResponseHash(
    req.body.status,
    req.body.txnid,
    req.body.amount,
    req.body.productinfo,
    req.body.firstname,
    req.body.email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5
  );
  
  console.log('Received hash:', receivedHash);
  console.log('Calculated hash:', calculatedHash);
  
  if (receivedHash !== calculatedHash) {
    console.log('Hash verification failed');
    return res.status(400).json({ status: 'error', message: 'Hash verification failed' });
  }
  
  console.log('Hash verification successful, but payment failed');
  
  // Redirect to mobile app failure screen
  const redirectUrl = `skylyf://payment-failure?txnid=${req.body.txnid}&status=failure&reason=${encodeURIComponent(req.body.error_Message || 'Payment failed')}`;
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Failed</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #fff5f5; }
        .failure-container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .failure-icon { color: #f44336; font-size: 60px; margin-bottom: 20px; }
        .failure-title { color: #d32f2f; font-size: 24px; margin-bottom: 10px; }
        .failure-message { color: #666; margin-bottom: 20px; }
        .failure-details { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .redirect-button { background: #f44336; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; text-decoration: none; display: inline-block; margin: 10px; }
        .retry-button { background: #5C2D91; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; text-decoration: none; display: inline-block; margin: 10px; }
      </style>
    </head>
    <body>
      <div class="failure-container">
        <div class="failure-icon">❌</div>
        <h1 class="failure-title">Payment Failed</h1>
        <p class="failure-message">Unfortunately, your payment could not be processed.</p>
        
        <div class="failure-details">
          <strong>Transaction ID:</strong> ${req.body.txnid}<br>
          <strong>Amount:</strong> ₹${req.body.amount}<br>
          <strong>Reason:</strong> ${req.body.error_Message || 'Payment failed'}
        </div>
        
        <a href="${redirectUrl}" class="redirect-button">Back to App</a>
        
        <div style="color: #888; font-size: 14px; margin-top: 20px;">
          You can try again from the app
        </div>
      </div>
      
      <script>
        // Try to redirect to mobile app
        setTimeout(() => {
          window.location.href = '${redirectUrl}';
        }, 3000);
        
        // Fallback: close window after 10 seconds
        setTimeout(() => {
          window.close();
        }, 10000);
      </script>
    </body>
    </html>
  `);
});

// Test endpoints for PayU callback verification
app.get('/api/payment/test', (req, res) => {
  res.json({
    message: 'Payment callback server is accessible',
    timestamp: new Date().toISOString(),
    headers: req.headers,
    query: req.query
  });
});

app.post('/api/payment/test', (req, res) => {
  res.json({
    message: 'Payment callback POST endpoint is accessible',
    timestamp: new Date().toISOString(),
    headers: req.headers,
    body: req.body
  });
});

// Debug endpoint to test hash generation
app.post('/api/payment/debug', (req, res) => {
  try {
    const { 
      txnid, 
      amount, 
      productinfo, 
      firstname, 
      email, 
      phone,
      lastname = '',
      address1 = '',
      address2 = '',
      city = '',
      state = '',
      country = '',
      zipcode = '',
      udf1 = '',
      udf2 = '',
      udf3 = '',
      udf4 = '',
      udf5 = ''
    } = req.body;

    console.log('Debug payment request:', req.body);

    // Generate hash using PayU specification
    const hash = generatePayUHash(txnid, amount, productinfo, firstname, email, udf1, udf2, udf3, udf4, udf5);

    // Set URLs
    const baseUrl = process.env.SERVER_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const surl = `${baseUrl}/api/payment/success`;
    const furl = `${baseUrl}/api/payment/failure`;

    const response = {
      merchant_key: PAYU_MERCHANT_KEY,
      merchant_salt: PAYU_MERCHANT_SALT.substring(0, 10) + '...',
      test_mode: PAYU_TEST_MODE,
      payment_url: PAYU_BASE_URL,
      form_data: {
        key: PAYU_MERCHANT_KEY,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        phone,
        lastname,
        address1,
        address2,
        city,
        state,
        country,
        zipcode,
        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
        hash,
        surl,
        furl,
        service_provider: 'payu_paisa'
      },
      hash_calculation: {
        hash_string: `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_MERCHANT_SALT}`,
        generated_hash: hash
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});