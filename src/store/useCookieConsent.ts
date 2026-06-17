import { create } from 'zustand';

/**
 * Gestione del consenso ai cookie (GDPR / Reg. UE 2016/679 + Direttiva
 * ePrivacy 2002/58/CE, recepita in Italia dal d.lgs. 196/2003 e dalle
 * "Linee guida cookie" del Garante Privacy dell'10 giugno 2021).
 *
 * Principi rispettati:
 *  - I cookie/strumenti NON tecnici (es. analytics) restano disattivati
 *    finché l'utente non presta un consenso esplicito ("opt-in").
 *  - Accettare e rifiutare devono essere ugualmente semplici: il banner
 *    espone "Accetta tutti" e "Rifiuta" allo stesso livello.
 *  - La scelta è revocabile in qualsiasi momento (link "Gestisci cookie"
 *    nel footer che riapre le preferenze).
 *  - La preferenza è registrata con data e versione dell'informativa.
 */

export const COOKIE_CONSENT_STORAGE_KEY = 'animeInteractiveMaps.cookieConsent';

/** Aggiornare quando cambia l'informativa: invalida i consensi precedenti. */
export const COOKIE_CONSENT_VERSION = 2;

/**
 * Durata massima del consenso (6 mesi). Le Linee guida del Garante (2021)
 * indicano di non riproporre il banner a ogni accesso, ma di riacquisire il
 * consenso trascorso un periodo ragionevole: scaduto, il banner ricompare.
 */
export const COOKIE_CONSENT_MAX_AGE_DAYS = 180;
const MAX_AGE_MS = COOKIE_CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

export interface CookieConsent {
  /** Cookie tecnici: sempre attivi, non richiedono consenso. */
  necessary: true;
  /** Cookie/strumenti di analisi (es. Vercel Analytics & Speed Insights). */
  analytics: boolean;
  /** ISO timestamp della scelta. */
  timestamp: string;
  /** Versione dell'informativa al momento della scelta. */
  version: number;
}

interface CookieConsentState {
  /** `null` finché l'utente non ha effettuato una scelta valida. */
  consent: CookieConsent | null;
  /** Banner di prima scelta visibile. */
  isBannerOpen: boolean;
  /** Dialog "Personalizza / Gestisci preferenze" visibile. */
  isPreferencesOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (analytics: boolean) => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

function readStoredConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    // Consenso valido solo se della versione corrente dell'informativa.
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;
    // Consenso scaduto (> 6 mesi): va riacquisito.
    const ts = typeof parsed.timestamp === 'string' ? Date.parse(parsed.timestamp) : NaN;
    if (Number.isNaN(ts) || Date.now() - ts > MAX_AGE_MS) return null;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      timestamp: new Date(ts).toISOString(),
      version: COOKIE_CONSENT_VERSION,
    };
  } catch {
    return null;
  }
}

function persistConsent(consent: CookieConsent): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // localStorage non disponibile: il consenso resta valido per la sessione.
  }
}

function buildConsent(analytics: boolean): CookieConsent {
  return {
    necessary: true,
    analytics,
    timestamp: new Date().toISOString(),
    version: COOKIE_CONSENT_VERSION,
  };
}

const initialConsent = readStoredConsent();

export const useCookieConsent = create<CookieConsentState>((set) => ({
  consent: initialConsent,
  // Mostra il banner solo se non esiste una scelta valida memorizzata.
  isBannerOpen: initialConsent === null,
  isPreferencesOpen: false,
  acceptAll: () => {
    const consent = buildConsent(true);
    persistConsent(consent);
    set({ consent, isBannerOpen: false, isPreferencesOpen: false });
  },
  rejectAll: () => {
    const consent = buildConsent(false);
    persistConsent(consent);
    set({ consent, isBannerOpen: false, isPreferencesOpen: false });
  },
  savePreferences: (analytics) => {
    const consent = buildConsent(analytics);
    persistConsent(consent);
    set({ consent, isBannerOpen: false, isPreferencesOpen: false });
  },
  openPreferences: () => set({ isPreferencesOpen: true }),
  closePreferences: () => set({ isPreferencesOpen: false }),
}));

/** Selector comodo: l'utente ha acconsentito agli strumenti di analisi? */
export const selectAnalyticsAllowed = (s: CookieConsentState): boolean =>
  s.consent?.analytics === true;
