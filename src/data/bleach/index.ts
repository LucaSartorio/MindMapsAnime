import { bleachSlugs } from './slugs';
import { bleachBattles } from './battles';
import { withBattles } from '../shared/battleKit';
import { bleachFamily } from './family';
import { withFamily } from '../shared/familyKit';
import { bleachStructure } from './structure';
import { withFactionExtras } from '../shared/factionKit';
import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { bleachMapLevels } from './mapLevels';
import { bleachNations } from './nations';
import { bleachLocations } from './locations';
import { bleachLocationsSubmaps } from './locationsSubmaps';
import { bleachCharactersKarakura } from './charactersKarakura';
import { bleachCharactersGotei } from './charactersGotei';
import { bleachCharactersOthers } from './charactersOthers';
import { bleachCharactersArrancar } from './charactersArrancar';
import { bleachCharactersQuincy } from './charactersQuincy';
import { bleachFactions } from './factions';
import { bleachArcs } from './arcs';
import { bleachEvents } from './events';
import { bleachEventsHogyoku } from './eventsHogyoku';
import { bleachRoutes } from './routes';
import { bleachAbilities } from './abilities';
import { bleachAssets } from './assets';

const bleach = animeWorlds.find((w) => w.slug === 'bleach')!;

/**
 * Dataset Bleach.
 *
 * La mappa è una RICOSTRUZIONE ORIGINALE (Bleach non ha mai pubblicato una
 * mappa dei suoi mondi): «I Tre Mondi» come mappa radice, più le sotto-mappe di
 * Karakura, del Seireitei, di Hueco Mundo (Las Noches) e del Reiōkyū, tutte
 * generate da `scripts/bleach-maps.py`.
 *
 * Copre la storia completa — dallo Shinigami sostituto alla Guerra dei Mille
 * Anni, con l'arco del passato, il Fullbring, l'epilogo e il one-shot
 * dell'Inferno — più i quattro archi originali dell'anime (marcati `filler`).
 *
 * Il sistema di poteri (`WorldDataset.jutsu`, «Zanpakutō & Poteri spirituali»)
 * usa due facet: `jutsu.type` = la fonte del potere (Zanpakutō, Kidō, Hollow,
 * Quincy, Fullbring…) e `jutsu.chakraNature` = lo stadio/classe (Shikai,
 * Bankai, Resurrección, Vollständig, Schrift, Hadō, Bakudō…). Gli stadi di
 * rilascio di ogni personaggio sono anche in `character.transformations`.
 */
const events = [...bleachEvents, ...bleachEventsHogyoku].sort((a, b) => a.order - b.order);

/** Gli archi elencano anche gli eventi aggiunti che li dichiarano in `arcId`. */
const arcs = bleachArcs.map((arc) => ({
  ...arc,
  eventIds: [...new Set([...(arc.eventIds ?? []), ...events.filter((e) => e.arcId === arc.id).map((e) => e.id)])],
}));

export const bleachDataset: WorldDataset = withFactionExtras(withFamily(withBattles({
  // Slug SEO pubblicati (congelati): vedi src/seo/slug.ts e `npm run seo:slugs`.
  seoSlugs: bleachSlugs,
  world: bleach,
  mapLevels: bleachMapLevels,
  nations: bleachNations,
  locations: [...bleachLocations, ...bleachLocationsSubmaps],
  characters: [
    ...bleachCharactersKarakura,
    ...bleachCharactersGotei,
    ...bleachCharactersOthers,
    ...bleachCharactersArrancar,
    ...bleachCharactersQuincy,
  ],
  factions: bleachFactions,
  arcs,
  events,
  routes: bleachRoutes,
  jutsu: bleachAbilities,
  assets: bleachAssets,
}, bleachBattles), bleachFamily, 'char-bl-'), bleachStructure);

export { BLEACH_WORLD_VIEWBOX } from './mapConstants';
