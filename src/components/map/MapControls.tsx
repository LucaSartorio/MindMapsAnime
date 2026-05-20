import { Button } from '@/components/common/Button';
import { useMapStore } from '@/store';

/** Pulsanti aggiuntivi accanto al canvas (reset view, reset selezioni). */
export function MapControls() {
  const resetViewport = useMapStore((s) => s.resetViewport);
  const resetSelections = useMapStore((s) => s.resetSelections);

  return (
    <div className="panel inline-flex p-1 gap-1">
      <Button
        variant="ghost"
        onClick={resetViewport}
        aria-label="Reset zoom e centratura"
        className="!py-1.5 !px-2.5 !text-xs"
      >
        Reset vista
      </Button>
      <Button
        variant="ghost"
        onClick={resetSelections}
        aria-label="Reset selezioni mappa"
        className="!py-1.5 !px-2.5 !text-xs"
      >
        Reset selezioni
      </Button>
    </div>
  );
}
