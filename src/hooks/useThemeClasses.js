import { useTheme } from './useTheme';

/**
 * Hook personalizado que proporciona clases automáticamente adaptadas al tema
 * @param {Object} config - Configuración de clases por variante
 * @returns {Object} - Objeto con métodos para obtener clases adaptadas al tema
 */
export const useThemeClasses = (config) => {
  // Obtener darkMode de forma segura
  let darkMode = false;
  let toggleDarkMode = null;

  try {
    const themeContext = useTheme();
    darkMode = themeContext.darkMode;
    toggleDarkMode = themeContext.toggleDarkMode;
  } catch {
    // Si no hay contexto disponible, usar modo claro por defecto
    darkMode = false;
    toggleDarkMode = null;
  }

  /**
   * Obtiene las clases para el estado actual del tema
   * @param {string} variant - Variante del componente
   * @param {boolean} isScrolled - Si el elemento está en estado scrolled
   * @returns {string} - Clases adaptadas al tema
   */
  const getClasses = (variant, isScrolled = false) => {
    const baseConfig = config?.[variant];
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
    const light = themeClasses?.light || '';
    const dark = themeClasses?.dark || '';
    
    return darkMode ? dark : light;
  };

  return {
    getClasses,
    combineClasses,
    conditionalClasses,
    darkMode,
    toggleDarkMode
  };
};

export default useThemeClasses;
