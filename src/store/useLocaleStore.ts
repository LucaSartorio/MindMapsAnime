import { createSnapshotStore } from './snapshotStore';
import i18n, { ensureLocaleResources, persistLocale } from '@/i18n';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@/types/i18n';

/**
 * Store della lingua UI.
 *
 * - Mantiene `locale` in sincrono con `i18next`.
 * - `setLocale` = scelta esplicita dell'utente: carica le risorse se servono
 *   (le lingue non-IT/EN sono chunk lazy) e persiste in localStorage.
 * - `syncLocale` = allineamento alla lingua dell'URL (`/it`, `/en`): NON
 *   persiste, così un link in un'altra lingua non cambia la preferenza salvata.
 * - La lingua iniziale la decide `src/main.tsx` (URL + preferenza salvata)
 *   prima del primo render; il pre-rendering usa `setLocaleNow`.
 */
interface LocaleState {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  syncLocale: (locale: SupportedLocale) => void;
  availableLocales: readonly SupportedLocale[];
  isLocaleSupported: (locale: string) => locale is SupportedLocale;
}

/** Applica una lingua le cui risorse sono GIÀ caricate (sincrono). */
export function setLocaleNow(locale: SupportedLocale): void {
  if (i18n.language !== locale) void i18n.changeLanguage(locale);
  if (useLocaleStore.getState().locale !== locale) useLocaleStore.setState({ locale });
}

async function applyLocale(locale: SupportedLocale): Promise<void> {
  await ensureLocaleResources(locale);
  setLocaleNow(locale);
}

// Snapshot SSR = stato corrente: la lingua è impostata prima del primo render
// (pre-rendering e main.tsx), vedi `createSnapshotStore`.
export const useLocaleStore = createSnapshotStore<LocaleState>(() => ({
  locale: DEFAULT_LOCALE,
  availableLocales: SUPPORTED_LOCALES,
  setLocale: (locale) => {
    persistLocale(locale);
    void applyLocale(locale);
  },
  syncLocale: (locale) => {
    void applyLocale(locale);
  },
  isLocaleSupported: (locale): locale is SupportedLocale =>
    (SUPPORTED_LOCALES as readonly string[]).includes(locale),
}));

// Mantieni lo store in sync quando i18next cambia lingua per altre vie.
i18n.on('languageChanged', (lng) => {
  if ((SUPPORTED_LOCALES as readonly string[]).includes(lng)) {
    const current = useLocaleStore.getState().locale;
    if (current !== lng) {
      useLocaleStore.setState({ locale: lng as SupportedLocale });
    }
  }
});
