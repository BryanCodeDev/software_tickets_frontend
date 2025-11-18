import api from './api';

const ticketsAPI = {
  fetchTickets: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const url = `/tickets${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchTickets: async (query) => {
    try {
      const response = await api.get(`/tickets/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchTicketById: async (id) => {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createTicket: async (ticketData) => {
   try {
     const response = await api.post('/tickets', ticketData);
     return response.data;
   } catch (error) {
     throw error;
   }
 },

  createTicketWithAttachment: async (formData) => {
   try {
     const response = await api.post('/tickets', formData, {
       headers: {
         'Content-Type': 'multipart/form-data'
       }
     });
     return response.data;
   } catch (error) {
     throw error;
   }
 },

  updateTicket: async (id, ticketData) => {
    try {
      const response = await api.put(`/tickets/${id}`, ticketData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTicket: async (id) => {
    try {
      await api.delete(`/tickets/${id}`);
    } catch (error) {
      throw error;
    }
  },

  addComment: async (id, commentData) => {
    try {
      const response = await api.post(`/tickets/${id}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadAttachment: async (id, formData) => {
    try {
      const response = await api.post(`/tickets/${id}/attachments`, formData, {
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

export default ticketsAPI;
