/**
 * Script CLI per `npm run validate:data`.
 *
 * Stampa report leggibile dei problemi rilevati nel dataset Naruto.
 * Exit code:
 *  - 0 → nessun errore (eventuali warning sono solo informativi)
 *  - 1 → almeno un errore di integrità
 */
import { narutoDataset } from '../src/data/naruto';
import { validateDataset } from '../src/utils/validateDataset';

const report = validateDataset(narutoDataset);

const lines: string[] = [];
lines.push('=== Anime Interactive Maps · dataset validator ===');
lines.push(`World: ${narutoDataset.world.title} (${narutoDataset.world.slug})`);
lines.push('');
lines.push(`Characters: ${narutoDataset.characters.length}`);
lines.push(`Factions  : ${narutoDataset.factions.length}`);
lines.push(`Teams     : ${narutoDataset.teams?.length ?? 0}`);
lines.push(`Arcs      : ${narutoDataset.arcs.length}`);
lines.push(`Events    : ${narutoDataset.events.length}`);
lines.push(`Routes    : ${narutoDataset.routes.length}`);
lines.push(`Locations : ${narutoDataset.locations.length}`);
lines.push(`Nations   : ${narutoDataset.nations.length}`);
lines.push(`Boundaries: ${narutoDataset.boundaries?.length ?? 0}`);
lines.push('');
lines.push(`Errors  : ${report.errors.length}`);
lines.push(`Warnings: ${report.warnings.length}`);
lines.push('');

if (report.errors.length > 0) {
  lines.push('--- ERRORS ---');
  for (const e of report.errors) {
    lines.push(`[ERR ] ${e.entity}/${e.id ?? '?'} · ${e.code} · ${e.message}`);
  }
  lines.push('');
}

if (report.warnings.length > 0) {
  lines.push('--- WARNINGS ---');
  for (const w of report.warnings) {
    lines.push(`[WARN] ${w.entity}/${w.id ?? '?'} · ${w.code} · ${w.message}`);
  }
}

// eslint-disable-next-line no-console
console.log(lines.join('\n'));

process.exit(report.hasErrors ? 1 : 0);
