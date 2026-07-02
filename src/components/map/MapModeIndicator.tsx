import { useTranslation } from 'react-i18next';
import { getMapModeLabel, useMapMode, type MapMode } from '@/lib/mapMode';

// Icona (aria-hidden) per ciascuna modalità non-esplorativa.
const MODE_ICON: Record<Exclude<MapMode, 'explore'>, string> = {
  timeline: '⏱',
  routes: '➤',
  relations: '⚯',
  story: '▶',
};

/**
 * Indica la modalità mappa corrente (§8): un pill VISIBILE per le modalità
 * non-esplorative + una live-region SR persistente che ANNUNCIA ogni cambio
 * (incluso il ritorno a "Esplora"). Legge la sola fonte di verità `useMapMode`,
 * quindi non introduce nuovo stato. Etichette generiche → world-agnostic.
 */
export function MapModeIndicator() {
  const { t } = useTranslation();
  const mode = useMapMode();
  const label = getMapModeLabel(mode, t);

  return (
    <>
      {mode !== 'explore' && (
        <div className="panel pointer-events-none inline-flex items-center gap-1.5 py-1 px-3 text-xs shadow-panel animate-fadeIn">
          <span aria-hidden className="text-chakra-300">
            {MODE_ICON[mode]}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-200">
            {t('map.mode.label')}
          </span>
          <span className="text-ink-100">{label}</span>
        </div>
      )}
      {/* Annuncio SR persistente: reagisce ai cambi di `label`, anche → Esplora. */}
      <div role="status" aria-live="polite" className="sr-only">
        {t('map.mode.announce', { mode: label })}
      </div>
    </>
  );
}
