/**
 * Report di qualità dei dati Naruto.
 *
 * Lista esplicita di TODO/limiti noti del dataset corrente, da usare come
 * to-do list editoriale prima della pubblicazione.
 *
 * Convenzioni:
 *  - "needs_verification" significa che il dato esiste ma va confermato
 *    su fonti ufficiali (manga/wiki ufficiali, ecc.).
 *  - "missing" significa che il dato non è ancora stato inserito.
 *  - "uncertain" significa contraddizione fra fonti diverse.
 */

export interface DataQualityEntry {
  area:
    | 'characters'
    | 'clans'
    | 'factions'
    | 'teams'
    | 'arcs'
    | 'events'
    | 'routes'
    | 'locations'
    | 'boundaries'
    | 'assets'
    | 'meta';
  kind: 'needs_verification' | 'missing' | 'uncertain';
  ref?: string;
  note: string;
}

export const narutoDataQuality: DataQualityEntry[] = [
  /* Caratteri */
  {
    area: 'characters',
    kind: 'missing',
    note:
      'Sound Four (Tayuya, Sakon/Ukon, Jirobo, Kidomaru) presenti solo come faction. Aggiungere come personaggi con stats/abilities verificate.',
  },
  {
    area: 'characters',
    kind: 'missing',
    note:
      'Genma Shiranui, Hayate Gekko, Anko\'s background, Shizune background da estendere.',
  },
  {
    area: 'characters',
    kind: 'missing',
    note:
      'Kumo squad: C, Samui, Omoi, Karui, Mabui da aggiungere.',
  },
  {
    area: 'characters',
    kind: 'missing',
    note:
      'Iwa squad: Akatsuchi da aggiungere.',
  },
  {
    area: 'characters',
    kind: 'needs_verification',
    ref: 'char-mangetsu',
    note:
      'Mangetsu Hozuki: dati biografici scarsi. Confermare ruolo e statistiche dai materiali ufficiali.',
  },
  {
    area: 'characters',
    kind: 'needs_verification',
    note:
      'Posizioni Iwa, Kumo, Kiri minori (Yagura/Ao/Mei): confermare grado e arc di prima apparizione.',
  },

  /* Clan */
  {
    area: 'clans',
    kind: 'missing',
    note:
      'Iburi, Chinoike, Kurama, Fuma clan: aggiungere se vogliamo coprire anime-only e materiali extra.',
  },
  {
    area: 'clans',
    kind: 'needs_verification',
    ref: 'clan-hoshigaki',
    note:
      'Esistenza del "clan Hoshigaki" come entità formale è dibattuta. Verificare prima della pubblicazione.',
  },

  /* Archi */
  {
    area: 'arcs',
    kind: 'missing',
    note:
      'Anime-only arcs (Land of Tea, Bikochu, Konoha History, Mizuki, Star Guard, ecc.) non ancora inseriti. Aggiungere con canon: "anime_only".',
  },
  {
    area: 'arcs',
    kind: 'needs_verification',
    ref: 'arc-post-war',
    note:
      'Distinzione fra "Blank Period" e "Kakashi Hokage era" non chiara nei dati. Separare se vogliamo cronologia rigorosa.',
  },

  /* Eventi */
  {
    area: 'events',
    kind: 'missing',
    note:
      'Capitoli manga/episodi anime: la maggior parte degli eventi ha questi campi vuoti per evitare dati errati. Compilare con fonti ufficiali.',
  },
  {
    area: 'events',
    kind: 'missing',
    note:
      'Eventi di approfondimento sulla Quarta Guerra ancora limitati (Hashirama vs Madara Edo, Edo Kage, fronte Naruto/Kurama). Espandere.',
  },

  /* Routes */
  {
    area: 'routes',
    kind: 'missing',
    note:
      'Percorsi mancanti: Tenten, Choji/Ino, Sai (post Root), Kabuto early, Anko, Shizune.',
  },
  {
    area: 'routes',
    kind: 'needs_verification',
    note:
      'Diversi route minori sono in stato "needs_verification": geografia degli spostamenti è plausibile ma non sempre esplicitamente mostrata.',
  },

  /* Boundaries */
  {
    area: 'boundaries',
    kind: 'needs_verification',
    note:
      'Tutti i `svgPathD` sono allineati al placeholder SVG attuale. Quando si sostituisce con la mappa autorizzata vanno rifiniti.',
  },

  /* Assets */
  {
    area: 'assets',
    kind: 'needs_verification',
    ref: 'naruto-world-map-svg',
    note:
      'Licenza della mappa fornita dall\'utente da verificare prima della pubblicazione. Il file in repo è un placeholder CC0 con stesso viewBox.',
  },

  /* Meta */
  {
    area: 'meta',
    kind: 'missing',
    note:
      'Coordinate dei luoghi minori (Hoshigakure, Yukigakure, Soragakure) sono indicative. Da rivedere con la mappa reale.',
  },
];

/** Totale problemi noti, utile per badge in UI. */
export const narutoDataQualitySummary = {
  total: narutoDataQuality.length,
  missing: narutoDataQuality.filter((d) => d.kind === 'missing').length,
  needsVerification: narutoDataQuality.filter(
    (d) => d.kind === 'needs_verification',
  ).length,
  uncertain: narutoDataQuality.filter((d) => d.kind === 'uncertain').length,
};
