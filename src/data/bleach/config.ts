import type { LabeledOption } from '@/types';

/**
 * Tassonomie di Bleach usate dal `WorldConfig` in `src/data/worlds.ts`.
 *
 * Vivono in un file a parte (come per Black Clover) perché `worlds.ts` non può
 * importare `src/data/bleach/index.ts`, che a sua volta legge `animeWorlds`.
 * Nessun import di dataset qui: solo tipi.
 */

/**
 * CATEGORIE DI POTERE (`ability.categories` → `jutsu.type`, e
 * `character.abilityCategory` come badge): la fonte del potere spirituale.
 */
export const BLEACH_POWER_CATEGORIES: LabeledOption[] = [
  { id: 'zanpakuto', label: { it: 'Zanpakutō', en: 'Zanpakutō', ja: '斬魄刀' } },
  { id: 'kido', label: { it: 'Kidō', en: 'Kidō', ja: '鬼道' } },
  { id: 'hoho', label: { it: 'Hohō (movimento)', en: 'Hohō (footwork)', ja: '歩法' } },
  { id: 'hakuda', label: { it: 'Hakuda (corpo a corpo)', en: 'Hakuda (hand-to-hand)', ja: '白打' } },
  { id: 'hollow', label: { it: 'Poteri Hollow / Arrancar', en: 'Hollow / Arrancar powers', ja: '虚の力' } },
  { id: 'quincy', label: { it: 'Poteri Quincy', en: 'Quincy powers', ja: '滅却師の力' } },
  { id: 'fullbring', label: { it: 'Fullbring', en: 'Fullbring', ja: '完現術' } },
  { id: 'spiritual', label: { it: 'Poteri spirituali umani', en: 'Human spiritual powers', ja: '人間の霊能力' } },
  { id: 'artifact', label: { it: 'Artefatto', en: 'Artifact', ja: '道具' } },
];

/**
 * RILASCIO / CLASSE (`ability.attribute` → `jutsu.chakraNature`): lo stadio di
 * rilascio di una Zanpakutō (Shikai, Bankai), la forma di un Arrancar
 * (Resurrección) o di un Quincy (Vollständig, Schrift), o la scuola del Kidō.
 * Una Zanpakutō con Shikai E Bankai noti porta entrambi i valori: filtrare
 * «Bankai» mostra tutte le spade di cui si conosce il Bankai.
 */
export const BLEACH_RELEASE_KINDS: LabeledOption[] = [
  { id: 'shikai', label: { it: 'Shikai', en: 'Shikai', ja: '始解' } },
  { id: 'bankai', label: { it: 'Bankai', en: 'Bankai', ja: '卍解' } },
  { id: 'resurreccion', label: { it: 'Resurrección', en: 'Resurrección', ja: '帰刃' } },
  { id: 'segunda_etapa', label: { it: 'Resurrección Segunda Etapa', en: 'Resurrección Segunda Etapa', ja: '刀剣解放第二階層' } },
  { id: 'hollowfication', label: { it: 'Hollowificazione', en: 'Hollowfication', ja: '虚化' } },
  { id: 'vollstandig', label: { it: 'Vollständig', en: 'Vollständig', ja: '完聖体' } },
  { id: 'schrift', label: { it: 'Schrift (lettera)', en: 'Schrift (letter)', ja: '聖文字' } },
  { id: 'hado', label: { it: 'Hadō (distruzione)', en: 'Hadō (destruction)', ja: '破道' } },
  { id: 'bakudo', label: { it: 'Bakudō (vincolo)', en: 'Bakudō (binding)', ja: '縛道' } },
  { id: 'kaido', label: { it: 'Kaidō (guarigione)', en: 'Kaidō (healing)', ja: '回道' } },
  { id: 'kinjutsu', label: { it: 'Tecnica proibita', en: 'Forbidden technique', ja: '禁術' } },
  { id: 'technique', label: { it: 'Tecnica', en: 'Technique', ja: '技' } },
];

/**
 * GRADI (`characterRank` → `character.ninjaRank`): la scala del Gotei 13, poi
 * gli equivalenti delle altre fazioni. L'ordine dell'array è l'ordine del filtro.
 */
