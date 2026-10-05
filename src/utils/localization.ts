import {
  LOCALE_FALLBACKS,
  isLocalizedText,
  type Localizable,
  type LocalizedText,
  type LocalizedTextOptional,
  type SupportedLocale,
} from '@/types/i18n';

/**
 * Risolve un campo `Localizable` nella stringa appropriata.
 *
 * - Se `value` è una stringa pura → la restituisce così com'è (legacy/data
 *   non ancora localizzata).
 * - Se è un oggetto `LocalizedText` → restituisce la versione nella `locale`
 *   richiesta; se assente, percorre la catena di fallback della lingua
 *   (`LOCALE_FALLBACKS`, es. ja → en → it); se nessuna disponibile, prende la
 *   prima chiave valida. Così i dataset scritti solo in IT/EN restano leggibili
 *   anche con l'interfaccia in giapponese, francese, tedesco o spagnolo.
 * - Se il valore è `undefined`/`null` → ritorna stringa vuota.
 *
 * `fallbackLocale`, quando passata, ha la precedenza sulla catena di default.
 */
export function getLocalizedText(
  value: Localizable | undefined | null,
  locale: SupportedLocale,
  fallbackLocale?: SupportedLocale,
): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (isLocalizedText(value)) {
    const map = value as LocalizedTextOptional;
    const chain: SupportedLocale[] = [
      locale,
      ...(fallbackLocale ? [fallbackLocale] : []),
      ...LOCALE_FALLBACKS[locale],
    ];
    for (const candidateLocale of chain) {
      const candidate = map[candidateLocale];
      if (candidate && candidate.trim() !== '') return candidate;
    }
    // Ultima chance: qualsiasi valore non vuoto.
    for (const k of Object.keys(map) as SupportedLocale[]) {
      const candidate = map[k];
      if (candidate && candidate.trim() !== '') return candidate;
    }
  }
  return '';
}

/**
 * Traduzione ESATTA nella lingua richiesta, senza catena di fallback.
 * Serve a distinguere "tradotto in questa lingua" da "risolto per fallback".
 *
 * Una `string` semplice NON conta come traduzione esatta: è il nome nella
 * lingua sorgente, valido per tutte le lingue solo come ultimo ripiego. Se
 * contasse, un `name: 'Crilin'` verrebbe scambiato per la versione giapponese
 * e coprirebbe il `japaneseName` reale.
 */
function exactTranslation(
  value: Localizable | undefined,
  locale: SupportedLocale,
): string | undefined {
  if (!value || typeof value === 'string') return undefined;
  if (!isLocalizedText(value)) return undefined;
  const v = (value as LocalizedTextOptional)[locale];
  return v && v.trim() !== '' ? v : undefined;
}

/**
 * Risolve il nome visualizzato di un'entità, nell'ordine:
 *
 *  1. `localizedName` tradotto **esattamente** nella lingua richiesta
 *     (i doppiaggi rinominano i personaggi: Crilin / Krillin / クリリン);
 *  2. `name` tradotto esattamente in quella lingua;
 *  3. per il **giapponese**, il `japaneseName` già presente nei dataset —
 *     è il nome originale, quindi è sempre preferibile a un ripiego europeo;
 *  4. la normale cascata di fallback (`LOCALE_FALLBACKS`) su
 *     `localizedName` → `name` → `title`.
 */
export function getEntityDisplayName(
  entity:
    | {
        name?: Localizable;
        localizedName?: Localizable;
        title?: Localizable;
        japaneseName?: string;
      }
    | undefined
    | null,
  locale: SupportedLocale,
): string {
  if (!entity) return '';

  const exact =
    exactTranslation(entity.localizedName, locale) ??
    exactTranslation(entity.name, locale) ??
    exactTranslation(entity.title, locale);
  if (exact) return exact;

  if (locale === 'ja' && entity.japaneseName && entity.japaneseName.trim()) {
    return entity.japaneseName;
  }

  const fromLocalized = getLocalizedText(entity.localizedName, locale);
  if (fromLocalized) return fromLocalized;
  const fromName = getLocalizedText(entity.name, locale);
  if (fromName) return fromName;
  return getLocalizedText(entity.title, locale);
}

/** Risolve in batch un array di stringhe localizzabili. */
export function getLocalizedArray(
  values: Localizable[] | undefined,
  locale: SupportedLocale,
): string[] {
  if (!values) return [];
  return values.map((v) => getLocalizedText(v, locale));
}

/* -------------- Helper specifici per enum di dominio -------------- */

import type {
  CanonStatus,
  ChakraNature,
  CharacterImportance,
  CharacterStatus,
  JutsuType,
  LocationType,
  NinjaRank,
  Race,
  ReferenceStatus,
  TransformationKind,
  WorldStatus,
} from '@/types';

export const CANON_STATUS_LABELS: Record<CanonStatus, LocalizedText> = {
  canon: { it: 'Canon', en: 'Canon', ja: '原作', fr: 'Canon', de: 'Kanon', es: 'Canon' },
  anime_only: {
    it: 'Solo anime',
    en: 'Anime only',
    ja: 'アニメオリジナル',
    fr: 'Anime uniquement',
    de: 'Nur Anime',
    es: 'Solo anime',
  },
  movie: { it: 'Film', en: 'Movie', ja: '劇場版', fr: 'Film', de: 'Film', es: 'Película' },
  filler: { it: 'Filler', en: 'Filler', ja: 'フィラー', fr: 'Filler', de: 'Filler', es: 'Relleno' },
  novel: { it: 'Novel', en: 'Novel', ja: '小説', fr: 'Roman', de: 'Roman', es: 'Novela' },
  uncertain: {
    it: 'Incerto',
    en: 'Uncertain',
    ja: '不確定',
    fr: 'Incertain',
    de: 'Unsicher',
    es: 'Incierto',
  },
};

