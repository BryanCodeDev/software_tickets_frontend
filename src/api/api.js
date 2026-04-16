import axios from 'axios';
import DOMPurify from 'dompurify';

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

// Función para sanitizar objetos recursivamente
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = DOMPurify.sanitize(obj[key], { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      sanitized[key] = sanitizeObject(obj[key]);
    } else if (Array.isArray(obj[key])) {
      sanitized[key] = obj[key].map(item => 
        typeof item === 'string' ? DOMPurify.sanitize(item, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) : item
      );
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};

api.interceptors.request.use((config) => {
  // Don't add token for login and register requests
  if (!config.url.includes('/auth/login') && !config.url.includes('/auth/register')) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // SANITIZACION GLOBAL DE TODAS LAS ENTRADAS ANTES DE ENVIAR AL BACKEND
  if (config.data && typeof config.data === 'object') {
    config.data = sanitizeObject(config.data);
  }

  return config;
});

const handleApiError = (error) => {
  // Registrar errores para debugging
  console.error('API Error:', {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    message: error.message,
    data: error.response?.data
  });
  
  return Promise.reject(error);
};

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      console.warn('Token inválido o expirado, redirigiendo a login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('token_timestamp');
      window.location.href = '/login';
    }
    // Don't redirect on 403 errors, just return the error
    if (error.response?.status === 403) {
      console.warn('Acceso denegado (403)');
      return Promise.reject(error);
    }
    return handleApiError(error);
  }
);

export default api;
