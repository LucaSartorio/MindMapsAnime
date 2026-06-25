import type { Character, Jutsu, TimelineEvent } from '@/types';

/**
 * Collegamenti e arricchimento automatico delle schede personaggio HxH.
 *
 * Obiettivo: rendere ogni scheda "navigabile al 100%" senza dover editare a
 * mano 150+ record. Tre meccanismi:
 *  1. NEN_TYPE  → categoria Nen canonica per personaggio (`abilityCategory`).
 *  2. FAMILY / ALLIES / ENEMIES / TEACHERS / STUDENTS → relazioni canoniche,
 *     applicate in modo SIMMETRICO (se A è famiglia di B, B lo è di A; se A è
 *     nemico di B, B è nemico di A; maestro↔allievo si specchiano).
 *  3. enrichHxhCharacters() → fonde tutto e auto-deriva `jutsuIds` dai
 *     `characterIds` già presenti sulle tecniche Nen (back-link bidirezionale),
 *     preservando i valori già impostati a mano sui singoli record.
 */

const C = (s: string) => `char-hxh-${s}`;

/* ============================================================= NEN TYPE */
/** Categoria Nen canonica (id usato anche da Jutsu.type / config.ability). */
export const NEN_TYPE: Record<string, string> = {
  // Protagonisti
  gon: 'enhancement',
  killua: 'transmutation',
  kurapika: 'conjuration', // Specialista a Occhi Scarlatti; base Conjuration
  leorio: 'emission',
  // Zoldyck
  illumi: 'manipulation',
  silva: 'transmutation',
  zeno: 'conjuration',
  kalluto: 'transmutation',
  alluka: 'specialization',
  nanika: 'specialization',
  // Brigata Fantasma
  chrollo: 'specialization',
  hisoka: 'transmutation',
  machi: 'transmutation',
  feitan: 'transmutation',
  phinks: 'enhancement',
  franklin: 'emission',
  shizuku: 'conjuration',
  kortopi: 'conjuration',
  shalnark: 'manipulation',
  nobunaga: 'enhancement',
  uvogin: 'enhancement',
  pakunoda: 'specialization',
  bonolenov: 'conjuration',
  // Hunter / mentori
  biscuit: 'transmutation',
  wing: 'enhancement',
  bisky: 'transmutation',
  morel: 'conjuration',
  knov: 'conjuration',
  knuckle: 'emission',
  shoot: 'conjuration',
  palm: 'manipulation',
  kite: 'conjuration',
  netero: 'enhancement',
  ging: 'enhancement', // versatile, base Enhancer
  goreinu: 'conjuration',
  tsezguerra: 'emission',
  genthru: 'transmutation',
  razor: 'emission',
  meleoron: 'specialization',
  pokkle: 'emission',
  // Guardie Reali / Formiche
  meruem: 'specialization',
  neferpitou: 'specialization',
  shaiapouf: 'manipulation',
  menthuthuyoupi: 'specialization',
  zazan: 'manipulation',
  leol: 'specialization',
  welfin: 'manipulation',
  ikalgo: 'transmutation',
  cheetu: 'conjuration',
  // Successione
  tserriednich: 'specialization',
  fugetsu: 'conjuration',
  morena: 'manipulation',
  // Heavens Arena
  kastro: 'conjuration',
  gido: 'emission',
  riehlvelt: 'transmutation',
  zushi: 'enhancement',
  // Nostrade
  neon: 'specialization',
};

/* ====================================================== RELAZIONI CANON */
type Rel = readonly [string, readonly string[]];

/** Nuclei familiari (simmetrici: ogni membro diventa "family" degli altri). */
const FAMILIES: readonly (readonly string[])[] = [
  // Zoldyck
  ['killua', 'illumi', 'milluki', 'kalluto', 'alluka', 'silva', 'kikyo', 'zeno', 'maha', 'nanika'],
  // Freecss
  ['gon', 'ging', 'mito'],
  // Famiglia reale di Kakin (re + regine + principi)
  [
    'nasubi', 'unma', 'duazul', 'tangzhao', 'katrono', 'swinkoswinko', 'seiko', 'sevanti', 'oito',
    'benjamin', 'camilla', 'zhang-lei', 'tserriednich', 'tubeppa', 'tyson', 'luzurus', 'halkenburg',
    'kacho', 'fugetsu', 'sale-sale', 'momoze', 'marayam', 'woble',
  ],
  // Nostrade
  ['light-nostrade', 'neon'],
  // Reina / Colt (fratelli umani, poi Formiche)
  ['reina', 'colt'],
];

