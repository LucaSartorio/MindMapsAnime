/**
 * Cursore tematico per mondo.
 *
 * Restituisce un valore CSS `cursor` completo (con hotspot e fallback)
 * da applicare al contenitore del mondo. In ordine:
 *  1. drop-in SVG  → `src/assets/worlds/cursors/<slug>.svg`
 *     L'SVG viene normalizzato a 32×32 e ricolorato a bianco con un
 *     sottilissimo bordo scuro per restare visibile su ogni sfondo.
 *  2. drop-in binario → `src/assets/worlds/cursors/<slug>.{png,cur,ani}`
 *     Usato così com'è (per PNG il browser scala a 32×32 da solo).
 *  3. SVG generato inline per gli slug noti (es. Naruto fallback).
 *
 * Nota: sul canvas della mappa (React Flow) il cursore di pan
 * (grab/grabbing) ha la precedenza, per non perdere l'affordance di
 * trascinamento; il cursore tematico resta su pannelli, header, archivio
 * e modali.
 */

const WORLD_CURSORS_SVG = import.meta.glob(
  '../assets/worlds/cursors/*.svg',
  { eager: true, query: '?raw', import: 'default' },
) as Record<string, string>;

const WORLD_CURSORS_BIN = import.meta.glob(
  '../assets/worlds/cursors/*.{png,cur,ani}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

/** Simbolo della Foglia (Konoha) ricostruito: foglia verticale + spirale
 *  alla base. È una sagoma autentica come *forma*, ma resta una nostra
 *  rilettura — l'SVG canonico (es. Wikimedia Commons, "Simbolo konoha")
 *  va messo come drop-in in `src/assets/worlds/cursors/naruto.svg` e
 *  prende il posto di questa fallback. */
const KONOHA_LEAF = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>
<path d='M19 3.3 C25.7 5.2 29.6 11.8 28 18.6 C26.6 24.6 21.4 28.7 15.4 28.2 C10.1 27.7 5.7 23.7 5 18.4 C4.4 13.7 7.3 9.6 11.6 9 C14.9 8.5 17.9 10.8 18 14 C18.1 16.4 16.3 18.2 14.1 17.9 C12.6 17.7 11.7 16.4 12 15 C12.2 14 13 13.4 13.9 13.6' fill='#ffffff' stroke='#0a1410' stroke-width='1.2' stroke-linejoin='round' stroke-linecap='round'/>
</svg>`;

interface GeneratedCursor {
  svg: string;
  /** Hotspot (x, y) in px. */
  hotspot: [number, number];
}

const GENERATED: Record<string, GeneratedCursor> = {
  naruto: { svg: KONOHA_LEAF, hotspot: [16, 16] },
};

/**
 * Hotspot dei drop-in per slug (px). I file su disco non possono "dire"
 * dove sta il loro punto attivo, quindi lo dichiariamo qui. Default 16 16
 * (centro per un cursore 32×32).
 */
const DROPIN_HOTSPOTS: Record<string, [number, number]> = {
  naruto: [16, 16],
};

/**
 * Normalizza un SVG drop-in per renderlo "cursor-ready":
 *  - dimensioni esterne a 32×32 (così Safari, che rispetta width/height,
 *    non scala in base alle dimensioni originali);
 *  - se manca il viewBox, lo deriva dai width/height originali, così la
 *    sagoma non viene tagliata o squashata;
 *  - sostituisce i colori "nero puro" usati in `fill` / `stroke` (inclusi
 *    quelli dentro `style="..."`) con bianco. Funziona sia per SVG
 *    fill-based (un solido nero → solido bianco) sia stroke-based
 *    (`fill: none; stroke: #000` → `fill: none; stroke: #fff`).
 *
 * Lo swap è chirurgico: tocca solo i VALORI dei colori di disegno, non
 * la struttura dell'SVG né i metadati (Inkscape `bordercolor`,
 * `pagecolor`, ecc.). Niente CSS injection con `!important` → non
 * stravolge SVG con `fill: none` intenzionale.
 */
