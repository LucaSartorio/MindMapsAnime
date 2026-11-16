/**
 * Data coverage — per-world gap report for `npm run data:coverage`.
 *
 *   npm run data:coverage                       # every available world, summary
 *   npm run data:coverage -- naruto             # one world (internal slug or URL slug), with samples
 *   npm run data:coverage -- naruto --json      # machine-readable (skills / agents)
 *   npm run data:coverage -- naruto --limit 40  # more sample ids per gap
 *
 * Deterministic and read-only: it loads the datasets through the registry (the same data the site renders)
 * and lists what is MISSING or WEAK, so enrichment work is chosen from facts, not guesses:
 *   - SEO pages below the content threshold (noindex in both it and en) per category;
 *   - entities with no graph relation (orphans);
 *   - characters without places/events, main/major characters without a detailed portrait;
 *   - places without events/characters/arcs; events without place/arc/chapters; arcs without events;
 *   - factions without members; data marked `needs_verification`.
 * It never fails the build (exit 0) unless a requested world does not exist (exit 1).
 * Chapter gaps per series: `npm run coverage:chapters -- <world>`.
 */
import type { WorldDataset } from '@/types';
import { animeWorlds, getWorldUrlSlug } from '@/data/worlds';
import { hasWorldDataset, loadWorldDataset } from '@/data/registry';
import { getLocalizedText } from '@/utils/localization';
import { SEO_CATEGORIES, CATEGORY_ENTITY_TYPE, categoryEntities, seoLocations } from '@/seo/categories';
import { entityQuality } from '@/seo/quality';
import { buildWorldGraph, getConnectedEntities } from '@/lib/graph';
import { isDerivedJourney } from '@/data/shared/autoJourneys';

interface Gap {
  code: string;
  label: string;
  count: number;
  total: number;
  sample: string[];
}

interface WorldCoverage {
  world: string;
  urlSlug: string;
  counts: Record<string, number>;
  seo: Record<string, { pages: number; noindex: number }>;
  gaps: Gap[];
}

// `npm run data:coverage | head` closes the pipe early: exit quietly instead of crashing on EPIPE.
process.stdout.on('error', (e: NodeJS.ErrnoException) => {
  if (e.code === 'EPIPE') process.exit(0);
  throw e;
});

const args = process.argv.slice(2);
const json = args.includes('--json');
const limitIdx = args.indexOf('--limit');
const limit = limitIdx >= 0 ? Math.max(1, Number(args[limitIdx + 1]) || 12) : 12;
const requested = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--limit');

function gap(code: string, label: string, ids: string[], total: number): Gap {
  return { code, label, count: ids.length, total, sample: ids.slice(0, limit) };
}

const nonEmpty = (a?: unknown[]) => !!a && a.length > 0;
const isMain = (imp?: string) => imp === 'main' || imp === 'major';

