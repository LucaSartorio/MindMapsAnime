/**
 * Inquadratura iniziale della mappa (PERF-03), condivisa fra la mappa React Flow
 * e l'anteprima statica pre-renderizzata della rotta `/map`.
 *
 * React Flow inquadra il PIANO della mappa (il nodo di sfondo, `0,0 → width×height`
 * del map level) con `MAP_FIT_PADDING`, entro `MAP_MIN_ZOOM`…`MAP_MAX_ZOOM`. Lo fa
 * fin dal primo fotogramma (`defaultViewport`), non più con un fitView a posteriori:
 * prima il canvas compariva a `scale(1)` (un ritaglio della mappa a grandezza piena)
 * e poi rimpiccioliva con un'animazione.
 *
 * L'anteprima statica disegna l'immagine nello STESSO rettangolo, calcolato in CSS
 * (`.map-preview-img` in globals.css, unità container-query) con la stessa formula di
 * `getViewportForBounds` di React Flow: quando la mappa interattiva sostituisce
 * l'anteprima, l'immagine non si sposta e non cambia dimensione (niente salto
 * visivo, nessun nuovo elemento più grande che diventi il candidato LCP).
 *
 * I tre valori sono ripetuti in globals.css (il CSS non può importarli): se ne
 * cambi uno, cambialo anche lì. `npm run smoke` confronta i due rettangoli nel
 * browser e fallisce se divergono. Questo modulo è importato SOLO dal chunk della
 * mappa: importarlo anche da MapPage creerebbe un chunk condiviso, cioè una
 * richiesta in più su ogni pagina dei mondi.
 */
export const MAP_FIT_PADDING = 0.18;
export const MAP_MIN_ZOOM = 0.2;
export const MAP_MAX_ZOOM = 3;
/** Nodo React Flow che contiene l'immagine della mappa (piano 0,0 → width×height). */
export const MAP_BACKGROUND_NODE_ID = '__layer-background';
