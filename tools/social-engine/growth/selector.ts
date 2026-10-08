import type { Catalog, CatalogItem } from '../pipeline/catalog';
import type { TemplateId } from '../config/types';
import { GROWTH_CONFIG, type GrowthConfig, type SelectionMode } from './config';
import { IMPLEMENTED_CONTENT_TYPES, contentTypeOfTemplate } from './contentTypes';
import { characterKey, type FeedItem } from './feed';
import { estimate, type PerformanceReport } from './performance';
import { durationBucket } from './config';
import { createRng, hashSeed, type Rng } from './rng';
import { editorialConstraints, ruleViolations, softAdjustment, type EditorialConstraints, type EditorialFacts, type RuleCode } from './rules';

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

/** A candidate removed by a HARD rule, with what it could have scored (why the "obvious" pick isn't there). */
export type ExcludedCandidate = {
  renderId: string;
  contentType: string;
  animes: string[];
  characters: string[];
  /** Rule codes (MAX_SAME_ANIME_STREAK, MAX_SAME_CHARACTER_STREAK, JOURNEY_PART_SPACING…). */
  reasons: RuleCode[];
  messages: string[];
  /** Predicted performance + importance bonus (no randomness) — what it would have competed with. */
  potentialScore: number;
};

/**
 * SelectionTrace — the machine-readable explanation of ONE decision (debug,
 * reports, tests, future analytics). Written into catalog/next.json (`trace`),
 * printed by `social:next` / `social:agent`. Contains no secret: only ids,
 * rules, scores and counts.
 */
export type SelectionTrace = {
  traceVersion: 1;
  status: 'selected' | 'blocked';
  /** Content id of the pick (null when blocked). */
  selectedId: string | null;
  renderId: string | null;
  contentType: string | null;
  animes: string[];
  characters: string[];
  mode: SelectionMode;
  seed: string;
  score: number | null;
  /** Mode-specific base (predicted performance in exploit, novelty in explore/coldstart) before bonuses/penalties. */
  base: number | null;
  reasons: string[];
  analytics: { coldStart: boolean; samples: number; contents: number; minimumSamples: number };
  /** Last feed items (oldest first) the rules looked at. */
  recent: { renderId: string; contentType: string; animes: string[]; characters: string[] }[];
  constraints: EditorialConstraints;
  /** Candidates excluded per HARD rule (a candidate may break several). */
  hardRulesTriggered: Partial<Record<RuleCode, number>>;
  candidates: { considered: number; eligible: number; byContentType: Record<string, { considered: number; eligible: number }> };
  /** The most relevant excluded candidates (highest potential first, at least the best one per rule). */
  excluded: ExcludedCandidate[];
  /** Best eligible candidates, pick first. */
  ranked: { renderId: string; contentType: string; animes: string[]; score: number; reasons: string[] }[];
  /** Human explanation, one sentence per fact. */
  explanation: string[];
};

export type Selection =
  | { ok: true; mode: SelectionMode; seed: string; pick: ScoredCandidate; ranked: ScoredCandidate[]; rejected: Record<string, number>; eligible: number; considered: number; trace: SelectionTrace }
  | { ok: false; mode: SelectionMode; seed: string; reason: string; rejected: Record<string, number>; considered: number; trace: SelectionTrace };

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

/** Full deterministic state used by the PRNG. Keep this stable so compacting the persisted seed does not change the pick. */
function selectionStateSeed(feed: readonly FeedItem[], performance: PerformanceReport): string {
  return `feed${feed.length}:${feed[feed.length - 1]?.renderId ?? 'empty'}:samples${performance.samples}`;
}

/** Deterministic, queue-schema-safe seed persisted in next.json / queue requests (max 80 chars). */
export function selectionSeed(feed: readonly FeedItem[], performance: PerformanceReport): string {
  const raw = selectionStateSeed(feed, performance);
  if (raw.length <= 80) return raw;
  const digest = hashSeed(raw).toString(16).padStart(8, '0');
  return `feed${feed.length}:h${digest}:samples${performance.samples}`;
}

function exposure(feed: readonly FeedItem[], pred: (f: FeedItem) => boolean, window = 30): number {
  const recent = feed.slice(Math.max(0, feed.length - window));
  return recent.length ? recent.filter(pred).length / recent.length : 0;
}

