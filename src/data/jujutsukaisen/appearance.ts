import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { a } = appearanceKit();
const UNIFORM = '#2b2f3d';
const MAKI = '#2f5a3a';

/** Aspetto dei personaggi principali per i ritratti SVG generati (chiave = id senza `char-jjk-`). */
export const jjkAppearance: Record<string, CharacterAppearance> = {
  yuji: a('pink', 'messy', { eyes: 'brown', outfit: UNIFORM }),
  megumi: a('black', 'spiky', { eyes: 'teal', outfit: UNIFORM }),
  nobara: a('orange', 'bob', { eyes: 'brown', outfit: UNIFORM }),
  gojo: a('white', 'messy', { eyes: 'lightblue', outfit: 'navy', marks: ['blindfold'] }),
  maki: a(MAKI, 'ponytail', { eyes: 'brown', outfit: UNIFORM, marks: ['glasses'] }),
  toge: a('platinum', 'short', { eyes: 'violet', outfit: UNIFORM, accent: UNIFORM, marks: ['mask_lower'] }),
  panda: a('#f0f0f0', undefined, { eyes: 'black', species: 'beast' }),
  yuta: a('black', 'short', { eyes: 'black', outfit: '#f1f1f1' }),
  nanami: a('blond', 'slick', { outfit: '#e8e0c8', marks: ['sunglasses'] }),
  shoko: a('brown', 'long', { eyes: 'brown', outfit: '#e8e8e8' }),
  yaga: a('black', 'buzz', { outfit: '#2b2f3d', marks: ['sunglasses', 'beard'] }),
  yuki: a('blond', 'long', { eyes: 'brown', outfit: '#3a3a46' }),
  hakari: a('platinum', 'messy', { eyes: 'gray', outfit: UNIFORM }),
  junpei: a('black', 'bob', { eyes: 'black', outfit: '#3a3a46' }),
  riko: a('black', 'long', { eyes: 'blue', outfit: '#2b3a6b' }),
  rika: a('black', 'long', { eyes: 'white', skin: '#d8d0e8', outfit: '#d8d0e8' }),
  higuruma: a('black', 'slick', { eyes: 'black', outfit: '#2b2f3d' }),
  todo: a('brown', 'ponytail', { eyes: 'black', skin: 'tan', outfit: UNIFORM, marks: ['scar_eye'] }),
  mai: a(MAKI, 'bob', { eyes: 'brown', outfit: UNIFORM }),
  noritoshi: a('black', 'ponytail', { eyes: 'black', outfit: '#e8e0c8' }),
  mechamaru: a(undefined, 'bald', { eyes: 'red', skin: '#9aa0aa', outfit: '#5a6070', marks: ['cyclops'] }),
  naoya: a('blond', 'slick', { eyes: 'amber', outfit: '#3a3a46', marks: ['earrings'] }),
  tengen: a(undefined, 'bald', { eyes: 'black', skin: '#e0dcd6', outfit: '#e8e0c8', marks: ['third_eye'] }),
  sukuna: a('pink', 'spiky', { eyes: 'red', outfit: '#f1f1f1', marks: ['cheek_marks', 'third_eye'] }),
  kenjaku: a('black', 'bun', { eyes: 'black', outfit: '#2b2f3d', marks: ['stitches'] }),
  geto: a('black', 'bun', { eyes: 'black', outfit: '#2b2f3d', marks: ['earrings'] }),
  toji: a('black', 'messy', { eyes: 'green', outfit: '#22232b', marks: ['scar_cheek'] }),
  mahito: a('lightblue', 'long', { eyes: 'gray', outfit: '#e8e0c8', marks: ['stitches'] }),
  jogo: a(undefined, 'bald', { eyes: 'black', skin: '#e8dcc8', outfit: '#4a3a6a', marks: ['cyclops'] }),
  choso: a('black', 'twin_tails', { eyes: 'brown', outfit: '#6b4a3a', marks: ['scar_nose'] }),
  kashimo: a('lightblue', 'spiky', { eyes: 'black', outfit: '#3a3a46' }),
};
