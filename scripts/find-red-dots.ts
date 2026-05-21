/**
 * Trova i "puntini rossi" (marker dei villaggi/città) nel PNG della world map
 * e ne stampa il centro in coordinate flow (viewBox 1500 x 882.2204).
 *
 * USO:  npm run find:dots
 *
 * Distingue i pallini rossi SATURI dal riempimento rosa/salmone del Paese
 * del Fuoco richiedendo R alto e G/B bassi.
 */
import { readFileSync, existsSync } from 'node:fs';
import { PNG } from 'pngjs';

const MAP_PATH =
  'public/assets/worlds/naruto/maps/naruto_world_reference_expanded.png';
const VIEWBOX_W = 1500;
const VIEWBOX_H = 882.2204;

function isDotRed(r: number, g: number, b: number): boolean {
  // I pallini sono rossi/salmone molto saturi. Il riempimento rosa del Paese
  // del Fuoco e' rgb(209,143,143) -> R-G=66; i pallini hanno R-G>=122.
  // Soglia 90 (relativa) li separa includendo anche i pallini piu' aranciati
  // (es. Kumo rgb(235,113,70)), che la vecchia soglia g<=95 scartava.
  return r >= 150 && r - g >= 90 && r - b >= 90;
}

function main() {
  if (!existsSync(MAP_PATH)) {
    console.error(`PNG non trovato: ${MAP_PATH}`);
    process.exit(1);
  }
  const png = PNG.sync.read(readFileSync(MAP_PATH));
  const { width: w, height: h, data } = png;
  const seen = new Uint8Array(w * h);
  const dots: { cx: number; cy: number; area: number }[] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (seen[p]) continue;
      const i = p * 4;
      if (!isDotRed(data[i], data[i + 1], data[i + 2])) {
        seen[p] = 1;
        continue;
      }
      // BFS cluster
      let sx = 0, sy = 0, area = 0;
      const stack = [p];
      seen[p] = 1;
      while (stack.length) {
        const q = stack.pop()!;
        const qx = q % w, qy = (q / w) | 0;
        sx += qx; sy += qy; area++;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          const nx = qx + dx, ny = qy + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const np = ny * w + nx;
          if (seen[np]) continue;
          const ni = np * 4;
          if (isDotRed(data[ni], data[ni + 1], data[ni + 2])) {
            seen[np] = 1;
            stack.push(np);
          } else {
            seen[np] = 1;
          }
        }
      }
      if (area >= 8 && area <= 600) {
        dots.push({ cx: sx / area, cy: sy / area, area });
      }
    }
  }

  dots.sort((a, b) => a.cy - b.cy || a.cx - b.cx);
  console.log(`PNG ${w}x${h} · ${dots.length} pallini rossi trovati\n`);
  console.log('flowX  flowY   areaPx   (px)');
  for (const d of dots) {
    const fx = (d.cx / w) * VIEWBOX_W;
    const fy = (d.cy / h) * VIEWBOX_H;
    console.log(
      `${fx.toFixed(0).padStart(5)}  ${fy.toFixed(0).padStart(5)}   ${String(d.area).padStart(4)}     (${d.cx.toFixed(0)},${d.cy.toFixed(0)})`,
    );
  }
}

main();
