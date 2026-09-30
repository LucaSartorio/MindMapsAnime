import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getEntityDisplayName, getLocalizedText } from '@/utils/localization';
import { DIRECTORY_PAGE_SIZE } from '@/seo/config';
import type { ResolvedPage } from '@/seo/metadata';
import { seoLocations } from '@/seo/categories';
import { entityPath, mapDeepLink, mapPath } from '@/seo/paths';
import { sortedEvents } from '@/seo/links';
import { eventAnchor } from '@/seo/slug';
import { MapCta, PageShell, Pagination, SourceNote } from './parts';

/**
 * Cronologia (`/{lang}/{world}/timeline`): tutti gli eventi in ordine, con
 * periodo, arco e luoghi linkati. Ogni evento ha un'ancora stabile
 * (`#event-…`) usata dai link delle altre pagine.
 */
export function TimelinePage({ resolved, dataset }: { resolved: ResolvedPage; dataset: WorldDataset }) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const lang = resolved.lang;
  const world = getLocalizedText(dataset.world.title, locale);
  const page = resolved.page.kind === 'timeline' ? resolved.page.page : 1;
  const events = sortedEvents(dataset).slice((page - 1) * DIRECTORY_PAGE_SIZE, page * DIRECTORY_PAGE_SIZE);
  const arcs = new Map(dataset.arcs.map((a) => [a.id, a]));
  const placeIds = new Set(seoLocations(dataset).map((l) => l.id));
  const places = new Map(dataset.locations.map((l) => [l.id, l]));
  const heading = t('seoPages.timelineH1', { world });

  return (
    <PageShell
      resolved={resolved}
      eyebrow={world}
      title={page > 1 ? `${heading} — ${t('seoPages.page', { n: page })}` : heading}
      lead={<p>{t('seoPages.timelineLead', { world })}</p>}
      actions={<MapCta to={mapPath(lang, dataset)} label={t('seoPages.openMap')} />}
    >
      <ol className="space-y-3">
        {events.map((e) => {
          const arc = e.arcId ? arcs.get(e.arcId) : undefined;
          const locIds = [...new Set([e.locationId, ...(e.locationIds ?? [])].filter((x): x is string => !!x))];
          return (
            <li key={e.id} id={eventAnchor(e.id)} className="panel-soft p-4 scroll-mt-24 cv-auto">
              <article className="space-y-1.5">
                <p className="text-[11px] font-mono uppercase tracking-wide text-ink-400">
                  {getLocalizedText(e.period, locale)}
                  {arc && (
                    <>
                      {' · '}
                      <Link to={entityPath(lang, dataset, 'arcs', arc.id)!} className="text-chakra-300 hover:underline">
                        {getEntityDisplayName(arc, locale)}
                      </Link>
                    </>
                  )}
                </p>
                <h2 className="font-display text-base text-ink-100">{getLocalizedText(e.title, locale)}</h2>
                <p className="text-sm text-ink-300 leading-relaxed">{getLocalizedText(e.description, locale)}</p>
                <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  {locIds
                    .filter((id) => placeIds.has(id))
                    .map((id) => (
                      <Link key={id} to={entityPath(lang, dataset, 'locations', id)!} className="text-chakra-300 hover:underline">
                        {getEntityDisplayName(places.get(id), locale)}
                      </Link>
                    ))}
                  <Link to={mapDeepLink(lang, dataset, 'event', e.id)} className="text-ink-400 hover:text-ink-200 hover:underline">
                    {t('modals.showOnMap')}
                  </Link>
                </p>
              </article>
            </li>
          );
        })}
      </ol>
      <Pagination resolved={resolved} />
      <SourceNote dataset={dataset} />
    </PageShell>
  );
}
