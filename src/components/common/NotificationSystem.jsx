import React from 'react';
import { FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const NotificationSystem = React.memo(({ notification, onClose }) => {
  const { conditionalClasses } = useThemeClasses();
  
  if (!notification) return null;

  return (
    <div className="fixed top-3 right-3 left-3 sm:top-4 sm:right-4 sm:left-auto z-50 max-w-sm animate-slide-in-right">
      <div className={`
        flex items-center p-3 sm:p-4 rounded-xl shadow-2xl border-2 transition-all duration-300
        ${notification.type === 'success'
          ? conditionalClasses({
              light: 'bg-white border-green-400 text-green-800',
              dark: 'bg-gray-800 border-green-500 text-green-200'
            })
          : conditionalClasses({
              light: 'bg-white border-red-400 text-red-800',
              dark: 'bg-gray-800 border-red-500 text-red-200'
            })
        }
      `}>
        <div className="shrink-0">
          {notification.type === 'success' ? (
            <div className={`
              w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
              ${conditionalClasses({
                light: 'bg-green-100',
                dark: 'bg-green-900/30'
              })}
            `}>
              <FaCheck className={`
                w-4 h-4 sm:w-5 sm:h-5
                ${conditionalClasses({
                  light: 'text-green-600',
                  dark: 'text-green-400'
                })}
              `} />
            </div>
          ) : (
            <div className={`
              w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
              ${conditionalClasses({
                light: 'bg-red-100',
                dark: 'bg-red-900/30'
              })}
            `}>
              <FaTimes className={`
                w-4 h-4 sm:w-5 sm:h-5
                ${conditionalClasses({
                  light: 'text-red-600',
                  dark: 'text-red-400'
                })}
              `} />
            </div>
          )}
        </div>
        <div className="ml-3 sm:ml-4 flex-1">
          <p className="text-xs sm:text-sm font-semibold">{notification.message}</p>
        </div>
        <button
          onClick={onClose}
          className={`
            ml-3 sm:ml-4 transition-colors
            ${conditionalClasses({
              light: 'text-gray-400 hover:text-gray-600',
              dark: 'text-gray-500 hover:text-gray-300'
            })}
          `}
        >
          <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
});

NotificationSystem.displayName = 'NotificationSystem';

export default NotificationSystem;
