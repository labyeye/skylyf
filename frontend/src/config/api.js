const API_URL = 'http://10.0.2.2:3000/api';

export const endpoints = {
  register: `${API_URL}/auth/register`,
  login: `${API_URL}/auth/login`,
  products: `${API_URL}/products`,
  categories: `${API_URL}/categories`,
  orders: `${API_URL}/orders`,
};

export default API_URL;