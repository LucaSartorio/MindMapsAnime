import type { Character, StoryArc, TimelineEvent, WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { fullmetalalchemistSlugs } from './slugs';
import { fmaAssets } from './assets';
import { fmaMapLevels } from './mapLevels';
import { fmaCharactersAmestris } from './charactersAmestris';
import { fmaCharactersSecondary } from './charactersSecondary';
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
import { fmaAbilities } from './abilities';
import { withFactionExtras } from '../shared/factionKit';
import { withFamily } from '../shared/familyKit';
import { applyBattles } from '../shared/battleKit';
import { withEventTags } from '../shared/eventTagKit';
import { withAppearance } from '../shared/appearanceKit';
import { fmaAppearance } from './appearance';

const fullmetalAlchemist = animeWorlds.find((w) => w.slug === 'fullmetalalchemist')!;

// Eventi in ordine cronologico della storia (`order`); gli `eventIds` degli archi sono derivati da qui (una sola fonte di verità).
const events: TimelineEvent[] = applyBattles([...fmaEventsEarly, ...fmaEventsWar], fmaBattles).sort((a, b) => a.order - b.order);

/**
 * Le tecniche dichiarano i propri utilizzatori (`jutsu.characterIds`): la scheda del
 * personaggio le riceve in `jutsuIds`, così la relazione è sempre bidirezionale.
 */
const characters: Character[] = [
  ...fmaCharactersAmestris,
  ...fmaCharactersSecondary,
  ...fmaCharactersXing,
  ...fmaCharactersHomunculi,
  ...fmaCharactersMilos,
].map((c) => {
  const derived = fmaAbilities.filter((a) => a.characterIds?.includes(c.id)).map((a) => a.id);
  const jutsuIds = [...new Set([...(c.jutsuIds ?? []), ...derived])];
  return jutsuIds.length ? { ...c, jutsuIds } : c;
});

const arcs: StoryArc[] = fmaArcs.map((arc) => ({
  ...arc,
  eventIds: events.filter((e) => e.arcId === arc.id).map((e) => e.id),
}));

/**
 * Dataset Fullmetal Alchemist — pubblicato (`status: 'available'` in `worlds.ts`).
 *
 * Perimetro canonico: il manga di Hiromu Arakawa (108 capitoli, 27 volumi, Monthly Shōnen
 * Gangan 2001-2010). «Brotherhood» (2009-2010) segue il manga ed è usato solo come riferimento
 * per gli episodi; l'anime del 2003 e il suo film sono una continuity separata, esclusa.
 * Il film «La Stella Sacra di Milos» (2011, originale dell'anime) è incluso con `canonStatus: 'movie'`.
 *
 * Il mondo è stato costruito a batch verificati (`/add-anime-world`): stato, fonti e ledger in
 * `docs/world-pipeline/fullmetalalchemist.md`.
 * Prefisso degli id: `fma` (`char-fma-…`, `loc-fma-…`, `evt-fma-…`).
 */
const fmaBaseDataset: WorldDataset = {
  // Slug SEO pubblicati (congelati): vedi src/seo/slug.ts e `npm run seo:slugs`.
  seoSlugs: fullmetalalchemistSlugs,
  world: fullmetalAlchemist,
  mapLevels: fmaMapLevels,
  nations: fmaNations,
  boundaries: fmaBoundaries,
  locations: fmaLocations,
  characters,
  factions: fmaFactions,
  arcs,
  events,
  routes: [],
  jutsu: fmaAbilities,
  assets: fmaAssets,
};

const fmaTaggedDataset: WorldDataset = withEventTags(withFactionExtras(withFamily(fmaBaseDataset, fmaFamily, 'char-fma-'), fmaStructure), fmaMarkerTags);

/** Aspetto dei personaggi principali per i ritratti SVG generati (`appearance.ts`), applicato per ultimo. */
export const fmaDataset: WorldDataset = withAppearance(fmaTaggedDataset, fmaAppearance, 'char-fma-');
