/**
 * Copertura dei capitoli: quali capitoli del manga sono raccontati da almeno un
 * evento della timeline, e dove sono i buchi.
 *
 *   npm run coverage:chapters               # tutti i mondi
 *   npm run coverage:chapters -- jujutsukaisen --gap 3
 *
 * Legge `event.mangaChapters` (formati: "55-63", "~111", "112-~114", "Boruto 4-6",
 * "DBS ch. 15-18"). Il prefisso prima dei numeri distingue la serie (manga
 * principale, sequel, spin-off); "copertine" (storie in copertina) è escluso.
 * Il totale dei capitoli è quello noto della serie conclusa, altrimenti il
 * capitolo più alto citato nei dati. Informativo: non blocca la build.
 */
import { animeWorlds } from '@/data/worlds';
import { loadWorldDataset } from '@/data/registry';

/** Capitoli totali delle serie concluse (manga principale = chiave ''). */
const TOTALS: Record<string, Record<string, number>> = {
  naruto: { '': 700 },
  dragonball: { '': 519 },
  attackontitan: { '': 139 },
  bleach: { '': 686 },
  jujutsukaisen: { '': 271 },
};
/** Serie che non partono dal capitolo 1 (Turn Back the Pendulum va da -108 a -97). */
const FIRST: Record<string, Record<string, number>> = { bleach: { pendulum: 97 } };
const IGNORED_SERIES = new Set(['copertine', 'covers']);

const args = process.argv.slice(2);
const gapArg = args.indexOf('--gap');
const MIN_GAP = gapArg >= 0 ? Number(args[gapArg + 1]) : 5;
const only = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--gap');

function parse(raw: string): { series: string; ranges: [number, number][] } {
  let clean = raw.replace(/\([^)]*\)/g, '').replace(/~/g, '').trim();
  // Turn Back the Pendulum (Bleach) numera i capitoli in negativo: "-108 → -105".
  const pendulum = /^-\d/.test(clean);
  if (pendulum) clean = 'pendulum ' + clean.replace(/-(\d)/g, '$1').replace(/→/g, '-');
  const m = clean.match(/^([^\d]*?)\s*(?:ch\.)?\s*(\d.*)$/i);
  if (!m) return { series: '', ranges: [] };
  const series = m[1].replace(/ch\.$/i, '').replace(/[^\p{L}\s]/gu, '').trim().toLowerCase();
  const ranges: [number, number][] = [];
  for (const r of m[2].matchAll(/(\d+)(?:\s*-\s*(\d+))?/g)) {
    const a = Number(r[1]);
    const b = r[2] ? Number(r[2]) : a;
    if (b >= a && b - a < 400) ranges.push([a, b]);
    else if (a > b && a - b < 400) ranges.push([b, a]);
  }
  return { series, ranges };
}

function gaps(covered: Set<number>, first: number, total: number): [number, number][] {
  const out: [number, number][] = [];
  let start = -1;
  for (let c = first; c <= total + 1; c++) {
    const hole = c <= total && !covered.has(c);
    if (hole && start < 0) start = c;
    if (!hole && start >= 0) {
      if (c - start >= MIN_GAP) out.push([start, c - 1]);
      start = -1;
    }
  }
  return out;
}

for (const world of animeWorlds.filter((w) => w.status === 'available')) {
  if (only.length && !only.includes(world.slug)) continue;
  const dataset = await loadWorldDataset(world.slug);
  if (!dataset) continue;
  const bySeries = new Map<string, Set<number>>();
  let withChapters = 0;
  for (const e of dataset.events) {
    if (e.mangaChapters?.length) withChapters++;
    for (const raw of e.mangaChapters ?? []) {
      const { series, ranges } = parse(raw);
      if (IGNORED_SERIES.has(series)) continue;
      const set = bySeries.get(series) ?? new Set<number>();
      for (const [a, b] of ranges) for (let c = a; c <= b; c++) set.add(c);
      bySeries.set(series, set);
    }
  }
  console.log(`\n=== ${world.slug} · ${dataset.events.length} eventi (${withChapters} con capitoli)`);
  for (const [series, covered] of [...bySeries].sort(([a], [b]) => a.localeCompare(b))) {
    const total = TOTALS[world.slug]?.[series] ?? Math.max(...covered);
    const first = FIRST[world.slug]?.[series] ?? 1;
    const n = [...covered].filter((c) => c >= first && c <= total).length;
    const holes = gaps(covered, first, total);
    const label = series || 'manga';
    const size = total - first + 1;
    console.log(`  ${label}: ${n}/${size} capitoli (${Math.round((n / size) * 100)}%) · ${holes.length} buchi ≥ ${MIN_GAP}`);
    if (holes.length) console.log(`    buchi: ${holes.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`)).join(', ')}`);
  }
}
