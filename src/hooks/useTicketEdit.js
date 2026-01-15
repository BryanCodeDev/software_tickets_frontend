import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar la edición de tickets
 * Centraliza la lógica de configuración del formulario de edición según el rol del usuario
 */
export const useTicketEdit = () => {
  const [editingTicket, setEditingTicket] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    priority: 'media',
    status: 'abierto',
    assignedTo: ''
  });

  /**
   * Configura los datos del formulario de edición según el rol del usuario y el ticket
   * @param {Object} ticket - Ticket a editar
   * @param {string} userRole - Rol del usuario actual
   */
  const handleEdit = (ticket, userRole) => {
    if (!ticket) return;

    // Configurar datos del formulario según el rol
    let formData = {
      title: '',
      description: '',
      priority: 'media',
      status: 'abierto',
      assignedTo: ''
    };

    switch (userRole) {
      case 'Administrador':
        formData = {
          title: ticket.title || '',
          description: ticket.description || '',
          priority: ticket.priority || 'media',
          status: ticket.status || 'abierto',
          assignedTo: ticket.assignedTo || ''
        };
        break;
        
      case 'Técnico':
      case 'Calidad':
        formData = {
          title: ticket.title || '',
          description: ticket.description || '',
          priority: ticket.priority || 'media',
          status: ticket.status || 'abierto',
          assignedTo: ticket.assignedTo || ''
        };
        break;
        
      case 'Empleado':
        formData = {
          title: ticket.title || '',
          description: ticket.description || '',
          priority: ticket.priority || 'media',
          status: ticket.status || 'abierto',
          assignedTo: ticket.assignedTo || ''
        };
        break;
        
      case 'Jefe':
      case 'Compras':
      case 'Coordinadora Administrativa':
        formData = {
          title: ticket.title || '',
          description: ticket.description || '',
          priority: ticket.priority || 'media',
          status: ticket.status || 'abierto',
          assignedTo: ticket.assignedTo || ''
        };
        break;
        
      default:
        // Para cualquier otro rol, mostrar todos los campos con los datos del ticket
        formData = {
          title: ticket.title || '',
          description: ticket.description || '',
          priority: ticket.priority || 'media',
          status: ticket.status || 'abierto',
          assignedTo: ticket.assignedTo || ''
        };
        break;
    }

    setEditFormData(formData);
    setEditingTicket(ticket);
  };

  /**
   * Limpia los datos de edición
   */
  const clearEditData = () => {
    setEditingTicket(null);
    setEditFormData({
      title: '',
      description: '',
      priority: 'media',
      status: 'abierto',
      assignedTo: ''
    });
  };

  /**
   * Actualiza un campo específico del formulario de edición
   * @param {string} field - Nombre del campo
   * @param {any} value - Nuevo valor
   */
  const updateEditField = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    editingTicket,
    editFormData,
    setEditFormData,
    handleEdit,
    clearEditData,
    updateEditField
  };
};