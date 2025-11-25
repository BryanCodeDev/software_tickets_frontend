import api from './api';

const purchaseRequestsAPI = {
  // Obtener todas las solicitudes de compra
  fetchPurchaseRequests: async (params = {}) => {
    try {
      const response = await api.get('/purchase-requests', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching purchase requests:', error);
      throw error;
    }
  },

  // Obtener una solicitud de compra por ID
  fetchPurchaseRequestById: async (id) => {
    try {
      const response = await api.get(`/purchase-requests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching purchase request by ID:', error);
      throw error;
    }
  },

  // Crear una nueva solicitud de compra
  createPurchaseRequest: async (requestData) => {
    try {
      const response = await api.post('/purchase-requests', requestData);
      return response.data;
    } catch (error) {
      console.error('Error creating purchase request:', error);
      throw error;
    }
  },

  // Actualizar una solicitud de compra
  updatePurchaseRequest: async (id, requestData) => {
    try {
      const response = await api.put(`/purchase-requests/${id}`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error updating purchase request:', error);
      throw error;
    }
  },

  // Eliminar una solicitud de compra
  deletePurchaseRequest: async (id) => {
    try {
      const response = await api.delete(`/purchase-requests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting purchase request:', error);
      throw error;
    }
  },

  // Aprobar como coordinadora administrativa
  approveAsCoordinator: async (id, data = {}) => {
    try {
      const response = await api.post(`/purchase-requests/${id}/approve-coordinator`, data);
      return response.data;
    } catch (error) {
      console.error('Error approving as coordinator:', error);
      throw error;
    }
  },

  // Aprobar como jefe
  approveAsManager: async (id, data = {}) => {
    try {
      const response = await api.post(`/purchase-requests/${id}/approve-manager`, data);
      return response.data;
    } catch (error) {
      console.error('Error approving as manager:', error);
      throw error;
    }
  },

  // Marcar como comprado
  markAsPurchased: async (id, data = {}) => {
    try {
      const response = await api.post(`/purchase-requests/${id}/mark-purchased`, data);
      return response.data;
    } catch (error) {
      console.error('Error marking as purchased:', error);
      throw error;
    }
  },

  // Marcar como entregado
  markAsDelivered: async (id, data = {}) => {
    try {
      const response = await api.post(`/purchase-requests/${id}/mark-delivered`, data);
      return response.data;
    } catch (error) {
      console.error('Error marking as delivered:', error);
      throw error;
    }
  },

  // Rechazar solicitud
  rejectPurchaseRequest: async (id, rejectionData) => {
    try {
      const response = await api.post(`/purchase-requests/${id}/reject`, rejectionData);
      return response.data;
    } catch (error) {
      console.error('Error rejecting purchase request:', error);
      throw error;
    }
  },

  // Buscar solicitudes de compra
  searchPurchaseRequests: async (query) => {
    try {
      const response = await api.get('/purchase-requests/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching purchase requests:', error);
      throw error;
    }
  },

  // Obtener estadísticas de solicitudes
  getPurchaseRequestStats: async () => {
    try {
      const response = await api.get('/purchase-requests/stats/status');
      return response.data;
    } catch (error) {
      console.error('Error getting purchase request stats:', error);
      throw error;
    }
  }
};

export default purchaseRequestsAPI;