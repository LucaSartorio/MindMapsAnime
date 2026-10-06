import { getLocalizedText } from '@/utils/localization';
import { MAX_DURATION_SECONDS, MIN_DURATION_SECONDS } from '../config/defaults';
import { VIDEO_LOCALES, type TemplateId, type VideoLocale } from '../config/types';
import { availableWorldSlugs, loadWorld } from '../data/world';
import { TEMPLATE_LIST } from '../templates/registry';
import type { CatalogExclusion } from '../templates/types';
import type { PipelineDirs } from './dirs';
import { writeJsonAtomic } from './fs';
import { platformState, PLATFORMS, PUBLICATION_PROVIDERS, PUBLICATION_STATUSES, type History, type HistoryRecord, type Platform, type PlatformState, type PublicationStatus, type RenderArtifact } from './history';
import { contentIdFor, parseContentId, parseRenderId, renderIdFor, seriesIdOf } from './ids';
import { inspectQueue, listContentFiles } from './queue';
import { loadMetricsSafe, type AnalyticsStatus, type MetricsStore } from './analytics';
import { growthOutputs, type NextPlan } from '../growth/plan';
import type { PerformanceReport } from '../growth/performance';
import type { PlatformMetadata } from '../growth/metadata';
import { contentTypeOfTemplate } from '../growth/contentTypes';

/**
 * The catalog: every content the engine can REALLY produce, derived from the
 * datasets (nothing hand-listed), with its history status. It's the menu a
 * future agent reads before writing queue entries. Kept compact on purpose:
 * no lore, only what helps choosing.
 */
/** Present on the parts of a multi-part journey (null for a single video). */
export type CatalogSeries = {
  /** The subject's series id (= the content id without the segment). */
  id: string;
  /** Value of the queue field `segment` for this part. */
  segment: string;
  partNumber: number;
  partCount: number;
  /** Chronological neighbours (content ids), null at the ends. */
  previousId: string | null;
  nextId: string | null;
  arcIds: string[];
  arcTitles: Record<VideoLocale, string[]>;
  firstArc: string | null;
  lastArc: string | null;
  segmentationVersion: number;
  fingerprint: string;
  /** Locales of the old single "whole journey" video of this subject (pre-series history), if any. */
  legacyRenderedLocales?: VideoLocale[];
};

/** Publication state of one rendered video of an item (every platform listed; notScheduled = never touched). */
export type CatalogRenderPublication = {
  renderId: string;
  locale: VideoLocale;
  variant: string | null;
  status: PublicationStatus;
  platforms: Record<Platform, PlatformState>;
};

export type CatalogItem = {
  id: string;
  anime: string;
  animeTitle: string;
  subject: string;
  series: CatalogSeries | null;
  displayName: Record<VideoLocale, string>;
  locales: VideoLocale[];
  recommendedDurationSeconds: number;
  facts: Record<string, string | number>;
  /** Rendered = an MP4 exists. It does NOT mean scheduled or published. */
  renderedLocales: VideoLocale[];
  /** ≥ 1 platform scheduled (and not yet published there). */
  scheduledLocales: VideoLocale[];
  /** ≥ 1 platform published. */
  publishedLocales: VideoLocale[];
  queuedLocales: VideoLocale[];
  renderedBefore: boolean;
  publishedBefore: boolean;
  /** One entry per rendered video (locale/variant) of this item. */
  publication: CatalogRenderPublication[];
  /** Queue fields beyond `subject` (a versus: `{ subject, opponent }`); absent = `{ subject }`. */
  request?: Record<string, unknown>;
};

/**
 * A rendered video as the Publishing Agent sees it. `platforms` lists all
 * platforms: notScheduled / failed = still to do there; scheduled / published = never again.
 */
