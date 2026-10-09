import { familyKit, type FamilyLinks } from '../shared/familyKit';

const { p } = familyKit('char-hxh-');
const zoldyck = p(['silva', 'kikyo']);

/** Genitori e coniugi (albero genealogico nella scheda personaggio). */
export const hxhFamily: Record<string, FamilyLinks> = {
  gon: p(['ging']),
  // Zoldyck
  zeno: p(['maha']),
  silva: p(['zeno'], ['kikyo']),
  illumi: zoldyck,
  milluki: zoldyck,
  killua: zoldyck,
  alluka: zoldyck,
  kalluto: zoldyck,
  // I principi di Kakin, figli del re Nasubi
  benjamin: p(['nasubi', 'unma']),
  camilla: p(['nasubi', 'duazul']),
  'zhang-lei': p(['nasubi', 'tangzhao']),
  tserriednich: p(['nasubi', 'unma']),
  tubeppa: p(['nasubi', 'duazul']),
  tyson: p(['nasubi', 'katrono']),
  luzurus: p(['nasubi', 'duazul']),
  'sale-sale': p(['nasubi', 'swinkoswinko']),
  halkenburg: p(['nasubi', 'unma']),
  kacho: p(['nasubi', 'seiko']),
  fugetsu: p(['nasubi', 'seiko']),
  momoze: p(['nasubi', 'sevanti']),
  marayam: p(['nasubi', 'sevanti']),
  woble: p(['nasubi', 'oito']),
};
