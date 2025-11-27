// Constantes centralizadas de la aplicación
export const API_BASE_URL = 'http://localhost:5000/api';
export const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

// Endpoints de API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_2FA: '/auth/verify-2fa',
    SETUP_2FA: '/auth/setup-2fa'
  },
  TICKETS: {
    BASE: '/tickets',
    BY_ID: (id) => `/tickets/${id}`,
    ATTACHMENTS: (id) => `/tickets/${id}/attachments`
  },
  USERS: '/users',
  INVENTORY: '/inventory',
  DOCUMENTS: '/documents',
  CREDENTIALS: '/credentials',
  MESSAGES: '/messages',
  DASHBOARD: '/dashboard'
};

// Configuraciones de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Configuraciones de tiempo
export const TIMEOUTS = {
  DEBOUNCE_SEARCH: 300,
  NOTIFICATION_DURATION: 5000,
  API_TIMEOUT: 30000
};

// Estados de tickets
export const TICKET_STATUS = {
  ABIERTO: 'abierto',
  EN_PROGRESO: 'en progreso',
  RESUELTO: 'resuelto',
  CERRADO: 'cerrado'
};

// Prioridades de tickets
export const TICKET_PRIORITY = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta'
};

// Roles de usuario
export const USER_ROLES = {
  ADMINISTRADOR: 'Administrador',
  TECNICO: 'Técnico',
  EMPLEADO: 'Empleado'
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error interno del servidor. Inténtalo de nuevo.',
  VALIDATION_ERROR: 'Los datos proporcionados no son válidos.',
  FILE_TOO_LARGE: 'El archivo es demasiado grande.',
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido.'
};

// Mensajes de éxito comunes
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Los cambios se guardaron correctamente.',
  DELETE_SUCCESS: 'El elemento se eliminó correctamente.',
  UPLOAD_SUCCESS: 'Archivo subido correctamente.',
  SEND_SUCCESS: 'Mensaje enviado correctamente.'
};

// Configuraciones de archivos
export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    VIDEOS: ['video/mp4', 'video/avi', 'video/mov']
  }
};

// Configuraciones de UI
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  MODAL_Z_INDEX: 50,
  NOTIFICATION_Z_INDEX: 60
};