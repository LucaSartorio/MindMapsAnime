import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { useHydrated } from '@/lib/useHydrated';
import { InteractiveMapView } from '@/routes/lazyPages';
import type { ResolvedPage } from '@/seo/metadata';
import { worldMapImage } from '@/seo/images';
import { MapGuide } from './MapGuide';

/**
 * Rotta `/{lang}/{world}/map`: la mappa interattiva resta il cuore del prodotto,
 * ma non è una "scatola nera" per i crawler.
 *
 *  - HTML pre-renderizzato (e primo render client): anteprima statica con
 *    l'immagine della mappa (candidata LCP, precaricata).
 *  - Dopo l'idratazione: React Flow sostituisce l'anteprima. H1 e descrizione
 *    restano come testo accessibile (sr-only) che descrive l'applicazione.
 *  - Sempre (prima E dopo l'idratazione): la `MapGuide`, indice testuale dei
 *    livelli mappa, dei luoghi, delle regioni e dei percorsi con link reali —
 *    così anche la pagina renderizzata da Google ha contesto e link.
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
        <Suspense fallback={<MapStaticPreview dataset={dataset} />}>
          <div className="absolute inset-0">
            <InteractiveMapView dataset={dataset} />
          </div>
        </Suspense>
      ) : (
        <MapStaticPreview dataset={dataset} />
      )}
      <MapGuide resolved={resolved} dataset={dataset} />
    </>
  );
}

function MapStaticPreview({ dataset }: { dataset: WorldDataset }) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const image = worldMapImage(dataset);
  const world = getLocalizedText(dataset.world.title, locale);

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
      <p
        role="status"
        className="absolute bottom-24 left-3 md:bottom-6 md:left-20 panel px-3 py-2 font-mono text-xs uppercase tracking-widest text-chakra-300"
      >
        {t('seoPages.mapLoading')}
      </p>
    </div>
  );
}
