import type { GuessCharacterConfig, VideoLocale, WorldPoint } from '../../config/types';
import type { MapViewData } from '../../data/characters';

export type GuessCopy = {
  formatLabel: string;
  kicker: string;
  clue: string;
  cluesCount: string;
  think: string;
  countdown: string;
  answerKicker: string;
  places: string;
  coverTitle: string;
  hook: string;
  cta: string;
  brandTagline: string;
};

export type GuessPlaceView = { point: WorldPoint; name: string; region?: string };

/** Fully-resolved, serializable input of the GuessCharacter composition. */
export type GuessCharacterData = {
  locale: VideoLocale;
  copy: GuessCopy;
  world: { slug: string; title: string; accent: string };
  answer: { slug: string; name: string; tagline?: string };
  map: MapViewData;
  /** Clues, in journey order (no place name contains the answer). */
  places: GuessPlaceView[];
  /** Distinct places of the whole journey (reveal line). */
  journeyPlaces: number;
  hook: string;
  cta: string;
  siteLabel: string;
  pageLabel: string;
  durationSeconds: number;
  audio?: { src: string; volume: number };
};

export type GuessCharacterProps = { config: GuessCharacterConfig; data?: GuessCharacterData };
