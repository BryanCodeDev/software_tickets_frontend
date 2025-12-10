import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ActaEntregaTable = ({ actas, onEdit, onDelete, canEdit, canDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
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
              {(canEdit || canDelete) && (
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {actas.map((acta) => (
              <tr key={acta.id} className="hover:bg-[#f3ebf9] transition-colors">
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
                <td className="px-4 py-4 text-sm text-gray-700">
                  {acta.usuarioRecibe?.name || acta.usuarioEntrega?.name || 'Usuario no encontrado'}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {new Date(acta.fecha_entrega).toLocaleDateString('es-ES')}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    acta.fecha_devolucion ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {acta.fecha_devolucion ? 'Devuelto' : 'Entregado'}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
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
                {(canEdit || canDelete) && (
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {canEdit && (
                        <button
                          onClick={() => onEdit(acta)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Editar"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => onDelete(acta.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Eliminar"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActaEntregaTable;