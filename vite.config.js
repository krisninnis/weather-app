import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  define: {
    // Fix for 'process' is not defined in linting environments
    'process.env': {},
  },
});
