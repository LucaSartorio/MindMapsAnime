import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocaleStore } from '@/store/useLocaleStore';
import { breadcrumbTrail, categoryLabel, type ResolvedPage } from '@/seo/metadata';

interface BreadcrumbsProps {
  resolved: ResolvedPage;
  className?: string;
}

/**
 * Breadcrumb visibile e crawlabile (`<nav>` + `<ol>` + `<a>` reali, ultima voce
 * `aria-current="page"`). La STRUTTURA viene da `breadcrumbTrail` — la stessa
 * del JSON-LD `BreadcrumbList` — solo le etichette seguono la lingua UI.
 */
export function Breadcrumbs({ resolved, className }: BreadcrumbsProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const crumbs = breadcrumbTrail(resolved, locale, {
    home: t('seoPages.home'),
    category: (world, c) =>
      categoryLabel(world, c, locale, {
        characters: t('nav.characters'),
        locations: t('nav.locations'),
        factions: t('nav.clansFactions'),
        arcs: t('nav.arcs'),
        journeys: t('nav.journeys'),
        abilities: '',
        regions: t('nav.regions'),
        timeline: t('nav.timeline'),
        map: t('nav.map'),
      }),
    page: (n) => t('seoPages.page', { n }),
  });
  if (crumbs.length < 2) return null;
  return (
    <nav aria-label={t('seoPages.breadcrumbAria')} className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-ink-400">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="min-w-0 inline-flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-ink-200 truncate">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link to={c.path} className="hover:text-chakra-300 hover:underline">
                    {c.name}
                  </Link>
                  <span aria-hidden className="text-ink-600">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