function analyze(d: WorldDataset): WorldCoverage {
  const graph = buildWorldGraph(d);
  const degree = (type: Parameters<typeof getConnectedEntities>[1]['type'], id: string) =>
    getConnectedEntities(graph, { type, id }).filter((r) => r.type !== 'race' && r.type !== 'saga').length;

  const eventsByLocation = new Map<string, number>();
  const eventsByChar = new Map<string, number>();
  const eventsByArc = new Map<string, number>();
  const placedChars = new Set<string>();
  const arcedPlaces = new Set<string>();
  for (const e of d.events) {
    const places = [...new Set([e.locationId, ...(e.locationIds ?? [])].filter(Boolean) as string[])];
    for (const l of places) {
      eventsByLocation.set(l, (eventsByLocation.get(l) ?? 0) + 1);
      if (e.arcId) arcedPlaces.add(l);
    }
    for (const c of e.characterIds ?? []) {
      eventsByChar.set(c, (eventsByChar.get(c) ?? 0) + 1);
      if (places.length) placedChars.add(c);
    }
    if (e.arcId) eventsByArc.set(e.arcId, (eventsByArc.get(e.arcId) ?? 0) + 1);
  }

  const seo: WorldCoverage['seo'] = {};
  const gaps: Gap[] = [];
  for (const c of SEO_CATEGORIES) {
    let list = categoryEntities(d, c);
    if (c === 'journeys') list = list.filter((r) => !isDerivedJourney(r as never));
    const thin = list
      .filter((e) => !entityQuality(d, c, e.id, 'en').indexable && !entityQuality(d, c, e.id, 'it').indexable)
      .map((e) => e.id);
    seo[c] = { pages: list.length, noindex: thin.length };
    if (thin.length) gaps.push(gap(`thin_${c}`, `${c}: page below content threshold (noindex it+en)`, thin, list.length));
    const orphans = list.filter((e) => degree(CATEGORY_ENTITY_TYPE[c], e.id) === 0).map((e) => e.id);
    if (orphans.length) gaps.push(gap(`orphan_${c}`, `${c}: no relation in the knowledge graph`, orphans, list.length));
  }

  const chars = d.characters;
  gaps.push(
    gap('char_no_place', 'characters tied to no place (no locationIds/villageLocationId, no placed event)', chars.filter((c) => !nonEmpty(c.locationIds) && !c.villageLocationId && !placedChars.has(c.id)).map((c) => c.id), chars.length),
    gap('char_no_event', 'characters in no timeline event', chars.filter((c) => !eventsByChar.has(c.id) && !nonEmpty(c.eventIds)).map((c) => c.id), chars.length),
    gap('main_char_no_long', 'main/major characters without longDescription', chars.filter((c) => isMain(c.importance) && !c.longDescription).map((c) => c.id), chars.filter((c) => isMain(c.importance)).length),
    gap('main_char_no_portrait', 'main/major characters without a detailed portrait (appearance.face)', chars.filter((c) => isMain(c.importance) && !c.appearance?.face).map((c) => c.id), chars.filter((c) => isMain(c.importance)).length),
  );
  const locs = seoLocations(d); // real places only (navigation/gateway pins excluded)
  gaps.push(
    gap('loc_no_event', 'locations hosting no event', locs.filter((l) => !eventsByLocation.has(l.id) && !nonEmpty(l.eventIds)).map((l) => l.id), locs.length),
    gap('loc_no_char', 'locations without characterIds', locs.filter((l) => !nonEmpty(l.characterIds)).map((l) => l.id), locs.length),
    gap('loc_no_arc', 'locations with no arc (no arcIds, no event with an arc): story-moment slider always shows them', locs.filter((l) => !nonEmpty(l.arcIds) && !arcedPlaces.has(l.id)).map((l) => l.id), locs.length),
  );
  const evs = d.events;
  gaps.push(
    gap('event_no_place', 'events without locationId(s)', evs.filter((e) => !e.locationId && !nonEmpty(e.locationIds)).map((e) => e.id), evs.length),
    gap('event_no_arc', 'events without arcId', evs.filter((e) => !e.arcId).map((e) => e.id), evs.length),
    gap('event_no_chapters', 'events without mangaChapters (or animeEpisodes)', evs.filter((e) => !nonEmpty(e.mangaChapters) && !nonEmpty(e.animeEpisodes)).map((e) => e.id), evs.length),
  );
  gaps.push(
    gap('arc_no_event', 'arcs with no event', d.arcs.filter((a) => !eventsByArc.has(a.id) && !nonEmpty(a.eventIds)).map((a) => a.id), d.arcs.length),
    gap('faction_no_member', 'factions without characterIds/leaderIds', d.factions.filter((f) => !nonEmpty(f.characterIds) && !nonEmpty(f.leaderIds)).map((f) => f.id), d.factions.length),
  );
  const nv = [
    ...chars.filter((x) => x.referenceStatus === 'needs_verification').map((x) => `character:${x.id}`),
    ...locs.filter((x) => x.referenceStatus === 'needs_verification').map((x) => `location:${x.id}`),
    ...evs.filter((x) => x.referenceStatus === 'needs_verification').map((x) => `event:${x.id}`),
    ...d.arcs.filter((x) => x.referenceStatus === 'needs_verification').map((x) => `arc:${x.id}`),
    ...d.factions.filter((x) => x.referenceStatus === 'needs_verification').map((x) => `faction:${x.id}`),
    ...(d.jutsu ?? []).filter((x) => x.referenceStatus === 'needs_verification').map((x) => `ability:${x.id}`),
  ];
  const total = chars.length + locs.length + evs.length + d.arcs.length + d.factions.length + (d.jutsu?.length ?? 0);
  gaps.push(gap('needs_verification', 'entities marked referenceStatus: needs_verification', nv, total));

  return {
    world: d.world.slug,
    urlSlug: getWorldUrlSlug(d.world),
    counts: {
      characters: chars.length,
      locations: d.locations.length,
      nations: d.nations.length,
      factions: d.factions.length,
      teams: d.teams?.length ?? 0,
      arcs: d.arcs.length,
      events: evs.length,
      battles: evs.filter((e) => e.battle).length,
      routes: d.routes.length,
      handWrittenRoutes: d.routes.filter((r) => !isDerivedJourney(r)).length,
      abilities: d.jutsu?.length ?? 0,
      tournaments: d.tournaments?.length ?? 0,
      mapLevels: d.mapLevels.length,
    },
    seo,
    gaps: gaps.filter((g) => g.count > 0),
  };
}

