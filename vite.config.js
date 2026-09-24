import { defineConfig } from 'vite';

export default defineConfig({
  // Utiliser des chemins relatifs pour que ça marche sur Github Pages et en File System
  base: './',
  build: {
    outDir: 'docs'
  }
});
