import type { Character, CharacterRelationship } from '@/types';

/**
 * «Tela di ragno» del dataset One Piece.
 *
 * Le ondate di personaggi minori (Extra5–7, film) sono state definite con i soli
 * dati anagrafici; qui si aggiungono — in modo centralizzato — i collegamenti
 * narrativi (archi, eventi, alleati, nemici, parenti, relazioni) che li intrecciano
 * al resto del mondo. Il merge è additivo: unisce gli array senza sovrascrivere
 * quanto già dichiarato nei file di definizione. Tutti gli id referenziati esistono
 * nel dataset (verificato da `validate:data`).
 */
type Rel = CharacterRelationship;
interface LinkPatch {
  factionIds?: string[];
  locationIds?: string[];
  arcIds?: string[];
  eventIds?: string[];
  allies?: string[];
  enemies?: string[];
  family?: string[];
  teachers?: string[];
  students?: string[];
  relationships?: Rel[];
}

const L = (
  arcIds?: string[], eventIds?: string[], allies?: string[], enemies?: string[],
  family?: string[], relationships?: Rel[],
): LinkPatch => ({
  ...(arcIds ? { arcIds } : {}),
  ...(eventIds ? { eventIds } : {}),
  ...(allies ? { allies } : {}),
  ...(enemies ? { enemies } : {}),
  ...(family ? { family } : {}),
  ...(relationships ? { relationships } : {}),
});

/** I dieci Cappello di Paglia: la ciurma. Usata per generare la mesh di alleanze. */
const CREW = [
  'char-op-luffy', 'char-op-zoro', 'char-op-nami', 'char-op-usopp', 'char-op-sanji',
  'char-op-chopper', 'char-op-robin', 'char-op-franky', 'char-op-brook', 'char-op-jinbe',
];
/** Compagni di ciurma di un dato membro (tutti gli altri nove). */
const mates = (id: string) => CREW.filter((c) => c !== id);

