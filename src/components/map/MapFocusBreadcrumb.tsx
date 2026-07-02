import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { useMapStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';

interface MapFocusBreadcrumbProps {
  dataset: WorldDataset;
}

/**
 * Breadcrumb della "focus mode": mostra l'elemento attualmente in evidenza
 * (luogo o percorso selezionato) e permette di uscire dal focus con un tap.
 * Compare solo quando c'è una selezione; altrimenti non occupa spazio.
 */
export function MapFocusBreadcrumb({ dataset }: MapFocusBreadcrumbProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const selectedLocationId = useMapStore((s) => s.selectedLocationId);
  const selectedRouteId = useMapStore((s) => s.selectedRouteId);
  const resetSelections = useMapStore((s) => s.resetSelections);

  if (!selectedLocationId && !selectedRouteId) return null;

  const loc = selectedLocationId
    ? dataset.locations.find((l) => l.id === selectedLocationId)
    : undefined;
  const route = !loc && selectedRouteId
    ? dataset.routes.find((r) => r.id === selectedRouteId)
    : undefined;
  const name = loc
    ? getLocalizedText(loc.localizedName, locale) || loc.name
    : route
      ? getLocalizedText(route.localizedName, locale) || route.name
      : '';
  if (!name) return null;

  return (
    <div className="panel pointer-events-auto inline-flex items-center gap-2 py-1 pl-3 pr-1 text-xs shadow-panel animate-fadeIn">
      <span className="font-mono text-[10px] uppercase tracking-widest text-chakra-300">
        {t('map.focus.label')}
      </span>
      <span className="max-w-[40vw] truncate text-ink-100">{name}</span>
      <button
        type="button"
        onClick={resetSelections}
        aria-label={t('map.focus.exitAria')}
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-ink-300 transition hover:bg-ink-800/70 hover:text-white"
      >
        {t('map.focus.exit')}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
