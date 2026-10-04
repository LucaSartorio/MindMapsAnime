import { familyKit, type FamilyLinks } from '../shared/familyKit';

const { p, s } = familyKit('char-');

/** Genitori e coniugi (albero genealogico nella scheda personaggio). */
export const narutoFamily: Record<string, FamilyLinks> = {
  // Ōtsutsuki
  hagoromo: p(['kaguya']),
  hamura: p(['kaguya']),
  indra: p(['hagoromo']),
  asura: p(['hagoromo']),
  // Senju
  hashirama: p(['butsuma'], ['mito']),
  tobirama: p(['butsuma']),
  // Uchiha
  madara: p(['tajima']),
  izuna: p(['tajima']),
  itachi: p(['fugaku', 'mikoto']),
  sasuke: p(['fugaku', 'mikoto'], ['sakura']),
  sarada: p(['sasuke', 'sakura']),
  sakura: p(['kizashi', 'mebuki']),
  // Uzumaki / Namikaze
  naruto: p(['minato', 'kushina'], ['hinata']),
  boruto: p(['naruto', 'hinata']),
  himawari: p(['naruto', 'hinata']),
  // Hyūga
  hinata: p(['hiashi']),
  hanabi: p(['hiashi']),
  neji: p(['hizashi']),
  // Sarutobi
  asuma: p(['hiruzen'], ['kurenai']),
  mirai: p(['asuma', 'kurenai']),
  // Ino-Shika-Chō
  shikamaru: p(['shikaku'], ['temari']),
  shikadai: p(['shikamaru', 'temari']),
  choji: p(['choza'], ['karui']),
  chocho: p(['choji', 'karui']),
  ino: p(['inoichi'], ['sai']),
  inojin: p(['ino', 'sai']),
  // Sabaku
  gaara: p(['rasa']),
  temari: p(['rasa']),
  kankuro: p(['rasa']),
  // Hatake
  kakashi: p(['sakumo']),
  kushina: s('minato'),
};
