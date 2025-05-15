import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Fix for Netlify deployments - ensures assets are properly handled
  build: {
    assetsInlineLimit: 0, // Disable inlining assets as base64
  },
  // Resolve asset paths correctly
  resolve: {
    alias: {
      '/assets': resolve(__dirname, 'assets')
    }
  },
  // Add base path for consistent asset loading
  base: './'
});
