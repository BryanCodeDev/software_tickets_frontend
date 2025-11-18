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
  const checkPermission = useCallback((permission) => {
    if (!user) return false;

    // Lógica de permisos basada en roles
    const rolePermissions = {
      Administrador: ['all'],
      Tecnico: ['read_tickets', 'update_tickets', 'read_inventory', 'update_inventory', 'read_credentials', 'manage_credentials'],
      Empleado: ['read_tickets', 'create_tickets', 'read_inventory']
    };

    const userPermissions = rolePermissions[user.role?.name] || [];
    return userPermissions.includes('all') || userPermissions.includes(permission);
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