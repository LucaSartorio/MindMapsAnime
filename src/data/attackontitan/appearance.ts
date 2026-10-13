import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { a } = appearanceKit();
const SCOUT = '#7a5a3a';
const MARLEY = '#5a5a3a';

/** Aspetto dei personaggi principali per i ritratti SVG generati (chiave = id senza `char-aot-`). */
export const aotAppearance: Record<string, CharacterAppearance> = {
  eren: a('darkbrown', 'short', { eyes: 'teal', outfit: SCOUT }),
  mikasa: a('black', 'bob', { eyes: 'gray', outfit: SCOUT, accent: 'red', marks: ['fur_collar'] }),
  armin: a('blond', 'bob', { eyes: 'blue', outfit: SCOUT }),
  jean: a('brown', 'short', { eyes: 'amber', outfit: SCOUT }),
  connie: a('darkbrown', 'buzz', { eyes: 'brown', outfit: SCOUT }),
  sasha: a('brown', 'ponytail', { eyes: 'brown', outfit: SCOUT }),
  historia: a('blond', 'long', { eyes: 'blue', outfit: SCOUT }),
  ymir: a('brown', 'ponytail', { eyes: 'brown', skin: 'tan', outfit: SCOUT }),
  marco: a('black', 'short', { eyes: 'brown', outfit: SCOUT }),
  floch: a('auburn', 'swept', { eyes: 'brown', outfit: SCOUT }),
  levi: a('black', 'bob', { eyes: 'gray', outfit: SCOUT }),
  erwin: a('blond', 'slick', { eyes: 'blue', outfit: SCOUT }),
  hange: a('brown', 'ponytail', { eyes: 'brown', outfit: SCOUT, marks: ['glasses'] }),
  mike: a('blond', 'short', { eyes: 'gray', outfit: SCOUT, marks: ['mustache'] }),
  petra: a('auburn', 'bob', { eyes: 'amber', outfit: SCOUT }),
  shadis: a('brown', 'bald', { eyes: 'black', outfit: '#4a4a3a', marks: ['beard'] }),
  hannes: a('blond', 'short', { eyes: 'brown', outfit: '#4a4a3a', marks: ['beard'] }),
  pixis: a('gray', 'bald', { eyes: 'black', outfit: '#4a4a3a', marks: ['mustache'] }),
  nile: a('black', 'slick', { eyes: 'black', outfit: '#3a5a3a', marks: ['mustache'] }),
  zackly: a('gray', 'bald', { eyes: 'black', outfit: '#3a3a46', marks: ['mustache'] }),
  grisha: a('darkbrown', 'ponytail', { eyes: 'brown', outfit: '#6b5a3a', marks: ['glasses', 'beard'] }),
  carla: a('brown', 'ponytail', { eyes: 'amber', outfit: '#a85a3a' }),
  dina: a('blond', 'long', { eyes: 'blue', outfit: '#6b5a3a' }),
  zeke: a('blond', 'short', { eyes: 'blue', outfit: MARLEY, marks: ['glasses', 'beard'] }),
  kruger: a('darkbrown', 'short', { eyes: 'gray', outfit: MARLEY }),
  reiner: a('blond', 'buzz', { eyes: 'amber', outfit: MARLEY }),
  bertolt: a('black', 'short', { eyes: 'green', outfit: SCOUT }),
  annie: a('blond', 'bun', { eyes: 'blue', outfit: '#3a5a7a' }),
  porco: a('blond', 'slick', { eyes: 'brown', outfit: MARLEY }),
  pieck: a('black', 'long', { eyes: 'gray', outfit: MARLEY }),
  gabi: a('black', 'bob', { eyes: 'brown', outfit: MARLEY }),
  falco: a('blond', 'short', { eyes: 'amber', outfit: MARLEY }),
  magath: a('gray', 'slick', { eyes: 'black', outfit: MARLEY, marks: ['mustache'] }),
  'willy-tybur': a('brown', 'slick', { eyes: 'brown', outfit: '#22232b', marks: ['mustache'] }),
  'lara-tybur': a('auburn', 'long', { eyes: 'brown', outfit: '#22232b' }),
  yelena: a('platinum', 'buzz', { eyes: 'gray', outfit: '#3a3a46' }),
  onyankopon: a('black', 'buzz', { eyes: 'black', skin: 'dark', outfit: '#3a3a46', accent: MARLEY, marks: ['hat'] }),
  kiyomi: a('black', 'bun', { eyes: 'black', outfit: '#a83030' }),
  'ymir-fritz': a('blond', 'hime', { eyes: 'gray', outfit: '#8a7a6a' }),
  'king-fritz': a('darkbrown', 'long_spiky', { eyes: 'black', outfit: '#6b3a3a', marks: ['crown', 'beard'] }),
  'karl-fritz': a('brown', 'short', { eyes: 'blue', outfit: '#6b3a3a', marks: ['crown'] }),
  'rod-reiss': a('gray', 'bald', { eyes: 'blue', outfit: '#3a3a46', marks: ['mustache'] }),
  'frieda-reiss': a('black', 'bob', { eyes: 'blue', outfit: '#e8e0c8' }),
  kenny: a('black', 'long', { eyes: 'gray', outfit: '#22232b', accent: '#2b2f3d', marks: ['hat'] }),
};
