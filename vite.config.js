import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
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
        target: process.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
