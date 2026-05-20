import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { useMapStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';

interface TimelineFiltersProps {
  dataset: WorldDataset;
}

/**
 * Filtri compatti per la timeline (locale-aware).
 * I `period` ora possono essere `LocalizedText`: usiamo la stringa nella
 * lingua attiva come chiave del filtro e come label.
 */
export function TimelineFilters({ dataset }: TimelineFiltersProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const filters = useMapStore((s) => s.filters);
  const setFilters = useMapStore((s) => s.setFilters);

  // Periods estratti dalla lingua attiva per coerenza con il filtro.
  const periods = Array.from(
    new Set(
      dataset.events.map((e) => getLocalizedText(e.period, locale)).filter(Boolean),
    ),
  );
  const arcs = dataset.arcs;

  function togglePeriod(p: string) {
    setFilters({
      periods: filters.periods.includes(p)
        ? filters.periods.filter((x) => x !== p)
        : [...filters.periods, p],
    });
  }
  function toggleArc(a: string) {
    setFilters({
      arcIds: filters.arcIds.includes(a)
        ? filters.arcIds.filter((x) => x !== a)
        : [...filters.arcIds, a],
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-widest text-ink-400 font-mono">
          {t('filters.period')}
        </span>
        {periods.map((p) => {
          const active = filters.periods.includes(p);
          return (
            <button
              key={p}
              type="button"
              onClick={() => togglePeriod(p)}
              aria-pressed={active}
              className={
                'px-2 py-0.5 rounded-full text-[11px] border transition ' +
                (active
                  ? 'bg-chakra-500 text-white border-chakra-300'
                  : 'border-ink-600/60 text-ink-200 hover:border-chakra-500/50')
              }
            >
              {p}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-widest text-ink-400 font-mono">
          {t('filters.arc')}
        </span>
        {arcs.map((a) => {
          const active = filters.arcIds.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => toggleArc(a.id)}
              aria-pressed={active}
              className={
                'px-2 py-0.5 rounded-full text-[11px] border transition ' +
                (active
                  ? 'bg-ember-500 text-white border-ember-300'
                  : 'border-ink-600/60 text-ink-200 hover:border-ember-500/50')
              }
            >
              {getLocalizedText(a.localizedName, locale) || a.name}
            </button>
          );
        })}
      </div>
      <label className="ml-auto inline-flex items-center gap-2 text-xs text-ink-200 select-none">
        <input
          type="checkbox"
          checked={filters.canonOnly}
          onChange={(e) => setFilters({ canonOnly: e.target.checked })}
          className="accent-chakra-500"
        />
        {t('filters.canonOnly')}
      </label>
    </div>
  );
}
