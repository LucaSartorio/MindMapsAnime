import type { VideoFormat, VideoLocale } from './types';

/** Vertical 1080×1920 @ 30 fps — YouTube Shorts / TikTok / Instagram Reels. */
export const VERTICAL_FORMAT: VideoFormat = { width: 1080, height: 1920, fps: 30 };

export const DEFAULT_LOCALE: VideoLocale = 'en';
export const DEFAULT_DURATION_SECONDS = 22;
export const MIN_DURATION_SECONDS = 12;
export const MAX_DURATION_SECONDS = 60;

export const DEFAULT_MAX_STOPS = 6;
export const MIN_STOPS = 2;
export const MAX_STOPS = 8;
/** Recap shows 3–5 key locations (fewer only if the journey has fewer stops). */
export const MAX_HIGHLIGHTS = 5;
export const DEFAULT_HIGHLIGHTS = 4;

/** Seconds the journey scene needs per stop to stay readable on a phone. */
export const MIN_SECONDS_PER_STOP = 1.6;

/** Hook length above which the text no longer fits two lines on mobile. */
export const MAX_HOOK_CHARS = 90;
export const MAX_CTA_CHARS = 80;

/** GuessCharacter: places shown before the reveal. */
export const GUESS_MIN_PLACES = 4;
export const GUESS_MAX_PLACES = 6;
/** CharacterVersus: places a character needs to enter a match-up (a real journey). */
export const VERSUS_MIN_PLACES = 4;
/** CharacterVersus catalog: best journeys per world entering cross-world match-ups. */
export const VERSUS_TOP_PER_WORLD = 3;
