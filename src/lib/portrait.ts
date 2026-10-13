import type { CharacterAppearance } from '@/types';

/**
 * Palette dei ritratti: i dati scrivono nomi (`blond`, `tan`…), il disegno
 * riceve hex. Un valore che inizia con `#` passa invariato, così un colore
 * particolare non richiede una voce nuova.
 */
export const PORTRAIT_COLORS: Record<string, string> = {
  // Capelli / pelo
  black: '#22232b',
  darkbrown: '#4a3324',
  brown: '#7b5233',
  auburn: '#93432c',
  blond: '#f0cd5a',
  gold: '#e3a92b',
  platinum: '#efe6c8',
  orange: '#f0882c',
  red: '#cc3030',
  crimson: '#9b1b2c',
  pink: '#f29cc2',
  white: '#f1f1f1',
  silver: '#c9cdd6',
  gray: '#8e929c',
  blue: '#3b70d8',
  lightblue: '#8fc6f0',
  navy: '#283b6b',
  teal: '#2aa59a',
  green: '#3f9a4a',
  lime: '#9ccc4a',
  purple: '#7b4ab0',
  lavender: '#b79be0',
  // Pelle
  pale: '#f2e6dc',
  fair: '#f6dbc4',
  light: '#efc9a6',
  tan: '#d8a477',
  olive: '#c9a070',
  brownskin: '#a4704a',
  dark: '#6f472e',
  // Occhi
  hazel: '#9a7a3a',
  amber: '#d99a2a',
  violet: '#8e5ad0',
  yellow: '#e6c234',
  ripple: '#a99ad6',
};

const DEFAULTS = {
  hair: 'black',
  eyes: 'darkbrown',
  skin: 'light',
  outfit: '#2b2f3d',
  accent: '#c8303a',
} as const;

export function portraitColor(value: string | undefined, fallback: string): string {
  const v = value ?? fallback;
  if (v.startsWith('#')) return v;
  return PORTRAIT_COLORS[v] ?? PORTRAIT_COLORS[fallback] ?? fallback;
}

export interface ResolvedPortrait {
  hair: string;
  eyes: string;
  skin: string;
  outfit: string;
  accent: string;
  /** `accent` scritto nei dati (non il default): gli accessori con un colore proprio lo usano solo allora. */
  hasAccent: boolean;
  hairStyle: string;
  marks: Set<string>;
  beast: boolean;
}

/** Aspetto → colori/forme concreti. Puro (stesso risultato in pre-render e nel browser). */
export function resolvePortrait(a: CharacterAppearance): ResolvedPortrait {
  return {
    hair: portraitColor(a.hair, DEFAULTS.hair),
    eyes: portraitColor(a.eyes, DEFAULTS.eyes),
    skin: portraitColor(a.skin, DEFAULTS.skin),
    outfit: portraitColor(a.outfit, DEFAULTS.outfit),
    accent: portraitColor(a.accent, DEFAULTS.accent),
    hasAccent: Boolean(a.accent),
    hairStyle: a.hairStyle ?? 'short',
    marks: new Set(a.marks ?? []),
    beast: a.species === 'beast',
  };
}
