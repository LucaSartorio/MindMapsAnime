import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { mapPath } from '@/seo/paths';
import { otherWorldMaps } from '@/seo/worldLinks';
import type { SeoLocale } from '@/seo/config';
import { cn } from '@/lib/cn';

/**
 * "Esplora gli altri mondi anime" (SEO-05): link diretti alle mappe interattive
 * degli altri mondi pubblicati, nella lingua della pagina (`mapPath` ricade sulla
 * lingua di fallback se un mondo non esiste in quella lingua, quindi mai un 404).
 *
 * Usato SOLO dove è pertinente — landing e guida della `/map` di ogni mondo —
 * non sulle ~13.000 pagine entità: lì sarebbe un blocco ripetitivo identico,
 * fuori contesto, che appesantisce l'HTML senza aiutare l'utente. Link reali
 * (`<a href>`) presenti nell'HTML pre-renderizzato e dopo l'idratazione.
 */
export function OtherWorldMaps({
  currentWorldId,
  lang,
  headingLevel = 2,
  className,
}: {
  currentWorldId: string;
  lang: SeoLocale;
  headingLevel?: 2 | 3;
  className?: string;
}) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const worlds = otherWorldMaps(currentWorldId);
  if (worlds.length === 0) return null;
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const headingId = `other-worlds-${currentWorldId}`;

  return (
    <section aria-labelledby={headingId} className={cn('space-y-3', className)}>
      <Heading
        id={headingId}
        className={cn('font-display text-ink-100', headingLevel === 2 ? 'text-xl' : 'text-base')}
      >
        {t('seoPages.otherWorldsTitle')}
      </Heading>
      <ul className="flex flex-wrap gap-1.5">
        {worlds.map((w) => (
          <li key={w.id}>
            <Link to={mapPath(lang, w)} className="chip hover:border-chakra-500/60 hover:text-white">
              {t('seoPages.worldMapLink', { world: getLocalizedText(w.title, locale) })}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
