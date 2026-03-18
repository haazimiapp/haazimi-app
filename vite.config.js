import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/haazimi-app/', // Crucial for GitHub Pages to find your images/scripts
  build: {
    outDir: 'dist',
  }
})
