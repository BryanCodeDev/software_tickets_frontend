// Funciones de formateo comunes
export const formatDate = (date, options = {}) => {
  if (!date) return 'Desconocido';

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };

  return new Date(date).toLocaleDateString('es-ES', defaultOptions);
};

export const formatDateTime = (date) => {
  if (!date) return 'Desconocido';

  return new Date(date).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (date) => {
  if (!date) return '';

  return new Date(date).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const formatNumber = (number, options = {}) => {
  if (number === null || number === undefined) return '0';

  return new Intl.NumberFormat('es-ES', options).format(number);
};

export const formatCurrency = (amount, currency = 'COP') => {
  if (amount === null || amount === undefined) return '$0';

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';

  return `${Number(value).toFixed(decimals)}%`;
};

export const capitalizeFirst = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const capitalizeWords = (string) => {
  if (!string) return '';
  return string.split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ');
};

export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const getInitials = (name) => {
  if (!name) return '';

  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';

  // Remover todos los caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '');

  // Formato colombiano: +57 XXX XXX XXXX
  if (cleaned.length === 10) {
    return `+57 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  return phone;
};