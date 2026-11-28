/**
 * Analisi deterministica degli export di Google Search Console (nessuna API,
 * nessuna dipendenza, nessun dato inventato: solo ciò che è nei file).
 *
 *   npm run seo:gsc -- <file.csv|cartella>... [--split 2026-10-26] [--swap] [--out report.md] [--top 100]
 *
 * Input accettati (anche insieme):
 *  1. Export dell'interfaccia in modalità CONFRONTO (Prestazioni → Date →
 *     Confronta → Esporta → CSV): `Pagine.csv`/`Pages.csv`, `Query.csv`/
 *     `Queries.csv`, `Paesi.csv`/`Countries.csv`, `Dispositivi.csv`/`Devices.csv`,
 *     intestazioni in italiano o inglese ("Ultimi 28 giorni Clic", "Previous 28
 *     days Impressions", "26/10/2026 - 22/11/2026 Posizione"…). Il periodo
 *     "precedente" si riconosce dall'etichetta o dalle date; altrimenti GSC elenca
 *     prima il periodo recente (`--swap` per invertire).
 *  2. Righe dettagliate (API Search Analytics, export BigQuery, Looker Studio):
 *     colonne `date`, `query`, `page`, `clicks`, `impressions`, `position`
 *     (+ `country`, `device` facoltative). Con `--split AAAA-MM-GG` le righe prima
 *     della data sono il periodo "prima", le altre "dopo"; permette l'analisi
 *     query × pagina (cannibalizzazione).
 *
 * Output: totali, perdite per pagina / query / template (lingua|mondo|tipo, gli
 * stessi gruppi di `seo-baseline.ts`) / lingua / mondo, fasce di posizione
 * (1–3, 4–10, 11–20), gruppo di controllo (le sezioni meno colpite), pagine perse
 * che OGGI in `dist/` sono 404 / noindex / canonicalizzate (cause tecniche) e
 * query con più pagine in competizione. Le funzioni pure sono testate in
 * `scripts/test-seo.ts`.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { groupOf } from './seo-baseline';

export interface Metrics {
  clicks: number;
  impressions: number;
  /** Somma di posizione × impressioni (media ponderata = posSum / impressions). */
  posSum: number;
}
export interface DimRow {
  key: string;
  before: Metrics;
  after: Metrics;
}
export type Dimension = 'page' | 'query' | 'country' | 'device' | 'date' | 'appearance' | 'unknown';

const ZERO = (): Metrics => ({ clicks: 0, impressions: 0, posSum: 0 });

/* --------------------------------- CSV --------------------------------- */

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const src = text.replace(/^﻿/, '');
  const sep = (src.split('\n')[0].match(/;/g)?.length ?? 0) > (src.split('\n')[0].match(/,/g)?.length ?? 0) ? ';' : ',';
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === sep) {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell);
      if (row.some((c) => c.trim() !== '')) rows.push(row);
      row = [];
      cell = '';
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim() !== '')) rows.push(row);
  return rows;
}

/** Numero da un export (1234 · 1.234 · 1,234 · 11,1 · 0,52% · 12.5%). */
export function parseNumber(raw: string): number {
  let s = (raw ?? '').trim().replace(/%$/, '').replace(/\s/g, '');
  if (!s || s === '-' || s === '—') return 0;
  const hasDot = s.includes('.');
  const hasComma = s.includes(',');
  if (hasDot && hasComma) s = s.lastIndexOf(',') > s.lastIndexOf('.') ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  else if (hasComma) s = /^\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, '') : s.replace(',', '.');
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

/** Conteggio (clic, impressioni): interi, quindi "1.234" è un separatore delle migliaia. */
export function parseCount(raw: string): number {
  const s = (raw ?? '').trim().replace(/\s/g, '');
  if (/^\d{1,3}([.,]\d{3})+$/.test(s)) return Number(s.replace(/[.,]/g, ''));
  return Math.round(parseNumber(s));
}