/** Maestro → allievi (si specchia in students↔teachers). */
const TEACHES: readonly Rel[] = [
  ['wing', ['gon', 'killua', 'zushi']],
  ['biscuit', ['gon', 'killua']],
  ['netero', ['gon']],
  ['kurapika', ['bill', 'theta', 'belerainte']], // corso di Nen sulla Black Whale
];

/** Alleanze (simmetriche). */
const ALLIES: readonly Rel[] = [
  ['gon', ['killua', 'kurapika', 'leorio', 'biscuit', 'kite', 'knuckle', 'shoot', 'palm', 'meleoron', 'ikalgo', 'morel', 'knov', 'netero']],
  ['killua', ['kurapika', 'leorio', 'alluka', 'biscuit', 'ikalgo', 'meleoron']],
  ['kurapika', ['leorio', 'melody', 'basho', 'squala', 'bill', 'oito', 'woble']],
  ['chrollo', ['machi', 'nobunaga', 'feitan', 'phinks', 'shalnark', 'franklin', 'shizuku', 'pakunoda', 'kortopi', 'bonolenov', 'uvogin']],
  ['meruem', ['neferpitou', 'shaiapouf', 'menthuthuyoupi', 'komugi']],
  ['netero', ['morel', 'knov', 'zeno', 'silva']],
  ['beyond', ['pariston', 'saiyu']],
];

/** Inimicizie (simmetriche). */
const ENEMIES: readonly Rel[] = [
  ['gon', ['hisoka', 'neferpitou', 'genthru', 'meruem']],
  ['killua', ['illumi', 'menthuthuyoupi', 'shaiapouf']],
  ['kurapika', ['chrollo', 'uvogin', 'pakunoda', 'tserriednich', 'illumi']],
  ['netero', ['meruem']],
  ['knuckle', ['menthuthuyoupi']],
  ['morel', ['cheetu', 'menthuthuyoupi']],
  ['killua', ['neferpitou']],
  ['gon', ['knuckle']], // scontro di addestramento
  ['morena', ['tserriednich', 'hinrigh']],
];

/* ============================================ COSTRUZIONE MAPPE SIMMETRICHE */
/* ===================================== EVENTI → personaggi aggiuntivi */
/**
 * Aggancia a eventi canonici i personaggi finora "orfani" (non comparivano in
 * nessun evento), così ogni scheda è raggiungibile dalla timeline. Mappa:
 * eventId → personaggi (short id) da aggiungere ai characterIds dell'evento.
 */
const EVENT_EXTRA_CHARS: Record<string, readonly string[]> = {
  'ev-hxh-killua-family-room': ['gotoh'], // maggiordomo capo degli Zoldyck
  'ev-hxh-queen-washes-ashore': ['gyro'], // fondatore della NGL, origine delle Formiche
  'ev-hxh-final-phase': ['bodoro'], // candidato ucciso da Killua nei duelli finali
  'ev-hxh-zevil-island': ['geretta'], // cacciatore candidato della quarta fase
  'ev-hxh-troupe-gathers': ['zepile'], // esperto d'antiquariato che aiuta a Yorknew
  'ev-hxh-greed-island-auction': ['battera'], // mecenate che finanzia Greed Island
  'ev-hxh-ging-message': ['dwun', 'list'], // i Game Master creatori del gioco
  'ev-hxh-toward-new-continent': ['brion', 'ai', 'hellbell', 'pap', 'zobae'], // le 5 Calamità, mete della spedizione
};

/* ================================== FAZIONI → membri aggiuntivi (mafia) */
/** factionId → personaggi (short id) da aggiungere ai characterIds. */
const FACTION_EXTRA_CHARS: Record<string, readonly string[]> = {
  'faction-hxh-mafia': ['light-nostrade'], // i Nostrade operano sotto la Comunità Mafiosa
  'faction-hxh-cha-r': ['nobunaga'], // i Ragni alleati della Cha-R contro la Heil-Ly
};

/**
 * eventId → fazioni (id) da aggiungere, così Ten Dons e Shadow Beasts (privi
 * di membri nominati nel cast) restano raggiungibili dalla timeline.
 */
const EVENT_EXTRA_FACTIONS: Record<string, readonly string[]> = {
  'ev-hxh-troupe-vs-shadowbeasts': ['faction-hxh-shadow-beasts', 'faction-hxh-ten-dons'],
  'ev-hxh-auction-massacre': ['faction-hxh-ten-dons'],
};

