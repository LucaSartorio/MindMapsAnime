import type { StoryArc, TimelineEvent, WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { fmaAssets } from './assets';
import { fmaMapLevels } from './mapLevels';
import { fmaCharactersAmestris } from './charactersAmestris';
import { fmaCharactersHomunculi } from './charactersHomunculi';
import { fmaCharactersXing } from './charactersXing';
import { fmaCharactersMilos } from './charactersMilos';
import { fmaArcs } from './arcs';
import { fmaNations } from './nations';
import { fmaBoundaries } from './boundaries';
import { fmaLocations } from './locations';
import { fmaEventsEarly } from './eventsEarly';
import { fmaEventsWar } from './eventsWar';
import { fmaFactions } from './factions';
import { fmaStructure } from './structure';
import { fmaFamily } from './family';
import { fmaBattles } from './battles';
import { fmaMarkerTags } from './markerTags';
import { withFactionExtras } from '../shared/factionKit';
import { withFamily } from '../shared/familyKit';
import { applyBattles } from '../shared/battleKit';
import { withEventTags } from '../shared/eventTagKit';

const fullmetalAlchemist = animeWorlds.find((w) => w.slug === 'fullmetalalchemist')!;

// Eventi in ordine cronologico della storia (`order`); gli `eventIds` degli archi sono derivati da qui (una sola fonte di verità).
const events: TimelineEvent[] = applyBattles([...fmaEventsEarly, ...fmaEventsWar], fmaBattles).sort((a, b) => a.order - b.order);

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
const fmaBaseDataset: WorldDataset = {
  world: fullmetalAlchemist,
  mapLevels: fmaMapLevels,
  nations: fmaNations,
  boundaries: fmaBoundaries,
  locations: fmaLocations,
  characters: [
    ...fmaCharactersAmestris,
    ...fmaCharactersXing,
    ...fmaCharactersHomunculi,
    ...fmaCharactersMilos,
  ],
  factions: fmaFactions,
  arcs,
  events,
  routes: [],
  jutsu: [],
  assets: fmaAssets,
};

export const fmaDataset: WorldDataset = withEventTags(withFactionExtras(withFamily(fmaBaseDataset, fmaFamily, 'char-fma-'), fmaStructure), fmaMarkerTags);
