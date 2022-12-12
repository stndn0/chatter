import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// https://vitejs.dev/config/server-options.html#server-proxy
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': "http://localhost:5000/",
      '/auth': "http://localhost:5000/auth"
    }

  }
})
