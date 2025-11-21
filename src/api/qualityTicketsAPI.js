import api from './api';

const qualityTicketsAPI = {
  fetchQualityTickets: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const url = `/quality-tickets${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchQualityTickets: async (query) => {
    try {
      const response = await api.get(`/quality-tickets/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchQualityTicketById: async (id) => {
    try {
      const response = await api.get(`/quality-tickets/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createQualityTicket: async (ticketData) => {
   try {
     const response = await api.post('/quality-tickets', ticketData);
     return response.data;
   } catch (error) {
     throw error;
   }
 },

 createQualityTicketWithAttachment: async (formData) => {
   try {
     const response = await api.post('/quality-tickets', formData, {
       headers: {
         'Content-Type': 'multipart/form-data'
       }
     });
     return response.data;
   } catch (error) {
     throw error;
   }
 },

  updateQualityTicket: async (id, ticketData) => {
    try {
      const response = await api.put(`/quality-tickets/${id}`, ticketData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteQualityTicket: async (id) => {
    try {
      await api.delete(`/quality-tickets/${id}`);
    } catch (error) {
      throw error;
    }
  },

  addCommentToQualityTicket: async (id, commentData) => {
    try {
      const response = await api.post(`/quality-tickets/${id}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadAttachmentToQualityTicket: async (id, formData) => {
    try {
      const response = await api.post(`/quality-tickets/${id}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default qualityTicketsAPI;