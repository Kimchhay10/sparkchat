import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Vite Configuration for Angular 21 + Spartan UI
 *
 * Note: Angular 21 doesn't have official Vite support for building Angular apps yet.
 * This configuration provides:
 * - Fast dev server for serving built Angular apps
 * - Path aliases for cleaner imports
 * - Optimized build settings
 *
 * Usage:
 * - Build with Angular: npm run build:angular
 * - Serve with Vite: npm run dev (after building)
 * - Or use Angular CLI: npm run serve (for full Angular dev experience)
 */
export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'),
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: ['601a11b629a7.ngrok-free.app'],
    port: 4400,
    open: true,
    host: true,
    cors: true,
    // Proxy API requests if needed
    proxy: {
      '/api': {
        target: 'https://sparkchat-api.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist/sparkchat/browser'),
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.html'),
    },
  },
  optimizeDeps: {
    include: [
      '@angular/common',
      '@angular/forms',
      '@angular/router',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      '@spartan-ng/brain',
    ],
  },
});
