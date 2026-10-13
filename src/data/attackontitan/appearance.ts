import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { d } = appearanceKit();
/** Giacca corta del Corpo di ricerca (e delle altre armate) su camicia chiara. */
const JACKET = '#8a6a4a';
const SHIRT = '#f1f1f1';
const MARLEY = '#d8cfb8';

/**
 * Aspetto dei personaggi principali per i ritratti SVG generati: disegni propri
 * ricostruiti dalle descrizioni testuali (Attack on Titan Wiki), nessuna immagine.
 * Chiave = id senza `char-aot-`.
 */
export const aotAppearance: Record<string, CharacterAppearance> = {
  eren: d('#3a2a22', 'short', 'survey', JACKET, 'male sharp angry frown', { eyes: 'gray', outfit2: SHIRT }),
  mikasa: d('black', 'bob', 'survey', JACKET, 'female sharp thin neutral', { eyes: 'gray', skin: 'fair', outfit2: SHIRT, accent: '#b8202a', marks: ['scarf'] }),
  armin: d('blond', 'bob', 'survey', JACKET, 'round big thin neutral', { eyes: 'hazel', outfit2: SHIRT }),
  jean: d('#b8a890', 'short', 'survey', JACKET, 'long sharp angry frown', { eyes: 'brown', outfit2: SHIRT }),
  connie: d('#4a3324', 'buzz', 'survey', JACKET, 'round round normal grin', { eyes: 'gray', outfit2: SHIRT }),
  sasha: d('#7b5233', 'ponytail', 'survey', JACKET, 'female big thin grin', { eyes: '#c8a050', outfit2: '#c8c8c8' }),
  historia: d('blond', 'long', 'survey', JACKET, 'female big thin smile', { eyes: 'blue', skin: 'fair', outfit2: SHIRT }),
  ymir: d('black', 'ponytail', 'survey', JACKET, 'female sharp thin smirk', { eyes: 'gray', skin: 'tan', outfit2: '#2b2f3d', marks: ['freckles'] }),
  marco: d('#5a3a24', 'short', 'survey', JACKET, 'male round normal smile', { eyes: 'brown', outfit2: SHIRT, marks: ['freckles'] }),
  floch: d('#d8b870', 'messy', 'survey', JACKET, 'male sharp normal smirk', { eyes: 'gray', outfit2: SHIRT }),
  levi: d('black', 'bob', 'survey', JACKET, 'male narrow normal frown', { eyes: 'gray', skin: 'fair', outfit2: SHIRT, marks: ['eye_bags'] }),
  erwin: d('blond', 'slick', 'survey', JACKET, 'square sharp thick neutral', { eyes: 'blue', outfit2: SHIRT }),
  hange: d('#5a3a24', 'ponytail', 'survey', JACKET, 'male round normal grin', { eyes: 'brown', outfit2: SHIRT, marks: ['eyepatch'], faceExtra: { eyeR: 'hidden' } }),
  mike: d('blond', 'short', 'survey', JACKET, 'square narrow thick neutral', { eyes: 'gray', outfit2: SHIRT, marks: ['mustache', 'goatee'] }),
  petra: d('#d8a860', 'bob', 'survey', JACKET, 'female big thin smile', { eyes: 'brown', outfit2: SHIRT }),
  shadis: d('#4a3324', 'bald', 'coat', '#4a4a3a', 'long narrow thick frown', { eyes: 'black', outfit2: SHIRT, marks: ['goatee', 'wrinkles', 'eye_bags'] }),
  hannes: d('blond', 'short', 'survey', '#6a5a3a', 'square round thick grin', { eyes: 'brown', outfit2: SHIRT, marks: ['mustache'] }),
  pixis: d('gray', 'bald', 'survey', '#6a5a3a', 'square narrow thick smile', { eyes: 'black', outfit2: SHIRT, marks: ['big_mustache', 'wrinkles'] }),
  nile: d('black', 'slick', 'survey', '#5a4a3a', 'long narrow thin neutral', { eyes: 'black', outfit2: SHIRT, marks: ['mustache', 'goatee', 'eye_bags'] }),
  zackly: d('gray', 'buzz', 'coat', '#3a3a46', 'square small thick neutral', { eyes: 'black', outfit2: SHIRT, marks: ['round_glasses', 'beard', 'mustache', 'wrinkles'] }),
  grisha: d('black', 'ponytail', 'suit', '#6a6a72', 'long narrow thin neutral', { eyes: 'gray', outfit2: SHIRT, outfit3: '#22232b', marks: ['round_glasses', 'goatee', 'mustache'] }),
  carla: d('#3a2a22', 'ponytail', 'dress', '#e8d8b8', 'female big thin smile', { eyes: '#c8b890', skin: 'fair' }),
  dina: d('blond', 'bob', 'dress', '#f1f1f1', 'female big thin smile', { eyes: 'lightblue', skin: 'fair' }),
  zeke: d('platinum', 'messy', 'shirtless', '#d8cfb8', 'square narrow thick smirk', { eyes: 'gray', marks: ['round_glasses', 'beard', 'mustache'] }),
  kruger: d('#3a2a22', 'slick', 'coat', MARLEY, 'long narrow thick neutral', { eyes: 'gray', outfit2: '#3a3a46' }),
  reiner: d('blond', 'buzz', 'survey', JACKET, 'square sharp thick neutral', { eyes: 'hazel', outfit2: SHIRT, marks: ['goatee'] }),
  bertolt: d('#3a2a22', 'short', 'survey', JACKET, 'long round thin neutral', { eyes: 'brown', outfit2: SHIRT }),
  annie: d('blond', 'bun', 'hoodie', '#f1f1f1', 'female sharp thin frown', { eyes: 'blue', skin: 'fair', outfit2: '#22232b', faceExtra: { eyeL: 'narrow' } }),
  porco: d('blond', 'slick', 'coat', MARLEY, 'male sharp angry frown', { eyes: 'gray', outfit2: '#3a3a46' }),
  pieck: d('black', 'long', 'coat', '#6a5a4a', 'female narrow thin smile', { eyes: '#5a3a24', outfit2: SHIRT }),
  gabi: d('black', 'ponytail', 'coat', MARLEY, 'round big normal grin', { eyes: 'brown', outfit2: '#3a3a46' }),
  falco: d('#a8885a', 'messy', 'coat', MARLEY, 'round big normal neutral', { eyes: 'hazel', outfit2: '#3a3a46' }),
  magath: d('black', 'buzz', 'coat', MARLEY, 'square narrow thick frown', { eyes: 'lightblue', outfit2: '#3a3a46', marks: ['goatee', 'mustache', 'wrinkles'] }),
  'willy-tybur': d('blond', 'bob', 'suit', '#22232b', 'male round thin smile', { eyes: 'brown', outfit2: SHIRT, outfit3: '#22232b', marks: ['goatee'] }),
  'lara-tybur': d('#3a2a22', 'bun', 'dress', '#22232b', 'female narrow thin neutral', { eyes: 'black', skin: 'fair' }),
  yelena: d('blond', 'bob', 'suit', '#3a3a46', 'long round thin smile', { eyes: 'black', outfit2: SHIRT, outfit3: '#3a3a46' }),
  onyankopon: d('black', 'buzz', 'coat', '#3a3a46', 'male round thick smile', { eyes: 'black', skin: 'dark', outfit2: SHIRT }),
  kiyomi: d('black', 'bun', 'kimono', '#a83030', 'female narrow thin smile', { eyes: 'black', outfit2: '#e8d8b8' }),
  'ymir-fritz': d('blond', 'hime', 'dress', '#d8ccb0', 'female big thin neutral', { eyes: 'gray', skin: 'fair' }),
  'king-fritz': d('#3a2a22', 'long_spiky', 'cloak', '#6b2a2a', 'long sharp thick frown', { eyes: 'black', outfit2: '#3a3a46', marks: ['crown', 'beard', 'mustache'] }),
  'karl-fritz': d('#d8c8a0', 'long', 'cloak', '#3a3a6a', 'long narrow thick neutral', { eyes: 'blue', outfit2: '#e8d8b8', marks: ['crown', 'beard', 'mustache'] }),
  'rod-reiss': d('black', 'short', 'suit', '#22232b', 'round small thin neutral', { eyes: 'blue', outfit2: SHIRT, outfit3: '#22232b', marks: ['mustache'] }),
  'frieda-reiss': d('black', 'long', 'dress', '#e8e0d0', 'female big thin smile', { eyes: 'blue', skin: 'fair' }),
  kenny: d('#3a2a22', 'bob', 'coat', '#22232b', 'long narrow thin smirk', { eyes: 'gray', outfit2: SHIRT, accent: '#22232b', marks: ['hat', 'goatee', 'wrinkles'] }),
};
