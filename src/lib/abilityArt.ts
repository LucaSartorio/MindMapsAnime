import type { Jutsu } from '@/types';
import { getWorldPlaceholderStyle, type AbilityMotif } from '@/lib/worldPlaceholders';

/**
 * Immagini delle tecniche guidate dai DATI.
 *
 * Il placeholder di una tecnica non è più lo stesso simbolo per tutto il mondo
 * (ogni Frutto del Diavolo identico, ogni jutsu la stessa spirale): combina
 *  - una **forma** scelta dalla categoria della tecnica (`type`, poi
 *    `chakraNature` / `classification`): Paramecia, Zoan e Logia hanno tre frutti
 *    diversi, il taijutsu un pugno, il dōjutsu un occhio, la categoria Nen il suo
 *    vertice dell'esagono…;
 *  - un **elemento** (fuoco, ghiaccio, fulmine, ombra…) letto da natura, tipo e
 *    tag, disegnato come glifo e usato per la tinta di fondo.
 *
 * Tutto è un registro di id → forma/elemento: nessun mondo è cablato nei
 * componenti. Un id sconosciuto ricade sul motivo del mondo
 * (`WorldPlaceholderStyle.ability`), quindi un'opera nuova funziona senza
 * modifiche e ne guadagna appena i suoi `type`/tag coincidono con quelli noti.
 */

/** Sagoma della tecnica (comprende i motivi-base dei mondi). */
export type AbilityForm =
  | AbilityMotif
  | 'fruit_beast'
  | 'fruit_elemental'
  | 'fist'
  | 'eye'
  | 'seal'
  | 'scroll'
  | 'illusion'
  | 'beast'
  | 'heal'
  | 'bow'
  | 'mask'
  | 'transformation'
  | 'item'
  | 'domain'
  | 'divine'
  | 'movement'
  | 'fusion'
  | 'aura'
  | 'crown';

/** Elemento/attributo della tecnica, disegnato come glifo. */
export type AbilityElement =
  | 'fire'
  | 'water'
  | 'ice'
  | 'lightning'
  | 'wind'
  | 'earth'
  | 'plant'
  | 'sand'
  | 'magma'
  | 'light'
  | 'dark'
  | 'smoke'
  | 'poison'
  | 'metal'
  | 'crystal'
  | 'gravity'
  | 'space'
  | 'time'
  | 'blood'
  | 'bone'
  | 'soul'
  | 'sound'
  | 'thread'
  | 'star'
  | 'explosion'
  | 'yin'
  | 'yang'
  | 'yin_yang'
  | 'magnet'
  | 'void';

/**
 * Categoria → forma, valida per OGNI mondo: id generici che più opere
 * condividono (un `transformation` o un `item` restano tali ovunque).
 */
const COMMON_FORMS: Record<string, AbilityForm> = {
  // Corpo a corpo
  taijutsu: 'fist',
  martial_art: 'fist',
  hakuda: 'fist',
  ackerman: 'fist',
  heavenly_restriction: 'fist',
  // Occhi
  doujutsu: 'eye',
  dojutsu: 'eye',
  // Sigilli e barriere
  fuinjutsu: 'seal',
  seal: 'seal',
  sealing: 'seal',
  barrier: 'seal',
  kido: 'seal',
  forbidden_magic: 'seal',
  // Tecniche segrete di clan
  hiden: 'scroll',
  // Illusioni
  genjutsu: 'illusion',
  // Creature evocate / bestie
  tailed_beast: 'beast',
  summoning: 'beast',
  shikigami: 'beast',
  // Cura e supporto
  ijutsu: 'heal',
  medical: 'heal',
  support: 'heal',
  // Armi
  kenjutsu: 'slash',
  weapon: 'slash',
  cursed_tool: 'slash',
  zanpakuto: 'slash',
  // Trasformazioni
  transformation: 'transformation',
  titan_power: 'transformation',
  nine_titans: 'transformation',
  // Oggetti
  item: 'item',
  equipment: 'item',
  artifact: 'item',
  cursed_object: 'item',
  fullbring: 'item',
  science: 'item',
  // Spazio proprio
  domain: 'domain',
  // Sacro / natura
  divine: 'divine',
  senjutsu: 'divine',
  ultimate_magic: 'divine',
  // Velocità
  movement: 'movement',
  hoho: 'movement',
  // Fusione
  fusion: 'fusion',
  // Aura / potenziamento
  power_up: 'aura',
  haki: 'aura',
  spiritual: 'aura',
  fundamental: 'aura',
  spirit_magic: 'aura',
  ki_technique: 'aura',
  // Lignaggio
  royal_blood: 'crown',
};

