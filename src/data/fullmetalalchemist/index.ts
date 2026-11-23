import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';

const fullmetalAlchemist = animeWorlds.find((w) => w.slug === 'fullmetalalchemist')!;

/**
 * Dataset Fullmetal Alchemist — IN COSTRUZIONE (`status: 'coming_soon'` in `worlds.ts`).
 *
 * Perimetro canonico: il manga di Hiromu Arakawa (108 capitoli, 27 volumi, Monthly Shōnen
 * Gangan 2001-2010). «Brotherhood» (2009-2010) segue il manga ed è usato solo come riferimento
 * per gli episodi; l'anime del 2003 e il suo film sono una continuity separata, esclusa.
 *
 * Il mondo viene popolato a batch verificati (`/add-anime-world`): stato, fonti e ledger in
 * `docs/world-pipeline/fullmetalalchemist.md`. Finché resta `coming_soon` è privato ovunque
 * (sito, sitemap, catalogo social) ma `validate:data` / `validate:i18n` lo controllano già.
 * Prefisso degli id: `fma` (`char-fma-…`, `loc-fma-…`, `evt-fma-…`).
 */
export const fmaDataset: WorldDataset = {
  world: fullmetalAlchemist,
  mapLevels: [],
  nations: [],
  locations: [],
  characters: [],
  factions: [],
  arcs: [],
  events: [],
  routes: [],
  jutsu: [],
  assets: [],
};
