import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/common/Card';
import { Seo } from '@/components/seo/Seo';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="flex-1 grid place-items-center px-6 py-16">
      <Seo
        noindex
        title="Pagina non trovata (404)"
        description="La pagina che cerchi non esiste o è stata spostata."
      />
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        <p className="font-mono text-xs uppercase tracking-widest text-ember-300">
          {t('notFound.eyebrow')}
        </p>
        <h1 className="font-display text-3xl text-ink-100">{t('notFound.title')}</h1>
        <p className="text-sm text-ink-300">{t('notFound.body')}</p>
        <Link to="/" className="btn-primary inline-flex">
          {t('notFound.backHome')}
        </Link>
      </Card>
    </div>
  );
}