/** Categorie che hanno senso solo in un mondo (o che lì cambiano significato). */
const WORLD_FORMS: Record<string, Record<string, AbilityForm>> = {
  naruto: { ninjutsu: 'chakra' },
  onepiece: {
    paramecia: 'devilfruit',
    zoan: 'fruit_beast',
    logia: 'fruit_elemental',
  },
  dragonball: { energy_blast: 'ki' },
  hunterxhunter: {
    nen: 'nen',
    enhancement: 'nen',
    transmutation: 'nen',
    emission: 'nen',
    conjuration: 'nen',
    manipulation: 'nen',
    specialization: 'nen',
  },
  blackclover: {
    attribute_magic: 'magic_circle',
    creation_magic: 'magic_circle',
    composite_magic: 'magic_circle',
    arcane_stage: 'magic_circle',
    devil_magic: 'curse',
    curse_magic: 'curse',
    ki: 'aura',
  },
  bleach: { quincy: 'bow', hollow: 'mask' },
  jujutsukaisen: { innate: 'curse', extension: 'curse' },
};

/**
 * Le sei categorie Nen nell'ordine dell'esagono (dall'alto, in senso orario):
 * la forma `nen` accende il vertice della categoria.
 */
export const NEN_HEXAGON = [
  'enhancement',
  'transmutation',
  'conjuration',
  'specialization',
  'manipulation',
  'emission',
] as const;

/**
 * Parola chiave → elemento. Chiavi in minuscolo: id di natura/tipo (inglesi) e
 * tag dei dataset (spesso italiani). Le chiavi sono confrontate per intero, mai
 * per sottostringa, così un tag come `fuoco-fatuo` non diventa per caso fuoco.
 */
const ELEMENT_KEYWORDS: Record<string, AbilityElement> = {
  fire: 'fire', fuoco: 'fire', scorch: 'fire', flame: 'fire', fiamma: 'fire', ash: 'smoke',
  water: 'water', acqua: 'water', gel: 'water', boil: 'smoke', vapore: 'smoke',
  ice: 'ice', ghiaccio: 'ice', snow: 'ice', neve: 'ice', gelo: 'ice',
  lightning: 'lightning', fulmine: 'lightning', elettricità: 'lightning', elettricita: 'lightning',
  storm: 'lightning', tempesta: 'lightning',
  wind: 'wind', vento: 'wind', vortex: 'wind', swift: 'wind',
  earth: 'earth', terra: 'earth', swamp: 'earth', palude: 'earth', terremoto: 'earth',
  wood: 'plant', mokuton: 'plant', plant: 'plant', cherry_blossom: 'plant', briar: 'plant',
  world_tree: 'plant', piante: 'plant',
  sand: 'sand', sabbia: 'sand',
  lava: 'magma', magma: 'magma',
  light: 'light', luce: 'light',
  dark: 'dark', tenebra: 'dark', oscurità: 'dark', shadow: 'dark', ombra: 'dark',
  smoke: 'smoke', fumo: 'smoke', mist: 'smoke', nebbia: 'smoke', gas: 'smoke',
  poison: 'poison', veleno: 'poison',
  steel: 'metal', mercury: 'metal', bronze: 'metal', sword: 'metal', acciaio: 'metal',
  crystal: 'crystal', cristallo: 'crystal', glass: 'crystal', mirror: 'crystal',
  gravity: 'gravity', gravità: 'gravity',
  spatial: 'space', 'space-time': 'space', space_time: 'space', 'spazio-tempo': 'space',
  time: 'time', tempo: 'time',
  blood: 'blood', sangue: 'blood',
  bone: 'bone', ossa: 'bone',
  soul: 'soul', anima: 'soul', word_soul: 'soul', fantasmi: 'soul',
  song: 'sound', suono: 'sound', dance: 'sound',
  thread: 'thread', fili: 'thread', filo: 'thread', chain: 'thread', catene: 'thread',
  star: 'star', stelle: 'star',
  explosion: 'explosion', esplosione: 'explosion',
  yin: 'yin',
  yang: 'yang',
  yin_yang: 'yin_yang',
  magnet: 'magnet', magnetismo: 'magnet',
  anti_magic: 'void', 'anti-magia': 'void', mana_absorption: 'void',
};

