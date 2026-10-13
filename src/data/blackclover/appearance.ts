import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { a } = appearanceKit();
const DEVIL = '#2b2b36';

/** Aspetto dei personaggi principali per i ritratti SVG generati (chiave = id senza `char-bc-`). */
export const blackcloverAppearance: Record<string, CharacterAppearance> = {
  asta: a('#e3e3e3', 'messy', { eyes: 'green', outfit: '#22232b', accent: '#2b2f3d', marks: ['bandana'] }),
  yami: a('black', 'slick', { eyes: 'black', skin: 'tan', outfit: '#22232b', accent: '#2b2f3d', marks: ['bandana'] }),
  noelle: a('silver', 'twin_tails', { eyes: 'violet', outfit: '#22232b' }),
  nacht: a('black', 'swept', { eyes: 'black', outfit: '#2b2f3d' }),
  liebe: a('white', 'messy', { eyes: 'red', skin: DEVIL, outfit: DEVIL, marks: ['horns'] }),
  conrad: a('gray', 'long', { eyes: 'gray', outfit: '#3a3a46' }),
  yuno: a('black', 'swept', { eyes: 'amber', outfit: '#e8e0c8' }),
  william: a('platinum', 'long', { eyes: 'black', outfit: '#3f6a3a' }),
  nozel: a('silver', 'long', { eyes: 'gray', outfit: 'navy' }),
  fuegoleon: a('red', 'long_spiky', { eyes: 'amber', outfit: '#c8302e' }),
  mereoleona: a('red', 'long_spiky', { eyes: 'amber', outfit: '#8a3a2e' }),
  charlotte: a('blond', 'long', { eyes: 'blue', outfit: '#2b6a4a' }),
  julius: a('gold', 'messy', { eyes: 'amber', outfit: '#e8e0c8' }),
  lumiere: a('blond', 'short', { eyes: 'amber', outfit: '#f1f1f1' }),
  patry: a('white', 'swept', { eyes: 'red', outfit: '#f1f1f1' }),
  licht: a('silver', 'long', { eyes: 'gray', outfit: '#f1f1f1' }),
  zagred: a(undefined, 'bald', { eyes: 'white', skin: DEVIL, outfit: DEVIL, marks: ['horns'] }),
  dante: a('black', 'slick', { eyes: 'black', outfit: '#3a3a46' }),
  vanica: a('crimson', 'twin_tails', { eyes: 'red', outfit: '#22232b' }),
  zenon: a('black', 'swept', { eyes: 'gray', outfit: '#3a3a46' }),
  lucifero: a('white', 'long_spiky', { eyes: 'red', skin: DEVIL, outfit: DEVIL, marks: ['horns'] }),
};
