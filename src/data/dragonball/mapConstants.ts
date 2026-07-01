/**
 * Costanti della world map Dragon Ball.
 *
 * La world map della Terra usa come sfondo il poster fan-made
 * "Dragon Ball World Map" (Kris Ardrey per LocoDog.Store), ora presente in
 * `public/assets/worlds/dragonball/maps/dragonball-world-map.png`
 * (1785 × 1261 px). Il piano viewBox coincide 1:1 con i pixel del PNG, quindi
 * `location.x/y` sono le coordinate pixel lette direttamente dall'immagine
 * (nessuna conversione necessaria) — estratte con crop/zoom mirati per ogni
 * luogo etichettato sul poster, non stimate.
 *
 * Se sostituisci il file con una versione di dimensioni diverse, aggiorna
 * `DRAGONBALL_MAP_VIEWBOX` e riconverti tutte le coordinate con
 * `flowX = px_x / oldW * newW`, `flowY = px_y / oldH * newH`.
 */
export const DRAGONBALL_MAP_VIEWBOX = { width: 1785, height: 1261 } as const;

/** Piano concettuale della sotto-mappa "cosmica" (pianeti, Aldilà, Torneo del Potere). */
export const DRAGONBALL_COSMIC_VIEWBOX = { width: 1400, height: 900 } as const;

/** Piano concettuale della sotto-mappa del Pianeta Namecc. */
export const DRAGONBALL_NAMEK_VIEWBOX = { width: 1300, height: 850 } as const;

/**
 * Piano concettuale della sotto-mappa "Spazio (GT)": lo spazio profondo
 * percorso in Dragon Ball GT durante la caccia alle Sfere del Drago Nere
 * (Imecca, M-2, Gelbo/Luud, Beehay, Pital) e il Nuovo Pianeta Plant della
 * Saga di Baby. Diagramma stellare, non una mappa in scala.
 */
export const DRAGONBALL_GT_SPACE_VIEWBOX = { width: 1600, height: 1000 } as const;

/** Path locale dell'immagine di riferimento (vive in public/, servita alla root). */
export const DRAGONBALL_WORLD_MAP_SRC =
  '/assets/worlds/dragonball/maps/dragonball-world-map.png';

/**
 * Colori delle SAGHE come mostrati nella legenda "SAGAS" in basso a sinistra
 * sul poster (campionati per pixel dall'immagine originale). Usati per
 * colorare i `Route` che ripercorrono ciascuna saga sulla mappa, così i
 * percorsi sul sito riflettono esattamente la codifica a colori del poster.
 */
export const DRAGONBALL_SAGA_COLORS = {
  gokuBoyhood: '#F26221',
  redRibbonArmy: '#EE2666',
  piccolo: '#317539',
  saiyan: '#C1E8FA',
  frieza: '#F6E802',
  androids: '#77C043',
  majinBuu: '#F6AECE',
} as const;
