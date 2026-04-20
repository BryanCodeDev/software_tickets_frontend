import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const Button = React.memo(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
// Configuración de variantes con soporte para tema oscuro
  const variantConfig = {
    primary: {
      light: 'bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white focus:ring-purple-700 elevation-raised hover:elevation-floating transform hover:scale-105 active:scale-[0.98] disabled:bg-none disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:transform-none',
      dark: 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white focus:ring-purple-500 elevation-raised hover:elevation-floating transform hover:scale-105 active:scale-[0.98] disabled:bg-none disabled:bg-gray-700 disabled:text-gray-500 disabled:shadow-none disabled:transform-none'
    },
    secondary: {
      light: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-500',
      dark: 'bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500 active:scale-[0.98] disabled:bg-gray-600 disabled:text-gray-500'
    },
    danger: {
      light: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 elevation-raised hover:elevation-floating transform hover:scale-105 active:scale-[0.98] disabled:bg-none disabled:bg-red-300 disabled:text-red-700 disabled:shadow-none',
      dark: 'bg-red-700 hover:bg-red-800 text-white focus:ring-red-500 elevation-raised hover:elevation-floating transform hover:scale-105 active:scale-[0.98] disabled:bg-none disabled:bg-red-800 disabled:text-red-400 disabled:shadow-none'
    },
    success: {
      light: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 elevation-raised hover:elevation-floating transform hover:scale-105 active:scale-[0.98] disabled:bg-none disabled:bg-green-300 disabled:text-green-700 disabled:shadow-none',
      dark: 'bg-green-700 hover:bg-green-800 text-white focus:ring-green-500 elevation-raised hover:elevation-floating transform hover:scale-105 active:scale-[0.98] disabled:bg-none disabled:bg-green-800 disabled:text-green-400 disabled:shadow-none'
    },
    outline: {
      light: 'border-2 border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white focus:ring-purple-700 active:scale-[0.98] disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400',
      dark: 'border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white focus:ring-purple-500 active:scale-[0.98] disabled:bg-gray-700 disabled:border-gray-600 disabled:text-gray-500'
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

   const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none active:scale-98 active:shadow-inner';

  const { conditionalClasses } = useThemeClasses(variantConfig);

  const classes = [
    baseClasses,
    conditionalClasses(variantConfig[variant]),
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <FaSpinner className="animate-spin mr-2" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

