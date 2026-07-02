import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { VisibleLayers, WorldDataset } from '@/types';
import { getPlacesTerm } from '@/lib/worldConfig';
import { Drawer } from '@/components/common/Drawer';
import { Button } from '@/components/common/Button';
import { FilterSection } from '@/components/filters/FilterSection';
import { ToggleRow } from '@/components/filters/ToggleRow';
import { useMapStore, useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';

interface LayersDrawerProps {
  dataset: WorldDataset;
}

/**
 * Gestore dei "livelli" della mappa: decide COSA è visibile (pin per importanza,
 * confini, etichette, rotte, eventi, archi). Separato dai filtri (che scelgono
 * QUALI dati) per un modello mentale chiaro. Condivide lo stesso store, quindi
 * mappa e conteggi restano sincronizzati.
 */
export function LayersDrawer({ dataset }: LayersDrawerProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const open = useUiStore((s) => s.isLayersDrawerOpen);
  const close = useUiStore((s) => s.closeLayersDrawer);
  const filters = useMapStore((s) => s.filters);
  const setFilters = useMapStore((s) => s.setFilters);
  const visibleLayers = useMapStore((s) => s.visibleLayers);
  const setVisibleLayer = useMapStore((s) => s.setVisibleLayer);
  const resetLayers = useMapStore((s) => s.resetLayers);

  const everOpenedRef = useRef(false);
  if (open) everOpenedRef.current = true;

  function toggleLayer<K extends keyof VisibleLayers>(layer: K) {
    setVisibleLayer(layer, !visibleLayers[layer] as VisibleLayers[K]);
  }

  const hasBoundaries = (dataset.boundaries?.length ?? 0) > 0;
  const placesTerm = getPlacesTerm(dataset.world, locale, t('filters.placesDefault'));

  return (
    <Drawer
      open={open}
      side="left"
      onClose={close}
      ariaLabel={t('map.layers.title')}
      className="w-[92vw] sm:max-w-sm"
    >
      {everOpenedRef.current && (
        <div className="flex h-full flex-col">
          <header className="flex shrink-0 items-center justify-between gap-2 border-b border-ink-700/60 px-4 py-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-chakra-300">
                {dataset.world.title}
              </p>
              <h2 className="font-display text-base text-ink-100">
                {t('map.layers.title')}
              </h2>
              <p className="mt-0.5 text-[11px] text-ink-400">{t('map.layers.subtitle')}</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={t('filters.close')}
              className="grid h-9 w-9 place-items-center rounded-md text-ink-300 transition hover:bg-ink-800/70 hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          <div className="flex-1 space-y-1 overflow-auto px-4 py-2 text-sm">
            <FilterSection title={t('filters.layersMap')}>
              <div className="space-y-0.5">
                {hasBoundaries && (
                  <ToggleRow
                    checked={visibleLayers.boundaries}
                    onChange={() => toggleLayer('boundaries')}
                    label={t('filters.showBoundaries')}
                  />
                )}
                <ToggleRow
                  checked={visibleLayers.nationLabels}
                  onChange={() => toggleLayer('nationLabels')}
                  label={t('filters.showNationLabels')}
                />
                <ToggleRow
                  checked={visibleLayers.mainVillages}
                  onChange={() => toggleLayer('mainVillages')}
                  label={t('filters.showMainVillages', { places: placesTerm })}
                />
                <ToggleRow
                  checked={visibleLayers.minorVillages}
                  onChange={() => toggleLayer('minorVillages')}
                  label={t('filters.showMinorVillages', { places: placesTerm })}
                />
                <ToggleRow
                  checked={visibleLayers.specialPlaces}
                  onChange={() => toggleLayer('specialPlaces')}
                  label={t('filters.showSpecialPlaces')}
                />
              </div>
            </FilterSection>

            <FilterSection title={t('filters.layersStory')}>
              <div className="space-y-0.5">
                <ToggleRow
                  checked={filters.showRoutes}
                  onChange={(v) => setFilters({ showRoutes: v })}
                  label={t('filters.showRoutes')}
                />
                <ToggleRow
                  checked={visibleLayers.routesCanon}
                  onChange={() => toggleLayer('routesCanon')}
                  label={t('filters.routesCanon')}
                />
                <ToggleRow
                  checked={visibleLayers.routesNonCanon}
                  onChange={() => toggleLayer('routesNonCanon')}
                  label={t('filters.routesNonCanon')}
                />
                <ToggleRow
                  checked={visibleLayers.eventsCanon}
                  onChange={() => toggleLayer('eventsCanon')}
                  label={t('filters.eventsCanon')}
                />
                <ToggleRow
                  checked={visibleLayers.eventsNonCanon}
                  onChange={() => toggleLayer('eventsNonCanon')}
                  label={t('filters.eventsNonCanon')}
                />
                <ToggleRow
                  checked={visibleLayers.arcsCanon}
                  onChange={() => toggleLayer('arcsCanon')}
                  label={t('filters.arcsCanon')}
                />
                <ToggleRow
                  checked={visibleLayers.arcsNonCanon}
                  onChange={() => toggleLayer('arcsNonCanon')}
                  label={t('filters.arcsNonCanon')}
                />
              </div>
            </FilterSection>
          </div>

          <footer className="flex shrink-0 items-center gap-2 border-t border-ink-700/60 px-4 py-3">
            <Button
              variant="ghost"
              onClick={() => {
                resetLayers();
                setFilters({ showRoutes: true });
              }}
            >
              {t('map.layers.reset')}
            </Button>
            <Button variant="primary" onClick={close} className="ml-auto">
              {t('filters.apply')}
            </Button>
          </footer>
        </div>
      )}
    </Drawer>
  );
}
