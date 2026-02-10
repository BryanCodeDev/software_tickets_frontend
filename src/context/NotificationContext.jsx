import React, { createContext, useState, useCallback, useContext, useRef, useEffect } from 'react';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timeoutsRef = useRef(new Map());

  // Limpiar timeout cuando el componente se desmonta
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  const removeTimeout = useCallback((id) => {
    if (timeoutsRef.current.has(id)) {
      clearTimeout(timeoutsRef.current.get(id));
      timeoutsRef.current.delete(id);
    }
  }, []);

  const addNotification = useCallback((notification) => {
    const id = typeof notification.id !== 'undefined' 
      ? notification.id 
      : Date.now() + Math.random();
    
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      title: null,
      ...notification
    };

    setNotifications(prev => {
      // Evitar duplicados
      if (prev.some(n => n.id === id || (n.message === notification.message && n.type === notification.type))) {
        return prev;
      }
      return [...prev, newNotification];
    });

    // Auto-remove after duration (except for persistent notifications)
    if (newNotification.duration && newNotification.duration > 0) {
      const timeoutId = setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
      timeoutsRef.current.set(id, timeoutId);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    removeTimeout(id);
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, [removeTimeout]);

  const clearAllNotifications = useCallback(() => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
    setNotifications([]);
  }, []);

  // Convenience methods for different notification types
  const notifySuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      duration: 4000,
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
      duration: 6000,
      ...options
    });
  }, [addNotification]);

  const notifyInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      duration: 5000,
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
