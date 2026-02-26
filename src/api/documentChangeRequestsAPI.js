import api from './api';

const BASE_URL = '/document-change-requests';

const documentChangeRequestsAPI = {
  // Obtener todas las solicitudes de cambio
  getAll: async (params = {}) => {
    const response = await api.get(BASE_URL, { params });
    return response.data;
  },

  // Obtener estadísticas
  getStats: async () => {
    const response = await api.get(`${BASE_URL}/stats`);
    return response.data;
  },

  // Obtener por ID
  getById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Crear solicitud de cambio
  create: async (data) => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Actualizar solicitud de cambio
  update: async (id, data) => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Eliminar solicitud de cambio
  delete: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Enviar a revisión
  submitForReview: async (id) => {
    const response = await api.post(`${BASE_URL}/${id}/submit`);
    return response.data;
  },

  // Aprobar/rechazar paso
  approveStep: async (id, data) => {
    const response = await api.post(`${BASE_URL}/${id}/approve`, data);
    return response.data;
  },

  // Subir archivo propuesto
  uploadFile: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`${BASE_URL}/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Comentarios
  getComments: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}/comments`);
    return response.data;
  },

  addComment: async (id, content) => {
    const response = await api.post(`${BASE_URL}/${id}/comments`, { content });
    return response.data;
  },

  editComment: async (id, commentId, content) => {
    const response = await api.put(`${BASE_URL}/${id}/comments/${commentId}`, { content });
    return response.data;
  },

  deleteComment: async (id, commentId) => {
    const response = await api.delete(`${BASE_URL}/${id}/comments/${commentId}`);
    return response.data;
  }
};

export default documentChangeRequestsAPI;
