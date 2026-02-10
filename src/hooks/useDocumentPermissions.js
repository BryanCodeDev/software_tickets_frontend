import { useState, useCallback, useMemo, useEffect, useRef, useContext } from 'react';
import { documentsAPI } from '../api';
import AuthContext from '../context/AuthContext.jsx';

// Roles con permisos totales
const FULL_ACCESS_ROLES = ['Administrador', 'Técnico', 'Calidad'];

export const useDocumentPermissions = () => {
  const { user } = useContext(AuthContext);
  
  // Caché para permisos de documentos/carpetas
  const permissionsCache = useRef(new Map());
  
  // Estado para almacenar todos los permisos del usuario
  const [userPermissions, setUserPermissions] = useState({
    documents: new Map(),
    folders: new Map()
  });

  // Función para obtener la clave de caché
  const getCacheKey = (type, id) => `${type}-${id}`;

  // Función para verificar si el usuario es creador
  const isOwner = useCallback((item) => {
    return item.createdBy === user?.id;
  }, [user]);

  // Función para verificar si el usuario tiene rol con permisos totales
  const hasFullAccess = useCallback(() => {
    return FULL_ACCESS_ROLES.includes(user?.role?.name);
  }, [user]);

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
    const type = item.parentFolderId !== undefined || item.name ? 'folder' : 'document';
    const permission = await checkPermission(item, type);
    return permission.hasAccess && permission.permissionType === 'write';
  }, [checkPermission]);

  // Función para verificar si puede ver
  const canView = useCallback(async (item) => {
    const type = item.parentFolderId !== undefined || item.name ? 'folder' : 'document';
    const permission = await checkPermission(item, type);
    return permission.hasAccess;
  }, [checkPermission]);

  // Función para verificar si puede gestionar permisos
  const canManagePermissions = useCallback(() => {
    return hasFullAccess();
  }, [hasFullAccess]);

  // Función para limpiar caché cuando se actualizan permisos
  const clearPermissionsCache = useCallback(() => {
    permissionsCache.current.clear();
  }, []);

  // Función para invalidar un permiso específico
  const invalidatePermission = useCallback((type, id) => {
    const cacheKey = getCacheKey(type, id);
    permissionsCache.current.delete(cacheKey);
  }, []);

  // Calcular permisos para múltiples elementos de forma eficiente
  const calculateBulkPermissions = useCallback(async (items, type) => {
    const permissions = new Map();
    
    for (const item of items) {
      const permission = await checkPermission(item, type);
      permissions.set(item.id, permission);
    }
    
    return permissions;
  }, [checkPermission]);

  // Efecto para limpiar caché cuando cambia el usuario
  useEffect(() => {
    if (user?.id) {
      clearPermissionsCache();
    }
  }, [user?.id, clearPermissionsCache]);

  return {
    // Funciones de verificación
    canEdit,
    canView,
    canManagePermissions,
    hasFullAccess,
    isOwner,
    
    // Funciones de caché
    clearPermissionsCache,
    invalidatePermission,
    
    // Funciones bulk
    calculateBulkPermissions,
    
    // Acceso directo al caché (solo lectura)
    permissionsCache: permissionsCache.current
  };
};

export default useDocumentPermissions;
