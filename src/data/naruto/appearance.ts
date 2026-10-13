import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { a, d } = appearanceKit();
const JONIN = '#4f6a3a';
const NAVY = '#2b3a6b';
const AKA = '#1a1a22';

/**
 * Aspetto dei personaggi principali per i ritratti SVG generati: disegni propri
 * ricostruiti dalle descrizioni testuali (Naruto Wiki), nessuna immagine.
 * Chiave = id senza `char-`. I cercoteri restano col ritratto animale semplice.
 */
export const narutoAppearance: Record<string, CharacterAppearance> = {
  naruto: d('blond', 'spiky', 'tracksuit', '#f08a2c', 'male round normal grin', { eyes: 'blue', outfit2: '#22232b', marks: ['headband', 'whiskers'] }),
  sasuke: d('black', 'swept', 'robe', '#f1f1f1', 'male sharp normal neutral', { eyes: 'black', skin: 'fair' }),
  sakura: d('pink', 'bob', 'dress', '#c8303a', 'female big thin smile', { eyes: 'green', skin: 'fair', marks: ['forehead_mark'] }),
  kakashi: d('silver', 'spiky', 'flak_vest', JONIN, 'male narrow normal neutral', { eyes: 'black', outfit2: NAVY, marks: ['mask_lower', 'headband_tilt'], faceExtra: { eyeR: 'hidden' } }),
  jiraiya: d('white', 'long_spiky', 'robe', '#5a7a4a', 'square narrow thick grin', { eyes: 'black', accent: '#c8303a', outfit2: '#c8303a', marks: ['eye_lines', 'headband'] }),
  tsunade: d('blond', 'twin_tails', 'robe', '#5a8a4a', 'female big thin smile', { eyes: 'brown', outfit2: '#9a9aa4', marks: ['forehead_mark'] }),
  orochimaru: d('black', 'long', 'robe', '#e9e4d6', 'long sharp thin smirk', { eyes: 'yellow', skin: 'pale', accent: '#7a4ab0', outfit2: '#7a4ab0', marks: ['eye_rings'] }),
  hiruzen: d('gray', 'short', 'robe', '#f1f1f1', 'square small thick smile', { eyes: 'black', skin: 'tan', outfit2: '#c8303a', marks: ['kage_hat', 'goatee', 'wrinkles'] }),
  minato: d('blond', 'swept', 'flak_vest', JONIN, 'male round normal smile', { eyes: 'blue', outfit2: NAVY, marks: ['headband'] }),
  kushina: d('red', 'long', 'dress', '#5a8a5a', 'female big thin grin', { eyes: 'violet', skin: 'fair', accent: '#22232b', marks: ['hairclip'] }),
  hashirama: d('black', 'long', 'armor', '#8a2b2b', 'male round normal smile', { eyes: 'black', skin: 'tan', outfit2: '#5a2a2a', marks: ['headband'] }),
  tobirama: d('white', 'messy', 'armor', '#2b4a8a', 'male sharp angry neutral', { eyes: 'red', accent: '#c8303a', fur: '#f1f1f1', outfit2: '#1d2a4a', marks: ['eye_lines', 'fur_collar', 'headband'] }),
  mito: d('red', 'bun', 'kimono', '#e9e4d6', 'female big thin lips', { eyes: 'black', outfit2: '#c8303a', marks: ['forehead_mark', 'hairclip'] }),
  danzo: d('black', 'messy', 'robe', '#3a3a46', 'male narrow thick frown', { eyes: 'black', outfit2: '#f1f1f1', marks: ['bandage_left', 'scar_chin_x', 'wrinkles'], faceExtra: { eyeL: 'hidden' } }),
  gaara: d('#b8402a', 'messy', 'coat', '#8a3a2e', 'male narrow none neutral', { eyes: 'teal', skin: 'fair', outfit2: '#f1f1f1', accent: '#22232b', marks: ['eye_rings', 'forehead_tattoo'] }),
  zabuza: d('black', 'spiky', 'shirtless', '#5a6a7a', 'male sharp none neutral', { eyes: 'brown', skin: '#e0d8cc', accent: '#ece8dc', marks: ['mask_lower', 'headband'] }),
  kisame: d('#3a4a6a', 'spiky', 'akatsuki', AKA, 'long small none teeth', { eyes: 'white', skin: '#7a9ab0', marks: ['gills', 'headband'] }),
  mei: d('auburn', 'long', 'dress', NAVY, 'female big thin smile', { eyes: 'green', skin: 'fair', faceExtra: { eyeL: 'hidden' } }),
  a: d('blond', 'slick', 'vest_open', '#f1f1f1', 'square sharp angry frown', { eyes: 'black', skin: 'dark', marks: ['mustache'] }),
  'killer-b': d('white', 'buzz', 'vest_open', '#e8e8e8', 'square sharp thick grin', { skin: 'dark', marks: ['sunglasses', 'goatee'] }),
  onoki: d('white', 'bald', 'coat', '#3f6a3a', 'round small thick neutral clown', {
    outfit2: '#c8303a',
    marks: ['mustache', 'goatee', 'wrinkles'],
    hairFront: 'M33.4 42 C31 46 31 54 33 58 L36 56 C35 52 35 47 35.6 43 Z M66.6 42 C69 46 69 54 67 58 L64 56 C65 52 65 47 64.4 43 Z',
  }),
  itachi: d('black', 'ponytail', 'akatsuki', AKA, 'male sharp thin neutral', { eyes: 'sharingan', accent: '#3a2a2a', marks: ['eye_lines', 'headband'] }),
  madara: d('black', 'long_spiky', 'armor', '#8a2b2b', 'male sharp angry smirk', { eyes: 'sharingan', outfit2: '#5a2a2a' }),
  obito: d('black', 'spiky', 'high_collar', '#2b2f3d', 'male sharp angry neutral', { eyes: 'sharingan', eyes2: 'ripple', marks: ['scar_lines_left'] }),
  pain: d('orange', 'spiky', 'akatsuki', AKA, 'male round thin neutral', { eyes: 'ripple', skin: 'fair', marks: ['piercings', 'headband'] }),
  deidara: d('blond', 'ponytail', 'akatsuki', AKA, 'male sharp thin grin', { eyes: 'blue', marks: ['headband'], faceExtra: { eyeR: 'hidden' } }),
  sasori: d('#a83a2a', 'messy', 'akatsuki', AKA, 'round narrow thin neutral', { eyes: 'brown' }),
  hidan: d('silver', 'slick', 'akatsuki', AKA, 'male sharp angry teeth', { eyes: 'violet' }),
  kakuzu: d('#3a3a46', 'bob', 'akatsuki', AKA, 'male sharp none neutral', { eyes: 'lime', skin: 'tan', accent: '#2b2f3d', marks: ['hood', 'mask_lower', 'stitches'] }),
  zetsu: d('#3f9a4a', 'short', 'akatsuki', AKA, 'male round none teeth', { eyes: 'yellow', skin: 'pale', marks: ['split_face', 'flytrap'] }),
  kabuto: d('silver', 'ponytail', 'high_collar', '#6b4a8a', 'male round thin smile', { eyes: 'black', marks: ['round_glasses'] }),
  kaguya: d('white', 'hime', 'kimono', '#f1f1f1', 'female big thin neutral', { eyes: 'byakugan', skin: 'pale', outfit2: '#c8c0d8', marks: ['horns', 'third_eye'] }),
  hagoromo: d('#b8a88a', 'long_spiky', 'robe', '#f1f1f1', 'long narrow thick neutral', { eyes: 'ripple', skin: '#d8ccb8', marks: ['horns', 'long_beard', 'wrinkles'] }),
  kurama: a('orange', undefined, { eyes: 'red', species: 'beast' }),
  shukaku: a('#c8a46a', undefined, { eyes: 'yellow', species: 'beast' }),
  matatabi: a('#3a7ad8', undefined, { eyes: 'lime', species: 'beast' }),
  'son-goku': a('#b03030', undefined, { eyes: 'green', species: 'beast' }),
  gyuki: a('#7a4a8a', undefined, { eyes: 'yellow', species: 'beast', marks: ['horns'] }),
  nagato: d('red', 'hime', 'akatsuki', AKA, 'long sharp thin neutral', { eyes: 'ripple', skin: 'pale', faceExtra: { eyeL: 'hidden' } }),
  hanzo: d('blond', 'long', 'cloak', '#3a3a46', 'male sharp thick neutral', { eyes: 'byakugan', outfit2: '#2b2f3d', accent: '#3a3a46', marks: ['mask_lower'] }),
  mifune: d('gray', 'long', 'armor', '#5a4a8a', 'long narrow thick neutral', { eyes: 'black', outfit2: '#3a3a46', accent: '#ece8dc', marks: ['bandana', 'mustache', 'goatee', 'wrinkles'] }),
  boruto: d('blond', 'messy', 'jacket', '#22232b', 'male round normal grin', { eyes: 'blue', outfit2: '#c8303a', marks: ['whiskers', 'headband', 'scar_eye_left'] }),
  sarada: d('black', 'bob', 'jacket', '#c8303a', 'female big thin smile', { eyes: 'black', skin: 'fair', outfit2: '#f0e6c8', marks: ['round_glasses'] }),
  mitsuki: d('lightblue', 'messy', 'kimono', '#5a7ad8', 'male narrow thin smile', { eyes: 'yellow', skin: 'pale', outfit2: '#2b3a6b' }),
  toneri: d('white', 'messy', 'robe', '#f1f1f1', 'male closed thin neutral', { skin: 'pale', outfit2: '#d8d0e8' }),
  momoshiki: d('lightblue', 'ponytail', 'robe', '#f1f1f1', 'long sharp thin neutral', { eyes: 'ripple', skin: 'pale', outfit2: '#d8d0e8', marks: ['horns'] }),
  isshiki: d('black', 'spiky', 'robe', '#3a3a46', 'long sharp thin neutral', { eyes: '#16151c', eyes2: 'byakugan', skin: 'pale', outfit2: '#22232b', marks: ['horn_single'] }),
  kawaki: d('black', 'messy', 'jacket', '#3a3a46', 'male sharp angry frown', { eyes: 'gray', outfit2: '#22232b' }),
  'ten-tails': d(undefined, 'bald', 'shirtless', '#5a4a6a', 'round round none teeth', { eyes: 'ripple', skin: '#7a6a8a', marks: ['cyclops', 'horns'] }),
  'black-zetsu': d(undefined, 'bald', 'shirtless', '#16151c', 'male round none neutral none', { eyes: 'yellow', skin: '#22232b' }),
  jura: d(undefined, 'bald', 'coat', '#22232b', 'long sharp none neutral', { eyes: 'ripple', outfit2: '#2aa59a', accent: '#22232b', marks: ['cap'] }),
};
