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
          // Evitar dependencias circulares organizando por orden de carga
          manualChunks: (id) => {
            // NO incluir react en chunks separados para evitar circular con i18n
            // i18n debe ir al final para evitar dependencias cruzadas
            
            // Router - debe cargarse temprano
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
            
            // Zustand - gestión de estado
            if (id.includes('node_modules/zustand') || id.includes('zustand')) {
              return 'state'
            }
            
            // UI components - shadcn/ui y librerías de UI
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
            if (id.includes('node_modules/dompurify') || id.includes('dompurify')) {
              return 'security'
            }
            
            // Excel - librería muy pesada, separarla en partes más pequeñas
            if (id.includes('node_modules/xlsx') || id.includes('xlsx')) {
              // Dividir xlsx en partes más pequeñas
              if (id.includes('/dist/esm/') || id.includes('/lib/')) {
                // Separar el core de xlsx
                if (id.includes('xlsx.js') || id.includes('xlsx.mjs')) {
                  return 'excel-core'
                }
                // Partes específicas de xlsx
                if (id.includes('cfb')) {
                  return 'excel-cfb'
                }
                if (id.includes('xlsx')) {
                  return 'excel-utils'
                }
              }
              return 'excel'
            }
            
            // PDF generation - jspdf y librerías relacionadas
            if (id.includes('node_modules/jspdf')) {
              return 'pdf-generation'
            }
            
            // docx - generación de documentos Word
            if (id.includes('node_modules/docx')) {
              return 'docx-generation'
            }
            
            // i18n y traducciones - AL FINAL para evitar chunk circular
            // Esta debe ser la última en evaluarse
            if (id.includes('node_modules/i18next') || 
                id.includes('node_modules/react-i18next') ||
                (id.includes('i18next') && !id.includes('node_modules')) ||
                (id.includes('react-i18next') && !id.includes('node_modules'))) {
              return 'i18n'
            }
            
            // React DOM - chunk principal al final para evitar circular
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/scheduler')) {
              return 'react-core'
            }
          }
        }
      },
      chunkSizeWarningLimit: 450, // Ajustado para librerías grandes como xlsx
      minify: 'esbuild',
      sourcemap: false, // Desactivar sourcemap en producción para reducir tamaño
      assetsInlineLimit: 4096,
      // Configuración de code-splitting
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
      exclude: ['xlsx', 'jspdf', 'docx']
    }
  }
})
