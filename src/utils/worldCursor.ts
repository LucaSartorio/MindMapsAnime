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

/** Vortice stilizzato della Foglia (Konoha) — 32×32, hotspot al centro. */
const KONOHA_SWIRL = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>
<path d='M16 4.5 A11.5 11.5 0 1 1 5.5 20.5 A6.2 6.2 0 1 1 16.5 13.5' fill='none' stroke='#08230f' stroke-width='6' stroke-linecap='round'/>
<path d='M16 4.5 A11.5 11.5 0 1 1 5.5 20.5 A6.2 6.2 0 1 1 16.5 13.5' fill='none' stroke='#5fbf6f' stroke-width='3' stroke-linecap='round'/>
<circle cx='16' cy='16' r='1.7' fill='#eafff0'/>
</svg>`;

interface GeneratedCursor {
  svg: string;
  /** Hotspot (x, y) in px. */
  hotspot: [number, number];
}

const GENERATED: Record<string, GeneratedCursor> = {
  naruto: { svg: KONOHA_SWIRL, hotspot: [16, 16] },
};

function dataUriCursor(svg: string, hotspot: [number, number]): string {
  const uri = `data:image/svg+xml,${encodeURIComponent(svg.replace(/\n/g, ''))}`;
  return `url("${uri}") ${hotspot[0]} ${hotspot[1]}, auto`;
}

/**
 * Valore CSS `cursor` per uno slug di mondo, oppure `undefined` se non
 * esiste né un drop-in né un generato (→ cursore di default del browser).
 */
export function resolveWorldCursor(slug: string | null | undefined): string | undefined {
  if (!slug) return undefined;

  for (const [path, url] of Object.entries(WORLD_CURSORS)) {
    const file = path.slice(path.lastIndexOf('/') + 1);
    const base = file.slice(0, file.lastIndexOf('.'));
    if (base === slug) return `url("${url}") 8 8, auto`;
  }

  const gen = GENERATED[slug];
  if (gen) return dataUriCursor(gen.svg, gen.hotspot);

  return undefined;
}
