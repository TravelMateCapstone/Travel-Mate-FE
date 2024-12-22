import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],

  server: {
    proxy: {
      '/serviceHub': {
        target: 'https://travelmateapp.azurewebsites.net',
        changeOrigin: true,
        secure: false, // If you're using self-signed SSL certificates
        rewrite: (path) => path.replace(/^\/serviceHub/, '/serviceHub'), // Keeps the correct path
        ws: true,
      },
      '/chatHub': {
        target: 'https://travelmateapp.azurewebsites.net',
        changeOrigin: true,
        secure: false, // If you're using self-signed SSL certificates
        rewrite: (path) => path.replace(/^\/chatHub/, '/chatHub'), // Keeps the correct path
        ws: true,
      },
    },
  },

  build: {
    rollupOptions: {
      // Do not mark ag-charts-react as external
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: './setupTests.js',
  },
});
