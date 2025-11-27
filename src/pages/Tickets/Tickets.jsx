import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { FaEdit, FaTrash, FaComment, FaPlus, FaCheck, FaTimes, FaEye, FaImage, FaVideo, FaFile, FaPaperPlane, FaEllipsisV, FaPen, FaTrashAlt, FaSearch, FaFilter, FaDownload, FaChartBar, FaClock, FaExclamationTriangle, FaCheckCircle, FaSpinner, FaUserCircle, FaClipboardList, FaFileExport, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import AuthContext from '../../context/AuthContext';
import ticketsAPI from '../../api/ticketsAPI';
import messagesAPI from '../../api/messagesAPI';
import usersAPI from '../../api/usersAPI';
import { joinTicketRoom, leaveTicketRoom, onNewMessage, onMessageUpdated, onMessageDeleted, onTicketUpdated, onTicketCreated, onTicketDeleted, onTicketsListUpdated, offNewMessage, offMessageUpdated, offMessageDeleted, offTicketUpdated, offTicketCreated, offTicketDeleted, offTicketsListUpdated } from '../../api/socket';
import {
  TicketCreateModal,
  TicketEditModal,
  TicketDetailModal,
  TicketCard,
  TicketStats
} from '../../components/Tickets';
import { getTimeAgo } from '../../utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('cards');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'media',
    status: 'abierto',
    assignedTo: '',
    attachment: null
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
    'Problemas con SAP',
    'Problemas con Impresoras',
    'Problemas con Contraseña',
    'Problemas con Heinsohn',
    'Problemas con Excel, Word, PDF',
    'Problemas con Acceso a carpetas',
    'Problemas con El navegador',
    'Problemas con R-SALES',
    'Problemas con Envio',
    'Problemas con Correo',
    'Problemas con Hardware',
    'Problemas con Red',
    'Problemas con Instalacion',
    'Problemas con Software',
  ];

  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { user } = useContext(AuthContext);

  const userRole = user?.role?.name;

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
        // WebSocket will handle the list update automatically
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

  // WebSocket listeners for real-time ticket list updates
  useEffect(() => {
    const handleTicketCreated = (newTicket) => {
      // Refresh to show the new ticket
      fetchTickets();
    };

    const handleTicketDeleted = (data) => {
      // Refresh to remove the deleted ticket
      fetchTickets();
    };

    const handleTicketsListUpdated = () => {
      // Refresh to get updated data
      fetchTickets();
    };

    // Register WebSocket listeners
    onTicketCreated(handleTicketCreated);
    onTicketDeleted(handleTicketDeleted);
    onTicketsListUpdated(handleTicketsListUpdated);

    // Cleanup function
    return () => {
      offTicketCreated(handleTicketCreated);
      offTicketDeleted(handleTicketDeleted);
      offTicketsListUpdated(handleTicketsListUpdated);
    };
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await ticketsAPI.fetchTickets({});
      setTickets(data.tickets || []);
    } catch (err) {
      showNotification('Error al cargar los tickets. Por favor, recarga la página.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      if (user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico' || user?.role?.name === 'Empleado' || user?.role?.name === 'Calidad') {
        const users = await usersAPI.fetchUsers();
        const techUsers = users.filter(user => user.Role?.name === 'Técnico');
        const adminUsers = users.filter(user => user.Role?.name === 'Administrador');
        setTechnicians(techUsers);
        setAdministrators(adminUsers);
      }
    } catch (err) {
    }
  };

  const filterAndSortTickets = () => {
    if (!Array.isArray(tickets)) return [];
    let filtered = [...tickets];

    // Role-based filtering
    if (!['Administrador', 'Técnico'].includes(userRole)) {
      // Otros roles solo ven sus propios tickets
      filtered = filtered.filter(ticket => ticket.userId === user?.id);
    }
    // Administrador y Técnico ven todos los tickets

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
    if (!Array.isArray(tickets)) return { total: 0, abiertos: 0, enProgreso: 0, resueltos: 0, alta: 0, resolutionRate: 0 };
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

  const getAdminChartData = () => {
    const adminCounts = {};
    administrators.forEach(admin => {
      adminCounts[admin.name] = 0;
    });
    tickets.forEach(ticket => {
      if (ticket.assignee && administrators.some(admin => admin.id === ticket.assignee.id)) {
        const name = ticket.assignee.name;
        adminCounts[name] = (adminCounts[name] || 0) + 1;
      }
    });
    const sorted = Object.entries(adminCounts).sort((a, b) => b[1] - a[1]);
    return {
      labels: sorted.map(([name]) => name),
      datasets: [{
        label: 'Tickets Asignados',
        data: sorted.map(([, count]) => count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }],
    };
  };

  const getCategoryChartData = () => {
    const categoryCounts = {};
    tickets.forEach(ticket => {
      const category = ticket.category || 'Sin Categoría';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    const sorted = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    return {
      labels: sorted.map(([cat]) => cat),
      datasets: [{
        label: 'Reportes',
        data: sorted.map(([, count]) => count),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }],
    };
  };

  const handleCreate = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      priority: 'media',
      status: 'abierto',
      assignedTo: '',
      attachment: null
    });
    setShowCreateModal(true);
  }, []);

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
        priority: ticket.priority
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
        showNotification('Ticket eliminado exitosamente', 'success');
        // WebSocket will handle the list update automatically
      } catch (err) {
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

     // Si hay un archivo adjunto, enviar como FormData
     if (formData.attachment) {
       const formDataToSend = new FormData();
       formDataToSend.append('title', formData.title);
       formDataToSend.append('description', formData.description);
       formDataToSend.append('priority', formData.priority);
       formDataToSend.append('status', formData.status);
       formDataToSend.append('assignedTo', assignedToValue || '');
       formDataToSend.append('attachment', formData.attachment);

       const ticket = await ticketsAPI.createTicketWithAttachment(formDataToSend);
       setShowCreateModal(false);
       showNotification('Ticket creado exitosamente', 'success');
       // WebSocket will handle the list update automatically
     } else {
       // Si no hay archivo, enviar como JSON normal
       const ticketData = {
         title: formData.title,
         description: formData.description,
         priority: formData.priority,
         status: formData.status,
         assignedTo: assignedToValue || null
       };

       const ticket = await ticketsAPI.createTicket(ticketData);
       setShowCreateModal(false);
       showNotification('Ticket creado exitosamente', 'success');
       // WebSocket will handle the list update automatically
     }
   } catch (err) {
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
      setShowEditModal(false);
      showNotification('Ticket actualizado exitosamente', 'success');
      // WebSocket will handle the list update automatically
    } catch (err) {
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
     // Actualizar selectedTicket con los datos completos incluyendo attachments
     setSelectedTicket(data);
     setComments(data.comments || []);

     // Cargar mensajes usando la API de mensajes
     const messagesData = await messagesAPI.fetchMessages(ticket.id);
     setMessages(messagesData);
   } catch (err) {
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
      if (err.response?.status === 403) {
        showNotification('No tienes permisos para enviar mensajes en este ticket', 'error');
      } else {
        showNotification('Error al enviar mensaje.', 'error');
      }
    }
  };

  const exportToExcel = () => {
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

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tickets');

    // Estilos para la tabla
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws[cellAddress]) continue;

        // Estilo para el header
        if (row === 0) {
          ws[cellAddress].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '6B46C1' } }, // Color púrpura
            alignment: { horizontal: 'center' }
          };
        } else {
          // Estilo para las filas de datos
          ws[cellAddress].s = {
            alignment: { horizontal: 'left' },
            border: {
              top: { style: 'thin', color: { rgb: 'CCCCCC' } },
              bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
              left: { style: 'thin', color: { rgb: 'CCCCCC' } },
              right: { style: 'thin', color: { rgb: 'CCCCCC' } }
            }
          };
        }
      }
    }

    // Ajustar ancho de columnas
    ws['!cols'] = [
      { wch: 8 },  // ID
      { wch: 25 }, // Título
      { wch: 40 }, // Descripción
      { wch: 12 }, // Prioridad
      { wch: 12 }, // Estado
      { wch: 15 }, // Creado por
      { wch: 15 }, // Asignado a
      { wch: 15 }  // Fecha Creación
    ];

    XLSX.writeFile(wb, `tickets_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('Tickets exportados exitosamente', 'success');
  };

  const canCreate = true;

  // Funciones helper para verificar permisos por ticket específico
  const canEditTicket = (ticket) => {
    if (userRole === 'Administrador' || userRole === 'Técnico') {
      return true;
    }
    if (userRole === 'Empleado' || userRole === 'Calidad') {
      return ticket.userId === user?.id;
    }
    return false;
  };

  const canDeleteTicket = (ticket) => {
    if (userRole === 'Administrador') {
      return true;
    }
    if (userRole === 'Técnico') {
      return (ticket.userId === user?.id || ticket.assignedTo === user?.id) && ticket.status?.toLowerCase() === 'cerrado';
    }
    if (userRole === 'Empleado' || userRole === 'Calidad') {
      return ticket.userId === user?.id;
    }
    return false;
  };

  const canSendMessage = (ticket) => {
    if (userRole === 'Administrador' || userRole === 'Técnico') {
      return true;
    }
    if (userRole === 'Empleado' || userRole === 'Calidad') {
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


  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Cargando tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50 py-4 px-3 sm:py-6 sm:px-4 lg:px-8">
      {/* Notification */}
      {notification && (
        <div className="fixed top-3 right-3 left-3 sm:top-4 sm:right-4 sm:left-auto z-50 max-w-sm animate-slide-in-right">
          <div className={`flex items-center p-3 sm:p-4 rounded-xl shadow-2xl border-2 transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-white border-green-400 text-green-800'
              : 'bg-white border-red-400 text-red-800'
          }`}>
            <div className="shrink-0">
              {notification.type === 'success' ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
              )}
            </div>
            <div className="ml-3 sm:ml-4 flex-1">
              <p className="text-xs sm:text-sm font-semibold">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="ml-3 sm:ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 transform animate-scale-in">
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <FaExclamationTriangle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 text-center mb-3">Confirmar Acción</h3>
              <p className="text-xs sm:text-sm text-gray-600 text-center mb-4 lg:mb-6 leading-relaxed">{confirmDialog.message}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 text-sm lg:text-base touch-manipulation"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog(null);
                  }}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base touch-manipulation"
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
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 lg:gap-4 mb-3">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-linear-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight truncate">
                    Sistema de Tickets
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Gestión integral de incidencias y soporte técnico
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:gap-3">
              {(userRole === 'Administrador' || userRole === 'Técnico') && (
                <>
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg text-sm lg:text-base"
                  >
                    <FaChartBar className="w-4 h-4" />
                    <span className="hidden sm:inline">Estadísticas</span>
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg text-sm lg:text-base"
                  >
                    <FaDownload className="w-4 h-4" />
                    <span className="hidden sm:inline">Exportar</span>
                  </button>
                </>
              )}
              {canCreate && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm lg:text-base"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Nuevo Ticket</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {showStats && <TicketStats stats={stats} />}

        {/* Charts */}
        {showStats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Administradores con Más Tickets Asignados</h3>
              <Bar data={getAdminChartData()} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }} />
            </div>
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categorías con Más Reportes</h3>
              <Bar data={getCategoryChartData()} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }} />
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4 lg:p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por título, descripción o creador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-700 font-medium text-sm lg:text-base"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-4 lg:px-6 py-3 rounded-xl font-semibold transition-all duration-200 min-w-[120px] ${
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t-2 border-gray-100 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-sm"
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
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-sm"
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
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-sm"
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
                      className="flex-1 px-3 lg:px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-sm"
                    >
                      <option value="createdAt">Fecha creación</option>
                      <option value="updatedAt">Última actualización</option>
                      <option value="priority">Prioridad</option>
                      <option value="status">Estado</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 lg:px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                    >
                      {sortOrder === 'asc' ? <FaSortAmountDown className="w-4 h-4 lg:w-5 lg:h-5" /> : <FaSortAmountUp className="w-4 h-4 lg:w-5 lg:h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <p className="text-sm text-gray-600 font-medium">
            Mostrando <span className="font-bold text-purple-600">{filteredTickets.length}</span> de <span className="font-bold">{tickets.length}</span> tickets
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-sm lg:text-base ${
                viewMode === 'cards'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FaClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Tarjetas</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-sm lg:text-base ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FaChartBar className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Lista</span>
            </button>
          </div>
        </div>

        {/* Tickets Display */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-gray-200 p-6 lg:p-12 text-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-linear-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClipboardList className="w-8 h-8 lg:w-10 lg:h-10 text-purple-600" />
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || titleFilter
                ? 'No se encontraron tickets'
                : 'No hay tickets disponibles'}
            </h3>
            <p className="text-sm lg:text-base text-gray-600 max-w-md mx-auto mb-4 lg:mb-6">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || titleFilter
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando un nuevo ticket para dar seguimiento a incidencias'}
            </p>
            {canCreate && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 lg:px-6 py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base"
              >
                <FaPlus className="w-4 h-4" />
                Nuevo Ticket
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                  {filteredTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onViewDetail={handleViewDetail}
                      onEdit={handleEdit}
                      canEditTicket={canEditTicket}
                      userRole={userRole}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4 lg:p-6 overflow-hidden">
                {/* Mobile Card View for List Mode */}
                <div className="block md:hidden">
                  <div className="divide-y divide-gray-200">
                    {filteredTickets.map((ticket) => (
                      <div key={ticket.id} className="p-4 hover:bg-purple-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-purple-600">#{ticket.id}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{ticket.title}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2">{ticket.description}</p>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={() => handleViewDetail(ticket)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-manipulation"
                              title="Ver detalles"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            {canEditTicket(ticket) && (
                              <button
                                onClick={() => handleEdit(ticket)}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-manipulation"
                                title="Editar"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                            )}
                            {canDeleteTicket(ticket) && (
                              <button
                                onClick={() => handleDelete(ticket)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all touch-manipulation"
                                title="Eliminar"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">Creado por:</span>
                            <p className="truncate">{ticket.creator?.name || 'Usuario'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Asignado a:</span>
                            <p className="truncate">{ticket.assignee?.name || 'Sin asignar'}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Actualizado:</span>
                            <p>{getTimeAgo(ticket.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <table className="w-full">
                    <thead className="bg-linear-to-r from-purple-600 to-violet-600 text-white">
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
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-manipulation"
                                title="Ver detalles"
                              >
                                <FaEye className="w-4 h-4" />
                              </button>
                              {canEditTicket(ticket) && (
                                <button
                                  onClick={() => handleEdit(ticket)}
                                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-manipulation"
                                  title="Editar"
                                >
                                  <FaEdit className="w-4 h-4" />
                                </button>
                              )}
                              {canDeleteTicket(ticket) && (
                                <button
                                  onClick={() => handleDelete(ticket)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all touch-manipulation"
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

            {/* Pagination Controls Removed */}

          </>
        )}

        {/* Modals - Always rendered */}
        <TicketDetailModal
          showDetailModal={showDetailModal}
          setShowDetailModal={setShowDetailModal}
          selectedTicket={selectedTicket}
          comments={comments}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          handleViewDetail={handleViewDetail}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          canEditTicket={canEditTicket}
          canDeleteTicket={canDeleteTicket}
          canSendMessage={canSendMessage}
          user={user}
        />

        <TicketCreateModal
          showCreateModal={showCreateModal}
          setShowCreateModal={setShowCreateModal}
          formData={formData}
          setFormData={setFormData}
          handleCreateSubmit={handleCreateSubmit}
          formLoading={formLoading}
          userRole={userRole}
          technicians={technicians}
          administrators={administrators}
          standardizedTitles={standardizedTitles}
        />

        <TicketEditModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          editingTicket={editingTicket}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          handleEditSubmit={handleEditSubmit}
          formLoading={formLoading}
          userRole={userRole}
          technicians={technicians}
          administrators={administrators}
          standardizedTitles={standardizedTitles}
        />
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