function normalizeCursorSvg(raw: string): string {
  let svg = raw.trim();

  // Via il prolog XML, se presente: nei data URI è solo rumore.
  svg = svg.replace(/^<\?xml[^?]*\?>\s*/i, '');
  // Via gli eventuali commenti per ridurre la URI.
  svg = svg.replace(/<!--[\s\S]*?-->/g, '');

  // 1) Color swap nero → bianco, limitato ai valori di fill/stroke.
  svg = swapDarkColors(svg);

  // 2) Dimensioni esterne: forziamo width/height a 32 e preserviamo
  //    (o deriviamo) il viewBox.
  const openMatch = svg.match(/<svg\b[^>]*>/i);
  if (!openMatch) return svg;
  const openTag = openMatch[0];

  let viewBox = openTag.match(/\bviewBox\s*=\s*"([^"]+)"/i)?.[1] ?? null;
  if (!viewBox) {
    const w = parseFloat(openTag.match(/\bwidth\s*=\s*"([\d.]+)/i)?.[1] ?? '0');
    const h = parseFloat(openTag.match(/\bheight\s*=\s*"([\d.]+)/i)?.[1] ?? '0');
    if (w > 0 && h > 0) viewBox = `0 0 ${w} ${h}`;
  }

  let newOpen = openTag
    .replace(/\swidth\s*=\s*"[^"]*"/i, '')
    .replace(/\sheight\s*=\s*"[^"]*"/i, '')
    .replace(/\sviewBox\s*=\s*"[^"]*"/i, '');
  newOpen = newOpen.replace(
    /<svg\b/i,
    `<svg width="32" height="32"${viewBox ? ` viewBox="${viewBox}"` : ''}`,
  );

  return svg.replace(openTag, newOpen);
}

/** Sostituisce il nero "puro" con bianco solo nei valori di colore usati
 * da `fill`, `stroke` e dentro le dichiarazioni `style="..."`. */
function swapDarkColors(svg: string): string {
  // Pattern per i nomi/codifiche di nero che vogliamo sostituire. Word
  // boundaries (`\b`) e check su carattere successivo evitano collisioni
  // con prefissi più lunghi (es. #000abc, "blackgrey", ecc.).
  const swap = (s: string): string =>
    s
      .replace(/rgba?\s*\(\s*0\s*,\s*0\s*,\s*0(\s*,[^)]*)?\)/gi, '#ffffff')
      .replace(/#000000(?![0-9a-f])/gi, '#ffffff')
      .replace(/#000(?![0-9a-f])/gi, '#ffffff')
      .replace(/(^|[^a-zA-Z-])black(?![a-zA-Z-])/g, '$1#ffffff');

  // 1) Attributi diretti: fill="..." / stroke="..." (anche con singoli apici).
  svg = svg.replace(
    /\b(fill|stroke)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi,
    (m, prop, dq, sq) => {
      const val = dq ?? sq;
      const next = swap(val);
      if (next === val) return m;
      return dq != null ? `${prop}="${next}"` : `${prop}='${next}'`;
    },
  );

  // 2) Valori CSS dentro style="...": sostituiamo nell'intera stringa
  //    style, lo swap colpisce solo i colori effettivi.
  svg = svg.replace(
    /\bstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/gi,
    (m, dq, sq) => {
      const val = dq ?? sq;
      const next = swap(val);
      if (next === val) return m;
      return dq != null ? `style="${next}"` : `style='${next}'`;
    },
  );

  return svg;
}

function dataUriCursor(svg: string, hotspot: [number, number]): string {
  // Comprimiamo whitespace e usiamo encodeURIComponent: i data URI svg+xml
  // funzionano su tutti i browser moderni.
  const compact = svg.replace(/\s+/g, ' ').trim();
  const uri = `data:image/svg+xml,${encodeURIComponent(compact)}`;
  return `url("${uri}") ${hotspot[0]} ${hotspot[1]}, auto`;
}

/**
 * Valore CSS `cursor` per uno slug di mondo, oppure `undefined` se non
 * esiste né un drop-in né un generato (→ cursore di default del browser).
 *
 * Priorità: drop-in SVG (normalizzato) → drop-in binario → generato inline.
 */
export function resolveWorldCursor(slug: string | null | undefined): string | undefined {
  if (!slug) return undefined;
  const hotspot = DROPIN_HOTSPOTS[slug] ?? [16, 16];

  // 1) Drop-in SVG: normalizziamo dimensioni e colori a runtime.
  for (const [path, raw] of Object.entries(WORLD_CURSORS_SVG)) {
    const base = baseName(path);
    if (base === slug) {
      return dataUriCursor(normalizeCursorSvg(raw), hotspot);
    }
  }

  // 2) Drop-in binario (PNG/CUR/ANI): non possiamo trasformarlo.
  for (const [path, url] of Object.entries(WORLD_CURSORS_BIN)) {
    const base = baseName(path);
    if (base === slug) {
      return `url("${url}") ${hotspot[0]} ${hotspot[1]}, auto`;
    }
  }

  // 3) Generato inline.
  const gen = GENERATED[slug];
  if (gen) return dataUriCursor(normalizeCursorSvg(gen.svg), gen.hotspot);

  return undefined;
}

function baseName(path: string): string {
  const file = path.slice(path.lastIndexOf('/') + 1);
  return file.slice(0, file.lastIndexOf('.'));
}
