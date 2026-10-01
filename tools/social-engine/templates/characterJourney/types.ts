import type { VideoCopy } from '../../config/copy';
import type { CharacterJourneyConfig, VideoLocale, WorldPoint } from '../../config/types';

/**
 * Fully-resolved, serializable input of the CharacterJourney composition.
 * Everything is already localized: the React components only draw.
 */
export type JourneyStopView = {
  locationId: string;
  anchorLocationId: string;
  point: WorldPoint;
  /** What happens here (route step / event title), localized. */
  title: string;
  /** Name of the place referenced by the data (may be a sub-map place). */
  placeName: string;
  /** Compact form of `placeName` for map labels ("Konohagakure"). */
  shortName: string;
  /** World-map place containing it, when different (compact, e.g. "Konohagakure"). */
  regionName?: string;
  arcName?: string;
  source: 'route' | 'event';
  score: number;
};

export type MapView = {
  name: string;
  width: number;
  height: number;
  /** Background image path relative to the public dir (served with `staticFile`). */
  backgroundSrc?: string;
  /** Boundary outlines (`svgPathD`, world plane) — vector fallback when there's no map image. */
  boundaries: string[];
};

export type CharacterJourneyData = {
  locale: VideoLocale;
  copy: VideoCopy;
  world: { slug: string; urlSlug: string; title: string };
  character: { id: string; slug: string; name: string; initials: string; tagline?: string };
  map: MapView;
  stops: JourneyStopView[];
  /** Indices into `stops` featured in the recap (3–5). */
  highlights: number[];
  /** Whole journey (before sampling): distinct consecutive places and story arcs. */
  /** Whole journey (before sampling): consecutive places visited and story arcs crossed. */
  stats: { stops: number; arcs: number };
  hook: string;
  cta: string;
  /** "animapverse.com" */
  siteLabel: string;
  /** Public page of the character, without protocol (e.g. animapverse.com/en/naruto/characters/itachi-uchiha). */
  pageLabel: string;
  durationSeconds: number;
  /** Set by the CLI only after staging a local, royalty-free file. */
  audio?: { src: string; volume: number };
};

/**
 * Composition props: the user config, plus the resolved data.
 * The CLI resolves in Node and passes `data`; Remotion Studio passes only
 * `config` and `calculateMetadata` resolves it in the browser (same code).
 */
export type CharacterJourneyProps = {
  config: CharacterJourneyConfig;
  data?: CharacterJourneyData;
};
