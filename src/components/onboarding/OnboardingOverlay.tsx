import { useEffect, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { useUiStore } from '@/store';
import { useCookieConsent } from '@/store/useCookieConsent';
import { Modal } from '@/components/common/Modal';

/**
 * Overlay di onboarding della mappa.
 *
 * Si apre automaticamente al primo accesso (flag in localStorage, versionato)
 * e resta riapribile dal pulsante "aiuto" negli overlay mappa. Spiega i gesti
 * base (pan/zoom, click sui pin, sotto-mappe, filtri, ricerca, timeline) così
 * un nuovo utente non si trova davanti a una tela vuota senza indicazioni.
 *
 * UX-02: l'apertura automatica aspetta che il banner cookie sia chiuso (prima
 * il dialog modale copriva i pulsanti del banner e bloccava la scelta), e il flag
 * "visto" si salva solo quando l'overlay si apre davvero. Sui dispositivi touch
 * le istruzioni parlano di tocchi e pizzico, non di rotella, doppio clic o "/".
 */
const SEEN_KEY = 'animeInteractiveMaps.onboarding.v1';

const STEPS = ['panZoom', 'pin', 'submap', 'filters', 'search', 'timeline'] as const;

/** Passi con un testo diverso per i dispositivi touch (`onboarding.stepsTouch`). */
const TOUCH_STEPS = new Set<(typeof STEPS)[number]>(['panZoom', 'pin', 'submap', 'filters', 'search']);

/** Apertura automatica già avvenuta in questa sessione (anche se lo storage non scrive). */
let autoOpenedThisSession = false;

const COARSE_QUERY = '(pointer: coarse)';
function subscribeCoarse(onChange: () => void): () => void {
  const mql = window.matchMedia?.(COARSE_QUERY);
  mql?.addEventListener?.('change', onChange);
  return () => mql?.removeEventListener?.('change', onChange);
}
const getCoarse = () => window.matchMedia?.(COARSE_QUERY).matches ?? false;
/** Pre-render e idratazione: puntatore fine (l'overlay è comunque chiuso). */
const getCoarseServer = () => false;

const STEP_ICON: Record<(typeof STEPS)[number], string> = {
  panZoom: '✥',
  pin: '◉',
  submap: '⤢',
  filters: '☰',
  search: '⌕',
  timeline: '▤',
};

export function OnboardingOverlay() {
  const { t } = useTranslation();
  const open = useUiStore((s) => s.isHelpOpen);
  const openHelp = useUiStore((s) => s.openHelp);
  const closeHelp = useUiStore((s) => s.closeHelp);

  // Il banner cookie (o il dialog preferenze) ha la precedenza: finché l'utente
  // non ha scelto, l'onboarding non si apre sopra di lui.
  const cookieDecisionPending = useCookieConsent((s) => s.isBannerOpen || s.isPreferencesOpen);
  const coarsePointer = useSyncExternalStore(subscribeCoarse, getCoarse, getCoarseServer);

  // Apertura automatica al primo accesso assoluto, dopo la scelta sui cookie.
  useEffect(() => {
    if (cookieDecisionPending || autoOpenedThisSession) return;
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      seen = true; // storage non disponibile: non insistere
    }
    if (!seen) {
      autoOpenedThisSession = true;
      openHelp();
      try {
        localStorage.setItem(SEEN_KEY, '1');
      } catch {
        /* storage non disponibile: l'overlay si riaprirà alla prossima visita */
      }
    }
  }, [openHelp, cookieDecisionPending]);

  return (
    <Modal
      open={open}
      onClose={closeHelp}
      size="md"
      shareable={false}
      eyebrow={t('app.eyebrow')}
      title={t('onboarding.title')}
      footer={
        <button
          type="button"
          onClick={closeHelp}
          className="rounded-lg bg-chakra-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-chakra-700"
        >
          {t('onboarding.cta')}
        </button>
      }
    >
      <p className="text-ink-300">{t('onboarding.intro')}</p>
      <ul className="space-y-3">
        {STEPS.map((step) => (
          <li key={step} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-ink-800/70 text-chakra-300"
            >
              {STEP_ICON[step]}
            </span>
            <span className="text-ink-200">
              {t(
                coarsePointer && TOUCH_STEPS.has(step)
                  ? `onboarding.stepsTouch.${step}`
                  : `onboarding.steps.${step}`,
              )}
            </span>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
