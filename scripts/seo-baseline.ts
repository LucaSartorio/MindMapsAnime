/**
 * Baseline SEO dell'output di build — rileva le REGRESSIONI DI MASSA che i
 * controlli per pagina di `seo-check.ts` non vedono (ogni pagina resta valida,
 * ma una categoria intera sparisce dalla sitemap, i noindex raddoppiano, il
 * testo renderizzato di un template si dimezza, la navigazione perde i link).
 *
 * `seo-check.ts` calcola uno snapshot per gruppo `lingua|mondo|tipo` e lo
 * confronta con `scripts/seo-baseline.json` (versionato). Una variazione voluta
 * si registra con `npm run seo:baseline` (dopo `npm run build`) e si committa:
 * il diff del file rende la variazione visibile in review.
 *
 * Soglie (scelte sulla baseline reale di novembre 2026: 16.713 pagine, 14.348
 * indicizzabili, gruppi da 1 a ~800 pagine). Si confrontano solo gruppi con
 * abbastanza pagine da non generare falsi positivi:
 *  - ERRORE  gruppo con ≥ MIN_GROUP indicizzabili che scende a 0, oppure cala
 *            di oltre DROP_ERROR; totale indicizzabili in calo oltre TOTAL_DROP_ERROR;
 *            quota noindex del gruppo su di oltre NOINDEX_PP_ERROR punti;
 *            canonicalizzate altrove +CANON_ERROR e almeno MIN_GROUP in più;
 *            mediana del testo principale o dei link contestuali in calo oltre
 *            TEXT_DROP_ERROR / LINKS_DROP_ERROR (template che perde contenuto).
 *  - AVVISO  cali minori (oltre DROP_WARN / TEXT_DROP_WARN) e crescite improvvise
 *            (oltre GROWTH_WARN in un gruppo, TOTAL_GROWTH_WARN in totale): una
 *            moltiplicazione rapida di pagine indicizzabili va verificata per
 *            qualità prima del deploy (vedi docs/SEO-RECOVERY-2026-11.md).
 * Funzioni pure: testate in `scripts/test-seo.ts`.
 */

export const BASELINE_VERSION = 1;

export const THRESHOLDS = {
  MIN_GROUP: 20,
  DROP_ERROR: 0.2,
  DROP_WARN: 0.05,
  TOTAL_DROP_ERROR: 0.05,
  NOINDEX_PP_ERROR: 0.1,
  CANON_ERROR: 0.2,
  TEXT_DROP_ERROR: 0.25,
  TEXT_DROP_WARN: 0.1,
  LINKS_DROP_ERROR: 0.3,
  GROWTH_WARN: 0.5,
  TOTAL_GROWTH_WARN: 0.25,
} as const;

export interface GroupStats {
  /** Pagine HTML del gruppo (esclusi i redirect). */
  pages: number;
  /** Indicizzabili (robots index + canonical auto-referenziale). */
  indexable: number;
  /** robots noindex. */
  noindex: number;
  /** index ma canonical verso un'altra pagina (proiezioni). */
  canonicalized: number;
  /** Mediana dei caratteri di testo in `<main>` (senza nav/footer) delle indicizzabili. */
  medianText: number;
  /** Mediana dei link interni in `<main>` (senza nav/footer) delle indicizzabili. */
  medianLinks: number;
}

export interface SeoBaseline {
  version: number;
  totals: { pages: number; indexable: number; sitemap: number };
  groups: Record<string, GroupStats>;
}

export interface PageSample {
  url: string;
  indexable: boolean;
  canonicalized: boolean;
  noindex: boolean;
  mainText: number;
  mainLinks: number;
}

/**
 * Gruppo di una pagina: `lingua|mondo|tipo`. Il tipo è la categoria per le
 * pagine entità (`characters`), `<categoria>:index` per gli indici (anche
 * paginati), `landing`/`map`/`timeline` per le hub, `static` fuori dai mondi.
 */
export function groupOf(url: string): string {
  const parts = url.split('/').filter(Boolean);
  const lang = parts[0] ?? '-';
  if (parts.length < 2) return `${lang}|-|static`;
  const second = parts[1];
  if (parts.length === 2) return ['about', 'support', 'privacy', 'cookie-policy'].includes(second) ? `${lang}|-|static` : `${lang}|${second}|landing`;
  const kind = parts[2];
  if (kind === 'map' || kind === 'timeline') return `${lang}|${second}|${kind}`;
  if (parts.length === 3 || parts[3] === 'page') return `${lang}|${second}|${kind}:index`;
  return `${lang}|${second}|${kind}`;
}

function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor((s.length - 1) / 2)];
}

