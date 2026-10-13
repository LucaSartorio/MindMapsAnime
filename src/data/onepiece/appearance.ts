import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { d } = appearanceKit();
const MARINE = '#f1f1f1';

/** Aspetto dei personaggi principali per i ritratti SVG generati (chiave = id senza `char-op-`). */
export const onepieceAppearance: Record<string, CharacterAppearance> = {
  // Ritratti dettagliati (descrizioni dell'aspetto della One Piece Wiki, disegno proprio).
  /** Capelli neri arruffati con piccola punta sulla fronte, occhi tondi neri, cappello di paglia col nastro rosso,
   *  cicatrice con due punti sotto l'occhio sinistro, gilet rosso aperto sulla cicatrice a X del petto. */
  luffy: {
    hair: 'black',
    eyes: 'black',
    outfit: '#c8303a',
    clothes: 'vest_open',
    face: { shape: 'male', eyes: 'round', brows: 'thick', mouth: 'grin' },
    marks: ['strawhat', 'scar_cheek', 'chest_x_scar'],
    hairBack: 'M31 32 L29.5 44 L32 42 L31.5 52 L35 48 L65 48 L68.5 52 L68 42 L70.5 44 L69 32 Z',
    hairFront:
      'M33 30 L32.5 41 L35.5 37 L36 45 L39 37.5 L41.5 43 L44 36.5 L47 41.5 L50 37.5 L53 41.5 L56 36.5 L58.5 43 L61 37.5 L64 45 L64.5 37 L67.5 41 L67 30 Z ' +
      'M33.5 32 L27.5 40 L32.5 39.5 L29 47 L34 43 Z M66.5 32 L72.5 40 L67.5 39.5 L71 47 L66 43 Z',
  },
  /** Capelli verdi corti ("marimo"), pelle abbronzata, occhio sinistro chiuso da una cicatrice, tre orecchini d'oro
   *  all'orecchio sinistro, veste verde aperta sulla grande cicatrice diagonale del petto. */
  zoro: {
    hair: '#3f9a4a',
    eyes: '#2b2f3d',
    skin: '#d9a273',
    outfit: '#2f6a3a',
    clothes: 'robe',
    face: { shape: 'square', eyeL: 'sharp', eyeR: 'closed', brows: 'angry', mouth: 'smirk' },
    marks: ['scar_eye', 'earrings3', 'chest_scar'],
    hairFront:
      'M33.5 41 C32.5 36 32.8 31 34.6 27.6 a2.8 2.8 0 0 1 3.8 -3.4 a2.8 2.8 0 0 1 4.6 -2.4 a2.8 2.8 0 0 1 4.6 -1.2 ' +
      'a2.8 2.8 0 0 1 4.8 0 a2.8 2.8 0 0 1 4.6 1.2 a2.8 2.8 0 0 1 4.6 2.4 a2.8 2.8 0 0 1 3.8 3.4 C67.2 31 67.5 36 66.5 41 ' +
      'L65 37.5 L63.5 39 L62 34.5 L59.5 36 L57 32.5 L54.5 34.5 L52 32 L50 34 L48 32 L45.5 34.5 L43 32.5 L40.5 36 ' +
      'L38 34.5 L36.5 39 L35 37.5 Z',
    hairDetail: 'M40 27 l1 2.4 M45 24.6 l0.6 2.6 M50.5 24 l0 2.6 M56 24.6 l-0.6 2.6 M61 27 l-1 2.4 M37 32 l1.6 1.8 M63 32 l-1.6 1.8',
  },
  /** Lunghi capelli arancioni mossi con frangia di lato, grandi occhi castani, tatuaggio (girandola e mandarino)
   *  sulla spalla sinistra. */
  nami: {
    hair: '#f08a2c',
    eyes: '#8a5a2e',
    outfit: '#3b70d8',
    clothes: 'tank',
    face: { shape: 'female', eyes: 'big', brows: 'thin', mouth: 'smile' },
    marks: ['shoulder_tattoo'],
    hairBack:
      'M30 36 C28 22 40 14 50 14 C60 14 72 22 70 36 C72 48 70 58 74 68 C77 76 73 84 77 92 L76 100 L24 100 ' +
      'L23 92 C27 84 23 76 26 68 C30 58 28 48 30 36 Z',
    hairFront:
      'M33.5 44 C31 30 39 19.5 50 19.5 C61 19.5 69 30 66.5 44 C65 38 63 34 60 31.5 C55 35 47 37 40 36 C37 37.5 35 40 33.5 44 Z ' +
      'M33.5 40 C30 50 31 58 29 66 C27.5 72 31 78 30 84 L34 84 C35 76 33 70 35 63 C36.5 56 35 48 36 42 Z ' +
      'M66.5 40 C70 50 69 58 71 66 C72.5 72 69 78 70 84 L66 84 C65 76 67 70 65 63 C63.5 56 65 48 64 42 Z',
    hairDetail: 'M44 24 C49 21.6 57 23 61 27.6 M38 30 C41 26.6 45 25 49 25 M32.6 54 C31.6 62 31.4 70 31 78 M67.4 54 C68.4 62 68.6 70 69 78',
  },
  /** Lunghi capelli neri ricci, pelle scura, naso lunghissimo, labbra pronunciate, occhialoni da cecchino sulla
   *  fronte, salopette marrone senza camicia. */
  usopp: {
    hair: 'black',
    eyes: 'black',
    skin: '#c98f5a',
    outfit: '#8a5a2e',
    clothes: 'overalls',
    face: { shape: 'male', eyes: 'small', brows: 'normal', nose: 'long', mouth: 'lips' },
    marks: ['goggles'],
    hairBack:
      'M30 40 a6 6 0 0 1 2 -10 a6 6 0 0 1 8 -6 a6 6 0 0 1 10 -3 a6 6 0 0 1 10 3 a6 6 0 0 1 8 6 a6 6 0 0 1 2 10 ' +
      'a6 6 0 0 1 2 10 a6 6 0 0 1 0 10 a6 6 0 0 1 -2 10 a6 6 0 0 1 -6 6 L36 76 a6 6 0 0 1 -6 -6 a6 6 0 0 1 -2 -10 ' +
      'a6 6 0 0 1 0 -10 a6 6 0 0 1 2 -10 Z',
    hairFront:
      'M34 38 a4 4 0 0 1 4 -7 a4 4 0 0 1 6 -3 a4 4 0 0 1 6 -1 a4 4 0 0 1 6 1 a4 4 0 0 1 6 3 a4 4 0 0 1 4 7 ' +
      'C62 34 56 32 50 32 C44 32 38 34 34 38 Z',
  },
  /** Capelli biondi lunghi fino alla mascella pettinati a coprire l'occhio destro, sopracciglio a spirale,
   *  pizzetto, sigaretta, completo nero doppiopetto con camicia azzurra e cravatta. */
  sanji: {
    hair: '#f0cd5a',
    eyes: '#2b2f3d',
    outfit: '#22232b',
    outfit2: '#8fb4e0',
    outfit3: '#22232b',
    clothes: 'suit',
    face: { shape: 'long', eyes: 'sharp', eyeL: 'hidden', brows: 'spiral', mouth: 'neutral' },
    marks: ['goatee', 'cigarette'],
    hairBack: 'M31.5 38 C30 50 31 58 34 63 L66 63 C69 58 70 50 68.5 38 Z',
    hairFront:
      'M33 50 C30 32 39 20 51 20 C62 20 69 28 67 41 C66.8 47 66.4 52 65.6 56 C64.6 50 64.4 45 63.6 40 ' +
      'C62.4 35.4 58 32.6 53 32.4 C50.6 37 49 44 49.6 51.5 C48.4 56 46 58 43.4 58.6 C40.4 58.4 36.6 56 33 50 Z',
    hairDetail:
      'M40 24 C46 22 54 23.6 58 29 M36 33 C40 29.6 45 29.4 49 32 M36.5 44 C39.5 40 43.5 37.6 48 37.4 ' +
      'M38 52 C41 50 44.5 47 47 43 M64.6 34 C65.6 40 65.8 46 65.4 52',
  },
  shanks: d('crimson', 'bob', 'cloak', '#22232b', 'male sharp normal smile', { eyes: 'black', skin: 'tan', outfit2: '#f1f1f1', marks: ['scar_eye'] }),
  garp: d('white', 'buzz', 'coat', MARINE, 'square round thick grin', { eyes: 'blue', skin: 'tan', outfit2: '#2b3a6b', marks: ['beard', 'scar_eye', 'wrinkles'] }),
  dragon: d('black', 'long_spiky', 'cloak', '#2f5a3a', 'long narrow thick neutral', { eyes: 'black', outfit2: '#d8783a', accent: '#b8202a', marks: ['face_tattoo', 'goatee'] }),
  buggy: d('#3a6ad8', 'long', 'coat', '#c8303a', 'male round thin teeth clown', { eyes: 'black', outfit2: '#f1f1f1' }),
  mihawk: d('black', 'slick', 'coat', '#22232b', 'long sharp angry neutral', { eyes: 'yellow', outfit2: '#9b1b2c', accent: '#22232b', marks: ['hat', 'mustache', 'goatee'] }),
  arlong: d('black', 'long', 'vest_open', '#e8c84a', 'long sharp angry teeth saw', { eyes: 'lightblue', skin: '#7aa0d8', accent: '#8a5a3a', marks: ['cap'] }),
  kuma: d('black', 'curly_long', 'coat', '#2b3a6b', 'square narrow thick neutral', { skin: '#a4704a', outfit2: '#f1f1f1', marks: ['glasses', 'animal_ears'] }),
  bonney: d('pink', 'long', 'tank', '#f1f1f1', 'female big thin grin', { eyes: 'violet', accent: '#3f6a3a', marks: ['cap'] }),
  law: d('black', 'short', 'hoodie', '#e8c84a', 'male sharp thin smirk', { eyes: 'yellow', skin: 'tan', outfit2: '#22232b', marks: ['fur_hat', 'goatee', 'eye_bags', 'earrings'] }),
  doflamingo: d('blond', 'buzz', 'vest_open', '#f1f1f1', 'long round raised teeth', { marks: ['sunglasses', 'fur_collar'], accent: '#f29cc2' }),
  corazon: d('blond', 'messy', 'tshirt', '#f1f1f1', 'long sharp thin clown', { eyes: '#a0522d', accent: '#8a2b3a', marks: ['hood', 'cigarette'] }),
  robin: d('black', 'hime', 'jacket', '#6b3a8a', 'female big thin smile', { eyes: 'blue', skin: 'olive', outfit2: '#f1f1f1' }),
  ace: d('black', 'messy', 'shirtless', '#f08a2a', 'male round raised smirk', { eyes: 'black', accent: '#f08a2a', marks: ['hat', 'freckles', 'necklace'] }),
  whitebeard: d('white', 'bald', 'vest_open', MARINE, 'long sharp thick neutral', { eyes: 'yellow', skin: 'tan', accent: '#22232b', marks: ['big_mustache', 'bandana', 'wrinkles'] }),
  blackbeard: d('black', 'long', 'coat', '#22232b', 'round small thick teeth big', { skin: 'brownskin', outfit2: '#f1f1f1', accent: '#22232b', marks: ['bandana', 'beard'] }),
  akainu: d('black', 'buzz', 'suit', '#9b1b2c', 'square sharp angry frown', { eyes: 'black', outfit2: '#e86a6a', outfit3: '#9b1b2c', accent: '#f1f1f1', marks: ['cap'] }),
  hancock: d('black', 'hime', 'dress', '#c8303a', 'female big thin smile', { eyes: 'blue', skin: 'fair', marks: ['earrings'] }),
  jinbe: d('black', 'ponytail', 'kimono', '#d8783a', 'square sharp thick tusks big', { eyes: 'black', skin: '#4a6ac8', marks: ['scar_eye'] }),
  rayleigh: d('white', 'slick', 'tshirt', '#e8e0c8', 'square round thin smile', { eyes: 'black', skin: 'tan', marks: ['round_glasses', 'beard', 'scar_eye_left', 'wrinkles'] }),
  imu: d('#e8e0c8', 'long', 'cloak', '#22232b', 'long sharp thin neutral', { eyes: 'red', skin: '#5a3a2e', outfit2: '#3a2a4a', marks: ['horns'], faceExtra: { eyeR: 'hidden' } }),
  chopper: d(undefined, 'bald', 'tshirt', '#8a2b3a', 'round round normal smile blue', { eyes: 'black', skin: '#a0703e', accent: '#f29cc2', marks: ['antlers', 'top_hat', 'hat_cross'] }),
  crocodile: d('black', 'slick', 'coat', '#2b2f3d', 'long narrow raised smirk', { eyes: 'black', skin: 'fair', outfit2: '#f08a2a', accent: '#3a3a46', marks: ['scar_nose', 'fur_collar', 'cigarette'] }),
  vivi: d('lightblue', 'ponytail', 'tank', '#f1f1f1', 'female big thin smile', { eyes: 'brown' }),
  enel: d(undefined, 'bald', 'shirtless', '#e8c84a', 'long narrow thick smirk', { eyes: '#6a7a9a', skin: 'fair', accent: '#f1f1f1', marks: ['bandana'] }),
  franky: d('lightblue', 'mohawk', 'vest_open', '#e8603a', 'square round angry grin', { eyes: 'black', marks: ['sunglasses'] }),
  lucci: d('black', 'long', 'suit', '#22232b', 'long sharp raised neutral', { eyes: 'black', outfit2: '#f1f1f1', outfit3: '#22232b', accent: '#22232b', marks: ['top_hat', 'goatee'] }),
  brook: d('black', 'afro', 'suit', '#22232b', 'male hollow none teeth skull', { skin: '#f2efe6', outfit2: '#f1f1f1', outfit3: '#22232b', accent: '#22232b', marks: ['top_hat'] }),
  moria: d('#8a2b3a', 'buzz', 'coat', '#22232b', 'long round angry teeth', { eyes: 'yellow', skin: '#a8b8d8', outfit2: '#7a4ab0', marks: ['horns', 'stitches'] }),
  caesar: d('black', 'long_spiky', 'coat', '#8fc6f0', 'long narrow thin lips', { eyes: 'yellow', outfit2: '#e8c84a', marks: ['horns', 'eye_rings'] }),
  sabo: d('blond', 'messy', 'coat', '#2b3a6b', 'male round normal smile', { eyes: 'black', outfit2: '#f1f1f1', accent: '#22232b', marks: ['top_hat', 'scar_eye'] }),
  'big-mom': d('pink', 'afro', 'dress', '#e85a9a', 'round round thin lips big', { eyes: 'orange', accent: '#c8303a', marks: ['hat'] }),
  katakuri: d('crimson', 'spiky', 'vest_open', '#3a3a46', 'long sharp raised neutral', { eyes: 'crimson', accent: '#d8c8a8', marks: ['mask_lower'] }),
  kaido: d('black', 'long_spiky', 'vest_open', '#4a3a6a', 'square sharp angry teeth', { eyes: 'black', marks: ['horns', 'mustache'] }),
  oden: d('black', 'long_spiky', 'kimono', '#e8e0c8', 'square sharp raised grin', { eyes: 'black', accent: '#c8303a', outfit2: '#5a4a8a', marks: ['eye_rings'] }),
  yamato: d('white', 'ponytail', 'robe', '#f1f1f1', 'female big normal grin', { eyes: 'orange', accent: '#c8303a', outfit2: '#3a6ad8', marks: ['horns', 'earrings'] }),
  saturn: d('white', 'curly_long', 'suit', '#22232b', 'square narrow thick neutral', { eyes: 'black', outfit2: '#f1f1f1', outfit3: '#4a2a6a', accent: '#22232b', marks: ['long_beard', 'big_mustache', 'top_hat', 'scar_eye'] }),
  kizaru: d('black', 'afro', 'suit', '#d8b23a', 'long narrow thin neutral', { outfit2: '#2a7a7a', outfit3: '#a06a8a', marks: ['sunglasses', 'goatee'] }),
  kid: d('red', 'spiky', 'vest_open', '#2b2f3d', 'male sharp none teeth', { eyes: 'orange', accent: '#3a2a2a', marks: ['goggles', 'fur_collar'] }),
  roger: d('black', 'messy', 'coat', '#9b1b2c', 'square sharp thick teeth', { eyes: 'black', outfit2: '#f1f1f1', marks: ['big_mustache'] }),
  aokiji: d('black', 'afro', 'coat', MARINE, 'long narrow thin neutral', { eyes: 'black', skin: 'tan', outfit2: '#2b3a6b', marks: ['sleep_mask'] }),
  fujitora: d('black', 'buzz', 'kimono', '#6b4a8a', 'square closed thick smile', { skin: 'tan', marks: ['scar_x_forehead', 'mustache', 'goatee'] }),
  marco: d('blond', 'mohawk', 'vest_open', '#7a4ab0', 'long narrow thin smile', { eyes: 'black', marks: ['goatee'] }),
  queen: d('black', 'long_spiky', 'coat', '#3a3a46', 'round round thick teeth', { outfit2: '#e8c84a', marks: ['sunglasses', 'mustache'] }),
  uta: d('red', 'twin_tails', 'dress', '#f1f1f1', 'female big thin smile', { eyes: 'violet', hair2: 'white', faceExtra: { eyeR: 'hidden' } }),
  'gild-tesoro': d('green', 'slick', 'suit', '#e85a9a', 'long round raised teeth', { outfit2: '#e8c84a', outfit3: '#e85a9a', marks: ['sunglasses', 'earrings'] }),
  'douglas-bullet': d('blond', 'slick', 'jacket', '#22232b', 'square sharp angry frown', { eyes: 'teal', skin: 'tan', outfit2: '#22232b', marks: ['scar_eye'] }),
  zephyr: d('purple', 'buzz', 'coat', '#2b2f3d', 'square sharp thick neutral', { skin: 'tan', outfit2: '#6b4a8a', marks: ['sunglasses', 'wrinkles'] }),
  shiki: d('gold', 'long_spiky', 'kimono', '#8a2b2b', 'long narrow thick teeth', { eyes: 'black', outfit2: '#22232b', marks: ['steering_wheel', 'wrinkles'] }),
  rocks: d('#3a5ad8', 'messy', 'coat', '#3a2a4a', 'square sharp angry teeth big', { eyes: 'black', hair2: 'white', accent: '#7a4ab0', outfit2: '#22232b', marks: ['face_tattoo', 'goatee'] }),
  vegapunk: d('white', 'bald', 'coat', '#f1f1f1', 'long small thick open big', { eyes: 'black', outfit2: '#f29cc2', marks: ['big_mustache', 'blush'], hairFront: 'M33.4 40 L28 34 L33 35 L29 28 L35 32 L34.8 38 Z M66.6 40 L72 34 L67 35 L71 28 L65 32 L65.2 38 Z' }),
};
