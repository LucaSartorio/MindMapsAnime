import type { Faction } from '@/types';

/** Fazioni della saga di Egghead: i Cinque Astri di Saggezza e la CP0. */
export const onepieceFactionsEgghead: Faction[] = [
  {
    id: 'faction-op-five-elders',
    worldId: 'world-onepiece',
    type: 'organization',
    name: 'Five Elders (Gorosei)',
    localizedName: { it: 'I Cinque Astri di Saggezza', en: 'The Five Elders (Gorosei)' },
    description: {
      it: "I cinque massimi sovrani del Governo Mondiale, autorità suprema visibile sotto il solo Imu. Esseri dai poteri ancestrali, custodi dei segreti del mondo e nemici di chiunque minacci l'ordine costituito.",
      en: "The five highest rulers of the World Government, the supreme visible authority beneath only Imu. Beings of ancient powers, keepers of the world's secrets and enemies of any who threaten the established order.",
    },
    characterIds: ['char-op-saturn', 'char-op-imu'],
    locationIds: ['loc-op-mary-geoise'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['governo-mondiale', 'cinque-astri'],
  },
  {
    id: 'faction-op-cp0',
    worldId: 'world-onepiece',
    type: 'organization',
    name: 'CP0 (Cipher Pol Aigis 0)',
    localizedName: { it: 'CP0 (Cipher Pol Aigis 0)', en: 'CP0 (Cipher Pol Aigis 0)' },
    description: {
      it: "L'unità d'élite del Cipher Pol che agisce direttamente per i Cinque Astri: i migliori agenti del Governo Mondiale, al di sopra della stessa Marina.",
      en: "The elite Cipher Pol unit acting directly for the Five Elders: the World Government's finest agents, standing above even the Marines.",
    },
    characterIds: ['char-op-stussy', 'char-op-lucci'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['governo-mondiale', 'spie'],
  },
];
