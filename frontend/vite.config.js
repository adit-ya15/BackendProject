import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      'https://backendproject-8f5y.onrender.com': {
        target: 'https://backendproject-8f5y.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
