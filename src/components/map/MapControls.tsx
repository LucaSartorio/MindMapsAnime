import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/common/IconButton';
import { useMapStore } from '@/store';

/**
 * Cluster di icone in alto a destra:
 *  - Reset vista (fitView)
 *  - Reset selezioni
 */
export function MapControls() {
  const { t } = useTranslation();
  const resetViewport = useMapStore((s) => s.resetViewport);
  const resetSelections = useMapStore((s) => s.resetSelections);

  return (
    <div className="panel inline-flex p-1 gap-1">
      <IconButton
        aria-label={t('map.controls.resetView')}
        title={t('map.controls.resetView')}
        onClick={resetViewport}
      >
        <span aria-hidden>⤾</span>
      </IconButton>
      <IconButton
        aria-label={t('map.controls.resetSelections')}
        title={t('map.controls.resetSelections')}
        onClick={resetSelections}
      >
        <span aria-hidden>⊘</span>
      </IconButton>
    </div>
  );
}
