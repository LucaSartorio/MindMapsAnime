import type { CharacterAppearance } from '@/types';
import { appearanceKit } from '../shared/appearanceKit';

const { a } = appearanceKit();
const SHIHAKUSHO = '#22232b';
const HAORI = '#f1f1f1';

/** Aspetto dei personaggi principali per i ritratti SVG generati (chiave = id senza `char-bl-`). */
export const bleachAppearance: Record<string, CharacterAppearance> = {
  ichigo: a('orange', 'messy', { eyes: 'brown', outfit: SHIHAKUSHO }),
  rukia: a('black', 'bob', { eyes: 'violet', outfit: SHIHAKUSHO }),
  orihime: a('orange', 'long', { eyes: 'gray', outfit: '#e8e0c8' }),
  uryu: a('black', 'bob', { eyes: 'blue', outfit: HAORI, marks: ['glasses'] }),
  chad: a('brown', 'afro', { eyes: 'brown', skin: 'tan', outfit: '#a83030' }),
  isshin: a('black', 'messy', { eyes: 'brown', outfit: HAORI }),
  masaki: a('orange', 'long', { eyes: 'brown', outfit: '#e8e0c8' }),
  urahara: a('blond', 'bob', { eyes: 'gray', outfit: '#2f4a3a', accent: '#3f6a3a', marks: ['hat'] }),
  yoruichi: a('purple', 'ponytail', { eyes: 'amber', skin: 'brownskin', outfit: '#3a3a46' }),
  zangetsu: a('black', 'long', { outfit: '#22232b', marks: ['sunglasses'] }),
  white: a('white', 'messy', { eyes: 'yellow', skin: '#f2f2f2', outfit: HAORI }),
  yamamoto: a('white', 'bald', { eyes: 'black', outfit: HAORI, marks: ['beard', 'mustache'] }),
  'soi-fon': a('black', 'twin_tails', { eyes: 'gray', outfit: SHIHAKUSHO }),
  gin: a('silver', 'bob', { eyes: 'lightblue', outfit: HAORI }),
  unohana: a('black', 'long', { eyes: 'navy', outfit: HAORI }),
  aizen: a('brown', 'slick', { eyes: 'brown', outfit: HAORI }),
  byakuya: a('black', 'long', { eyes: 'gray', outfit: HAORI }),
  renji: a('red', 'ponytail', { eyes: 'brown', outfit: SHIHAKUSHO, accent: '#f1f1f1', marks: ['forehead_tattoo', 'bandana'] }),
  kyoraku: a('brown', 'ponytail', { eyes: 'gray', outfit: '#e85a9a', accent: '#c8a46a', marks: ['hat'] }),
  tosen: a('black', 'long', { skin: 'dark', outfit: HAORI, marks: ['sunglasses'] }),
  hitsugaya: a('white', 'spiky', { eyes: 'teal', outfit: HAORI }),
  kenpachi: a('black', 'long_spiky', { eyes: 'black', outfit: HAORI, marks: ['eyepatch', 'scar_eye'] }),
  mayuri: a('lightblue', 'crest', { eyes: 'yellow', skin: '#f0f0f0', outfit: HAORI }),
  ukitake: a('white', 'long', { eyes: 'brown', outfit: HAORI }),
  shinji: a('blond', 'hime', { eyes: 'brown', outfit: HAORI }),
  ginjo: a('black', 'swept', { eyes: 'gray', outfit: '#22232b', accent: '#f1f1f1', marks: ['fur_collar'] }),
  starrk: a('brown', 'long', { eyes: 'gray', outfit: HAORI, marks: ['bone_fragment'] }),
  barragan: a('white', 'bald', { eyes: 'black', skin: 'tan', outfit: '#e8e0c8', marks: ['crown', 'beard', 'mustache'] }),
  harribel: a('blond', 'bob', { eyes: 'green', skin: 'brownskin', outfit: HAORI, accent: '#ece5cf', marks: ['mask_lower'] }),
  ulquiorra: a('black', 'bob', { eyes: 'green', skin: 'pale', outfit: HAORI, accent: '#2aa59a', marks: ['eye_lines', 'horns'] }),
  grimmjow: a('lightblue', 'messy', { eyes: 'lightblue', outfit: HAORI, marks: ['bone_fragment'] }),
  nelliel: a('teal', 'long', { eyes: 'hazel', outfit: '#3f6a4a', marks: ['scar_nose', 'horns'] }),
  yhwach: a('black', 'long_spiky', { eyes: 'red', outfit: '#2b2f3d', marks: ['mustache', 'beard'] }),
  haschwalth: a('blond', 'long', { eyes: 'blue', outfit: HAORI }),
};
