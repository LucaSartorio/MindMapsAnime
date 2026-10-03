import { attackontitanSlugs } from './slugs';
import type { Character, StoryArc, TimelineEvent, WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { aotMapLevels } from './mapLevels';
import { aotNations } from './nations';
import { aotLocationsWorld } from './locationsWorld';
import { aotLocationsWalls } from './locationsWalls';
import { aotCharactersParadis } from './charactersParadis';
import { aotCharactersMarley } from './charactersMarley';
import { aotCharactersHistory } from './charactersHistory';
import { aotFactions } from './factions';
import { aotArcs } from './arcs';
import { aotEventsWalls } from './eventsWalls';
import { aotEventsWorld } from './eventsWorld';
import { aotRoutes } from './routes';
import { aotAbilities } from './abilities';
import { aotAssets } from './assets';

const attackOnTitan = animeWorlds.find((w) => w.slug === 'attackontitan')!;

const events: TimelineEvent[] = [...aotEventsWalls, ...aotEventsWorld].sort((a, b) => a.order - b.order);

/** Gli `eventIds` di ogni arco sono derivati dagli eventi (una sola fonte di verità). */
const arcs: StoryArc[] = aotArcs.map((arc) => ({
  ...arc,
  eventIds: events.filter((e) => e.arcId === arc.id).map((e) => e.id),
}));

/**
 * I poteri dichiarano i propri utilizzatori (`jutsu.characterIds`): la scheda del
 * personaggio li riceve in `jutsuIds`, così la relazione è sempre bidirezionale.
 */
const characters: Character[] = [...aotCharactersParadis, ...aotCharactersMarley, ...aotCharactersHistory].map((c) => {
  const derived = aotAbilities.filter((a) => a.characterIds?.includes(c.id)).map((a) => a.id);
  const jutsuIds = [...new Set([...(c.jutsuIds ?? []), ...derived])];
  return jutsuIds.length ? { ...c, jutsuIds } : c;
});

/**
 * Dataset Attack on Titan.
 *
 * Le sette mappe sono RICOSTRUZIONI ORIGINALI generate da `scripts/mapgen/aot.py`:
 * il Mondo (la Terra capovolta, come nella serie), l'isola di Paradis, le tre Mura in
 * scala, i distretti di Shiganshina e Trost, Liberio e i Sentieri.
 *
 * Copre la storia completa — dalle origini di Ymir al Boato della Terra e all'epilogo —
 * più i due spin-off canonici «No Regrets» e «Lost Girls» (marcati `novel`).
 *
 * Il sistema di poteri (`WorldDataset.jutsu`, «Giganti & Poteri») usa due facet:
 * `jutsu.type` = la categoria (i Nove Giganti, poteri dei Giganti, sangue reale,
 * Ackerman, equipaggiamento, armi, scienza, tattiche) e `jutsu.chakraNature` =
 * l'origine (Ymir, Impero eldiano, Paradis, Marley, Hizuru). Le forme di Gigante di
 * ogni personaggio sono anche in `character.transformations`.
 */
export const aotDataset: WorldDataset = {
  // Slug SEO pubblicati (congelati): vedi src/seo/slug.ts e `npm run seo:slugs`.
  seoSlugs: attackontitanSlugs,
  world: attackOnTitan,
  mapLevels: aotMapLevels,
  nations: aotNations,
  locations: [...aotLocationsWorld, ...aotLocationsWalls],
  characters,
  factions: aotFactions,
  arcs,
  events,
  routes: aotRoutes,
  jutsu: aotAbilities,
  assets: aotAssets,
};

export { AOT_WORLD_VIEWBOX } from './mapConstants';
