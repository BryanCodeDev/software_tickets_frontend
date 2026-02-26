import React, { useState, useEffect, useContext } from 'react';
import { FaFileAlt, FaExchangeAlt, FaTicketAlt, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaClock, FaExclamationCircle, FaShieldAlt, FaTachometerAlt, FaUser, FaRedo } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import qualityTicketsAPI from '../../api/qualityTicketsAPI';
import documentsAPI from '../../api/documentsAPI';
import documentChangeRequestsAPI from '../../api/documentChangeRequestsAPI';
import AuthContext from '../../context/AuthContext';

const QualityDashboard = () => {
  const { conditionalClasses } = useThemeClasses();
  const { user } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    documents: { total: 0, expiringSoon: 0, expired: 0 },
    changeRequests: { total: 0, pending: 0, approved: 0, published: 0, rejected: 0 },
    qualityTickets: { total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 }
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Cargar stats de documentos
      let documentsStats = { total: 0, expiringSoon: 0, expired: 0 };
      try {
        const docs = await documentsAPI.fetchDocuments();
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        documentsStats.total = docs.length;
        documentsStats.expired = docs.filter(d => d.expiryDate && new Date(d.expiryDate) < now).length;
        documentsStats.expiringSoon = docs.filter(d => {
          if (!d.expiryDate) return false;
          const expiryDate = new Date(d.expiryDate);
          return expiryDate >= now && expiryDate <= thirtyDaysFromNow;
        }).length;
      } catch (e) {
        console.error('Error loading documents:', e);
      }

      // Cargar stats de solicitudes de cambio
      let changeRequestsStats = { total: 0, pending: 0, approved: 0, published: 0, rejected: 0 };
      try {
        const crResponse = await documentChangeRequestsAPI.getAll({});
        const crRequests = crResponse.requests || [];
        
        changeRequestsStats.total = crRequests.length;
        changeRequestsStats.pending = crRequests.filter(r => 
          ['borrador', 'pendiente_revision', 'en_revision'].includes(r.workflowStatus)
        ).length;
        changeRequestsStats.approved = crRequests.filter(r => 
          r.workflowStatus === 'aprobado' || r.workflowStatus === 'en_implementacion'
        ).length;
        changeRequestsStats.published = crRequests.filter(r => r.workflowStatus === 'publicado').length;
        changeRequestsStats.rejected = crRequests.filter(r => r.workflowStatus === 'rechazado').length;
      } catch (e) {
        console.error('Error loading change requests:', e);
      }

      // Cargar stats de tickets de calidad
      let qualityTicketsStats = { total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 };
      try {
        const qtResponse = await qualityTicketsAPI.fetchQualityTickets({});
        const qtTickets = qtResponse.tickets || [];
        
        qualityTicketsStats.total = qtTickets.length;
        qualityTicketsStats.open = qtTickets.filter(t => t.status === 'abierto').length;
        qualityTicketsStats.inProgress = qtTickets.filter(t => t.status === 'en progreso').length;
        qualityTicketsStats.resolved = qtTickets.filter(t => t.status === 'resuelto').length;
        qualityTicketsStats.closed = qtTickets.filter(t => t.status === 'cerrado').length;
      } catch (e) {
        console.error('Error loading quality tickets:', e);
      }

      setStats({
        documents: documentsStats,
        changeRequests: changeRequestsStats,
        qualityTickets: qualityTicketsStats
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculos de tasas de resolución
  const documentHealthRate = stats.documents.total > 0 
    ? Math.round(((stats.documents.total - stats.documents.expired - stats.documents.expiringSoon) / stats.documents.total) * 100)
    : 100;

  const changeRequestCompletionRate = stats.changeRequests.total > 0
    ? Math.round(((stats.changeRequests.approved + stats.changeRequests.published) / stats.changeRequests.total) * 100)
    : 0;

  const qualityTicketResolutionRate = stats.qualityTickets.total > 0
    ? Math.round(((stats.qualityTickets.resolved + stats.qualityTickets.closed) / stats.qualityTickets.total) * 100)
    : 0;

  // Componente de tarjeta de stat principal
  const StatCard = ({ title, value, description, colorClass, bgClass, icon, subValue }) => (
    <div className={conditionalClasses({
      light: `relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 ${bgClass || 'bg-white'}`,
      dark: `relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-600 ${bgClass || 'bg-gray-800'}`
    })}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-2">
              <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 mr-3`}>
                {icon || <FaFileAlt className={`${colorClass} text-lg`} />}
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
              {loading ? '...' : value}
            </p>
            <p className={conditionalClasses({
              light: 'text-xs text-gray-500',
              dark: 'text-xs text-gray-400'
            })}>{description}</p>
            {subValue && (
              <p className={`text-xs font-medium mt-1 ${subValue.colorClass || 'text-gray-500'}`}>
                {subValue.label}: {subValue.value}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className={`h-1.5 ${colorClass} bg-opacity-20`}>
        <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: loading ? '0%' : '100%' }}></div>
      </div>
    </div>
  );

  // Componente de métrica pequeña
  const MetricCard = ({ label, value, color, icon }) => (
    <div className={conditionalClasses({
      light: 'bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200',
      dark: 'bg-gray-800 rounded-lg border border-gray-600 p-3 hover:shadow-md transition-all duration-200'
    })}>
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          {icon || <FaChartLine className={`${color} text-base`} />}
        </div>
        <span className={conditionalClasses({
          light: `text-xl font-bold ${loading ? 'animate-pulse text-gray-300' : 'text-gray-900'}`,
          dark: `text-xl font-bold ${loading ? 'animate-pulse text-gray-600' : 'text-gray-100'}`
        })}>
          {loading ? '...' : value}
        </span>
      </div>
      <p className={conditionalClasses({
        light: 'text-xs font-medium text-gray-600 mt-1',
        dark: 'text-xs font-medium text-gray-300 mt-1'
      })}>{label}</p>
    </div>
  );

  if (loading) {
    return (
      <div className={conditionalClasses({
        light: 'min-h-screen bg-linear-to-br from-gray-50 via-gray-50 to-gray-100 flex items-center justify-center',
        dark: 'min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center'
      })}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#662d91] mx-auto mb-4"></div>
          <p className={conditionalClasses({ light: 'text-lg text-gray-600 font-medium', dark: 'text-lg text-gray-300 font-medium' })}>Cargando dashboard de calidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={conditionalClasses({
      light: 'min-h-screen bg-linear-to-br from-gray-50 via-gray-50 to-gray-100',
      dark: 'min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900'
    })}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        
        {/* Header - Diseño Enterprise Premium */}
        <div className="relative overflow-hidden bg-linear-to-r from-[#059669] via-[#10b981] to-[#059669] rounded-2xl shadow-2xl mb-6 lg:mb-8">
          {/* Patrón de fondo decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full opacity-50"></div>
          </div>
          
          <div className="relative p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                    <FaShieldAlt className="text-white text-xl sm:text-2xl" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Dashboard de Calidad</h1>
                    <p className="text-xs sm:text-sm text-emerald-200 font-medium">Gestión ISO 9001 - DuvyClass</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-emerald-100 mb-2">
                  Vista unificada de gestión documental y calidad
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-200">
                  <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <FaUser className="text-xs" />
                    {user?.name || 'Usuario'}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:flex items-center gap-1.5">
                    <FaTicketAlt className="text-xs" />
                    {stats.qualityTickets.total} Tickets
                  </span>
                </div>
              </div>
              
              {/* Panel de fecha y botón de refresh */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/20 w-full sm:w-auto">
                  <div className="flex items-center gap-2 mb-1">
                    <FaClock className="text-emerald-200 text-xs" />
                    <span className="text-xs text-emerald-200 font-medium">Fecha Actual</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                
                <button 
                  onClick={loadStats}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2.5 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <FaRedo className={`text-emerald-100 text-sm ${loading ? 'animate-spin' : ''}`} />
                  <span className="text-xs font-medium text-emerald-100">Actualizar</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Barra inferior decorativa */}
          <div className="h-1.5 bg-linear-to-r from-emerald-300 via-teal-300 to-emerald-300"></div>
        </div>

        {/* Grid principal de estadísticas - Diseño Professional */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 lg:mb-8">
          {/* Documentos */}
          <StatCard
            title="Documentos"
            value={stats.documents.total}
            description="Total registrados"
            colorClass="text-purple-600"
            bgClass={conditionalClasses({
              light: 'bg-gradient-to-br from-purple-50 to-white',
              dark: 'bg-gradient-to-br from-purple-900/40 to-gray-800'
            })}
            icon={<FaFileAlt className="text-purple-600 text-lg" />}
          />
          
          {/* Tickets Calidad */}
          <StatCard
            title="Tickets"
            value={stats.qualityTickets.total}
            description="Total ISO 9001"
            colorClass="text-emerald-600"
            bgClass={conditionalClasses({
              light: 'bg-gradient-to-br from-emerald-50 to-white',
              dark: 'bg-gradient-to-br from-emerald-900/40 to-gray-800'
            })}
            icon={<FaShieldAlt className="text-emerald-600 text-lg" />}
          />
          
          {/* Solicitudes Cambio */}
          <StatCard
            title="Cambios"
            value={stats.changeRequests.total}
            description="Solicitudes"
            colorClass="text-blue-600"
            bgClass={conditionalClasses({
              light: 'bg-gradient-to-br from-blue-50 to-white',
              dark: 'bg-gradient-to-br from-blue-900/40 to-gray-800'
            })}
            icon={<FaExchangeAlt className="text-blue-600 text-lg" />}
          />
          
          {/* Documentos por vencer */}
          <StatCard
            title="Por Vencer"
            value={stats.documents.expiringSoon}
            description="En 30 días"
            colorClass="text-amber-600"
            bgClass={conditionalClasses({
              light: 'bg-gradient-to-br from-amber-50 to-white',
              dark: 'bg-gradient-to-br from-amber-900/40 to-gray-800'
            })}
            icon={<FaClock className="text-amber-600 text-lg" />}
          />
          
          {/* Documentos vencidos */}
          <StatCard
            title="Vencidos"
            value={stats.documents.expired}
            description="Requieren acción"
            colorClass="text-red-600"
            bgClass={conditionalClasses({
              light: 'bg-gradient-to-br from-red-50 to-white',
              dark: 'bg-gradient-to-br from-red-900/40 to-gray-800'
            })}
            icon={<FaExclamationTriangle className="text-red-600 text-lg" />}
          />
          
          {/* Publicados */}
          <StatCard
            title="Publicados"
            value={stats.changeRequests.published}
            description="Cambios aplicados"
            colorClass="text-green-600"
            bgClass={conditionalClasses({
              light: 'bg-gradient-to-br from-green-50 to-white',
              dark: 'bg-gradient-to-br from-green-900/40 to-gray-800'
            })}
            icon={<FaCheckCircle className="text-green-600 text-lg" />}
          />
        </div>

        {/* Grid de secciones detalladas */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 lg:mb-8">
          
          {/* Sección de Documentos */}
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
                  <FaFileAlt className={conditionalClasses({
                    light: 'text-purple-600 text-lg',
                    dark: 'text-purple-400 text-lg'
                  })} />
                </div>
                <div>
                  <h2 className={conditionalClasses({
                    light: 'text-base sm:text-lg font-bold text-gray-900',
                    dark: 'text-base sm:text-lg font-bold text-gray-100'
                  })}>Gestión Documental</h2>
                  <p className={conditionalClasses({
                    light: 'text-xs text-gray-500',
                    dark: 'text-xs text-gray-400'
                  })}>Estado de documentos ISO</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <MetricCard
                label="Total"
                value={stats.documents.total}
                color="text-purple-600"
                icon={<FaFileAlt className="text-purple-600 text-base" />}
              />
              <MetricCard
                label="Por Vencer"
                value={stats.documents.expiringSoon}
                color="text-amber-600"
                icon={<FaClock className="text-amber-600 text-base" />}
              />
              <MetricCard
                label="Vencidos"
                value={stats.documents.expired}
                color="text-red-600"
                icon={<FaExclamationTriangle className="text-red-600 text-base" />}
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
                })}>Salud documental</span>
                <span className={conditionalClasses({
                  light: 'text-sm font-bold text-gray-900',
                  dark: 'text-sm font-bold text-gray-100'
                })}>{documentHealthRate}%</span>
              </div>
              <div className={conditionalClasses({
                light: 'w-full bg-gray-200 rounded-full h-2 overflow-hidden',
                dark: 'w-full bg-gray-600 rounded-full h-2 overflow-hidden'
              })}>
                <div
                  className="bg-linear-to-r from-purple-600 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${documentHealthRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Sección de Tickets de Calidad */}
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
                  })}>Gestión ISO 9001</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              <MetricCard
                label="Abiertos"
                value={stats.qualityTickets.open}
                color="text-red-600"
                icon={<FaExclamationCircle className="text-red-600 text-base" />}
              />
              <MetricCard
                label="En Progreso"
                value={stats.qualityTickets.inProgress}
                color="text-blue-600"
                icon={<FaClock className="text-blue-600 text-base" />}
              />
              <MetricCard
                label="Resueltos"
                value={stats.qualityTickets.resolved}
                color="text-green-600"
                icon={<FaCheckCircle className="text-green-600 text-base" />}
              />
              <MetricCard
                label="Cerrados"
                value={stats.qualityTickets.closed}
                color="text-gray-600"
                icon={<FaCheckCircle className="text-gray-600 text-base" />}
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
                })}>{qualityTicketResolutionRate}%</span>
              </div>
              <div className={conditionalClasses({
                light: 'w-full bg-gray-200 rounded-full h-2 overflow-hidden',
                dark: 'w-full bg-gray-600 rounded-full h-2 overflow-hidden'
              })}>
                <div
                  className="bg-linear-to-r from-emerald-600 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${qualityTicketResolutionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Solicitudes de Cambio */}
        <div className={conditionalClasses({
          light: 'bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6',
          dark: 'bg-gray-800 rounded-xl shadow-sm border border-gray-600 p-4 sm:p-6'
        })}>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className={conditionalClasses({
                light: 'p-2.5 bg-blue-100 rounded-lg',
                dark: 'p-2.5 bg-blue-900/30 rounded-lg'
              })}>
                <FaExchangeAlt className={conditionalClasses({
                  light: 'text-blue-600 text-lg',
                  dark: 'text-blue-400 text-lg'
                })} />
              </div>
              <div>
                <h2 className={conditionalClasses({
                  light: 'text-base sm:text-lg font-bold text-gray-900',
                  dark: 'text-base sm:text-lg font-bold text-gray-100'
                })}>Solicitudes de Cambio Documental</h2>
                <p className={conditionalClasses({
                  light: 'text-xs text-gray-500',
                  dark: 'text-xs text-gray-400'
                })}>Workflow ISO 9001</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
            <MetricCard
              label="Total"
              value={stats.changeRequests.total}
              color="text-blue-600"
              icon={<FaExchangeAlt className="text-blue-600 text-base" />}
            />
            <MetricCard
              label="Pendientes"
              value={stats.changeRequests.pending}
              color="text-amber-600"
              icon={<FaClock className="text-amber-600 text-base" />}
            />
            <MetricCard
              label="Aprobados"
              value={stats.changeRequests.approved}
              color="text-purple-600"
              icon={<FaCheckCircle className="text-purple-600 text-base" />}
            />
            <MetricCard
              label="Publicados"
              value={stats.changeRequests.published}
              color="text-green-600"
              icon={<FaCheckCircle className="text-green-600 text-base" />}
            />
            <MetricCard
              label="Rechazados"
              value={stats.changeRequests.rejected}
              color="text-red-600"
              icon={<FaExclamationTriangle className="text-red-600 text-base" />}
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
              })}>Tasa de aprobación</span>
              <span className={conditionalClasses({
                light: 'text-sm font-bold text-gray-900',
                dark: 'text-sm font-bold text-gray-100'
              })}>{changeRequestCompletionRate}%</span>
            </div>
            <div className={conditionalClasses({
              light: 'w-full bg-gray-200 rounded-full h-2 overflow-hidden',
              dark: 'w-full bg-gray-600 rounded-full h-2 overflow-hidden'
            })}>
              <div
                className="bg-linear-to-r from-blue-600 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${changeRequestCompletionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Alerts Section - Diseño mejorado */}
        {(stats.documents.expired > 0 || stats.documents.expiringSoon > 0) && (
          <div className={conditionalClasses({
            light: 'mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6',
            dark: 'mt-6 bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-4 sm:p-6'
          })}>
            <h3 className={conditionalClasses({
              light: 'text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center',
              dark: 'text-base sm:text-lg font-bold text-white mb-4 flex items-center'
            })}>
              <FaExclamationCircle className="mr-2 text-amber-500" />
              Alertas de Documentos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stats.documents.expired > 0 && (
                <div className={conditionalClasses({
                  light: 'flex items-center p-4 bg-red-50 border border-red-200 rounded-xl',
                  dark: 'flex items-center p-4 bg-red-900/20 border border-red-800/30 rounded-xl'
                })}>
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg mr-3">
                    <FaExclamationTriangle className="text-red-600 text-lg" />
                  </div>
                  <div>
                    <p className={conditionalClasses({ light: 'font-bold text-red-800', dark: 'font-bold text-red-300' })}>
                      {stats.documents.expired} documento(s) vencido(s)
                    </p>
                    <p className={conditionalClasses({ light: 'text-sm text-red-600', dark: 'text-sm text-red-400' })}>
                      Requieren atención inmediata
                    </p>
                  </div>
                </div>
              )}
              {stats.documents.expiringSoon > 0 && (
                <div className={conditionalClasses({
                  light: 'flex items-center p-4 bg-amber-50 border border-amber-200 rounded-xl',
                  dark: 'flex items-center p-4 bg-amber-900/20 border border-amber-800/30 rounded-xl'
                })}>
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg mr-3">
                    <FaClock className="text-amber-600 text-lg" />
                  </div>
                  <div>
                    <p className={conditionalClasses({ light: 'font-bold text-amber-800', dark: 'font-bold text-amber-300' })}>
                      {stats.documents.expiringSoon} documento(s) por vencer
                    </p>
                    <p className={conditionalClasses({ light: 'text-sm text-amber-600', dark: 'text-sm text-amber-400' })}>
                      Vencerán en los próximos 30 días
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityDashboard;
