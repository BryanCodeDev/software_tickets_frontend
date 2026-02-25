import React, { useState, useEffect, useContext, useCallback, lazy, Suspense } from 'react';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaEye, FaSearch, FaFilter, FaDownload, FaChartBar, FaClock, FaExclamationTriangle, FaCheckCircle, FaSpinner, FaUserCircle, FaClipboardList, FaFileExport, FaSortAmountDown, FaSortAmountUp, FaArrowRight, FaCopy, FaUndo, FaShoppingCart } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

import AuthContext from '../../context/AuthContext';
import { purchaseRequestsAPI } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { useNotifications } from '../../hooks/useNotifications';
import { joinPurchaseRequestRoom, leavePurchaseRequestRoom, onPurchaseRequestUpdated, onPurchaseRequestCreated, onPurchaseRequestDeleted, onPurchaseRequestsListUpdated, offPurchaseRequestUpdated, offPurchaseRequestCreated, offPurchaseRequestDeleted, offPurchaseRequestsListUpdated } from '../../api/socket';
import {
  PurchaseRequestCard,
  PurchaseRequestStats
} from '../../components/PurchaseRequests';
import { ConfirmDialog } from '../../components/common';

// Lazy load modales pesados - solo se cargan cuando se necesitan
const PurchaseRequestCreateModal = lazy(() => import('../../components/PurchaseRequests/modals/PurchaseRequestCreateModal'));
const PurchaseRequestDetailModal = lazy(() => import('../../components/PurchaseRequests/modals/PurchaseRequestDetailModal'));
const PurchaseRequestEditModal = lazy(() => import('../../components/PurchaseRequests/modals/PurchaseRequestEditModal'));

// Componente de loading para modales
const ModalLoading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#662d91]"></div>
  </div>
);

