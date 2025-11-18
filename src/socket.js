const { Comment, User } = require('./models');

let io;

const initSocket = (serverIo) => {
  io = serverIo;

  io.on('connection', (socket) => {
    // Unirse a una sala de ticket específica
    socket.on('join-ticket', (ticketId) => {
      socket.join(`ticket-${ticketId}`);
    });

    // Salir de una sala de ticket
    socket.on('leave-ticket', (ticketId) => {
      socket.leave(`ticket-${ticketId}`);
    });

    socket.on('disconnect', () => {
    });
  });
};

const emitNewMessage = (ticketId, message) => {
  if (io) {
    io.to(`ticket-${ticketId}`).emit('new-message', message);
  }
};

const emitMessageUpdated = (ticketId, message) => {
  if (io) {
    io.to(`ticket-${ticketId}`).emit('message-updated', message);
  }
};

const emitMessageDeleted = (ticketId, messageId) => {
  if (io) {
    io.to(`ticket-${ticketId}`).emit('message-deleted', messageId);
  }
};

const emitNewComment = (ticketId, comment) => {
  if (io) {
    io.to(`ticket-${ticketId}`).emit('new-comment', comment);
  }
};

const emitTicketUpdate = (ticketId, ticket) => {
  if (io) {
    io.to(`ticket-${ticketId}`).emit('ticket-updated', ticket);
  }
};

module.exports = {
  initSocket,
  emitNewMessage,
  emitMessageUpdated,
  emitMessageDeleted,
  emitNewComment,
  emitTicketUpdate
};
