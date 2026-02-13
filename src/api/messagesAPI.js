import api from './api';

const messagesAPI = {
  fetchMessages: async (ticketId, ticketType = 'soporte') => {
    const response = await api.get(`/messages/ticket/${ticketId}?ticketType=${ticketType}`);
    return response.data;
  },

  createMessage: async (ticketId, messageData, ticketType = 'soporte') => {
    const response = await api.post(`/messages/ticket/${ticketId}?ticketType=${ticketType}`, messageData);
    return response.data;
  },

  updateMessage: async (messageId, messageData) => {
    const response = await api.put(`/messages/${messageId}`, messageData);
    return response.data;
  },

  deleteMessage: async (messageId) => {
    await api.delete(`/messages/${messageId}`);
  },
};

export default messagesAPI;
