import { findWorldBySlug } from '@/data/worlds';
import {
  CHAKRA_COLORS,
  CLAN_COLORS,
  VILLAGE_COLORS,
  jitterColor,
  type EntityImageKind,
} from '@/utils/entityImage';

/**
 * Placeholder per-mondo: ogni opera ha i suoi simboli.
 *
 * I placeholder SVG generati (quando non esiste un'immagine drop-in) erano
 * disegnati sui codici visivi di Naruto — fascia ninja sui personaggi, spirale
 * di chakra sulle tecniche — e finivano identici su TUTTI i mondi. Qui ogni
 * mondo dichiara i propri motivi; i colori sono derivati dal `theme` del mondo
 * (`primary/accent/highlight` in `src/data/worlds.ts`), quindi restano coerenti
 * con l'opera senza duplicare palette.
 *
 * È un registro, non logica nei componenti: un mondo non elencato ricade sul set
 * neutro (`DEFAULT_STYLE`) e resta comunque a tema grazie alla sua palette — così
 * aggiungere un'opera non richiede modifiche ai componenti.
 */

/** Copricapo/segno distintivo del ritratto di un personaggio. */
export type CharacterMotif =
  | 'plain'
  | 'headband'
  | 'strawhat'
  | 'spiky'
  | 'aura'
  | 'grimoire'
  | 'hood'
  | 'blade'
  | 'transmutation'
  | 'elf'
  | 'chef'
  | 'guildmark'
  | 'blindfold'
  | 'haori';

/** Simbolo del sistema di poteri (jutsu / nen / frutti / magia…). */
export type AbilityMotif =
  | 'spark'
  | 'chakra'
  | 'devilfruit'
  | 'ki'
  | 'nen'
  | 'magic_circle'
  | 'slash'
  | 'curse'
  | 'gourmet';

/** Stemma di clan / ciurma / squadra / gilda. */
export type EmblemMotif =
  | 'shield'
  | 'jolly'
  | 'orb_stars'
  | 'badge'
  | 'banner'
  | 'wings'
  | 'flame'
  | 'crest_star';

/** Da quale slot del `theme` del mondo prendere la tinta di fondo. */
type ThemeSlot = 'primary' | 'accent' | 'highlight';

export interface WorldPlaceholderStyle {
  character: CharacterMotif;
  ability: AbilityMotif;
  emblem: EmblemMotif;
  /**
   * Colore "firma" dell'opera, usato DENTRO i motivi per l'elemento iconico
   * (la paglia del cappello, i raggi del ki, l'aura Nen, il quadrifoglio…).
   * Il fondo resta variato per entità: così i simboli restano riconoscibili.
   */
  ink: string;
  /** Override della tinta di fondo per tipo di scheda (default: `DEFAULT_TINT`). */
  tint?: Partial<Record<EntityImageKind, ThemeSlot>>;
}

/** Tipo di scheda → slot del tema, quando il mondo non specifica altro. */
const DEFAULT_TINT: Record<EntityImageKind, ThemeSlot> = {
  character: 'primary',
  jutsu: 'accent',
  clan: 'highlight',
  location: 'primary',
  arc: 'accent',
};

/** Mondo sconosciuto/futuro: forme neutre, colori comunque dal suo tema. */
const DEFAULT_STYLE: WorldPlaceholderStyle = {
  character: 'plain',
  ability: 'spark',
  emblem: 'shield',
  ink: '#e6ebf5',
};

