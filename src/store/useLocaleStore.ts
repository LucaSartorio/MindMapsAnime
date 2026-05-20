import { create } from 'zustand';
import i18n, { initialLocale, persistLocale } from '@/i18n';
import {
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@/types/i18n';

/**
 * Store della lingua UI.
 *
 * - Mantiene `locale` in sincrono con `i18next`.
 * - Persiste in localStorage.
 * - Notifica tutti i listener Zustand: i componenti che leggono
 *   `useLocaleStore((s) => s.locale)` si ri-renderizzano al cambio.
 */
interface LocaleState {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  availableLocales: readonly SupportedLocale[];
  isLocaleSupported: (locale: string) => locale is SupportedLocale;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: initialLocale(),
  availableLocales: SUPPORTED_LOCALES,
  setLocale: (locale) => {
    void i18n.changeLanguage(locale);
    persistLocale(locale);
    set({ locale });
  },
  isLocaleSupported: (locale): locale is SupportedLocale =>
    (SUPPORTED_LOCALES as readonly string[]).includes(locale),
}));

// Mantieni il flag i18next in sync quando lo store cambia per altre vie.
i18n.on('languageChanged', (lng) => {
  if ((SUPPORTED_LOCALES as readonly string[]).includes(lng)) {
    const current = useLocaleStore.getState().locale;
    if (current !== lng) {
      useLocaleStore.setState({ locale: lng as SupportedLocale });
    }
  }
});