export const onepieceCharacterLinks: Record<string, LinkPatch> = {
  /* ===================== Ciurma di Cappello di Paglia (mesh completa) ===================== */
  'char-op-luffy': L(
    undefined, undefined, mates('char-op-luffy'),
    ['char-op-crocodile', 'char-op-enel', 'char-op-lucci', 'char-op-doflamingo', 'char-op-kaido', 'char-op-big-mom', 'char-op-blackbeard', 'char-op-akainu'],
    ['char-op-ace', 'char-op-sabo', 'char-op-garp', 'char-op-dragon'],
    [
      { targetCharacterId: 'char-op-shanks', label: { it: 'Gli donò il cappello di paglia', en: 'Gave him the straw hat' } },
      { targetCharacterId: 'char-op-rayleigh', label: { it: "Maestro dell'Ambizione", en: 'Haki master' } },
      { targetCharacterId: 'char-op-ace', label: { it: 'Fratello giurato', en: 'Sworn brother' } },
      { targetCharacterId: 'char-op-sabo', label: { it: 'Fratello giurato', en: 'Sworn brother' } },
      { targetCharacterId: 'char-op-zoro', label: { it: 'Vicecapitano / spadaccino', en: 'Vice-captain / swordsman' } },
      { targetCharacterId: 'char-op-sanji', label: { it: 'Cuoco di bordo', en: "Ship's cook" } },
    ],
  ),
  'char-op-zoro': L(
    undefined, undefined, mates('char-op-zoro'), ['char-op-mihawk'], ['char-op-kuina'],
    [
      { targetCharacterId: 'char-op-luffy', label: { it: 'Capitano', en: 'Captain' } },
      { targetCharacterId: 'char-op-mihawk', label: { it: 'Maestro e obiettivo da superare', en: 'Master and goal to surpass' } },
      { targetCharacterId: 'char-op-kuina', label: { it: "Rivale d'infanzia (promessa)", en: 'Childhood rival (promise)' } },
      { targetCharacterId: 'char-op-koushiro', label: { it: 'Maestro di spada', en: 'Sword master' } },
    ],
  ),
  'char-op-nami': L(
    undefined, undefined, [...mates('char-op-nami'), 'char-op-genzo', 'char-op-nojiko'],
    ['char-op-arlong'], ['char-op-nojiko', 'char-op-bellemere'],
    [
      { targetCharacterId: 'char-op-luffy', label: { it: 'Capitano', en: 'Captain' } },
      { targetCharacterId: 'char-op-bellemere', label: { it: 'Madre adottiva', en: 'Adoptive mother' } },
      { targetCharacterId: 'char-op-arlong', label: { it: 'Aguzzino del passato', en: 'Tormentor from the past' } },
    ],
  ),
  'char-op-usopp': L(
    undefined, undefined, [...mates('char-op-usopp'), 'char-op-kaya'],
    undefined, ['char-op-yasopp', 'char-op-banchina'],
    [
      { targetCharacterId: 'char-op-luffy', label: { it: 'Capitano', en: 'Captain' } },
      { targetCharacterId: 'char-op-yasopp', label: { it: 'Padre (cecchino del Rosso)', en: "Father (Red Hair's sniper)" } },
      { targetCharacterId: 'char-op-kaya', label: { it: "Amica d'infanzia", en: 'Childhood friend' } },
    ],
  ),
  'char-op-sanji': L(
    undefined, undefined, mates('char-op-sanji'),
    undefined, ['char-op-judge', 'char-op-reiju', 'char-op-ichiji', 'char-op-niji', 'char-op-yonji'],
    [
      { targetCharacterId: 'char-op-luffy', label: { it: 'Capitano', en: 'Captain' } },
      { targetCharacterId: 'char-op-judge', label: { it: 'Padre (Germa 66)', en: 'Father (Germa 66)' } },
      { targetCharacterId: 'char-op-reiju', label: { it: 'Sorella maggiore', en: 'Older sister' } },
    ],
  ),
  'char-op-chopper': L(
    undefined, undefined, [...mates('char-op-chopper'), 'char-op-dalton'], undefined, undefined,
    [
      { targetCharacterId: 'char-op-luffy', label: { it: 'Capitano', en: 'Captain' } },
      { targetCharacterId: 'char-op-hiluluk', label: { it: 'Maestro / figura paterna', en: 'Teacher / father figure' } },
      { targetCharacterId: 'char-op-kureha', label: { it: 'Maestra di medicina', en: 'Medicine teacher' } },
    ],
  ),
  'char-op-robin': L(
    undefined, undefined, mates('char-op-robin'),
    ['char-op-spandam', 'char-op-akainu'], ['char-op-olvia'],
    [
      { targetCharacterId: 'char-op-luffy', label: { it: 'Capitano', en: 'Captain' } },
      { targetCharacterId: 'char-op-olvia', label: { it: 'Madre', en: 'Mother' } },
      { targetCharacterId: 'char-op-saul', label: { it: 'La salvò da bambina', en: 'Saved her as a child' } },
      { targetCharacterId: 'char-op-clover', label: { it: 'Studioso capo di Ohara', en: 'Chief scholar of Ohara' } },
    ],
  ),
  'char-op-franky': L(
    undefined, undefined, [...mates('char-op-franky'), 'char-op-iceburg', 'char-op-zambai'], undefined, undefined,
    [
      { targetCharacterId: 'char-op-luffy', label: { it: 'Capitano', en: 'Captain' } },
      { targetCharacterId: 'char-op-tom', label: { it: 'Maestro costruttore', en: 'Master shipwright' } },
      { targetCharacterId: 'char-op-iceburg', label: { it: 'Fratello di bottega', en: 'Brother apprentice' } },
    ],
  ),
  'char-op-brook': L(
    undefined, undefined, mates('char-op-brook'), undefined, undefined,
    [{ targetCharacterId: 'char-op-luffy', label: { it: 'Capitano', en: 'Captain' } }],
  ),
  'char-op-jinbe': L(
    undefined, undefined, [...mates('char-op-jinbe'), 'char-op-fisher-tiger', 'char-op-aladine'],
    ['char-op-hody'], undefined,
    [
      { targetCharacterId: 'char-op-luffy', label: { it: 'Capitano', en: 'Captain' } },
      { targetCharacterId: 'char-op-fisher-tiger', label: { it: 'Mentore (Pirati del Sole)', en: 'Mentor (Sun Pirates)' } },
      { targetCharacterId: 'char-op-ace', label: { it: 'Amico a Impel Down e Marineford', en: 'Friend at Impel Down and Marineford' } },
      { targetCharacterId: 'char-op-whitebeard', label: { it: 'Ex alleato Imperatore', en: 'Former Emperor ally' } },
    ],
  ),

  /* ===================== Fratelli ASL / Rivoluzionari ===================== */
  'char-op-ace': L(
    ['arc-op-marineford'], ['evt-op-ace-death', 'evt-op-marineford-war'],
    ['char-op-whitebeard', 'char-op-marco', 'char-op-jinbe'], ['char-op-blackbeard', 'char-op-akainu'],
    ['char-op-luffy', 'char-op-sabo', 'char-op-garp', 'char-op-roger', 'char-op-rouge', 'char-op-dragon'],
    [
      { targetCharacterId: 'char-op-whitebeard', label: { it: 'Capitano / figura paterna', en: 'Captain / father figure' } },
      { targetCharacterId: 'char-op-luffy', label: { it: 'Fratello minore', en: 'Younger brother' } },
      { targetCharacterId: 'char-op-blackbeard', label: { it: 'Ex sottoposto che lo sconfisse e consegnò alla Marina', en: 'Former subordinate who defeated him and handed him to the Marines' } },
    ],
  ),
  'char-op-sabo': L(
    undefined, undefined, ['char-op-dragon', 'char-op-koala', 'char-op-hack', 'char-op-ivankov', 'char-op-luffy'],
    ['char-op-burgess'], ['char-op-luffy', 'char-op-ace'],
    [
      { targetCharacterId: 'char-op-ace', label: { it: 'Fratello giurato', en: 'Sworn brother' } },
      { targetCharacterId: 'char-op-luffy', label: { it: 'Fratello giurato', en: 'Sworn brother' } },
      { targetCharacterId: 'char-op-dragon', label: { it: "Capo dell'Armata Rivoluzionaria", en: 'Leader of the Revolutionary Army' } },
    ],
  ),
  'char-op-dragon': L(
    undefined, undefined, ['char-op-sabo', 'char-op-koala', 'char-op-ivankov', 'char-op-karasu', 'char-op-betty', 'char-op-morley', 'char-op-lindbergh'],
    ['char-op-akainu'], ['char-op-luffy', 'char-op-garp'],
    [
      { targetCharacterId: 'char-op-luffy', label: { it: 'Figlio', en: 'Son' } },
      { targetCharacterId: 'char-op-garp', label: { it: 'Padre', en: 'Father' } },
    ],
  ),

  /* ===================== Imperatori / leggende ===================== */
  'char-op-shanks': L(
    undefined, ['evt-op-mf-shanks-ends-war', 'evt-op-shanks-hat'],
    ['char-op-benn-beckman', 'char-op-yasopp', 'char-op-lucky-roux'], ['char-op-blackbeard'], ['char-op-uta'],
    [
      { targetCharacterId: 'char-op-luffy', label: { it: 'Gli donò il cappello', en: 'Gave him the hat' } },
      { targetCharacterId: 'char-op-roger', label: { it: 'Ex ciurma di Roger', en: 'Former Roger crewmate' } },
      { targetCharacterId: 'char-op-mihawk', label: { it: 'Rivale di un tempo', en: 'Former rival' } },
    ],
  ),
  'char-op-whitebeard': L(
    undefined, undefined, ['char-op-marco', 'char-op-jozu', 'char-op-vista', 'char-op-izo', 'char-op-jinbe', 'char-op-ace'],
    ['char-op-blackbeard', 'char-op-akainu'], undefined,
    [
      { targetCharacterId: 'char-op-ace', label: { it: 'Figlio di ciurma', en: 'Son of the crew' } },
      { targetCharacterId: 'char-op-roger', label: { it: "Rivale dell'epoca", en: 'Rival of the era' } },
      { targetCharacterId: 'char-op-blackbeard', label: { it: 'Ex sottoposto traditore', en: 'Treacherous former subordinate' } },
    ],
  ),
  'char-op-blackbeard': L(
    undefined, undefined,
    ['char-op-burgess', 'char-op-shiryu', 'char-op-lafitte', 'char-op-doc-q', 'char-op-pizarro', 'char-op-van-augur', 'char-op-catarina-devon', 'char-op-sanjuan-wolf', 'char-op-vasco-shot'],
    ['char-op-ace', 'char-op-whitebeard', 'char-op-luffy', 'char-op-shanks'], undefined,
    [
      { targetCharacterId: 'char-op-whitebeard', label: { it: 'Ex capitano (tradito)', en: 'Former captain (betrayed)' } },
      { targetCharacterId: 'char-op-ace', label: { it: 'Lo consegnò alla Marina', en: 'Handed him over to the Marines' } },
    ],
  ),
  'char-op-kaido': L(
    undefined, undefined, ['char-op-king', 'char-op-queen', 'char-op-jack', 'char-op-orochi', 'char-op-big-mom'],
    ['char-op-luffy', 'char-op-oden', 'char-op-kinemon', 'char-op-yamato'], ['char-op-yamato'],
    [
      { targetCharacterId: 'char-op-yamato', label: { it: 'Figlio/a (in rivolta)', en: 'Son/daughter (in revolt)' } },
      { targetCharacterId: 'char-op-oden', label: { it: 'Nemico storico', en: 'Old enemy' } },
    ],
  ),
  'char-op-big-mom': L(
    undefined, undefined, ['char-op-kaido'],
    ['char-op-luffy'],
    ['char-op-katakuri', 'char-op-smoothie', 'char-op-cracker', 'char-op-perospero', 'char-op-daifuku', 'char-op-oven', 'char-op-brulee', 'char-op-pudding', 'char-op-chiffon', 'char-op-lola'],
    [{ targetCharacterId: 'char-op-kaido', label: { it: 'Alleanza poi rivalità', en: 'Alliance, then rivalry' } }, { targetCharacterId: 'char-op-carmel', label: { it: 'La crebbe', en: 'Raised her' } }],
  ),

  /* ===================== Corsari / Donquijote ===================== */
  'char-op-doflamingo': L(
    undefined, undefined, ['char-op-trebol', 'char-op-diamante', 'char-op-pica', 'char-op-vergo', 'char-op-gladius', 'char-op-baby-5', 'char-op-jora'],
    ['char-op-law', 'char-op-luffy'], ['char-op-corazon'],
    [
      { targetCharacterId: 'char-op-corazon', label: { it: 'Fratello minore (lo uccise)', en: 'Younger brother (killed him)' } },
      { targetCharacterId: 'char-op-law', label: { it: 'Ex sottoposto divenuto nemesi', en: 'Former subordinate turned nemesis' } },
    ],
  ),
  'char-op-law': L(
    undefined, undefined, ['char-op-bepo', 'char-op-shachi', 'char-op-penguin', 'char-op-kid'],
    ['char-op-doflamingo'], undefined,
    [
      { targetCharacterId: 'char-op-corazon', label: { it: 'Lo salvò (Cora-san)', en: 'Saved him (Cora-san)' } },
      { targetCharacterId: 'char-op-doflamingo', label: { it: 'Nemesi', en: 'Nemesis' } },
      { targetCharacterId: 'char-op-luffy', label: { it: "Alleato d'avventura", en: 'Adventure ally' } },
    ],
  ),
  'char-op-hancock': L(
    undefined, undefined, ['char-op-luffy', 'char-op-gloriosa', 'char-op-marguerite'],
    undefined, ['char-op-sandersonia', 'char-op-marigold'],
    [
      { targetCharacterId: 'char-op-luffy', label: { it: 'Amato', en: 'Beloved' } },
      { targetCharacterId: 'char-op-gloriosa', label: { it: 'Anziana / mentore', en: 'Elder / mentor' } },
    ],
  ),

  /* ===================== Marina / Roger ===================== */
  'char-op-garp': L(
    undefined, undefined, ['char-op-sengoku', 'char-op-tsuru', 'char-op-kong', 'char-op-coby'],
    ['char-op-roger', 'char-op-chinjao'], ['char-op-luffy', 'char-op-ace', 'char-op-dragon'],
    [
      { targetCharacterId: 'char-op-roger', label: { it: 'Eterno rivale', en: 'Eternal rival' } },
      { targetCharacterId: 'char-op-luffy', label: { it: 'Nipote', en: 'Grandson' } },
      { targetCharacterId: 'char-op-dragon', label: { it: 'Figlio', en: 'Son' } },
    ],
  ),
  'char-op-roger': L(
    undefined, ['evt-op-roger-execution', 'evt-op-roger-laugh-tale'],
    ['char-op-rayleigh', 'char-op-scopper-gaban', 'char-op-oden', 'char-op-crocus', 'char-op-shanks', 'char-op-buggy'],
    ['char-op-whitebeard', 'char-op-garp'], ['char-op-ace', 'char-op-rouge'],
    [
      { targetCharacterId: 'char-op-rayleigh', label: { it: 'Vicecapitano', en: 'Vice-captain' } },
      { targetCharacterId: 'char-op-ace', label: { it: 'Figlio', en: 'Son' } },
      { targetCharacterId: 'char-op-garp', label: { it: 'Eterno rivale', en: 'Eternal rival' } },
    ],
  ),

  /* ===================== Foderi Rossi di Wano ===================== */
  'char-op-kinemon': L(
    undefined, undefined, ['char-op-luffy', 'char-op-momonosuke', 'char-op-denjiro', 'char-op-kiku', 'char-op-raizo', 'char-op-kawamatsu', 'char-op-ashura', 'char-op-inuarashi', 'char-op-nekomamushi'],
    ['char-op-kaido', 'char-op-orochi', 'char-op-kanjuro'], undefined,
    [
      { targetCharacterId: 'char-op-oden', label: { it: 'Signore (Kozuki Oden)', en: 'Lord (Kozuki Oden)' } },
      { targetCharacterId: 'char-op-momonosuke', label: { it: 'Erede da proteggere', en: 'Heir to protect' } },
      { targetCharacterId: 'char-op-kanjuro', label: { it: 'Compagno rivelatosi traditore', en: 'Companion who turned traitor' } },
    ],
  ),
  'char-op-yamato': L(
    undefined, undefined, ['char-op-luffy', 'char-op-momonosuke', 'char-op-ace'],
    ['char-op-kaido'], ['char-op-kaido'],
    [
      { targetCharacterId: 'char-op-kaido', label: { it: 'Padre (a cui si ribella)', en: 'Father (whom he rebels against)' } },
      { targetCharacterId: 'char-op-oden', label: { it: 'Modello ed eredità', en: 'Role model and legacy' } },
      { targetCharacterId: 'char-op-ace', label: { it: 'Vecchio amico', en: 'Old friend' } },
    ],
  ),

  /* ===================== Grand Fleet (capitani già presenti) ===================== */
  'char-op-bartolomeo': L(
    ['arc-op-dressrosa'], ['evt-op-dr-colosseum', 'evt-op-doflamingo-defeat'],
    ['char-op-luffy', 'char-op-cavendish', 'char-op-sai', 'char-op-leo', 'char-op-ideo', 'char-op-hajrudin', 'char-op-orlumbus', 'char-op-gambia'],
    ['char-op-doflamingo'], undefined,
    [{ targetCharacterId: 'char-op-luffy', label: { it: 'Idolo e capo della Grand Fleet', en: 'Idol and leader of the Grand Fleet' } }],
  ),
  'char-op-cavendish': L(
    ['arc-op-dressrosa'], ['evt-op-dr-colosseum', 'evt-op-doflamingo-defeat'],
    ['char-op-luffy', 'char-op-bartolomeo', 'char-op-sai', 'char-op-leo', 'char-op-ideo', 'char-op-hajrudin', 'char-op-orlumbus'],
    ['char-op-doflamingo'], undefined,
    [{ targetCharacterId: 'char-op-luffy', label: { it: 'Capo della Grand Fleet', en: 'Leader of the Grand Fleet' } }],
  ),
  'char-op-leo': L(
    ['arc-op-dressrosa'], ['evt-op-dr-tontatta', 'evt-op-doflamingo-defeat'],
    ['char-op-luffy', 'char-op-cavendish', 'char-op-bartolomeo', 'char-op-sai', 'char-op-ideo', 'char-op-hajrudin', 'char-op-orlumbus', 'char-op-mansherry'],
    ['char-op-doflamingo'], undefined,
    [{ targetCharacterId: 'char-op-luffy', label: { it: 'Capo della Grand Fleet', en: 'Leader of the Grand Fleet' } }],
  ),
  'char-op-hajrudin': L(
    undefined, undefined, ['char-op-cavendish', 'char-op-bartolomeo', 'char-op-sai', 'char-op-leo', 'char-op-ideo', 'char-op-orlumbus'],
    undefined, undefined,
    [{ targetCharacterId: 'char-op-luffy', label: { it: 'Capo della Grand Fleet', en: 'Leader of the Grand Fleet' } }],
  ),

  /* ===================== East Blue ===================== */
  'char-op-makino': L(['arc-op-romance-dawn'], ['evt-op-shanks-hat'], ['char-op-luffy', 'char-op-shanks']),
  'char-op-woop-slap': L(['arc-op-romance-dawn'], undefined, ['char-op-luffy', 'char-op-makino']),
  'char-op-higuma': L(['arc-op-romance-dawn'], ['evt-op-shanks-hat'], undefined, ['char-op-shanks', 'char-op-luffy']),
  'char-op-dadan': L(['arc-op-romance-dawn'], ['evt-op-ace-death'], ['char-op-ace', 'char-op-sabo', 'char-op-luffy'], undefined, undefined,
    [{ targetCharacterId: 'char-op-garp', label: { it: 'Le affidò i tre fratelli', en: 'Entrusted her with the three brothers' } }, { targetCharacterId: 'char-op-ace', label: { it: 'Lo crebbe come un figlio', en: 'Raised him like a son' } }]),
  'char-op-bluejam': L(['arc-op-romance-dawn'], undefined, undefined, ['char-op-ace', 'char-op-sabo', 'char-op-luffy']),
  'char-op-koushiro': L(['arc-op-romance-dawn'], undefined, ['char-op-zoro'], undefined, ['char-op-kuina'],
    [{ targetCharacterId: 'char-op-zoro', label: { it: 'Allievo', en: 'Student' } }, { targetCharacterId: 'char-op-kuina', label: { it: 'Figlia', en: 'Daughter' } }]),
  'char-op-kuina': L(['arc-op-romance-dawn'], undefined, ['char-op-zoro'], undefined, ['char-op-koushiro'],
    [{ targetCharacterId: 'char-op-zoro', label: { it: "Rivale d'infanzia", en: 'Childhood rival' } }]),
  'char-op-kaya': L(['arc-op-syrup-village'], ['evt-op-usopp-kuro'], ['char-op-usopp', 'char-op-merry'], ['char-op-kuro']),
  'char-op-merry': L(['arc-op-syrup-village'], ['evt-op-usopp-kuro'], ['char-op-kaya', 'char-op-usopp'], ['char-op-kuro'],
    undefined, [{ targetCharacterId: 'char-op-kaya', label: { it: 'Maggiordomo', en: 'Butler' } }]),
  'char-op-banchina': L(['arc-op-syrup-village'], undefined, undefined, undefined, ['char-op-usopp', 'char-op-yasopp'],
    [{ targetCharacterId: 'char-op-usopp', label: { it: 'Figlio', en: 'Son' } }, { targetCharacterId: 'char-op-yasopp', label: { it: 'Marito', en: 'Husband' } }]),
  'char-op-tamanegi': L(['arc-op-syrup-village'], undefined, ['char-op-usopp', 'char-op-piiman', 'char-op-ninjin']),
  'char-op-piiman': L(['arc-op-syrup-village'], undefined, ['char-op-usopp', 'char-op-tamanegi', 'char-op-ninjin']),
  'char-op-ninjin': L(['arc-op-syrup-village'], undefined, ['char-op-usopp', 'char-op-tamanegi', 'char-op-piiman']),
  'char-op-patty': L(['arc-op-baratie'], ['evt-op-baratie-krieg'], ['char-op-sanji', 'char-op-zeff', 'char-op-carne'], ['char-op-don-krieg']),
  'char-op-carne': L(['arc-op-baratie'], ['evt-op-baratie-krieg'], ['char-op-sanji', 'char-op-zeff', 'char-op-patty'], ['char-op-don-krieg']),
  'char-op-gin': L(['arc-op-baratie'], ['evt-op-baratie-krieg', 'evt-op-fight-luffy-don-krieg'], ['char-op-sanji'], undefined, undefined,
    [{ targetCharacterId: 'char-op-don-krieg', label: { it: 'Capitano', en: 'Captain' } }, { targetCharacterId: 'char-op-sanji', label: { it: 'Lo sfamò da nemico', en: 'Fed him while an enemy' } }]),
  'char-op-pearl': L(['arc-op-baratie'], ['evt-op-baratie-krieg'], ['char-op-don-krieg', 'char-op-gin'], ['char-op-sanji']),
  'char-op-fullbody': L(['arc-op-baratie', 'arc-op-alabasta'], undefined, ['char-op-hina', 'char-op-jango'], ['char-op-sanji']),
  'char-op-nojiko': L(['arc-op-arlong-park'], ['evt-op-arlong-nami-past', 'evt-op-arlong-liberation'], ['char-op-nami', 'char-op-genzo'], ['char-op-arlong'],
    ['char-op-nami'], [{ targetCharacterId: 'char-op-nami', label: { it: 'Sorella adottiva', en: 'Adoptive sister' } }, { targetCharacterId: 'char-op-bellemere', label: { it: 'Madre adottiva', en: 'Adoptive mother' } }]),
  'char-op-genzo': L(['arc-op-arlong-park'], ['evt-op-arlong-liberation'], ['char-op-nami', 'char-op-nojiko'], ['char-op-arlong']),
  'char-op-kuroobi': L(['arc-op-arlong-park'], ['evt-op-fight-luffy-arlong', 'evt-op-arlong-liberation'], ['char-op-arlong', 'char-op-chew', 'char-op-hatchan'], ['char-op-sanji']),
  'char-op-chew': L(['arc-op-arlong-park'], ['evt-op-arlong-liberation'], ['char-op-arlong', 'char-op-kuroobi', 'char-op-hatchan'], ['char-op-usopp']),
  'char-op-nezumi': L(['arc-op-arlong-park'], undefined, ['char-op-arlong'], ['char-op-nami', 'char-op-luffy']),
  'char-op-ipponmatsu': L(['arc-op-loguetown'], ['evt-op-loguetown-zoro-swords'], undefined, undefined, undefined,
    [{ targetCharacterId: 'char-op-zoro', label: { it: 'Gli vendette la Sandai Kitetsu', en: 'Sold him the Sandai Kitetsu' } }]),
  'char-op-daddy-masterson': L(['arc-op-loguetown'], undefined, undefined, undefined, undefined,
    [{ targetCharacterId: 'char-op-usopp', label: { it: 'Sfida di tiro', en: 'Sharpshooting challenge' } }]),
  'char-op-johnny': L(['arc-op-baratie', 'arc-op-arlong-park'], undefined, ['char-op-zoro', 'char-op-luffy', 'char-op-yosaku'], ['char-op-arlong']),
  'char-op-yosaku': L(['arc-op-baratie', 'arc-op-arlong-park'], undefined, ['char-op-zoro', 'char-op-luffy', 'char-op-johnny'], ['char-op-arlong']),

  /* ===================== Little Garden / Drum / Alabasta ===================== */
  'char-op-dorry': L(undefined, ['evt-op-little-garden'], ['char-op-luffy', 'char-op-vivi', 'char-op-brogy']),
  'char-op-brogy': L(undefined, ['evt-op-little-garden'], ['char-op-luffy', 'char-op-vivi', 'char-op-dorry']),
  'char-op-chess': L(['arc-op-drum'], ['evt-op-drum-wapol', 'evt-op-fight-luffy-wapol'], ['char-op-wapol', 'char-op-kuromarimo'], ['char-op-luffy']),
  'char-op-kuromarimo': L(['arc-op-drum'], ['evt-op-drum-wapol', 'evt-op-fight-luffy-wapol'], ['char-op-wapol', 'char-op-chess'], ['char-op-luffy']),
  'char-op-igaram': L(['arc-op-alabasta'], ['evt-op-alabasta-war'], ['char-op-vivi', 'char-op-cobra'], ['char-op-crocodile'],
    undefined, [{ targetCharacterId: 'char-op-vivi', label: { it: 'Capo della scorta', en: 'Head of the escort' } }]),
  'char-op-chaka': L(['arc-op-alabasta'], ['evt-op-alabasta-war'], ['char-op-vivi', 'char-op-cobra', 'char-op-pell'], ['char-op-crocodile']),
  'char-op-toto': L(['arc-op-alabasta'], undefined, ['char-op-vivi', 'char-op-luffy'], undefined, ['char-op-koza']),
  'char-op-daz-bones': L(['arc-op-alabasta', 'arc-op-impel-down'], ['evt-op-impel-breakout', 'evt-op-alabasta-war'], ['char-op-crocodile', 'char-op-miss-doublefinger'], ['char-op-zoro'],
    undefined, [{ targetCharacterId: 'char-op-crocodile', label: { it: 'Capo (Mr. 0)', en: 'Boss (Mr. 0)' } }]),
  'char-op-miss-doublefinger': L(['arc-op-alabasta'], ['evt-op-alabasta-war'], ['char-op-crocodile', 'char-op-daz-bones'], ['char-op-nami']),
  'char-op-mr-3': L(['arc-op-alabasta', 'arc-op-impel-down', 'arc-op-marineford'], ['evt-op-impel-breakout', 'evt-op-little-garden'], ['char-op-buggy', 'char-op-crocodile', 'char-op-miss-goldenweek'], ['char-op-luffy', 'char-op-vivi']),
  'char-op-miss-goldenweek': L(['arc-op-alabasta'], undefined, ['char-op-mr-3'], ['char-op-luffy']),
  'char-op-mr-5': L(['arc-op-alabasta'], ['evt-op-whisky-peak'], ['char-op-crocodile', 'char-op-miss-valentine'], ['char-op-vivi', 'char-op-luffy']),
  'char-op-miss-valentine': L(['arc-op-alabasta'], ['evt-op-whisky-peak'], ['char-op-crocodile', 'char-op-mr-5'], ['char-op-vivi']),
  'char-op-mr-4': L(['arc-op-alabasta'], undefined, ['char-op-crocodile', 'char-op-miss-merry-christmas'], ['char-op-usopp', 'char-op-chopper']),
  'char-op-miss-merry-christmas': L(['arc-op-alabasta'], undefined, ['char-op-crocodile', 'char-op-mr-4'], ['char-op-usopp', 'char-op-chopper']),

  /* ===================== Jaya / Skypiea / Long Ring ===================== */
  'char-op-masira': L(['arc-op-jaya', 'arc-op-skypiea'], ['evt-op-sky-knock-up'], ['char-op-cricket', 'char-op-luffy', 'char-op-shoujou'], undefined, ['char-op-shoujou']),
  'char-op-shoujou': L(['arc-op-jaya', 'arc-op-skypiea'], ['evt-op-sky-knock-up'], ['char-op-cricket', 'char-op-luffy', 'char-op-masira'], undefined, ['char-op-masira']),
  'char-op-pagaya': L(['arc-op-skypiea'], undefined, ['char-op-luffy', 'char-op-conis'], ['char-op-enel'], ['char-op-conis'],
    [{ targetCharacterId: 'char-op-conis', label: { it: 'Figlia', en: 'Daughter' } }]),
  'char-op-aisa': L(['arc-op-skypiea'], ['evt-op-skypiea-bell', 'evt-op-skypiea-enel'], ['char-op-wiper', 'char-op-luffy', 'char-op-calgara'], ['char-op-enel']),
  'char-op-ohm': L(['arc-op-skypiea'], ['evt-op-skypiea-enel'], ['char-op-enel', 'char-op-shura'], ['char-op-zoro'],
    undefined, [{ targetCharacterId: 'char-op-enel', label: { it: 'Sacerdote al suo servizio', en: 'Priest in his service' } }]),
  'char-op-gedatsu': L(['arc-op-skypiea'], ['evt-op-skypiea-enel'], ['char-op-enel', 'char-op-satori'], ['char-op-luffy']),
  'char-op-satori': L(['arc-op-skypiea'], ['evt-op-skypiea-enel'], ['char-op-enel', 'char-op-gedatsu'], ['char-op-luffy']),
  'char-op-shura': L(['arc-op-skypiea'], ['evt-op-skypiea-enel'], ['char-op-enel', 'char-op-ohm'], ['char-op-wiper']),
  'char-op-yama': L(['arc-op-skypiea'], ['evt-op-skypiea-enel'], ['char-op-enel'], ['char-op-luffy']),
  'char-op-tonjit': L(['arc-op-long-ring'], undefined, ['char-op-luffy', 'char-op-nami']),
  'char-op-porche': L(['arc-op-long-ring'], ['evt-op-fight-luffy-foxy'], ['char-op-foxy'], ['char-op-luffy'],
    undefined, [{ targetCharacterId: 'char-op-foxy', label: { it: 'Capitano', en: 'Captain' } }]),

  /* ===================== Water Seven / Enies Lobby ===================== */
  'char-op-paulie': L(['arc-op-water-seven', 'arc-op-enies-lobby'], ['evt-op-ws-cp9-reveal'], ['char-op-iceburg', 'char-op-franky'], ['char-op-lucci']),
  'char-op-kokoro': L(['arc-op-water-seven', 'arc-op-enies-lobby'], undefined, ['char-op-luffy', 'char-op-franky'], undefined, ['char-op-chimney'],
    [{ targetCharacterId: 'char-op-tom', label: { it: 'Vecchia conoscente', en: 'Old acquaintance' } }]),
  'char-op-tom': L(['arc-op-water-seven'], undefined, ['char-op-roger'], undefined, undefined,
    [{ targetCharacterId: 'char-op-franky', label: { it: 'Allievo (Cutty Flam)', en: 'Student (Cutty Flam)' } }, { targetCharacterId: 'char-op-iceburg', label: { it: 'Allievo', en: 'Student' } }]),
  'char-op-spandine': L(['arc-op-ohara'], ['evt-op-ohara-buster-call'], undefined, ['char-op-olvia', 'char-op-saul'], ['char-op-spandam'],
    [{ targetCharacterId: 'char-op-spandam', label: { it: 'Figlio', en: 'Son' } }]),
  'char-op-oimo': L(['arc-op-enies-lobby'], ['evt-op-el-gates-justice'], ['char-op-luffy', 'char-op-franky', 'char-op-kashii'], undefined, undefined,
    [{ targetCharacterId: 'char-op-kashii', label: { it: "Compagno d'armi", en: 'Comrade in arms' } }]),
  'char-op-kashii': L(['arc-op-enies-lobby'], ['evt-op-el-gates-justice'], ['char-op-luffy', 'char-op-franky', 'char-op-oimo']),

  /* ===================== Thriller Bark ===================== */
  'char-op-lola': L(['arc-op-thriller-bark'], undefined, ['char-op-nami'], undefined, ['char-op-big-mom', 'char-op-chiffon'],
    [{ targetCharacterId: 'char-op-nami', label: { it: 'Le donò la Vivre Card', en: 'Gave her the Vivre Card' } }, { targetCharacterId: 'char-op-big-mom', label: { it: 'Madre', en: 'Mother' } }]),
  'char-op-cindry': L(['arc-op-thriller-bark'], undefined, ['char-op-hogback'], undefined, undefined,
    [{ targetCharacterId: 'char-op-hogback', label: { it: 'La resuscitò come zombie', en: 'Revived him as a zombie' } }]),

  /* ===================== Sabaody / Amazon Lily ===================== */
  'char-op-shakky': L(['arc-op-sabaody'], undefined, ['char-op-rayleigh', 'char-op-luffy'], undefined, undefined,
    [{ targetCharacterId: 'char-op-rayleigh', label: { it: 'Compagna', en: 'Companion' } }]),
  'char-op-duval': L(['arc-op-sabaody'], undefined, ['char-op-sanji', 'char-op-luffy'], undefined, undefined,
    [{ targetCharacterId: 'char-op-sanji', label: { it: '«Rifatto» da un suo calcio', en: '"Remade" by one of his kicks' } }]),
  'char-op-charloss': L(['arc-op-sabaody'], ['evt-op-sab-celestial'], undefined, ['char-op-luffy']),
  'char-op-pappag': L(['arc-op-sabaody', 'arc-op-fishman-island'], undefined, ['char-op-hatchan', 'char-op-camie']),
  'char-op-ran': L(['arc-op-amazon-lily'], undefined, ['char-op-hancock', 'char-op-marguerite', 'char-op-gloriosa']),

  /* ===================== Impel Down ===================== */
  'char-op-hannyabal': L(['arc-op-impel-down'], ['evt-op-impel-breakout'], ['char-op-magellan'], ['char-op-luffy'],
    undefined, [{ targetCharacterId: 'char-op-magellan', label: { it: 'Ne ambisce il posto', en: 'Covets his position' } }]),
  'char-op-sadi': L(['arc-op-impel-down'], ['evt-op-impel-breakout'], ['char-op-magellan', 'char-op-saldeath'], ['char-op-luffy']),
  'char-op-saldeath': L(['arc-op-impel-down'], ['evt-op-impel-breakout'], ['char-op-magellan', 'char-op-sadi'], ['char-op-luffy']),

  /* ===================== Marineford (comandanti di Barbabianca) ===================== */
  'char-op-namur': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-blamenco': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-rakuyo': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-fossa': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-curiel': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-haruta': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-atmos': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-blenheim': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-speed-jiru': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-momonga': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-sengoku', 'char-op-hancock'], ['char-op-whitebeard']),
  'char-op-onigumo': L(['arc-op-marineford'], ['evt-op-mf-ace-freed'], ['char-op-akainu', 'char-op-sengoku'], ['char-op-ace', 'char-op-luffy']),

  /* ===================== Fish-Man Island ===================== */
  'char-op-ryuboshi': L(['arc-op-fishman-island'], ['evt-op-fishman-island'], ['char-op-luffy', 'char-op-fukaboshi'], ['char-op-hody'],
    ['char-op-shirahoshi', 'char-op-neptune', 'char-op-fukaboshi']),
  'char-op-manboshi': L(['arc-op-fishman-island'], ['evt-op-fishman-island'], ['char-op-luffy', 'char-op-fukaboshi'], ['char-op-hody'],
    ['char-op-shirahoshi', 'char-op-neptune', 'char-op-fukaboshi']),
  'char-op-vander-decken': L(['arc-op-fishman-island'], ['evt-op-fmi-noah'], ['char-op-hody'], ['char-op-shirahoshi', 'char-op-luffy'],
    undefined, [{ targetCharacterId: 'char-op-shirahoshi', label: { it: 'Ossessione', en: 'Obsession' } }]),

  /* ===================== Punk Hazard ===================== */
  'char-op-brownbeard': L(['arc-op-punk-hazard'], ['evt-op-ph-alliance'], ['char-op-luffy', 'char-op-law'], ['char-op-caesar']),
  'char-op-mocha': L(['arc-op-punk-hazard'], ['evt-op-ph-caesar-gas'], ['char-op-chopper', 'char-op-luffy'], ['char-op-caesar']),

  /* ===================== Dressrosa ===================== */
  'char-op-dellinger': L(['arc-op-dressrosa'], ['evt-op-doflamingo-defeat'], ['char-op-doflamingo', 'char-op-diamante'], ['char-op-luffy'],
    undefined, [{ targetCharacterId: 'char-op-doflamingo', label: { it: 'Capo', en: 'Boss' } }]),
  'char-op-lao-g': L(['arc-op-dressrosa'], ['evt-op-doflamingo-defeat'], ['char-op-doflamingo'], ['char-op-kyros']),
  'char-op-buffalo': L(['arc-op-dressrosa', 'arc-op-punk-hazard'], ['evt-op-doflamingo-defeat'], ['char-op-doflamingo', 'char-op-caesar'], ['char-op-luffy']),
  'char-op-scarlett': L(['arc-op-dressrosa'], undefined, undefined, ['char-op-diamante'], ['char-op-kyros', 'char-op-rebecca', 'char-op-viola', 'char-op-riku'],
    [{ targetCharacterId: 'char-op-kyros', label: { it: 'Marito', en: 'Husband' } }, { targetCharacterId: 'char-op-rebecca', label: { it: 'Figlia', en: 'Daughter' } }]),
  'char-op-mansherry': L(['arc-op-dressrosa'], ['evt-op-dr-tontatta'], ['char-op-leo', 'char-op-luffy'], ['char-op-doflamingo']),

  /* ===================== Zou ===================== */
  'char-op-wanda': L(['arc-op-zou'], ['evt-op-zou-alliance', 'evt-op-fight-jack-minks'], ['char-op-inuarashi', 'char-op-nekomamushi', 'char-op-luffy'], ['char-op-jack']),
  'char-op-shishilian': L(['arc-op-zou'], ['evt-op-fight-jack-minks'], ['char-op-inuarashi', 'char-op-wanda'], ['char-op-jack']),

  /* ===================== Whole Cake Island (famiglia Charlotte) ===================== */
  'char-op-mont-dor': L(['arc-op-whole-cake'], ['evt-op-wci-wedding'], ['char-op-big-mom', 'char-op-katakuri'], ['char-op-luffy'],
    ['char-op-big-mom'], [{ targetCharacterId: 'char-op-big-mom', label: { it: 'Madre', en: 'Mother' } }]),
  'char-op-opera': L(['arc-op-whole-cake'], undefined, ['char-op-big-mom'], ['char-op-luffy'], ['char-op-big-mom'],
    [{ targetCharacterId: 'char-op-big-mom', label: { it: 'Madre', en: 'Mother' } }]),
  'char-op-galette': L(['arc-op-whole-cake'], ['evt-op-wci-wedding'], ['char-op-big-mom', 'char-op-katakuri'], ['char-op-luffy'], ['char-op-big-mom'],
    [{ targetCharacterId: 'char-op-big-mom', label: { it: 'Madre', en: 'Mother' } }]),
  'char-op-amande': L(['arc-op-whole-cake'], ['evt-op-wci-wedding'], ['char-op-big-mom'], ['char-op-luffy'], ['char-op-big-mom'],
    [{ targetCharacterId: 'char-op-big-mom', label: { it: 'Madre', en: 'Mother' } }]),
  'char-op-praline': L(['arc-op-whole-cake'], undefined, ['char-op-big-mom', 'char-op-aladine', 'char-op-jinbe'], undefined, ['char-op-big-mom'],
    [{ targetCharacterId: 'char-op-aladine', label: { it: 'Marito', en: 'Husband' } }, { targetCharacterId: 'char-op-big-mom', label: { it: 'Madre', en: 'Mother' } }]),
  'char-op-flampe': L(['arc-op-whole-cake'], ['evt-op-katakuri-duel'], ['char-op-big-mom'], ['char-op-luffy'], ['char-op-big-mom', 'char-op-katakuri'],
    [{ targetCharacterId: 'char-op-katakuri', label: { it: 'Idolo poi tradito', en: 'Idol, later betrayed' } }]),
  'char-op-streusen': L(['arc-op-whole-cake'], undefined, ['char-op-big-mom'], undefined, undefined,
    [{ targetCharacterId: 'char-op-big-mom', label: { it: 'Capitana (ne è il cuoco capo)', en: 'Captain (he is her head chef)' } }]),
  'char-op-pound': L(['arc-op-whole-cake'], undefined, ['char-op-chiffon'], undefined, ['char-op-chiffon', 'char-op-lola', 'char-op-big-mom'],
    [{ targetCharacterId: 'char-op-big-mom', label: { it: 'Ex consorte', en: 'Former consort' } }, { targetCharacterId: 'char-op-chiffon', label: { it: 'Figlia', en: 'Daughter' } }]),
  'char-op-vito': L(['arc-op-whole-cake'], undefined, ['char-op-bege', 'char-op-chiffon'], undefined, undefined,
    [{ targetCharacterId: 'char-op-bege', label: { it: 'Capo', en: 'Boss' } }]),
  'char-op-zeus': L(['arc-op-whole-cake', 'arc-op-wano'], undefined, ['char-op-nami'], ['char-op-big-mom'], undefined,
    [{ targetCharacterId: 'char-op-nami', label: { it: 'Padrona (lo ospita nel Clima Tact)', en: 'Owner (houses him in the Clima-Tact)' } }, { targetCharacterId: 'char-op-big-mom', label: { it: 'Creatrice', en: 'Creator' } }]),

  /* ===================== Wano / Egghead / era di Roger ===================== */
  'char-op-sukiyaki': L(['arc-op-wano'], undefined, ['char-op-momonosuke', 'char-op-hiyori'], ['char-op-orochi'], ['char-op-oden', 'char-op-momonosuke', 'char-op-hiyori'],
    [{ targetCharacterId: 'char-op-oden', label: { it: 'Figlio', en: 'Son' } }, { targetCharacterId: 'char-op-momonosuke', label: { it: 'Nipote', en: 'Grandson' } }]),
  'char-op-guernica': L(['arc-op-wano'], ['evt-op-onigashima-war'], ['char-op-doflamingo'], ['char-op-luffy'], undefined,
    [{ targetCharacterId: 'char-op-kaido', label: { it: 'Lo eliminò a Onigashima', en: 'Eliminated him at Onigashima' } }]),
  'char-op-s-snake': L(['arc-op-egghead'], ['evt-op-egghead-attack'], ['char-op-saturn', 'char-op-kizaru'], ['char-op-luffy'], undefined,
    [{ targetCharacterId: 'char-op-hancock', label: { it: 'Modello genetico', en: 'Genetic template' } }, { targetCharacterId: 'char-op-vegapunk', label: { it: 'Creatore', en: 'Creator' } }]),
  'char-op-s-shark': L(['arc-op-egghead'], ['evt-op-egghead-attack'], ['char-op-saturn', 'char-op-kizaru'], ['char-op-luffy'], undefined,
    [{ targetCharacterId: 'char-op-jinbe', label: { it: 'Modello genetico', en: 'Genetic template' } }, { targetCharacterId: 'char-op-vegapunk', label: { it: 'Creatore', en: 'Creator' } }]),
  'char-op-shimotsuki-ushimaru': L(['arc-op-wano'], undefined, ['char-op-oden'], ['char-op-kaido', 'char-op-orochi']),

  /* ===================== Film ===================== */
  'char-op-uta': L(undefined, undefined, ['char-op-luffy'], undefined, ['char-op-shanks'],
    [{ targetCharacterId: 'char-op-shanks', label: { it: 'Padre adottivo', en: 'Adoptive father' } }, { targetCharacterId: 'char-op-luffy', label: { it: "Amico d'infanzia", en: 'Childhood friend' } }]),
  'char-op-gild-tesoro': L(undefined, undefined, undefined, ['char-op-luffy']),
  'char-op-douglas-bullet': L(undefined, undefined, undefined, ['char-op-luffy', 'char-op-buggy'], undefined,
    [{ targetCharacterId: 'char-op-roger', label: { it: 'Ex ciurma di Roger', en: 'Former Roger crewmate' } }]),
  'char-op-zephyr': L(undefined, undefined, undefined, ['char-op-luffy'], undefined,
    [{ targetCharacterId: 'char-op-sengoku', label: { it: 'Ex Marina', en: 'Former Marine' } }]),
  'char-op-shiki': L(undefined, undefined, undefined, ['char-op-luffy'], undefined,
    [{ targetCharacterId: 'char-op-roger', label: { it: "Rivale dell'epoca", en: 'Rival of the era' } }, { targetCharacterId: 'char-op-garp', label: { it: 'Nemico storico', en: 'Old enemy' } }]),
  'char-op-gasparde': L(undefined, undefined, undefined, ['char-op-luffy']),
  'char-op-saga': L(undefined, undefined, ['char-op-zoro'], undefined, undefined,
    [{ targetCharacterId: 'char-op-zoro', label: { it: 'Vecchio amico spadaccino', en: 'Old swordsman friend' } }]),
  'char-op-baron-omatsuri': L(undefined, undefined, undefined, ['char-op-luffy']),
  'char-op-ratchet': L(undefined, undefined, undefined, ['char-op-luffy']),
  'char-op-bear-king': L(undefined, undefined, undefined, ['char-op-luffy']),
  'char-op-el-drago': L(undefined, undefined, undefined, ['char-op-luffy']),
};

