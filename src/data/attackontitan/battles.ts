import type { BattleOutcome } from '@/types';
import { battleKit } from '../shared/battleKit';

const { win, stop } = battleKit('char-aot-');
const L = (it: string, en: string) => ({ it, en });

/** Esiti degli scontri di Attack on Titan (bilancio nella scheda personaggio). */
export const aotBattles: Record<string, BattleOutcome> = {
  'evt-aot-female-trapped': stop(['erwin', 'levi', 'mikasa'], ['annie'], L('Annie chiama i Giganti a divorare la sua nuca e fugge.', 'Annie calls the Titans to devour her nape and escapes.')),
  'evt-aot-levi-squad-dies': win(['annie'], ['petra', 'oluo', 'eld', 'gunther', 'eren']),
  'evt-aot-battle-stohess': win(['eren', 'mikasa', 'armin'], ['annie'], L('Sconfitta, Annie si chiude in un cristallo.', 'Defeated, Annie encases herself in crystal.')),
  'evt-aot-mike-death': win(['zeke'], ['mike']),
  'evt-aot-reiner-reveal': win(['reiner', 'bertolt'], ['eren', 'mikasa'], L('Reiner e Bertolt rapiscono Eren e Ymir.', 'Reiner and Bertolt abduct Eren and Ymir.')),
  'evt-aot-eren-rescue': win(['erwin', 'armin', 'mikasa', 'jean'], ['reiner', 'bertolt']),
  'evt-aot-coordinate-awakens': win(['eren', 'mikasa'], ['reiner', 'bertolt'], L('Il Coordinamento scaglia i Giganti puri contro i Guerrieri, che si ritirano.', 'The Coordinate hurls the pure Titans at the Warriors, who retreat.')),
  'evt-aot-kenny-ambush': stop(['levi'], ['kenny']),
  'evt-aot-orvud': win(['historia', 'levi', 'eren', 'erwin', 'mikasa'], ['rod-reiss']),
  'evt-aot-armored-thunder-spears': stop(['hange', 'mikasa', 'jean', 'connie', 'sasha', 'armin'], ['reiner'], L('Reiner cade, ma Bertolt arriva dal cielo.', 'Reiner falls, but Bertolt arrives from the sky.')),
  'evt-aot-levi-vs-beast': win(['levi'], ['zeke'], L('Pieck porta via Zeke prima del colpo di grazia.', 'Pieck carries Zeke away before the final blow.')),
  'evt-aot-armin-sacrifice': win(['armin', 'eren'], ['bertolt']),
  'evt-aot-war-hammer-devoured': win(['eren'], ['lara-tybur']),
  'evt-aot-levi-zeke-forest': win(['zeke'], ['levi'], L('Levi si salva per un soffio dall’esplosione della lancia-tuono.', 'Levi barely survives the thunder spear explosion.')),
  'evt-aot-zeke-death': win(['levi'], ['zeke']),
  'evt-aot-fort-salta': win(['armin', 'mikasa', 'levi', 'jean', 'connie', 'annie', 'reiner', 'pieck'], ['eren']),
};
