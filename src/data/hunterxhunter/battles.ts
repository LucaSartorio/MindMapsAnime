import type { BattleOutcome } from '@/types';
import { battleKit } from '../shared/battleKit';

const { win, stop } = battleKit('char-hxh-');
const L = (it: string, en: string) => ({ it, en });

/** Esiti degli scontri di Hunter x Hunter (bilancio nella scheda personaggio). */
export const hxhBattles: Record<string, BattleOutcome> = {
  'ev-hxh-gon-vs-hanzo': win(['gon'], ['hanzo'], L('Hanzo si arrende pur avendo dominato lo scontro.', 'Hanzo forfeits despite having dominated the fight.')),
  'ev-hxh-gon-floor-matches': win(['gon'], ['gido']),
  'ev-hxh-hisoka-vs-kastro': win(['hisoka'], ['kastro']),
  'ev-hxh-gon-vs-hisoka': win(['hisoka'], ['gon'], L('Gon gli restituisce la targhetta con un pugno, poi Hisoka vince.', 'Gon returns the badge with a punch, then Hisoka wins.')),
  'ev-hxh-kurapika-vs-uvogin': win(['kurapika'], ['uvogin']),
  'ev-hxh-zeno-silva-vs-chrollo': stop(['zeno', 'silva'], ['chrollo'], L('Gli Zoldyck si ritirano quando il loro incarico viene meno.', 'The Zoldycks withdraw when their job is called off.')),
  'ev-hxh-kurapika-vs-chrollo': win(['kurapika'], ['chrollo']),
  'ev-hxh-dodgeball-razor': win(['gon', 'killua', 'hisoka', 'biscuit'], ['razor']),
  'ev-hxh-gon-vs-genthru': win(['gon'], ['genthru']),
  'ev-hxh-cheetu-vs-morel': win(['morel'], ['cheetu']),
  'ev-hxh-knuckle-vs-youpi': stop(['knuckle'], ['menthuthuyoupi']),
  'ev-hxh-netero-vs-meruem': win(['meruem'], ['netero'], L('Netero si fa esplodere con la Rosa dei Poveri, che avvelena il Re.', 'Netero blows himself up with the Poor Man’s Rose, which poisons the King.')),
  'ev-hxh-gon-vs-pitou': win(['gon'], ['neferpitou']),
  'ev-hxh-hisoka-vs-chrollo': win(['chrollo'], ['hisoka'], L('Hisoka muore e torna in vita grazie al suo Nen.', 'Hisoka dies and comes back to life through his own Nen.')),
};
