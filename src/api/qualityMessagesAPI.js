import api from './api';

const qualityMessagesAPI = {
  fetchMessages: async (ticketId) => {
    const response = await api.get(`/messages/ticket/${ticketId}?ticketType=calidad`);
    return response.data;
  },

  createMessage: async (ticketId, messageData) => {
    const response = await api.post(`/messages/ticket/${ticketId}?ticketType=calidad`, messageData);
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

export default qualityMessagesAPI;