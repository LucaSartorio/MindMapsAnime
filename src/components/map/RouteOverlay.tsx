import { useMemo } from 'react';
import type { Route, WorldDataset } from '@/types';
import { useMapStore } from '@/store';
import { Badge } from '@/components/common/Badge';

interface RouteOverlayProps {
  dataset: WorldDataset;
}

/**
 * Selettore percorso (in alto a sinistra della mappa).
 * Una volta selezionato un percorso, il canvas evidenzia
 * automaticamente nodi/edges grazie al MapStore.
 */
export function RouteOverlay({ dataset }: RouteOverlayProps) {
  const selectedRouteId = useMapStore((s) => s.selectedRouteId);
  const setSelectedRoute = useMapStore((s) => s.setSelectedRoute);
  const activeMapLevelId = useMapStore((s) => s.activeMapLevelId);

  // Mostriamo solo le route i cui step appartengono al map level corrente.
  // In questo modo il selettore resta contestuale alla mappa attiva.
  const routes = useMemo(
    () =>
      dataset.routes.filter((r) =>
        r.steps.some((s) => {
          const loc = dataset.locations.find((l) => l.id === s.locationId);
          return loc?.mapLevelId === activeMapLevelId;
        }),
      ),
    [dataset.routes, dataset.locations, activeMapLevelId],
  );

  const selected: Route | undefined = useMemo(
    () => dataset.routes.find((r) => r.id === selectedRouteId),
    [dataset.routes, selectedRouteId],
  );

  if (routes.length === 0) return null;

  return (
    <div className="panel p-3 max-w-xs space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-display text-xs uppercase tracking-widest text-chakra-300">
          Percorsi
        </h4>
        {selected && (
          <button
            type="button"
            onClick={() => setSelectedRoute(null)}
            className="text-xs text-ink-300 hover:text-white"
          >
            Reset
          </button>
        )}
      </div>
      <ul className="space-y-1 max-h-40 overflow-auto pr-1">
        {routes.map((r) => {
          const active = r.id === selectedRouteId;
          return (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setSelectedRoute(active ? null : r.id)}
                className={
                  'w-full text-left px-2 py-1.5 rounded-md text-xs transition flex items-center gap-2 ' +
                  (active
                    ? 'bg-ember-500/20 text-ember-100 border border-ember-500/50'
                    : 'hover:bg-ink-800/70 text-ink-200')
                }
              >
                <span
                  aria-hidden
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: r.color ?? '#1f9aff' }}
                />
                {r.name}
              </button>
            </li>
          );
        })}
      </ul>

      {selected && (
        <div className="border-t border-ink-700/60 pt-2 space-y-2">
          <p className="text-[11px] text-ink-300 leading-relaxed">
            {selected.description}
          </p>
          <ol className="space-y-1 text-xs text-ink-200">
            {selected.steps
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((s) => {
                const loc = dataset.locations.find((l) => l.id === s.locationId);
                return (
                  <li
                    key={s.order}
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <Badge>#{s.order}</Badge>
                    <span className="truncate">
                      {s.label ?? loc?.name ?? '—'}
                    </span>
                  </li>
                );
              })}
          </ol>
        </div>
      )}
    </div>
  );
}
