import type { WorldDataset } from '@/types';

/**
 * Registro dei WorldDataset disponibili — caricamento LAZY per-mondo.
 *
 * Ogni dataset è importato con `import()` dinamico: Vite lo separa in un
 * chunk dedicato, così il bundle iniziale non contiene i dati di nessun
 * mondo e aprire Naruto non scarica/parsa One Piece o HxH. Questo riduce
 * il blocco del main thread (INP/TBT) e il peso della prima visita.
 *
 * Per aggiungere un nuovo anime:
 *   1. crea src/data/<slug>/ con i suoi file dati
 *   2. esporta un `<slug>Dataset: WorldDataset`
 *   3. aggiungi qui sotto il loader { '<slug>': () => import(...) }
 *   4. cambia lo status del world in src/data/worlds.ts
 */
const worldDatasetLoaders: Record<string, () => Promise<WorldDataset>> = {
  naruto: () => import('@/data/naruto').then((m) => m.narutoDataset),
  hunterxhunter: () =>
    import('@/data/hunterxhunter').then((m) => m.hunterxhunterDataset),
  onepiece: () => import('@/data/onepiece').then((m) => m.onepieceDataset),
};

/** Cache dei dataset già caricati (gli oggetti sono singleton immutabili). */
const loadedDatasets = new Map<string, WorldDataset>();
/** Promise in volo per slug, per non duplicare i fetch concorrenti. */
const inflight = new Map<string, Promise<WorldDataset | undefined>>();

/** True se lo slug ha un dataset registrato. */
export function hasWorldDataset(slug: string): boolean {
  return slug in worldDatasetLoaders;
}

/**
 * Carica (una sola volta) il dataset di un mondo. Ritorna `undefined` per
 * slug non registrati. Le chiamate successive risolvono dalla cache.
 */
export function loadWorldDataset(
  slug: string,
): Promise<WorldDataset | undefined> {
  const cached = loadedDatasets.get(slug);
  if (cached) return Promise.resolve(cached);
  const pending = inflight.get(slug);
  if (pending) return pending;
  const loader = worldDatasetLoaders[slug];
  if (!loader) return Promise.resolve(undefined);
  const promise = loader()
    .then((dataset) => {
      loadedDatasets.set(slug, dataset);
      inflight.delete(slug);
      return dataset;
    })
    .catch((err) => {
      inflight.delete(slug);
      throw err;
    });
  inflight.set(slug, promise);
  return promise;
}

/** Accesso sincrono a un dataset GIÀ caricato (altrimenti `undefined`). */
export function getLoadedWorldDataset(slug: string): WorldDataset | undefined {
  return loadedDatasets.get(slug);
}
