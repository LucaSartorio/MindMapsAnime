import type { Faction } from '@/types';

/** Fazioni di Water Seven / Enies Lobby (CP9, Galley-La) e Thriller Bark. */
export const onepieceFactionsParadise2: Faction[] = [
  {
    id: 'faction-op-cp9',
    worldId: 'world-onepiece',
    type: 'organization',
    name: 'CP9 (Cipher Pol n. 9)',
    localizedName: { it: 'CP9 (Cipher Pol n. 9)', en: 'CP9 (Cipher Pol No. 9)' },
    description: {
      it: "L'unità segreta e illegale dell'intelligence del Governo Mondiale, autorizzata a uccidere. Maestri del Rokushiki, agirono a Water Seven ed Enies Lobby per catturare Nico Robin.",
      en: "The secret, illegal intelligence unit of the World Government, licensed to kill. Masters of Rokushiki, they operated in Water Seven and Enies Lobby to capture Nico Robin.",
    },
    leaderIds: ['char-op-spandam'],
    characterIds: ['char-op-lucci', 'char-op-kaku', 'char-op-blueno', 'char-op-spandam'],
    locationIds: ['loc-op-enies-lobby', 'loc-op-water-seven'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['governo-mondiale', 'spie', 'rokushiki'],
  },
  {
    id: 'faction-op-galley-la',
    worldId: 'world-onepiece',
    type: 'organization',
    name: 'Galley-La Company',
    localizedName: { it: 'Compagnia Galley-La', en: 'Galley-La Company' },
    description: {
      it: "La più grande compagnia di costruttori navali di Water Seven, guidata dal sindaco Iceburg: i migliori carpentieri del mondo, eredi della tradizione di Tom.",
      en: "The greatest shipbuilding company of Water Seven, led by Mayor Iceburg: the finest shipwrights in the world, heirs to Tom's tradition.",
    },
    leaderIds: ['char-op-iceburg'],
    characterIds: ['char-op-iceburg'],
    locationIds: ['loc-op-water-seven'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['water-seven', 'carpentieri'],
  },
  {
    id: 'faction-op-thriller-bark-pirates',
    worldId: 'world-onepiece',
    type: 'crew',
    name: 'Thriller Bark Pirates',
    localizedName: { it: 'Pirati di Thriller Bark', en: 'Thriller Bark Pirates' },
    description: {
      it: "La ciurma di zombie e mostri di Gekko Moria, animata dalle ombre rubate ai naviganti smarriti nel Triangolo Florian.",
      en: "Gecko Moria's crew of zombies and monsters, animated by the shadows stolen from sailors lost in the Florian Triangle.",
    },
    leaderIds: ['char-op-moria'],
    characterIds: ['char-op-moria', 'char-op-perona'],
    locationIds: ['loc-op-thriller-bark'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['thriller-bark', 'ciurma', 'zombie'],
  },
];
