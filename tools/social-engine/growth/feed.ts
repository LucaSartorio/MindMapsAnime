import type { History, HistoryRecord, SocialMeta } from '../pipeline/history';
import { parseContentId } from '../pipeline/ids';
import { GROWTH_CONFIG, type GrowthConfig } from './config';
import { contentTypeOfTemplate } from './contentTypes';

/**
 * The social FEED, derived from history (+ queued content not yet in history):
 * the ordered list of videos that are — or are about to be — on the accounts.
 * Every editorial rule (streaks, part order, cooldowns) reads this list.
 *
 * In the feed: feed-locale (EN) videos that are queued / rendering, scheduled
 * or published somewhere, or rendered with a downloadable MP4 (they will be
 * published). Not in the feed: failed renders, other locales, and old renders
 * that can never be published (no artifact / artifact expired, never posted).
 * Order: creation time (one video per daily run), then renderId.
 */
export type FeedItem = {
  renderId: string;
  contentId: string;
  contentType: string;
  /** World slugs the video is about (a cross-world versus has two). */
  animes: string[];
  /** `anime:slug` keys (unique across worlds). */
  characters: string[];
  /** Series id (`character-journey:dragonball:goku`) for multi-part journeys, else null. */
  seriesId: string | null;
  part: number | null;
  partCount: number | null;
  hookType: string | null;
  hookId: string | null;
  ctaType: string | null;
  durationSeconds: number | null;
  createdAt: string;
  state: 'queued' | 'rendering' | 'rendered' | 'scheduled' | 'published';
};

export const characterKey = (anime: string, slug: string) => `${anime}:${slug}`;

function partOf(segment: string | null): number | null {
  const m = segment ? /^part-(\d+)/.exec(segment) : null;
  return m ? Number(m[1]) : null;
}

/** Feed facts of a record: from its `social` block when present, else derived (records older than the growth engine). */
export function feedItemOf(r: HistoryRecord): FeedItem {
  const { template: cliName, anime, subject, segment } = parseContentId(r.contentId);
  const s = r.social;
  const published = r.platforms.some((p) => p.status === 'published');
  const scheduled = r.platforms.some((p) => p.status === 'scheduled');
  const state: FeedItem['state'] =
    r.renderStatus === 'queued' || r.renderStatus === 'rendering' ? r.renderStatus : published ? 'published' : scheduled ? 'scheduled' : 'rendered';
  return {
    renderId: r.renderId,
    contentId: r.contentId,
    contentType: s?.contentType ?? (contentTypeOfTemplate(r.template) || cliName),
    animes: s?.animes?.length ? s.animes : [anime],
    characters: s?.characters?.length ? s.characters : [characterKey(anime, subject)],
    seriesId: segment ? `${cliName}:${anime}:${subject}` : null,
    part: s?.part ?? partOf(segment),
    partCount: s?.partCount ?? null,
    hookType: s?.hookType ?? null,
    hookId: s?.hookId ?? null,
    ctaType: s?.ctaType ?? null,
    durationSeconds: s?.durationSeconds ?? r.durationSeconds,
    createdAt: r.createdAt,
    state,
  };
}

/** Is this record part of the visible (or upcoming) feed? */
export function inFeed(r: HistoryRecord, now: string, config: GrowthConfig = GROWTH_CONFIG): boolean {
  if (r.locale !== config.feedLocale || r.renderStatus === 'failed') return false;
  if (r.renderStatus === 'queued' || r.renderStatus === 'rendering') return true;
  if (r.platforms.some((p) => p.status === 'scheduled' || p.status === 'published')) return true;
  return Boolean(r.artifact && Date.parse(r.artifact.expiresAt) > Date.parse(now));
}

/** The feed, oldest first. `extra` = queued items not yet in history (e.g. queue files of a PR), appended in order. */
export function buildFeed(history: History, now: string, extra: FeedItem[] = [], config: GrowthConfig = GROWTH_CONFIG): FeedItem[] {
  const items = Object.values(history.records)
    .filter((r) => inFeed(r, now, config))
    .map(feedItemOf)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.renderId.localeCompare(b.renderId));
  const known = new Set(items.map((i) => i.renderId));
  return [...items, ...extra.filter((e) => !known.has(e.renderId))];
}

/** Feed facts of a content that is not in history yet (a queue file): from its social facts. */
export function feedItemFromSocial(renderId: string, contentId: string, s: SocialMeta, createdAt: string): FeedItem {
  const { template, anime, subject, segment } = parseContentId(contentId);
  return {
    renderId,
    contentId,
    contentType: s.contentType,
    animes: s.animes,
    characters: s.characters,
    seriesId: segment ? `${template}:${anime}:${subject}` : null,
    part: s.part,
    partCount: s.partCount,
    hookType: s.hookType,
    hookId: s.hookId,
    ctaType: s.ctaType,
    durationSeconds: s.durationSeconds,
    createdAt,
    state: 'queued',
  };
}
