import type { MetricsStore, MetricValues } from '../pipeline/analytics';
import type { History } from '../pipeline/history';
import { GROWTH_CONFIG, durationBucket, type GrowthConfig, type PerformanceWeights } from './config';
import { feedItemOf } from './feed';

/**
 * Performance engine — turns raw metrics into comparable scores (0–100).
 *
 *   post score   per render × platform, from NORMALIZED rates (shares/views,
 *                comments/views, likes/views, saves/views, follows/views,
 *                retention), each divided by a reference "very good" rate and
 *                capped; weights from GROWTH_CONFIG.performanceWeights. Missing
 *                metrics (null / not reported) are dropped and the remaining
 *                weights re-normalized; under `minViewsForScore` a post is not scored.
 *   content      weighted mean of its post scores (platformWeights: Facebook 0
 *                → it receives content but never drives the strategy;
 *                immature metrics — younger than matureAfterHours — weigh less).
 *   dimensions   mean per character, anime, contentType, hookType, durationBucket,
 *                platform + a SHRUNK estimate (n·mean + k·globalMean)/(n + k),
 *                k = minimumSamples: 1–2 lucky videos can't dominate (cold start).
 *
 * It only RANKS. Editorial rules decide what is eligible (growth/rules.ts).
 */
export type MetricKey = keyof PerformanceWeights;
export type Rates = Partial<Record<MetricKey, number>>;
export type PostScore = { renderId: string; platform: string; score: number; views: number; rates: Rates; mature: boolean; weight: number };
export type DimensionStat = { mean: number; n: number; estimate: number };
export type Dimension = 'content' | 'character' | 'anime' | 'contentType' | 'hookType' | 'durationBucket' | 'platform';

export type PerformanceReport = {
  schemaVersion: 1;
  /** Scored posts (render × platform with enough views). */
  samples: number;
  /** Scored contents (renders). */
  contents: number;
  coldStart: boolean;
  globalMean: number;
  weights: PerformanceWeights;
  posts: PostScore[];
  dimensions: Record<Dimension, Record<string, DimensionStat>>;
};

const num = (m: MetricValues, k: string): number | null => (typeof m[k] === 'number' ? (m[k] as number) : null);

/** Normalized rates of one post; `durationSeconds` turns an average watch time into a retention ratio. */
export function ratesOf(m: MetricValues, durationSeconds: number | null): { views: number | null; rates: Rates } {
  const views = num(m, 'views');
  const rates: Rates = {};
  if (views && views > 0) {
    const per = (k: string) => {
      const v = num(m, k);
      return v === null ? undefined : v / views;
    };
    const shares = per('shares');
    const comments = per('comments');
    const likes = per('likes');
    const saves = per('saves');
    const follows = num(m, 'followersGained') ?? num(m, 'subscribersGained');
    if (shares !== undefined) rates.shares = shares;
    if (comments !== undefined) rates.comments = comments;
    if (likes !== undefined) rates.likes = likes;
    if (saves !== undefined) rates.saves = saves;
    if (follows !== null) rates.follows = follows / views;
  }
  const direct = num(m, 'retention') ?? num(m, 'fullVideoWatchedRate');
  const watch = num(m, 'averageWatchTime') ?? num(m, 'averageViewDuration');
  const retention = direct ?? (watch !== null && durationSeconds ? watch / durationSeconds : null);
  if (retention !== null) rates.retention = Math.min(1, Math.max(0, retention));
  return { views, rates };
}

export function scoreRates(rates: Rates, config: GrowthConfig = GROWTH_CONFIG): number | null {
  let total = 0;
  let weights = 0;
  for (const key of Object.keys(config.performanceWeights) as MetricKey[]) {
    const rate = rates[key];
    if (rate === undefined) continue;
    const w = config.performanceWeights[key];
    total += w * (Math.min(rate / config.referenceRates[key], config.ratioCap) / config.ratioCap);
    weights += w;
  }
  return weights > 0 ? (100 * total) / weights : null;
}

