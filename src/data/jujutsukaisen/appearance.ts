import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { d } = appearanceKit();
const UNIFORM = '#1f2233';
const MAKI = '#2f5a3a';

/**
 * Aspetto dei personaggi principali per i ritratti SVG generati: disegni propri
 * ricostruiti dalle descrizioni testuali (Jujutsu Kaisen Wiki), nessuna immagine.
 * Chiave = id senza `char-jjk-`.
 */
export const jjkAppearance: Record<string, CharacterAppearance> = {
  yuji: d('pink', 'messy', 'uniform', UNIFORM, 'male round normal grin', { eyes: '#a8784a' }),
  megumi: d('black', 'spiky', 'uniform', UNIFORM, 'male sharp normal frown', { eyes: 'teal', skin: 'fair' }),
  nobara: d('#a8784a', 'bob', 'uniform', UNIFORM, 'female big thin smirk', { eyes: 'orange', skin: 'fair' }),
  gojo: d('white', 'messy', 'uniform', UNIFORM, 'male round normal smile', { eyes: 'lightblue', marks: ['blindfold'] }),
  maki: d(MAKI, 'ponytail', 'uniform', UNIFORM, 'female sharp thin smirk', { eyes: 'amber', marks: ['glasses'] }),
  toge: d('#e8e4d8', 'bob', 'uniform', UNIFORM, 'male narrow thin neutral', { eyes: 'violet', skin: 'fair', accent: UNIFORM, marks: ['mask_lower'] }),
  panda: d('#f4f4f4', undefined, 'shirtless', '#22232b', 'panda patch none smile', { eyes: 'black', species: 'beast', accent: '#22232b' }),
  yuta: d('black', 'messy', 'uniform', '#f1f1f1', 'male round normal neutral', { eyes: 'navy', marks: ['eye_bags'] }),
  nanami: d('blond', 'slick', 'suit', '#d8c8a0', 'square narrow thin neutral', { outfit2: '#5a7ad8', outfit3: '#c8a050', marks: ['sunglasses'] }),
  shoko: d('#5a3a24', 'long', 'coat', '#f1f1f1', 'female narrow thick neutral', { eyes: 'brown', outfit2: '#2b3a6b', marks: ['eye_bags', 'mole'] }),
  yaga: d('#3a2a22', 'buzz', 'jacket', '#22232b', 'square narrow thick neutral', { skin: 'tan', outfit2: '#22232b', marks: ['sunglasses', 'mustache', 'goatee'] }),
  yuki: d('blond', 'long', 'tank', '#4a4a8a', 'female big thin grin', { eyes: 'brown' }),
  hakari: d('blond', 'afro', 'vest_open', '#3a3a46', 'male narrow thin grin', { eyes: '#c8307a', skin: 'tan', marks: ['mustache'] }),
  junpei: d('#3a2a22', 'bob', 'tshirt', '#7a4a8a', 'male round thin neutral', { eyes: 'black', faceExtra: { eyeL: 'hidden' } }),
  riko: d('navy', 'long', 'jacket', '#f1f1f1', 'female big thin smile', { eyes: 'blue', outfit2: '#2b3a6b', accent: '#f1f1f1', marks: ['hairclip'] }),
  rika: d('black', 'long', 'dress', '#22232b', 'round big thin smile', { eyes: 'black', skin: 'fair' }),
  higuruma: d('#4a3324', 'slick', 'suit', '#2b2f3d', 'long narrow thin neutral big', { eyes: 'brown', skin: 'tan', outfit2: '#f1f1f1', outfit3: '#2b2f3d', marks: ['eye_bags', 'goatee'] }),
  todo: d('black', 'bun', 'vest_open', '#2b2f3d', 'square small thick grin', { skin: 'tan', marks: ['scar_eye'] }),
  mai: d(MAKI, 'bob', 'robe', '#2b2f3d', 'female sharp thin smirk', { eyes: 'amber', outfit2: '#f1f1f1' }),
  noritoshi: d('black', 'long', 'kimono', '#e8e0c8', 'long closed thin neutral', { outfit2: '#2b2f3d' }),
  mechamaru: d('black', 'bun', 'robe', '#ece8dc', 'male sharp thin neutral', { eyes: 'brown', accent: '#ece8dc', marks: ['mask_lower'] }),
  naoya: d('blond', 'slick', 'kimono', '#2b2f3d', 'long sharp thin teeth', { eyes: 'brown', outfit2: '#f1f1f1', marks: ['earrings'] }),
  tengen: d(undefined, 'bald', 'robe', '#e8e0c8', 'long round none neutral none', { eyes: 'black', skin: '#e4e0da', accent: '#16151c', marks: ['extra_eyes'] }),
  sukuna: d('pink', 'spiky', 'kimono', '#f1f1f1', 'male sharp angry teeth', { eyes: 'red', outfit2: '#22232b', marks: ['face_lines', 'extra_eyes'] }),
  kenjaku: d('black', 'bun', 'robe', '#2b2f3d', 'male narrow thin smirk', { eyes: 'violet', outfit2: '#c8903a', marks: ['forehead_stitches', 'earrings'] }),
  geto: d('black', 'bun', 'robe', '#2b2f3d', 'male narrow thin smile', { eyes: 'violet', outfit2: '#c8903a', marks: ['earrings'] }),
  toji: d('black', 'messy', 'tshirt', '#22232b', 'male sharp thin smirk', { eyes: 'green', marks: ['scar_lip'] }),
  mahito: d('#8a9ab8', 'long', 'robe', '#e8e0c8', 'male round thin teeth', { eyes: 'gray', eyes2: '#2b3a8a', outfit2: '#3a3a46', marks: ['stitches'] }),
  jogo: d('#7a5232', 'dome', 'kimono', '#4a3a6a', 'round round none teeth none', { eyes: '#16151c', skin: '#c8c4c0', marks: ['cyclops'] }),
  choso: d('black', 'twin_tails', 'robe', '#6b4a5a', 'male narrow thin neutral', { eyes: 'brown', marks: ['scar_nose', 'eye_bags'] }),
  kashimo: d('#7ad8c8', 'long_spiky', 'robe', '#3a3a46', 'male sharp thick grin', { eyes: 'green', accent: '#8a4ab0', marks: ['eye_lines'] }),
};
