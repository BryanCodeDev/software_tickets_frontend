import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import { dashboardAPI } from '../api';
import { FaTicketAlt, FaBox, FaLock, FaChartLine, FaClock, FaExclamationTriangle, FaCheckCircle, FaUserClock, FaServer, FaShieldAlt, FaShoppingCart, FaClipboardCheck, FaUsers, FaTachometerAlt, FaChartBar } from 'react-icons/fa';
import { useThemeClasses } from '../hooks/useThemeClasses';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { conditionalClasses } = useThemeClasses();
  const [stats, setStats] = useState({
    tickets: 0, inventory: { total: 0, computers: 0, tablets: 0, pdas: 0, phones: 0 }, documents: 0, credentials: 0, users: 0,
    qualityTickets: 0, regularTickets: 0, purchaseRequests: 0, deliveryRecords: 0
  });
  const [ticketStats, setTicketStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });
  const [qualityTicketStats, setQualityTicketStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });
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
        inventory: data.inventory || { total: 0, computers: 0, tablets: 0, pdas: 0, phones: 0 },
        documents: data.documents,
        credentials: data.credentials,
        users: data.users,
        qualityTickets: data.qualityTickets || 0,
        regularTickets: data.regularTickets || 0,
        purchaseRequests: data.purchaseRequests || 0,
        deliveryRecords: data.deliveryRecords || 0
      });

      if (data.ticketsByStatus) {
        setTicketStats({
          pending: data.ticketsByStatus.abierto || 0,
          inProgress: data.ticketsByStatus['en progreso'] || 0,
          resolved: data.ticketsByStatus.resuelto || 0
        });
      }

      if (data.qualityTicketsByStatus) {
        setQualityTicketStats({
          pending: data.qualityTicketsByStatus.abierto || 0,
          inProgress: data.qualityTicketsByStatus['en progreso'] || 0,
          resolved: data.qualityTicketsByStatus.resuelto || 0
        });
      }

      setSystemHealth(data.systemHealth || {});
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  // Componente de tarjeta principal con diseño profesional
  const StatCard = ({ title, value, description, colorClass, bgClass, icon }) => (
    <div className={conditionalClasses({
      light: `relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 ${bgClass || 'bg-white'}`,
      dark: `relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-600 ${bgClass || 'bg-gray-800'}`
    })}>
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-2">
              <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 mr-3`}>
                {icon || <FaBox className={`${colorClass} text-lg`} />}
              </div>
              <p className={conditionalClasses({
                light: 'text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide',
                dark: 'text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wide'
              })}>{title}</p>
            </div>
            <p className={conditionalClasses({
              light: `text-2xl sm:text-3xl font-bold text-gray-900 mb-1 ${loading ? 'animate-pulse' : ''}`,
              dark: `text-2xl sm:text-3xl font-bold text-gray-100 mb-1 ${loading ? 'animate-pulse' : ''}`
            })}>
              {loading ? '...' : value.toLocaleString()}
            </p>
            <p className={conditionalClasses({
              light: 'text-xs text-gray-500',
              dark: 'text-xs text-gray-400'
            })}>{description}</p>
          </div>
        </div>
      </div>
      <div className={`h-1 ${colorClass} bg-opacity-20`}>
        <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: loading ? '0%' : '100%' }}></div>
      </div>
    </div>
  );

  // Componente de métrica rápida
  const MetricCard = ({ label, value, color, subtext, icon }) => (
    <div className={conditionalClasses({
      light: 'bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200',
      dark: 'bg-gray-800 rounded-lg border border-gray-600 p-4 hover:shadow-md transition-all duration-200'
    })}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2.5 rounded-lg ${color} bg-opacity-10`}>
          {icon || <FaChartLine className={`${color} text-lg`} />}
        </div>
        <span className={conditionalClasses({
          light: `text-2xl font-bold ${loading ? 'animate-pulse text-gray-300' : 'text-gray-900'}`,
          dark: `text-2xl font-bold ${loading ? 'animate-pulse text-gray-600' : 'text-gray-100'}`
        })}>
          {loading ? '...' : value}
        </span>
      </div>
      <p className={conditionalClasses({
        light: 'text-xs font-medium text-gray-600 mb-0.5',
        dark: 'text-xs font-medium text-gray-300 mb-0.5'
      })}>{label}</p>
      {subtext && <p className={conditionalClasses({
        light: 'text-xs text-gray-400',
        dark: 'text-xs text-gray-500'
      })}>{subtext}</p>}
    </div>
  );

  // Cálculos
  const totalResources = stats.tickets + stats.inventory.total + stats.documents + stats.credentials + stats.purchaseRequests + stats.deliveryRecords;
  const completionRate = stats.tickets > 0 ? Math.round(((ticketStats.resolved + ticketStats.pending + ticketStats.inProgress) > 0 ? (ticketStats.resolved / (ticketStats.resolved + ticketStats.pending + ticketStats.inProgress)) * 100 : 0)) : 0;
  const qualityCompletionRate = stats.qualityTickets > 0 ? Math.round(((qualityTicketStats.resolved + qualityTicketStats.pending + qualityTicketStats.inProgress) > 0 ? (qualityTicketStats.resolved / (qualityTicketStats.resolved + qualityTicketStats.pending + qualityTicketStats.inProgress)) * 100 : 0)) : 0;

  return (
    <div className={conditionalClasses({
      light: 'min-h-screen bg-linear-to-br from-gray-50 via-gray-50 to-gray-100',
      dark: 'min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900'
    })}>
      <div className="max-w-400 mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Header Section - Profesional y limpio */}
        <div className="bg-linear-to-r from-[#662d91] to-[#7a3da8] rounded-xl shadow-lg mb-6 lg:mb-8">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <FaTachometerAlt className="text-white text-2xl sm:text-3xl" />
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Panel de Control</h1>
                </div>
                <p className="text-sm sm:text-base text-purple-100 mb-1">
                  Bienvenido, <span className="font-semibold text-white">{user?.name || 'Usuario'}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-purple-200">
                  <span className="flex items-center gap-1">
                    <FaUsers className="text-xs" />
                    {user?.role?.name || 'Empleado'}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>Sistema DuvyClass</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-white/20 w-fit">
                <FaClock className="text-purple-200 text-sm" />
                <span className="text-xs sm:text-sm text-white font-medium">
                  {new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid principal de estadísticas - 2 columnas en móvil, 3 en tablet, 4 en desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
          <StatCard
            title="Tickets IT"
            value={stats.tickets}
            description="Solicitudes de soporte"
            colorClass="text-purple-600"
            icon={<FaTicketAlt className="text-purple-600 text-lg" />}
          />
          <StatCard
            title="Calidad"
            value={stats.qualityTickets}
            description="Reportes y documentación"
            colorClass="text-emerald-600"
            icon={<FaShieldAlt className="text-emerald-600 text-lg" />}
          />
          <StatCard
            title="Compras"
            value={stats.purchaseRequests}
            description="Solicitudes pendientes"
            colorClass="text-orange-600"
            icon={<FaShoppingCart className="text-orange-600 text-lg" />}
          />
          <StatCard
            title="Actas"
            value={stats.deliveryRecords}
            description="Entregas registradas"
            colorClass="text-indigo-600"
            icon={<FaClipboardCheck className="text-indigo-600 text-lg" />}
          />
        </div>

        {/* Grid de Inventario Detallado */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
          <StatCard
            title="Computadores"
            value={stats.inventory.computers}
            description="Equipos de escritorio"
            colorClass="text-blue-600"
            icon={<FaBox className="text-blue-600 text-lg" />}
          />
          <StatCard
            title="Celulares"
            value={stats.inventory.phones}
            description="Teléfonos corporativos"
            colorClass="text-cyan-600"
            icon={<FaBox className="text-cyan-600 text-lg" />}
          />
          <StatCard
            title="Tablets"
            value={stats.inventory.tablets}
            description="Dispositivos móviles"
            colorClass="text-indigo-600"
            icon={<FaBox className="text-indigo-600 text-lg" />}
          />
          <StatCard
            title="PDAs"
            value={stats.inventory.pdas}
            description="Asistentes digitales"
            colorClass="text-green-600"
            icon={<FaBox className="text-green-600 text-lg" />}
          />
        </div>

        {/* Estado de Tickets - Diseño corporativo */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 lg:mb-8">
          {/* Tickets IT */}
          <div className={conditionalClasses({
            light: 'bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6',
            dark: 'bg-gray-800 rounded-xl shadow-sm border border-gray-600 p-4 sm:p-6'
          })}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className={conditionalClasses({
                  light: 'p-2.5 bg-purple-100 rounded-lg',
                  dark: 'p-2.5 bg-purple-900/30 rounded-lg'
                })}>
                  <FaTicketAlt className={conditionalClasses({
                    light: 'text-purple-600 text-lg',
                    dark: 'text-purple-400 text-lg'
                  })} />
                </div>
                <div>
                  <h2 className={conditionalClasses({
                    light: 'text-base sm:text-lg font-bold text-gray-900',
                    dark: 'text-base sm:text-lg font-bold text-gray-100'
                  })}>Tickets de Soporte IT</h2>
                  <p className={conditionalClasses({
                    light: 'text-xs text-gray-500',
                    dark: 'text-xs text-gray-400'
                  })}>Estado actual de solicitudes</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <MetricCard
                label="Pendientes"
                value={ticketStats.pending}
                color="text-amber-600"
                icon={<FaExclamationTriangle className="text-amber-600 text-lg" />}
              />
              <MetricCard
                label="En Progreso"
                value={ticketStats.inProgress}
                color="text-blue-600"
                icon={<FaUserClock className="text-blue-600 text-lg" />}
              />
              <MetricCard
                label="Resueltos"
                value={ticketStats.resolved}
                color="text-green-600"
                icon={<FaCheckCircle className="text-green-600 text-lg" />}
              />
            </div>

            <div className={conditionalClasses({
              light: 'pt-4 border-t border-gray-100',
              dark: 'pt-4 border-t border-gray-600'
            })}>
              <div className="flex justify-between items-center mb-2">
                <span className={conditionalClasses({
                  light: 'text-xs font-medium text-gray-600',
                  dark: 'text-xs font-medium text-gray-300'
                })}>Tasa de resolución</span>
                <span className={conditionalClasses({
                  light: 'text-sm font-bold text-gray-900',
                  dark: 'text-sm font-bold text-gray-100'
                })}>{completionRate}%</span>
              </div>
              <div className={conditionalClasses({
                light: 'w-full bg-gray-200 rounded-full h-2 overflow-hidden',
                dark: 'w-full bg-gray-600 rounded-full h-2 overflow-hidden'
              })}>
                <div
                  className="bg-linear-to-r from-purple-600 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Tickets de Calidad */}
          <div className={conditionalClasses({
            light: 'bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6',
            dark: 'bg-gray-800 rounded-xl shadow-sm border border-gray-600 p-4 sm:p-6'
          })}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className={conditionalClasses({
                  light: 'p-2.5 bg-emerald-100 rounded-lg',
                  dark: 'p-2.5 bg-emerald-900/30 rounded-lg'
                })}>
                  <FaShieldAlt className={conditionalClasses({
                    light: 'text-emerald-600 text-lg',
                    dark: 'text-emerald-400 text-lg'
                  })} />
                </div>
                <div>
                  <h2 className={conditionalClasses({
                    light: 'text-base sm:text-lg font-bold text-gray-900',
                    dark: 'text-base sm:text-lg font-bold text-gray-100'
                  })}>Tickets de Calidad</h2>
                  <p className={conditionalClasses({
                    light: 'text-xs text-gray-500',
                    dark: 'text-xs text-gray-400'
                  })}>Gestión de calidad y auditoría</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <MetricCard
                label="Pendientes"
                value={qualityTicketStats.pending}
                color="text-amber-600"
                icon={<FaExclamationTriangle className="text-amber-600 text-lg" />}
              />
              <MetricCard
                label="En Progreso"
                value={qualityTicketStats.inProgress}
                color="text-blue-600"
                icon={<FaUserClock className="text-blue-600 text-lg" />}
              />
              <MetricCard
                label="Resueltos"
                value={qualityTicketStats.resolved}
                color="text-green-600"
                icon={<FaCheckCircle className="text-green-600 text-lg" />}
              />
            </div>

            <div className={conditionalClasses({
              light: 'pt-4 border-t border-gray-100',
              dark: 'pt-4 border-t border-gray-600'
            })}>
              <div className="flex justify-between items-center mb-2">
                <span className={conditionalClasses({
                  light: 'text-xs font-medium text-gray-600',
                  dark: 'text-xs font-medium text-gray-300'
                })}>Tasa de resolución</span>
                <span className={conditionalClasses({
                  light: 'text-sm font-bold text-gray-900',
                  dark: 'text-sm font-bold text-gray-100'
                })}>{qualityCompletionRate}%</span>
              </div>
              <div className={conditionalClasses({
                light: 'w-full bg-gray-200 rounded-full h-2 overflow-hidden',
                dark: 'w-full bg-gray-600 rounded-full h-2 overflow-hidden'
              })}>
                <div
                  className="bg-linear-to-r from-emerald-600 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${qualityCompletionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid inferior - 3 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Resumen del Sistema */}
          <div className={conditionalClasses({
            light: 'bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6',
            dark: 'bg-gray-800 rounded-xl shadow-sm border border-gray-600 p-4 sm:p-6'
          })}>
            <div className="flex items-center gap-3">
              <div className={conditionalClasses({
                light: 'p-2.5 bg-blue-100 rounded-lg',
                dark: 'p-2.5 bg-blue-900/30 rounded-lg'
              })}>
                <FaServer className={conditionalClasses({
                  light: 'text-blue-600 text-lg',
                  dark: 'text-blue-400 text-lg'
                })} />
              </div>
              <div>
                <h2 className={conditionalClasses({
                  light: 'text-base sm:text-lg font-bold text-gray-900',
                  dark: 'text-base sm:text-lg font-bold text-gray-100'
                })}>Resumen del Sistema</h2>
                <p className={conditionalClasses({
                  light: 'text-xs text-gray-500',
                  dark: 'text-xs text-gray-400'
                })}>Recursos totales</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className={conditionalClasses({
                light: 'flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-100',
                dark: 'flex justify-between items-center p-3 bg-purple-900/20 rounded-lg border border-purple-800'
              })}>
                <span className={conditionalClasses({
                  light: 'text-sm font-medium text-gray-700',
                  dark: 'text-sm font-medium text-gray-300'
                })}>Total Recursos</span>
                <span className="text-lg font-bold text-purple-600">{loading ? '...' : totalResources}</span>
              </div>
              <div className={conditionalClasses({
                light: 'flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100',
                dark: 'flex justify-between items-center p-3 bg-blue-900/20 rounded-lg border border-blue-800'
              })}>
                <span className={conditionalClasses({
                  light: 'text-sm font-medium text-gray-700',
                  dark: 'text-sm font-medium text-gray-300'
                })}>Computadores</span>
                <span className="text-lg font-bold text-blue-600">{loading ? '...' : stats.inventory.computers}</span>
              </div>
              <div className={conditionalClasses({
                light: 'flex justify-between items-center p-3 bg-cyan-50 rounded-lg border border-cyan-100',
                dark: 'flex justify-between items-center p-3 bg-cyan-900/20 rounded-lg border border-cyan-800'
              })}>
                <span className={conditionalClasses({
                  light: 'text-sm font-medium text-gray-700',
                  dark: 'text-sm font-medium text-gray-300'
                })}>Celulares</span>
                <span className="text-lg font-bold text-cyan-600">{loading ? '...' : stats.inventory.phones}</span>
              </div>
              <div className={conditionalClasses({
                light: 'flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100',
                dark: 'flex justify-between items-center p-3 bg-indigo-900/20 rounded-lg border border-indigo-800'
              })}>
                <span className={conditionalClasses({
                  light: 'text-sm font-medium text-gray-700',
                  dark: 'text-sm font-medium text-gray-300'
                })}>Tablets</span>
                <span className="text-lg font-bold text-indigo-600">{loading ? '...' : stats.inventory.tablets}</span>
              </div>
              <div className={conditionalClasses({
                light: 'flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100',
                dark: 'flex justify-between items-center p-3 bg-green-900/20 rounded-lg border border-green-800'
              })}>
                <span className={conditionalClasses({
                  light: 'text-sm font-medium text-gray-700',
                  dark: 'text-sm font-medium text-gray-300'
                })}>PDAs</span>
                <span className="text-lg font-bold text-green-600">{loading ? '...' : stats.inventory.pdas}</span>
              </div>
              <div className={conditionalClasses({
                light: 'flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100',
                dark: 'flex justify-between items-center p-3 bg-emerald-900/20 rounded-lg border border-emerald-800'
              })}>
                <span className={conditionalClasses({
                  light: 'text-sm font-medium text-gray-700',
                  dark: 'text-sm font-medium text-gray-300'
                })}>Calidad</span>
                <span className="text-lg font-bold text-emerald-600">{loading ? '...' : stats.qualityTickets}</span>
              </div>
              <div className={conditionalClasses({
                light: 'flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100',
                dark: 'flex justify-between items-center p-3 bg-orange-900/20 rounded-lg border border-orange-800'
              })}>
                <span className={conditionalClasses({
                  light: 'text-sm font-medium text-gray-700',
                  dark: 'text-sm font-medium text-gray-300'
                })}>Compras</span>
                <span className="text-lg font-bold text-orange-600">{loading ? '...' : stats.purchaseRequests}</span>
              </div>
              <div className={conditionalClasses({
                light: 'flex justify-between items-center p-3 bg-pink-50 rounded-lg border border-pink-100',
                dark: 'flex justify-between items-center p-3 bg-pink-900/20 rounded-lg border border-pink-800'
              })}>
                <span className={conditionalClasses({
                  light: 'text-sm font-medium text-gray-700',
                  dark: 'text-sm font-medium text-gray-300'
                })}>Actas Entrega</span>
                <span className="text-lg font-bold text-pink-600">{loading ? '...' : stats.deliveryRecords}</span>
              </div>
              <div className={conditionalClasses({
                light: 'flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100',
                dark: 'flex justify-between items-center p-3 bg-yellow-900/20 rounded-lg border border-yellow-800'
              })}>
                <span className={conditionalClasses({
                  light: 'text-sm font-medium text-gray-700',
                  dark: 'text-sm font-medium text-gray-300'
                })}>Credenciales</span>
                <span className="text-lg font-bold text-yellow-600">{loading ? '...' : stats.credentials}</span>
              </div>
            </div>
          </div>

          {/* Métricas de Rendimiento */}
          <div className={conditionalClasses({
            light: 'bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6',
            dark: 'bg-gray-800 rounded-xl shadow-sm border border-gray-600 p-4 sm:p-6'
          })}>
            <div className="flex items-center gap-3">
              <div className={conditionalClasses({
                light: 'p-2.5 bg-green-100 rounded-lg',
                dark: 'p-2.5 bg-green-900/30 rounded-lg'
              })}>
                <FaChartBar className={conditionalClasses({
                  light: 'text-green-600 text-lg',
                  dark: 'text-green-400 text-lg'
                })} />
              </div>
              <div>
                <h2 className={conditionalClasses({
                  light: 'text-base sm:text-lg font-bold text-gray-900',
                  dark: 'text-base sm:text-lg font-bold text-gray-100'
                })}>Métricas de Rendimiento</h2>
                <p className={conditionalClasses({
                  light: 'text-xs text-gray-500',
                  dark: 'text-xs text-gray-400'
                })}>Indicadores clave</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className={conditionalClasses({
                light: 'p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200',
                dark: 'p-4 bg-linear-to-br from-green-900/20 to-emerald-900/20 rounded-lg border border-green-800'
              })}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className={conditionalClasses({
                      light: 'text-xs font-medium text-gray-600 mb-1',
                      dark: 'text-xs font-medium text-gray-300 mb-1'
                    })}>Tasa de Resolución</p>
                    <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
                  </div>
                  <FaCheckCircle className="text-green-500 text-xl" />
                </div>
                <div className={conditionalClasses({
                  light: 'w-full bg-green-200 rounded-full h-2',
                  dark: 'w-full bg-green-700 rounded-full h-2'
                })}>
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={conditionalClasses({
                  light: 'p-3 bg-blue-50 rounded-lg border border-blue-100',
                  dark: 'p-3 bg-blue-900/20 rounded-lg border border-blue-800'
                })}>
                  <p className={conditionalClasses({
                    light: 'text-xs font-medium text-gray-600 mb-1',
                    dark: 'text-xs font-medium text-gray-300 mb-1'
                  })}>Tickets Activos</p>
                  <p className="text-xl font-bold text-blue-600">
                    {loading ? '...' : ticketStats.pending + ticketStats.inProgress}
                  </p>
                </div>
                <div className={conditionalClasses({
                  light: 'p-3 bg-cyan-50 rounded-lg border border-cyan-100',
                  dark: 'p-3 bg-cyan-900/20 rounded-lg border border-cyan-800'
                })}>
                  <p className={conditionalClasses({
                    light: 'text-xs font-medium text-gray-600 mb-1',
                    dark: 'text-xs font-medium text-gray-300 mb-1'
                  })}>Dispositivos</p>
                  <p className="text-xl font-bold text-cyan-600">{loading ? '...' : stats.inventory.total}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={conditionalClasses({
                  light: 'p-3 bg-purple-50 rounded-lg border border-purple-100',
                  dark: 'p-3 bg-purple-900/20 rounded-lg border border-purple-800'
                })}>
                  <p className={conditionalClasses({
                    light: 'text-xs font-medium text-gray-600 mb-1',
                    dark: 'text-xs font-medium text-gray-300 mb-1'
                  })}>Usuarios</p>
                  <p className="text-xl font-bold text-purple-600">{loading ? '...' : stats.users}</p>
                </div>
                <div className={conditionalClasses({
                  light: 'p-3 bg-emerald-50 rounded-lg border border-emerald-100',
                  dark: 'p-3 bg-emerald-900/20 rounded-lg border border-emerald-800'
                })}>
                  <p className={conditionalClasses({
                    light: 'text-xs font-medium text-gray-600 mb-1',
                    dark: 'text-xs font-medium text-gray-300 mb-1'
                  })}>Calidad</p>
                  <p className="text-xl font-bold text-emerald-600">{qualityCompletionRate}%</p>
                </div>
              </div>

              <div className={conditionalClasses({
                light: 'p-3 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200',
                dark: 'p-3 bg-linear-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-800'
              })}>
                <p className={conditionalClasses({
                  light: 'text-xs font-medium text-gray-600 mb-1',
                  dark: 'text-xs font-medium text-gray-300 mb-1'
                })}>Eficiencia Global</p>
                <p className="text-xl font-bold text-purple-600">{completionRate}%</p>
                <p className={conditionalClasses({
                  light: 'text-xs text-gray-500 mt-1',
                  dark: 'text-xs text-gray-400 mt-1'
                })}>Basado en tickets resueltos</p>
              </div>
            </div>
          </div>

          {/* Estado del Sistema */}
          <div className={conditionalClasses({
            light: 'bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6',
            dark: 'bg-gray-800 rounded-xl shadow-sm border border-gray-600 p-4 sm:p-6'
          })}>
            <div className="flex items-center gap-3">
              <div className={conditionalClasses({
                light: 'p-2.5 bg-blue-100 rounded-lg',
                dark: 'p-2.5 bg-blue-900/30 rounded-lg'
              })}>
                <FaShieldAlt className={conditionalClasses({
                  light: 'text-blue-600 text-lg',
                  dark: 'text-blue-400 text-lg'
                })} />
              </div>
              <div>
                <h2 className={conditionalClasses({
                  light: 'text-base sm:text-lg font-bold text-gray-900',
                  dark: 'text-base sm:text-lg font-bold text-gray-100'
                })}>Estado del Sistema</h2>
                <p className={conditionalClasses({
                  light: 'text-xs text-gray-500',
                  dark: 'text-xs text-gray-400'
                })}>Monitoreo en tiempo real</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className={conditionalClasses({
                light: 'p-4 bg-green-50 rounded-lg border-l-4 border-green-500',
                dark: 'p-4 bg-green-900/20 rounded-lg border-l-4 border-green-600'
              })}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className={conditionalClasses({
                        light: 'font-semibold text-gray-900 text-sm',
                        dark: 'font-semibold text-gray-100 text-sm'
                      })}>Base de Datos</p>
                    </div>
                    <p className={conditionalClasses({
                      light: 'text-xs text-gray-600',
                      dark: 'text-xs text-gray-300'
                    })}>
                      {systemHealth.database === 'online' ? 'Conexión estable' : 'Problemas de conexión'}
                    </p>
                  </div>
                  <FaCheckCircle className="text-green-500 text-lg" />
                </div>
              </div>

              <div className={conditionalClasses({
                light: 'p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500',
                dark: 'p-4 bg-blue-900/20 rounded-lg border-l-4 border-blue-600'
              })}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <p className={conditionalClasses({
                        light: 'font-semibold text-gray-900 text-sm',
                        dark: 'font-semibold text-gray-100 text-sm'
                      })}>API REST</p>
                    </div>
                    <p className={conditionalClasses({
                      light: 'text-xs text-gray-600',
                      dark: 'text-xs text-gray-300'
                    })}>
                      {systemHealth.api === 'online' ? 'Funcionando correctamente' : 'Servicios interrumpidos'}
                    </p>
                  </div>
                  <FaCheckCircle className="text-blue-500 text-lg" />
                </div>
              </div>

              <div className={conditionalClasses({
                light: 'p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500',
                dark: 'p-4 bg-purple-900/20 rounded-lg border-l-4 border-purple-600'
              })}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <p className={conditionalClasses({
                        light: 'font-semibold text-gray-900 text-sm',
                        dark: 'font-semibold text-gray-100 text-sm'
                      })}>Uptime</p>
                    </div>
                    <p className={conditionalClasses({
                      light: 'text-xs text-gray-600',
                      dark: 'text-xs text-gray-300'
                    })}>
                      {systemHealth.uptime ? `${Math.floor(systemHealth.uptime / 3600)}h ${Math.floor((systemHealth.uptime % 3600) / 60)}m` : 'Calculando...'}
                    </p>
                  </div>
                  <FaClock className="text-purple-500 text-lg" />
                </div>
              </div>

              {user?.role?.name === 'Administrador' && (
                <div className={conditionalClasses({
                  light: 'mt-4 p-4 bg-linear-to-r from-purple-600 to-purple-700 rounded-lg text-white',
                  dark: 'mt-4 p-4 bg-linear-to-r from-purple-700 to-purple-800 rounded-lg text-white'
                })}>
                  <div className="flex items-center justify-center gap-2">
                    <FaUserClock className="text-sm" />
                    <span className="text-xs font-semibold">Acceso Administrativo Activo</span>
                  </div>
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