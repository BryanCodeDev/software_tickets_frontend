import api from './api';

const credentialsAPI = {
  fetchCredentials: async () => {
    try {
      const response = await api.get('/credentials');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchCredentialById: async (id) => {
    try {
      const response = await api.get(`/credentials/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCredential: async (credentialData) => {
    try {
      const response = await api.post('/credentials', credentialData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCredential: async (id, credentialData) => {
    try {
      const response = await api.put(`/credentials/${id}`, credentialData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCredential: async (id) => {
    try {
      await api.delete(`/credentials/${id}`);
    } catch (error) {
      throw error;
    }
  },

  fetchFolders: async () => {
    try {
      const response = await api.get('/credentials/folders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createFolder: async (folderData) => {
    try {
      const response = await api.post('/credentials/folders', folderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateFolder: async (id, folderData) => {
    try {
      const response = await api.put(`/credentials/folders/${id}`, folderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteFolder: async (id) => {
    try {
      await api.delete(`/credentials/folders/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default credentialsAPI;
