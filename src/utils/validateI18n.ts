/**
 * Validatore traduzioni i18n.
 *
 * Controlla:
 *  - LocalizedText senza chiave `it` o `en`
 *  - LocalizedText con stringhe vuote
 *  - chiavi missing fra TUTTE le lingue UI (it, en, ja, fr, de, es), usando
 *    l'italiano (locale di default) come riferimento
 *  - campi del dataset Naruto privi di traduzione su lingua secondaria
 *
 * I dataset sono scritti nelle sole `SOURCE_LOCALES` (it/en): le altre lingue
 * traducono l'interfaccia e ricadono su queste tramite `LOCALE_FALLBACKS`,
 * quindi NON vengono richieste sui campi `Localizable`.
 *
 * Output: report con errors/warnings + lista entità/campi mancanti.
 */

import type { Localizable, WorldDataset } from '@/types';
import {
  DEFAULT_LOCALE,
  SOURCE_LOCALES,
  SUPPORTED_LOCALES,
  isLocalizedText,
  type SupportedLocale,
} from '@/types/i18n';
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

/* -------- Validazione LocalizedText -------- */

function checkLocalizable(
  value: Localizable | undefined,
  entity: string,
  field: string,
  out: I18nIssue[],
  required: boolean = false,
) {
  if (value === undefined || value === null) {
    if (required) {
      addIssue(
        out,
        'error',
        'missing_field',
        `${entity}.${field} mancante`,
      );
    }
    return;
  }
  if (typeof value === 'string') {
    // Singolo locale: warning per traduzione mancante nell'altra lingua
    if (!value.trim()) {
      addIssue(out, 'warning', 'empty_value', `${entity}.${field} stringa vuota`);
      return;
    }
    addIssue(
      out,
      'warning',
      'mono_locale',
      `${entity}.${field} ha solo una lingua (string). Usare LocalizedText per coprire IT/EN.`,
    );
    return;
  }
  if (isLocalizedText(value)) {
    // Solo le lingue sorgente: le altre ricadono su queste per design.
    for (const loc of SOURCE_LOCALES) {
      const v = (value as Partial<Record<SupportedLocale, string>>)[loc];
      if (v === undefined) {
        addIssue(
          out,
          'warning',
          `missing_${loc}`,
          `${entity}.${field} senza traduzione ${loc.toUpperCase()}`,
        );
      } else if (!v.trim()) {
        addIssue(
          out,
          'error',
          'empty_translation',
          `${entity}.${field}.${loc} traduzione vuota`,
        );
      }
    }
  }
}

/* -------- Validatore -------- */

export interface I18nValidateOptions {
  /** Quando true, il warning `mono_locale` viene escluso dal report. */
  ignoreMonoLocale?: boolean;
}

export function validateI18n(
  dataset: WorldDataset,
  options: I18nValidateOptions = {},
): I18nReport {
  const issues: I18nIssue[] = [];

  // 1. UI resources: chiavi non in sync fra tutte le lingue supportate.
  // Riferimento = locale di default; ogni altra lingua deve avere le stesse
  // chiavi, né una in meno (traduzione mancante) né una in più (chiave orfana).
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
        addIssue(
          issues,
          'error',
          `ui_missing_${loc}`,
          `UI key missing in ${upper}: ${k}`,
        );
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

  // 2. Dataset Naruto: campi visualizzati
  // World
  checkLocalizable(dataset.world.subtitle, `world/${dataset.world.id}`, 'subtitle', issues);
  checkLocalizable(dataset.world.description, `world/${dataset.world.id}`, 'description', issues, true);

  // Nations
  for (const n of dataset.nations) {
    checkLocalizable(n.localizedName, `nation/${n.id}`, 'localizedName', issues);
    checkLocalizable(n.description, `nation/${n.id}`, 'description', issues, true);
    checkLocalizable(n.descriptionLong, `nation/${n.id}`, 'descriptionLong', issues);
  }

  // Boundaries
  for (const b of dataset.boundaries ?? []) {
    checkLocalizable(b.localizedName, `boundary/${b.id}`, 'localizedName', issues);
    checkLocalizable(b.descriptionShort, `boundary/${b.id}`, 'descriptionShort', issues, true);
    checkLocalizable(b.descriptionLong, `boundary/${b.id}`, 'descriptionLong', issues);
  }

  // Locations
  for (const l of dataset.locations) {
    checkLocalizable(l.localizedName, `location/${l.id}`, 'localizedName', issues);
    checkLocalizable(l.shortDescription, `location/${l.id}`, 'shortDescription', issues, true);
    checkLocalizable(l.longDescription, `location/${l.id}`, 'longDescription', issues);
  }

  // Characters
  for (const c of dataset.characters) {
    checkLocalizable(c.shortDescription, `character/${c.id}`, 'shortDescription', issues, true);
    checkLocalizable(c.longDescription, `character/${c.id}`, 'longDescription', issues);
  }

  // Factions
  for (const f of dataset.factions) {
    checkLocalizable(f.localizedName, `faction/${f.id}`, 'localizedName', issues);
    checkLocalizable(f.description, `faction/${f.id}`, 'description', issues, true);
  }

  // Arcs
  for (const a of dataset.arcs) {
    checkLocalizable(a.localizedName, `arc/${a.id}`, 'localizedName', issues);
    checkLocalizable(a.description, `arc/${a.id}`, 'description', issues, true);
    checkLocalizable(a.saga, `arc/${a.id}`, 'saga', issues);
  }

  // Events
  for (const e of dataset.events) {
    checkLocalizable(e.title, `event/${e.id}`, 'title', issues, true);
    checkLocalizable(e.description, `event/${e.id}`, 'description', issues, true);
    checkLocalizable(e.period, `event/${e.id}`, 'period', issues, true);
  }

  // Routes
  for (const r of dataset.routes) {
    checkLocalizable(r.localizedName, `route/${r.id}`, 'localizedName', issues);
    checkLocalizable(r.description, `route/${r.id}`, 'description', issues, true);
    for (const s of r.steps) {
      checkLocalizable(s.title ?? s.label, `route/${r.id}/step${s.order}`, 'title', issues);
      checkLocalizable(s.description, `route/${r.id}/step${s.order}`, 'description', issues);
    }
  }

  // Teams (opt)
  for (const t of dataset.teams ?? []) {
    checkLocalizable(t.localizedName, `team/${t.id}`, 'localizedName', issues);
    checkLocalizable(t.description, `team/${t.id}`, 'description', issues, true);
  }

  // 3. Filtro warnings mono_locale opzionalmente
  const finalIssues = options.ignoreMonoLocale
    ? issues.filter((i) => i.code !== 'mono_locale')
    : issues;

  const errors = finalIssues.filter((i) => i.severity === 'error');
  const warnings = finalIssues.filter((i) => i.severity === 'warning');
  return {
    issues: finalIssues,
    errors,
    warnings,
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
  };
}
