import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  es: {
    translation: {
      // Navigation
      "Panel Principal": "Panel Principal",
      "Tickets": "Tickets",
      "Inventario": "Inventario",
      "Repositorio": "Repositorio",
      "Documentos": "Documentos",
      "Credenciales": "Credenciales",
      "Usuarios": "Usuarios",
      "Perfil": "Perfil",
      "Configuración": "Configuración",
      "Ayuda": "Ayuda",
      "Cerrar Sesión": "Cerrar Sesión",

      // Dashboard
      "Bienvenido": "Bienvenido",
      "Gestionar tickets de IT": "Gestionar tickets de IT",
      "Seguimiento de activos IT": "Seguimiento de activos IT",
      "Acceder a archivos compartidos": "Acceder a archivos compartidos",
      "Ver documentos oficiales": "Ver documentos oficiales",
      "Gestionar credenciales internas": "Gestionar credenciales internas",

      // Login/Register
      "Bienvenido a Duvy Class": "Bienvenido a Duvy Class",
      "Inicia sesión para acceder a tu panel de gestión IT": "Inicia sesión para acceder a tu panel de gestión IT",
      "Correo Electrónico": "Correo Electrónico",
      "Contraseña": "Contraseña",
      "Iniciar Sesión": "Iniciar Sesión",
      "Iniciando sesión...": "Iniciando sesión...",
      "¿No tienes una cuenta?": "¿No tienes una cuenta?",
      "Regístrate aquí": "Regístrate aquí",
      "Crear Cuenta": "Crear Cuenta",
      "Nombre de Usuario": "Nombre de Usuario",
      "Confirmar Contraseña": "Confirmar Contraseña",
      "Registrando...": "Registrando...",
      "¿Ya tienes una cuenta?": "¿Ya tienes una cuenta?",
      "Inicia sesión aquí": "Inicia sesión aquí",

      // Profile
      "Mi Perfil": "Mi Perfil",
      "Gestiona tu información personal": "Gestiona tu información personal",
      "Nombre Completo": "Nombre Completo",
      "Teléfono": "Teléfono",
      "Departamento": "Departamento",
      "Rol": "Rol",
      "Estado": "Estado",
      "Guardar Cambios": "Guardar Cambios",
      "Guardando...": "Guardando...",

      // Settings
      "Personaliza tu experiencia en la plataforma": "Personaliza tu experiencia en la plataforma",
      "Notificaciones": "Notificaciones",
      "Notificaciones Push": "Notificaciones Push",
      "Recibe notificaciones en tiempo real": "Recibe notificaciones en tiempo real",
      "Alertas por Email": "Alertas por Email",
      "Recibe actualizaciones por correo electrónico": "Recibe actualizaciones por correo electrónico",
      "Apariencia": "Apariencia",
      "Modo Oscuro": "Modo Oscuro",
      "Cambia a tema oscuro": "Cambia a tema oscuro",
      "Idioma": "Idioma",
      "Seguridad": "Seguridad",
      "Cambiar Contraseña": "Cambiar Contraseña",
      "Actualiza tu contraseña de acceso": "Actualiza tu contraseña de acceso",
      "Autenticación de Dos Factores": "Autenticación de Dos Factores",
      "Añade una capa extra de seguridad": "Añade una capa extra de seguridad",
      "Configurar": "Configurar",
      "Contraseña Actual": "Contraseña Actual",
      "Nueva Contraseña": "Nueva Contraseña",
      "Confirmar Nueva Contraseña": "Confirmar Nueva Contraseña",
      "Cancelar": "Cancelar",
      "Cambiando...": "Cambiando...",
      "Las contraseñas no coinciden": "Las contraseñas no coinciden",

      // Common
      "Cargando...": "Cargando...",
      "Error": "Error",
      "Éxito": "Éxito",
      "Guardar": "Guardar",
      "Editar": "Editar",
      "Eliminar": "Eliminar",
      "Crear": "Crear",
      "Buscar": "Buscar",
      "Nuevo": "Nuevo",
      "Ver": "Ver",
      "Descargar": "Descargar",
      "Subir": "Subir",
      "Sí": "Sí",
      "No": "No",
      "Aceptar": "Aceptar",
      "Cerrar": "Cerrar"
    }
  },
  en: {
    translation: {
      // Navigation
      "Panel Principal": "Main Dashboard",
      "Tickets": "Tickets",
      "Inventario": "Inventory",
      "Repositorio": "Repository",
      "Documentos": "Documents",
      "Credenciales": "Credentials",
      "Usuarios": "Users",
      "Perfil": "Profile",
      "Configuración": "Settings",
      "Ayuda": "Help",
      "Cerrar Sesión": "Logout",

      // Dashboard
      "Bienvenido": "Welcome",
      "Gestionar tickets de IT": "Manage IT tickets",
      "Seguimiento de activos IT": "Track IT assets",
      "Acceder a archivos compartidos": "Access shared files",
      "Ver documentos oficiales": "View official documents",
      "Gestionar credenciales internas": "Manage internal credentials",

      // Login/Register
      "Bienvenido a Duvy Class": "Welcome to Duvy Class",
      "Inicia sesión para acceder a tu panel de gestión IT": "Login to access your IT management panel",
      "Correo Electrónico": "Email",
      "Contraseña": "Password",
      "Iniciar Sesión": "Login",
      "Iniciando sesión...": "Logging in...",
      "¿No tienes una cuenta?": "Don't have an account?",
      "Regístrate aquí": "Register here",
      "Crear Cuenta": "Create Account",
      "Nombre de Usuario": "Username",
      "Confirmar Contraseña": "Confirm Password",
      "Registrando...": "Registering...",
      "¿Ya tienes una cuenta?": "Already have an account?",
      "Inicia sesión aquí": "Login here",

      // Profile
      "Mi Perfil": "My Profile",
      "Gestiona tu información personal": "Manage your personal information",
      "Nombre Completo": "Full Name",
      "Teléfono": "Phone",
      "Departamento": "Department",
      "Rol": "Role",
      "Estado": "Status",
      "Guardar Cambios": "Save Changes",
      "Guardando...": "Saving...",

      // Settings
      "Personaliza tu experiencia en la plataforma": "Customize your platform experience",
      "Notificaciones": "Notifications",
      "Notificaciones Push": "Push Notifications",
      "Recibe notificaciones en tiempo real": "Receive real-time notifications",
      "Alertas por Email": "Email Alerts",
      "Recibe actualizaciones por correo electrónico": "Receive email updates",
      "Apariencia": "Appearance",
      "Modo Oscuro": "Dark Mode",
      "Cambia a tema oscuro": "Switch to dark theme",
      "Idioma": "Language",
      "Seguridad": "Security",
      "Cambiar Contraseña": "Change Password",
      "Actualiza tu contraseña de acceso": "Update your access password",
      "Autenticación de Dos Factores": "Two-Factor Authentication",
      "Añade una capa extra de seguridad": "Add an extra layer of security",
      "Configurar": "Configure",
      "Contraseña Actual": "Current Password",
      "Nueva Contraseña": "New Password",
      "Confirmar Nueva Contraseña": "Confirm New Password",
      "Cancelar": "Cancel",
      "Cambiando...": "Changing...",
      "Las contraseñas no coinciden": "Passwords do not match",

      // Common
      "Cargando...": "Loading...",
      "Error": "Error",
      "Éxito": "Success",
      "Guardar": "Save",
      "Editar": "Edit",
      "Eliminar": "Delete",
      "Crear": "Create",
      "Buscar": "Search",
      "Nuevo": "New",
      "Ver": "View",
      "Descargar": "Download",
      "Subir": "Upload",
      "Sí": "Yes",
      "No": "No",
      "Aceptar": "Accept",
      "Cerrar": "Close"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;