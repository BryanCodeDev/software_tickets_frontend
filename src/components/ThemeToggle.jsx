import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = ({ 
  size = 'md', 
  className = '', 
  showText = false,
  variant = 'button' // 'button', 'switch', 'toggle'
}) => {
  const { darkMode, toggleDarkMode } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Variante de botón simple
  if (variant === 'button') {
    return (
      <button
        onClick={toggleDarkMode}
        className={`
          ${sizeClasses[size]}
          ${iconSizeClasses[size]}
          rounded-xl transition-all duration-200 
          focus:outline-none focus:ring-2 focus:ring-offset-2 
          ${darkMode 
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 focus:ring-yellow-500' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-500'
          }
          ${className}
        `}
        title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {darkMode ? (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    );
  }

  // Variante de interruptor
  if (variant === 'switch') {
    return (
      <button
        onClick={toggleDarkMode}
        className={`
          relative inline-flex items-center h-6 rounded-full w-11 
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
          ${darkMode ? 'bg-purple-600' : 'bg-gray-300'}
          ${className}
        `}
        title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        <span
          className={`
            inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200
            ${darkMode ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
        {showText && (
          <span className="ml-3 text-sm font-medium">
            {darkMode ? 'Oscuro' : 'Claro'}
          </span>
        )}
      </button>
    );
  }

  // Variante de toggle con texto
  if (variant === 'toggle') {
    return (
      <button
        onClick={toggleDarkMode}
        className={`
          inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg 
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
          ${darkMode 
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 focus:ring-yellow-500' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500'
          }
          ${className}
        `}
      >
        {darkMode ? (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Modo Claro
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            Modo Oscuro
          </>
        )}
      </button>
    );
  }

  return null;
};

export default ThemeToggle;