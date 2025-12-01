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

let socket = null;

const createSocket = () => {
  if (socket) return socket;

  const token = getAuthToken();
  if (!token) {
    console.warn('No auth token available, socket will not connect');
    return null;
  }

  socket = io(getSocketURL(), {
    path: '/socket.io/',
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    query: {
      token: token
    }
  });

  // Add error handling
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('connect', () => {
    console.log('Socket connected successfully');
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  // Handle authentication errors
  socket.on('unauthorized', (error) => {
    console.error('Socket authentication error:', error);
    // Optionally, redirect to login or refresh token
  });

  return socket;
};

const getSocket = () => {
  if (!socket) {
    socket = createSocket();
  }
  return socket;
};

export const updateSocketAuth = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  // New socket will be created with updated token when getSocket is called
};

export const joinTicketRoom = (ticketId) => {
  const sock = getSocket();
  if (sock && sock.connected) {
    sock.emit('join-ticket', ticketId);
  } else {
    console.warn('Socket not available or not connected, cannot join ticket room');
  }
};

export const leaveTicketRoom = (ticketId) => {
  const sock = getSocket();
  if (sock && sock.connected) {
    sock.emit('leave-ticket', ticketId);
  } else {
    console.warn('Socket not available or not connected, cannot leave ticket room');
  }
};

export const onNewMessage = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('new-message', callback);
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

export const onTicketCreated = (callback) => {
  getSocket().on('ticket-created', callback);
};

export const onTicketDeleted = (callback) => {
  getSocket().on('ticket-deleted', callback);
};

export const onTicketsListUpdated = (callback) => {
  getSocket().on('tickets-list-updated', callback);
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

export const offTicketCreated = (callback) => {
  getSocket().off('ticket-created', callback);
};

export const offTicketDeleted = (callback) => {
  getSocket().off('ticket-deleted', callback);
};

export const offTicketsListUpdated = (callback) => {
  getSocket().off('tickets-list-updated', callback);
};

export const onUserUpdated = (callback) => {
  getSocket().on('user-updated', callback);
};

export const onUsersListUpdated = (callback) => {
  getSocket().on('users-list-updated', callback);
};

export const offUserUpdated = (callback) => {
  getSocket().off('user-updated', callback);
};

export const offUsersListUpdated = (callback) => {
  getSocket().off('users-list-updated', callback);
};

export const onForceLogout = (callback) => {
  getSocket().on('force-logout', callback);
};

export const offForceLogout = (callback) => {
  getSocket().off('force-logout', callback);
};

// Document WebSocket functions
export const onDocumentCreated = (callback) => {
  getSocket().on('document-created', callback);
};

export const onDocumentUpdated = (callback) => {
  getSocket().on('document-updated', callback);
};

export const onDocumentDeleted = (callback) => {
  getSocket().on('document-deleted', callback);
};

export const onDocumentsListUpdated = (callback) => {
  getSocket().on('documents-list-updated', callback);
};

export const onFolderCreated = (callback) => {
  getSocket().on('folder-created', callback);
};

export const onFolderUpdated = (callback) => {
  getSocket().on('folder-updated', callback);
};

export const onFolderDeleted = (callback) => {
  getSocket().on('folder-deleted', callback);
};

export const onFoldersListUpdated = (callback) => {
  getSocket().on('folders-list-updated', callback);
};

export const onDocumentPermissionsUpdated = (callback) => {
  getSocket().on('document-permissions-updated', callback);
};

export const offDocumentCreated = (callback) => {
  getSocket().off('document-created', callback);
};

export const offDocumentUpdated = (callback) => {
  getSocket().off('document-updated', callback);
};

export const offDocumentDeleted = (callback) => {
  getSocket().off('document-deleted', callback);
};

export const offDocumentsListUpdated = (callback) => {
  getSocket().off('documents-list-updated', callback);
};

export const offFolderCreated = (callback) => {
  getSocket().off('folder-created', callback);
};

export const offFolderUpdated = (callback) => {
  getSocket().off('folder-updated', callback);
};

export const offFolderDeleted = (callback) => {
  getSocket().off('folder-deleted', callback);
};

export const offFoldersListUpdated = (callback) => {
  getSocket().off('folders-list-updated', callback);
};

export const offDocumentPermissionsUpdated = (callback) => {
  getSocket().off('document-permissions-updated', callback);
};

// Purchase Request WebSocket functions
export const joinPurchaseRequestRoom = (requestId) => {
  const sock = getSocket();
  if (sock && sock.connected) {
    sock.emit('join-purchase-request', requestId);
  } else {
    console.warn('Socket not available or not connected, cannot join purchase request room');
  }
};

export const leavePurchaseRequestRoom = (requestId) => {
  const sock = getSocket();
  if (sock && sock.connected) {
    sock.emit('leave-purchase-request', requestId);
  } else {
    console.warn('Socket not available or not connected, cannot leave purchase request room');
  }
};

export const onPurchaseRequestUpdated = (callback) => {
  getSocket().on('purchase-request-updated', callback);
};

export const onPurchaseRequestCreated = (callback) => {
  getSocket().on('purchase-request-created', callback);
};

export const onPurchaseRequestDeleted = (callback) => {
  getSocket().on('purchase-request-deleted', callback);
};

export const onPurchaseRequestsListUpdated = (callback) => {
  getSocket().on('purchase-requests-list-updated', callback);
};

export const offPurchaseRequestUpdated = (callback) => {
  getSocket().off('purchase-request-updated', callback);
};

export const offPurchaseRequestCreated = (callback) => {
  getSocket().off('purchase-request-created', callback);
};

export const offPurchaseRequestDeleted = (callback) => {
  getSocket().off('purchase-request-deleted', callback);
};

export const offPurchaseRequestsListUpdated = (callback) => {
  getSocket().off('purchase-requests-list-updated', callback);
};

export default getSocket;
