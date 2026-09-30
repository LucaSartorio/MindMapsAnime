import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getEntityDisplayName, getLocalizedText, getLocationTypeLabel } from '@/utils/localization';
import { humanizeId } from '@/lib/worldConfig';
import { DIRECTORY_PAGE_SIZE } from '@/seo/config';
import type { ResolvedPage } from '@/seo/metadata';
import { seoLocations, type SeoCategory } from '@/seo/categories';
import { entityPath, mapPath } from '@/seo/paths';
import { LinkCards, MapCta, PageShell, Pagination, Section, SourceNote } from './parts';

/**
 * Indici "directory" leggeri e crawlabili per le categorie senza archivio
 * interattivo (luoghi, percorsi, regioni). I luoghi sono paginati
 * (`DIRECTORY_PAGE_SIZE`) con URL reali `/page/N`, così anche mondi con
 * migliaia di luoghi restano leggeri.
 */
export function DirectoryPage({
  resolved,
  dataset,
  category,
}: {
  resolved: ResolvedPage;
  dataset: WorldDataset;
  category: Extract<SeoCategory, 'locations' | 'journeys' | 'regions'>;
}) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const lang = resolved.lang;
  const world = getLocalizedText(dataset.world.title, locale);
  const page = resolved.page.kind === 'category' ? resolved.page.page : 1;
  const heading = {
    locations: t('seoPages.locationsH1', { world }),
    journeys: t('seoPages.journeysH1', { world }),
    regions: t('seoPages.regionsH1', { world }),
  }[category];
  const lead = {
    locations: t('seoPages.locationsLead', { world }),
    journeys: t('seoPages.journeysLead', { world }),
    regions: t('seoPages.regionsLead', { world }),
  }[category];

  let body: JSX.Element;
  if (category === 'locations') {
    const nationOrder = new Map(dataset.nations.map((n, i) => [n.id, i]));
    const sorted = [...seoLocations(dataset)].sort(
      (a, b) =>
        (nationOrder.get(a.nationId ?? '') ?? 1e6) - (nationOrder.get(b.nationId ?? '') ?? 1e6) ||
        getEntityDisplayName(a, locale).localeCompare(getEntityDisplayName(b, locale)),
    );
    const slice = sorted.slice((page - 1) * DIRECTORY_PAGE_SIZE, page * DIRECTORY_PAGE_SIZE);
    const groups = new Map<string, typeof slice>();
    for (const l of slice) {
      const k = l.nationId && nationOrder.has(l.nationId) ? l.nationId : '';
      groups.set(k, [...(groups.get(k) ?? []), l]);
    }
    body = (
      <>
        {[...groups].map(([nationId, list]) => {
          const nation = dataset.nations.find((n) => n.id === nationId);
          return (
            <Section
              key={nationId || 'other'}
              id={`group-${nationId || 'other'}`}
              title={nation ? getEntityDisplayName(nation, locale) : t('seoPages.otherPlaces')}
              count={list.length}
            >
              <LinkCards
                items={list.map((l) => ({
                  key: l.id,
                  href: entityPath(lang, dataset, 'locations', l.id)!,
                  title: getEntityDisplayName(l, locale),
                  meta: getLocationTypeLabel(l.type, locale) || humanizeId(l.type),
                  description: getLocalizedText(l.shortDescription, locale),
                }))}
              />
            </Section>
          );
        })}
        <Pagination resolved={resolved} />
      </>
    );
  } else if (category === 'journeys') {
    const groups = new Map<string, typeof dataset.routes>();
    for (const r of dataset.routes) {
      const k = getLocalizedText(r.group, locale);
      groups.set(k, [...(groups.get(k) ?? []), r]);
    }
    body = (
      <>
        {[...groups].map(([group, list], i) => (
          <Section key={group || i} id={`group-${i}`} title={group || t('nav.journeys')} count={list.length}>
            <LinkCards
              items={list.map((r) => ({
                key: r.id,
                href: entityPath(lang, dataset, 'journeys', r.id)!,
                title: getEntityDisplayName(r, locale),
                meta: t('modals.stepCount', { count: r.steps.length }),
                description: getLocalizedText(r.description, locale),
              }))}
            />
          </Section>
        ))}
      </>
    );
  } else {
    const places = seoLocations(dataset);
    body = (
      <LinkCards
        items={dataset.nations.map((n) => ({
          key: n.id,
          href: entityPath(lang, dataset, 'regions', n.id)!,
          title: getEntityDisplayName(n, locale),
          meta: t('modals.locationCount', { count: places.filter((l) => l.nationId === n.id).length }),
          description: getLocalizedText(n.description, locale),
        }))}
      />
    );
  }

  return (
    <PageShell
      resolved={resolved}
      eyebrow={world}
      title={page > 1 ? `${heading} — ${t('seoPages.page', { n: page })}` : heading}
      lead={<p>{lead}</p>}
      actions={<MapCta to={mapPath(lang, dataset)} label={t('seoPages.openMap')} />}
    >
      {body}
      <SourceNote dataset={dataset} />
    </PageShell>
  );
}