export const BLEACH_RANKS: LabeledOption[] = [
  { id: 'soul_king', label: { it: 'Re delle Anime', en: 'Soul King', ja: '霊王' } },
  { id: 'royal_guard', label: { it: 'Divisione Zero', en: 'Royal Guard (Zero Division)', ja: '零番隊' } },
  { id: 'captain_commander', label: { it: 'Capitano generale', en: 'Captain-Commander', ja: '総隊長' } },
  { id: 'captain', label: { it: 'Capitano', en: 'Captain', ja: '隊長' } },
  { id: 'lieutenant', label: { it: 'Vicecapitano', en: 'Lieutenant', ja: '副隊長' } },
  { id: 'seated_officer', label: { it: 'Ufficiale con seggio', en: 'Seated officer', ja: '席官' } },
  { id: 'shinigami', label: { it: 'Shinigami', en: 'Soul Reaper', ja: '死神' } },
  { id: 'substitute_shinigami', label: { it: 'Sostituto Shinigami', en: 'Substitute Soul Reaper', ja: '死神代行' } },
  { id: 'visored', label: { it: 'Visored', en: 'Visored', ja: '仮面の軍勢' } },
  { id: 'quincy_emperor', label: { it: 'Imperatore dei Quincy', en: 'Quincy Emperor', ja: '滅却師の始祖' } },
  { id: 'sternritter', label: { it: 'Sternritter', en: 'Sternritter', ja: '星十字騎士団' } },
  { id: 'quincy', label: { it: 'Quincy', en: 'Quincy', ja: '滅却師' } },
  { id: 'espada', label: { it: 'Espada', en: 'Espada', ja: '十刃' } },
  { id: 'privaron_espada', label: { it: 'Privaron Espada', en: 'Privaron Espada', ja: '十刃落ち' } },
  { id: 'fraccion', label: { it: 'Fracción', en: 'Fracción', ja: '従属官' } },
  { id: 'numeros', label: { it: 'Números', en: 'Números', ja: '数字持ち' } },
  { id: 'hollow', label: { it: 'Hollow / Menos', en: 'Hollow / Menos', ja: '虚' } },
  { id: 'fullbringer', label: { it: 'Fullbringer', en: 'Fullbringer', ja: '完現術者' } },
  { id: 'human', label: { it: 'Umano', en: 'Human', ja: '人間' } },
  { id: 'other', label: { it: 'Altro', en: 'Other', ja: 'その他' } },
];

/** RUOLI specifici di Bleach (i ruoli universali sono già localizzati di default). */
export const BLEACH_ROLES: LabeledOption[] = [
  { id: 'substitute_shinigami', label: { it: 'Sostituto Shinigami', en: 'Substitute Soul Reaper', ja: '死神代行' } },
  { id: 'shinigami', label: { it: 'Shinigami', en: 'Soul Reaper', ja: '死神' } },
  { id: 'captain', label: { it: 'Capitano', en: 'Captain', ja: '隊長' } },
  { id: 'lieutenant', label: { it: 'Vicecapitano', en: 'Lieutenant', ja: '副隊長' } },
  { id: 'royal_guard', label: { it: 'Divisione Zero', en: 'Royal Guard', ja: '零番隊' } },
  { id: 'noble', label: { it: 'Nobile', en: 'Noble', ja: '貴族' } },
  { id: 'visored', label: { it: 'Visored', en: 'Visored', ja: '仮面の軍勢' } },
  { id: 'quincy', label: { it: 'Quincy', en: 'Quincy', ja: '滅却師' } },
  { id: 'sternritter', label: { it: 'Sternritter', en: 'Sternritter', ja: '星十字騎士団' } },
  { id: 'arrancar', label: { it: 'Arrancar', en: 'Arrancar', ja: '破面' } },
  { id: 'espada', label: { it: 'Espada', en: 'Espada', ja: '十刃' } },
  { id: 'hollow', label: { it: 'Hollow', en: 'Hollow', ja: '虚' } },
  { id: 'fullbringer', label: { it: 'Fullbringer', en: 'Fullbringer', ja: '完現術者' } },
  { id: 'human', label: { it: 'Umano', en: 'Human', ja: '人間' } },
  { id: 'healer', label: { it: 'Guaritore', en: 'Healer', ja: '治療' } },
  { id: 'scientist', label: { it: 'Scienziato', en: 'Scientist', ja: '科学者' } },
  { id: 'traitor', label: { it: 'Traditore', en: 'Traitor', ja: '裏切り者' } },
  { id: 'rival', label: { it: 'Rivale', en: 'Rival', ja: 'ライバル' } },
  { id: 'zanpakuto_spirit', label: { it: 'Spirito di Zanpakutō', en: 'Zanpakutō spirit', ja: '斬魄刀の本体' } },
];
