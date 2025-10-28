import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import { dashboardAPI } from '../api';
import { FaTicketAlt, FaBox, FaFolder, FaFile, FaLock } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ tickets: 0, inventory: 0, documents: 0, repository: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const stats = await dashboardAPI.fetchStats();
      setStats(stats);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Panel Principal</h1>
        <p className="text-base sm:text-lg text-gray-600">Bienvenido, <span className="font-semibold text-purple-600">{user?.name || 'Usuario'}</span> ({user?.role?.name || 'Rol'})</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-4 sm:p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow duration-300 bg-linear-to-br from-violet-500 to-violet-600">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 truncate">Tickets</h2>
              <p className="text-2xl sm:text-3xl font-bold mb-1">{stats.tickets}</p>
              <p className="text-purple-100 text-xs sm:text-sm">Gestionar tickets de IT</p>
            </div>
            <div className="text-3xl sm:text-4xl opacity-20 ml-2"><FaTicketAlt /></div>
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow duration-300 bg-linear-to-br from-purple-500 to-purple-600">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 truncate">Inventario</h2>
              <p className="text-2xl sm:text-3xl font-bold mb-1">{stats.inventory}</p>
              <p className="text-violet-100 text-xs sm:text-sm">Seguimiento de activos IT</p>
            </div>
            <div className="text-3xl sm:text-4xl opacity-20 ml-2"><FaBox /></div>
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow duration-300 bg-linear-to-br from-indigo-500 to-indigo-600">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 truncate">Repositorio</h2>
              <p className="text-2xl sm:text-3xl font-bold mb-1">{stats.repository}</p>
              <p className="text-indigo-100 text-xs sm:text-sm">Acceder a archivos compartidos</p>
            </div>
            <div className="text-3xl sm:text-4xl opacity-20 ml-2"><FaFolder /></div>
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow duration-300 bg-linear-to-br from-purple-400 to-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 truncate">Documentos</h2>
              <p className="text-2xl sm:text-3xl font-bold mb-1">{stats.documents}</p>
              <p className="text-purple-100 text-xs sm:text-sm">Ver documentos oficiales</p>
            </div>
            <div className="text-3xl sm:text-4xl opacity-20 ml-2"><FaFile /></div>
          </div>
        </div>

        {user?.role?.name === 'Administrador' && (
          <div className="p-4 sm:p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow duration-300 bg-linear-to-br from-purple-700 to-purple-800">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold mb-2 truncate">Credenciales</h2>
                <p className="text-purple-100 text-xs sm:text-sm">Gestionar credenciales internas</p>
              </div>
              <div className="text-3xl sm:text-4xl opacity-20 ml-2"><FaLock /></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;