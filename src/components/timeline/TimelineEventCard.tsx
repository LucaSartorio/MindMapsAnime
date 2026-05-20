import type { TimelineEvent, WorldDataset } from '@/types';
import { CanonPill, ReferencePill } from '@/components/common/StatusPill';
import { useMapStore } from '@/store';
import { cn } from '@/lib/cn';

interface TimelineEventCardProps {
  event: TimelineEvent;
  dataset: WorldDataset;
  active?: boolean;
}

export function TimelineEventCard({
  event,
  dataset,
  active,
}: TimelineEventCardProps) {
  const setSelectedEvent = useMapStore((s) => s.setSelectedTimelineEvent);
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);
  const location = event.locationId
    ? dataset.locations.find((l) => l.id === event.locationId)
    : undefined;

  function handleClick() {
    setSelectedEvent(event.id);
    if (location) {
      setActiveMapLevel(location.mapLevelId);
      setSelectedLocation(location.id);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'snap-start min-w-[260px] max-w-[260px] text-left panel-soft p-3 transition',
        active
          ? 'border-ember-500/70 shadow-ember'
          : 'hover:border-chakra-500/60',
      )}
    >
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-ink-400 mb-1 font-mono">
        <span>#{event.order}</span>
        <span>{event.period}</span>
      </div>
      <h4 className="text-sm font-semibold text-ink-100 line-clamp-2">
        {event.title}
      </h4>
      <p className="mt-1 text-xs text-ink-300 line-clamp-3 leading-relaxed">
        {event.description}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        <CanonPill canon={event.canon} />
        <ReferencePill status={event.referenceStatus} />
        {location && (
          <span className="chip text-[10px]">
            <span className="text-chakra-300">⌖</span> {location.name}
          </span>
        )}
      </div>
    </button>
  );
}
