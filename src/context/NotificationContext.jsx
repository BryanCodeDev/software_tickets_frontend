import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info', // default type
      duration: 5000, // default 5 seconds
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after duration (except for persistent notifications)
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods for different notification types
  const notifySuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      duration: 4000, // 4 seconds for success
      ...options
    });
  }, [addNotification]);

  const notifyError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: 0, // Don't auto-close errors
      ...options
    });
  }, [addNotification]);

  const notifyWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      duration: 6000, // 6 seconds for warnings
      ...options
    });
  }, [addNotification]);

  const notifyInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      duration: 5000, // 5 seconds for info
      ...options
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
