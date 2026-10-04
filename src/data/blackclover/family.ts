import { familyKit, type FamilyLinks } from '../shared/familyKit';

const { p, s } = familyKit('char-bc-');
const silva = p(['acier']);

/** Genitori e coniugi (albero genealogico nella scheda personaggio). */
export const bcFamily: Record<string, FamilyLinks> = {
  nozel: silva,
  solid: silva,
  nebra: silva,
  noelle: silva,
  asta: p(['licita']),
  licht: s('tetia'),
};
