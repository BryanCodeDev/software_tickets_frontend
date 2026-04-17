import React, { useState, useCallback, useRef, useEffect } from 'react';
import NotificationContext from './NotificationContext.js';

export { NotificationContext };

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timeoutsRef = useRef(new Map());

  // =========================
  // FUNCIONES (ANTES DE USARSE)
  // =========================

  const removeTimeout = useCallback((id) => {
    if (timeoutsRef.current.has(id)) {
      clearTimeout(timeoutsRef.current.get(id));
      timeoutsRef.current.delete(id);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    removeTimeout(id);
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, [removeTimeout]);

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

    // Auto-remove
    if (newNotification.duration && newNotification.duration > 0) {
      const timeoutId = setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);

      timeoutsRef.current.set(id, timeoutId);
    }

    return id;
  }, [removeNotification]);

  const clearAllNotifications = useCallback(() => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
    setNotifications([]);
  }, []);

  // =========================
  // EFFECTS (DESPUÉS DE DEFINIR FUNCIONES)
  // =========================

  // Limpiar timeouts al desmontar
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  // Listener global de errores
  useEffect(() => {
    const handleGlobalApiError = (event) => {
      const { title, message, status } = event.detail;

      let notificationType = 'error';
      if (status === 403) notificationType = 'warning';
      if (status === 409) notificationType = 'warning';

      addNotification({
        type: notificationType,
        title,
        message,
        duration: status === 409 ? 0 : 6000
      });
    };

    window.addEventListener('global-api-error', handleGlobalApiError);
    return () => {
      window.removeEventListener('global-api-error', handleGlobalApiError);
    };
  }, [addNotification]);

  // =========================
  // HELPERS
  // =========================

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
      duration: 0,
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

  // =========================
  // CONTEXT VALUE
  // =========================

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