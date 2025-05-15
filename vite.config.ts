import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';

// Copy assets to public folder to ensure they're included in the build
const sourceAssetsDir = resolve(__dirname, 'assets');
const targetAssetsDir = resolve(__dirname, 'public/assets');

// Function to ensure assets are copied to public folder
function copyAssets() {
  try {
    // Create public/assets directory if it doesn't exist
    if (!existsSync(targetAssetsDir)) {
      mkdirSync(targetAssetsDir, { recursive: true });
    }
    
    // Create plants directory
    const plantsDir = resolve(targetAssetsDir, 'plants');
    if (!existsSync(plantsDir)) {
      mkdirSync(plantsDir, { recursive: true });
    }
    
    // Copy plant images
    for (let i = 1; i <= 4; i++) {
      const sourceFile = resolve(sourceAssetsDir, 'plants', `${i}.png`);
      const targetFile = resolve(plantsDir, `${i}.png`);
      if (existsSync(sourceFile)) {
        copyFileSync(sourceFile, targetFile);
        console.log(`Copied ${sourceFile} to ${targetFile}`);
      }
    }
    
    // Copy flower animations if they exist
    const sourceFlowerDir = resolve(sourceAssetsDir, 'flower');
    const targetFlowerDir = resolve(targetAssetsDir, 'flower');
    if (existsSync(sourceFlowerDir)) {
      if (!existsSync(targetFlowerDir)) {
        mkdirSync(targetFlowerDir, { recursive: true });
      }
      // You would need to copy flower assets here too
    }
  } catch (error) {
    console.error('Error copying assets:', error);
  }
}

// Run the copy function
copyAssets();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Fix for Netlify deployments - ensures assets are properly handled
  build: {
    assetsInlineLimit: 0, // Disable inlining assets as base64
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Ensure proper asset paths
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
  },
  // Resolve asset paths correctly
  resolve: {
    alias: {
      '/assets': resolve(__dirname, 'public/assets')
    }
  },
  // Use relative paths instead of absolute
  base: '',
  // Ensure publicDir is properly set
  publicDir: 'public'
});
