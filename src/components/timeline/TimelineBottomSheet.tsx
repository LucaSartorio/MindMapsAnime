import { useMemo } from 'react';
import type { WorldDataset } from '@/types';
import { useMapStore, useUiStore } from '@/store';
import { filterEvents } from '@/lib/filters';
import { TimelineEventCard } from './TimelineEventCard';
import { TimelineFilters } from './TimelineFilters';
import { EmptyState } from '@/components/common/EmptyState';

interface TimelineBottomSheetProps {
  dataset: WorldDataset;
}

/**
 * Bottom sheet della timeline narrativa.
 * - barra compatta di default in basso
 * - si espande mostrando filtri + card scrollabili orizzontalmente
 * - se è selezionato un percorso/luogo, filtra automaticamente gli eventi
 * - bottone "Mostra tutto" per resettare il filtro contestuale
 */
export function TimelineBottomSheet({ dataset }: TimelineBottomSheetProps) {
  const open = useUiStore((s) => s.isTimelineOpen);
  const toggle = useUiStore((s) => s.toggleTimeline);
  const filters = useMapStore((s) => s.filters);
  const selectedEventId = useMapStore((s) => s.selectedTimelineEventId);
  const selectedRouteId = useMapStore((s) => s.selectedRouteId);
  const selectedLocationId = useMapStore((s) => s.selectedLocationId);
  const setSelectedRoute = useMapStore((s) => s.setSelectedRoute);
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);

  const route = useMemo(
    () =>
      selectedRouteId
        ? dataset.routes.find((r) => r.id === selectedRouteId)
        : undefined,
    [dataset.routes, selectedRouteId],
  );

  const events = useMemo(() => {
    let base = filterEvents(dataset.events, filters);
    // Filtro contestuale: percorso o luogo selezionato
    if (route) {
      const ids = new Set(
        route.steps.map((s) => s.eventId).filter(Boolean) as string[],
      );
      const locIds = new Set(route.steps.map((s) => s.locationId));
      base = base.filter(
        (e) =>
          ids.has(e.id) ||
          (e.locationId !== undefined && locIds.has(e.locationId)),
      );
    } else if (selectedLocationId) {
      base = base.filter((e) => e.locationId === selectedLocationId);
    }
    return base.sort((a, b) => a.order - b.order);
  }, [dataset.events, filters, route, selectedLocationId]);

  const contextLabel = route
    ? `Filtrata su percorso · ${route.name}`
    : selectedLocationId
      ? `Filtrata su luogo selezionato`
      : null;

  return (
    <section
      aria-label="Timeline narrativa"
      className="panel pointer-events-auto overflow-hidden flex flex-col w-full"
    >
      <header
        className="flex items-center justify-between gap-3 px-3 py-1.5 cursor-pointer select-none"
        onClick={toggle}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span aria-hidden className="text-chakra-300">
            ⌛
          </span>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300">
            Timeline narrativa
          </h3>
          <span className="text-[10px] text-ink-400 shrink-0">
            {events.length} eventi
          </span>
          {contextLabel && (
            <span className="hidden sm:inline text-[10px] text-ember-300 truncate">
              · {contextLabel}
            </span>
          )}
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="timeline-body"
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          className="btn-ghost !py-0.5 !px-2 text-[11px]"
        >
          {open ? '▾ Riduci' : '▸ Espandi'}
        </button>
      </header>
      {open && (
        <div
          id="timeline-body"
          className="px-3 pb-3 flex flex-col gap-2 max-h-[40dvh]"
        >
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <TimelineFilters dataset={dataset} />
            {(route || selectedLocationId) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedRoute(null);
                  setSelectedLocation(null);
                }}
                className="text-[11px] text-ink-300 hover:text-white px-2 py-0.5 rounded"
              >
                Mostra tutto
              </button>
            )}
          </div>
          {events.length === 0 ? (
            <EmptyState
              title="Nessun evento corrispondente"
              description="Rimuovi qualche filtro per vedere più eventi."
            />
          ) : (
            <ol className="flex gap-3 overflow-x-auto pb-2 snap-x">
              {events.map((e) => (
                <li key={e.id}>
                  <TimelineEventCard
                    event={e}
                    dataset={dataset}
                    active={e.id === selectedEventId}
                  />
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </section>
  );
}
