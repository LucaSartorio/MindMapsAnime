import type { Catalog } from '../pipeline/catalog';
import type { History } from '../pipeline/history';
import type { MetricsStore } from '../pipeline/analytics';
import { GROWTH_CONFIG, type CtaType, type GrowthConfig, type HookType, type SelectionMode } from './config';
import { chooseCta } from './ctas';
import { buildFeed, type FeedItem } from './feed';
import { chooseHook, type HookRole } from './hooks';
import { buildPerformance, estimate, type PerformanceReport } from './performance';
import { createRng } from './rng';
import { candidatesFromCatalog, selectNext, type Candidate, type Selection } from './selector';

/**
 * The editorial plan of the next run — `catalog/next.json`.
 *
 * Regenerated with the catalog (after every render, publication or analytics
 * state commit), so the daily Content Agent only has to COPY `request` into
 * one queue file. Deterministic: same history + catalog + metrics → same plan.
 * `status: "blocked"` = no editorially valid content (fail-safe: publish nothing).
 */
export type NextPlan = {
  schemaVersion: 1;
  generatedAt: string;
  status: 'ready' | 'blocked';
  reason?: string;
  mode: SelectionMode;
  seed: string;
  /** The last feed items the rules looked at (oldest first). */
  feedTail: { renderId: string; contentType: string; animes: string[]; characters: string[]; part: number | null }[];
  rules: { maxSameAnimeStreak: number; maxSameCharacterStreak: number; minItemsBetweenJourneyParts: number; explorationRate: number; minimumSamples: number };
  performance: { samples: number; contents: number; coldStart: boolean };
  pick?: {
    contentId: string;
    renderId: string;
    contentType: string;
    animes: string[];
    characters: string[];
    part: number | null;
    partCount: number | null;
    score: number;
    reasons: string[];
  };
  /** COPY THIS into tools/social-engine/content/queue/NNNN-<stem>.json (only `$schema` / file name are yours). */
  request?: Record<string, unknown>;
  alternatives: { renderId: string; contentType: string; score: number }[];
  /** Candidates excluded by each hard rule (why the obvious choice may not be eligible). */
  rejected: Record<string, number>;
  considered: number;
  eligible: number;
};

function hookVars(c: Candidate): Record<string, string> {
  const f = c.item.facts;
  const vars: Record<string, string> = { character: c.characterNames[0] ?? '', anime: c.animeTitles[0] ?? c.anime };
  if (c.contentType === 'character-journey') {
    vars.places = String(f.places ?? '');
    if (typeof f.journeyArcs === 'number' && f.journeyArcs > 0) vars.arcs = String(f.journeyArcs);
    if (c.part !== null) Object.assign(vars, { part: String(c.part), total: String(c.partCount ?? ''), prev: String(c.part - 1) });
  } else if (c.contentType === 'guess-character') {
    delete vars.character; // never the answer
    vars.count = String(f.clues ?? '');
  } else if (c.contentType === 'character-versus') {
    Object.assign(vars, { characterA: c.characterNames[0] ?? '', characterB: c.characterNames[1] ?? '', animeA: c.animeTitles[0] ?? '', animeB: c.animeTitles[1] ?? c.animeTitles[0] ?? '' });
  }
  return vars;
}

function hookRole(c: Candidate): HookRole {
  if (c.part === null) return 'single';
  if (c.part === 1) return 'first';
  return c.part === c.partCount ? 'last' : 'continuation';
}

export function planNext(args: {
  catalog: Catalog;
  history: History;
  performance: PerformanceReport;
  now: string;
  /** Queued items not yet in history (e.g. queue files of an open PR). */
  extraFeed?: FeedItem[];
  config?: GrowthConfig;
}): { plan: NextPlan; selection: Selection } {
  const config = args.config ?? GROWTH_CONFIG;
  const feed = buildFeed(args.history, args.now, args.extraFeed ?? [], config);
  const taken = new Set(Object.values(args.history.records).filter((r) => r.renderStatus !== 'failed').map((r) => r.renderId));
  const candidates = candidatesFromCatalog(args.catalog, taken, config);
  const selection = selectNext({ candidates, feed, performance: args.performance, config });
  const base = {
    schemaVersion: 1 as const,
    generatedAt: args.now,
    mode: selection.mode,
    seed: selection.seed,
    feedTail: feed.slice(-6).map((f) => ({ renderId: f.renderId, contentType: f.contentType, animes: f.animes, characters: f.characters, part: f.part })),
    rules: {
      maxSameAnimeStreak: config.maxSameAnimeStreak,
      maxSameCharacterStreak: config.maxSameCharacterStreak,
      minItemsBetweenJourneyParts: config.minItemsBetweenJourneyParts,
      explorationRate: config.explorationRate,
      minimumSamples: config.minimumSamples,
    },
    performance: { samples: args.performance.samples, contents: args.performance.contents, coldStart: args.performance.coldStart },
    rejected: selection.rejected,
    considered: selection.considered,
  };
  if (!selection.ok) return { plan: { ...base, status: 'blocked', reason: selection.reason, alternatives: [], eligible: 0 }, selection };

  const c = selection.pick.candidate;
  const rng = createRng(`${selection.seed}:copy`);
  const typeScores = Object.fromEntries(['question', 'challenge', 'curiosity', 'fact', 'versus'].map((t) => [t, estimate(args.performance, 'hookType', t)])) as Partial<Record<HookType, number>>;
  const hook = chooseHook({ contentType: c.contentType, role: hookRole(c), vars: hookVars(c), feed, mode: selection.mode, typeScores, rng, config });
  const nextPart = c.part !== null && c.partCount !== null && c.part < c.partCount ? c.part + 1 : null;
  const cta = chooseCta({ contentType: c.contentType, nextPart, vars: hookVars(c) }, feed, rng, config);
  const score = Math.round(selection.pick.score * 100) / 100;
  const request: Record<string, unknown> = {
    ...c.request,
    locale: config.feedLocale,
    ...(hook ? { hook: hook.hook, hookType: hook.hookType as HookType, hookId: hook.hookId } : {}),
    ...(cta ? { cta: cta.cta, ctaType: cta.ctaType as CtaType } : {}),
    selection: { mode: selection.mode, score, seed: selection.seed },
    notes: `growth selector (${selection.mode}): ${selection.pick.reasons.slice(0, 3).join('; ')}`.slice(0, 500),
  };
  return {
    plan: {
      ...base,
      status: 'ready',
      pick: { contentId: c.contentId, renderId: c.renderId, contentType: c.contentType, animes: c.animes, characters: c.characters, part: c.part, partCount: c.partCount, score, reasons: selection.pick.reasons },
      request,
      alternatives: selection.ranked.slice(1, 6).map((s) => ({ renderId: s.candidate.renderId, contentType: s.candidate.contentType, score: Math.round(s.score * 100) / 100 })),
      eligible: selection.eligible,
    },
    selection,
  };
}

/** Performance report + plan from the raw state (what `social:catalog` writes). */
export function growthOutputs(args: { catalog: Catalog; history: History; metrics: MetricsStore; now: string; config?: GrowthConfig }) {
  const performance = buildPerformance(args.history, args.metrics, args.config);
  const { plan } = planNext({ catalog: args.catalog, history: args.history, performance, now: args.now, config: args.config });
  return { performance: { ...performance, generatedAt: args.now }, plan };
}

