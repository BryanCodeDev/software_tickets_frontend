import api from './api';

const trashAPI = {
  // Obtener todos los elementos de la papelera
  getTrash: async (params = {}) => {
    try {
      const response = await api.get('/trash', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al obtener elementos de la papelera';
    }
  },

  // Obtener estadísticas de la papelera
  getTrashStats: async () => {
    try {
      const response = await api.get('/trash/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al obtener estadísticas de la papelera';
    }
  },

  // Restaurar un elemento desde la papelera
  restoreTrash: async (id) => {
    try {
      const response = await api.post(`/trash/restore/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al restaurar elemento';
    }
  },

  // Eliminar permanentemente un elemento de la papelera
  deleteTrash: async (id) => {
    try {
      const response = await api.delete(`/trash/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al eliminar permanentemente';
    }
  },

  // Vaciar toda la papelera
  emptyTrash: async () => {
    try {
      const response = await api.delete('/trash/empty/all');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al vaciar la papelera';
    }
  },

  // Obtener elementos de la papelera con filtros
  getFilteredTrash: async (filters = {}) => {
    try {
      const response = await api.get('/trash', {
        params: {
          page: filters.page || 1,
          limit: filters.limit || 10,
          moduleType: filters.moduleType || '',
          search: filters.search || ''
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al filtrar elementos de la papelera';
    }
  }
};

export default trashAPI;