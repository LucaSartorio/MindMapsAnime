import type { Team } from '@/types';

/**
 * Team Naruto · Batch 1 — squadre della nuova generazione (era Boruto).
 *
 * Collega fra loro i genin introdotti in `charactersBatch1.ts`.
 * Cross-ref solo verso id già presenti nel dataset.
 */
export const narutoTeamsBatch1: Team[] = [
  {
    id: 'team-konohamaru',
    worldId: 'world-naruto',
    name: 'Team Konohamaru (New Gen)',
    localizedName: {
      it: 'Team Konohamaru (nuova generazione)',
      en: 'Team Konohamaru (New Gen)',
    },
    japaneseName: '第七班 (新世代)',
    description: {
      it: 'Squadra genin dell\'era Boruto guidata da Konohamaru: Boruto, Sarada e Mitsuki. Erede diretta del Team 7 di Kakashi.',
      en: 'Boruto-era genin squad led by Konohamaru: Boruto, Sarada and Mitsuki. Direct successor of Kakashi\'s Team 7.',
    },
    leaderId: 'char-konohamaru',
    memberIds: ['char-boruto', 'char-sarada', 'char-mitsuki'],
    villageLocationId: 'loc-konoha',
    nationId: 'nation-fire',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'genin', 'boruto-era', 'new-generation'],
  },
  {
    id: 'team-moegi',
    worldId: 'world-naruto',
    name: 'Team Moegi (Ino-Shika-Chō)',
    localizedName: {
      it: 'Team Moegi (Ino-Shika-Chō)',
      en: 'Team Moegi (Ino-Shika-Chō)',
    },
    japaneseName: '第十班 (新世代)',
    description: {
      it: 'Nuova formazione Ino-Shika-Chō dell\'era Boruto, guidata da Moegi: Shikadai, Inojin e Chōchō, figli del trio originale.',
      en: 'Boruto-era Ino-Shika-Chō formation led by Moegi: Shikadai, Inojin and Chōchō, children of the original trio.',
    },
    leaderId: 'char-moegi',
    memberIds: ['char-shikadai', 'char-inojin', 'char-chocho'],
    villageLocationId: 'loc-konoha',
    nationId: 'nation-fire',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'genin', 'boruto-era', 'ino-shika-cho'],
  },
];
