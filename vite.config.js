import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')

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
          target: (env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', ''),
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
