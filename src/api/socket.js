import io from 'socket.io-client';

// Configuración dinámica del Socket.IO
const getSocketURL = () => {
  // Primero intentar usar VITE_SOCKET_URL si está definido
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  // Si no, derivar de VITE_API_URL (removiendo /api)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace('/api', '');
  }

  // Fallback para desarrollo local
  return `${window.location.protocol}//${window.location.hostname}:5000`;
};

let socket = null;

const getSocket = () => {
  if (!socket) {
    socket = io(getSocketURL(), {
      transports: ['polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });
  }
  return socket;
};

export const joinTicketRoom = (ticketId) => {
  getSocket().emit('join-ticket', ticketId);
};

export const leaveTicketRoom = (ticketId) => {
  getSocket().emit('leave-ticket', ticketId);
};

export const onNewMessage = (callback) => {
  getSocket().on('new-message', callback);
};

export const onMessageUpdated = (callback) => {
  getSocket().on('message-updated', callback);
};

export const onMessageDeleted = (callback) => {
  getSocket().on('message-deleted', callback);
};

export const onNewComment = (callback) => {
  getSocket().on('new-comment', callback);
};

export const onTicketUpdated = (callback) => {
  getSocket().on('ticket-updated', callback);
};

export const offNewMessage = (callback) => {
  getSocket().off('new-message', callback);
};

export const offMessageUpdated = (callback) => {
  getSocket().off('message-updated', callback);
};

export const offMessageDeleted = (callback) => {
  getSocket().off('message-deleted', callback);
};

export const offNewComment = (callback) => {
  getSocket().off('new-comment', callback);
};

export const offTicketUpdated = (callback) => {
  getSocket().off('ticket-updated', callback);
};

export default getSocket;