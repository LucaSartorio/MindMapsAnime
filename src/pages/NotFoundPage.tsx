import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/common/Card';
import { Seo } from '@/components/seo/Seo';
import { homePath } from '@/seo/paths';
import { useSeoLang } from '@/seo/useSeoLang';

/**
 * 404. In produzione i path sconosciuti ricevono `404.html` con status HTTP 404
 * (nessun fallback SPA a 200 → niente soft-404); il client mostra questa stessa
 * pagina anche nelle navigazioni SPA verso path inesistenti.
 */
export function NotFoundPage() {
  const { t } = useTranslation();
  const lang = useSeoLang();
  return (
    <div className="flex-1 grid place-items-center px-6 py-16">
      <Seo notFound />
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        <p className="font-mono text-xs uppercase tracking-widest text-ember-300">
          {t('notFound.eyebrow')}
        </p>
        <h1 className="font-display text-3xl text-ink-100">{t('notFound.title')}</h1>
        <p className="text-sm text-ink-300">{t('notFound.body')}</p>
        <Link to={homePath(lang)} className="btn-primary inline-flex">
          {t('notFound.backHome')}
        </Link>
      </Card>
    </div>
  );
}
