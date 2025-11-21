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

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const socket = io(getSocketURL(), {
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  query: {
    token: getAuthToken()
  }
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

export const onTicketCreated = (callback) => {
  socket.on('ticket-created', callback);
};

export const onTicketDeleted = (callback) => {
  socket.on('ticket-deleted', callback);
};

export const onTicketsListUpdated = (callback) => {
  socket.on('tickets-list-updated', callback);
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

export const offTicketCreated = (callback) => {
  socket.off('ticket-created', callback);
};

export const offTicketDeleted = (callback) => {
  socket.off('ticket-deleted', callback);
};

export const offTicketsListUpdated = (callback) => {
  socket.off('tickets-list-updated', callback);
};

export const onUserUpdated = (callback) => {
  socket.on('user-updated', callback);
};

export const onUsersListUpdated = (callback) => {
  socket.on('users-list-updated', callback);
};

export const offUserUpdated = (callback) => {
  socket.off('user-updated', callback);
};

export const offUsersListUpdated = (callback) => {
  socket.off('users-list-updated', callback);
};

export const onForceLogout = (callback) => {
  socket.on('force-logout', callback);
};

export const offForceLogout = (callback) => {
  socket.off('force-logout', callback);
};

// Document WebSocket functions
export const onDocumentCreated = (callback) => {
  socket.on('document-created', callback);
};

export const onDocumentUpdated = (callback) => {
  socket.on('document-updated', callback);
};

export const onDocumentDeleted = (callback) => {
  socket.on('document-deleted', callback);
};

export const onDocumentsListUpdated = (callback) => {
  socket.on('documents-list-updated', callback);
};

export const onFolderCreated = (callback) => {
  socket.on('folder-created', callback);
};

export const onFolderUpdated = (callback) => {
  socket.on('folder-updated', callback);
};

export const onFolderDeleted = (callback) => {
  socket.on('folder-deleted', callback);
};

export const onFoldersListUpdated = (callback) => {
  socket.on('folders-list-updated', callback);
};

export const onDocumentPermissionsUpdated = (callback) => {
  socket.on('document-permissions-updated', callback);
};

export const offDocumentCreated = (callback) => {
  socket.off('document-created', callback);
};

export const offDocumentUpdated = (callback) => {
  socket.off('document-updated', callback);
};

export const offDocumentDeleted = (callback) => {
  socket.off('document-deleted', callback);
};

export const offDocumentsListUpdated = (callback) => {
  socket.off('documents-list-updated', callback);
};

export const offFolderCreated = (callback) => {
  socket.off('folder-created', callback);
};

export const offFolderUpdated = (callback) => {
  socket.off('folder-updated', callback);
};

export const offFolderDeleted = (callback) => {
  socket.off('folder-deleted', callback);
};

export const offFoldersListUpdated = (callback) => {
  socket.off('folders-list-updated', callback);
};

export const offDocumentPermissionsUpdated = (callback) => {
  socket.off('document-permissions-updated', callback);
};

export default socket;
