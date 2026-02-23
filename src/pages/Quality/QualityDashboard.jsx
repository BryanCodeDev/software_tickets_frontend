import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaExchangeAlt, FaTicketAlt, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaClock, FaAlertCircle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { qualityTicketsAPI } from '../../api/qualityTicketsAPI';
import documentsAPI from '../../api/documentsAPI';
import documentChangeRequestsAPI from '../../api/documentChangeRequestsAPI';

const QualityDashboard = () => {
  const { user } = useAuth();
  const { conditionalClasses } = useThemeClasses();
  const userRole = user?.role?.name;
  
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

  if (loading) {
    return (
      <div className={conditionalClasses({
        light: 'min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] flex items-center justify-center',
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
      light: 'min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] py-4 px-3 sm:py-6 sm:px-4 lg:px-8',
      dark: 'min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-4 px-3 sm:py-6 sm:px-4 lg:px-8'
    })}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className={conditionalClasses({
            light: 'text-2xl sm:text-3xl font-bold text-gray-900',
            dark: 'text-2xl sm:text-3xl font-bold text-white'
          })}>
            <FaChartLine className="inline mr-3 text-[#662d91]" />
            Dashboard de Calidad
          </h1>
          <p className={conditionalClasses({
            light: 'text-gray-600 mt-1',
            dark: 'text-gray-400 mt-1'
          })}>
            Vista unificada de gestión documental y calidad ISO 9001
          </p>
        </div>

        {/* Stats Cards - Documents */}
        <div className="mb-6">
          <h2 className={conditionalClasses({
            light: 'text-lg font-bold text-gray-900 mb-3 flex items-center',
            dark: 'text-lg font-bold text-white mb-3 flex items-center'
          })}>
            <FaFileAlt className="mr-2 text-[#662d91]" />
            Gestión Documental
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={conditionalClasses({
              light: 'bg-white rounded-xl p-4 shadow-md border border-gray-200',
              dark: 'bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700'
            })}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>Total Documentos</p>
                  <p className={conditionalClasses({ light: 'text-2xl font-bold text-gray-900', dark: 'text-2xl font-bold text-white' })}>{stats.documents.total}</p>
                </div>
                <div className={conditionalClasses({ light: 'w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center', dark: 'w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center' })}>
                  <FaFileAlt className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>

            <div className={conditionalClasses({
              light: 'bg-white rounded-xl p-4 shadow-md border border-gray-200',
              dark: 'bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700'
            })}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>Por Vencer (30 días)</p>
                  <p className={conditionalClasses({ light: 'text-2xl font-bold text-yellow-600', dark: 'text-2xl font-bold text-yellow-400' })}>{stats.documents.expiringSoon}</p>
                </div>
                <div className={conditionalClasses({ light: 'w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center', dark: 'w-12 h-12 bg-yellow-900/50 rounded-full flex items-center justify-center' })}>
                  <FaClock className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>

            <div className={conditionalClasses({
              light: 'bg-white rounded-xl p-4 shadow-md border border-gray-200',
              dark: 'bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700'
            })}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>Vencidos</p>
                  <p className={conditionalClasses({ light: 'text-2xl font-bold text-red-600', dark: 'text-2xl font-bold text-red-400' })}>{stats.documents.expired}</p>
                </div>
                <div className={conditionalClasses({ light: 'w-12 h-12 bg-red-100 rounded-full flex items-center justify-center', dark: 'w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center' })}>
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Change Requests */}
        <div className="mb-6">
          <h2 className={conditionalClasses({
            light: 'text-lg font-bold text-gray-900 mb-3 flex items-center',
            dark: 'text-lg font-bold text-white mb-3 flex items-center'
          })}>
            <FaExchangeAlt className="mr-2 text-[#662d91]" />
            Solicitudes de Cambio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className={conditionalClasses({
              light: 'bg-white rounded-xl p-4 shadow-md border border-gray-200',
              dark: 'bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700'
            })}>
              <p className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>Total</p>
              <p className={conditionalClasses({ light: 'text-2xl font-bold text-gray-900', dark: 'text-2xl font-bold text-white' })}>{stats.changeRequests.total}</p>
            </div>

            <div className={conditionalClasses({
              light: 'bg-white rounded-xl p-4 shadow-md border border-gray-200',
              dark: 'bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700'
            })}>
              <p className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>Pendientes</p>
              <p className={conditionalClasses({ light: 'text-2xl font-bold text-yellow-600', dark: 'text-2xl font-bold text-yellow-400' })}>{stats.changeRequests.pending}</p>
            </div>

            <div className={conditionalClasses({
              light: 'bg-white rounded-xl p-4 shadow-md border border-gray-200',
              dark: 'bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700'
            })}>
              <p className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>Aprobados</p>
              <p className={conditionalClasses({ light: 'text-2xl font-bold text-blue-600', dark: 'text-2xl font-bold text-blue-400' })}>{stats.changeRequests.approved}</p>
            </div>

            <div className={conditionalClasses({
              light: 'bg-white rounded-xl p-4 shadow-md border border-gray-200',
              dark: 'bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700'
            })}>
              <p className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>Publicados</p>
              <p className={conditionalClasses({ light: 'text-2xl font-bold text-green-600', dark: 'text-2xl font-bold text-green-400' })}>{stats.changeRequests.published}</p>
            </div>

            <div className={conditionalClasses({
              light: 'bg-white rounded-xl p-4 shadow-md border border-gray-200',
              dark: 'bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700'
            })}>
              <p className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>Rechazados</p>
              <p className={conditionalClasses({ light: 'text-2xl font-bold text-red-600', dark: 'text-2xl font-bold text-red-400' })}>{stats.changeRequests.rejected}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards - Quality Tickets */}
        <div className="mb-6">
          <h2 className={conditionalClasses({
            light: 'text-lg font-bold text-gray-900 mb-3 flex items-center',
            dark: 'text-lg font-bold text-white mb-3 flex items-center'
          })}>
            <FaTicketAlt className="mr-2 text-[#662d91]" />
            Tickets de Calidad
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className={conditionalClasses({
              light: 'bg-white rounded-xl p-4 shadow-md border border-gray-200',
              dark: 'bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700'
            })}>
              <p className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>Total</p>
              <p className={conditionalClasses({ light: 'text-2xl font-bold text-gray-900', dark: 'text-2xl font-bold text-white' })}>{stats.qualityTickets.total}</p>
            </div>

            <div className={conditionalClasses({
              light: 'bg-white rounded-xl p-4 shadow-md border border-gray-200',
              dark: 'bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700'
            })}>
              <p className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>Abiertos</p>
              <p className={conditionalClasses({ light: 'text-2xl font-bold text-red-600', dark: 'text-2xl font-bold text-red-400' })}>{stats.qualityTickets.open}</p>
            </div>

            <div className={conditionalClasses({
              light: 'bg-white rounded-xl p-4 shadow-md border border-gray-200',
              dark: 'bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700'
            })}>
              <p className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>En Progreso</p>
              <p className={conditionalClasses({ light: 'text-2xl font-bold text-blue-600', dark: 'text-2xl font-bold text-blue-400' })}>{stats.qualityTickets.inProgress}</p>
            </div>

            <div className={conditionalClasses({
              light: 'bg-white rounded-xl p-4 shadow-md border border-gray-200',
              dark: 'bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700'
            })}>
              <p className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>Resueltos</p>
              <p className={conditionalClasses({ light: 'text-2xl font-bold text-green-600', dark: 'text-2xl font-bold text-green-400' })}>{stats.qualityTickets.resolved}</p>
            </div>

            <div className={conditionalClasses({
              light: 'bg-white rounded-xl p-4 shadow-md border border-gray-200',
              dark: 'bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700'
            })}>
              <p className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>Cerrados</p>
              <p className={conditionalClasses({ light: 'text-2xl font-bold text-gray-600', dark: 'text-2xl font-bold text-gray-400' })}>{stats.qualityTickets.closed}</p>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {(stats.documents.expired > 0 || stats.documents.expiringSoon > 0) && (
          <div className={conditionalClasses({
            light: 'bg-white rounded-xl p-6 shadow-md border border-gray-200',
            dark: 'bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700'
          })}>
            <h3 className={conditionalClasses({
              light: 'text-lg font-bold text-gray-900 mb-4 flex items-center',
              dark: 'text-lg font-bold text-white mb-4 flex items-center'
            })}>
              <FaAlertCircle className="mr-2 text-yellow-500" />
              Alertas de Documentos
            </h3>
            <div className="space-y-3">
              {stats.documents.expired > 0 && (
                <div className={conditionalClasses({
                  light: 'flex items-center p-3 bg-red-50 border border-red-200 rounded-lg',
                  dark: 'flex items-center p-3 bg-red-900/20 border border-red-800/30 rounded-lg'
                })}>
                  <FaExclamationTriangle className="text-red-500 mr-3" />
                  <span className={conditionalClasses({ light: 'text-red-700', dark: 'text-red-300' })}>
                    {stats.documents.expired} documento(s) vencido(s) requieren atención inmediata
                  </span>
                </div>
              )}
              {stats.documents.expiringSoon > 0 && (
                <div className={conditionalClasses({
                  light: 'flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg',
                  dark: 'flex items-center p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-lg'
                })}>
                  <FaClock className="text-yellow-500 mr-3" />
                  <span className={conditionalClasses({ light: 'text-yellow-700', dark: 'text-yellow-300' })}>
                    {stats.documents.expiringSoon} documento(s) vencerán en los próximos 30 días
                  </span>
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
