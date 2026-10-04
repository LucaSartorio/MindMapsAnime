import { blackcloverSlugs } from './slugs';
import type { WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { blackcloverMapLevels } from './mapLevels';
import { blackcloverNations } from './nations';
import { blackcloverLocations } from './locations';
import { blackcloverLocationsBatch1 } from './locationsBatch1';
import { blackcloverLocationsSubmaps } from './locationsSubmaps';
import { blackcloverCharacters } from './characters';
import { blackcloverCharactersBatch1 } from './charactersBatch1';
import { blackcloverCharactersMagicKnights } from './charactersMagicKnights';
import { blackcloverCharactersCloverRealm } from './charactersCloverRealm';
import { blackcloverCharactersElves } from './charactersElves';
import { blackcloverCharactersSpade } from './charactersSpade';
import { blackcloverCharactersOtherLands } from './charactersOtherLands';
import { blackcloverFactions } from './factions';
import { blackcloverFactionsBatch1 } from './factionsBatch1';
import { blackcloverArcs } from './arcs';
import { blackcloverEvents } from './events';
import { blackcloverEventsBatch1 } from './eventsBatch1';
import { blackcloverRoutes } from './routes';
import { blackcloverMagic } from './magic';
import { blackcloverAssets } from './assets';
import { blackcloverTournaments } from './tournaments';

const blackclover = animeWorlds.find((w) => w.slug === 'blackclover')!;

/**
 * Dataset Black Clover (prima versione).
 *
 * Copre i quattro regni del continente (Clover, Diamond, Spade, Heart) più i
 * territori neutrali, Elysia e il Paese del Sole, la sotto-mappa dell'Inframondo,
 * le nove compagnie dei Cavalieri Magici con i loro capitani, l'Occhio Magico
 * della Notte Bianca e gli elfi, la Triade Oscura e i diavoli, e l'intera
 * timeline dal massacro degli elfi di cinquecento anni fa fino all'arco finale
 * di Lucius Zogratis.
 *
 * Il sistema di poteri (`WorldDataset.jutsu`, termine UI «Magia & Grimori») usa
 * due facet: `jutsu.type` è l'ATTRIBUTO MAGICO — in Black Clover ciò che
 * definisce un mago — e `jutsu.chakraNature` il TIPO di magia nella
 * classificazione dell'opera (d'attributo, composita, di creazione, degli
 * spiriti, di maledizione, proibita, diabolica, Stadio Arcano, tecnica di ki).
 * Entrambe le tassonomie vivono in `config.ts` e sono cablate nel `WorldConfig`
 * del mondo in `src/data/worlds.ts`.
 */
const characters = [
  ...blackcloverCharacters,
  ...blackcloverCharactersBatch1,
  ...blackcloverCharactersMagicKnights,
  ...blackcloverCharactersCloverRealm,
  ...blackcloverCharactersElves,
  ...blackcloverCharactersSpade,
  ...blackcloverCharactersOtherLands,
];

/**
 * Le magie dei membri diventano anche magie della loro compagnia/fazione
 * (`faction.jutsuIds`): la scheda del Toro Nero elenca le magie dei suoi
 * membri e ogni magia rimanda alla squadra di chi la usa. Solo per i gruppi
 * "a misura di squadra" (≤ 25 membri), non per le macro-categorie.
 */
const factions = [...blackcloverFactions, ...blackcloverFactionsBatch1].map((f) => {
  const members = new Set([
    ...(f.characterIds ?? []),
    ...characters.filter((c) => c.factionIds?.includes(f.id)).map((c) => c.id),
  ]);
  if (members.size === 0 || members.size > 25) return f;
  const magic = blackcloverMagic.filter((j) => j.characterIds?.some((id) => members.has(id))).map((j) => j.id);
  return { ...f, jutsuIds: [...new Set([...(f.jutsuIds ?? []), ...magic])] };
});

export const blackcloverDataset: WorldDataset = {
  // Slug SEO pubblicati (congelati): vedi src/seo/slug.ts e `npm run seo:slugs`.
  seoSlugs: blackcloverSlugs,
  world: blackclover,
  mapLevels: blackcloverMapLevels,
  nations: blackcloverNations,
  locations: [
    ...blackcloverLocations,
    ...blackcloverLocationsBatch1,
    ...blackcloverLocationsSubmaps,
  ],
  characters,
  factions,
  arcs: blackcloverArcs,
  events: [...blackcloverEvents, ...blackcloverEventsBatch1],
  routes: blackcloverRoutes,
  jutsu: blackcloverMagic,
  tournaments: blackcloverTournaments,
  assets: blackcloverAssets,
};

export { BLACKCLOVER_MAP_VIEWBOX, BLACKCLOVER_UNDERWORLD_VIEWBOX } from './mapConstants';
