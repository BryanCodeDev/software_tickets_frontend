# DuvyClass - Sistema IT de Gestión Tecnológica

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://mysql.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

Una plataforma web interna completa para la gestión tecnológica de empresas, que centraliza soporte técnico, inventario IT, documentación y gestión de credenciales en una interfaz moderna y segura.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso del Sistema](#-uso-del-sistema)
- [API Documentation](#-api-documentation)
- [Base de Datos](#-base-de-datos)
- [Roles y Permisos](#-roles-y-permisos)
- [Funcionalidades](#-funcionalidades)
- [Reportes y Búsqueda](#-reportes-y-búsqueda)
- [Desarrollo](#-desarrollo)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

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

### 📄 **Repositorio Documental**
- Almacenamiento centralizado de documentos
- Clasificación por categorías y etiquetas
- Control de versiones de documentos
- Permisos de acceso según roles
- Búsqueda avanzada de archivos

### 🔐 **Gestión de Credenciales**
- Almacenamiento seguro de credenciales corporativas
- Acceso restringido solo a administradores
- Registro de actividad y auditoría
- Buscador rápido por servicio o sistema
- Encriptación de contraseñas

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
├── backend/                 # API REST - Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── models/         # Modelos Sequelize
│   │   ├── routes/         # Definición de rutas
│   │   ├── middlewares/    # Autenticación y autorización
│   │   ├── config/         # Configuración BD
│   │   └── socket.js       # WebSocket para chat
│   ├── uploads/            # Archivos subidos
│   └── database.sql        # Script de BD
├── frontend/               # SPA - React + Vite
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── api/            # Servicios API
│   │   ├── context/        # Contextos React
│   │   └── i18n/           # Internacionalización
│   └── public/             # Assets estáticos
└── README.md
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
- **React 19** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS
- **React Icons** - Biblioteca de íconos
- **JWT Decode** - Decodificación de tokens
- **Socket.IO Client** - Cliente WebSocket
- **Zustand** - State management

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
DB_PASSWORD=tu_password
JWT_SECRET=duvyclass_jwt_secret_key_2025_secure_token
```

### 4. Configurar Frontend

```bash
cd ../frontend
npm install
```

### 5. Iniciar el Sistema

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Acceder al Sistema

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 👥 Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | password | Administrador |
| tecnico | password | Técnico |
| empleado | password | Empleado |

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

### Gestión Documental

1. **Subir Documentos**: Archivos de cualquier tipo
2. **Categorizar**: Etiquetas y categorías para organización
3. **Control de Acceso**: Permisos según roles

## 🔗 API Documentation

### Autenticación

```http
POST /api/auth/login
POST /api/auth/register
GET /api/auth/search  # Búsqueda global
```

### Tickets

```http
GET /api/tickets          # Listar tickets
GET /api/tickets/search   # Buscar tickets
GET /api/tickets/report   # Reporte CSV
POST /api/tickets         # Crear ticket
PUT /api/tickets/:id      # Actualizar ticket
DELETE /api/tickets/:id   # Eliminar ticket
POST /api/tickets/:id/comments    # Agregar comentario
POST /api/tickets/:id/attachments # Subir adjunto
```

### Inventario

```http
GET /api/inventory        # Listar equipos
GET /api/inventory/search # Buscar equipos
GET /api/inventory/report # Reporte CSV
POST /api/inventory       # Crear equipo
PUT /api/inventory/:id    # Actualizar equipo
DELETE /api/inventory/:id # Eliminar equipo
```

### Documentos

```http
GET /api/documents        # Listar documentos
GET /api/documents/search # Buscar documentos
GET /api/documents/report # Reporte CSV
POST /api/documents       # Subir documento
PUT /api/documents/:id    # Actualizar documento
DELETE /api/documents/:id # Eliminar documento
```

### Repositorio

```http
GET /api/repository       # Listar archivos
GET /api/repository/search # Buscar archivos
GET /api/repository/report # Reporte CSV
POST /api/repository      # Subir archivo
PUT /api/repository/:id   # Actualizar archivo
DELETE /api/repository/:id # Eliminar archivo
```

### Credenciales (Solo Admin)

```http
GET /api/credentials      # Listar credenciales
GET /api/credentials/search # Buscar credenciales
GET /api/credentials/report # Reporte CSV
POST /api/credentials     # Crear credencial
PUT /api/credentials/:id  # Actualizar credencial
DELETE /api/credentials/:id # Eliminar credencial
```

### Usuarios (Solo Admin)

```http
GET /api/users           # Listar usuarios
POST /api/users          # Crear usuario
PUT /api/users/:id       # Actualizar usuario
DELETE /api/users/:id    # Eliminar usuario
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

## 🔐 Roles y Permisos

### Administrador
- ✅ Acceso completo a todos los módulos
- ✅ Gestión de usuarios y roles
- ✅ Consulta y gestión de credenciales
- ✅ Generación de reportes
- ✅ Búsqueda global completa

### Técnico
- ✅ Gestión completa de tickets asignados
- ✅ Consulta y gestión de inventario
- ✅ Subida y gestión de documentos
- ✅ Acceso al repositorio
- ❌ No puede gestionar usuarios ni credenciales

### Empleado
- ✅ Crear y seguir sus propios tickets
- ✅ Consulta limitada de documentos públicos
- ✅ Acceso de solo lectura al repositorio
- ❌ No puede gestionar inventario ni credenciales

## 🎯 Funcionalidades

### ✅ Implementadas
- [x] Autenticación JWT completa
- [x] Sistema de roles y permisos
- [x] CRUD completo para todos los módulos
- [x] Búsqueda global inteligente
- [x] Reportes CSV descargables
- [x] Chat en tiempo real (WebSocket)
- [x] Sistema de archivos con uploads
- [x] Interfaz responsiva moderna
- [x] Tema oscuro configurable
- [x] Notificaciones en tiempo real
- [x] Historial de auditoría completo

### 🚀 Características Avanzadas
- **WebSocket**: Comunicación en tiempo real para tickets
- **File Upload**: Soporte para múltiples tipos de archivo
- **Search Engine**: Búsqueda global con filtros por permisos
- **CSV Export**: Reportes descargables compatibles con Excel
- **Responsive Design**: Optimizado para desktop y móvil
- **Audit Trail**: Registro completo de todas las acciones
- **Security**: Encriptación, validación y sanitización

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

Para soporte técnico o preguntas:
- Email: soporte@duvyclass.com
- Documentación: [Wiki del Proyecto](https://github.com/tu-usuario/duvyclass/wiki)

---

**DuvyClass** - Transformando la gestión tecnológica empresarial con soluciones modernas y eficientes. 🚀