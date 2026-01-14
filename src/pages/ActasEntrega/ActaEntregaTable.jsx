import React, { useState } from 'react';
import { FaEdit, FaTrash, FaHistory, FaFilePdf, FaFileWord, FaPrint, FaDownload } from 'react-icons/fa';
import { exportToPDF, exportToWord, printActa } from './ActaEntregaExporter';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const ActaEntregaTable = ({
  actas,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  onHistory
}) => {
  const { conditionalClasses } = useThemeClasses();
  const [exportMenuVisible, setExportMenuVisible] = useState(null);

  const handleExport = async (acta, type) => {
    try {
      // Obtener información del equipo
      let equipo = null;
      try {
        const response = await fetch(`/api/actas-entrega/${acta.id}`);
        const actaData = await response.json();
        // Aquí podrías obtener los datos del equipo desde la respuesta
        // Por ahora usamos datos básicos
        equipo = actaData;
      } catch {
        console.log('Usando datos básicos del acta para exportación');
      }

      switch (type) {
        case 'pdf':
          await exportToPDF(acta, equipo);
          break;
        case 'word':
          await exportToWord(acta, equipo);
          break;
        case 'print':
          printActa(acta, equipo);
          break;
      }
    } catch (error) {
      console.error('Error en exportación:', error);
    }
    setExportMenuVisible(null);
  };

  const toggleExportMenu = (actaId) => {
    setExportMenuVisible(exportMenuVisible === actaId ? null : actaId);
  };

  // Cerrar menús al hacer clic fuera
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuVisible && !event.target.closest(`[data-acta-id="${exportMenuVisible}"]`)) {
        setExportMenuVisible(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [exportMenuVisible]);

  return (
    <div className={conditionalClasses({
      light: 'bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden',
      dark: 'bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-700 overflow-hidden'
    })}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] text-white">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">ID</th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Tipo</th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Receptor</th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Fecha Entrega</th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Motivo</th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className={conditionalClasses({
            light: 'divide-y divide-gray-200',
            dark: 'divide-y divide-gray-700'
          })}>
            {actas.map((acta) => (
              <tr key={acta.id} className={conditionalClasses({
                light: 'hover:bg-[#f3ebf9] transition-colors',
                dark: 'hover:bg-gray-700 transition-colors'
              })}>
                <td className="px-4 py-4">
                  <span className="font-bold text-[#662d91]">#{acta.id}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    acta.tipo_equipo === 'inventory' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {acta.tipo_equipo === 'inventory' ? 'PC/Laptop' : 'Celular'}
                  </span>
                </td>
                <td className={conditionalClasses({
                  light: 'px-4 py-4 text-sm text-gray-700',
                  dark: 'px-4 py-4 text-sm text-gray-300'
                })}>
                  {acta.usuarioRecibe?.name || acta.usuarioEntrega?.name || 'Usuario no encontrado'}
                </td>
                <td className={conditionalClasses({
                  light: 'px-4 py-4 text-sm text-gray-700',
                  dark: 'px-4 py-4 text-sm text-gray-300'
                })}>
                  {new Date(acta.fecha_entrega).toLocaleDateString('es-ES')}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    acta.fecha_devolucion ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {acta.fecha_devolucion ? 'Devuelto' : 'Entregado'}
                  </span>
                </td>
                <td className={conditionalClasses({
                  light: 'px-4 py-4 text-sm text-gray-700',
                  dark: 'px-4 py-4 text-sm text-gray-300'
                })}>
                  {(() => {
                    const motivos = {
                      'nuevo_empleado': 'Nuevo empleado',
                      'cambio_equipo': 'Cambio de equipo',
                      'mantenimiento': 'Mantenimiento',
                      'fallas': 'Fallas técnicas',
                      'otros': 'Otros'
                    };
                    return motivos[acta.motivo_entrega] || acta.motivo_entrega;
                  })()}
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-1">
                    {/* Botón de exportar con menú desplegable */}
                    <div className="relative" data-acta-id={acta.id}>
                      <button
                        onClick={() => toggleExportMenu(acta.id)}
                        className={conditionalClasses({
                          light: 'p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all',
                          dark: 'p-2 text-gray-400 hover:bg-gray-600 rounded-lg transition-all'
                        })}
                        title="Exportar"
                      >
                        <FaDownload className="w-4 h-4" />
                      </button>

                      {exportMenuVisible === acta.id && (
                        <div className={conditionalClasses({
                          light: 'absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]',
                          dark: 'absolute right-0 top-full mt-1 bg-gray-800 rounded-lg shadow-lg border border-gray-600 py-1 z-10 min-w-[120px]'
                        })}>
                          <button
                            onClick={() => handleExport(acta, 'pdf')}
                            className={conditionalClasses({
                              light: 'w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700',
                              dark: 'w-full px-3 py-2 text-left hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-300'
                            })}
                          >
                            <FaFilePdf className="w-4 h-4 text-red-500" />
                            PDF
                          </button>
                          <button
                            onClick={() => handleExport(acta, 'word')}
                            className={conditionalClasses({
                              light: 'w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700',
                              dark: 'w-full px-3 py-2 text-left hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-300'
                            })}
                          >
                            <FaFileWord className="w-4 h-4 text-blue-500" />
                            Word
                          </button>
                          <button
                            onClick={() => handleExport(acta, 'print')}
                            className={conditionalClasses({
                              light: 'w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700',
                              dark: 'w-full px-3 py-2 text-left hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-300'
                            })}
                          >
                            <FaPrint className="w-4 h-4 text-gray-500" />
                            Imprimir
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Botón de historial */}
                    <button
                      onClick={() => onHistory(acta.id)}
                      className={conditionalClasses({
                        light: 'p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all',
                        dark: 'p-2 text-purple-400 hover:bg-purple-900/30 rounded-lg transition-all'
                      })}
                      title="Historial"
                    >
                      <FaHistory className="w-4 h-4" />
                    </button>

                    {/* Botón de editar */}
                    {canEdit && (
                      <button
                        onClick={() => onEdit(acta)}
                        className={conditionalClasses({
                          light: 'p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all',
                          dark: 'p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-all'
                        })}
                        title="Editar"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                    )}

                    {/* Botón de eliminar */}
                    {canDelete && (
                      <button
                        onClick={() => onDelete(acta.id)}
                        className={conditionalClasses({
                          light: 'p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all',
                          dark: 'p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-all'
                        })}
                        title="Eliminar"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActaEntregaTable;