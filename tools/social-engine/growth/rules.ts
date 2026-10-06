import { GROWTH_CONFIG, type GrowthConfig } from './config';
import type { FeedItem } from './feed';

/**
 * Editorial rotation — the rules that keep the feed varied.
 *
 * HARD rules are filters: a candidate that breaks one is NOT eligible, whatever
 * its performance score. They run before any scoring (never "pick the best,
 * then fix it"). SOFT rules are score adjustments among eligible candidates
 * (the selector may pick a slightly lower score to keep the feed varied).
 */
export type EditorialFacts = {
  renderId: string;
  contentType: string;
  animes: string[];
  characters: string[];
  seriesId: string | null;
  part: number | null;
};

/** Number of trailing feed items matching `pred` (the current streak). */
export function trailingStreak(feed: readonly FeedItem[], pred: (item: FeedItem) => boolean): number {
  let n = 0;
  for (let i = feed.length - 1; i >= 0 && pred(feed[i]); i--) n++;
  return n;
}

/** Items published AFTER feed[index] (0 = it's the last one). */
const itemsAfter = (feed: readonly FeedItem[], index: number) => feed.length - 1 - index;

function lastIndex(feed: readonly FeedItem[], pred: (item: FeedItem) => boolean): number {
  for (let i = feed.length - 1; i >= 0; i--) if (pred(feed[i])) return i;
  return -1;
}

export function hardRuleViolations(c: EditorialFacts, feed: readonly FeedItem[], config: GrowthConfig = GROWTH_CONFIG): string[] {
  const v: string[] = [];
  // 1. validity & sequence ------------------------------------------------------
  if (feed.some((f) => f.renderId === c.renderId)) v.push(`duplicate: ${c.renderId} is already in the feed`);
  const part = c.part;
  if (c.seriesId && part !== null) {
    if (feed.some((f) => f.seriesId === c.seriesId && f.part !== null && f.part >= part)) {
      v.push(`sequence: a later or equal part of ${c.seriesId} is already in the feed`);
    }
    if (part > 1) {
      const prev = lastIndex(feed, (f) => f.seriesId === c.seriesId && f.part === part - 1);
      if (prev < 0) v.push(`sequence: Part ${part} before Part ${part - 1} (never publish parts out of order)`);
      else if (itemsAfter(feed, prev) < config.minItemsBetweenJourneyParts) {
        v.push(`journey spacing: only ${itemsAfter(feed, prev)} item(s) since Part ${part - 1} (min ${config.minItemsBetweenJourneyParts})`);
      }
    }
  }
  // 2. rotation (anime / character streaks) -------------------------------------
  for (const anime of c.animes) {
    const streak = trailingStreak(feed, (f) => f.animes.includes(anime));
    if (streak >= config.maxSameAnimeStreak) v.push(`anime streak: the last ${streak} items are ${anime} (max ${config.maxSameAnimeStreak}) — a different anime is required`);
  }
  for (const character of c.characters) {
    const streak = trailingStreak(feed, (f) => f.characters.includes(character));
    if (streak >= config.maxSameCharacterStreak) v.push(`character streak: ${character} is in the last ${streak} item(s) (max ${config.maxSameCharacterStreak})`);
  }
  return v;
}

export type SoftScore = { adjustment: number; reasons: string[] };

/** Variety penalties / continuity bonuses among eligible candidates (positive = better). */
export function softAdjustment(c: EditorialFacts, feed: readonly FeedItem[], config: GrowthConfig = GROWTH_CONFIG): SoftScore {
  const p = config.penalties;
  const reasons: string[] = [];
  let adjustment = 0;
  const add = (points: number, why: string) => {
    if (!points) return;
    adjustment += points;
    reasons.push(`${points > 0 ? '+' : ''}${Math.round(points * 10) / 10} ${why}`);
  };
  const last = feed[feed.length - 1];
  if (last) {
    if (c.animes.some((a) => last.animes.includes(a))) add(-p.sameAnimeAsLast, 'same anime as the previous item');
    if (c.contentType === last.contentType) add(-p.sameContentTypeAsLast, 'same format as the previous item');
  }
  const recent = (n: number) => feed.slice(Math.max(0, feed.length - n));
  if (config.animeCooldown > 1 && recent(config.animeCooldown).slice(0, -1).some((f) => c.animes.some((a) => f.animes.includes(a)))) {
    add(-p.animeInCooldown, `anime seen in the last ${config.animeCooldown} items`);
  }
  if (recent(config.characterCooldown).some((f) => c.characters.some((ch) => f.characters.includes(ch)))) {
    add(-p.characterInCooldown, `character seen in the last ${config.characterCooldown} items`);
  }
  if (config.contentTypeCooldown > 1 && recent(config.contentTypeCooldown).slice(0, -1).some((f) => f.contentType === c.contentType)) {
    add(-p.contentTypeInCooldown, `format used in the last ${config.contentTypeCooldown} items`);
  }
  if (c.seriesId && c.part !== null && c.part > 1) {
    const prev = lastIndex(feed, (f) => f.seriesId === c.seriesId && f.part === c.part! - 1);
    if (prev >= 0) {
      const gap = itemsAfter(feed, prev);
      if (gap < config.preferredItemsBetweenJourneyParts) add(-p.partBeforePreferredGap, `only ${gap} items since the previous part (preferred ${config.preferredItemsBetweenJourneyParts})`);
      if (gap >= config.journeyPartCooldown) add(p.seriesContinuation, `continues a started series (Part ${c.part} promised)`);
    }
  }
  // Format mix: types below their target share get a bonus (alternate formats over time).
  const window = recent(20);
  const target = config.contentTypeMix[c.contentType as keyof typeof config.contentTypeMix] ?? 0;
  if (target > 0) {
    const share = window.length ? window.filter((f) => f.contentType === c.contentType).length / window.length : 0;
    add(p.formatDeficit * Math.max(0, target - share) / target, `format below its target share (${Math.round(share * 100)}% < ${Math.round(target * 100)}%)`);
  }
  return { adjustment, reasons };
}
