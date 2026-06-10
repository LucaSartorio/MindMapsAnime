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
  build: {
    rollupOptions: {
      output: {
        // Vendor chunks stabili, separati dal codice applicativo. Forma a
        // funzione (non a oggetto) per evitare che Rollup infili moduli
        // condivisi (es. react/jsx-runtime) nel chunk xyflow: React Flow è
        // il vendor più pesante e deve caricarsi SOLO con la pagina mappa,
        // mai sull'avvio dell'app.
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined;
          // React Flow + dipendenze sue esclusive (d3-*, classcat).
          if (id.includes('@xyflow') || /node_modules\/(d3-|classcat)/.test(id)) {
            return 'xyflow';
          }
          // Tutta la famiglia i18next (incl. react-i18next) prima del
          // match su "react".
          if (id.includes('i18next')) return 'i18n';
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
            return 'react';
          }
          // Resto (zustand, @vercel/*, …): vendor condiviso eager.
          return 'vendor';
        },
      },
    },
  },
});
