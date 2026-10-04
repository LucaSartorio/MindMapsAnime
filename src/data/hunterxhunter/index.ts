import { hunterxhunterSlugs } from './slugs';
import { hxhMarkerTags } from './markerTags';
import { withEventTags } from '../shared/eventTagKit';
import { hxhBattles } from './battles';
import { withBattles } from '../shared/battleKit';
import { hxhFamily } from './family';
import { withFamily } from '../shared/familyKit';
import { hxhStructure } from './structure';
import { withFactionExtras } from '../shared/factionKit';
import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { hxhMapLevels } from './mapLevels';
import { hxhNations } from './nations';
import { hxhBoundaries } from './boundaries';
import { hxhLocations } from './locations';
import { hxhLocationsBatch1 } from './locationsBatch1';
import { hxhSubmapLocations } from './submapLocations';
import { hxhCharacters } from './characters';
import { hxhCharactersBatch1 } from './charactersBatch1';
import { hxhCharactersBatch2 } from './charactersBatch2';
import { hxhCharactersBatch3 } from './charactersBatch3';
import { hxhCharactersBatch4 } from './charactersBatch4';
import { hxhCharactersBatch5 } from './charactersBatch5';
import { hxhCharactersBatch6 } from './charactersBatch6';
import { hxhCharactersBatch7 } from './charactersBatch7';
import { hxhFactions } from './factions';
import { hxhFactionsBatch1 } from './factionsBatch1';
import { hxhArcs } from './arcs';
import { hxhEvents } from './events';
import { hxhEventsBatch1 } from './eventsBatch1';
import { hxhEventsBatch2 } from './eventsBatch2';
import { hxhEventsBatch3 } from './eventsBatch3';
import { hxhEventsBatch4 } from './eventsBatch4';
import { hxhRoutes } from './routes';
import { hxhRoutesBatch1 } from './routesBatch1';
import { hxhRoutesBatch2 } from './routesBatch2';
import { hxhNen } from './nen';
import { hxhNenBatch1 } from './nenBatch1';
import { hxhNenBatch2 } from './nenBatch2';
import { hxhNenBatch3 } from './nenBatch3';
import { enrichHxhCharacters, enrichHxhEvents, enrichHxhFactions } from './relations';
import { hxhAssets } from './assets';
import {
  HXH_BASIC_NEN_USERS,
  HXH_EVENT_LOCATIONS,
  HXH_NEW_SUBMAP_TRIGGERS,
  hxhCompletionCharacters,
  hxhCompletionEvents,
  hxhCompletionFactions,
  hxhCompletionLocations,
} from './completion';
import { HXH_CHARACTER_LONG, HXH_JUTSU_LONG, HXH_LOCATION_LONG } from './contentEnrichment';
import { hxhTournaments } from './tournaments';

const hunterxhunter = animeWorlds.find((w) => w.slug === 'hunterxhunter')!;

/**
 * Dataset Hunter x Hunter (in costruzione).
 *
 * Stato attuale: personaggi principali/maggiori, fazioni, archi narrativi,
 * tecniche Nen firma e la world map estesa del Mondo Conosciuto (nazioni,
 * continenti, confini cliccabili e luoghi iconici) su mappa di riferimento
 * fan-made.
 */
const hxhAllJutsu = [...hxhNen, ...hxhNenBatch1, ...hxhNenBatch2, ...hxhNenBatch3].map((j) => {
  if (!j.longDescription && HXH_JUTSU_LONG[j.id]) j = { ...j, longDescription: HXH_JUTSU_LONG[j.id] };
  const users = HXH_BASIC_NEN_USERS[j.id];
  if (!users) return j;
  const ids = users.map((u) => `char-hxh-${u}`);
  return { ...j, characterIds: [...new Set([...(j.characterIds ?? []), ...ids])] };
});

const hxhAllFactions = enrichHxhFactions([...hxhFactions, ...hxhFactionsBatch1, ...hxhCompletionFactions]);

/** Appartenenza alle fazioni nuove: la lista membri della fazione è la fonte. */
const factionsOf = new Map<string, string[]>();
for (const f of hxhCompletionFactions)
  for (const c of f.characterIds ?? []) factionsOf.set(c, [...(factionsOf.get(c) ?? []), f.id]);


const hxhAllCharacters = enrichHxhCharacters(
  [
    ...hxhCharacters,
    ...hxhCharactersBatch1,
    ...hxhCharactersBatch2,
    ...hxhCharactersBatch3,
    ...hxhCharactersBatch4,
    ...hxhCharactersBatch5,
    ...hxhCharactersBatch6,
    ...hxhCharactersBatch7,
    ...hxhCompletionCharacters,
  ].map((c) => {
    if (!c.longDescription && HXH_CHARACTER_LONG[c.id]) c = { ...c, longDescription: HXH_CHARACTER_LONG[c.id] };
    const extra = factionsOf.get(c.id);
    return extra ? { ...c, factionIds: [...new Set([...(c.factionIds ?? []), ...extra])] } : c;
  }),
  hxhAllJutsu,
);

export const hunterxhunterDataset: WorldDataset = withEventTags(withFactionExtras(withFamily(withBattles({
  // Slug SEO pubblicati (congelati): vedi src/seo/slug.ts e `npm run seo:slugs`.
  seoSlugs: hunterxhunterSlugs,
  world: hunterxhunter,
  mapLevels: hxhMapLevels,
  nations: hxhNations,
  boundaries: hxhBoundaries,
  locations: [...hxhLocations, ...hxhLocationsBatch1, ...hxhSubmapLocations, ...hxhCompletionLocations].map((l) =>
    ({
      ...l,
      ...(HXH_NEW_SUBMAP_TRIGGERS[l.id] ? { subMapLevelId: HXH_NEW_SUBMAP_TRIGGERS[l.id] } : {}),
      ...(!l.longDescription && HXH_LOCATION_LONG[l.id] ? { longDescription: HXH_LOCATION_LONG[l.id] } : {}),
    }),
  ),
  characters: hxhAllCharacters,
  factions: hxhAllFactions,
  arcs: hxhArcs,
  events: enrichHxhEvents([
    ...hxhEvents,
    ...hxhEventsBatch1,
    ...hxhEventsBatch2,
    ...hxhEventsBatch3,
    ...hxhEventsBatch4,
    ...hxhCompletionEvents,
  ].map((e) => {
    const at = HXH_EVENT_LOCATIONS[e.id];
    return at ? { ...e, locationId: at, locationIds: e.locationIds ? [at] : undefined } : e;
  })),
  routes: [...hxhRoutes, ...hxhRoutesBatch1, ...hxhRoutesBatch2],
  jutsu: hxhAllJutsu,
  tournaments: hxhTournaments,
  assets: hxhAssets,
}, hxhBattles), hxhFamily, 'char-hxh-'), hxhStructure), hxhMarkerTags);

export { HXH_MAP_VIEWBOX } from './mapLevels';