export type PublishingEntry = {
  renderId: string;
  contentId: string;
  anime: string;
  subject: string;
  subjectName: string | null;
  locale: VideoLocale;
  variant: string | null;
  segment: string | null;
  partNumber: number | null;
  partCount: number | null;
  renderedAt: string | null;
  durationSeconds: number | null;
  publicationStatus: PublicationStatus;
  platforms: Record<Platform, PlatformState>;
  artifact: RenderArtifact | null;
  contentType: string;
  /** Captions / titles per network (growth engine; null on videos rendered before it). */
  platformMetadata: PlatformMetadata | null;
  /**
   * Series order guard: platform → previous part's renderId that must be
   * scheduled/published on that platform FIRST. Never publish Part N before N-1.
   */
  waitFor: Partial<Record<Platform, string>>;
};

export type CatalogPublishing = {
  contract: string;
  platforms: readonly Platform[];
  providers: readonly string[];
  /** Rendered videos by aggregate publication status (+ how many have no downloadable MP4). */
  summary: Record<PublicationStatus, number> & { rendered: number; unavailable: number };
  /**
   * PRIORITY 1 for the Publishing Agent: rendered, MP4 downloadable, and ≥ 1 platform
   * notScheduled or failed. Oldest render first. Empty → generate new content instead.
   */
  ready: PublishingEntry[];
  /** Rendered but the MP4 can't be downloaded (local render, or artifact expired): needs a re-render first. */
  unavailable: (Pick<PublishingEntry, 'renderId' | 'publicationStatus' | 'platforms'> & { reason: 'no_artifact' | 'artifact_expired' })[];
};

export type CatalogTemplate = {
  cliName: string;
  description: string;
  durationSeconds: { min: number; max: number; default: number | 'auto' };
  /** characters = subjects with ≥ 1 renderable video; videos = items (a series counts each part). */
  summary: Record<string, { characters: number; videos: number; series: number; excluded: number }>;
  items: CatalogItem[];
};

export type Catalog = {
  schemaVersion: 1;
  generatedAt: string;
  locales: readonly VideoLocale[];
  idFormat: string;
  templates: Partial<Record<TemplateId, CatalogTemplate>>;
  publishing: CatalogPublishing;
};

export type ExcludedReport = {
  schemaVersion: 1;
  generatedAt: string;
  templates: Partial<Record<TemplateId, { byReason: Record<string, number>; items: (CatalogExclusion & { anime: string })[] }>>;
};

export type BuiltCatalog = { catalog: Catalog; excluded: ExcludedReport; performance: PerformanceReport & { generatedAt: string }; plan: NextPlan };

/**
 * `ignoreQueue`: build the catalog + plan from the committed STATE only (as if
 * content/queue/ were empty) — what the plan was before a queue PR added its
 * file. Used by the editorial gate to check that a queued request IS the
 * growth engine's selection.
 */
