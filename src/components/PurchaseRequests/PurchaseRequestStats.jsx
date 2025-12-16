import React from 'react';
import { FaClipboardList, FaClock, FaCheck, FaArrowRight, FaCheckCircle, FaTimes, FaExclamationTriangle, FaShoppingCart, FaBoxOpen } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const PurchaseRequestStats = ({ stats, userRole }) => {
  const { conditionalClasses } = useThemeClasses();

  // Define stat cards based on user role
  const getStatCards = () => {
    if (userRole === 'Coordinadora Administrativa') {
      return [
        {
          title: 'Pendientes de Aprobación',
          value: stats.pendientes,
          icon: FaClock,
          color: 'from-yellow-500 to-yellow-600',
          bgColor: conditionalClasses({
            light: 'from-yellow-50 to-yellow-100',
            dark: 'from-yellow-900/20 to-yellow-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-yellow-700',
            dark: 'text-yellow-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
        },
        {
          title: 'Aprobadas',
          value: stats.aprobados,
          icon: FaCheck,
          color: 'from-green-500 to-green-600',
          bgColor: conditionalClasses({
            light: 'from-green-50 to-green-100',
            dark: 'from-green-900/20 to-green-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-green-700',
            dark: 'text-green-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
        },
        {
          title: 'Rechazadas',
          value: stats.rechazados,
          icon: FaTimes,
          color: 'from-red-500 to-red-600',
          bgColor: conditionalClasses({
            light: 'from-red-50 to-red-100',
            dark: 'from-red-900/20 to-red-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-red-700',
            dark: 'text-red-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
        }
      ];
    } else if (userRole === 'Jefe') {
      return [
        {
          title: 'Pendientes de Aprobación',
          value: stats.pendientes,
          icon: FaClock,
          color: 'from-[#662d91] to-[#8e4dbf]',
          bgColor: conditionalClasses({
            light: 'from-[#f3ebf9] to-[#e8d5f5]',
            dark: 'from-purple-900/20 to-purple-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-[#662d91]',
            dark: 'text-purple-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
        },
        {
          title: 'Aprobadas',
          value: stats.aprobados,
          icon: FaCheck,
          color: 'from-green-500 to-green-600',
          bgColor: conditionalClasses({
            light: 'from-green-50 to-green-100',
            dark: 'from-green-900/20 to-green-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-green-700',
            dark: 'text-green-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
        },
        {
          title: 'Rechazadas',
          value: stats.rechazados,
          icon: FaTimes,
          color: 'from-red-500 to-red-600',
          bgColor: conditionalClasses({
            light: 'from-red-50 to-red-100',
            dark: 'from-red-900/20 to-red-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-red-700',
            dark: 'text-red-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
        }
      ];
    } else if (userRole === 'Compras') {
      return [
        {
          title: 'En Proceso',
          value: stats.enProceso,
          icon: FaShoppingCart,
          color: 'from-blue-500 to-blue-600',
          bgColor: conditionalClasses({
            light: 'from-blue-50 to-blue-100',
            dark: 'from-blue-900/20 to-blue-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-blue-700',
            dark: 'text-blue-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
        },
        {
          title: 'Compradas',
          value: stats.comprados,
          icon: FaCheck,
          color: 'from-green-500 to-green-600',
          bgColor: conditionalClasses({
            light: 'from-green-50 to-green-100',
            dark: 'from-green-900/20 to-green-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-green-700',
            dark: 'text-green-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
        },
        {
          title: 'Entregadas',
          value: stats.entregados,
          icon: FaBoxOpen,
          color: 'from-teal-500 to-teal-600',
          bgColor: conditionalClasses({
            light: 'from-teal-50 to-teal-100',
            dark: 'from-teal-900/20 to-teal-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-teal-700',
            dark: 'text-teal-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
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
          bgColor: conditionalClasses({
            light: 'from-blue-50 to-blue-100',
            dark: 'from-blue-900/20 to-blue-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-blue-700',
            dark: 'text-blue-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
        },
        {
          title: 'Solicitadas',
          value: stats.solicitado,
          icon: FaClock,
          color: 'from-yellow-500 to-yellow-600',
          bgColor: conditionalClasses({
            light: 'from-yellow-50 to-yellow-100',
            dark: 'from-yellow-900/20 to-yellow-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-yellow-700',
            dark: 'text-yellow-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
        },
        {
          title: 'Aprobadas Coordinadora',
          value: stats.aprobadoCoordinadora,
          icon: FaCheck,
          color: 'from-orange-500 to-orange-600',
          bgColor: conditionalClasses({
            light: 'from-orange-50 to-orange-100',
            dark: 'from-orange-900/20 to-orange-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-orange-700',
            dark: 'text-orange-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
        },
        {
          title: 'Aprobadas Jefe',
          value: stats.aprobadoJefe,
          icon: FaCheck,
          color: 'from-[#662d91] to-[#8e4dbf]',
          bgColor: conditionalClasses({
            light: 'from-[#f3ebf9] to-[#e8d5f5]',
            dark: 'from-purple-900/20 to-purple-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-[#662d91]',
            dark: 'text-purple-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
        },
        {
          title: 'En Compras',
          value: stats.enCompras,
          icon: FaArrowRight,
          color: 'from-cyan-500 to-cyan-600',
          bgColor: conditionalClasses({
            light: 'from-cyan-50 to-cyan-100',
            dark: 'from-cyan-900/20 to-cyan-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-cyan-700',
            dark: 'text-cyan-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
        },
        {
          title: 'Completadas',
          value: stats.completado,
          icon: FaCheckCircle,
          color: 'from-green-500 to-green-600',
          bgColor: conditionalClasses({
            light: 'from-green-50 to-green-100',
            dark: 'from-green-900/20 to-green-800/20'
          }),
          textColor: conditionalClasses({
            light: 'text-green-700',
            dark: 'text-green-300'
          }),
          borderColor: conditionalClasses({
            light: 'border-white',
            dark: 'border-gray-700'
          })
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
            className={`bg-linear-to-br ${stat.bgColor} rounded-xl lg:rounded-2xl p-4 lg:p-6 border-2 ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-200`}
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
              <p className={conditionalClasses({
                light: 'text-2xl lg:text-3xl font-bold text-gray-900',
                dark: 'text-2xl lg:text-3xl font-bold text-gray-100'
              })}>
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

