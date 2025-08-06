import axios from 'axios';
import { endpoints } from './api';

// Generate a unique transaction ID
export const generateTxnId = () => {
  return `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Initialize a PayU payment
export const initiatePayuPayment = async (paymentData) => {
  try {
    // Check if it's a free order
    const amount = parseFloat(paymentData.amount);
    
    // Make sure all required fields are present
    const requiredPaymentData = {
      txnid: paymentData.txnid,
      amount: paymentData.amount,
      productinfo: paymentData.productinfo,
      firstname: paymentData.firstname,
      email: paymentData.email,
      phone: paymentData.phone,
      lastname: paymentData.lastname || '',
      address1: paymentData.address1 || '',
      address2: paymentData.address2 || '',
      city: paymentData.city || '',
      state: paymentData.state || '',
      country: paymentData.country || 'India',
      zipcode: paymentData.zipcode || '',
      udf1: '',
      udf2: '',
      cartItems: paymentData.cartItems || []
    };

    console.log('Initiating payment with data:', requiredPaymentData);
    const response = await axios.post(endpoints.initiatePayment, requiredPaymentData);
    console.log('Payment initiation response:', response.data);
    
    // Handle free order response
    if (response.data.free_order) {
      return {
        ...response.data,
        isFreeOrder: true,
        skipPayment: true
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Payment initiation error:', error.response?.data || error.message);
    throw error;
  }
};

// Handle payment response from PayU
export const handlePaymentResponse = async (response) => {
  try {
    // Implement verification logic here
    return response;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};
