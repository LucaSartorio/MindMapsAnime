import { fillTemplate } from '../config/copy';
import { MAX_CTA_CHARS } from '../config/defaults';
import { GROWTH_CONFIG, type CtaType, type GrowthConfig } from './config';
import type { FeedItem } from './feed';
import type { Rng } from './rng';

/**
 * CTA engine: engagement first (follow, comment, next part), the site only
 * occasionally. The VIDEO CTA is network-neutral (one MP4 for every network);
 * the network-specific wording (Subscribe on YouTube, Follow elsewhere) lives
 * in the captions built by `metadata.ts` from the same `ctaType`.
 */
export type CtaSituation = {
  contentType: string;
  /** Next part number when this video is a non-final part of a series. */
  nextPart: number | null;
  vars: Record<string, string>;
};

type CtaTemplate = { ctaType: CtaType; contentTypes: string[]; video: string; when?: (s: CtaSituation) => boolean };

const notSeries = (s: CtaSituation) => s.nextPart === null;

export const CTA_BANK: CtaTemplate[] = [
  { ctaType: 'follow-next-part', contentTypes: ['character-journey'], video: 'Follow for Part {next}.', when: (s) => s.nextPart !== null },
  { ctaType: 'comment-missed-location', contentTypes: ['character-journey'], video: 'Which location did we miss?', when: notSeries },
  { ctaType: 'comment-next-journey', contentTypes: ['character-journey'], video: 'Which journey should we map next?', when: notSeries },
  { ctaType: 'follow-for-more', contentTypes: ['character-journey'], video: 'Follow for the next journey.', when: notSeries },
  { ctaType: 'site-visit', contentTypes: ['character-journey'], video: 'See every place on AniMapVerse.', when: notSeries },
  { ctaType: 'comment-guess', contentTypes: ['guess-character'], video: 'Did you get it right?' },
  { ctaType: 'comment-guess', contentTypes: ['guess-character'], video: 'How many places did you recognize?' },
  { ctaType: 'follow-for-more', contentTypes: ['guess-character'], video: 'Follow for the next one.' },
  { ctaType: 'comment-next-matchup', contentTypes: ['character-versus'], video: 'Who should compete next?' },
  { ctaType: 'comment-pick-side', contentTypes: ['character-versus'], video: '{characterA} or {characterB}? Tell us.' },
  { ctaType: 'follow-for-more', contentTypes: ['character-versus'], video: 'Follow for the next match-up.' },
];

/** Minimum feed items between two site-visit CTAs (the site is secondary). */
export const SITE_CTA_MIN_GAP = 5;

export type CtaChoice = { ctaType: CtaType; cta: string };

export function ctaOptions(s: CtaSituation): CtaChoice[] {
  return CTA_BANK.filter((t) => t.contentTypes.includes(s.contentType) && (!t.when || t.when(s)))
    .map((t) => ({ ctaType: t.ctaType, cta: fillTemplate(t.video, { ...s.vars, next: String(s.nextPart ?? '') }) }))
    .filter((c) => !/\{\w+\}/.test(c.cta) && c.cta.length <= MAX_CTA_CHARS);
}

/**
 * A non-final series part ALWAYS promises the next part (the strongest follow
 * reason). Otherwise: rotate CTA types (the ones used in the last
 * `ctaCooldown` items are avoided), the site at most once every
 * SITE_CTA_MIN_GAP items, ties broken by the seeded rng.
 */
export function chooseCta(s: CtaSituation, feed: readonly FeedItem[], rng: Rng, config: GrowthConfig = GROWTH_CONFIG): CtaChoice | null {
  const options = ctaOptions(s);
  if (!options.length) return null;
  const forced = options.find((o) => o.ctaType === 'follow-next-part');
  if (forced) return forced;
  const recent = feed.slice(Math.max(0, feed.length - config.ctaCooldown)).map((f) => f.ctaType);
  const siteRecent = feed.slice(Math.max(0, feed.length - SITE_CTA_MIN_GAP)).some((f) => f.ctaType === 'site-visit');
  let pool = options.filter((o) => !(o.ctaType === 'site-visit' && siteRecent));
  const fresh = pool.filter((o) => !recent.includes(o.ctaType));
  if (fresh.length) pool = fresh;
  if (!pool.length) pool = options.filter((o) => o.ctaType !== 'site-visit');
  return pool[Math.floor(rng() * pool.length)] ?? options[0];
}
