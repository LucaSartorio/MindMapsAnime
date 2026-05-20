import type { MapLevel } from '@/types';
import { cn } from '@/lib/cn';

interface MapLevelSwitcherProps {
  levels: MapLevel[];
  activeId: string | null;
  onChange: (id: string) => void;
}

export function MapLevelSwitcher({
  levels,
  activeId,
  onChange,
}: MapLevelSwitcherProps) {
  if (levels.length <= 1) return null;
  return (
    <div className="panel inline-flex items-center p-1 gap-1">
      {levels.map((lvl) => {
        const active = lvl.id === activeId;
        return (
          <button
            key={lvl.id}
            type="button"
            onClick={() => onChange(lvl.id)}
            aria-pressed={active}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition',
              active
                ? 'bg-chakra-500 text-white shadow-glow'
                : 'text-ink-200 hover:bg-ink-800/80',
            )}
          >
            {lvl.name}
          </button>
        );
      })}
    </div>
  );
}
