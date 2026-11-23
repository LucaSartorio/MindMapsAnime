/**
 * Costanti della world map di Fullmetal Alchemist.
 *
 * Mappa SCHEMATICA originale (CC0) generata da `python3 scripts/mapgen/fullmetalalchemist.py`:
 * Amestris con le sue cinque aree amministrative (Centrale, Nord, Est, Sud, Ovest) e i vicini
 * mostrati in parte ai bordi (Drachma a nord oltre i Monti Briggs, Creta a ovest, Aerugo a sud,
 * Xing a est oltre un grande deserto). Il profilo di Amestris NON è documentato dall'opera: è un
 * contorno astratto, indicativo. Nessuna mappa ufficiale o amatoriale è stata ricalcata.
 *
 * Il piano viewBox è **1500 × 1000**: le coordinate `location.x/y` e i `svgPathD` dei confini
 * usano questo piano; se l'immagine cambia, il viewBox deve restare invariato.
 * I pin si cambiano nel generatore (`PINS`) e si riapplicano con `apply_pins`, mai a mano.
 */
export const FMA_MAP_VIEWBOX = { width: 1500, height: 1000 } as const;

/** Path locale dell'SVG originale della world map (vive in public/, servita alla root). */
export const FMA_WORLD_MAP_SRC = '/assets/worlds/fullmetalalchemist/maps/fullmetalalchemist-world-map.svg';
