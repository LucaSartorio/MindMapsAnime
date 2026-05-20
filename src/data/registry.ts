import type { WorldDataset } from '@/types';
import { narutoDataset } from '@/data/naruto';

/**
 * Registro dei WorldDataset disponibili.
 * Indicizzato per slug per essere risolto dinamicamente in base alla rotta.
 *
 * Per aggiungere un nuovo anime:
 *   1. crea src/data/<slug>/ con i suoi file dati
 *   2. esporta un `<slug>Dataset: WorldDataset`
 *   3. aggiungi qui sotto la mappa { '<slug>': <slug>Dataset }
 *   4. cambia lo status del world in src/data/worlds.ts
 */
export const worldDatasets: Record<string, WorldDataset> = {
  [narutoDataset.world.slug]: narutoDataset,
  // hunterxhunter: hunterxhunterDataset, // appena disponibile
};

/** Recupera il dataset di un mondo dato il suo slug. */
export function getWorldDataset(slug: string): WorldDataset | undefined {
  return worldDatasets[slug];
}
