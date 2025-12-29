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
  getBySlug: (slug) => api.get(`/doctors/slug/${slug}/`),
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
  // Consultation fees
  getFees: (doctorId) => api.get(`/doctors/${doctorId}/fees/`),
  createFee: (doctorId, data) => api.post(`/doctors/${doctorId}/fees/`, data),
  updateFee: (feeId, data) => api.put(`/doctors/fees/${feeId}/`, data),
  deleteFee: (feeId) => api.delete(`/doctors/fees/${feeId}/`),
};

// Doctor Reviews Admin APIs
export const reviewsAPI = {
  getAll: (params) => api.get('/doctors/reviews/all/', { params }),
  update: (reviewId, data) => api.put(`/doctors/reviews/${reviewId}/`, null, { params: data }),
  delete: (reviewId) => api.delete(`/doctors/reviews/${reviewId}/`),
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
  getBySlug: (slug) => api.get(`/services/slug/${slug}/`),
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
  getDashboardStats: () => api.get('/admin/dashboard'),
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

// Stats APIs (alias for siteStatsAPI for admin pages)
export const statsAPI = {
  getAll: () => api.get('/site-stats/'),
  getAllAdmin: () => api.get('/site-stats/all/'),
  getById: (id) => api.get(`/site-stats/${id}/`),
  create: (data) => api.post('/site-stats/', data),
  update: (id, data) => api.put(`/site-stats/${id}/`, data),
  delete: (id) => api.delete(`/site-stats/${id}/`),
};

// Settings APIs (for admin settings page)
export const settingsAPI = {
  getAll: () => api.get('/site-settings/'),
  getByKey: (key) => api.get(`/site-settings/by-key/${key}/`),
  getByCategory: (category) => api.get(`/site-settings/category/${category}/`),
  create: (data) => api.post('/site-settings/', data),
  update: (id, data) => api.put(`/site-settings/${id}/`, data),
  delete: (id) => api.delete(`/site-settings/${id}/`),
};

// AI APIs
export const aiAPI = {
  chat: (message, context) => api.post('/ai/chat', { message, context }),
  analyzeSymptoms: (data) => api.post('/ai/analyze-symptoms', data),
  generateServiceContent: (data) => api.post('/ai/generate/service-content', data),
  generateDoctorContent: (data) => api.post('/ai/generate/doctor-content', data),
  generateInquiryReply: (data) => api.post('/ai/generate/inquiry-reply', data),
  // Blog AI
  generateBlogArticle: (data) => api.post('/ai/generate/blog-article', data),
  generateBlogOutline: (data) => api.post('/ai/generate/blog-outline', data),
  improveBlogContent: (data) => api.post('/ai/improve/blog-content', data),
  // Daily Article
  getAvailableTopics: () => api.get('/ai/blog/available-topics'),
  generateDailyArticle: () => api.post('/ai/generate/daily-article'),
  generateAndPublishDaily: () => api.post('/ai/generate/daily-article-and-publish'),
};

// Blog APIs
export const blogAPI = {
  getAll: (params) => api.get('/blog/', { params }),
  getCategories: () => api.get('/blog/categories/'),
  getBySlug: (slug) => api.get(`/blog/slug/${slug}/`),
  getById: (id) => api.get(`/blog/${id}/`),
  getRelated: (slug, limit = 3) => api.get(`/blog/slug/${slug}/related/`, { params: { limit } }),
  getAllAdmin: () => api.get('/blog/admin/all/'),
  create: (data) => api.post('/blog/', data),
  update: (id, data) => api.put(`/blog/${id}/`, data),
  delete: (id) => api.delete(`/blog/${id}/`),
};

// Upload APIs (AWS S3 integration)
export const uploadAPI = {
  // Get upload service status
  getStatus: () => api.get('/uploads/status'),
  
  // Get allowed file types
  getAllowedTypes: () => api.get('/uploads/allowed-types'),
  
  // Generate presigned URL for direct S3 upload
  getPresignedUrl: (filename, contentType, folder = 'misc', fileSize = 0) => 
    api.post('/uploads/presigned-url', {
      filename,
      content_type: contentType,
      folder,
      file_size: fileSize
    }),
  
  // Upload file directly through server (for small files)
  uploadDirect: (file, folder = 'misc') => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/uploads/direct?folder=${folder}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Delete a file
  deleteFile: (fileUrl) => api.delete('/uploads/', { data: { file_url: fileUrl } }),
  
  // Helper: Upload file to S3 using presigned URL
  uploadToS3: async (file, folder = 'misc') => {
    // 1. Get presigned URL
    const presignedRes = await api.post('/uploads/presigned-url', {
      filename: file.name,
      content_type: file.type,
      folder,
      file_size: file.size
    });
    
    // 2. Upload directly to S3
    await fetch(presignedRes.data.upload_url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });
    
    // 3. Return the final file URL
    return presignedRes.data.file_url;
  }
};

// Doctor Onboarding APIs
export const onboardingAPI = {
  // Public endpoints
  createApplication: (data) => api.post('/onboarding/apply/', data),
  updateApplication: (id, data) => api.put(`/onboarding/apply/${id}/`, data),
  submitApplication: (id) => api.post(`/onboarding/apply/${id}/submit/`),
  checkStatus: (id, email) => api.get(`/onboarding/apply/${id}/status/`, { params: { email } }),
  
  // Admin endpoints
  getDashboardStats: () => api.get('/onboarding/admin/dashboard/'),
  getApplications: (status) => api.get('/onboarding/admin/applications/', { params: { status } }),
  getApplication: (id) => api.get(`/onboarding/admin/applications/${id}/`),
  getApplicationLogs: (id) => api.get(`/onboarding/admin/applications/${id}/logs/`),
  
  // Verification workflow
  runAIVerification: (id) => api.post(`/onboarding/admin/applications/${id}/ai-verify/`),
  humanVerify: (id, data) => api.post(`/onboarding/admin/applications/${id}/verify/`, data),
  
  // Interview workflow
  generateInterviewQuestions: (id) => api.post(`/onboarding/admin/applications/${id}/generate-questions/`),
  scheduleInterview: (id, data) => api.post(`/onboarding/admin/applications/${id}/schedule-interview/`, data),
  completeInterview: (id, data) => api.post(`/onboarding/admin/applications/${id}/complete-interview/`, data),
  
  // Training workflow
  getTrainingModules: () => api.get('/onboarding/training-modules/'),
  createTrainingModule: (data) => api.post('/onboarding/admin/training-modules/', data),
  generateTrainingModule: (topic, specialization) => 
    api.post('/onboarding/admin/training-modules/generate/', null, { params: { topic, specialization } }),
  startTraining: (id) => api.post(`/onboarding/admin/applications/${id}/start-training/`),
  completeTraining: (id, score) => api.post(`/onboarding/admin/applications/${id}/complete-training/`, null, { params: { score } }),
  
  // Activation workflow
  activateDoctor: (id, data) => api.post(`/onboarding/admin/applications/${id}/activate/`, data),
  suspendDoctor: (id, reason) => api.post(`/onboarding/admin/applications/${id}/suspend/`, null, { params: { reason } }),
};

export default api;
