import type { LocationType, WorldDataset } from '@/types';
import { useMapStore } from '@/store';
import { Button } from '@/components/common/Button';

interface LeftFiltersPanelProps {
  dataset: WorldDataset;
}

const LOCATION_TYPE_LABELS: { type: LocationType; label: string }[] = [
  { type: 'village', label: 'Villaggi' },
  { type: 'city', label: 'Città' },
  { type: 'nation', label: 'Nazioni' },
  { type: 'landmark', label: 'Landmark' },
  { type: 'battlefield', label: 'Battaglie' },
  { type: 'hideout', label: 'Nascondigli' },
  { type: 'sacred_place', label: 'Sacri' },
  { type: 'training_area', label: 'Allenamento' },
  { type: 'region', label: 'Regioni' },
  { type: 'ruins', label: 'Rovine' },
  { type: 'bridge', label: 'Ponti' },
  { type: 'forest', label: 'Foreste' },
];

export function LeftFiltersPanel({ dataset }: LeftFiltersPanelProps) {
  const filters = useMapStore((s) => s.filters);
  const setFilters = useMapStore((s) => s.setFilters);
  const reset = useMapStore((s) => s.resetFilters);

  function toggleType(t: LocationType) {
    setFilters({
      locationTypes: filters.locationTypes.includes(t)
        ? filters.locationTypes.filter((x) => x !== t)
        : [...filters.locationTypes, t],
    });
  }
  function toggleNation(n: string) {
    setFilters({
      nationIds: filters.nationIds.includes(n)
        ? filters.nationIds.filter((x) => x !== n)
        : [...filters.nationIds, n],
    });
  }
  function toggleImportance(i: 'main' | 'secondary' | 'minor') {
    setFilters({
      importance: filters.importance.includes(i)
        ? filters.importance.filter((x) => x !== i)
        : [...filters.importance, i],
    });
  }

  return (
    <div className="h-full flex flex-col">
      <header className="px-4 py-3 border-b border-ink-700/60 flex items-center justify-between gap-2 shrink-0">
        <h2 className="font-display text-sm uppercase tracking-widest text-chakra-300">
          Filtri mappa
        </h2>
        <button
          type="button"
          onClick={reset}
          className="text-xs text-ink-300 hover:text-white"
        >
          Reset
        </button>
      </header>
      <div className="flex-1 overflow-auto p-4 space-y-5 text-sm">
        <section>
          <h3 className="text-xs uppercase tracking-widest text-ink-400 font-mono mb-2">
            Tipo luogo
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {LOCATION_TYPE_LABELS.map(({ type, label }) => {
              const active = filters.locationTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  aria-pressed={active}
                  className={
                    'px-2 py-0.5 rounded-full text-[11px] border transition ' +
                    (active
                      ? 'bg-chakra-500 text-white border-chakra-300'
                      : 'border-ink-600/60 text-ink-200 hover:border-chakra-500/50')
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-xs uppercase tracking-widest text-ink-400 font-mono mb-2">
            Nazione
          </h3>
          <div className="space-y-1">
            {dataset.nations.map((n) => {
              const active = filters.nationIds.includes(n.id);
              return (
                <label
                  key={n.id}
                  className="flex items-center gap-2 text-ink-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleNation(n.id)}
                    className="accent-chakra-500"
                  />
                  <span
                    aria-hidden
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ background: n.color ?? '#5b6275' }}
                  />
                  {n.name}
                </label>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-xs uppercase tracking-widest text-ink-400 font-mono mb-2">
            Importanza
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {(['main', 'secondary', 'minor'] as const).map((i) => {
              const active = filters.importance.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleImportance(i)}
                  className={
                    'px-2 py-0.5 rounded-full text-[11px] border capitalize transition ' +
                    (active
                      ? 'bg-ember-500 text-white border-ember-300'
                      : 'border-ink-600/60 text-ink-200 hover:border-ember-500/50')
                  }
                >
                  {i}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-xs uppercase tracking-widest text-ink-400 font-mono mb-2">
            Layer
          </h3>
          <div className="space-y-2 text-ink-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showRoutes}
                onChange={(e) => setFilters({ showRoutes: e.target.checked })}
                className="accent-chakra-500"
              />
              Mostra percorsi
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showEvents}
                onChange={(e) => setFilters({ showEvents: e.target.checked })}
                className="accent-chakra-500"
              />
              Mostra eventi (timeline)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showFactions}
                onChange={(e) => setFilters({ showFactions: e.target.checked })}
                className="accent-chakra-500"
              />
              Mostra clan/fazioni
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.canonOnly}
                onChange={(e) => setFilters({ canonOnly: e.target.checked })}
                className="accent-ember-500"
              />
              Solo canon
            </label>
          </div>
        </section>
      </div>
      <footer className="px-4 py-3 border-t border-ink-700/60 shrink-0">
        <Button variant="ghost" onClick={reset} className="w-full">
          Reset tutti i filtri
        </Button>
      </footer>
    </div>
  );
}
