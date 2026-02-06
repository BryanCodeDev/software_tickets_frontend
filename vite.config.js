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
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['axios', 'socket.io-client', 'jwt-decode'],
            utils: ['zustand', 'i18next', 'i18next-browser-languagedetector', 'react-i18next']
          }
        }
      },
      chunkSizeWarningLimit: 600,
      minify: 'terser',
      sourcemap: false, // Deshabilitar en producción para mejor rendimiento
      assetsInlineLimit: 4096
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
  }
})
