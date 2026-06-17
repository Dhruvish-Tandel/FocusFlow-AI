import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000' });

// Attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('focusflow_token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const register = (data) => API.post('/api/auth/register', data);
export const login = (data) => API.post('/api/auth/login', data);

// Subjects
export const getSubjects = () => API.get('/api/subjects');
export const addSubject = (data) => API.post('/api/subjects', data);
export const updateSubject = (id, data) => API.put(`/api/subjects/${id}`, data);
export const deleteSubject = (id) => API.delete(`/api/subjects/${id}`);

// Schedule
export const generateSchedule = () => API.post('/api/schedule/generate');
export const generateRecovery = (missedSessions) => API.post('/api/schedule/recover', { missedSessions });

// Sessions
export const logSession = (data) => API.post('/api/sessions', data);
export const getSessions = () => API.get('/api/sessions');
export const getStats = () => API.get('/api/sessions/stats');
