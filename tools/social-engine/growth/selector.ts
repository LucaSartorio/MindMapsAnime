import type { Catalog, CatalogItem } from '../pipeline/catalog';
import type { TemplateId } from '../config/types';
import { GROWTH_CONFIG, type GrowthConfig, type SelectionMode } from './config';
import { IMPLEMENTED_CONTENT_TYPES, contentTypeOfTemplate } from './contentTypes';
import { characterKey, type FeedItem } from './feed';
import { estimate, type PerformanceReport } from './performance';
import { durationBucket } from './config';
import { createRng, type Rng } from './rng';
import { hardRuleViolations, softAdjustment, type EditorialFacts } from './rules';

/**
 * Adaptive selector — picks THE next video (one per run, English feed).
 *
 * Priority order (never "pick the best, then fix it"):
 *   1. validity & sequence  (renderable, in the feed locale, parts in order, spacing)
 *   2. anti-duplication     (renderId never queued/rendered/published before)
 *   3. rotation             (HARD: max 2 same anime in a row, never the same character twice)
 *   4. cooldowns            (soft penalties: same anime/format as last, recent character…)
 *   5. exploration/exploitation (seeded: explorationRate of the runs explore)
 *   6. performance          (shrunk estimates per anime / character / format / duration)
 * Steps 1–3 FILTER; 4–6 only RANK what survived.
 */
export type Candidate = EditorialFacts & {
  contentId: string;
  templateId: TemplateId;
  anime: string;
  characterNames: string[];
  animeTitles: string[];
  importance: string;
  partCount: number | null;
  durationSeconds: number;
  item: CatalogItem;
  /** Queue request fields (template, anime, subject, segment / opponent). */
  request: Record<string, unknown>;
};

export type ScoredCandidate = { candidate: Candidate; score: number; base: number; reasons: string[] };

export type Selection =
  | { ok: true; mode: SelectionMode; seed: string; pick: ScoredCandidate; ranked: ScoredCandidate[]; rejected: Record<string, number>; eligible: number; considered: number }
  | { ok: false; mode: SelectionMode; seed: string; reason: string; rejected: Record<string, number>; considered: number };

const IMPORTANCE_ORDER = ['main', 'major', 'supporting', 'minor', 'background', 'unknown'];

/** Every producible English video of the catalog, as a candidate (implemented content types only). */
export function candidatesFromCatalog(catalog: Catalog, taken: ReadonlySet<string>, config: GrowthConfig = GROWTH_CONFIG): Candidate[] {
  const titles = new Map<string, string>();
  for (const t of Object.values(catalog.templates)) for (const i of t?.items ?? []) titles.set(i.anime, i.animeTitle);
  const out: Candidate[] = [];
  for (const [templateId, t] of Object.entries(catalog.templates) as [TemplateId, Catalog['templates'][TemplateId]][]) {
    const contentType = contentTypeOfTemplate(templateId);
    if (!t || !IMPLEMENTED_CONTENT_TYPES.includes(contentType as never)) continue;
    for (const item of t.items) {
      const renderId = `${item.id}@${config.feedLocale}`;
      if (!item.locales.includes(config.feedLocale) || taken.has(renderId) || item.queuedLocales.includes(config.feedLocale)) continue;
      const versus = contentType === 'character-versus';
      const opponentAnime = versus ? String(item.facts.opponentAnime) : null;
      const animes = versus && opponentAnime && opponentAnime !== item.anime ? [item.anime, opponentAnime] : [item.anime];
      const subject = String(item.request?.subject ?? item.subject);
      const characters = versus ? [characterKey(item.anime, subject), characterKey(String(item.facts.opponentAnime), String(item.facts.opponentSubject))] : [characterKey(item.anime, item.subject)];
      const names = versus ? item.displayName.en.split(' vs ') : [item.displayName.en];
      const importances = [String(item.facts.importance ?? 'unknown'), ...(versus ? [String(item.facts.opponentImportance ?? 'unknown')] : [])];
      out.push({
        renderId,
        contentId: item.id,
        contentType,
        templateId,
        anime: item.anime,
        animes,
        animeTitles: animes.map((a) => titles.get(a) ?? a),
        characters,
        characterNames: names,
        seriesId: item.series?.id ?? null,
        part: item.series?.partNumber ?? null,
        partCount: item.series?.partCount ?? null,
        importance: importances.sort((a, b) => IMPORTANCE_ORDER.indexOf(a) - IMPORTANCE_ORDER.indexOf(b))[0],
        durationSeconds: item.recommendedDurationSeconds,
        item,
        request: {
          template: templateId,
          anime: item.anime,
          ...(item.request ?? { subject: item.subject }),
          ...(item.series ? { segment: item.series.segment } : {}),
        },
      });
    }
  }
  return out;
}