export function getCanonStatusLabel(
  status: CanonStatus,
  locale: SupportedLocale,
): string {
  return getLocalizedText(CANON_STATUS_LABELS[status], locale);
}

export const REFERENCE_STATUS_LABELS: Record<ReferenceStatus, LocalizedText> = {
  verified: {
    it: 'Verificato',
    en: 'Verified',
    ja: '確認済み',
    fr: 'Vérifié',
    de: 'Verifiziert',
    es: 'Verificado',
  },
  needs_verification: {
    it: 'Da verificare',
    en: 'Needs verification',
    ja: '要確認',
    fr: 'À vérifier',
    de: 'Zu prüfen',
    es: 'Por verificar',
  },
  unknown: {
    it: 'Sconosciuto',
    en: 'Unknown',
    ja: '不明',
    fr: 'Inconnu',
    de: 'Unbekannt',
    es: 'Desconocido',
  },
};

export function getReferenceStatusLabel(
  status: ReferenceStatus,
  locale: SupportedLocale,
): string {
  return getLocalizedText(REFERENCE_STATUS_LABELS[status], locale);
}

export const WORLD_STATUS_LABELS: Record<WorldStatus, LocalizedText> = {
  available: {
    it: 'Disponibile',
    en: 'Available',
    ja: '公開中',
    fr: 'Disponible',
    de: 'Verfügbar',
    es: 'Disponible',
  },
  coming_soon: {
    it: 'In arrivo',
    en: 'Coming soon',
    ja: '近日公開',
    fr: 'Bientôt disponible',
    de: 'Demnächst',
    es: 'Próximamente',
  },
  hidden: {
    it: 'Nascosto',
    en: 'Hidden',
    ja: '非表示',
    fr: 'Masqué',
    de: 'Verborgen',
    es: 'Oculto',
  },
};

export function getWorldStatusLabel(
  status: WorldStatus,
  locale: SupportedLocale,
): string {
  return getLocalizedText(WORLD_STATUS_LABELS[status], locale);
}

export const CHARACTER_STATUS_LABELS: Record<CharacterStatus, LocalizedText> = {
  alive: { it: 'Vivo', en: 'Alive', ja: '生存', fr: 'Vivant', de: 'Lebendig', es: 'Vivo' },
  deceased: {
    it: 'Deceduto',
    en: 'Deceased',
    ja: '死亡',
    fr: 'Décédé',
    de: 'Verstorben',
    es: 'Fallecido',
  },
  unknown: {
    it: 'Sconosciuto',
    en: 'Unknown',
    ja: '不明',
    fr: 'Inconnu',
    de: 'Unbekannt',
    es: 'Desconocido',
  },
  varies_by_era: {
    it: 'Varia per era',
    en: 'Varies by era',
    ja: '時代により異なる',
    fr: 'Varie selon l’époque',
    de: 'Je nach Ära',
    es: 'Varía según la era',
  },
};

export function getCharacterStatusLabel(
  status: CharacterStatus,
  locale: SupportedLocale,
): string {
  return getLocalizedText(CHARACTER_STATUS_LABELS[status], locale);
}

export const CHARACTER_IMPORTANCE_LABELS: Record<CharacterImportance, LocalizedText> = {
  main: {
    it: 'Principale',
    en: 'Main',
    ja: '主要',
    fr: 'Principal',
    de: 'Hauptfigur',
    es: 'Principal',
  },
  major: {
    it: 'Maggiore',
    en: 'Major',
    ja: '重要',
    fr: 'Majeur',
    de: 'Wichtig',
    es: 'Importante',
  },
  supporting: {
    it: 'Secondario',
    en: 'Supporting',
    ja: '脇役',
    fr: 'Secondaire',
    de: 'Nebenfigur',
    es: 'Secundario',
  },
  minor: {
    it: 'Minore',
    en: 'Minor',
    ja: '端役',
    fr: 'Mineur',
    de: 'Nebenrolle',
    es: 'Menor',
  },
  background: {
    it: 'Sfondo',
    en: 'Background',
    ja: '背景',
    fr: 'Arrière-plan',
    de: 'Hintergrund',
    es: 'Fondo',
  },
};

export function getCharacterImportanceLabel(
  importance: CharacterImportance,
  locale: SupportedLocale,
): string {
  return getLocalizedText(CHARACTER_IMPORTANCE_LABELS[importance], locale);
}

export const CHARACTER_ROLE_LABELS: Record<string, LocalizedText> = {
  leader: { it: 'Leader', en: 'Leader', es: 'Líder', ja: '指導者', fr: 'Dirigeant', de: 'Anführer' },
  noble: { it: 'Nobile', en: 'Noble', es: 'Noble', ja: '貴族', fr: 'Noble', de: 'Adliger' },
  protagonist: {
    it: 'Protagonista',
    en: 'Protagonist',
    ja: '主人公',
    fr: 'Protagoniste',
    de: 'Protagonist',
    es: 'Protagonista',
  },
  antagonist: {
    it: 'Antagonista',
    en: 'Antagonist',
    ja: '敵役',
    fr: 'Antagoniste',
    de: 'Antagonist',
    es: 'Antagonista',
  },
  supporting: {
    it: 'Comprimario',
    en: 'Supporting',
    ja: '脇役',
    fr: 'Second rôle',
    de: 'Nebenrolle',
    es: 'Personaje secundario',
  },
  mentor: { it: 'Mentore', en: 'Mentor', ja: '師匠', fr: 'Mentor', de: 'Mentor', es: 'Mentor' },
  villain: {
    it: 'Cattivo',
    en: 'Villain',
    ja: '悪役',
    fr: 'Méchant',
    de: 'Bösewicht',
    es: 'Villano',
  },
  ally: { it: 'Alleato', en: 'Ally', ja: '味方', fr: 'Allié', de: 'Verbündeter', es: 'Aliado' },
  neutral: {
    it: 'Neutrale',
    en: 'Neutral',
    ja: '中立',
    fr: 'Neutre',
    de: 'Neutral',
    es: 'Neutral',
  },
  background: {
    it: 'Sfondo',
    en: 'Background',
    ja: '背景',
    fr: 'Arrière-plan',
    de: 'Hintergrund',
    es: 'Fondo',
  },
};

