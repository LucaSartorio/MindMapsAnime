import { getLocalizedText } from '@/utils/localization';
import { MAX_DURATION_SECONDS, MIN_DURATION_SECONDS } from '../config/defaults';
import { VIDEO_LOCALES, type TemplateId, type VideoLocale } from '../config/types';
import { availableWorldSlugs, loadWorld } from '../data/world';
import { TEMPLATE_LIST } from '../templates/registry';
import type { CatalogExclusion } from '../templates/types';
import type { PipelineDirs } from './dirs';
import { writeJsonAtomic } from './fs';
import type { History } from './history';
import { contentIdFor, parseRenderId, seriesIdOf } from './ids';
import { inspectQueue } from './queue';

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
  renderedLocales: VideoLocale[];
  publishedLocales: VideoLocale[];
  queuedLocales: VideoLocale[];
  renderedBefore: boolean;
  publishedBefore: boolean;
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
};

export type ExcludedReport = {
  schemaVersion: 1;
  generatedAt: string;
  templates: Partial<Record<TemplateId, { byReason: Record<string, number>; items: (CatalogExclusion & { anime: string })[] }>>;
};

export async function buildCatalog(dirs: PipelineDirs, history: History, now: string): Promise<{ catalog: Catalog; excluded: ExcludedReport }> {
  const rendered = new Map<string, Set<VideoLocale>>();
  const published = new Map<string, Set<VideoLocale>>();
  const add = (map: Map<string, Set<VideoLocale>>, id: string, l: VideoLocale) => map.set(id, (map.get(id) ?? new Set()).add(l));
  for (const r of Object.values(history.records)) {
    if (r.renderStatus === 'rendered') add(rendered, r.contentId, r.locale);
    if (r.publicationStatus !== 'notPublished') add(published, r.contentId, r.locale);
  }
  const queued = new Map<string, Set<VideoLocale>>();
  for (const item of await inspectQueue(dirs, history)) {
    if (item.ok) add(queued, item.plan.contentId, parseRenderId(item.plan.renderId).locale);
  }
  const sorted = (s?: Set<VideoLocale>) => VIDEO_LOCALES.filter((l) => s?.has(l));

  const catalog: Catalog = {
    schemaVersion: 1,
    generatedAt: now,
    locales: VIDEO_LOCALES,
    idFormat: '<template>:<anime>:<subject>  (one video = id@locale[+variant])',
    templates: {},
  };
  const excluded: ExcludedReport = { schemaVersion: 1, generatedAt: now, templates: {} };

  for (const template of TEMPLATE_LIST) {
    const entry: CatalogTemplate = {
      cliName: template.cliName,
      description: template.description,
      durationSeconds: { min: MIN_DURATION_SECONDS, max: MAX_DURATION_SECONDS, default: 'auto' },
      summary: {},
      items: [],
    };
    const report = { byReason: {} as Record<string, number>, items: [] as (CatalogExclusion & { anime: string })[] };
    for (const slug of availableWorldSlugs()) {
      const loaded = await loadWorld(slug);
      const scan = template.scan(loaded);
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
          publishedLocales: p,
          queuedLocales: sorted(queued.get(id)),
          renderedBefore: r.length > 0,
          publishedBefore: p.length > 0,
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
  return { catalog, excluded };
}

export const CATALOG_FILE = 'catalog.json';
export const EXCLUDED_FILE = 'excluded.json';

export function writeCatalog(dirs: PipelineDirs, built: { catalog: Catalog; excluded: ExcludedReport }): void {
  writeJsonAtomic(`${dirs.catalog}/${CATALOG_FILE}`, built.catalog);
  writeJsonAtomic(`${dirs.catalog}/${EXCLUDED_FILE}`, built.excluded);
}

/** Human summary printed by `social:catalog` (and after a batch). */
export function catalogSummary(built: { catalog: Catalog; excluded: ExcludedReport }): string[] {
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
  return lines;
}