/**
 * eventId → luoghi (id pieno) da aggiungere ai `locationIds`, così i luoghi
 * canonici (tappe dell'Esame, interni delle sotto-mappe, città di Greed
 * Island, World Tree…) sono raggiungibili dalla timeline oltre che dalla mappa.
 */
const EVENT_EXTRA_LOCATIONS: Record<string, readonly string[]> = {
  // Esame per Hunter (tappe)
  'ev-hxh-ship-storm': ['loc-hxh-dolle-harbor'],
  'ev-hxh-swindlers-swamp': ['loc-hxh-milsy-wetlands'],
  'ev-hxh-trick-tower': ['loc-hxh-trick-tower'],
  'ev-hxh-zevil-island': ['loc-hxh-zevil-island'],
  // Torre Celeste (piani interni)
  'ev-hxh-heavens-arrival': ['loc-hxh-ha-entrance'],
  'ev-hxh-arena-fighters': ['loc-hxh-ha-floor200'],
  'ev-hxh-gon-floor-matches': ['loc-hxh-ha-floor200'],
  'ev-hxh-gon-vs-hisoka': ['loc-hxh-ha-floor251'],
  'ev-hxh-hisoka-vs-kastro': ['loc-hxh-ha-floor251'],
  // Tenuta Zoldyck (interni)
  'ev-hxh-testing-gate-canary': ['loc-hxh-zd-testing-gate'],
  'ev-hxh-killua-family-room': ['loc-hxh-zd-torture-room', 'loc-hxh-zd-residence'],
  'ev-hxh-kukuroo-climb': ['loc-hxh-zd-testing-gate'],
  // Greed Island (città)
  'ev-hxh-enter-greed-island': ['loc-hxh-gi-starting-point'],
  'ev-hxh-bisky-training': ['loc-hxh-gi-masadora'],
  'ev-hxh-meet-tsezguerra': ['loc-hxh-gi-antokiba'],
  'ev-hxh-dodgeball-razor': ['loc-hxh-gi-soufrabi'],
  'ev-hxh-gon-vs-genthru': ['loc-hxh-gi-battlefield'],
  'ev-hxh-ging-message': ['loc-hxh-gi-limeiro'],
  // East Gorteau (interni palazzo) + Peijin
  'ev-hxh-selection-broadcast': ['loc-hxh-peijin', 'loc-hxh-eg-gate'],
  'ev-hxh-palace-assault': ['loc-hxh-eg-gate', 'loc-hxh-eg-courtyard'],
  'ev-hxh-morel-knuckle-youpi': ['loc-hxh-eg-courtyard'],
  'ev-hxh-knuckle-vs-youpi': ['loc-hxh-eg-courtyard'],
  'ev-hxh-netero-vs-meruem': ['loc-hxh-eg-throne'],
  'ev-hxh-meruem-komugi': ['loc-hxh-eg-gungi-room'],
  'ev-hxh-king-death': ['loc-hxh-eg-gungi-room'],
  'ev-hxh-meruem-awakens': ['loc-hxh-eg-gungi-room'],
  // Elezione / lore
  'ev-hxh-chairman-election': ['loc-hxh-swardani-city'],
  'ev-hxh-pariston-wins': ['loc-hxh-swardani-city'],
  'ev-hxh-gon-meets-ging': ['loc-hxh-world-tree'],
  // Continente Oscuro
  'ev-hxh-expo-rokario': ['loc-hxh-rokario-site'],
};

function addBoth(map: Map<string, Set<string>>, a: string, b: string) {
  if (a === b) return;
  if (!map.has(a)) map.set(a, new Set());
  if (!map.has(b)) map.set(b, new Set());
  map.get(a)!.add(b);
  map.get(b)!.add(a);
}

function buildSymmetric(rels: readonly Rel[], valid: Set<string>): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const [src, dests] of rels) {
    const a = C(src);
    if (!valid.has(a)) continue;
    for (const d of dests) {
      const b = C(d);
      if (!valid.has(b)) continue;
      addBoth(map, a, b);
    }
  }
  return map;
}

/**
 * Arricchisce i personaggi HxH:
 *  - imposta `abilityCategory` (tipo Nen) dove noto;
 *  - completa family/allies/enemies in modo simmetrico;
 *  - specchia teachers↔students;
 *  - auto-deriva `jutsuIds` dai `characterIds` delle tecniche.
 * I valori già presenti su un record vengono preservati e fusi (no perdita).
 */
