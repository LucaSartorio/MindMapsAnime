import { familyKit, type FamilyLinks } from '../shared/familyKit';

const { p, s } = familyKit('char-fma-');

/**
 * Genitori e coniugi (albero genealogico nella scheda personaggio): solo i legami fra i personaggi del dataset.
 * Fonti: S9 (Hohenheim padre di Edward e Alphonse), S12 e le schede (Edward sposa Winry).
 * Non si possono ancora esprimere, perché i parenti non hanno una scheda: Trisha Elric (madre degli Elric), i genitori
 * di Winry (Pinako è la nonna paterna: non un genitore), i genitori Armstrong (Alex e Olivier sono fratelli), Gracia
 * ed Elicia Hughes, Sig Curtis (marito di Izumi), l'imperatore di Xing (padre di Ling e May), i genitori dei Crichton.
 */
export const fmaFamily: Record<string, FamilyLinks> = {
  'edward-elric': { ...p(['van-hohenheim']), ...s('winry-rockbell') },
  'alphonse-elric': p(['van-hohenheim']),
};
