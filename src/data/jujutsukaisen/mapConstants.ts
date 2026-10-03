/**
 * Costanti delle mappe di Jujutsu Kaisen.
 *
 * Tutte le mappe sono RICOSTRUZIONI ORIGINALI di AniMapVerse generate da
 * `scripts/mapgen/jjk.py` (deterministico, CC0) sulla geografia reale del Giappone:
 *  - il Giappone (radice) dalle prefetture e coste Natural Earth 1:10m (dominio pubblico);
 *  - Tokyo, Shibuya, Kyoto e Sendai con fiumi, strade e monumenti nella posizione reale;
 *  - l'istituto di arti occulte di Tokyo è una pianta immaginata (l'opera non ne dà una).
 * Le coordinate dei pin sono scritte dallo script stesso (`apply_pins`): modifica il
 * generatore e rieseguilo, non le coordinate.
 */

/** Il Giappone (Mercatore), con Okinawa in riquadro. */
export const JJK_JAPAN_VIEWBOX = { width: 1800, height: 1600 } as const;
/** Tokyo e dintorni. */
export const JJK_TOKYO_VIEWBOX = { width: 2000, height: 1400 } as const;
/** Shibuya, l'Incidente del 31 ottobre 2018. */
export const JJK_SHIBUYA_VIEWBOX = { width: 1500, height: 1700 } as const;
/** L'istituto di arti occulte di Tokyo (pianta immaginata). */
export const JJK_CAMPUS_VIEWBOX = { width: 1600, height: 1100 } as const;
/** Kyoto. */
export const JJK_KYOTO_VIEWBOX = { width: 1500, height: 1500 } as const;
/** Sendai. */
export const JJK_SENDAI_VIEWBOX = { width: 1600, height: 1100 } as const;

const MAPS = '/assets/worlds/jujutsukaisen/maps';

export const JJK_MAP_SRC = {
  japan: `${MAPS}/jjk-japan.svg`,
  tokyo: `${MAPS}/jjk-tokyo.svg`,
  shibuya: `${MAPS}/jjk-shibuya.svg`,
  campus: `${MAPS}/jjk-jujutsu-high.svg`,
  kyoto: `${MAPS}/jjk-kyoto.svg`,
  sendai: `${MAPS}/jjk-sendai.svg`,
} as const;

/** Colori dei territori e dei percorsi. */
export const JJK_COLORS = {
  tokyo: '#5a4b9c',
  kyoto: '#3f7fb5',
  curse: '#3b2a5c',
  blood: '#c0392b',
  yuji: '#d9534f',
  gojo: '#5bc0eb',
  megumi: '#2c3e50',
  sukuna: '#8e1b1b',
  culling: '#7b62b8',
} as const;
