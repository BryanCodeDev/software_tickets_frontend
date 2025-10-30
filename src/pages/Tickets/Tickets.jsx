import React, { useState, useEffect, useContext, useRef } from 'react';
import { ticketsAPI, messagesAPI, usersAPI } from '../../api';
import { joinTicketRoom, leaveTicketRoom, onNewMessage, onMessageUpdated, onMessageDeleted, onNewComment, onTicketUpdated, offNewMessage, offMessageUpdated, offMessageDeleted, offNewComment, offTicketUpdated } from '../../api/socket';
import AuthContext from '../../context/AuthContext.jsx';
import { FaEdit, FaTrash, FaComment, FaPlus, FaCheck, FaTimes, FaEye, FaImage, FaVideo, FaFile, FaPaperPlane, FaEllipsisV, FaPen, FaTrashAlt } from 'react-icons/fa';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'media', status: 'abierto', assignedTo: '', attachments: [] });
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [editFormData, setEditFormData] = useState({ title: '', description: '', priority: 'media', status: 'abierto', assignedTo: '' });
  const [titleFilter, setTitleFilter] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [administrators, setAdministrators] = useState([]);

  // Standardized ticket titles
  const standardizedTitles = [
    'Problemas con SAMP',
    'Problemas con impresoras',
    'Problemas con contraseña',
    'Problemas con Heinsohn',
    'Problemas con Excel, Word, PDF',
    'Problemas con acceso a carpetas',
    'Problemas con el navegador'
  ];
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTickets();
    fetchUsers();

    // Configurar listeners de WebSocket para mensajes y tickets
    const handleNewMessage = (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
      scrollToBottom();
    };

    const handleMessageUpdated = (updatedMessage) => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === updatedMessage.id ? updatedMessage : msg
        )
      );
    };

    const handleMessageDeleted = (messageId) => {
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.id !== messageId)
      );
    };

    const handleNewComment = (newComment) => {
      setComments(prevComments => [...prevComments, newComment]);
      showNotification('Nuevo comentario recibido', 'success');
    };

    const handleTicketUpdated = (updatedTicket) => {
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      );
      showNotification('Ticket actualizado', 'success');
    };

    onNewMessage(handleNewMessage);
    onMessageUpdated(handleMessageUpdated);
    onMessageDeleted(handleMessageDeleted);
    onNewComment(handleNewComment);
    onTicketUpdated(handleTicketUpdated);

    return () => {
      offNewMessage(handleNewMessage);
      offMessageUpdated(handleMessageUpdated);
      offMessageDeleted(handleMessageDeleted);
      offNewComment(handleNewComment);
      offTicketUpdated(handleTicketUpdated);
    };
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await ticketsAPI.fetchTickets();
      setTickets(data);
    } catch (err) {
      console.error('Error al cargar tickets:', err);
      showNotification('Error al cargar los tickets. Por favor, recarga la página.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Only fetch users if user has appropriate role
      if (user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico') {
        const users = await usersAPI.fetchUsers();
        setAvailableUsers(users);

        // Filter technicians and administrators
        const techUsers = users.filter(user => user.Role?.name === 'Técnico');
        const adminUsers = users.filter(user => user.Role?.name === 'Administrador');

        setTechnicians(techUsers);
        setAdministrators(adminUsers);
      } else {
        // For employees, set empty arrays or handle differently
        setAvailableUsers([]);
        setTechnicians([]);
        setAdministrators([]);
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      // Don't show error notification for employees - they just can't see users
      if (user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico') {
        showNotification('Error al cargar los usuarios. Verifica que tengas permisos.', 'error');
      }
    }
  };

  const handleCreate = () => {
    setFormData({ title: '', description: '', priority: 'media', status: 'abierto', assignedTo: '', attachments: [] });
    setAttachmentPreviews([]);
    setShowCreateModal(true);
  };

  // Filter tickets based on title
  const filteredTickets = tickets.filter(ticket =>
    titleFilter === '' || ticket.title?.toLowerCase().includes(titleFilter.toLowerCase())
  );

  const handleEdit = (ticket) => {
    const userRole = user?.role?.name;
    const isOwner = ticket.userId === user?.id;

    // Check permissions based on role
    if (userRole === 'Administrador') {
      // Can edit everything
      setEditFormData({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        assignedTo: ticket.assignedTo || ''
      });
    } else if (userRole === 'Técnico') {
      // Can edit status, priority, and assignment
      setEditFormData({
        priority: ticket.priority,
        status: ticket.status,
        assignedTo: ticket.assignedTo || ''
      });
    } else if (isOwner && userRole === 'Empleado') {
      // Can only edit their own tickets (title, description, priority)
      setEditFormData({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        assignedTo: ticket.assignedTo || ''
      });
    } else {
      showNotification('No tienes permisos para editar este ticket', 'error');
      return;
    }

    setEditingTicket(ticket);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    const userRole = user?.role?.name;
    let confirmMessage = '¿Estás seguro de que deseas eliminar este ticket?';

    if (userRole === 'Técnico') {
      confirmMessage = '¿Estás seguro de que deseas eliminar este ticket? Solo puedes eliminar tickets asignados a ti y que estén cerrados.';
    } else if (userRole === 'Administrador') {
      confirmMessage = '¿Estás seguro de que deseas eliminar este ticket? Solo puedes eliminar tickets cerrados o de tu propiedad.';
    }

    showConfirmDialog(confirmMessage, async () => {
      try {
        await ticketsAPI.deleteTicket(id);
        fetchTickets();
        showNotification('Ticket eliminado exitosamente', 'success');
      } catch (err) {
        console.error('Error al eliminar:', err);
        const errorMessage = err.response?.data?.error || 'Error al eliminar el ticket. Verifica que tengas los permisos necesarios.';
        showNotification(errorMessage, 'error');
      }
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      // Handle group assignments
      let assignedToValue = formData.assignedTo;
      if (formData.assignedTo === 'all-technicians') {
        // For now, assign to first technician (you might want to create multiple tickets or handle differently)
        assignedToValue = technicians.length > 0 ? technicians[0].id : null;
      } else if (formData.assignedTo === 'all-administrators') {
        assignedToValue = administrators.length > 0 ? administrators[0].id : null;
      } else if (formData.assignedTo === 'technicians-and-admins') {
        // Assign to first available technician or admin
        assignedToValue = technicians.length > 0 ? technicians[0].id : (administrators.length > 0 ? administrators[0].id : null);
      }

      // Create ticket first
      const ticket = await ticketsAPI.createTicket({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assignedTo: assignedToValue || null
      });

      // Upload attachments if any
      if (formData.attachments && formData.attachments.length > 0) {
        for (const file of formData.attachments) {
          const formDataFile = new FormData();
          formDataFile.append('file', file);
          await ticketsAPI.uploadAttachment(ticket.id, formDataFile);
        }
      }

      fetchTickets();
      setShowCreateModal(false);
      setAttachmentPreviews([]);
      showNotification('Ticket creado exitosamente', 'success');
    } catch (err) {
      console.error('Error al crear ticket:', err);
      const errorMessage = err.response?.data?.error || 'Error al crear el ticket. Por favor, inténtalo de nuevo.';
      showNotification(errorMessage, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      // Handle group assignments for edit
      let assignedToValue = editFormData.assignedTo;
      if (editFormData.assignedTo === 'all-technicians') {
        assignedToValue = technicians.length > 0 ? technicians[0].id : null;
      } else if (editFormData.assignedTo === 'all-administrators') {
        assignedToValue = administrators.length > 0 ? administrators[0].id : null;
      } else if (editFormData.assignedTo === 'technicians-and-admins') {
        assignedToValue = technicians.length > 0 ? technicians[0].id : (administrators.length > 0 ? administrators[0].id : null);
      }

      const updateData = { ...editFormData, assignedTo: assignedToValue || null };
      await ticketsAPI.updateTicket(editingTicket.id, updateData);
      fetchTickets();
      setShowEditModal(false);
      showNotification('Ticket actualizado exitosamente', 'success');
    } catch (err) {
      console.error('Error al actualizar ticket:', err);
      const errorMessage = err.response?.data?.error || 'Error al actualizar el ticket. Verifica que tengas permisos para editar estos campos.';
      showNotification(errorMessage, 'error');
    } finally {
      setFormLoading(false);
    }
  };


  const handleViewDetail = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const data = await ticketsAPI.fetchTicketById(ticket.id);
      setComments(data.comments || []);
      setMessages(data.messages || []);
      setAttachments(data.TicketAttachments || []);

      // Cargar mensajes persistentes desde la API - only if user has permission
      try {
        const persistentMessages = await messagesAPI.fetchMessages(ticket.id);
        setMessages(persistentMessages);
      } catch (msgErr) {
        console.error('Error al cargar mensajes:', msgErr);
        // Don't show error for employees - they just can't see messages from other tickets
        if (user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico') {
          showNotification('Error al cargar los mensajes del ticket.', 'error');
        }
        // Set empty messages array for employees without access
        setMessages([]);
      }

      // Unirse a la sala del ticket para recibir actualizaciones en tiempo real
      joinTicketRoom(ticket.id);
      // Scroll to bottom after loading messages
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('Error al cargar detalles del ticket:', err);
      showNotification('Error al cargar los detalles del ticket.', 'error');
    }
    setShowDetailModal(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await messagesAPI.createMessage(selectedTicket.id, { content: newMessage });
      setNewMessage('');
      // No necesitamos recargar los mensajes ya que se actualizarán automáticamente via WebSocket
      showNotification('Mensaje enviado exitosamente', 'success');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      const errorMessage = err.response?.data?.error || 'Error al enviar mensaje. Verifica que tengas permisos para enviar mensajes en este ticket.';
      showNotification(errorMessage, 'error');
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    try {
      await messagesAPI.updateMessage(messageId, { content: newContent });
      setEditingMessage(null);
      setEditMessageContent('');
      showNotification('Mensaje editado exitosamente', 'success');
    } catch (err) {
      console.error('Error al editar mensaje:', err);
      const errorMessage = err.response?.data?.error || 'Error al editar mensaje. Solo puedes editar tus propios mensajes.';
      showNotification(errorMessage, 'error');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar este mensaje?', async () => {
      try {
        await messagesAPI.deleteMessage(messageId);
        showNotification('Mensaje eliminado exitosamente', 'success');
      } catch (err) {
        console.error('Error al eliminar mensaje:', err);
        const errorMessage = err.response?.data?.error || 'Error al eliminar mensaje. Verifica que tengas permisos para eliminar este mensaje.';
        showNotification(errorMessage, 'error');
      }
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await ticketsAPI.addComment(selectedTicket.id, { content: newComment });
      setNewComment('');
      // No necesitamos recargar los comentarios ya que se actualizarán automáticamente via WebSocket
      showNotification('Comentario agregado exitosamente', 'success');
    } catch (err) {
      console.error('Error al agregar comentario:', err);
      const errorMessage = err.response?.data?.error || 'Error al agregar comentario. Verifica que tengas permisos para comentar en este ticket.';
      showNotification(errorMessage, 'error');
    }
  };

  // Role-based permissions
  const userRole = user?.role?.name;
  const canCreate = true; // All authenticated users can create tickets
  const canEdit = userRole === 'Administrador' || userRole === 'Técnico';
  const canDelete = userRole === 'Administrador' || userRole === 'Técnico';
  const canAssign = userRole === 'Administrador' || userRole === 'Técnico';

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  const handleConfirm = () => {
    if (confirmDialog?.onConfirm) {
      confirmDialog.onConfirm();
    }
    setConfirmDialog(null);
  };

  const handleCancelConfirm = () => {
    setConfirmDialog(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      'abierto': 'bg-purple-100 text-purple-700 border-purple-200',
      'en progreso': 'bg-violet-100 text-violet-700 border-violet-200',
      'cerrado': 'bg-gray-200 text-gray-700 border-gray-300',
      'resuelto': 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'alta': 'bg-purple-200 text-purple-800 border-purple-300',
      'media': 'bg-violet-100 text-violet-700 border-violet-200',
      'baja': 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    return colors[priority?.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types and sizes
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter(file => {
      const isValidType = allowedTypes.some(type =>
        file.type === type || file.name.toLowerCase().endsWith(type)
      );
      const isValidSize = file.size <= maxSize;

      if (!isValidType) {
        showNotification(`Tipo de archivo no permitido: ${file.name}`, 'error');
        return false;
      }
      if (!isValidSize) {
        showNotification(`Archivo demasiado grande (máx. 10MB): ${file.name}`, 'error');
        return false;
      }
      return true;
    });

    setFormData({ ...formData, attachments: validFiles });

    // Create previews for images and videos
    const previews = validFiles.map(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        return {
          file,
          url: URL.createObjectURL(file),
          type: file.type
        };
      }
      return { file, url: null, type: file.type };
    });
    setAttachmentPreviews(previews);
  };

  const removeAttachment = (index) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    const newPreviews = attachmentPreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, attachments: newAttachments });
    setAttachmentPreviews(newPreviews);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className={`flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="shrink-0">
              {notification.type === 'success' ? (
                <FaCheck className="w-5 h-5 text-green-400" />
              ) : (
                <FaTimes className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setNotification(null)}
                className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-gray-50"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTimes className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Confirmar Acción</h3>
              <p className="text-sm text-gray-600 text-center mb-6">{confirmDialog.message}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Gestión de Tickets
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">Administra y da seguimiento a las incidencias del sistema</p>
            </div>
            {canCreate && (
              <button
                onClick={handleCreate}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
              >
                <FaPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Nuevo Ticket</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{filteredTickets.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Abiertos</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">
                  {filteredTickets.filter(t => t.status?.toLowerCase() === 'abierto').length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">En Progreso</p>
                <p className="text-2xl sm:text-3xl font-bold text-violet-600 mt-1">
                  {filteredTickets.filter(t => t.status?.toLowerCase() === 'en progreso').length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Resueltos</p>
                <p className="text-2xl sm:text-3xl font-bold text-indigo-600 mt-1">
                  {filteredTickets.filter(t => t.status?.toLowerCase() === 'resuelto' || t.status?.toLowerCase() === 'cerrado').length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Lista de Tickets</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={titleFilter}
                  onChange={(e) => setTitleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                >
                  <option value="">Todos los títulos</option>
                  {standardizedTitles.map((title, index) => (
                    <option key={index} value={title}>{title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {tickets.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No hay tickets disponibles</h3>
              <p className="text-sm sm:text-base text-gray-600">Comienza creando un nuevo ticket para dar seguimiento a incidencias</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{ticket.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                            Prioridad {ticket.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {ticket.assignee?.name || ticket.assignedTo || 'Sin asignar'}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 sm:gap-2 ml-0 sm:ml-4">
                      <button
                        onClick={() => handleViewDetail(ticket)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      {(canEdit || (userRole === 'Empleado' && ticket.userId === user?.id)) && (
                        <button
                          onClick={() => handleEdit(ticket)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar ticket"
                        >
                          <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(ticket.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar ticket"
                        >
                          <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-lg w-full max-h-[95vh] overflow-y-auto border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Nuevo Ticket</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <select
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base mb-2"
                  required
                >
                  <option value="">Selecciona un título estandarizado</option>
                  {standardizedTitles.map((title, index) => (
                    <option key={index} value={title}>{title}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">Selecciona un título estandarizado para mantener consistencia</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  placeholder="Describe el problema o solicitud"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjuntar Archivos (opcional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                  onChange={handleFileChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                <p className="text-xs text-gray-500 mt-1">Formatos permitidos: imágenes, videos, PDF, documentos de Office (máx. 10MB por archivo)</p>

                {/* Attachment Previews */}
                {attachmentPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {attachmentPreviews.map((preview, index) => (
                      <div key={index} className="relative bg-gray-50 rounded-lg p-2 border border-gray-200">
                        {preview.url ? (
                          preview.type.startsWith('image/') ? (
                            <img
                              src={preview.url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                          ) : preview.type.startsWith('video/') ? (
                            <video
                              src={preview.url}
                              className="w-full h-20 object-cover rounded-lg"
                              muted
                            />
                          ) : null
                        ) : (
                          <div className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FaFile className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-600 mt-1 truncate">{preview.file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asignado a
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  >
                    <option value="">Sin asignar</option>
                    {technicians.length > 0 && (
                      <optgroup label="Técnicos Individuales">
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.id}>
                            {tech.name || tech.username} (Técnico)
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {administrators.length > 0 && (
                      <optgroup label="Administradores Individuales">
                        {administrators.map((admin) => (
                          <option key={admin.id} value={admin.id}>
                            {admin.name || admin.username} (Administrador)
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {(technicians.length > 0 || administrators.length > 0) && (
                      <optgroup label="Grupos">
                        {technicians.length > 0 && <option value="all-technicians">Todos los Técnicos</option>}
                        {administrators.length > 0 && <option value="all-administrators">Todos los Administradores</option>}
                        {technicians.length > 0 && administrators.length > 0 && <option value="technicians-and-admins">Técnicos y Administradores</option>}
                      </optgroup>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  >
                    <option value="abierto">Abierto</option>
                    <option value="en progreso">En Progreso</option>
                    <option value="resuelto">Resuelto</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando...
                    </>
                  ) : (
                    'Crear Ticket'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-lg w-full max-h-[95vh] overflow-y-auto border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Editar Ticket</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <select
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base mb-2"
                  required
                >
                  <option value="">Selecciona un título estandarizado</option>
                  {standardizedTitles.map((title, index) => (
                    <option key={index} value={title}>{title}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">Selecciona un título estandarizado para mantener consistencia</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  placeholder="Describe el problema o solicitud"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  rows="4"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asignado a
                  </label>
                  <select
                    value={editFormData.assignedTo}
                    onChange={(e) => setEditFormData({ ...editFormData, assignedTo: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  >
                    <option value="">Sin asignar</option>
                    {technicians.length > 0 && (
                      <optgroup label="Técnicos Individuales">
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.id}>
                            {tech.name || tech.username} (Técnico)
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {administrators.length > 0 && (
                      <optgroup label="Administradores Individuales">
                        {administrators.map((admin) => (
                          <option key={admin.id} value={admin.id}>
                            {admin.name || admin.username} (Administrador)
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {(technicians.length > 0 || administrators.length > 0) && (
                      <optgroup label="Grupos">
                        {technicians.length > 0 && <option value="all-technicians">Todos los Técnicos</option>}
                        {administrators.length > 0 && <option value="all-administrators">Todos los Administradores</option>}
                        {technicians.length > 0 && administrators.length > 0 && <option value="technicians-and-admins">Técnicos y Administradores</option>}
                      </optgroup>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  >
                    <option value="abierto">Abierto</option>
                    <option value="en progreso">En Progreso</option>
                    <option value="resuelto">Resuelto</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{selectedTicket?.title}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedTicket?.status)}`}>
                      {selectedTicket?.status}
                    </span>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedTicket?.priority)}`}>
                      Prioridad {selectedTicket?.priority}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    leaveTicketRoom(selectedTicket?.id);
                    setShowDetailModal(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-4"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{selectedTicket?.description}</p>
                  </div>

                  {/* Messages/Chat */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FaComment className="w-5 h-5 mr-2 text-purple-600" />
                      Conversación ({messages.length})
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                      {messages.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center">
                          {user?.role?.name === 'Empleado' && selectedTicket?.userId !== user?.id && selectedTicket?.assignedTo !== user?.id
                            ? 'No tienes permisos para ver los mensajes de este ticket.'
                            : 'No hay mensajes aún. ¡Inicia la conversación!'
                          }
                        </p>
                      ) : (
                        messages.map((message) => (
                          <div key={message.id} className={`flex ${message.sender?.id === user?.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender?.id === user?.id
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 border border-gray-200 text-gray-900'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-medium ${
                                  message.sender?.id === user?.id ? 'text-purple-100' : 'text-gray-600'
                                }`}>
                                  {message.sender?.name || message.sender?.username || 'Usuario'}
                                </span>
                                <div className="flex items-center space-x-1 ml-2">
                                  {message.isEdited && (
                                    <span className={`text-xs ${message.sender?.id === user?.id ? 'text-purple-200' : 'text-gray-400'}`}>
                                      (editado)
                                    </span>
                                  )}
                                  {message.sender?.id === user?.id && (
                                    <div className="relative">
                                      <button
                                        onClick={() => {
                                          if (editingMessage === message.id) {
                                            setEditingMessage(null);
                                            setEditMessageContent('');
                                          } else {
                                            setEditingMessage(message.id);
                                            setEditMessageContent(message.content);
                                          }
                                        }}
                                        className={`text-xs hover:bg-gray-100 rounded p-1 ${
                                          message.sender?.id === user?.id ? 'hover:bg-purple-500' : ''
                                        }`}
                                      >
                                        <FaEllipsisV />
                                      </button>
                                      {editingMessage === message.id && (
                                        <div className={`absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-10 ${
                                          message.sender?.id === user?.id ? 'bg-white' : ''
                                        }`}>
                                          <button
                                            onClick={() => handleEditMessage(message.id, editMessageContent)}
                                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-black"
                                          >
                                            <FaPen className="inline mr-2" /> Editar
                                          </button>
                                          <button
                                            onClick={() => handleDeleteMessage(message.id)}
                                            className="block w-full text-left px-3 py-2 text-sm hover:bg-red-100 text-red-600"
                                          >
                                            <FaTrashAlt className="inline mr-2" /> Eliminar
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {editingMessage === message.id ? (
                                <textarea
                                  value={editMessageContent}
                                  onChange={(e) => setEditMessageContent(e.target.value)}
                                  className="w-full px-2 py-1 text-sm bg-transparent border border-purple-300 rounded focus:outline-none"
                                  rows="2"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleEditMessage(message.id, editMessageContent);
                                    } else if (e.key === 'Escape') {
                                      setEditingMessage(null);
                                      setEditMessageContent('');
                                    }
                                  }}
                                />
                              ) : (
                                <p className="text-sm">{message.content}</p>
                              )}
                              <span className={`text-xs mt-1 block ${
                                message.sender?.id === user?.id ? 'text-purple-200' : 'text-gray-400'
                              }`}>
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Send Message Form */}
                    {(user?.role?.name === 'Administrador' ||
                      user?.role?.name === 'Técnico' ||
                      (user?.role?.name === 'Empleado' && selectedTicket?.userId === user?.id)) && (
                      <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Escribe un mensaje..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center"
                          disabled={!newMessage.trim()}
                        >
                          <FaPaperPlane className="w-4 h-4" />
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Attachments - Only show images and videos */}
                  {(() => {
                    const mediaAttachments = attachments.filter(att =>
                      att.type?.startsWith('image/') || att.type?.startsWith('video/')
                    );
                    return mediaAttachments.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <FaImage className="w-5 h-5 mr-2 text-purple-600" />
                          Imágenes y Videos ({mediaAttachments.length})
                        </h3>
                        <div className="space-y-4">
                          {mediaAttachments.map((attachment, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              {attachment.type?.startsWith('image/') ? (
                                <div className="mb-3">
                                  <img
                                    src={`http://localhost:5000/uploads/tickets/${attachment.filename}`}
                                    alt={attachment.filename}
                                    className="w-full max-h-96 object-contain rounded-lg border border-gray-300"
                                    onError={(e) => {
                                      console.error('Error loading image:', e.target.src);
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              ) : attachment.type?.startsWith('video/') ? (
                                <div className="mb-3">
                                  <video
                                    controls
                                    className="w-full max-h-96 rounded-lg border border-gray-300"
                                    preload="metadata"
                                  >
                                    <source src={`http://localhost:5000/uploads/tickets/${attachment.filename}`} type={attachment.type} />
                                    Tu navegador no soporta el elemento de video.
                                  </video>
                                </div>
                              ) : null}
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{attachment.filename}</p>
                                  <p className="text-xs text-gray-500">
                                    {(attachment.size / 1024 / 1024).toFixed(2)} MB • Subido por {attachment.uploader?.name || attachment.uploader?.username || 'Usuario'}
                                  </p>
                                </div>
                                <button
                                  onClick={() => window.open(`http://localhost:5000/uploads/tickets/${attachment.filename}`, '_blank')}
                                  className="ml-3 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md transition-colors"
                                >
                                  Descargar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Ticket Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Información del Ticket</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Creado por:</strong> {selectedTicket?.creator?.name || selectedTicket?.creator?.username || 'Usuario'}</div>
                      <div><strong>Asignado a:</strong> {selectedTicket?.assignee?.name || selectedTicket?.assignee?.username || 'Sin asignar'}</div>
                      <div><strong>Fecha de creación:</strong> {new Date(selectedTicket?.createdAt).toLocaleDateString()}</div>
                      <div><strong>Última actualización:</strong> {new Date(selectedTicket?.updatedAt).toLocaleDateString()}</div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Tickets;
