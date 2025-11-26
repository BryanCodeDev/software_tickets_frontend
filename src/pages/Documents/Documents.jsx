import React, { useState, useEffect, useContext } from 'react';
import { documentsAPI, getServerBaseURL } from '../../api';
import AuthContext from '../../context/AuthContext.jsx';
import { FaFile, FaUpload, FaDownload, FaEdit, FaTrash, FaCheck, FaTimes, FaFileAlt, FaTag, FaSearch, FaSortAmountDown, FaSortAmountUp, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileArchive, FaClock, FaUser, FaFolder, FaFolderOpen, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { NotificationSystem, ConfirmDialog, FilterPanel } from '../../components/common';
import {
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentDeleted,
  onDocumentsListUpdated,
  onFolderCreated,
  onFolderUpdated,
  onFolderDeleted,
  onFoldersListUpdated,
  onDocumentPermissionsUpdated,
  offDocumentCreated,
  offDocumentUpdated,
  offDocumentDeleted,
  offDocumentsListUpdated,
  offFolderCreated,
  offFolderUpdated,
  offFolderDeleted,
  offFoldersListUpdated,
  offDocumentPermissionsUpdated
} from '../../api/socket';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', type: '', category: '', version: '1.0', file: null, isNewVersion: false, parentDocumentId: null, changeDescription: '' });
  const [editFormData, setEditFormData] = useState({ title: '', description: '', type: '', category: '', expiryDate: '' });
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { user } = useContext(AuthContext);

  // NUEVAS FUNCIONALIDADES: Estados para búsqueda, filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Estados para carpetas
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [folderFormData, setFolderFormData] = useState({ name: '', description: '', parentFolderId: null });
  const [editFolderFormData, setEditFolderFormData] = useState({ name: '', description: '' });

  // Estados para permisos
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedItemForPermissions, setSelectedItemForPermissions] = useState(null); // {type: 'document'|'folder', id: number}
  const [permissions, setPermissions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [permissionType, setPermissionType] = useState('read');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Estado para elementos filtrados por permisos
  const [filteredItems, setFilteredItems] = useState({ folders: [], documents: [] });

  // Estado para permisos de escritura en la carpeta actual
  const [canWriteInCurrentFolder, setCanWriteInCurrentFolder] = useState(false);

  useEffect(() => {
    fetchDocuments();
    fetchFolders();
    fetchUsers(); // Cargar usuarios al inicio
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await documentsAPI.fetchUsers();
      setAllUsers(usersData || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setAllUsers([]); // Asegurar que esté vacío en caso de error
      // No mostrar notificación aquí ya que es carga inicial silenciosa
    }
  };

  // WebSocket listeners for real-time document updates
  useEffect(() => {
    const handleDocumentCreated = (document) => {
      fetchDocuments();
      showNotification('Nuevo documento agregado', 'success');
    };

    const handleDocumentUpdated = (data) => {
      fetchDocuments();
      showNotification('Documento actualizado', 'success');
    };

    const handleDocumentDeleted = (documentId) => {
      fetchDocuments();
      showNotification('Documento eliminado', 'success');
    };

    const handleDocumentsListUpdated = () => {
      fetchDocuments();
    };

    const handleFolderCreated = (folder) => {
      fetchFolders();
      showNotification('Nueva carpeta agregada', 'success');
    };

    const handleFolderUpdated = (data) => {
      fetchFolders();
      showNotification('Carpeta actualizada', 'success');
    };

    const handleFolderDeleted = (folderId) => {
      fetchFolders();
      fetchDocuments(); // También recargar documentos por si se eliminó una carpeta con documentos
      showNotification('Carpeta eliminada', 'success');
    };

    const handleFoldersListUpdated = () => {
      fetchFolders();
    };

    const handleDocumentPermissionsUpdated = (data) => {
      // Si estamos en el modal de permisos, recargar los permisos
      if (showPermissionsModal && selectedItemForPermissions) {
        handleOpenPermissionsModal(selectedItemForPermissions, selectedItemForPermissions.type);
      }
      showNotification('Permisos actualizados', 'success');
    };

    // Register WebSocket listeners
    onDocumentCreated(handleDocumentCreated);
    onDocumentUpdated(handleDocumentUpdated);
    onDocumentDeleted(handleDocumentDeleted);
    onDocumentsListUpdated(handleDocumentsListUpdated);
    onFolderCreated(handleFolderCreated);
    onFolderUpdated(handleFolderUpdated);
    onFolderDeleted(handleFolderDeleted);
    onFoldersListUpdated(handleFoldersListUpdated);
    onDocumentPermissionsUpdated(handleDocumentPermissionsUpdated);

    // Cleanup function
    return () => {
      offDocumentCreated(handleDocumentCreated);
      offDocumentUpdated(handleDocumentUpdated);
      offDocumentDeleted(handleDocumentDeleted);
      offDocumentsListUpdated(handleDocumentsListUpdated);
      offFolderCreated(handleFolderCreated);
      offFolderUpdated(handleFolderUpdated);
      offFolderDeleted(handleFolderDeleted);
      offFoldersListUpdated(handleFoldersListUpdated);
      offDocumentPermissionsUpdated(handleDocumentPermissionsUpdated);
    };
  }, [showPermissionsModal, selectedItemForPermissions]);

  const fetchDocuments = async () => {
    try {
      const data = await documentsAPI.fetchDocuments();
      setDocuments(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const data = await documentsAPI.fetchFolders();
      setFolders(data);
    } catch (err) {
      console.error('Error fetching folders:', err);
    }
  };

  // Filtrado y ordenamiento de documentos (solo versiones activas más recientes)
  const filterAndSortDocuments = () => {
    // Filtrar documentos por carpeta actual
    let docsInFolder = documents.filter(doc => {
      if (currentFolder) {
        return doc.folderId === currentFolder.id;
      } else {
        return !doc.folderId; // Documentos en la raíz
      }
    });

    // Agrupar documentos por parentDocumentId o id si no tiene parent
    const grouped = docsInFolder.reduce((acc, doc) => {
      const key = doc.parentDocumentId || doc.id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(doc);
      return acc;
    }, {});

    // Para cada grupo, tomar la versión activa más reciente
    let filtered = Object.values(grouped).map(group => {
      const activeVersions = group.filter(doc => doc.isActive !== false); // Asumir true si no definido
      if (activeVersions.length === 0) return group[0]; // Si ninguno activo, tomar el primero
      return activeVersions.sort((a, b) => parseFloat(b.version) - parseFloat(a.version))[0];
    });

    // Búsqueda por título, descripción, tipo o categoría
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(doc => doc.type?.toLowerCase() === filterType.toLowerCase());
    }


    // Ordenamiento
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'createdAt') {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
      } else if (sortBy === 'version') {
        aVal = parseFloat(aVal || 0);
        bVal = parseFloat(bVal || 0);
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal?.toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  // Calcular el total de documentos únicos (no versiones) en todo el sistema
  const totalUniqueDocuments = [...new Set(documents.map(doc => doc.parentDocumentId || doc.id))].length;

  // Obtener tipos únicos para filtros
  const uniqueTypes = [...new Set(documents.map(doc => doc.type).filter(Boolean))];

  // Función para verificar si el usuario puede ver una carpeta
  const canViewFolder = async (folder) => {
    // Administradores, técnicos y calidad ven todo
    if (user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico' || user?.role?.name === 'Calidad') return true;
    // Creadores ven sus carpetas
    if (folder.createdBy === user?.id) return true;
    // Empleados no ven carpetas sin permisos específicos
    if (user?.role?.name === 'Empleado') {
      const permission = await checkUserPermission(folder, 'folder');
      return permission.hasAccess;
    }
    return false;
  };

  // Función para verificar si el usuario puede ver un documento
  const canViewDocument = async (doc) => {
    // Administradores, técnicos y calidad ven todo
    if (user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico' || user?.role?.name === 'Calidad') return true;
    // Creadores ven sus documentos
    if (doc.createdBy === user?.id) return true;

    // Para empleados, verificar permisos específicos del documento
    if (user?.role?.name === 'Empleado') {
      const docPermission = await checkUserPermission(doc, 'document');
      if (docPermission.hasAccess) return true;

      // Verificar herencia de permisos de carpeta padre
      if (doc.folderId) {
        const parentFolder = folders.find(f => f.id === doc.folderId);
        if (parentFolder) {
          const folderPermission = await checkUserPermission(parentFolder, 'folder');
          if (folderPermission.hasAccess) return true;
        }
      }
    }

    return false;
  };

  // Función para filtrar elementos con permisos
  const getFilteredItems = async () => {
    const baseFilteredDocuments = filterAndSortDocuments();

    // Filtrar carpetas basadas en permisos
    let filteredFolders = folders.filter(folder =>
      currentFolder ? folder.parentFolderId === currentFolder.id : !folder.parentFolderId
    );

    // Filtrar documentos basados en permisos
    let filteredDocuments = [];

    // Para administradores, técnicos y calidad, mostrar todo
     if (user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico' || user?.role?.name === 'Calidad') {
       filteredDocuments = baseFilteredDocuments;
     } else if (user?.role?.name === 'Empleado') {
      // Para empleados, filtrar solo elementos con permisos o creados por ellos
      for (const doc of baseFilteredDocuments) {
        const canView = await canViewDocument(doc);
        if (canView) {
          filteredDocuments.push(doc);
        }
      }

      // Filtrar carpetas para empleados
      const tempFolders = [];
      for (const folder of filteredFolders) {
        const canView = await canViewFolder(folder);
        if (canView) {
          tempFolders.push(folder);
        }
      }
      filteredFolders = tempFolders;
    }

    return {
      folders: filteredFolders,
      documents: filteredDocuments
    };
  };

  // Cargar elementos filtrados cuando cambian los datos
  useEffect(() => {
    const loadFilteredItems = async () => {
      const items = await getFilteredItems();
      setFilteredItems(items);

      // También actualizar permisos de escritura en la carpeta actual
      const canWrite = await canUserWriteInCurrentFolder();
      setCanWriteInCurrentFolder(canWrite);
    };
    loadFilteredItems();
  }, [documents, folders, currentFolder, user]);

  const currentFolders = filteredItems.folders;
  const filteredDocuments = filteredItems.documents;

  // Obtener icono según tipo de archivo
  const getFileIcon = (filePath) => {
    const extension = filePath?.split('.').pop().toLowerCase();
    switch(extension) {
      case 'pdf': return <FaFilePdf className="text-red-600 text-xl" />;
      case 'doc':
      case 'docx': return <FaFileWord className="text-blue-600 text-xl" />;
      case 'xls':
      case 'xlsx': return <FaFileExcel className="text-green-600 text-xl" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <FaFileImage className="text-purple-600 text-xl" />;
      case 'zip':
      case 'rar': return <FaFileArchive className="text-yellow-600 text-xl" />;
      default: return <FaFileAlt className="text-purple-600 text-xl" />;
    }
  };

  // Generar nombre de descarga con título y versión
  const getDownloadName = (doc, version = null) => {
    const title = doc.title;
    const ver = version ? version.version : doc.version;
    const ext = doc.filePath.split('.').pop();
    return `${title}_v${ver}.${ext}`;
  };


  // NUEVA FUNCIONALIDAD: Obtener tiempo relativo
  const getTimeAgo = (date) => {
    if (!date) return 'Desconocido';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Hace un momento';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `Hace ${days}d`;
    const months = Math.floor(days / 30);
    if (months < 12) return `Hace ${months}m`;
    return `Hace ${Math.floor(months / 12)}a`;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('category', formData.category);
    data.append('version', formData.version);
    data.append('file', formData.file);
    data.append('isNewVersion', formData.isNewVersion);
    // Para nueva versión, folderId se determina del documento padre
    // Para nuevo documento, usar el folderId seleccionado o vacío
    if (!formData.isNewVersion) {
      data.append('folderId', formData.folderId || '');
    }
    if (formData.isNewVersion) {
      data.append('parentDocumentId', formData.parentDocumentId);
      data.append('changeDescription', formData.changeDescription);
    }

    try {
      await documentsAPI.uploadDocument(data);
      // WebSocket will handle the list update automatically
      setFormData({ title: '', description: '', type: '', category: '', version: '1.0', file: null, isNewVersion: false, parentDocumentId: null, changeDescription: '', selectedFolderForVersion: null });
      setShowUploadModal(false);
      showNotification('Documento subido exitosamente', 'success');
    } catch (err) {
      showNotification('Error al subir el documento. Por favor, inténtalo de nuevo.', 'error');
      setFormData({ title: '', description: '', type: '', category: '', version: '1.0', file: null, isNewVersion: false, parentDocumentId: null, changeDescription: '' });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    try {
      const folderData = {
        ...folderFormData,
        parentFolderId: currentFolder ? currentFolder.id : null
      };
      await documentsAPI.createFolder(folderData);
      // WebSocket will handle the list update automatically
      setFolderFormData({ name: '', description: '', parentFolderId: null });
      setShowCreateFolderModal(false);
      showNotification('Carpeta creada exitosamente', 'success');
    } catch (err) {
      showNotification('Error al crear la carpeta. Por favor, inténtalo de nuevo.', 'error');
    }
  };

  const handleEnterFolder = (folder) => {
    setCurrentFolder(folder);
  };

  const handleGoBack = () => {
    if (currentFolder && currentFolder.parent) {
      setCurrentFolder(currentFolder.parent);
    } else {
      setCurrentFolder(null);
    }
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setEditFolderFormData({
      name: folder.name,
      description: folder.description || ''
    });
    setShowEditFolderModal(true);
  };

  const handleUpdateFolder = async (e) => {
    e.preventDefault();
    try {
      await documentsAPI.updateFolder(editingFolder.id, editFolderFormData);
      // WebSocket will handle the list update automatically
      setShowEditFolderModal(false);
      showNotification('Carpeta actualizada exitosamente', 'success');
    } catch (err) {
      showNotification('Error al actualizar la carpeta. Por favor, inténtalo de nuevo.', 'error');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar esta carpeta y todos sus contenidos?', async () => {
      try {
        await documentsAPI.deleteFolder(folderId);
        // WebSocket will handle the list update automatically
        if (currentFolder && currentFolder.id === folderId) {
          setCurrentFolder(null);
        }
        showNotification('Carpeta eliminada exitosamente', 'success');
      } catch (err) {
        showNotification(err.response?.data?.error || 'Error al eliminar la carpeta. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  };

  const handleEdit = (doc) => {
    setEditingDocument(doc);
    setEditFormData({
      title: doc.title,
      description: doc.description,
      type: doc.type,
      category: doc.category
    });
    setShowEditModal(true);
  };

  const handleViewHistory = (doc) => {
    const key = doc.parentDocumentId || doc.id;
    const versions = documents.filter(d => (d.parentDocumentId || d.id) === key).sort((a, b) => parseFloat(b.version) - parseFloat(a.version));
    setSelectedDocument({ ...doc, versions });
    setShowHistoryModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await documentsAPI.updateDocument(editingDocument.id, editFormData);
      // WebSocket will handle the list update automatically
      setShowEditModal(false);
      showNotification('Documento actualizado exitosamente', 'success');
    } catch (err) {
      showNotification('Error al actualizar el documento. Por favor, inténtalo de nuevo.', 'error');
    }
  };

  const handleDelete = async (id) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar este documento?', async () => {
      try {
        await documentsAPI.deleteDocument(id);
        // WebSocket will handle the list update automatically
        showNotification('Documento eliminado exitosamente', 'success');
      } catch (err) {
        showNotification('Error al eliminar el documento. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  };

  const handleDeleteVersion = async (versionId) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar esta versión del documento?', async () => {
      try {
        await documentsAPI.deleteDocument(versionId);
        // WebSocket will handle the list update automatically
        showNotification('Versión eliminada exitosamente', 'success');
      } catch (err) {
        showNotification('Error al eliminar la versión. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  };

  const canEdit = (item, type = 'document') => {
    // Administradores, técnicos y calidad pueden editar todo
    if (user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico' || user?.role?.name === 'Calidad') {
      return true;
    }
    // Empleados solo pueden editar sus propios elementos
    if (user?.role?.name === 'Empleado') {
      return item.createdBy === user.id;
    }
    return false;
  };

  // Función adicional para verificar permisos detallados (para casos donde se necesitan permisos específicos)
  const hasWritePermission = async (item, type = 'document') => {
    // Administradores, técnicos y calidad siempre tienen permisos
    if (user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico' || user?.role?.name === 'Calidad') {
      return true;
    }
    // Empleados necesitan permisos específicos
    if (user?.role?.name === 'Empleado') {
      const permission = await checkUserPermission(item, type);
      return permission.hasAccess && permission.permissionType === 'write';
    }
    return false;
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  const handleConfirm = () => {
    if (confirmDialog?.onConfirm) {
      confirmDialog.onConfirm();
    }
    setConfirmDialog(null);
  };

  const handleCancelConfirm = () => {
    setConfirmDialog(null);
  };

  // Funciones de permisos
  const handleOpenPermissionsModal = async (item, type) => {
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

      // Cargar lista de usuarios (siempre intentar cargar para asegurar datos frescos)
      try {
        const usersData = await documentsAPI.fetchUsers();
        setAllUsers(usersData || []);
      } catch (usersErr) {
        console.error('Error loading users in modal:', usersErr);
        showNotification('Error al cargar la lista de usuarios', 'error');
        setAllUsers([]); // Asegurar que esté vacío si hay error
      }
    } catch (err) {
      console.error('Error loading permissions:', err);
      showNotification('Error al cargar permisos', 'error');
      setPermissions([]);
    }
  };

  const handleGrantPermissions = async () => {
    if (selectedUsers.length === 0) {
      showNotification('Selecciona al menos un usuario', 'error');
      return;
    }

    try {
      const result = await documentsAPI.grantDocumentPermissions(
        selectedItemForPermissions.type === 'document' ? selectedItemForPermissions.id : null,
        selectedItemForPermissions.type === 'folder' ? selectedItemForPermissions.id : null,
        selectedUsers,
        permissionType
      );

      showNotification(result.message, 'success');

      // WebSocket will handle the permissions update automatically

      // Limpiar selección
      setSelectedUsers([]);
    } catch (err) {
      showNotification('Error al otorgar permisos', 'error');
    }
  };

  const handleRevokePermission = async (permissionId) => {
    try {
      // Asegurar que permissionId sea un número válido
      const id = parseInt(permissionId, 10);
      if (isNaN(id)) {
        showNotification('ID de permiso inválido', 'error');
        return;
      }

      await documentsAPI.revokeDocumentPermission(id);

      // WebSocket will handle the permissions update automatically

      showNotification('Permiso revocado exitosamente', 'success');
    } catch (err) {
      console.error('Error revoking permission:', err);
      showNotification('Error al revocar permiso', 'error');
    }
  };

  const checkUserPermission = async (item, type) => {
    try {
      const permission = await documentsAPI.checkUserDocumentPermission(
        type === 'document' ? item.id : null,
        type === 'folder' ? item.id : null
      );
      return permission;
    } catch (err) {
      return { hasAccess: false };
    }
  };

  // Función para determinar si el usuario puede editar un documento/carpeta
  const canUserEdit = (item, type) => {
    // Administradores y técnicos pueden editar todo
    if (user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico') {
      return true;
    }

    // Empleados solo pueden editar sus propios elementos
    if (user?.role?.name === 'Empleado') {
      return item.createdBy === user.id;
    }

    return false;
  };

  // Función para determinar si el usuario puede ver un documento/carpeta
  const canUserView = async (item, type) => {
    // Administradores, técnicos y calidad siempre pueden ver todo
    if (user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico' || user?.role?.name === 'Calidad') {
      return true;
    }

    // Creadores siempre pueden ver sus elementos
    if (item.createdBy === user.id) {
      return true;
    }

    // Empleados solo ven elementos con permisos específicos
    if (user?.role?.name === 'Empleado') {
      const permission = await checkUserPermission(item, type);
      return permission.hasAccess;
    }

    return false;
  };

  // Función para determinar si el usuario puede escribir en la carpeta actual
  const canUserWriteInCurrentFolder = async () => {
    // Administradores, técnicos y calidad siempre pueden escribir
    if (user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico' || user?.role?.name === 'Calidad') {
      return true;
    }

    // Si no hay carpeta actual (estamos en raíz), verificar permisos para la raíz
    if (!currentFolder) {
      // Para la raíz, no hay permisos específicos de carpeta, así que empleados no pueden crear
      return false;
    }

    // Para empleados, verificar permisos de escritura en la carpeta actual
    if (user?.role?.name === 'Empleado') {
      const permission = await checkUserPermission(currentFolder, 'folder');
      return permission.hasAccess && permission.permissionType === 'write';
    }

    return false;
  };

  // Funciones para manejo de usuarios en permisos
  const filteredUsers = allUsers.filter(u =>
    u.id !== user?.id &&
    (u.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
     u.username?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
     u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()))
  );

  const handleSelectAllUsers = () => {
    const allUserIds = filteredUsers.map(u => u.id);
    setSelectedUsers(allUserIds);
  };

  const handleDeselectAllUsers = () => {
    setSelectedUsers([]);
  };

  const handleUserToggle = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando documentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50">
      {/* Notification */}
      <NotificationSystem
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        confirmDialog={confirmDialog}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirm}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-linear-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentFolder ? `Carpeta: ${currentFolder.name}` : 'Control de Versiones'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {currentFolder ? currentFolder.description || 'Gestiona versiones de políticas y documentos oficiales' : 'Gestiona versiones de políticas y documentos oficiales'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{totalUniqueDocuments} documentos</span>
              </div>
              {currentFolder && (
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <FaArrowLeft className="mr-2" />
                  Atrás
                </button>
              )}
              {/* Nueva Carpeta - Solo para Administradores y Técnicos */}
              {(user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico') && (
                <button
                  onClick={() => setShowCreateFolderModal(true)}
                  className="inline-flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all mr-3"
                >
                  <FaPlus className="mr-2" />
                  Nueva Carpeta
                </button>
              )}

              {/* Nuevo Documento - Para Administradores, Técnicos y empleados con permisos de escritura */}
              {((user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico') || canWriteInCurrentFolder) && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center px-5 py-2.5 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <FaUpload className="mr-2" />
                  Nuevo Documento
                </button>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Filter Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FilterPanel
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={[
            {
              label: 'Tipo',
              value: filterType,
              onChange: setFilterType,
              type: 'select',
              options: uniqueTypes.map(type => ({ value: type, label: type }))
            }
          ]}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSortBy}
          onSortOrderChange={(order) => setSortOrder(order)}
          sortOptions={[
            { value: 'createdAt', label: 'Fecha de creación' },
            { value: 'title', label: 'Título' },
            { value: 'type', label: 'Tipo' },
            { value: 'version', label: 'Versión' }
          ]}
        />

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 font-medium">
            Mostrando <span className="font-bold text-purple-600">{filteredDocuments.length}</span> documentos
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-purple-50 to-violet-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaFile className="text-purple-600 text-lg" />
                <h2 className="text-lg font-bold text-gray-900">Repositorio de Versiones de Documentos</h2>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
               {currentFolders.length + filteredDocuments.length} elementos
             </span>
            </div>
          </div>

          <div className="p-6">
            {currentFolders.length === 0 && filteredDocuments.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm || filterType !== 'all'
                    ? 'No se encontraron elementos'
                    : 'Sin elementos disponibles'}
                </h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  {searchTerm || filterType !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Comienza agregando tu primera carpeta o documento'}
                </p>
              </div>
            ) : (
              <>
                {/* NUEVA FUNCIONALIDAD: Vista de cuadrícula con carpetas y documentos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Mostrar carpetas primero */}
                    {currentFolders.map((folder) => (
                      <div
                        key={`folder-${folder.id}`}
                        onClick={() => handleEnterFolder(folder)}
                        className="group bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                            <FaFolder className="text-blue-600 text-xl" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-2 text-lg">{folder.name}</h3>
                            {folder.description && (
                              <p className="text-sm text-gray-600 mb-2">{folder.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              {folder.createdAt && (
                                <span className="flex items-center gap-1">
                                  <FaClock className="w-3 h-3" />
                                  {getTimeAgo(folder.createdAt)}
                                </span>
                              )}
                              {folder.creator && (
                                <span className="flex items-center gap-1">
                                  <FaUser className="w-3 h-3" />
                                  {folder.creator.name || folder.creator.username}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                          {canEdit(folder) && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditFolder(folder);
                                }}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg transition-all"
                              >
                                <FaEdit className="mr-1" />
                                Editar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFolder(folder.id);
                                }}
                                className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold rounded-lg transition-all"
                              >
                                <FaTrash className="mr-1" />
                                Eliminar
                              </button>
                            </>
                          )}
                          {canEdit(folder) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenPermissionsModal(folder, 'folder');
                              }}
                              className="inline-flex items-center px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-semibold rounded-lg transition-all"
                            >
                              <FaUser className="mr-1" />
                              Permisos
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Mostrar documentos */}
                    {filteredDocuments.map((doc) => {
                      return (
                        <div
                          key={doc.id}
                          className="group bg-linear-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200"
                        >
                          {/* Document Header with Icon and Info */}
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="w-12 h-12 bg-linear-to-br from-purple-100 to-violet-100 rounded-xl flex items-center justify-center shrink-0">
                              {getFileIcon(doc.filePath)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 mb-2 text-lg">{doc.title}</h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {doc.type && (
                                  <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                                    <FaTag className="mr-1.5 text-xs" />
                                    {doc.type}
                                  </span>
                                )}
                                {doc.category && (
                                  <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-lg">
                                    {doc.category}
                                  </span>
                                )}
                                {doc.version && (
                                  <span className="inline-flex items-center px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg">
                                    v{doc.version}
                                  </span>
                                )}
                              </div>
                              {doc.description && (
                                <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                              )}
                              {/* NUEVA FUNCIONALIDAD: Información adicional */}
                              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                                {doc.createdAt && (
                                  <span className="flex items-center gap-1">
                                    <FaClock className="w-3 h-3" />
                                    {getTimeAgo(doc.createdAt)}
                                  </span>
                                )}
                                {doc.createdByUser && (
                                  <span className="flex items-center gap-1">
                                    <FaUser className="w-3 h-3" />
                                    {doc.createdByUser.name || doc.createdByUser.username}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
  
                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                            <a
                              href={`${getServerBaseURL()}/api/documents/${doc.id}/download`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                            >
                              <FaDownload className="mr-2" />
                              Descargar
                            </a>
                            <button
                              onClick={() => handleViewHistory(doc)}
                              className="inline-flex items-center px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-semibold rounded-lg transition-all"
                            >
                              <FaClock className="mr-2" />
                              Ver Versiones
                            </button>
                            {canEdit(doc) && (
                              <>
                                <button
                                  onClick={() => handleEdit(doc)}
                                  className="inline-flex items-center px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg transition-all"
                                >
                                  <FaEdit className="mr-2" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDelete(doc.id)}
                                  className="inline-flex items-center px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold rounded-lg transition-all"
                                >
                                  <FaTrash className="mr-2" />
                                  Eliminar
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-purple-600 to-violet-600 p-4 lg:p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold text-white">Nuevo Documento</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-5rem)]">
              <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="uploadType"
                    checked={!formData.isNewVersion}
                    onChange={() => setFormData({ ...formData, isNewVersion: false, parentDocumentId: null })}
                    className="mr-2"
                  />
                  Nuevo Documento
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="uploadType"
                    checked={formData.isNewVersion}
                    onChange={() => setFormData({ ...formData, isNewVersion: true })}
                    className="mr-2"
                  />
                  Nueva Versión
                </label>
              </div>

              {formData.isNewVersion && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seleccionar Documento Base <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.parentDocumentId || ''}
                    onChange={(e) => {
                      const selectedDoc = documents.find(doc => doc.id === parseInt(e.target.value));
                      setFormData({
                        ...formData,
                        parentDocumentId: e.target.value,
                        title: selectedDoc ? selectedDoc.title : '',
                        type: selectedDoc ? selectedDoc.type : '',
                        category: selectedDoc ? selectedDoc.category : '',
                        version: selectedDoc ? (parseFloat(selectedDoc.version) + 0.1).toFixed(1) : '1.0'
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required={formData.isNewVersion}
                  >
                    <option value="">Seleccionar documento...</option>
                    {documents
                      .filter(doc => doc.isActive)
                      .sort((a, b) => {
                        // Ordenar por carpeta primero, luego por título
                        const aFolder = folders.find(f => f.id === a.folderId)?.name || 'Raíz';
                        const bFolder = folders.find(f => f.id === b.folderId)?.name || 'Raíz';
                        if (aFolder !== bFolder) return aFolder.localeCompare(bFolder);
                        return a.title.localeCompare(b.title);
                      })
                      .map((doc) => {
                        const folderName = folders.find(f => f.id === doc.folderId)?.name || 'Raíz';
                        return (
                          <option key={doc.id} value={doc.id}>
                            [{folderName}] {doc.title} (v{doc.version})
                          </option>
                        );
                      })}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del documento"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                    disabled={formData.isNewVersion}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Versión</label>
                  <input
                    type="text"
                    placeholder="Ej: 1.0"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                  <input
                    type="text"
                    placeholder="Ej: Manual, Política"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    disabled={formData.isNewVersion}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                  <input
                    type="text"
                    placeholder="Ej: Recursos Humanos"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    disabled={formData.isNewVersion}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                  <textarea
                    placeholder="Descripción del contenido del documento"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    rows="3"
                  />
                </div>

                {formData.isNewVersion && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción de Cambios</label>
                    <textarea
                      placeholder="Describe los cambios en esta versión"
                      value={formData.changeDescription}
                      onChange={(e) => setFormData({ ...formData, changeDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      rows="2"
                    />
                  </div>
                )}

                {!formData.isNewVersion && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Carpeta</label>
                    <select
                      value={formData.folderId || ''}
                      onChange={(e) => setFormData({ ...formData, folderId: e.target.value || null })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Seleccionar carpeta (opcional)</option>
                      {folders.map((folder) => (
                        <option key={folder.id} value={folder.id}>{folder.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Archivo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 file:cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={uploadLoading}
                >
                  {uploadLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <FaUpload className="mr-2" />
                      Subir Documento
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-purple-600 to-violet-600 p-4 lg:p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold text-white">Editar Documento</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del documento"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                  <input
                    type="text"
                    placeholder="Ej: Manual, Política"
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                  <input
                    type="text"
                    placeholder="Ej: Recursos Humanos"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                  <textarea
                    placeholder="Descripción del contenido del documento"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    rows="4"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Actualizar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-purple-600 to-violet-600 p-4 lg:p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold text-white">Historial de Versiones: {selectedDocument.title}</h2>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {selectedDocument.versions.map((version, index) => (
                  <div key={version.id} className={`p-4 rounded-xl border ${version.isActive ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-gray-900">Versión {version.version}</span>
                        {version.isActive && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Activa</span>}
                        <span className="text-sm text-gray-500">{getTimeAgo(version.createdAt)}</span>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`${getServerBaseURL()}/api/documents/${version.id}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-all"
                        >
                          <FaDownload className="mr-1" />
                          Descargar
                        </a>
                        {(user.role?.name === 'Administrador' || user.role?.name === 'Técnico') && (
                          <button
                            onClick={() => handleDeleteVersion(version.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all"
                          >
                            <FaTrash className="mr-1" />
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                    {version.changeDescription && (
                      <p className="text-sm text-gray-600 mb-2"><strong>Cambios:</strong> {version.changeDescription}</p>
                    )}
                    {version.description && (
                      <p className="text-sm text-gray-600"><strong>Descripción:</strong> {version.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-green-600 to-green-700 p-4 lg:p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold text-white">Nueva Carpeta</h2>
                <button
                  onClick={() => setShowCreateFolderModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateFolder} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nombre de la carpeta"
                  value={folderFormData.name}
                  onChange={(e) => setFolderFormData({ ...folderFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea
                  placeholder="Descripción de la carpeta (opcional)"
                  value={folderFormData.description}
                  onChange={(e) => setFolderFormData({ ...folderFormData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  rows="3"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateFolderModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-linear-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Crear Carpeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Folder Modal */}
      {showEditFolderModal && editingFolder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-blue-600 to-blue-700 p-4 lg:p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold text-white">Editar Carpeta</h2>
                <button
                  onClick={() => setShowEditFolderModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateFolder} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nombre de la carpeta"
                  value={editFolderFormData.name}
                  onChange={(e) => setEditFolderFormData({ ...editFolderFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea
                  placeholder="Descripción de la carpeta (opcional)"
                  value={editFolderFormData.description}
                  onChange={(e) => setEditFolderFormData({ ...editFolderFormData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows="3"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditFolderModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Actualizar Carpeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedItemForPermissions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-purple-600 to-violet-600 p-4 lg:p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold text-white">Gestionar Permisos</h2>
                <button
                  onClick={() => setShowPermissionsModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
              {/* Current Permissions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Permisos Actuales</h3>
                {permissions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay permisos asignados</p>
                ) : (
                  <div className="space-y-3">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <FaUser className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {permission.user?.name || permission.user?.username}
                            </p>
                            <p className="text-sm text-gray-500">{permission.user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            permission.permissionType === 'write'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {permission.permissionType === 'write' ? 'Lectura y Escritura' : 'Solo Lectura'}
                          </span>
                          <button
                            onClick={() => handleRevokePermission(permission.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Revocar permiso"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Grant New Permissions */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Otorgar Nuevos Permisos</h3>

                {/* Permission Type */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Permiso</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="permissionType"
                        value="read"
                        checked={permissionType === 'read'}
                        onChange={(e) => setPermissionType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Solo Lectura (ver y descargar)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="permissionType"
                        value="write"
                        checked={permissionType === 'write'}
                        onChange={(e) => setPermissionType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Lectura y Escritura (crear, editar, eliminar)</span>
                    </label>
                  </div>
                </div>

                {/* User Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Seleccionar Usuarios</label>

                  {/* Search Bar */}
                  <div className="mb-3 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar usuarios por nombre, usuario o email..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                  </div>

                  {/* Selection Controls */}
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={handleSelectAllUsers}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-md hover:bg-purple-200 transition-colors"
                    >
                      Seleccionar Todos
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllUsers}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Deseleccionar Todos
                    </button>
                    <span className="text-xs text-gray-500 self-center ml-auto">
                      {selectedUsers.length} seleccionados
                    </span>
                  </div>

                  {/* Users List */}
                  <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        {userSearchTerm ? (
                          `No se encontraron usuarios para "${userSearchTerm}"`
                        ) : allUsers.length === 0 ? (
                          <div>
                            <p>No hay usuarios disponibles</p>
                            <p className="text-xs mt-1">Verifica que tengas permisos para ver usuarios</p>
                          </div>
                        ) : (
                          'No hay usuarios que coincidan con los criterios'
                        )}
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {filteredUsers.map((u) => (
                          <label key={u.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(u.id)}
                              onChange={() => handleUserToggle(u.id)}
                              className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-purple-600">
                                  {(u.name || u.username || 'U').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate">
                                  {u.name || u.username || 'Usuario sin nombre'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {u.email || 'Sin email'}
                                </p>
                                {u.Role && (
                                  <p className="text-xs text-purple-600 truncate">
                                    {u.Role.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowPermissionsModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGrantPermissions}
                    disabled={selectedUsers.length === 0}
                    className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Otorgar Permisos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
