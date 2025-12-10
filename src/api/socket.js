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
    // console.log('Socket connected successfully');
  });

  socket.on('disconnect', (reason) => {
    // console.log('Socket disconnected:', reason);
  });

  // Handle authentication errors
  socket.on('unauthorized', (error) => {
    console.error('Socket authentication error:', error);
    // Optionally, redirect to login or refresh token
  });

  return socket;
};

export const getSocket = () => {
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
  const sock = getSocket();
  if (sock) sock.on('message-updated', callback);
};

export const onMessageDeleted = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('message-deleted', callback);
};

export const onNewComment = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('new-comment', callback);
};

export const onTicketUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('ticket-updated', callback);
};

export const onTicketCreated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('ticket-created', callback);
};

export const onTicketDeleted = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('ticket-deleted', callback);
};

export const onTicketsListUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('tickets-list-updated', callback);
};

export const offNewMessage = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('new-message', callback);
};

export const offMessageUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('message-updated', callback);
};

export const offMessageDeleted = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('message-deleted', callback);
};

export const offNewComment = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('new-comment', callback);
};

export const offTicketUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('ticket-updated', callback);
};

export const offTicketCreated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('ticket-created', callback);
};

export const offTicketDeleted = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('ticket-deleted', callback);
};

export const offTicketsListUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('tickets-list-updated', callback);
};

export const onUserUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('user-updated', callback);
};

export const onUsersListUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('users-list-updated', callback);
};

export const offUserUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('user-updated', callback);
};

export const offUsersListUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('users-list-updated', callback);
};

export const onForceLogout = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('force-logout', callback);
};

export const offForceLogout = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('force-logout', callback);
};

// Document WebSocket functions
export const onDocumentCreated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('document-created', callback);
};

export const onDocumentUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('document-updated', callback);
};

export const onDocumentDeleted = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('document-deleted', callback);
};

export const onDocumentsListUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('documents-list-updated', callback);
};

export const onFolderCreated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('folder-created', callback);
};

export const onFolderUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('folder-updated', callback);
};

export const onFolderDeleted = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('folder-deleted', callback);
};

export const onFoldersListUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('folders-list-updated', callback);
};

export const onDocumentPermissionsUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('document-permissions-updated', callback);
};

export const offDocumentCreated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('document-created', callback);
};

export const offDocumentUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('document-updated', callback);
};

export const offDocumentDeleted = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('document-deleted', callback);
};

export const offDocumentsListUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('documents-list-updated', callback);
};

export const offFolderCreated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('folder-created', callback);
};

export const offFolderUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('folder-updated', callback);
};

export const offFolderDeleted = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('folder-deleted', callback);
};

export const offFoldersListUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('folders-list-updated', callback);
};

export const offDocumentPermissionsUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('document-permissions-updated', callback);
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
  const sock = getSocket();
  if (sock) sock.on('purchase-request-updated', callback);
};

export const onPurchaseRequestCreated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('purchase-request-created', callback);
};

export const onPurchaseRequestDeleted = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('purchase-request-deleted', callback);
};

export const onPurchaseRequestsListUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('purchase-requests-list-updated', callback);
};

export const offPurchaseRequestUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('purchase-request-updated', callback);
};

export const offPurchaseRequestCreated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('purchase-request-created', callback);
};

export const offPurchaseRequestDeleted = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('purchase-request-deleted', callback);
};

export const offPurchaseRequestsListUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('purchase-requests-list-updated', callback);
};

// Acta Entrega WebSocket functions
export const onActaEntregaCreated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('acta-entrega-created', callback);
};

export const onActaEntregaUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('acta-entrega-updated', callback);
};

export const onActaEntregaDeleted = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('acta-entrega-deleted', callback);
};

export const onActasEntregaListUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.on('actas-entrega-list-updated', callback);
};

export const offActaEntregaCreated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('acta-entrega-created', callback);
};

export const offActaEntregaUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('acta-entrega-updated', callback);
};

export const offActaEntregaDeleted = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('acta-entrega-deleted', callback);
};

export const offActasEntregaListUpdated = (callback) => {
  const sock = getSocket();
  if (sock) sock.off('actas-entrega-list-updated', callback);
};

export default getSocket;
