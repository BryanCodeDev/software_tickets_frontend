import React from 'react';
import { FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const NotificationSystem = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div className="fixed top-3 right-3 left-3 sm:top-4 sm:right-4 sm:left-auto z-50 max-w-sm animate-slide-in-right">
      <div className={`flex items-center p-3 sm:p-4 rounded-xl shadow-2xl border-2 transition-all duration-300 ${
        notification.type === 'success'
          ? 'bg-white border-green-400 text-green-800'
          : 'bg-white border-red-400 text-red-800'
      }`}>
        <div className="shrink-0">
          {notification.type === 'success' ? (
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
          )}
        </div>
        <div className="ml-3 sm:ml-4 flex-1">
          <p className="text-xs sm:text-sm font-semibold">{notification.message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 sm:ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationSystem;