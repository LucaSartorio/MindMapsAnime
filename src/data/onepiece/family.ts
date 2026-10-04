import { familyKit, type FamilyLinks } from '../shared/familyKit';

const { p } = familyKit('char-op-');
const charlotte = p(['big-mom']);
const vinsmoke = p(['judge', 'sora']);
const kozuki = p(['oden', 'toki']);
const ryugu = p(['neptune', 'otohime']);

/** Genitori e coniugi, anche adottivi (albero genealogico nella scheda personaggio). */
export const onepieceFamily: Record<string, FamilyLinks> = {
  // Monkey D.
  dragon: p(['garp']),
  luffy: p(['dragon']),
  ace: p(['roger', 'rouge']),
  // Charlotte (figli di Big Mom)
  perospero: charlotte,
  katakuri: charlotte,
  daifuku: charlotte,
  oven: charlotte,
  compote: charlotte,
  smoothie: charlotte,
  cracker: charlotte,
  brulee: charlotte,
  'mont-dor': charlotte,
  galette: charlotte,
  chiffon: charlotte,
  lola: charlotte,
  pudding: charlotte,
  // Vinsmoke
  reiju: vinsmoke,
  ichiji: vinsmoke,
  niji: vinsmoke,
  yonji: vinsmoke,
  sanji: vinsmoke,
  // Kozuki
  oden: p(['sukiyaki'], ['toki']),
  momonosuke: kozuki,
  hiyori: kozuki,
  // Ryugu
  fukaboshi: ryugu,
  ryuboshi: ryugu,
  manboshi: ryugu,
  shirahoshi: ryugu,
  // Altri
  yamato: p(['kaido']),
  usopp: p(['yasopp']),
  robin: p(['olvia']),
  vivi: p(['cobra']),
  bonney: p(['kuma']),
  nami: p(['bellemere']),
  nojiko: p(['bellemere']),
  uta: p(['shanks']),
};
