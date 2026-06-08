import type { Character, CharacterImportance, CharacterStatus } from '@/types';

/**
 * Cappello di Paglia Grand Fleet — la grande flotta di sette ciurme alleate nata
 * a Dressrosa dopo la caduta di Doflamingo, che ha giurato fedeltà a Rufy. Qui i
 * capitani e i membri di spicco non ancora presenti (Cavendish, Bartolomeo, Leo e
 * Hajrudin sono già nel dataset). Tutti nascono agganciati alla tela: fazione,
 * arco, eventi, alleati, nemici, parenti e relazioni.
 */
interface Seed {
  id: string;
  name: string;
  aliases?: string[];
  importance: CharacterImportance;
  role: string[];
  gender: string;
  status: CharacterStatus;
  factionIds?: string[];
  locationIds?: string[];
  arcIds?: string[];
  eventIds?: string[];
  allies?: string[];
  enemies?: string[];
  family?: string[];
  relationships?: { targetCharacterId: string; label: string }[];
  fm?: string;
  fa?: string;
  it: string;
  en: string;
  lit: string;
  len: string;
  tags: string[];
}

const C = (s: Seed): Character => ({
  id: s.id,
  worldId: 'world-onepiece',
  name: s.name,
  ...(s.aliases ? { aliases: s.aliases } : {}),
  importance: s.importance,
  role: s.role,
  gender: s.gender,
  ...(s.factionIds ? { factionIds: s.factionIds } : {}),
  ...(s.locationIds ? { locationIds: s.locationIds } : {}),
  ...(s.arcIds ? { arcIds: s.arcIds } : {}),
  ...(s.eventIds ? { eventIds: s.eventIds } : {}),
  ...(s.allies ? { allies: s.allies } : {}),
  ...(s.enemies ? { enemies: s.enemies } : {}),
  ...(s.family ? { family: s.family } : {}),
  ...(s.relationships ? { relationships: s.relationships } : {}),
  ...(s.fm ? { firstMangaAppearance: s.fm } : {}),
  ...(s.fa ? { firstAnimeAppearance: s.fa } : {}),
  shortDescription: { it: s.it, en: s.en },
  longDescription: { it: s.lit, en: s.len },
  status: s.status,
  canonStatus: 'canon',
  referenceStatus: 'verified',
  tags: s.tags,
});

const GF = 'faction-op-straw-hat-grand-fleet';
const CAPTAINS = ['char-op-cavendish', 'char-op-bartolomeo', 'char-op-sai', 'char-op-leo', 'char-op-ideo', 'char-op-hajrudin', 'char-op-orlumbus'];
const others = (id: string) => CAPTAINS.filter((c) => c !== id);

