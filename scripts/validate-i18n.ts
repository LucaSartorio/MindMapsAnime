/**
 * `npm run validate:i18n`
 *
 * Stampa il report del validatore i18n.
 * Exit 0 se nessun errore (warning ignorati).
 *
 * Per evitare di sommergere il report di "mono_locale" su dataset ancora
 * in fase di traduzione, di default ignoriamo questo warning. Si può
 * abilitare con --strict.
 */
import { narutoDataset } from '../src/data/naruto';
import { validateI18n } from '../src/utils/validateI18n';

const strict = process.argv.includes('--strict');

const report = validateI18n(narutoDataset, {
  ignoreMonoLocale: !strict,
});

const lines: string[] = [];
lines.push('=== Anime Interactive Maps · i18n validator ===');
lines.push(`Mode: ${strict ? 'strict' : 'lenient (mono_locale warnings ignored)'}`);
lines.push('');
lines.push(`Errors  : ${report.errors.length}`);
lines.push(`Warnings: ${report.warnings.length}`);
lines.push('');

if (report.errors.length > 0) {
  lines.push('--- ERRORS ---');
  for (const e of report.errors) {
    lines.push(`[ERR ] ${e.code} · ${e.message}`);
  }
  lines.push('');
}

if (report.warnings.length > 0) {
  lines.push('--- WARNINGS (top 60) ---');
  for (const w of report.warnings.slice(0, 60)) {
    lines.push(`[WARN] ${w.code} · ${w.message}`);
  }
  if (report.warnings.length > 60) {
    lines.push(`... ${report.warnings.length - 60} more warnings`);
  }
}

// eslint-disable-next-line no-console
console.log(lines.join('\n'));

process.exit(report.hasErrors ? 1 : 0);
