import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { a } = appearanceKit();

/** Aspetto dei personaggi principali per i ritratti SVG generati (chiave = id senza `char-hxh-`). */
export const hxhAppearance: Record<string, CharacterAppearance> = {
  gon: a('black', 'spiky', { eyes: 'brown', outfit: '#3f8a4a' }),
  killua: a('white', 'messy', { eyes: 'blue', outfit: '#5a6a8a' }),
  kurapika: a('blond', 'bob', { eyes: 'red', outfit: '#3a6ad8', marks: ['earrings'] }),
  leorio: a('black', 'buzz', { outfit: '#2b3a6b', marks: ['sunglasses'] }),
  hisoka: a('red', 'slick', { eyes: 'amber', outfit: '#f1f1f1', accent: '#4a7ad8', marks: ['cheek_marks'] }),
  illumi: a('black', 'hime', { eyes: 'black', outfit: '#4a3a6a' }),
  chrollo: a('black', 'slick', { eyes: 'gray', outfit: '#22232b', accent: '#2b2f3d', marks: ['forehead_mark', 'earrings'] }),
  netero: a('white', 'bald', { eyes: 'black', outfit: '#f1f1f1', marks: ['beard', 'mustache'] }),
  ging: a('black', 'spiky', { eyes: 'brown', outfit: '#6b5a3a', accent: '#e9e4d6', marks: ['bandana'] }),
  biscuit: a('blond', 'twin_tails', { eyes: 'blue', outfit: '#d84a8a' }),
  kite: a('white', 'long', { eyes: 'black', outfit: '#3a3a46', accent: '#e9e4d6', marks: ['hat'] }),
  silva: a('white', 'long', { eyes: 'blue', outfit: '#4a5a6a' }),
  zeno: a('white', 'bun', { eyes: 'black', outfit: '#8a8a9a', marks: ['mustache'] }),
  meruem: a('#2f6a3a', 'crest', { eyes: 'gray', skin: '#bcd8a8', outfit: '#3a3a46' }),
  neferpitou: a('white', 'short', { eyes: 'red', outfit: '#f1f1f1', marks: ['animal_ears'] }),
  shaiapouf: a('platinum', 'bob', { eyes: 'violet', outfit: '#3a3a46' }),
  menthuthuyoupi: a(undefined, 'bald', { eyes: 'black', skin: '#7a5a4a', outfit: '#5a3a2a' }),
};
