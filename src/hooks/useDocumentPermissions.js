import { useCallback, useEffect, useRef, useContext } from 'react';
import { documentsAPI } from '../api';
import AuthContext from '../context/AuthContext';

export const useDocumentPermissions = () => {
  const { user } = useContext(AuthContext);
  
  // Caché para permisos de documentos/carpetas
  const permissionsCache = useRef(new Map());
  
  // Función para verificar si el usuario tiene rol con permisos totales
  const hasFullAccess = useCallback(() => {
    if (!user?.role?.name) return false;
    const fullAccessRoles = ['Administrador', 'Técnico', 'Calidad'];
    return fullAccessRoles.includes(user.role.name);
  }, [user]);
  
  // Función para verificar si el usuario es creador
  const isOwner = useCallback((item) => {
    return item.createdBy === user?.id;
  }, [user]);
  
  // Función para obtener la clave de caché
  const getCacheKey = (type, id) => `${type}-${id}`;
  
  // Función para verificar permisos con caché
  const checkPermission = useCallback(async (item, type) => {
    const cacheKey = getCacheKey(type, item.id);
    
    // Verificar caché primero
    if (permissionsCache.current.has(cacheKey)) {
      return permissionsCache.current.get(cacheKey);
    }
    
    try {
      // Verificar permisos de forma sincrona primero (más rápido)
      if (hasFullAccess()) {
        const result = { hasAccess: true, permissionType: 'write', isAdmin: true };
        permissionsCache.current.set(cacheKey, result);
        return result;
      }
      
      if (isOwner(item)) {
        const result = { hasAccess: true, permissionType: 'write', isOwner: true };
        permissionsCache.current.set(cacheKey, result);
        return result;
      }
      
      // Si no es owner ni admin, verificar con el backend
      const permission = await documentsAPI.checkUserDocumentPermission(
        type === 'document' ? item.id : null,
        type === 'folder' ? item.id : null
      );
      
      permissionsCache.current.set(cacheKey, permission);
      return permission;
    } catch (error) {
      console.error('Error checking permission:', error);
      return { hasAccess: false, permissionType: null };
    }
  }, [user, hasFullAccess, isOwner]);
  
  // Función para verificar si puede editar
  const canEdit = useCallback(async (item) => {
    const itemType = item.parentFolderId !== undefined || item.name ? 'folder' : 'document';
    const permission = await checkPermission(item, itemType);
    return permission.hasAccess && permission.permissionType === 'write';
  }, [checkPermission]);
  
  // Función para verificar si puede ver
  const canView = useCallback(async (item) => {
    const itemType = item.parentFolderId !== undefined || item.name ? 'folder' : 'document';
    const permission = await checkPermission(item, itemType);
    return permission.hasAccess;
  }, [checkPermission]);
  
  // Función para verificar si puede gestionar permisos
  const canManagePermissions = useCallback(() => {
    return hasFullAccess();
  }, [hasFullAccess]);
  
  // Función para limpiar caché
  const clearPermissionsCache = useCallback(() => {
    permissionsCache.current.clear();
  }, []);
  
  // Función para invalidar un permiso específico
  const invalidatePermission = useCallback((type, id) => {
    const cacheKey = getCacheKey(type, id);
    permissionsCache.current.delete(cacheKey);
  }, []);
  
  // Efecto para limpiar caché cuando cambia el usuario
  useEffect(() => {
    if (user?.id) {
      clearPermissionsCache();
    }
  }, [user?.id, clearPermissionsCache]);
  
  // Función para obtener el caché actual de forma segura
  const getPermissionsCache = useCallback(() => {
    return permissionsCache.current;
  }, []);

  return {
    canEdit,
    canView,
    canManagePermissions,
    hasFullAccess,
    isOwner,
    clearPermissionsCache,
    invalidatePermission,
    getPermissionsCache
  };
};

export default useDocumentPermissions;
