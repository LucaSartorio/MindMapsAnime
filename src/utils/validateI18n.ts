/**
 * Validatore traduzioni i18n.
 *
 * Controlla:
 *  - chiavi missing fra TUTTE le lingue UI (it, en, ja, fr, de, es), usando
 *    l'italiano (locale di default) come riferimento (`validateUiKeys`);
 *  - per OGNI dataset, tutti i campi `Localizable` dichiarati nello schema
 *    `src/utils/localizableFields.ts` (`validateDatasetI18n`): testo solo
 *    italiano, `it`/`en` mancanti o vuoti.
 *
 * I dataset sono scritti nelle sole `SOURCE_LOCALES` (it/en): le altre lingue
 * traducono l'interfaccia e ricadono su queste tramite `LOCALE_FALLBACKS`,
 * quindi NON vengono richieste sui campi `Localizable`.
 *
 * Output: report con errors/warnings + lista entità/campi mancanti.
 */

import type { WorldDataset } from '@/types';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from '@/types/i18n';
import { auditLocalizable } from '@/utils/localizableFields';
import { it as itResources } from '@/i18n/resources/it';
import { en as enResources } from '@/i18n/resources/en';
import { ja as jaResources } from '@/i18n/resources/ja';
import { fr as frResources } from '@/i18n/resources/fr';
import { de as deResources } from '@/i18n/resources/de';
import { es as esResources } from '@/i18n/resources/es';

/** Risorse UI per lingua: la sorgente di verità del confronto chiavi. */
const UI_RESOURCES: Record<SupportedLocale, unknown> = {
  it: itResources,
  en: enResources,
  ja: jaResources,
  fr: frResources,
  de: deResources,
  es: esResources,
};

export type I18nSeverity = 'error' | 'warning';

export interface I18nIssue {
  severity: I18nSeverity;
  code: string;
  message: string;
}

export interface I18nReport {
  issues: I18nIssue[];
  errors: I18nIssue[];
  warnings: I18nIssue[];
  hasErrors: boolean;
  hasWarnings: boolean;
}

function addIssue(
  list: I18nIssue[],
  severity: I18nSeverity,
  code: string,
  message: string,
) {
  list.push({ severity, code, message });
}

/* -------- Diff delle chiavi UI -------- */

function collectKeys(obj: unknown, prefix: string, into: Set<string>): void {
  if (obj === null || obj === undefined) return;
  if (typeof obj === 'string') {
    into.add(prefix);
    return;
  }
  if (Array.isArray(obj)) {
    into.add(prefix);
    return;
  }
  if (typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      collectKeys(v, prefix ? `${prefix}.${k}` : k, into);
    }
  }
}

/* -------- Validatore -------- */

/**
 * Chiavi UI: tutte le lingue supportate devono avere le STESSE chiavi del
 * riferimento (locale di default), né una in meno né una in più. Bloccante.
 */
export function validateUiKeys(): I18nReport {
  const issues: I18nIssue[] = [];
  const keysByLocale = new Map<SupportedLocale, Set<string>>();
  for (const loc of SUPPORTED_LOCALES) {
    const keys = new Set<string>();
    collectKeys(UI_RESOURCES[loc], '', keys);
    keysByLocale.set(loc, keys);
  }
  const referenceKeys = keysByLocale.get(DEFAULT_LOCALE)!;

  for (const loc of SUPPORTED_LOCALES) {
    if (loc === DEFAULT_LOCALE) continue;
    const keys = keysByLocale.get(loc)!;
    const upper = loc.toUpperCase();
    for (const k of referenceKeys) {
      if (!keys.has(k)) {
        addIssue(issues, 'error', `ui_missing_${loc}`, `UI key missing in ${upper}: ${k}`);
      }
    }
    for (const k of keys) {
      if (!referenceKeys.has(k)) {
        addIssue(
          issues,
          'error',
          `ui_missing_${DEFAULT_LOCALE}`,
          `UI key missing in ${DEFAULT_LOCALE.toUpperCase()} (present in ${upper}): ${k}`,
        );
      }
    }
  }
  return toReport(issues);
}

/**
 * Contenuti di un dataset: TUTTI i campi `Localizable` secondo lo schema in
 * `src/utils/localizableFields.ts`. Errori (bloccanti): testo narrativo come
 * stringa semplice (= solo italiano), `it`/`en` mancanti o vuoti, campi
 * obbligatori assenti. Warning: euristiche di lingua (EN che sembra italiano,
 * IT che sembra inglese, nome italiano senza `localizedName`).
 */
export function validateDatasetI18n(dataset: WorldDataset): I18nReport {
  const issues: I18nIssue[] = [];
  for (const i of auditLocalizable(dataset)) {
    const value = i.value.length > 90 ? `${i.value.slice(0, 90)}…` : i.value;
    addIssue(issues, i.severity, i.code, `${i.world}/${i.kind}/${i.id} · ${i.field}${value ? ` · "${value}"` : ''}`);
  }
  return toReport(issues);
}

function toReport(issues: I18nIssue[]): I18nReport {
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  return { issues, errors, warnings, hasErrors: errors.length > 0, hasWarnings: warnings.length > 0 };
}

