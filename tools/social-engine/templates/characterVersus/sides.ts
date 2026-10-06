import type { Character, WorldDataset } from '@/types';
import { getEntityDisplayName } from '@/utils/localization';
import { MAX_STOPS, VERSUS_MIN_PLACES, VERSUS_TOP_PER_WORLD } from '../../config/defaults';
import { characterSlug, IMPORTANCE_RANK, journeyFacts } from '../../data/characters';
import { sampleStops } from '../../data/journey';
import type { LoadedWorld } from '../../data/world';

/** Max length of a content-id segment (see pipeline/ids.ts). */
const MAX_SUBJECT = 80;

/** The composite subject of a match-up: `<slugA>-vs-<worldB>-<slugB>` (unique, slug-safe). */
export function versusSubject(slugA: string, worldB: string, slugB: string): string {
  return `${slugA}-vs-${worldB}-${slugB}`;
}

export type RosterEntry = { character: Character; slug: string; places: number; arcs: number; importance: string };

const rosterCache = new WeakMap<WorldDataset, RosterEntry[]>();

/**
 * A world's versus roster: its best journeys (main characters first, then
 * places), each with ≥ VERSUS_MIN_PLACES distinct places on the world map.
 * Same journey builder as CharacterJourney: the numbers are the real ones.
 */
export function versusRoster(dataset: WorldDataset, size = VERSUS_TOP_PER_WORLD): RosterEntry[] {
  let all = rosterCache.get(dataset);
  if (!all) {
    all = dataset.characters
      .map((character) => {
        const slug = characterSlug(dataset, character);
        if (!slug) return null;
        const facts = journeyFacts(dataset, character);
        return { character, slug, places: facts.placeCount, arcs: facts.arcCount, importance: character.importance ?? 'unknown' };
      })
      .filter((e): e is RosterEntry => e !== null && e.places >= VERSUS_MIN_PLACES)
      .sort((a, b) => (IMPORTANCE_RANK[b.importance] ?? 0) - (IMPORTANCE_RANK[a.importance] ?? 0) || b.places - a.places || a.slug.localeCompare(b.slug));
    rosterCache.set(dataset, all);
  }
  return all.slice(0, size);
}

/** Cross-world pairs where A belongs to `world` and B to a LATER world (each pair listed once). */
export function versusPairs(world: LoadedWorld, worlds: LoadedWorld[]): { a: RosterEntry; bWorld: LoadedWorld; b: RosterEntry; subject: string }[] {
  const index = worlds.findIndex((w) => w.world.slug === world.world.slug);
  const pairs: { a: RosterEntry; bWorld: LoadedWorld; b: RosterEntry; subject: string }[] = [];
  for (const a of versusRoster(world.dataset)) {
    for (const bWorld of worlds.slice(index + 1)) {
      for (const b of versusRoster(bWorld.dataset)) {
        const subject = versusSubject(a.slug, bWorld.world.slug, b.slug);
        if (subject.length <= MAX_SUBJECT) pairs.push({ a, bWorld, b, subject });
      }
    }
  }
  return pairs;
}

/** The route drawn for a side: distinct places, journey order, sampled to ≤ MAX_STOPS. */
export function sideRoute(dataset: WorldDataset, character: Character) {
  const facts = journeyFacts(dataset, character);
  return { facts, route: sampleStops(facts.places, MAX_STOPS).map((p) => p.point), name: (l: 'en' | 'it') => getEntityDisplayName(character, l) };
}
