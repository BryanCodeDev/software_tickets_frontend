import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaEdit, FaTrash, FaComment, FaPlus, FaCheck, FaTimes, FaEye, FaImage, FaVideo, FaFile, FaPaperPlane, FaEllipsisV, FaPen, FaTrashAlt, FaSearch, FaFilter, FaDownload, FaChartBar, FaClock, FaExclamationTriangle, FaCheckCircle, FaSpinner, FaUserCircle, FaClipboardList, FaFileExport, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import ticketsAPI from '../../api/ticketsAPI';
import messagesAPI from '../../api/messagesAPI';
import usersAPI from '../../api/usersAPI';
import dashboardAPI from '../../api/dashboardAPI';
import { joinTicketRoom, leaveTicketRoom, onNewMessage, onMessageUpdated, onMessageDeleted, onTicketUpdated, offNewMessage, offMessageUpdated, offMessageDeleted, offTicketUpdated } from '../../api/socket';

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
  const messagesEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('cards');
  
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    priority: 'media', 
    status: 'abierto', 
    assignedTo: '', 
    attachments: [] 
  });
  const [editFormData, setEditFormData] = useState({ 
    title: '', 
    description: '', 
    priority: 'media', 
    status: 'abierto', 
    assignedTo: '' 
  });
  const [titleFilter, setTitleFilter] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [administrators, setAdministrators] = useState([]);

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

  // Socket listeners
  useEffect(() => {
    if (selectedTicket) {
      joinTicketRoom(selectedTicket.id);

      const handleNewMessage = (message) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      };

      const handleMessageUpdated = (updatedMessage) => {
        setMessages(prev => prev.map(msg =>
          msg.id === updatedMessage.id ? updatedMessage : msg
        ));
      };

      const handleMessageDeleted = (deletedMessageId) => {
        setMessages(prev => prev.filter(msg => msg.id !== deletedMessageId));
      };

      const handleTicketUpdated = (updatedTicket) => {
        setSelectedTicket(updatedTicket);
        fetchTickets(); // Refresh the list
      };

      onNewMessage(handleNewMessage);
      onMessageUpdated(handleMessageUpdated);
      onMessageDeleted(handleMessageDeleted);
      onTicketUpdated(handleTicketUpdated);

      return () => {
        leaveTicketRoom(selectedTicket.id);
        offNewMessage(handleNewMessage);
        offMessageUpdated(handleMessageUpdated);
        offMessageDeleted(handleMessageDeleted);
        offTicketUpdated(handleTicketUpdated);
      };
    }
  }, [selectedTicket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
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
      if (user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico') {
        const users = await usersAPI.fetchUsers();
        const techUsers = users.filter(user => user.Role?.name === 'Técnico');
        const adminUsers = users.filter(user => user.Role?.name === 'Administrador');
        setTechnicians(techUsers);
        setAdministrators(adminUsers);
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  const filterAndSortTickets = () => {
    let filtered = [...tickets];

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.creator?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status?.toLowerCase() === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority?.toLowerCase() === filterPriority);
    }

    if (titleFilter) {
      filtered = filtered.filter(ticket => 
        ticket.title?.toLowerCase().includes(titleFilter.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredTickets = filterAndSortTickets();

  const calculateStats = () => {
    const total = tickets.length;
    const abiertos = tickets.filter(t => t.status?.toLowerCase() === 'abierto').length;
    const enProgreso = tickets.filter(t => t.status?.toLowerCase() === 'en progreso').length;
    const resueltos = tickets.filter(t => 
      t.status?.toLowerCase() === 'resuelto' || t.status?.toLowerCase() === 'cerrado'
    ).length;
    const alta = tickets.filter(t => t.priority?.toLowerCase() === 'alta').length;
    const resolutionRate = total > 0 ? ((resueltos / total) * 100).toFixed(1) : 0;

    return { total, abiertos, enProgreso, resueltos, alta, resolutionRate };
  };

  const stats = calculateStats();

  const handleCreate = () => {
    setFormData({ 
      title: '', 
      description: '', 
      priority: 'media', 
      status: 'abierto', 
      assignedTo: '', 
      attachments: [] 
    });
    setShowCreateModal(true);
  };

  const handleEdit = (ticket) => {
    if (!canEditTicket(ticket)) {
      showNotification('No tienes permisos para editar este ticket', 'error');
      return;
    }

    const userRole = user?.role?.name;

    if (userRole === 'Administrador') {
      setEditFormData({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        assignedTo: ticket.assignedTo || ''
      });
    } else if (userRole === 'Técnico') {
      setEditFormData({
        priority: ticket.priority,
        status: ticket.status,
        assignedTo: ticket.assignedTo || ''
      });
    } else if (userRole === 'Empleado') {
      setEditFormData({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        assignedTo: ticket.assignedTo || ''
      });
    }

    setEditingTicket(ticket);
    setShowEditModal(true);
  };

  const handleDelete = async (ticket) => {
    if (!canDeleteTicket(ticket)) {
      showNotification('No tienes permisos para eliminar este ticket', 'error');
      return;
    }

    showConfirmDialog('¿Estás seguro de que deseas eliminar este ticket? Esta acción no se puede deshacer.', async () => {
      try {
        await ticketsAPI.deleteTicket(ticket.id);
        fetchTickets();
        showNotification('Ticket eliminado exitosamente', 'success');
      } catch (err) {
        console.error('Error al eliminar:', err);
        if (err.response?.status === 403) {
          showNotification('No tienes permisos para eliminar este ticket', 'error');
        } else {
          showNotification('Error al eliminar el ticket.', 'error');
        }
      }
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let assignedToValue = formData.assignedTo;
      if (formData.assignedTo === 'all-technicians') {
        assignedToValue = technicians.length > 0 ? technicians[0].id : null;
      } else if (formData.assignedTo === 'all-administrators') {
        assignedToValue = administrators.length > 0 ? administrators[0].id : null;
      }

      await ticketsAPI.createTicket({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assignedTo: assignedToValue || null
      });

      fetchTickets();
      setShowCreateModal(false);
      showNotification('Ticket creado exitosamente', 'success');
    } catch (err) {
      console.error('Error al crear ticket:', err);
      if (err.response?.status === 403) {
        showNotification('No tienes permisos para crear tickets', 'error');
      } else {
        showNotification('Error al crear el ticket.', 'error');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let assignedToValue = editFormData.assignedTo;
      const updateData = { ...editFormData, assignedTo: assignedToValue || null };
      await ticketsAPI.updateTicket(editingTicket.id, updateData);
      fetchTickets();
      setShowEditModal(false);
      showNotification('Ticket actualizado exitosamente', 'success');
    } catch (err) {
      console.error('Error al actualizar ticket:', err);
      if (err.response?.status === 403) {
        showNotification('No tienes permisos para editar este ticket', 'error');
      } else {
        showNotification('Error al actualizar el ticket.', 'error');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewDetail = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const data = await ticketsAPI.fetchTicketById(ticket.id);
      setComments(data.comments || []);

      // Cargar mensajes usando la API de mensajes
      const messagesData = await messagesAPI.fetchMessages(ticket.id);
      setMessages(messagesData);
    } catch (err) {
      console.error('Error al cargar detalles del ticket:', err);
      if (err.response?.status === 403) {
        showNotification('No tienes permisos para ver los detalles de este ticket', 'error');
        return;
      }
      if (err.response?.status === 401) {
        showNotification('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'error');
        return;
      }
      showNotification('Error al cargar los detalles del ticket.', 'error');
    }
    setShowDetailModal(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!canSendMessage(selectedTicket)) {
      showNotification('No tienes permisos para enviar mensajes en este ticket', 'error');
      return;
    }

    try {
      await messagesAPI.createMessage(selectedTicket.id, { content: newMessage });
      setNewMessage('');
      showNotification('Mensaje enviado exitosamente', 'success');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      if (err.response?.status === 403) {
        showNotification('No tienes permisos para enviar mensajes en este ticket', 'error');
      } else {
        showNotification('Error al enviar mensaje.', 'error');
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Título', 'Descripción', 'Prioridad', 'Estado', 'Creado por', 'Asignado a', 'Fecha Creación'];
    const rows = filteredTickets.map(ticket => [
      ticket.id,
      ticket.title,
      ticket.description,
      ticket.priority,
      ticket.status,
      ticket.creator?.name || '-',
      ticket.assignee?.name || 'Sin asignar',
      new Date(ticket.createdAt).toLocaleDateString('es-ES')
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tickets_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showNotification('Tickets exportados exitosamente', 'success');
  };

  const userRole = user?.role?.name;
  const canCreate = true;

  // Funciones helper para verificar permisos por ticket específico
  const canEditTicket = (ticket) => {
    if (userRole === 'Administrador' || userRole === 'Técnico') {
      return true;
    }
    if (userRole === 'Empleado') {
      return ticket.userId === user?.id;
    }
    return false;
  };

  const canDeleteTicket = (ticket) => {
    if (userRole === 'Administrador' || userRole === 'Técnico') {
      return true;
    }
    if (userRole === 'Empleado') {
      return ticket.userId === user?.id;
    }
    return false;
  };

  const canSendMessage = (ticket) => {
    if (userRole === 'Administrador' || userRole === 'Técnico') {
      return true;
    }
    if (userRole === 'Empleado') {
      return ticket.userId === user?.id;
    }
    return false;
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  const getStatusColor = (status) => {
    const colors = {
      'abierto': 'bg-purple-100 text-purple-700 border-purple-200',
      'en progreso': 'bg-blue-100 text-blue-700 border-blue-200',
      'cerrado': 'bg-gray-200 text-gray-700 border-gray-300',
      'resuelto': 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'alta': 'bg-red-100 text-red-700 border-red-200',
      'media': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'baja': 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[priority?.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'abierto': return <FaExclamationTriangle />;
      case 'en progreso': return <FaSpinner className="animate-spin" />;
      case 'resuelto': return <FaCheckCircle />;
      case 'cerrado': return <FaCheck />;
      default: return <FaClock />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Hace un momento';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days}d`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Cargando tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 py-6 px-4 lg:px-8">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-slide-in-right">
          <div className={`flex items-center p-4 rounded-xl shadow-2xl border-2 transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-white border-green-400 text-green-800'
              : 'bg-white border-red-400 text-red-800'
          }`}>
            <div className="shrink-0">
              {notification.type === 'success' ? (
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheck className="w-5 h-5 text-green-600" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTimes className="w-5 h-5 text-red-600" />
                </div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-semibold">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 transform animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <FaExclamationTriangle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-3">Confirmar Acción</h3>
              <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">{confirmDialog.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <FaClipboardList className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    Sistema de Tickets
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Gestión integral de incidencias y soporte técnico
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg"
              >
                <FaChartBar className="w-4 h-4" />
                <span className="hidden sm:inline">Estadísticas</span>
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg"
              >
                <FaDownload className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
              {canCreate && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Nuevo Ticket</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {showStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 animate-fade-in">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FaClipboardList className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stats.total}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Total Tickets</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FaExclamationTriangle className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stats.abiertos}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Abiertos</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FaSpinner className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stats.enProgreso}</span>
              </div>
              <p className="text-sm font-medium opacity-90">En Progreso</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FaCheckCircle className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stats.resueltos}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Resueltos</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FaExclamationTriangle className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stats.alta}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Alta Prioridad</p>
            </div>
            
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FaChartBar className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stats.resolutionRate}%</span>
              </div>
              <p className="text-sm font-medium opacity-90">Tasa Resolución</p>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por título, descripción o creador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-700 font-medium"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                showFilters 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaFilter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t-2 border-gray-100 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                >
                  <option value="all">Todos los estados</option>
                  <option value="abierto">Abierto</option>
                  <option value="en progreso">En Progreso</option>
                  <option value="resuelto">Resuelto</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prioridad</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                >
                  <option value="all">Todas las prioridades</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                <select
                  value={titleFilter}
                  onChange={(e) => setTitleFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                >
                  <option value="">Todas las categorías</option>
                  {standardizedTitles.map((title, index) => (
                    <option key={index} value={title}>{title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ordenar por</label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                  >
                    <option value="createdAt">Fecha creación</option>
                    <option value="updatedAt">Última actualización</option>
                    <option value="priority">Prioridad</option>
                    <option value="status">Estado</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                  >
                    {sortOrder === 'asc' ? <FaSortAmountDown className="w-5 h-5" /> : <FaSortAmountUp className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 font-medium">
            Mostrando <span className="font-bold text-purple-600">{filteredTickets.length}</span> de <span className="font-bold">{tickets.length}</span> tickets
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'cards' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FaClipboardList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'list' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FaChartBar className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tickets Display */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClipboardList className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || titleFilter
                ? 'No se encontraron tickets' 
                : 'No hay tickets disponibles'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || titleFilter
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando un nuevo ticket para dar seguimiento a incidencias'}
            </p>
            {canCreate && !searchTerm && filterStatus === 'all' && filterPriority === 'all' && !titleFilter && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FaPlus className="w-4 h-4" />
                Crear Primer Ticket
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={() => handleViewDetail(ticket)}
                  >
                    {/* Card Header */}
                    <div className={`p-4 border-b-2 ${
                      ticket.priority === 'alta' ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200' :
                      ticket.priority === 'media' ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200' :
                      'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`p-2 rounded-lg ${getStatusColor(ticket.status)}`}>
                              {getStatusIcon(ticket.status)}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{ticket.title}</h3>
                          <p className="text-xs text-gray-500">Ticket #{ticket.id}</p>
                        </div>
                        {canEditTicket(ticket) && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleEdit(ticket)}
                              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all"
                              title="Editar"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            {canDeleteTicket(ticket) && (
                              <button
                                onClick={() => handleDelete(ticket)}
                                className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
                                title="Eliminar"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <p className="text-sm text-gray-700 mb-4 line-clamp-3">{ticket.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                            <FaUserCircle className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium">Creado por</p>
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {ticket.creator?.name || 'Usuario'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Asignado a</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {ticket.assignee?.name || 'Sin asignar'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Actualizado</p>
                            <p className="text-sm font-semibold text-gray-900">{getTimeAgo(ticket.updatedAt)}</p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <FaClock className="w-3 h-3" />
                              {new Date(ticket.createdAt).toLocaleDateString('es-ES')}
                            </span>
                            <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold">
                              <FaEye className="w-3 h-3" />
                              Ver detalles
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">ID</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">Título</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">Estado</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">Prioridad</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">Creado por</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">Asignado a</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">Fecha</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredTickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-purple-50 transition-colors">
                          <td className="px-4 py-4">
                            <span className="font-bold text-purple-600">#{ticket.id}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-gray-900">{ticket.title}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">{ticket.description}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                              {getStatusIcon(ticket.status)}
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {ticket.creator?.name || 'Usuario'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {ticket.assignee?.name || 'Sin asignar'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {getTimeAgo(ticket.updatedAt)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewDetail(ticket)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Ver detalles"
                              >
                                <FaEye className="w-4 h-4" />
                              </button>
                              {canEditTicket(ticket) && (
                                <button
                                  onClick={() => handleEdit(ticket)}
                                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                  title="Editar"
                                >
                                  <FaEdit className="w-4 h-4" />
                                </button>
                              )}
                              {canDeleteTicket(ticket) && (
                                <button
                                  onClick={() => handleDelete(ticket)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  title="Eliminar"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedTicket && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
                  <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-violet-600 p-6 z-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{selectedTicket.title}</h2>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white`}>
                            Ticket #{selectedTicket.id}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedTicket.status)}`}>
                            {selectedTicket.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(selectedTicket.priority)}`}>
                            Prioridad {selectedTicket.priority}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowDetailModal(false)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                      >
                        <FaTimes className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Main Content */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <FaClipboardList className="text-purple-600" />
                            Descripción del Problema
                          </h3>
                          <p className="text-gray-700 leading-relaxed">{selectedTicket.description}</p>
                        </div>

                        {/* Chat Section */}
                        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                          <div className="bg-gradient-to-r from-purple-100 to-violet-100 px-5 py-3 border-b-2 border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                              <FaComment className="text-purple-600" />
                              Conversación del Ticket ({messages.length})
                            </h3>
                          </div>

                          <div className="p-5">
                            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                              {messages.length === 0 ? (
                                <div className="text-center py-8">
                                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaComment className="w-8 h-8 text-gray-400" />
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    No hay mensajes aún. ¡Inicia la conversación!
                                  </p>
                                </div>
                              ) : (
                                messages.map((message) => (
                                  <div key={message.id} className={`flex ${message.sender?.id === user?.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-md px-4 py-3 rounded-2xl ${
                                      message.sender?.id === user?.id
                                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                                        : 'bg-gray-100 border-2 border-gray-200 text-gray-900'
                                    }`}>
                                      <div className="flex items-center justify-between mb-2">
                                        <span className={`text-xs font-bold ${
                                          message.sender?.id === user?.id ? 'text-purple-100' : 'text-gray-600'
                                        }`}>
                                          {message.sender?.name || 'Usuario'}
                                        </span>
                                        <span className={`text-xs ${
                                          message.sender?.id === user?.id ? 'text-purple-200' : 'text-gray-400'
                                        }`}>
                                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </div>
                                      <p className="text-sm leading-relaxed">{message.content}</p>
                                    </div>
                                  </div>
                                ))
                              )}
                              <div ref={messagesEndRef} />
                            </div>
     
                            {/* Send Message Form */}
                            {canSendMessage(selectedTicket) ? (
                              <form onSubmit={handleSendMessage} className="flex gap-3">
                                <input
                                  type="text"
                                  placeholder="Escribe un mensaje..."
                                  value={newMessage}
                                  onChange={(e) => setNewMessage(e.target.value)}
                                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                                />
                                <button
                                  type="submit"
                                  className="px-5 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                                  disabled={!newMessage.trim()}
                                >
                                  <FaPaperPlane className="w-4 h-4" />
                                </button>
                              </form>
                            ) : (
                              <div className="text-center py-4">
                                <p className="text-sm text-gray-500">
                                  No tienes permisos para enviar mensajes en este ticket
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
     
                      {/* Sidebar */}
                      <div className="space-y-6">
                        {/* Ticket Info Card */}
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border-2 border-purple-200">
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FaClipboardList className="text-purple-600" />
                            Información del Ticket
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div className="bg-white rounded-lg p-3 border border-purple-100">
                              <p className="text-xs text-gray-500 font-medium mb-1">Creado por</p>
                              <p className="font-bold text-gray-900 flex items-center gap-2">
                                <FaUserCircle className="text-purple-600" />
                                {selectedTicket.creator?.name || 'Usuario'}
                              </p>
                            </div>
     
                            <div className="bg-white rounded-lg p-3 border border-purple-100">
                              <p className="text-xs text-gray-500 font-medium mb-1">Asignado a</p>
                              <p className="font-bold text-gray-900 flex items-center gap-2">
                                <FaUserCircle className="text-blue-600" />
                                {selectedTicket.assignee?.name || 'Sin asignar'}
                              </p>
                            </div>
     
                            <div className="bg-white rounded-lg p-3 border border-purple-100">
                              <p className="text-xs text-gray-500 font-medium mb-1">Fecha de creación</p>
                              <p className="font-bold text-gray-900 flex items-center gap-2">
                                <FaClock className="text-green-600" />
                                {new Date(selectedTicket.createdAt).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
     
                            <div className="bg-white rounded-lg p-3 border border-purple-100">
                              <p className="text-xs text-gray-500 font-medium mb-1">Última actualización</p>
                              <p className="font-bold text-gray-900 flex items-center gap-2">
                                <FaClock className="text-orange-600" />
                                {getTimeAgo(selectedTicket.updatedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
     
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-4">Acciones Rápidas</h4>
                          <div className="space-y-2">
                            {canEditTicket(selectedTicket) && (
                              <button
                                onClick={() => {
                                  setShowDetailModal(false);
                                  handleEdit(selectedTicket);
                                }}
                                className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition-all flex items-center gap-2"
                              >
                                <FaEdit className="w-4 h-4" />
                                Editar Ticket
                              </button>
                            )}

                            {canDeleteTicket(selectedTicket) && (
                              <button
                                onClick={() => {
                                  setShowDetailModal(false);
                                  handleDelete(selectedTicket);
                                }}
                                className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl transition-all flex items-center gap-2"
                              >
                                <FaTrash className="w-4 h-4" />
                                Eliminar Ticket
                              </button>
                            )}

                            <button
                              onClick={() => setShowDetailModal(false)}
                              className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all flex items-center gap-2"
                            >
                              <FaTimes className="w-4 h-4" />
                              Cerrar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
     
            {/* Edit Modal */}
            {/* Create Modal */}
            {showCreateModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
                  <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-violet-600 p-6 z-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">Crear Nuevo Ticket</h2>
                      <button
                        onClick={() => setShowCreateModal(false)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                      >
                        <FaTimes className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Categoría del Problema *
                        </label>
                        <select
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                          required
                        >
                          <option value="">Selecciona una categoría</option>
                          {standardizedTitles.map((title, index) => (
                            <option key={index} value={title}>{title}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Descripción *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium resize-none"
                          rows="5"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Prioridad *
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                        >
                          <option value="baja">🟢 Baja</option>
                          <option value="media">🟡 Media</option>
                          <option value="alta">🔴 Alta</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Estado *
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                        >
                          <option value="abierto">Abierto</option>
                          <option value="en progreso">En Progreso</option>
                          <option value="resuelto">Resuelto</option>
                          <option value="cerrado">Cerrado</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Asignar a
                        </label>
                        <select
                          value={formData.assignedTo}
                          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                        >
                          <option value="">Sin asignar</option>
                          {technicians.length > 0 && (
                            <optgroup label="👨‍💻 Técnicos">
                              <option value="all-technicians">Todos los técnicos</option>
                              {technicians.map((tech) => (
                                <option key={tech.id} value={tech.id}>
                                  {tech.name || tech.username}
                                </option>
                              ))}
                            </optgroup>
                          )}
                          {administrators.length > 0 && (
                            <optgroup label="👨‍💼 Administradores">
                              <option value="all-administrators">Todos los administradores</option>
                              {administrators.map((admin) => (
                                <option key={admin.id} value={admin.id}>
                                  {admin.name || admin.username}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t-2 border-gray-100">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                        disabled={formLoading}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        disabled={formLoading}
                      >
                        {formLoading ? (
                          <>
                            <FaSpinner className="w-5 h-5 animate-spin" />
                            Creando...
                          </>
                        ) : (
                          <>
                            <FaPlus className="w-5 h-5" />
                            Crear Ticket
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingTicket && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
                  <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-violet-600 p-6 z-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">Editar Ticket #{editingTicket.id}</h2>
                      <button
                        onClick={() => setShowEditModal(false)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                      >
                        <FaTimes className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
     
                  <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {canEditTicket(editingTicket) && (
                        <>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Categoría del Problema *
                            </label>
                            <select
                              value={editFormData.title}
                              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                              required
                            >
                              <option value="">Selecciona una categoría</option>
                              {standardizedTitles.map((title, index) => (
                                <option key={index} value={title}>{title}</option>
                              ))}
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Descripción *
                            </label>
                            <textarea
                              value={editFormData.description}
                              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium resize-none"
                              rows="5"
                              required
                            />
                          </div>
                        </>
                      )}
     
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Prioridad *
                        </label>
                        <select
                          value={editFormData.priority}
                          onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                        >
                          <option value="baja">🟢 Baja</option>
                          <option value="media">🟡 Media</option>
                          <option value="alta">🔴 Alta</option>
                        </select>
                      </div>
     
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Estado *
                        </label>
                        <select
                          value={editFormData.status}
                          onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                        >
                          <option value="abierto">Abierto</option>
                          <option value="en progreso">En Progreso</option>
                          <option value="resuelto">Resuelto</option>
                          <option value="cerrado">Cerrado</option>
                        </select>
                      </div>
     
                      {(userRole === 'Administrador' || userRole === 'Técnico') && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Asignar a
                          </label>
                          <select
                            value={editFormData.assignedTo}
                            onChange={(e) => setEditFormData({ ...editFormData, assignedTo: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                          >
                            <option value="">Sin asignar</option>
                            {technicians.length > 0 && (
                              <optgroup label="👨‍💻 Técnicos">
                                {technicians.map((tech) => (
                                  <option key={tech.id} value={tech.id}>
                                    {tech.name || tech.username}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                            {administrators.length > 0 && (
                              <optgroup label="👨‍💼 Administradores">
                                {administrators.map((admin) => (
                                  <option key={admin.id} value={admin.id}>
                                    {admin.name || admin.username}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                          </select>
                        </div>
                      )}
                    </div>
     
                    <div className="flex gap-3 pt-6 border-t-2 border-gray-100">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                        disabled={formLoading}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        disabled={formLoading}
                      >
                        {formLoading ? (
                          <>
                            <FaSpinner className="w-5 h-5 animate-spin" />
                            Actualizando...
                          </>
                        ) : (
                          <>
                            <FaCheck className="w-5 h-5" />
                            Actualizar Ticket
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Tickets;