export function enrichHxhCharacters(
  characters: Character[],
  jutsu: Jutsu[],
): Character[] {
  const valid = new Set(characters.map((c) => c.id));

  // Famiglie → set simmetrico
  const familyMap = new Map<string, Set<string>>();
  for (const fam of FAMILIES) {
    for (const a of fam)
      for (const b of fam) addBoth(familyMap, C(a), C(b));
  }
  // (filtra id inesistenti)
  for (const [k, set] of familyMap) {
    if (!valid.has(k)) familyMap.delete(k);
    else for (const v of set) if (!valid.has(v)) set.delete(v);
  }

  const alliesMap = buildSymmetric(ALLIES, valid);
  const enemiesMap = buildSymmetric(ENEMIES, valid);

  // Maestri/allievi
  const teachersMap = new Map<string, Set<string>>(); // allievo → maestri
  const studentsMap = new Map<string, Set<string>>(); // maestro → allievi
  for (const [teacher, students] of TEACHES) {
    const tt = C(teacher);
    if (!valid.has(tt)) continue;
    for (const s of students) {
      const ss = C(s);
      if (!valid.has(ss)) continue;
      if (!studentsMap.has(tt)) studentsMap.set(tt, new Set());
      studentsMap.get(tt)!.add(ss);
      if (!teachersMap.has(ss)) teachersMap.set(ss, new Set());
      teachersMap.get(ss)!.add(tt);
    }
  }

  // jutsuIds ← characterIds delle tecniche (back-link)
  const jutsuByChar = new Map<string, Set<string>>();
  for (const j of jutsu) {
    for (const cid of j.characterIds ?? []) {
      if (!jutsuByChar.has(cid)) jutsuByChar.set(cid, new Set());
      jutsuByChar.get(cid)!.add(j.id);
    }
  }

  const merge = (existing: string[] | undefined, extra: Set<string> | undefined): string[] | undefined => {
    if (!extra || extra.size === 0) return existing;
    const out = new Set(existing ?? []);
    for (const v of extra) out.add(v);
    return [...out];
  };

  return characters.map((c) => {
    const shortId = c.id.replace(/^char-hxh-/, '');
    const next: Character = { ...c };

    if (!next.abilityCategory && NEN_TYPE[shortId]) {
      next.abilityCategory = NEN_TYPE[shortId];
    }
    next.family = merge(c.family, familyMap.get(c.id));
    next.allies = merge(c.allies, alliesMap.get(c.id));
    next.enemies = merge(c.enemies, enemiesMap.get(c.id));
    next.teachers = merge(c.teachers, teachersMap.get(c.id));
    next.students = merge(c.students, studentsMap.get(c.id));
    next.jutsuIds = merge(c.jutsuIds, jutsuByChar.get(c.id));
    return next;
  });
}

/**
 * Aggancia agli eventi i personaggi/fazioni "orfani" (vedi EVENT_EXTRA_CHARS /
 * EVENT_EXTRA_FACTIONS), così ogni nodo è raggiungibile dalla timeline.
 */
export function enrichHxhEvents(events: TimelineEvent[]): TimelineEvent[] {
  return events.map((e) => {
    const extraC = EVENT_EXTRA_CHARS[e.id];
    const extraF = EVENT_EXTRA_FACTIONS[e.id];
    const extraL = EVENT_EXTRA_LOCATIONS[e.id];
    if (!extraC && !extraF && !extraL) return e;
    const next: TimelineEvent = { ...e };
    if (extraC) {
      next.characterIds = [
        ...new Set([...(e.characterIds ?? []), ...extraC.map(C)]),
      ];
    }
    if (extraF) {
      next.factionIds = [...new Set([...(e.factionIds ?? []), ...extraF])];
    }
    if (extraL) {
      // include il locationId "principale" se presente, così non si perde
      const base = e.locationId ? [e.locationId] : [];
      next.locationIds = [
        ...new Set([...base, ...(e.locationIds ?? []), ...extraL]),
      ];
    }
    return next;
  });
}

/** Aggiunge a fazioni selezionate membri canonici già presenti nel cast. */
export function enrichHxhFactions<T extends { id: string; characterIds?: string[] }>(
  factions: T[],
): T[] {
  return factions.map((f) => {
    const extra = FACTION_EXTRA_CHARS[f.id];
    if (!extra) return f;
    return {
      ...f,
      characterIds: [...new Set([...(f.characterIds ?? []), ...extra.map(C)])],
    };
  });
}