export async function buildCatalog(
  dirs: PipelineDirs,
  history: History,
  now: string,
  opts: { ignoreQueue?: boolean; metrics?: { store: MetricsStore; analytics: AnalyticsStatus } } = {},
): Promise<BuiltCatalog> {
  const rendered = new Map<string, Set<VideoLocale>>();
  const scheduled = new Map<string, Set<VideoLocale>>();
  const published = new Map<string, Set<VideoLocale>>();
  const publication = new Map<string, CatalogRenderPublication[]>();
  const add = (map: Map<string, Set<VideoLocale>>, id: string, l: VideoLocale) => map.set(id, (map.get(id) ?? new Set()).add(l));
  const renderedRecords = Object.values(history.records)
    .filter((r) => r.renderStatus === 'rendered')
    .sort((a, b) => (a.renderedAt ?? '').localeCompare(b.renderedAt ?? '') || a.renderId.localeCompare(b.renderId));
  for (const r of renderedRecords) {
    add(rendered, r.contentId, r.locale);
    if (r.platforms.some((p) => p.status === 'scheduled')) add(scheduled, r.contentId, r.locale);
    if (r.platforms.some((p) => p.status === 'published')) add(published, r.contentId, r.locale);
    const entry = { renderId: r.renderId, locale: r.locale, variant: r.variant, status: r.publicationStatus, platforms: platformStates(r) };
    publication.set(r.contentId, [...(publication.get(r.contentId) ?? []), entry]);
  }
  const queued = new Map<string, Set<VideoLocale>>();
  for (const item of opts.ignoreQueue ? [] : await inspectQueue(dirs, history)) {
    if (item.ok) add(queued, item.plan.contentId, parseRenderId(item.plan.renderId).locale);
  }
  const sorted = (s?: Set<VideoLocale>) => VIDEO_LOCALES.filter((l) => s?.has(l));

  const catalog: Catalog = {
    schemaVersion: 1,
    generatedAt: now,
    locales: VIDEO_LOCALES,
    idFormat: '<template>:<anime>:<subject>  (one video = id@locale[+variant])',
    templates: {},
    publishing: buildPublishing([], { subjectNames: new Map(), partCounts: new Map() }, now), // filled below
  };
  const subjectNames = new Map<string, Record<VideoLocale, string>>();
  const partCounts = new Map<string, number>();
  const excluded: ExcludedReport = { schemaVersion: 1, generatedAt: now, templates: {} };

  const worlds = await Promise.all(availableWorldSlugs().map((slug) => loadWorld(slug)));
  for (const template of TEMPLATE_LIST) {
    const entry: CatalogTemplate = {
      cliName: template.cliName,
      description: template.description,
      durationSeconds: { min: MIN_DURATION_SECONDS, max: MAX_DURATION_SECONDS, default: 'auto' },
      summary: {},
      items: [],
    };
    const report = { byReason: {} as Record<string, number>, items: [] as (CatalogExclusion & { anime: string })[] };
    for (const loaded of worlds) {
      const slug = loaded.world.slug;
      const scan = template.scan(loaded, { worlds });
      const ids = scan.candidates.map((c) => contentIdFor(template.cliName, slug, c.subject, c.segment?.segment ?? null));
      entry.summary[slug] = {
        characters: new Set(scan.candidates.map((c) => c.subject)).size,
        videos: scan.candidates.length,
        series: new Set(scan.candidates.filter((c) => c.segment).map((c) => c.subject)).size,
        excluded: scan.excluded.length,
      };
      scan.candidates.forEach((c, index) => {
        const id = ids[index];
        const r = sorted(rendered.get(id));
        const p = sorted(published.get(id));
        subjectNames.set(seriesIdOf(id), c.displayName);
        if (c.segment) partCounts.set(id, c.segment.partCount);
        let series: CatalogSeries | null = null;
        if (c.segment) {
          const seriesId = seriesIdOf(id);
          // Parts of one subject are consecutive and in order in the scan.
          const neighbour = (delta: number) => {
            const other = scan.candidates[index + delta];
            return other && other.subject === c.subject && other.segment ? ids[index + delta] : null;
          };
          const legacy = sorted(rendered.get(seriesId));
          series = {
            id: seriesId,
            segment: c.segment.segment,
            partNumber: c.segment.partNumber,
            partCount: c.segment.partCount,
            previousId: neighbour(-1),
            nextId: neighbour(1),
            arcIds: c.segment.arcIds,
            arcTitles: c.segment.arcTitlesByLocale,
            firstArc: c.segment.firstArc,
            lastArc: c.segment.lastArc,
            segmentationVersion: c.segment.segmentationVersion,
            fingerprint: c.segment.fingerprint,
            ...(legacy.length ? { legacyRenderedLocales: legacy } : {}),
          };
        }
        entry.items.push({
          id,
          anime: slug,
          animeTitle: getLocalizedText(loaded.world.title, 'en'),
          subject: c.subject,
          series,
          displayName: c.displayName,
          locales: c.locales,
          recommendedDurationSeconds: c.recommendedDurationSeconds,
          facts: c.facts,
          renderedLocales: r,
          scheduledLocales: sorted(scheduled.get(id)),
          publishedLocales: p,
          queuedLocales: sorted(queued.get(id)),
          renderedBefore: r.length > 0,
          publishedBefore: p.length > 0,
          publication: publication.get(id) ?? [],
          ...(c.request ? { request: c.request } : {}),
        });
      });
      for (const x of scan.excluded) {
        report.byReason[x.reason] = (report.byReason[x.reason] ?? 0) + 1;
        report.items.push({ anime: slug, ...x });
      }
    }
    catalog.templates[template.id] = entry;
    excluded.templates[template.id] = report;
  }
  catalog.publishing = buildPublishing(renderedRecords, { subjectNames, partCounts }, now);
  const { store: metrics, analytics } = opts.metrics ?? loadMetricsSafe(dirs);
  const { performance, plan } = growthOutputs({ catalog, history, metrics, analytics, queueFiles: opts.ignoreQueue ? [] : listContentFiles(dirs.queue).entries, now });
  return { catalog, excluded, performance, plan };
}

