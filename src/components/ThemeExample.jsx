import React from 'react';
import { useThemeClasses } from '../hooks/useThemeClasses';
import ThemeToggle from './ThemeToggle';
import Button from './base/Button';

/**
 * Componente de ejemplo que muestra cómo implementar fácilmente el modo oscuro
 * en cualquier página sin modificar manualmente cada clase
 */
const ThemeExample = () => {
  const { conditionalClasses } = useThemeClasses();

  // Ejemplo 1: Configuración simple con clases predefinidas
  const cardConfig = {
    light: 'bg-white border-gray-200 shadow-sm',
    dark: 'bg-gray-800 border-gray-700 shadow-lg'
  };

  const textConfig = {
    light: 'text-gray-900',
    dark: 'text-gray-100'
  };

  const subtextConfig = {
    light: 'text-gray-600',
    dark: 'text-gray-400'
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header con ThemeToggle */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-3xl font-bold ${conditionalClasses(textConfig)}`}>
          Ejemplo de Tema Automático
        </h1>
        <ThemeToggle variant="toggle" showText />
      </div>

      {/* Ejemplo de tarjeta con tema automático */}
      <div className={`rounded-xl border p-6 mb-6 transition-all duration-300 ${conditionalClasses(cardConfig)}`}>
        <h2 className={`text-xl font-semibold mb-4 ${conditionalClasses(textConfig)}`}>
          Tarjeta Adaptativa al Tema
        </h2>
        <p className={`mb-4 ${conditionalClasses(subtextConfig)}`}>
          Esta tarjeta cambia automáticamente sus colores según el tema seleccionado.
          No necesitas modificar clases manualmente.
        </p>
        <div className="flex gap-3">
          <Button variant="primary">Botón Primario</Button>
          <Button variant="secondary">Botón Secundario</Button>
          <Button variant="outline">Botón Outline</Button>
        </div>
      </div>

      {/* Ejemplo 2: Uso del hook en componentes complejos */}
      <ComplexComponent />

      {/* Ejemplo 3: Configuración avanzada */}
      <AdvancedExample />
    </div>
  );
};

/**
 * Ejemplo de componente complejo usando el sistema de temas
 */
const ComplexComponent = () => {
  const { conditionalClasses } = useThemeClasses();

  // Configuración más compleja para diferentes estados
  const componentConfig = {
    header: {
      light: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200',
      dark: 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600'
    },
    content: {
      light: 'bg-white',
      dark: 'bg-gray-900'
    },
    button: {
      light: 'bg-blue-600 hover:bg-blue-700 text-white',
      dark: 'bg-blue-500 hover:bg-blue-600 text-white'
    }
  };

  return (
    <div className={`rounded-xl border overflow-hidden mb-6 ${conditionalClasses(componentConfig.header)}`}>
      <div className={`p-6 ${conditionalClasses(componentConfig.content)}`}>
        <h3 className={`text-lg font-semibold mb-2 ${conditionalClasses({
          light: 'text-gray-900',
          dark: 'text-gray-100'
        })}`}>
          Componente Complejo
        </h3>
        <p className={`mb-4 ${conditionalClasses({
          light: 'text-gray-600',
          dark: 'text-gray-400'
        })}`}>
          Este componente muestra cómo manejar configuraciones complejas con múltiples elementos.
        </p>
        <button className={`px-4 py-2 rounded-lg transition-colors ${conditionalClasses(componentConfig.button)}`}>
          Acción
        </button>
      </div>
    </div>
  );
};

/**
 * Ejemplo de implementación avanzada con estados dinámicos
 */
const AdvancedExample = () => {
  const [isActive, setIsActive] = React.useState(false);
  const { conditionalClasses, darkMode } = useThemeClasses();

  return (
    <div className={`rounded-xl border p-6 transition-all duration-300 ${
      conditionalClasses({
        light: isActive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200',
        dark: isActive ? 'bg-blue-900/20 border-blue-800' : 'bg-gray-800 border-gray-700'
      })
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${conditionalClasses({
        light: 'text-gray-900',
        dark: 'text-gray-100'
      })}`}>
        Ejemplo Avanzado
      </h3>
      
      <p className={`mb-4 ${conditionalClasses({
        light: 'text-gray-600',
        dark: 'text-gray-400'
      })}`}>
        Estado actual: {isActive ? 'Activo' : 'Inactivo'} | Tema: {darkMode ? 'Oscuro' : 'Claro'}
      </p>

      <div className="flex gap-3">
        <Button 
          variant={isActive ? 'danger' : 'success'}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? 'Desactivar' : 'Activar'}
        </Button>
        
        <ThemeToggle variant="switch" />
      </div>

      {/* Ejemplo de uso de clases condicionales para hover states */}
      <div className={`mt-4 p-4 rounded-lg transition-colors ${
        conditionalClasses({
          light: 'bg-white hover:bg-gray-50',
          dark: 'bg-gray-900 hover:bg-gray-800'
        })
      }`}>
        <p className={`text-sm ${conditionalClasses({
          light: 'text-gray-600',
          dark: 'text-gray-400'
        })}`}>
          Área con efectos hover automáticos
        </p>
      </div>
    </div>
  );
};

export default ThemeExample;