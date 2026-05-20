import { IconButton } from '@/components/common/IconButton';
import { useMapStore } from '@/store';

/**
 * Cluster di icone in alto a destra:
 *  - Reset vista (fitView)
 *  - Reset selezioni
 */
export function MapControls() {
  const resetViewport = useMapStore((s) => s.resetViewport);
  const resetSelections = useMapStore((s) => s.resetSelections);

  return (
    <div className="panel inline-flex p-1 gap-1">
      <IconButton
        aria-label="Reset zoom e centratura"
        title="Reset vista"
        onClick={resetViewport}
      >
        <span aria-hidden>⤾</span>
      </IconButton>
      <IconButton
        aria-label="Reset selezioni mappa"
        title="Reset selezioni"
        onClick={resetSelections}
      >
        <span aria-hidden>⊘</span>
      </IconButton>
    </div>
  );
}
