import type { Character } from '@/types';

/**
 * Override delle relazioni "core" del cast principale. Applicato a runtime
 * sopra ai dati esistenti, **prima** del densifier dei cross-link: i nuovi
 * alleati/famigliari elencati qui vengono uniti a quelli esistenti, poi il
 * densifier si occupa della simmetria.
 *
 * Serve a coprire alleanze ovvie ma non dichiarate (es. Naruto ↔ Iruka):
 * elencandole in un solo posto ne otteniamo la simmetria automatica
 * grazie a `densifyCrossLinks`.
 */
type Patch = Partial<Pick<Character, 'family' | 'allies' | 'enemies' | 'teachers' | 'students'>>;

export const NARUTO_RELATION_OVERRIDES: Record<string, Patch> = {
  'char-naruto': {
    allies: ['char-kakashi', 'char-sakura', 'char-iruka', 'char-konohamaru', 'char-tsunade', 'char-yamato', 'char-sai', 'char-hinata', 'char-shikamaru', 'char-choji', 'char-rock-lee', 'char-tenten', 'char-neji', 'char-kiba', 'char-shino', 'char-ino', 'char-temari', 'char-kankuro'],
    enemies: ['char-pain', 'char-obito', 'char-madara', 'char-kaguya', 'char-isshiki'],
    students: ['char-konohamaru', 'char-boruto'],
  },
  'char-sasuke': {
    allies: ['char-kakashi', 'char-sakura', 'char-naruto', 'char-jugo', 'char-suigetsu', 'char-karin'],
    enemies: ['char-itachi', 'char-orochimaru', 'char-danzo', 'char-kaguya', 'char-isshiki'],
    family: ['char-sarada'],
    students: ['char-boruto'],
  },
  'char-sakura': {
    allies: ['char-naruto', 'char-sasuke', 'char-kakashi', 'char-tsunade', 'char-shizune'],
    teachers: ['char-tsunade', 'char-kakashi'],
    family: ['char-sarada', 'char-mebuki', 'char-kizashi'],
  },
  'char-kakashi': {
    allies: ['char-naruto', 'char-sasuke', 'char-sakura', 'char-sai', 'char-yamato', 'char-guy', 'char-asuma', 'char-kurenai'],
    teachers: ['char-minato'],
    students: ['char-naruto', 'char-sasuke', 'char-sakura'],
    family: ['char-sakumo'],
  },
  'char-hinata': {
    allies: ['char-kiba', 'char-shino', 'char-kurenai', 'char-naruto'],
    family: ['char-hiashi', 'char-hanabi', 'char-hizashi', 'char-neji', 'char-boruto', 'char-himawari'],
  },
  'char-itachi': {
    allies: ['char-shisui', 'char-kisame'],
    enemies: ['char-sasuke', 'char-kabuto'],
    family: ['char-sasuke', 'char-fugaku', 'char-mikoto'],
  },
  'char-boruto': {
    allies: ['char-sarada', 'char-mitsuki', 'char-kawaki', 'char-konohamaru'],
    teachers: ['char-konohamaru', 'char-sasuke'],
    family: ['char-naruto', 'char-hinata', 'char-himawari'],
  },
  'char-konohamaru': {
    students: ['char-boruto', 'char-sarada', 'char-mitsuki'],
    teachers: ['char-asuma', 'char-naruto'],
    family: ['char-hiruzen', 'char-asuma'],
  },
  'char-iruka': {
    students: ['char-naruto'],
    allies: ['char-kakashi'],
  },
  'char-jiraiya': {
    teachers: ['char-hiruzen'],
    students: ['char-minato', 'char-naruto', 'char-nagato', 'char-konan', 'char-yahiko'],
    allies: ['char-tsunade'],
    enemies: ['char-orochimaru', 'char-pain'],
    family: [],
  },
  'char-minato': {
    teachers: ['char-jiraiya'],
    students: ['char-kakashi', 'char-obito', 'char-rin'],
    family: ['char-kushina', 'char-naruto'],
  },
  'char-tsunade': {
    teachers: ['char-hiruzen'],
    students: ['char-sakura', 'char-shizune'],
    allies: ['char-jiraiya'],
    family: ['char-hashirama', 'char-tobirama', 'char-nawaki', 'char-dan-kato'],
  },
};
