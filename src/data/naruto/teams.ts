import type { Team } from '@/types';

/**
 * Team operativi di Naruto.
 * I team sono raggruppati come entità a sé per riflettere la struttura
 * delle squadre genin/jonin e i piccoli gruppi specializzati.
 *
 * Sensei e leader sono espressi tramite `leaderId`. I membri sono i
 * personaggi assegnati alla squadra durante la sua era principale.
 */
export const narutoTeams: Team[] = [
  {
    id: 'team-7',
    worldId: 'world-naruto',
    name: 'Team 7',
    japaneseName: '第七班',
    description:
      'Squadra genin di Konoha composta originariamente da Naruto, Sasuke e Sakura sotto Kakashi.',
    longDescription:
      'Erede ideale del Team Minato. Dopo la diserzione di Sasuke e il time skip, la squadra viene ricomposta con Sai e Yamato. Cuore della serie.',
    leaderId: 'char-kakashi',
    memberIds: [
      'char-naruto',
      'char-sasuke',
      'char-sakura',
      'char-sai',
      'char-yamato',
    ],
    villageLocationId: 'loc-konoha',
    nationId: 'nation-fire',
    arcIds: ['arc-prologue', 'arc-chunin-exams', 'arc-kazekage-rescue'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'genin'],
  },
  {
    id: 'team-8',
    worldId: 'world-naruto',
    name: 'Team 8',
    japaneseName: '第八班',
    description:
      'Squadra di tracking di Konoha guidata da Kurenai: Hinata, Kiba (con Akamaru), Shino.',
    leaderId: 'char-kurenai',
    memberIds: ['char-hinata', 'char-kiba', 'char-shino'],
    villageLocationId: 'loc-konoha',
    nationId: 'nation-fire',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'genin', 'tracking'],
  },
  {
    id: 'team-10',
    worldId: 'world-naruto',
    name: 'Team 10 · Ino-Shika-Cho',
    japaneseName: '第十班',
    description:
      'Squadra Ino-Shika-Cho della nuova generazione: Ino, Shikamaru e Choji sotto Asuma.',
    leaderId: 'char-asuma',
    memberIds: ['char-ino', 'char-shikamaru', 'char-choji'],
    villageLocationId: 'loc-konoha',
    nationId: 'nation-fire',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['ino-shika-cho', 'konoha'],
  },
  {
    id: 'team-guy',
    worldId: 'world-naruto',
    name: 'Team Guy',
    japaneseName: 'ガイ班',
    description:
      'Squadra di Konoha guidata da Might Guy: Rock Lee, Neji Hyuga, Tenten.',
    leaderId: 'char-guy',
    memberIds: ['char-rock-lee', 'char-neji', 'char-tenten'],
    villageLocationId: 'loc-konoha',
    nationId: 'nation-fire',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'taijutsu'],
  },
  {
    id: 'team-minato',
    worldId: 'world-naruto',
    name: 'Team Minato',
    description:
      'Squadra storica di Minato: Kakashi, Obito, Rin. Operativa durante la Terza Guerra Ninja.',
    leaderId: 'char-minato',
    memberIds: ['char-kakashi', 'char-obito'],
    villageLocationId: 'loc-konoha',
    nationId: 'nation-fire',
    eventIds: ['ev-kannabi-bridge'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['konoha', 'pre-series'],
  },
  {
    id: 'team-sannin',
    worldId: 'world-naruto',
    name: 'Legendary Sannin',
    description:
      'I Tre Ninja Leggendari: Jiraiya, Tsunade, Orochimaru. Allievi di Hiruzen.',
    leaderId: 'char-hiruzen',
    memberIds: ['char-jiraiya', 'char-tsunade', 'char-orochimaru'],
    villageLocationId: 'loc-konoha',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['sannin', 'leggendari'],
  },
  {
    id: 'team-suna-siblings',
    worldId: 'world-naruto',
    name: 'Sand Siblings',
    description:
      'Squadra di Suna composta dai tre figli del Quarto Kazekage: Gaara, Temari, Kankuro.',
    leaderId: 'char-baki',
    memberIds: ['char-gaara', 'char-temari', 'char-kankuro'],
    villageLocationId: 'loc-suna',
    nationId: 'nation-wind',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['suna', 'sabbia'],
  },
  {
    id: 'team-taka',
    worldId: 'world-naruto',
    name: 'Taka (ex Hebi)',
    description:
      'Squadra di Sasuke dopo aver lasciato Orochimaru: Sasuke, Suigetsu, Karin, Jugo.',
    leaderId: 'char-sasuke',
    memberIds: ['char-sasuke', 'char-suigetsu', 'char-karin', 'char-jugo'],
    arcIds: ['arc-itachi-pursuit', 'arc-five-kage-summit'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['taka', 'hebi'],
  },
  {
    id: 'team-sound-four',
    worldId: 'world-naruto',
    name: 'Sound Four',
    description:
      'Scorta d\'élite di Orochimaru: Tayuya, Sakon/Ukon, Jirobo, Kidomaru. Più tardi Kimimaro.',
    memberIds: [],
    arcIds: ['arc-sasuke-retrieval'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['oto', 'orochimaru'],
  },
  {
    id: 'team-ame-orphans',
    worldId: 'world-naruto',
    name: 'Ame Orphans',
    description:
      'Yahiko, Konan e Nagato, addestrati da Jiraiya durante la Terza Guerra Ninja.',
    leaderId: 'char-jiraiya',
    memberIds: ['char-pain'],
    villageLocationId: 'loc-ame',
    nationId: 'nation-rain',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['ame', 'akatsuki-origins'],
  },
];
