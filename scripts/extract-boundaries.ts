/**
 * Estrazione automatica dei confini delle nazioni dalla world map PNG.
 *
 * USO (in locale, dove il PNG esiste):
 *   npm run extract:boundaries
 *
 * Lo script:
 *  1. legge `public/assets/worlds/naruto/maps/naruto_world_reference_expanded.png`
 *  2. per ogni nazione, partendo da un "seed" (punto interno, in coordinate
 *     normalizzate 0..1), fa region-growing sul colore di quel pixel
 *  3. traccia il contorno esterno della regione (Moore neighbor tracing)
 *  4. lo semplifica (Douglas–Peucker)
 *  5. lo scala al viewBox 1500 x 882.2204
 *  6. stampa gli `svgPathD` pronti da incollare in `boundaries.ts`
 *
 * Se un seed non cade nella regione giusta, regola le coordinate normalizzate
 * nella tabella SEEDS qui sotto (x,y in 0..1 rispetto all'immagine).
 *
 * NB: la pipeline è euristica (tolleranza colore + componente connessa);
 * per regioni con molto testo/icone interne usa il contorno ESTERNO, quindi
 * i buchi interni vengono ignorati (corretto per i confini).
 */
import { readFileSync, existsSync } from 'node:fs';
import { PNG } from 'pngjs';

const MAP_PATH =
  'public/assets/worlds/naruto/maps/naruto_world_reference_expanded.png';

const VIEWBOX_W = 1500;
const VIEWBOX_H = 882.2204;

/** Seed per nazione: punto interno in coord normalizzate (0..1). */
const SEEDS: { slug: string; x: number; y: number; tol?: number }[] = [
  { slug: 'fire', x: 0.54, y: 0.66 },
  { slug: 'wind', x: 0.16, y: 0.72 },
  { slug: 'earth', x: 0.14, y: 0.24 },
  { slug: 'lightning', x: 0.79, y: 0.24 },
  { slug: 'water', x: 0.82, y: 0.63 },
  { slug: 'frost', x: 0.556, y: 0.4 },
  { slug: 'sound', x: 0.452, y: 0.45 },
  // minori: aggiungi/aggiusta seed se servono
  { slug: 'rain', x: 0.385, y: 0.31 },
  { slug: 'grass', x: 0.34, y: 0.46 },
];

const DEFAULT_TOLERANCE = 42; // distanza colore (0..441) per region growing
const SIMPLIFY_EPSILON = 5; // px Douglas–Peucker

function colorDist(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number,
): number {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function growRegion(
  png: PNG,
  seedX: number,
  seedY: number,
  tol: number,
): { mask: Uint8Array; w: number; h: number } {
  const { width: w, height: h, data } = png;
  const idx = (x: number, y: number) => (y * w + x) * 4;
  const sIdx = idx(seedX, seedY);
  const sr = data[sIdx], sg = data[sIdx + 1], sb = data[sIdx + 2];
  const mask = new Uint8Array(w * h);
  const stack: number[] = [seedY * w + seedX];
  mask[seedY * w + seedX] = 1;
  while (stack.length) {
    const p = stack.pop()!;
    const x = p % w;
    const y = (p / w) | 0;
    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const np = ny * w + nx;
      if (mask[np]) continue;
      const ni = np * 4;
      if (colorDist(sr, sg, sb, data[ni], data[ni + 1], data[ni + 2]) <= tol) {
        mask[np] = 1;
        stack.push(np);
      }
    }
  }
  return { mask, w, h };
}

/** Moore-neighbor tracing del contorno esterno della maschera. */
function traceContour(mask: Uint8Array, w: number, h: number): [number, number][] {
  const at = (x: number, y: number) =>
    x < 0 || y < 0 || x >= w || y >= h ? 0 : mask[y * w + x];
  // trova primo pixel della maschera (top-left)
  let start = -1;
  for (let i = 0; i < mask.length; i++) {
    if (mask[i]) { start = i; break; }
  }
  if (start < 0) return [];
  const sx = start % w, sy = (start / w) | 0;
  const contour: [number, number][] = [];
  // 8-direzioni in senso orario
  const dirs = [
    [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1],
  ];
  let cx = sx, cy = sy;
  let dir = 6; // partenza
  const maxSteps = w * h * 4;
  let steps = 0;
  do {
    contour.push([cx, cy]);
    let found = false;
    for (let k = 0; k < 8; k++) {
      const nd = (dir + 6 + k) % 8; // gira a sinistra poi orario
      const nx = cx + dirs[nd][0];
      const ny = cy + dirs[nd][1];
      if (at(nx, ny)) {
        cx = nx; cy = ny; dir = nd; found = true; break;
      }
    }
    if (!found) break;
    steps++;
  } while ((cx !== sx || cy !== sy) && steps < maxSteps);
  return contour;
}

/** Douglas–Peucker. */
function simplify(points: [number, number][], eps: number): [number, number][] {
  if (points.length < 3) return points;
  const sqEps = eps * eps;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack: [number, number][] = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    let maxD = 0, idx = -1;
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    for (let i = a + 1; i < b; i++) {
      const [px, py] = points[i];
      const dx = bx - ax, dy = by - ay;
      const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1);
      const projx = ax + t * dx, projy = ay + t * dy;
      const d = (px - projx) ** 2 + (py - projy) ** 2;
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > sqEps && idx > 0) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

function toPath(points: [number, number][], w: number, h: number): string {
  if (points.length < 3) return '';
  const sx = VIEWBOX_W / w;
  const sy = VIEWBOX_H / h;
  const coords = points.map(
    ([x, y]) => `${(x * sx).toFixed(0)} ${(y * sy).toFixed(0)}`,
  );
  return 'M ' + coords.join(' L ') + ' Z';
}

function main() {
  if (!existsSync(MAP_PATH)) {
    // eslint-disable-next-line no-console
    console.error(
      `\n[extract:boundaries] PNG non trovato: ${MAP_PATH}\n` +
        `Copia la world map nel percorso indicato e riprova.\n`,
    );
    process.exit(1);
  }
  const png = PNG.sync.read(readFileSync(MAP_PATH));
  const { width: w, height: h } = png;
  // eslint-disable-next-line no-console
  console.log(`PNG ${w}x${h} → viewBox ${VIEWBOX_W}x${VIEWBOX_H}\n`);

  for (const seed of SEEDS) {
    const px = Math.min(w - 1, Math.round(seed.x * w));
    const py = Math.min(h - 1, Math.round(seed.y * h));
    const { mask } = growRegion(png, px, py, seed.tol ?? DEFAULT_TOLERANCE);
    const count = mask.reduce((a, b) => a + b, 0);
    const contour = traceContour(mask, w, h);
    const simplified = simplify(contour, SIMPLIFY_EPSILON);
    const d = toPath(simplified, w, h);
    // eslint-disable-next-line no-console
    console.log(
      `/* ${seed.slug} · seed(${px},${py}) · ${count}px · ${simplified.length} pts */`,
    );
    // eslint-disable-next-line no-console
    console.log(`'${d}',\n`);
  }

  // eslint-disable-next-line no-console
  console.log(
    'Incolla ogni svgPathD nel boundary corrispondente in src/data/naruto/boundaries.ts.',
  );
}

main();
