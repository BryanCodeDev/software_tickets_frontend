/**
 * Utilidades de debugging para actas de entrega
 * Estas funciones ayudan a diagnosticar problemas en el frontend
 */

import actaEntregaAPI from '../api/actaEntregaAPI';

export const debugActasEntrega = {
  /**
   * Verifica la conectividad con el backend
   */
  async testBackendConnection() {
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  },

  /**
   * Prueba la API de actas de entrega
   */
  async testActasAPI() {
    try {
      // Obtener token del localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        return false;
      }

      // Probar endpoint de actas
      const response = await fetch('/api/actas-entrega', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const _actas = await response.json();
        return true;
      } else {
        const _errorText = await response.text();
        return false;
      }
    } catch {
      return false;
    }
  },

  /**
   * Prueba la creación de un acta de prueba
   */
  async testCreateActa() {
    try {
      // Datos de prueba
      const testData = {
        tipo_equipo: 'inventory',
        equipo_id: 1, // Asegúrate de que este ID existe
        usuario_recibe_id: 1, // Asegúrate de que este ID existe
        fecha_entrega: new Date().toISOString().split('T')[0],
        estado_equipo_entrega: 'Buen estado - Prueba',
        observaciones_entrega: 'Acta de prueba creada para debugging',
        acepta_politica: true,
        cargo_recibe: 'Usuario de prueba',
        motivo_entrega: 'prueba_sistema'
      };

      const response = await actaEntregaAPI.create(testData);
      return response;
    } catch {
      return null;
    }
  },

  /**
   * Verifica el estado de los componentes React
   */
  checkReactState() {
    // Verificar si estamos en el navegador
    if (typeof window === 'undefined') {
      return;
    }

    // Verificar localStorage
    const _token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (user) {
      try {
        const _userData = JSON.parse(user);
      } catch {
        // Error parsing user data, continue
      }
    }

    // Verificar variables de entorno
    // (Información disponible pero no mostrada en consola)
  },

  /**
   * Función principal de diagnóstico
   */
  async runFullDiagnostics() {
    // 1. Verificar estado de React
    this.checkReactState();
    
    // 2. Verificar conectividad con backend
    const backendConnected = await this.testBackendConnection();
    
    if (backendConnected) {
      // 3. Probar API de actas
      const apiWorking = await this.testActasAPI();
      
      if (apiWorking) {
        // 4. Probar creación de acta
        const _actaCreated = await this.testCreateActa();
      }
    }
    
  }
};

// Auto-ejecutar diagnóstico si estamos en desarrollo
if (import.meta.env.DEV && typeof window !== 'undefined') {
  // Esperar a que la página cargue
  setTimeout(() => {
    // Hacer disponible globalmente para testing manual
    window.debugActasEntrega = debugActasEntrega;
  }, 2000);
}