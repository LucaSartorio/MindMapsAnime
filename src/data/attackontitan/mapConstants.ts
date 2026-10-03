/**
 * Costanti delle mappe di Attack on Titan.
 *
 * Tutte le mappe sono RICOSTRUZIONI ORIGINALI di AniMapVerse generate da
 * `scripts/mapgen/aot.py` (deterministico, CC0), fedeli alla geografia della serie:
 *  - il Mondo è la Terra capovolta (Isayama: «un'immagine speculare del nostro mondo»),
 *    disegnata dai contorni Natural Earth (dominio pubblico) ribaltati in verticale;
 *  - Paradis è il Madagascar ribaltato e allargato;
 *  - le Mura sono in scala (Sina 250 km, Rose 380 km, Maria 480 km dal centro).
 * Le coordinate dei pin sono scritte dallo script stesso (`apply_pins`): modifica il
 * generatore e rieseguilo, non le coordinate.
 */

/** Il mondo (Terra capovolta, proiezione equirettangolare). */
export const AOT_WORLD_VIEWBOX = { width: 2000, height: 950 } as const;
/** L'isola di Paradis con le tre Mura. */
export const AOT_PARADIS_VIEWBOX = { width: 1600, height: 1100 } as const;
/** Dentro le Mura: i tre cerchi in scala con i dodici distretti. */
export const AOT_WALLS_VIEWBOX = { width: 1600, height: 1240 } as const;
/** Pianta del distretto di Shiganshina. */
export const AOT_SHIGANSHINA_VIEWBOX = { width: 1400, height: 1000 } as const;
/** Pianta del distretto di Trost. */
export const AOT_TROST_VIEWBOX = { width: 1400, height: 1000 } as const;
/** Liberio, la città marleyana con la zona d'internamento eldiana. */
export const AOT_LIBERIO_VIEWBOX = { width: 1400, height: 1000 } as const;
/** I Sentieri: la dimensione che connette tutti gli Eldiani. */
export const AOT_PATHS_VIEWBOX = { width: 1400, height: 1000 } as const;

const MAPS = '/assets/worlds/attackontitan/maps';

export const AOT_MAP_SRC = {
  world: `${MAPS}/aot-world.svg`,
  paradis: `${MAPS}/aot-paradis.svg`,
  walls: `${MAPS}/aot-walls.svg`,
  shiganshina: `${MAPS}/aot-shiganshina.svg`,
  trost: `${MAPS}/aot-trost.svg`,
  liberio: `${MAPS}/aot-liberio.svg`,
  paths: `${MAPS}/aot-paths.svg`,
} as const;

/** Colori dei territori e dei percorsi (palette delle mappe e dei simboli della serie). */
export const AOT_COLORS = {
  wallMaria: '#b0823f',
  wallRose: '#9e2b25',
  wallSina: '#6f5a8a',
  paradis: '#6f7d4e',
  marley: '#c9a77a',
  midEast: '#7a8a5a',
  hizuru: '#c75b4a',
  paths: '#8fc6ee',
  survey: '#3a5a8a',
  eren: '#2e7d4f',
  warriors: '#8a8f99',
} as const;
