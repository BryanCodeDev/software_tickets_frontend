import axios from 'axios';

const getApiBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Fallback para desarrollo local
  return `${window.location.protocol}//${window.location.hostname}:5000/api`;
};

const api = axios.create({
  baseURL: getApiBaseURL(),
});

// Función para obtener la URL base del servidor (sin /api)
export const getServerBaseURL = () => {
  const apiURL = getApiBaseURL();
  return apiURL.replace('/api', '');
};


api.interceptors.request.use((config) => {
  // Don't add token for login and register requests
  if (!config.url.includes('/auth/login') && !config.url.includes('/auth/register')) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
