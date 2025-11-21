import api from './api';

const qualityMessagesAPI = {
  fetchMessages: async (ticketId) => {
    try {
      const response = await api.get(`/messages/ticket/${ticketId}?ticketType=calidad`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createMessage: async (ticketId, messageData) => {
    try {
      const response = await api.post(`/messages/ticket/${ticketId}?ticketType=calidad`, messageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateMessage: async (messageId, messageData) => {
    try {
      const response = await api.put(`/messages/${messageId}`, messageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteMessage: async (messageId) => {
    try {
      await api.delete(`/messages/${messageId}`);
    } catch (error) {
      throw error;
    }
  },
};

export default qualityMessagesAPI;