/* ----------------------------- intestazioni ----------------------------- */

type MetricName = 'clicks' | 'impressions' | 'ctr' | 'position';
const METRIC_RE: [MetricName, RegExp][] = [
  ['clicks', /\b(clicks?|clic)$/i],
  ['impressions', /\b(impressions?|impressioni)$/i],
  ['ctr', /\bctr$/i],
  ['position', /\b(position|posizione)$/i],
];

export function dimensionOf(header: string): Dimension {
  const h = header.toLowerCase();
  if (/pagin|page|url/.test(h)) return 'page';
  if (/quer/.test(h)) return 'query';
  if (/paes|countr/.test(h)) return 'country';
  if (/dispositiv|device/.test(h)) return 'device';
  if (/^data$|^date$|giorn|day/.test(h)) return 'date';
  if (/aspetto|appearance/.test(h)) return 'appearance';
  return 'unknown';
}

/** Data di inizio di un'etichetta di periodo ("26/10/2026 - 22/11/2026", "2026-10-26 – …"). */
function periodStart(label: string): number | undefined {
  const iso = /(\d{4})-(\d{2})-(\d{2})/.exec(label);
  if (iso) return Date.UTC(+iso[1], +iso[2] - 1, +iso[3]);
  const eu = /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/.exec(label);
  if (eu) return Date.UTC(+eu[3] < 100 ? 2000 + +eu[3] : +eu[3], +eu[2] - 1, +eu[1]);
  return undefined;
}

export interface HeaderMap {
  dimension: Dimension;
  /** Colonne per periodo: `before` e `after` (solo `after` se l'export non è un confronto). */
  periods: { before?: Partial<Record<MetricName, number>>; after: Partial<Record<MetricName, number>> };
  labels: { before?: string; after: string };
}

export function mapHeaders(header: string[], swap = false): HeaderMap {
  const byPrefix = new Map<string, Partial<Record<MetricName, number>>>();
  header.forEach((h, i) => {
    if (i === 0) return;
    const t = h.trim();
    for (const [name, re] of METRIC_RE) {
      const m = re.exec(t);
      if (!m) continue;
      const prefix = t.slice(0, m.index).trim();
      const cols = byPrefix.get(prefix) ?? {};
      cols[name] = i;
      byPrefix.set(prefix, cols);
      break;
    }
  });
  const prefixes = [...byPrefix.keys()];
  const dimension = dimensionOf(header[0] ?? '');
  if (prefixes.length < 2) return { dimension, periods: { after: byPrefix.get(prefixes[0] ?? '') ?? {} }, labels: { after: prefixes[0] ?? '' } };
  let [a, b] = prefixes; // GSC: prima il periodo recente
  const prev = (l: string) => /previous|precedent|prior/i.test(l);
  if (prev(a) && !prev(b)) [a, b] = [b, a];
  else if (!prev(a) && !prev(b)) {
    const sa = periodStart(a);
    const sb = periodStart(b);
    if (sa !== undefined && sb !== undefined && sa < sb) [a, b] = [b, a];
  }
  if (swap) [a, b] = [b, a];
  return { dimension, periods: { after: byPrefix.get(a)!, before: byPrefix.get(b)! }, labels: { after: a, before: b } };
}

function metricsFrom(row: string[], cols: Partial<Record<MetricName, number>> | undefined): Metrics {
  if (!cols) return ZERO();
  const impressions = cols.impressions !== undefined ? parseCount(row[cols.impressions]) : 0;
  const position = cols.position !== undefined ? parseNumber(row[cols.position]) : 0;
  return {
    clicks: cols.clicks !== undefined ? parseCount(row[cols.clicks]) : 0,
    impressions,
    posSum: position * impressions,
  };
}

