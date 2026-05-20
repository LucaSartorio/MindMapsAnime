import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/common/Card';
import { SourceNotice } from '@/components/common/SourceNotice';

export function AboutPage() {
  const { t } = useTranslation();
  const offers = t('about.offers', { returnObjects: true }) as string[];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          {t('about.eyebrow')}
        </p>
        <h1 className="font-display text-4xl text-ink-100">{t('about.title')}</h1>
        <p className="text-base text-ink-300 leading-relaxed">{t('about.lead')}</p>
      </header>

      <Card className="p-5 space-y-3 text-sm text-ink-300 leading-relaxed">
        <h2 className="font-display text-xl text-ink-100">
          {t('about.offersTitle')}
        </h2>
        <ul className="list-disc list-inside space-y-1">
          {offers.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
      </Card>

      <Card className="p-5 space-y-3 text-sm text-ink-300 leading-relaxed">
        <h2 className="font-display text-xl text-ink-100">
          {t('about.architectureTitle')}
        </h2>
        <p>{t('about.architectureBody1')}</p>
        <p>{t('about.architectureBody2')}</p>
      </Card>

      <SourceNotice />

      <p className="text-sm text-ink-300 leading-relaxed">
        <Link to="/" className="text-chakra-300 hover:underline">
          {t('about.backToHome')}
        </Link>
      </p>
    </div>
  );
}
