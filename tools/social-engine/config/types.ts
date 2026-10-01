/**
 * Shared, serializable types of the private social-video engine.
 *
 * INTERNAL ONLY: nothing in this folder is imported by `src/` (the public app).
 * The engine reads the public datasets, never the other way around.
 */

/** Languages a social video can be rendered in = the datasets' source languages. */
export type VideoLocale = 'it' | 'en';
export const VIDEO_LOCALES: readonly VideoLocale[] = ['en', 'it'];

/** Template ids (camelCase, as written in JSON configs). */
export type TemplateId = 'characterJourney';

/** Optional local, royalty-free soundtrack. Never bundled automatically. */
export type AudioTrackConfig = {
  /** Path to a local audio file (relative to the repository root, or absolute). */
  src: string;
  /** 0..1, default 0.8. */
  volume?: number;
};

/** Fields every template accepts. */
export type BaseVideoConfig = {
  template: TemplateId;
  /** World: internal slug (`naruto`, `hunterxhunter`) or public URL slug (`hunter-x-hunter`). */
  anime: string;
  /** Default `en`. */
  locale?: VideoLocale;
  /** Opening line (≤ ~70 chars reads well on two lines). Deterministic default per template. */
  hook?: string;
  /** Closing call to action. Deterministic default per locale. */
  cta?: string;
  /** Target length in seconds (12–60). Default 22. */
  durationSeconds?: number;
  /** Optional soundtrack (no audio when omitted). */
  audio?: AudioTrackConfig;
};

export type CharacterJourneyOptions = {
  /** Restrict the journey to these route ids (default: the character's own routes). */
  routeIds?: string[];
  /** Enrich the route with the character's located timeline events (default true). */
  includeEvents?: boolean;
  /** Max stops animated on the map (2–8, default 6). Extra stops are sampled out. */
  maxStops?: number;
};

export type CharacterJourneyConfig = BaseVideoConfig & {
  template: 'characterJourney';
  /** Character: SEO slug (`itachi-uchiha`), id (`char-itachi`) or id without prefix (`itachi`). */
  subject: string;
  journey?: CharacterJourneyOptions;
  /** Locations to feature in the recap (ids or SEO slugs, max 5). Default: auto-selected. */
  highlights?: string[];
};

/** Union of every template config (extend when a template is added). */
export type SocialVideoConfig = CharacterJourneyConfig;

/** Output format (shared by all templates for now: vertical 9:16). */
export type VideoFormat = {
  width: number;
  height: number;
  fps: number;
};

/** A point in the world-map plane (`MapLevel.width/height` viewBox). */
export type WorldPoint = { x: number; y: number };
