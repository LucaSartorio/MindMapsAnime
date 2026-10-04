import { familyKit, type FamilyLinks } from '../shared/familyKit';

const { p } = familyKit('char-hxh-');
const zoldyck = p(['silva', 'kikyo']);
const kakin = p(['nasubi']);

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
  benjamin: kakin,
  camilla: kakin,
  'zhang-lei': kakin,
  tserriednich: kakin,
  tubeppa: kakin,
  tyson: kakin,
  luzurus: kakin,
  sevanti: kakin,
  halkenburg: kakin,
  kacho: kakin,
  fugetsu: kakin,
  momoze: kakin,
  woble: p(['nasubi', 'oito']),
};