const WORLD_STYLES: Record<string, WorldPlaceholderStyle> = {
  // ---------------------------- Disponibili ----------------------------
  naruto: {
    character: 'headband',
    ability: 'chakra',
    emblem: 'shield',
    ink: '#cfd8e3', // metallo del protettore frontale
  },
  onepiece: {
    character: 'strawhat',
    ability: 'devilfruit',
    emblem: 'jolly',
    ink: '#f2c14e', // paglia / oro
    // Frutto scuro su mare blu; Jolly Roger bianco su rosso.
    tint: { jutsu: 'highlight', clan: 'primary' },
  },
  dragonball: {
    character: 'spiky',
    ability: 'ki',
    emblem: 'orb_stars',
    ink: '#f5a01f', // arancio del ki e della sfera
    tint: { clan: 'accent' },
  },
  hunterxhunter: {
    character: 'aura',
    ability: 'nen',
    emblem: 'badge',
    ink: '#7fe3d4', // aura Nen
  },
  blackclover: {
    character: 'grimoire',
    ability: 'magic_circle',
    emblem: 'banner',
    ink: '#e8c96a', // oro del grimorio / quadrifoglio
    // Cerchio magico dorato su viola; stendardo su verde.
    tint: { jutsu: 'highlight', clan: 'primary' },
  },
  // -------------- In arrivo (pronti al lancio del dataset) --------------
  attackontitan: {
    character: 'hood',
    ability: 'slash',
    emblem: 'wings',
    ink: '#c8a15a',
  },
  bleach: {
    character: 'blade',
    ability: 'slash',
    emblem: 'crest_star',
    ink: '#dfe6ee',
  },
  fullmetalalchemist: {
    character: 'transmutation',
    ability: 'magic_circle',
    emblem: 'shield',
    ink: '#d4af37',
  },
  frieren: {
    character: 'elf',
    ability: 'magic_circle',
    emblem: 'crest_star',
    ink: '#f0e6d2',
  },
  toriko: {
    character: 'chef',
    ability: 'gourmet',
    emblem: 'shield',
    ink: '#f2a413',
  },
  fairytail: {
    character: 'guildmark',
    ability: 'magic_circle',
    emblem: 'flame',
    ink: '#f5b21a',
  },
  jujutsukaisen: {
    character: 'blindfold',
    ability: 'curse',
    emblem: 'crest_star',
    ink: '#b39ddb',
  },
  demonslayer: {
    character: 'haori',
    ability: 'slash',
    emblem: 'crest_star',
    ink: '#e8b647',
  },
};

export function getWorldPlaceholderStyle(
  slug: string | null | undefined,
): WorldPlaceholderStyle {
  return (slug && WORLD_STYLES[slug]) || DEFAULT_STYLE;
}

/** Palette neutra quando non c'è un mondo attivo (es. fuori da una rotta mondo). */
const NEUTRAL_THEME = {
  primary: '#4c7dd9',
  accent: '#c9843a',
  highlight: '#8a6fd0',
};

/**
 * Colori per-entità specifici di un mondo (chiave = id entità o attributo).
 *
 * Restano SCOPATI al mondo che li possiede: le nature del chakra, i villaggi e i
 * clan sono codici di Naruto e non devono tingere altre opere — Dragon Ball, per
 * dire, riusa attributi omonimi (`wind`, `water`) con tutt'altro significato.
 */
const WORLD_ENTITY_COLORS: Record<string, Record<string, string>> = {
  naruto: { ...CHAKRA_COLORS, ...VILLAGE_COLORS, ...CLAN_COLORS },
};

/**
 * Colore base di un'entità: ancorato alla palette del MONDO (così ogni opera ha
 * la sua tinta) e differenziato per tipo di scheda, poi variato per id in modo
 * deterministico — entità diverse restano distinguibili senza uscire dal tema.
 *
 * `hint` è l'attributo che il mondo usa per colorare (natura del chakra per una
 * tecnica, villaggio per un personaggio): vale solo se quel mondo lo dichiara.
 */
export function getWorldEntityColor(
  slug: string | null | undefined,
  kind: EntityImageKind,
  id: string,
  hint?: string,
): string {
  const overrides = (slug && WORLD_ENTITY_COLORS[slug]) || undefined;
  const known = overrides?.[id] || (hint ? overrides?.[hint] : undefined);
  if (known) return known;

  const theme = (slug && findWorldBySlug(slug)?.theme) || NEUTRAL_THEME;
  const slot = getWorldPlaceholderStyle(slug).tint?.[kind] ?? DEFAULT_TINT[kind];
  const anchor = theme[slot] || NEUTRAL_THEME.primary;
  return jitterColor(anchor, id);
}

/** Colore "firma" dell'opera per gli elementi iconici dei motivi. */
export function getWorldInk(slug: string | null | undefined): string {
  return getWorldPlaceholderStyle(slug).ink;
}
