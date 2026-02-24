import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '')
  
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          // Optimización de chunks - separar librerías grandes
          manualChunks: (id) => {
            // React core - siempre cargar primero
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
              return 'react-core'
            }
            
            // Router
            if (id.includes('node_modules/react-router') || id.includes('node_modules/react-router-dom')) {
              return 'router'
            }
            
            // Axios y networking
            if (id.includes('node_modules/axios') || id.includes('node_modules/form-data')) {
              return 'networking'
            }
            
            // Socket.io
            if (id.includes('node_modules/socket.io-client')) {
              return 'socket'
            }
            
            // Excel - librería muy pesada, separarla
            if (id.includes('node_modules/xlsx') || id.includes('xlsx')) {
              return 'excel'
            }
            
            // PDF generation - html2canvas y librerías relacionadas
            if (id.includes('node_modules/html2canvas') || 
                id.includes('node_modules/jspdf') ||
                id.includes('html2canvas') ||
                id.includes('jspdf')) {
              return 'pdf-generation'
            }
            
            // i18n y traducciones
            if (id.includes('node_modules/i18next') || 
                id.includes('node_modules/react-i18next') ||
                id.includes('i18next') ||
                id.includes('react-i18next')) {
              return 'i18n'
            }
            
            // Zustand - gestión de estado
            if (id.includes('node_modules/zustand') || id.includes('zustand')) {
              return 'state'
            }
            
            // UI components - shadcn/ui
            if (id.includes('node_modules/@radix-ui') || 
                id.includes('node_modules/lucide-react') ||
                id.includes('node_modules/class-variance-authority') ||
                id.includes('node_modules/tailwind-merge') ||
                id.includes('node_modules/clsx')) {
              return 'ui-libs'
            }
            
            // JWT
            if (id.includes('node_modules/jwt-decode')) {
              return 'auth-utils'
            }
            
            // Purify - sanitización HTML
            if (id.includes('node_modules/dompurify') || id.includes('node_modules/dompurify')) {
              return 'security'
            }
          }
        }
      },
      chunkSizeWarningLimit: 500, // Reducido para forzar mejor separación
      minify: 'esbuild',
      sourcemap: false, // Desactivar sourcemap en producción para reducir tamaño
      assetsInlineLimit: 4096,
      // Configuración deCode-splitting
      cssCodeSplit: true,
      modulePreload: {
        polyfill: true
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: env.VITE_PORT || 8080,
      host: '0.0.0.0',
      strictPort: true,
      mimeTypes: {
        '.js': 'application/javascript',
        '.mjs': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json'
      }
    },
    // Optimizaciones adicionales
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'axios'],
      exclude: ['xlsx', 'html2canvas', 'jspdf']
    }
  }
})
