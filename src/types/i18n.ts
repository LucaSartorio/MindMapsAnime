/**
 * Tipi base i18n condivisi.
 *
 * Convenzioni:
 *  - `SupportedLocale` enumera le lingue UI gestite.
 *  - `LocalizedText` permette di rendere localizzabile qualsiasi stringa
 *    nei dati di dominio: un campo accetta sia `string` (legacy / unico
 *    locale) sia `{ it, en }`. La utility `getLocalizedText` gestisce il
 *    fallback in modo sicuro.
 *  - Gli `id` restano invariati e non sono mai localizzati.
 */

export type SupportedLocale = 'it' | 'en';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['it', 'en'];

export const DEFAULT_LOCALE: SupportedLocale = 'it';

export interface LocalizedText {
  it: string;
  en: string;
}

export interface LocalizedTextOptional {
  it?: string;
  en?: string;
}

/**
 * Tipo flessibile usato nei dataset:
 *  - `string` → singolo valore (usato come testo per tutte le lingue)
 *  - `LocalizedText` → mapping completo
 *  - `LocalizedTextOptional` → mapping parziale (fallback automatico)
 */
export type Localizable = string | LocalizedText | LocalizedTextOptional;

export function isLocalizedText(
  value: Localizable | undefined | null,
): value is LocalizedText | LocalizedTextOptional {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    ('it' in value || 'en' in value)
  );
}
