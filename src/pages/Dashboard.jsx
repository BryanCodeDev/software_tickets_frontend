import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import { dashboardAPI } from '../api';
import { FaTicketAlt, FaBox, FaFolder, FaFile, FaLock, FaChartLine, FaClock, FaExclamationTriangle, FaCheckCircle, FaUserClock, FaServer, FaShieldAlt, FaShoppingCart } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ tickets: 0, inventory: 0, documents: 0, credentials: 0, users: 0, qualityTickets: 0, regularTickets: 0, purchaseRequests: 0 });
  const [ticketStats, setTicketStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });
  const [qualityTicketStats, setQualityTicketStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await dashboardAPI.fetchStats();
      setStats({
        tickets: data.tickets,
        inventory: data.inventory,
        documents: data.documents,
        credentials: data.credentials,
        users: data.users,
        qualityTickets: data.qualityTickets || 0,
        regularTickets: data.regularTickets || 0,
        purchaseRequests: data.purchaseRequests || 0
      });

      // Estadísticas de tickets desglosadas (todos los tickets)
      if (data.ticketsByStatus) {
        setTicketStats({
          pending: data.ticketsByStatus.abierto || 0,
          inProgress: data.ticketsByStatus['en progreso'] || 0,
          resolved: data.ticketsByStatus.resuelto || 0
        });
      }

      // Estadísticas de tickets de calidad
      if (data.qualityTicketsByStatus) {
        setQualityTicketStats({
          pending: data.qualityTicketsByStatus.abierto || 0,
          inProgress: data.qualityTicketsByStatus['en progreso'] || 0,
          resolved: data.qualityTicketsByStatus.resuelto || 0
        });
      }

      setRecentActivity(data.recentActivity || []);
      setSystemHealth(data.systemHealth || {});
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, description, icon: Icon, gradient, textColor }) => (
    <div className={`p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${gradient}`}>
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold mb-1 truncate">{title}</h2>
          <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${loading ? 'animate-pulse' : ''}`}>
            {loading ? '...' : value}
          </p>
          <p className={`${textColor} text-xs sm:text-sm font-medium`}>{description}</p>
        </div>
        <div className="text-3xl sm:text-4xl lg:text-5xl opacity-20 ml-2 sm:ml-4 shrink-0">
          <Icon />
        </div>
      </div>
    </div>
  );

  const QuickStatCard = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`p-2 sm:p-3 rounded-lg ${color} shrink-0`}>
        <Icon className="text-white text-lg sm:text-xl" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{label}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">{loading ? '...' : value}</p>
      </div>
    </div>
  );

  const totalResources = stats.tickets + stats.inventory + stats.documents + stats.credentials + stats.purchaseRequests;
  const completionRate = stats.tickets > 0 ? Math.round(((ticketStats.resolved + ticketStats.pending + ticketStats.inProgress) > 0 ? (ticketStats.resolved / (ticketStats.resolved + ticketStats.pending + ticketStats.inProgress)) * 100 : 0)) : 0;
  const qualityCompletionRate = stats.qualityTickets > 0 ? Math.round(((qualityTicketStats.resolved + qualityTicketStats.pending + qualityTicketStats.inProgress) > 0 ? (qualityTicketStats.resolved / (qualityTicketStats.resolved + qualityTicketStats.pending + qualityTicketStats.inProgress)) * 100 : 0)) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Section */}
        <div className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] rounded-xl p-4 sm:p-6 lg:p-8 text-white shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Panel Principal</h1>
              <p className="text-base sm:text-lg lg:text-xl text-[#e8d5f5]">
                Bienvenido, <span className="font-semibold">{user?.name || 'Usuario'}</span>
              </p>
              <p className="text-xs sm:text-sm text-[#e8d5f5] mt-1">
                Rol: {user?.role?.name || 'Empleado'} • Sistema DuvyClass
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs sm:text-sm bg-white/20 px-3 py-2 lg:px-4 lg:py-2 rounded-lg backdrop-blur-sm w-fit">
              <FaClock className="text-[#e8d5f5] shrink-0" />
              <span className="truncate">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Tickets"
          value={stats.tickets}
          description="Gestionar solicitudes de IT"
          icon={FaTicketAlt}
          gradient="bg-gradient-to-br from-[#7a3da8] to-[#8e4dbf]"
          textColor="text-[#e8d5f5]"
        />

        <StatCard
          title="Calidad"
          value={stats.qualityTickets}
          description="Reportes de calidad y documentación"
          icon={FaShieldAlt}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          textColor="text-emerald-100"
        />

        <StatCard
          title="Solicitudes de Compra"
          value={stats.purchaseRequests}
          description="Periféricos y electrodomésticos"
          icon={FaShoppingCart}
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          textColor="text-orange-100"
        />

        <StatCard
          title="Inventario"
          value={stats.inventory}
          description="Activos tecnológicos"
          icon={FaBox}
          gradient="bg-gradient-to-br from-[#662d91] to-[#7a3da8]"
          textColor="text-[#e8d5f5]"
        />
        

         <StatCard
           title="Credenciales"
           value={stats.credentials}
           description="Cuentas de acceso"
           icon={FaLock}
           gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
           textColor="text-indigo-100"
         />
      </div>

        {/* Secondary Stats - Ticket Status */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
              <FaChartLine className="mr-2 text-[#662d91] shrink-0" />
              <span className="truncate">Estado de Tickets</span>
            </h2>
            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 sm:px-3 sm:py-1 rounded-full w-fit">
              Actualizado hace instantes
            </span>
          </div>

          {/* Tickets Normales */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <FaTicketAlt className="mr-2 text-[#662d91]" />
              Tickets de Soporte IT
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <QuickStatCard
                icon={FaExclamationTriangle}
                label="Pendientes"
                value={ticketStats.pending}
                color="bg-amber-500"
              />
              <QuickStatCard
                icon={FaUserClock}
                label="En Progreso"
                value={ticketStats.inProgress}
                color="bg-blue-500"
              />
              <QuickStatCard
                icon={FaCheckCircle}
                label="Resueltos"
                value={ticketStats.resolved}
                color="bg-green-500"
              />
            </div>
          </div>

          {/* Tickets de Calidad */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <FaShieldAlt className="mr-2 text-emerald-600" />
              Tickets de Calidad
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <QuickStatCard
                icon={FaExclamationTriangle}
                label="Pendientes"
                value={qualityTicketStats.pending}
                color="bg-amber-500"
              />
              <QuickStatCard
                icon={FaUserClock}
                label="En Progreso"
                value={qualityTicketStats.inProgress}
                color="bg-blue-500"
              />
              <QuickStatCard
                icon={FaCheckCircle}
                label="Resueltos"
                value={qualityTicketStats.resolved}
                color="bg-green-500"
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 sm:mt-6">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
              <span>Progreso del día</span>
              <span>{completionRate}% completado</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
      </div>

        {/* System Overview Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* System Info */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <FaServer className="mr-2 text-[#662d91] shrink-0" />
              <span className="truncate">Resumen del Sistema</span>
            </h2>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center p-2 sm:p-3 bg-linear-to-r from-[#f3ebf9] to-[#e8d5f5] rounded-lg border border-[#e8d5f5]">
                <span className="text-xs sm:text-sm text-gray-700 font-medium truncate">Total de Recursos</span>
                <span className="text-[#662d91] font-bold text-base sm:text-lg shrink-0">
                  {loading ? '...' : totalResources}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-700 font-medium truncate">Activos en Inventario</span>
                <span className="text-[#662d91] font-bold text-base sm:text-lg shrink-0">{loading ? '...' : stats.inventory}</span>
              </div>
              <div className="flex justify-between items-center p-2 sm:p-3 bg-emerald-50 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-700 font-medium truncate">Tickets de Calidad</span>
                <span className="text-emerald-600 font-bold text-base sm:text-lg shrink-0">{loading ? '...' : stats.qualityTickets}</span>
              </div>
              <div className="flex justify-between items-center p-2 sm:p-3 bg-orange-50 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-700 font-medium truncate">Solicitudes de Compra</span>
                <span className="text-orange-600 font-bold text-base sm:text-lg shrink-0">{loading ? '...' : stats.purchaseRequests}</span>
              </div>
              <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-700 font-medium truncate">Credenciales Seguras</span>
                <span className="text-indigo-500 font-bold text-base sm:text-lg shrink-0">{loading ? '...' : stats.credentials}</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <FaChartLine className="mr-2 text-green-600 shrink-0" />
              <span className="truncate">Métricas de Rendimiento</span>
            </h2>
            <div className="space-y-4">
              {/* Primera fila: Métricas de Tickets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">Tasa de Resolución</span>
                    <span className="text-xl sm:text-2xl font-bold text-green-600 shrink-0">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">Tickets Activos</span>
                    <span className="text-xl sm:text-2xl font-bold text-blue-600 shrink-0">
                      {loading ? '...' : ticketStats.pending + ticketStats.inProgress}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Pendientes y en progreso</p>
                </div>

                <div className="p-3 sm:p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">Calidad</span>
                    <span className="text-xl sm:text-2xl font-bold text-emerald-600 shrink-0">
                      {qualityCompletionRate}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Tasa resolución calidad</p>
                </div>
              </div>

              {/* Segunda fila: Métricas Generales */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">Usuarios Activos</span>
                    <span className="text-xl sm:text-2xl font-bold text-indigo-600 shrink-0">
                      {loading ? '...' : stats.users}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Total de usuarios registrados</p>
                </div>

                <div className="p-3 sm:p-4 bg-pink-50 rounded-lg border border-pink-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">Cobertura</span>
                    <span className="text-xl sm:text-2xl font-bold text-pink-600 shrink-0">
                      {stats.inventory > 0 ? Math.round((stats.inventory / stats.users) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Equipos por usuario</p>
                </div>

                <div className="p-3 sm:p-4 bg-[#f3ebf9] rounded-lg border border-[#e8d5f5]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">Eficiencia Global</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#662d91] shrink-0">
                      {completionRate}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Basado en tickets resueltos</p>
                </div>
              </div>
            </div>
        </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <FaShieldAlt className="mr-2 text-blue-600 shrink-0" />
              <span className="truncate">Estado del Sistema</span>
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">Base de Datos</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {systemHealth.database === 'online' ? 'Conexión estable' : 'Problemas de conexión'}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full animate-pulse shrink-0 ${systemHealth.database === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">API REST</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {systemHealth.api === 'online' ? 'Funcionando correctamente' : 'Servicios interrumpidos'}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full animate-pulse shrink-0 ${systemHealth.api === 'online' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-[#f3ebf9] rounded-lg border-l-4 border-[#662d91]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">Uptime del Sistema</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {systemHealth.uptime ? `${Math.floor(systemHealth.uptime / 3600)}h ${Math.floor((systemHealth.uptime % 3600) / 60)}m` : 'Calculando...'}
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-[#662d91] rounded-full animate-pulse shrink-0"></div>
                </div>
              </div>

              {user?.role?.name === 'Administrador' && (
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] rounded-lg text-white text-center">
                  <FaLock className="inline-block mr-2 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">Acceso Administrativo Activo</span>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;

