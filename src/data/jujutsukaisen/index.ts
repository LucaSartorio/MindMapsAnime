import { jujutsukaisenSlugs } from './slugs';
import type { Character, Faction, StoryArc, TimelineEvent, WorldDataset } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { jjkMapLevels } from './mapLevels';
import { jjkNations } from './nations';
import { jjkLocations } from './locations';
import { jjkCharactersTokyo } from './charactersTokyo';
import { jjkCharactersKyoto } from './charactersKyoto';
import { jjkCharactersCurses } from './charactersCurses';
import { jjkFactions } from './factions';
import { jjkArcs } from './arcs';
import { jjkEventsPast } from './eventsPast';
import { jjkEventsWar } from './eventsWar';
import { jjkEventsMore } from './eventsMore';
import { jjkCharactersExtra } from './charactersExtra';
import { jjkBattles } from './battles';
import { applyBattles } from '../shared/battleKit';
import { jjkFamily } from './family';
import { withFamily } from '../shared/familyKit';
import { jjkStructure } from './structure';
import { withFactionExtras } from '../shared/factionKit';
import { jjkRoutes } from './routes';
import { jjkAbilities } from './abilities';
import { jjkAssets } from './assets';
import { jjkTournaments } from './tournaments';

const jujutsuKaisen = animeWorlds.find((w) => w.slug === 'jujutsukaisen')!;

const events: TimelineEvent[] = applyBattles([...jjkEventsPast, ...jjkEventsWar, ...jjkEventsMore], jjkBattles).sort((a, b) => a.order - b.order);

/** Gli `eventIds` di ogni arco sono derivati dagli eventi (una sola fonte di verità). */
const arcs: StoryArc[] = jjkArcs.map((arc) => ({
  ...arc,
  eventIds: events.filter((e) => e.arcId === arc.id).map((e) => e.id),
}));

/**
 * Le tecniche dichiarano i propri utilizzatori (`jutsu.characterIds`): la scheda del
 * personaggio le riceve in `jutsuIds`, così la relazione è sempre bidirezionale.
 */
const characters: Character[] = [...jjkCharactersTokyo, ...jjkCharactersKyoto, ...jjkCharactersCurses, ...jjkCharactersExtra].map((c) => {
  const derived = jjkAbilities.filter((a) => a.characterIds?.includes(c.id)).map((a) => a.id);
  const jutsuIds = [...new Set([...(c.jutsuIds ?? []), ...derived])];
  return jutsuIds.length ? { ...c, jutsuIds } : c;
});

/**
 * Tecniche ereditarie e di gruppo → fazione: le tecniche di una stirpe (clan Gojo, Zen'in,
 * Kamo, Sukuna, spiriti calamità, stregoni reincarnati del Culling Game) e i Dipinti della
 * Morte compaiono nella scheda della fazione, derivate dal facet `chakraNature`.
 */
const LINEAGE_FACTION: Record<string, string> = {
  gojo_clan: 'faction-jjk-gojo-clan',
  zenin_clan: 'faction-jjk-zenin-clan',
  kamo_clan: 'faction-jjk-kamo-clan',
  sukuna: 'faction-jjk-sukuna-retinue',
  cursed_spirit: 'faction-jjk-disaster-curses',
  reincarnated: 'faction-jjk-culling-players',
};
const EXTRA_FACTION_TECHNIQUES: Record<string, string[]> = {
  'faction-jjk-death-paintings': ['tec-jjk-blood-manipulation', 'tec-jjk-death-paintings'],
};
const factions: Faction[] = jjkFactions.map((f) => {
  const derived = jjkAbilities
    .filter((a) => (a.chakraNature ?? []).some((n) => LINEAGE_FACTION[n] === f.id))
    .map((a) => a.id);
  const jutsuIds = [...new Set([...(f.jutsuIds ?? []), ...derived, ...(EXTRA_FACTION_TECHNIQUES[f.id] ?? [])])];
  return jutsuIds.length ? { ...f, jutsuIds } : f;
});

/**
 * Dataset Jujutsu Kaisen.
 *
 * Le sei mappe sono RICOSTRUZIONI ORIGINALI generate da `scripts/mapgen/jjk.py`: il
 * Giappone (contorni Natural Earth, dominio pubblico) con le colonie del Culling Game,
 * Tokyo, il quartiere di Shibuya dentro il Velo, il campus immaginato dell'Istituto di
 * Tokyo (la serie non ne mostra una pianta), Kyoto e Sendai.
 *
 * Copre la storia completa del manga — dall'era Heian all'epilogo del 2019 — compreso
 * il prequel «Jujutsu Kaisen 0» e il passato di Gojo e Geto («Hidden Inventory»).
 *
 * Il sistema di poteri (`WorldDataset.jutsu`, «Tecniche Malefiche») usa due facet:
 * `jutsu.type` = la categoria (tecnica innata, estensione, dominio, fondamentali,
 * barriere, restrizioni celesti, shikigami, strumenti e oggetti maledetti) e
 * `jutsu.chakraNature` = la stirpe/fonte (clan Gojo, Zen'in, Kamo, Sukuna, spiriti,
 * utilizzatori di maledizioni, reincarnati, stregoni).
 */
export const jjkDataset: WorldDataset = withFactionExtras(withFamily({
  // Slug SEO pubblicati (congelati): vedi src/seo/slug.ts e `npm run seo:slugs`.
  seoSlugs: jujutsukaisenSlugs,
  world: jujutsuKaisen,
  mapLevels: jjkMapLevels,
  nations: jjkNations,
  locations: jjkLocations,
  characters,
  factions,
  arcs,
  events,
  routes: jjkRoutes,
  jutsu: jjkAbilities,
  tournaments: jjkTournaments,
  assets: jjkAssets,
}, jjkFamily, 'char-jjk-'), jjkStructure);

export { JJK_JAPAN_VIEWBOX } from './mapConstants';
