import React, { useState, useEffect } from 'react';
import { FaTimes, FaHistory, FaUser, FaCalendarAlt, FaEdit, FaPlus, FaTrash, FaEye } from 'react-icons/fa';

const ActaEntregaHistoryModal = ({ 
  show, 
  onClose, 
  title, 
  item, 
  loading: externalLoading, 
  apiCall, 
  moduleName 
}) => {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && apiCall) {
      fetchHistory();
    }
  }, [show, apiCall]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      setHistoryData(response);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE':
        return <FaPlus className="w-4 h-4 text-green-500" />;
      case 'UPDATE':
        return <FaEdit className="w-4 h-4 text-blue-500" />;
      case 'DELETE':
        return <FaTrash className="w-4 h-4 text-red-500" />;
      default:
        return <FaEye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'CREATE':
        return 'Creado';
      case 'UPDATE':
        return 'Actualizado';
      case 'DELETE':
        return 'Eliminado';
      default:
        return action;
    }
  };

  const formatFieldName = (field) => {
    const fieldNames = {
      'it': 'Código IT',
      'propiedad': 'Propiedad',
      'responsable': 'Responsable',
      'area': 'Área',
      'marca': 'Marca',
      'modelo': 'Modelo',
      'serial': 'Serial',
      'tipo_conectividad': 'Tipo de Conectividad',
      'aplicaciones': 'Aplicaciones',
      'sistema_operativo': 'Sistema Operativo',
      'status': 'Estado',
      'warrantyExpiry': 'Vencimiento de Garantía',
      'purchaseDate': 'Fecha de Compra',
      'lastMaintenance': 'Último Mantenimiento',
      'cost': 'Costo',
      'fecha_entrega': 'Fecha de Entrega',
      'fecha_devolucion': 'Fecha de Devolución',
      'estado_equipo_entrega': 'Estado del Equipo (Entrega)',
      'estado_equipo_devolucion': 'Estado del Equipo (Devolución)',
      'observaciones_entrega': 'Observaciones (Entrega)',
      'observaciones_devolucion': 'Observaciones (Devolución)',
      'motivo_entrega': 'Motivo de Entrega',
      'area_recibe': 'Área del Receptor',
      'modelo_equipo': 'Modelo del Equipo',
      'serial_imei': 'Serial/IMEI',
      'linea_telefonica': 'Línea Telefónica',
      'procesador': 'Procesador',
      'ram': 'RAM',
      'almacenamiento': 'Almacenamiento'
    };
    return fieldNames[field] || field;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'No definido';
    if (value === '') return 'Vacío';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    if (value instanceof Date) return value.toLocaleDateString('es-ES');
    if (typeof value === 'object') return JSON.stringify(value);
    return value.toString();
  };

  if (!show) return null;

  const isLoading = externalLoading !== undefined ? externalLoading : loading;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-hidden border-2 border-gray-200 animate-scale-in">
        {/* Header */}
        <div className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FaHistory className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-white">
                  {title || 'Historial de Cambios'}
                </h2>
                {historyData && (
                  <p className="text-sm lg:text-base text-white/80">
                    {historyData.history ? 
                      `${historyData.history.length} cambios registrados` : 
                      Array.isArray(historyData) ? 
                        `${historyData.length} cambios registrados` : 
                        'Historial cargado'
                    }
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all text-white shrink-0"
            >
              <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)] lg:max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 lg:p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#662d91] mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando historial...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8 lg:p-12">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchHistory}
                  className="px-4 py-2 bg-[#662d91] text-white rounded-lg hover:bg-[#7a3da8] transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : !historyData || 
            (Array.isArray(historyData) ? historyData.length === 0 : 
             !historyData.history || historyData.history.length === 0) ? (
            <div className="flex items-center justify-center p-8 lg:p-12">
              <div className="text-center">
                <FaHistory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No hay cambios registrados</p>
                <p className="text-gray-500 text-sm">El historial aparecerá aquí cuando se realicen cambios</p>
              </div>
            </div>
          ) : (
            <div className="p-4 lg:p-6 space-y-4">
              {(historyData.history || historyData).map((record, index) => (
                <div key={record.id || index} className="bg-gray-50 rounded-xl p-4 lg:p-5 border border-gray-200">
                  {/* Header del registro */}
                  <div className="flex items-start justify-between mb-4 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                        {getActionIcon(record.action)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">
                            {getActionLabel(record.action)}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            record.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                            record.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {record.action}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <FaUser className="w-3 h-3" />
                            {record.user || record.userName || 'Sistema'}
                          </div>
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            {formatDate(record.date || record.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cambios específicos */}
                  {record.changes && record.changes.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm">Campos Modificados:</h4>
                      {record.changes.map((change, changeIndex) => (
                        <div key={changeIndex} className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-700 text-sm">
                              {formatFieldName(change.field)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Valor Anterior:</p>
                              <p className="text-sm text-gray-900 bg-red-50 p-2 rounded border-l-4 border-red-400">
                                {formatValue(change.oldValue)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Valor Nuevo:</p>
                              <p className="text-sm text-gray-900 bg-green-50 p-2 rounded border-l-4 border-green-400">
                                {formatValue(change.newValue)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : record.action === 'CREATE' ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800 font-medium">
                        ✓ {moduleName === 'acta' ? 'Acta de entrega' : 'Elemento'} creado exitosamente
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Todos los campos fueron establecidos por primera vez
                      </p>
                    </div>
                  ) : record.action === 'DELETE' ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800 font-medium">
                        ⚠ {moduleName === 'acta' ? 'Acta de entrega' : 'Elemento'} eliminado
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        El {moduleName === 'acta' ? 'acta' : 'elemento'} fue eliminado del sistema
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        ℹ Se registraron cambios, pero no se detectaron diferencias en los campos principales
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 lg:p-6 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#662d91] hover:bg-[#7a3da8] text-white font-semibold rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActaEntregaHistoryModal;