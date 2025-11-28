import React from 'react';
import { FaClipboardList, FaExclamationTriangle, FaSpinner, FaCheckCircle, FaChartBar } from 'react-icons/fa';

const TicketStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4 mb-6 animate-fade-in">
      <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl p-3 lg:p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-1 lg:mb-2">
          <FaClipboardList className="w-6 h-6 lg:w-8 lg:h-8 opacity-80" />
          <span className="text-xl lg:text-3xl font-bold">{stats.total}</span>
        </div>
        <p className="text-xs lg:text-sm font-medium opacity-90">Total Tickets</p>
      </div>

      <div className="bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-xl lg:rounded-2xl p-3 lg:p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-1 lg:mb-2">
          <FaExclamationTriangle className="w-6 h-6 lg:w-8 lg:h-8 opacity-80" />
          <span className="text-xl lg:text-3xl font-bold">{stats.abiertos}</span>
        </div>
        <p className="text-xs lg:text-sm font-medium opacity-90">Abiertos</p>
      </div>

      <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl lg:rounded-2xl p-3 lg:p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-1 lg:mb-2">
          <FaSpinner className="w-6 h-6 lg:w-8 lg:h-8 opacity-80" />
          <span className="text-xl lg:text-3xl font-bold">{stats.enProgreso}</span>
        </div>
        <p className="text-xs lg:text-sm font-medium opacity-90">En Progreso</p>
      </div>

      <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl lg:rounded-2xl p-3 lg:p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-1 lg:mb-2">
          <FaCheckCircle className="w-6 h-6 lg:w-8 lg:h-8 opacity-80" />
          <span className="text-xl lg:text-3xl font-bold">{stats.resueltos}</span>
        </div>
        <p className="text-xs lg:text-sm font-medium opacity-90">Resueltos</p>
      </div>

      <div className="bg-linear-to-br from-red-500 to-red-600 rounded-xl lg:rounded-2xl p-3 lg:p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-1 lg:mb-2">
          <FaExclamationTriangle className="w-6 h-6 lg:w-8 lg:h-8 opacity-80" />
          <span className="text-xl lg:text-3xl font-bold">{stats.alta}</span>
        </div>
        <p className="text-xs lg:text-sm font-medium opacity-90">Alta Prioridad</p>
      </div>

      <div className="bg-linear-to-br from-[#8e4dbf] to-[#8e4dbf] rounded-xl lg:rounded-2xl p-3 lg:p-5 text-white shadow-lg col-span-2 sm:col-span-3 lg:col-span-1 xl:col-span-1">
        <div className="flex items-center justify-between mb-1 lg:mb-2">
          <FaChartBar className="w-6 h-6 lg:w-8 lg:h-8 opacity-80" />
          <span className="text-xl lg:text-3xl font-bold">{stats.resolutionRate}%</span>
        </div>
        <p className="text-xs lg:text-sm font-medium opacity-90">Tasa Resolución</p>
      </div>
    </div>
  );
};

export default TicketStats;

