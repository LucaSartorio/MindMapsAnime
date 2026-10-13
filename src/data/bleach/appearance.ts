import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { d } = appearanceKit();
const HAORI = '#f1f1f1';
const ARRANCAR = '#f1f1f1';

/**
 * Aspetto dei personaggi principali per i ritratti SVG generati: disegni propri
 * ricostruiti dalle descrizioni testuali (Bleach Wiki), nessuna immagine.
 * Chiave = id senza `char-bl-`.
 */
export const bleachAppearance: Record<string, CharacterAppearance> = {
  ichigo: d('orange', 'messy', 'shihakusho', '#1d1d24', 'male sharp angry frown', { eyes: 'brown' }),
  rukia: d('black', 'bob', 'shihakusho', '#1d1d24', 'female big thin neutral', { eyes: 'violet', skin: 'fair', marks: ['center_strand'] }),
  orihime: d('#e8702a', 'long', 'tshirt', '#f1f1f1', 'female big thin smile', { eyes: 'brown', accent: '#3a8ae0', marks: ['hairclip'] }),
  uryu: d('black', 'bob', 'high_collar', '#f1f1f1', 'male sharp thin neutral', { eyes: 'blue', skin: 'fair', marks: ['glasses'] }),
  chad: d('#5a3a24', 'curly_long', 'tshirt', '#c8303a', 'square narrow thick neutral', { eyes: 'brown', skin: '#9a6a44' }),
  isshin: d('black', 'messy', 'haori', HAORI, 'square round thick grin', { eyes: 'brown', marks: ['goatee'] }),
  masaki: d('#a8784a', 'long', 'dress', '#e8d8b8', 'female big thin smile', { eyes: 'brown', skin: 'fair' }),
  urahara: d('#efe0a0', 'bob', 'robe', '#2f4a3a', 'male narrow thin smile', { eyes: 'gray', accent: '#3f6a3a', marks: ['hat', 'goatee', 'center_strand'] }),
  yoruichi: d('#2a2236', 'ponytail', 'tank', '#e8803a', 'female sharp thin smirk', { eyes: 'amber', skin: '#8a5a3a' }),
  zangetsu: d('black', 'long', 'coat', '#22232b', 'long narrow thin neutral', { outfit2: '#3a3a46', marks: ['sunglasses', 'goatee'] }),
  white: d('white', 'messy', 'shihakusho', '#f1f1f1', 'male dark angry teeth', { eyes: 'yellow', skin: '#f2f2f2' }),
  yamamoto: d('white', 'bald', 'haori', HAORI, 'long narrow thick neutral big', { eyes: 'red', marks: ['long_beard', 'big_mustache', 'wrinkles', 'scar_eye_left'] }),
  'soi-fon': d('black', 'twin_tails', 'haori', HAORI, 'female sharp angry frown', { eyes: 'gray' }),
  gin: d('silver', 'bob', 'haori', HAORI, 'long smile thin wide', { eyes: 'lightblue', skin: 'fair' }),
  unohana: d('black', 'long', 'haori', HAORI, 'female narrow thin smile', { eyes: 'blue', skin: 'fair', marks: ['braid_front'] }),
  aizen: d('#6b4a2e', 'slick', 'coat', ARRANCAR, 'male sharp thin smirk', { eyes: 'brown', outfit2: '#22232b', marks: ['center_strand'] }),
  byakuya: d('black', 'long', 'haori', HAORI, 'long sharp thin neutral', { eyes: 'gray', skin: 'fair', accent: '#f1f1f1', marks: ['kenseikan', 'scarf'] }),
  renji: d('crimson', 'ponytail', 'shihakusho', '#1d1d24', 'male sharp angry teeth', { eyes: 'brown', accent: '#f1f1f1', marks: ['brow_tattoo', 'bandana'] }),
  kyoraku: d('#6b4a2e', 'ponytail', 'haori', '#e85a9a', 'long narrow thin smile', { eyes: 'gray', accent: '#c8a46a', marks: ['hat', 'goatee'] }),
  tosen: d('#3a2a1e', 'long', 'haori', HAORI, 'male narrow none neutral', { eyes: 'byakugan', skin: 'dark', accent: '#e8803a', marks: ['glasses', 'scarf'] }),
  hitsugaya: d('white', 'spiky', 'haori', HAORI, 'round sharp angry frown', { eyes: 'teal' }),
  kenpachi: d('black', 'long_spiky', 'haori', HAORI, 'long sharp none teeth', { eyes: 'gray', marks: ['eyepatch_left', 'scar_eye'], faceExtra: { eyeL: 'hidden' } }),
  mayuri: d('#3a5ad8', 'crest', 'haori', HAORI, 'long round none teeth', { eyes: 'gold', skin: '#f4f4f4', marks: ['face_paint'] }),
  ukitake: d('white', 'long', 'haori', HAORI, 'long narrow thin smile', { eyes: 'brown', skin: 'fair' }),
  shinji: d('blond', 'hime', 'haori', HAORI, 'long narrow thin teeth', { eyes: 'brown' }),
  'soul-king': d('black', 'slick', 'robe', '#f1f1f1', 'long round none neutral', { eyes: 'black', skin: 'fair', outfit2: '#8fc6f0' }),
  ginjo: d('black', 'long', 'jacket', '#22232b', 'male sharp thin smirk', { eyes: 'brown', outfit2: '#f1f1f1', fur: '#3a3a46', marks: ['fur_collar'] }),
  starrk: d('#4a3324', 'bob', 'coat', ARRANCAR, 'male narrow thin neutral', { eyes: '#6a7a9a', outfit2: '#22232b', marks: ['goatee', 'bone_fragment'] }),
  barragan: d('white', 'slick', 'coat', ARRANCAR, 'square narrow thick frown', { eyes: '#5a7a3a', outfit2: '#22232b', marks: ['crown', 'big_mustache', 'wrinkles', 'scar_eye_left'] }),
  harribel: d('blond', 'bob', 'high_collar', ARRANCAR, 'female big thin neutral', { eyes: 'teal', skin: 'olive', accent: '#f1f1f1', marks: ['mask_lower'] }),
  ulquiorra: d('black', 'messy', 'high_collar', ARRANCAR, 'male sharp thick frown', { eyes: 'green', skin: '#f4f2ee', accent: '#2aa59a', marks: ['eye_lines', 'half_helmet', 'center_strand'] }),
  grimmjow: d('lightblue', 'messy', 'vest_open', ARRANCAR, 'male sharp angry teeth', { eyes: 'lightblue', accent: '#3aa86a', marks: ['eye_lines', 'bone_fragment'] }),
  nelliel: d('#5ab07a', 'long', 'dress', ARRANCAR, 'female big thin smile', { eyes: 'hazel', marks: ['horns', 'scar_nose'] }),
  yhwach: d('black', 'long', 'coat', '#f1f1f1', 'long sharp thin neutral', { eyes: '#8a3a2a', outfit2: '#22232b', marks: ['beard', 'mustache'] }),
  haschwalth: d('blond', 'long', 'cloak', '#f1f1f1', 'long sharp thin neutral', { eyes: '#8ad0a0', outfit2: '#f1f1f1', faceExtra: { eyeR: 'narrow' } }),
};
