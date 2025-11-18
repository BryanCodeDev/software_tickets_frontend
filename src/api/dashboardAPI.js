import api from './api';

const dashboardAPI = {
  fetchStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default dashboardAPI;
