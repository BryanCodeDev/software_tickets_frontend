import api from './api';

const documentsAPI = {
  fetchDocuments: async () => {
    try {
      const response = await api.get('/documents');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchDocuments: async (query) => {
    try {
      const response = await api.get(`/documents/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchDocumentById: async (id) => {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadDocument: async (formData) => {
    try {
      const response = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDocument: async (id, documentData) => {
    try {
      const response = await api.put(`/documents/${id}`, documentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteDocument: async (id) => {
    try {
      await api.delete(`/documents/${id}`);
    } catch (error) {
      throw error;
    }
  },

  fetchFolders: async () => {
    try {
      const response = await api.get('/documents/folders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createFolder: async (folderData) => {
    try {
      const response = await api.post('/documents/folders', folderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateFolder: async (id, folderData) => {
    try {
      const response = await api.put(`/documents/folders/${id}`, folderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteFolder: async (id) => {
    try {
      await api.delete(`/documents/folders/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Permissions API
  getDocumentPermissions: async (documentId, folderId) => {
    try {
      const params = new URLSearchParams();
      if (documentId) params.append('documentId', documentId);
      if (folderId) params.append('folderId', folderId);
      const response = await api.get(`/documents/permissions?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  grantDocumentPermissions: async (documentId, folderId, userIds, permissionType) => {
    try {
      const response = await api.post('/documents/permissions', {
        documentId,
        folderId,
        userIds,
        permissionType
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  revokeDocumentPermission: async (permissionId) => {
    try {
      await api.delete(`/documents/permissions/${permissionId}`);
    } catch (error) {
      throw error;
    }
  },

  checkUserDocumentPermission: async (documentId, folderId) => {
    try {
      const params = new URLSearchParams();
      if (documentId) params.append('documentId', documentId);
      if (folderId) params.append('folderId', folderId);
      const response = await api.get(`/documents/check-permission?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  downloadDocument: async (id, fileName) => {
    try {
      const response = await api.get(`/documents/${id}/download`, {
        responseType: 'blob',
      });

      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw error;
    }
  },
};

export default documentsAPI;