/* -------- Copertura traduzioni dei dataset -------- */

/**
 * Quante stringhe `Localizable` sono tradotte, per lingua e per tipo di entità.
 *
 * Serve a rispondere alla domanda "manca qualcosa?" con un numero invece che a
 * occhio: i dataset sono scritti in IT/EN e le altre lingue si aggiungono nel
 * tempo, quindi la copertura è una percentuale che cresce, non un errore.
 */
export interface CoverageRow {
  kind: string;
  /** Entità nel gruppo (personaggi, luoghi, …). */
  entities: number;
  /** Campi `Localizable` trovati nel gruppo. */
  fields: number;
  /** Campi con una traduzione non vuota, per lingua. */
  translated: Record<SupportedLocale, number>;
}

export interface DatasetCoverage {
  world: string;
  rows: CoverageRow[];
  total: CoverageRow;
  /** Entità con un nome proprio (personaggi, luoghi, fazioni, …). */
  namedEntities: number;
  /**
   * Di quelle, quante espongono un `japaneseName`. Non è un campo
   * `Localizable`, quindi non compare nelle percentuali qui sopra, ma è il
   * nome che un utente giapponese vede davvero: `getEntityDisplayName` lo
   * usa come traduzione `ja` del nome.
   */
  japaneseNamed: number;
}

function emptyRow(kind: string): CoverageRow {
  const translated = {} as Record<SupportedLocale, number>;
  for (const loc of SUPPORTED_LOCALES) translated[loc] = 0;
  return { kind, entities: 0, fields: 0, translated };
}

/** Vero se l'oggetto è un `Localizable` (solo chiavi lingua, valori stringa). */
function looksLocalizable(value: object): boolean {
  const entries = Object.entries(value);
  if (entries.length === 0) return false;
  if (!SUPPORTED_LOCALES.some((l) => l in value)) return false;
  return entries.every(([, v]) => typeof v === 'string' || v === undefined);
}

/** Accumula in `row` tutti i `Localizable` raggiungibili da `node`. */
function collectCoverage(node: unknown, row: CoverageRow): void {
  if (node === null || node === undefined || typeof node === 'string') return;
  if (Array.isArray(node)) {
    for (const item of node) collectCoverage(item, row);
    return;
  }
  if (typeof node !== 'object') return;

  if (looksLocalizable(node)) {
    row.fields++;
    const map = node as Partial<Record<SupportedLocale, string>>;
    for (const loc of SUPPORTED_LOCALES) {
      const v = map[loc];
      if (v && v.trim() !== '') row.translated[loc]++;
    }
    return;
  }
  for (const v of Object.values(node)) collectCoverage(v, row);
}

export function datasetCoverage(
  dataset: WorldDataset,
  worldLabel: string,
): DatasetCoverage {
  const groups: Array<[string, unknown[]]> = [
    ['characters', dataset.characters],
    ['locations', dataset.locations],
    ['events', dataset.events],
    ['arcs', dataset.arcs],
    ['factions', dataset.factions],
    ['abilities', dataset.jutsu ?? []],
    ['routes', dataset.routes],
    ['nations', dataset.nations],
    ['boundaries', dataset.boundaries ?? []],
    ['teams', dataset.teams ?? []],
    ['mapLevels', dataset.mapLevels],
    ['assets', dataset.assets ?? []],
  ];

  const rows: CoverageRow[] = [];
  const total = emptyRow('TOTALE');

  for (const [kind, arr] of groups) {
    if (arr.length === 0) continue;
    const row = emptyRow(kind);
    row.entities = arr.length;
    collectCoverage(arr, row);
    if (row.fields === 0) continue;
    rows.push(row);
    total.entities += row.entities;
    total.fields += row.fields;
    for (const loc of SUPPORTED_LOCALES) total.translated[loc] += row.translated[loc];
  }

  // Metadati del mondo (titolo, sottotitolo, descrizione, config/tag).
  const worldRow = emptyRow('world + config');
  worldRow.entities = 1;
  collectCoverage(dataset.world, worldRow);
  if (worldRow.fields > 0) {
    rows.push(worldRow);
    total.entities += 1;
    total.fields += worldRow.fields;
    for (const loc of SUPPORTED_LOCALES) total.translated[loc] += worldRow.translated[loc];
  }

  // Nomi giapponesi già presenti nei dataset (vedi `getEntityDisplayName`).
  // `japaneseName` non esiste su tutte le entità (Location non ce l'ha):
  // leggiamolo in modo strutturale invece di allargare i tipi di dominio.
  const named: Array<Record<string, unknown>> = [
    ...dataset.characters,
    ...dataset.locations,
    ...dataset.factions,
    ...dataset.nations,
    ...(dataset.jutsu ?? []),
    ...(dataset.boundaries ?? []),
  ] as unknown as Array<Record<string, unknown>>;
  const japaneseNamed = named.filter((e) => {
    const jp = e.japaneseName;
    return typeof jp === 'string' && jp.trim() !== '';
  }).length;

  return {
    world: worldLabel,
    rows,
    total,
    namedEntities: named.length,
    japaneseNamed,
  };
}
