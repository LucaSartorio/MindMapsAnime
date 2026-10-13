import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { a } = appearanceKit();
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
  shanks: a('red', 'messy', { eyes: 'black', outfit: '#2b2f3d', marks: ['scar_eye'] }),
  garp: a('gray', 'buzz', { eyes: 'black', outfit: MARINE, marks: ['beard', 'scar_eye'] }),
  dragon: a('black', 'long_spiky', { eyes: 'black', outfit: '#2f5a3a', marks: ['forehead_tattoo'] }),
  buggy: a('blue', 'long', { eyes: 'black', outfit: '#c8302e' }),
  mihawk: a('black', 'slick', { eyes: 'yellow', outfit: '#22232b', accent: '#22232b', marks: ['mustache', 'hat'] }),
  arlong: a('black', 'buzz', { eyes: 'black', skin: '#6f8fd0', outfit: '#e8c84a', accent: '#c8a46a', marks: ['hat'] }),
  kuma: a('black', 'buzz', { eyes: 'black', skin: 'tan', outfit: '#3a3a46', accent: '#d8c8a8', marks: ['hat', 'glasses'] }),
  bonney: a('pink', 'long', { eyes: 'violet', outfit: '#e8c84a', accent: '#3f6a3a', marks: ['hat'] }),
  law: a('black', 'short', { eyes: 'gray', outfit: '#e8c84a', accent: '#f1f1f1', marks: ['hat', 'earrings'] }),
  doflamingo: a('blond', 'buzz', { outfit: '#e8e0c8', accent: 'pink', marks: ['sunglasses', 'fur_collar'] }),
  corazon: a('blond', 'short', { eyes: 'black', outfit: '#22232b', accent: '#3a3a46', marks: ['hat'] }),
  robin: a('black', 'long', { eyes: 'blue', outfit: '#6b3a8a' }),
  ace: a('black', 'messy', { eyes: 'black', outfit: 'light', accent: '#f08a2a', marks: ['hat'] }),
  whitebeard: a('white', 'bald', { eyes: 'black', skin: 'tan', outfit: MARINE, accent: '#2b2f3d', marks: ['mustache', 'bandana'] }),
  blackbeard: a('black', 'messy', { eyes: 'black', skin: 'tan', outfit: '#2b2f3d', marks: ['beard'] }),
  akainu: a('black', 'short', { eyes: 'black', outfit: '#a83030', accent: '#3a3a46', marks: ['hat'] }),
  hancock: a('black', 'hime', { eyes: 'blue', outfit: '#a83080', marks: ['earrings'] }),
  jinbe: a('black', 'ponytail', { eyes: 'black', skin: '#5a7ad0', outfit: '#d8783a' }),
  rayleigh: a('white', 'slick', { eyes: 'black', outfit: '#e8e0c8', marks: ['glasses', 'beard', 'scar_eye'] }),
  imu: a(undefined, 'bald', { eyes: 'red', skin: '#22232b', outfit: '#22232b', marks: ['crown'] }),
  chopper: a('brown', undefined, { eyes: 'black', species: 'beast', accent: 'pink', marks: ['hat', 'horns'] }),
  crocodile: a('black', 'slick', { eyes: 'black', outfit: '#2b2f3d', accent: '#3a3a46', marks: ['scar_nose', 'fur_collar'] }),
  vivi: a('lightblue', 'ponytail', { eyes: 'brown', outfit: '#f1f1f1' }),
  enel: a(undefined, 'bald', { eyes: 'black', outfit: '#e8c84a', accent: '#f1f1f1', marks: ['bandana'] }),
  franky: a('lightblue', 'mohawk', { eyes: 'black', outfit: '#e8a03a', marks: ['sunglasses'] }),
  lucci: a('black', 'long', { eyes: 'black', outfit: '#22232b', accent: '#22232b', marks: ['hat'] }),
  brook: a('black', 'afro', { eyes: 'black', skin: '#f2efe6', outfit: '#22232b', accent: '#22232b', marks: ['hat'] }),
  moria: a('black', 'mohawk', { eyes: 'yellow', skin: '#b8a8d0', outfit: '#2b2f3d', marks: ['stitches'] }),
  caesar: a('black', 'long', { eyes: 'black', outfit: '#e8e0c8', marks: ['horns'] }),
  sabo: a('blond', 'messy', { eyes: 'black', outfit: '#2b3a6b', accent: '#2b2f3d', marks: ['hat', 'scar_eye'] }),
  'big-mom': a('pink', 'afro', { eyes: 'black', outfit: '#e85a9a', accent: '#c8302e', marks: ['hat'] }),
  katakuri: a('crimson', 'spiky', { eyes: 'black', outfit: '#3a3a46', accent: '#d8c8a8', marks: ['mask_lower'] }),
  kaido: a('black', 'long_spiky', { eyes: 'black', outfit: '#4a3a6a', marks: ['horns', 'mustache'] }),
  oden: a('black', 'ponytail', { eyes: 'black', outfit: '#5a4a8a', marks: ['beard'] }),
  yamato: a('white', 'long', { eyes: 'orange', outfit: '#f1f1f1', accent: '#c8302e', marks: ['horns'] }),
  saturn: a('white', 'bald', { eyes: 'black', skin: 'pale', outfit: '#22232b', marks: ['beard', 'horns'] }),
  kizaru: a('black', 'buzz', { outfit: '#e8d84a', marks: ['sunglasses'] }),
  kid: a('red', 'spiky', { eyes: 'black', outfit: '#22232b', accent: '#3a3a46', marks: ['goggles', 'fur_collar'] }),
  roger: a('black', 'messy', { eyes: 'black', outfit: '#22232b', accent: '#9b1b2c', marks: ['hat', 'mustache'] }),
  aokiji: a('black', 'afro', { eyes: 'black', skin: 'tan', outfit: MARINE, marks: ['goggles'] }),
  fujitora: a('black', 'buzz', { eyes: 'gray', outfit: '#6b4a8a', marks: ['scar_eye'] }),
  marco: a('blond', 'mohawk', { eyes: 'black', outfit: '#7a4ab0' }),
  queen: a('black', 'long_spiky', { skin: 'tan', outfit: '#3a3a46', marks: ['sunglasses'] }),
  uta: a('red', 'twin_tails', { eyes: 'violet', outfit: '#f1f1f1' }),
  'gild-tesoro': a('green', 'slick', { outfit: '#f1f1f1', marks: ['sunglasses'] }),
  'douglas-bullet': a('black', 'buzz', { eyes: 'black', skin: 'tan', outfit: '#3a3a46', marks: ['scar_nose'] }),
  zephyr: a('purple', 'slick', { outfit: '#2b2f3d', marks: ['sunglasses'] }),
  shiki: a('gold', 'long_spiky', { eyes: 'black', outfit: '#2b2f3d' }),
};
