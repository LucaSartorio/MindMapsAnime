/**
 * Growth engine configuration — EVERY knob of the editorial plan lives here
 * (no magic numbers in the selector, rules, scoring or hook/CTA engines).
 *
 * Principle: PERFORMANCE OPTIMIZES THE EDITORIAL PLAN, IT DOES NOT CONTROL IT.
 * Hard rules (streaks, part order, duplicates) are filters applied BEFORE any
 * score; performance only ranks what is already editorially valid.
 */
export type ContentType = 'character-journey' | 'guess-character' | 'character-versus' | 'guess-location' | 'journey-comparison';
export const HOOK_TYPES = ['question', 'challenge', 'curiosity', 'fact', 'versus'] as const;
export type HookType = (typeof HOOK_TYPES)[number];
export const CTA_TYPES = [
  'follow-next-part',
  'subscribe-next-part',
  'comment-guess',
  'comment-next-matchup',
  'comment-missed-location',
  'comment-next-journey',
  'comment-pick-side',
  'follow-for-more',
  'site-visit',
] as const;
export type CtaType = (typeof CTA_TYPES)[number];
export type SelectionMode = 'exploit' | 'explore' | 'coldstart';

/** Performance weights (sum = 1). Missing metrics are dropped and the rest re-normalized. */
export type PerformanceWeights = { retention: number; shares: number; comments: number; follows: number; saves: number; likes: number };

export type GrowthConfig = {
  /** Locale of the social feed (one feed, English). */
  feedLocale: 'en';
  /** One new video per run (the daily agent asks for exactly one). */
  videosPerRun: 1;
  /** Share of runs that explore (other anime/characters/hooks/formats) instead of exploiting what performs. */
  explorationRate: number;
  /** Below this many scored posts the selector runs in cold-start mode (variety first, no optimisation). */
  minimumSamples: number;
  // ── HARD rules (never violated, whatever the score) ──────────────────────
  /** Max consecutive feed items sharing an anime. After the streak, a DIFFERENT anime is forced. */
  maxSameAnimeStreak: number;
  /** Max consecutive feed items sharing a character (1 = never twice in a row). */
  maxSameCharacterStreak: number;
  /** Min feed items between two parts of the same journey (Part N waits for N-1 + this gap). */
  minItemsBetweenJourneyParts: number;
  // ── SOFT rules (penalties, can be outweighed only among valid candidates) ──
  preferredItemsBetweenJourneyParts: number;
  /** Items during which a character just seen is penalised. */
  characterCooldown: number;
  /** Items during which an anime just seen is penalised (avoid same anime back-to-back when alternatives exist). */
  animeCooldown: number;
  /** After this many items since its previous part, a waiting series part gets a continuation bonus. */
  journeyPartCooldown: number;
  /** Items during which the same content type is penalised (alternate formats). */
  contentTypeCooldown: number;
  /** Items during which the same hook template can't be reused / the same hook type is penalised. */
  hookCooldown: number;
  /** Items during which the same CTA type is penalised. */
  ctaCooldown: number;
  /** Target mix of formats (deficit = bonus). Only implemented types are used. */
  contentTypeMix: Partial<Record<ContentType, number>>;
  /** Bonus by character importance (prefer main characters, keep secondary ones possible). */
  importanceBonus: Record<string, number>;
  /** Score points of each soft penalty / bonus (0–100 scale like the performance score). */
  penalties: {
    sameAnimeAsLast: number;
    animeInCooldown: number;
    characterInCooldown: number;
    sameContentTypeAsLast: number;
    contentTypeInCooldown: number;
    partBeforePreferredGap: number;
    formatDeficit: number;
    seriesContinuation: number;
    explorationNovelty: number;
    explorationJitter: number;
  };
  performanceWeights: PerformanceWeights;
  /** Rate considered "very good" for each metric (a rate at this value scores 100 before the cap). */
  referenceRates: PerformanceWeights;
  /** Normalised metric ratios are capped (a viral outlier can't dominate). */
  ratioCap: number;
  /** Platforms that drive the strategy and their weight in a content's score (facebook receives content, never drives it). */
  platformWeights: Record<'instagram' | 'facebook' | 'tiktok' | 'youtube', number>;
  /** Metrics collected earlier than this after publication are "immature" (weighted down). */
  matureAfterHours: number;
  immatureWeight: number;
  /** A post needs at least this many views for its rates to mean anything. */
  minViewsForScore: number;
  /** Duration buckets (seconds, inclusive upper bounds) for "which length works". */
  durationBuckets: { id: string; max: number }[];
};

export const GROWTH_CONFIG: GrowthConfig = {
  feedLocale: 'en',
  videosPerRun: 1,
  explorationRate: 0.3,
  minimumSamples: 8,
  maxSameAnimeStreak: 2,
  maxSameCharacterStreak: 1,
  minItemsBetweenJourneyParts: 2,
  preferredItemsBetweenJourneyParts: 3,
  characterCooldown: 6,
  animeCooldown: 1,
  journeyPartCooldown: 3,
  contentTypeCooldown: 1,
  hookCooldown: 4,
  ctaCooldown: 2,
  contentTypeMix: { 'character-journey': 0.5, 'guess-character': 0.25, 'character-versus': 0.25 },
  importanceBonus: { main: 12, major: 7, supporting: 2, minor: 0, background: 0, unknown: 0 },
  penalties: {
    sameAnimeAsLast: 18,
    animeInCooldown: 6,
    characterInCooldown: 25,
    sameContentTypeAsLast: 8,
    contentTypeInCooldown: 3,
    partBeforePreferredGap: 10,
    formatDeficit: 20,
    seriesContinuation: 14,
    explorationNovelty: 30,
    explorationJitter: 12,
  },
  performanceWeights: { retention: 0.35, shares: 0.2, comments: 0.15, follows: 0.15, saves: 0.1, likes: 0.05 },
  referenceRates: { retention: 0.6, shares: 0.01, comments: 0.006, follows: 0.004, saves: 0.012, likes: 0.06 },
  ratioCap: 2,
  platformWeights: { instagram: 1, tiktok: 1, youtube: 1, facebook: 0 },
  matureAfterHours: 48,
  immatureWeight: 0.5,
  minViewsForScore: 50,
  durationBuckets: [
    { id: 'short', max: 22 },
    { id: 'medium', max: 30 },
    { id: 'long', max: 60 },
  ],
};

export function durationBucket(seconds: number | null | undefined, config: GrowthConfig = GROWTH_CONFIG): string | null {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds)) return null;
  return config.durationBuckets.find((b) => seconds <= b.max)?.id ?? config.durationBuckets[config.durationBuckets.length - 1]?.id ?? null;
}
