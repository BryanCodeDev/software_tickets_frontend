import api from './api';

const dashboardAPI = {
  fetchStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export default dashboardAPI;