/**
 * Etichetta localizzata per un ruolo "universale" (protagonista, antagonista, …).
 * Restituisce `''` per ruoli sconosciuti/specifici di un'opera: chi chiama
 * (`worldConfig.getCharacterRoleLabel`) gestisce config per-mondo e fallback.
 */
export function getCharacterRoleLabel(
  role: string,
  locale: SupportedLocale,
): string {
  const entry = CHARACTER_ROLE_LABELS[role];
  return entry ? getLocalizedText(entry, locale) : '';
}

export const LOCATION_TYPE_LABELS: Record<LocationType, LocalizedText> = {
  village: { it: 'Villaggio', en: 'Village', ja: '里', fr: 'Village', de: 'Dorf', es: 'Aldea' },
  city: { it: 'Città', en: 'City', ja: '都市', fr: 'Ville', de: 'Stadt', es: 'Ciudad' },
  nation: { it: 'Nazione', en: 'Nation', ja: '国', fr: 'Nation', de: 'Nation', es: 'Nación' },
  landmark: {
    it: 'Punto di interesse',
    en: 'Landmark',
    ja: '名所',
    fr: 'Point d’intérêt',
    de: 'Sehenswürdigkeit',
    es: 'Punto de interés',
  },
  battlefield: {
    it: 'Campo di battaglia',
    en: 'Battlefield',
    ja: '戦場',
    fr: 'Champ de bataille',
    de: 'Schlachtfeld',
    es: 'Campo de batalla',
  },
  hideout: {
    it: 'Nascondiglio',
    en: 'Hideout',
    ja: 'アジト',
    fr: 'Repaire',
    de: 'Versteck',
    es: 'Escondite',
  },
  sacred_place: {
    it: 'Luogo sacro',
    en: 'Sacred place',
    ja: '聖地',
    fr: 'Lieu sacré',
    de: 'Heiliger Ort',
    es: 'Lugar sagrado',
  },
  training_area: {
    it: 'Area di addestramento',
    en: 'Training area',
    ja: '修行場',
    fr: 'Terrain d’entraînement',
    de: 'Trainingsgelände',
    es: 'Zona de entrenamiento',
  },
  region: {
    it: 'Regione',
    en: 'Region',
    ja: '地域',
    fr: 'Région',
    de: 'Region',
    es: 'Región',
  },
  ruins: { it: 'Rovine', en: 'Ruins', ja: '遺跡', fr: 'Ruines', de: 'Ruinen', es: 'Ruinas' },
  bridge: { it: 'Ponte', en: 'Bridge', ja: '橋', fr: 'Pont', de: 'Brücke', es: 'Puente' },
  forest: { it: 'Foresta', en: 'Forest', ja: '森', fr: 'Forêt', de: 'Wald', es: 'Bosque' },
  mountain: {
    it: 'Montagna',
    en: 'Mountain',
    ja: '山',
    fr: 'Montagne',
    de: 'Berg',
    es: 'Montaña',
  },
  cave: { it: 'Caverna', en: 'Cave', ja: '洞窟', fr: 'Grotte', de: 'Höhle', es: 'Cueva' },
  planet: {
    it: 'Pianeta',
    en: 'Planet',
    ja: '惑星',
    fr: 'Planète',
    de: 'Planet',
    es: 'Planeta',
  },
  dimension: {
    it: 'Dimensione',
    en: 'Dimension',
    ja: '次元',
    fr: 'Dimension',
    de: 'Dimension',
    es: 'Dimensión',
  },
};

export function getLocationTypeLabel(
  type: LocationType,
  locale: SupportedLocale,
): string {
  return getLocalizedText(LOCATION_TYPE_LABELS[type], locale);
}

