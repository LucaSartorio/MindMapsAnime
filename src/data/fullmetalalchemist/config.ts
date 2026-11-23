import type { LabeledOption } from '@/types';

/**
 * Ruoli specifici di Fullmetal Alchemist (quelli universali — protagonist, antagonist,
 * mentor, villain, ally… — sono già localizzati). Usati da `Character.role` e risolti
 * tramite `WorldConfig.characterRoles`.
 */
export const FMA_ROLES: LabeledOption[] = [
  { id: 'state_alchemist', label: { it: 'Alchimista di Stato', en: 'State Alchemist', ja: '国家錬金術師' } },
  { id: 'military', label: { it: 'Militare', en: 'Military', ja: '軍人' } },
  { id: 'alchemist', label: { it: 'Alchimista', en: 'Alchemist', ja: '錬金術師' } },
  { id: 'homunculus', label: { it: 'Homunculus', en: 'Homunculus', ja: 'ホムンクルス' } },
  { id: 'ishvalan', label: { it: 'Ishvaliano', en: 'Ishvalan', ja: 'イシュヴァール人' } },
  { id: 'xingese', label: { it: 'Xingese', en: 'Xingese', ja: 'シン国の人' } },
  { id: 'automail_mechanic', label: { it: 'Meccanico di automail', en: 'Automail mechanic', ja: '機械鎧技師' } },
];

/**
 * CATEGORIE del sistema di poteri (`ability.categories` → `jutsu.type`): i principi
 * dell'alchimia, l'alchimia amestriana, l'alcahestria di Xing, l'alchimia proibita
 * (trasmutazione umana e Pietra Filosofale), i poteri degli Homunculus e, a parte,
 * l'alchimia del film «La Stella Sacra di Milos» (`canonStatus: 'movie'`).
 * L'automail non è una categoria: è tecnologia, non alchimia. Nessun secondo facet
 * (`ability.attribute`): la fonte del potere distingue già le categorie.
 */
export const FMA_ABILITY_CATEGORIES: LabeledOption[] = [
  { id: 'principle', label: { it: "Principi dell'alchimia", en: 'Principles of alchemy', ja: '錬金術の原理' } },
  { id: 'amestrian_alchemy', label: { it: 'Alchimia amestriana', en: 'Amestrian alchemy', ja: '錬金術' } },
  { id: 'alkahestry', label: { it: 'Alcahestria (Xing)', en: 'Alkahestry (Xing)', ja: '錬丹術' } },
  { id: 'forbidden_alchemy', label: { it: 'Alchimia proibita', en: 'Forbidden alchemy', ja: '禁忌の錬金術' } },
  { id: 'homunculus', label: { it: 'Poteri degli Homunculus', en: 'Homunculus powers', ja: 'ホムンクルスの能力' } },
  { id: 'milos', label: { it: 'Alchimia di Milos (film)', en: 'Alchemy of Milos (film)' } },
];
