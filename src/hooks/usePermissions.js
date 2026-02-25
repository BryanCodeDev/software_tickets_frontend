import { useState, useCallback, useMemo, useEffect } from 'react';
import { documentsAPI } from '../api';
import { onDocumentPermissionsUpdated, offDocumentPermissionsUpdated } from '../api/socket';

export const usePermissions = (user) => {
  const [permissions, setPermissions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [permissionType, setPermissionType] = useState('read');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedItemForPermissions, setSelectedItemForPermissions] = useState(null);

  // Función para recargar permisos
  const reloadPermissions = useCallback(async (showNotification = null) => {
    if (!selectedItemForPermissions) return;
    
    try {
      const permissionsData = await documentsAPI.getDocumentPermissions(
        selectedItemForPermissions.type === 'document' ? selectedItemForPermissions.id : null,
        selectedItemForPermissions.type === 'folder' ? selectedItemForPermissions.id : null
      );
      setPermissions(permissionsData || []);
    } catch (err) {
      console.error('Error reloading permissions:', err);
      if (showNotification) {
        showNotification('Error al actualizar permisos', 'error');
      }
    }
  }, [selectedItemForPermissions]);

  // Escuchar eventos WebSocket de actualización de permisos
  useEffect(() => {
    const handlePermissionsUpdated = ({ documentId, folderId }) => {
      // Verificar si los permisos actualizados son relevantes para el elemento seleccionado
      if (selectedItemForPermissions) {
        const isRelevant = (selectedItemForPermissions.type === 'document' && documentId === selectedItemForPermissions.id) ||
                          (selectedItemForPermissions.type === 'folder' && folderId === selectedItemForPermissions.id);
        
        if (isRelevant) {
          console.log('Permissions updated via WebSocket, reloading...');
          reloadPermissions();
        }
      }
    };

    onDocumentPermissionsUpdated(handlePermissionsUpdated);

    return () => {
      offDocumentPermissionsUpdated(handlePermissionsUpdated);
    };
  }, [selectedItemForPermissions, reloadPermissions]);

  const fetchUsers = useCallback(async () => {
    try {
      const usersData = await documentsAPI.fetchUsers();
      setAllUsers(usersData || []);
    } catch {
      // Error silencioso - usuarios sin permiso para ver otros usuarios
      setAllUsers([]);
    }
  }, []);

  const checkUserPermission = useCallback(async (item, type) => {
    try {
      const permission = await documentsAPI.checkUserDocumentPermission(
        type === 'document' ? item.id : null,
        type === 'folder' ? item.id : null
      );
      return permission;
    } catch {
      return { hasAccess: false };
    }
  }, []);

  const handleOpenPermissionsModal = useCallback(async (item, type, setSelectedItemForPermissionsFn, setShowPermissionsModal, showNotification) => {
    // Guardar el item completo incluyendo el nombre
    const selectedItem = { 
      type, 
      id: item.id,
      name: item.name || item.title || null
    };
    setSelectedItemForPermissions(selectedItem);
    
    if (setSelectedItemForPermissionsFn) {
      setSelectedItemForPermissionsFn(selectedItem);
    }
    
    setShowPermissionsModal(true);
    setUserSearchTerm(''); // Limpiar búsqueda
    setSelectedUsers([]); // Limpiar selección

    try {
      // Cargar permisos existentes
      const permissionsData = await documentsAPI.getDocumentPermissions(
        type === 'document' ? item.id : null,
        type === 'folder' ? item.id : null
      );
      setPermissions(permissionsData || []);

      // Cargar lista de usuarios
      try {
        const usersData = await documentsAPI.fetchUsers();
        setAllUsers(usersData || []);
      } catch (usersErr) {
        console.error('Error loading users in modal:', usersErr);
        showNotification('Error al cargar la lista de usuarios', 'error');
        setAllUsers([]);
      }
    } catch (err) {
      console.error('Error loading permissions:', err);
      showNotification('Error al cargar permisos', 'error');
      setPermissions([]);
    }
  }, []);

  const handleGrantPermissions = useCallback(async (selectedItemForPermissionsParam, notifyError, showNotification = null) => {
    const item = selectedItemForPermissionsParam || selectedItemForPermissions;
    
    if (!item) {
      notifyError('No hay elemento seleccionado');
      return;
    }

    if (selectedUsers.length === 0) {
      notifyError('Selecciona al menos un usuario');
      return;
    }

    try {
      await documentsAPI.grantDocumentPermissions(
        item.type === 'document' ? item.id : null,
        item.type === 'folder' ? item.id : null,
        selectedUsers,
        permissionType
      );

      // Recargar permisos después de otorgar
      await reloadPermissions(showNotification);
      
      // Recargar lista de usuarios para actualizar la lista de filtrados
      await fetchUsers();

      // Limpiar selección
      setSelectedUsers([]);
    } catch (err) {
      console.error('Error granting permissions:', err);
      notifyError('Error al otorgar permisos: ' + (err.response?.data?.error || err.message));
    }
  }, [selectedUsers, permissionType, selectedItemForPermissions, reloadPermissions, fetchUsers]);

  const handleRevokePermission = useCallback(async (permissionId, notifyError, showNotification = null) => {
    try {
      // Verificar si es un formato de ID compuesto (documentId:userId)
      if (typeof permissionId === 'string' && permissionId.includes(':')) {
        const [documentId, userId] = permissionId.split(':');
        const parsedDocId = parseInt(documentId, 10);
        const parsedUserId = parseInt(userId, 10);
        
        if (isNaN(parsedDocId) || isNaN(parsedUserId)) {
          notifyError('ID de permiso inválido');
          return;
        }

        // Usar la nueva ruta que acepta documentId y userId
        await documentsAPI.revokeDocumentPermissionByIds(parsedDocId, parsedUserId);
      } else {
        // Es un ID numérico normal
        const id = parseInt(permissionId, 10);
        if (isNaN(id)) {
          notifyError('ID de permiso inválido');
          return;
        }

        await documentsAPI.revokeDocumentPermission(id);
      }

      // Recargar permisos después de revocar
      await reloadPermissions(showNotification);
      
      // Recargar lista de usuarios para actualizar la lista de filtrados
      await fetchUsers();
    } catch (err) {
      console.error('Error revoking permission:', err);
      notifyError('Error al revocar permiso: ' + (err.response?.data?.error || err.message));
    }
  }, [reloadPermissions, fetchUsers]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u =>
      u.id !== user?.id &&
      !permissions.some(p => p.user?.id === u.id) &&
      (u.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
       u.username?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
       u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()))
    );
  }, [allUsers, permissions, userSearchTerm, user?.id]);

  const handleSelectAllUsers = useCallback(() => {
    const allUserIds = filteredUsers.map(u => u.id);
    setSelectedUsers(allUserIds);
  }, [filteredUsers]);

  const handleDeselectAllUsers = useCallback(() => {
    setSelectedUsers([]);
  }, []);

  const handleUserToggle = useCallback((userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  return {
    permissions,
    setPermissions,
    allUsers,
    setAllUsers,
    selectedUsers,
    setSelectedUsers,
    permissionType,
    setPermissionType,
    userSearchTerm,
    setUserSearchTerm,
    filteredUsers,
    fetchUsers,
    checkUserPermission,
    handleOpenPermissionsModal,
    handleGrantPermissions,
    handleRevokePermission,
    handleSelectAllUsers,
    handleDeselectAllUsers,
    handleUserToggle,
    setSelectedItemForPermissions,
    reloadPermissions
  };
};
