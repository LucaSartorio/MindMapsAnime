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