export const RACE_LABELS: Record<Race, LocalizedText> = {
  animal: { it: 'Animale', en: 'Animal', es: 'Animal', ja: '動物', fr: 'Animal', de: 'Tier' },
  monster: { it: 'Mostro', en: 'Monster', es: 'Monstruo', ja: '怪物', fr: 'Monstre', de: 'Monster' },
  eldian: { it: 'Eldiano', en: 'Eldian', es: 'Eldiano', ja: 'エルディア人', fr: 'Eldien', de: 'Eldianer' },
  ackerman: { it: 'Ackerman', en: 'Ackerman', es: 'Ackerman', ja: 'アッカーマン', fr: 'Ackerman', de: 'Ackerman' },
  marleyan: { it: 'Marleyano', en: 'Marleyan', es: 'Marleyano', ja: 'マーレ人', fr: 'Mahr', de: 'Marleyaner' },
  hizurian: { it: 'Hizuriano', en: 'Hizurian', es: 'Hizuriano', ja: 'ヒィズル人', fr: 'Hizurien', de: 'Hizurianer' },
  shinigami: { it: 'Shinigami', en: 'Soul Reaper', es: 'Shinigami', ja: '死神', fr: 'Shinigami', de: 'Shinigami' },
  quincy: { it: 'Quincy', en: 'Quincy', es: 'Quincy', ja: '滅却師', fr: 'Quincy', de: 'Quincy' },
  fullbringer: { it: 'Fullbringer', en: 'Fullbringer', es: 'Fullbringer', ja: '完現術者', fr: 'Fullbringer', de: 'Fullbringer' },
  mod_soul: { it: 'Anima modificata', en: 'Mod Soul', es: 'Alma Modificada', ja: '改造魂魄', fr: 'Âme modifiée', de: 'Mod-Seele' },
  hollow: { it: 'Hollow', en: 'Hollow', es: 'Hollow', ja: '虚', fr: 'Hollow', de: 'Hollow' },
  visored: { it: 'Visored', en: 'Visored', es: 'Visored', ja: '仮面の軍勢', fr: 'Vizard', de: 'Visored' },
  bount: { it: 'Bount', en: 'Bount', es: 'Bount', ja: 'バウント', fr: 'Bount', de: 'Bount' },
  arrancar: { it: 'Arrancar', en: 'Arrancar', es: 'Arrancar', ja: '破面', fr: 'Arrancar', de: 'Arrancar' },
  cursed_corpse: { it: 'Cadavere maledetto', en: 'Cursed Corpse', es: 'Cadáver maldito', ja: '呪骸', fr: 'Cadavre maudit', de: 'Fluchleiche' },
  cursed_spirit: { it: 'Spirito maledetto', en: 'Cursed Spirit', es: 'Espíritu maldito', ja: '呪霊', fr: 'Fléau', de: 'Fluchgeist' },
  incarnated: { it: 'Incarnato', en: 'Incarnated Body', es: 'Encarnado', ja: '受肉体', fr: 'Incarné', de: 'Inkarnation' },
  cursed_womb: { it: 'Utero maledetto', en: 'Cursed Womb', es: 'Útero maldito', ja: '呪胎', fr: 'Matrice maudite', de: 'Fluchschoß' },
  shikigami: { it: 'Shikigami', en: 'Shikigami', es: 'Shikigami', ja: '式神', fr: 'Shikigami', de: 'Shikigami' },
  dwarf_hybrid: { it: 'Mezzo nano', en: 'Half-Dwarf', es: 'Medio enano', ja: 'ドワーフの混血', fr: 'Demi-nain', de: 'Halbzwerg' },
  devil: { it: 'Diavolo', en: 'Devil', es: 'Demonio', ja: '悪魔', fr: 'Démon', de: 'Teufel' },
  elf: { it: 'Elfo', en: 'Elf', es: 'Elfo', ja: 'エルフ', fr: 'Elfe', de: 'Elf' },
  spirit: { it: 'Spirito', en: 'Spirit', es: 'Espíritu', ja: '精霊', fr: 'Esprit', de: 'Geist' },
  saiyan: {
    it: 'Saiyan',
    en: 'Saiyan',
    ja: 'サイヤ人',
    fr: 'Saiyan',
    de: 'Saiyajin',
    es: 'Saiyan',
  },
  saiyan_hybrid: {
    it: 'Saiyan ibrido',
    en: 'Saiyan hybrid',
    ja: 'サイヤ人とのハーフ',
    fr: 'Hybride Saiyan',
    de: 'Saiyajin-Hybrid',
    es: 'Híbrido saiyan',
  },
  human: {
    it: 'Terrestre',
    en: 'Human',
    ja: '地球人',
    fr: 'Terrien',
    de: 'Erdling',
    es: 'Terrícola',
  },
  namekian: {
    it: 'Namecciano',
    en: 'Namekian',
    ja: 'ナメック星人',
    fr: 'Namek',
    de: 'Namekianer',
    es: 'Namekiano',
  },
  majin: { it: 'Majin', en: 'Majin', ja: '魔人', fr: 'Majin', de: 'Majin', es: 'Majin' },
  android: {
    it: 'Androide / Cyborg',
    en: 'Android / Cyborg',
    ja: '人造人間・サイボーグ',
    fr: 'Androïde / Cyborg',
    de: 'Android / Cyborg',
    es: 'Androide / Cyborg',
  },
  demon: { it: 'Demone', en: 'Demon', ja: '魔族', fr: 'Démon', de: 'Dämon', es: 'Demonio' },
  angel: { it: 'Angelo', en: 'Angel', ja: '天使', fr: 'Ange', de: 'Engel', es: 'Ángel' },
  god_of_destruction: {
    it: 'Dio della Distruzione',
    en: 'God of Destruction',
    ja: '破壊神',
    fr: 'Dieu de la Destruction',
    de: 'Gott der Zerstörung',
    es: 'Dios de la Destrucción',
  },
  kaioshin: {
    it: 'Kaiōshin',
    en: 'Kaiōshin',
    ja: '界王神',
    fr: 'Kaiōshin',
    de: 'Kaiōshin',
    es: 'Kaiōshin',
  },
  frost_demon: {
    it: 'Frost Demon (razza di Freezer)',
    en: 'Frost Demon (Frieza’s race)',
    ja: 'フリーザ一族',
    fr: 'Frost Demon (race de Freezer)',
    de: 'Frost-Dämon (Freezers Rasse)',
    es: 'Frost Demon (raza de Freezer)',
  },
  dragon: {
    it: 'Drago eterno',
    en: 'Eternal Dragon',
    ja: '神龍',
    fr: 'Dragon éternel',
    de: 'Ewiger Drache',
    es: 'Dragón eterno',
  },
  alien: {
    it: 'Alieno',
    en: 'Alien',
    ja: '宇宙人',
    fr: 'Extraterrestre',
    de: 'Außerirdischer',
    es: 'Alienígena',
  },
  fusion: {
    it: 'Fusione',
    en: 'Fusion',
    ja: 'フュージョン',
    fr: 'Fusion',
    de: 'Fusion',
    es: 'Fusión',
  },
  divine_entity: {
    it: 'Entità divina',
    en: 'Divine entity',
    ja: '神的存在',
    fr: 'Entité divine',
    de: 'Göttliche Entität',
    es: 'Entidad divina',
  },
  tuffle: {
    it: 'Tsufuru (Tuffle)',
    en: 'Tuffle',
    ja: 'ツフル人',
    fr: 'Tuffle',
    de: 'Tuffle',
    es: 'Tsufuru (Tuffle)',
  },
  machine_mutant: {
    it: 'Mutante Macchina',
    en: 'Machine Mutant',
    ja: '機械化ミュータント',
    fr: 'Mutant machine',
    de: 'Maschinen-Mutant',
    es: 'Mutante máquina',
  },
  cerealian: {
    it: 'Cerealiano',
    en: 'Cerealian',
    ja: 'セレアル人',
    fr: 'Céréalien',
    de: 'Cerealianer',
    es: 'Cerealiano',
  },
  unknown: {
    it: 'Sconosciuta',
    en: 'Unknown',
    ja: '不明',
    fr: 'Inconnue',
    de: 'Unbekannt',
    es: 'Desconocida',
  },
};

