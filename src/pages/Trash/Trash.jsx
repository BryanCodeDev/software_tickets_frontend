import React, { useState, useEffect, useContext, useCallback } from 'react';
import { trashAPI } from '../../api';
import AuthContext from '../../context/AuthContext.jsx';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { useNotifications } from '../../hooks/useNotifications';
import { FaTrash, FaUndo, FaTimes, FaSearch, FaFilter, FaChartBar, FaCalendarAlt, FaUser, FaFileAlt, FaTicketAlt, FaDatabase, FaPhone, FaTabletAlt, FaCog, FaHistory, FaEye, FaExclamationTriangle, FaDumpster, FaShieldAlt } from 'react-icons/fa';
import { ConfirmDialog, FilterPanel, StatsPanel } from '../../components/common';

const Trash = () => {
  const { conditionalClasses } = useThemeClasses();
  const { notifySuccess, notifyError } = useNotifications();
  const [trashItems, setTrashItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { user } = useContext(AuthContext);

  // Estados para búsqueda, filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState({ total: 0, stats: [] });
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });

  // Estados para detalles de elemento
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchTrashItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await trashAPI.getFilteredTrash({
        page: pagination.current,
        limit: 12,
        moduleType: filterModule !== 'all' ? filterModule : '',
        search: searchTerm
      });
      setTrashItems(data.trash);
      setPagination(data.pagination);
    } catch {
      notifyError('Error al cargar elementos de la papelera');
    } finally {
      setLoading(false);
    }
  }, [notifyError, pagination.current, filterModule, searchTerm]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await trashAPI.getTrashStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  useEffect(() => {
    if (user && (user.role?.name === 'Administrador' || user.role?.name === 'Tecnico')) {
      fetchTrashItems();
      fetchStats();
    }
  }, [user, fetchTrashItems, fetchStats]);

  useEffect(() => {
    if (user && (user.role?.name === 'Administrador' || user.role?.name === 'Tecnico')) {
      setPagination(prev => ({ ...prev, current: 1 }));
      fetchTrashItems();
    }
  }, [searchTerm, filterModule, fetchTrashItems]);

  useEffect(() => {
    if (user && (user.role?.name === 'Administrador' || user.role?.name === 'Tecnico')) {
      fetchTrashItems();
    }
  }, [pagination.current, fetchTrashItems]);

  const handleRestore = async (item) => {
    showConfirmDialog(
      `¿Estás seguro de que deseas restaurar "${item.title}"?`,
      async () => {
        try {
          await trashAPI.restoreTrash(item.id);
          fetchTrashItems();
          fetchStats();
          notifySuccess('Elemento restaurado exitosamente');
        } catch {
          notifyError('Error al restaurar el elemento');
        }
      }
    );
  };

  const handlePermanentDelete = async (item) => {
    showConfirmDialog(
      `¿Estás seguro de que deseas eliminar permanentemente "${item.title}"? Esta acción no se puede deshacer.`,
      async () => {
        try {
          await trashAPI.deleteTrash(item.id);
          fetchTrashItems();
          fetchStats();
          notifySuccess('Elemento eliminado permanentemente');
        } catch {
          notifyError('Error al eliminar el elemento');
        }
      }
    );
  };

  const handleEmptyTrash = () => {
    showConfirmDialog(
      '¿Estás seguro de que deseas vaciar toda la papelera? Esta acción eliminará permanentemente todos los elementos.',
      async () => {
        try {
          await trashAPI.emptyTrash();
          fetchTrashItems();
          fetchStats();
          notifySuccess('Papelera vaciada exitosamente');
        } catch {
          notifyError('Error al vaciar la papelera');
        }
      }
    );
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

  const getModuleIcon = (moduleType) => {
    switch(moduleType) {
      case 'ticket': return <FaTicketAlt className="w-5 h-5" />;
      case 'qualityTicket': return <FaShieldAlt className="w-5 h-5" />;
      case 'purchaseRequest': return <FaFileAlt className="w-5 h-5" />;
      case 'user': return <FaUser className="w-5 h-5" />;
      case 'inventory': return <FaDatabase className="w-5 h-5" />;
      case 'corporatePhone': return <FaPhone className="w-5 h-5" />;
      case 'document': return <FaFileAlt className="w-5 h-5" />;
      case 'credential': return <FaCog className="w-5 h-5" />;
      case 'tabletInventory': return <FaTabletAlt className="w-5 h-5" />;
      case 'pdaInventory': return <FaPhone className="w-5 h-5" />;
      case 'actaEntrega': return <FaFileAlt className="w-5 h-5" />;
      default: return <FaFileAlt className="w-5 h-5" />;
    }
  };

  const getModuleColor = (moduleType) => {
    switch(moduleType) {
      case 'ticket': return 'from-blue-500 to-blue-600';
      case 'qualityTicket': return 'from-emerald-500 to-emerald-600';
      case 'purchaseRequest': return 'from-purple-500 to-purple-600';
      case 'user': return 'from-orange-500 to-orange-600';
      case 'inventory': return 'from-gray-500 to-gray-600';
      case 'corporatePhone': return 'from-teal-500 to-teal-600';
      case 'document': return 'from-indigo-500 to-indigo-600';
      case 'credential': return 'from-red-500 to-red-600';
      case 'tabletInventory': return 'from-cyan-500 to-cyan-600';
      case 'pdaInventory': return 'from-pink-500 to-pink-600';
      case 'actaEntrega': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return 'Desconocido';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Hace un momento';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `Hace ${days}d`;
    const months = Math.floor(days / 30);
    if (months < 12) return `Hace ${months}m`;
    return `Hace ${Math.floor(months / 12)}a`;
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  if (!user || (user.role?.name !== 'Administrador' && user.role?.name !== 'Tecnico')) {
    return (
      <div className={conditionalClasses({
        light: 'min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] py-8 px-4 sm:px-6 lg:px-8',
        dark: 'min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8'
      })}>
        <div className="container mx-auto">
          <div className={conditionalClasses({
            light: 'bg-white rounded-2xl shadow-xl p-8 text-center',
            dark: 'bg-gray-800 rounded-2xl shadow-xl p-8 text-center'
          })}>
            <FaExclamationTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className={conditionalClasses({
              light: 'text-2xl font-bold text-gray-900 mb-2',
              dark: 'text-2xl font-bold text-gray-100 mb-2'
            })}>Acceso Denegado</h2>
            <p className={conditionalClasses({
              light: 'text-gray-600',
              dark: 'text-gray-300'
            })}>No tienes permisos para acceder a la papelera del sistema.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={conditionalClasses({
      light: 'min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] py-8 px-4 sm:px-6 lg:px-8',
      dark: 'min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8'
    })}>
      {/* Confirm Dialog */}
      <ConfirmDialog
        confirmDialog={confirmDialog}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirm}
      />

      <div>
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className={conditionalClasses({
                light: 'text-2xl sm:text-3xl font-bold text-gray-900 flex items-center',
                dark: 'text-2xl sm:text-3xl font-bold text-gray-100 flex items-center'
              })}>
                <div className={conditionalClasses({
                  light: 'w-12 h-12 bg-linear-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mr-3 shadow-lg',
                  dark: 'w-12 h-12 bg-linear-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mr-3 shadow-lg'
                })}>
                  <FaDumpster className="w-6 h-6 text-white" />
                </div>
                Papelera del Sistema
              </h1>
              <p className={conditionalClasses({
                light: 'mt-2 text-gray-600',
                dark: 'mt-2 text-gray-300'
              })}>Recupera o elimina permanentemente elementos eliminados</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowStats(!showStats)}
                className={conditionalClasses({
                  light: 'inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl transition-all',
                  dark: 'inline-flex items-center px-4 py-2.5 bg-gray-700 hover:bg-gray-600 border-2 border-gray-600 text-gray-200 font-semibold rounded-xl transition-all'
                })}
                title="Ver estadísticas"
              >
                <FaChartBar className="mr-2" />
                <span className="hidden sm:inline">Estadísticas</span>
              </button>
              <button
                onClick={handleEmptyTrash}
                className={conditionalClasses({
                  light: 'flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200',
                  dark: 'flex items-center space-x-2 px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200'
                })}
                disabled={stats.total === 0}
              >
                <FaTrash className="w-5 h-5" />
                <span className="hidden sm:inline">Vaciar Papelera</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        {showStats && (
          <StatsPanel
            showStats={showStats}
            stats={stats}
            statsConfig={[
              {
                key: 'total',
                label: 'Total Elementos',
                icon: FaDumpster,
                gradient: 'from-gray-500 to-gray-600',
                loading: loading
              },
              ...stats.stats.map((stat, index) => ({
                key: `${stat.moduleType}_${index}`,
                label: `${stat.moduleName} (${stat.count})`,
                icon: getModuleIcon(stat.moduleType),
                gradient: getModuleColor(stat.moduleType),
                loading: loading
              }))
            ]}
          />
        )}

        {/* Filter Panel */}
        <FilterPanel
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filters={[
            {
              label: 'Módulo',
              value: filterModule,
              onChange: setFilterModule,
              type: 'select',
              options: [
                { value: 'all', label: 'Todos los módulos' },
                { value: 'ticket', label: 'Tickets' },
                { value: 'qualityTicket', label: 'Tickets de Calidad' },
                { value: 'purchaseRequest', label: 'Solicitudes de Compra' },
                { value: 'user', label: 'Usuarios' },
                { value: 'inventory', label: 'Inventario' },
                { value: 'corporatePhone', label: 'Teléfonos Corporativos' },
                { value: 'document', label: 'Documentos' },
                { value: 'credential', label: 'Credenciales' },
                { value: 'tabletInventory', label: 'Inventario Tablets' },
                { value: 'pdaInventory', label: 'Inventario PDAs' },
                { value: 'actaEntrega', label: 'Actas de Entrega' }
              ]
            }
          ]}
        />

        {/* Resumen de resultados */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
          <p className={conditionalClasses({
            light: 'text-sm text-gray-600 font-medium',
            dark: 'text-sm text-gray-300 font-medium'
          })}>
            Mostrando <span className="font-bold text-[#662d91]">{trashItems.length}</span> de <span className="font-bold">{pagination.total}</span> elementos
          </p>
          <p className={conditionalClasses({
            light: 'text-xs text-gray-500',
            dark: 'text-xs text-gray-400'
          })}>
            Los elementos se eliminan automáticamente después de 30 días
          </p>
        </div>

        <div className={conditionalClasses({
          light: 'bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden',
          dark: 'bg-gray-800 rounded-2xl shadow-xl border border-gray-600 overflow-hidden'
        })}>
          <div className={conditionalClasses({
            light: 'px-6 py-4 border-b border-gray-200 bg-gray-50',
            dark: 'px-6 py-4 border-b border-gray-600 bg-gray-700'
          })}>
            <h2 className={conditionalClasses({
              light: 'text-xl font-semibold text-gray-900',
              dark: 'text-xl font-semibold text-gray-100'
            })}>Elementos Eliminados</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className={conditionalClasses({
                  light: 'animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto',
                  dark: 'animate-spin rounded-full h-12 w-12 border-b-2 border-gray-100 mx-auto'
                })}></div>
                <p className={conditionalClasses({
                  light: 'mt-4 text-gray-600',
                  dark: 'mt-4 text-gray-300'
                })}>Cargando elementos de la papelera...</p>
              </div>
            ) : trashItems.length === 0 ? (
              <div className="text-center py-12">
                <div className={conditionalClasses({
                  light: 'w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4',
                  dark: 'w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4'
                })}>
                  <FaDumpster className={conditionalClasses({
                    light: 'w-8 h-8 text-gray-400',
                    dark: 'w-8 h-8 text-gray-500'
                  })} />
                </div>
                <h3 className={conditionalClasses({
                  light: 'text-lg font-medium text-gray-900 mb-2',
                  dark: 'text-lg font-medium text-gray-100 mb-2'
                })}>
                  {searchTerm || filterModule !== 'all'
                    ? 'No se encontraron elementos'
                    : 'La papelera está vacía'}
                </h3>
                <p className={conditionalClasses({
                  light: 'text-gray-600',
                  dark: 'text-gray-300'
                })}>
                  {searchTerm || filterModule !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Los elementos eliminados aparecerán aquí'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {trashItems.map((item) => (
                    <div key={item.id} className={conditionalClasses({
                      light: 'bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow',
                      dark: 'bg-gray-700 rounded-xl p-4 sm:p-6 border border-gray-600 hover:shadow-md transition-shadow'
                    })}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={conditionalClasses({
                            light: `w-10 h-10 bg-linear-to-r ${getModuleColor(item.moduleType)} rounded-full flex items-center justify-center text-white`,
                            dark: `w-10 h-10 bg-linear-to-r ${getModuleColor(item.moduleType)} rounded-full flex items-center justify-center text-white`
                          })}>
                            {getModuleIcon(item.moduleType)}
                          </div>
                          <h3 className={conditionalClasses({
                            light: 'font-semibold text-gray-900 truncate',
                            dark: 'font-semibold text-gray-100 truncate'
                          })} title={item.title}>
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className={conditionalClasses({
                        light: 'space-y-2 text-sm text-gray-600 mb-4',
                        dark: 'space-y-2 text-sm text-gray-300 mb-4'
                      })}>
                        <div className="flex items-center gap-2">
                          <FaFileAlt className={conditionalClasses({
                            light: 'w-3 h-3 text-gray-400',
                            dark: 'w-3 h-3 text-gray-500'
                          })} />
                          <p><strong>Módulo:</strong> {item.moduleName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaUser className={conditionalClasses({
                            light: 'w-3 h-3 text-gray-400',
                            dark: 'w-3 h-3 text-gray-500'
                          })} />
                          <p><strong>Eliminado por:</strong> {item.deleter?.name || 'Usuario desconocido'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className={conditionalClasses({
                            light: 'w-3 h-3 text-gray-400',
                            dark: 'w-3 h-3 text-gray-500'
                          })} />
                          <p><strong>Eliminado:</strong> {getTimeAgo(item.deletedAt)}</p>
                        </div>
                        {item.deletedReason && (
                          <div className={conditionalClasses({
                            light: 'pt-2 border-t border-gray-200',
                            dark: 'pt-2 border-t border-gray-600'
                          })}>
                            <p className={conditionalClasses({
                              light: 'text-xs text-gray-500 mb-1',
                              dark: 'text-xs text-gray-400 mb-1'
                            })}><strong>Razón:</strong></p>
                            <p className={conditionalClasses({
                              light: 'text-xs text-gray-600 italic',
                              dark: 'text-xs text-gray-300 italic'
                            })}>{item.deletedReason}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className={conditionalClasses({
                            light: 'flex items-center justify-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors',
                            dark: 'flex items-center justify-center space-x-1 px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-medium rounded-lg hover:bg-blue-900/50 transition-colors'
                          })}
                        >
                          <FaEye />
                          <span>Ver detalles</span>
                        </button>
                        <button
                          onClick={() => handleRestore(item)}
                          className={conditionalClasses({
                            light: 'flex items-center justify-center space-x-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200 transition-colors',
                            dark: 'flex items-center justify-center space-x-1 px-3 py-1 bg-green-900/30 text-green-400 text-xs font-medium rounded-lg hover:bg-green-900/50 transition-colors'
                          })}
                        >
                          <FaUndo />
                          <span>Restaurar</span>
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(item)}
                          className={conditionalClasses({
                            light: 'flex items-center justify-center space-x-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors',
                            dark: 'flex items-center justify-center space-x-1 px-3 py-1 bg-red-900/30 text-red-400 text-xs font-medium rounded-lg hover:bg-red-900/50 transition-colors'
                          })}
                        >
                          <FaTrash />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, current: Math.max(1, prev.current - 1) }))}
                        disabled={pagination.current === 1}
                        className={conditionalClasses({
                          light: 'px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed',
                          dark: 'px-3 py-2 text-sm font-medium text-gray-400 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
                        })}
                      >
                        Anterior
                      </button>
                      <span className={conditionalClasses({
                        light: 'px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg',
                        dark: 'px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded-lg'
                      })}>
                        {pagination.current} de {pagination.pages}
                      </span>
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, current: Math.min(prev.pages, prev.current + 1) }))}
                        disabled={pagination.current === pagination.pages}
                        className={conditionalClasses({
                          light: 'px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed',
                          dark: 'px-3 py-2 text-sm font-medium text-gray-400 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
                        })}
                      >
                        Siguiente
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal para ver detalles */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className={conditionalClasses({
            light: 'bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in',
            dark: 'bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-600 animate-scale-in'
          })}>
            <div className={conditionalClasses({
              light: 'sticky top-0 bg-linear-to-r from-gray-600 to-gray-700 p-4 lg:p-6 z-10',
              dark: 'sticky top-0 bg-linear-to-r from-gray-600 to-gray-700 p-4 lg:p-6 z-10'
            })}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                  <FaHistory className="w-6 h-6" />
                  Detalles del Elemento
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={conditionalClasses({
                    light: 'block text-sm font-medium text-gray-700 mb-1',
                    dark: 'block text-sm font-medium text-gray-200 mb-1'
                  })}>Título</label>
                  <p className={conditionalClasses({
                    light: 'text-gray-900 font-semibold',
                    dark: 'text-gray-100 font-semibold'
                  })}>{selectedItem.title}</p>
                </div>
                <div>
                  <label className={conditionalClasses({
                    light: 'block text-sm font-medium text-gray-700 mb-1',
                    dark: 'block text-sm font-medium text-gray-200 mb-1'
                  })}>Módulo</label>
                  <div className="flex items-center gap-2">
                    <div className={conditionalClasses({
                      light: `w-6 h-6 bg-linear-to-r ${getModuleColor(selectedItem.moduleType)} rounded-full flex items-center justify-center text-white`,
                      dark: `w-6 h-6 bg-linear-to-r ${getModuleColor(selectedItem.moduleType)} rounded-full flex items-center justify-center text-white`
                    })}>
                      {getModuleIcon(selectedItem.moduleType)}
                    </div>
                    <p className={conditionalClasses({
                      light: 'text-gray-900',
                      dark: 'text-gray-100'
                    })}>{selectedItem.moduleName}</p>
                  </div>
                </div>
                <div>
                  <label className={conditionalClasses({
                    light: 'block text-sm font-medium text-gray-700 mb-1',
                    dark: 'block text-sm font-medium text-gray-200 mb-1'
                  })}>Eliminado por</label>
                  <p className={conditionalClasses({
                    light: 'text-gray-900',
                    dark: 'text-gray-100'
                  })}>{selectedItem.deleter?.name || 'Usuario desconocido'}</p>
                </div>
                <div>
                  <label className={conditionalClasses({
                    light: 'block text-sm font-medium text-gray-700 mb-1',
                    dark: 'block text-sm font-medium text-gray-200 mb-1'
                  })}>Fecha de eliminación</label>
                  <p className={conditionalClasses({
                    light: 'text-gray-900',
                    dark: 'text-gray-100'
                  })}>{new Date(selectedItem.deletedAt).toLocaleString()}</p>
                </div>
              </div>

              {selectedItem.deletedReason && (
                <div>
                  <label className={conditionalClasses({
                    light: 'block text-sm font-medium text-gray-700 mb-1',
                    dark: 'block text-sm font-medium text-gray-200 mb-1'
                  })}>Razón de eliminación</label>
                  <p className={conditionalClasses({
                    light: 'text-gray-900 bg-gray-50 p-3 rounded-lg',
                    dark: 'text-gray-100 bg-gray-700 p-3 rounded-lg border border-gray-600'
                  })}>{selectedItem.deletedReason}</p>
                </div>
              )}

              <div>
                <label className={conditionalClasses({
                  light: 'block text-sm font-medium text-gray-700 mb-1',
                  dark: 'block text-sm font-medium text-gray-200 mb-1'
                })}>Datos originales</label>
                <div className={conditionalClasses({
                  light: 'bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto',
                  dark: 'bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-700'
                })}>
                  <pre className="text-xs">{JSON.stringify(JSON.parse(selectedItem.data), null, 2)}</pre>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className={conditionalClasses({
                    light: 'flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors',
                    dark: 'flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-gray-100 font-medium rounded-xl transition-colors'
                  })}
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    handleRestore(selectedItem);
                    setShowDetailModal(false);
                  }}
                  className={conditionalClasses({
                    light: 'flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center',
                    dark: 'flex-1 px-4 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center'
                  })}
                >
                  <FaUndo className="mr-2" />
                  Restaurar Elemento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trash;