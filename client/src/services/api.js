import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Setup guest ID for anonymous cart
let guestId = localStorage.getItem('sw_guest_id');
if (!guestId) {
  guestId = 'guest_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
  localStorage.setItem('sw_guest_id', guestId);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'x-guest-id': guestId
  }
});

// Request interceptor to attach Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sw_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to format errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
  addAddress: (data) => api.post('/auth/addresses', data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`),
  setDefaultAddress: (id) => api.put(`/auth/addresses/${id}/default`),
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getBestSellers: () => api.get('/products/best-sellers'),
  create: (formData) => api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
  toggleAvailability: (id) => api.patch(`/products/${id}/toggle-availability`),
};

export const categoryAPI = {
  getAll: (params) => api.get('/categories', { params }),
  create: (formData) => api.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  update: (itemId, data) => api.put(`/cart/${itemId}`, data),
  remove: (itemId) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete('/cart'),
  sync: (localItems) => api.post('/cart/sync', { localItems }),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMy: () => api.get('/orders/my'),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id, data) => api.put(`/orders/${id}/cancel`, data),
  reorder: (id) => api.post(`/orders/${id}/reorder`),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

export const paymentAPI = {
  createOrder: (orderId) => api.post('/payment/create-order', { orderId }),
  verify: (data) => api.post('/payment/verify', data),
};

export const customCakeAPI = {
  create: (formData) => api.post('/custom-requests', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMy: () => api.get('/custom-requests/my'),
  getAll: (params) => api.get('/custom-requests', { params }),
  update: (id, data) => api.put(`/custom-requests/${id}`, data),
};

export const reviewAPI = {
  add: (productId, data) => api.post(`/reviews/product/${productId}`, data),
  getAll: () => api.get('/reviews'),
  toggleApprove: (id) => api.patch(`/reviews/${id}/approve`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const couponAPI = {
  apply: (code, orderTotal) => api.post('/coupons/apply', { code, orderTotal }),
  getAll: () => api.get('/coupons'),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

export const galleryAPI = {
  get: (category) => api.get('/gallery', { params: { category } }),
  create: (formData) => api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/gallery/${id}`),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  markAsRead: (id) => api.patch(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
};

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getCustomers: () => api.get('/admin/customers'),
  toggleBlockCustomer: (id) => api.patch(`/admin/customers/${id}/toggle-block`),
};

export default api;
