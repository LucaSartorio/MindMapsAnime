import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useCookieConsent } from '@/store/useCookieConsent';

/**
 * Sistema di consenso ai cookie conforme a GDPR + ePrivacy e alle Linee
 * guida del Garante Privacy (2021):
 *  - Banner di prima scelta con "Accetta tutti", "Rifiuta" e "Personalizza"
 *    allo stesso livello (no scelte preselezionate per gli strumenti non
 *    tecnici).
 *  - Dialog preferenze granulari (tecnici sempre attivi, analytics opt-in).
 *  - Richiamabile in ogni momento dal footer ("Gestisci cookie").
 */
export function CookieConsent() {
  const { t } = useTranslation();
  const isBannerOpen = useCookieConsent((s) => s.isBannerOpen);
  const isPreferencesOpen = useCookieConsent((s) => s.isPreferencesOpen);
  const consent = useCookieConsent((s) => s.consent);
  const acceptAll = useCookieConsent((s) => s.acceptAll);
  const rejectAll = useCookieConsent((s) => s.rejectAll);
  const savePreferences = useCookieConsent((s) => s.savePreferences);
  const openPreferences = useCookieConsent((s) => s.openPreferences);
  const closePreferences = useCookieConsent((s) => s.closePreferences);

  // Stato locale del toggle analytics nel dialog preferenze.
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);

  // All'apertura del dialog, riallinea il toggle al consenso salvato.
  useEffect(() => {
    if (isPreferencesOpen) setAnalytics(consent?.analytics ?? false);
  }, [isPreferencesOpen, consent?.analytics]);

  return (
    <>
      {/* Banner di prima scelta */}
      {isBannerOpen && !isPreferencesOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={t('cookie.banner.title')}
          className="fixed inset-x-0 bottom-0 z-[55] p-3 sm:p-4"
        >
          <div className="mx-auto max-w-3xl panel rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="space-y-1.5">
              <h2 className="font-display text-lg text-ink-100">
                {t('cookie.banner.title')}
              </h2>
              <p className="text-sm text-ink-300 leading-relaxed">
                {t('cookie.banner.body')}{' '}
                <Link
                  to="/cookie-policy"
                  className="text-chakra-300 hover:underline"
                >
                  {t('cookie.banner.readMore')}
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:justify-end">
              <Button variant="ghost" onClick={openPreferences}>
                {t('cookie.actions.customize')}
              </Button>
              <Button variant="ghost" onClick={rejectAll}>
                {t('cookie.actions.rejectAll')}
              </Button>
              <Button variant="primary" onClick={acceptAll}>
                {t('cookie.actions.acceptAll')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog preferenze granulari */}
      <Modal
        open={isPreferencesOpen}
        onClose={closePreferences}
        title={t('cookie.prefs.title')}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={rejectAll}>
              {t('cookie.actions.rejectAll')}
            </Button>
            <Button variant="ghost" onClick={() => savePreferences(analytics)}>
              {t('cookie.actions.save')}
            </Button>
            <Button variant="primary" onClick={acceptAll}>
              {t('cookie.actions.acceptAll')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-300 leading-relaxed">
          {t('cookie.prefs.intro')}{' '}
          <Link to="/cookie-policy" className="text-chakra-300 hover:underline">
            {t('cookie.banner.readMore')}
          </Link>
          .
        </p>

        {/* Cookie tecnici: sempre attivi */}
        <div className="panel-soft p-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-ink-100">
              {t('cookie.prefs.necessaryTitle')}
            </h3>
            <p className="text-xs text-ink-400 leading-relaxed mt-1">
              {t('cookie.prefs.necessaryBody')}
            </p>
          </div>
          <span className="shrink-0 text-xs font-mono uppercase tracking-wider text-chakra-300 mt-1">
            {t('cookie.prefs.alwaysOn')}
          </span>
        </div>

        {/* Cookie analytics: opt-in */}
        <label className="panel-soft p-4 flex items-start justify-between gap-4 cursor-pointer">
          <div>
            <h3 className="text-sm font-semibold text-ink-100">
              {t('cookie.prefs.analyticsTitle')}
            </h3>
            <p className="text-xs text-ink-400 leading-relaxed mt-1">
              {t('cookie.prefs.analyticsBody')}
            </p>
          </div>
          <input
            type="checkbox"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-chakra-500"
            aria-label={t('cookie.prefs.analyticsTitle')}
          />
        </label>
      </Modal>
    </>
  );
}