/** Predicted performance of a candidate (shrunk estimates; global mean in cold start). No randomness. */
export function predictedPerformance(c: Candidate, performance: PerformanceReport, config: GrowthConfig = GROWTH_CONFIG): number {
  const parts = [
    estimate(performance, 'contentType', c.contentType),
    ...c.animes.map((a) => estimate(performance, 'anime', a)),
    ...c.characters.map((ch) => estimate(performance, 'character', ch)),
    estimate(performance, 'durationBucket', durationBucket(c.durationSeconds, config)),
  ];
  return parts.reduce((s, v) => s + v, 0) / parts.length;
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const TRACE_EXCLUDED = 10;
const TRACE_RANKED = 6;

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
  // The persisted seed is compacted for schema safety; keep the full state as PRNG input
  // so this fix does not change an already planned content selection.
  const rngSeed = args.seed ?? selectionStateSeed(feed, performance);
  const rng: Rng = createRng(rngSeed);
  const mode: SelectionMode = performance.coldStart ? 'coldstart' : rng() < config.explorationRate ? 'explore' : 'exploit';

  // 1–3. FILTER — hard rules first, on every candidate (performance is not even looked at yet).
  const rejected: Record<string, number> = {};
  const excluded: ExcludedCandidate[] = [];
  const byContentType: Record<string, { considered: number; eligible: number }> = {};
  const eligible = args.candidates.filter((c) => {
    const violations = ruleViolations(c, feed, config);
    const t = (byContentType[c.contentType] ??= { considered: 0, eligible: 0 });
    t.considered++;
    if (!violations.length) {
      t.eligible++;
      return true;
    }
    const codes = [...new Set(violations.map((v) => v.code))];
    for (const code of codes) rejected[code] = (rejected[code] ?? 0) + 1;
    excluded.push({
      renderId: c.renderId, contentType: c.contentType, animes: c.animes, characters: c.characters, reasons: codes, messages: violations.map((v) => v.message),
      potentialScore: round2(predictedPerformance(c, performance, config) + (config.importanceBonus[c.importance] ?? 0)),
    });
    return false;
  });
  const traceBase = {
    traceVersion: 1 as const,
    mode,
    seed,
    analytics: { coldStart: performance.coldStart, samples: performance.samples, contents: performance.contents, minimumSamples: config.minimumSamples },
    recent: feed.slice(-6).map((f) => ({ renderId: f.renderId, contentType: f.contentType, animes: f.animes, characters: f.characters })),
    constraints: editorialConstraints(feed, config),
    hardRulesTriggered: rejected as Partial<Record<RuleCode, number>>,
    candidates: { considered: args.candidates.length, eligible: eligible.length, byContentType },
    excluded: topExcluded(excluded),
  };
  if (!eligible.length) {
    const reason = 'no editorially valid candidate (fail-safe: publish nothing rather than break the rotation)';
    const trace: SelectionTrace = {
      ...traceBase, status: 'blocked', selectedId: null, renderId: null, contentType: null, animes: [], characters: [], score: null, base: null, reasons: [reason], ranked: [],
      explanation: [...explain(traceBase, config), `BLOCKED: ${reason}.`],
    };
    return { ok: false, mode, seed, reason, rejected, considered: args.candidates.length, trace };
  }

  // 4–6. RANK — soft rules + mode-specific base score, only among VALID candidates.
  const p = config.penalties;
  const scored = eligible.map((c): ScoredCandidate => {
    const reasons: string[] = [];
    let base: number;
    if (mode === 'exploit') {
      base = predictedPerformance(c, performance, config);
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
  const pick = scored[0];
  const c = pick.candidate;
  const trace: SelectionTrace = {
    ...traceBase,
    status: 'selected',
    selectedId: c.contentId,
    renderId: c.renderId,
    contentType: c.contentType,
    animes: c.animes,
    characters: c.characters,
    score: round2(pick.score),
    base: round2(pick.base),
    reasons: pick.reasons,
    ranked: scored.slice(0, TRACE_RANKED).map((s) => ({ renderId: s.candidate.renderId, contentType: s.candidate.contentType, animes: s.candidate.animes, score: round2(s.score), reasons: s.reasons })),
    explanation: [
      ...explain(traceBase, config),
      `Selected ${c.renderId} (${c.contentType}, ${c.animes.join(' + ')}) — ${mode}, score ${round2(pick.score)} among ${eligible.length} valid candidate(s).`,
    ],
  };
  return { ok: true, mode, seed, pick, ranked: scored, rejected, eligible: eligible.length, considered: args.candidates.length, trace };
}

/** Rotation/spacing exclusions explain a decision; "part N not started yet" is just availability. */
const CODE_PRIORITY: RuleCode[] = ['MAX_SAME_ANIME_STREAK', 'MAX_SAME_CHARACTER_STREAK', 'JOURNEY_PART_SPACING', 'DUPLICATE', 'JOURNEY_PART_ORDER'];
const priorityOf = (e: ExcludedCandidate) => Math.min(...e.reasons.map((r) => CODE_PRIORITY.indexOf(r)));

/** Most relevant excluded candidates: by rule priority, then by potential (bounded list). */
function topExcluded(all: ExcludedCandidate[]): ExcludedCandidate[] {
  return [...all]
    .sort((a, b) => priorityOf(a) - priorityOf(b) || b.potentialScore - a.potentialScore || a.renderId.localeCompare(b.renderId))
    .slice(0, TRACE_EXCLUDED);
}

function explain(t: Pick<SelectionTrace, 'mode' | 'analytics' | 'constraints' | 'hardRulesTriggered'>, config: GrowthConfig): string[] {
  const out: string[] = [];
  const { analytics: a, constraints: k } = t;
  if (t.mode === 'coldstart') out.push(`Cold start: ${a.contents} scored video(s) < minimumSamples ${a.minimumSamples} → editorial/variety selection (performance not used yet).`);
  else out.push(`${t.mode === 'explore' ? 'Exploration' : 'Exploitation'} run (explorationRate ${config.explorationRate}); ${a.contents} scored video(s), estimates shrunk to the mean with k = ${a.minimumSamples}.`);
  if (k.forcedAnimeRotation) out.push(`Forced anime rotation: the last ${k.sameAnimeStreak.length} items are ${k.blockedAnimes.join(' / ')} (maxSameAnimeStreak ${config.maxSameAnimeStreak}) → every ${k.blockedAnimes.join(' / ')} candidate is excluded, whatever its score.`);
  if (k.blockedCharacters.length) out.push(`${k.blockedCharacters.join(', ')} excluded in every format (maxSameCharacterStreak ${config.maxSameCharacterStreak}).`);
  if (t.hardRulesTriggered.JOURNEY_PART_SPACING) out.push(`${t.hardRulesTriggered.JOURNEY_PART_SPACING} series part(s) wait for spacing (≥ ${config.minItemsBetweenJourneyParts} items between parts).`);
  if (k.contentTypeStreak.length >= 2) out.push(`Format cooldown: the last ${k.contentTypeStreak.length} items are ${k.contentTypeStreak.contentType} → other formats are preferred (soft).`);
  return out;
}
