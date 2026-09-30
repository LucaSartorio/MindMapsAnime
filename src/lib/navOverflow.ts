/**
 * Adattamento delle tab di navigazione del mondo (header desktop) SENZA
 * misurare il DOM: niente ResizeObserver, niente layout shift, stesso markup
 * su server e client.
 *
 * Le larghezze delle etichette sono STIMATE in modo deterministico dalla
 * tabella dei caratteri di Inter 14px (il font delle tab) e trasformate in
 * regole CSS `@container`, così è il browser — non JavaScript — a decidere in
 * base allo spazio reale del contenitore `worldtabs`:
 *
 *   1. spazio pieno      → tab con padding largo (`--tab-px: 0.75rem`);
 *   2. spazio ridotto    → padding stretto (`0.5rem`), tutte le tab visibili;
 *   3. spazio esaurito   → le ultime tab confluiscono nel menu "Altro"
 *                          (Panoramica e Mappa restano sempre visibili).
 *
 * Il margine di sicurezza (`SAFETY`) copre le piccole differenze di rendering;
 * in più la lista ha `overflow: hidden`, quindi nel caso peggiore una tab
 * viene tagliata dentro la propria zona e non si sovrappone mai alla ricerca.
 */

/** Larghezze ASCII 32–126 di Inter a 100px (misurate con canvas). */
const ASCII_WIDTHS =
  '28,29,47,63,64,98,64,30,36,36,50,66,29,46,29,36,63,41,61,62,65,59,62,57,62,62,29,30,66,66,66,51,97,69,65,73,72,60,59,75,74,27,57,67,57,90,75,76,64,76,64,64,65,74,69,99,68,68,63,36,36,36,47,46,32,56,61,57,61,58,37,61,59,24,24,55,24,88,59,60,61,61,38,53,33,59,56,82,55,56,55,43,33,43,66'
    .split(',')
    .map(Number);

const FONT_PX = 14;
const SAFETY = 1.06;
/** Padding orizzontale della tab (per lato) in px: largo / stretto. */
export const TAB_PX_WIDE = 12;
export const TAB_PX_TIGHT = 8;
/** Bordo (1px per lato, sempre presente: trasparente se la tab non è attiva). */
const TAB_BORDER = 2;
/** Spazio fra le tab (`gap-0.5`). */
export const TAB_GAP = 2;
/** Tab sempre visibili (Panoramica, Mappa). */
const ALWAYS_VISIBLE = 2;

/** Larghezza stimata (px) di un testo in Inter 14px. */
export function estimateTextWidth(text: string): number {
  let units = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 32 && code < 127) {
      units += ASCII_WIDTHS[code - 32];
      continue;
    }
    // Lettere accentate: larghezza della lettera base (é → e, Ü → U).
    const base = ch.normalize('NFD')[0];
    const b = base.codePointAt(0) ?? 0;
    if (base !== ch && b >= 32 && b < 127) units += ASCII_WIDTHS[b - 32];
    // CJK, kana, simboli larghi: circa 1em.
    else if (code >= 0x2e80) units += 103;
    else units += 65;
  }
  return (units / 100) * FONT_PX * SAFETY;
}

const tabWidth = (label: string, px: number) => Math.ceil(estimateTextWidth(label) + 2 * px + TAB_BORDER);

/**
 * Regole CSS per le tab del mondo. `labels` in ordine di visualizzazione;
 * `activeIndex` evidenzia "Altro" quando la tab attiva finisce nel menu.
 * Classi: `.wt-i-N` tab N nella barra, `.wt-m-N` voce N nel menu, `.wt-more`
 * pulsante "Altro", `.wt-more-current` indicatore di tab attiva nel menu.
 */
export function worldTabsCss(labels: string[], moreLabel: string, activeIndex: number): string {
  const n = labels.length;
  if (n === 0) return '';
  const sum = (px: number, upTo: number) =>
    labels.slice(0, upTo + 1).reduce((acc, l) => acc + tabWidth(l, px), 0) + upTo * TAB_GAP;
  const wide = sum(TAB_PX_WIDE, n - 1);
  const tight = sum(TAB_PX_TIGHT, n - 1);
  // Pulsante "Altro": testo + chevron (12px + gap 4px) + padding + bordo.
  const more = Math.ceil(estimateTextWidth(moreLabel) + 16 + 2 * TAB_PX_TIGHT + TAB_BORDER) + TAB_GAP;

  const q = (max: number, body: string) => `@container worldtabs (max-width:${(max - 0.02).toFixed(2)}px){${body}}`;
  const rules: string[] = [q(wide, '.world-tabs__list,.wt-more{--tab-px:0.5rem}'), q(tight, '.wt-more{display:inline-flex}')];
  const hiddenBelow: number[] = [];
  for (let i = ALWAYS_VISIBLE; i < n; i++) {
    // La tab i resta visibile se entra insieme a quelle prima e ad "Altro"
    // (che serve solo quando almeno una tab non entra: da qui il min()).
    const threshold = Math.min(tight, sum(TAB_PX_TIGHT, i) + more);
    hiddenBelow[i] = threshold;
    rules.push(q(threshold, `.wt-i-${i}{display:none}.wt-m-${i}{display:block}`));
  }
  if (activeIndex >= ALWAYS_VISIBLE && hiddenBelow[activeIndex]) {
    rules.push(q(hiddenBelow[activeIndex], '.wt-more-current{display:block}'));
  }
  return rules.join('');
}
