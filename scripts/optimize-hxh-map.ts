/**
 * Tool una-tantum: ottimizza il PNG della world map HxH.
 *
 * L'originale fornito è 5921×3513 (~13.6 MB), troppo pesante per il web.
 * Lo riduce a 2560px di larghezza con downscale box-average (buona qualità)
 * e lo ri-comprime al massimo. Il viewBox della mappa è indipendente dalla
 * risoluzione del file, quindi i pin restano allineati.
 *
 * Uso: npx tsx --tsconfig scripts/tsconfig.json scripts/optimize-hxh-map.ts
 */
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { PNG } from 'pngjs';

const SRC = 'public/assets/worlds/hunterxhunter/maps/hxh-world-map.png';
const TARGET_W = 2560;

const src = PNG.sync.read(readFileSync(SRC));
const { width: W, height: H } = src;
const OW = Math.min(TARGET_W, W);
const OH = Math.round((H * OW) / W);

const out = new PNG({ width: OW, height: OH });

// Downscale con media di blocco (box filter).
for (let oy = 0; oy < OH; oy++) {
  const sy0 = Math.floor((oy * H) / OH);
  const sy1 = Math.max(sy0 + 1, Math.floor(((oy + 1) * H) / OH));
  for (let ox = 0; ox < OW; ox++) {
    const sx0 = Math.floor((ox * W) / OW);
    const sx1 = Math.max(sx0 + 1, Math.floor(((ox + 1) * W) / OW));
    let r = 0, g = 0, b = 0, n = 0;
    for (let sy = sy0; sy < sy1; sy++) {
      for (let sx = sx0; sx < sx1; sx++) {
        const si = (sy * W + sx) * 4;
        r += src.data[si];
        g += src.data[si + 1];
        b += src.data[si + 2];
        n++;
      }
    }
    const di = (oy * OW + ox) * 4;
    out.data[di] = Math.round(r / n);
    out.data[di + 1] = Math.round(g / n);
    out.data[di + 2] = Math.round(b / n);
    out.data[di + 3] = 255;
  }
}

const buf = PNG.sync.write(out, {
  deflateLevel: 9,
  deflateStrategy: 3,
  filterType: 4,
  colorType: 2, // RGB: la mappa non ha trasparenza, l'alpha è inutile
});
writeFileSync(SRC, buf);

const kb = (n: number) => `${(n / 1024).toFixed(0)} KB`;
// eslint-disable-next-line no-console
console.log(`${W}x${H} -> ${OW}x${OH} · ${kb(buf.length)} (era ${kb(statSync(SRC).size)})`);
