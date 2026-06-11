import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Configurazione Vite per Mappe Interattive
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  // NB: niente `manualChunks` custom. Un tentativo di vendor-chunking manuale
  // ha creato import circolari tra chunk (react ⇄ vendor) rompendo l'init dei
  // moduli al boot (pagina bianca). Lo splitting che conta è già garantito dai
  // confini async naturali: dataset per-mondo (import() nel registry) e pagina
  // mappa lazy (React Flow viaggia nel suo chunk). Lasciare decidere Rollup.
});
