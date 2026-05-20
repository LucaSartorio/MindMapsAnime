import type { Faction } from '@/types';

/**
 * Fazioni/organizzazioni non-clan di Naruto.
 * Insieme ai clan formano l'archivio "Clans & Factions".
 */
export const narutoFactions: Faction[] = [
  {
    id: 'faction-akatsuki',
    worldId: 'world-naruto',
    type: 'organization',
    name: 'Akatsuki',
    nameLocal: 'Akatsuki',
    description:
      'Organizzazione di ninja missing-nin, originalmente fondata ad Amegakure. Successivamente strumento del piano di Tobi/Madara per il "Tsuki no Me".',
    characterIds: ['char-itachi', 'char-pain', 'char-obito'],
    locationIds: ['loc-akatsuki-hq', 'loc-ame'],
    arcIds: ['arc-akatsuki-suppression', 'arc-itachi-pursuit', 'arc-pain-assault', 'arc-fourth-war'],
    referenceStatus: 'verified',
    tags: ['organizzazione', 'antagonisti'],
  },
  {
    id: 'faction-allied-shinobi',
    worldId: 'world-naruto',
    type: 'army',
    name: 'Allied Shinobi Forces',
    description:
      'Coalizione delle cinque grandi nazioni unite contro Akatsuki nella Quarta Guerra Ninja.',
    characterIds: ['char-naruto', 'char-kakashi', 'char-gaara'],
    locationIds: ['loc-fourth-war-battlefield'],
    arcIds: ['arc-fourth-war'],
    referenceStatus: 'verified',
    tags: ['guerra'],
  },
  {
    id: 'faction-anbu',
    worldId: 'world-naruto',
    type: 'group',
    name: 'ANBU Black Ops',
    description:
      'Forze speciali dirette dell\'Hokage, operazioni segrete.',
    locationIds: ['loc-konoha'],
    referenceStatus: 'verified',
    tags: ['ombra'],
  },
];
