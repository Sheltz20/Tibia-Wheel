import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from 'vite-plugin-yaml'

export default defineConfig({
  plugins: [react(), yaml()],
  assetsInclude: ['**/*.png', '**/*.webp'],
  build: {
    outDir: 'dist'
  }
})