import type { Character, Localizable, Route, TimelineEvent, WorldDataset } from '@/types';
import type { CharacterJourneyOptions, WorldPoint } from '../config/types';
import { createProjector } from './projection';

/**
 * Generic character journey, derived from the existing dataset (no new data):
 *
 * 1. **Routes** — the character's own routes (`character.routeIds`, routes of
 *    `type: 'character'` featuring them, or routes whose ONLY protagonist they
 *    are). Group routes (e.g. "Akatsuki movements") are not a personal journey.
 *    Route steps are authored in chronological order: they are authoritative.
 *    Steps without an arc take their neighbour's position; a route that can't
 *    be dated at all (no arc on any step, no `relatedArcIds`) is skipped when
 *    other routes are dated.
 * 2. **Events** — the character's located timeline events extend the journey
 *    into story arcs the routes don't cover (the route wins for arcs it covers,
 *    because event `order` is not always chronological inside an arc).
 * 3. Everything is ordered by story-arc order, projected on the world map
 *    (sub-map places → their village pin), and consecutive stops on the same
 *    world pin are merged.
 * 4. Too many stops → `sampleStops` keeps first/last + the most important.
 */
export type JourneyStop = {
  source: 'route' | 'event';
  /** Location referenced by the data (may be a sub-map place). */
  locationId: string;
  /** Location drawn on the world map. */
  anchorLocationId: string;
  point: WorldPoint;
  /** What happens here (route step title/label or event title). */
  label?: Localizable;
  eventId?: string;
  arcId?: string;
  /** Importance used for sampling / highlights (higher = more important). */
  score: number;
};

export type CharacterJourney = {
  stops: JourneyStop[];
  /** Routes the journey was built from. */
  routeIds: string[];
  /** Stops before sampling. */
  candidateCount: number;
  /** Route steps / events of the character whose place can't be drawn on the world map (no coordinates). */
  unmappedCount: number;
};

const IMPORTANCE_SCORE: Record<string, number> = { main: 3, secondary: 2, minor: 1 };

type Candidate = JourneyStop & { key: number };

function eventLocationId(ev: TimelineEvent): string | undefined {
  return ev.locationId ?? ev.locationIds?.[0];
}

/** Personal routes of a character, in the order they are declared. */
export function characterRoutes(dataset: WorldDataset, character: Character, routeIds?: string[]): Route[] {
  if (routeIds?.length) {
    return routeIds
      .map((id) => dataset.routes.find((r) => r.id === id))
      .filter((r): r is Route => Boolean(r));
  }
  const own = new Set(character.routeIds ?? []);
  return dataset.routes.filter((r) => {
    if (own.has(r.id)) return true;
    const protagonists = r.protagonistCharacterIds ?? [];
    const featured = protagonists.includes(character.id) || (r.primaryCharacterIds ?? []).includes(character.id);
    return (r.type === 'character' && featured) || (protagonists.length === 1 && protagonists[0] === character.id);
  });
}

