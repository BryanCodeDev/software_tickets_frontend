import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const Modal = React.memo(({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = ''
}) => {
  const { conditionalClasses } = useThemeClasses();

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div
        className={`
          rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden transform transition-all animate-in zoom-in-95
          ${conditionalClasses({
            light: 'bg-white',
            dark: 'bg-gray-800'
          })}
          ${className}
        `}
        onClick={handleBackdropClick}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={`
            flex items-center justify-between p-6 border-b
            ${conditionalClasses({
              light: 'border-gray-200',
              dark: 'border-gray-700'
            })}
          `}>
            {title && (
              <h2 className={`
                text-xl font-bold
                ${conditionalClasses({
                  light: 'text-gray-900',
                  dark: 'text-gray-100'
                })}
              `}>{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={`
                  p-2 rounded-lg transition-colors
                  ${conditionalClasses({
                    light: 'hover:bg-gray-100 text-gray-500 hover:text-gray-700',
                    dark: 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                  })}
                `}
              >
                <FaTimes className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-5rem)]">
          {children}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export default Modal;
