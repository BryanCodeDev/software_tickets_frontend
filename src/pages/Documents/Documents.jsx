import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { documentsAPI } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useThemeClasses } from '../../hooks/useThemeClasses.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import { useDocumentFilters } from '../../hooks/useDocumentFilters.js';
import { useDocumentPermissions } from '../../hooks/useDocumentPermissions.js';
import { useFolders } from '../../hooks/useFolders.js';
import { usePermissions } from '../../hooks/usePermissions.js';
import { FaFile, FaUpload, FaDownload, FaEdit, FaTrash, FaCheck, FaTimes, FaFileAlt, FaTag, FaSearch, FaSortAmountDown, FaSortAmountUp, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileArchive, FaClock, FaUser, FaFolder, FaFolderOpen, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { ConfirmDialog, FilterPanel } from '../../components/common';

// Lazy load modals
const UploadModal = lazy(() => import('./modals/UploadModal.jsx'));
const EditModal = lazy(() => import('./modals/EditModal.jsx'));
const HistoryModal = lazy(() => import('./modals/HistoryModal.jsx'));
const CreateFolderModal = lazy(() => import('./modals/CreateFolderModal.jsx'));
const EditFolderModal = lazy(() => import('./modals/EditFolderModal.jsx'));
const PermissionsModal = lazy(() => import('./modals/PermissionsModal.jsx'));
import DocumentCard from './components/DocumentCard.jsx';
import FolderCard from './components/FolderCard.jsx';
import DocumentHeader from './components/DocumentHeader.jsx';
import FilterSection from './components/FilterSection.jsx';
import EmptyState from './components/EmptyState.jsx';
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
  const { user } = useAuth();
  
  // States
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
  
  // Show dialog - debe definirse antes de ser usada
  const showConfirmDialog = useCallback((message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  }, []);
  
  // Search, filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Permissions states
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedItemForPermissions, setSelectedItemForPermissions] = useState(null);
  const [filteredItems, setFilteredItems] = useState({ folders: [], documents: [] });
  const [canWriteInCurrentFolder, setCanWriteInCurrentFolder] = useState(false);
  const [editPermissions, setEditPermissions] = useState(new Map());
  
  // Custom hooks
  const permissionsHook = usePermissions(user);
  const documentPermissions = useDocumentPermissions();
  const foldersHook = useFolders(showConfirmDialog, notifyError);
  
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
    allUsers,
    selectedUsers,
    setSelectedUsers,
    permissionType,
    setPermissionType,
    userSearchTerm,
    setUserSearchTerm,
    filteredUsers,
    fetchUsers,
    handleOpenPermissionsModal: handleOpenPermissionsModalHook,
    handleGrantPermissions: handleGrantPermissionsHook,
    handleRevokePermission: handleRevokePermissionHook,
    handleSelectAllUsers,
    handleDeselectAllUsers,
    handleUserToggle
  } = permissionsHook;
  
  const {
    canEdit,
    canManagePermissions,
    clearPermissionsCache
  } = documentPermissions;
  
  // Use filters hook
  const filteredDocumentsList = useDocumentFilters(documents, searchTerm, filterType, sortBy, sortOrder, currentFolder);
  
  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    try {
      const data = await documentsAPI.fetchDocuments();
      setDocuments(data);
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initial data load
  useEffect(() => {
    fetchDocuments();
    fetchFolders();
    fetchUsers();
  }, [fetchFolders, fetchUsers, fetchDocuments]);
  
  // Función para determinar si el usuario puede escribir en la carpeta actual
  const canUserWriteInCurrentFolder = useCallback(async () => {
    if (!currentFolder) return false;
    
    // Si es owner o admin, puede escribir
    if (documentPermissions.isOwner(currentFolder) || documentPermissions.hasFullAccess()) {
      return true;
    }
    
    // Verificar permisos de escritura
    const permission = await documentPermissions.checkPermission(currentFolder, 'folder');
    return permission.hasAccess && permission.permissionType === 'write';
  }, [currentFolder, documentPermissions]);
  
  // Update write permissions when folder changes
  useEffect(() => {
    const updateWritePermissions = async () => {
      const canWrite = await canUserWriteInCurrentFolder();
      setCanWriteInCurrentFolder(canWrite);
    };
    updateWritePermissions();
  }, [currentFolder, user, canUserWriteInCurrentFolder]);
  
  // Función para verificar si el usuario puede ver un documento
  const canViewDocument = useCallback(async (doc) => {
    // Roles con permisos totales ven todo
    if (documentPermissions.hasFullAccess()) return true;
    
    // Creadores ven sus documentos
    if (doc.createdBy === user?.id) return true;
    
    // Verificar permisos específicos
    const docPermission = await documentPermissions.checkPermission(doc, 'document');
    if (docPermission.hasAccess) return true;
    
    // Verificar herencia de permisos de carpeta padre
    if (doc.folderId) {
      const parentFolder = folders.find(f => f.id === doc.folderId);
      if (parentFolder) {
        const folderPermission = await documentPermissions.checkPermission(parentFolder, 'folder');
        if (folderPermission.hasAccess) return true;
      }
    }
    
    return false;
  }, [user, documentPermissions, folders]);
  
  // Función para verificar si el usuario puede ver una carpeta
  const canViewFolder = useCallback(async (folder) => {
    if (documentPermissions.hasFullAccess()) return true;
    if (folder.createdBy === user?.id) return true;
    const permission = await documentPermissions.checkPermission(folder, 'folder');
    return permission.hasAccess;
  }, [user, documentPermissions]);
  
  // Función para filtrar elementos con permisos
  const getFilteredItems = useCallback(async () => {
    const baseFilteredDocuments = filteredDocumentsList;
    
    let filteredFolders = folders.filter(folder =>
      currentFolder ? folder.parentFolderId === currentFolder.id : !folder.parentFolderId
    );
    
    let filteredDocuments = [];
    
    if (documentPermissions.hasFullAccess()) {
      filteredDocuments = baseFilteredDocuments;
    } else {
      // Filtrar documentos
      for (const doc of baseFilteredDocuments) {
        const canViewDoc = await canViewDocument(doc);
        if (canViewDoc) {
          filteredDocuments.push(doc);
        }
      }
      
      // Filtrar carpetas
      const tempFolders = [];
      for (const folder of filteredFolders) {
        const canViewFol = await canViewFolder(folder);
        if (canViewFol) {
          tempFolders.push(folder);
        }
      }
      filteredFolders = tempFolders;
    }
    
    return { folders: filteredFolders, documents: filteredDocuments };
  }, [filteredDocumentsList, folders, currentFolder, documentPermissions, canViewDocument, canViewFolder]);
  
  // Load filtered items when data changes
  useEffect(() => {
    const loadFilteredItems = async () => {
      const items = await getFilteredItems();
      setFilteredItems(items);
    };
    loadFilteredItems();
  }, [documents, folders, currentFolder, user, filteredDocumentsList, getFilteredItems]);
  
  // Calculate edit permissions when items change
  useEffect(() => {
    const calculateEditPermissions = async () => {
      const newPermissions = new Map();
      
      // Calculate for folders
      for (const folder of filteredItems.folders) {
        const key = `folder-${folder.id}`;
        const hasPermission = await canEdit(folder);
        newPermissions.set(key, hasPermission);
      }
      
      // Calculate for documents
      for (const doc of filteredItems.documents) {
        const key = `document-${doc.id}`;
        const hasPermission = await canEdit(doc);
        newPermissions.set(key, hasPermission);
      }
      
      setEditPermissions(newPermissions);
    };
    
    calculateEditPermissions();
  }, [filteredItems, user, canEdit]);
  
  // WebSocket listeners
  useEffect(() => {
    const handleDocumentCreated = () => {
      fetchDocuments();
      notifySuccess('Nuevo documento agregado');
    };
    
    const handleDocumentUpdated = () => {
      fetchDocuments();
      notifySuccess('Documento actualizado');
    };
    
    const handleDocumentDeleted = () => {
      fetchDocuments();
      notifySuccess('Documento eliminado');
    };
    
    const handleDocumentsListUpdated = () => {
      fetchDocuments();
    };
    
    const handleFolderCreated = () => {
      fetchFolders();
      notifySuccess('Nueva carpeta agregada');
    };
    
    const handleFolderUpdated = () => {
      fetchFolders();
      notifySuccess('Carpeta actualizada');
    };
    
    const handleFolderDeleted = () => {
      fetchFolders();
      fetchDocuments();
      notifySuccess('Carpeta eliminada');
    };
    
    const handleFoldersListUpdated = () => {
      fetchFolders();
    };
    
    const handleDocumentPermissionsUpdated = () => {
      clearPermissionsCache();
      if (showPermissionsModal && selectedItemForPermissions) {
        handleOpenPermissionsModal(selectedItemForPermissions, selectedItemForPermissions.type);
      }
      notifySuccess('Permisos actualizados');
    };
    
    onDocumentCreated(handleDocumentCreated);
    onDocumentUpdated(handleDocumentUpdated);
    onDocumentDeleted(handleDocumentDeleted);
    onDocumentsListUpdated(handleDocumentsListUpdated);
    onFolderCreated(handleFolderCreated);
    onFolderUpdated(handleFolderUpdated);
    onFolderDeleted(handleFolderDeleted);
    onFoldersListUpdated(handleFoldersListUpdated);
    onDocumentPermissionsUpdated(handleDocumentPermissionsUpdated);
    
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
  }, [showPermissionsModal, selectedItemForPermissions, fetchFolders, fetchDocuments, notifySuccess, handleOpenPermissionsModal, clearPermissionsCache]);
  
  // Calculate total unique documents
  const totalUniqueDocuments = [...new Set(documents.map(doc => doc.parentDocumentId || doc.id))].length;
  
  // Get unique types for filters
  const uniqueTypes = [...new Set(documents.map(doc => doc.type).filter(Boolean))];
  
  const currentFolders = filteredItems.folders;
  
  // Get file icon
  const getFileIcon = (filePath) => {
    const extension = filePath?.split('.').pop().toLowerCase();
    switch(extension) {
      case 'pdf': return <FaFilePdf className={`text-xl ${conditionalClasses({ light: 'text-red-600', dark: 'text-red-400' })}`} />;
      case 'doc':
      case 'docx': return <FaFileWord className={`text-xl ${conditionalClasses({ light: 'text-blue-600', dark: 'text-blue-400' })}`} />;
      case 'xls':
      case 'xlsx': return <FaFileExcel className={`text-xl ${conditionalClasses({ light: 'text-green-600', dark: 'text-green-400' })}`} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <FaFileImage className={`text-xl ${conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-400' })}`} />;
      case 'zip':
      case 'rar': return <FaFileArchive className={`text-xl ${conditionalClasses({ light: 'text-yellow-600', dark: 'text-yellow-400' })}`} />;
      default: return <FaFileAlt className={`text-xl ${conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-400' })}`} />;
    }
  };
  
  // Get download name
  const getDownloadName = (doc, version = null) => {
    const title = doc.title;
    const ver = version ? version.version : doc.version;
    const ext = doc.filePath.split('.').pop();
    return `${title}_v${ver}.${ext}`;
  };
  
  // Get time ago
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
  

  
  // Notification helper
  const showNotification = useCallback((message, type) => {
    if (type === 'success') notifySuccess(message);
    else if (type === 'error') notifyError(message);
    else if (type === 'warning') notifyWarning(message);
    else notifyInfo(message);
  }, [notifySuccess, notifyError, notifyWarning, notifyInfo]);
  
  // Handle upload
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
    if (!forms.upload.isNewVersion) {
      data.append('folderId', forms.upload.folderId || '');
    }
    if (forms.upload.isNewVersion) {
      data.append('parentDocumentId', forms.upload.parentDocumentId);
      data.append('changeDescription', forms.upload.changeDescription);
    }
    
    try {
      await documentsAPI.uploadDocument(data);
      setForms(prev => ({ ...prev, upload: { title: '', description: '', type: '', category: '', version: '1.0', file: null, isNewVersion: false, parentDocumentId: null, changeDescription: '' } }));
      setShowUploadModal(false);
    } catch {
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
      edit: { title: doc.title, description: doc.description, type: doc.type, category: doc.category }
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
      setShowEditModal(false);
    } catch {
      notifyError('Error al actualizar el documento. Por favor, inténtalo de nuevo.');
    }
  };
  
  const handleDelete = async (id) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar este documento?', async () => {
      try {
        await documentsAPI.deleteDocument(id);
      } catch {
        notifyError('Error al eliminar el documento. Por favor, inténtalo de nuevo.');
      }
    });
  };
  
  const handleDeleteVersion = async (versionId) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar esta versión del documento?', async () => {
      try {
        await documentsAPI.deleteDocument(versionId);
      } catch {
        notifyError('Error al eliminar la versión. Por favor, inténtalo de nuevo.');
      }
    });
  };
  
  // Sync function for getCanEdit
  const getCanEdit = useCallback((item) => {
    const key = `${item.type || (item.parentFolderId !== undefined || item.name ? 'folder' : 'document')}-${item.id}`;
    return editPermissions.get(key) || false;
  }, [editPermissions]);
  
  // Open permissions modal with verification
  const handleOpenPermissionsModal = useCallback(async (item, type) => {
    if (!canManagePermissions()) {
      notifyWarning('No tienes permisos para gestionar permisos de documentos');
      return;
    }
    await handleOpenPermissionsModalHook(item, type, setSelectedItemForPermissions, setShowPermissionsModal, showNotification);
  }, [canManagePermissions, handleOpenPermissionsModalHook, setSelectedItemForPermissions, setShowPermissionsModal, showNotification, notifyWarning]);
  
  const handleGrantPermissions = useCallback(async () => {
    await handleGrantPermissionsHook(selectedItemForPermissions, notifyError);
  }, [handleGrantPermissionsHook, selectedItemForPermissions, notifyError]);
  
  const handleRevokePermission = useCallback(async (permissionId) => {
    await handleRevokePermissionHook(permissionId, showNotification, notifyError);
  }, [handleRevokePermissionHook, showNotification, notifyError]);
  
  const handleConfirm = () => {
    if (confirmDialog?.onConfirm) {
      confirmDialog.onConfirm();
    }
    setConfirmDialog(null);
  };
  
  const handleCancelConfirm = () => {
    setConfirmDialog(null);
  };
  
  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      await documentsAPI.downloadDocument(documentId, fileName);
      showNotification('Documento descargado exitosamente', 'success');
    } catch (_err) {
      console.error('Error downloading document:', _err);
      if (_err.response?.status === 404) {
        showNotification('El documento no existe o ha sido eliminado. Actualizando lista...', 'warning');
        fetchDocuments();
      } else {
        showNotification('Error al descargar el documento. Por favor, inténtalo de nuevo.', 'error');
      }
    }
  };
  
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${conditionalClasses({ light: 'bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe]', dark: 'bg-gray-900' })}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#662d91] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={conditionalClasses({ light: 'text-gray-600 font-medium', dark: 'text-gray-300 font-medium' })}>Cargando documentos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${conditionalClasses({ light: 'bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe]', dark: 'bg-gray-900' })}`}>
      <ConfirmDialog confirmDialog={confirmDialog} onClose={handleCancelConfirm} onConfirm={handleConfirm} />
      
      <DocumentHeader
        currentFolder={currentFolder}
        totalUniqueDocuments={totalUniqueDocuments}
        handleGoBack={handleGoBack}
        user={user}
        setShowCreateFolderModal={setShowCreateFolderModal}
        canWriteInCurrentFolder={canWriteInCurrentFolder}
        setShowUploadModal={setShowUploadModal}
      />
      
      <FilterSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        uniqueTypes={uniqueTypes}
        filteredDocumentsList={filteredDocumentsList}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className={`rounded-2xl shadow-lg border ${conditionalClasses({ light: 'bg-white border-gray-200', dark: 'bg-gray-800 border-gray-700' })}`}>
          <div className={`px-6 py-4 border-b ${conditionalClasses({ light: 'bg-linear-to-r from-[#f3ebf9] to-[#e8d5f5] border-gray-200', dark: 'bg-gray-800 border-gray-700' })}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaFile className={`text-[#662d91] text-lg ${conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-400' })}`} />
                <h2 className={`text-lg font-bold ${conditionalClasses({ light: 'text-gray-900', dark: 'text-white' })}`}>Repositorio de Versiones de Documentos</h2>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${conditionalClasses({ light: 'bg-[#f3ebf9] text-[#662d91]', dark: 'bg-gray-700 text-gray-300' })}`}>
                <span className={conditionalClasses({ light: 'text-[#662d91]', dark: 'text-gray-300' })}>{currentFolders.length + filteredDocumentsList.length} elementos</span>
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {currentFolders.length === 0 && filteredDocumentsList.length === 0 ? (
              <EmptyState searchTerm={searchTerm} filterType={filterType} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentFolders.map((folder) => (
                  <FolderCard
                    key={`folder-${folder.id}`}
                    folder={folder}
                    getTimeAgo={getTimeAgo}
                    handleEnterFolder={handleEnterFolder}
                    canEdit={getCanEdit}
                    handleEditFolder={handleEditFolder}
                    handleDeleteFolder={handleDeleteFolder}
                    handleOpenPermissionsModal={handleOpenPermissionsModal}
                    canManagePermissions={canManagePermissions()}
                  />
                ))}
                
                {filteredDocumentsList.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    getFileIcon={getFileIcon}
                    getTimeAgo={getTimeAgo}
                    getDownloadName={getDownloadName}
                    handleDownloadDocument={handleDownloadDocument}
                    handleViewHistory={handleViewHistory}
                    canEdit={getCanEdit}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                ))}
              </div>
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
