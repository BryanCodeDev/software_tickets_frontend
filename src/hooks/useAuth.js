import { useContext, useCallback } from 'react';
import AuthContext from '../context/AuthContext';

export const useAuth = () => {
  const {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    canAccess
  } = useContext(AuthContext);

  // Función mejorada para verificar permisos
  const checkPermission = useCallback((module, action) => {
    if (!user) return false;

    // Check if user has permissions array
    if (!user.permissions || !Array.isArray(user.permissions)) {
      return false;
    }

    // Special exception for purchase_requests module
    if (module === 'purchase_requests' && action === 'view_all') {
      const userRole = user.role?.name;
      const allowedRoles = ['Administrador', 'Técnico', 'Coordinadora Administrativa', 'Jefe'];
      if (allowedRoles.includes(userRole)) {
        return true;
      }
    }

    // Check if user has the specific permission
    const permissionString = `${module}:${action}`;
    return user.permissions.some(permission => `${permission.module}:${permission.action}` === permissionString);
  }, [user]);

  // Función para verificar si el usuario puede editar un ticket
  const canEditTicket = useCallback((ticket) => {
    if (!user) return false;

    const userRole = user.role?.name;
    if (userRole === 'Administrador' || userRole === 'Técnico') {
      return true;
    }
    if (userRole === 'Empleado') {
      return ticket.userId === user.id;
    }
    return false;
  }, [user]);

  // Función para verificar si el usuario puede eliminar un ticket
  const canDeleteTicket = useCallback((ticket) => {
    if (!user) return false;

    const userRole = user.role?.name;
    if (userRole === 'Administrador') {
      return true;
    }
    if (userRole === 'Técnico') {
      return (ticket.userId === user.id || ticket.assignedTo === user.id) && ticket.status?.toLowerCase() === 'cerrado';
    }
    if (userRole === 'Empleado') {
      return ticket.userId === user.id;
    }
    return false;
  }, [user]);

  // Función para verificar si el usuario puede enviar mensajes
  const canSendMessage = useCallback((ticket) => {
    if (!user) return false;

    const userRole = user.role?.name;
    if (userRole === 'Administrador' || userRole === 'Técnico') {
      return true;
    }
    if (userRole === 'Empleado') {
      return ticket.userId === user.id;
    }
    return false;
  }, [user]);

  return {
    // Propiedades del contexto original
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    canAccess,

    // Funciones mejoradas
    checkPermission,
    canEditTicket,
    canDeleteTicket,
    canSendMessage,

    // Utilidades adicionales
    userRole: user?.role?.name,
    userId: user?.id,
    userName: user?.name || user?.username,
    isAdmin: user?.role?.name === 'Administrador',
    isTechnician: user?.role?.name === 'Técnico',
    isEmployee: user?.role?.name === 'Empleado'
  };
};