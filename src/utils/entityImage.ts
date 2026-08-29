import type { ChakraNature } from '@/types';

export type EntityImageKind =
  | 'character'
  | 'jutsu'
  | 'clan'
  | 'location'
  | 'arc';

const KIND_FOLDER: Record<EntityImageKind, string> = {
  character: 'characters',
  jutsu: 'jutsu',
  clan: 'clans',
  location: 'locations',
  arc: 'arcs',
};

/**
 * Drop-in images, per QUALSIASI mondo. Per mostrare un'immagine reale
 * (licenziata) di un'entità, aggiungi un file `<entityId>.<ext>` sotto
 * `src/assets/worlds/<slug>/<folder>/`, es.
 * `src/assets/worlds/naruto/characters/char-naruto.jpg` o
 * `src/assets/worlds/hunterxhunter/clans/faction-hxh-zoldyck.png`.
 * Viene scoperto a build time e sostituisce il placeholder SVG generato.
 * Gli id sono prefissati per mondo, quindi non collidono tra anime.
 */
const DROP_IN = import.meta.glob(
  '../assets/worlds/*/{characters,jutsu,clans,locations,arcs}/*.{jpg,jpeg,png,webp,avif,svg}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

export function resolveDropInImage(
  kind: EntityImageKind,
  id: string,
): string | null {
  const folder = `/${KIND_FOLDER[kind]}/`;
  for (const [path, url] of Object.entries(DROP_IN)) {
    if (!path.includes(folder)) continue;
    const file = path.slice(path.lastIndexOf('/') + 1);
    const base = file.slice(0, file.lastIndexOf('.'));
    if (base === id) return url;
  }
  return null;
}

/**
 * Logo del mondo/manga. Aggiungi un file `src/assets/worlds/logos/<slug>.<ext>`
 * (es. `naruto.png`) e verrà mostrato sulla card della homepage al posto del
 * placeholder generato.
 */
const WORLD_LOGOS = import.meta.glob(
  '../assets/worlds/logos/*.{jpg,jpeg,png,webp,avif,svg}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

export function resolveWorldLogo(slug: string): string | null {
  for (const [path, url] of Object.entries(WORLD_LOGOS)) {
    const file = path.slice(path.lastIndexOf('/') + 1);
    const base = file.slice(0, file.lastIndexOf('.'));
    if (base === slug) return url;
  }
  return null;
}

/* ------------------------------ Palette ------------------------------ */

export const CHAKRA_COLORS: Record<ChakraNature, string> = {
  fire: '#e8633a',
  water: '#3a9ae8',
  earth: '#b08d57',
  lightning: '#e8c84a',
  wind: '#7fce95',
  yin: '#6b5b95',
  yang: '#e8a13a',
  yin_yang: '#b07ac0',
  wood: '#5a9050',
  ice: '#a8d8e8',
  lava: '#d2602a',
  boil: '#d88a8a',
  magnet: '#9a8ab0',
  explosion: '#e85a5a',
  storm: '#5ab0c8',
  dust: '#c8b89a',
  scorch: '#e87a4a',
  crystal: '#b0e0e8',
  dark: '#54546a',
  swift: '#8ad0a0',
  steel: '#9aa0aa',
  shadow: '#4a4a5a',
  sand: '#d4be78',
};

/** Colore tematico per villaggio (id della location del villaggio). */
export const VILLAGE_COLORS: Record<string, string> = {
  'loc-konoha': '#5a9050',
  'loc-suna': '#d4be78',
  'loc-kiri': '#4cb6ff',
  'loc-iwa': '#a4673a',
  'loc-kumo': '#8a7f9c',
  'loc-ame': '#6aa8d8',
  'loc-oto': '#9a5aae',
  'loc-kusa': '#7fb05a',
  'loc-taki': '#62b8c4',
  'loc-yu': '#d48a8a',
  'loc-hoshi': '#c8c47a',
  'loc-yuki': '#bcdcf0',
  'loc-sora': '#9ab0c0',
};

/** Colori iconici per clan/fazioni note (id). */
export const CLAN_COLORS: Record<string, string> = {
  'clan-uchiha': '#b23a3a',
  'clan-senju': '#5a9050',
  'clan-uzumaki': '#d2602a',
  'clan-hyuga': '#cfc8b6',
  'clan-nara': '#6a7a4a',
  'clan-aburame': '#5a6a5a',
  'clan-akimichi': '#d29a4a',
  'clan-yamanaka': '#c8a85a',
  'clan-inuzuka': '#a46a4a',
  'clan-hatake': '#9aa0aa',
  'clan-sarutobi': '#c86a3a',
  'clan-hoshigaki': '#3a8ab0',
  'clan-kaguya': '#cfc8c0',
  'clan-yuki': '#bcdcf0',
  'clan-terumi': '#d2602a',
  'faction-akatsuki': '#c0392b',
  'faction-anbu': '#6a6a7a',
  'faction-allied-shinobi': '#3a8ae8',
};

/** Hash deterministico (uint32) da una stringa id. */
export function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Hue deterministico (0-359) da una stringa id. */
export function hashHue(s: string): number {
  return hashCode(s) % 360;
}

/* --------------------------- Conversioni colore --------------------------- */

interface Hsl {
  h: number;
  s: number;
  l: number;
}

/** hex (#rgb o #rrggbb) → HSL (h 0-360, s/l 0-100). */
export function hexToHsl(hex: string): Hsl {
  const m = hex.replace('#', '');
  const full =
    m.length === 3
      ? m
          .split('')
          .map((c) => c + c)
          .join('')
      : m;
  const num = parseInt(full, 16);
  const r = ((num >> 16) & 0xff) / 255;
  const g = ((num >> 8) & 0xff) / 255;
  const b = (num & 0xff) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** HSL → hex. */
export function hslToHex({ h, s, l }: Hsl): string {
  const sat = Math.min(100, Math.max(0, s)) / 100;
  const lig = Math.min(100, Math.max(0, l)) / 100;
  const c = (1 - Math.abs(2 * lig - 1)) * sat;
  const hh = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  const [r1, g1, b1] =
    hh < 1
      ? [c, x, 0]
      : hh < 2
        ? [x, c, 0]
        : hh < 3
          ? [0, c, x]
          : hh < 4
            ? [0, x, c]
            : hh < 5
              ? [x, 0, c]
              : [c, 0, x];
  const m = lig - c / 2;
  const to = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(r1)}${to(g1)}${to(b1)}`;
}

/**
 * Variazione deterministica di un colore a partire da un id: mantiene la
 * "famiglia" cromatica (quella del mondo) ma dà a ogni entità una sfumatura
 * propria, così le schede non sembrano tutte identiche.
 */
export function jitterColor(hex: string, id: string): string {
  const { h, s, l } = hexToHsl(hex);
  const n = hashCode(id);
  return hslToHex({
    // Scarto di tonalità volutamente stretto: l'entità si distingue dalle altre
    // ma resta nella famiglia cromatica dell'opera (un blu Dragon Ball non deve
    // virare al verde).
    h: h + (((n >> 3) % 17) - 8), // ±8°
    s: Math.min(74, Math.max(30, s + (((n >> 8) % 17) - 8))),
    l: Math.min(58, Math.max(34, l + (((n >> 13) % 19) - 9))),
  });
}

/** Iniziali (max 2 lettere) dal nome visualizzato. */
export function getInitials(name: string): string {
  const parts = name
    .replace(/[^\p{L}\p{N} ]/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Schiarisce/scurisce un colore hex di un fattore (-1..1). */
export function shade(hex: string, amount: number): string {
  const m = hex.replace('#', '');
  const full =
    m.length === 3
      ? m
          .split('')
          .map((c) => c + c)
          .join('')
      : m;
  const num = parseInt(full, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  const t = amount < 0 ? 0 : 255;
  const p = Math.abs(amount);
  r = Math.round((t - r) * p) + r;
  g = Math.round((t - g) * p) + g;
  b = Math.round((t - b) * p) + b;
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
