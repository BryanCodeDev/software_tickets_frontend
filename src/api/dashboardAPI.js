import api from './api';

const dashboardAPI = {
  fetchStats: async () => {
    try {
      const [ticketsRes, inventoryRes, documentsRes, repositoryRes] = await Promise.all([
        api.get('/tickets'),
        api.get('/inventory'),
        api.get('/documents'),
        api.get('/repository'),
      ]);
      return {
        tickets: ticketsRes.data.length,
        inventory: inventoryRes.data.length,
        documents: documentsRes.data.length,
        repository: repositoryRes.data.length,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};

export default dashboardAPI;