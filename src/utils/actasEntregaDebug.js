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
    console.log('🔍 Probando conectividad con backend...');
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('✅ Backend responde correctamente');
        return true;
      } else {
        console.error('❌ Backend no responde correctamente:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error conectando con backend:', error);
      return false;
    }
  },

  /**
   * Prueba la API de actas de entrega
   */
  async testActasAPI() {
    console.log('🔍 Probando API de actas de entrega...');
    
    try {
      // Obtener token del localStorage
      const token = localStorage.getItem('token');
      console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
      
      if (!token) {
        console.error('❌ No hay token de autenticación');
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

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', [...response.headers.entries()]);

      if (response.ok) {
        const actas = await response.json();
        console.log('✅ API de actas responde correctamente');
        console.log('📊 Actas encontradas:', actas.length);
        console.log('📋 Datos de actas:', actas);
        return true;
      } else {
        const errorText = await response.text();
        console.error('❌ Error en API de actas:', response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error('❌ Error probando API de actas:', error);
      return false;
    }
  },

  /**
   * Prueba la creación de un acta de prueba
   */
  async testCreateActa() {
    console.log('🔍 Probando creación de acta de prueba...');
    
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

      console.log('📝 Datos de prueba:', testData);

      const response = await actaEntregaAPI.create(testData);
      console.log('✅ Acta de prueba creada exitosamente:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creando acta de prueba:', error);
      return null;
    }
  },

  /**
   * Verifica el estado de los componentes React
   */
  checkReactState() {
    console.log('🔍 Verificando estado de componentes React...');
    
    // Verificar si estamos en el navegador
    if (typeof window === 'undefined') {
      console.log('⚠️ No estamos en el navegador');
      return;
    }

    // Verificar localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    console.log('💾 LocalStorage - Token:', token ? 'Presente' : 'Ausente');
    console.log('💾 LocalStorage - User:', user ? 'Presente' : 'Ausente');
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log('👤 Datos de usuario:', userData);
      } catch (error) {
        console.error('❌ Error parseando datos de usuario:', error);
      }
    }

    // Verificar variables de entorno
    console.log('🌍 Variables de entorno:');
    console.log('  - VITE_API_URL:', import.meta.env.VITE_API_URL || 'No definida');
    console.log('  - VITE_APP_TITLE:', import.meta.env.VITE_APP_TITLE || 'No definida');
  },

  /**
   * Función principal de diagnóstico
   */
  async runFullDiagnostics() {
    console.log('🚀 === INICIANDO DIAGNÓSTICO COMPLETO ===\n');
    
    // 1. Verificar estado de React
    this.checkReactState();
    console.log('');
    
    // 2. Verificar conectividad con backend
    const backendConnected = await this.testBackendConnection();
    console.log('');
    
    if (backendConnected) {
      // 3. Probar API de actas
      const apiWorking = await this.testActasAPI();
      console.log('');
      
      if (apiWorking) {
        // 4. Probar creación de acta
        const actaCreated = await this.testCreateActa();
        console.log('');
      }
    }
    
    console.log('🏁 === DIAGNÓSTICO COMPLETADO ===\n');
    
    // 5. Recomendaciones
    console.log('💡 RECOMENDACIONES:');
    console.log('1. Si hay errores de conectividad, verifica que el backend esté ejecutándose');
    console.log('2. Si hay errores 401/403, verifica tu token de autenticación');
    console.log('3. Si hay errores 500, revisa los logs del backend');
    console.log('4. Si no hay actas mostradas, verifica los permisos del usuario');
    console.log('5. Reinicia el servidor frontend si es necesario');
  }
};

// Auto-ejecutar diagnóstico si estamos en desarrollo
if (import.meta.env.DEV && typeof window !== 'undefined') {
  // Esperar a que la página cargue
  setTimeout(() => {
    console.log('🔧 Modo desarrollo detectado. ¿Ejecutar diagnóstico de actas de entrega?');
    console.log('Ejecuta: debugActasEntrega.runFullDiagnostics()');
    
    // Hacer disponible globalmente para testing manual
    window.debugActasEntrega = debugActasEntrega;
  }, 2000);
}