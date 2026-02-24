/**
 * Utilidades comunes del proyecto
 * Funciones helper reutilizables en toda la aplicación
 */

import { CONFIG, COLORES_ESTADO, COLORES_PRIORIDAD } from '../constants';

/**
 * Formatea una fecha a formato legible
 * @param {string|Date} date - Fecha a formatear
 * @param {string} format - Formato deseado
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  switch (format) {
    case 'DD/MM/YYYY HH:mm':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case 'HH:mm':
      return `${hours}:${minutes}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena capitalizada
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitaliza cada palabra en una cadena
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena capitalizada
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(capitalize).join(' ');
};

/**
 * Trunca una cadena a una longitud máxima
 * @param {string} str - Cadena a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Cadena truncada
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Obtiene el color Bootstrap/Tailwind para un estado
 * @param {string} estado - Estado del ticket
 * @returns {string} Clase de color
 */
export const getEstadoColor = (estado) => {
  return COLORES_ESTADO[estado] || 'gray';
};

/**
 * Obtiene el color Bootstrap/Tailwind para una prioridad
 * @param {string} prioridad - Prioridad del ticket
 * @returns {string} Clase de color
 */
export const getPrioridadColor = (prioridad) => {
  return COLORES_PRIORIDAD[prioridad] || 'gray';
};

/**
 * Debounce function - retrasa la ejecución
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
export const debounce = (func, wait = CONFIG.DEBOUNCE_DELAY) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Genera un array de páginas para paginación
 * @param {number} currentPage - Página actual
 * @param {number} totalPages - Total de páginas
 * @param {number} maxVisible - Máximo de páginas visibles
 * @returns {number[]} Array de números de página
 */
export const getPageNumbers = (currentPage, totalPages, maxVisible = 5) => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  const half = Math.floor(maxVisible / 2);
  let start = currentPage - half;
  let end = currentPage + half;
  
  if (start < 1) {
    start = 1;
    end = maxVisible;
  }
  
  if (end > totalPages) {
    end = totalPages;
    start = totalPages - maxVisible + 1;
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/**
 * Descarga un archivo desde datos binarios
 * @param {Blob} blob - Datos del archivo
 * @param {string} filename - Nombre del archivo
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Convierte un objeto a query string
 * @param {Object} params - Objeto con parámetros
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

/**
 * Valida que un valor no esté vacío
 * @param {any} value - Valor a validar
 * @returns {boolean} True si no está vacío
 */
export const isNotEmpty = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Normaliza texto para búsqueda (elimina acentos)
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto normalizado
 */
export const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Compara dos valores para ordenamiento
 * @param {any} a - Primer valor
 * @param {any} b - Segundo valor
 * @param {string} order - Orden ('asc' o 'desc')
 * @returns {number} Resultado de comparación
 */
export const compareValues = (a, b, order = 'asc') => {
  if (a === b) return 0;
  
  const comparison = a < b ? -1 : 1;
  return order === 'desc' ? -comparison : comparison;
};

/**
 * Formatea número a formato de moneda
 * @param {number} value - Valor a formatear
 * @param {string} currency - Símbolo de moneda
 * @returns {string} Valor formateado
 */
export const formatCurrency = (value, currency = '$') => {
  if (value === null || value === undefined) return '';
  return `${currency}${Number(value).toLocaleString('es-CO')}`;
};

/**
 * Obtiene iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} Iniciales
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Obtiene tiempo relativo (hace 5 minutos, hace 2 horas, etc.)
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Tiempo relativo
 */
export const getTimeAgo = (date) => {
  if (!date) return 'Desconocido';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Hace un momento';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Hace ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `Hace ${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Hace ${months}m`;
  return `Hace ${Math.floor(months / 12)}a`;
};
