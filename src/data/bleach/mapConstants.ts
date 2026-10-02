/**
 * Costanti delle mappe di Bleach.
 *
 * Bleach non ha mai avuto una mappa geografica ufficiale dei suoi mondi: tutte
 * le mappe di questo dataset sono una RICOSTRUZIONE ORIGINALE di AniMapVerse,
 * disegnata in SVG da `scripts/bleach-maps.py` (deterministico, CC0) a partire
 * da ciò che l'opera mostra e racconta. Sono schemi coerenti con la storia,
 * NON mappe in scala.
 *
 * Ogni livello ha il suo piano viewBox, identico alle dimensioni dell'SVG
 * generato: le coordinate `location.x/y` sono lette su quel piano. Se sposti un
 * elemento nello script, aggiorna il pin corrispondente (e viceversa).
 */

/** «I Tre Mondi»: la cosmologia (Soul Society, Dangai, Mondo dei Vivi, Garganta, Hueco Mundo, Jigoku, Reiōkyū). */
export const BLEACH_WORLD_VIEWBOX = { width: 2000, height: 1250 } as const;

/** Pianta concettuale di Karakura (con l'area della Karakura replica). */
export const BLEACH_KARAKURA_VIEWBOX = { width: 1600, height: 1000 } as const;

/** Il Seireitei dentro le mura di sekkiseki. */
export const BLEACH_SEIREITEI_VIEWBOX = { width: 1600, height: 1000 } as const;

/** Il deserto di Hueco Mundo e la fortezza di Las Noches. */
export const BLEACH_HUECO_MUNDO_VIEWBOX = { width: 1600, height: 1000 } as const;

/** Il Reiōkyū: il Palazzo del Re delle Anime e i palazzi della Divisione Zero. */
export const BLEACH_REIOKYU_VIEWBOX = { width: 1400, height: 1000 } as const;

const MAPS = '/assets/worlds/bleach/maps';

export const BLEACH_MAP_SRC = {
  world: `${MAPS}/bleach-three-worlds.svg`,
  karakura: `${MAPS}/bleach-karakura.svg`,
  seireitei: `${MAPS}/bleach-seireitei.svg`,
  huecoMundo: `${MAPS}/bleach-hueco-mundo.svg`,
  reiokyu: `${MAPS}/bleach-reiokyu.svg`,
} as const;

/**
 * Colori dei mondi, usati per le `Nation` e i `Route`. Richiamano le palette
 * delle mappe: l'avorio del Seireitei, il blu notte del Mondo dei Vivi, il
 * bianco osseo di Hueco Mundo, il viola del Dangai, l'oro del Reiōkyū, il
 * cremisi del Jigoku e il blu del Wandenreich.
 */
export const BLEACH_WORLD_COLORS = {
  soulSociety: '#d9c79a',
  living: '#4fb3d9',
  huecoMundo: '#c9d1d9',
  dangai: '#8a5cc7',
  reiokyu: '#e8c96a',
  hell: '#c0392b',
  wandenreich: '#3d7be0',
  ichigo: '#e8552d',
} as const;
