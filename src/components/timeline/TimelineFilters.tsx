import type { WorldDataset } from '@/types';
import { useMapStore } from '@/store';

interface TimelineFiltersProps {
  dataset: WorldDataset;
}

/**
 * Filtri compatti per la timeline.
 * Riusa lo stesso MapFilters globale per coerenza con la mappa.
 */
export function TimelineFilters({ dataset }: TimelineFiltersProps) {
  const filters = useMapStore((s) => s.filters);
  const setFilters = useMapStore((s) => s.setFilters);

  const periods = Array.from(new Set(dataset.events.map((e) => e.period)));
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
          Periodo
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
          Arco
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
              {a.name}
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
        Solo canon
      </label>
    </div>
  );
}
