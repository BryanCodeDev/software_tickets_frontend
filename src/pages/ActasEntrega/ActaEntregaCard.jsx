import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrash, FaUser, FaCalendarAlt, FaFilePdf, FaFileWord, FaPrint, FaDownload, FaHistory } from 'react-icons/fa';
import { exportToPDF, exportToWord, printActa } from './ActaEntregaExporter';
import inventoryAPI from '../../api/inventoryAPI';
import corporatePhoneAPI from '../../api/corporatePhoneAPI';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const ActaEntregaCard = ({ acta, onEdit, onDelete, onHistory, canEdit, canDelete }) => {
  const { conditionalClasses } = useThemeClasses();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [equipo, setEquipo] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchEquipo = async () => {
    try {
      if (acta.tipo_equipo === 'inventory') {
        const data = await inventoryAPI.fetchInventory();
        const found = data.find(item => item.id === acta.equipo_id);
        setEquipo(found);
      } else {
        const data = await corporatePhoneAPI.getAll();
        const found = data.find(item => item.id === acta.equipo_id);
        setEquipo(found);
      }
    } catch (err) {
      console.error('Error fetching equipo:', err);
    }
  };

  const handleExport = async (type) => {
    if (!equipo) await fetchEquipo();

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
    setShowExportMenu(false);
  };
  return (
    <div className={conditionalClasses({
      light: 'bg-white rounded-xl lg:rounded-2xl border-2 border-gray-200 hover:border-[#8e4dbf] hover:shadow-xl transition-all duration-300 overflow-hidden group',
      dark: 'bg-gray-800 rounded-xl lg:rounded-2xl border-2 border-gray-600 hover:border-[#8e4dbf] hover:shadow-xl transition-all duration-300 overflow-hidden group'
    })}>
      {/* Card Header */}
      <div className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-3 lg:p-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base lg:text-lg font-bold truncate">
                Acta #{acta.id}
              </h3>
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                acta.fecha_devolucion ? 'bg-green-400 text-green-900' : 'bg-blue-400 text-blue-900'
              }`}>
                {acta.fecha_devolucion ? 'Devuelto' : 'Entregado'}
              </span>
            </div>
            <p className="text-xs lg:text-sm opacity-90 truncate">
              {acta.tipo_equipo === 'inventory' ? 'Computadora' : 'Teléfono'} - {acta.motivo_entrega}
            </p>
          </div>
          <div className="flex gap-1 lg:gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {/* Botón de exportar con menú desplegable */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-1.5 lg:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all touch-manipulation"
                title="Exportar"
              >
                <FaDownload className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>

              {showExportMenu && (
                <div className={conditionalClasses({
                  light: 'absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-30',
                  dark: 'absolute right-0 top-full mt-1 bg-gray-800 rounded-lg shadow-lg border border-gray-600 py-1 z-10 min-w-30'
                })}>
                  <button
                    onClick={() => handleExport('pdf')}
                    className={conditionalClasses({
                      light: 'w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700',
                      dark: 'w-full px-3 py-2 text-left hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-300'
                    })}
                  >
                    <FaFilePdf className="w-4 h-4 text-red-500" />
                    PDF
                  </button>
                  <button
                    onClick={() => handleExport('word')}
                    className={conditionalClasses({
                      light: 'w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700',
                      dark: 'w-full px-3 py-2 text-left hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-300'
                    })}
                  >
                    <FaFileWord className="w-4 h-4 text-blue-500" />
                    Word
                  </button>
                  <button
                    onClick={() => handleExport('print')}
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

            <button
              onClick={() => onHistory(acta.id)}
              className="p-1.5 lg:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all touch-manipulation"
              title="Historial"
            >
              <FaHistory className="w-3 h-3 lg:w-4 lg:h-4" />
            </button>

            {canEdit && (
              <button
                onClick={() => onEdit(acta)}
                className="p-1.5 lg:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all touch-manipulation"
                title="Editar"
              >
                <FaEdit className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(acta.id)}
                className="p-1.5 lg:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all touch-manipulation"
                title="Eliminar"
              >
                <FaTrash className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 lg:p-5">
        <div className="space-y-3">
          <div className={conditionalClasses({
            light: 'flex items-center gap-3 pb-3 border-b border-gray-100',
            dark: 'flex items-center gap-3 pb-3 border-b border-gray-700'
          })}>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#f3ebf9] rounded-lg flex items-center justify-center shrink-0">
              <FaUser className="w-4 h-4 lg:w-5 lg:h-5 text-[#662d91]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={conditionalClasses({
                light: 'text-xs text-gray-500 font-medium',
                dark: 'text-xs text-gray-400 font-medium'
              })}>Receptor</p>
              <p className={conditionalClasses({
                light: 'text-sm font-bold text-gray-900 truncate',
                dark: 'text-sm font-bold text-gray-100 truncate'
              })}>
                {acta.usuarioRecibe?.name || 'Usuario no encontrado'}
              </p>
            </div>
          </div>

          <div>
            <p className={conditionalClasses({
              light: 'text-xs text-gray-500 font-medium mb-1',
              dark: 'text-xs text-gray-400 font-medium mb-1'
            })}>Fecha Entrega</p>
            <p className={conditionalClasses({
              light: 'text-sm font-semibold text-gray-900',
              dark: 'text-sm font-semibold text-gray-100'
            })}>
              {new Date(acta.fecha_entrega).toLocaleDateString('es-ES')}
            </p>
          </div>

          {acta.fecha_devolucion && (
            <div>
              <p className={conditionalClasses({
                light: 'text-xs text-gray-500 font-medium mb-1',
                dark: 'text-xs text-gray-400 font-medium mb-1'
              })}>Fecha Devolución</p>
              <p className={conditionalClasses({
                light: 'text-sm font-semibold text-green-600',
                dark: 'text-sm font-semibold text-green-400'
              })}>
                {new Date(acta.fecha_devolucion).toLocaleDateString('es-ES')}
              </p>
            </div>
          )}

          <div className={conditionalClasses({
            light: 'pt-3 border-t border-gray-100',
            dark: 'pt-3 border-t border-gray-700'
          })}>
            <p className={conditionalClasses({
              light: 'text-xs text-gray-500 font-medium mb-1',
              dark: 'text-xs text-gray-400 font-medium mb-1'
            })}>Estado del Equipo</p>
            <p className={conditionalClasses({
              light: 'text-xs bg-gray-50 px-3 py-2 rounded-lg text-gray-700 wrap-break-word',
              dark: 'text-xs bg-gray-700 px-3 py-2 rounded-lg text-gray-300 wrap-break-word'
            })}>
              {acta.estado_equipo_entrega}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActaEntregaCard;