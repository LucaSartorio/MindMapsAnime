import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Seo } from '@/components/seo/Seo';
import { useReportStore } from '@/store/useReportStore';

const PAYPAL_URL = import.meta.env.VITE_PAYPAL_URL;
const PAYPAL_CONFIGURED = Boolean(PAYPAL_URL && /^https?:\/\//.test(PAYPAL_URL));

/** Pagina "Supportaci": donazione volontaria + altri modi per contribuire. */
export function SupportPage() {
  const { t } = useTranslation();
  const openReport = useReportStore((s) => s.open);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <Seo path="/supporta" />
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          {t('support.eyebrow')}
        </p>
        <h1 className="font-display text-4xl text-ink-100">{t('support.title')}</h1>
        <p className="text-base text-ink-300 leading-relaxed">{t('support.lead')}</p>
      </header>

      <Card className="p-5 space-y-4 text-sm text-ink-300 leading-relaxed">
        <h2 className="font-display text-xl text-ink-100">
          {t('support.donateTitle')}
        </h2>
        <p>{t('support.donateBody')}</p>
        {PAYPAL_CONFIGURED ? (
          <a
            href={PAYPAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            <span aria-hidden>♥</span> {t('support.donateButton')}
          </a>
        ) : (
          <p className="text-xs text-yellow-300/80">{t('support.donateSoon')}</p>
        )}
        <p className="text-xs text-ink-400">{t('support.note')}</p>
      </Card>

      <Card className="p-5 space-y-3 text-sm text-ink-300 leading-relaxed">
        <h2 className="font-display text-xl text-ink-100">
          {t('support.otherTitle')}
        </h2>
        <p>{t('support.otherIntro')}</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <button
              type="button"
              onClick={openReport}
              className="text-chakra-300 hover:underline"
            >
              {t('support.otherReport')}
            </button>
          </li>
          <li>{t('support.otherShare')}</li>
        </ul>
      </Card>

      <p className="text-sm text-ink-300 leading-relaxed">
        <Link to="/" className="text-chakra-300 hover:underline">
          {t('about.backToHome')}
        </Link>
      </p>
    </div>
  );
}
