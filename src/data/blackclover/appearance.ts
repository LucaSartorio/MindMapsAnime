import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { d } = appearanceKit();
const DEVIL = '#22222c';
const SPADE = '#2b3a6b';

/**
 * Aspetto dei personaggi principali per i ritratti SVG generati: disegni propri
 * ricostruiti dalle descrizioni testuali (Black Clover Wiki), nessuna immagine.
 * Chiave = id senza `char-bc-`.
 */
export const blackcloverAppearance: Record<string, CharacterAppearance> = {
  asta: d('#c9cdd6', 'messy', 'tank', '#22232b', 'male round thick grin', { eyes: 'green', accent: '#22232b', marks: ['headband'] }),
  yami: d('black', 'messy', 'tank', '#f1f1f1', 'square narrow thick smirk', { eyes: 'gray', skin: 'tan', marks: ['goatee', 'mustache'] }),
  noelle: d('silver', 'twin_tails', 'jacket', '#c9cdd6', 'female big thin frown', { eyes: 'pink', skin: 'fair', outfit2: '#7a4ab0', marks: ['earrings'], accent: '#7a4ab0' }),
  nacht: d('black', 'ponytail', 'high_collar', '#2b2f3d', 'male narrow thin neutral', { eyes: 'lightblue', skin: 'fair' }),
  liebe: d('white', 'messy', 'shirtless', DEVIL, 'male sharp angry teeth', { eyes: 'red', skin: '#e8e0d8', accent: '#16151c', marks: ['eye_lines', 'horns'] }),
  conrad: d('black', 'messy', 'cloak', '#3a3a46', 'long narrow thick neutral', { eyes: 'black', hair2: '#3f8a4a', outfit2: '#2b2f3d', fur: '#f1f1f1', marks: ['fur_collar'] }),
  yuno: d('black', 'messy', 'high_collar', '#22232b', 'male sharp thin neutral', { eyes: 'amber' }),
  william: d('white', 'short', 'cloak', '#3f6a3a', 'male round thin smile', { eyes: 'violet', outfit2: '#f1f1f1', marks: ['mask_upper'] }),
  nozel: d('silver', 'long_spiky', 'cloak', SPADE, 'long narrow thin neutral', { eyes: 'violet', skin: 'fair', outfit2: '#f1f1f1', fur: '#f1f1f1', marks: ['braid_center', 'fur_collar'] }),
  fuegoleon: d('#d8402a', 'long', 'cloak', '#c8303a', 'long sharp thick neutral', { eyes: 'violet', outfit2: '#22232b', accent: '#c8303a', marks: ['eye_rings', 'forehead_mark', 'earrings'] }),
  mereoleona: d('#d8402a', 'long_spiky', 'coat', SPADE, 'female sharp angry teeth', { eyes: 'blue', outfit2: '#f1f1f1', accent: '#c8303a', marks: ['eye_rings'] }),
  charlotte: d('blond', 'bun', 'armor', '#9aa4b0', 'female big thin neutral', { eyes: 'lightblue', skin: 'fair', outfit2: '#3f6a3a' }),
  julius: d('blond', 'messy', 'coat', '#f1f1f1', 'male round thin smile', { eyes: 'violet', outfit2: '#7a4ab0', fur: '#22232b', marks: ['forehead_star', 'fur_collar'] }),
  lumiere: d('blond', 'short', 'cloak', '#3a5aa8', 'male round thin smile', { eyes: 'lightblue', outfit2: '#f1f1f1', fur: '#f1f1f1', marks: ['fur_collar'] }),
  patry: d('white', 'long', 'robe', '#3a3a46', 'long sharp none smirk', { eyes: 'gold', skin: 'fair', outfit2: '#e8e0c8', accent: '#c8303a', marks: ['eye_lines', 'pointy_ears', 'earrings'] }),
  licht: d('white', 'ponytail', 'robe', '#e8e0c8', 'long sharp thin neutral', { eyes: 'gold', skin: 'pale', outfit2: '#3a3a46', accent: '#c8303a', marks: ['eye_lines', 'pointy_ears'] }),
  zagred: d(undefined, 'bald', 'shirtless', DEVIL, 'long sharp none teeth', { eyes: 'red', skin: '#3a3a46', marks: ['horns', 'pointy_ears'], accent: '#16151c' }),
  dante: d('black', 'slick', 'cloak', SPADE, 'long sharp thin smirk', { eyes: 'green', outfit2: '#6b4a2e', fur: '#f1f1f1', marks: ['forehead_band_mark', 'mustache', 'goatee', 'fur_collar'] }),
  vanica: d('black', 'bob', 'cloak', SPADE, 'female big thin teeth', { eyes: 'red', outfit2: '#6b4a2e', fur: '#f1f1f1', marks: ['eyepatch_left', 'fur_collar'], faceExtra: { eyeL: 'hidden' } }),
  zenon: d('black', 'messy', 'cloak', SPADE, 'male sharp angry neutral', { eyes: 'black', outfit2: '#22232b', fur: '#c9cdd6', marks: ['cross_mark', 'fur_collar'] }),
  lucius: d('black', 'messy', 'cloak', '#3a3a46', 'male round thin smile', { eyes: 'black', outfit2: '#6b4a2e', fur: '#f1f1f1', marks: ['sun_mark', 'fur_collar'] }),
  lucifero: d('#e8e0c8', 'long_spiky', 'shirtless', DEVIL, 'long sharp angry teeth', { eyes: 'red', skin: '#6a5a6a', marks: ['horns', 'pointy_ears', 'wrinkles'] }),
  megicula: d('#e8e0f0', 'long', 'tshirt', DEVIL, 'female sharp thin smirk', { eyes: 'yellow', skin: 'pale', marks: ['horns', 'third_eye', 'pointy_ears', 'eye_rings'], accent: '#16151c' }),
};
