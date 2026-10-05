/**
 * `npm run validate:i18n`
 *
 * Stampa il report del validatore i18n + la copertura traduzioni dei dataset.
 * Exit 0 se nessun errore (warning ignorati).
 *
 * Il validatore delle chiavi UI è bloccante: tutte e sei le lingue devono avere
 * le stesse chiavi. La copertura ja/fr/de/es dei dataset è invece informativa:
 * quelle lingue ricadono sull'inglese finché non sono tradotte.
 *
 * Anche i CONTENUTI dei dataset sono bloccanti: ogni campo narrativo
 * (schema in src/utils/localizableFields.ts) deve esistere in IT e in EN, per
 * TUTTI i mondi registrati. `--strict` rende bloccanti anche i warning
 * euristici (testo EN che sembra italiano e simili).
 */
import { animeWorlds } from '../src/data/worlds';
import { hasWorldDataset, loadWorldDatasetWithTranslations, worldTranslationLocales } from '../src/data/registry';
import { getLocalizedText } from '../src/utils/localization';
import { validateUiKeys, validateDatasetI18n, datasetCoverage } from '../src/utils/validateI18n';
import { SUPPORTED_LOCALES, type SupportedLocale } from '../src/types/i18n';
import type { WorldDataset } from '../src/types';

const strict = process.argv.includes('--strict');

// Tutti i mondi REGISTRATI (data-driven: un mondo nuovo è validato da solo).
const datasets: Array<[string, WorldDataset]> = [];
for (const w of animeWorlds) {
  if (w.status !== 'available' || !hasWorldDataset(w.slug)) continue;
  const d = await loadWorldDatasetWithTranslations(w.slug); // con gli overlay (es)
  if (d) datasets.push([getLocalizedText(w.title, 'en'), d]);
}

const lines: string[] = [];
let blocking = 0;
lines.push('=== AniMapVerse · i18n validator ===');
lines.push(`Mode: ${strict ? 'strict (anche i warning euristici bloccano)' : 'default'}`);
lines.push('');

const ui = validateUiKeys();
blocking += ui.errors.length;
lines.push('--- Chiavi UI (bloccante: tutte le lingue allineate) ---');
lines.push(`Errors  : ${ui.errors.length}`);
for (const e of ui.errors) lines.push(`[ERR ] ${e.code} · ${e.message}`);
lines.push('');

lines.push('--- Contenuti dei dataset (bloccante: ogni testo narrativo in IT **e** EN) ---');
for (const [label, ds] of datasets) {
  const r = validateDatasetI18n(ds);
  blocking += r.errors.length + (strict ? r.warnings.length : 0);
  lines.push(`${label.padEnd(18)} errors ${String(r.errors.length).padStart(4)} · warnings ${String(r.warnings.length).padStart(3)}`);
  for (const e of r.errors.slice(0, 40)) lines.push(`  [ERR ] ${e.code} · ${e.message}`);
  if (r.errors.length > 40) lines.push(`  … altri ${r.errors.length - 40} errori`);
  for (const w of r.warnings.slice(0, 15)) lines.push(`  [WARN] ${w.code} · ${w.message}`);
  if (r.warnings.length > 15) lines.push(`  … altri ${r.warnings.length - 15} warning`);
}
lines.push('');
// Lingue pubblicate con URL propri (es): il mondo deve avere l'overlay registrato.
lines.push('--- Lingue aggiuntive pubblicate (bloccante: overlay registrato) ---');
for (const w of animeWorlds) {
  for (const l of w.translatedLocales ?? []) {
    const ok = worldTranslationLocales(w.slug).includes(l);
    if (!ok) blocking++;
    lines.push(`${ok ? '[ OK ]' : '[ERR ]'} ${w.slug} · ${l}${ok ? '' : ` · manca src/data/${w.slug}/i18n/${l}.ts in worldTranslationLoaders (src/data/registry.ts)`}`);
  }
}
lines.push('Stato dettagliato (mancanti, obsolete, orfane): npm run i18n:status');
lines.push('');
lines.push('Nuovo contenuto? Ogni campo narrativo va scritto come { it: "…", en: "…" }');
lines.push('(schema: src/utils/localizableFields.ts). Una stringa semplice = solo italiano.');
lines.push('');

/* -------- Copertura traduzioni dei dataset (informativa) -------- */

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

process.exit(blocking > 0 ? 1 : 0);
