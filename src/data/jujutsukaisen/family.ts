import { familyKit, type FamilyLinks } from '../shared/familyKit';

const { p } = familyKit('char-jjk-');

/** Genitori e coniugi (albero genealogico nella scheda personaggio). */
export const jjkFamily: Record<string, FamilyLinks> = {
  jin: p(['wasuke']),
  yuji: p(['jin', 'kaori']),
  maki: p(['ogi']),
  mai: p(['ogi']),
  naoya: p(['naobito']),
  megumi: p(['toji']),
};
