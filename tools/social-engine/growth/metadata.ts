import type { CtaType } from './config';

/**
 * Per-network publication metadata, built deterministically from the video's
 * facts (no AI text). Computed at render time, stored in the manifest and in
 * history (`social.platformMetadata`), exposed to the Publishing Agent in
 * `catalog.publishing.ready[]`.
 *
 *   Instagram  comments · follows · shares · saves (question + save prompt + hashtags)
 *   TikTok     short, punchy, few hashtags
 *   YouTube    clear, searchable title (≤ 100 chars) + description; madeForKids = false
 *   Facebook   receives the content, simple caption (doesn't drive the strategy)
 *
 * Guess videos never reveal the answer (no character name, no character tag).
 * Versus captions never reveal the winner.
 * AI-disclosure flags stay those the Publishing Agent already sets per network
 * (the videos are programmatic motion graphics from our own data).
 */
export type SocialFacts = {
  contentType: string;
  /** World slugs + localized titles, primary first. */
  animes: string[];
  animeTitles: string[];
  characterNames: string[];
  part: number | null;
  partCount: number | null;
  /** Places of the whole journey (journey) / shown places (guess). */
  places: number | null;
  pageUrl: string;
  /** Never put this in a caption when true (guess). */
  spoilerFree: boolean;
};

export type PlatformMetadata = {
  instagramCaption: string;
  tiktokCaption: string;
  youtubeTitle: string;
  youtubeDescription: string;
  facebookCaption: string;
  hashtags: string[];
  youtube: { madeForKids: false };
  madeForKids: false;
};

/**
 * How each network receives the video — the Publishing Agent's existing,
 * correct Metricool settings (docs/SOCIAL_PUBLISHING_CONTRACT.md › Platform
 * settings). Labels for reports only: the repository never calls Metricool.
 */
export const PLATFORM_TARGETS: Record<'instagram' | 'facebook' | 'tiktok' | 'youtube', string> = {
  instagram: 'Instagram Reel — REEL · showReelOnFeed = true · isAiGenerated = true',
  tiktok: 'TikTok — public video · isAigc = true',
  youtube: 'YouTube Short — short · public · FILM_ANIMATION · madeForKids = false · isAiGeneratedContent = true',
  facebook: 'Facebook Reel — REEL',
};

/** Per-world emoji + hashtags (world-specific config, not hard-coded in components). */
export const WORLD_SOCIAL: Record<string, { emoji: string; tags: string[] }> = {
  naruto: { emoji: '🍥', tags: ['naruto', 'narutoshippuden'] },
  onepiece: { emoji: '🏴‍☠️', tags: ['onepiece'] },
  dragonball: { emoji: '🐉', tags: ['dragonball', 'dbz'] },
  hunterxhunter: { emoji: '🎣', tags: ['hunterxhunter', 'hxh'] },
  bleach: { emoji: '⚔️', tags: ['bleach'] },
  attackontitan: { emoji: '🧱', tags: ['attackontitan', 'aot'] },
  jujutsukaisen: { emoji: '🌀', tags: ['jujutsukaisen', 'jjk'] },
  blackclover: { emoji: '📖', tags: ['blackclover'] },
};

const BRAND_TAGS = ['anime', 'animemap', 'AniMapVerse'];
const YT_TITLE_MAX = 100;
const tagOf = (name: string) => name.normalize('NFD').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
const uniq = <T,>(xs: T[]) => [...new Set(xs)];

function worldTags(anime: string, title: string): string[] {
  return WORLD_SOCIAL[anime]?.tags ?? [tagOf(title)];
}

function clip(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

/** Network wording of the CTA (video CTA is neutral; captions adapt). */
function networkCta(ctaType: CtaType | string | null, network: 'instagram' | 'tiktok' | 'youtube' | 'facebook', f: SocialFacts): string {
  const next = f.part !== null ? f.part + 1 : null;
  switch (ctaType) {
    case 'follow-next-part':
    case 'subscribe-next-part':
      return network === 'youtube' ? `Subscribe for Part ${next}.` : `Follow for Part ${next}.`;
    case 'comment-guess':
      return 'Did you get it right? Tell us how many places it took you 👇';
    case 'comment-next-matchup':
      return 'Who should compete next? Drop a match-up 👇';
    case 'comment-pick-side':
      return `${f.characterNames[0]} or ${f.characterNames[1]}? Pick a side 👇`;
    case 'comment-missed-location':
      return 'Which location did we miss? 👇';
    case 'comment-next-journey':
      return 'Which journey should we map next? 👇';
    case 'site-visit':
      return `Every place, on the interactive map: ${f.pageUrl}`;
    default:
      return network === 'youtube' ? 'Subscribe for more anime journeys.' : 'Follow for more anime journeys.';
  }
}

export function buildPlatformMetadata(f: SocialFacts, hook: string, ctaType: CtaType | string | null): PlatformMetadata {
  const emoji = WORLD_SOCIAL[f.animes[0]]?.emoji ?? '🗺️';
  const anime = f.animeTitles.join(' × ');
  const name = f.characterNames[0] ?? '';
  const partLabel = f.part !== null && f.partCount !== null ? `Part ${f.part}/${f.partCount}` : null;
  const characterTags = f.spoilerFree ? [] : f.characterNames.map(tagOf);
  const hashtags = uniq([...f.animes.flatMap((a, i) => worldTags(a, f.animeTitles[i] ?? a)), ...characterTags, ...BRAND_TAGS]).map((t) => `#${t}`);
  const save = 'Save it for your next rewatch.';

  let youtubeTitle: string;
  let summary: string;
  switch (f.contentType) {
    case 'guess-character':
      youtubeTitle = `Guess the ${anime} Character From the Places They Visited ${emoji}`;
      summary = `${f.places ?? 'A few'} places, one ${anime} character. Guess before the reveal!`;
      break;
    case 'character-versus':
      youtubeTitle = `${f.characterNames[0]} vs ${f.characterNames[1]}: Who Travelled More? ${emoji}`;
      summary = `${f.characterNames[0]} (${f.animeTitles[0]}) vs ${f.characterNames[1]} (${f.animeTitles[1] ?? f.animeTitles[0]}): every place on the map, one winner.`;
      break;
    default:
      youtubeTitle = `Every Place ${name} Visited ${emoji} | ${anime} Journey${partLabel ? ` ${partLabel.replace('/', ' of ')}` : ''}`;
      summary = `${name}'s journey across ${anime}${partLabel ? ` — ${partLabel}` : ''}${f.places ? `: ${f.places} places on the world map` : ''}.`;
  }
  youtubeTitle = clip(youtubeTitle, YT_TITLE_MAX);
  const site = `Interactive map: ${f.pageUrl}`;

  return {
    instagramCaption: [hook, summary, networkCta(ctaType, 'instagram', f), save, hashtags.slice(0, 8).join(' ')].join('\n\n'),
    tiktokCaption: [hook, networkCta(ctaType, 'tiktok', f), hashtags.slice(0, 5).join(' ')].join(' '),
    youtubeTitle,
    youtubeDescription: [hook, summary, networkCta(ctaType, 'youtube', f), site, hashtags.slice(0, 3).join(' ')].join('\n\n'),
    facebookCaption: [hook, summary, networkCta(ctaType, 'facebook', f), site].join('\n\n'),
    hashtags,
    youtube: { madeForKids: false },
    madeForKids: false,
  };
}
