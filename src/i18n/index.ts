import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from '@/types/i18n';
import { it } from './resources/it';
import { en } from './resources/en';

/**
 * Setup i18n per Mappe Interattive.
 *
 * - Lingue: italiano (default), inglese.
 * - Persistenza: `localStorage` chiave `animeInteractiveMaps.locale`.
 * - Detection: prima localStorage, poi browser language se supportata,
 *   altrimenti default italiano.
 */

export const I18N_STORAGE_KEY = 'animeInteractiveMaps.locale';

function readStoredLocale(): SupportedLocale | null {
  try {
    const raw = localStorage.getItem(I18N_STORAGE_KEY);
    if (!raw) return null;
    if ((SUPPORTED_LOCALES as readonly string[]).includes(raw)) {
      return raw as SupportedLocale;
    }
  } catch {
    // localStorage non disponibile (es. SSR)
  }
  return null;
}

function detectBrowserLocale(): SupportedLocale | null {
  if (typeof navigator === 'undefined') return null;
  const candidates: string[] = [];
  const langs = navigator.languages ?? [navigator.language];
  for (const l of langs) {
    if (!l) continue;
    candidates.push(l);
    candidates.push(l.split('-')[0]);
  }
  for (const c of candidates) {
    const norm = c.toLowerCase();
    if (norm.startsWith('it')) return 'it';
    if (norm.startsWith('en')) return 'en';
  }
  return null;
}

export function initialLocale(): SupportedLocale {
  return readStoredLocale() ?? detectBrowserLocale() ?? DEFAULT_LOCALE;
}

const resources = {
  it: { translation: it },
  en: { translation: en },
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