/** Export dell'interfaccia (confronto o periodo singolo) → righe per dimensione. */
export function readUiExport(text: string, swap = false): { map: HeaderMap; rows: DimRow[] } {
  const [header, ...body] = parseCsv(text);
  const map = mapHeaders(header, swap);
  const rows = body.map((r) => ({ key: r[0].trim(), before: metricsFrom(r, map.periods.before), after: metricsFrom(r, map.periods.after) }));
  return { map, rows };
}

/* ------------------------- righe dettagliate (API) ------------------------ */

export interface DetailRow {
  date: string;
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  position: number;
  country?: string;
  device?: string;
}

export function readDetailRows(text: string): DetailRow[] | null {
  const [header, ...body] = parseCsv(text);
  const idx = (re: RegExp) => header.findIndex((h) => re.test(h.trim().toLowerCase()));
  const c = {
    date: idx(/^(date|data|day)$/),
    query: idx(/^(query|queries)$/),
    page: idx(/^(page|pagina|url|landing_page)$/),
    clicks: idx(/^(clicks|clic)$/),
    impressions: idx(/^(impressions|impressioni)$/),
    position: idx(/^(position|posizione|avg_position|sum_position)$/),
    country: idx(/^(country|paese)$/),
    device: idx(/^(device|dispositivo)$/),
  };
  if (c.date < 0 || c.clicks < 0 || c.impressions < 0 || (c.query < 0 && c.page < 0)) return null;
  const sumPos = /sum_position/.test(header[c.position] ?? '');
  return body.map((r) => {
    const impressions = parseCount(r[c.impressions]);
    const pos = c.position >= 0 ? parseNumber(r[c.position]) : 0;
    return {
      date: (r[c.date] ?? '').trim().slice(0, 10),
      query: c.query >= 0 ? r[c.query].trim() : '',
      page: c.page >= 0 ? r[c.page].trim() : '',
      clicks: parseCount(r[c.clicks]),
      impressions,
      // BigQuery bulk export: sum_top_position è 0-based e già sommato.
      position: sumPos && impressions ? pos / impressions + 1 : pos,
      country: c.country >= 0 ? r[c.country] : undefined,
      device: c.device >= 0 ? r[c.device] : undefined,
    };
  });
}

function add(m: Metrics, clicks: number, impressions: number, position: number) {
  m.clicks += clicks;
  m.impressions += impressions;
  m.posSum += position * impressions;
}

/** Aggrega righe dettagliate per dimensione, prima/dopo `split`. */
export function aggregateDetail(rows: DetailRow[], split: string, key: (r: DetailRow) => string): DimRow[] {
  const by = new Map<string, DimRow>();
  for (const r of rows) {
    const k = key(r);
    if (!k) continue;
    const row = by.get(k) ?? { key: k, before: ZERO(), after: ZERO() };
    add(r.date < split ? row.before : row.after, r.clicks, r.impressions, r.position);
    by.set(k, row);
  }
  return [...by.values()];
}

/** Query con più pagine che si dividono le impressioni (ognuna ≥ `minShare` nel periodo `before`). */
export function cannibalization(rows: DetailRow[], split: string, minShare = 0.1, minImpr = 50) {
  const byQ = new Map<string, Map<string, number>>();
  for (const r of rows) {
    if (!r.query || !r.page || r.date >= split) continue;
    const m = byQ.get(r.query) ?? new Map<string, number>();
    m.set(normalizePath(r.page), (m.get(normalizePath(r.page)) ?? 0) + r.impressions);
    byQ.set(r.query, m);
  }
  const out: { query: string; impressions: number; pages: { page: string; share: number }[] }[] = [];
  for (const [query, m] of byQ) {
    const tot = [...m.values()].reduce((a, b) => a + b, 0);
    if (tot < minImpr) continue;
    const pages = [...m].map(([page, n]) => ({ page, share: n / tot })).filter((p) => p.share >= minShare).sort((a, b) => b.share - a.share);
    if (pages.length >= 2) out.push({ query, impressions: tot, pages });
  }
  return out.sort((a, b) => b.impressions - a.impressions);
}

