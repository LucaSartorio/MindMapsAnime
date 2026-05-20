/**
 * Costanti della world map Naruto.
 *
 * Tutte le coordinate dei luoghi, dei boundary path e dei label position
 * sono espresse nel sistema dell'SVG `Naruto_World_Map.svg`
 * (viewBox 1500 x 882.2204).
 *
 * Se sostituisci il file SVG con una versione autorizzata, mantieni lo
 * stesso viewBox per evitare di rompere i pin esistenti.
 */
export const NARUTO_MAP_VIEWBOX = {
  width: 1500,
  height: 882.2204,
} as const;

/** Path locale del file SVG (vive in public/, servito alla root). */
export const NARUTO_WORLD_MAP_SRC = '/assets/worlds/naruto/maps/Naruto_World_Map.svg';
