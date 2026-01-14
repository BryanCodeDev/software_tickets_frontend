import { useState, useCallback } from 'react';
import { documentsAPI } from '../api';

export const useFolders = (showConfirmDialog, notifyError) => {
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [folderFormData, setFolderFormData] = useState({ name: '', description: '', parentFolderId: null });
  const [editFolderFormData, setEditFolderFormData] = useState({ name: '', description: '' });

  const fetchFolders = useCallback(async () => {
    try {
      const data = await documentsAPI.fetchFolders();
      setFolders(data);
    } catch (err) {
      console.error('Error fetching folders:', err);
    }
  }, []);

  const handleCreateFolder = useCallback(async () => {
    try {
      const folderData = {
        ...folderFormData,
        parentFolderId: currentFolder ? currentFolder.id : null
      };
      await documentsAPI.createFolder(folderData);
      setFolderFormData({ name: '', description: '', parentFolderId: null });
      setShowCreateFolderModal(false);
    } catch {
      notifyError('Error al crear la carpeta. Por favor, inténtalo de nuevo.');
    }
  }, [folderFormData, currentFolder, notifyError]);

  const handleEnterFolder = useCallback((folder) => {
    setCurrentFolder(folder);
  }, []);

  const handleGoBack = useCallback(() => {
    if (currentFolder && currentFolder.parent) {
      setCurrentFolder(currentFolder.parent);
    } else {
      setCurrentFolder(null);
    }
  }, [currentFolder]);

  const handleEditFolder = useCallback((folder) => {
    setEditingFolder(folder);
    setEditFolderFormData({
      name: folder.name,
      description: folder.description || ''
    });
    setShowEditFolderModal(true);
  }, []);

  const handleUpdateFolder = useCallback(async () => {
    try {
      await documentsAPI.updateFolder(editingFolder.id, editFolderFormData);
      setShowEditFolderModal(false);
    } catch {
      notifyError('Error al actualizar la carpeta. Por favor, inténtalo de nuevo.');
    }
  }, [editingFolder, editFolderFormData, notifyError]);

  const handleDeleteFolder = useCallback(async (folderId) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar esta carpeta y todos sus contenidos?', async () => {
      try {
        await documentsAPI.deleteFolder(folderId);
        if (currentFolder && currentFolder.id === folderId) {
          setCurrentFolder(null);
        }
      } catch (err) {
        notifyError(err.response?.data?.error || 'Error al eliminar la carpeta. Por favor, inténtalo de nuevo.');
      }
    });
  }, [currentFolder, showConfirmDialog, notifyError]);

  return {
    folders,
    setFolders,
    currentFolder,
    setCurrentFolder,
    showCreateFolderModal,
    setShowCreateFolderModal,
    showEditFolderModal,
    setShowEditFolderModal,
    editingFolder,
    setEditingFolder,
    folderFormData,
    setFolderFormData,
    editFolderFormData,
    setEditFolderFormData,
    fetchFolders,
    handleCreateFolder,
    handleEnterFolder,
    handleGoBack,
    handleEditFolder,
    handleUpdateFolder,
    handleDeleteFolder
  };
};