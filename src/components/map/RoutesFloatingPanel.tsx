import { useMemo } from 'react';
import type { WorldDataset } from '@/types';
import { FloatingPanel } from '@/components/common/FloatingPanel';
import { useMapStore, useUiStore } from '@/store';
import { Button } from '@/components/common/Button';

interface RoutesFloatingPanelProps {
  dataset: WorldDataset;
}

/**
 * Pannello compatto dei percorsi (in basso a destra).
 * Mostra solo le route che hanno step nel map level corrente.
 */
export function RoutesFloatingPanel({ dataset }: RoutesFloatingPanelProps) {
  const open = useUiStore((s) => s.isRoutesPanelOpen);
  const setOpen = useUiStore((s) => s.setRoutesPanel);
  const openRouteModal = useUiStore((s) => s.openRouteModal);
  const selectedRouteId = useMapStore((s) => s.selectedRouteId);
  const setSelectedRoute = useMapStore((s) => s.setSelectedRoute);
  const activeMapLevelId = useMapStore((s) => s.activeMapLevelId);

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

  const selected = routes.find((r) => r.id === selectedRouteId);

  return (
    <FloatingPanel
      title="Percorsi"
      icon={<span className="text-[12px]">↯</span>}
      open={open}
      onOpenChange={setOpen}
      className="max-w-[320px] max-h-[60dvh]"
      headerAction={
        selected ? (
          <button
            type="button"
            onClick={() => setSelectedRoute(null)}
            className="text-[11px] text-ink-300 hover:text-white px-2 py-0.5 rounded"
          >
            Reset
          </button>
        ) : undefined
      }
    >
      {routes.length === 0 ? (
        <div className="p-4 text-xs text-ink-300">
          Nessun percorso in questo livello mappa.
        </div>
      ) : (
        <div className="p-3 space-y-2">
          <ul className="space-y-1">
            {routes.map((r) => {
              const active = r.id === selectedRouteId;
              return (
                <li key={r.id}>
                  <div
                    className={
                      'group flex items-center gap-2 px-2 py-1.5 rounded-md transition ' +
                      (active
                        ? 'bg-ember-500/20 border border-ember-500/50'
                        : 'border border-transparent hover:bg-ink-800/70')
                    }
                  >
                    <span
                      aria-hidden
                      className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: r.color ?? '#1f9aff' }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRoute(active ? null : r.id)
                      }
                      className="flex-1 min-w-0 text-left text-xs text-ink-100 truncate"
                    >
                      {r.name}
                    </button>
                    <span className="text-[10px] text-ink-400 shrink-0">
                      {r.steps.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => openRouteModal(r.id)}
                      aria-label={`Dettagli percorso ${r.name}`}
                      className="opacity-60 group-hover:opacity-100 h-6 w-6 grid place-items-center rounded text-ink-200 hover:text-white hover:bg-ink-700/70 shrink-0"
                    >
                      ⓘ
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {selected && (
            <div className="border-t border-ink-700/60 pt-2 space-y-2">
              <p className="text-[11px] text-ink-300 leading-relaxed">
                {selected.description}
              </p>
              <Button
                variant="ghost"
                onClick={() => openRouteModal(selected.id)}
                className="!py-1 !px-2 !text-[11px] w-full justify-center"
              >
                Apri dettagli percorso →
              </Button>
            </div>
          )}
        </div>
      )}
    </FloatingPanel>
  );
}
