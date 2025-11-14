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

const socket = io(getSocketURL(), {
  transports: ['polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

export const joinTicketRoom = (ticketId) => {
  socket.emit('join-ticket', ticketId);
};

export const leaveTicketRoom = (ticketId) => {
  socket.emit('leave-ticket', ticketId);
};

export const onNewMessage = (callback) => {
  socket.on('new-message', callback);
};

export const onMessageUpdated = (callback) => {
  socket.on('message-updated', callback);
};

export const onMessageDeleted = (callback) => {
  socket.on('message-deleted', callback);
};

export const onNewComment = (callback) => {
  socket.on('new-comment', callback);
};

export const onTicketUpdated = (callback) => {
  socket.on('ticket-updated', callback);
};

export const offNewMessage = (callback) => {
  socket.off('new-message', callback);
};

export const offMessageUpdated = (callback) => {
  socket.off('message-updated', callback);
};

export const offMessageDeleted = (callback) => {
  socket.off('message-deleted', callback);
};

export const offNewComment = (callback) => {
  socket.off('new-comment', callback);
};

export const offTicketUpdated = (callback) => {
  socket.off('ticket-updated', callback);
};

export default socket;