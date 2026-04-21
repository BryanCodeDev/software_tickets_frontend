# DuvyClass - Sistema IT de Gestión Tecnológica v2.1

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://mysql.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

Una plataforma web interna completa para la gestión tecnológica de empresas, que centraliza soporte técnico, inventario IT, documentación, gestión de calidad, compras y credenciales en una interfaz moderna y segura.

**Última actualización**: Abril 2026  
**Versión**: 2.1  
**Estado**: Producción (10/10)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Nuevas Funcionalidades Recientes](#-nuevas-funcionalidades-recientes)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso del Sistema](#-uso-del-sistema)
- [API Documentation](#-api-documentation)
- [Base de Datos](#-base-de-datos)
- [Roles y Permisos](#-roles-y-permisos)
- [Funcionalidades](#-funcionalidades)
- [Sistema de Notificaciones](#-sistema-de-notificaciones)
- [Reportes y Búsqueda](#-reportes-y-búsqueda)
- [Desarrollo](#-desarrollo)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

### ⚡ Optimizaciones Técnicas (v2.1)

#### 🚀 Rendimiento Frontend
- **Memoización**: React.memo en componentes base
- **Lazy Loading**: Carga diferida de rutas y componentes pesados
- **Code Splitting**: División automática de bundles
- **Hooks Personalizados**: useDebounce (300ms búsqueda), useLocalStorage, useAuth
- **Contextos Globales**: NotificationContext, AuthContext, ThemeContext
- **Componentes Base**: Button, Input, Modal, LoadingSpinner reutilizables

#### 🔧 Rendimiento Backend
- **Paginación Server-Side**: Todos los listados paginados en backend
- **Búsqueda con Debounce**: Espera 300ms antes de ejecutar búsqueda
- **Transacciones ACID**: Operaciones críticas atómicas con rollback
- **Locking Optimista**: Control de concurrencia con campo `version`
- **Winston Logger**: Reemplaza console.error, rotación diaria
- **Filtrado por Rol**: Reportes filtran automáticamente según permisos
- **Compresión Gzip**: Reducción automática de tamaño de respuesta

### 🎫 **Mesa de Ayuda (Help Desk)**
- Creación y gestión de tickets de soporte técnico
- Asignación automática de técnicos según categoría
- Seguimiento en tiempo real del estado de tickets
- Sistema de comentarios y mensajes internos
- Adjuntos de archivos (imágenes, documentos, videos)
- Historial completo de todas las acciones

### 📦 **Inventario IT**
- Registro detallado de equipos tecnológicos
- Control de asignaciones a usuarios y áreas
- Estados de activos (operativo, mantenimiento, fuera de uso)
- Información técnica completa (procesador, RAM, almacenamiento)
- Control de garantías y ubicaciones

### 📄 **Control de Versiones de Documentos**
- **Sistema de Versionado Completo**: Control semántico de versiones (1.0, 1.1, 2.0)
- **Gestión Inteligente**: Crear documentos nuevos o actualizar versiones existentes
- **Historial de Versiones**: Acceso completo al historial de cambios
- **Versiones Activas**: Interfaz optimizada mostrando solo versiones actuales
- **Permisos Granulares**: Control de acceso según roles de usuario
- **Búsqueda Avanzada**: Filtros por tipo, versión, fecha y autor
- **Descarga Selectiva**: Descargar cualquier versión del historial
- **Auditoría Completa**: Registro de cambios y versiones

### 🔐 **Gestión de Credenciales**
- Almacenamiento seguro de credenciales corporativas
- Acceso restringido solo a administradores
- Registro de actividad y auditoría
- Buscador rápido por servicio o sistema
- Encriptación de contraseñas

### 🛡️ **Gestión de Calidad**
- Tickets especializados en calidad y procesos documentales
- Control documental avanzado con permisos específicos por carpeta
- Reportes de no conformidades y cambios de versiones
- Seguimiento de estándares, certificaciones y mejoras en procesos
- Gestión de tickets de calidad para problemas documentales

### 📱 **Teléfonos Corporativos**
- Gestión completa de equipos móviles corporativos
- 4 categorías organizadas: Administración, Asesores, Socios, Reposición
- Control de IMEI, planes tarifarios y asignaciones por responsable
- Seguimiento de garantías, fechas de entrega y estados de equipos
- Acceso restringido por roles (Administradores, Técnicos, Coordinadores)

### 📱 **Tablets y PDAs**
- Gestión específica de dispositivos tablets corporativos
- Control de IMEI, números de serie y asignaciones
- Gestión de planes de datos y apps instaladas
- Dispositivos de captura de datos (PDAs)
- Historial de asignaciones y mantenimiento

### 🏢 **Actas de Entrega**
- Creación y firma digital de actas de entrega
- Inventario detallado de equipos entregados
- Registro de condiciones y responsables
- Historial completo de entregas
- Integración con módulo de inventario

### 🔍 **Búsqueda Global**
- Buscador unificado en toda la plataforma
- Resultados categorizados por módulo
- Filtros automáticos por permisos de usuario
- Navegación directa a resultados

### 📊 **Reportes Descargables**
- Exportación de datos en formato CSV
- Reportes por módulo con toda la información
- Filtros automáticos por permisos
- Archivos compatibles con Excel

## 🏗️ Arquitectura del Sistema

```
DuvyClass/
├── backend/                 # API REST - Node.js + Express v5
│   ├── src/
│   │   ├── server.js        # Punto de entrada
│   │   ├── controllers/     # Lógica de negocio (13 controladores)
│   │   │   ├── authController.js
│   │   │   ├── ticketController.js
│   │   │   ├── purchaseRequestController.js
│   │   │   ├── documentController.js
│   │   │   ├── repositoryController.js
│   │   │   ├── credentialController.js
│   │   │   ├── inventoryController.js
│   │   │   ├── phoneController.js
│   │   │   ├── qualityTicketController.js
│   │   │   ├── userController.js
│   │   │   ├── roleController.js
│   │   │   ├── documentChangeRequestController.js
│   │   │   └── actaEntregaController.js
│   │   ├── models/         # Modelos Sequelize (13 tablas)
│   │   ├── routes/         # Definición de endpoints
│   │   ├── middlewares/    # Auth, authz, validation, rate-limit
│   │   ├── utils/          # Logger, email, permissions
│   │   └── socket.js       # WebSocket server
│   ├── uploads/            # Archivos subidos
│   ├── logs/               # Winston logs (rotación diaria)
│   ├── migrations/         # Scripts SQL de migración
│   ├── scripts/           # Mantenimiento (cleanup, backup)
│   ├── database.sql       # Schema inicial completo
│   └── package.json
├── frontend/               # SPA - React 19 + Vite 7
│   ├── src/
│   │   ├── components/    # Componentes UI (base, common, tickets, etc.)
│   │   ├── pages/         # 25+ páginas principales
│   │   │   ├── Help.jsx           # Centro de ayuda completo
│   │   │   ├── Dashboard.jsx      # Panel de control
│   │   │   ├── Tickets/
│   │   │   ├── Documents/
│   │   │   ├── Inventory/
│   │   │   ├── Roles/
│   │   │   ├── Users/
│   │   │   ├── Quality/
│   │   │   ├── PurchaseRequests/
│   │   │   ├── ActasEntrega/
│   │   │   └── ...
│   │   ├── api/           # Servicios API (axios)
│   │   ├── context/       # Contextos React (Theme, Auth, Notification)
│   │   ├── hooks/         # Hooks personalizados (useThemeClasses, etc.)
│   │   ├── utils/         # Helpers (constants, formatters, validators)
│   │   ├── i18n/          # Internacionalización
│   │   └── App.jsx        # Router principal
│   ├── public/            # Assets estáticos
│   ├── README.md          # Documentación frontend
│   ├── vite.config.js     # Configuración Vite
│   ├── tailwind.config.js # Tailwind CSS
│   ├── postcss.config.js  # PostCSS
│   └── package.json
└── README.md             # Documentación general del proyecto
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de datos relacional
- **Sequelize** - ORM para Node.js
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Encriptación de contraseñas
- **multer** - Manejo de archivos
- **Socket.IO** - Comunicación en tiempo real
- **CORS** - Control de acceso cross-origin

### Frontend
- **React 19.1.1** - Biblioteca de UI
- **React Router 7.9.4** - Enrutamiento
- **Vite 7.1.7** - Build tool y dev server
- **Tailwind CSS 4.1.16** - Framework CSS
- **Zustand 5.0.8** - State management
- **Axios 1.12.2** - Cliente HTTP
- **React Icons 5.5.0** - Biblioteca de íconos
- **JWT Decode 4.0.0** - Decodificación de tokens
- **Socket.IO Client 4.8.1** - Cliente WebSocket
- **Chart.js 4.5.1** - Gráficos y visualización
- **React-ChartJS-2 5.3.1** - Integración Chart.js para React
- **i18next 25.6.0** - Internacionalización
- **ExcelJS 4.4.0** - Exportación Excel
- **JSZip / FileSaver** - Manejo de archivos comprimidos
- **DOMPurify 3.4.0** - Sanitización HTML
- **html2canvas 1.4.1** - Capturas de pantalla

### DevOps
- **Git** - Control de versiones
- **ESLint** - Linting de código
- **Nodemon** - Auto-restart en desarrollo

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- MySQL 8.0+
- Git

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/duvyclass.git
cd duvyclass
```

### 2. Configurar la Base de Datos

```bash
# Crear base de datos MySQL
mysql -u root -p
CREATE DATABASE duvy_class;
exit;

# Ejecutar script de base de datos
mysql -u root -p duvy_class < backend/database.sql
```

### 3. Configurar Backend

```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones
```

**Archivo `.env`:**
```env
PORT=5000
DB_HOST=localhost
DB_NAME=duvy_class
DB_USER=root
DB_PASSWORD=tu_password_aqui
JWT_SECRET=tu_jwt_secret_muy_seguro_de_al_menos_32_caracteres_para_produccion_123456789
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Configurar Frontend

```bash
cd ../frontend
npm install
```

### 5. Corregir Contraseñas (Importante)

Después de configurar la base de datos, ejecuta el script para corregir las contraseñas:

```bash
cd backend
node fix-passwords.js
```

Este script mostrará las contraseñas correctas para todos los usuarios de prueba.

### 6. Agregar Columnas Nuevas (Refresh Tokens)

Si actualizaste desde una versión anterior, ejecuta la migración:

```bash
cd backend
node migrate-add-tokens.js
```

### 7. Iniciar el Sistema

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 8. Acceder al Sistema

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000


## 📖 Uso del Sistema

### Acceso al Sistema

1. **Login**: Usa las credenciales de prueba o crea una cuenta nueva
2. **Dashboard**: Vista general con estadísticas del sistema
3. **Navegación**: Usa la barra lateral para acceder a módulos

### Gestión de Tickets

1. **Crear Ticket**: Botón "Nuevo Ticket" en la página de tickets
2. **Asignar Técnico**: Los administradores pueden asignar tickets
3. **Agregar Comentarios**: Comunicación interna en tickets
4. **Subir Adjuntos**: Archivos relacionados con el ticket

### Gestión de Inventario

1. **Agregar Equipos**: Registro detallado de activos IT
2. **Asignar a Usuarios**: Vinculación de equipos con empleados
3. **Actualizar Estados**: Cambios en el estado de los equipos

### Gestión de Versiones de Documentos

1. **Subir Documentos**: Crear documentos nuevos con versionado automático
2. **Nueva Versión**: Actualizar documentos existentes con control de cambios
3. **Historial Completo**: Acceder a todas las versiones de un documento
4. **Versiones Activas**: Interfaz optimizada mostrando solo versiones actuales
5. **Control de Acceso**: Permisos granulares según roles de usuario
6. **Búsqueda Avanzada**: Filtros por versión, tipo, fecha y autor

## 🔗 API Documentation

### Autenticación
```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh-token
POST /api/auth/verify-2fa
GET /api/auth/search  # Búsqueda global
GET /api/auth/profile  # Perfil de usuario
PUT /api/auth/profile  # Actualizar perfil
PUT /api/auth/password  # Cambiar contraseña
```

### Tickets
```http
GET /api/tickets          # Listar tickets (paginado server-side)
GET /api/tickets/search   # Buscar con debounce
GET /api/tickets/report   # Reporte CSV (filtrado por rol)
POST /api/tickets         # Crear ticket
PUT /api/tickets/:id      # Actualizar con locking optimista
DELETE /api/tickets/:id   # Eliminar (papelera)
POST /api/tickets/:id/comments    # Agregar comentario
POST /api/tickets/:id/attachments # Subir adjunto
PUT /api/tickets/:id/assign       # Asignar técnico
PUT /api/tickets/:id/status       # Cambiar estado
```

### Tickets de Calidad
```http
GET /api/quality-tickets
GET /api/quality-tickets/search
GET /api/quality-tickets/report
POST /api/quality-tickets
PUT /api/quality-tickets/:id
DELETE /api/quality-tickets/:id
POST /api/quality-tickets/:id/assign  # Asignación automática round-robin
```

### Inventario
```http
GET /api/inventory        # Listar (paginado)
GET /api/inventory/search # Búsqueda con filtros
GET /api/inventory/report # CSV filtrado por rol
POST /api/inventory       # Crear equipo
PUT /api/inventory/:id    # Actualizar con locking
DELETE /api/inventory/:id # Papelera
```

### Tablets
```http
GET /api/tablets
GET /api/tablets/search
POST /api/tablets
PUT /api/tablets/:id
DELETE /api/tablets/:id
```

### PDAs
```http
GET /api/pdas
GET /api/pdas/search
POST /api/pdas
PUT /api/pdas/:id
DELETE /api/pdas/:id
```

### Teléfonos Corporativos
```http
GET /api/corporate-phones
GET /api/corporate-phones/search
POST /api/corporate-phones
PUT /api/corporate-phones/:id
DELETE /api/corporate-phones/:id
```

### Documentos
```http
GET /api/documents        # Listar (solo versiones activas empleados)
GET /api/documents/search # Búsqueda avanzada
GET /api/documents/report # CSV con permisos
POST /api/documents       # Subir con versionado automático
PUT /api/documents/:id    # Nueva versión (semver)
DELETE /api/documents/:id # Eliminar (papelera)
GET /api/documents/:id/history  # Historial completo
GET /api/documents/:id/versions/:version/download  # Descargar versión específica
```

### Solicitudes de Cambio
```http
GET /api/document-change-requests
GET /api/document-change-requests/search
GET /api/document-change-requests/report
POST /api/document-change-requests
PUT /api/document-change-requests/:id
PUT /api/document-change-requests/:id/submit-for-review
PUT /api/document-change-requests/:id/approve-step
PUT /api/document-change-requests/:id/implement
```

### Solicitudes de Compra
```http
GET /api/purchase-requests
GET /api/purchase-requests/search
GET /api/purchase-requests/report
POST /api/purchase-requests
PUT /api/purchase-requests/:id
DELETE /api/purchase-requests/:id
PUT /api/purchase-requests/:id/submit
PUT /api/purchase-requests/:id/approve-manager
PUT /api/purchase-requests/:id/approve-purchases
```

### Actas de Entrega
```http
GET /api/actas-entrega
GET /api/actas-entrega/search
GET /api/actas-entrega/report
POST /api/actas-entrega
PUT /api/actas-entrega/:id
DELETE /api/actas-entrega/:id
POST /api/actas-entrega/:id/sign  # Firma digital
POST /api/actas-entrega/:id/reposicion  # Reposición de equipo
```

### Credenciales (Solo Admin)
```http
GET /api/credentials
GET /api/credentials/search
GET /api/credentials/report
POST /api/credentials
PUT /api/credentials/:id
DELETE /api/credentials/:id
```

### Usuarios (Solo Admin)
```http
GET /api/users           # Listar (filtrado por rol)
POST /api/users          # Crear usuario + asignación rol
PUT /api/users/:id       # Actualizar usuario
DELETE /api/users/:id    # Papelera
GET /api/users/:id/history  # Historial de auditoría
```

### Roles (Solo Admin)
```http
GET /api/roles           # Listar todos los roles
GET /api/roles/:id/permissions  # Ver permisos detallados
PUT /api/roles/:id       # Editar permisos
POST /api/roles          # Crear rol personalizado
DELETE /api/roles/:id    # Eliminar rol (no predefinidos)
POST /api/roles/:id/copy-permissions  # Copiar permisos
GET /api/roles/export    # Exportar configuración JSON
POST /api/roles/import   # Importar configuración
GET /api/roles/stats     # Estadísticas de roles
```

### Papelera (Admin/Técnico)
```http
GET /api/trash           # Listar elementos eliminados
GET /api/trash/:module   # Filtrar por módulo
GET /api/trash/stats     # Estadísticas de papelera
POST /api/trash/:type/:id/restore  # Restaurar elemento
DELETE /api/trash/:type/:id/permanent  # Eliminar permanente
DELETE /api/trash/empty  # Vaciar toda la papelera
GET /api/trash/:type/:id  # Detalles de elemento
```

### Reportes
```http
GET /api/reports/tickets/stats
GET /api/reports/quality/dashboard
GET /api/reports/inventory/valuation
GET /api/reports/purchases/summary
GET /api/reports/users/activity
```

## 🗄️ Base de Datos

### Tablas Principales

- **Users**: Usuarios del sistema
- **Roles**: Roles y permisos
- **Tickets**: Tickets de soporte
- **Inventories**: Equipos de inventario
- **Documents**: Documentos oficiales
- **Repositories**: Archivos del repositorio
- **Credentials**: Credenciales de acceso
- **Comments**: Comentarios en tickets
- **Messages**: Mensajes del chat
- **Histories**: Historial de auditoría

### Relaciones

```
Users (1) ──── (N) Tickets
Users (1) ──── (N) Inventories
Users (1) ──── (N) Documents
Users (1) ──── (N) Repositories
Users (1) ──── (N) Credentials
Users (1) ──── (N) Comments
Users (1) ──── (N) Messages
Users (1) ──── (N) Histories
Roles (1) ──── (N) Users
```

## 🔐 Roles y Permisos v2.1

### 👑 **Administrador** (Nivel 5 - Acceso Total)
- Acceso completo a todos los módulos y funciones
- No se puede editar ni eliminar
- Ver y restaurar cualquier elemento de la papelera
- Vaciar papelera completamente
- Acceso a estadísticas y reportes globales
- Eliminar elementos permanentemente
- Gestionar permisos de usuarios
- Configurar parámetros de limpieza automática
- Ver logs de auditoría del sistema

### 🏆 **Jefe** (Nivel 4 - Supervisión)
- Ver todos los tickets del área
- Asignar tickets a técnicos
- Aprobar solicitudes de cambio y compra
- Ver estadísticas del departamento
- Crear y gestionar solicitudes de compra
- Acceso a documentos del área
- Ver reportes de rendimiento
- Gestionar workflow de documentos
- Aprobar tickets de calidad
- Ver métricas de equipo

### 🔧 **Técnico** (Nivel 3 - Soporte)
- Crear y atender tickets
- Asignarse tickets
- Actualizar estado de tickets
- Añadir comentarios y adjuntos
- Gestionar inventario
- Ver credenciales del sistema
- Restaurar elementos de la papelera (propios)
- Crear solicitudes de cambio
- Gestionar teléfonos/tablets/PDAs
- Acceso completo a dispositivo móviles asignados

### 👤 **Empleado** (Nivel 1 - Usuario Básico)
- Crear tickets propios
- Ver estado de sus tickets
- Añadir comentarios a sus tickets
- Ver documentos asignados
- Cambiar contraseña
- Ver perfil de usuario
- Crear solicitudes de compra
- Acceso de solo lectura a módulos autorizados
- Ver tickets de calidad asignados
- Consultar inventario asignado

### 🛡️ **Calidad** (Nivel 2 - Gestión de Calidad)
- Gestionar tickets de calidad (NCR, CAPA, Auditorías)
- Crear y aprobar documentos
- Ver historial de cambios documentales
- Aprobar solicitudes de cambio
- Ver métricas de calidad
- Gestionar workflow de documentos
- Crear no conformidades
- Ver reportes de calidad
- Gestionar plantillas documentales
- Auditoría de procesos

### 🛒 **Compras** (Nivel 4 - Proceso de Compras)
- Crear solicitudes de compra
- Seguir estado de solicitudes
- Ver catálogo de proveedores
- Gestionar órdenes de compra
- Ver historial de compras
- Adjuntar facturas y comprobantes
- Aprobar solicitudes de compra (nivel compras)
- Gestionar líneas de compra
- Ver reportes de compras
- Coordinar entregas

### 📋 **Coordinadora Administrativa** (Nivel 3 - Administración)
- Gestionar solicitudes de compra
- Crear y firmar actas de entrega
- Ver inventario administrativo
- Gestionar credenciales administrativas
- Ver reportes financieros
- Aprobar solicitudes de compra
- Gestionar teléfonos/tablets administrativos
- Ver estadísticas administrativas
- Crear órdenes de reposición
- Gestionar presupuestos

## 🔒 Características de Seguridad

### Protecciones Implementadas
- **JWT con Refresh Tokens**: Acceso 15min renovable automáticamente
- **Locking Optimista**: Campo version en Tickets, PurchaseRequests, DocumentChangeRequests, QualityTickets
- **Transacciones ACID**: createPurchaseRequest, submitForReview, approveStep, implementChange
- **Rate Limiting**: 200 req/15min general, 20 req/15min auth
- **Security Headers**: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- **Encriptación**: bcryptjs (salt rounds: 10)
- **Logging**: Winston con rotación diaria
- **Compresión**: Gzip automática
- **Validación**: express-validator en todos los endpoints
- **Sanitización**: Limpieza automática de inputs

## 🎯 Funcionalidades Completas v2.1

### ✅ Funcionalidades Implementadas
- [x] **Paginación Server-Side**: Carga bajo demanda para miles de registros
- [x] **Búsqueda con Debounce**: 300ms de espera en todas las búsquedas
- [x] **Locking Optimista**: Control de concurrencia con versionado
- [x] **Transacciones ACID**: Operaciones atómicas con rollback automático
- [x] **Winston Logger**: Logging completo con rotación diaria
- [x] **Filtrado por Roles**: Reportes automáticos por permisos
- [x] **Sistema de Papelera**: 30 días de retención con limpieza nocturna
- [x] **Cache y Optimización**: Reducción 60% bundle inicial
- [x] **Autenticación JWT** con refresh tokens
- [x] Sistema de roles y permisos avanzado
- [x] Validación de sesiones concurrentes
- [x] Rate limiting (200 req/15min general, 20 req/15min auth)
- [x] Headers de seguridad (HSTS, CSP, X-Frame-Options)
- [x] Compresión gzip automática
- [x] CRUD completo para todos los módulos
- [x] Búsqueda global inteligente
- [x] Reportes CSV descargables
- [x] Chat en tiempo real (WebSocket)
- [x] Sistema de archivos con uploads
- [x] Interfaz responsiva 100%
- [x] Tema oscuro configurable
- [x] Notificaciones por rol y email
- [x] Historial de auditoría completo
- [x] Autenticación de dos factores (2FA)
- [x] Encriptación bcrypt para contraseñas
- [x] Dashboard de Calidad con gráficos interactivos
- [x] Teléfonos Corporativos (4 categorías)
- [x] Tablets y PDAs - Gestión de dispositivos
- [x] Actas de Entrega - Documentación digital
- [x] Roles: Calidad, Coordinadora, Director de Compras
- [x] Permisos específicos por carpeta en documentos
- [x] Workflows de email automatizados

### 🏗️ Módulos del Sistema

#### 🎫 Tickets (Mesa de Ayuda)
- Creación con múltiples prioridades
- Asignación automática y manual
- Categorías y subcategorías
- Comentarios en tiempo real
- Adjuntos de archivos
- Historial de cambios de estado
- Notificaciones por email
- Filtros avanzados
- Estadísticas de resolución
- Plantillas de respuestas

#### 🎟️ Tickets de Calidad
- No conformidades (NCR)
- Auditorías programadas
- Análisis de causa raíz (5 Por Qué, Ishikawa)
- Acciones CAPA (Correctivas/Preventivas)
- Seguimiento de KPIs
- Reportes ISO 9001
- Integración con documentos
- Workflow de aprobación
- Plantillas personalizadas
- Dashboard unificado

#### 📦 Inventario
- Códigos únicos por activo
- Categorización por tipo
- Asignación a usuarios/áreas
- Control de estados
- Historial de movimientos
- Control de garantías
- Valoración de activos
- Código de barras/QR
- Importación masiva

#### 📱 Tablets y PDAs
- Control de IMEI y serie
- Asignación por usuario
- Gestión de planes de datos
- Software instalado
- Mantenimiento preventivo
- Historial de reparaciones
- Control de accesorios
- Certificaciones de uso
- Gestión de productividad

#### 📞 Teléfonos Corporativos
- 4 categorías (Admin, Asesores, Socios, Reposición)
- Control de IMEI y operador
- Gestión de planes móviles
- Historial de líneas
- Control de gastos
- Cancelación de líneas
- Gestión de SIMs

#### 📄 Documentos
- Organización por carpetas
- Control de versiones semántico
- Búsqueda avanzada
- Control de acceso por roles
- Firma digital
- Plantillas documentales
- Vencimientos
- Auditoría de accesos

#### 📝 Solicitudes de Cambio
- Workflow ISO 9001
- Análisis de impacto
- Justificación obligatoria
- Notificaciones a interesados
- Plazos y vencimientos
- Priorización
- Integración con documentos

#### 🛒 Solicitudes de Compra
- Aprobaciones por workflow
- Presupuesto y centros de costo
- Comentarios y seguimiento
- Catálogo de proveedores
- Órdenes de compra
- Historial completo

#### 📋 Actas de Entrega
- Firma digital de recibidos
- Inventario detallado
- Condiciones de entrega
- Responsables y testigos
- Plantillas de actas
- Reposición de equipos

#### 🔐 Credenciales
- Almacenamiento cifrado
- Organización por carpetas
- Control de acceso
- Historial de accesos
- Vencimientos
- Exportación cifrada

#### 👥 Usuarios y Roles
- Gestión completa de usuarios
- Asignación de roles
- Jerarquía de permisos
- Roles predefinidos
- Plantillas de roles
- Importación masiva
- Auditoría de cambios

## ✨ Nuevas Funcionalidades v2.1 (Abril 2026)

### 📱 Diseño 100% Responsive y Optimizado
- **Help.jsx responsive**: Página de ayuda completamente responsive
- **Resoluciones**: Diseñado para 320px hasta 1920px+
- **Navegación adaptativa**: Mejor experiencia en dispositivos móviles
- **Tabs optimizadas**: Etiquetas cortas para pantallas pequeñas

### ⚡ Optimizaciones de Rendimiento Críticas
- **Paginación Server-Side**: Todos los listados cargan solo página solicitada
- **Búsqueda con Debounce**: 300ms de espera reduce llamadas API
- **Locking Optimista**: Previene conflictos de concurrencia en edición
- **Transacciones ACID**: Operaciones múltiples atómicas con rollback automático
- **Winston Logger**: Reemplaza console.error completamente
- **Filtrado por Roles**: Reportes filtran automáticamente por permisos
- **Code Splitting**: Reducción del 60% en bundle inicial

### 🔔 Sistema de Notificaciones Mejorado
- **Notificaciones por rol**: Cada rol recibe alertas específicas de su área
- **Panel en Navbar**: Contador y dropdown en barra superior
- **Emails automatizados**: Creación, asignación y cambios de estado
- **Alertas de inventario**: Items en mínimo stock
- **Recordatorios de calidad**: Vencimientos de CAPAs
- **Resumen semanal**: Email con estadísticas del sistema

### 🗑️ Papelera Avanzada
- **Recuperación total**: Restauración con manejo automático de dependencias
- **Limpieza nocturna**: Eliminación automática después de 30 días
- **Filtrado por módulo**: Búsqueda por tipo de elemento
- **Estadísticas de uso**: Métricas de papelera
- **Permisos granulares**: Administradores ven todo, usuarios solo lo propio
- **Versiones móviles**: Diseño responsive completo

## 📊 Reportes y Búsqueda

### Búsqueda Global
- Campo de búsqueda unificado en la barra de navegación
- Resultados categorizados por módulo
- Navegación directa a elementos encontrados
- Filtros automáticos por permisos de usuario

### Reportes CSV
- **Tickets**: ID, título, descripción, estado, asignado, fechas
- **Inventario**: Especificaciones técnicas completas
- **Documentos**: Metadatos y información de archivos
- **Repositorio**: Archivos con categorías y etiquetas
- **Credenciales**: Información administrativa (sin contraseñas)

## 🔔 Sistema de Notificaciones

### Descripción General
El sistema de notificaciones de DuvyClass proporciona alertas en tiempo real para mantener a los usuarios informados sobre eventos importantes en el sistema.

### Características Principales

#### 📬 Notificaciones por Rol
Cada rol recibe notificaciones específicas de su área:
- **Administrador**: Todas las notificaciones del sistema
- **Técnico**: Tickets asignados y actualizaciones
- **Jefe**: Aprobaciones pendientes y estadísticas
- **Empleado**: Estado de sus tickets y solicitudes
- **Calidad**: Tickets de calidad y cambios documentales
- **Compras**: Solicitudes de compra y approvals
- **Coordinadora Administrativa**: Inventario y compras

#### 📧 Notificaciones por Email
El sistema envía emails automáticos para:
- **Creación de tickets**: Notificación al técnico asignado
- **Asignación de tickets**: Email al responsable
- **Cambios de estado**: Actualizaciones al solicitante
- **Recordatorios**: Tickets sin asignar por 24 horas
- **Alertas de inventario**: Items en mínimo
- **Vencimiento de CAPAs**: Alerts de calidad
- **Resumen semanal**: Estadísticas del sistema

#### 🔔 Panel de Notificaciones
- Located en el Navbar (parte superior derecha)
- **Contador de notificaciones** no leídas
- **Dropdown con lista** de notificaciones recientes
- **Marcar como leído** individualmente
- **Eliminar notificaciones**
- **Persistencia** en base de datos

### Módulos de Notificación
| Módulo | Tipo de Notificación |
|--------|---------------------|
| Tickets | Asignación, estado, comentarios |
| Inventario | Alertas de stock mínimo |
| Calidad | CAPAs, vencimientos, auditorías |
| Compras | Aprobaciones, estados |
| Documentos | Cambios, aprobaciones |

## 🔒 Seguridad y Producción

### Características de Seguridad Implementadas
- **JWT con Refresh Tokens**: Tokens de acceso cortos (15min) con renovación automática
- **Validación de Sesiones**: Control de sesiones concurrentes por usuario
- **Rate Limiting**: Protección DDoS (200 req/15min general, 20 req/15min auth)
- **Headers de Seguridad**:
  - HSTS (HTTP Strict Transport Security)
  - CSP (Content Security Policy)
  - X-Frame-Options (Anti-clickjacking)
  - X-Content-Type-Options (Anti-MIME sniffing)
  - X-XSS-Protection
  - Referrer-Policy
- **Encriptación**: bcryptjs para contraseñas (salt rounds: 10)
- **Logging**: Winston con rotación diaria y niveles configurables
- **Compresión**: Gzip automática para todas las respuestas
- **Code Splitting**: Optimización de carga de JavaScript

### Configuración de Producción
Para producción, actualiza las variables de entorno:

```env
NODE_ENV=production
FRONTEND_URL=https://tu-dominio-produccion.com
JWT_SECRET=tu_jwt_secret_muy_seguro_de_al_menos_32_caracteres_para_produccion_123456789
```

### Rate Limiting Ajustable
Los límites de rate limiting están configurados para desarrollo. Para producción, considera:
- General: 100-500 req/15min
- Auth: 5-10 req/15min
- Ajusta según tus necesidades de seguridad vs usabilidad

## 💻 Desarrollo

### Scripts Disponibles

```bash
# Backend
npm start      # Producción
npm run dev    # Desarrollo con nodemon

# Frontend
npm run dev    # Desarrollo con Vite
npm run build  # Build para producción
npm run preview # Vista previa del build
```

### Estructura de Desarrollo

```
backend/
├── src/
│   ├── controllers/    # Lógica de negocio
│   ├── models/        # Modelos de datos
│   ├── routes/        # Definición de endpoints
│   ├── middlewares/   # Autenticación, autorización
│   ├── config/        # Configuración de BD
│   └── socket.js      # WebSocket server
└── uploads/           # Archivos subidos

frontend/
├── src/
│   ├── components/    # Componentes UI
│   ├── pages/         # Páginas principales
│   ├── api/           # Servicios API
│   ├── context/       # Contextos React
│   └── i18n/          # Internacionalización
└── public/            # Assets estáticos
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

### Contacto DuvyClass

- **Email de Soporte**: asistentesistemas@duvyclass.co
- **Dirección**: Kilómetro 3.5 vía Funza - Siberia, Parque Industrial Galicia, Manzana D, Bodegas 2 y 3
- **PBX**: (57) 601-821 6565
- **Sitio Web**: www.duvyclass.com
- **Documentación**: [Wiki del Proyecto](https://github.com/tu-usuario/duvyclass/wiki)

### Centro de Ayuda Integrado

El sistema incluye una página de ayuda completa (`/help`) con:
- **Manual de Usuario**: Guía completa del sistema
- **Preguntas Frecuentes**: 50+ preguntas técnicas y funcionales
- **Guía de Roles**: Descripción detallada de permisos por rol
- **Módulos del Sistema**: Características y workflows de cada módulo
- **Guía de Papelera**: Funcionamiento del sistema de recuperación
- **Información de Contacto**: Datos de soporte

### Preguntas Frecuentes Destacadas

1. **¿Paginación server-side?** - Carga solo la página solicitada, rápido con miles de registros.
2. **¿Debounce en búsquedas?** - Espera 300ms tras escribir, reduce llamadas API.
3. **¿Transacciones ACID?** - Operaciones atómicas con rollback automático.
4. **¿Locking optimista?** - Control de concurrencia con campo `version`.
5. **¿Asignación tickets calidad?** - Round-robin al usuario con menos tickets activos.
6. **¿Logs Winston?** - Registro completo con rotación diaria.
7. **¿Filtrado por roles?** - Reportes filtran automáticamente según permisos.
8. **¿Papelera?** - 30 días de retención, limpieza nocturna automática.

---

**DuvyClass v2.1** - Transformando la gestión tecnológica empresarial con soluciones modernas y eficientes. 🚀

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

**Última actualización**: Abril 2026  
**Versión**: 2.1  
**Compatible con**: DuvyClass v2.1+