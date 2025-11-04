import api from './api';

const documentsAPI = {
  fetchDocuments: async () => {
    try {
      const response = await api.get('/documents');
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  searchDocuments: async (query) => {
    try {
      const response = await api.get(`/documents/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  },

  fetchDocumentById: async (id) => {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document:', error);
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
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  updateDocument: async (id, documentData) => {
    try {
      const response = await api.put(`/documents/${id}`, documentData);
      return response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  deleteDocument: async (id) => {
    try {
      await api.delete(`/documents/${id}`);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },
};

export default documentsAPI;