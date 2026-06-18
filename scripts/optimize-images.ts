/**
 * Ottimizzazione delle immagini di mappa (one-off, riproducibile).
 *
 * Converte in WebP le mappe raster pesanti servite da `public/assets/worlds`.
 * Le coordinate dei pin, dei boundary e delle label sono espresse sul piano
 * viewBox del `MapLevel` (indipendente dai pixel dell'immagine), quindi la
 * ri-codifica/ridimensionamento NON sposta nulla sulla mappa.
 *
 * WebP è supportato da tutti i browser moderni (Safari 14+, ~97% del traffico).
 * Per massimizzare il risparmio di banda serviamo direttamente WebP, senza
 * fallback: lo sfondo mappa ha comunque un placeholder SVG via `onError`.
 *
 * Uso:  npm run optimize:images
 * Dopo la conversione i file originali (.png/.jpg/.jpeg) vengono rimossi e i
 * riferimenti nei dataset puntano ai nuovi `.webp`.
 */
import { readdir, stat, unlink } from 'node:fs/promises';
import { join, extname, basename, dirname } from 'node:path';
import sharp from 'sharp';

// Due radici:
//  - public/assets/worlds: mappe servite staticamente (i riferimenti .png/.jpg
//    nei dataset vanno aggiornati a .webp a mano dopo la conversione).
//  - src/assets/worlds: immagini "drop-in" di personaggi/luoghi/logo, scoperte
//    a build time dal glob in src/utils/entityImage.ts (che già include .webp),
//    quindi nessun riferimento da aggiornare.
const ROOTS = [
  join(process.cwd(), 'public', 'assets', 'worlds'),
  join(process.cwd(), 'src', 'assets', 'worlds'),
];
const RASTER = new Set(['.png', '.jpg', '.jpeg']);
const QUALITY = 80;
// Oltre questa larghezza non serve più dettaglio per lo zoom: si ridimensiona.
const MAX_WIDTH = 4096;

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => {
      const full = join(dir, e.name);
      return e.isDirectory() ? walk(full) : Promise.resolve([full]);
    }),
  );
  return files.flat();
}

function kb(bytes: number): string {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

async function main() {
  const all = (await Promise.all(ROOTS.map((r) => walk(r)))).flat();
  const targets = all.filter((f) => RASTER.has(extname(f).toLowerCase()));

  if (targets.length === 0) {
    console.log('Nessuna immagine raster da ottimizzare.');
    return;
  }

  let savedTotal = 0;
  for (const src of targets) {
    const before = (await stat(src)).size;
    const out = join(dirname(src), `${basename(src, extname(src))}.webp`);

    const img = sharp(src);
    const meta = await img.metadata();
    if (meta.width && meta.width > MAX_WIDTH) {
      img.resize({ width: MAX_WIDTH });
    }
    await img.webp({ quality: QUALITY, effort: 6 }).toFile(out);

    const after = (await stat(out)).size;
    // Alcuni PNG/JPEG sono già molto compressi: se il WebP non è più leggero,
    // scartalo e tieni l'originale (evita regressioni di peso).
    if (after >= before) {
      await unlink(out);
      console.log(
        `– ${basename(src)}  ${kb(before)}  (WebP più grande: originale mantenuto)`,
      );
      continue;
    }

    savedTotal += before - after;
    await unlink(src);
    console.log(
      `✓ ${basename(src)}  ${kb(before)} → ${basename(out)}  ${kb(after)}  (-${(((before - after) / before) * 100).toFixed(0)}%)`,
    );
  }
  console.log(`\nRisparmio totale: ${kb(savedTotal)}`);
  console.log(
    'Ricorda di aggiornare i riferimenti .png/.jpg/.jpeg → .webp nei dataset.',
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
