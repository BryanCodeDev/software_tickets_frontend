// Funciones helper comunes
export const getTimeAgo = (date) => {
  if (!date) return 'Desconocido';

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Hace un momento';
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)}min`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)}d`;
  if (diffInSeconds < 31536000) return `Hace ${Math.floor(diffInSeconds / 2592000)}m`;

  return `Hace ${Math.floor(diffInSeconds / 31536000)}a`;
};

export const copyToClipboard = async (text, successMessage = 'Copiado al portapapeles') => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, message: successMessage };
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return { success: false, message: 'Error al copiar al portapapeles' };
  }
};

export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export const pick = (object, keys) => {
  return keys.reduce((result, key) => {
    if (key in object) {
      result[key] = object[key];
    }
    return result;
  }, {});
};

export const omit = (object, keys) => {
  const result = { ...object };
  keys.forEach(key => delete result[key]);
  return result;
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

export const unique = (array, key = null) => {
  if (!key) return [...new Set(array)];

  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const range = (start, end, step = 1) => {
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const formatError = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.message) return error.message;
  return 'Ha ocurrido un error inesperado';
};