import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import { dashboardAPI } from '../api';
import { FaTicketAlt, FaBox, FaFolder, FaFile, FaLock, FaChartLine, FaClock, FaExclamationTriangle, FaCheckCircle, FaUserClock, FaServer, FaShieldAlt } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ tickets: 0, inventory: 0, documents: 0 });
  const [ticketStats, setTicketStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const stats = await dashboardAPI.fetchStats();
      setStats(stats);
      
      // Si la API devuelve estadísticas de tickets desglosadas
      if (stats.ticketsByStatus) {
        setTicketStats({
          pending: stats.ticketsByStatus.pending || 0,
          inProgress: stats.ticketsByStatus.inProgress || 0,
          resolved: stats.ticketsByStatus.resolved || 0
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, description, icon: Icon, gradient, textColor }) => (
    <div className={`p-6 rounded-xl shadow-lg text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${gradient}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold mb-1 truncate">{title}</h2>
          <p className={`text-4xl font-bold mb-2 ${loading ? 'animate-pulse' : ''}`}>
            {loading ? '...' : value}
          </p>
          <p className={`${textColor} text-sm font-medium`}>{description}</p>
        </div>
        <div className="text-5xl opacity-20 ml-4">
          <Icon />
        </div>
      </div>
    </div>
  );

  const QuickStatCard = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-white text-xl" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{loading ? '...' : value}</p>
      </div>
    </div>
  );

  const totalResources = stats.tickets + stats.inventory + stats.documents;
  const completionRate = stats.tickets > 0 ? Math.round((ticketStats.resolved / stats.tickets) * 100) : 0;

  return (
    <div className="space-y-6 pb-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Panel Principal</h1>
            <p className="text-lg sm:text-xl text-purple-100">
              Bienvenido, <span className="font-semibold">{user?.name || 'Usuario'}</span>
            </p>
            <p className="text-sm text-purple-200 mt-1">
              Rol: {user?.role?.name || 'Empleado'} • Sistema DuvyClass
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
            <FaClock className="text-purple-200" />
            <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Tickets"
          value={stats.tickets}
          description="Gestionar solicitudes de IT"
          icon={FaTicketAlt}
          gradient="bg-gradient-to-br from-violet-500 to-violet-600"
          textColor="text-violet-100"
        />
        
        <StatCard
          title="Inventario"
          value={stats.inventory}
          description="Activos tecnológicos"
          icon={FaBox}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          textColor="text-purple-100"
        />
        
        <StatCard
          title="Documentos"
          value={stats.documents}
          description="Documentación oficial"
          icon={FaFile}
          gradient="bg-gradient-to-br from-purple-400 to-purple-500"
          textColor="text-purple-100"
        />
      </div>

      {/* Secondary Stats - Ticket Status */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FaChartLine className="mr-2 text-purple-600" />
            Estado de Tickets
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Actualizado hace instantes
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso del día</span>
            <span>{completionRate}% completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* System Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaServer className="mr-2 text-purple-600" />
            Resumen del Sistema
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
              <span className="text-gray-700 font-medium">Total de Recursos</span>
              <span className="text-purple-600 font-bold text-lg">
                {loading ? '...' : totalResources}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Activos en Inventario</span>
              <span className="text-purple-600 font-bold text-lg">{loading ? '...' : stats.inventory}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Documentos Oficiales</span>
              <span className="text-purple-500 font-bold text-lg">{loading ? '...' : stats.documents}</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaChartLine className="mr-2 text-green-600" />
            Métricas de Rendimiento
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Tasa de Resolución</span>
                <span className="text-2xl font-bold text-green-600">{completionRate}%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Tickets Activos</span>
                <span className="text-2xl font-bold text-blue-600">
                  {loading ? '...' : ticketStats.pending + ticketStats.inProgress}
                </span>
              </div>
              <p className="text-xs text-gray-600">Pendientes y en progreso</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Eficiencia</span>
                <span className="text-2xl font-bold text-purple-600">
                  {stats.tickets > 0 ? Math.round((ticketStats.resolved / stats.tickets) * 100) : 0}%
                </span>
              </div>
              <p className="text-xs text-gray-600">Basado en tickets resueltos</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaShieldAlt className="mr-2 text-blue-600" />
            Estado del Sistema
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Sistema Operativo</p>
                  <p className="text-sm text-gray-600">Todos los servicios activos</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Base de Datos</p>
                  <p className="text-sm text-gray-600">Conexión estable</p>
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">API REST</p>
                  <p className="text-sm text-gray-600">Funcionando correctamente</p>
                </div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {user?.role?.name === 'Administrador' && (
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white text-center">
                <FaLock className="inline-block mr-2" />
                <span className="text-sm font-semibold">Acceso Administrativo Activo</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;