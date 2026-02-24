import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import AuthContext from '../../context/AuthContext';
import { qualityTicketsAPI, qualityMessagesAPI, usersAPI } from '../../api';
import { joinTicketRoom, leaveTicketRoom, onNewMessage, onMessageUpdated, onMessageDeleted, onTicketUpdated, onTicketCreated, onTicketDeleted, onTicketsListUpdated, offNewMessage, offMessageUpdated, offMessageDeleted, offTicketUpdated, offTicketCreated, offTicketDeleted, offTicketsListUpdated } from '../../api/socket';
import {
  TicketCreateModal,
  TicketEditModal,
  TicketDetailModal,
  TicketCard,
  TicketStats
} from '../../components/Tickets';
import { TicketCalidadHeader, TicketCalidadFilters, TicketCalidadList } from '../../components/Tickets/TicketCalidad';
// import { getTimeAgo } from '../../utils'; // Comentado por no ser utilizado
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { useTicketEdit } from '../../hooks/useTicketEdit';

const TicketCalidad = () => {
  const { conditionalClasses } = useThemeClasses();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
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
  // Usar el hook personalizado para manejar la edición de tickets
  const { editingTicket, editFormData, setEditFormData, handleEdit: handleEditTicket, clearEditData } = useTicketEdit();
  const [titleFilter, setTitleFilter] = useState('');
  const [technicians, setTechnicians] = useState([]);
  // const [administrators, setAdministrators] = useState([]); // No utilizada pero mantenida para consistencia
  const [calidadUsers, setCalidadUsers] = useState([]);

  const standardizedTitles = useMemo(() => [
    'Control de documentación',
    'Errores en documentos del SGC',
    'Cambios y actualización de documentos',
    'Control de versiones documentales',
    'No conformidades',
    'Acciones correctivas',
    'Acciones preventivas',
    'Oportunidades de mejora',
    'Cambios en políticas de calidad',
    'Actualización de procedimientos',
    'Errores en formatos y registros',
    'Cumplimiento de requisitos ISO 9001',
    'Auditorías internas',
    'Certificación y recertificación ISO'
  ], []);

  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [changeRequestTicket, setChangeRequestTicket] = useState(null);
  const { user } = useContext(AuthContext);

  const userRole = user?.role?.name;

  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const showConfirmDialog = useCallback((message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  }, []);

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

  const fetchTickets = useCallback(async () => {
    try {
      const data = await qualityTicketsAPI.fetchQualityTickets({});
      setTickets(data.tickets || []);
    } catch {
      showNotification('Error al cargar los tickets de calidad. Por favor, recarga la página.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const fetchUsers = useCallback(async () => {
    try {
      // Cargar usuarios siempre para que todos los roles puedan ver el listado
      const users = await usersAPI.fetchUsers();
      const techUsers = users.filter(u => u.Role?.name === 'Técnico');
      const calidadUsersFiltered = users.filter(u => u.Role?.name === 'Calidad');
      const comprasUsers = users.filter(u => u.Role?.name === 'Compras');
      const empleadoUsers = users.filter(u => u.Role?.name === 'Empleado');
      const jefeUsers = users.filter(u => u.Role?.name === 'Jefe');
      const coordinadoraUsers = users.filter(u => u.Role?.name === 'Coordinadora Administrativa');
      
      setTechnicians(techUsers);
      setCalidadUsers(calidadUsersFiltered);
      
      // Para asegurar que todos los roles tengan opciones de asignación
      // Combinamos todos los usuarios que pueden ser asignados
      const allAssignableUsers = [
        ...techUsers,
        ...calidadUsersFiltered,
        ...comprasUsers,
        ...empleadoUsers,
        ...jefeUsers,
        ...coordinadoraUsers
      ];
      
      // Si no hay usuarios de calidad específicos, usar todos los usuarios asignables
      if (calidadUsersFiltered.length === 0) {
        setCalidadUsers(allAssignableUsers);
      }
    } catch {
      // Error silencioso - usuarios sin permiso para ver otros usuarios
    }
  }, []);

  // Funciones helper para verificar permisos por ticket específico
  const canEditTicket = useCallback((ticket) => {
    if (userRole === 'Administrador' || userRole === 'Técnico' || userRole === 'Calidad') {
      return true;
    }
    if (userRole === 'Empleado' || userRole === 'Jefe' || userRole === 'Compras' || userRole === 'Coordinadora Administrativa') {
      return ticket.userId === user?.id;
    }
    return false;
  }, [userRole, user?.id]);

  const canDeleteTicket = useCallback((ticket) => {
    if (userRole === 'Administrador' || userRole === 'Calidad') {
      return true;
    }
    if (userRole === 'Técnico') {
      return (ticket.userId === user?.id || ticket.assignedTo === user?.id) && ticket.status?.toLowerCase() === 'cerrado';
    }
    if (userRole === 'Empleado' || userRole === 'Jefe' || userRole === 'Compras' || userRole === 'Coordinadora Administrativa') {
      return ticket.userId === user?.id;
    }
    return false;
  }, [userRole, user?.id]);

  const canSendMessage = useCallback((ticket) => {
    if (userRole === 'Administrador' || userRole === 'Técnico' || userRole === 'Calidad') {
      return true;
    }
    if (userRole === 'Empleado' || userRole === 'Jefe' || userRole === 'Compras' || userRole === 'Coordinadora Administrativa') {
      return ticket.userId === user?.id;
    }
    return false;
  }, [userRole, user?.id]);


  useEffect(() => {
    fetchUsers();
    fetchTickets();
  }, [fetchUsers, fetchTickets]);

  // WebSocket listeners for real-time ticket list updates
  useEffect(() => {
    const handleTicketCreated = () => {
      // Refresh to show the new ticket
      fetchTickets();
    };

    const handleTicketDeleted = () => {
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
  }, [fetchTickets]);

  const filteredTickets = useMemo(() => {
    if (!Array.isArray(tickets)) return [];
    let filtered = [...tickets];

    // Role-based filtering
    if (!['Administrador', 'Técnico', 'Calidad', 'Coordinadora Administrativa', 'Jefe', 'Compras'].includes(userRole)) {
      // Otros roles solo ven sus propios tickets
      filtered = filtered.filter(ticket => ticket.userId === user?.id);
    }
    // Administrador, Técnico, Calidad, Jefe, Compras y Coordinador/a Administrativa ven todos los tickets

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
  }, [tickets, userRole, user?.id, searchTerm, filterStatus, filterPriority, titleFilter, sortBy, sortOrder]);

  const stats = useMemo(() => {
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
  }, [tickets]);

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

  const handleEdit = useCallback((ticket) => {
    if (!canEditTicket(ticket)) {
      showNotification('No tienes permisos para editar este ticket de calidad', 'error');
      return;
    }

    // Usar el hook personalizado para manejar la edición
    handleEditTicket(ticket, userRole);
    setShowEditModal(true);
  }, [userRole, canEditTicket, showNotification, handleEditTicket]);

  const handleDelete = useCallback(async (ticket) => {
    if (!canDeleteTicket(ticket)) {
      showNotification('No tienes permisos para eliminar este ticket de calidad', 'error');
      return;
    }

    showConfirmDialog('¿Estás seguro de que deseas eliminar este ticket de calidad? Esta acción no se puede deshacer.', async () => {
      try {
        await qualityTicketsAPI.deleteQualityTicket(ticket.id);
        showNotification('Ticket de calidad eliminado exitosamente', 'success');
        fetchTickets(); // Refresh the list immediately
      } catch (err) {
        if (err.response?.status === 403) {
          showNotification('No tienes permisos para eliminar este ticket de calidad', 'error');
        } else {
          showNotification('Error al eliminar el ticket de calidad.', 'error');
        }
      }
    });
  }, [canDeleteTicket, fetchTickets, showConfirmDialog, showNotification]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let assignedToValue = formData.assignedTo;
      if (formData.assignedTo === 'all-technicians') {
        assignedToValue = technicians.length > 0 ? technicians[0].id : null;
      } else if (formData.assignedTo === 'all-calidad') {
        assignedToValue = calidadUsers.length > 0 ? calidadUsers[0].id : null;
      }

      // Si hay un archivo adjunto, enviar como FormData
      if (formData.attachment) {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('priority', formData.priority);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('type', 'calidad');
        formDataToSend.append('assignedTo', assignedToValue || '');
        formDataToSend.append('createdAt', new Date().toISOString()); // Asignar fecha y hora automáticamente
        formDataToSend.append('attachment', formData.attachment);

        await qualityTicketsAPI.createQualityTicketWithAttachment(formDataToSend);
        setShowCreateModal(false);
        showNotification('Ticket de calidad creado exitosamente', 'success');
        fetchTickets(); // Refresh the list immediately
      } else {
        // Si no hay archivo, enviar como JSON normal
        const ticketData = {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          status: formData.status,
          type: 'calidad',
          assignedTo: assignedToValue || null,
          createdAt: new Date().toISOString() // Asignar fecha y hora automáticamente
        };

        await qualityTicketsAPI.createQualityTicket(ticketData);
        setShowCreateModal(false);
        showNotification('Ticket de calidad creado exitosamente', 'success');
        fetchTickets(); // Refresh the list immediately
      }
    } catch (err) {
      if (err.response?.status === 403) {
        showNotification('No tienes permisos para crear tickets de calidad', 'error');
      } else {
        showNotification('Error al crear el ticket de calidad.', 'error');
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
      await qualityTicketsAPI.updateQualityTicket(editingTicket.id, updateData);
      setShowEditModal(false);
      showNotification('Ticket de calidad actualizado exitosamente', 'success');
      fetchTickets(); // Refresh the list immediately
    } catch (err) {
      if (err.response?.status === 403) {
        showNotification('No tienes permisos para editar este ticket de calidad', 'error');
      } else {
        showNotification('Error al actualizar el ticket de calidad.', 'error');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewDetail = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const data = await qualityTicketsAPI.fetchQualityTicketById(ticket.id);
      // Actualizar selectedTicket con los datos completos incluyendo attachments
      setSelectedTicket(data);
      setComments(data.comments || []);

      // Cargar mensajes usando la API de mensajes de calidad
      const messagesData = await qualityMessagesAPI.fetchMessages(ticket.id);
      setMessages(messagesData);
    } catch (err) {
      if (err.response?.status === 403) {
        showNotification('No tienes permisos para ver los detalles de este ticket de calidad', 'error');
        return;
      }
      if (err.response?.status === 401) {
        showNotification('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'error');
        return;
      }
      showNotification('Error al cargar los detalles del ticket de calidad.', 'error');
    }
    setShowDetailModal(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!canSendMessage(selectedTicket)) {
      showNotification('No tienes permisos para enviar mensajes en este ticket de calidad', 'error');
      return;
    }

    try {
      await qualityMessagesAPI.createMessage(selectedTicket.id, { content: newMessage });
      setNewMessage('');
      showNotification('Mensaje enviado exitosamente', 'success');
      // Refresh messages
      const messagesData = await qualityMessagesAPI.fetchMessages(selectedTicket.id);
      setMessages(messagesData);
    } catch (err) {
      if (err.response?.status === 403) {
        showNotification('No tienes permisos para enviar mensajes en este ticket de calidad', 'error');
      } else {
        showNotification('Error al enviar mensaje.', 'error');
      }
    }
  };

  const exportToExcel = useCallback(() => {
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
    XLSX.utils.book_append_sheet(wb, ws, 'Tickets_Calidad');

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

    XLSX.writeFile(wb, `tickets_calidad_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('Tickets de calidad exportados exitosamente', 'success');
  }, [filteredTickets, showNotification]);

  // Función para crear Solicitud de Cambio desde un Ticket de Calidad
  const handleCreateChangeRequest = useCallback(async (ticket) => {
    setChangeRequestTicket(ticket);
    setShowDetailModal(false);
    setShowChangeRequestModal(true);
  }, []);

  const handleChangeRequestSubmit = async (e) => {
    e.preventDefault();
    if (!changeRequestTicket) return;
    
    setFormLoading(true);
    try {
      const formData = new FormData(e.target);
      const justification = formData.get('reason') || '';
      
      // Validar que la justificación tenga al menos 10 caracteres
      if (justification.trim().length < 10) {
        showNotification('La justificación debe tener al menos 10 caracteres', 'error');
        setFormLoading(false);
        return;
      }
      
      const changeRequestData = {
        title: `SC-T${changeRequestTicket.id}: ${formData.get('title')}`,
        description: formData.get('description'),
        requestType: formData.get('documentType') === 'Política' || formData.get('documentType') === 'Manual' ? 'create' : 'edit',
        justification: justification,
        impactAnalysis: formData.get('proposedChanges'),
        affectedProcesses: formData.get('documentType'),
        priority: changeRequestTicket.priority || 'media'
      };

      await qualityTicketsAPI.createChangeRequestFromQualityTicket(changeRequestTicket.id, changeRequestData);
      setShowChangeRequestModal(false);
      setChangeRequestTicket(null);
      showNotification('Solicitud de Cambio creada exitosamente desde el Ticket de Calidad', 'success');
      fetchTickets();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Error al crear la Solicitud de Cambio';
      showNotification(errorMessage, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const canCreate = userRole === 'Administrador' || userRole === 'Técnico' || userRole === 'Calidad' || userRole === 'Empleado' || userRole === 'Jefe' || userRole === 'Compras' || userRole === 'Coordinadora Administrativa';


  if (loading) {
    return (
      <div className={conditionalClasses({
        light: 'min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] flex items-center justify-center',
        dark: 'min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center'
      })}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#662d91] mx-auto mb-4"></div>
          <p className={conditionalClasses({
            light: 'text-lg text-gray-600 font-medium',
            dark: 'text-lg text-gray-300 font-medium'
          })}>Cargando tickets de calidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={conditionalClasses({
      light: 'min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] py-4 px-3 sm:py-6 sm:px-4 lg:px-8',
      dark: 'min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-4 px-3 sm:py-6 sm:px-4 lg:px-8'
    })}>
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
          <div className={conditionalClasses({
            light: "bg-white rounded-xl lg:rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 transform animate-scale-in",
            dark: "bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl max-w-md w-full border border-gray-600 transform animate-scale-in"
          })}>
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className={`text-lg lg:text-xl font-bold text-center mb-3 ${conditionalClasses({
                light: "text-gray-900",
                dark: "text-white"
              })}`}>Confirmar Acción</h3>
              <p className={`text-xs sm:text-sm text-center mb-4 lg:mb-6 leading-relaxed ${conditionalClasses({
                light: "text-gray-600",
                dark: "text-gray-300"
              })}`}>{confirmDialog.message}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className={conditionalClasses({
                    light: "flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 text-sm lg:text-base touch-manipulation",
                    dark: "flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition-all duration-200 text-sm lg:text-base touch-manipulation"
                  })}
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
        {/* Header Component */}
        <TicketCalidadHeader
          userRole={userRole}
          showStats={showStats}
          setShowStats={setShowStats}
          exportToExcel={exportToExcel}
          canCreate={canCreate}
          handleCreate={handleCreate}
        />

        {/* Stats Cards */}
        {showStats && <TicketStats stats={stats} />}

        {/* Filters Component */}
        <TicketCalidadFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          titleFilter={titleFilter}
          setTitleFilter={setTitleFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          standardizedTitles={standardizedTitles}
        />

        {/* List Component */}
        <TicketCalidadList
          filteredTickets={filteredTickets}
          tickets={tickets}
          viewMode={viewMode}
          setViewMode={setViewMode}
          handleViewDetail={handleViewDetail}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          canEditTicket={canEditTicket}
          canDeleteTicket={canDeleteTicket}
          userRole={userRole}
          handleCreate={handleCreate}
          canCreate={canCreate}
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          filterPriority={filterPriority}
          titleFilter={titleFilter}
        />

        {/* Detail Modal */}
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
          isCalidad={true}
          handleCreateChangeRequest={handleCreateChangeRequest}
        />

        {/* Create Modal */}
        <TicketCreateModal
          showCreateModal={showCreateModal}
          setShowCreateModal={setShowCreateModal}
          formData={formData}
          setFormData={setFormData}
          handleCreateSubmit={handleCreateSubmit}
          formLoading={formLoading}
          userRole={userRole}
          technicians={technicians}
          administrators={calidadUsers}
          standardizedTitles={standardizedTitles}
          isCalidad={true}
        />

        {/* Edit Modal */}
        <TicketEditModal
          showEditModal={showEditModal}
          setShowEditModal={(show) => {
            setShowEditModal(show);
            if (!show) {
              clearEditData();
            }
          }}
          editingTicket={editingTicket}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          handleEditSubmit={handleEditSubmit}
          formLoading={formLoading}
          userRole={userRole}
          technicians={technicians}
          administrators={calidadUsers}
          standardizedTitles={standardizedTitles}
          isCalidad={true}
        />

        {/* Create Change Request Modal */}
        {showChangeRequestModal && changeRequestTicket && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
            <div className={conditionalClasses({
              light: 'bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in',
              dark: 'bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-600 animate-scale-in'
            })}>
              <div className="sticky top-0 bg-linear-to-r from-green-600 to-green-700 p-4 lg:p-6 z-10">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">Crear Solicitud de Cambio</h2>
                    <p className="text-green-100 text-sm">Desde Ticket de Calidad #{changeRequestTicket.id}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowChangeRequestModal(false);
                      setChangeRequestTicket(null);
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all text-white shrink-0"
                  >
                    <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleChangeRequestSubmit} className="p-4 lg:p-6">
                <div className="space-y-4">
                  {/* Información del Ticket de Calidad */}
                  <div className={conditionalClasses({
                    light: 'bg-blue-50 rounded-xl p-4 border-2 border-blue-200',
                    dark: 'bg-blue-900/30 rounded-xl p-4 border-2 border-blue-700'
                  })}>
                    <h4 className={conditionalClasses({
                      light: 'font-bold text-blue-900 mb-2',
                      dark: 'font-bold text-blue-200 mb-2'
                    })}>📋 Información del Ticket de Calidad</h4>
                    <p className={conditionalClasses({
                      light: 'text-sm text-blue-800',
                      dark: 'text-sm text-blue-300'
                    })}><strong>Título:</strong> {changeRequestTicket.title}</p>
                    <p className={conditionalClasses({
                      light: 'text-sm text-blue-800 mt-1',
                      dark: 'text-sm text-blue-300 mt-1'
                    })}><strong>Descripción:</strong> {changeRequestTicket.description?.substring(0, 150)}...</p>
                  </div>

                  {/* Título de la Solicitud de Cambio */}
                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-200 mb-2'
                    })}>
                      Título de la Solicitud de Cambio *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all'
                      })}
                      placeholder="Ej: Actualización del procedimiento de control documental"
                    />
                  </div>

                  {/* Tipo de Documento */}
                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-200 mb-2'
                    })}>
                      Tipo de Documento *
                    </label>
                    <select
                      name="documentType"
                      required
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all'
                      })}
                    >
                      <option value="">Seleccionar tipo...</option>
                      <option value="Política">Política</option>
                      <option value="Procedimiento">Procedimiento</option>
                      <option value="Instrucción de Trabajo">Instrucción de Trabajo</option>
                      <option value="Formato">Formato</option>
                      <option value="Registro">Registro</option>
                      <option value="Manual">Manual</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-200 mb-2'
                    })}>
                      Descripción del Cambio *
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none'
                      })}
                      placeholder="Describe brevemente el cambio solicitado..."
                    />
                  </div>

                  {/* Justificación */}
                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-200 mb-2'
                    })}>
                      Justificación / Razón del Cambio *
                    </label>
                    <textarea
                      name="reason"
                      required
                      rows={3}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none'
                      })}
                      placeholder="¿Por qué es necesario realizar este cambio?"
                    />
                  </div>

                  {/* Cambios Propuestos */}
                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-200 mb-2'
                    })}>
                      Cambios Propuestos *
                    </label>
                    <textarea
                      name="proposedChanges"
                      required
                      rows={4}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none'
                      })}
                      placeholder="Detalla los cambios específicos que se proponen..."
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangeRequestModal(false);
                      setChangeRequestTicket(null);
                    }}
                    className={conditionalClasses({
                      light: 'flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all',
                      dark: 'flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition-all'
                    })}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-3 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {formLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creando...
                      </>
                    ) : (
                      '✅ Crear Solicitud de Cambio'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketCalidad;
