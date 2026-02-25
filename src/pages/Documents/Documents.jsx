import React, { useState, useEffect, useCallback, Suspense, lazy, useMemo } from 'react';
import { documentsAPI } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useThemeClasses } from '../../hooks/useThemeClasses.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import { useDocumentFilters } from '../../hooks/useDocumentFilters.js';
import { useDocumentPermissions } from '../../hooks/useDocumentPermissions.js';
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
  offDocumentCreated,
  offDocumentUpdated,
  offDocumentDeleted,
  offDocumentsListUpdated,
  offFolderCreated,
  offFolderUpdated,
  offFolderDeleted,
  offFoldersListUpdated
} from '../../api/socket';

const Documents = () => {
  const { conditionalClasses } = useThemeClasses();
  const { notifySuccess, notifyError, notifyWarning, notifyInfo } = useNotifications();
  const { user } = useAuth();
  
  // States
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [forms, setForms] = useState({
    upload: { name: '', title: '', description: '', type: '', category: '', version: '1.0', file: null, isNewVersion: false, parentDocumentId: null, changeDescription: '' },
    edit: { name: '', title: '', description: '', type: '', category: '', expiryDate: '' }
  });
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  // Show dialog
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
  const [canWriteInCurrentFolder, setCanWriteInCurrentFolder] = useState(false);
  
  // Custom hooks
  const documentPermissions = useDocumentPermissions();
  const permissionsHook = usePermissions(user);
  
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
  
  const { canManagePermissions } = documentPermissions;
  
  // Use filters hook
  const filteredDocumentsList = useDocumentFilters(documents, searchTerm, filterType, sortBy, sortOrder, currentFolder);
  
  // Calculate filtered folders
  const currentFolders = useMemo(() => {
    return folders.filter(folder =>
      currentFolder ? folder.parentFolderId === currentFolder.id : !folder.parentFolderId
    );
  }, [folders, currentFolder]);
  
  // Fetch data
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
  
  const fetchFolders = useCallback(async () => {
    try {
      const data = await documentsAPI.fetchFolders();
      setFolders(data);
    } catch {
      // Error handled silently
    }
  }, []);
  
  // Initial data load
  useEffect(() => {
    fetchDocuments();
    fetchFolders();
    fetchUsers();
  }, [fetchDocuments, fetchFolders, fetchUsers]);
  
  // Calculate write permissions
  const calculateWritePermissions = useCallback(async () => {
    if (!currentFolder) {
      setCanWriteInCurrentFolder(true);
      return;
    }
    
    // Si es owner o admin, puede escribir
    if (documentPermissions.isOwner(currentFolder) || documentPermissions.hasFullAccess()) {
      setCanWriteInCurrentFolder(true);
      return;
    }
    
    // Verificar permisos de escritura
    const permission = await documentPermissions.checkPermission(currentFolder, 'folder');
    setCanWriteInCurrentFolder(permission.hasAccess && permission.permissionType === 'write');
  }, [currentFolder, documentPermissions]);
  
  useEffect(() => {
    calculateWritePermissions();
  }, [calculateWritePermissions]);
  
  // Handle folder navigation
  const handleEnterFolder = useCallback((folder) => {
    setCurrentFolder(folder);
  }, []);
  
  const handleGoBack = useCallback(() => {
    setCurrentFolder(prev => prev?.parentFolderId ? folders.find(f => f.id === prev.parentFolderId) : null);
  }, [folders]);
  
  // Handle CRUD operations
  const handleCreateFolder = useCallback(async (e) => {
    e.preventDefault();
    try {
      await documentsAPI.createFolder({
        name: forms.upload.name,
        parentFolderId: currentFolder?.id || null,
        description: forms.upload.description
      });
      await fetchFolders();
      setShowCreateFolderModal(false);
      setForms(prev => ({ ...prev, upload: { name: '', title: '', description: '', type: '', category: '', version: '1.0', file: null, isNewVersion: false, parentDocumentId: null, changeDescription: '' } }));
      notifySuccess('Carpeta creada exitosamente');
    } catch {
      notifyError('Error al crear la carpeta');
    }
  }, [forms.upload.name, forms.upload.description, currentFolder, fetchFolders, notifySuccess, notifyError]);
  
  const handleEditFolder = useCallback((folder) => {
    setForms(prev => ({
      ...prev,
      edit: { title: folder.name, description: folder.description || '', type: '', category: '' }
    }));
    setEditingDocument(folder);
    setShowEditFolderModal(true);
  }, []);
  
  const handleUpdateFolder = useCallback(async (e) => {
    e.preventDefault();
    try {
      await documentsAPI.updateFolder(editingDocument.id, {
        name: forms.edit.title,
        description: forms.edit.description
      });
      await fetchFolders();
      setShowEditFolderModal(false);
      notifySuccess('Carpeta actualizada');
    } catch {
      notifyError('Error al actualizar la carpeta');
    }
  }, [editingDocument, forms.edit, fetchFolders, notifySuccess, notifyError]);
  
  const handleDeleteFolder = useCallback(async (folderId) => {
    showConfirmDialog('¿Estás seguro de eliminar esta carpeta?', async () => {
      try {
        await documentsAPI.deleteFolder(folderId);
        await fetchFolders();
        if (currentFolder?.id === folderId) {
          setCurrentFolder(null);
        }
        notifySuccess('Carpeta eliminada');
      } catch {
        notifyError('Error al eliminar la carpeta');
      }
    });
  }, [currentFolder, fetchFolders, showConfirmDialog, notifySuccess, notifyError]);
  
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
      data.append('folderId', currentFolder?.id || '');
    }
    if (forms.upload.isNewVersion) {
      data.append('parentDocumentId', forms.upload.parentDocumentId);
      data.append('changeDescription', forms.upload.changeDescription);
    }
    
    try {
      await documentsAPI.uploadDocument(data);
      setForms(prev => ({ ...prev, upload: { title: '', description: '', type: '', category: '', version: '1.0', file: null, isNewVersion: false, parentDocumentId: null, changeDescription: '' } }));
      setShowUploadModal(false);
      await fetchDocuments();
      notifySuccess('Documento subido exitosamente');
    } catch {
      notifyError('Error al subir el documento');
    } finally {
      setUploadLoading(false);
      setForms(prev => ({ ...prev, upload: { title: '', description: '', type: '', category: '', version: '1.0', file: null, isNewVersion: false, parentDocumentId: null, changeDescription: '' } }));
    }
  };
  
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
      await fetchDocuments();
      notifySuccess('Documento actualizado');
    } catch {
      notifyError('Error al actualizar el documento');
    }
  };
  
  const handleDelete = async (id) => {
    showConfirmDialog('¿Estás seguro de eliminar este documento?', async () => {
      try {
        await documentsAPI.deleteDocument(id);
        await fetchDocuments();
        notifySuccess('Documento eliminado');
      } catch {
        notifyError('Error al eliminar el documento');
      }
    });
  };
  
  const handleDeleteVersion = async (versionId) => {
    showConfirmDialog('¿Estás seguro de eliminar esta versión?', async () => {
      try {
        await documentsAPI.deleteDocument(versionId);
        await fetchDocuments();
        notifySuccess('Versión eliminada');
      } catch {
        notifyError('Error al eliminar la versión');
      }
    });
  };
  
  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      await documentsAPI.downloadDocument(documentId, fileName);
      notifySuccess('Documento descargado');
    } catch {
      notifyError('Error al descargar el documento');
    }
  };
  
  // Notification helper
  const showNotification = useCallback((message, type) => {
    if (type === 'success') notifySuccess(message);
    else if (type === 'error') notifyError(message);
    else if (type === 'warning') notifyWarning(message);
    else notifyInfo(message);
  }, [notifySuccess, notifyError, notifyWarning, notifyInfo]);
  
  // Open permissions modal
  const handleOpenPermissionsModal = useCallback(async (item, type) => {
    if (!canManagePermissions()) {
      notifyWarning('No tienes permisos');
      return;
    }
    await handleOpenPermissionsModalHook(item, type, setSelectedItemForPermissions, setShowPermissionsModal, showNotification);
  }, [canManagePermissions, handleOpenPermissionsModalHook, showNotification, notifyWarning]);
  
  const handleGrantPermissions = useCallback(async () => {
    await handleGrantPermissionsHook(selectedItemForPermissions, notifyError, showNotification);
  }, [handleGrantPermissionsHook, selectedItemForPermissions, notifyError, showNotification]);
  
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
  
  // Calculate total unique documents
  const totalUniqueDocuments = [...new Set(documents.map(doc => doc.parentDocumentId || doc.id))].length;
  
  // Get unique types for filters
  const uniqueTypes = [...new Set(documents.map(doc => doc.type).filter(Boolean))];
  
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
  
  // Can edit check
  const getCanEdit = useCallback((item) => {
    if (canManagePermissions()) return true;
    if (item.createdBy === user?.id) return true;
    return false;
  }, [user, canManagePermissions]);
  
  // WebSocket listeners
  useEffect(() => {
    const handleDocumentCreated = () => fetchDocuments();
    const handleDocumentUpdated = () => fetchDocuments();
    const handleDocumentDeleted = () => fetchDocuments();
    const handleDocumentsListUpdated = () => fetchDocuments();
    const handleFolderCreated = () => fetchFolders();
    const handleFolderUpdated = () => fetchFolders();
    const handleFolderDeleted = () => fetchFolders();
    const handleFoldersListUpdated = () => fetchFolders();
    
    onDocumentCreated(handleDocumentCreated);
    onDocumentUpdated(handleDocumentUpdated);
    onDocumentDeleted(handleDocumentDeleted);
    onDocumentsListUpdated(handleDocumentsListUpdated);
    onFolderCreated(handleFolderCreated);
    onFolderUpdated(handleFolderUpdated);
    onFolderDeleted(handleFolderDeleted);
    onFoldersListUpdated(handleFoldersListUpdated);
    
    return () => {
      offDocumentCreated(handleDocumentCreated);
      offDocumentUpdated(handleDocumentUpdated);
      offDocumentDeleted(handleDocumentDeleted);
      offDocumentsListUpdated(handleDocumentsListUpdated);
      offFolderCreated(handleFolderCreated);
      offFolderUpdated(handleFolderUpdated);
      offFolderDeleted(handleFolderDeleted);
      offFoldersListUpdated(handleFoldersListUpdated);
    };
  }, [fetchDocuments, fetchFolders]);
  
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
                <h2 className={`text-lg font-bold ${conditionalClasses({ light: 'text-gray-900', dark: 'text-white' })}`}>Repositorio de Documentos</h2>
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
          folderFormData={forms.upload}
          setFolderFormData={(data) => setForms(prev => ({ ...prev, upload: data }))}
          handleCreateFolder={handleCreateFolder}
        />
        
        <EditFolderModal
          showEditFolderModal={showEditFolderModal}
          setShowEditFolderModal={setShowEditFolderModal}
          editFolderFormData={forms.edit}
          setEditFolderFormData={(data) => setForms(prev => ({ ...prev, edit: data }))}
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
          folders={folders}
          documents={documents}
        />
      </Suspense>
    </div>
  );
};

export default Documents;
