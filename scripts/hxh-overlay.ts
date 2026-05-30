/**
 * Tool una-tantum di verifica: disegna i pin dei luoghi e i poligoni dei
 * boundary HxH sopra una copia ridotta della world map, per controllare a
 * occhio l'allineamento con le etichette del PNG.
 *
 * Uso: npx tsx --tsconfig scripts/tsconfig.json scripts/hxh-overlay.ts
 * Output: /tmp/hxh-overlay.png
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import { hxhLocations } from '../src/data/hunterxhunter/locations';
import { hxhBoundaries } from '../src/data/hunterxhunter/boundaries';
import { HXH_MAP_VIEWBOX } from '../src/data/hunterxhunter/mapLevels';

const SRC = 'public/assets/worlds/hunterxhunter/maps/hxh-world-map.png';
const src = PNG.sync.read(readFileSync(SRC));
const W = src.width;
const H = src.height;
const OW = 2600;
const scale = OW / W;
const OH = Math.round(H * scale);

const out = new PNG({ width: OW, height: OH });
for (let oy = 0; oy < OH; oy++) {
  const sy = Math.floor(oy / scale);
  for (let ox = 0; ox < OW; ox++) {
    const sx = Math.floor(ox / scale);
    const si = (sy * W + sx) * 4;
    const di = (oy * OW + ox) * 4;
    out.data[di] = src.data[si];
    out.data[di + 1] = src.data[si + 1];
    out.data[di + 2] = src.data[si + 2];
    out.data[di + 3] = 255;
  }
}

const vbToPx = (x: number, y: number): [number, number] => [
  (x / HXH_MAP_VIEWBOX.width) * OW,
  (y / HXH_MAP_VIEWBOX.height) * OH,
];

function setPx(x: number, y: number, r: number, g: number, b: number) {
  if (x < 0 || y < 0 || x >= OW || y >= OH) return;
  const i = (y * OW + x) * 4;
  out.data[i] = r;
  out.data[i + 1] = g;
  out.data[i + 2] = b;
  out.data[i + 3] = 255;
}

function dot(px: number, py: number, rad: number, c: [number, number, number]) {
  for (let dy = -rad; dy <= rad; dy++)
    for (let dx = -rad; dx <= rad; dx++)
      if (dx * dx + dy * dy <= rad * rad)
        setPx(Math.round(px + dx), Math.round(py + dy), c[0], c[1], c[2]);
}

function line(x0: number, y0: number, x1: number, y1: number, c: [number, number, number]) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let t = 0; t <= steps; t++) {
    const x = x0 + ((x1 - x0) * t) / steps;
    const y = y0 + ((y1 - y0) * t) / steps;
    setPx(Math.round(x), Math.round(y), c[0], c[1], c[2]);
  }
}

// boundary polygons (rosso)
for (const b of hxhBoundaries) {
  const nums = (b.svgPathD.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  const pts: [number, number][] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push(vbToPx(nums[i], nums[i + 1]));
  for (let i = 0; i < pts.length; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[(i + 1) % pts.length];
    line(ax, ay, bx, by, [230, 40, 40]);
  }
  const [lx, ly] = vbToPx(b.labelPosition.x, b.labelPosition.y);
  dot(lx, ly, 4, [255, 120, 0]); // arancio = label boundary
}

// location pins (ciano)
for (const l of hxhLocations) {
  const [px, py] = vbToPx(l.x, l.y);
  dot(px, py, 5, [0, 200, 255]);
}

writeFileSync('/tmp/hxh-overlay.png', PNG.sync.write(out));

// crop regions of the overlay for detailed inspection
const cropBoxes: Record<string, [number, number, number, number]> = {
  nw: [0.27, 0.22, 0.47, 0.45],
  ysouth: [0.28, 0.5, 0.50, 0.84],
  azian: [0.54, 0.33, 0.74, 0.62],
};
for (const [name, [fx0, fy0, fx1, fy1]] of Object.entries(cropBoxes)) {
  const x0 = Math.floor(fx0 * OW);
  const y0 = Math.floor(fy0 * OH);
  const cw = Math.floor((fx1 - fx0) * OW);
  const ch = Math.floor((fy1 - fy0) * OH);
  const c = new PNG({ width: cw, height: ch });
  for (let y = 0; y < ch; y++)
    for (let x = 0; x < cw; x++) {
      const si = ((y0 + y) * OW + (x0 + x)) * 4;
      const di = (y * cw + x) * 4;
      c.data[di] = out.data[si];
      c.data[di + 1] = out.data[si + 1];
      c.data[di + 2] = out.data[si + 2];
      c.data[di + 3] = 255;
    }
  writeFileSync(`/tmp/hxh-ov-${name}.png`, PNG.sync.write(c));
}
// eslint-disable-next-line no-console
console.log(`overlay ${OW}x${OH} · ${hxhLocations.length} pin · ${hxhBoundaries.length} boundary`);
