import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUiStore } from '@/store';
import { Modal } from '@/components/common/Modal';

/**
 * Overlay di onboarding della mappa.
 *
 * Si apre automaticamente al primo accesso (flag in localStorage, versionato)
 * e resta riapribile dal pulsante "aiuto" negli overlay mappa. Spiega i gesti
 * base (pan/zoom, click sui pin, sotto-mappe, filtri, ricerca, timeline) così
 * un nuovo utente non si trova davanti a una tela vuota senza indicazioni.
 */
const SEEN_KEY = 'animeInteractiveMaps.onboarding.v1';

const STEPS = ['panZoom', 'pin', 'submap', 'filters', 'search', 'timeline'] as const;

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

  // Apertura automatica al primo accesso assoluto.
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      seen = true; // storage non disponibile: non insistere
    }
    if (!seen) {
      openHelp();
      try {
        localStorage.setItem(SEEN_KEY, '1');
      } catch {
        /* ignora */
      }
    }
  }, [openHelp]);

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
            <span className="text-ink-200">{t(`onboarding.steps.${step}`)}</span>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
