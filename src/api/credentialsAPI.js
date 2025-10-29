import api from './api';

const credentialsAPI = {
  fetchCredentials: async () => {
    try {
      const response = await api.get('/credentials');
      return response.data;
    } catch (error) {
      console.error('Error fetching credentials:', error);
      throw error;
    }
  },

  fetchCredentialById: async (id) => {
    try {
      const response = await api.get(`/credentials/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching credential:', error);
      throw error;
    }
  },

  createCredential: async (credentialData) => {
    try {
      const response = await api.post('/credentials', credentialData);
      return response.data;
    } catch (error) {
      console.error('Error creating credential:', error);
      throw error;
    }
  },

  updateCredential: async (id, credentialData) => {
    try {
      const response = await api.put(`/credentials/${id}`, credentialData);
      return response.data;
    } catch (error) {
      console.error('Error updating credential:', error);
      throw error;
    }
  },

  deleteCredential: async (id) => {
    try {
      await api.delete(`/credentials/${id}`);
    } catch (error) {
      console.error('Error deleting credential:', error);
      throw error;
    }
  },
};

export default credentialsAPI;