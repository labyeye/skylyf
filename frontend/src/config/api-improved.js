const { endpoints } = require('./api');

// Environment-specific API URLs
const getApiUrl = () => {
  // Check if running on Android emulator
  if (__DEV__ && Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }
  
  // Check if running on iOS simulator
  if (__DEV__ && Platform.OS === 'ios') {
    return 'http://localhost:3000/api';
  }
  
  // Production URL
  return 'https://your-production-api.com/api';
};

const API_URL = getApiUrl();

export const endpoints = {
  register: `${API_URL}/auth/register`,
  login: `${API_URL}/auth/login`,
  products: `${API_URL}/products`,
  categories: `${API_URL}/categories`,
  orders: `${API_URL}/orders`,
  initiatePayment: `${API_URL}/payment/initiate`,
  paymentSuccess: `${API_URL}/payment/success`,
  paymentFailure: `${API_URL}/payment/failure`,
};

export default API_URL;
