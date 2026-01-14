import api from './api';

const documentsAPI = {
  fetchDocuments: async () => {
    const response = await api.get('/documents');
    return response.data;
  },

  searchDocuments: async (query) => {
    const response = await api.get(`/documents/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  fetchDocumentById: async (id) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  uploadDocument: async (formData) => {
    const response = await api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateDocument: async (id, documentData) => {
    const response = await api.put(`/documents/${id}`, documentData);
    return response.data;
  },

  deleteDocument: async (id) => {
    await api.delete(`/documents/${id}`);
  },

  fetchFolders: async () => {
    const response = await api.get('/documents/folders');
    return response.data;
  },

  createFolder: async (folderData) => {
    const response = await api.post('/documents/folders', folderData);
    return response.data;
  },

  updateFolder: async (id, folderData) => {
    const response = await api.put(`/documents/folders/${id}`, folderData);
    return response.data;
  },

  deleteFolder: async (id) => {
    await api.delete(`/documents/folders/${id}`);
  },

  // Permissions API
  getDocumentPermissions: async (documentId, folderId) => {
    const params = new URLSearchParams();
    if (documentId) params.append('documentId', documentId);
    if (folderId) params.append('folderId', folderId);
    const response = await api.get(`/documents/permissions?${params}`);
    return response.data;
  },

  grantDocumentPermissions: async (documentId, folderId, userIds, permissionType) => {
    const response = await api.post('/documents/permissions', {
      documentId,
      folderId,
      userIds,
      permissionType
    });
    return response.data;
  },

  revokeDocumentPermission: async (permissionId) => {
    await api.delete(`/documents/permissions/${permissionId}`);
  },

  checkUserDocumentPermission: async (documentId, folderId) => {
    const params = new URLSearchParams();
    if (documentId) params.append('documentId', documentId);
    if (folderId) params.append('folderId', folderId);
    const response = await api.get(`/documents/check-permission?${params}`);
    return response.data;
  },

  fetchUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  downloadDocument: async (id, fileName) => {
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
  },
};

export default documentsAPI;
