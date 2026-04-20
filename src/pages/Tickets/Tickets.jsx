import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
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
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { useNotifications } from '../../hooks/useNotifications';
import { useTicketEdit } from '../../hooks/useTicketEdit';
import AuthContext from '../../context/AuthContext';
import ticketsAPI from '../../api/ticketsAPI';
import messagesAPI from '../../api/messagesAPI';
import usersAPI from '../../api/usersAPI';
import {
  joinTicketRoom,
  leaveTicketRoom,
  onNewMessage,
  onMessageUpdated,
  onMessageDeleted,
  onTicketUpdated,
  onTicketCreated,
  onTicketDeleted,
  onTicketsListUpdated,
  offNewMessage,
  offMessageUpdated,
  offMessageDeleted,
  offTicketUpdated,
  offTicketCreated,
  offTicketDeleted,
  offTicketsListUpdated
} from '../../api/socket';
import {
  TicketCreateModal,
  TicketEditModal,
  TicketDetailModal,
  TicketCard,
  TicketStats,
  TicketFilters,
  TicketHeader,
  TicketList
} from '../../components/Tickets';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Tickets = () => {
  const { conditionalClasses } = useThemeClasses();
  const { notifySuccess, notifyError, notifyWarning: _notifyWarning, notifyInfo: _notifyInfo } = useNotifications();
  const { user, checkPermission } = useContext(AuthContext);
  
  // Estados principales
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // Estados de tickets seleccionados
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Estados de mensajes y comentarios
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
   // Estados de filtros y búsqueda
   const [searchTerm, setSearchTerm] = useState('');
   const debouncedSearchTerm = useDebounce(searchTerm, 300);
   const [filterStatus, setFilterStatus] = useState('all');
   const [filterPriority, setFilterPriority] = useState('all');
   const [showFilters, setShowFilters] = useState(false);
   const [sortBy, setSortBy] = useState('updatedAt');
   const [sortOrder, setSortOrder] = useState('desc');
   const [viewMode, setViewMode] = useState('cards');
   const [titleFilter, setTitleFilter] = useState('');

   // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState('10'); // string | 'all'

    // Estadísticas globales (totales, no paginadas)
    const [ticketStats, setTicketStats] = useState({
      total: 0,
      abiertos: 0,
      enProgreso: 0,
      resueltos: 0,
      alta: 0,
      resolutionRate: 0
    });
   
   // Estados de formularios
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
  
  // Estados de usuarios
  const [technicians, setTechnicians] = useState([]);
  const [administrators, setAdministrators] = useState([]);
  
  // Estados de UI
  const [formLoading, setFormLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  const userRole = user?.role?.name;
  const standardizedTitles = useMemo(() => [
    // 🔐 Accesos y servicios
    'Accesos y credenciales',
    'Correo electrónico',
    'Carpetas compartidas y permisos',

    // 🧠 Aplicaciones generales
    'Ofimática (Excel, Word, PDF)',
    'Navegadores web',
    'Instalación y actualización de software',
    'Soporte a sistemas internos',

    // 🖥️ Infraestructura
    'Hardware y equipos de cómputo',
    'Impresoras y escáneres',
    'Red y conectividad',

    // 🚨 Sistemas críticos (alto volumen)
    'Problemas con R-SALES',
    'Problemas con SAP',
    'Problemas con Heinsohn',

    // 📦 Otros
    'Otros requerimientos de TI'
  ], []);

  const fetchTickets = useCallback(async () => {
    try {
      // Si itemsPerPage es 'all', no enviar page ni limit para obtener todos
      const params = {
        page: itemsPerPage === 'all' ? undefined : currentPage,
        limit: itemsPerPage === 'all' ? undefined : itemsPerPage,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        priority: filterPriority !== 'all' ? filterPriority : undefined,
        category: titleFilter || undefined,
        q: debouncedSearchTerm || undefined,
        sortBy,
        sortOrder
      };

      const data = await ticketsAPI.fetchTickets(params);
      setTickets(data.tickets || []);

      // Actualizar paginación
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalItems(data.pagination.totalItems || 0);
        setItemsPerPage(String(data.pagination.itemsPerPage));
      } else {
        // Si no hay paginación (ej. todos los tickets), calcular localmente
        const total = data.total || data.tickets.length;
        setTotalItems(total);
        setTotalPages(1);
        // itemsPerPage se mantiene como 'all' si fue seleccionado
      }

      // Calcular estadísticas globales desde datos del backend
      if (data.stats) {
        const total = data.total || data.tickets.length;
        const abiertos = data.stats.statusCounts?.abierto || 0;
        const enProgreso = data.stats.statusCounts?.['en progreso'] || 0;
        const resueltos = (data.stats.statusCounts?.resuelto || 0) + (data.stats.statusCounts?.cerrado || 0);
        const alta = data.stats.priorityCounts?.alta || 0;
        const resolutionRate = total > 0 ? ((resueltos / total) * 100).toFixed(1) : 0;

        setTicketStats({
          total,
          abiertos,
          enProgreso,
          resueltos,
          alta,
          resolutionRate
        });
      } else {
        // Fallback: calcular desde tickets recibidos (solo para casos sin stats del backend)
        const receivedTickets = data.tickets || [];
        const total = receivedTickets.length;
        const abiertos = receivedTickets.filter(t => t.status?.toLowerCase() === 'abierto').length;
        const enProgreso = receivedTickets.filter(t => t.status?.toLowerCase() === 'en progreso').length;
        const resueltos = receivedTickets.filter(t => t.status?.toLowerCase() === 'resuelto' || t.status?.toLowerCase() === 'cerrado').length;
        const alta = receivedTickets.filter(t => t.priority?.toLowerCase() === 'alta').length;
        const resolutionRate = total > 0 ? ((resueltos / total) * 100).toFixed(1) : 0;
        setTicketStats({ total, abiertos, enProgreso, resueltos, alta, resolutionRate });
      }
    } catch {
      notifyError('Error al cargar los tickets. Por favor, recarga la página.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filterStatus, filterPriority, titleFilter, debouncedSearchTerm, sortBy, sortOrder, notifyError]);

  const fetchUsers = useCallback(async () => {
    try {
      // Cargar usuarios siempre para que todos los roles puedan ver el listado
      // Los empleados pueden ver técnicos para asignar tickets
      const users = await usersAPI.fetchUsers();
      const techUsers = users.filter(u => u.Role?.name === 'Técnico');
      const adminUsers = users.filter(u => u.Role?.name === 'Administrador');
      const calidadUsers = users.filter(u => u.Role?.name === 'Calidad');
      const comprasUsers = users.filter(u => u.Role?.name === 'Compras');
      const empleadoUsers = users.filter(u => u.Role?.name === 'Empleado');
      const jefeUsers = users.filter(u => u.Role?.name === 'Jefe');
      const coordinadoraUsers = users.filter(u => u.Role?.name === 'Coordinadora Administrativa');
      
      setTechnicians(techUsers);
      setAdministrators(adminUsers);
      
      // Para asegurar que todos los roles tengan opciones de asignación
      // Combinamos todos los usuarios que pueden ser asignados
      const allAssignableUsers = [
        ...techUsers,
        ...adminUsers,
        ...calidadUsers,
        ...comprasUsers,
        ...empleadoUsers,
        ...jefeUsers,
        ...coordinadoraUsers
      ];
      
      // Si no hay administradores específicos, usar todos los usuarios asignables
      if (adminUsers.length === 0) {
        setAdministrators(allAssignableUsers);
      }
    } catch (err) {
      // Los empleados pueden no tener permiso para ver usuarios
      // Esto es esperado, no mostrar error
      if (userRole !== 'Empleado') {
        console.error('Error al cargar usuarios:', err);
      }
      // Si falla, usar arrays vacíos - los empleados no asignan tickets
    }
  }, [userRole]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  // WebSocket listeners for real-time ticket list updates
  useEffect(() => {
    const handleTicketCreated = () => {
      fetchTickets();
    };

    const handleTicketDeleted = () => {
      fetchTickets();
    };

    const handleTicketsListUpdated = () => {
      fetchTickets();
    };

    onTicketCreated(handleTicketCreated);
    onTicketDeleted(handleTicketDeleted);
    onTicketsListUpdated(handleTicketsListUpdated);

    return () => {
      offTicketCreated(handleTicketCreated);
      offTicketDeleted(handleTicketDeleted);
      offTicketsListUpdated(handleTicketsListUpdated);
    };
  }, [fetchTickets]);

   // Restablecer ordenamiento a "más recientes" cuando cambian los filtros
   useEffect(() => {
     setSortBy('updatedAt');
     setSortOrder('desc');
   }, [filterStatus, filterPriority, titleFilter, debouncedSearchTerm]);

   // Inicialización de datos
   useEffect(() => {
     fetchTickets();
     fetchUsers();
   }, [fetchTickets, fetchUsers]);

   // Filtrado y ordenamiento se realizan en el backend mediante parámetros
   // Los estados se envían a la API y se devuelven tickets ya filtrados

   // Funciones de permisos - Solo Administrador, Técnico y Coordinador/a Administrativa tienen acceso completo
   const privilegedRolesForCRUD = useMemo(() => ['Administrador', 'Técnico', 'Coordinadora Administrativa'], []);
  const canCreate = checkPermission('tickets', 'create') ||
                   privilegedRolesForCRUD.includes(userRole);

  const canEditTicket = useCallback((ticket) => {
    if (privilegedRolesForCRUD.includes(userRole)) return true;
    if (checkPermission('tickets', 'edit')) return true;
    if (ticket.userId === user?.id && checkPermission('tickets', 'edit_own')) return true;
    return false;
  }, [userRole, user?.id, checkPermission, privilegedRolesForCRUD]);

  const canDeleteTicket = useCallback((ticket) => {
    if (privilegedRolesForCRUD.includes(userRole)) return true;
    if (checkPermission('tickets', 'delete')) return true;
    if (ticket.userId === user?.id && checkPermission('tickets', 'delete_own')) return true;
    return false;
  }, [userRole, user?.id, checkPermission, privilegedRolesForCRUD]);

  const canSendMessage = useCallback((ticket) => {
    // Todos los roles pueden enviar mensajes en tickets
    const messagingRoles = ['Administrador', 'Técnico', 'Calidad', 'Coordinadora Administrativa', 'Empleado', 'Jefe', 'Compras'];
    if (messagingRoles.includes(userRole)) return true;
    if (checkPermission('tickets', 'comment')) return true;
    if (ticket.userId === user?.id && checkPermission('tickets', 'comment_own')) return true;
    return false;
  }, [userRole, user?.id, checkPermission]);

   // Datos para gráficos
  const adminChartData = useMemo(() => {
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
  }, [tickets, administrators]);

  const categoryChartData = useMemo(() => {
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
  }, [tickets]);

   // Handlers principales
   const handleItemsPerPageChange = useCallback((e) => {
     const value = e.target.value;
     setItemsPerPage(value);
     setCurrentPage(1);
   }, []);

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
      notifyError('No tienes permisos para editar este ticket');
      return;
    }

    // Usar el hook personalizado para manejar la edición
    handleEditTicket(ticket, userRole);
    setShowEditModal(true);
  }, [userRole, canEditTicket, notifyError, handleEditTicket]);

  const handleDelete = useCallback(async (ticket) => {
    if (!canDeleteTicket(ticket)) {
      notifyError('No tienes permisos para eliminar este ticket');
      return;
    }

    showConfirmDialog('¿Estás seguro de que deseas eliminar este ticket? Esta acción no se puede deshacer.', async () => {
      try {
        await ticketsAPI.deleteTicket(ticket.id);
        notifySuccess('Ticket eliminado exitosamente');
      } catch (err) {
        if (err.response?.status === 403) {
          notifyError('No tienes permisos para eliminar este ticket');
        } else {
          notifyError('Error al eliminar el ticket.');
        }
      }
    });
  }, [canDeleteTicket, notifyError, notifySuccess]);

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

      if (formData.attachment) {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('priority', formData.priority);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('assignedTo', assignedToValue || '');
        formDataToSend.append('createdAt', new Date().toISOString());
        formDataToSend.append('attachment', formData.attachment);

        await ticketsAPI.createTicketWithAttachment(formDataToSend);
        setShowCreateModal(false);
        notifySuccess('Ticket creado exitosamente');
      } else {
        const ticketData = {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          status: formData.status,
          assignedTo: assignedToValue || null,
          createdAt: new Date().toISOString()
        };

        await ticketsAPI.createTicket(ticketData);
        setShowCreateModal(false);
        notifySuccess('Ticket creado exitosamente');
      }
    } catch (err) {
      if (err.response?.status === 403) {
        notifyError('No tienes permisos para crear tickets');
      } else {
        notifyError('Error al crear el ticket.');
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
      notifySuccess('Ticket actualizado exitosamente');
    } catch (err) {
      if (err.response?.status === 403) {
        notifyError('No tienes permisos para editar este ticket');
      } else {
        notifyError('Error al actualizar el ticket.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewDetail = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const data = await ticketsAPI.fetchTicketById(ticket.id);
      setSelectedTicket(data);
      setComments(data.comments || []);

      const messagesData = await messagesAPI.fetchMessages(ticket.id);
      setMessages(messagesData);
    } catch (err) {
      if (err.response?.status === 403) {
        notifyError('No tienes permisos para ver los detalles de este ticket');
        return;
      }
      if (err.response?.status === 401) {
        notifyError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        return;
      }
      notifyError('Error al cargar los detalles del ticket.');
    }
    setShowDetailModal(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!canSendMessage(selectedTicket)) {
      notifyError('No tienes permisos para enviar mensajes en este ticket');
      return;
    }

    try {
      await messagesAPI.createMessage(selectedTicket.id, { content: newMessage });
      setNewMessage('');
      notifySuccess('Mensaje enviado exitosamente');
    } catch (err) {
      if (err.response?.status === 403) {
        notifyError('No tienes permisos para enviar mensajes en este ticket');
      } else {
        notifyError('Error al enviar mensaje.');
      }
    }
  };

  // Funciones de exportación - Import dinámico de XLSX para mejor rendimiento
  const exportToExcel = async () => {
    // Import dinámico de XLSX - solo se carga cuando el usuario hace clic en exportar
    const XLSX = await import('xlsx');
    const headers = ['ID', 'Título', 'Descripción', 'Prioridad', 'Estado', 'Creado por', 'Asignado a', 'Fecha Creación'];
     const rows = tickets.map(ticket => [
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

        if (row === 0) {
          ws[cellAddress].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '6B46C1' } },
            alignment: { horizontal: 'center' }
          };
        } else {
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
    notifySuccess('Tickets exportados exitosamente');
  };


  // Funciones de UI
  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  if (loading) {
    return (
      <div className={conditionalClasses({
        light: "min-h-screen flex items-center justify-center",
        dark: "min-h-screen flex items-center justify-center"
      })}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#662d91] mx-auto mb-4"></div>
          <p className={conditionalClasses({
            light: "text-lg text-gray-600 font-medium",
            dark: "text-lg text-gray-300 font-medium"
          })}>Cargando tickets...</p>
        </div>
      </div>
    );
  }

    return (
      <div className={conditionalClasses({
        light: "min-h-screen py-4 px-3 sm:py-6 sm:px-4 lg:px-8",
        dark: "min-h-screen py-4 px-3 sm:py-6 sm:px-4 lg:px-8"
      })}>
      <div className="max-w-7xl mx-auto">
        {/* Confirm Dialog */}
        {confirmDialog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
            <div className={conditionalClasses({
              light: "bg-white rounded-xl lg:rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 transform animate-scale-in",
              dark: "bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl max-w-md w-full border border-gray-600 transform animate-scale-in"
            })}>
              <div className="p-4 lg:p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <FaExclamationTriangle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
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
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base touch-manipulation"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <TicketHeader
          user={user}
          checkPermission={checkPermission}
          showStats={showStats}
          setShowStats={setShowStats}
          exportToExcel={exportToExcel}
          canCreate={canCreate}
          handleCreate={handleCreate}
        />

         {/* Stats Cards */}
         {showStats && <TicketStats stats={ticketStats} />}

        {/* Charts */}
        {showStats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className={conditionalClasses({
              light: "bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6",
              dark: "bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-700 p-6"
            })}>
              <h3 className={conditionalClasses({
                light: "text-lg font-bold text-gray-900 mb-4",
                dark: "text-lg font-bold text-white mb-4"
              })}>Administradores con Más Tickets Asignados</h3>
              <Bar data={adminChartData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }} />
            </div>
            <div className={conditionalClasses({
              light: "bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6",
              dark: "bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-700 p-6"
            })}>
              <h3 className={conditionalClasses({
                light: "text-lg font-bold text-gray-900 mb-4",
                dark: "text-lg font-bold text-white mb-4"
              })}>Categorías con Más Reportes</h3>
              <Bar data={categoryChartData} options={{
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

        {/* Filters */}
        <TicketFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          titleFilter={titleFilter}
          setTitleFilter={setTitleFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          standardizedTitles={standardizedTitles}
        />

          {/* Ticket List */}
          <TicketList
            tickets={tickets}
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            conditionalClasses={conditionalClasses}
            handleViewDetail={handleViewDetail}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            canEditTicket={canEditTicket}
            canDeleteTicket={canDeleteTicket}
            user={user}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />

        {/* Modals */}
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
