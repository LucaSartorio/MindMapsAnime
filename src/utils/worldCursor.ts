/**
 * Cursore tematico per mondo.
 *
 * Restituisce un valore CSS `cursor` completo (con hotspot e fallback)
 * da applicare al contenitore del mondo. Due sorgenti, in ordine:
 *  1. drop-in: un file `src/assets/worlds/cursors/<slug>.(svg|png|cur)`
 *     (se presente vince — l'utente può sostituire l'icona a piacere);
 *  2. un cursore generato via SVG inline per gli slug noti (es. Naruto →
 *     vortice della Foglia).
 *
 * Nota: sul canvas della mappa (React Flow) il cursore di pan
 * (grab/grabbing) ha la precedenza, per non perdere l'affordance di
 * trascinamento; il cursore tematico resta su pannelli, header, archivio
 * e modali.
 */

const WORLD_CURSORS = import.meta.glob(
  '../assets/worlds/cursors/*.{svg,png,cur,ani}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

/** Simbolo della Foglia (Konoha) ricostruito: foglia verticale + spirale
 *  alla base. È una sagoma autentica come *forma*, ma resta una nostra
 *  rilettura — l'SVG canonico (es. Wikimedia Commons, "Simbolo konoha")
 *  va messo come drop-in in `src/assets/worlds/cursors/naruto.svg` e
 *  prende il posto di questa fallback. */
const KONOHA_LEAF = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>
<g>
<path d='M19 3.3 C25.7 5.2 29.6 11.8 28 18.6 C26.6 24.6 21.4 28.7 15.4 28.2 C10.1 27.7 5.7 23.7 5 18.4 C4.4 13.7 7.3 9.6 11.6 9 C14.9 8.5 17.9 10.8 18 14 C18.1 16.4 16.3 18.2 14.1 17.9 C12.6 17.7 11.7 16.4 12 15 C12.2 14 13 13.4 13.9 13.6' fill='#0d2f15' stroke='#0d2f15' stroke-width='3' stroke-linejoin='round' stroke-linecap='round'/>
<path d='M19 3.3 C25.7 5.2 29.6 11.8 28 18.6 C26.6 24.6 21.4 28.7 15.4 28.2 C10.1 27.7 5.7 23.7 5 18.4 C4.4 13.7 7.3 9.6 11.6 9 C14.9 8.5 17.9 10.8 18 14 C18.1 16.4 16.3 18.2 14.1 17.9 C12.6 17.7 11.7 16.4 12 15 C12.2 14 13 13.4 13.9 13.6' fill='#5fbf6f' stroke='#eafff0' stroke-width='0.8' stroke-linejoin='round' stroke-linecap='round'/>
</g>
</svg>`;

interface GeneratedCursor {
  svg: string;
  /** Hotspot (x, y) in px. */
  hotspot: [number, number];
}

const GENERATED: Record<string, GeneratedCursor> = {
  naruto: { svg: KONOHA_LEAF, hotspot: [16, 16] },
};

function dataUriCursor(svg: string, hotspot: [number, number]): string {
  const uri = `data:image/svg+xml,${encodeURIComponent(svg.replace(/\n/g, ''))}`;
  return `url("${uri}") ${hotspot[0]} ${hotspot[1]}, auto`;
}

/**
 * Hotspot dei drop-in per slug (px). I file su disco non possono "dire"
 * dove sta il loro punto attivo, quindi lo dichiariamo qui. Default 16 16
 * (centro per un cursore 32×32).
 */
const DROPIN_HOTSPOTS: Record<string, [number, number]> = {
  naruto: [16, 16],
};

/**
 * Valore CSS `cursor` per uno slug di mondo, oppure `undefined` se non
 * esiste né un drop-in né un generato (→ cursore di default del browser).
 *
 * Priorità: drop-in `src/assets/worlds/cursors/<slug>.{svg,png,cur,ani}`
 * → generato inline → undefined. Il valore include il fallback `auto`,
 * così se il browser non supporta la sorgente (es. SVG troppo grande)
 * mostra comunque un cursore di sistema.
 */
export function resolveWorldCursor(slug: string | null | undefined): string | undefined {
  if (!slug) return undefined;

  for (const [path, url] of Object.entries(WORLD_CURSORS)) {
    const file = path.slice(path.lastIndexOf('/') + 1);
    const base = file.slice(0, file.lastIndexOf('.'));
    if (base === slug) {
      const [hx, hy] = DROPIN_HOTSPOTS[slug] ?? [16, 16];
      return `url("${url}") ${hx} ${hy}, auto`;
    }
  }

  const gen = GENERATED[slug];
  if (gen) return dataUriCursor(gen.svg, gen.hotspot);

  return undefined;
}