export function buildCharacterJourney(
  dataset: WorldDataset,
  character: Character,
  options: CharacterJourneyOptions = {},
): CharacterJourney {
  const project = createProjector(dataset);
  const arcOrder = new Map(dataset.arcs.map((a) => [a.id, a.order]));
  const events = new Map(dataset.events.map((e) => [e.id, e]));
  const routes = characterRoutes(dataset, character, options.routeIds);

  const scoreOf = (anchorId: string, hasEvent: boolean, fromRoute: boolean) => {
    const anchor = dataset.locations.find((l) => l.id === anchorId);
    return (IMPORTANCE_SCORE[anchor?.importance ?? 'minor'] ?? 1) + (hasEvent ? 2 : 0) + (fromRoute ? 1 : 0);
  };

  // --- 1. route steps (authoritative order) ---------------------------------
  const candidates: Candidate[] = [];
  let unmappedCount = 0;
  const coveredArcs = new Set<string>();
  // A route with no datable step can only be placed via its related arcs (the
  // earliest); if that's impossible too and other routes are dated, it is left
  // out rather than guessing where it belongs in the story.
  const stepArc = (route: Route, step: Route['steps'][number]) =>
    step.arcId ?? (step.eventId ? events.get(step.eventId)?.arcId : undefined) ?? route.arcId;
  const fallbackArc = (route: Route) =>
    [...(route.relatedArcIds ?? [])].filter((id) => arcOrder.has(id)).sort((a, b) => (arcOrder.get(a) ?? 0) - (arcOrder.get(b) ?? 0))[0];
  const datable = (route: Route) => route.steps.some((step) => arcOrder.has(stepArc(route, step) ?? '')) || Boolean(fallbackArc(route));
  const anyDatable = routes.some(datable);

  for (const route of routes) {
    if (anyDatable && !datable(route)) continue;
    const steps = [...route.steps].sort((a, b) => a.order - b.order);
    const fallback = route.steps.some((step) => arcOrder.has(stepArc(route, step) ?? '')) ? undefined : fallbackArc(route);
    const arcs = steps.map((step) => stepArc(route, step) ?? fallback);
    const raw = arcs.map((arcId, i) => {
      const order = arcId !== undefined ? arcOrder.get(arcId) : undefined;
      return order !== undefined ? order * 1000 + i : undefined;
    });
    // Steps without an arc take the position of their neighbour: the previous
    // step's, or — for leading steps — just before the first dated one. The key
    // never goes backwards, so the authored step order is always preserved.
    const firstKnown = raw.findIndex((k) => k !== undefined);
    let prevKey = Number.NEGATIVE_INFINITY;
    steps.forEach((step, i) => {
      const projected = project(step.locationId);
      if (!projected) {
        unmappedCount++;
        return;
      }
      const arcId = arcs[i];
      if (arcId && raw[i] !== undefined) coveredArcs.add(arcId);
      const own = raw[i] ?? (Number.isFinite(prevKey) ? prevKey + 0.5 : firstKnown >= 0 ? (raw[firstKnown] as number) - (firstKnown - i) * 0.01 : i);
      const key = Math.max(own, prevKey + 0.001);
      prevKey = key;
      candidates.push({
        key,
        source: 'route',
        locationId: step.locationId,
        anchorLocationId: projected.anchor.id,
        point: projected.point,
        label: step.title ?? step.label ?? (step.eventId ? events.get(step.eventId)?.title : undefined),
        eventId: step.eventId,
        arcId,
        score: scoreOf(projected.anchor.id, Boolean(step.eventId), true),
      });
    });
  }

  // --- 2. events in arcs not covered by the routes ---------------------------
  if (options.includeEvents !== false) {
    for (const ev of dataset.events) {
      if (!ev.characterIds?.includes(character.id)) continue;
      if (!ev.arcId || coveredArcs.has(ev.arcId)) continue;
      const order = arcOrder.get(ev.arcId);
      const locId = eventLocationId(ev);
      if (order === undefined || !locId) continue;
      const projected = project(locId);
      if (!projected) {
        unmappedCount++;
        continue;
      }
      candidates.push({
        key: order * 1000 + 500 + ev.order / 1000,
        source: 'event',
        locationId: locId,
        anchorLocationId: projected.anchor.id,
        point: projected.point,
        label: ev.title,
        eventId: ev.id,
        arcId: ev.arcId,
        score: scoreOf(projected.anchor.id, true, false),
      });
    }
  }

  // --- 3. chronological order + merge consecutive stops on the same pin -------
  const ordered = candidates
    .map((c, index) => ({ c, index }))
    .sort((a, b) => a.c.key - b.c.key || a.index - b.index)
    .map(({ c }) => c);
  const merged: Candidate[] = [];
  for (const c of ordered) {
    const last = merged[merged.length - 1];
    if (last && last.anchorLocationId === c.anchorLocationId) {
      // Keep the route step (authored label) and the best score.
      if (last.source !== 'route' && c.source === 'route') merged[merged.length - 1] = { ...c, score: Math.max(c.score, last.score) };
      else last.score = Math.max(last.score, c.score);
      continue;
    }
    merged.push({ ...c });
  }

  return {
    stops: merged.map(({ key: _key, ...stop }) => stop),
    routeIds: routes.filter((r) => !anyDatable || datable(r)).map((r) => r.id),
    candidateCount: merged.length,
    unmappedCount,
  };
}

/**
 * Keeps at most `max` stops: always the first and the last (start/end of the
 * journey); the middle is split into `max − 2` equal chronological buckets and
 * each keeps its most important stop (ties → the earlier one). The sample
 * spans the WHOLE journey instead of crowding its first chapters, and is
 * deterministic.
 */
export function sampleStops<T extends { score: number; anchorLocationId: string }>(stops: T[], max: number): T[] {
  if (stops.length <= max) return stops;
  if (max <= 2) return [stops[0], stops[stops.length - 1]].slice(0, Math.max(max, 0));
  const middle = stops.slice(1, -1);
  const buckets = max - 2;
  const last = stops[stops.length - 1];
  const picked: T[] = [stops[0]];
  for (let b = 0; b < buckets; b++) {
    const from = Math.floor((b * middle.length) / buckets);
    const to = Math.floor(((b + 1) * middle.length) / buckets);
    const prev = picked[picked.length - 1].anchorLocationId;
    // Never two consecutive stops on the same map pin (a zero-length leg).
    const slice = middle
      .slice(from, Math.max(to, from + 1))
      .filter((s) => s.anchorLocationId !== prev && (b < buckets - 1 || s.anchorLocationId !== last.anchorLocationId));
    if (slice.length) picked.push(slice.reduce((best, s) => (s.score > best.score ? s : best), slice[0]));
  }
  return [...picked, last];
}

/** Indices of the `count` most important stops (unique world pins), in journey order. */
export function pickHighlights<T extends { score: number; anchorLocationId: string }>(stops: T[], count: number): number[] {
  const seen = new Set<string>();
  return stops
    .map((s, i) => ({ s, i }))
    .sort((a, b) => b.s.score - a.s.score || a.i - b.i)
    .filter(({ s }) => (seen.has(s.anchorLocationId) ? false : (seen.add(s.anchorLocationId), true)))
    .slice(0, count)
    .map(({ i }) => i)
    .sort((a, b) => a - b);
}
