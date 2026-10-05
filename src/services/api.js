import axios from 'axios';

// Base API URL (uses relative URL for proxy in dev/prod or localhost fallback)
const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('np_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Upload API (Multer file upload)
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

// Authentication APIs
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me')
};

// Categories APIs
export const categoryAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  updateImage: (id, fileOrUrl) => {
    if (fileOrUrl instanceof File) {
      const formData = new FormData();
      formData.append('image', fileOrUrl);
      return API.patch(`/categories/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return API.patch(`/categories/${id}/image`, { imageUrl: fileOrUrl });
  },
  delete: (id) => API.delete(`/categories/${id}`)
};

// Products APIs
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getByCategory: (categoryId) => API.get(`/products/category/${categoryId}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  updateImage: (id, fileOrUrl) => {
    if (fileOrUrl instanceof File) {
      const formData = new FormData();
      formData.append('image', fileOrUrl);
      return API.patch(`/products/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return API.patch(`/products/${id}/image`, { imageUrl: fileOrUrl });
  },
  updateStock: (id, data) => API.patch(`/products/${id}/stock`, data),
  delete: (id) => API.delete(`/products/${id}`)
};

// Customers APIs
export const customerAPI = {
  getAll: () => API.get('/customers'),
  create: (data) => API.post('/customers', data),
  update: (id, data) => API.put(`/customers/${id}`, data),
  delete: (id) => API.delete(`/customers/${id}`),
  settle: (id, data) => API.post(`/customers/${id}/settle`, data),
  addPastCredit: (id, data) => API.post(`/customers/${id}/credit`, data)
};

// Billing APIs
export const billingAPI = {
  checkout: (billData) => API.post('/billing', billData),
  getHistory: (params) => API.get('/billing', { params }),
  getStats: () => API.get('/billing/stats')
};

export default API;
