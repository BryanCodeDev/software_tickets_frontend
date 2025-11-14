import io from 'socket.io-client';

// Configuración dinámica del Socket.IO
const getSocketURL = () => {
  // Si estás en desarrollo (Vite dev server)
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
  }

  // Si estás en producción
  // Conectar directamente al backend en el puerto 5000
  return `${window.location.protocol}//${window.location.hostname}:5000`;
};

const socket = io(getSocketURL(), {
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
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