/** Tinta di fondo per elemento (quando il mondo non ne dichiara una propria). */
export const ELEMENT_COLORS: Record<AbilityElement, string> = {
  fire: '#e0603a',
  water: '#3a8fe0',
  ice: '#7cc4dc',
  lightning: '#d9b23a',
  wind: '#62b884',
  earth: '#a5814f',
  plant: '#4f9a58',
  sand: '#c9ad62',
  magma: '#c9512a',
  light: '#e0b94a',
  dark: '#4c4a66',
  smoke: '#8a8f9c',
  poison: '#8a5ac0',
  metal: '#8c95a3',
  crystal: '#6fc0cf',
  gravity: '#6a5ab0',
  space: '#5a5fc0',
  time: '#b08a4a',
  blood: '#b0303e',
  bone: '#b5aa90',
  soul: '#7a8ad0',
  sound: '#c06a9a',
  thread: '#b07ac0',
  star: '#4a68b8',
  explosion: '#e05050',
  yin: '#6b5b95',
  yang: '#e0a13a',
  yin_yang: '#a07ac0',
  magnet: '#9a8ab0',
  void: '#3c3c48',
};

export interface AbilityArt {
  form: AbilityForm;
  element?: AbilityElement;
  /** Solo per la forma `nen`: indice del vertice da accendere (0–5). */
  nenIndex?: number;
}

type AbilityArtInput = Pick<Jutsu, 'type' | 'chakraNature' | 'classification' | 'tags'>;

function norm(v: string): string {
  return v.trim().toLowerCase();
}

/**
 * Forma + elemento di una tecnica. Puro e deterministico (stesso risultato in
 * pre-render e nel browser). Ordine di lettura: `type` → `chakraNature` →
 * `classification` (forma) e `chakraNature` → `type` → `tags` (elemento).
 */
export function resolveAbilityArt(
  slug: string | null | undefined,
  ability: AbilityArtInput,
): AbilityArt {
  const worldForms = (slug && WORLD_FORMS[slug]) || undefined;
  const type = norm(ability.type);
  const natures = (ability.chakraNature ?? []).map(norm);
  const classes = (ability.classification ?? []).map(norm);

  let form: AbilityForm | undefined;
  for (const key of [type, ...natures, ...classes]) {
    form = worldForms?.[key] ?? COMMON_FORMS[key];
    if (form) break;
  }
  form ??= getWorldPlaceholderStyle(slug).ability;

  let element: AbilityElement | undefined;
  for (const key of [...natures, type, ...(ability.tags ?? []).map(norm)]) {
    element = ELEMENT_KEYWORDS[key];
    if (element) break;
  }

  const nenIndex =
    form === 'nen' ? (NEN_HEXAGON as readonly string[]).indexOf(type) : -1;

  return { form, element, ...(nenIndex >= 0 ? { nenIndex } : {}) };
}
