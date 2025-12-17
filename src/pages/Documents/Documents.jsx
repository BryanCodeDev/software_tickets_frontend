import React, { useState, useEffect, useContext, useCallback, useMemo, Suspense, lazy } from 'react';
import { documentsAPI, getServerBaseURL } from '../../api';
import AuthContext from '../../context/AuthContext.jsx';
import { useThemeClasses } from '../../hooks/useThemeClasses.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import { useDocumentFilters } from '../../hooks/useDocumentFilters.js';
import { usePermissions } from '../../hooks/usePermissions.js';
import { useFolders } from '../../hooks/useFolders.js';
import { FaFile, FaUpload, FaDownload, FaEdit, FaTrash, FaCheck, FaTimes, FaFileAlt, FaTag, FaSearch, FaSortAmountDown, FaSortAmountUp, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileArchive, FaClock, FaUser, FaFolder, FaFolderOpen, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { ConfirmDialog, FilterPanel } from '../../components/common';

// Lazy load modals
const UploadModal = lazy(() => import('./modals/UploadModal.jsx'));
const EditModal = lazy(() => import('./modals/EditModal.jsx'));
const HistoryModal = lazy(() => import('./modals/HistoryModal.jsx'));
const CreateFolderModal = lazy(() => import('./modals/CreateFolderModal.jsx'));
const EditFolderModal = lazy(() => import('./modals/EditFolderModal.jsx'));
const PermissionsModal = lazy(() => import('./modals/PermissionsModal.jsx'));
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
  const { conditionalClasses } = useThemeClasses();
  const { notifySuccess, notifyError, notifyWarning, notifyInfo } = useNotifications();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [forms, setForms] = useState({
    upload: { title: '', description: '', type: '', category: '', version: '1.0', file: null, isNewVersion: false, parentDocumentId: null, changeDescription: '' },
    edit: { title: '', description: '', type: '', category: '', expiryDate: '' }
  });
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { user } = useContext(AuthContext);

  // Estados para búsqueda, filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Estados para permisos
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedItemForPermissions, setSelectedItemForPermissions] = useState(null);

  // Estado para elementos filtrados por permisos
  const [filteredItems, setFilteredItems] = useState({ folders: [], documents: [] });

  // Estado para permisos de escritura en la carpeta actual
  const [canWriteInCurrentFolder, setCanWriteInCurrentFolder] = useState(false);

  // Función para mostrar diálogo de confirmación (definida antes de los hooks)
  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  // Custom hooks
  const foldersHook = useFolders(showConfirmDialog, notifyError);
  const permissionsHook = usePermissions(user);
  const {
    folders,
    currentFolder,
    showCreateFolderModal,
    setShowCreateFolderModal,
    showEditFolderModal,
    setShowEditFolderModal,
    folderFormData,
    setFolderFormData,
    editFolderFormData,
    setEditFolderFormData,
    fetchFolders,
    handleCreateFolder: handleCreateFolderHook,
    handleEnterFolder,
    handleGoBack,
    handleEditFolder,
    handleUpdateFolder: handleUpdateFolderHook,
    handleDeleteFolder: handleDeleteFolderHook
  } = foldersHook;

  const {
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
    handleOpenPermissionsModal: handleOpenPermissionsModalHook,
    handleGrantPermissions: handleGrantPermissionsHook,
    handleRevokePermission: handleRevokePermissionHook,
    handleSelectAllUsers,
    handleDeselectAllUsers,
    handleUserToggle
  } = permissionsHook;

  // Usar hook de filtros
  const filteredDocumentsList = useDocumentFilters(documents, searchTerm, filterType, sortBy, sortOrder, currentFolder);

  useEffect(() => {
    fetchDocuments();
    fetchFolders();
    fetchUsers(); // Cargar usuarios al inicio
  }, [fetchFolders, fetchUsers]);

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
    const baseFilteredDocuments = filteredDocumentsList;

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
    };
    loadFilteredItems();
  }, [documents, folders, currentFolder, user, filteredDocumentsList]);

  // Actualizar permisos de escritura cuando cambia la carpeta actual o el usuario
  useEffect(() => {
    const updateWritePermissions = async () => {
      const canWrite = await canUserWriteInCurrentFolder();
      setCanWriteInCurrentFolder(canWrite);
    };
    updateWritePermissions();
  }, [currentFolder, user]);

  // WebSocket listeners for real-time document updates
  useEffect(() => {
    const handleDocumentCreated = (document) => {
      fetchDocuments();
      notifySuccess('Nuevo documento agregado');
    };

    const handleDocumentUpdated = (data) => {
      fetchDocuments();
      notifySuccess('Documento actualizado');
    };

    const handleDocumentDeleted = (documentId) => {
      fetchDocuments();
      notifySuccess('Documento eliminado');
    };

    const handleDocumentsListUpdated = () => {
      fetchDocuments();
    };

    const handleFolderCreated = (folder) => {
      fetchFolders();
      notifySuccess('Nueva carpeta agregada');
    };

    const handleFolderUpdated = (data) => {
      fetchFolders();
      notifySuccess('Carpeta actualizada');
    };

    const handleFolderDeleted = (folderId) => {
      fetchFolders();
      fetchDocuments(); // También recargar documentos por si se eliminó una carpeta con documentos
      notifySuccess('Carpeta eliminada');
    };

    const handleFoldersListUpdated = () => {
      fetchFolders();
    };

    const handleDocumentPermissionsUpdated = (data) => {
      // Si estamos en el modal de permisos, recargar los permisos
      if (showPermissionsModal && selectedItemForPermissions) {
        handleOpenPermissionsModal(selectedItemForPermissions, selectedItemForPermissions.type);
      }
      notifySuccess('Permisos actualizados');
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



  // Calcular el total de documentos únicos (no versiones) en todo el sistema
  const totalUniqueDocuments = [...new Set(documents.map(doc => doc.parentDocumentId || doc.id))].length;

  // Obtener tipos únicos para filtros
  const uniqueTypes = [...new Set(documents.map(doc => doc.type).filter(Boolean))];

  const currentFolders = filteredItems.folders;

  // Obtener icono según tipo de archivo
  const getFileIcon = (filePath) => {
    const extension = filePath?.split('.').pop().toLowerCase();
    switch(extension) {
      case 'pdf': return <FaFilePdf className={`text-xl ${conditionalClasses({
        light: 'text-red-600',
        dark: 'text-red-400'
      })}`} />;
      case 'doc':
      case 'docx': return <FaFileWord className={`text-xl ${conditionalClasses({
        light: 'text-blue-600',
        dark: 'text-blue-400'
      })}`} />;
      case 'xls':
      case 'xlsx': return <FaFileExcel className={`text-xl ${conditionalClasses({
        light: 'text-green-600',
        dark: 'text-green-400'
      })}`} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <FaFileImage className={`text-xl ${conditionalClasses({
        light: 'text-[#662d91]',
        dark: 'text-purple-400'
      })}`} />;
      case 'zip':
      case 'rar': return <FaFileArchive className={`text-xl ${conditionalClasses({
        light: 'text-yellow-600',
        dark: 'text-yellow-400'
      })}`} />;
      default: return <FaFileAlt className={`text-xl ${conditionalClasses({
        light: 'text-[#662d91]',
        dark: 'text-purple-400'
      })}`} />;
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
    data.append('title', forms.upload.title);
    data.append('description', forms.upload.description);
    data.append('type', forms.upload.type);
    data.append('category', forms.upload.category);
    data.append('version', forms.upload.version);
    data.append('file', forms.upload.file);
    data.append('isNewVersion', forms.upload.isNewVersion);
    // Para nueva versión, folderId se determina del documento padre
    // Para nuevo documento, usar el folderId seleccionado o vacío
    if (!forms.upload.isNewVersion) {
      data.append('folderId', forms.upload.folderId || '');
    }
    if (forms.upload.isNewVersion) {
      data.append('parentDocumentId', forms.upload.parentDocumentId);
      data.append('changeDescription', forms.upload.changeDescription);
    }

    try {
      await documentsAPI.uploadDocument(data);
      // WebSocket will handle the list update automatically
      setForms(prev => ({ ...prev, upload: { title: '', description: '', type: '', category: '', version: '1.0', file: null, isNewVersion: false, parentDocumentId: null, changeDescription: '' } }));
      setShowUploadModal(false);
      // Notification will be handled by WebSocket listener
    } catch (err) {
      notifyError('Error al subir el documento. Por favor, inténtalo de nuevo.');
      setForms(prev => ({ ...prev, upload: { title: '', description: '', type: '', category: '', version: '1.0', file: null, isNewVersion: false, parentDocumentId: null, changeDescription: '' } }));
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCreateFolder = useCallback(async (e) => {
    e.preventDefault();
    await handleCreateFolderHook();
  }, [handleCreateFolderHook]);


  const handleUpdateFolder = useCallback(async (e) => {
    e.preventDefault();
    await handleUpdateFolderHook();
  }, [handleUpdateFolderHook]);

  const handleDeleteFolder = useCallback(async (folderId) => {
    await handleDeleteFolderHook(folderId);
  }, [handleDeleteFolderHook]);

  const handleEdit = (doc) => {
    setEditingDocument(doc);
    setForms(prev => ({
      ...prev,
      edit: {
        title: doc.title,
        description: doc.description,
        type: doc.type,
        category: doc.category
      }
    }));
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
      await documentsAPI.updateDocument(editingDocument.id, forms.edit);
      // WebSocket will handle the list update automatically
      setShowEditModal(false);
      // Notification will be handled by WebSocket listener
    } catch (err) {
      notifyError('Error al actualizar el documento. Por favor, inténtalo de nuevo.');
    }
  };

  const handleDelete = async (id) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar este documento?', async () => {
      try {
        await documentsAPI.deleteDocument(id);
        // WebSocket will handle the list update automatically
        // Notification will be handled by WebSocket listener
      } catch (err) {
        notifyError('Error al eliminar el documento. Por favor, inténtalo de nuevo.');
      }
    });
  };

  const handleDeleteVersion = async (versionId) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar esta versión del documento?', async () => {
      try {
        await documentsAPI.deleteDocument(versionId);
        // WebSocket will handle the list update automatically
        // Notification will be handled by WebSocket listener
      } catch (err) {
        notifyError('Error al eliminar la versión. Por favor, inténtalo de nuevo.');
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

  // Función de compatibilidad para código existente
  const showNotification = (message, type) => {
    if (type === 'success') notifySuccess(message);
    else if (type === 'error') notifyError(message);
    else if (type === 'warning') notifyWarning(message);
    else notifyInfo(message);
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
  const handleOpenPermissionsModal = useCallback(async (item, type) => {
    await handleOpenPermissionsModalHook(item, type, setSelectedItemForPermissions, setShowPermissionsModal, showNotification);
  }, [handleOpenPermissionsModalHook, setSelectedItemForPermissions, setShowPermissionsModal, showNotification]);

  const handleGrantPermissions = useCallback(async () => {
    await handleGrantPermissionsHook(selectedItemForPermissions, notifyError);
  }, [handleGrantPermissionsHook, selectedItemForPermissions, notifyError]);

  const handleRevokePermission = useCallback(async (permissionId) => {
    await handleRevokePermissionHook(permissionId, showNotification, notifyError);
  }, [handleRevokePermissionHook, showNotification, notifyError]);


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



  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      await documentsAPI.downloadDocument(documentId, fileName);
      showNotification('Documento descargado exitosamente', 'success');
    } catch (err) {
      console.error('Error downloading document:', err);

      // Si el documento no existe (404), refrescar la lista de documentos
      if (err.response?.status === 404) {
        showNotification('El documento no existe o ha sido eliminado. Actualizando lista...', 'warning');
        fetchDocuments();
      } else {
        showNotification('Error al descargar el documento. Por favor, inténtalo de nuevo.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${conditionalClasses({
        light: 'bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe]',
        dark: 'bg-gray-900'
      })}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#662d91] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={conditionalClasses({
            light: 'text-gray-600 font-medium',
            dark: 'text-gray-300 font-medium'
          })}>Cargando documentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${conditionalClasses({
      light: 'bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe]',
      dark: 'bg-gray-900'
    })}`}>
      {/* Confirm Dialog */}
      <ConfirmDialog
        confirmDialog={confirmDialog}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirm}
      />

      {/* Header */}
      <div className={`shadow-sm border-b ${conditionalClasses({
        light: 'bg-white border-gray-200',
        dark: 'bg-gray-800 border-gray-700'
      })}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${conditionalClasses({
                  light: 'text-gray-900',
                  dark: 'text-white'
                })}`}>
                  {currentFolder ? `Carpeta: ${currentFolder.name}` : 'Control de Versiones'}
                </h1>
                <p className={`mt-1 ${conditionalClasses({
                  light: 'text-gray-600',
                  dark: 'text-gray-300'
                })}`}>
                  {currentFolder ? currentFolder.description || 'Gestiona versiones de políticas y documentos oficiales' : 'Gestiona versiones de políticas y documentos oficiales'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${conditionalClasses({
                light: 'bg-[#f3ebf9] text-gray-700',
                dark: 'bg-gray-700 text-gray-300'
              })}`}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{totalUniqueDocuments} documentos</span>
              </div>
              {currentFolder && (
                <button
                  onClick={handleGoBack}
                  className={`inline-flex items-center px-5 py-2.5 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all ${conditionalClasses({
                    light: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
                    dark: 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  })}`}
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
                  className="inline-flex items-center px-5 py-2.5 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
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
          <p className={`text-sm font-medium ${conditionalClasses({
            light: 'text-gray-600',
            dark: 'text-gray-300'
          })}`}>
            Mostrando <span className="font-bold text-[#662d91]">{filteredDocumentsList.length}</span> documentos
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className={`rounded-2xl shadow-lg border ${conditionalClasses({
          light: 'bg-white border-gray-200',
          dark: 'bg-gray-800 border-gray-700'
        })}`}>
          <div className={`px-6 py-4 border-b ${conditionalClasses({
            light: 'bg-linear-to-r from-[#f3ebf9] to-[#e8d5f5] border-gray-200',
            dark: 'bg-gray-800 border-gray-700'
          })}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaFile className={`text-[#662d91] text-lg ${conditionalClasses({
                  light: 'text-[#662d91]',
                  dark: 'text-purple-400'
                })}`} />
                <h2 className={`text-lg font-bold ${conditionalClasses({
                  light: 'text-gray-900',
                  dark: 'text-white'
                })}`}>Repositorio de Versiones de Documentos</h2>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${conditionalClasses({
                light: 'bg-[#f3ebf9] text-[#662d91]',
                dark: 'bg-gray-700 text-gray-300'
              })}`}>
               <span className={`${conditionalClasses({
                 light: 'text-[#662d91]',
                 dark: 'text-gray-300'
               })}`}>{currentFolders.length + filteredDocumentsList.length} elementos</span>
             </span>
            </div>
          </div>

          <div className="p-6">
            {currentFolders.length === 0 && filteredDocumentsList.length === 0 ? (
              <div className="text-center py-16">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${conditionalClasses({
                  light: 'bg-gray-100',
                  dark: 'bg-gray-700'
                })}`}>
                  <FaFileAlt className={`w-10 h-10 ${conditionalClasses({
                    light: 'text-gray-400',
                    dark: 'text-gray-500'
                  })}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${conditionalClasses({
                  light: 'text-gray-900',
                  dark: 'text-white'
                })}`}>
                  {searchTerm || filterType !== 'all'
                    ? 'No se encontraron elementos'
                    : 'Sin elementos disponibles'}
                </h3>
                <p className={`max-w-sm mx-auto ${conditionalClasses({
                  light: 'text-gray-600',
                  dark: 'text-gray-300'
                })}`}>
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
                        className={`group rounded-xl p-5 border transition-all duration-200 cursor-pointer ${conditionalClasses({
                          light: 'bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 hover:shadow-md',
                          dark: 'bg-gray-800 border-gray-600 hover:border-blue-400 hover:shadow-lg'
                        })}`}
                      >
                        <div className="flex items-start space-x-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${conditionalClasses({
                            light: 'bg-linear-to-br from-blue-100 to-indigo-100',
                            dark: 'bg-gray-700'
                          })}`}>
                            <FaFolder className={`text-xl ${conditionalClasses({
                              light: 'text-blue-600',
                              dark: 'text-blue-400'
                            })}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-bold mb-2 text-lg ${conditionalClasses({
                              light: 'text-gray-900',
                              dark: 'text-white'
                            })}`}>{folder.name}</h3>
                            {folder.description && (
                              <p className={`text-sm mb-2 ${conditionalClasses({
                                light: 'text-gray-600',
                                dark: 'text-gray-300'
                              })}`}>{folder.description}</p>
                            )}
                            <div className={`flex items-center gap-3 text-xs ${conditionalClasses({
                              light: 'text-gray-500',
                              dark: 'text-gray-400'
                            })}`}>
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
                        <div className={`flex flex-wrap gap-2 pt-3 border-t ${conditionalClasses({
                          light: 'border-gray-100',
                          dark: 'border-gray-600'
                        })}`}>
                          {canEdit(folder) && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditFolder(folder);
                                }}
                                className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${conditionalClasses({
                                  light: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
                                  dark: 'bg-blue-900/50 hover:bg-blue-800 text-blue-300'
                                })}`}
                              >
                                <FaEdit className="mr-1" />
                                Editar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFolder(folder.id);
                                }}
                                className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${conditionalClasses({
                                  light: 'bg-red-50 hover:bg-red-100 text-red-700',
                                  dark: 'bg-red-900/50 hover:bg-red-800 text-red-300'
                                })}`}
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
                              className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${conditionalClasses({
                                light: 'bg-[#f3ebf9] hover:bg-[#f3ebf9] text-[#662d91]',
                                dark: 'bg-purple-900/50 hover:bg-purple-800 text-purple-300'
                              })}`}
                            >
                              <FaUser className="mr-1" />
                              Permisos
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Mostrar documentos */}
                    {filteredDocumentsList.map((doc) => {
                      return (
                        <div
                          key={doc.id}
                          className={`group rounded-xl p-5 border transition-all duration-200 ${conditionalClasses({
                            light: 'bg-linear-to-r from-gray-50 to-white border-gray-200 hover:border-[#8e4dbf] hover:shadow-md',
                            dark: 'bg-gray-800 border-gray-600 hover:border-[#8e4dbf] hover:shadow-lg'
                          })}`}
                        >
                          {/* Document Header with Icon and Info */}
                          <div className="flex items-start space-x-4 mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${conditionalClasses({
                              light: 'bg-linear-to-br from-[#f3ebf9] to-[#e8d5f5]',
                              dark: 'bg-gray-700'
                            })}`}>
                              {getFileIcon(doc.filePath)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-bold mb-2 text-lg ${conditionalClasses({
                                light: 'text-gray-900',
                                dark: 'text-white'
                              })}`}>{doc.title}</h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {doc.type && (
                                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg ${conditionalClasses({
                                    light: 'bg-blue-50 text-blue-700',
                                    dark: 'bg-blue-900 text-blue-300'
                                  })}`}>
                                    <FaTag className={`mr-1.5 text-xs ${conditionalClasses({
                                      light: 'text-blue-700',
                                      dark: 'text-blue-300'
                                    })}`} />
                                    {doc.type}
                                  </span>
                                )}
                                {doc.category && (
                                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg ${conditionalClasses({
                                    light: 'bg-green-50 text-green-700',
                                    dark: 'bg-green-900 text-green-300'
                                  })}`}>
                                    {doc.category}
                                  </span>
                                )}
                                {doc.version && (
                                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg ${conditionalClasses({
                                    light: 'bg-[#f3ebf9] text-[#662d91]',
                                    dark: 'bg-purple-900/50 text-purple-300'
                                  })}`}>
                                    v{doc.version}
                                  </span>
                                )}
                              </div>
                              {doc.description && (
                                <p className={`text-sm mb-2 ${conditionalClasses({
                                  light: 'text-gray-600',
                                  dark: 'text-gray-300'
                                })}`}>{doc.description}</p>
                              )}
                              {/* NUEVA FUNCIONALIDAD: Información adicional */}
                              <div className={`flex items-center gap-3 text-xs mb-2 ${conditionalClasses({
                                light: 'text-gray-500',
                                dark: 'text-gray-400'
                              })}`}>
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
                          <div className={`flex flex-wrap gap-2 pt-3 border-t ${conditionalClasses({
                            light: 'border-gray-100',
                            dark: 'border-gray-600'
                          })}`}>
                            <button
                              onClick={() => handleDownloadDocument(doc.id, getDownloadName(doc))}
                              className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                            >
                              <FaDownload className="mr-2" />
                              Descargar
                            </button>
                            <button
                              onClick={() => handleViewHistory(doc)}
                              className={`inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${conditionalClasses({
                                light: 'bg-green-50 hover:bg-green-100 text-green-700',
                                dark: 'bg-green-900/50 hover:bg-green-800 text-green-300'
                              })}`}
                            >
                              <FaClock className="mr-2" />
                              Ver Versiones
                            </button>
                            {canEdit(doc) && (
                              <>
                                <button
                                  onClick={() => handleEdit(doc)}
                                  className={`inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${conditionalClasses({
                                    light: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
                                    dark: 'bg-blue-900/50 hover:bg-blue-800 text-blue-300'
                                  })}`}
                                >
                                  <FaEdit className="mr-2" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDelete(doc.id)}
                                  className={`inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${conditionalClasses({
                                    light: 'bg-red-50 hover:bg-red-100 text-red-700',
                                    dark: 'bg-red-900/50 hover:bg-red-800 text-red-300'
                                  })}`}
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

      <Suspense fallback={<div>Cargando...</div>}>
        <UploadModal
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          formData={forms.upload}
          setFormData={(data) => setForms(prev => ({ ...prev, upload: data }))}
          handleUpload={handleUpload}
          uploadLoading={uploadLoading}
          documents={documents}
          folders={folders}
        />

        <EditModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          editFormData={forms.edit}
          setEditFormData={(data) => setForms(prev => ({ ...prev, edit: data }))}
          handleUpdate={handleUpdate}
        />

        <HistoryModal
          showHistoryModal={showHistoryModal}
          setShowHistoryModal={setShowHistoryModal}
          selectedDocument={selectedDocument}
          getDownloadName={getDownloadName}
          handleDownloadDocument={handleDownloadDocument}
          handleDeleteVersion={handleDeleteVersion}
          user={user}
        />

        <CreateFolderModal
          showCreateFolderModal={showCreateFolderModal}
          setShowCreateFolderModal={setShowCreateFolderModal}
          folderFormData={folderFormData}
          setFolderFormData={setFolderFormData}
          handleCreateFolder={handleCreateFolder}
        />

        <EditFolderModal
          showEditFolderModal={showEditFolderModal}
          setShowEditFolderModal={setShowEditFolderModal}
          editFolderFormData={editFolderFormData}
          setEditFolderFormData={setEditFolderFormData}
          handleUpdateFolder={handleUpdateFolder}
        />

        <PermissionsModal
          showPermissionsModal={showPermissionsModal}
          setShowPermissionsModal={setShowPermissionsModal}
          selectedItemForPermissions={selectedItemForPermissions}
          permissions={permissions}
          allUsers={allUsers}
          userSearchTerm={userSearchTerm}
          setUserSearchTerm={setUserSearchTerm}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          permissionType={permissionType}
          setPermissionType={setPermissionType}
          handleGrantPermissions={handleGrantPermissions}
          handleRevokePermission={handleRevokePermission}
          handleSelectAllUsers={handleSelectAllUsers}
          handleDeselectAllUsers={handleDeselectAllUsers}
          handleUserToggle={handleUserToggle}
          filteredUsers={filteredUsers}
        />
      </Suspense>
    </div>
  );
};

export default Documents;