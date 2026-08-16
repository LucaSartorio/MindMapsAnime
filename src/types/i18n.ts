/**
 * Tipi base i18n condivisi.
 *
 * Convenzioni:
 *  - `SupportedLocale` enumera le lingue UI gestite. È derivata da
 *    `SUPPORTED_LOCALES`: aggiungere una lingua = aggiungere il codice lì,
 *    la sua voce in `LOCALE_META` e il file `src/i18n/resources/<code>.ts`.
 *  - `LocalizedText` permette di rendere localizzabile qualsiasi stringa
 *    nei dati di dominio: un campo accetta sia `string` (legacy / unico
 *    locale) sia `{ it, en, … }`. `it` ed `en` restano obbligatorie (sono le
 *    lingue "sorgente" dei dataset), le altre sono facoltative e risolte per
 *    fallback. La utility `getLocalizedText` gestisce il fallback in modo sicuro.
 *  - Gli `id` restano invariati e non sono mai localizzati.
 */

export const SUPPORTED_LOCALES = ['it', 'en', 'ja', 'fr', 'de', 'es'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'it';

/**
 * Lingue in cui sono scritti i dataset narrativi (`Localizable`). Le altre
 * lingue traducono l'interfaccia e ricadono su queste per i contenuti.
 */
export const SOURCE_LOCALES: readonly SupportedLocale[] = ['it', 'en'];

/** Metadati di una lingua UI. */
export interface LocaleMeta {
  code: SupportedLocale;
  /** Nome della lingua nella lingua stessa (convenzione dei selettori lingua). */
  nativeName: string;
  /** Sigla mostrata sul bottone del selettore. */
  short: string;
  /** Valore dell'attributo `lang` / `hreflang`. */
  htmlLang: string;
  /** Valore `og:locale` (Open Graph richiede `lingua_PAESE`). */
  ogLocale: string;
}

export const LOCALE_META: Record<SupportedLocale, LocaleMeta> = {
  it: { code: 'it', nativeName: 'Italiano', short: 'IT', htmlLang: 'it', ogLocale: 'it_IT' },
  en: { code: 'en', nativeName: 'English', short: 'EN', htmlLang: 'en', ogLocale: 'en_US' },
  ja: { code: 'ja', nativeName: '日本語', short: 'JA', htmlLang: 'ja', ogLocale: 'ja_JP' },
  fr: { code: 'fr', nativeName: 'Français', short: 'FR', htmlLang: 'fr', ogLocale: 'fr_FR' },
  de: { code: 'de', nativeName: 'Deutsch', short: 'DE', htmlLang: 'de', ogLocale: 'de_DE' },
  es: { code: 'es', nativeName: 'Español', short: 'ES', htmlLang: 'es', ogLocale: 'es_ES' },
};

/**
 * Catena di fallback per lingua, usata da `getLocalizedText` quando un campo
 * `Localizable` non è tradotto nella lingua attiva.
 *
 * Le lingue aggiunte dopo IT/EN ricadono prima sull'inglese (più leggibile per
 * un pubblico internazionale) e solo dopo sull'italiano.
 */
export const LOCALE_FALLBACKS: Record<SupportedLocale, readonly SupportedLocale[]> = {
  it: ['en'],
  en: ['it'],
  ja: ['en', 'it'],
  fr: ['en', 'it'],
  de: ['en', 'it'],
  es: ['en', 'it'],
};

/**
 * Mapping completo di una stringa localizzabile. `it`/`en` sono richieste
 * perché sono le lingue sorgente; le altre sono opzionali e, se assenti,
 * risolte tramite `LOCALE_FALLBACKS`.
 */
export interface LocalizedText {
  it: string;
  en: string;
  ja?: string;
  fr?: string;
  de?: string;
  es?: string;
}

export type LocalizedTextOptional = Partial<Record<SupportedLocale, string>>;

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
    SUPPORTED_LOCALES.some((locale) => locale in value)
  );
}
