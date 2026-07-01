/**
 * Script CLI per `npm run validate:data`.
 *
 * Stampa report leggibile dei problemi rilevati nel dataset Naruto.
 * Exit code:
 *  - 0 → nessun errore (eventuali warning sono solo informativi)
 *  - 1 → almeno un errore di integrità
 */
import type { WorldDataset } from '../src/types';
import { narutoDataset } from '../src/data/naruto';
import { hunterxhunterDataset } from '../src/data/hunterxhunter';
import { onepieceDataset } from '../src/data/onepiece';
import { dragonballDataset } from '../src/data/dragonball';
import { validateDataset } from '../src/utils/validateDataset';

const datasets: WorldDataset[] = [narutoDataset, hunterxhunterDataset, onepieceDataset, dragonballDataset];

const lines: string[] = [];
lines.push('=== Anime Interactive Maps · dataset validator ===');

let anyErrors = false;

for (const dataset of datasets) {
  const report = validateDataset(dataset);
  anyErrors = anyErrors || report.hasErrors;

  lines.push('');
  lines.push(`World: ${dataset.world.title} (${dataset.world.slug})`);
  lines.push('');
  lines.push(`Characters: ${dataset.characters.length}`);
  lines.push(`Factions  : ${dataset.factions.length}`);
  lines.push(`Teams     : ${dataset.teams?.length ?? 0}`);
  lines.push(`Arcs      : ${dataset.arcs.length}`);
  lines.push(`Events    : ${dataset.events.length}`);
  lines.push(`Routes    : ${dataset.routes.length}`);
  lines.push(`Locations : ${dataset.locations.length}`);
  lines.push(`Nations   : ${dataset.nations.length}`);
  lines.push(`Boundaries: ${dataset.boundaries?.length ?? 0}`);
  lines.push(`Jutsu     : ${dataset.jutsu?.length ?? 0}`);
  lines.push('');
  lines.push(`Errors  : ${report.errors.length}`);
  lines.push(`Warnings: ${report.warnings.length}`);

  if (report.errors.length > 0) {
    lines.push('--- ERRORS ---');
    for (const e of report.errors) {
      lines.push(`[ERR ] ${e.entity}/${e.id ?? '?'} · ${e.code} · ${e.message}`);
    }
  }

  if (report.warnings.length > 0) {
    lines.push('--- WARNINGS ---');
    for (const w of report.warnings) {
      lines.push(`[WARN] ${w.entity}/${w.id ?? '?'} · ${w.code} · ${w.message}`);
    }
  }
  lines.push('────────────────────────────────────────');
}

// eslint-disable-next-line no-console
console.log(lines.join('\n'));

process.exit(anyErrors ? 1 : 0);
