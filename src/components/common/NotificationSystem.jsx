import React from 'react';
import { FaCheck, FaTimes, FaExclamationTriangle, FaInfo } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { useNotifications } from '../../hooks/useNotifications';

const notificationTypes = {
  success: {
    icon: FaCheck,
    colors: {
      light: {
        bg: 'bg-white',
        border: 'border-green-400',
        text: 'text-green-800',
        iconBg: 'bg-green-100',
        icon: 'text-green-600'
      },
      dark: {
        bg: 'bg-gray-800',
        border: 'border-green-500',
        text: 'text-green-200',
        iconBg: 'bg-green-900/30',
        icon: 'text-green-400'
      }
    }
  },
  error: {
    icon: FaTimes,
    colors: {
      light: {
        bg: 'bg-white',
        border: 'border-red-400',
        text: 'text-red-800',
        iconBg: 'bg-red-100',
        icon: 'text-red-600'
      },
      dark: {
        bg: 'bg-gray-800',
        border: 'border-red-500',
        text: 'text-red-200',
        iconBg: 'bg-red-900/30',
        icon: 'text-red-400'
      }
    }
  },
  warning: {
    icon: FaExclamationTriangle,
    colors: {
      light: {
        bg: 'bg-white',
        border: 'border-yellow-400',
        text: 'text-yellow-800',
        iconBg: 'bg-yellow-100',
        icon: 'text-yellow-600'
      },
      dark: {
        bg: 'bg-gray-800',
        border: 'border-yellow-500',
        text: 'text-yellow-200',
        iconBg: 'bg-yellow-900/30',
        icon: 'text-yellow-400'
      }
    }
  },
  info: {
    icon: FaInfo,
    colors: {
      light: {
        bg: 'bg-white',
        border: 'border-blue-400',
        text: 'text-blue-800',
        iconBg: 'bg-blue-100',
        icon: 'text-blue-600'
      },
      dark: {
        bg: 'bg-gray-800',
        border: 'border-blue-500',
        text: 'text-blue-200',
        iconBg: 'bg-blue-900/30',
        icon: 'text-blue-400'
      }
    }
  }
};

const NotificationItem = React.memo(({ notification, onRemove }) => {
  const { conditionalClasses } = useThemeClasses();
  const typeConfig = notificationTypes[notification.type] || notificationTypes.info;
  const IconComponent = typeConfig.icon;

  return (
    <div
      className={`
        flex items-center p-3 sm:p-4 rounded-xl shadow-2xl border-2 transition-all duration-300 mb-2
        animate-slide-in-right
        ${conditionalClasses({
          light: `${typeConfig.colors.light.bg} ${typeConfig.colors.light.border} ${typeConfig.colors.light.text}`,
          dark: `${typeConfig.colors.dark.bg} ${typeConfig.colors.dark.border} ${typeConfig.colors.dark.text}`
        })}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="shrink-0">
        <div className={`
          w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
          ${conditionalClasses({
            light: typeConfig.colors.light.iconBg,
            dark: typeConfig.colors.dark.iconBg
          })}
        `}>
          <IconComponent className={`
            w-4 h-4 sm:w-5 sm:h-5
            ${conditionalClasses({
              light: typeConfig.colors.light.icon,
              dark: typeConfig.colors.dark.icon
            })}
          `} />
        </div>
      </div>
      <div className="ml-3 sm:ml-4 flex-1">
        {notification.title && (
          <p className="text-sm sm:text-base font-bold mb-1">{notification.title}</p>
        )}
        <p className="text-xs sm:text-sm font-medium">{notification.message}</p>
      </div>
      <button
        onClick={() => onRemove(notification.id)}
        className={`
          ml-3 sm:ml-4 transition-colors rounded-full p-1
          ${conditionalClasses({
            light: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
            dark: 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
          })}
        `}
        aria-label="Cerrar notificación"
      >
        <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
});

NotificationItem.displayName = 'NotificationItem';

const NotificationSystem = React.memo(() => {
  const { conditionalClasses } = useThemeClasses();
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className={`fixed top-3 right-3 left-3 sm:top-4 sm:right-4 sm:left-auto z-50 max-w-sm space-y-2 ${conditionalClasses({
      light: '',
      dark: ''
    })}`}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
});

NotificationSystem.displayName = 'NotificationSystem';

export default NotificationSystem;
