import type { Catalog } from '../pipeline/catalog';
import { platformState, PLATFORMS, type History, type Platform } from '../pipeline/history';
import type { AnalyticsStatus, MetricsStore } from '../pipeline/analytics';
import { GROWTH_CONFIG, type CtaType, type GrowthConfig, type HookType, type SelectionMode } from './config';
import { chooseCta } from './ctas';
import { buildFeed, feedItemOf, inFeed, type FeedItem } from './feed';
import { chooseHook, type HookRole } from './hooks';
import { buildPerformance, estimate, type PerformanceReport } from './performance';
import { createRng } from './rng';
import { candidatesFromCatalog, selectNext, type Candidate, type Selection, type SelectionTrace } from './selector';

/**
 * The editorial plan of the next run — `catalog/next.json`.
 *
 * Regenerated with the catalog (after every render, publication or analytics
 * state commit), so the daily agent never chooses content itself: it only
 * COPIES `request` into one queue file. Deterministic: same history + catalog
 * + metrics → same plan.
 *
 *   status "ready"    → queue exactly `request` (one video).
 *   status "backlog"  → queue NOTHING: a rendered video is still unpublished
 *                       (publish it — it is today's video) or a render is in
 *                       progress. `backlog` says which.
 *   status "blocked"  → queue nothing: no editorially valid content (fail-safe).
 */
export type PlanStatus = 'ready' | 'backlog' | 'blocked';

export type PlanBacklog = {
  /** Feed-locale renders with a downloadable MP4 and NO platform scheduled/published: publish these before any new content. */
  unpublished: { renderId: string; contentType: string; renderedAt: string | null; missing: Platform[] }[];
  /** Publications already started (≥ 1 platform scheduled/published) with platforms still notScheduled/failed. Completed by the Publishing Agent; they do NOT block new content. */
  unfinished: { renderId: string; missing: Platform[] }[];
  /** Queued / rendering videos (history) and queue files waiting for the Social render workflow. */
  inProgress: { id: string; state: 'queued' | 'rendering' | 'queue-file' }[];
};

export type NextPlan = {
  schemaVersion: 1;
  generatedAt: string;
  status: PlanStatus;
  reason?: string;
  mode: SelectionMode;
  seed: string;
  /** The last feed items the rules looked at (oldest first). */
  feedTail: { renderId: string; contentType: string; animes: string[]; characters: string[]; part: number | null }[];
  rules: { maxSameAnimeStreak: number; maxSameCharacterStreak: number; minItemsBetweenJourneyParts: number; explorationRate: number; minimumSamples: number };
  performance: { samples: number; contents: number; coldStart: boolean };
  /** Analytics are an optimisation input, never a blocker: "unavailable" → cold-start/editorial selection. */
  analytics: AnalyticsStatus;
  backlog: PlanBacklog;
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
  /** Candidates excluded by each hard rule code (why the obvious choice may not be eligible). */
  rejected: Record<string, number>;
  considered: number;
  eligible: number;
  /** Machine-readable explanation of the decision (null when the selector didn't run: backlog). */
  trace: SelectionTrace | null;
};

