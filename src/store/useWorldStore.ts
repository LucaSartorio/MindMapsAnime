import { create } from 'zustand';
import type { WorldDataset } from '@/types';

/**
 * Store del mondo attualmente caricato.
 * Generico: ogni anime risolto via slug popola lo stesso store.
 */
interface WorldState {
  worldSlug: string | null;
  dataset: WorldDataset | null;
  setActiveWorld: (slug: string | null, dataset: WorldDataset | null) => void;
  reset: () => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  worldSlug: null,
  dataset: null,
  setActiveWorld: (slug, dataset) =>
    set({ worldSlug: slug, dataset }),
  reset: () => set({ worldSlug: null, dataset: null }),
}));
