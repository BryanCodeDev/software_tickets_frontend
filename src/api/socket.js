import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

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