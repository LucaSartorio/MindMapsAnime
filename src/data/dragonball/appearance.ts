import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { d } = appearanceKit();
const NAMEK = '#7ec46a';
const GI = '#f08a2c';
const UNDER = '#2b4a9a';
/** Capigliatura a fiamma con attaccatura a punta (Vegeta), disegnata a mano. */
const VEGETA_HAIR =
  'M33 44 C31 36 32 30 34 26 L29 12 L38 20 L38.6 5 L45 15.6 L50 1.6 L55 15.6 L61.4 5 L62 20 L71 12 L66 26 ' +
  'C68 30 69 36 67 44 C64 36 59 33 54 33 L50 38 L46 33 C41 33 36 36 33 44 Z';

/**
 * Aspetto dei personaggi principali per i ritratti SVG generati: disegni propri
 * ricostruiti dalle descrizioni testuali (Dragon Ball Wiki), nessuna immagine.
 * Chiave = id senza `char-`.
 */
export const dragonballAppearance: Record<string, CharacterAppearance> = {
  'dbz-goku': d('black', 'saiyan', 'gi', GI, 'male round thick grin', { eyes: 'black', outfit2: UNDER }),
  'dbz-vegeta': d('black', 'saiyan', 'saiyan_armor', '#2b3a8a', 'male sharp angry frown', { eyes: 'black', outfit2: '#f1f1f1', outfit3: '#e8c84a', hairFront: VEGETA_HAIR }),
  'dbz-gohan': d('black', 'messy', 'gi', '#6b3a9a', 'male round normal smile', { eyes: 'black', outfit2: '#5a2a7a' }),
  'dbz-future-trunks': d('lavender', 'bob', 'jacket', '#3a4a8a', 'male sharp normal neutral', { eyes: 'blue', outfit2: '#22232b' }),
  'dbz-piccolo': d(undefined, 'bald', 'cape', '#6b3a9a', 'long sharp angry frown', { eyes: 'black', skin: NAMEK, outfit2: '#f4f2ec', marks: ['pointy_ears', 'antennae', 'turban'] }),
  'dbz-krillin': d(undefined, 'bald', 'gi', GI, 'round round normal smile none', { eyes: 'black', outfit2: UNDER, marks: ['forehead_dots'] }),
  'dbz-bulma': d('teal', 'bob', 'dress', '#d84a8a', 'female big thin smile', { eyes: 'blue', skin: 'fair' }),
  'dbz-frieza': d('#6b3a9a', 'dome', 'shirtless', '#efe6f0', 'male sharp thin smirk', { eyes: 'red', skin: '#f2eef4', marks: ['eye_lines'], accent: '#6b3a9a' }),
  'dbz-cell': d('#2f6a3a', 'crest', 'shirtless', '#5a9a4a', 'male sharp angry smirk', { eyes: 'violet', skin: '#dce8c8', accent: '#8a3a8a', marks: ['eye_lines'] }),
  'dbz-majin-buu': d(undefined, 'bald', 'cape', '#6b3a9a', 'round narrow none grin', { skin: '#f2a0c0', outfit2: '#6b3a9a', marks: ['tentacle'] }),
  'dbz-kid-buu': d(undefined, 'bald', 'shirtless', '#f2a0c0', 'male sharp angry teeth', { eyes: 'black', skin: '#f2a0c0', marks: ['tentacle'] }),
  'dbz-gotenks': d('#3a2a4a', 'saiyan', 'vest_open', '#3a6ad8', 'round round normal grin', { eyes: 'black' }),
  'dbz-vegito': d('black', 'saiyan', 'gi', '#2b3a8a', 'male sharp normal smirk', { eyes: 'black', outfit2: GI, marks: ['earrings'] }),
  'dbz-gogeta': d('black', 'saiyan', 'vest_open', '#3a5ad8', 'male sharp normal smirk', { eyes: 'black' }),
  'dbz-broly': d('black', 'long_spiky', 'shirtless', '#c8a46a', 'square round thick neutral', { eyes: 'black', skin: 'tan', marks: ['scar_cheek'] }),
  'dbz-beerus': d('#8a6aaa', 'bald', 'robe', '#22232b', 'long sharp thick neutral', { eyes: 'yellow', skin: '#8a6aaa', outfit2: '#e8c84a', marks: ['animal_ears', 'earrings', 'eye_rings'], accent: '#22232b' }),
  'dbz-whis': d('white', 'mohawk', 'robe', '#7a2a4a', 'long narrow thin smile', { eyes: 'violet', skin: '#9ab8e0', outfit2: '#22232b' }),
  'dbz-zamasu': d('white', 'mohawk', 'robe', '#e8e0c8', 'long sharp thin smirk', { eyes: 'gray', skin: '#8ad08a', outfit2: '#3f6a3a', marks: ['earrings', 'pointy_ears'] }),
  'dbz-goku-black': d('black', 'saiyan', 'gi', '#3a3a46', 'male sharp normal smirk', { eyes: 'black', outfit2: '#22232b', marks: ['earrings'] }),
  'dbz-jiren': d(undefined, 'bald', 'high_collar', '#c8303a', 'long round none neutral flat', { eyes: '#16151c', skin: '#a8a8b4' }),
  'dbz-android-17': d('black', 'bob', 'tshirt', '#22232b', 'male sharp normal neutral', { eyes: 'blue', marks: ['scarf'], accent: '#f08a2c' }),
  'dbz-android-18': d('blond', 'bob', 'jacket', '#3a5aa8', 'female big thin neutral', { eyes: 'blue', skin: 'fair', outfit2: '#22232b', marks: ['earrings'] }),
  'dbz-gt-pan': d('black', 'short', 'tshirt', '#c8303a', 'round big thin grin', { eyes: 'black', accent: '#f08a2c', marks: ['bandana'] }),
  'dbz-gt-baby': d(undefined, 'bald', 'saiyan_armor', '#3a5aa8', 'male round none smirk', { eyes: 'blue', skin: '#c8ccd4', outfit2: '#5a9a8a', outfit3: '#c8303a' }),
  'dbz-gt-super-17': d('black', 'bob', 'jacket', '#22232b', 'male sharp thin smirk', { eyes: 'blue', outfit2: '#f1f1f1' }),
  'dbz-gt-omega-shenron': d(undefined, 'bald', 'shirtless', '#e8e8ee', 'long sharp angry teeth', { eyes: 'red', skin: '#eeeef2', marks: ['horns', 'forehead_orb', 'mustache'] }),
  'dbz-cooler': d('#4a2a6a', 'dome', 'shirtless', '#6b4a8a', 'square sharp angry frown', { eyes: 'red', skin: '#7a5a9a' }),
  'dbz-janemba': d('white', 'spiky', 'shirtless', '#d84040', 'male sharp angry teeth', { eyes: '#16151c', skin: '#d84040', accent: '#6b4a8a', marks: ['horns'] }),
  'dbz-kefla': d('black', 'ponytail', 'tank', '#c8303a', 'female sharp thin smirk', { eyes: 'black', marks: ['earrings'] }),
  'dbz-fused-zamasu': d('#f29cc2', 'saiyan', 'robe', '#e8e0c8', 'male sharp thin smirk', { eyes: 'gray', skin: '#8ad08a', outfit2: '#3f6a3a', marks: ['earrings', 'halo', 'eye_lines'] }),
  'dbz-moro': d(undefined, 'bald', 'cloak', '#a83030', 'long narrow angry neutral big', { eyes: 'red', skin: '#6a8ac8', outfit2: '#7a2a2a', marks: ['horns', 'pointy_ears', 'long_beard'] }),
  'dbz-granolah': d('#9ad8b8', 'messy', 'coat', '#3f6a3a', 'male sharp angry neutral', { eyes: '#2f5a3a', eyes2: 'red', outfit2: '#4a5a2e', marks: ['scope_eye'] }),
  'dbz-kami': d(undefined, 'bald', 'robe', '#f1f1f1', 'long narrow thick smile', { eyes: 'black', skin: NAMEK, outfit2: '#3a5aa8', marks: ['pointy_ears', 'antennae', 'wrinkles'] }),
  'dbz-king-piccolo': d(undefined, 'bald', 'robe', '#4a3a6a', 'long sharp angry teeth', { eyes: 'black', skin: NAMEK, outfit2: '#22232b', marks: ['pointy_ears', 'antennae', 'wrinkles'] }),
  'dbz-gomah': d(undefined, 'bald', 'cape', '#c8303a', 'male sharp angry teeth', { eyes: 'black', skin: '#f1f1f1', outfit2: '#22232b', accent: '#c8303a', marks: ['horns', 'pointy_ears', 'eye_lines'] }),
};
