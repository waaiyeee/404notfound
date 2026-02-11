import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',  // Changed from 5000 to 5001
        changeOrigin: true,
      },
      '/video_feed': {
        target: 'http://localhost:5001',  // Changed from 5000 to 5001
        changeOrigin: true
      },
      '/get_mental_state': {
        target: 'http://localhost:5001',  // Changed from 5000 to 5001
        changeOrigin: true
      }
    }
  }
})
