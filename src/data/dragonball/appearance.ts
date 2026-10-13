import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { a } = appearanceKit();
const NAMEK = '#7ec46a';

/** Aspetto dei personaggi principali per i ritratti SVG generati (chiave = id senza `char-`). */
export const dragonballAppearance: Record<string, CharacterAppearance> = {
  'dbz-goku': a('black', 'saiyan', { eyes: 'black', outfit: 'orange' }),
  'dbz-vegeta': a('black', 'saiyan', { eyes: 'black', outfit: '#2b3a8a' }),
  'dbz-gohan': a('black', 'messy', { eyes: 'black', outfit: '#6b3a9a' }),
  'dbz-future-trunks': a('lavender', 'bob', { eyes: 'blue', outfit: '#2b2f3d' }),
  'dbz-piccolo': a(undefined, 'bald', { eyes: 'black', skin: NAMEK, outfit: '#6b3a9a', marks: ['antennae'] }),
  'dbz-krillin': a(undefined, 'bald', { eyes: 'black', outfit: 'orange' }),
  'dbz-bulma': a('teal', 'bob', { eyes: 'blue', outfit: '#d84a8a' }),
  'dbz-frieza': a('purple', 'dome', { eyes: 'red', skin: 'white', outfit: '#efe6f0' }),
  'dbz-cell': a('#3f8a4a', 'crest', { eyes: 'violet', skin: '#a7d58a', outfit: '#3f8a4a' }),
  'dbz-majin-buu': a(undefined, 'bald', { eyes: 'black', skin: '#f2a0c0', outfit: '#6b3a9a', marks: ['antennae'] }),
  'dbz-kid-buu': a(undefined, 'bald', { eyes: 'black', skin: '#f2a0c0', outfit: '#f2a0c0', marks: ['antennae'] }),
  'dbz-gotenks': a('black', 'saiyan', { eyes: 'black', outfit: '#3a6ad8' }),
  'dbz-vegito': a('black', 'saiyan', { eyes: 'black', outfit: '#3a6ad8', marks: ['earrings'] }),
  'dbz-gogeta': a('black', 'saiyan', { eyes: 'black', outfit: '#e8e0c8' }),
  'dbz-broly': a('black', 'long_spiky', { eyes: 'black', skin: 'tan', outfit: '#c8a46a' }),
  'dbz-beerus': a('#8a6aaa', 'bald', { eyes: 'yellow', skin: '#8a6aaa', outfit: '#2b2f3d', marks: ['animal_ears', 'earrings'] }),
  'dbz-whis': a('white', 'mohawk', { eyes: 'violet', skin: '#7aa0d8', outfit: '#6b3a6a' }),
  'dbz-zamasu': a('white', 'mohawk', { eyes: 'gray', skin: '#8ad08a', outfit: '#e8e0c8', marks: ['earrings'] }),
  'dbz-goku-black': a('black', 'saiyan', { eyes: 'black', outfit: '#22232b', marks: ['earrings'] }),
  'dbz-jiren': a(undefined, 'bald', { eyes: 'black', skin: '#a8a8b4', outfit: '#c8302e' }),
  'dbz-android-17': a('black', 'bob', { eyes: 'blue', outfit: '#2b2f3d' }),
  'dbz-android-18': a('blond', 'bob', { eyes: 'blue', outfit: '#2b2f3d', marks: ['earrings'] }),
  'dbz-gt-pan': a('black', 'short', { eyes: 'black', outfit: '#c8302e', accent: '#f08a2a', marks: ['bandana'] }),
  'dbz-gt-baby': a(undefined, 'bald', { eyes: 'red', skin: '#e8e8ee', outfit: '#22232b' }),
  'dbz-gt-super-17': a('black', 'bob', { eyes: 'blue', outfit: '#2b2f3d' }),
  'dbz-gt-omega-shenron': a(undefined, 'bald', { eyes: 'red', skin: '#e8e8ee', outfit: '#d8d8e0', marks: ['horns'] }),
  'dbz-cooler': a('#6b3a9a', 'dome', { eyes: 'red', skin: '#efe6f0', outfit: '#6b3a9a' }),
  'dbz-janemba': a('white', 'spiky', { eyes: 'yellow', skin: '#d84040', outfit: '#3a3a46', marks: ['horns'] }),
  'dbz-kefla': a('black', 'ponytail', { eyes: 'black', outfit: '#e8e0c8', marks: ['earrings'] }),
  'dbz-fused-zamasu': a('white', 'mohawk', { eyes: 'gray', skin: '#c8a0c8', outfit: '#e8e0c8', marks: ['earrings', 'halo'] }),
  'dbz-moro': a('#9a9aa4', undefined, { eyes: 'yellow', species: 'beast', marks: ['horns'] }),
  'dbz-kami': a(undefined, 'bald', { eyes: 'black', skin: NAMEK, outfit: '#f1f1f1', marks: ['antennae'] }),
  'dbz-king-piccolo': a(undefined, 'bald', { eyes: 'black', skin: NAMEK, outfit: '#4a3a6a', marks: ['antennae'] }),
  'dbz-gomah': a(undefined, 'bald', { eyes: 'yellow', skin: '#3a5ad8', outfit: '#2b2f3d', marks: ['horns'] }),
};
