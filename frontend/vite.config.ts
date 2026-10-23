/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      // Allow importing ../shared; files outside the repo are still blocked.
      allow: ['..'],
    },
    proxy: {
      // /api/orders -> http://localhost:3000/orders (same origin for the browser, so no CORS).
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    // jsdom gives tests a browser-like document without opening a browser.
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
