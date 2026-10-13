import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPA_ROUTES = [
  'plots',
  'project',
  'gallery',
  'about',
  'contact',
  'admin',
  'admin/login',
  'admin/plots',
  'admin/leads',
  'admin/analytics',
  'admin/settings',
  'admin/gallery',
  'admin/audit'
];

function spaFallbackPlugin() {
  return {
    name: 'spa-fallback-generator',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;

      // 1. Generate 404.html fallback
      fs.copyFileSync(indexPath, path.join(distDir, '404.html'));

      // 2. Generate static route index.html entries so direct links and refreshes never 404 on CDNs
      for (const route of SPA_ROUTES) {
        const routeDir = path.join(distDir, route);
        fs.mkdirSync(routeDir, { recursive: true });
        fs.copyFileSync(indexPath, path.join(routeDir, 'index.html'));
      }
      console.log(`[spaFallbackPlugin] Generated 404.html and route entries for: ${SPA_ROUTES.join(', ')}`);
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

