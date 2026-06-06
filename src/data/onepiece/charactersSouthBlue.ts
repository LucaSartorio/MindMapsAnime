import type { Character } from '@/types';

/**
 * Personaggi legati a South Blue. Mare di provenienze più che di archi: il
 * filone narrativo principale è il Regno di Sorbet, patria di Bartholomew Kuma
 * e Jewelry Bonney (rivelato nei flashback della saga di Egghead).
 */
export const onepieceCharactersSouthBlue: Character[] = [
  {
    id: 'char-op-kuma',
    worldId: 'world-onepiece',
    name: 'Bartholomew Kuma',
    aliases: ['Il Tiranno', 'Kuma'],
    importance: 'major',
    role: ['ally', 'neutral'],
    gender: 'male',
    villageLocationId: 'loc-op-sorbet-kingdom',
    nationId: 'nation-op-south-blue',
    factionIds: ['faction-op-revolutionary-army'],
    family: ['char-op-bonney'],
    arcIds: ['arc-op-sorbet'],
    shortDescription: {
      it: "Originario del Regno di Sorbet, ex re, comandante rivoluzionario ed ex membro della Flotta dei Sette. Per salvare la figlia Bonney si offrì al programma Pacifista di Vegapunk, cancellando a poco a poco se stesso. A Sabaody disperse i Cappello di Paglia.",
      en: "From the Sorbet Kingdom, a former king, Revolutionary commander and ex-member of the Seven Warlords. To save his daughter Bonney he volunteered for Vegapunk's Pacifista programme, erasing himself bit by bit. At Sabaody he scattered the Straw Hats.",
    },
    status: 'alive',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['south-blue', 'rivoluzionari', 'pacifista', 'sorbet'],
  },
  {
    id: 'char-op-bonney',
    worldId: 'world-onepiece',
    name: 'Jewelry Bonney',
    aliases: ['La Grande Mangiatrice'],
    importance: 'major',
    role: ['neutral'],
    gender: 'female',
    villageLocationId: 'loc-op-sorbet-kingdom',
    nationId: 'nation-op-south-blue',
    factionIds: ['faction-op-bonney-pirates'],
    family: ['char-op-kuma'],
    arcIds: ['arc-op-sorbet'],
    shortDescription: {
      it: "Giovane capitana pirata della Peggiore Generazione, originaria del Regno di Sorbet e figlia adottiva di Kuma. Utente di un Frutto del Diavolo che le permette di alterare l'età, propria e altrui.",
      en: "A young pirate captain of the Worst Generation, from the Sorbet Kingdom and Kuma's adoptive daughter. User of a Devil Fruit that lets her alter age, her own and others'.",
    },
    status: 'alive',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['south-blue', 'peggiore-generazione', 'sorbet'],
  },
];
