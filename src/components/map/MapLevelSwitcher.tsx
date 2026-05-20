import type { MapLevel } from '@/types';
import { cn } from '@/lib/cn';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';

interface MapLevelSwitcherProps {
  levels: MapLevel[];
  activeId: string | null;
  onChange: (id: string) => void;
}

/** Switch compatto tra livelli mappa (world / konoha / ...). */
export function MapLevelSwitcher({
  levels,
  activeId,
  onChange,
}: MapLevelSwitcherProps) {
  const locale = useLocaleStore((s) => s.locale);
  if (levels.length <= 1) return null;
  return (
    <div className="panel inline-flex items-center p-1 gap-1" role="tablist">
      {levels.map((lvl) => {
        const active = lvl.id === activeId;
        const label = getLocalizedText(lvl.localizedName, locale) || lvl.name;
        return (
          <button
            key={lvl.id}
            type="button"
            onClick={() => onChange(lvl.id)}
            role="tab"
            aria-selected={active}
            aria-pressed={active}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition',
              active
                ? 'bg-chakra-500 text-white shadow-glow'
                : 'text-ink-200 hover:bg-ink-800/80',
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