/**
 * Etichetta di una razza/specie "nota" (vedi `Race`). Ritorna `''` per razze
 * sconosciute/specifiche di un'opera: chi chiama gestisce l'humanize fallback.
 */
export function getRaceLabel(race: string, locale: SupportedLocale): string {
  const entry = RACE_LABELS[race as Race];
  return entry ? getLocalizedText(entry, locale) : '';
}

export const TRANSFORMATION_KIND_LABELS: Record<TransformationKind, LocalizedText> = {
  transformation: {
    it: 'Trasformazione',
    en: 'Transformation',
    ja: '変身',
    fr: 'Transformation',
    de: 'Verwandlung',
    es: 'Transformación',
  },
  power_up: {
    it: 'Power-up',
    en: 'Power-up',
    ja: 'パワーアップ',
    fr: 'Montée en puissance',
    de: 'Power-up',
    es: 'Aumento de poder',
  },
  fusion: {
    it: 'Fusione',
    en: 'Fusion',
    ja: '合体',
    fr: 'Fusion',
    de: 'Fusion',
    es: 'Fusión',
  },
  state: { it: 'Stato', en: 'State', ja: '状態', fr: 'État', de: 'Zustand', es: 'Estado' },
};

/** Etichetta del tipo di `CharacterTransformation` (trasformazione, power-up, fusione, stato). */
export function getTransformationKindLabel(
  kind: TransformationKind,
  locale: SupportedLocale,
): string {
  return getLocalizedText(TRANSFORMATION_KIND_LABELS[kind], locale);
}

export const NINJA_RANK_LABELS: Record<NinjaRank, LocalizedText> = {
  academy_student: {
    it: 'Studente Accademia',
    en: 'Academy Student',
    ja: 'アカデミー生',
    fr: 'Élève de l’Académie',
    de: 'Akademieschüler',
    es: 'Estudiante de la Academia',
  },
  genin: { it: 'Genin', en: 'Genin', ja: '下忍', fr: 'Genin', de: 'Genin', es: 'Genin' },
  chunin: { it: 'Chunin', en: 'Chunin', ja: '中忍', fr: 'Chunin', de: 'Chunin', es: 'Chunin' },
  tokubetsu_jonin: {
    it: 'Jonin Speciale',
    en: 'Tokubetsu Jonin',
    ja: '特別上忍',
    fr: 'Jonin spécial',
    de: 'Spezial-Jonin',
    es: 'Jonin especial',
  },
  jonin: { it: 'Jonin', en: 'Jonin', ja: '上忍', fr: 'Jonin', de: 'Jonin', es: 'Jonin' },
  anbu: { it: 'ANBU', en: 'ANBU', ja: '暗部', fr: 'ANBU', de: 'ANBU', es: 'ANBU' },
  sannin: { it: 'Sannin', en: 'Sannin', ja: '三忍', fr: 'Sannin', de: 'Sannin', es: 'Sannin' },
  kage: { it: 'Kage', en: 'Kage', ja: '影', fr: 'Kage', de: 'Kage', es: 'Kage' },
  missing_nin: {
    it: 'Missing-nin',
    en: 'Missing-nin',
    ja: '抜け忍',
    fr: 'Ninja déserteur',
    de: 'Abtrünniger Ninja',
    es: 'Ninja renegado',
  },
  other: { it: 'Altro', en: 'Other', ja: 'その他', fr: 'Autre', de: 'Andere', es: 'Otro' },
};

export function getNinjaRankLabel(
  rank: NinjaRank,
  locale: SupportedLocale,
): string {
  return getLocalizedText(NINJA_RANK_LABELS[rank], locale);
}

