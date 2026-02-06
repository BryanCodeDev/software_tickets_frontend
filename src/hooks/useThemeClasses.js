import { useTheme } from './useTheme';

/**
 * Hook personalizado que proporciona clases automáticamente adaptadas al tema
 * @param {Object} config - Configuración de clases por variante
 * @returns {Object} - Objeto con métodos para obtener clases adaptadas al tema
 */
export const useThemeClasses = (config) => {
  // Obtener darkMode de forma segura
  let darkMode = false;
  let themeContext = null;
  try {
    themeContext = useTheme();
    darkMode = themeContext.darkMode;
  } catch (e) {
    // Si no hay contexto disponible, usar modo claro por defecto
    darkMode = false;
  }

  /**
   * Obtiene las clases para el estado actual del tema
   * @param {string} variant - Variante del componente
   * @param {boolean} isScrolled - Si el elemento está en estado scrolled
   * @returns {string} - Clases adaptadas al tema
   */
  const getClasses = (variant, isScrolled = false) => {
    const baseConfig = config[variant];
    if (!baseConfig) return '';

    // Si es un string, retornarlo directamente
    if (typeof baseConfig === 'string') {
      return baseConfig;
    }

    // Si es un objeto, combinar light y dark
    if (typeof baseConfig === 'object') {
      const lightClasses = baseConfig.light || '';
      const darkClasses = baseConfig.dark || '';
      
      if (isScrolled && baseConfig.scrolled) {
        return darkMode ? `${baseConfig.scrolled.dark} ${darkClasses}` : `${baseConfig.scrolled.light} ${lightClasses}`;
      }
      
      return darkMode ? darkClasses : lightClasses;
    }

    return '';
  };

  /**
   * Combina clases base con variantes de tema
   * @param {string} baseClasses - Clases base
   * @param {string} variant - Variante del componente
   * @param {boolean} isScrolled - Si el elemento está en estado scrolled
   * @returns {string} - Clases combinadas
   */
  const combineClasses = (baseClasses, variant, isScrolled = false) => {
    const variantClasses = getClasses(variant, isScrolled);
    return `${baseClasses} ${variantClasses}`.trim();
  };

  /**
   * Crea clases condicionales para tema oscuro/claro
   * @param {Object} themeClasses - Objeto con clases para cada tema
   * @returns {string} - Clases condicionales
   */
  const conditionalClasses = (themeClasses) => {
    const light = themeClasses.light || '';
    const dark = themeClasses.dark || '';
    
    return darkMode ? dark : light;
  };

  // Obtener toggleDarkMode directamente del contexto de forma segura
  let toggleDarkMode = null;
  try {
    toggleDarkMode = themeContext?.toggleDarkMode || useTheme().toggleDarkMode;
  } catch (e) {
    // Si no hay contexto disponible, usar null
    toggleDarkMode = null;
  }

  return {
    getClasses,
    combineClasses,
    conditionalClasses,
    darkMode,
    toggleDarkMode
  };
};

/**
 * Hook simplificado para obtener clases básicas de tema
 * @returns {Object} - Métodos para obtener clases de tema
 */
export const useSimpleThemeClasses = () => {
  // Obtener darkMode de forma segura
  let darkMode = false;
  try {
    darkMode = useTheme().darkMode;
  } catch (e) {
    // Si no hay contexto disponible, usar modo claro por defecto
    darkMode = false;
  }

  const getThemeClasses = (lightClasses, darkClasses) => {
    return darkMode ? darkClasses : lightClasses;
  };

  const bg = darkMode ? 'bg-gray-900' : 'bg-white';
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hover = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  return {
    getThemeClasses,
    bg,
    text,
    border,
    hover,
    darkMode
  };
};

export default useThemeClasses;