/* --------------------------------- util --------------------------------- */

/** URL di GSC → path del sito (qualsiasi host, niente query/slash finale). */
export function normalizePath(url: string): string {
  let p = url.trim().replace(/^https?:\/\/[^/]+/i, '');
  p = p.split('#')[0].split('?')[0];
  if (p.length > 1) p = p.replace(/\/$/, '');
  return p || '/';
}

/** Template di una pagina: `lingua|mondo|tipo` (stessi gruppi della baseline SEO). */
export const templateOf = (url: string) => groupOf(normalizePath(url));

export function rollup(rows: DimRow[], key: (k: string) => string): DimRow[] {
  const by = new Map<string, DimRow>();
  for (const r of rows) {
    const k = key(r.key);
    const g = by.get(k) ?? { key: k, before: ZERO(), after: ZERO() };
    for (const side of ['before', 'after'] as const) {
      g[side].clicks += r[side].clicks;
      g[side].impressions += r[side].impressions;
      g[side].posSum += r[side].posSum;
    }
    by.set(k, g);
  }
  return [...by.values()];
}

const pos = (m: Metrics) => (m.impressions ? m.posSum / m.impressions : 0);
const ctr = (m: Metrics) => (m.impressions ? (m.clicks / m.impressions) * 100 : 0);
const f1 = (n: number) => (n ? n.toFixed(1) : '–');
const delta = (a: number, b: number) => (a ? `${(((b - a) / a) * 100).toFixed(1)} %` : b ? 'nuovo' : '–');

/** Fasce di posizione delle query (solo righe con posizione). */
export function positionBuckets(rows: DimRow[]) {
  const b = (m: Metrics) => {
    const p = pos(m);
    return !m.impressions ? 'assente' : p <= 3 ? '1–3' : p <= 10 ? '4–10' : p <= 20 ? '11–20' : '> 20';
  };
  const out = new Map<string, { before: number; after: number }>();
  for (const k of ['1–3', '4–10', '11–20', '> 20', 'assente']) out.set(k, { before: 0, after: 0 });
  for (const r of rows) {
    out.get(b(r.before))!.before++;
    out.get(b(r.after))!.after++;
  }
  return out;
}

function table(rows: DimRow[], title: string, n: number, label = 'Chiave'): string {
  const lines = [
    `### ${title}`,
    '',
    `| ${label} | Impr. prima | Impr. dopo | Δ impr. | Clic prima | Clic dopo | Pos. prima | Pos. dopo | CTR prima | CTR dopo |`,
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
  ];
  for (const r of rows.slice(0, n)) {
    lines.push(
      `| ${r.key.replace(/\|/g, '\\|')} | ${r.before.impressions} | ${r.after.impressions} | ${delta(r.before.impressions, r.after.impressions)} | ${r.before.clicks} | ${r.after.clicks} | ${f1(pos(r.before))} | ${f1(pos(r.after))} | ${f1(ctr(r.before))} | ${f1(ctr(r.after))} |`,
    );
  }
  return lines.join('\n') + '\n';
}

const byLoss = (rows: DimRow[]) =>
  [...rows].sort((a, b) => b.before.impressions - b.after.impressions - (a.before.impressions - a.after.impressions));

/* ------------------------------ stato in dist ------------------------------ */

