# 📋 Guía de Uso - Gestión de Roles y Permisos

## 🎯 Resumen de Mejoras

El componente de gestión de roles ha sido completamente mejorado para ofrecer una experiencia más intuitiva y potente en la administración de permisos del sistema.

## ✨ Nuevas Funcionalidades

### 1. 📊 **Panel de Estadísticas Mejorado**
- **Total Roles**: Muestra el número total de roles en el sistema
- **Roles Sistema**: Cuenta roles predefinidos (Administrador, Técnico, etc.)
- **Roles Personalizados**: Roles creados por usuarios
- **Total Permisos**: Número de permisos disponibles
- **Permisos Promedio**: Promedio de permisos por rol

### 2. 🔍 **Vista Previa de Permisos**
- **Botón "Ver"**: Permite visualizar todos los permisos de un rol sin editarlo
- **Resumen por Módulo**: Muestra qué permisos tiene cada rol en cada módulo
- **Indicadores Visuales**: 
  - 🟢 Verde: Acceso completo al módulo
  - 🟡 Amarillo: Acceso parcial
  - ⚪ Gris: Sin acceso

### 3. 🎛️ **Edición de Permisos Mejorada**
- **Selección por Módulo**: Botones "Marcar todo/Desmarcar todo" por cada módulo
- **Seguimiento de Cambios**: Muestra qué permisos se están modificando
- **Validación en Tiempo Real**: Previene configuraciones incorrectas

### 4. 📤 **Exportación de Configuración**
- **Exportar Roles**: Descarga toda la configuración de roles en formato JSON
- **Incluye**: Nombre, nivel, descripción y permisos de cada rol
- **Fecha y Autor**: Registra quién y cuándo se exportó

### 5. 🛡️ **Validación de Configuración**
- **Detección de Problemas**: Identifica roles sin permisos críticos
- **Advertencias**: Alerta sobre configuraciones potencialmente problemáticas
- **Errores Críticos**: Detecta roles que deben tener permisos específicos

## 🚀 Cómo Usar las Nuevas Funciones

### 👤 **Para Administradores del Sistema**

#### 1. **Visualizar Permisos de un Rol**
1. Ve al panel de gestión de roles
2. Busca el rol que quieres consultar
3. Haz clic en el botón **"Ver"** (icono de ojo)
4. Explora la vista previa detallada de permisos por módulo

#### 2. **Editar Permisos Eficientemente**
1. Selecciona un rol y haz clic en **"Editar"**
2. Usa los botones **"Marcar todo"** para asignar todos los permisos de un módulo
3. O selecciona permisos individuales según necesites
4. Guarda los cambios

#### 3. **Exportar Configuración**
1. Haz clic en **"Acciones"** en la parte superior
2. Selecciona **"Exportar"**
3. Se descargará un archivo JSON con toda la configuración

#### 4. **Copiar Permisos entre Roles**
1. Selecciona el rol origen y destino
2. Usa la función de copiar permisos (disponible en el menú de acciones rápidas)

### 🔧 **Para Usuarios con Permisos de Edición**

#### 1. **Crear Nuevos Roles**
1. Haz clic en **"Nuevo Rol"**
2. Completa la información básica (nombre, nivel, descripción)
3. Asigna permisos módulo por módulo
4. Guarda el nuevo rol

#### 2. **Modificar Roles Existentes**
1. Busca el rol a modificar
2. Haz clic en **"Editar"**
3. Ajusta los permisos según necesites
4. Guarda los cambios

## 📋 **Módulos y Permisos Disponibles**

### 🎫 **Tickets (Gestión de incidencias IT)**
- `view` - Ver tickets
- `create` - Crear tickets
- `edit` - Editar tickets
- `delete` - Eliminar tickets
- `assign` - Asignar tickets
- `close` - Cerrar tickets

### 🛒 **Solicitudes de Compra (Periféricos y electrodomésticos)**
- `view` - Ver solicitudes
- `create` - Crear solicitudes
- `edit` - Editar solicitudes
- `delete` - Eliminar solicitudes
- `approve` - Aprobar solicitudes
- `reject` - Rechazar solicitudes

