import type { CharacterVersusConfig, VideoLocale, WorldPoint } from '../../config/types';
import type { MapViewData } from '../../data/characters';

export type VersusCopy = {
  formatLabel: string;
  kicker: string;
  places: string;
  arcs: string;
  wins: string;
  tie: string;
  hook: string;
  cta: string;
  coverTitle: string;
  brandTagline: string;
};

export type VersusSide = {
  anime: string;
  worldTitle: string;
  accent: string;
  slug: string;
  name: string;
  /** Distinct places of the whole journey on the world map / story arcs (the metrics). */
  places: number;
  arcs: number;
  map: MapViewData;
  /** Journey drawn on the map (≤ 8 distinct places, journey order). */
  route: WorldPoint[];
};

export type CharacterVersusData = {
  locale: VideoLocale;
  copy: VersusCopy;
  a: VersusSide;
  b: VersusSide;
  /** Places decide; equal places → arcs; equal arcs → tie. */
  winner: 'a' | 'b' | 'tie';
  decidedBy: 'places' | 'arcs' | 'tie';
  hook: string;
  cta: string;
  siteLabel: string;
  pageLabel: string;
  durationSeconds: number;
  audio?: { src: string; volume: number };
};

export type CharacterVersusProps = { config: CharacterVersusConfig; data?: CharacterVersusData };
