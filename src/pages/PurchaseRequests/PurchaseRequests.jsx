import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaEye, FaSearch, FaFilter, FaDownload, FaChartBar, FaClock, FaExclamationTriangle, FaCheckCircle, FaSpinner, FaUserCircle, FaClipboardList, FaFileExport, FaSortAmountDown, FaSortAmountUp, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
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
import { purchaseRequestsAPI } from '../../api';
import { joinPurchaseRequestRoom, leavePurchaseRequestRoom, onPurchaseRequestUpdated, onPurchaseRequestCreated, onPurchaseRequestDeleted, onPurchaseRequestsListUpdated, offPurchaseRequestUpdated, offPurchaseRequestCreated, offPurchaseRequestDeleted, offPurchaseRequestsListUpdated } from '../../api/socket';
import {
  PurchaseRequestCreateModal,
  PurchaseRequestDetailModal,
  PurchaseRequestEditModal,
  PurchaseRequestCard,
  PurchaseRequestStats
} from '../../components/PurchaseRequests';
import { ConfirmDialog } from '../../components/common';
import { getTimeAgo } from '../../utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PurchaseRequests = () => {
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
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('cards');

  const [formData, setFormData] = useState({
    title: '',
    itemType: 'periferico',
    description: '',
    quantity: 1,
    estimatedCost: '',
    justification: ''
  });

  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { user } = useContext(AuthContext);

  const userRole = user?.role?.name;

  // WebSocket listeners for real-time updates
  useEffect(() => {
    if (selectedRequest) {
      joinPurchaseRequestRoom(selectedRequest.id);

      const handlePurchaseRequestUpdated = (updatedRequest) => {
        setSelectedRequest(updatedRequest);
      };

      onPurchaseRequestUpdated(handlePurchaseRequestUpdated);

      return () => {
        leavePurchaseRequestRoom(selectedRequest.id);
        offPurchaseRequestUpdated(handlePurchaseRequestUpdated);
      };
    }
  }, [selectedRequest]);

  useEffect(() => {
    fetchPurchaseRequests();

    const handlePurchaseRequestCreated = (newRequest) => {
      fetchPurchaseRequests();
    };

    const handlePurchaseRequestDeleted = (data) => {
      fetchPurchaseRequests();
    };

    const handlePurchaseRequestsListUpdated = () => {
      fetchPurchaseRequests();
    };

    onPurchaseRequestCreated(handlePurchaseRequestCreated);
    onPurchaseRequestDeleted(handlePurchaseRequestDeleted);
    onPurchaseRequestsListUpdated(handlePurchaseRequestsListUpdated);

    return () => {
      offPurchaseRequestCreated(handlePurchaseRequestCreated);
      offPurchaseRequestDeleted(handlePurchaseRequestDeleted);
      offPurchaseRequestsListUpdated(handlePurchaseRequestsListUpdated);
    };
  }, []);

  const fetchPurchaseRequests = async () => {
    try {
      const data = await purchaseRequestsAPI.fetchPurchaseRequests({});
      setRequests(data.requests || []);
    } catch (err) {
      showNotification('Error al cargar las solicitudes de compra. Por favor, recarga la página.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRequests = () => {
    if (!Array.isArray(requests)) return [];
    let filtered = [...requests];

    // Role-based filtering
    if (userRole === 'Coordinadora Administrativa') {
      // Coordinadora solo ve solicitudes pendientes de su aprobación
      filtered = filtered.filter(request =>
        ['solicitado', 'pendiente_coordinadora'].includes(request.status?.toLowerCase())
      );
    } else if (userRole === 'Jefe') {
      // Jefe ve solicitudes aprobadas por coordinadora y pendientes de su aprobación
      filtered = filtered.filter(request =>
        ['aprobado_coordinadora', 'pendiente_jefe'].includes(request.status?.toLowerCase())
      );
    } else if (userRole === 'Compras') {
      // Compras ve solicitudes aprobadas por jefe y en proceso de compra
      filtered = filtered.filter(request =>
        ['aprobado_jefe', 'en_compras', 'comprado'].includes(request.status?.toLowerCase())
      );
    } else if (!['Administrador', 'Técnico'].includes(userRole)) {
      // Otros roles solo ven sus propias solicitudes
      filtered = filtered.filter(request => request.userId === user?.id);
    }
    // Administrador y Técnico ven todas las solicitudes

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

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredRequests = filterAndSortRequests();

  const calculateStats = () => {
    if (!Array.isArray(requests)) return { total: 0, solicitado: 0, aprobadoCoordinadora: 0, aprobadoJefe: 0, enCompras: 0, completado: 0 };

    // Role-based stats
    if (userRole === 'Coordinadora Administrativa') {
      const pendientes = requests.filter(r => ['solicitado', 'pendiente_coordinadora'].includes(r.status?.toLowerCase())).length;
      const aprobados = requests.filter(r => r.status?.toLowerCase() === 'aprobado_coordinadora').length;
      const rechazados = requests.filter(r => r.status?.toLowerCase() === 'rechazado').length;
      return { pendientes, aprobados, rechazados };
    } else if (userRole === 'Jefe') {
      const pendientes = requests.filter(r => ['aprobado_coordinadora', 'pendiente_jefe'].includes(r.status?.toLowerCase())).length;
      const aprobados = requests.filter(r => r.status?.toLowerCase() === 'aprobado_jefe').length;
      const rechazados = requests.filter(r => r.status?.toLowerCase() === 'rechazado').length;
      return { pendientes, aprobados, rechazados };
    } else if (userRole === 'Compras') {
      const enProceso = requests.filter(r => ['aprobado_jefe', 'en_compras'].includes(r.status?.toLowerCase())).length;
      const comprados = requests.filter(r => r.status?.toLowerCase() === 'comprado').length;
      const entregados = requests.filter(r => r.status?.toLowerCase() === 'entregado').length;
      return { enProceso, comprados, entregados };
    } else {
      // Admin/Técnico/Empleado - todas las estadísticas
      const total = requests.length;
      const solicitado = requests.filter(r => r.status?.toLowerCase() === 'solicitado').length;
      const aprobadoCoordinadora = requests.filter(r => r.status?.toLowerCase() === 'aprobado_coordinadora').length;
      const aprobadoJefe = requests.filter(r => r.status?.toLowerCase() === 'aprobado_jefe').length;
      const enCompras = requests.filter(r => r.status?.toLowerCase() === 'en_compras').length;
      const completado = requests.filter(r =>
        r.status?.toLowerCase() === 'comprado' || r.status?.toLowerCase() === 'entregado'
      ).length;

      return { total, solicitado, aprobadoCoordinadora, aprobadoJefe, enCompras, completado };
    }
  };

  const stats = calculateStats();

  const getStatusColor = (status) => {
    const colors = {
      'solicitado': 'bg-blue-100 text-blue-700 border-blue-200',
      'pendiente_coordinadora': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'aprobado_coordinadora': 'bg-orange-100 text-orange-700 border-orange-200',
      'pendiente_jefe': 'bg-[#f3ebf9] text-[#662d91] border-[#e8d5f5]',
      'aprobado_jefe': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'en_compras': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'comprado': 'bg-teal-100 text-teal-700 border-teal-200',
      'entregado': 'bg-green-100 text-green-700 border-green-200',
      'rechazado': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'solicitado':
      case 'pendiente_coordinadora': return <FaClock />;
      case 'aprobado_coordinadora':
      case 'aprobado_jefe': return <FaCheck />;
      case 'en_compras':
      case 'comprado': return <FaArrowRight />;
      case 'entregado': return <FaCheckCircle />;
      case 'rechazado': return <FaTimes />;
      default: return <FaClock />;
    }
  };

  const handleCreate = () => {
    setFormData({
      title: '',
      itemType: 'periferico',
      description: '',
      quantity: 1,
      estimatedCost: '',
      justification: ''
    });
    setShowCreateModal(true);
  };





  const handleViewDetail = async (request) => {
    setSelectedRequest(request);
    try {
      const data = await purchaseRequestsAPI.fetchPurchaseRequestById(request.id);
      setSelectedRequest(data);
    } catch (err) {
      if (err.response?.status === 403) {
        showNotification('No tienes permisos para ver los detalles de esta solicitud', 'error');
        return;
      }
      showNotification('Error al cargar los detalles de la solicitud.', 'error');
    }
    setShowDetailModal(true);
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setShowEditModal(true);
  };

  const handleDelete = async (request) => {
    showConfirmDialog(
      '¿Estás seguro de que deseas eliminar esta solicitud de compra? Esta acción no se puede deshacer.',
      async () => {
        try {
          await purchaseRequestsAPI.deletePurchaseRequest(request.id);
          showNotification('Solicitud eliminada exitosamente', 'success');
          fetchPurchaseRequests();
        } catch (err) {
          showNotification('Error al eliminar la solicitud', 'error');
        }
      }
    );
  };

  const exportToExcel = () => {
    const headers = ['ID', 'Título', 'Tipo', 'Estado', 'Costo Estimado', 'Solicitante', 'Fecha Creación'];
    const rows = filteredRequests.map(request => [
      request.id,
      request.title,
      request.itemType,
      request.status,
      request.estimatedCost,
      request.requester?.name || '-',
      new Date(request.createdAt).toLocaleDateString('es-ES')
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SolicitudesCompra');

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

    ws['!cols'] = [
      { wch: 8 },  // ID
      { wch: 25 }, // Título
      { wch: 15 }, // Tipo
      { wch: 20 }, // Estado
      { wch: 15 }, // Costo
      { wch: 15 }, // Solicitante
      { wch: 15 }  // Fecha
    ];

    XLSX.writeFile(wb, `solicitudes_compra_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('Solicitudes exportadas exitosamente', 'success');
  };

  const canCreate = ['Administrador', 'Técnico', 'Empleado', 'Jefe', 'Coordinadora Administrativa'].includes(userRole);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#662d91] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Cargando solicitudes de compra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] py-2 px-2 sm:py-4 sm:px-3 lg:py-6 lg:px-8">
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

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight truncate">
                    Solicitudes de Compra
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                    Gestión de solicitudes de periféricos y electrodomésticos
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {(userRole === 'Administrador' || userRole === 'Técnico') && (
                <>
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 lg:py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg sm:rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg text-xs sm:text-sm lg:text-base"
                  >
                    <FaChartBar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Estadísticas</span>
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 lg:py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg sm:rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg text-xs sm:text-sm lg:text-base"
                  >
                    <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Exportar</span>
                  </button>
                </>
              )}
              {canCreate && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 lg:py-2.5 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm lg:text-base"
                >
                  <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Nueva</span>
                  <span className="sm:hidden">Nueva</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {showStats && <PurchaseRequestStats stats={stats} userRole={userRole} />}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4 lg:p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por título, descripción o solicitante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-gray-700 font-medium text-sm lg:text-base"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-4 lg:px-6 py-3 rounded-xl font-semibold transition-all duration-200 min-w-[120px] ${
                  showFilters
                    ? 'bg-[#662d91] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaFilter className="w-4 h-4" />
                <span>Filtros</span>
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t-2 border-gray-100 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="solicitado">Solicitado</option>
                    <option value="pendiente_coordinadora">Pendiente Coordinadora</option>
                    <option value="aprobado_coordinadora">Aprobado Coordinadora</option>
                    <option value="pendiente_jefe">Pendiente Jefe</option>
                    <option value="aprobado_jefe">Aprobado Jefe</option>
                    <option value="en_compras">En Compras</option>
                    <option value="comprado">Comprado</option>
                    <option value="entregado">Entregado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Ítem</label>
                  <select
                    value={filterItemType || 'all'}
                    onChange={(e) => setFilterItemType(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm"
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="periferico">Periférico</option>
                    <option value="electrodomestico">Electrodoméstico</option>
                    <option value="software">Software</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ordenar por</label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 px-3 lg:px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm"
                    >
                      <option value="createdAt">Fecha creación</option>
                      <option value="updatedAt">Última actualización</option>
                      <option value="estimatedCost">Costo estimado</option>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            Mostrando <span className="font-bold text-[#662d91]">{filteredRequests.length}</span> de <span className="font-bold">{requests.length}</span> solicitudes
          </p>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2 sm:px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm lg:text-base ${
                viewMode === 'cards'
                  ? 'bg-[#662d91] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FaClipboardList className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1 sm:ml-2">Tarjetas</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2 sm:px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm lg:text-base ${
                viewMode === 'list'
                  ? 'bg-[#662d91] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FaChartBar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1 sm:ml-2">Lista</span>
            </button>
          </div>
        </div>

        {/* Purchase Requests Display */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-gray-200 p-6 lg:p-12 text-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-linear-to-br from-[#f3ebf9] to-[#e8d5f5] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClipboardList className="w-8 h-8 lg:w-10 lg:h-10 text-[#662d91]" />
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all'
                ? 'No se encontraron solicitudes'
                : 'No hay solicitudes disponibles'}
            </h3>
            <p className="text-sm lg:text-base text-gray-600 max-w-md mx-auto mb-4 lg:mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando una nueva solicitud de compra'}
            </p>
            {canCreate && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 lg:px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base"
              >
                <FaPlus className="w-4 h-4" />
                Nueva Solicitud
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-3 sm:p-4 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {filteredRequests.map((request) => (
                    <PurchaseRequestCard
                      key={request.id}
                      request={request}
                      onViewDetail={handleViewDetail}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      userRole={userRole}
                      user={user}
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
                    {filteredRequests.map((request) => (
                      <div key={request.id} className="p-4 hover:bg-[#f3ebf9] transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-[#662d91]">#{request.id}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{request.title}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2">{request.description}</p>
                          </div>
                          <button
                            onClick={() => handleViewDetail(request)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-manipulation"
                            title="Ver detalles"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">Tipo:</span>
                            <p className="capitalize">{request.itemType}</p>
                          </div>
                          <div>
                            <span className="font-medium">Costo:</span>
                            <p>${request.estimatedCost}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Solicitante:</span>
                            <p className="truncate">{request.requester?.name || 'Usuario'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <table className="w-full">
                    <thead className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] text-white">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">ID</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">Título</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">Tipo</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">Estado</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">Costo</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">Solicitante</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">Fecha</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-[#f3ebf9] transition-colors">
                          <td className="px-4 py-4">
                            <span className="font-bold text-[#662d91]">#{request.id}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-gray-900">{request.title}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">{request.description}</div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 capitalize">
                            {request.itemType}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              {request.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            ${request.estimatedCost}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {request.requester?.name || 'Usuario'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {getTimeAgo(request.updatedAt)}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleViewDetail(request)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-manipulation"
                              title="Ver detalles"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </>
        )}

        {/* Modals - Always rendered */}
        <PurchaseRequestDetailModal
          showDetailModal={showDetailModal}
          setShowDetailModal={setShowDetailModal}
          selectedRequest={selectedRequest}
          user={user}
        />

        <PurchaseRequestCreateModal
          showCreateModal={showCreateModal}
          setShowCreateModal={setShowCreateModal}
          formData={formData}
          setFormData={setFormData}
          userRole={userRole}
          onSuccess={(message, type = 'success') => {
            showNotification(message, type);
            if (type === 'success') {
              fetchPurchaseRequests(); // Refrescar la lista
            }
          }}
        />

        <PurchaseRequestEditModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          editingRequest={editingRequest}
          onSuccess={(message, type = 'success') => {
            showNotification(message, type);
            if (type === 'success') {
              fetchPurchaseRequests(); // Refrescar la lista
            }
          }}
        />

        {/* Confirm Dialog */}
        {confirmDialog && (
          <ConfirmDialog
            confirmDialog={confirmDialog}
            onClose={() => setConfirmDialog(null)}
            onConfirm={() => {
              if (confirmDialog?.onConfirm) confirmDialog.onConfirm();
              setConfirmDialog(null);
            }}
          />
        )}
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

export default PurchaseRequests;


