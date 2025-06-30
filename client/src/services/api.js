import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Products API
export const productApi = {
  getAll: (page = 1, limit = 10, category = '') => {
    let url = `/products?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    return api.get(url);
  },
  getById: (id) => api.get(`/products/${id}`),
  getTopSelling: () => api.get('/products/top-selling')
};

// Sales API
export const saleApi = {
  create: (saleData) => api.post('/sales', saleData)
};



// Auth API
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me')
};

export default api;