const PurchaseRequests = () => {
  const { conditionalClasses } = useThemeClasses();
  const { notifySuccess, notifyError } = useNotifications();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterItemType, setFilterItemType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showPurchasesPanel, setShowPurchasesPanel] = useState(false);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('cards');

  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    itemType: 'periferico',
    description: '',
    quantity: 1,
    estimatedCost: '',
    justification: ''
  });

  const [confirmDialog, setConfirmDialog] = useState(null);
  const { user } = useContext(AuthContext);
  const { checkPermission } = useAuth();

  const userRole = user?.role?.name;
  const isPurchasesRole = userRole === 'Compras' || userRole === 'Administrador' || userRole === 'Coordinadora Administrativa' || userRole === 'Jefe';

  const fetchPurchaseRequests = useCallback(async () => {
    try {
      const data = await purchaseRequestsAPI.fetchPurchaseRequests({});
      setRequests(data.requests || []);
    } catch {
      notifyError('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  // Fetch dashboard stats for purchases role
  const fetchDashboardStats = useCallback(async () => {
    if (!isPurchasesRole) return;
    try {
      const data = await purchaseRequestsAPI.getPurchaseDashboardStats();
      setDashboardStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  }, [isPurchasesRole]);

  // WebSocket listeners
  useEffect(() => {
    if (selectedRequest) {
      joinPurchaseRequestRoom(selectedRequest.id);
      const handleUpdate = (updatedRequest) => setSelectedRequest(updatedRequest);
      onPurchaseRequestUpdated(handleUpdate);
      return () => {
        leavePurchaseRequestRoom(selectedRequest.id);
        offPurchaseRequestUpdated(handleUpdate);
      };
    }
  }, [selectedRequest]);

  useEffect(() => {
    fetchPurchaseRequests();
    fetchDashboardStats();
    const handleCreated = () => { fetchPurchaseRequests(); fetchDashboardStats(); };
    const handleDeleted = () => { fetchPurchaseRequests(); fetchDashboardStats(); };
    const handleListUpdated = () => { fetchPurchaseRequests(); fetchDashboardStats(); };
    onPurchaseRequestCreated(handleCreated);
    onPurchaseRequestDeleted(handleDeleted);
    onPurchaseRequestsListUpdated(handleListUpdated);
    return () => {
      offPurchaseRequestCreated(handleCreated);
      offPurchaseRequestDeleted(handleDeleted);
      offPurchaseRequestsListUpdated(handleListUpdated);
    };
  }, [fetchPurchaseRequests, fetchDashboardStats]);

  const filterAndSortRequests = useCallback(() => {
    if (!Array.isArray(requests)) return [];
    let filtered = [...requests];

    // Permission-based filtering
    if (!checkPermission('purchase_requests', 'view_all') && userRole !== 'Calidad') {
      filtered = filtered.filter(request => request.userId === user?.id);
    }

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requester?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(request => request.status?.toLowerCase() === filterStatus);
    }

    if (filterItemType !== 'all') {
      filtered = filtered.filter(request => request.itemType?.toLowerCase() === filterItemType);
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
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    return filtered;
  }, [requests, checkPermission, user, userRole, searchTerm, filterStatus, filterItemType, sortBy, sortOrder]);

  const filteredRequests = filterAndSortRequests();

  const calculateStats = () => {
    if (!Array.isArray(requests)) return { total: 0, solicitado: 0, pendienteCoordinadora: 0, aprobadoCoordinadora: 0, pendienteJefe: 0, aprobadoJefe: 0, enCompras: 0, completado: 0, rechazados: 0, paraCorreccion: 0 };

    const stats = {
      total: requests.length,
      solicitado: requests.filter(r => r.status === 'solicitado').length,
      pendienteCoordinadora: requests.filter(r => r.status === 'pendiente_coordinadora').length,
      aprobadoCoordinadora: requests.filter(r => r.status === 'aprobado_coordinadora').length,
      pendienteJefe: requests.filter(r => r.status === 'pendiente_jefe').length,
      aprobadoJefe: requests.filter(r => r.status === 'aprobado_jefe').length,
      enCompras: requests.filter(r => r.status === 'en_compras').length,
      completado: requests.filter(r => ['comprado', 'entregado'].includes(r.status)).length,
      rechazados: requests.filter(r => r.status === 'rechazado').length,
      paraCorreccion: requests.filter(r => r.status === 'rechazado_correccion').length
    };
    return stats;
  };

  const stats = calculateStats();

  const canCreate = ['Administrador', 'Técnico', 'Empleado', 'Jefe', 'Coordinadora Administrativa', 'Calidad'].includes(userRole);

  // Actions
  const handleViewDetail = async (request) => {
    setSelectedRequest(request);
    try {
      const data = await purchaseRequestsAPI.fetchPurchaseRequestById(request.id);
      setSelectedRequest(data);
    } catch (err) {
      if (err.response?.status === 403) {
        notifyError('No tienes permisos');
        return;
      }
      notifyError('Error al cargar detalles');
    }
    setShowDetailModal(true);
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setShowEditModal(true);
  };

  const handleDelete = async (request) => {
    showConfirmDialog(
      '¿Eliminar esta solicitud?',
      async () => {
        try {
          await purchaseRequestsAPI.deletePurchaseRequest(request.id);
          notifySuccess('Solicitud eliminada');
          fetchPurchaseRequests();
        } catch {
          notifyError('Error al eliminar');
        }
      }
    );
  };

  const handleDuplicate = () => {
    notifySuccess('Solicitud duplicada exitosamente');
    fetchPurchaseRequests();
  };

  // Función para exportar a Excel - importa XLSX solo cuando se necesita
  const exportToExcel = async () => {
    try {
      // Import dinámico de XLSX - solo se carga cuando el usuario hace clic en exportar
      const XLSX = await import('xlsx');
      
      const headers = ['ID', 'Título', 'Tipo', 'Estado', 'Costo', 'Solicitante', 'Fecha', 'Rechazos'];
      const rows = filteredRequests.map(r => [
        r.id, r.title, r.itemType, r.status, r.estimatedCost, r.requester?.name, new Date(r.createdAt).toLocaleDateString(), r.rejectionCount || 0
      ]);
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      ws['!cols'] = [{ wch: 8 }, { wch: 30 }, { wch: 15 }, { wch: 20 }, { wch: 12 }, { wch: 20 }, { wch: 12 }, { wch: 10 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Solicitudes');
      XLSX.writeFile(wb, `solicitudes_compra_${new Date().toISOString().split('T')[0]}.xlsx`);
      notifySuccess('Exportado exitosamente');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      notifyError('Error al exportar a Excel');
    }
  };

  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  // Panel de Compras
  const PurchasesPanel = () => {
    if (!dashboardStats) return null;

    const statCards = [
      { label: 'Pendiente Coordinadora', value: dashboardStats.summary?.pendingCoordinator || 0, color: 'yellow', icon: FaClock },
      { label: 'Pendiente Jefe', value: dashboardStats.summary?.pendingManager || 0, color: 'purple', icon: FaClock },
      { label: 'En Compras', value: dashboardStats.summary?.inPurchases || 0, color: 'cyan', icon: FaShoppingCart },
      { label: 'Comprados', value: dashboardStats.summary?.purchased || 0, color: 'teal', icon: FaCheck },
      { label: 'Entregados', value: dashboardStats.summary?.delivered || 0, color: 'green', icon: FaCheckCircle },
      { label: 'Para Corrección', value: dashboardStats.summary?.rejectedCorrection || 0, color: 'amber', icon: FaUndo }
    ];

    return (
      <div className={conditionalClasses({ light: 'bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 mb-6', dark: 'bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-700 p-6 mb-6' })}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={conditionalClasses({ light: 'text-xl font-bold text-gray-900', dark: 'text-xl font-bold text-gray-100' })}>
            Panel de Compras
          </h2>
          <button onClick={fetchDashboardStats} className={conditionalClasses({ light: 'p-2 text-gray-500 hover:bg-gray-100 rounded-lg', dark: 'p-2 text-gray-400 hover:bg-gray-700 rounded-lg' })}>
            <FaSpinner className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {statCards.map((stat, idx) => (
            <div key={idx} className={conditionalClasses({
              light: `p-4 rounded-xl bg-gray-50 border border-gray-200`,
              dark: `p-4 rounded-xl bg-gray-700 border border-gray-600`
            })}>
              <div className={conditionalClasses({
                light: `w-8 h-8 rounded-full flex items-center justify-center mb-2 bg-${stat.color}-100`,
                dark: `w-8 h-8 rounded-full flex items-center justify-center mb-2 bg-${stat.color}-900/50`
              })}>
                <stat.icon className={conditionalClasses({
                  light: `w-4 h-4 text-${stat.color}-600`,
                  dark: `w-4 h-4 text-${stat.color}-400`
                })} />
              </div>
              <p className={conditionalClasses({
                light: 'text-2xl font-bold text-gray-900',
                dark: 'text-2xl font-bold text-gray-100'
              })}>{stat.value}</p>
              <p className={conditionalClasses({
                light: 'text-xs text-gray-500',
                dark: 'text-xs text-gray-400'
              })}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Requests */}
          <div>
            <h3 className={conditionalClasses({ light: 'text-lg font-bold text-gray-900 mb-4', dark: 'text-lg font-bold text-gray-100 mb-4' })}>Solicitudes Recientes</h3>
            <div className="space-y-3">
              {dashboardStats.recentRequests?.slice(0, 5).map((req) => (
                <div key={req.id} className={conditionalClasses({
                  light: 'p-3 bg-gray-50 rounded-lg border border-gray-200',
                  dark: 'p-3 bg-gray-700 rounded-lg border border-gray-600'
                })}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={conditionalClasses({ light: 'font-bold text-[#662d91]', dark: 'font-bold text-purple-400' })}>#{req.id}</span>
                      <p className={conditionalClasses({ light: 'text-sm font-medium text-gray-900 truncate max-w-xs', dark: 'text-sm font-medium text-gray-100 truncate max-w-xs' })}>{req.title}</p>
                    </div>
                    <button onClick={() => handleViewDetail(req)} className={conditionalClasses({ light: 'p-2 text-blue-600 hover:bg-blue-50 rounded-lg', dark: 'p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg' })}>
                      <FaEye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart by Type */}
          <div>
            <h3 className={conditionalClasses({ light: 'text-lg font-bold text-gray-900 mb-4', dark: 'text-lg font-bold text-gray-100 mb-4' })}>Por Tipo de Ítem</h3>
            <Bar
              data={{
                labels: Object.keys(dashboardStats.byType || {}).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
                datasets: [{
                  label: 'Solicitudes',
                  data: Object.values(dashboardStats.byType || {}),
                  backgroundColor: ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef']
                }]
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={conditionalClasses({ light: 'min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe]', dark: 'min-h-screen bg-gray-900' })}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#662d91] mx-auto mb-4"></div>
            <p className={conditionalClasses({ light: 'text-gray-600', dark: 'text-gray-300' })}>Cargando solicitudes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={conditionalClasses({
      light: 'min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] py-2 px-2 sm:py-4 sm:px-3 lg:py-6 lg:px-8',
      dark: 'min-h-screen bg-gray-900 py-2 px-2 sm:py-4 sm:px-3 lg:py-6 lg:px-8'
    })}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-xl flex items-center justify-center shadow-xl">
                <FaShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={conditionalClasses({ light: 'text-2xl font-bold text-gray-900', dark: 'text-2xl font-bold text-white' })}>
                  Solicitudes de Compra
                </h1>
                <p className={conditionalClasses({ light: 'text-sm text-gray-600', dark: 'text-sm text-gray-400' })}>
                  Gestión de solicitudes de periféricos y suministros
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isPurchasesRole && (
                <button onClick={() => setShowPurchasesPanel(!showPurchasesPanel)} className={conditionalClasses({
                  light: 'flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-200',
                  dark: 'flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg border-2 border-gray-600'
                })}>
                  <FaChartBar className="w-4 h-4" />
                  {showPurchasesPanel ? 'Ocultar Panel' : 'Panel Compras'}
                </button>
              )}
              {(checkPermission('purchase_requests', 'view_stats') || isPurchasesRole) && (
                <button onClick={() => setShowStats(!showStats)} className={conditionalClasses({
                  light: 'flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-200',
                  dark: 'flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg border-2 border-gray-600'
                })}>
                  <FaChartBar className="w-4 h-4" />
                  Estadísticas
                </button>
              )}
              <button onClick={exportToExcel} className={conditionalClasses({
                light: 'flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-200',
                dark: 'flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg border-2 border-gray-600'
              })}>
                <FaDownload className="w-4 h-4" />
                Exportar
              </button>
              {canCreate && (
                <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#662d91] hover:bg-[#7a3da8] text-white font-bold rounded-lg shadow-lg">
                  <FaPlus className="w-4 h-4" />
                  Nueva
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Purchases Panel */}
        {showPurchasesPanel && <PurchasesPanel />}

        {/* Stats */}
        {showStats && <PurchaseRequestStats stats={stats} userRole={userRole} />}

        {/* Search & Filters */}
        <div className={conditionalClasses({ light: 'bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4 lg:p-6 mb-6', dark: 'bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-700 p-4 lg:p-6 mb-6' })}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={conditionalClasses({
                  light: 'w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] outline-none bg-white text-gray-900',
                  dark: 'w-full pl-12 pr-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#662d91] outline-none bg-gray-700 text-white'
                })} />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className={conditionalClasses({
                light: `flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold min-w-30 ${showFilters ? 'bg-[#662d91] text-white' : 'bg-gray-100 text-gray-700'}`,
                dark: `flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold min-w-30 ${showFilters ? 'bg-[#662d91] text-white' : 'bg-gray-700 text-gray-300'}`
              })}>
                <FaFilter className="w-4 h-4" />
                Filtros
              </button>
            </div>

            {showFilters && (
              <div className={conditionalClasses({ light: 'grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100', dark: 'grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-600' })}>
                <div>
                  <label className={conditionalClasses({ light: 'block text-sm font-semibold text-gray-700 mb-2', dark: 'block text-sm font-semibold text-gray-300 mb-2' })}>Estado</label>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={conditionalClasses({
                    light: 'w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] outline-none bg-white text-gray-900',
                    dark: 'w-full px-4 py-2.5 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#662d91] outline-none bg-gray-700 text-white'
                  })}>
                    <option value="all">Todos</option>
                    <option value="solicitado">Solicitado</option>
                    <option value="pendiente_coordinadora">Pendiente Coordinadora</option>
                    <option value="aprobado_coordinadora">Aprobado Coord.</option>
                    <option value="pendiente_jefe">Pendiente Jefe</option>
                    <option value="aprobado_jefe">Aprobado Jefe</option>
                    <option value="en_compras">En Compras</option>
                    <option value="comprado">Comprado</option>
                    <option value="entregado">Entregado</option>
                    <option value="rechazado">Rechazado</option>
                    <option value="rechazado_correccion">Para Corrección</option>
                  </select>
                </div>
                <div>
                  <label className={conditionalClasses({ light: 'block text-sm font-semibold text-gray-700 mb-2', dark: 'block text-sm font-semibold text-gray-300 mb-2' })}>Tipo</label>
                  <select value={filterItemType} onChange={(e) => setFilterItemType(e.target.value)} className={conditionalClasses({
                    light: 'w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] outline-none bg-white text-gray-900',
                    dark: 'w-full px-4 py-2.5 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#662d91] outline-none bg-gray-700 text-white'
                  })}>
                    <option value="all">Todos</option>
                    <option value="periferico">Periférico</option>
                    <option value="electrodomestico">Electrodoméstico</option>
                    <option value="software">Software</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className={conditionalClasses({ light: 'block text-sm font-semibold text-gray-700 mb-2', dark: 'block text-sm font-semibold text-gray-300 mb-2' })}>Ordenar</label>
                  <div className="flex gap-2">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={conditionalClasses({
                      light: 'flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] outline-none bg-white text-gray-900',
                      dark: 'flex-1 px-3 py-2.5 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#662d91] outline-none bg-gray-700 text-white'
                    })}>
                      <option value="createdAt">Fecha creación</option>
                      <option value="updatedAt">Última actualización</option>
                      <option value="estimatedCost">Costo</option>
                      <option value="status">Estado</option>
                    </select>
                    <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className={conditionalClasses({
                      light: 'px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl',
                      dark: 'px-3 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl'
                    })}>
                      {sortOrder === 'asc' ? <FaSortAmountDown className="w-4 h-4" /> : <FaSortAmountUp className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-3">
          <p className={conditionalClasses({ light: 'text-sm text-gray-600', dark: 'text-sm text-gray-400' })}>
            Mostrando <span className="font-bold text-[#662d91]">{filteredRequests.length}</span> de <span className="font-bold">{requests.length}</span> solicitudes
          </p>
          <div className="flex gap-2">
            <button onClick={() => setViewMode('cards')} className={`px-3 py-2 rounded-lg text-sm ${viewMode === 'cards' ? 'bg-[#662d91] text-white' : conditionalClasses({ light: 'bg-white text-gray-600', dark: 'bg-gray-800 text-gray-400' })}`}>
              <FaClipboardList className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-2 rounded-lg text-sm ${viewMode === 'list' ? 'bg-[#662d91] text-white' : conditionalClasses({ light: 'bg-white text-gray-600', dark: 'bg-gray-800 text-gray-400' })}`}>
              <FaChartBar className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {filteredRequests.length === 0 ? (
          <div className={conditionalClasses({ light: 'bg-white rounded-xl shadow-lg border-2 border-gray-200 p-12 text-center', dark: 'bg-gray-800 rounded-xl shadow-lg border-2 border-gray-700 p-12 text-center' })}>
            <FaClipboardList className="w-16 h-16 text-[#662d91] mx-auto mb-4" />
            <h3 className={conditionalClasses({ light: 'text-xl font-bold text-gray-900 mb-2', dark: 'text-xl font-bold text-gray-100 mb-2' })}>
              {searchTerm || filterStatus !== 'all' ? 'No se encontraron solicitudes' : 'No hay solicitudes'}
            </h3>
            <p className={conditionalClasses({ light: 'text-gray-600 mb-4', dark: 'text-gray-400 mb-4' })}>
              {searchTerm || filterStatus !== 'all' ? 'Ajusta los filtros de búsqueda' : 'Crea una nueva solicitud de compra'}
            </p>
            {canCreate && (
              <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-[#662d91] hover:bg-[#7a3da8] text-white font-bold rounded-xl">
                <FaPlus className="w-4 h-4" />
                Nueva Solicitud
              </button>
            )}
          </div>
        ) : (
          <div className={conditionalClasses({ light: 'bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4 lg:p-6', dark: 'bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-700 p-4 lg:p-6' })}>
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRequests.map((request) => (
                  <PurchaseRequestCard key={request.id} request={request} onViewDetail={handleViewDetail} onEdit={handleEdit} onDelete={handleDelete} user={user} userRole={userRole} />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#662d91] text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase">Título</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase">Costo</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase">Solicitante</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className={conditionalClasses({ light: 'divide-y divide-gray-200', dark: 'divide-y divide-gray-600' })}>
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className={conditionalClasses({ light: 'hover:bg-gray-50', dark: 'hover:bg-gray-700/50' })}>
                        <td className="px-4 py-4 font-bold text-[#662d91]">#{request.id}</td>
                        <td className="px-4 py-4">
                          <p className={conditionalClasses({ light: 'font-semibold text-gray-900', dark: 'font-semibold text-white' })}>{request.title}</p>
                          <p className={conditionalClasses({ light: 'text-xs text-gray-500 truncate max-w-xs', dark: 'text-xs text-gray-400 truncate max-w-xs' })}>{request.description}</p>
                        </td>
                        <td className={conditionalClasses({ light: 'px-4 py-4 text-gray-700 capitalize', dark: 'px-4 py-4 text-gray-300 capitalize' })}>{request.itemType}</td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${['solicitado'].includes(request.status) ? 'bg-blue-100 text-blue-700' : ['pendiente_coordinadora'].includes(request.status) ? 'bg-yellow-100 text-yellow-700' : ['pendiente_jefe'].includes(request.status) ? 'bg-purple-100 text-purple-700' : ['aprobado_jefe', 'aprobado_coordinadora'].includes(request.status) ? 'bg-indigo-100 text-indigo-700' : ['en_compras'].includes(request.status) ? 'bg-cyan-100 text-cyan-700' : ['comprado'].includes(request.status) ? 'bg-teal-100 text-teal-700' : ['entregado'].includes(request.status) ? 'bg-green-100 text-green-700' : ['rechazado_correccion'].includes(request.status) ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {request.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className={conditionalClasses({ light: 'px-4 py-4 text-gray-700 font-medium', dark: 'px-4 py-4 text-gray-300 font-medium' })}>${request.estimatedCost}</td>
                        <td className={conditionalClasses({ light: 'px-4 py-4 text-gray-700', dark: 'px-4 py-4 text-gray-300' })}>{request.requester?.name || '-'}</td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleViewDetail(request)} className={conditionalClasses({ light: 'p-2 text-blue-600 hover:bg-blue-50 rounded-lg', dark: 'p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg' })}>
                              <FaEye className="w-4 h-4" />
                            </button>
                            {canCreate && (
                              <button onClick={() => handleEdit(request)} className={conditionalClasses({ light: 'p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg', dark: 'p-2 text-yellow-400 hover:bg-yellow-900/30 rounded-lg' })}>
                                <FaEdit className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modals - Lazy loaded */}
        <Suspense fallback={null}>
          {showDetailModal && <PurchaseRequestDetailModal showDetailModal={showDetailModal} setShowDetailModal={setShowDetailModal} selectedRequest={selectedRequest} user={user} onDuplicate={handleDuplicate} onSuccess={notifySuccess} />}
          {showCreateModal && <PurchaseRequestCreateModal showCreateModal={showCreateModal} setShowCreateModal={setShowCreateModal} formData={formData} setFormData={setFormData} userRole={userRole} onSuccess={(msg) => { notifySuccess(msg); fetchPurchaseRequests(); fetchDashboardStats(); }} />}
          {showEditModal && <PurchaseRequestEditModal showEditModal={showEditModal} setShowEditModal={setShowEditModal} editingRequest={editingRequest} onSuccess={(msg) => { notifySuccess(msg); fetchPurchaseRequests(); fetchDashboardStats(); }} />}
        </Suspense>

        {/* Confirm Dialog */}
        {confirmDialog && (
          <ConfirmDialog confirmDialog={confirmDialog} onClose={() => setConfirmDialog(null)} onConfirm={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }} />
        )}
      </div>
    </div>
  );
};

export default PurchaseRequests;
