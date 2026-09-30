import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getEntityDisplayName, getLocalizedText } from '@/utils/localization';
import { useHydrated } from '@/lib/useHydrated';
import { InteractiveMapView } from '@/routes/lazyPages';
import type { ResolvedPage } from '@/seo/metadata';
import { seoLocations } from '@/seo/categories';
import { categoryPath, entityPath } from '@/seo/paths';
import { worldMapImage } from '@/seo/images';

/**
 * Rotta `/{lang}/{world}/map`: la mappa interattiva resta il cuore del prodotto,
 * ma non è una "scatola nera" per i crawler.
 *
 *  - HTML pre-renderizzato (e primo render client): anteprima statica con
 *    l'immagine della mappa (candidata LCP, precaricata) + un indice di link
 *    reali a regioni, luoghi principali e percorsi. Utile anche a chi ha una
 *    connessione lenta o JS disattivato.
 *  - Dopo l'idratazione: React Flow sostituisce l'anteprima. H1 e descrizione
 *    restano come testo accessibile (sr-only) che descrive l'applicazione.
 */
export function MapPage({ resolved, dataset }: { resolved: ResolvedPage; dataset: WorldDataset }) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const hydrated = useHydrated();
  const world = getLocalizedText(dataset.world.title, locale);

  return (
    <>
      <h1 className="sr-only">{t('seoPages.mapH1', { world })}</h1>
      <p className="sr-only">{t('seoPages.mapLead', { world })}</p>
      {hydrated ? (
        <Suspense fallback={<MapStaticPreview resolved={resolved} dataset={dataset} />}>
          <div className="absolute inset-0">
            <InteractiveMapView dataset={dataset} />
          </div>
        </Suspense>
      ) : (
        <MapStaticPreview resolved={resolved} dataset={dataset} />
      )}
    </>
  );
}

const PREVIEW_PLACES = 24;

function MapStaticPreview({ resolved, dataset }: { resolved: ResolvedPage; dataset: WorldDataset }) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const lang = resolved.lang;
  const image = worldMapImage(dataset);
  const world = getLocalizedText(dataset.world.title, locale);
  const places = seoLocations(dataset)
    .filter((l) => l.importance === 'main')
    .slice(0, PREVIEW_PLACES);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {image && (
        <img
          src={image.url}
          width={image.width}
          height={image.height}
          alt={t('seoPages.mapImageAlt', { world })}
          decoding="async"
          {...({ fetchpriority: 'high' } as Record<string, string>)}
          className="absolute inset-0 h-full w-full object-contain select-none opacity-70"
        />
      )}
      <div className="absolute inset-x-3 bottom-24 md:bottom-6 md:left-20 md:right-auto md:max-w-md panel p-4 max-h-[55%] overflow-auto space-y-3 text-sm">
        <p role="status" className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          {t('seoPages.mapLoading')}
        </p>
        <h2 className="font-display text-lg text-ink-100">{t('seoPages.mapIndexTitle')}</h2>
        {dataset.nations.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label={t('nav.regions')}>
            {dataset.nations.map((n) => (
              <li key={n.id}>
                <Link to={entityPath(lang, dataset, 'regions', n.id)!} className="chip">
                  {getEntityDisplayName(n, locale)}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <ul className="flex flex-wrap gap-1.5" aria-label={t('seoPages.mainLocations')}>
          {places.map((l) => (
            <li key={l.id}>
              <Link to={entityPath(lang, dataset, 'locations', l.id)!} className="chip">
                {getEntityDisplayName(l, locale)}
              </Link>
            </li>
          ))}
        </ul>
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <Link to={categoryPath(lang, dataset, 'locations')} className="text-chakra-300 hover:underline">
            {t('nav.locations')} →
          </Link>
          {dataset.routes.length > 0 && (
            <Link to={categoryPath(lang, dataset, 'journeys')} className="text-chakra-300 hover:underline">
              {t('nav.journeys')} →
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}