export const onepieceCharactersGrandFleet: Character[] = [
  /* ---------------------- 3ª divisione · Happo Navy ---------------------- */
  C({
    id: 'char-op-sai', name: 'Sai', importance: 'minor', role: ['ally'], gender: 'male', status: 'alive',
    factionIds: [GF], locationIds: ['loc-op-dressrosa'],
    arcIds: ['arc-op-dressrosa'], eventIds: ['evt-op-dr-colosseum', 'evt-op-doflamingo-defeat'],
    allies: ['char-op-luffy', ...others('char-op-sai')], enemies: ['char-op-doflamingo', 'char-op-baby-5'],
    family: ['char-op-chinjao'],
    relationships: [
      { targetCharacterId: 'char-op-chinjao', label: 'Nonno' },
      { targetCharacterId: 'char-op-baby-5', label: 'Promessa sposa' },
      { targetCharacterId: 'char-op-luffy', label: 'Giurò fedeltà alla Grand Fleet' },
    ],
    fm: '719', fa: '649',
    it: "Tredicesimo capo della Happo Navy e nipote di Chinjao, maestro dell'arte marziale Hasshoken; 3ª divisione della Grand Fleet.",
    en: "The thirteenth leader of the Happo Navy and Chinjao's grandson, a master of the Hasshoken martial art; 3rd division of the Grand Fleet.",
    lit: "Sai, giovane e onesto erede della Happo Navy, combatté nel torneo di Dressrosa e contro i Donquijote; finì fidanzato controvoglia a Baby 5, e giurò fedeltà a Rufy guidando la 3ª flotta del Grand Fleet.",
    len: "Sai, the young and upright heir of the Happo Navy, fought in the Dressrosa tournament and against the Donquixote; he ended up reluctantly engaged to Baby 5, and pledged loyalty to Luffy leading the Grand Fleet's 3rd division.",
    tags: ['grand-fleet', 'dressrosa', 'happo-navy'],
  }),
  C({
    id: 'char-op-chinjao', name: 'Chinjao', aliases: ['Don Chinjao', 'Chinjao il Trapano'], importance: 'minor', role: ['neutral'], gender: 'male', status: 'alive',
    factionIds: [GF], locationIds: ['loc-op-dressrosa'],
    arcIds: ['arc-op-dressrosa'], eventIds: ['evt-op-dr-colosseum'],
    allies: ['char-op-luffy', 'char-op-sai'], enemies: ['char-op-garp', 'char-op-doflamingo'],
    family: ['char-op-sai'],
    relationships: [
      { targetCharacterId: 'char-op-garp', label: 'Gli spezzò la testa-trapano' },
      { targetCharacterId: 'char-op-sai', label: 'Nipote ed erede' },
      { targetCharacterId: 'char-op-luffy', label: 'Erede della volontà di Garp' },
    ],
    fm: '716', fa: '649',
    it: "Leggendario ex pirata dalla testa a trapano, nonno di Sai, un tempo terrore dei mari con una taglia da 500 milioni.",
    en: "A legendary former pirate with a drill-shaped head, Sai's grandfather, once a terror of the seas with a 500-million bounty.",
    lit: "Chinjao «il Trapano», che da giovane sfidò persino Garp — il quale gli appiattì il cranio a trapano con un pugno — guidò la Happo Navy; affrontò Rufy al Colosseo e ne riconobbe la volontà ereditata dal vecchio rivale.",
    len: "Chinjao 'the Drill', who in his youth challenged even Garp — who flattened his drill-skull with a punch — led the Happo Navy; he faced Luffy at the Colosseum and recognized in him the will inherited from his old rival.",
    tags: ['grand-fleet', 'dressrosa', 'happo-navy', 'leggenda'],
  }),

  /* ---------------------- 4ª divisione · gruppo di Ideo ---------------------- */
  C({
    id: 'char-op-ideo', name: 'Ideo', importance: 'minor', role: ['ally'], gender: 'male', status: 'alive',
    factionIds: [GF], locationIds: ['loc-op-dressrosa'],
    arcIds: ['arc-op-dressrosa'], eventIds: ['evt-op-dr-colosseum', 'evt-op-doflamingo-defeat'],
    allies: ['char-op-luffy', 'char-op-blue-gilly', 'char-op-suleiman', ...others('char-op-ideo')], enemies: ['char-op-doflamingo'],
    relationships: [{ targetCharacterId: 'char-op-luffy', label: 'Giurò fedeltà alla Grand Fleet' }],
    fm: '719', fa: '649',
    it: "Pugile della tribù dalle braccia lunghe, capo della 4ª divisione della Grand Fleet con pugni dalla potenza esplosiva.",
    en: "A long-arm-tribe boxer, leader of the Grand Fleet's 4th division with explosively powerful punches.",
    lit: "Ideo, campione di arti marziali della tribù Longarm, combatté nel torneo di Dressrosa; unitosi alla rivolta contro Doflamingo, giurò fedeltà a Rufy a capo della propria divisione insieme a Blue Gilly e Suleiman.",
    len: "Ideo, a Longarm-tribe martial-arts champion, fought in the Dressrosa tournament; joining the revolt against Doflamingo, he pledged loyalty to Luffy at the head of his own division alongside Blue Gilly and Suleiman.",
    tags: ['grand-fleet', 'dressrosa'],
  }),
  C({
    id: 'char-op-blue-gilly', name: 'Blue Gilly', importance: 'background', role: ['ally'], gender: 'male', status: 'alive',
    factionIds: [GF], locationIds: ['loc-op-dressrosa'],
    arcIds: ['arc-op-dressrosa'], eventIds: ['evt-op-dr-colosseum'],
    allies: ['char-op-luffy', 'char-op-ideo', 'char-op-suleiman'], enemies: ['char-op-doflamingo'],
    relationships: [{ targetCharacterId: 'char-op-ideo', label: 'Capo di divisione' }],
    fm: '714', fa: '649',
    it: "Maestro di arti marziali della tribù dalle gambe lunghe, combattente del Jiao-style nella 4ª divisione.",
    en: "A long-leg-tribe martial artist, a Jiao-style fighter in the 4th division.",
    lit: "Blue Gilly, abile lottatore di calci della tribù Longleg, partecipò al Colosseo di Dressrosa e si unì alla flotta di Ideo nel Grand Fleet di Rufy.",
    len: "Blue Gilly, a skilled kick-fighter of the Longleg tribe, took part in the Dressrosa Colosseum and joined Ideo's division in Luffy's Grand Fleet.",
    tags: ['grand-fleet', 'dressrosa'],
  }),
  C({
    id: 'char-op-suleiman', name: 'Suleiman', importance: 'background', role: ['ally'], gender: 'male', status: 'alive',
    factionIds: [GF], locationIds: ['loc-op-dressrosa'],
    arcIds: ['arc-op-dressrosa'], eventIds: ['evt-op-dr-colosseum'],
    allies: ['char-op-luffy', 'char-op-ideo', 'char-op-blue-gilly'], enemies: ['char-op-doflamingo'],
    relationships: [{ targetCharacterId: 'char-op-ideo', label: 'Capo di divisione' }],
    fm: '714', fa: '649',
    it: "Assassino dal volto cucito, abile spadaccino della 4ª divisione della Grand Fleet.",
    en: "A stitched-faced assassin and skilled swordsman of the Grand Fleet's 4th division.",
    lit: "Suleiman «il Decapitatore», temuto assassino con una taglia, lottò a Dressrosa e si schierò con Ideo nella flotta alleata di Rufy contro il regime di Doflamingo.",
    len: "Suleiman 'the Beheader', a feared bountied assassin, fought in Dressrosa and sided with Ideo in Luffy's allied fleet against Doflamingo's regime.",
    tags: ['grand-fleet', 'dressrosa'],
  }),

  /* ---------------------- 2ª divisione · Barto Club ---------------------- */
  C({
    id: 'char-op-gambia', name: 'Gambia', importance: 'background', role: ['ally'], gender: 'male', status: 'alive',
    factionIds: [GF], locationIds: ['loc-op-dressrosa'],
    arcIds: ['arc-op-dressrosa'], eventIds: ['evt-op-doflamingo-defeat'],
    allies: ['char-op-luffy', 'char-op-bartolomeo', 'char-op-cavendish'],
    relationships: [{ targetCharacterId: 'char-op-bartolomeo', label: 'Capitano (Barto Club)' }],
    fm: '795', fa: '736',
    it: "Braccio destro di Bartolomeo nel Barto Club, la ciurma di fan sfegatati di Rufy, 2ª divisione della Grand Fleet.",
    en: "Bartolomeo's right hand in the Barto Club, Luffy's diehard-fan crew, 2nd division of the Grand Fleet.",
    lit: "Gambia, energico vicecomandante del Barto Club, condivide con Bartolomeo la sconfinata ammirazione per i Cappello di Paglia e combatté per coprire la fuga dell'alleanza da Dressrosa.",
    len: "Gambia, the energetic second-in-command of the Barto Club, shares with Bartolomeo a boundless admiration for the Straw Hats and fought to cover the alliance's escape from Dressrosa.",
    tags: ['grand-fleet', 'dressrosa', 'barto-club'],
  }),

  /* ---------------------- 7ª divisione · Yonta Maria Grand Fleet ---------------------- */
  C({
    id: 'char-op-orlumbus', name: 'Orlumbus', aliases: ['Orlumbus il Vagabondo'], importance: 'minor', role: ['ally'], gender: 'male', status: 'alive',
    factionIds: [GF], locationIds: ['loc-op-dressrosa'],
    arcIds: ['arc-op-dressrosa'], eventIds: ['evt-op-dr-colosseum', 'evt-op-doflamingo-defeat'],
    allies: ['char-op-luffy', ...others('char-op-orlumbus')], enemies: ['char-op-doflamingo'],
    relationships: [{ targetCharacterId: 'char-op-luffy', label: 'Giurò fedeltà alla Grand Fleet' }],
    fm: '719', fa: '649',
    it: "Ex nobile esploratore e ammiraglio della flotta Yonta Maria, capo della 7ª e più numerosa divisione della Grand Fleet.",
    en: "A former noble explorer and admiral of the Yonta Maria fleet, leader of the Grand Fleet's 7th and largest division.",
    lit: "Orlumbus, gigantesco avventuriero a capo di 4.300 uomini e 56 navi, lasciò la vita da nobile per esplorare il mondo; conquistato da Rufy, mise la sua immensa flotta al servizio del Grand Fleet.",
    len: "Orlumbus, a giant adventurer commanding 4,300 men and 56 ships, left his noble life to explore the world; won over by Luffy, he placed his vast fleet at the Grand Fleet's service.",
    tags: ['grand-fleet', 'dressrosa', 'yonta-maria'],
  }),
];
