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
     if (config.data instanceof FormData) {
       // Sanitize FormData fields while preserving files
       const sanitizedFormData = new FormData();
       for (const [key, value] of config.data.entries()) {
         if (typeof value === 'string') {
           sanitizedFormData.append(key, DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }));
         } else {
           sanitizedFormData.append(key, value);
         }
       }
       config.data = sanitizedFormData;
     } else {
       config.data = sanitizeObject(config.data);
     }
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data;
    const message = errorData?.error || errorData?.message || error.message || 'Error desconocido';

    // Mapeo de códigos a títulos de notificación
    let notificationTitle = 'Error';
    let notificationMessage = message;

    switch (status) {
      case 401:
        // Token expired or invalid, redirect to login
        console.warn('Token inválido o expirado, redirigiendo a login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_timestamp');
        window.location.href = '/login';
        return; // No notificar, solo redirigir

      case 403:
        console.warn('Acceso denegado (403)');
        notificationTitle = 'Acceso denegado';
        notificationMessage = 'No tienes permiso para realizar esta acción.';
        break;

      case 409:
        console.warn('Conflicto de concurrencia (409)');
        notificationTitle = 'Conflicto de datos';
        notificationMessage = errorData?.message || 'El registro fue modificado por otro usuario. Por favor, recarga la página e intenta de nuevo.';
        break;

      case 400:
        // Validación o error de negocio
        notificationTitle = 'Datos inválidos';
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        console.error('Error del servidor:', status);
        notificationTitle = 'Error del servidor';
        notificationMessage = 'Ha ocurrido un error interno. Intenta más tarde.';
        break;

      default:
        // Otros errores
        break;
    }

    // Disparar evento global para notificación (si no es 401 que redirige)
    if (status !== 401) {
      const event = new CustomEvent('global-api-error', {
        detail: { title: notificationTitle, message: notificationMessage, status }
      });
      window.dispatchEvent(event);
    }

    return handleApiError(error);
  }
);

export default api;
