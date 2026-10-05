import axios from 'axios';
import { Platform } from 'react-native';

// Backend URL Configuration
// - If deployed on Render/Heroku, specify your URL below (e.g. 'https://np-electricals.onrender.com/api')
// - In local development:
//    - Web / iOS Simulator: http://localhost:5000/api
//    - Android Emulator: http://10.0.2.2:5000/api
//    - Physical device: http://<YOUR_LOCAL_IP>:5000/api
export const DEPLOYED_BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || '';

export const getBaseURL = () => {
  if (DEPLOYED_BACKEND_URL && DEPLOYED_BACKEND_URL.startsWith('http')) {
    return DEPLOYED_BACKEND_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getBaseURL();

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Product APIs
export const productAPI = {
  getAll: (categoryId) => api.get('/products', { params: { categoryId } }),
  getLowStock: () => api.get('/products/low-stock'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  updateStock: (id, stockCount) => api.patch(`/products/${id}/stock`, { stockCount }),
  delete: (id) => api.delete(`/products/${id}`),
};

// Customer APIs
export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  addPurchase: (id, purchaseData) => api.post(`/customers/${id}/purchase`, purchaseData),
  settlePayment: (id, settlementData) => api.post(`/customers/${id}/settle`, settlementData),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Billing APIs
export const billingAPI = {
  getAll: () => api.get('/billing'),
  create: (billingData) => api.post('/billing', billingData),
  getDailySummary: (date) => api.get('/billing/daily-summary', { params: { date } }),
};

export default api;
