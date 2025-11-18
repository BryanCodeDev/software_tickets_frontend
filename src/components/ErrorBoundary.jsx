import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

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

    // También podemos enviar el error a un servicio de reporte de errores
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Aquí podrías enviar el error a un servicio como Sentry, LogRocket, etc.
    // logErrorToService(error, errorInfo);
  }

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
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl lg:rounded-2xl shadow-2xl border-2 border-red-200 p-6 lg:p-8 text-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaExclamationTriangle className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>

            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              ¡Ups! Algo salió mal
            </h1>

            <p className="text-sm lg:text-base text-gray-600 mb-6 leading-relaxed">
              Ha ocurrido un error inesperado en la aplicación. Nuestros desarrolladores han sido notificados.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-4 lg:px-6 py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FaRedo className="w-4 h-4" />
                Recargar Página
              </button>

              <button
                onClick={this.handleReset}
                className="w-full px-4 lg:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
              >
                Intentar de Nuevo
              </button>
            </div>

            {/* Mostrar detalles del error solo en desarrollo */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                  Detalles del Error (Desarrollo)
                </summary>
                <div className="bg-gray-100 rounded-lg p-3 text-xs font-mono text-gray-800 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Si el problema persiste, contacta al soporte técnico.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Si no hay error, renderizar los children normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;
