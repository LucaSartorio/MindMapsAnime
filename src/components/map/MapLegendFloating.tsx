import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { LocationType, WorldDataset } from '@/types';
import { FloatingPanel } from '@/components/common/FloatingPanel';
import { useMapStore, useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocationTypeLabel } from '@/utils/localization';
import { cn } from '@/lib/cn';
import {
  LOCATION_TYPE_COLOR,
  LOCATION_TYPE_ICON,
  presentLocationTypes,
} from '@/lib/locationTypes';

interface MapLegendFloatingProps {
  dataset: WorldDataset;
}

/**
 * Legenda compatta in basso a sinistra: di default collassata.
 *
 * Oltre a spiegare i simboli, la legenda è anche un filtro rapido: ogni tipo è
 * un toggle (`aria-pressed`) legato a `filters.locationTypes` (stesso stato del
 * drawer, quindi nessuna divergenza). Le voci si adattano al mondo attivo.
 */
export function MapLegendFloating({ dataset }: MapLegendFloatingProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const open = useUiStore((s) => s.isLegendOpen);
  const setOpen = useUiStore((s) => s.setLegend);
  const filters = useMapStore((s) => s.filters);
  const setFilters = useMapStore((s) => s.setFilters);
  const activeTypes = filters.locationTypes;
  const anyTypeFilter = activeTypes.length > 0;

  const types = useMemo(
    () => presentLocationTypes(dataset.locations),
    [dataset.locations],
  );
  const hasSubMaps = useMemo(
    () => dataset.locations.some((l) => l.subMapLevelId),
    [dataset.locations],
  );
  const hasRoutes = dataset.routes.length > 0;
  const hasEvents = dataset.events.length > 0;

  function toggleType(type: LocationType) {
    setFilters({
      locationTypes: activeTypes.includes(type)
        ? activeTypes.filter((x) => x !== type)
        : [...activeTypes, type],
    });
  }

  return (
    <FloatingPanel
      title={t('map.legend.title')}
      icon={<span className="text-[12px]">⌖</span>}
      open={open}
      onOpenChange={setOpen}
      className="max-w-[260px]"
      headerAction={
        anyTypeFilter ? (
          <button
            type="button"
            onClick={() => setFilters({ locationTypes: [] })}
            className="rounded px-2 py-0.5 text-[11px] text-ink-300 transition hover:text-white"
          >
            {t('map.legend.showAll')}
          </button>
        ) : undefined
      }
    >
      <div className="space-y-2 p-3 text-[11px] text-ink-200">
        <ul className="space-y-0.5" aria-label={t('map.legend.title')}>
          {types.map((type) => {
            const active = activeTypes.includes(type);
            // Con un filtro attivo, i tipi non selezionati appaiono attenuati
            // (indizio secondario: lo stato reale è in aria-pressed).
            const dim = anyTypeFilter && !active;
            return (
              <li key={type}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleType(type)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left transition hover:bg-ink-800/50',
                    active && 'bg-chakra-500/15',
                    dim && 'opacity-45',
                  )}
                >
                  <span
                    aria-hidden
                    className="inline-grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px]"
                    style={{
                      color: LOCATION_TYPE_COLOR[type],
                      boxShadow: `inset 0 0 0 1.5px ${LOCATION_TYPE_COLOR[type]}`,
                    }}
                  >
                    {LOCATION_TYPE_ICON[type]}
                  </span>
                  <span className="truncate">{getLocationTypeLabel(type, locale)}</span>
                  {active && (
                    <span aria-hidden className="ml-auto text-chakra-300">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {(hasSubMaps || hasRoutes || hasEvents) && (
          <ul className="space-y-1 border-t border-ink-700/40 pt-2 text-ink-300">
            {hasSubMaps && (
              <li>
                <span className="mr-2 inline-block w-4 text-center text-scroll-200">⤢</span>{' '}
                {t('map.legend.submap')}
              </li>
            )}
            {hasRoutes && (
              <li>
                <span aria-hidden className="mr-2 inline-flex w-4 items-center justify-center align-middle">
                  <svg width="16" height="8" viewBox="0 0 16 8">
                    <line x1="0" y1="4" x2="16" y2="4" stroke="#f5b21a" strokeWidth="2" strokeDasharray="5 3" />
                  </svg>
                </span>{' '}
                {t('map.legend.routes')}
              </li>
            )}
            {hasEvents && (
              <li>
                <span
                  aria-hidden
                  className="mr-2 inline-grid h-4 w-4 place-items-center rounded-full bg-ember-500/90 align-middle text-[9px] font-bold text-white"
                >
                  1
                </span>{' '}
                {t('map.legend.events')}
              </li>
            )}
          </ul>
        )}

        <p className="border-t border-ink-700/40 pt-2 leading-relaxed text-ink-400">
          {t('map.legend.filterHint')}
        </p>
      </div>
    </FloatingPanel>
  );
}
