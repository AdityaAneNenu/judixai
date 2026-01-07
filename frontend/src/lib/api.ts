import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: { name?: string; bio?: string; avatar?: string }) =>
    api.put('/auth/profile', data),
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
};

// Tasks API
export const tasksAPI = {
  getAll: (params?: {
    status?: string;
    priority?: string;
    search?: string;
    sortBy?: string;
    order?: string;
    page?: number;
    limit?: number;
  }) => api.get('/tasks', { params }),
  getOne: (id: string) => api.get(`/tasks/${id}`),
  create: (data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
  }) => api.post('/tasks', data),
  update: (
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      dueDate?: string;
    }
  ) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  getStats: () => api.get('/tasks/stats'),
};

export default api;
