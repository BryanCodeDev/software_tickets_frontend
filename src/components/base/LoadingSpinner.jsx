import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = React.memo(({
  size = 'md',
  color = 'purple',
  fullScreen = false,
  text = '',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <FaSpinner className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} />
      {text && (
        <p className="text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;