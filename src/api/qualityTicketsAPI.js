import api from './api';

const qualityTicketsAPI = {
  fetchQualityTickets: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = `/quality-tickets${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  searchQualityTickets: async (query) => {
    const response = await api.get(`/quality-tickets/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  fetchQualityTicketById: async (id) => {
    const response = await api.get(`/quality-tickets/${id}`);
    return response.data;
  },

  createQualityTicket: async (ticketData) => {
    const response = await api.post('/quality-tickets', ticketData);
    return response.data;
  },

  createQualityTicketWithAttachment: async (formData) => {
    const response = await api.post('/quality-tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updateQualityTicket: async (id, ticketData) => {
    const response = await api.put(`/quality-tickets/${id}`, ticketData);
    return response.data;
  },

  deleteQualityTicket: async (id) => {
    await api.delete(`/quality-tickets/${id}`);
  },

  addCommentToQualityTicket: async (id, commentData) => {
    const response = await api.post(`/quality-tickets/${id}/comments`, commentData);
    return response.data;
  },

  uploadAttachmentToQualityTicket: async (id, formData) => {
    const response = await api.post(`/quality-tickets/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
};

export default qualityTicketsAPI;