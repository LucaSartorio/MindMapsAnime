import { useMapStore } from '@/store/useMapStore';
import { useUiStore } from '@/store/useUiStore';

/**
 * Modalità di interazione con la mappa (§8 del brief). È un ENUM unico e
 * centralizzato, ma DERIVATO dallo stato già presente negli store: nessuna
 * duplicazione, nessun refactor distruttivo, un'unica fonte di verità che
 * componenti e a11y possono leggere invece di ricontrollare i vari flag.
 */
export type MapMode = 'explore' | 'timeline' | 'routes' | 'relations' | 'story';

/**
 * Priorità: story > relations > routes > timeline > explore.
 * (La storia guidata è la più immersiva e chiude le modali; le relazioni sono
 * una modale; un percorso selezionato "guida" la mappa; la timeline è un
 * pannello; altrimenti si esplora.)
 */
export function useMapMode(): MapMode {
  const storyArcId = useUiStore((s) => s.storyArcId);
  const relationsOpen = useUiStore((s) => s.activeModal?.kind === 'relations');
  const timelineOpen = useUiStore((s) => s.isTimelineOpen);
  const selectedRouteId = useMapStore((s) => s.selectedRouteId);

  if (storyArcId) return 'story';
  if (relationsOpen) return 'relations';
  if (selectedRouteId) return 'routes';
  if (timelineOpen) return 'timeline';
  return 'explore';
}

/** Etichetta localizzata della modalità (chiavi `map.mode.*`). */
export function getMapModeLabel(mode: MapMode, t: (key: string) => string): string {
  return t(`map.mode.${mode}`);
}
