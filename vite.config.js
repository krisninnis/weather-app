/* eslint-env node */ 
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/weather-app/',  // Add this line for GitHub Pages
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
});