function emptySummary(): CatalogPublishing['summary'] {
  return { rendered: 0, unavailable: 0, ...(Object.fromEntries(PUBLICATION_STATUSES.map((s) => [s, 0])) as Record<PublicationStatus, number>) };
}

function platformStates(r: HistoryRecord): Record<Platform, PlatformState> {
  return Object.fromEntries(PLATFORMS.map((p) => [p, platformState(r, p)])) as Record<Platform, PlatformState>;
}

/** The Publishing Agent's view of history (records already sorted oldest render first). */
export function buildPublishing(
  records: HistoryRecord[],
  info: { subjectNames: Map<string, Record<VideoLocale, string>>; partCounts: Map<string, number> },
  now: string,
): CatalogPublishing {
  const publishing: CatalogPublishing = { contract: 'docs/SOCIAL_PUBLISHING_CONTRACT.md', platforms: PLATFORMS, providers: PUBLICATION_PROVIDERS, summary: emptySummary(), ready: [], unavailable: [] };
  const byRenderId = new Map(records.map((r) => [r.renderId, r]));
  for (const r of records) {
    publishing.summary.rendered++;
    publishing.summary[r.publicationStatus]++;
    const platforms = platformStates(r);
    if (!PLATFORMS.some((p) => platforms[p] === 'notScheduled' || platforms[p] === 'failed')) continue;
    if (!r.artifact || Date.parse(r.artifact.expiresAt) <= Date.parse(now)) {
      publishing.summary.unavailable++;
      publishing.unavailable.push({ renderId: r.renderId, publicationStatus: r.publicationStatus, platforms, reason: r.artifact ? 'artifact_expired' : 'no_artifact' });
      continue;
    }
    const { segment } = parseContentId(r.contentId);
    const part = segment ? /^part-(\d+)/.exec(segment) : null;
    const waitFor: Partial<Record<Platform, string>> = {};
    if (part && Number(part[1]) > 1) {
      // part-03 → part-02 (a versioned key part-03-v2 → part-02-v2), same locale/variant.
      const prevSegment = segment!.replace(/^part-\d+/, `part-${String(Number(part[1]) - 1).padStart(2, '0')}`);
      const prevId = renderIdFor({ contentId: `${seriesIdOf(r.contentId)}:${prevSegment}`, locale: r.locale, variant: r.variant });
      const prev = byRenderId.get(prevId);
      for (const p of PLATFORMS) {
        if (platforms[p] !== 'notScheduled' && platforms[p] !== 'failed') continue;
        const state = prev ? platformState(prev, p) : 'notScheduled';
        if (state !== 'scheduled' && state !== 'published') waitFor[p] = prevId;
      }
    }
    publishing.ready.push({
      renderId: r.renderId,
      contentId: r.contentId,
      anime: r.anime,
      subject: r.subject,
      subjectName: info.subjectNames.get(seriesIdOf(r.contentId))?.[r.locale] ?? null,
      locale: r.locale,
      variant: r.variant,
      segment,
      partNumber: part ? Number(part[1]) : null,
      partCount: info.partCounts.get(r.contentId) ?? null,
      renderedAt: r.renderedAt,
      durationSeconds: r.durationSeconds,
      publicationStatus: r.publicationStatus,
      platforms,
      artifact: r.artifact,
      contentType: r.social?.contentType ?? contentTypeOfTemplate(r.template),
      platformMetadata: r.social?.platformMetadata ?? null,
      waitFor,
    });
  }
  return publishing;
}

