import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:4000', // Backend server running on port 5000
        changeOrigin: true, // Adjust for cross-origin requests
        secure: false, // Disable SSL verification for local development
      },
    },
  }
})
