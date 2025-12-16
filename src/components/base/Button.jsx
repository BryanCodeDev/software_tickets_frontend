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
      light: 'bg-gradient-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white focus:ring-[#662d91] shadow-lg hover:shadow-xl transform hover:scale-105',
      dark: 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white focus:ring-purple-500 shadow-lg hover:shadow-xl transform hover:scale-105'
    },
    secondary: {
      light: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500',
      dark: 'bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500'
    },
    danger: {
      light: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
      dark: 'bg-red-700 hover:bg-red-800 text-white focus:ring-red-500 shadow-lg hover:shadow-xl'
    },
    success: {
      light: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-lg hover:shadow-xl',
      dark: 'bg-green-700 hover:bg-green-800 text-white focus:ring-green-500 shadow-lg hover:shadow-xl'
    },
    outline: {
      light: 'border-2 border-[#662d91] text-[#662d91] hover:bg-[#662d91] hover:text-white focus:ring-[#662d91]',
      dark: 'border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white focus:ring-purple-500'
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

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