export const JUTSU_TYPE_LABELS: Record<JutsuType, LocalizedText> = {
  ninjutsu: {
    it: 'Ninjutsu',
    en: 'Ninjutsu',
    ja: '忍術',
    fr: 'Ninjutsu',
    de: 'Ninjutsu',
    es: 'Ninjutsu',
  },
  taijutsu: {
    it: 'Taijutsu',
    en: 'Taijutsu',
    ja: '体術',
    fr: 'Taijutsu',
    de: 'Taijutsu',
    es: 'Taijutsu',
  },
  genjutsu: {
    it: 'Genjutsu',
    en: 'Genjutsu',
    ja: '幻術',
    fr: 'Genjutsu',
    de: 'Genjutsu',
    es: 'Genjutsu',
  },
  fuinjutsu: {
    it: 'Fūinjutsu (sigilli)',
    en: 'Fūinjutsu (sealing)',
    ja: '封印術',
    fr: 'Fūinjutsu (scellement)',
    de: 'Fūinjutsu (Siegel)',
    es: 'Fūinjutsu (sellado)',
  },
  senjutsu: {
    it: 'Senjutsu (eremitico)',
    en: 'Senjutsu (sage)',
    ja: '仙術',
    fr: 'Senjutsu (ermite)',
    de: 'Senjutsu (Eremit)',
    es: 'Senjutsu (ermitaño)',
  },
  kenjutsu: {
    it: 'Kenjutsu (spada)',
    en: 'Kenjutsu (sword)',
    ja: '剣術',
    fr: 'Kenjutsu (sabre)',
    de: 'Kenjutsu (Schwert)',
    es: 'Kenjutsu (espada)',
  },
  ijutsu: {
    it: 'Ijutsu (medico)',
    en: 'Ijutsu (medical)',
    ja: '医療忍術',
    fr: 'Ijutsu (médical)',
    de: 'Ijutsu (medizinisch)',
    es: 'Ijutsu (médico)',
  },
  hiden: {
    it: 'Hiden (segreto di clan)',
    en: 'Hiden (clan secret)',
    ja: '秘伝',
    fr: 'Hiden (secret de clan)',
    de: 'Hiden (Klan-Geheimnis)',
    es: 'Hiden (secreto de clan)',
  },
  doujutsu: {
    it: 'Dōjutsu (oculare)',
    en: 'Dōjutsu (ocular)',
    ja: '瞳術',
    fr: 'Dōjutsu (oculaire)',
    de: 'Dōjutsu (Augen)',
    es: 'Dōjutsu (ocular)',
  },
  tailed_beast: {
    it: 'Bestia con Code',
    en: 'Tailed Beast',
    ja: '尾獣',
    fr: 'Démon à queues',
    de: 'Schwanzbestie',
    es: 'Bestia con cola',
  },
  cooperation: {
    it: 'Cooperazione',
    en: 'Cooperation',
    ja: '連携技',
    fr: 'Coopération',
    de: 'Kooperation',
    es: 'Cooperación',
  },
  // --- Hunter x Hunter · Nen ---
  nen: {
    it: 'Nen (fondamentale)',
    en: 'Nen (fundamental)',
    ja: '念（基礎）',
    fr: 'Nen (fondamental)',
    de: 'Nen (Grundlagen)',
    es: 'Nen (fundamental)',
  },
  enhancement: {
    it: 'Potenziamento (Enhancement)',
    en: 'Enhancement',
    ja: '強化系',
    fr: 'Renforcement',
    de: 'Verstärkung',
    es: 'Potenciación',
  },
  transmutation: {
    it: 'Trasmutazione (Transmutation)',
    en: 'Transmutation',
    ja: '変化系',
    fr: 'Transmutation',
    de: 'Transmutation',
    es: 'Transmutación',
  },
  conjuration: {
    it: 'Materializzazione (Conjuration)',
    en: 'Conjuration',
    ja: '具現化系',
    fr: 'Matérialisation',
    de: 'Materialisation',
    es: 'Materialización',
  },
  emission: {
    it: 'Emissione (Emission)',
    en: 'Emission',
    ja: '放出系',
    fr: 'Émission',
    de: 'Emission',
    es: 'Emisión',
  },
  manipulation: {
    it: 'Manipolazione (Manipulation)',
    en: 'Manipulation',
    ja: '操作系',
    fr: 'Manipulation',
    de: 'Manipulation',
    es: 'Manipulación',
  },
  specialization: {
    it: 'Specializzazione (Specialization)',
    en: 'Specialization',
    ja: '特質系',
    fr: 'Spécialisation',
    de: 'Spezialisierung',
    es: 'Especialización',
  },
};

export function getJutsuTypeLabel(
  type: JutsuType,
  locale: SupportedLocale,
): string {
  return getLocalizedText(JUTSU_TYPE_LABELS[type], locale);
}

export const CHAKRA_NATURE_LABELS: Record<ChakraNature, LocalizedText> = {
  fire: {
    it: 'Fuoco (Katon)',
    en: 'Fire (Katon)',
    ja: '火遁',
    fr: 'Feu (Katon)',
    de: 'Feuer (Katon)',
    es: 'Fuego (Katon)',
  },
  water: {
    it: 'Acqua (Suiton)',
    en: 'Water (Suiton)',
    ja: '水遁',
    fr: 'Eau (Suiton)',
    de: 'Wasser (Suiton)',
    es: 'Agua (Suiton)',
  },
  earth: {
    it: 'Terra (Doton)',
    en: 'Earth (Doton)',
    ja: '土遁',
    fr: 'Terre (Doton)',
    de: 'Erde (Doton)',
    es: 'Tierra (Doton)',
  },
  lightning: {
    it: 'Fulmine (Raiton)',
    en: 'Lightning (Raiton)',
    ja: '雷遁',
    fr: 'Foudre (Raiton)',
    de: 'Blitz (Raiton)',
    es: 'Rayo (Raiton)',
  },
  wind: {
    it: 'Vento (Fūton)',
    en: 'Wind (Fūton)',
    ja: '風遁',
    fr: 'Vent (Fūton)',
    de: 'Wind (Fūton)',
    es: 'Viento (Fūton)',
  },
  yin: { it: 'Yin', en: 'Yin', ja: '陰遁', fr: 'Yin', de: 'Yin', es: 'Yin' },
  yang: { it: 'Yang', en: 'Yang', ja: '陽遁', fr: 'Yang', de: 'Yang', es: 'Yang' },
  yin_yang: {
    it: 'Yin-Yang',
    en: 'Yin-Yang',
    ja: '陰陽遁',
    fr: 'Yin-Yang',
    de: 'Yin-Yang',
    es: 'Yin-Yang',
  },
  wood: {
    it: 'Legno (Mokuton)',
    en: 'Wood (Mokuton)',
    ja: '木遁',
    fr: 'Bois (Mokuton)',
    de: 'Holz (Mokuton)',
    es: 'Madera (Mokuton)',
  },
  ice: {
    it: 'Ghiaccio (Hyōton)',
    en: 'Ice (Hyōton)',
    ja: '氷遁',
    fr: 'Glace (Hyōton)',
    de: 'Eis (Hyōton)',
    es: 'Hielo (Hyōton)',
  },
  lava: {
    it: 'Lava (Yōton)',
    en: 'Lava (Yōton)',
    ja: '熔遁',
    fr: 'Lave (Yōton)',
    de: 'Lava (Yōton)',
    es: 'Lava (Yōton)',
  },
  boil: {
    it: 'Vapore (Futton)',
    en: 'Boil (Futton)',
    ja: '沸遁',
    fr: 'Vapeur (Futton)',
    de: 'Dampf (Futton)',
    es: 'Vapor (Futton)',
  },
  magnet: {
    it: 'Magnete (Jiton)',
    en: 'Magnet (Jiton)',
    ja: '磁遁',
    fr: 'Magnétisme (Jiton)',
    de: 'Magnet (Jiton)',
    es: 'Magnetismo (Jiton)',
  },
  explosion: {
    it: 'Esplosione (Bakuton)',
    en: 'Explosion (Bakuton)',
    ja: '爆遁',
    fr: 'Explosion (Bakuton)',
    de: 'Explosion (Bakuton)',
    es: 'Explosión (Bakuton)',
  },
  storm: {
    it: 'Tempesta (Ranton)',
    en: 'Storm (Ranton)',
    ja: '嵐遁',
    fr: 'Tempête (Ranton)',
    de: 'Sturm (Ranton)',
    es: 'Tormenta (Ranton)',
  },
  dust: {
    it: 'Polvere (Jinton)',
    en: 'Dust (Jinton)',
    ja: '塵遁',
    fr: 'Poussière (Jinton)',
    de: 'Staub (Jinton)',
    es: 'Polvo (Jinton)',
  },
  scorch: {
    it: 'Arsura (Shakuton)',
    en: 'Scorch (Shakuton)',
    ja: '灼遁',
    fr: 'Brûlure (Shakuton)',
    de: 'Versengung (Shakuton)',
    es: 'Ardor (Shakuton)',
  },
  crystal: {
    it: 'Cristallo (Shōton)',
    en: 'Crystal (Shōton)',
    ja: '晶遁',
    fr: 'Cristal (Shōton)',
    de: 'Kristall (Shōton)',
    es: 'Cristal (Shōton)',
  },
  dark: {
    it: 'Oscurità',
    en: 'Dark',
    ja: '闇',
    fr: 'Ténèbres',
    de: 'Dunkelheit',
    es: 'Oscuridad',
  },
  swift: {
    it: 'Velocità (Jinton)',
    en: 'Swift',
    ja: '迅遁',
    fr: 'Célérité (Jinton)',
    de: 'Schnelligkeit (Jinton)',
    es: 'Velocidad (Jinton)',
  },
  steel: { it: 'Acciaio', en: 'Steel', ja: '鋼', fr: 'Acier', de: 'Stahl', es: 'Acero' },
  shadow: { it: 'Ombra', en: 'Shadow', ja: '影', fr: 'Ombre', de: 'Schatten', es: 'Sombra' },
  sand: { it: 'Sabbia', en: 'Sand', ja: '砂', fr: 'Sable', de: 'Sand', es: 'Arena' },
};

