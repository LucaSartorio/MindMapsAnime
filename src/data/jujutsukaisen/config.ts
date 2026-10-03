import type { LabeledOption } from '@/types';

/**
 * Tassonomie di Jujutsu Kaisen usate dal `WorldConfig` in `src/data/worlds.ts`.
 * File a parte perché `worlds.ts` non può importare il dataset: qui solo costanti.
 */

/**
 * CATEGORIE (`ability.categories` → `jutsu.type`; `character.abilityCategory` come badge):
 * la tecnica innata, le sue estensioni, le espansioni del dominio, le tecniche di base
 * dell'energia malefica, le barriere, i vincoli celesti, gli shikigami, gli strumenti e
 * gli oggetti maledetti.
 */
export const JJK_TECHNIQUE_CATEGORIES: LabeledOption[] = [
  { id: 'innate', label: { it: 'Tecnica innata', en: 'Innate technique', ja: '生得術式' } },
  { id: 'extension', label: { it: 'Estensione della tecnica', en: 'Technique extension', ja: '術式の拡張' } },
  { id: 'domain', label: { it: 'Espansione del dominio', en: 'Domain Expansion', ja: '領域展開' } },
  { id: 'fundamental', label: { it: 'Arti dell\'energia malefica', en: 'Cursed energy arts', ja: '呪力の技術' } },
  { id: 'barrier', label: { it: 'Barriere', en: 'Barriers', ja: '結界術' } },
  { id: 'heavenly_restriction', label: { it: 'Vincolo celeste', en: 'Heavenly Restriction', ja: '天与呪縛' } },
  { id: 'shikigami', label: { it: 'Shikigami', en: 'Shikigami', ja: '式神' } },
  { id: 'cursed_tool', label: { it: 'Strumento maledetto', en: 'Cursed tool', ja: '呪具' } },
  { id: 'cursed_object', label: { it: 'Oggetto maledetto', en: 'Cursed object', ja: '呪物' } },
];

/**
 * STIRPE / FONTE (`ability.attribute` → `jutsu.chakraNature`): da dove viene il potere.
 * Le tecniche ereditarie dei tre grandi clan, quelle di Sukuna, degli spiriti maledetti,
 * degli stregoni reincarnati del Culling Game e quelle «comuni» a tutti gli stregoni.
 */
export const JJK_LINEAGES: LabeledOption[] = [
  { id: 'gojo_clan', label: { it: 'Clan Gojo', en: 'Gojo clan', ja: '五条家' } },
  { id: 'zenin_clan', label: { it: 'Clan Zen\'in', en: 'Zen\'in clan', ja: '禪院家' } },
  { id: 'kamo_clan', label: { it: 'Clan Kamo', en: 'Kamo clan', ja: '加茂家' } },
  { id: 'sukuna', label: { it: 'Sukuna', en: 'Sukuna', ja: '宿儺' } },
  { id: 'cursed_spirit', label: { it: 'Spiriti maledetti', en: 'Cursed spirits', ja: '呪霊' } },
  { id: 'curse_user', label: { it: 'Utilizzatori di maledizioni', en: 'Curse users', ja: '呪詛師' } },
  { id: 'reincarnated', label: { it: 'Stregoni reincarnati', en: 'Reincarnated sorcerers', ja: '受肉した術師' } },
  { id: 'sorcerer', label: { it: 'Stregoni', en: 'Jujutsu sorcerers', ja: '呪術師' } },
];

/** GRADI (`characterRank` → `character.ninjaRank`), dal più alto al più basso. */
export const JJK_RANKS: LabeledOption[] = [
  { id: 'special_grade', label: { it: 'Grado speciale', en: 'Special grade', ja: '特級' } },
  { id: 'grade_1', label: { it: 'Primo grado', en: 'Grade 1', ja: '1級' } },
  { id: 'semi_grade_1', label: { it: 'Semi-primo grado', en: 'Semi-grade 1', ja: '準1級' } },
  { id: 'grade_2', label: { it: 'Secondo grado', en: 'Grade 2', ja: '2級' } },
  { id: 'grade_3', label: { it: 'Terzo grado', en: 'Grade 3', ja: '3級' } },
  { id: 'grade_4', label: { it: 'Quarto grado', en: 'Grade 4', ja: '4級' } },
  { id: 'assistant', label: { it: 'Assistente (supervisore)', en: 'Assistant manager', ja: '補助監督' } },
  { id: 'non_sorcerer', label: { it: 'Non stregone', en: 'Non-sorcerer', ja: '非術師' } },
];

/** RUOLI specifici dell'opera. */
export const JJK_ROLES: LabeledOption[] = [
  { id: 'student', label: { it: 'Studente (Tokyo)', en: 'Student (Tokyo)', ja: '東京校生' } },
  { id: 'student_kyoto', label: { it: 'Studente (Kyoto)', en: 'Student (Kyoto)', ja: '京都校生' } },
  { id: 'teacher', label: { it: 'Insegnante', en: 'Teacher', ja: '教師' } },
  { id: 'sorcerer', label: { it: 'Stregone', en: 'Sorcerer', ja: '呪術師' } },
  { id: 'assistant', label: { it: 'Assistente', en: 'Assistant', ja: '補助監督' } },
  { id: 'doctor', label: { it: 'Medico', en: 'Doctor', ja: '医師' } },
  { id: 'clan_head', label: { it: 'Capo clan', en: 'Clan head', ja: '当主' } },
  { id: 'higher_up', label: { it: 'Alti vertici', en: 'Higher-ups', ja: '上層部' } },
  { id: 'vessel', label: { it: 'Contenitore', en: 'Vessel', ja: '器' } },
  { id: 'cursed_spirit', label: { it: 'Spirito maledetto', en: 'Cursed spirit', ja: '呪霊' } },
  { id: 'curse_user', label: { it: 'Utilizzatore di maledizioni', en: 'Curse user', ja: '呪詛師' } },
  { id: 'cursed_womb', label: { it: 'Grembo maledetto', en: 'Cursed womb', ja: '呪胎' } },
  { id: 'player', label: { it: 'Giocatore del Culling Game', en: 'Culling Game player', ja: '泳者' } },
  { id: 'reincarnated', label: { it: 'Stregone reincarnato', en: 'Reincarnated sorcerer', ja: '受肉体' } },
  { id: 'civilian', label: { it: 'Civile', en: 'Civilian', ja: '一般人' } },
];
