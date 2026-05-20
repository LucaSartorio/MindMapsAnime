import { useMemo } from 'react';
import type { WorldDataset } from '@/types';
import { useMapStore, useUiStore } from '@/store';
import { filterEvents } from '@/lib/filters';
import { TimelineEventCard } from './TimelineEventCard';
import { TimelineFilters } from './TimelineFilters';
import { EmptyState } from '@/components/common/EmptyState';

interface TimelineProps {
  dataset: WorldDataset;
}

export function Timeline({ dataset }: TimelineProps) {
  const filters = useMapStore((s) => s.filters);
  const selectedEventId = useMapStore((s) => s.selectedTimelineEventId);
  const open = useUiStore((s) => s.timelineOpen);
  const toggle = useUiStore((s) => s.toggleTimeline);

  const events = useMemo(
    () => filterEvents(dataset.events, filters).sort((a, b) => a.order - b.order),
    [dataset.events, filters],
  );

  return (
    <section
      aria-label="Timeline narrativa"
      className="border-t border-ink-700/60 bg-ink-950/85 backdrop-blur-md"
    >
      <header className="flex items-center justify-between gap-3 px-4 py-2 cursor-default">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-sm uppercase tracking-widest text-chakra-300">
            Timeline narrativa
          </h3>
          <span className="text-[11px] text-ink-400">
            {events.length} eventi
          </span>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="timeline-body"
          onClick={toggle}
          className="btn-ghost !py-1 !px-2 text-xs"
        >
          {open ? '▾ Riduci' : '▸ Espandi'}
        </button>
      </header>
      {open && (
        <div id="timeline-body" className="px-4 pb-4 flex flex-col gap-3">
          <TimelineFilters dataset={dataset} />
          {events.length === 0 ? (
            <EmptyState
              title="Nessun evento corrispondente"
              description="Rimuovi qualche filtro per vedere più eventi nella timeline."
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
