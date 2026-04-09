import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: './', // CRITICAL FOR GITHUB PAGES! Handles relative asset paths
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'member-panel/index.html'),
        admin: resolve(__dirname, 'admin-panel/index.html')
      }
    }
  }
});