export const CATALOG_FILE = 'catalog.json';
export const EXCLUDED_FILE = 'excluded.json';
/** Growth engine outputs, regenerated with the catalog. */
export const PERFORMANCE_FILE = 'performance.json';
export const NEXT_FILE = 'next.json';

export function writeCatalog(dirs: PipelineDirs, built: BuiltCatalog): void {
  writeJsonAtomic(`${dirs.catalog}/${CATALOG_FILE}`, built.catalog);
  writeJsonAtomic(`${dirs.catalog}/${EXCLUDED_FILE}`, built.excluded);
  writeJsonAtomic(`${dirs.catalog}/${PERFORMANCE_FILE}`, built.performance);
  writeJsonAtomic(`${dirs.catalog}/${NEXT_FILE}`, built.plan);
}

/** Human summary printed by `social:catalog` (and after a batch). */
export function catalogSummary(built: BuiltCatalog): string[] {
  const lines: string[] = [];
  for (const template of TEMPLATE_LIST) {
    const t = built.catalog.templates[template.id];
    const x = built.excluded.templates[template.id];
    if (!t || !x) continue;
    lines.push(`${template.compositionId}:`);
    lines.push(`  ${'world'.padEnd(18)} ${'characters'.padStart(10)} ${'videos'.padStart(7)} ${'series'.padStart(7)} ${'excluded'.padStart(9)}`);
    for (const [anime, s] of Object.entries(t.summary)) {
      const title = t.items.find((i) => i.anime === anime)?.animeTitle ?? anime;
      lines.push(`  ${title.padEnd(18)} ${String(s.characters).padStart(10)} ${String(s.videos).padStart(7)} ${String(s.series).padStart(7)} ${String(s.excluded).padStart(9)}`);
    }
    const both = t.items.filter((i) => i.locales.length === VIDEO_LOCALES.length).length;
    const rendered = t.items.filter((i) => i.renderedBefore).length;
    const characters = new Set(t.items.map((i) => `${i.anime}:${i.subject}`)).size;
    const parts = t.items.filter((i) => i.series).length;
    lines.push(`  total ${characters} characters → ${t.items.length} videos (${parts} are parts of a series) · ${both} in en+it · ${rendered} already rendered`);
    lines.push('  excluded:');
    for (const [reason, n] of Object.entries(x.byReason).sort((a, b) => b[1] - a[1])) lines.push(`    ${String(n).padStart(4)} ${reason}`);
  }
  const p = built.catalog.publishing;
  const byStatus = PUBLICATION_STATUSES.filter((st) => p.summary[st]).map((st) => `${p.summary[st]} ${st}`).join(' · ');
  const n = built.plan;
  lines.push(`performance: ${built.performance.contents} scored video(s) · ${built.performance.coldStart ? 'cold start' : 'optimising'}`);
  lines.push(
    n.status === 'ready' && n.pick
      ? `next: ${n.pick.renderId} (${n.pick.contentType}, ${n.mode}, score ${n.pick.score}) — ${String(n.request?.hook ?? '')}`
      : `next: BLOCKED — ${n.reason ?? 'no valid candidate'}`,
  );
  lines.push(`publishing: ${p.summary.rendered} rendered (${byStatus || 'none'}) · ${p.ready.length} ready to publish (MP4 downloadable) · ${p.unavailable.length} without a downloadable MP4`);
  return lines;
}
