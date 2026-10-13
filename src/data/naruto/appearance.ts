import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { a } = appearanceKit();
const AKATSUKI = '#22232b';

/**
 * Aspetto dei personaggi principali per i ritratti SVG generati: colori e segni
 * distintivi simbolici, nessuna immagine. Chiave = id senza `char-`.
 */
export const narutoAppearance: Record<string, CharacterAppearance> = {
  naruto: a('blond', 'spiky', { eyes: 'blue', outfit: 'orange', marks: ['headband', 'whiskers'] }),
  sasuke: a('black', 'swept', { eyes: 'black', outfit: 'navy' }),
  sakura: a('pink', 'bob', { eyes: 'green', outfit: 'red', marks: ['headband'] }),
  kakashi: a('silver', 'spiky', { eyes: 'black', outfit: '#3f5a3a', marks: ['headband', 'mask_lower', 'scar_eye'] }),
  jiraiya: a('white', 'long_spiky', { eyes: 'black', outfit: '#5a7a4a', accent: 'red', marks: ['eye_lines', 'headband'] }),
  tsunade: a('blond', 'twin_tails', { eyes: 'hazel', outfit: '#5a8a4a', marks: ['forehead_mark'] }),
  orochimaru: a('black', 'long', { eyes: 'yellow', skin: 'pale', outfit: '#e9e4d6', accent: 'purple', marks: ['eye_lines'] }),
  hiruzen: a('gray', 'buzz', { eyes: 'black', outfit: '#e9e4d6', accent: '#c8302e', marks: ['hat', 'beard'] }),
  minato: a('blond', 'spiky', { eyes: 'blue', outfit: '#f1f1f1', marks: ['headband'] }),
  kushina: a('red', 'long', { eyes: '#7a6a9a', outfit: '#3a5a8a' }),
  hashirama: a('black', 'long', { eyes: 'brown', outfit: '#a83030', marks: ['headband'] }),
  tobirama: a('white', 'spiky', { eyes: 'red', outfit: 'navy', accent: 'red', marks: ['eye_lines', 'headband'] }),
  mito: a('red', 'bun', { eyes: 'hazel', outfit: '#e9e4d6', marks: ['forehead_mark'] }),
  danzo: a('black', 'short', { eyes: 'black', outfit: '#2b2f3d', marks: ['eyepatch'] }),
  gaara: a('red', 'messy', { eyes: '#8fd0c8', outfit: '#8a3a2e', accent: '#22232b', marks: ['forehead_tattoo', 'eye_lines'] }),
  zabuza: a('black', 'buzz', { eyes: 'brown', outfit: '#5a6a7a', accent: '#e8e4dc', marks: ['mask_lower', 'headband'] }),
  kisame: a('navy', 'spiky', { eyes: 'white', skin: '#7aa0c8', outfit: AKATSUKI, marks: ['headband'] }),
  mei: a('auburn', 'hime', { eyes: 'green', outfit: '#2a5a8a' }),
  a: a('blond', 'slick', { eyes: 'black', skin: 'dark', outfit: '#f1f1f1', marks: ['mustache'] }),
  'killer-b': a('white', 'buzz', { skin: 'dark', outfit: '#2b2f3d', marks: ['sunglasses', 'mustache'] }),
  onoki: a('white', 'bun', { eyes: 'black', outfit: '#5a6a3a', marks: ['mustache'] }),
  itachi: a('black', 'ponytail', { eyes: 'red', outfit: AKATSUKI, accent: '#4a3030', marks: ['eye_lines', 'headband'] }),
  madara: a('black', 'long_spiky', { eyes: 'red', outfit: '#8a2b2b' }),
  obito: a('black', 'spiky', { eyes: 'red', outfit: AKATSUKI, marks: ['stitches'] }),
  pain: a('orange', 'spiky', { eyes: 'ripple', outfit: AKATSUKI, marks: ['earrings', 'headband'] }),
  deidara: a('blond', 'ponytail', { eyes: 'blue', outfit: AKATSUKI, marks: ['headband'] }),
  sasori: a('red', 'messy', { eyes: 'brown', outfit: AKATSUKI }),
  hidan: a('silver', 'slick', { eyes: 'violet', outfit: AKATSUKI }),
  kakuzu: a('#3a3a46', 'bob', { eyes: 'lime', skin: 'tan', outfit: AKATSUKI, marks: ['mask_lower', 'headband'] }),
  zetsu: a('green', 'short', { eyes: 'yellow', skin: 'pale', outfit: AKATSUKI, marks: ['split_face'] }),
  kabuto: a('silver', 'ponytail', { eyes: 'black', outfit: '#6b4a8a', marks: ['glasses'] }),
  kaguya: a('white', 'hime', { eyes: 'pale', skin: 'pale', outfit: '#f1f1f1', marks: ['horns', 'third_eye'] }),
  hagoromo: a('silver', 'long_spiky', { eyes: 'ripple', outfit: '#f1f1f1', marks: ['horns', 'beard'] }),
  kurama: a('orange', undefined, { eyes: 'red', species: 'beast' }),
  shukaku: a('#c8a46a', undefined, { eyes: 'yellow', species: 'beast' }),
  matatabi: a('#3a7ad8', undefined, { eyes: 'lime', species: 'beast' }),
  'son-goku': a('#b03030', undefined, { eyes: 'green', species: 'beast' }),
  gyuki: a('#7a4a8a', undefined, { eyes: 'yellow', species: 'beast', marks: ['horns'] }),
  nagato: a('red', 'hime', { eyes: 'ripple', skin: 'pale', outfit: AKATSUKI }),
  hanzo: a('black', 'long_spiky', { eyes: 'black', outfit: '#3a3a46', accent: '#3a3a46', marks: ['mask_lower'] }),
  mifune: a('gray', 'long', { eyes: 'black', outfit: '#5a5a7a', marks: ['mustache', 'beard'] }),
  boruto: a('blond', 'messy', { eyes: 'blue', outfit: '#2b2f3d', marks: ['headband', 'scar_eye'] }),
  sarada: a('black', 'bob', { eyes: 'black', outfit: '#c8302e', marks: ['glasses'] }),
  mitsuki: a('lightblue', 'short', { eyes: 'yellow', skin: 'pale', outfit: '#f1f1f1' }),
  toneri: a('white', 'swept', { eyes: 'blue', skin: 'pale', outfit: '#f1f1f1' }),
  momoshiki: a('white', 'long', { eyes: 'ripple', skin: 'pale', outfit: '#f1f1f1', marks: ['horns'] }),
  isshiki: a('black', 'spiky', { eyes: 'yellow', skin: 'pale', outfit: '#3a3a46', marks: ['horns'] }),
  kawaki: a('black', 'messy', { eyes: 'gray', outfit: '#2b2f3d', accent: '#2b2f3d', marks: ['forehead_mark'] }),
  'ten-tails': a(undefined, 'bald', { eyes: 'ripple', skin: '#7a6a8a', outfit: '#5a4a6a', marks: ['cyclops', 'horns'] }),
  'black-zetsu': a(undefined, 'bald', { eyes: 'yellow', skin: '#22232b', outfit: '#22232b' }),
};
