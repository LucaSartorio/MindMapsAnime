import type { WorldDataset } from '@/types';
import { createSnapshotStore } from './snapshotStore';

/**
 * Store del mondo attualmente caricato.
 * Generico: ogni anime risolto via slug popola lo stesso store.
 *
 * Snapshot SSR = stato corrente: il mondo attivo è impostato PRIMA del primo
 * render (pre-rendering e `preloadRoute` in main.tsx), vedi `createSnapshotStore`.
 */
interface WorldState {
  worldSlug: string | null;
  dataset: WorldDataset | null;
  setActiveWorld: (slug: string | null, dataset: WorldDataset | null) => void;
  reset: () => void;
}

export const useWorldStore = createSnapshotStore<WorldState>((set) => ({
  worldSlug: null,
  dataset: null,
  setActiveWorld: (slug, dataset) =>
    set({ worldSlug: slug, dataset }),
  reset: () => set({ worldSlug: null, dataset: null }),
}));
