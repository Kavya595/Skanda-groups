import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function spaFallbackPlugin() {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      const indexPath = path.resolve(__dirname, 'dist', 'index.html');
      const notFoundPath = path.resolve(__dirname, 'dist', '404.html');
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, notFoundPath);
        console.log('[spaFallbackPlugin] Successfully generated dist/404.html for SPA fallback');
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), spaFallbackPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});

