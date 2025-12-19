import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'dist/phenka/browser'),

  publicDir: false, // Angular already copied assets

  server: {
    port: 4200,
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'https://phenka-api.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  build: {
    outDir: resolve(__dirname, 'dist/phenka/browser'),
    emptyOutDir: false,
  },
});
