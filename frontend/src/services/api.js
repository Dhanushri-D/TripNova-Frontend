import axios from 'axios';

const api = axios.create({ baseURL: 'https://tripnova-backend-tdec.onrender.com/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Destinations
export const destinationsAPI = {
  getAll: () => api.get('/destinations'),
  getById: (id) => api.get(`/destinations/${id}`),
  create: (data) => api.post('/destinations', data),
  update: (id, data) => api.put(`/destinations/${id}`, data),
  remove: (id) => api.delete(`/destinations/${id}`),
};

// Packages
export const packagesAPI = {
  getAll: () => api.get('/packages'),
  getById: (id) => api.get(`/packages/${id}`),
  create: (data) => api.post('/packages', data),
  update: (id, data) => api.put(`/packages/${id}`, data),
  remove: (id) => api.delete(`/packages/${id}`),
};

// Hotels
export const hotelsAPI = {
  getAll: () => api.get('/hotels'),
  getById: (id) => api.get(`/hotels/${id}`),
  create: (data) => api.post('/hotels', data),
  update: (id, data) => api.put(`/hotels/${id}`, data),
  remove: (id) => api.delete(`/hotels/${id}`),
};

// Bookings
export const bookingsAPI = {
  getMine: () => api.get('/bookings'),
  getAll: () => api.get('/bookings/all'),
  create: (data) => api.post('/bookings', data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  complete: (id) => api.put(`/bookings/${id}/complete`),
  remove: (id) => api.delete(`/bookings/${id}`),
};

// Enquiries
export const enquiriesAPI = {
  getAll: () => api.get('/enquiries'),
  getMine: () => api.get('/enquiries/mine'),
  create: (data) => api.post('/enquiries', data),
  update: (id, data) => api.put(`/enquiries/${id}`, data),
  remove: (id) => api.delete(`/enquiries/${id}`),
};

// Reviews
export const reviewsAPI = {
  getAll: () => api.get('/reviews'),
  create: (data) => api.post('/reviews', data),
  remove: (id) => api.delete(`/reviews/${id}`),
};

// Gallery
export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  create: (data) => api.post('/gallery', data),
  remove: (id) => api.delete(`/gallery/${id}`),
};

// Users (admin)
export const usersAPI = {
  getAll: () => api.get('/users'),
  remove: (id) => api.delete(`/users/${id}`),
};

// Trip Plans
export const tripPlansAPI = {
  getMine: () => api.get('/trip-plans'),
  create: (data) => api.post('/trip-plans', data),
  remove: (id) => api.delete(`/trip-plans/${id}`),
};

// Budget Plans
export const budgetPlansAPI = {
  getMine: () => api.get('/budget-plans'),
  create: (data) => api.post('/budget-plans', data),
  update: (id, data) => api.put(`/budget-plans/${id}`, data),
  remove: (id) => api.delete(`/budget-plans/${id}`),
};

// Wishlist
export const wishlistAPI = {
  getMine: () => api.get('/wishlist'),
  add: (data) => api.post('/wishlist', data),
  remove: (itemId, itemType) => api.delete(`/wishlist/${itemId}/${itemType}`),
};

export default api;