export function getChakraNatureLabel(
  nature: ChakraNature,
  locale: SupportedLocale,
): string {
  return getLocalizedText(CHAKRA_NATURE_LABELS[nature], locale);
}

/* ---------------- Tipi di fazione, sigilli, classificazioni ---------------- */

/** Tipo di fazione al SINGOLARE (badge di scheda/card); il filtro usa i plurali `clans.types.*`. */
export const FACTION_TYPE_LABELS: Record<string, LocalizedText> = {
  clan: { it: 'Clan', en: 'Clan', ja: '一族', fr: 'Clan', de: 'Clan', es: 'Clan' },
  crew: { it: 'Ciurma', en: 'Crew', ja: '海賊団', fr: 'Équipage', de: 'Crew', es: 'Tripulación' },
  organization: { it: 'Organizzazione', en: 'Organization', ja: '組織', fr: 'Organisation', de: 'Organisation', es: 'Organización' },
  army: { it: 'Esercito', en: 'Army', ja: '軍', fr: 'Armée', de: 'Armee', es: 'Ejército' },
  group: { it: 'Gruppo', en: 'Group', ja: 'グループ', fr: 'Groupe', de: 'Gruppe', es: 'Grupo' },
  village: { it: 'Villaggio', en: 'Village', ja: '里', fr: 'Village', de: 'Dorf', es: 'Aldea' },
  vessel: { it: 'Nave', en: 'Ship', ja: '船', fr: 'Navire', de: 'Schiff', es: 'Barco' },
  squad: { it: 'Compagnia', en: 'Squad', ja: '部隊', fr: 'Escouade', de: 'Trupp', es: 'Escuadrón' },
  race: { it: 'Razza', en: 'Race', ja: '種族', fr: 'Race', de: 'Volk', es: 'Raza' },
  concept: { it: 'Concetto', en: 'Concept', ja: '概念', fr: 'Concept', de: 'Konzept', es: 'Concepto' },
  division: { it: 'Divisione', en: 'Division', ja: '番隊', fr: 'Division', de: 'Division', es: 'División' },
  school: { it: 'Scuola', en: 'School', ja: '学校', fr: 'École', de: 'Schule', es: 'Escuela' },
};

/** Etichetta (singolare) di un tipo di fazione; `''` se sconosciuto (chi chiama fa l'humanize). */
export function getFactionTypeLabel(type: string, locale: SupportedLocale): string {
  const entry = FACTION_TYPE_LABELS[type];
  return entry ? getLocalizedText(entry, locale) : '';
}

/**
 * I dodici sigilli delle mani (Naruto). Le chiavi sono i valori dei dati
 * (`Jutsu.handSeals`, in inglese: "Ram", "Serpent"…), confrontati senza
 * distinguere maiuscole.
 */
