import React from 'react';
import { FaExclamationTriangle, FaRedo, FaPaperPlane } from 'react-icons/fa';
import { useThemeClasses } from '../hooks/useThemeClasses';
import api from '../api/api';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Actualizar el estado para que el siguiente renderizado muestre la UI de respaldo
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Registrar el error en la consola
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Enviar reporte de error al backend
    this.reportErrorToBackend(error, errorInfo);
  }

  // Función para enviar el error al backend
  reportErrorToBackend = async (error, errorInfo) => {
    try {
      const errorData = {
        error: {
          message: error?.message || error?.toString() || 'Error desconocido',
          name: error?.name || 'Error',
          stack: error?.stack || ''
        },
        errorInfo: {
          componentStack: errorInfo?.componentStack || ''
        },
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      // Enviar al backend (no bloquea la UI si falla)
      await api.post('/notifications/report-error', errorData, {
        timeout: 5000 // 5 segundos de timeout
      });
      
      console.log('✅ Reporte de error enviado al backend');
    } catch (err) {
      // No mostrar error al usuario, solo registrar en consola
      console.error('❌ Error enviando reporte al backend:', err.message);
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // UI de respaldo
      return (
        <ErrorBoundaryUI 
          handleReload={this.handleReload} 
          handleReset={this.handleReset}
          error={this.state.error}
          errorInfo={this.state.errorInfo}
        />
      );
    }

    // Si no hay error, renderizar los children normalmente
    return this.props.children;
  }
}

const ErrorBoundaryUI = ({ handleReload, handleReset, error, errorInfo }) => {
  const { conditionalClasses } = useThemeClasses();

  return (
    <div className={conditionalClasses({
      light: "min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] flex items-center justify-center p-4",
      dark: "min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4"
    })}>
      <div className={conditionalClasses({
        light: "max-w-md w-full bg-white rounded-xl lg:rounded-2xl shadow-2xl border-2 border-red-200 p-6 lg:p-8 text-center",
        dark: "max-w-md w-full bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl border-2 border-red-700 p-6 lg:p-8 text-center"
      })}>
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <FaExclamationTriangle className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
        </div>

        <h1 className={conditionalClasses({
          light: "text-xl lg:text-2xl font-bold text-gray-900 mb-2",
          dark: "text-xl lg:text-2xl font-bold text-white mb-2"
        })}>
          ¡Ups! Algo salió mal
        </h1>

        <p className={conditionalClasses({
          light: "text-sm lg:text-base text-gray-600 mb-6 leading-relaxed",
          dark: "text-sm lg:text-base text-gray-300 mb-6 leading-relaxed"
        })}>
          Ha ocurrido un error inesperado en la aplicación. Nuestros desarrolladores han sido notificados.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleReload}
            className="w-full flex items-center justify-center gap-2 px-4 lg:px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <FaRedo className="w-4 h-4" />
            Recargar Página
          </button>

          <button
            onClick={handleReset}
            className={conditionalClasses({
              light: "w-full px-4 lg:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200",
              dark: "w-full px-4 lg:px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition-all duration-200"
            })}
          >
            Intentar de Nuevo
          </button>
        </div>

        {/* Mostrar detalles del error solo en desarrollo */}
        {import.meta.env.DEV && error && (
          <details className="mt-6 text-left">
            <summary className={conditionalClasses({
              light: "cursor-pointer text-sm font-semibold text-gray-700 mb-2",
              dark: "cursor-pointer text-sm font-semibold text-gray-300 mb-2"
            })}>
              Detalles del Error (Desarrollo)
            </summary>
            <div className={conditionalClasses({
              light: "bg-gray-100 rounded-lg p-3 text-xs font-mono text-gray-800 overflow-auto max-h-40",
              dark: "bg-gray-700 rounded-lg p-3 text-xs font-mono text-gray-200 overflow-auto max-h-40"
            })}>
              <div className="mb-2">
                <strong>Error:</strong> {error.toString()}
              </div>
              {errorInfo && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre className="whitespace-pre-wrap mt-1">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className={conditionalClasses({
          light: "mt-6 pt-4 border-t border-gray-200",
          dark: "mt-6 pt-4 border-t border-gray-600"
        })}>
          <p className={conditionalClasses({
            light: "text-xs text-gray-500",
            dark: "text-xs text-gray-400"
          })}>
            Si el problema persiste, contacta al soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
