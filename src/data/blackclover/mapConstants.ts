/**
 * Costanti della world map di Black Clover.
 *
 * La world map usa come sfondo la mappa fan-made "World of Black Clover"
 * (pergamena con la rosa dei venti a cinque petali), attesa in
 * `public/assets/worlds/blackclover/maps/blackclover-world-map.jpg`.
 * Il piano viewBox è **1500 × 1057**: le coordinate `location.x/y` sono lette
 * su quel piano, quindi con un'immagine di dimensioni diverse ma stesso
 * rapporto d'aspetto (~1,42:1) i pin restano allineati senza toccare i dati.
 *
 * Se sostituisci il file con una versione di proporzioni diverse, aggiorna
 * `BLACKCLOVER_MAP_VIEWBOX` e riconverti tutte le coordinate con
 * `flowX = px_x / imgW * 1500`, `flowY = px_y / imgH * 1057`.
 */
export const BLACKCLOVER_MAP_VIEWBOX = { width: 1500, height: 1057 } as const;

/**
 * Piano concettuale della sotto-mappa dell'Inframondo (il regno dei diavoli
 * diviso in sette livelli, dal primo al settimo dove risiede Lucifero).
 * Schema verticale a livelli, non una mappa geografica.
 */
export const BLACKCLOVER_UNDERWORLD_VIEWBOX = { width: 1200, height: 1400 } as const;

/** Path locale dell'immagine di riferimento (vive in public/, servita alla root). */
export const BLACKCLOVER_WORLD_MAP_SRC =
  '/assets/worlds/blackclover/maps/blackclover-world-map.jpg';

/**
 * Colori dei quattro regni, usati per i `Route` narrativi e per il colore
 * delle `Nation`. Richiamano i semi delle carte da gioco che danno il nome ai
 * regni (fiori / quadri / picche / cuori) letti sui simboli della mappa.
 */
export const BLACKCLOVER_KINGDOM_COLORS = {
  clover: '#2fa05f',
  diamond: '#5bc8e8',
  spade: '#7a4fd6',
  heart: '#e0556a',
  neutral: '#c9a227',
  underworld: '#b3312f',
} as const;
