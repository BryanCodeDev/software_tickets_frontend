import React from 'react';
import { FaClipboardList, FaClock, FaCheck, FaArrowRight, FaCheckCircle, FaTimes, FaExclamationTriangle, FaShoppingCart, FaBoxOpen } from 'react-icons/fa';

const PurchaseRequestStats = ({ stats, userRole }) => {
  // Define stat cards based on user role
  const getStatCards = () => {
    if (userRole === 'Coordinadora Administrativa') {
      return [
        {
          title: 'Pendientes de Aprobación',
          value: stats.pendientes,
          icon: FaClock,
          color: 'from-yellow-500 to-yellow-600',
          bgColor: 'from-yellow-50 to-yellow-100',
          textColor: 'text-yellow-700'
        },
        {
          title: 'Aprobadas',
          value: stats.aprobados,
          icon: FaCheck,
          color: 'from-green-500 to-green-600',
          bgColor: 'from-green-50 to-green-100',
          textColor: 'text-green-700'
        },
        {
          title: 'Rechazadas',
          value: stats.rechazados,
          icon: FaTimes,
          color: 'from-red-500 to-red-600',
          bgColor: 'from-red-50 to-red-100',
          textColor: 'text-red-700'
        }
      ];
    } else if (userRole === 'Jefe') {
      return [
        {
          title: 'Pendientes de Aprobación',
          value: stats.pendientes,
          icon: FaClock,
          color: 'from-[#662d91] to-[#8e4dbf]',
          bgColor: 'from-[#f3ebf9] to-[#e8d5f5]',
          textColor: 'text-[#662d91]'
        },
        {
          title: 'Aprobadas',
          value: stats.aprobados,
          icon: FaCheck,
          color: 'from-green-500 to-green-600',
          bgColor: 'from-green-50 to-green-100',
          textColor: 'text-green-700'
        },
        {
          title: 'Rechazadas',
          value: stats.rechazados,
          icon: FaTimes,
          color: 'from-red-500 to-red-600',
          bgColor: 'from-red-50 to-red-100',
          textColor: 'text-red-700'
        }
      ];
    } else if (userRole === 'Compras') {
      return [
        {
          title: 'En Proceso',
          value: stats.enProceso,
          icon: FaShoppingCart,
          color: 'from-blue-500 to-blue-600',
          bgColor: 'from-blue-50 to-blue-100',
          textColor: 'text-blue-700'
        },
        {
          title: 'Compradas',
          value: stats.comprados,
          icon: FaCheck,
          color: 'from-green-500 to-green-600',
          bgColor: 'from-green-50 to-green-100',
          textColor: 'text-green-700'
        },
        {
          title: 'Entregadas',
          value: stats.entregados,
          icon: FaBoxOpen,
          color: 'from-teal-500 to-teal-600',
          bgColor: 'from-teal-50 to-teal-100',
          textColor: 'text-teal-700'
        }
      ];
    } else {
      // Admin/Técnico/Empleado - full stats
      return [
        {
          title: 'Total Solicitudes',
          value: stats.total,
          icon: FaClipboardList,
          color: 'from-blue-500 to-blue-600',
          bgColor: 'from-blue-50 to-blue-100',
          textColor: 'text-blue-700'
        },
        {
          title: 'Solicitadas',
          value: stats.solicitado,
          icon: FaClock,
          color: 'from-yellow-500 to-yellow-600',
          bgColor: 'from-yellow-50 to-yellow-100',
          textColor: 'text-yellow-700'
        },
        {
          title: 'Aprobadas Coordinadora',
          value: stats.aprobadoCoordinadora,
          icon: FaCheck,
          color: 'from-orange-500 to-orange-600',
          bgColor: 'from-orange-50 to-orange-100',
          textColor: 'text-orange-700'
        },
        {
          title: 'Aprobadas Jefe',
          value: stats.aprobadoJefe,
          icon: FaCheck,
          color: 'from-[#662d91] to-[#8e4dbf]',
          bgColor: 'from-[#f3ebf9] to-[#e8d5f5]',
          textColor: 'text-[#662d91]'
        },
        {
          title: 'En Compras',
          value: stats.enCompras,
          icon: FaArrowRight,
          color: 'from-cyan-500 to-cyan-600',
          bgColor: 'from-cyan-50 to-cyan-100',
          textColor: 'text-cyan-700'
        },
        {
          title: 'Completadas',
          value: stats.completado,
          icon: FaCheckCircle,
          color: 'from-green-500 to-green-600',
          bgColor: 'from-green-50 to-green-100',
          textColor: 'text-green-700'
        }
      ];
    }
  };

  const statCards = getStatCards();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 mb-6">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className={`bg-linear-to-br ${stat.bgColor} rounded-xl lg:rounded-2xl p-4 lg:p-6 border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <IconComponent className="text-white text-lg lg:text-xl" />
              </div>
            </div>
            <div className="space-y-1">
              <p className={`text-xs lg:text-sm font-semibold ${stat.textColor} uppercase tracking-wide`}>
                {stat.title}
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PurchaseRequestStats;

