import { familyKit, type FamilyLinks } from '../shared/familyKit';

const { p, s } = familyKit('char-bl-');
const kurosaki = p(['isshin', 'masaki']);

/** Genitori e coniugi (albero genealogico nella scheda personaggio). */
export const bleachFamily: Record<string, FamilyLinks> = {
  ichigo: p(['isshin', 'masaki'], ['orihime']),
  karin: kurosaki,
  yuzu: kurosaki,
  kazui: p(['ichigo', 'orihime']),
  uryu: p(['ryuken']),
  ryuken: p(['soken']),
  byakuya: s('hisana'),
  renji: s('rukia'),
  ichika: p(['renji', 'rukia']),
};
