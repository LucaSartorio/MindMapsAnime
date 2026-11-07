/**
 * Composizione delle meta description delle pagine entità (SEO-04).
 *
 * Prima: `describe()` riservava 80–110 caratteri alla coda contestuale ("Discover
 * X's locations, story arcs and connections on the interactive Naruto map.") e
 * tagliava il testo reale dell'entità nei 55–85 caratteri rimasti, quasi sempre
 * a metà frase ("Captain of the Straw Hats, gifted with the rubber powers of
 * the… Discover…"): il 58,6 % delle pagine entità indicizzabili.
 *
 * Ora il testo dell'entità ha la precedenza ed è tagliato solo a FINE FRASE;
 * la coda contestuale si aggiunge solo se c'è spazio. Ordine di preferenza
 * (il primo che sta in `SOFT_MAX`):
 *
 *   1. testo intero + coda lunga
 *   2. testo intero + coda breve ("On the interactive Naruto map.")
 *   3. frasi iniziali complete che conservano almeno il 60 % del testo + coda
 *      (lunga se ci sta, altrimenti breve): il contesto (mondo, mappa) vale più
 *      dell'ultima frase
 *   4. testo intero, senza coda
 *   5. frasi iniziali complete (anche più brevi) + coda, poi da sole
 *   6. ultima risorsa (prima frase da sola più lunga di `SOFT_MAX`): taglio a
 *      confine di proposizione, poi di parola, con "…"
 *
 * Funzioni pure e deterministiche: stesso risultato in prerender e nel browser.
 * Niente testo inventato: solo il testo del dataset e le code già tradotte.
 */

/** Lunghezza massima accettata (la stessa tolleranza del comportamento precedente: 165 + 30). */
export const DESCRIPTION_SOFT_MAX = 195;
/** Lunghezza obiettivo per l'ultima risorsa (taglio dentro una frase troppo lunga). */
export const DESCRIPTION_TARGET = 160;

/**
 * Parole che terminano con un punto senza chiudere la frase (minuscolo, senza
 * il punto). Le iniziali di una lettera ("Monkey D. Luffy") sono gestite a parte.
 */
const ABBREVIATIONS = new Set([
  // en
  'mr', 'mrs', 'ms', 'dr', 'st', 'sr', 'jr', 'vs', 'etc', 'no', 'nos', 'vol', 'ch', 'ep', 'eps', 'pp', 'approx', 'lt', 'col', 'gen', 'capt', 'sgt', 'mt', 'ft', 'e.g', 'i.e', 'inc',
  // it
  'ecc', 'cap', 'sig', 'sigg', 'prof', 'dott', 'ca', 'cfr', 'pag', 'n',
  // es
  'sra', 'srta', 'pág', 'aprox', 'núm', 'cía', 'etc',
  // fr
  'mme', 'mlle', 'm', 'env', 'chap', 'cf', 'p',
]);

