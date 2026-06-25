import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Configurazione Vite per Mappe Interattive
export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
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
    // Hardening leggero del bundle di produzione. Nota: il frontend non è mai
    // "protetto" davvero (tutto ciò che arriva al browser è leggibile), ma:
    //  - in build rimuoviamo console.* e debugger (niente rumore/leak in prod);
    //  - NON tocchiamo i commenti di licenza dei pacchetti terzi (rimuoverli
    //    violerebbe licenze tipo MIT che richiedono di preservare la nota).
    // In dev (command === 'serve') il drop NON si applica, così il logging resta.
    esbuild: isBuild ? { drop: ['console', 'debugger'] } : undefined,
    build: {
      // Nessun source map in produzione: pubblichiamo solo bundle minificati,
      // senza mappa per risalire al sorgente originale (default Vite, reso
      // esplicito e intenzionale).
      sourcemap: false,
    },
    // NB: niente `manualChunks` custom. Un tentativo di vendor-chunking manuale
    // ha creato import circolari tra chunk (react ⇄ vendor) rompendo l'init dei
    // moduli al boot (pagina bianca). Lo splitting che conta è già garantito dai
    // confini async naturali: dataset per-mondo (import() nel registry) e pagina
    // mappa lazy (React Flow viaggia nel suo chunk). Lasciare decidere Rollup.
  };
});
