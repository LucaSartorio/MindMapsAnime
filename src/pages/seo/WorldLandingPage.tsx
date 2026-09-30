import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getEntityDisplayName, getLocalizedText, getLocationTypeLabel } from '@/utils/localization';
import { getAbilityTerm, getFactionsTerm, getFeaturedIds, humanizeId } from '@/lib/worldConfig';
import type { ResolvedPage } from '@/seo/metadata';
import { worldHasCategory } from '@/seo/metadata';
import { categoryEntities, seoLocations } from '@/seo/categories';
import { categoryPath, entityPath, mapPath, timelinePath } from '@/seo/paths';
import { worldMapImage } from '@/seo/images';
import { FactList, LinkCards, MapCta, PageShell, Section, SeeAll, SourceNote } from './parts';

const TOP = 12;

/**
 * Landing di un mondo (`/{lang}/{world}`): la pagina "hub" che spiega il mondo e
 * porta alla mappa interattiva. Tutto il contenuto è derivato dal dataset
 * (nessun testo inventato): descrizione, numeri, luoghi/personaggi principali,
 * archi in ordine, fazioni, percorsi, tecniche, regioni — ognuno con il suo link.
 */
export function WorldLandingPage({ resolved, dataset }: { resolved: ResolvedPage; dataset: WorldDataset }) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const lang = resolved.lang;
  const world = dataset.world;
  const title = getLocalizedText(world.title, locale);
  const factionsTerm = getFactionsTerm(world, locale, t('nav.clansFactions'));
  const abilityTerm = getAbilityTerm(world, locale);
  const image = worldMapImage(dataset);

  const places = seoLocations(dataset);
  const mainPlaces = [...places]
    .sort((a, b) => rank(a.importance) - rank(b.importance) || (b.characterIds?.length ?? 0) - (a.characterIds?.length ?? 0))
    .slice(0, TOP);
  const mainCharacters = [...dataset.characters]
    .sort((a, b) => charRank(a.importance) - charRank(b.importance) || a.name.localeCompare(b.name))
    .slice(0, TOP);
  const arcs = [...dataset.arcs].sort((a, b) => a.order - b.order);
  const featuredFactions = pickFeatured(
    dataset.factions,
    getFeaturedIds(world, 'factions'),
    (f) => (f.characterIds?.length ?? 0) + (f.leaderIds?.length ?? 0),
  );
  const abilities = pickFeatured(dataset.jutsu ?? [], getFeaturedIds(world, 'abilities'), (j) => j.characterIds?.length ?? 0);

  const href = (cat: Parameters<typeof entityPath>[2], id: string) => entityPath(lang, dataset, cat, id)!;
  const short = (v: Parameters<typeof getLocalizedText>[0]) => getLocalizedText(v, locale);

  return (
    <PageShell
      resolved={resolved}
      eyebrow={getLocalizedText(world.subtitle, locale) || undefined}
      title={t('seoPages.worldH1', { world: title })}
      lead={<p>{getLocalizedText(world.description, locale)}</p>}
      actions={
        <>
          <MapCta to={mapPath(lang, dataset)} label={t('seoPages.openMap')} />
          {dataset.events.length > 0 && (
            <Link to={timelinePath(lang, dataset)} className="btn-ghost inline-flex">
              {t('nav.timeline')}
            </Link>
          )}
        </>
      }
      media={
        image ? (
          <Link to={mapPath(lang, dataset)} className="block panel-soft overflow-hidden rounded-xl" aria-label={t('seoPages.openMap')}>
            <img
              src={image.url}
              width={image.width}
              height={image.height}
              alt={t('seoPages.mapImageAlt', { world: title })}
              decoding="async"
              className="block h-auto w-full"
            />
          </Link>
        ) : undefined
      }
    >
      <FactList
        items={[
          { label: t('nav.locations'), value: places.length },
          { label: t('nav.characters'), value: dataset.characters.length },
          { label: factionsTerm, value: dataset.factions.length || undefined },
          { label: t('nav.arcs'), value: dataset.arcs.length || undefined },
          { label: t('nav.journeys'), value: dataset.routes.length || undefined },
          { label: abilityTerm, value: dataset.jutsu?.length || undefined },
          { label: t('nav.timeline'), value: dataset.events.length ? t('modals.eventCount', { count: dataset.events.length }) : undefined },
        ]}
      />

      {worldHasCategory(dataset, 'regions') && (
        <Section id="regions" title={t('nav.regions')} count={dataset.nations.length} more={<SeeAll to={categoryPath(lang, dataset, 'regions')} label={t('seoPages.seeAll')} />}>
          <ul className="flex flex-wrap gap-2">
            {dataset.nations.map((n) => (
              <li key={n.id}>
                <Link to={href('regions', n.id)} className="chip hover:border-chakra-500/60 hover:text-white">
                  {getEntityDisplayName(n, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="places" title={t('seoPages.mainLocations')} count={places.length} more={<SeeAll to={categoryPath(lang, dataset, 'locations')} label={t('seoPages.seeAll')} />}>
        <LinkCards
          items={mainPlaces.map((l) => ({
            key: l.id,
            href: href('locations', l.id),
            title: getEntityDisplayName(l, locale),
            meta: getLocationTypeLabel(l.type, locale) || humanizeId(l.type),
            description: short(l.shortDescription),
          }))}
        />
      </Section>

      <Section id="characters" title={t('modals.mainCharacters')} count={dataset.characters.length} more={<SeeAll to={categoryPath(lang, dataset, 'characters')} label={t('seoPages.seeAll')} />}>
        <LinkCards
          items={mainCharacters.map((c) => ({
            key: c.id,
            href: href('characters', c.id),
            title: getEntityDisplayName(c, locale),
            description: short(c.shortDescription),
          }))}
        />
      </Section>

      {arcs.length > 0 && (
        <Section id="arcs" title={t('nav.arcs')} count={arcs.length} more={<SeeAll to={categoryPath(lang, dataset, 'arcs')} label={t('seoPages.seeAll')} />}>
          <ol className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3 list-decimal list-inside text-sm text-ink-300">
            {arcs.map((a) => (
              <li key={a.id}>
                <Link to={href('arcs', a.id)} className="text-ink-100 hover:text-chakra-300 hover:underline">
                  {getEntityDisplayName(a, locale)}
                </Link>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {dataset.routes.length > 0 && (
        <Section id="journeys" title={t('nav.journeys')} count={dataset.routes.length} more={<SeeAll to={categoryPath(lang, dataset, 'journeys')} label={t('seoPages.seeAll')} />}>
          <LinkCards
            items={dataset.routes.slice(0, TOP).map((r) => ({
              key: r.id,
              href: href('journeys', r.id),
              title: getEntityDisplayName(r, locale),
              meta: t('modals.stepCount', { count: r.steps.length }),
              description: short(r.description),
            }))}
          />
        </Section>
      )}

      {featuredFactions.length > 0 && (
        <Section id="factions" title={factionsTerm} count={dataset.factions.length} more={<SeeAll to={categoryPath(lang, dataset, 'factions')} label={t('seoPages.seeAll')} />}>
          <LinkCards
            items={featuredFactions.map((f) => ({
              key: f.id,
              href: href('factions', f.id),
              title: getEntityDisplayName(f, locale),
              meta: humanizeId(String(f.type)),
              description: short(f.description),
            }))}
          />
        </Section>
      )}

      {abilities.length > 0 && (
        <Section id="abilities" title={abilityTerm} count={categoryEntities(dataset, 'abilities').length} more={<SeeAll to={categoryPath(lang, dataset, 'abilities')} label={t('seoPages.seeAll')} />}>
          <LinkCards
            items={abilities.map((j) => ({
              key: j.id,
              href: href('abilities', j.id),
              title: getEntityDisplayName(j, locale),
              description: short(j.shortDescription),
            }))}
          />
        </Section>
      )}

      <SourceNote dataset={dataset} />
    </PageShell>
  );
}

const rank = (i: string) => ({ main: 0, secondary: 1, minor: 2 })[i] ?? 3;
const charRank = (i?: string) => ({ main: 0, major: 1, supporting: 2, minor: 3, background: 4 })[i ?? ''] ?? 5;

/** In vetrina: prima gli id "featured" del config, poi i più collegati. */
function pickFeatured<T extends { id: string }>(list: T[], featured: string[], weight: (x: T) => number): T[] {
  const byId = new Map(list.map((x) => [x.id, x]));
  const first = featured.map((id) => byId.get(id)).filter((x): x is T => !!x);
  const rest = list
    .filter((x) => !featured.includes(x.id))
    .sort((a, b) => weight(b) - weight(a) || a.id.localeCompare(b.id));
  return [...first, ...rest].slice(0, TOP);
}
