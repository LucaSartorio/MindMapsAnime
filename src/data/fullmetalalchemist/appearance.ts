import type { CharacterAppearance } from '@/types';
import { appearanceKit, fc } from '../shared/appearanceKit';

const { a } = appearanceKit();

/** Interno dell'armatura di Alphonse: il vuoto visibile dalle fessure dell'elmo. */
const HOLLOW = '#1c1c24';
const STEEL = '#8e929c';

/**
 * Elmo chiuso generico per l'armatura di Alphonse: sagome proprie (path SVG nel viewBox 100x100) passate
 * come «capelli» (`hairFront` / `hairBack` / `hairDetail`), nessuna immagine ufficiale. Il fonte descrive
 * solo «una enorme armatura» (S10): forma, cimiero e colori sono un'approssimazione.
 */
const AL_HELM_FRONT =
  'M31 46 C29 26 38 14 50 14 C62 14 71 26 69 46 L68 64 C66 69 58 71 50 71 C42 71 34 69 32 64 Z ' +
  'M37 41 L37 46 L63 46 L63 41 Z';
const AL_HELM_BACK = 'M30 46 C27 24 38 11 50 11 C62 11 73 24 70 46 L71 72 L29 72 Z';
const AL_HELM_DETAIL = 'M50 14 L50 41 M50 46 L50 70 M40 56 H60 M41 62 H59';

/**
 * Aspetto dei personaggi principali per i ritratti SVG generati: disegni propri ricostruiti SOLO da
 * descrizioni testuali (S9, S10, S27-S29 nel manifest); i dettagli senza fonte sono omessi (il kit ricade
 * sui valori neutri). Il manga è in bianco e nero: i colori vengono da profili testuali secondari
 * (needs_verification, vedi ledger). Chiave = id senza `char-fma-`.
 */
export const fmaAppearance: Record<string, CharacterAppearance> = {
  // --- Protagonisti ---
  'edward-elric': a('gold', 'ponytail', {
    eyes: 'gold',
    face: fc('male sharp'),
    clothes: 'jacket',
    outfit: '#22232b',
  }),
  // Armatura vuota: elmo generico (hairFront/hairBack), interno scuro, nessun volto.
  'alphonse-elric': a('gray', 'short', {
    skin: HOLLOW,
    face: fc('male hidden none neutral none'),
    clothes: 'armor',
    outfit: STEEL,
    outfit2: '#6b6f7a',
    hairFront: AL_HELM_FRONT,
    hairBack: AL_HELM_BACK,
    hairDetail: AL_HELM_DETAIL,
  }),
  'winry-rockbell': a('blond', undefined, { eyes: 'blue', face: fc('female') }),
  'van-hohenheim': a('blond', 'ponytail', { marks: ['beard'], face: fc('male') }),

  // --- Militari ---
  'roy-mustang': a('black', 'short', { eyes: 'black', clothes: 'uniform', face: fc('male') }),
  'riza-hawkeye': a('blond', undefined, { eyes: 'auburn', clothes: 'uniform', face: fc('female') }),
  'maes-hughes': a('black', undefined, { eyes: 'lime', clothes: 'uniform', face: fc('male') }),
  'alex-louis-armstrong': a('blond', 'bald', {
    eyes: 'blue',
    clothes: 'shirtless',
    marks: ['center_strand', 'big_mustache'],
    face: fc('male'),
  }),
  'olivier-mira-armstrong': a('blond', 'long', { eyes: 'blue', clothes: 'uniform', face: fc('female') }),
  'solf-j-kimblee': a('black', undefined, { eyes: 'gold', clothes: 'uniform', face: fc('male') }),
  'king-bradley': a('black', undefined, { eyes: 'teal', clothes: 'uniform', marks: ['eyepatch'], face: fc('male') }),

  // --- Altri alchimisti ---
  'izumi-curtis': a('black', undefined, { eyes: 'navy', face: fc('female') }),
  scar: a('white', undefined, { eyes: 'red', marks: ['scar_x_forehead'], face: fc('male') }),

  // --- Xing ---
  'ling-yao': a('black', 'ponytail', { eyes: 'black', face: fc('male narrow') }),
  'lan-fan': a('black', undefined, { eyes: 'black', face: fc('female') }),
  'may-chang': a('black', undefined, { eyes: 'black', face: fc('female') }),

  // --- Homunculus ---
  // Forma originale «simile a un ciclope»; calvo = approssimazione di una creatura senza capelli descritti.
  father: a(undefined, 'bald', { marks: ['cyclops'], face: fc('round none none neutral none') }),
  // Forma d'ombra con più occhi: pelle nera piatta + occhi supplementari.
  pride: a('black', 'bald', { skin: '#16151c', marks: ['extra_eyes'], face: fc('round round none neutral none') }),
  lust: a('black', undefined, { eyes: 'violet', face: fc('female') }),
  gluttony: a(undefined, 'bald', { face: fc('round small none neutral none') }),
  envy: a('green', undefined, { eyes: 'violet', face: fc('male') }),
  greed: a('black', undefined, { eyes: '#b565a7', face: fc('male') }),
  sloth: a(undefined, undefined, { face: fc('male') }),

  // --- Film «La Stella Sacra di Milos» ---
  'julia-crichton': a(undefined, undefined, { face: fc('female') }),
  'ashleigh-crichton': a(undefined, undefined, {
    clothes: 'uniform',
    accent: '#f1f1f1',
    marks: ['mask_lower'],
    face: fc('male'),
  }),
  'melvin-voyager': a(undefined, undefined, { face: fc('male') }),
};
