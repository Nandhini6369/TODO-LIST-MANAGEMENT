// Share a task with another user by email
export const shareTask = (id, email) =>
  api.post(`/tasks/${id}/share`, { email });
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const loginWithGoogle = () => {
  window.location.href = `${API_URL}/auth/google`;
};

// Task endpoints
// Accepts params: { status, due, priority }
export const fetchTasks = (params = {}) => api.get('/tasks', { params });
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