const targets = requested.length
  ? requested.map((r) => {
      const w = animeWorlds.find((x) => x.slug === r || getWorldUrlSlug(x) === r);
      if (!w) {
        console.error(`[data-coverage] unknown world "${r}". Known: ${animeWorlds.map((x) => x.slug).join(', ')}`);
        process.exit(1);
      }
      return w;
    })
  : animeWorlds.filter((w) => w.status === 'available');

const reports: WorldCoverage[] = [];
for (const w of targets) {
  if (!hasWorldDataset(w.slug)) {
    if (json) reports.push({ world: w.slug, urlSlug: getWorldUrlSlug(w), counts: {}, seo: {}, gaps: [] });
    else console.log(`\n# ${w.slug} — no dataset yet (status: ${w.status}). Start with /add-anime-world ${w.slug}.`);
    continue;
  }
  const d = await loadWorldDataset(w.slug);
  if (d) reports.push(analyze(d));
}

if (json) {
  console.log(JSON.stringify({ generatedBy: 'scripts/data-coverage.ts', limit, worlds: reports }, null, 2));
} else {
  const detailed = requested.length > 0;
  for (const r of reports) {
    if (!r.counts.characters && !r.counts.locations) continue;
    const title = animeWorlds.find((w) => w.slug === r.world)?.title;
    console.log(`\n# ${title ? getLocalizedText(title, 'en') : r.world} (${r.world} · /${r.urlSlug})`);
    console.log('counts  ' + Object.entries(r.counts).map(([k, v]) => `${k} ${v}`).join(' · '));
    console.log('seo     ' + Object.entries(r.seo).filter(([, v]) => v.pages).map(([k, v]) => `${k} ${v.pages - v.noindex}/${v.pages} indexable`).join(' · '));
    for (const g of r.gaps) {
      const pct = g.total ? ` (${Math.round((g.count / g.total) * 100)}%)` : '';
      console.log(`  - ${g.code.padEnd(22)} ${String(g.count).padStart(5)}/${g.total}${pct}  ${g.label}`);
      if (detailed) console.log(`      e.g. ${g.sample.join(', ')}${g.count > g.sample.length ? ', …' : ''}`);
    }
  }
  if (!requested.length) console.log('\nDetails + sample ids: npm run data:coverage -- <world> [--limit N] [--json]');
}
