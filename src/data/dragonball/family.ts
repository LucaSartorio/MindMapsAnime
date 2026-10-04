import { familyKit, type FamilyLinks } from '../shared/familyKit';

const { p } = familyKit('char-dbz-');
const saiyanBrothers = p(['bardock', 'gine']);
const sonBrothers = p(['goku', 'chichi']);
const briefKids = p(['vegeta', 'bulma']);

/** Genitori e coniugi (albero genealogico nella scheda personaggio). */
export const dragonballFamily: Record<string, FamilyLinks> = {
  goku: saiyanBrothers,
  raditz: saiyanBrothers,
  chichi: p(['ox-king'], ['goku']),
  gohan: sonBrothers,
  goten: sonBrothers,
  'future-gohan': sonBrothers,
  videl: p(['mr-satan'], ['gohan']),
  'gt-pan': p(['gohan', 'videl']),
  vegeta: p(['king-vegeta'], ['bulma']),
  bulma: p(['dr-brief']),
  trunks: briefKids,
  'future-trunks': briefKids,
  bulla: briefKids,
  marron: p(['krillin', 'android-18']),
  frieza: p(['king-cold']),
  cooler: p(['king-cold']),
  broly: p(['paragus']),
  piccolo: p(['king-piccolo']),
};