export const HAND_SEAL_LABELS: Record<string, LocalizedText> = {
  rat: { it: 'Topo', en: 'Rat', ja: '子', fr: 'Rat', de: 'Ratte', es: 'Rata' },
  ox: { it: 'Bue', en: 'Ox', ja: '丑', fr: 'Bœuf', de: 'Ochse', es: 'Buey' },
  tiger: { it: 'Tigre', en: 'Tiger', ja: '寅', fr: 'Tigre', de: 'Tiger', es: 'Tigre' },
  hare: { it: 'Lepre', en: 'Hare', ja: '卯', fr: 'Lièvre', de: 'Hase', es: 'Liebre' },
  dragon: { it: 'Drago', en: 'Dragon', ja: '辰', fr: 'Dragon', de: 'Drache', es: 'Dragón' },
  serpent: { it: 'Serpente', en: 'Snake', ja: '巳', fr: 'Serpent', de: 'Schlange', es: 'Serpiente' },
  snake: { it: 'Serpente', en: 'Snake', ja: '巳', fr: 'Serpent', de: 'Schlange', es: 'Serpiente' },
  horse: { it: 'Cavallo', en: 'Horse', ja: '午', fr: 'Cheval', de: 'Pferd', es: 'Caballo' },
  ram: { it: 'Capra', en: 'Ram', ja: '未', fr: 'Bélier', de: 'Widder', es: 'Carnero' },
  monkey: { it: 'Scimmia', en: 'Monkey', ja: '申', fr: 'Singe', de: 'Affe', es: 'Mono' },
  bird: { it: 'Uccello', en: 'Bird', ja: '酉', fr: 'Oiseau', de: 'Vogel', es: 'Pájaro' },
  dog: { it: 'Cane', en: 'Dog', ja: '戌', fr: 'Chien', de: 'Hund', es: 'Perro' },
  boar: { it: 'Cinghiale', en: 'Boar', ja: '亥', fr: 'Sanglier', de: 'Eber', es: 'Jabalí' },
};

/** Etichetta di un sigillo delle mani; il valore originale se sconosciuto. */
export function getHandSealLabel(seal: string, locale: SupportedLocale): string {
  const entry = HAND_SEAL_LABELS[seal.toLowerCase()];
  return entry ? getLocalizedText(entry, locale) : seal;
}

/** Classificazioni delle tecniche (`Jutsu.classification`). */
export const ABILITY_CLASSIFICATION_LABELS: Record<string, LocalizedText> = {
  clone: { it: 'Clonazione', en: 'Clone', ja: '分身', fr: 'Clonage', de: 'Doppelgänger', es: 'Clonación' },
  offensive: { it: 'Offensiva', en: 'Offensive', ja: '攻撃', fr: 'Offensive', de: 'Offensiv', es: 'Ofensiva' },
  defensive: { it: 'Difensiva', en: 'Defensive', ja: '防御', fr: 'Défensive', de: 'Defensiv', es: 'Defensiva' },
  supplementary: { it: 'Di supporto', en: 'Supplementary', ja: '補助', fr: 'Soutien', de: 'Unterstützend', es: 'De apoyo' },
  transformation: { it: 'Trasformazione', en: 'Transformation', ja: '変化', fr: 'Transformation', de: 'Verwandlung', es: 'Transformación' },
  summoning: { it: 'Evocazione', en: 'Summoning', ja: '口寄せ', fr: 'Invocation', de: 'Beschwörung', es: 'Invocación' },
  kekkei_genkai: { it: 'Kekkei Genkai', en: 'Kekkei Genkai', ja: '血継限界', fr: 'Kekkei Genkai', de: 'Kekkei Genkai', es: 'Kekkei Genkai' },
  kekkei_mora: { it: 'Kekkei Mōra', en: 'Kekkei Mōra', ja: '血継網羅', fr: 'Kekkei Mōra', de: 'Kekkei Mōra', es: 'Kekkei Mōra' },
  dojutsu: { it: 'Dōjutsu', en: 'Dōjutsu', ja: '瞳術', fr: 'Dōjutsu', de: 'Dōjutsu', es: 'Dōjutsu' },
  space_time: { it: 'Spazio-tempo', en: 'Space–time', ja: '時空間', fr: 'Espace-temps', de: 'Raum-Zeit', es: 'Espacio-tiempo' },
  reincarnation: { it: 'Reincarnazione', en: 'Reincarnation', ja: '転生', fr: 'Réincarnation', de: 'Wiedergeburt', es: 'Reencarnación' },
  sealing: { it: 'Sigillo', en: 'Sealing', ja: '封印', fr: 'Scellement', de: 'Versiegelung', es: 'Sellado' },
  medical: { it: 'Medica', en: 'Medical', ja: '医療', fr: 'Médicale', de: 'Medizinisch', es: 'Médica' },
  senjutsu: { it: 'Senjutsu', en: 'Senjutsu', ja: '仙術', fr: 'Senjutsu', de: 'Senjutsu', es: 'Senjutsu' },
  tailed_beast: { it: 'Cercoterio', en: 'Tailed Beast', ja: '尾獣', fr: 'Démon à queues', de: 'Schwanzbestie', es: 'Bestia con cola' },
  cursed_seal: { it: 'Segno maledetto', en: 'Cursed Seal', ja: '呪印', fr: 'Marque maudite', de: 'Fluchmal', es: 'Sello maldito' },
  barrier: { it: 'Barriera', en: 'Barrier', ja: '結界', fr: 'Barrière', de: 'Barriere', es: 'Barrera' },
};

/** Etichetta di una classificazione di tecnica; `''` se sconosciuta (chi chiama fa l'humanize). */
export function getAbilityClassificationLabel(id: string, locale: SupportedLocale): string {
  const entry = ABILITY_CLASSIFICATION_LABELS[id];
  return entry ? getLocalizedText(entry, locale) : '';
}

/**
 * Alias di un personaggio nella lingua, senza doppioni né ripetizioni del nome
 * mostrato: dati con la stessa forma in due lingue ("Shinigami sostituto" /
 * "Substitute Soul Reaper") localizzati diventano identici.
 */
export function getLocalizedAliases(
  character: { aliases?: Localizable[]; name: string; localizedName?: Localizable; japaneseName?: string },
  locale: SupportedLocale,
): string[] {
  const shown = getEntityDisplayName(character, locale);
  return [...new Set(getLocalizedArray(character.aliases, locale))].filter((a) => a && a !== shown);
}