const round = (n: number) => Math.round(n * 100) / 100;

export function buildPerformance(history: History, metrics: MetricsStore, config: GrowthConfig = GROWTH_CONFIG): PerformanceReport {
  const posts: PostScore[] = [];
  for (const post of Object.values(metrics.posts)) {
    const record = history.records[post.renderId];
    if (!record) continue;
    const { views, rates } = ratesOf(post.metrics, record.social?.durationSeconds ?? record.durationSeconds);
    if (views === null || views < config.minViewsForScore) continue;
    const score = scoreRates(rates, config);
    if (score === null) continue;
    const hours = post.publishedAt ? (Date.parse(post.collectedAt) - Date.parse(post.publishedAt)) / 3_600_000 : Number.POSITIVE_INFINITY;
    const mature = hours >= config.matureAfterHours;
    const platformWeight = config.platformWeights[post.platform as keyof GrowthConfig['platformWeights']] ?? 0;
    posts.push({ renderId: post.renderId, platform: post.platform, score: round(score), views, rates, mature, weight: platformWeight * (mature ? 1 : config.immatureWeight) });
  }
  posts.sort((a, b) => a.renderId.localeCompare(b.renderId) || a.platform.localeCompare(b.platform));

  // Content score = weighted mean over its (strategy) platforms.
  const byContent = new Map<string, { sum: number; w: number }>();
  for (const p of posts) {
    if (p.weight <= 0) continue;
    const acc = byContent.get(p.renderId) ?? { sum: 0, w: 0 };
    acc.sum += p.score * p.weight;
    acc.w += p.weight;
    byContent.set(p.renderId, acc);
  }
  const contentScores = [...byContent.entries()].map(([renderId, a]) => ({ renderId, score: a.sum / a.w }));
  const globalMean = contentScores.length ? contentScores.reduce((s, c) => s + c.score, 0) / contentScores.length : 50;
  const k = config.minimumSamples;

  const acc: Record<Dimension, Map<string, number[]>> = {
    content: new Map(), character: new Map(), anime: new Map(), contentType: new Map(), hookType: new Map(), durationBucket: new Map(), platform: new Map(),
  };
  const push = (d: Dimension, key: string | null | undefined, v: number) => {
    if (!key) return;
    acc[d].set(key, [...(acc[d].get(key) ?? []), v]);
  };
  for (const { renderId, score } of contentScores) {
    const record = history.records[renderId];
    const item = feedItemOf(record);
    push('content', record.contentId, score);
    item.characters.forEach((c) => push('character', c, score));
    item.animes.forEach((a) => push('anime', a, score));
    push('contentType', item.contentType, score);
    push('hookType', item.hookType, score);
    push('durationBucket', durationBucket(item.durationSeconds, config), score);
  }
  for (const p of posts) push('platform', p.platform, p.score);

  const dimensions = Object.fromEntries(
    (Object.keys(acc) as Dimension[]).map((d) => [
      d,
      Object.fromEntries(
        [...acc[d].entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, values]) => {
          const mean = values.reduce((s, v) => s + v, 0) / values.length;
          return [key, { mean: round(mean), n: values.length, estimate: round((values.length * mean + k * globalMean) / (values.length + k)) }];
        }),
      ),
    ]),
  ) as Record<Dimension, Record<string, DimensionStat>>;

  return {
    schemaVersion: 1,
    samples: posts.length,
    contents: contentScores.length,
    coldStart: contentScores.length < config.minimumSamples,
    globalMean: round(globalMean),
    weights: config.performanceWeights,
    posts,
    dimensions,
  };
}

/** Shrunk estimate of a dimension value (falls back to the global mean when never measured). */
export function estimate(report: PerformanceReport, d: Dimension, key: string | null | undefined): number {
  const stat = key ? report.dimensions[d][key] : undefined;
  return stat ? stat.estimate : report.globalMean;
}
