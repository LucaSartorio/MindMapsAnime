import { familyKit, type FamilyLinks } from '../shared/familyKit';

const { p } = familyKit('char-aot-');

/** Genitori e coniugi (albero genealogico nella scheda personaggio). */
export const aotFamily: Record<string, FamilyLinks> = {
  eren: p(['grisha', 'carla']),
  zeke: p(['grisha', 'dina']),
  historia: p(['rod-reiss', 'alma']),
  'frieda-reiss': p(['rod-reiss']),
  levi: p(['kuchel']),
  reiner: p(['karina']),
};
