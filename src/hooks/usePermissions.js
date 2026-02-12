import { useState, useCallback, useMemo } from 'react';
import { documentsAPI } from '../api';

export const usePermissions = (user) => {
  const [permissions, setPermissions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [permissionType, setPermissionType] = useState('read');
  const [userSearchTerm, setUserSearchTerm] = useState('');

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

  const handleOpenPermissionsModal = useCallback(async (item, type, setSelectedItemForPermissions, setShowPermissionsModal, showNotification) => {
    setSelectedItemForPermissions({ type, id: item.id });
    setShowPermissionsModal(true);
    setUserSearchTerm(''); // Limpiar búsqueda
    setSelectedUsers([]); // Limpiar selección

    try {
      // Cargar permisos existentes
      const permissionsData = await documentsAPI.getDocumentPermissions(
        type === 'document' ? item.id : null,
        type === 'folder' ? item.id : null
      );
      setPermissions(permissionsData);

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

  const handleGrantPermissions = useCallback(async (selectedItemForPermissions, notifyError) => {
    if (selectedUsers.length === 0) {
      notifyError('Selecciona al menos un usuario');
      return;
    }

    try {
      await documentsAPI.grantDocumentPermissions(
        selectedItemForPermissions.type === 'document' ? selectedItemForPermissions.id : null,
        selectedItemForPermissions.type === 'folder' ? selectedItemForPermissions.id : null,
        selectedUsers,
        permissionType
      );

      // Limpiar selección
      setSelectedUsers([]);
    } catch {
      notifyError('Error al otorgar permisos');
    }
  }, [selectedUsers, permissionType]);

  const handleRevokePermission = useCallback(async (permissionId, notifyError) => {
    try {
      const id = parseInt(permissionId, 10);
      if (isNaN(id)) {
        notifyError('ID de permiso inválido');
        return;
      }

      await documentsAPI.revokeDocumentPermission(id);
    } catch (err) {
      console.error('Error revoking permission:', err);
      notifyError('Error al revocar permiso');
    }
  }, []);

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
    handleUserToggle
  };
};