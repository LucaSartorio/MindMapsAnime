import { getLocalizedText } from '@/utils/localization';
import { DEFAULT_DURATION_SECONDS, MAX_DURATION_SECONDS, MIN_DURATION_SECONDS } from '../config/defaults';
import { VIDEO_LOCALES, type TemplateId, type VideoLocale } from '../config/types';
import { availableWorldSlugs, loadWorld } from '../data/world';
import { TEMPLATE_LIST } from '../templates/registry';
import type { CatalogExclusion } from '../templates/types';
import type { PipelineDirs } from './dirs';
import { writeJsonAtomic } from './fs';
import type { History } from './history';
import { contentIdFor, parseRenderId } from './ids';
import { inspectQueue } from './queue';

/**
 * The catalog: every content the engine can REALLY produce, derived from the
 * datasets (nothing hand-listed), with its history status. It's the menu a
 * future agent reads before writing queue entries. Kept compact on purpose:
 * no lore, only what helps choosing.
 */
export type CatalogItem = {
  id: string;
  anime: string;
  animeTitle: string;
  subject: string;
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
  durationSeconds: { min: number; max: number; default: number };
  summary: Record<string, { available: number; excluded: number }>;
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
      durationSeconds: { min: MIN_DURATION_SECONDS, max: MAX_DURATION_SECONDS, default: DEFAULT_DURATION_SECONDS },
      summary: {},
      items: [],
    };
    const report = { byReason: {} as Record<string, number>, items: [] as (CatalogExclusion & { anime: string })[] };
    for (const slug of availableWorldSlugs()) {
      const loaded = await loadWorld(slug);
      const scan = template.scan(loaded);
      entry.summary[slug] = { available: scan.candidates.length, excluded: scan.excluded.length };
      for (const c of scan.candidates) {
        const id = contentIdFor(template.cliName, slug, c.subject);
        const r = sorted(rendered.get(id));
        const p = sorted(published.get(id));
        entry.items.push({
          id,
          anime: slug,
          animeTitle: getLocalizedText(loaded.world.title, 'en'),
          subject: c.subject,
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
      }
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
    for (const [anime, s] of Object.entries(t.summary)) {
      const title = t.items.find((i) => i.anime === anime)?.animeTitle ?? anime;
      lines.push(`  ${title.padEnd(18)} ${String(s.available).padStart(4)} available   (${s.excluded} excluded)`);
    }
    const both = t.items.filter((i) => i.locales.length === VIDEO_LOCALES.length).length;
    const rendered = t.items.filter((i) => i.renderedBefore).length;
    lines.push(`  total ${t.items.length} available · ${both} in en+it · ${rendered} already rendered`);
    lines.push('  excluded:');
    for (const [reason, n] of Object.entries(x.byReason).sort((a, b) => b[1] - a[1])) lines.push(`    ${String(n).padStart(4)} ${reason}`);
  }
  return lines;
}
