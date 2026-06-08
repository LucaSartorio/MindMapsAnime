import type { Location } from '@/types';

/**
 * Isole canoniche aggiuntive non ancora presenti sulla mappa. Laugh Tale (Raftel)
 * è l'isola finale della Grand Line: la sua posizione reale è segreta, quindi è
 * posta convenzionalmente sulla Red Line, subito accanto all'Isola di Loadstar
 * (l'ultima isola del New World), e marcata `needs_verification`.
 */
export const onepieceLocationsExtra2: Location[] = [
  {
    id: 'loc-op-laugh-tale',
    worldId: 'world-onepiece',
    mapLevelId: 'op-map-world',
    name: 'Laugh Tale',
    localizedName: { it: 'Laugh Tale (Raftel)', en: 'Laugh Tale (Raftel)' },
    type: 'sacred_place',
    x: 888,
    y: 516,
    shortDescription: {
      it: "L'ultima isola della Grand Line, raggiunta solo da Gol D. Roger: vi attendono il tesoro One Piece e la verità sul Secolo Vuoto lasciata da Joy Boy. La sua posizione è il segreto più custodito del mondo.",
      en: "The final island of the Grand Line, reached only by Gol D. Roger: it holds the One Piece treasure and the truth of the Void Century left by Joy Boy. Its location is the most closely guarded secret in the world.",
    },
    nationId: 'nation-op-grand-line-new-world',
    characterIds: ['char-op-roger', 'char-op-rayleigh', 'char-op-oden'],
    eventIds: ['evt-op-roger-laugh-tale'],
    importance: 'main',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['new-world', 'laugh-tale', 'one-piece', 'roger'],
  },
];
