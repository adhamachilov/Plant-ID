import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/plant-id-1/",
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