function distState(root: string, path: string): string | undefined {
  const dist = join(root, 'dist');
  if (!existsSync(dist)) return undefined;
  const file = join(dist, path === '/' ? 'index.html' : `${path}/index.html`);
  if (!existsSync(file)) return '404 (nessuna pagina)';
  const head = readFileSync(file, 'utf8').slice(0, 6000);
  if (/http-equiv="refresh"/.test(head)) return 'redirect';
  if (/name="robots" content="noindex/.test(head)) return 'noindex';
  const canon = /rel="canonical" href="https:\/\/[^/"]+([^"]*)"/.exec(head)?.[1];
  if (canon !== undefined && (canon || '/') !== path) return `canonical → ${canon}`;
  return undefined;
}

/* ---------------------------------- main ---------------------------------- */

function main() {
  const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const args = process.argv.slice(2);
  const opt = (name: string) => {
    const i = args.indexOf(name);
    return i >= 0 ? args.splice(i, 2)[1] : undefined;
  };
  const split = opt('--split');
  const out = opt('--out');
  const top = Number(opt('--top') ?? 100);
  const swap = args.includes('--swap');
  const inputs = args.filter((a) => !a.startsWith('--'));
  if (inputs.length === 0) {
    console.error('uso: npm run seo:gsc -- <file.csv|cartella>... [--split AAAA-MM-GG] [--swap] [--out report.md] [--top 100]');
    process.exit(1);
  }
  const files = inputs.flatMap((p) =>
    statSync(p).isDirectory() ? readdirSync(p).filter((f) => f.toLowerCase().endsWith('.csv')).map((f) => join(p, f)) : [p],
  );

  const dims = new Map<Dimension, DimRow[]>();
  const labels: string[] = [];
  let detail: DetailRow[] = [];
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    const d = readDetailRows(text);
    if (d) {
      detail = detail.concat(d);
      labels.push(`${basename(f)}: ${d.length} righe dettagliate`);
      continue;
    }
    const { map, rows } = readUiExport(text, swap);
    if (map.dimension === 'unknown' || !map.periods.before) {
      labels.push(`${basename(f)}: ignorato (${map.dimension === 'unknown' ? 'dimensione non riconosciuta' : 'non è un export in modalità confronto'})`);
      continue;
    }
    dims.set(map.dimension, rows);
    labels.push(`${basename(f)}: ${map.dimension}, prima = "${map.labels.before}", dopo = "${map.labels.after}", ${rows.length} righe`);
  }
  if (detail.length) {
    if (!split) {
      console.error('righe dettagliate: serve --split AAAA-MM-GG (primo giorno del periodo "dopo")');
      process.exit(1);
    }
    if (!dims.has('page')) dims.set('page', aggregateDetail(detail, split, (r) => normalizePath(r.page)));
    if (!dims.has('query')) dims.set('query', aggregateDetail(detail, split, (r) => r.query));
    if (!dims.has('country') && detail.some((r) => r.country)) dims.set('country', aggregateDetail(detail, split, (r) => r.country ?? ''));
    if (!dims.has('device') && detail.some((r) => r.device)) dims.set('device', aggregateDetail(detail, split, (r) => r.device ?? ''));
  }

  const md: string[] = ['# Analisi export Search Console', '', '_Generato da `npm run seo:gsc`: solo dati presenti nei file elencati._', ''];
  md.push('## File', '', ...labels.map((l) => `- ${l}`), '');
  const pages = (dims.get('page') ?? []).map((r) => ({ ...r, key: normalizePath(r.key) }));
  const totalsFrom = pages.length ? pages : dims.get('query') ?? [];
  if (totalsFrom.length) {
    const [t] = rollup(totalsFrom, () => 'Totale');
    md.push('## Totali', '', table([t], 'Totale (somma delle righe esportate: GSC tronca a 1.000 righe per tabella)', 1, 'Periodo'));
  }
  if (pages.length) {
    md.push('## Pagine', '');
    md.push(table(byLoss(pages), `Le ${top} pagine con la maggiore perdita di impressioni`, top, 'Pagina'));
    const lost = byLoss(pages).filter((r) => r.before.impressions > 0 && r.after.impressions === 0);
    md.push(`Pagine con impressioni prima e nessuna dopo: **${lost.length}**.`, '');
    const tech = byLoss(pages)
      .slice(0, 1000)
      .map((r) => ({ r, s: distState(ROOT, r.key) }))
      .filter((x) => x.s);
    if (tech.length) {
      md.push('### Pagine in perdita che oggi in `dist/` non sono indicizzabili', '', '| Pagina | Stato in dist | Impr. prima | Impr. dopo |', '| --- | --- | ---: | ---: |');
      for (const { r, s } of tech.slice(0, top)) md.push(`| ${r.key} | ${s} | ${r.before.impressions} | ${r.after.impressions} |`);
      md.push('');
    } else if (existsSync(join(ROOT, 'dist'))) md.push('Nessuna delle prime 1.000 pagine in perdita è oggi 404, noindex, redirect o canonicalizzata in `dist/`.', '');
    const tpl = rollup(pages, (k) => templateOf(k).split('|')[2].replace(/:index$/, ' (indice)'));
    md.push(table(byLoss(tpl), 'Per template', 50, 'Template'));
    md.push(table(byLoss(rollup(pages, (k) => templateOf(k).split('|')[0])), 'Per lingua (dall\'URL)', 10, 'Lingua'));
    md.push(table(byLoss(rollup(pages, (k) => templateOf(k).split('|')[1])), 'Per mondo', 20, 'Mondo'));
    const sections = rollup(pages, (k) => templateOf(k))
      .filter((r) => r.before.impressions >= 200)
      .sort((a, b) => b.after.impressions / b.before.impressions - a.after.impressions / a.before.impressions);
    md.push(table(sections, 'Gruppo di controllo: sezioni meno colpite (≥ 200 impressioni prima)', 15, 'Sezione'));
  }
  const queries = dims.get('query') ?? [];
  if (queries.length) {
    md.push('## Query', '');
    md.push(table(byLoss(queries), `Le ${top} query con la maggiore perdita di impressioni`, top, 'Query'));
    const b = positionBuckets(queries);
    md.push('### Fasce di posizione (numero di query)', '', '| Fascia | Prima | Dopo |', '| --- | ---: | ---: |');
    for (const [k, v] of b) md.push(`| ${k} | ${v.before} | ${v.after} |`);
    md.push('');
    for (const [name, lo, hi] of [['1–3', 0, 3], ['4–10', 3, 10], ['11–20', 10, 20]] as const) {
      const was = queries.filter((r) => r.before.impressions && pos(r.before) > lo && pos(r.before) <= hi);
      md.push(table(byLoss(was), `Query che erano in posizione ${name}: dove sono ora`, 25, 'Query'));
    }
  }
  for (const d of ['country', 'device'] as const) {
    const rows = dims.get(d);
    if (rows?.length) md.push(table(byLoss(rows), d === 'country' ? 'Per paese' : 'Per dispositivo', 15, d === 'country' ? 'Paese' : 'Dispositivo'));
  }
  if (detail.length && split) {
    const can = cannibalization(detail, split);
    md.push('## Query con più pagine in competizione (periodo "prima")', '');
    if (!can.length) md.push('Nessuna query con due o più pagine sopra il 10 % delle impressioni.', '');
    for (const c of can.slice(0, 50)) md.push(`- **${c.query}** (${c.impressions} impr.): ${c.pages.map((p) => `${p.page} ${(p.share * 100).toFixed(0)} %`).join(' · ')}`);
    md.push('');
  }
  md.push(
    '## Lettura',
    '',
    '- Perdita concentrata su pagine oggi non indicizzabili → causa tecnica (vedi tabella sopra).',
    '- Posizione peggiorata su quasi tutte le query e i template, indicizzazione stabile → valutazione di qualità/ranking a livello di sito.',
    '- Posizione stabile e impressioni in calo → domanda (stagionalità, interesse): confrontare con Google Trends.',
    '- CTR in calo a posizione stabile → snippet/title (o funzionalità SERP nuove), non ranking.',
    '',
  );
  const report = md.join('\n');
  if (out) {
    writeFileSync(out, report, 'utf8');
    console.log(`[seo:gsc] report scritto in ${out}`);
  } else console.log(report);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) main();
