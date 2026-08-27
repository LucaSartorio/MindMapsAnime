/**
 * `npm run validate:i18n`
 *
 * Stampa il report del validatore i18n + la copertura traduzioni dei dataset.
 * Exit 0 se nessun errore (warning ignorati).
 *
 * Il validatore delle chiavi UI è bloccante: tutte e sei le lingue devono avere
 * le stesse chiavi. La copertura dei DATASET è invece informativa — i contenuti
 * narrativi sono scritti in IT/EN e le altre lingue si aggiungono nel tempo,
 * ricadendo su inglese finché non sono tradotte.
 *
 * Per evitare di sommergere il report di "mono_locale" su dataset ancora
 * in fase di traduzione, di default ignoriamo questo warning. Si può
 * abilitare con --strict.
 */
import { narutoDataset } from '../src/data/naruto';
import { hunterxhunterDataset } from '../src/data/hunterxhunter';
import { onepieceDataset } from '../src/data/onepiece';
import { dragonballDataset } from '../src/data/dragonball';
import { blackcloverDataset } from '../src/data/blackclover';
import { validateI18n, datasetCoverage } from '../src/utils/validateI18n';
import { SUPPORTED_LOCALES, type SupportedLocale } from '../src/types/i18n';
import type { WorldDataset } from '../src/types';

const strict = process.argv.includes('--strict');

const report = validateI18n(narutoDataset, {
  ignoreMonoLocale: !strict,
});

const lines: string[] = [];
lines.push('=== Anime Interactive Maps · i18n validator ===');
lines.push(`Mode: ${strict ? 'strict' : 'lenient (mono_locale warnings ignored)'}`);
lines.push('');
lines.push('--- Chiavi UI (bloccante: tutte le lingue allineate) ---');
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
  lines.push('');
}

/* -------- Copertura traduzioni dei dataset (informativa) -------- */

const datasets: Array<[string, WorldDataset]> = [
  ['Naruto', narutoDataset],
  ['Hunter x Hunter', hunterxhunterDataset],
  ['One Piece', onepieceDataset],
  ['Dragon Ball', dragonballDataset],
  ['Black Clover', blackcloverDataset],
];

const pct = (n: number, tot: number) =>
  tot === 0 ? '  —  ' : `${((n / tot) * 100).toFixed(0).padStart(3)}%`;

lines.push('--- Copertura traduzioni dei dataset (informativa) ---');
lines.push(
  'I contenuti narrativi sono scritti in IT/EN; le lingue non tradotte',
);
lines.push('ricadono automaticamente su inglese (LOCALE_FALLBACKS).');
lines.push('');

const header = ['kind'.padEnd(16), 'campi'.padStart(6)]
  .concat(SUPPORTED_LOCALES.map((l) => l.toUpperCase().padStart(5)))
  .join(' ');

const grand = {
  fields: 0,
  translated: Object.fromEntries(
    SUPPORTED_LOCALES.map((l) => [l, 0]),
  ) as Record<SupportedLocale, number>,
};

for (const [label, ds] of datasets) {
  const cov = datasetCoverage(ds, label);
  lines.push(`## ${label}`);
  lines.push(header);
  lines.push('-'.repeat(header.length));
  for (const row of cov.rows) {
    lines.push(
      [row.kind.padEnd(16), String(row.fields).padStart(6)]
        .concat(
          SUPPORTED_LOCALES.map((l) => pct(row.translated[l], row.fields)),
        )
        .join(' '),
    );
  }
  lines.push(
    ['TOTALE'.padEnd(16), String(cov.total.fields).padStart(6)]
      .concat(
        SUPPORTED_LOCALES.map((l) =>
          pct(cov.total.translated[l], cov.total.fields),
        ),
      )
      .join(' '),
  );
  lines.push(
    `  nomi giapponesi nei dati (japaneseName): ${cov.japaneseNamed}/${cov.namedEntities} entità`,
  );
  lines.push('');
  grand.fields += cov.total.fields;
  for (const l of SUPPORTED_LOCALES) grand.translated[l] += cov.total.translated[l];
}

lines.push('## Tutti i mondi');
lines.push(
  ['TOTALE'.padEnd(16), String(grand.fields).padStart(6)]
    .concat(
      SUPPORTED_LOCALES.map((l) => pct(grand.translated[l], grand.fields)),
    )
    .join(' '),
);
for (const l of SUPPORTED_LOCALES) {
  const missing = grand.fields - grand.translated[l];
  if (missing > 0) {
    lines.push(`  ${l.toUpperCase()}: ${missing} campi ancora da tradurre`);
  }
}

// eslint-disable-next-line no-console
console.log(lines.join('\n'));

process.exit(report.hasErrors ? 1 : 0);
