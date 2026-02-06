import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaPlus, FaFilter, FaSearch, FaFileAlt } from 'react-icons/fa';
import documentChangeRequestsAPI from '../../api/documentChangeRequestsAPI';
import DocumentChangeRequestCard from '../../components/DocumentChangeRequests/DocumentChangeRequestCard';
import DocumentChangeRequestModal from '../../components/DocumentChangeRequests/modals/DocumentChangeRequestModal';
import StatsPanel from '../../components/common/StatsPanel';
import FilterPanel from '../../components/common/FilterPanel';

const DocumentChangeRequestsPage = () => {
  const { user, userRole } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Filtros
  const [filters, setFilters] = useState({
    status: '',
    requestType: '',
    priority: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar solicitudes
  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.requestType) params.requestType = filters.requestType;
      if (filters.priority) params.priority = filters.priority;
      
      const response = await documentChangeRequestsAPI.getAll(params);
      setRequests(response.requests || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Verificar permisos
  const canCreate = ['Administrador', 'Calidad', 'Jefe', 'Técnico'].includes(userRole);
  
  const canEdit = useCallback((request) => {
    if (!request) return false;
    // El creador puede editar si está en borrador
    if (request.requester?.id === user?.id && request.workflowStatus === 'borrador') {
      return true;
    }
    // Roles con permisos totales
    return ['Administrador', 'Calidad', 'Jefe'].includes(userRole);
  }, [user, userRole]);

  const canApprove = useCallback((request) => {
    if (!request) return false;
    // Roles que pueden aprobar
    return ['Administrador', 'Calidad', 'Jefe'].includes(userRole);
  }, [userRole]);

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

  // Filtrar por búsqueda
  const filteredRequests = requests.filter(request => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      request.title?.toLowerCase().includes(search) ||
      request.description?.toLowerCase().includes(search) ||
      request.requester?.name?.toLowerCase().includes(search)
    );
  });

  // Configuración de estadísticas
  const calculateStats = () => {
    const stats = {
      total: requests.length,
      borrador: requests.filter(r => r.workflowStatus === 'borrador').length,
      pendiente: requests.filter(r => ['pendiente_revision', 'en_revision'].includes(r.workflowStatus)).length,
      enRevision: requests.filter(r => r.workflowStatus === 'en_revision').length,
      aprobado: requests.filter(r => r.workflowStatus === 'aprobado').length,
      publicado: requests.filter(r => r.workflowStatus === 'publicado').length,
      rechazado: requests.filter(r => r.workflowStatus === 'rechazado').length
    };
    return stats;
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FaFileAlt className="text-[#662d91]" />
                Solicitudes de Cambio Documental
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Gestión de cambios en documentación ISO 9001
              </p>
            </div>
            
            {canCreate && (
              <button
                onClick={handleCreate}
                className={`
                  px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors w-fit
                  ${documentChangeRequestsAPI
                    ? 'bg-[#662d91] hover:bg-[#5a257a] text-white'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'}
                `}
              >
                <FaPlus />
                Nueva Solicitud
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="p-4 lg:p-6">
        <StatsPanel stats={stats} />
      </div>

      {/* Filters */}
      <div className="px-4 lg:px-6">
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterOptions={{
            status: [
              { value: 'borrador', label: 'Borrador' },
              { value: 'pendiente_revision', label: 'Pendiente Revisión' },
              { value: 'en_revision', label: 'En Revisión' },
              { value: 'aprobado', label: 'Aprobado' },
              { value: 'en_implementacion', label: 'En Implementación' },
              { value: 'publicado', label: 'Publicado' },
              { value: 'rechazado', label: 'Rechazado' }
            ],
            requestType: [
              { value: 'create', label: 'Crear' },
              { value: 'edit', label: 'Editar' },
              { value: 'version_update', label: 'Nueva Versión' },
              { value: 'delete', label: 'Eliminar' }
            ],
            priority: [
              { value: 'baja', label: 'Baja' },
              { value: 'media', label: 'Media' },
              { value: 'alta', label: 'Alta' },
              { value: 'urgente', label: 'Urgente' }
            ]
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#662d91]"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <FaFileAlt className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay solicitudes de cambio
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
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