export function buildBaseline(samples: PageSample[], sitemapSize: number): SeoBaseline {
  const by = new Map<string, PageSample[]>();
  for (const s of samples) {
    const g = groupOf(s.url);
    by.set(g, [...(by.get(g) ?? []), s]);
  }
  const groups: Record<string, GroupStats> = {};
  for (const g of [...by.keys()].sort()) {
    const list = by.get(g)!;
    const idx = list.filter((s) => s.indexable);
    groups[g] = {
      pages: list.length,
      indexable: idx.length,
      noindex: list.filter((s) => s.noindex).length,
      canonicalized: list.filter((s) => s.canonicalized).length,
      medianText: median(idx.map((s) => s.mainText)),
      medianLinks: median(idx.map((s) => s.mainLinks)),
    };
  }
  return {
    version: BASELINE_VERSION,
    totals: { pages: samples.length, indexable: samples.filter((s) => s.indexable).length, sitemap: sitemapSize },
    groups,
  };
}

const pct = (x: number) => `${(x * 100).toFixed(1)} %`;

/** Confronto con la baseline: errori bloccanti, avvisi, note informative. */
export function compareBaseline(
  base: SeoBaseline,
  cur: SeoBaseline,
): { errors: string[]; warnings: string[]; notes: string[] } {
  const T = THRESHOLDS;
  const errors: string[] = [];
  const warnings: string[] = [];
  const notes: string[] = [];
  const p = '[baseline]';

  const bt = base.totals.indexable;
  const ct = cur.totals.indexable;
  if (bt > 0) {
    const d = (ct - bt) / bt;
    if (d < -T.TOTAL_DROP_ERROR) errors.push(`${p} indicizzabili totali ${bt} → ${ct} (${pct(d)})`);
    else if (d > T.TOTAL_GROWTH_WARN) {
      warnings.push(`${p} indicizzabili totali ${bt} → ${ct} (+${pct(d)}): crescita improvvisa, verificare la qualità delle nuove pagine`);
    }
  }
  if (base.totals.sitemap > 0 && cur.totals.sitemap < base.totals.sitemap * (1 - T.TOTAL_DROP_ERROR)) {
    errors.push(`${p} URL in sitemap ${base.totals.sitemap} → ${cur.totals.sitemap}`);
  }

  for (const [g, b] of Object.entries(base.groups)) {
    const c = cur.groups[g];
    if (!c) {
      if (b.indexable >= T.MIN_GROUP) errors.push(`${p} ${g}: gruppo sparito (${b.indexable} pagine indicizzabili nella baseline)`);
      else notes.push(`${p} ${g}: gruppo assente (${b.pages} pagine nella baseline)`);
      continue;
    }
    if (b.indexable >= T.MIN_GROUP) {
      const d = (c.indexable - b.indexable) / b.indexable;
      if (c.indexable === 0) errors.push(`${p} ${g}: nessuna pagina indicizzabile (erano ${b.indexable})`);
      else if (d < -T.DROP_ERROR) errors.push(`${p} ${g}: indicizzabili ${b.indexable} → ${c.indexable} (${pct(d)})`);
      else if (d < -T.DROP_WARN) warnings.push(`${p} ${g}: indicizzabili ${b.indexable} → ${c.indexable} (${pct(d)})`);
      else if (d > T.GROWTH_WARN && c.indexable - b.indexable >= T.MIN_GROUP) {
        warnings.push(`${p} ${g}: indicizzabili ${b.indexable} → ${c.indexable} (+${pct(d)}): verificare la qualità delle nuove pagine`);
      }
      if (b.medianText > 0) {
        const t = (c.medianText - b.medianText) / b.medianText;
        if (t < -T.TEXT_DROP_ERROR) errors.push(`${p} ${g}: testo principale mediano ${b.medianText} → ${c.medianText} caratteri (${pct(t)})`);
        else if (t < -T.TEXT_DROP_WARN) warnings.push(`${p} ${g}: testo principale mediano ${b.medianText} → ${c.medianText} caratteri (${pct(t)})`);
      }
      if (b.medianLinks >= 3) {
        const l = (c.medianLinks - b.medianLinks) / b.medianLinks;
        if (l < -T.LINKS_DROP_ERROR) errors.push(`${p} ${g}: link contestuali mediani ${b.medianLinks} → ${c.medianLinks} (${pct(l)})`);
      }
    }
    if (b.pages >= T.MIN_GROUP && c.pages > 0) {
      const share = (x: GroupStats) => x.noindex / x.pages;
      const dpp = share(c) - share(b);
      if (dpp > T.NOINDEX_PP_ERROR) errors.push(`${p} ${g}: quota noindex ${pct(share(b))} → ${pct(share(c))}`);
    }
    if (c.canonicalized - b.canonicalized >= T.MIN_GROUP && c.canonicalized > b.canonicalized * (1 + T.CANON_ERROR)) {
      errors.push(`${p} ${g}: canonical verso altre pagine ${b.canonicalized} → ${c.canonicalized}`);
    }
  }
  for (const g of Object.keys(cur.groups)) {
    if (!base.groups[g]) notes.push(`${p} ${g}: nuovo gruppo (${cur.groups[g].indexable} indicizzabili)`);
  }
  return { errors, warnings, notes };
}
