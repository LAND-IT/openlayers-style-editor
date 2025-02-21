import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/openlayers-style-editor/',
  plugins: [react()],
  server: {
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: './dist',
    emptyOutDir: true, // also necessary
  }
})
