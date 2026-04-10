import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const target = process.env.VITE_TARGET || 'all';

const getInputs = () => {
  if (target === 'admin') {
    return { index: resolve(__dirname, 'admin-panel/index.html') };
  }
  if (target === 'member') {
    return { index: resolve(__dirname, 'member-panel/index.html') };
  }
  return {
    member: resolve(__dirname, 'member-panel/index.html'),
    admin: resolve(__dirname, 'admin-panel/index.html')
  };
};

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: getInputs()
    }
  }
});
