import type { StoryArc, TimelineEvent, WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { fmaAssets } from './assets';
import { fmaMapLevels } from './mapLevels';
import { fmaCharactersAmestris } from './charactersAmestris';
import { fmaCharactersHomunculi } from './charactersHomunculi';
import { fmaCharactersXing } from './charactersXing';
import { fmaCharactersMilos } from './charactersMilos';
import { fmaArcs } from './arcs';

const fullmetalAlchemist = animeWorlds.find((w) => w.slug === 'fullmetalalchemist')!;

// Eventi: ancora nessuno (batch 6); gli `eventIds` degli archi sono derivati da qui (una sola fonte di verità).
const events: TimelineEvent[] = [];

const arcs: StoryArc[] = fmaArcs.map((arc) => ({
  ...arc,
  eventIds: events.filter((e) => e.arcId === arc.id).map((e) => e.id),
}));

/**
 * Dataset Fullmetal Alchemist — IN COSTRUZIONE (`status: 'coming_soon'` in `worlds.ts`).
 *
 * Perimetro canonico: il manga di Hiromu Arakawa (108 capitoli, 27 volumi, Monthly Shōnen
 * Gangan 2001-2010). «Brotherhood» (2009-2010) segue il manga ed è usato solo come riferimento
 * per gli episodi; l'anime del 2003 e il suo film sono una continuity separata, esclusa.
 * Il film «La Stella Sacra di Milos» (2011, originale dell'anime) è incluso con `canonStatus: 'movie'`.
 *
 * Il mondo viene popolato a batch verificati (`/add-anime-world`): stato, fonti e ledger in
 * `docs/world-pipeline/fullmetalalchemist.md`. Finché resta `coming_soon` è privato ovunque
 * (sito, sitemap, catalogo social) ma `validate:data` / `validate:i18n` lo controllano già.
 * Prefisso degli id: `fma` (`char-fma-…`, `loc-fma-…`, `evt-fma-…`).
 */
export const fmaDataset: WorldDataset = {
  world: fullmetalAlchemist,
  mapLevels: fmaMapLevels,
  nations: [],
  locations: [],
  characters: [
    ...fmaCharactersAmestris,
    ...fmaCharactersXing,
    ...fmaCharactersHomunculi,
    ...fmaCharactersMilos,
  ],
  factions: [],
  arcs,
  events,
  routes: [],
  jutsu: [],
  assets: fmaAssets,
};
