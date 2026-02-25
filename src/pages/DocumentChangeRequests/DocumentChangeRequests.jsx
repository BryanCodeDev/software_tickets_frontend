import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaPlus, FaFilter, FaSearch, FaFileAlt, FaDownload, FaChartBar, FaTimes, FaCheck } from 'react-icons/fa';
import documentChangeRequestsAPI from '../../api/documentChangeRequestsAPI';
import DocumentChangeRequestCard from '../../components/DocumentChangeRequests/DocumentChangeRequestCard';
import DocumentChangeRequestModal from '../../components/DocumentChangeRequests/modals/DocumentChangeRequestModal';
import StatsPanel from '../../components/common/StatsPanel';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { useNotifications } from '../../hooks/useNotifications';

const DocumentChangeRequestsPage = () => {
  const { conditionalClasses } = useThemeClasses();
  const { notifySuccess, notifyError } = useNotifications();
  const { user } = useAuth();
  const userRole = user?.role?.name;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Filtros - formato correcto para FilterPanel
  const [filters, setFilters] = useState({
    status: 'all',
    requestType: 'all',
    priority: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Ordenamiento
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Cargar solicitudes
  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      // Los filtros se aplican en el frontend para mejor experiencia
      const response = await documentChangeRequestsAPI.getAll({});
      setRequests(response.requests || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Verificar permisos
  const canCreate = ['Administrador', 'Calidad', 'Jefe', 'Técnico', 'Coordinadora Administrativa', 'Compras', 'Empleado'].includes(userRole);
  
  const canEdit = useCallback((request) => {
    if (!request) return false;
    // El creador puede editar si está en borrador
    if (request.requester?.id === user?.id && request.workflowStatus === 'borrador') {
      return true;
    }
    // Roles con permisos totales
    return ['Administrador', 'Calidad', 'Jefe', 'Coordinadora Administrativa', 'Técnico'].includes(userRole);
  }, [user, userRole]);

  const canApprove = useCallback((request) => {
    if (!request) return false;
    
    // Ya no puede aprobar si está en estos estados
    if (['borrador', 'publicado', 'rechazado'].includes(request.workflowStatus)) {
      return false;
    }
    
    // Roles que pueden aprobar cualquier paso
    const fullAccessRoles = ['Administrador', 'Técnico'];
    if (fullAccessRoles.includes(userRole)) {
      return true;
    }
    
    // Según el paso actual del workflow:
    // Paso 1 (currentStep=1): Cualquier usuario puede aprobar (enviar a revisión)
    // Paso 2 (currentStep=2): Requiere rol Calidad
    // Paso 3 (currentStep=3): Requiere rol Jefe
    // Paso 4 (currentStep=4): Requiere rol Coordinador/a Administrativa
    // Paso 5 (currentStep=5): Requiere rol Calidad o Administrador
    const currentStep = request.currentStep || 1;
    
    // Calidad puede aprobar pasos 2 y 5
    if (userRole === 'Calidad' && [2, 5].includes(currentStep)) {
      return true;
    }
    
    // Jefe puede aprobar paso 3
    if (userRole === 'Jefe' && currentStep === 3) {
      return true;
    }
    
    // Coordinador/a Administrativa puede aprobar paso 4
    if (userRole === 'Coordinadora Administrativa' && currentStep === 4) {
      return true;
    }
    
    // Compras no tiene permisos de aprobación en el workflow de documentos
    return false;
  }, [user, userRole]);

  // Handlers
  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setModalMode('approve');
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedRequest(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleSave = async () => {
    await loadRequests();
  };

  const handleSubmit = async () => {
    await loadRequests();
  };

  const handleApprovalAction = async () => {
    await loadRequests();
  };

  // Filtrar y ordenar solicitudes
  const filteredRequests = requests.filter(request => {
    // Filtro por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (
        !request.title?.toLowerCase().includes(search) &&
        !request.description?.toLowerCase().includes(search) &&
        !request.requester?.name?.toLowerCase().includes(search) &&
        !request.document?.name?.toLowerCase().includes(search)
      ) {
        return false;
      }
    }

    // Filtro por status (workflowStatus)
    if (filters.status !== 'all' && request.workflowStatus !== filters.status) {
      return false;
    }

    // Filtro por tipo de solicitud
    if (filters.requestType !== 'all' && request.requestType !== filters.requestType) {
      return false;
    }

    // Filtro por prioridad
    if (filters.priority !== 'all' && request.priority !== filters.priority) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    // Manejar fechas
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aVal = new Date(aVal || 0).getTime();
      bVal = new Date(bVal || 0).getTime();
    }

    // Manejar valores nulos
    if (aVal === null || aVal === undefined) aVal = '';
    if (bVal === null || bVal === undefined) bVal = '';

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal ? bVal.toLowerCase() : '';
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Configuración de estadísticas
  const calculateStats = () => {
    const stats = {
      total: requests.length,
      borrador: requests.filter(r => r.workflowStatus === 'borrador').length,
      pendienteRevision: requests.filter(r => r.workflowStatus === 'pendiente_revision').length,
      enRevision: requests.filter(r => r.workflowStatus === 'en_revision').length,
      aprobado: requests.filter(r => r.workflowStatus === 'aprobado').length,
      enImplementacion: requests.filter(r => r.workflowStatus === 'en_implementacion').length,
      publicado: requests.filter(r => r.workflowStatus === 'publicado').length,
      rechazado: requests.filter(r => r.workflowStatus === 'rechazado').length,
      // Por tipo
      createRequests: requests.filter(r => r.requestType === 'create').length,
      editRequests: requests.filter(r => r.requestType === 'edit').length,
      versionRequests: requests.filter(r => r.requestType === 'version_update').length,
      deleteRequests: requests.filter(r => r.requestType === 'delete').length,
      // Por prioridad
      baja: requests.filter(r => r.priority === 'baja').length,
      media: requests.filter(r => r.priority === 'media').length,
      alta: requests.filter(r => r.priority === 'alta').length,
      urgente: requests.filter(r => r.priority === 'urgente').length
    };
    return stats;
  };

  const stats = calculateStats();

  // Función para exportar
  const handleExport = () => {
    try {
      const exportData = filteredRequests.map(request => ({
        'ID': request.id,
        'Título': request.title,
        'Tipo': request.requestType === 'create' ? 'Crear' : 
                request.requestType === 'edit' ? 'Editar' :
                request.requestType === 'version_update' ? 'Nueva Versión' : 'Eliminar',
        'Estado': request.workflowStatus === 'borrador' ? 'Borrador' :
                  request.workflowStatus === 'pendiente_revision' ? 'Pendiente Revisión' :
                  request.workflowStatus === 'en_revision' ? 'En Revisión' :
                  request.workflowStatus === 'aprobado' ? 'Aprobado' :
                  request.workflowStatus === 'en_implementacion' ? 'En Implementación' :
                  request.workflowStatus === 'publicado' ? 'Publicado' : 'Rechazado',
        'Prioridad': request.priority === 'baja' ? 'Baja' :
                    request.priority === 'media' ? 'Media' :
                    request.priority === 'alta' ? 'Alta' : 'Urgente',
        'Solicitante': request.requester?.name || request.requester?.username || 'N/A',
        'Documento': request.document?.name || 'N/A',
        'Fecha Creación': request.createdAt ? new Date(request.createdAt).toLocaleDateString('es-CO') : 'N/A',
        'Última Actualización': request.updatedAt ? new Date(request.updatedAt).toLocaleDateString('es-CO') : 'N/A'
      }));

      // Convertir a CSV
      if (exportData.length === 0) {
        notifyError('No hay datos para exportar');
        return;
      }

      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => {
          let cell = row[header] || '';
          // Escapar comillas
          if (typeof cell === 'string' && cell.includes(',')) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(','))
      ].join('\n');

      // Descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `solicitudes_cambio_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      notifySuccess('Exportación completada exitosamente');
    } catch {
      notifyError('Error al exportar datos');
    }
  };



  return (
    <div className={conditionalClasses({
      light: 'min-h-screen bg-gray-50',
      dark: 'min-h-screen bg-gray-900'
    })}>
      {/* Header */}
      <div className={conditionalClasses({
        light: 'bg-white shadow-sm border-b border-gray-200',
        dark: 'bg-gray-800 shadow-sm border-b border-gray-700'
      })}>
        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className={conditionalClasses({
                light: 'text-2xl font-bold text-gray-900 flex items-center gap-3',
                dark: 'text-2xl font-bold text-white flex items-center gap-3'
              })}>
                <FaFileAlt className="text-[#662d91]" />
                Solicitudes de Cambio Documental
              </h1>
              <p className={conditionalClasses({
                light: 'text-gray-500 mt-1',
                dark: 'text-gray-400 mt-1'
              })}>
                Gestión de cambios en documentación ISO 9001
              </p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Botón Estadísticas */}
              <button
                onClick={() => setShowStats(!showStats)}
                className={conditionalClasses({
                  light: 'px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700',
                  dark: 'px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors bg-gray-700 hover:bg-gray-600 text-gray-200'
                })}
              >
                <FaChartBar />
                Estadísticas
              </button>

              {/* Botón Exportar */}
              <button
                onClick={handleExport}
                disabled={filteredRequests.length === 0}
                className={conditionalClasses({
                  light: 'px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors bg-green-100 hover:bg-green-200 text-green-700 disabled:opacity-50',
                  dark: 'px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors bg-green-900 hover:bg-green-800 text-green-300 disabled:opacity-50'
                })}
              >
                <FaDownload />
                Exportar
              </button>
              
              {/* Botón Filtrar */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={conditionalClasses({
                  light: 'px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700',
                  dark: 'px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors bg-gray-700 hover:bg-gray-600 text-gray-200'
                })}
              >
                <FaFilter />
                Filtros
              </button>
              
              {/* Botón Nueva Solicitud */}
              {canCreate && (
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors bg-[#662d91] hover:bg-[#5a257a] text-white"
                >
                  <FaPlus />
                  Nueva Solicitud
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Panel - Ahora configurable */}
      {showStats && (
        <div className="p-4 lg:p-6">
          <StatsPanel
            showStats={showStats}
            stats={stats}
            statsConfig={[
              {
                key: 'total',
                label: 'Total Solicitudes',
                icon: FaFileAlt,
                gradient: 'from-blue-500 to-blue-600',
                loading: loading
              },
              {
                key: 'borrador',
                label: 'Borrador',
                icon: FaFileAlt,
                gradient: 'from-gray-500 to-gray-600',
                loading: loading
              },
              {
                key: 'pendienteRevision',
                label: 'Pendiente Revisión',
                icon: FaFileAlt,
                gradient: 'from-yellow-500 to-orange-600',
                loading: loading
              },
              {
                key: 'enRevision',
                label: 'En Revisión',
                icon: FaFileAlt,
                gradient: 'from-blue-500 to-indigo-600',
                loading: loading
              },
              {
                key: 'aprobado',
                label: 'Aprobado',
                icon: FaCheck,
                gradient: 'from-green-500 to-emerald-600',
                loading: loading
              },
              {
                key: 'publicado',
                label: 'Publicado',
                icon: FaCheck,
                gradient: 'from-purple-500 to-purple-600',
                loading: loading
              },
              {
                key: 'rechazado',
                label: 'Rechazado',
                icon: FaTimes,
                gradient: 'from-red-500 to-red-600',
                loading: loading
              }
            ]}
          />
        </div>
      )}

      {/* Filters - Formato correcto */}
      {showFilters && (
        <div className="px-4 lg:px-6">
          <div className={conditionalClasses({
            light: 'rounded-2xl shadow-lg border-2 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 bg-white border-gray-200',
            dark: 'rounded-2xl shadow-lg border-2 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 bg-gray-800 border-gray-700'
          })}>
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Buscador */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <FaSearch className={conditionalClasses({
                    light: 'absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400',
                    dark: 'absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500'
                  })} />
                  <input
                    type="text"
                    placeholder="Buscar por título, descripción, solicitante o documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={conditionalClasses({
                      light: 'w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm lg:text-base border-gray-200 text-gray-700 bg-white',
                      dark: 'w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm lg:text-base border-gray-600 text-gray-100 bg-gray-700'
                    })}
                  />
                </div>
              </div>

              {/* Filtros */}
              <div className={conditionalClasses({
                light: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t-2 border-gray-100',
                dark: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t-2 border-gray-600'
              })}>
                {/* Estado */}
                <div>
                  <label className={conditionalClasses({
                    light: 'block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-700',
                    dark: 'block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-200'
                  })}>Estado</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className={conditionalClasses({
                      light: 'w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm border-gray-200 bg-white text-gray-700',
                      dark: 'w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm border-gray-600 bg-gray-700 text-gray-100'
                    })}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="borrador">Borrador</option>
                    <option value="pendiente_revision">Pendiente Revisión</option>
                    <option value="en_revision">En Revisión</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="en_implementacion">En Implementación</option>
                    <option value="publicado">Publicado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </div>

                {/* Tipo */}
                <div>
                  <label className={conditionalClasses({
                    light: 'block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-700',
                    dark: 'block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-200'
                  })}>Tipo</label>
                  <select
                    value={filters.requestType}
                    onChange={(e) => setFilters(prev => ({ ...prev, requestType: e.target.value }))}
                    className={conditionalClasses({
                      light: 'w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm border-gray-200 bg-white text-gray-700',
                      dark: 'w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm border-gray-600 bg-gray-700 text-gray-100'
                    })}
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="create">Crear</option>
                    <option value="edit">Editar</option>
                    <option value="version_update">Nueva Versión</option>
                    <option value="delete">Eliminar</option>
                  </select>
                </div>

                {/* Prioridad */}
                <div>
                  <label className={conditionalClasses({
                    light: 'block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-700',
                    dark: 'block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-200'
                  })}>Prioridad</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                    className={conditionalClasses({
                      light: 'w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm border-gray-200 bg-white text-gray-700',
                      dark: 'w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm border-gray-600 bg-gray-700 text-gray-100'
                    })}
                  >
                    <option value="all">Todas las prioridades</option>
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                {/* Ordenar */}
                <div>
                  <label className={conditionalClasses({
                    light: 'block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-700',
                    dark: 'block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-200'
                  })}>Ordenar por</label>
                  <div className="flex gap-1.5 sm:gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={conditionalClasses({
                        light: 'flex-1 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm border-gray-200 bg-white text-gray-700',
                        dark: 'flex-1 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-xs sm:text-sm border-gray-600 bg-gray-700 text-gray-100'
                      })}
                    >
                      <option value="createdAt">Fecha Creación</option>
                      <option value="updatedAt">Última Actualización</option>
                      <option value="title">Título</option>
                      <option value="priority">Prioridad</option>
                      <option value="workflowStatus">Estado</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className={conditionalClasses({
                        light: 'px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 rounded-xl transition-all bg-gray-100 hover:bg-gray-200 text-gray-600',
                        dark: 'px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 rounded-xl transition-all bg-gray-700 hover:bg-gray-600 text-gray-300'
                      })}
                      title={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Limpiar filtros */}
              {(filters.status !== 'all' || filters.requestType !== 'all' || filters.priority !== 'all' || searchTerm) && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setFilters({ status: 'all', requestType: 'all', priority: 'all' });
                      setSearchTerm('');
                    }}
                    className={conditionalClasses({
                      light: 'text-sm text-[#662d91] hover:text-[#5a257a] font-medium',
                      dark: 'text-sm text-purple-400 hover:text-purple-300 font-medium'
                    })}
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 lg:p-6">
        {/* Resumen de resultados */}
        <div className={conditionalClasses({
          light: 'mb-4 text-sm text-gray-600',
          dark: 'mb-4 text-sm text-gray-300'
        })}>
          Mostrando <span className="font-bold text-[#662d91]">{filteredRequests.length}</span> de <span className="font-bold">{requests.length}</span> solicitudes
        </div>

        {error && (
          <div className={conditionalClasses({
            light: 'mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-200',
            dark: 'mb-4 p-3 rounded-lg bg-red-900/30 text-red-400 border border-red-800'
          })}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#662d91]"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <FaFileAlt className={conditionalClasses({
              light: 'w-16 h-16 mx-auto text-gray-300 mb-4',
              dark: 'w-16 h-16 mx-auto text-gray-600 mb-4'
            })} />
            <h3 className={conditionalClasses({
              light: 'text-lg font-medium text-gray-900 mb-2',
              dark: 'text-lg font-medium text-white mb-2'
            })}>
              No hay solicitudes de cambio
            </h3>
            <p className={conditionalClasses({
              light: 'text-gray-500',
              dark: 'text-gray-400'
            })}>
              {canCreate ? 'Crea una nueva solicitud para comenzar' : 'No tienes solicitudes asignadas'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {filteredRequests.map(request => (
              <DocumentChangeRequestCard
                key={request.id}
                request={request}
                onViewDetail={handleViewDetail}
                onEdit={handleEdit}
                canEdit={canEdit}
                canApprove={canApprove}
                onApprove={handleApprove}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <DocumentChangeRequestModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
          mode={modalMode}
          onSave={handleSave}
          onSubmit={handleSubmit}
          onApprove={handleApprovalAction}
        />
      )}
    </div>
  );
};

export default DocumentChangeRequestsPage;
