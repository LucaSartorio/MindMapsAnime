import { useCallback } from 'react';
import { useUiStore } from '@/store/useUiStore';
import type { EntityRef } from '@/lib/graph';

/**
 * Dispatcher unico "apri la scheda di un `EntityRef`". Centralizza lo switch
 * type→opener che altrimenti verrebbe duplicato in ogni scheda. I nodi-gruppo
 * (race/saga) non hanno scheda propria: i consumer mostrano i loro membri, non
 * il nodo, quindi qui non arrivano mai.
 */
export function useOpenEntityRef(): (ref: EntityRef) => void {
  const openLocation = useUiStore((s) => s.openLocationModal);
  const openCharacter = useUiStore((s) => s.openCharacterModal);
  const openEvent = useUiStore((s) => s.openEventModal);
  const openArc = useUiStore((s) => s.openArcModal);
  const openFaction = useUiStore((s) => s.openFactionModal);
  const openRoute = useUiStore((s) => s.openRouteModal);
  const openNation = useUiStore((s) => s.openNationModal);
  const openJutsu = useUiStore((s) => s.openJutsuModal);

  return useCallback(
    (ref: EntityRef) => {
      switch (ref.type) {
        case 'place':
          return openLocation(ref.id);
        case 'character':
          return openCharacter(ref.id);
        case 'event':
          return openEvent(ref.id);
        case 'arc':
          return openArc(ref.id);
        case 'faction':
          return openFaction(ref.id);
        case 'route':
          return openRoute(ref.id);
        case 'nation':
          return openNation(ref.id);
        case 'technique':
          return openJutsu(ref.id);
        default:
          return undefined;
      }
    },
    [openLocation, openCharacter, openEvent, openArc, openFaction, openRoute, openNation, openJutsu],
  );
}
