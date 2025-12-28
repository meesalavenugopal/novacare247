import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Doctors APIs
export const doctorsAPI = {
  getAll: () => api.get('/doctors/'),
  getAllAdmin: () => api.get('/doctors/all/'),
  getById: (id) => api.get(`/doctors/${id}/`),
  create: (data) => api.post('/doctors/', data),
  update: (id, data) => api.put(`/doctors/${id}/`, data),
  delete: (id) => api.delete(`/doctors/${id}/`),
  getSlots: (doctorId) => api.get(`/doctors/${doctorId}/slots/`),
  createSlot: (doctorId, data) => api.post(`/doctors/${doctorId}/slots/`, data),
  updateSlot: (slotId, data) => api.put(`/doctors/slots/${slotId}/`, data),
  deleteSlot: (slotId) => api.delete(`/doctors/slots/${slotId}/`),
  // Doctor reviews
  getReviews: (doctorId) => api.get(`/doctors/${doctorId}/reviews/`),
  submitReview: (doctorId, data) => api.post(`/doctors/${doctorId}/reviews/`, data),
};

// Bookings APIs
export const bookingsAPI = {
  getAvailableSlots: (doctorId, date) => api.get(`/bookings/available-slots/${doctorId}/${date}/`),
  create: (data) => api.post('/bookings/', data),
  getAll: (params) => api.get('/bookings/', { params }),
  getById: (id) => api.get(`/bookings/${id}/`),
  update: (id, data) => api.put(`/bookings/${id}/`, data),
  cancel: (id) => api.delete(`/bookings/${id}/`),
  checkByPhone: (phone) => api.get(`/bookings/check/${phone}/`),
  getToday: () => api.get('/bookings/today/'),
  getByDoctor: (doctorId, params) => api.get(`/bookings/doctor/${doctorId}/`, { params }),
};

// Services APIs
export const servicesAPI = {
  getAll: () => api.get('/services/'),
  getAllAdmin: () => api.get('/services/all/'),
  getById: (id) => api.get(`/services/${id}/`),
  create: (data) => api.post('/services/', data),
  update: (id, data) => api.put(`/services/${id}/`, data),
  delete: (id) => api.delete(`/services/${id}/`),
};

// Testimonials APIs
export const testimonialsAPI = {
  getAll: () => api.get('/testimonials/'),
  getAllAdmin: () => api.get('/testimonials/all/'),
  create: (data) => api.post('/testimonials/', data),
  update: (id, data) => api.put(`/testimonials/${id}/`, data),
  delete: (id) => api.delete(`/testimonials/${id}/`),
};

// Contact APIs
export const contactAPI = {
  submit: (data) => api.post('/contact/', data),
  getAll: (params) => api.get('/contact/', { params }),
  markAsRead: (id) => api.put(`/contact/${id}/read/`),
  delete: (id) => api.delete(`/contact/${id}/`),
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/'),
  getUsers: (params) => api.get('/admin/users/', { params }),
};

// Site Settings APIs
export const siteSettingsAPI = {
  getAll: (category) => api.get('/site-settings/', { params: { category } }),
  getByKey: (key) => api.get(`/site-settings/by-key/${key}/`),
  getByCategory: (category) => api.get(`/site-settings/category/${category}/`),
  getGrouped: () => api.get('/site-settings/grouped/'),
  create: (data) => api.post('/site-settings/', data),
  updateByKey: (key, data) => api.put(`/site-settings/by-key/${key}/`, data),
  deleteByKey: (key) => api.delete(`/site-settings/by-key/${key}/`),
  bulkUpsert: (settings) => api.post('/site-settings/bulk/', settings),
};

// Site Stats APIs
export const siteStatsAPI = {
  getAll: () => api.get('/site-stats/'),
  getAllAdmin: () => api.get('/site-stats/all/'),
  getById: (id) => api.get(`/site-stats/${id}/`),
  create: (data) => api.post('/site-stats/', data),
  update: (id, data) => api.put(`/site-stats/${id}/`, data),
  delete: (id) => api.delete(`/site-stats/${id}/`),
};

// Branches APIs
export const branchesAPI = {
  getAll: (params) => api.get('/branches/', { params }),
  getAllAdmin: () => api.get('/branches/all/'),
  getCountries: () => api.get('/branches/countries/'),
  getStates: (country) => api.get('/branches/states/', { params: { country } }),
  getCities: (country, state) => api.get('/branches/cities/', { params: { country, state } }),
  getWithCounts: () => api.get('/branches/with-counts/'),
  getHeadquarters: () => api.get('/branches/headquarters/'),
  getById: (id) => api.get(`/branches/${id}/`),
  create: (data) => api.post('/branches/', data),
  update: (id, data) => api.put(`/branches/${id}/`, data),
  delete: (id) => api.delete(`/branches/${id}/`),
};

// Milestones APIs
export const milestonesAPI = {
  getAll: () => api.get('/milestones/'),
  getAllAdmin: () => api.get('/milestones/all/'),
  getById: (id) => api.get(`/milestones/${id}/`),
  create: (data) => api.post('/milestones/', data),
  update: (id, data) => api.put(`/milestones/${id}/`, data),
  delete: (id) => api.delete(`/milestones/${id}/`),
};

export default api;
