import type { Character } from '@/types';

/**
 * Personaggi introdotti in materiale filler / speciali TV di Dragon Ball Z
 * (fuori dal manga di Toriyama). Marcati `canonStatus: 'filler'` e con il
 * tag `filler`.
 */
export const dragonballCharactersFiller: Character[] = [
  {
    id: 'char-dbz-pikkon',
    worldId: 'world-dragonball',
    name: 'Pikkon',
    aliases: ['Paikuhan'],
    japaneseName: 'パイクーハン',
    importance: 'minor',
    role: ['ally'],
    nationId: 'nation-dbz-other-world',
    race: 'alien',
    transformations: [],
    allies: ['char-dbz-goku'],
    locationIds: ['loc-dbz-other-world'],
    eventIds: ['evt-dbz-filler-other-world-tournament'],
    arcIds: ['arc-dbz-filler-other-world-tournament'],
    shortDescription: {
      it: "Filler DBZ: campione dell'Aldilà del Kaiō dell'Ovest, rivale amichevole di Goku al Torneo dell'Altro Mondo. Combattente disciplinato e potentissimo.",
      en: "DBZ filler: the West Kai's Other World champion, Goku's friendly rival at the Other World Tournament. A disciplined, immensely powerful fighter.",
    },
    status: 'deceased',
    canonStatus: 'filler',
    referenceStatus: 'verified',
    tags: ['filler', 'aldila'],
  },
];
