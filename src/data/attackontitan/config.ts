import type { LabeledOption } from '@/types';

/**
 * Tassonomie di Attack on Titan usate dal `WorldConfig` in `src/data/worlds.ts`.
 * File a parte perché `worlds.ts` non può importare il dataset (che legge
 * `animeWorlds`): qui solo tipi e costanti.
 */

/**
 * CATEGORIE DI POTERE (`ability.categories` → `jutsu.type`; `character.abilityCategory`
 * come badge): i Nove Giganti, i poteri legati ai Giganti, il sangue reale, gli
 * Ackerman e la tecnologia umana con cui l'umanità combatte.
 */
export const AOT_POWER_CATEGORIES: LabeledOption[] = [
  { id: 'nine_titans', label: { it: 'I Nove Giganti', en: 'The Nine Titans', ja: '九つの巨人' } },
  { id: 'titan_power', label: { it: 'Poteri dei Giganti', en: 'Titan powers', ja: '巨人の力' } },
  { id: 'royal_blood', label: { it: 'Sangue reale e Fondatore', en: 'Royal blood & Founder', ja: '王家の血' } },
  { id: 'ackerman', label: { it: 'Ackerman', en: 'Ackerman', ja: 'アッカーマン' } },
  { id: 'equipment', label: { it: 'Equipaggiamento', en: 'Equipment', ja: '装備' } },
  { id: 'weapon', label: { it: 'Armi', en: 'Weapons', ja: '兵器' } },
  { id: 'science', label: { it: 'Siero e scienza', en: 'Serum & science', ja: '脊髄液・科学' } },
  { id: 'tactic', label: { it: 'Tattiche', en: 'Tactics', ja: '戦術' } },
];

/**
 * ORIGINE (`ability.attribute` → `jutsu.chakraNature`): chi ha creato o usa quel
 * potere. Un potere può avere più origini (i Nove Giganti nascono nell'Impero eldiano
 * e passano di mano fra Paradis e Marley).
 */
export const AOT_ORIGINS: LabeledOption[] = [
  { id: 'ymir', label: { it: 'Ymir Fritz', en: 'Ymir Fritz', ja: 'ユミル・フリッツ' } },
  { id: 'eldian_empire', label: { it: 'Impero eldiano', en: 'Eldian Empire', ja: 'エルディア帝国' } },
  { id: 'paradis', label: { it: 'Paradis', en: 'Paradis', ja: 'パラディ島' } },
  { id: 'marley', label: { it: 'Marley', en: 'Marley', ja: 'マーレ' } },
  { id: 'hizuru', label: { it: 'Hizuru', en: 'Hizuru', ja: 'ヒィズル' } },
];

/** GRADI (`characterRank` → `character.ninjaRank`), in ordine di filtro. */
export const AOT_RANKS: LabeledOption[] = [
  { id: 'monarch', label: { it: 'Sovrano', en: 'Monarch', ja: '王' } },
  { id: 'supreme_commander', label: { it: 'Comandante supremo', en: 'Supreme Commander', ja: '総統' } },
  { id: 'commander', label: { it: 'Comandante', en: 'Commander', ja: '団長・司令' } },
  { id: 'squad_leader', label: { it: 'Caposquadra', en: 'Squad Leader', ja: '分隊長・班長' } },
  { id: 'captain', label: { it: 'Capitano', en: 'Captain', ja: '兵士長・隊長' } },
  { id: 'soldier', label: { it: 'Soldato', en: 'Soldier', ja: '兵士' } },
  { id: 'trainee', label: { it: 'Recluta', en: 'Trainee', ja: '訓練兵' } },
  { id: 'instructor', label: { it: 'Istruttore', en: 'Instructor', ja: '教官' } },
  { id: 'warrior', label: { it: 'Guerriero di Marley', en: 'Marleyan Warrior', ja: '戦士' } },
  { id: 'warrior_candidate', label: { it: 'Aspirante Guerriero', en: 'Warrior candidate', ja: '戦士候補生' } },
  { id: 'marley_officer', label: { it: 'Ufficiale di Marley', en: 'Marleyan officer', ja: 'マーレ軍人' } },
  { id: 'noble', label: { it: 'Nobile', en: 'Noble', ja: '貴族' } },
  { id: 'civilian', label: { it: 'Civile', en: 'Civilian', ja: '民間人' } },
  { id: 'titan', label: { it: 'Gigante', en: 'Titan', ja: '巨人' } },
];

/** RUOLI specifici dell'opera (i ruoli universali sono già localizzati). */
export const AOT_ROLES: LabeledOption[] = [
  { id: 'titan_shifter', label: { it: 'Mutaforma (Gigante)', en: 'Titan shifter', ja: '巨人化能力者' } },
  { id: 'survey_corps', label: { it: 'Corpo di Ricerca', en: 'Survey Corps', ja: '調査兵団' } },
  { id: 'garrison', label: { it: 'Guarnigione', en: 'Garrison', ja: '駐屯兵団' } },
  { id: 'military_police', label: { it: 'Gendarmeria', en: 'Military Police', ja: '憲兵団' } },
  { id: 'cadet', label: { it: 'Recluta del 104º', en: '104th Cadet', ja: '第104期訓練兵' } },
  { id: 'warrior', label: { it: 'Guerriero', en: 'Warrior', ja: '戦士' } },
  { id: 'royal', label: { it: 'Famiglia reale', en: 'Royal family', ja: '王家' } },
  { id: 'ackerman', label: { it: 'Ackerman', en: 'Ackerman', ja: 'アッカーマン' } },
  { id: 'restorationist', label: { it: 'Restauratore eldiano', en: 'Eldian Restorationist', ja: 'エルディア復権派' } },
  { id: 'yeagerist', label: { it: 'Jaegerista', en: 'Yeagerist', ja: 'イェーガー派' } },
  { id: 'volunteer', label: { it: 'Volontario anti-Marley', en: 'Anti-Marleyan volunteer', ja: '反マーレ派義勇兵' } },
  { id: 'marley_military', label: { it: 'Esercito di Marley', en: 'Marleyan military', ja: 'マーレ軍' } },
  { id: 'diplomat', label: { it: 'Diplomatico', en: 'Diplomat', ja: '外交官' } },
  { id: 'doctor', label: { it: 'Medico', en: 'Doctor', ja: '医者' } },
  { id: 'scientist', label: { it: 'Scienziato', en: 'Scientist', ja: '科学者' } },
  { id: 'priest', label: { it: 'Religioso', en: 'Clergy', ja: '聖職者' } },
  { id: 'merchant', label: { it: 'Mercante', en: 'Merchant', ja: '商人' } },
  { id: 'civilian', label: { it: 'Civile', en: 'Civilian', ja: '民間人' } },
  { id: 'pure_titan', label: { it: 'Gigante puro', en: 'Pure Titan', ja: '無垢の巨人' } },
  { id: 'traitor', label: { it: 'Traditore', en: 'Traitor', ja: '裏切り者' } },
  { id: 'instructor', label: { it: 'Istruttore', en: 'Instructor', ja: '教官' } },
];
