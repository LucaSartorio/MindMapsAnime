import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { FloatingPanel } from '@/components/common/FloatingPanel';
import { useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocationTypeLabel } from '@/utils/localization';
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
 * Le voci sono derivate dai tipi di luogo realmente presenti nel mondo attivo
 * e usano le stesse icone dei pin (`LOCATION_TYPE_ICON`), così la legenda si
 * adatta a ogni anime senza elenchi hardcodati.
 */
export function MapLegendFloating({ dataset }: MapLegendFloatingProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const open = useUiStore((s) => s.isLegendOpen);
  const setOpen = useUiStore((s) => s.setLegend);

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

  return (
    <FloatingPanel
      title={t('map.legend.title')}
      icon={<span className="text-[12px]">⌖</span>}
      open={open}
      onOpenChange={setOpen}
      className="max-w-[260px]"
    >
      <div className="p-3 text-[11px] text-ink-200 space-y-2">
        <ul className="space-y-1">
          {types.map((type) => (
            <li key={type} className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-grid h-4 w-4 place-items-center rounded-full text-[10px]"
                style={{
                  color: LOCATION_TYPE_COLOR[type],
                  boxShadow: `inset 0 0 0 1.5px ${LOCATION_TYPE_COLOR[type]}`,
                }}
              >
                {LOCATION_TYPE_ICON[type]}
              </span>
              {getLocationTypeLabel(type, locale)}
            </li>
          ))}
          {hasSubMaps && (
            <li className="text-ink-300">
              <span className="text-scroll-200 mr-2 inline-block w-4 text-center">
                ⤢
              </span>{' '}
              {t('map.legend.submap')}
            </li>
          )}
          {hasRoutes && (
            <li className="text-ink-300">
              <span aria-hidden className="mr-2 inline-flex w-4 items-center justify-center align-middle">
                <svg width="16" height="8" viewBox="0 0 16 8">
                  <line
                    x1="0"
                    y1="4"
                    x2="16"
                    y2="4"
                    stroke="#f5b21a"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                  />
                </svg>
              </span>{' '}
              {t('map.legend.routes')}
            </li>
          )}
          {hasEvents && (
            <li className="text-ink-300">
              <span
                aria-hidden
                className="mr-2 inline-grid h-4 w-4 place-items-center rounded-full bg-ember-500/90 text-[9px] font-bold text-white align-middle"
              >
                1
              </span>{' '}
              {t('map.legend.events')}
            </li>
          )}
        </ul>
        <hr className="border-ink-700/40" />
        <p className="text-ink-300 leading-relaxed">{t('map.legend.hint')}</p>
      </div>
    </FloatingPanel>
  );
}
