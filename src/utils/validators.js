// Funciones de validación comunes
export const isValidEmail = (email) => {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  if (!password) return false;

  // Al menos 8 caracteres, una mayúscula, una minúscula, un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidPhoneNumber = (phone) => {
  if (!phone) return false;

  // Formato colombiano: 10 dígitos o con código de país
  const phoneRegex = /^(\+57\s?)?3\d{9}$/;
  const cleaned = phone.replace(/\s+/g, '');
  return phoneRegex.test(cleaned);
};

export const isValidURL = (url) => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidFileSize = (file, maxSizeInMB = 10) => {
  if (!file) return false;

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const isValidFileType = (file, allowedTypes = []) => {
  if (!file || !allowedTypes.length) return false;

  return allowedTypes.includes(file.type);
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} es requerido`;
  }
  return null;
};

export const validateMinLength = (value, minLength, fieldName) => {
  if (value && value.length < minLength) {
    return `${fieldName} debe tener al menos ${minLength} caracteres`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength, fieldName) => {
  if (value && value.length > maxLength) {
    return `${fieldName} no puede tener más de ${maxLength} caracteres`;
  }
  return null;
};

export const validateEmail = (email) => {
  if (email && !isValidEmail(email)) {
    return 'El correo electrónico no es válido';
  }
  return null;
};

export const validatePassword = (password) => {
  if (password && !isValidPassword(password)) {
    return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';
  }
  return null;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (password && confirmPassword && password !== confirmPassword) {
    return 'Las contraseñas no coinciden';
  }
  return null;
};

export const validateFile = (file, options = {}) => {
  const { maxSize = 10, allowedTypes = [] } = options;

  if (!file) return null;

  if (!isValidFileSize(file, maxSize)) {
    return `El archivo no puede ser mayor a ${maxSize}MB`;
  }

  if (allowedTypes.length > 0 && !isValidFileType(file, allowedTypes)) {
    return `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`;
  }

  return null;
};

export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];

    if (rule.required) {
      const error = validateRequired(value, rule.label || field);
      if (error) errors[field] = error;
    }

    if (value && rule.minLength) {
      const error = validateMinLength(value, rule.minLength, rule.label || field);
      if (error) errors[field] = error;
    }

    if (value && rule.maxLength) {
      const error = validateMaxLength(value, rule.maxLength, rule.label || field);
      if (error) errors[field] = error;
    }

    if (value && rule.type === 'email') {
      const error = validateEmail(value);
      if (error) errors[field] = error;
    }

    if (value && rule.type === 'password') {
      const error = validatePassword(value);
      if (error) errors[field] = error;
    }

    if (rule.custom) {
      const error = rule.custom(value, formData);
      if (error) errors[field] = error;
    }
  });

  return errors;
};