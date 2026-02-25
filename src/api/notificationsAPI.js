import api from './api';

/**
 * API de Notificaciones
 */
const notificationsAPI = {
  // Obtener todas las notificaciones del usuario
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  // Obtener estadísticas de notificaciones
  getStats: async () => {
    const response = await api.get('/notifications/stats');
    return response.data;
  },

  // Marcar una notificación como leída
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Marcar todas las notificaciones como leídas
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  // Eliminar una notificación
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  // Eliminar todas las notificaciones leídas
  deleteReadNotifications: async () => {
    const response = await api.delete('/notifications/read/all');
    return response.data;
  },
};

export default notificationsAPI;