const SENTENCE_PUNCT = /[.!?…。！？]/;
/** Chiusure ammesse subito dopo la punteggiatura finale (virgolette, parentesi). */
const CLOSERS = /["'»”’)\]]/;

const clean = (text: string) => text.replace(/\s+/g, ' ').trim();

/** Il punto in posizione `i` chiude davvero la frase (non un'abbreviazione, un'iniziale, un decimale)? */
function isSentenceDot(text: string, i: number): boolean {
  const before = text.slice(0, i);
  const word = before.match(/([\p{L}.]+)$/u)?.[1] ?? '';
  if (/^\p{L}$/u.test(word)) return false; // iniziale: "Monkey D. Luffy"
  if (ABBREVIATIONS.has(word.toLowerCase())) return false;
  if (/\p{L}\.\p{L}$/u.test(word)) return false; // "e.g", "U.S"
  return true;
}

/**
 * Spezza un testo in frasi complete, ognuna con la propria punteggiatura
 * finale. Una frase finisce con . ! ? … (più eventuali chiusure » ” ) ) seguiti
 * da spazio e da una lettera maiuscola, una cifra o un'apertura (« " ( ¿ ¡).
 * Prudente per costruzione: nel dubbio NON spezza (una frase più lunga è meglio
 * di un taglio sbagliato).
 */
export function splitSentences(text: string): string[] {
  const s = clean(text);
  const out: string[] = [];
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    if (!SENTENCE_PUNCT.test(s[i])) continue;
    let j = i + 1;
    while (j < s.length && (SENTENCE_PUNCT.test(s[j]) || CLOSERS.test(s[j]) || (s[j] === ' ' && s[j + 1] === '»'))) j++;
    if (j >= s.length) break;
    if (s[j] !== ' ') continue;
    const next = s[j + 1] ?? '';
    if (!/[\p{Lu}\p{N}«"“(¿¡'‘]/u.test(next)) continue;
    if (s[i] === '.' && !isSentenceDot(s, i)) continue;
    out.push(s.slice(start, j).trim());
    start = j + 1;
  }
  const rest = s.slice(start).trim();
  if (rest) out.push(rest);
  return out;
}

/** Chiude il testo con un punto se non termina già con una punteggiatura di fine frase. */
export function endSentence(text: string): string {
  const t = text.trim();
  return /[.!?…。！？]["'»”’)\]]*$/.test(t) ? t : `${t}.`;
}

/**
 * Ultima risorsa per un testo troppo lungo senza fine frase utile: taglia al
 * confine di proposizione (; : , — – ) più vicino al limite, altrimenti al
 * confine di parola; mai a metà parola. Aggiunge "…".
 */
export function clipAtBoundary(text: string, max: number): string {
  const s = clean(text);
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const clause = Math.max(
    ...[';', ':', ',', ' —', ' –', ')'].map((c) => {
      const at = cut.lastIndexOf(c);
      return at > max * 0.55 ? at + (c === ')' ? 1 : 0) : -1;
    }),
  );
  const word = cut.lastIndexOf(' ');
  const at = clause > 0 ? clause : word > max * 0.6 ? word : cut.length;
  return `${cut.slice(0, at).replace(/[\s,;:.–—-]+$/u, '')}…`;
}

export interface DescriptionTails {
  /** Coda contestuale completa (es. "Discover X's locations … on the interactive Naruto map."). */
  long: string;
  /** Coda breve usata quando quella completa non ci sta (es. "On the interactive Naruto map."). */
  short: string;
}

/**
 * Meta description di una pagina entità: testo reale dell'entità (`summary`,
 * nella lingua della pagina) + coda contestuale se c'è spazio. Vedi l'ordine
 * di preferenza in testa al file.
 */
export function composeDescription(summary: string, tails: DescriptionTails, max = DESCRIPTION_SOFT_MAX): string {
  const s = clean(summary);
  if (!s) return tails.long;
  const fits = (x: string) => x.length <= max;
  const join = (a: string, b?: string) => (b ? `${a} ${b}` : a);

  const full = endSentence(s);
  for (const tail of [tails.long, tails.short]) {
    if (fits(join(full, tail))) return join(full, tail);
  }

  const sentences = splitSentences(s);
  const withTail = (minShare: number) => {
    for (let n = sentences.length - 1; n >= 1; n--) {
      const prefix = endSentence(sentences.slice(0, n).join(' '));
      if (prefix.length < full.length * minShare) return undefined;
      if (fits(join(prefix, tails.long))) return join(prefix, tails.long);
      if (fits(join(prefix, tails.short))) return join(prefix, tails.short);
    }
    return undefined;
  };
  const substantial = withTail(0.6);
  if (substantial) return substantial;
  if (fits(full)) return full;
  const anyPrefix = withTail(0);
  if (anyPrefix) return anyPrefix;
  for (let n = sentences.length - 1; n >= 1; n--) {
    const prefix = endSentence(sentences.slice(0, n).join(' '));
    if (fits(prefix)) return prefix;
  }
  return clipAtBoundary(sentences[0] ?? s, DESCRIPTION_TARGET);
}
