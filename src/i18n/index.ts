import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@/types/i18n';
import { it } from './resources/it';
import { en } from './resources/en';
import { ja } from './resources/ja';
import { fr } from './resources/fr';
import { de } from './resources/de';
import { es } from './resources/es';

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

const resources = {
  it: { translation: it },
  en: { translation: en },
  ja: { translation: ja },
  fr: { translation: fr },
  de: { translation: de },
  es: { translation: es },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale(),
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
