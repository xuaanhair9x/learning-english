import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ─── Courses ─────────────────────────────────────────────────
export const coursesAPI = {
  list: () => api.get('/courses'),
  get: (id) => api.get(`/courses/${id}`),
  lessons: (courseId) => api.get(`/lessons/course/${courseId}`),
};

// ─── Lessons ─────────────────────────────────────────────────
export const lessonsAPI = {
  get: (id) => api.get(`/lessons/${id}`),
};

// ─── Topics ──────────────────────────────────────────────────
export const topicsAPI = {
  list: () => api.get('/topics'),
  get: (id) => api.get(`/topics/${id}`),
};

// ─── Progress ────────────────────────────────────────────────
export const progressAPI = {
  get: () => api.get('/progress'),
  update: (data) => api.post('/progress', data),
};

// ─── Sentences (Read Aloud) ───────────────────────────────
export const sentencesAPI = {
  list: ({ page = 1, level = '', topic = '' } = {}) =>
    api.get('/sentences', { params: { page, level: level || undefined, topic: topic || undefined } }),
  get: (id) => api.get(`/sentences/${id}`),
};

export default api;
