import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Location, WorldDataset } from '@/types';
import { useLocaleStore } from '@/store/useLocaleStore';
import { useMapStore, useUiStore } from '@/store';
import { getEntityDisplayName, getLocalizedText } from '@/utils/localization';
import { isDerivedJourney } from '@/data/shared/autoJourneys';
import { CardLink } from '@/components/seo/CardLink';
import type { ResolvedPage } from '@/seo/metadata';
import { seoLocations } from '@/seo/categories';
import { categoryPath, entityPath } from '@/seo/paths';

/** Luoghi mostrati per mappa (gli altri sono nell'indice dei luoghi, linkato in fondo). */
const PLACES_PER_LEVEL = 40;
const JOURNEYS = 12;

const importanceRank = (i: string) => ({ main: 0, secondary: 1, minor: 2 })[i] ?? 3;

/**
 * "Guida alla mappa" della rotta `/{lang}/{world}/map`: un `<details>` nativo
 * sopra la mappa (in alto a destra), presente nell'HTML pre-renderizzato E dopo
 * l'idratazione — prima l'indice testuale spariva quando React Flow sostituiva
 * l'anteprima, e la pagina renderizzata restava senza testo né link.
 *
 * Contenuto solo dai dati: ogni livello mappa (nome, descrizione, luoghi),
 * le regioni e i percorsi. I luoghi/percorsi sono VERI link alle loro pagine
 * (crawlabili, Ctrl/⌘-click), ma il click semplice li apre sulla mappa
 * (`CardLink`): cambia livello se serve, apre la scheda e chiude la guida.
 * Funziona anche senza JS (il `<details>` è nativo). Niente stato React per
 * `open`: markup identico su server e client.
 */
export function MapGuide({ resolved, dataset }: { resolved: ResolvedPage; dataset: WorldDataset }) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const openLocation = useUiStore((s) => s.openLocationModal);
  const openRoute = useUiStore((s) => s.openRouteModal);
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);
  const ref = useRef<HTMLDetailsElement>(null);
  const lang = resolved.lang;
  const world = getLocalizedText(dataset.world.title, locale);

  const mainId = dataset.world.defaultMapLevelId ?? dataset.mapLevels[0]?.id;
  const levels = [...dataset.mapLevels].sort((a, b) => Number(b.id === mainId) - Number(a.id === mainId));
  const places = seoLocations(dataset);
  const byLevel = new Map<string, Location[]>();
  for (const l of places) byLevel.set(l.mapLevelId, [...(byLevel.get(l.mapLevelId) ?? []), l]);
  const journeys = [...dataset.routes]
    .sort((a, b) => Number(isDerivedJourney(a)) - Number(isDerivedJourney(b)))
    .slice(0, JOURNEYS);

  const close = () => {
    if (ref.current) ref.current.open = false;
  };
  const showPlace = (l: Location) => {
    const active = useMapStore.getState().activeMapLevelId ?? mainId;
    if (active !== l.mapLevelId) setActiveMapLevel(l.mapLevelId);
    openLocation(l.id);
    close();
  };

  return (
    <details
      ref={ref}
      className="group absolute right-3 top-[3.75rem] md:top-3 z-20 flex flex-col items-end"
    >
      <summary className="panel ml-auto flex cursor-pointer list-none items-center gap-2 px-3 py-2 font-display text-[11px] uppercase tracking-widest text-chakra-300 hover:text-chakra-100 [&::-webkit-details-marker]:hidden">
        <span aria-hidden>☰</span>
        {t('seoPages.mapGuideToggle')}
        <span aria-hidden className="transition-transform group-open:rotate-90">›</span>
      </summary>
      <div className="panel mt-2 w-[min(24rem,calc(100vw-1.5rem))] max-h-[min(70vh,40rem)] overflow-auto p-4 space-y-5 text-sm">
        <div className="space-y-1.5">
          <h2 className="font-display text-lg text-ink-100">{t('seoPages.mapGuideTitle', { world })}</h2>
          <p className="text-ink-300">
            {t('seoPages.mapGuideLead', { places: places.length, maps: dataset.mapLevels.length })}
          </p>
        </div>

        {levels.map((level) => {
          const list = [...(byLevel.get(level.id) ?? [])]
            .sort(
              (a, b) =>
                importanceRank(a.importance) - importanceRank(b.importance) ||
                getEntityDisplayName(a, locale).localeCompare(getEntityDisplayName(b, locale)),
            )
            .slice(0, PLACES_PER_LEVEL);
          const description = getLocalizedText(level.description, locale);
          return (
            <section key={level.id} aria-labelledby={`guide-${level.id}`} className="space-y-2">
              <h3 id={`guide-${level.id}`} className="font-display text-base text-ink-100">
                {getLocalizedText(level.localizedName, locale) || level.name}
                <span className="ml-2 text-xs font-sans text-ink-400">
                  ({t('modals.locationCount', { count: byLevel.get(level.id)?.length ?? 0 })})
                </span>
              </h3>
              {description && <p className="text-xs leading-relaxed text-ink-300">{description}</p>}
              {list.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                  {list.map((l) => (
                    <li key={l.id}>
                      <CardLink
                        href={entityPath(lang, dataset, 'locations', l.id)!}
                        onOpen={() => showPlace(l)}
                        className="chip hover:border-chakra-500/60 hover:text-white"
                      >
                        {getEntityDisplayName(l, locale)}
                      </CardLink>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}

        {dataset.nations.length > 0 && (
          <section aria-labelledby="guide-regions" className="space-y-2">
            <h3 id="guide-regions" className="font-display text-base text-ink-100">
              {t('nav.regions')}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {dataset.nations.map((n) => (
                <li key={n.id}>
                  <Link to={entityPath(lang, dataset, 'regions', n.id)!} className="chip hover:border-chakra-500/60 hover:text-white">
                    {getEntityDisplayName(n, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {journeys.length > 0 && (
          <section aria-labelledby="guide-journeys" className="space-y-2">
            <h3 id="guide-journeys" className="font-display text-base text-ink-100">
              {t('nav.journeys')}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {journeys.map((r) => (
                <li key={r.id}>
                  <CardLink
                    href={entityPath(lang, dataset, 'journeys', r.id)!}
                    onOpen={() => {
                      openRoute(r.id);
                      close();
                    }}
                    className="chip hover:border-chakra-500/60 hover:text-white"
                  >
                    {getEntityDisplayName(r, locale)}
                  </CardLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="flex flex-col gap-1 border-t border-ink-800/70 pt-3">
          <Link to={categoryPath(lang, dataset, 'locations')} className="text-chakra-300 hover:underline">
            {t('seoPages.mapGuideAllLocations', { world })} →
          </Link>
          {dataset.nations.length > 0 && (
            <Link to={categoryPath(lang, dataset, 'regions')} className="text-chakra-300 hover:underline">
              {t('seoPages.mapGuideAllRegions', { world })} →
            </Link>
          )}
          {dataset.routes.length > 0 && (
            <Link to={categoryPath(lang, dataset, 'journeys')} className="text-chakra-300 hover:underline">
              {t('seoPages.mapGuideAllJourneys', { world })} →
            </Link>
          )}
        </p>
      </div>
    </details>
  );
}
