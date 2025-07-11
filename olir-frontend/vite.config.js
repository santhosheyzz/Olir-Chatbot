import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
    open: true
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss/nesting'),
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    chunkSizeWarningLimit: 1600
  }
});