import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@/types/i18n';
import { it } from './resources/it';
import { en } from './resources/en';

/**
 * Setup i18n per Mappe Interattive.
 *
 * - Lingue: italiano (default), inglese, giapponese, francese, tedesco, spagnolo.
 * - Persistenza: `localStorage` chiave `animeInteractiveMaps.locale`.
 * - Detection: prima localStorage, poi browser language se supportata,
 *   altrimenti default italiano.
 *
 * Aggiungere una lingua = aggiungere il codice in `SUPPORTED_LOCALES`
 * (`src/types/i18n.ts`), il file `resources/<code>.ts` e la voce qui sotto.
 */

export const I18N_STORAGE_KEY = 'animeInteractiveMaps.locale';

function isSupported(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

function readStoredLocale(): SupportedLocale | null {
  try {
    const raw = localStorage.getItem(I18N_STORAGE_KEY);
    if (!raw) return null;
    if (isSupported(raw)) return raw;
  } catch {
    // localStorage non disponibile (es. SSR)
  }
  return null;
}

/**
 * Prima lingua supportata fra quelle preferite dal browser. Confronta sia il
 * tag completo (`fr-CA`) sia il codice base (`fr`), così ogni variante
 * regionale ricade sulla lingua giusta.
 */
function detectBrowserLocale(): SupportedLocale | null {
  if (typeof navigator === 'undefined') return null;
  const langs = navigator.languages ?? [navigator.language];
  for (const lang of langs) {
    if (!lang) continue;
    const base = lang.toLowerCase().split('-')[0];
    if (isSupported(base)) return base;
  }
  return null;
}

export function initialLocale(): SupportedLocale {
  return readStoredLocale() ?? detectBrowserLocale() ?? DEFAULT_LOCALE;
}

/**
 * Risorse UI: IT/EN (lingue sorgente dei dati, servono anche al
 * pre-rendering) sono nel bundle iniziale; le altre lingue sono chunk separati
 * caricati on-demand da `ensureLocaleResources` — chi naviga in italiano o
 * inglese non scarica ~150 KB di traduzioni che non usa.
 */
const resources = {
  it: { translation: it },
  en: { translation: en },
} as const;

type ResourceModule = Record<string, unknown>;
const LAZY_RESOURCES: Partial<Record<SupportedLocale, () => Promise<ResourceModule>>> = {
  ja: () => import('./resources/ja').then((m) => m.ja),
  fr: () => import('./resources/fr').then((m) => m.fr),
  de: () => import('./resources/de').then((m) => m.de),
  es: () => import('./resources/es').then((m) => m.es),
};

/** Carica (una volta) le risorse UI di una lingua. Risolve subito per IT/EN. */
export async function ensureLocaleResources(locale: SupportedLocale): Promise<void> {
  if (i18n.hasResourceBundle(locale, 'translation')) return;
  const load = LAZY_RESOURCES[locale];
  if (!load) return;
  const bundle = await load();
  i18n.addResourceBundle(locale, 'translation', bundle, true, true);
}

void i18n.use(initReactI18next).init({
  resources,
  // La lingua reale viene impostata in `src/main.tsx` dopo aver caricato le
  // risorse e allineato la lingua all'URL; qui partiamo sempre da una lingua
  // già presente nel bundle.
  lng: DEFAULT_LOCALE,
  partialBundledLanguages: true,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: SUPPORTED_LOCALES,
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

export function persistLocale(locale: SupportedLocale): void {
  try {
    localStorage.setItem(I18N_STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}

export default i18n;
