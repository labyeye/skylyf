const API_URL = 'http://10.0.2.2:3000/api';

export const endpoints = {
  register: `${API_URL}/auth/register`,
  login: `${API_URL}/auth/login`,
  products: `${API_URL}/products`,
  categories: `${API_URL}/categories`,
  orders: `${API_URL}/orders`,
  userOrders: (email) => `${API_URL}/orders/user/${email}`,
  initiatePayment: `${API_URL}/payment/initiate`,
  paymentSuccess: `${API_URL}/payment/success`,
  paymentFailure: `${API_URL}/payment/failure`,
};

export default API_URL;