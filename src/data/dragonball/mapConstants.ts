/**
 * Costanti della world map Dragon Ball.
 *
 * La world map della Terra usa come sfondo la mappa fan-made fornita per
 * questo mondo (poster "Dragon Ball World Map"). Il file binario NON è
 * committato nel repo (vedi `dragonballAssets` in `./assets.ts`): finché non
 * viene copiato in `public/assets/worlds/dragonball/maps/`, `WorldMapBackground`
 * mostra uno stato neutro con il percorso atteso.
 *
 * Le coordinate di `location.x/y` sulla mappa della Terra sono espresse nel
 * piano viewBox 1800 x 1200 (aspect ratio ~1.5, quello del poster di
 * riferimento) e sono POSIZIONI CONCETTUALI stimate dal layout del poster,
 * non estratte pixel-per-pixel: vanno rifinite quando il file reale viene
 * aggiunto (stesso approccio già usato per le sotto-mappe One Piece prive di
 * script di estrazione dedicato). Se sostituisci l'immagine, mantieni lo
 * stesso viewBox — o riconverti tutte le coordinate — per non disallineare i pin.
 */
export const DRAGONBALL_MAP_VIEWBOX = { width: 1800, height: 1200 } as const;

/** Piano concettuale della sotto-mappa "cosmica" (pianeti, Aldilà, Torneo del Potere). */
export const DRAGONBALL_COSMIC_VIEWBOX = { width: 1400, height: 900 } as const;

/** Path locale dell'immagine di riferimento (vive in public/, servita alla root). */
export const DRAGONBALL_WORLD_MAP_SRC =
  '/assets/worlds/dragonball/maps/dragonball-world-map.png';
