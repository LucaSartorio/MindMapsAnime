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

/** Present when the journey is a series (long journeys split by arcs into parts). */
export type JourneySeriesView = {
  /** `part-01`… */
  key: string;
  partNumber: number;
  partCount: number;
  isLast: boolean;
  /** Arcs covered by this part, in order (ids + localized names). */
  arcIds: string[];
  arcNames: string[];
  /** "First arc → Last arc" (or the single arc's name). */
  arcRange: string;
  segmentationVersion: number;
  /** Hash of the part's stops/arcs: changes if the data behind the part changes. */
  fingerprint: string;
  /** Localized "Part 2 of 5". */
  label: string;
  /** Localized "Next: Part 3 of 5" (absent on the last part). */
  nextLabel?: string;
};

export type CharacterJourneyData = {
  locale: VideoLocale;
  copy: VideoCopy;
  world: { slug: string; urlSlug: string; title: string; accent?: string };
  character: { id: string; slug: string; name: string; initials: string; tagline?: string };
  map: MapView;
  stops: JourneyStopView[];
  /** Indices into `stops` featured in the recap (3–5). */
  highlights: number[];
  /** Whole journey (before sampling): distinct consecutive places and story arcs. */
  series: JourneySeriesView | null;
  /**
   * stops/arcs = what THIS video covers (the part, or the whole journey when
   * single, before any expert sampling); journey* = the full journey.
   */
  stats: { stops: number; arcs: number; journeyStops: number; journeyArcs: number };
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
