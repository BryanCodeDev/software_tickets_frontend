import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const LoadingSpinner = React.memo(({
  size = 'md',
  color = 'purple',
  fullScreen = false,
  text = '',
  className = ''
}) => {
  const { conditionalClasses } = useThemeClasses();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    purple: conditionalClasses({
      light: 'text-[#662d91]',
      dark: 'text-purple-400'
    }),
    blue: conditionalClasses({
      light: 'text-blue-600',
      dark: 'text-blue-400'
    }),
    green: conditionalClasses({
      light: 'text-green-600',
      dark: 'text-green-400'
    }),
    red: conditionalClasses({
      light: 'text-red-600',
      dark: 'text-red-400'
    }),
    gray: conditionalClasses({
      light: 'text-gray-600',
      dark: 'text-gray-400'
    })
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <FaSpinner className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} />
      {text && (
        <p className={`
          text-sm font-medium
          ${conditionalClasses({
            light: 'text-gray-600',
            dark: 'text-gray-300'
          })}
        `}>{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`
        fixed inset-0 bg-opacity-80 flex items-center justify-center z-50
        ${conditionalClasses({
          light: 'bg-white',
          dark: 'bg-gray-900'
        })}
      `}>
        {spinner}
      </div>
    );
  }

  return spinner;
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
