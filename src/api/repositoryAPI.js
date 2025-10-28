import api from './api';

const repositoryAPI = {
  fetchRepository: async () => {
    try {
      const response = await api.get('/repository');
      return response.data;
    } catch (error) {
      console.error('Error fetching repository:', error);
      throw error;
    }
  },

  fetchRepositoryById: async (id) => {
    try {
      const response = await api.get(`/repository/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching repository item:', error);
      throw error;
    }
  },

  uploadFile: async (formData) => {
    try {
      const response = await api.post('/repository', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  updateRepositoryItem: async (id, itemData) => {
    try {
      const response = await api.put(`/repository/${id}`, itemData);
      return response.data;
    } catch (error) {
      console.error('Error updating repository item:', error);
      throw error;
    }
  },

  deleteRepositoryItem: async (id) => {
    try {
      await api.delete(`/repository/${id}`);
    } catch (error) {
      console.error('Error deleting repository item:', error);
      throw error;
    }
  },
};

export default repositoryAPI;