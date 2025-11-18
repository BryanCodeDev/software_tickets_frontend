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
};

export default credentialsAPI;
