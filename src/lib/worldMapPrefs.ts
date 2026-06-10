/**
 * Preferenze di resa della mappa specifiche per mondo.
 *
 * Alcuni mondi usano una world map "fan-made/illustrata" che disegna già i
 * propri confini e va lasciata pulita: per questi disattiviamo l'overlay
 * vettoriale dei confini (niente highlight su hover/selezione), mantenendo i
 * pin cliccabili. Per Naruto invece l'overlay resta attivo.
 */
const WORLDS_WITHOUT_BOUNDARY_HIGHLIGHT = new Set<string>(['hunterxhunter']);

/** True se per questo mondo l'overlay dei confini va mostrato/evidenziato. */
export function worldShowsBoundaryHighlight(world: { slug: string }): boolean {
  return !WORLDS_WITHOUT_BOUNDARY_HIGHLIGHT.has(world.slug);
}
