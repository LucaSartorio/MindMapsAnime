import { familyKit, type FamilyLinks } from '../shared/familyKit';

const { p, s } = familyKit('char-fma-');

/**
 * Genitori e coniugi (albero genealogico nella scheda personaggio): solo i legami fra i personaggi del dataset.
 * Fonti: S9 (Hohenheim e Trisha genitori di Edward e Alphonse; Hughes e Gracia genitori di Elicia; Sig marito di
 * Izumi; l'imperatore di Xing padre di Ling e May; Pinako nonna paterna di Winry), S24 (Urey e Sara Rockbell genitori di
 * Winry e figlio/nuora di Pinako; Philip Gargantos Armstrong padre di Alex e Olivier), S12 (Edward sposa Winry).
 * Fratelli e sorellastre sono ricavati da `familyTree` (Alex/Olivier dal padre comune; Ling/May dal padre comune).
 * Restano senza scheda: la madre degli Armstrong (senza nome nelle fonti), le sorelle minori Armstrong, i genitori
 * dei Crichton.
 */
export const fmaFamily: Record<string, FamilyLinks> = {
  'edward-elric': { ...p(['van-hohenheim', 'trisha-elric']), ...s('winry-rockbell') },
  'alphonse-elric': p(['van-hohenheim', 'trisha-elric']),
  'van-hohenheim': s('trisha-elric'),
  'winry-rockbell': p(['urey-rockbell', 'sara-rockbell']),
  'urey-rockbell': { ...p(['pinako-rockbell']), ...s('sara-rockbell') },
  'alex-louis-armstrong': p(['philip-gargantos-armstrong']),
  'olivier-mira-armstrong': p(['philip-gargantos-armstrong']),
  'maes-hughes': s('gracia-hughes'),
  'elicia-hughes': p(['maes-hughes', 'gracia-hughes']),
  'izumi-curtis': s('sig-curtis'),
  'ling-yao': p(['emperor-of-xing']),
  'may-chang': p(['emperor-of-xing']),
};