/** What must be published / finished before a NEW video is selected (backlog first, no duplicates). */
export function planBacklog(history: History, now: string, queueFiles: readonly string[] = [], config: GrowthConfig = GROWTH_CONFIG): PlanBacklog {
  const backlog: PlanBacklog = { unpublished: [], unfinished: [], inProgress: queueFiles.map((id) => ({ id, state: 'queue-file' as const })) };
  const records = Object.values(history.records)
    .filter((r) => inFeed(r, now, config))
    .sort((a, b) => (a.renderedAt ?? a.createdAt).localeCompare(b.renderedAt ?? b.createdAt) || a.renderId.localeCompare(b.renderId));
  for (const r of records) {
    if (r.renderStatus === 'queued' || r.renderStatus === 'rendering') {
      backlog.inProgress.push({ id: r.renderId, state: r.renderStatus });
      continue;
    }
    if (r.renderStatus !== 'rendered') continue;
    const missing = PLATFORMS.filter((p) => ['notScheduled', 'failed'].includes(platformState(r, p)));
    if (!missing.length) continue;
    if (missing.length === PLATFORMS.length) backlog.unpublished.push({ renderId: r.renderId, contentType: feedItemOf(r).contentType, renderedAt: r.renderedAt, missing });
    else if (r.artifact && Date.parse(r.artifact.expiresAt) > Date.parse(now)) backlog.unfinished.push({ renderId: r.renderId, missing });
  }
  return backlog;
}

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
  /** Files waiting in content/queue/ (a render is pending → backlog). */
  queueFiles?: readonly string[];
  analytics?: AnalyticsStatus;
  config?: GrowthConfig;
}): { plan: NextPlan; selection: Selection | null } {
  const config = args.config ?? GROWTH_CONFIG;
  const feed = buildFeed(args.history, args.now, args.extraFeed ?? [], config);
  const backlog = planBacklog(args.history, args.now, args.queueFiles ?? [], config);
  const analytics: AnalyticsStatus = args.analytics ?? { status: args.performance.samples ? 'ok' : 'empty', posts: args.performance.samples, error: null };
  const taken = new Set(Object.values(args.history.records).filter((r) => r.renderStatus !== 'failed').map((r) => r.renderId));
  const candidates = candidatesFromCatalog(args.catalog, taken, config);
  const base = {
    schemaVersion: 1 as const,
    generatedAt: args.now,
    status: 'ready' as PlanStatus,
    feedTail: feed.slice(-6).map((f) => ({ renderId: f.renderId, contentType: f.contentType, animes: f.animes, characters: f.characters, part: f.part })),
    rules: {
      maxSameAnimeStreak: config.maxSameAnimeStreak,
      maxSameCharacterStreak: config.maxSameCharacterStreak,
      minItemsBetweenJourneyParts: config.minItemsBetweenJourneyParts,
      explorationRate: config.explorationRate,
      minimumSamples: config.minimumSamples,
    },
    performance: { samples: args.performance.samples, contents: args.performance.contents, coldStart: args.performance.coldStart },
    analytics,
    backlog,
  };
  if (backlog.unpublished.length || backlog.inProgress.length) {
    // BACKLOG FIRST: an unpublished render IS today's video; a pending render must finish. No new selection.
    const reason = backlog.unpublished.length
      ? `publish the existing render first: ${backlog.unpublished.map((b) => b.renderId).join(', ')} (it counts as today's video; no new content)`
      : `a render is in progress: ${backlog.inProgress.map((b) => b.id).join(', ')} (wait for the Social render workflow; no new content)`;
    return {
      plan: { ...base, mode: args.performance.coldStart ? 'coldstart' : 'exploit', seed: '', status: 'backlog', reason, alternatives: [], rejected: {}, considered: 0, eligible: 0, trace: null },
      selection: null,
    };
  }
  const selection = selectNext({ candidates, feed, performance: args.performance, config });
  const selected = { mode: selection.mode, seed: selection.seed, rejected: selection.rejected, considered: selection.considered, trace: selection.trace };
  if (!selection.ok) return { plan: { ...base, ...selected, status: 'blocked', reason: selection.reason, alternatives: [], eligible: 0 }, selection };

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
      ...selected,
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
export function growthOutputs(args: {
  catalog: Catalog;
  history: History;
  metrics: MetricsStore;
  now: string;
  analytics?: AnalyticsStatus;
  queueFiles?: readonly string[];
  config?: GrowthConfig;
}) {
  const performance = buildPerformance(args.history, args.metrics, args.config);
  const { plan } = planNext({ catalog: args.catalog, history: args.history, performance, now: args.now, analytics: args.analytics, queueFiles: args.queueFiles, config: args.config });
  return { performance: { ...performance, generatedAt: args.now }, plan };
}


/**
 * Request fields that must be the plan's (the agent never rewrites hook / CTA /
 * locale). The identity (template, anime, subject, segment, opponent) is
 * compared through the renderId, which the engine derives after normalising it.
 */
export const PLAN_COPIED_FIELDS = ['locale', 'hook', 'hookType', 'hookId', 'cta', 'ctaType'] as const;

/**
 * Is this queued request the growth engine's selection? null = yes; otherwise
 * why not. `raw` is the queue file as written (the plan `request` + `$schema`
 * and the engine-normalised fields).
 */
export function planMismatch(plan: NextPlan, renderId: string, raw: Record<string, unknown>): string | null {
  if (plan.status !== 'ready' || !plan.pick || !plan.request) return `the growth plan is "${plan.status}"${plan.reason ? `: ${plan.reason}` : ''} — no new content may be queued`;
  if (plan.pick.renderId !== renderId) return `the growth engine selected ${plan.pick.renderId}, not ${renderId}`;
  const request = plan.request;
  const norm = (v: unknown) => (v === undefined ? null : JSON.stringify(v));
  const diff = PLAN_COPIED_FIELDS.filter((f) => norm(request[f]) !== norm(raw[f]));
  if (diff.length) return `fields differ from the plan request: ${diff.join(', ')} (copy catalog/next.json "request" verbatim)`;
  const seed = (raw.selection as { seed?: unknown } | undefined)?.seed;
  if (seed !== (request.selection as { seed: string }).seed) return 'selection.seed differs from the plan (copy "selection" verbatim)';
  return null;
}