/** Deterministic seed of a decision: the feed state (+ the analytics state). Same state → same pick. */
export function selectionSeed(feed: readonly FeedItem[], performance: PerformanceReport): string {
  return `feed${feed.length}:${feed[feed.length - 1]?.renderId ?? 'empty'}:samples${performance.samples}`;
}

function exposure(feed: readonly FeedItem[], pred: (f: FeedItem) => boolean, window = 30): number {
  const recent = feed.slice(Math.max(0, feed.length - window));
  return recent.length ? recent.filter(pred).length / recent.length : 0;
}

export function selectNext(args: {
  candidates: Candidate[];
  feed: readonly FeedItem[];
  performance: PerformanceReport;
  config?: GrowthConfig;
  seed?: string;
}): Selection {
  const config = args.config ?? GROWTH_CONFIG;
  const { feed, performance } = args;
  const seed = args.seed ?? selectionSeed(feed, performance);
  const rng: Rng = createRng(seed);
  const mode: SelectionMode = performance.coldStart ? 'coldstart' : rng() < config.explorationRate ? 'explore' : 'exploit';

  // 1–3. FILTER — hard rules first, on every candidate.
  const rejected: Record<string, number> = {};
  const eligible = args.candidates.filter((c) => {
    const violations = hardRuleViolations(c, feed, config);
    for (const v of violations) {
      const key = v.split(':')[0];
      rejected[key] = (rejected[key] ?? 0) + 1;
    }
    return violations.length === 0;
  });
  if (!eligible.length) {
    return { ok: false, mode, seed, reason: 'no editorially valid candidate (fail-safe: publish nothing rather than break the rotation)', rejected, considered: args.candidates.length };
  }

  // 4–6. RANK — soft rules + mode-specific base score.
  const p = config.penalties;
  const scored = eligible.map((c): ScoredCandidate => {
    const reasons: string[] = [];
    let base: number;
    if (mode === 'exploit') {
      const parts = [
        estimate(performance, 'contentType', c.contentType),
        ...c.animes.map((a) => estimate(performance, 'anime', a)),
        ...c.characters.map((ch) => estimate(performance, 'character', ch)),
        estimate(performance, 'durationBucket', durationBucket(c.durationSeconds, config)),
      ];
      base = parts.reduce((s, v) => s + v, 0) / parts.length;
      reasons.push(`exploit: predicted performance ${base.toFixed(1)}`);
    } else {
      const seen = Math.max(...c.animes.map((a) => exposure(feed, (f) => f.animes.includes(a))));
      const formatSeen = exposure(feed, (f) => f.contentType === c.contentType);
      const novelty = p.explorationNovelty * (1 - (seen + formatSeen) / 2);
      const jitter = rng() * (mode === 'explore' ? p.explorationJitter : p.explorationJitter / 2);
      base = 50 + novelty + jitter;
      reasons.push(`${mode}: novelty +${novelty.toFixed(1)}, jitter +${jitter.toFixed(1)}`);
    }
    const importance = config.importanceBonus[c.importance] ?? 0;
    if (importance) reasons.push(`+${importance} ${c.importance} character`);
    const soft = softAdjustment(c, feed, config);
    reasons.push(...soft.reasons);
    return { candidate: c, base, score: base + importance + soft.adjustment, reasons };
  });
  scored.sort((a, b) => b.score - a.score || a.candidate.renderId.localeCompare(b.candidate.renderId));
  return { ok: true, mode, seed, pick: scored[0], ranked: scored, rejected, eligible: eligible.length, considered: args.candidates.length };
}

