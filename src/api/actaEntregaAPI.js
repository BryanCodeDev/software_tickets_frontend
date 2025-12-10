import api from './api';

const actaEntregaAPI = {
  // Obtener todas las actas de entrega
  getAll: () => api.get('/actas-entrega'),

  // Obtener acta por ID
  getById: (id) => api.get(`/actas-entrega/${id}`),

  // Obtener actas por usuario
  getByUser: (userId) => api.get(`/actas-entrega/user/${userId}`),

  // Crear nueva acta
  create: (data) => api.post('/actas-entrega', data),

  // Actualizar acta
  update: (id, data) => api.put(`/actas-entrega/${id}`, data),

  // Eliminar acta
  delete: (id) => api.delete(`/actas-entrega/${id}`),

  // Buscar actas
  search: (query) => api.get('/actas-entrega/search', { params: { q: query } }),

  // Exportar a PDF
  exportPDF: (id) => api.get(`/actas-entrega/${id}/export/pdf`, { responseType: 'blob' }),

  // Exportar a Word
  exportWord: (id) => api.get(`/actas-entrega/${id}/export/word`, { responseType: 'blob' }),

  // Imprimir (obtener HTML para impresión)
  getForPrint: (id) => api.get(`/actas-entrega/${id}/print`)
};

export default actaEntregaAPI;