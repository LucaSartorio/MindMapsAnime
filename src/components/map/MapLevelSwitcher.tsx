import type { MapLevel } from '@/types';
import { cn } from '@/lib/cn';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';

interface MapLevelSwitcherProps {
  levels: MapLevel[];
  activeId: string | null;
  onChange: (id: string) => void;
}

/**
 * Switch contestuale tra livelli mappa.
 *
 * Con molte sotto-mappe non mostriamo tutti i livelli: visualizziamo solo
 * il livello "world" (radice) e l'eventuale sotto-mappa attiva. Questo
 * fornisce anche l'affordance "torna alla world map" senza ingombrare.
 */
export function MapLevelSwitcher({
  levels,
  activeId,
  onChange,
}: MapLevelSwitcherProps) {
  const locale = useLocaleStore((s) => s.locale);
  if (levels.length <= 1) return null;

  const worldLevel = levels.find((l) => !l.parentLevelId) ?? levels[0];
  const activeLevel = levels.find((l) => l.id === activeId);
  const isSubmap = activeLevel && activeLevel.parentLevelId;

  // Tab da mostrare: sempre world; se siamo in una sotto-mappa, anche quella.
  const tabs: MapLevel[] = isSubmap ? [worldLevel, activeLevel] : [worldLevel];

  return (
    <div className="panel inline-flex items-center p-1 gap-1" role="tablist">
      {tabs.map((lvl) => {
        const active = lvl.id === activeId;
        const label = getLocalizedText(lvl.localizedName, locale) || lvl.name;
        const isWorld = !lvl.parentLevelId;
        return (
          <button
            key={lvl.id}
            type="button"
            onClick={() => onChange(lvl.id)}
            role="tab"
            aria-selected={active}
            aria-pressed={active}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition inline-flex items-center gap-1',
              active
                ? 'bg-chakra-500 text-white shadow-glow'
                : 'text-ink-200 hover:bg-ink-800/80',
            )}
          >
            {isWorld && isSubmap && <span aria-hidden>←</span>}
            {label}
          </button>
        );
      })}
    </div>
  );
}
