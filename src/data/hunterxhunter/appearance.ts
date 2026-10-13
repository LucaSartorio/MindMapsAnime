import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { d } = appearanceKit();

/**
 * Aspetto dei personaggi principali per i ritratti SVG generati: disegni propri
 * ricostruiti dalle descrizioni testuali (Hunterpedia), nessuna immagine.
 * Chiave = id senza `char-hxh-`.
 */
export const hxhAppearance: Record<string, CharacterAppearance> = {
  gon: d('black', 'saiyan', 'jacket', '#3f8a4a', 'round round normal grin', { eyes: 'hazel', outfit2: '#22232b' }),
  killua: d('white', 'messy', 'tshirt', '#3a4a6a', 'male round normal smirk', { eyes: 'blue', skin: 'pale' }),
  kurapika: d('blond', 'bob', 'cloak', '#3a5ad8', 'female sharp thin neutral', { eyes: 'red', outfit2: '#f1f1f1', marks: ['earrings'] }),
  leorio: d('black', 'buzz', 'suit', '#2b3a6b', 'square small thick grin', { outfit2: '#f1f1f1', outfit3: '#22232b', marks: ['sunglasses'] }),
  hisoka: d('#d8406a', 'slick', 'tshirt', '#f1f1f1', 'long sharp thin smirk', { eyes: 'amber', marks: ['star_tear'] }),
  illumi: d('black', 'hime', 'high_collar', '#3a4a3a', 'long round thin neutral', { eyes: 'black', skin: 'pale' }),
  chrollo: d('#2e2440', 'slick', 'coat', '#3a2a4a', 'male round thin neutral', { eyes: 'gray', outfit2: '#f1f1f1', fur: '#f1f1f1', marks: ['forehead_cross', 'earrings', 'fur_collar'] }),
  netero: d('white', 'bald', 'kimono', '#f1f1f1', 'long narrow thick smile', { eyes: 'black', marks: ['long_beard', 'big_mustache', 'earrings', 'wrinkles'] }),
  ging: d('black', 'spiky', 'robe', '#f1f1f1', 'male round thick smirk', { eyes: 'hazel', accent: '#e9e4d6', marks: ['bandana', 'goatee'] }),
  biscuit: d('blond', 'twin_tails', 'dress', '#d84a8a', 'round big thin smile', { eyes: 'blue', skin: 'fair' }),
  kite: d('white', 'long', 'high_collar', '#f1f1f1', 'long round thin neutral big', { eyes: 'hazel', accent: '#8fc6f0', marks: ['cap'] }),
  silva: d('platinum', 'long', 'robe', '#4a5a6a', 'square sharp thick neutral', { eyes: 'blue' }),
  zeno: d('white', 'spiky', 'robe', '#8a8a9a', 'long narrow thick neutral', { eyes: 'black', marks: ['big_mustache', 'wrinkles'] }),
  meruem: d('#2f5a3a', 'dome', 'shirtless', '#bcd0a8', 'long sharp none neutral', { eyes: 'gray', skin: '#c4d4b0' }),
  neferpitou: d('white', 'messy', 'coat', '#3a5aa8', 'female big thin smile', { eyes: 'red', outfit2: '#f1f1f1', marks: ['animal_ears'] }),
  shaiapouf: d('#c8a050', 'bob', 'tshirt', '#f1f1f1', 'long narrow thin smile', { eyes: 'violet', skin: '#d8bfd8', marks: ['antennae'] }),
  menthuthuyoupi: d('black', 'slick', 'shirtless', '#8a3a2e', 'square narrow thick teeth', { skin: '#9a4030' }),
};
