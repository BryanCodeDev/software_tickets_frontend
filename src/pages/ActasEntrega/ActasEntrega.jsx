import React, { useState, useEffect, useContext } from 'react';
import { FaClipboardCheck, FaPlus, FaBox, FaFileExport, FaFileWord, FaFilePdf, FaPrint } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import { useAuth } from '../../hooks/useAuth';
import actaEntregaAPI from '../../api/actaEntregaAPI';
import inventoryAPI from '../../api/inventoryAPI';
import corporatePhoneAPI from '../../api/corporatePhoneAPI';
import usersAPI from '../../api/usersAPI';
import { getSocket, onActaEntregaCreated, onActaEntregaUpdated, onActaEntregaDeleted, onActasEntregaListUpdated } from '../../api/socket';
import { NotificationSystem, ConfirmDialog, FilterPanel, StatsPanel } from '../../components/common';
import ActaEntregaCard from './ActaEntregaCard';
import ActaEntregaTable from './ActaEntregaTable';
import ActaEntregaModal from './ActaEntregaModal';

const ActasEntrega = () => {
  const [actas, setActas] = useState([]);
  const [filteredActas, setFilteredActas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    tipo_equipo: 'inventory',
    equipo_id: '',
    usuario_recibe_id: '',
    fecha_entrega: '',
    estado_equipo_entrega: '',
    observaciones_entrega: '',
    acepta_politica: false,
    firma_recibe: '',
    cargo_recibe: '',
    motivo_entrega: 'nuevo_empleado',
    fecha_devolucion: '',
    estado_equipo_devolucion: '',
    observaciones_devolucion: '',
    firma_entrega_devolucion: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTipo, setFilterTipo] = useState('all');
  const [sortBy, setSortBy] = useState('fecha_entrega');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const { user } = useContext(AuthContext);
  const { checkPermission } = useAuth();

  // Datos adicionales
  const [equiposDisponibles, setEquiposDisponibles] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetchActas();
    fetchEquiposDisponibles();
    fetchUsuarios();

    // Configurar WebSocket para actas de entrega
    const socket = getSocket();
    if (socket) {
      onActaEntregaCreated((acta) => {
        console.log('WebSocket: Nueva acta creada', acta);
        fetchActas();
      });

      onActaEntregaUpdated((data) => {
        console.log('WebSocket: Acta actualizada', data);
        fetchActas();
      });

      onActaEntregaDeleted((data) => {
        console.log('WebSocket: Acta eliminada', data);
        fetchActas();
      });

      onActasEntregaListUpdated(() => {
        console.log('WebSocket: Lista de actas actualizada');
        fetchActas();
      });
    }

    return () => {
      // Limpiar listeners al desmontar el componente
      if (socket) {
        socket.off('acta-entrega-created');
        socket.off('acta-entrega-updated');
        socket.off('acta-entrega-deleted');
        socket.off('actas-entrega-list-updated');
      }
    };
  }, []);

  useEffect(() => {
    filterAndSortActas();
  }, [actas, searchTerm, filterStatus, filterTipo, sortBy, sortOrder]);

  const fetchActas = async () => {
    try {
      const data = await actaEntregaAPI.getAll();
      setActas(data || []);
    } catch (err) {
      console.error('Error fetching actas:', err);
      if (err.response && err.response.status === 403) {
        showNotification('No tienes permisos para ver las actas de entrega.', 'error');
      } else {
        showNotification('Error al cargar las actas de entrega. Por favor, recarga la página.', 'error');
      }
      setActas([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEquiposDisponibles = async () => {
    try {
      const [inventoryData, phonesData] = await Promise.all([
        inventoryAPI.fetchInventory(),
        corporatePhoneAPI.fetchCorporatePhones()
      ]);

      // Procesar equipos del inventario - mostrar todos los equipos
      const equiposInventario = (inventoryData || [])
        .map(item => ({
          id: item.id,
          tipo: 'inventory',
          nombre: `${item.it} - ${item.marca} (${item.serial})`,
          data: item
        }));

      // Procesar teléfonos corporativos - mostrar todos los teléfonos
      const equiposTelefonos = (phonesData || [])
        .map(item => ({
          id: item.id,
          tipo: 'corporate_phone',
          nombre: `${item.numero_celular} - ${item.equipo_celular} (${item.imei})`,
          data: item
        }));

      const equipos = [...equiposInventario, ...equiposTelefonos];

      setEquiposDisponibles(equipos);

      if (equipos.length === 0) {
        showNotification('No hay equipos disponibles en este momento. Contacte al administrador.', 'warning');
      }

    } catch (err) {
      console.error('Error fetching equipos disponibles:', err);
      setEquiposDisponibles([]);
      
      let errorMessage = 'Error al cargar los equipos disponibles.';
      if (err.response) {
        errorMessage += ` Error del servidor: ${err.response.status}`;
      } else if (err.request) {
        errorMessage += ' No se pudo conectar con el servidor.';
      } else {
        errorMessage += ` ${err.message}`;
      }
      
      showNotification(errorMessage, 'error');
    }
  };

  const fetchUsuarios = async () => {
    try {
      const data = await usersAPI.fetchUsers();
      setUsuarios(data || []);
    } catch (err) {
      console.error('Error fetching usuarios:', err);
    }
  };

  const filterAndSortActas = () => {
    let filtered = Array.isArray(actas) ? [...actas] : [];

    if (searchTerm) {
      filtered = filtered.filter(acta =>
        Object.values(acta).some(val =>
          val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterTipo !== 'all') {
      filtered = filtered.filter(acta => acta.tipo_equipo === filterTipo);
    }

    if (filterStatus !== 'all') {
      if (filterStatus === 'entregado') {
        filtered = filtered.filter(acta => !acta.fecha_devolucion);
      } else if (filterStatus === 'devuelto') {
        filtered = filtered.filter(acta => acta.fecha_devolucion);
      }
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredActas(filtered);
  };

  const calculateStats = () => {
    const actasArray = Array.isArray(actas) ? actas : [];
    const total = actasArray.length;
    const entregados = actasArray.filter(a => !a.fecha_devolucion).length;
    const devueltos = actasArray.filter(a => a.fecha_devolucion).length;
    const computadoras = actasArray.filter(a => a.tipo_equipo === 'inventory').length;
    const celulares = actasArray.filter(a => a.tipo_equipo === 'corporate_phone').length;

    return {
      total,
      entregados,
      devueltos,
      computadoras,
      celulares,
      tasaDevolucion: total > 0 ? ((devueltos / total) * 100).toFixed(1) : 0
    };
  };

  const stats = calculateStats();

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      tipo_equipo: 'inventory',
      equipo_id: '',
      usuario_recibe_id: '',
      fecha_entrega: new Date().toISOString().split('T')[0],
      estado_equipo_entrega: '',
      observaciones_entrega: '',
      acepta_politica: false,
      firma_recibe: '',
      cargo_recibe: '',
      motivo_entrega: 'nuevo_empleado',
      fecha_devolucion: '',
      estado_equipo_devolucion: '',
      observaciones_devolucion: '',
      firma_entrega_devolucion: ''
    });
    setShowModal(true);
  };

  const handleEdit = (acta) => {
    setEditingItem(acta);
    setFormData({
      tipo_equipo: acta.tipo_equipo,
      equipo_id: acta.equipo_id,
      usuario_recibe_id: acta.usuario_recibe_id,
      fecha_entrega: acta.fecha_entrega ? acta.fecha_entrega.split('T')[0] : '',
      estado_equipo_entrega: acta.estado_equipo_entrega || '',
      observaciones_entrega: acta.observaciones_entrega || '',
      acepta_politica: acta.acepta_politica || false,
      firma_recibe: acta.firma_recibe || '',
      cargo_recibe: acta.cargo_recibe || '',
      motivo_entrega: acta.motivo_entrega || 'nuevo_empleado',
      fecha_devolucion: acta.fecha_devolucion ? acta.fecha_devolucion.split('T')[0] : '',
      estado_equipo_devolucion: acta.estado_equipo_devolucion || '',
      observaciones_devolucion: acta.observaciones_devolucion || '',
      firma_entrega_devolucion: acta.firma_entrega || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar esta acta de entrega? Esta acción no se puede deshacer.', async () => {
      try {
        await actaEntregaAPI.delete(id);
        fetchActas();
        showNotification('Acta de entrega eliminada exitosamente', 'success');
      } catch (err) {
        showNotification('Error al eliminar el acta. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingItem) {
        await actaEntregaAPI.update(editingItem.id, formData);
        showNotification('Acta de entrega actualizada exitosamente', 'success');
      } else {
        await actaEntregaAPI.create(formData);
        showNotification('Acta de entrega creada exitosamente', 'success');
      }

      // Recargar datos y esperar a que se completen
      await fetchActas();

      // Cerrar modal después de recargar datos
      setShowModal(false);
    } catch (err) {
      console.error('Error detallado:', err);
      let errorMessage = 'Error al guardar el acta. Por favor, verifica los datos e inténtalo de nuevo.';
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error;
      }
      showNotification(errorMessage, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Corregir permisos de 'inventory' a 'actas-entrega'
  const canCreate = checkPermission('actas-entrega', 'create');
  const canEdit = checkPermission('actas-entrega', 'edit');
  const canDelete = checkPermission('actas-entrega', 'delete');
  const canView = checkPermission('actas-entrega', 'view');

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

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] py-8 px-4">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#662d91] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Cargando actas de entrega...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] py-4 px-3 sm:py-6 sm:px-4 lg:px-8">
      <NotificationSystem
        notification={notification}
        onClose={() => setNotification(null)}
      />

      <ConfirmDialog
        confirmDialog={confirmDialog}
        onClose={() => setConfirmDialog(null)}
        onConfirm={handleConfirm}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 lg:gap-4 mb-3">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                  <FaClipboardCheck className="text-white text-xl lg:text-2xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight truncate">
                    Actas de Entrega
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Gestión de entregas y devoluciones de equipos corporativos · 2025
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg text-sm lg:text-base"
              >
                <FaFileExport className="w-4 h-4" />
                <span className="hidden sm:inline">Estadísticas</span>
              </button>
              {canCreate && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm lg:text-base"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Nueva Acta</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {showStats && (
          <StatsPanel
            showStats={showStats}
            stats={stats}
            statsConfig={[
              {
                key: 'total',
                label: 'Total Actas',
                description: 'Documentos registrados',
                icon: FaClipboardCheck,
                gradient: 'from-blue-500 to-blue-600',
                loading: loading
              },
              {
                key: 'entregados',
                label: 'Equipos Entregados',
                description: 'Actualmente en uso',
                icon: FaBox,
                gradient: 'from-green-500 to-green-600',
                loading: loading
              },
              {
                key: 'tasaDevolucion',
                label: 'Tasa Devolución',
                description: `${stats.devueltos} equipos devueltos`,
                icon: FaFileExport,
                gradient: 'from-[#662d91] to-[#8e4dbf]',
                loading: loading,
                formatter: (value) => `${value}%`
              },
              {
                key: 'computadoras',
                label: 'Computadoras',
                description: `${stats.celulares} celulares`,
                icon: FaBox,
                gradient: 'from-amber-500 to-orange-600',
                loading: loading
              }
            ]}
          />
        )}

        {/* Search and Filters */}
        <FilterPanel
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filters={[
            {
              label: 'Tipo de Equipo',
              value: filterTipo,
              onChange: setFilterTipo,
              type: 'select',
              options: [
                { value: 'inventory', label: 'Computadora/Laptop' },
                { value: 'corporate_phone', label: 'Teléfono Celular' }
              ]
            },
            {
              label: 'Estado',
              value: filterStatus,
              onChange: setFilterStatus,
              type: 'select',
              options: [
                { value: 'entregado', label: 'Entregado' },
                { value: 'devuelto', label: 'Devuelto' }
              ]
            }
          ]}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSortBy}
          onSortOrderChange={(order) => setSortOrder(order)}
          sortOptions={[
            { value: 'fecha_entrega', label: 'Fecha Entrega' },
            { value: 'tipo_equipo', label: 'Tipo Equipo' },
            { value: 'motivo_entrega', label: 'Motivo' }
          ]}
        />

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <p className="text-sm text-gray-600 font-medium">
            Mostrando <span className="font-bold text-[#662d91]">{filteredActas.length}</span> de <span className="font-bold">{actas.length}</span> actas
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-sm lg:text-base ${
                viewMode === 'cards'
                  ? 'bg-[#662d91] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FaBox className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Tarjetas</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-sm lg:text-base ${
                viewMode === 'table'
                  ? 'bg-[#662d91] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FaFileExport className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Tabla</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        {filteredActas.length === 0 ? (
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-gray-200 p-6 lg:p-12 text-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-linear-to-br from-[#f3ebf9] to-[#dbeafe] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClipboardCheck className="w-8 h-8 lg:w-10 lg:h-10 text-[#662d91]" />
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' || filterTipo !== 'all'
                ? 'No se encontraron actas'
                : 'No hay actas disponibles'}
            </h3>
            <p className="text-sm lg:text-base text-gray-600 max-w-md mx-auto mb-4 lg:mb-6">
              {searchTerm || filterStatus !== 'all' || filterTipo !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando la primera acta de entrega'}
            </p>
            {canCreate && !searchTerm && filterStatus === 'all' && filterTipo === 'all' && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 lg:px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base"
              >
                <FaPlus className="w-4 h-4" />
                Crear Primera Acta
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredActas.map((acta) => (
                  <ActaEntregaCard
                    key={acta.id}
                    acta={acta}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    canEdit={canEdit}
                    canDelete={canDelete}
                  />
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <ActaEntregaTable
                actas={filteredActas}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <ActaEntregaModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        formLoading={formLoading}
        onSubmit={handleSubmit}
        equiposDisponibles={equiposDisponibles}
        usuarios={usuarios}
      />

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ActasEntrega;