const uniq = (a?: string[], b?: string[]): string[] | undefined => {
  if (!a && !b) return undefined;
  return Array.from(new Set([...(a ?? []), ...(b ?? [])]));
};

/**
 * Unisce le relazioni del personaggio con quelle del patch, deduplicando per
 * `targetCharacterId`: si tiene la prima occorrenza (quella già dichiarata nel
 * file di definizione, scritta a mano), scartando i doppioni del patch.
 */
const mergeRelationships = (c: Character, patch: LinkPatch): Rel[] => {
  const out: Rel[] = [];
  const seen = new Set<string>();
  for (const r of [...(c.relationships ?? []), ...(patch.relationships ?? [])]) {
    if (r.targetCharacterId === c.id || seen.has(r.targetCharacterId)) continue;
    seen.add(r.targetCharacterId);
    out.push(r);
  }
  return out;
};

/** Applica i collegamenti della «tela» ai personaggi, unendo gli array in modo additivo. */
export function withCharacterLinks(characters: Character[]): Character[] {
  return characters.map((c) => {
    const patch = onepieceCharacterLinks[c.id];
    if (!patch) return c;
    const relationships = mergeRelationships(c, patch);
    return {
      ...c,
      ...(uniq(c.factionIds, patch.factionIds) ? { factionIds: uniq(c.factionIds, patch.factionIds) } : {}),
      ...(uniq(c.locationIds, patch.locationIds) ? { locationIds: uniq(c.locationIds, patch.locationIds) } : {}),
      ...(uniq(c.arcIds, patch.arcIds) ? { arcIds: uniq(c.arcIds, patch.arcIds) } : {}),
      ...(uniq(c.eventIds, patch.eventIds) ? { eventIds: uniq(c.eventIds, patch.eventIds) } : {}),
      ...(uniq(c.allies, patch.allies) ? { allies: uniq(c.allies, patch.allies) } : {}),
      ...(uniq(c.enemies, patch.enemies) ? { enemies: uniq(c.enemies, patch.enemies) } : {}),
      ...(uniq(c.family, patch.family) ? { family: uniq(c.family, patch.family) } : {}),
      ...(uniq(c.teachers, patch.teachers) ? { teachers: uniq(c.teachers, patch.teachers) } : {}),
      ...(uniq(c.students, patch.students) ? { students: uniq(c.students, patch.students) } : {}),
      ...(relationships.length ? { relationships } : {}),
    };
  });
}
