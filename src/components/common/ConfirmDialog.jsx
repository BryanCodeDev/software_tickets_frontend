import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ConfirmDialog = React.memo(({ confirmDialog, onClose, onConfirm }) => {
  if (!confirmDialog) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 transform animate-scale-in">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <FaExclamationTriangle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
          </div>
          <h3 className="text-lg lg:text-xl font-bold text-gray-900 text-center mb-3">Confirmar Acción</h3>
          <p className="text-xs sm:text-sm text-gray-600 text-center mb-4 lg:mb-6 leading-relaxed">{confirmDialog.message}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 text-sm lg:text-base touch-manipulation"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm lg:text-base touch-manipulation"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ConfirmDialog.displayName = 'ConfirmDialog';

export default ConfirmDialog;

