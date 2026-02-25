import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheck, FaTrash, FaExclamationTriangle, FaTicketAlt, FaBox, FaClipboardCheck, FaShoppingCart, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import notificationsAPI from '../../api/notificationsAPI';

const NotificationsPanel = () => {
  const { conditionalClasses } = useThemeClasses();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  // Cargar notificaciones
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsAPI.getNotifications({ limit: 10 });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar al montar y cuando se abra el panel
  useEffect(() => {
    fetchNotifications();
    
    // Auto-refresh cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Marcar como leída
  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Eliminar notificación
  const handleDelete = async (id) => {
    try {
      await notificationsAPI.deleteNotification(id);
      const notification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Obtener icono según tipo
  const getIcon = (type) => {
    switch (type) {
      case 'ticket_created':
      case 'ticket_assigned':
      case 'ticket_updated':
        return <FaTicketAlt className="text-purple-500" />;
      case 'ticket_comment':
        return <FaTicketAlt className="text-blue-500" />;
      case 'ticket_unassigned':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'inventory_low':
        return <FaBox className="text-orange-500" />;
      case 'quality_due':
        return <FaClipboardCheck className="text-teal-500" />;
      case 'purchase_approved':
      case 'purchase_rejected':
        return <FaShoppingCart className="text-green-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700';
      case 'high':
        return 'bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700';
      case 'medium':
        return 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700';
      default:
        return 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600';
    }
  };

  // Formatear tiempo relativo
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes}min`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString('es-CO');
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Botón de notificaciones */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={conditionalClasses({
          light: 'relative p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors',
          dark: 'relative p-2 rounded-lg hover:bg-gray-700 text-gray-200 transition-colors'
        })}
      >
        <FaBell className="text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <div className={conditionalClasses({
          light: 'absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50',
          dark: 'absolute right-0 top-12 w-96 bg-gray-800 rounded-xl shadow-2xl border border-gray-600 z-50'
        })}>
          {/* Header */}
          <div className={conditionalClasses({
            light: 'flex items-center justify-between p-4 border-b border-gray-200',
            dark: 'flex items-center justify-between p-4 border-b border-gray-600'
          })}>
            <h3 className={conditionalClasses({
              light: 'font-semibold text-gray-900',
              dark: 'font-semibold text-white'
            })}>
              Notificaciones
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className={conditionalClasses({
                    light: 'text-xs text-blue-600 hover:text-blue-800',
                    dark: 'text-xs text-blue-400 hover:text-blue-300'
                  })}
                >
                  Marcar todo
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={conditionalClasses({
                  light: 'p-1 hover:bg-gray-100 rounded',
                  dark: 'p-1 hover:bg-gray-700 rounded'
                })}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#662d91] mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <FaBell className={conditionalClasses({
                  light: 'text-gray-300 text-4xl mx-auto mb-2',
                  dark: 'text-gray-600 text-4xl mx-auto mb-2'
                })} />
                <p className={conditionalClasses({
                  light: 'text-gray-500 text-sm',
                  dark: 'text-gray-400 text-sm'
                })}>No hay notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b ${conditionalClasses({
                    light: 'border-gray-100 hover:bg-gray-50',
                    dark: 'border-gray-700 hover:bg-gray-700'
                  })} ${notification.isRead ? 'opacity-60' : getPriorityColor(notification.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={conditionalClasses({
                        light: 'font-medium text-sm text-gray-900 truncate',
                        dark: 'font-medium text-sm text-white truncate'
                      })}>
                        {notification.title}
                      </p>
                      <p className={conditionalClasses({
                        light: 'text-xs text-gray-600 mt-1 line-clamp-2',
                        dark: 'text-xs text-gray-300 mt-1 line-clamp-2'
                      })}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={conditionalClasses({
                          light: 'text-xs text-gray-400',
                          dark: 'text-xs text-gray-500'
                        })}>
                          {formatTime(notification.createdAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className={conditionalClasses({
                                light: 'p-1 text-blue-600 hover:bg-blue-100 rounded',
                                dark: 'p-1 text-blue-400 hover:bg-blue-900/30 rounded'
                              })}
                              title="Marcar como leída"
                            >
                              <FaCheck className="text-xs" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className={conditionalClasses({
                              light: 'p-1 text-red-600 hover:bg-red-100 rounded',
                              dark: 'p-1 text-red-400 hover:bg-red-900/30 rounded'
                            })}
                            title="Eliminar"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className={conditionalClasses({
              light: 'p-3 border-t border-gray-200 text-center',
              dark: 'p-3 border-t border-gray-600 text-center'
            })}>
              <button
                onClick={() => { /* Navegar a página de notificaciones */ }}
                className={conditionalClasses({
                  light: 'text-sm text-[#662d91] hover:text-[#8e4dbf] font-medium',
                  dark: 'text-sm text-[#8e4dbf] hover:text-[#662d91] font-medium'
                })}
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
