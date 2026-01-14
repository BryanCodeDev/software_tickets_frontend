import api from './api';

const corporatePhoneAPI = {
  fetchCorporatePhones: async () => {
    const response = await api.get('/corporate-phones');
    return response.data;
  },

  fetchCorporatePhonesByCategory: async (category) => {
    const response = await api.get(`/corporate-phones/category/${category}`);
    return response.data;
  },

  searchCorporatePhones: async (query, category = null) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    const response = await api.get(`/corporate-phones/search?${params.toString()}`);
    return response.data;
  },

  fetchCorporatePhoneById: async (id) => {
    const response = await api.get(`/corporate-phones/${id}`);
    return response.data;
  },

  createCorporatePhone: async (phoneData) => {
    const response = await api.post('/corporate-phones', phoneData);
    return response.data;
  },

  updateCorporatePhone: async (id, phoneData) => {
    const response = await api.put(`/corporate-phones/${id}`, phoneData);
    return response.data;
  },

  deleteCorporatePhone: async (id) => {
    await api.delete(`/corporate-phones/${id}`);
  },

  getHistory: async (id) => {
    const response = await api.get(`/corporate-phones/${id}/history`);
    return response.data;
  },
};

export default corporatePhoneAPI;