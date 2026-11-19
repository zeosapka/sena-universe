import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion', 'gsap'],
          particles: ['@tsparticles/react', '@tsparticles/slim', '@tsparticles/engine', 'canvas-confetti'],
        },
      },
    },
  },
})