### 🏆 **Calidad (Gestión de calidad y documentación)**
- `view` - Ver calidad
- `create` - Crear registros
- `edit` - Editar registros
- `delete` - Eliminar registros
- `approve` - Aprobar calidad
- `audit` - Auditar procesos

### 📁 **Documentos (Gestión de documentos de calidad)**
- `view` - Ver documentos
- `create` - Crear documentos
- `edit` - Editar documentos
- `delete` - Eliminar documentos
- `upload` - Subir documentos
- `download` - Descargar documentos

### 🎯 **Ticket Calidad (Reportes de calidad y cambios documentales)**
- `view` - Ver tickets calidad
- `create` - Crear tickets calidad
- `edit` - Editar tickets calidad
- `delete` - Eliminar tickets calidad
- `resolve` - Resolver incidencias
- `track` - Seguimiento

## ⚠️ **Roles Críticos y sus Permisos Requeridos**

### 🔴 **Administrador (Nivel 5)**
- **Acceso completo** a todos los módulos y funciones
- No se puede editar ni eliminar

### 🔵 **Técnico (Nivel 3)**
- **Tickets**: Ver, crear, editar, asignar, cerrar
- **Documentos**: Ver, descargar

### 🟢 **Calidad (Nivel 2)**
- **Calidad**: Acceso completo
- **Documentos**: Ver, crear, editar, upload, download
- **Ticket Calidad**: Acceso completo

### 🟠 **Coordinadora Administrativa (Nivel 3)**
- **Tickets**: Ver, crear, editar, cerrar
- **Documentos**: Ver, download
- **Solicitudes de Compra**: Ver, aprobar

### 🟡 **Jefe (Nivel 4)**
- **Todos los módulos**: Ver, aprobar, auditar
- **Reportes**: Acceso completo a estadísticas

### 🟣 **Compras (Nivel 4)**
- **Solicitudes de Compra**: Acceso completo
- **Documentos**: Ver, download
- **Tickets**: Ver, crear

## 🔍 **Solución de Problemas Comunes**

### ❌ **Error 403: Access Denied**
**Causa**: El usuario no tiene los permisos necesarios para acceder al módulo.

**Solución**:
1. Ve a **Gestión de Roles**
2. Busca el rol del usuario afectado
3. Haz clic en **"Ver"** para revisar sus permisos
4. Si faltan permisos, haz clic en **"Editar"**
5. Activa los permisos necesarios en los módulos correspondientes
6. Guarda los cambios

### ⚠️ **Rol sin permisos críticos**
**Causa**: Un rol importante no tiene los permisos mínimos necesarios.

**Solución**:
1. Revisa la configuración del rol afectado
2. Asegúrate de que tenga los permisos básicos de su área
3. Usa la validación automática del sistema

### 📊 **Permisos no se aplican inmediatamente**
**Causa**: El usuario necesita cerrar y volver a abrir sesión.

**Solución**:
1. Pide al usuario que cierre sesión
2. Que vuelva a iniciar sesión
3. Los nuevos permisos estarán activos

## 🎯 **Mejores Prácticas**

### ✅ **Recomendaciones**
1. **Principio de Mínimo Privilegio**: Da solo los permisos necesarios
2. **Revisión Regular**: Revisa los permisos cada 3 meses
3. **Documenta Cambios**: Anota por qué modificaste permisos
4. **Exporta Copias**: Guarda copias de seguridad de la configuración
5. **Valida Configuración**: Usa la validación automática antes de guardar

### ❌ **Qué Evitar**
1. No des permisos de administrador a usuarios que no los necesitan
2. No dejes roles sin permisos asignados
3. No modifiques roles mientras están en uso activo
4. No elimines roles críticos del sistema

## 📞 **Soporte**

Si tienes problemas o preguntas:
1. Revisa esta guía primero
2. Usa la función de exportación para guardar tu configuración actual
3. Contacta al administrador del sistema
4. Documenta los pasos que seguiste antes del problema

---

**Última actualización**: Enero 2026  
**Versión**: 2.0  
**Compatible con**: Software Tickets Management System v2.0+