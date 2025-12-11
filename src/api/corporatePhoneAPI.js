import api from './api';

const corporatePhoneAPI = {
  fetchCorporatePhones: async () => {
    try {
      const response = await api.get('/corporate-phones');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchCorporatePhonesByCategory: async (category) => {
    try {
      const response = await api.get(`/corporate-phones/category/${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchCorporatePhones: async (query, category = null) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category) params.append('category', category);
      const response = await api.get(`/corporate-phones/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchCorporatePhoneById: async (id) => {
    try {
      const response = await api.get(`/corporate-phones/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCorporatePhone: async (phoneData) => {
    try {
      const response = await api.post('/corporate-phones', phoneData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCorporatePhone: async (id, phoneData) => {
    try {
      const response = await api.put(`/corporate-phones/${id}`, phoneData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCorporatePhone: async (id) => {
    try {
      await api.delete(`/corporate-phones/${id}`);
    } catch (error) {
      throw error;
    }
  },

  getHistory: async (id) => {
    try {
      const response = await api.get(`/corporate-phones/${id}/history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default corporatePhoneAPI;