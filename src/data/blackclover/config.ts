import type { LabeledOption } from '@/types';

/**
 * Tassonomie di Black Clover usate dal `WorldConfig` in `src/data/worlds.ts`.
 *
 * Vivono in un file a parte (importato da `worlds.ts`) perché sono lunghe e
 * perché `worlds.ts` non può importare `src/data/blackclover/index.ts`: è
 * quest'ultimo a leggere `animeWorlds`. Qui dentro non ci sono import di
 * dataset, solo tipi — nessun ciclo.
 */

/**
 * ATTRIBUTI MAGICI (`ability.categories`).
 *
 * In Black Clover ogni mago nasce con un solo attributo, ed è ciò che lo
 * definisce molto più del grado: per questo l'attributo è la "categoria" delle
 * voci di `WorldDataset.jutsu` (`jutsu.type`) ed è il badge mostrato sulla
 * scheda personaggio (`character.abilityCategory`). L'elenco contiene solo gli
 * attributi effettivamente presenti nel dataset.
 */
export const BLACKCLOVER_MAGIC_ATTRIBUTES: LabeledOption[] = [
  { id: 'anti_magic', label: { it: 'Anti-magia', en: 'Anti-Magic' } },
  { id: 'wind', label: { it: 'Vento', en: 'Wind' } },
  { id: 'water', label: { it: 'Acqua', en: 'Water' } },
  { id: 'fire', label: { it: 'Fuoco', en: 'Fire' } },
  { id: 'lightning', label: { it: 'Fulmine', en: 'Lightning' } },
  { id: 'earth', label: { it: 'Terra', en: 'Earth' } },
  { id: 'light', label: { it: 'Luce', en: 'Light' } },
  { id: 'dark', label: { it: 'Oscurità', en: 'Darkness' } },
  { id: 'ice', label: { it: 'Ghiaccio', en: 'Ice' } },
  { id: 'snow', label: { it: 'Neve', en: 'Snow' } },
  { id: 'steel', label: { it: 'Acciaio', en: 'Steel' } },
  { id: 'crystal', label: { it: 'Cristallo', en: 'Crystal' } },
  { id: 'mercury', label: { it: 'Mercurio', en: 'Mercury' } },
  { id: 'mist', label: { it: 'Nebbia', en: 'Mist' } },
  { id: 'sand', label: { it: 'Sabbia', en: 'Sand' } },
  { id: 'glass', label: { it: 'Vetro', en: 'Glass' } },
  { id: 'plant', label: { it: 'Piante', en: 'Plant' } },
  { id: 'cotton', label: { it: 'Cotone', en: 'Cotton' } },
  { id: 'thread', label: { it: 'Filo', en: 'Thread' } },
  { id: 'mirror', label: { it: 'Specchio', en: 'Mirror' } },
  { id: 'poison', label: { it: 'Veleno', en: 'Poison' } },
  { id: 'ash', label: { it: 'Cenere', en: 'Ash' } },
  { id: 'trap', label: { it: 'Trappola', en: 'Trap' } },
  { id: 'sealing', label: { it: 'Sigillo', en: 'Sealing' } },
  { id: 'recombination', label: { it: 'Ricombinazione', en: 'Recombination' } },
  { id: 'transformation', label: { it: 'Trasformazione', en: 'Transformation' } },
  { id: 'spatial', label: { it: 'Spazio', en: 'Spatial' } },
  { id: 'time', label: { it: 'Tempo', en: 'Time' } },
  { id: 'gravity', label: { it: 'Gravità', en: 'Gravity' } },
  { id: 'body', label: { it: 'Corpo', en: 'Body' } },
  { id: 'blood', label: { it: 'Sangue', en: 'Blood' } },
  { id: 'bone', label: { it: 'Ossa', en: 'Bone' } },
  { id: 'soul', label: { it: 'Anima', en: 'Soul' } },
  { id: 'curse', label: { it: 'Maledizione', en: 'Curse' } },
  { id: 'briar', label: { it: 'Rovi', en: 'Briar' } },
  { id: 'dream', label: { it: 'Sogno', en: 'Dream' } },
  { id: 'painting', label: { it: 'Pittura', en: 'Painting' } },
  { id: 'severing', label: { it: 'Taglio', en: 'Severing' } },
  { id: 'bronze', label: { it: 'Bronzo', en: 'Bronze' } },
  { id: 'vortex', label: { it: 'Vortice', en: 'Vortex' } },
  { id: 'permeation', label: { it: 'Permeazione', en: 'Permeation' } },
  { id: 'compass', label: { it: 'Bussola', en: 'Compass' } },
  { id: 'beast', label: { it: 'Bestia', en: 'Beast' } },
  { id: 'imitation', label: { it: 'Imitazione', en: 'Imitation' } },
  { id: 'memory', label: { it: 'Memoria', en: 'Memory' } },
  { id: 'recovery', label: { it: 'Guarigione', en: 'Recovery' } },
  { id: 'scale', label: { it: 'Bilancia', en: 'Scale' } },
  { id: 'world_tree', label: { it: 'Albero del Mondo', en: 'World Tree' } },
  { id: 'cherry_blossom', label: { it: 'Fiori di ciliegio', en: 'Cherry Blossom' } },
  { id: 'song', label: { it: 'Canto', en: 'Song' } },
  { id: 'dance', label: { it: 'Danza', en: 'Dance' } },
  { id: 'sleep', label: { it: 'Sonno', en: 'Sleep' } },
  { id: 'gel', label: { it: 'Gel', en: 'Gel' } },
  { id: 'chain', label: { it: 'Catene', en: 'Chain' } },
  { id: 'smoke', label: { it: 'Fumo', en: 'Smoke' } },
  { id: 'shadow', label: { it: 'Ombra', en: 'Shadow' } },
  { id: 'sword', label: { it: 'Spada', en: 'Sword' } },
  { id: 'star', label: { it: 'Stelle', en: 'Star' } },
  { id: 'corpse', label: { it: 'Cadaveri', en: 'Corpse' } },
  { id: 'mana_absorption', label: { it: 'Assorbimento di mana', en: 'Mana Absorption' } },
  { id: 'swamp', label: { it: 'Palude', en: 'Swamp' } },
  { id: 'word_soul', label: { it: "Anima della parola", en: 'Word Soul' } },
  { id: 'ki', label: { it: 'Ki (Paese del Sole)', en: 'Ki (Land of the Sun)' } },
];

/**
 * CLASSIFICAZIONE (`ability.attribute`): la categoria che l'opera usa
 * sopra l'attributo — magia d'attributo, composita, di creazione, degli
 * spiriti, di maledizione, proibita, diabolica, Stadio Arcano, tecniche di ki.
 * Mappata su `jutsu.chakraNature` (il campo "attributo secondario" generico).
 */
export const BLACKCLOVER_MAGIC_KINDS: LabeledOption[] = [
  { id: 'attribute_magic', label: { it: "Magia d'attributo", en: 'Attribute Magic' } },
  { id: 'composite_magic', label: { it: 'Magia composita', en: 'Composite Magic' } },
  { id: 'creation_magic', label: { it: 'Magia di creazione', en: 'Creation Magic' } },
  { id: 'trap_magic', label: { it: 'Magia di trappola', en: 'Trap Magic' } },
  { id: 'spirit_magic', label: { it: 'Magia degli spiriti', en: 'Spirit Magic' } },
  { id: 'sealing_magic', label: { it: 'Magia di sigillo', en: 'Sealing Magic' } },
  { id: 'curse_magic', label: { it: 'Magia di maledizione', en: 'Curse Magic' } },
  { id: 'reincarnation_magic', label: { it: 'Magia di reincarnazione', en: 'Reincarnation Magic' } },
  { id: 'forbidden_magic', label: { it: 'Magia proibita', en: 'Forbidden Magic' } },
  { id: 'devil_magic', label: { it: 'Magia diabolica', en: 'Devil Magic' } },
  { id: 'arcane_stage', label: { it: 'Stadio Arcano', en: 'Arcane Stage' } },
  { id: 'ultimate_magic', label: { it: 'Magia suprema', en: 'Ultimate Magic' } },
  { id: 'ki_technique', label: { it: 'Tecnica di ki', en: 'Ki technique' } },
];

/**
 * GRADI (`characterRank`): la scala dei Cavalieri Magici del Regno di Clover,
 * più i gradi equivalenti degli altri paesi (Maghi Guerrieri di Diamond,
 * Spirit Guardian di Heart, shōgun del Paese del Sole). L'ordine dell'array è
 * anche l'ordine del filtro.
 */
export const BLACKCLOVER_RANKS: LabeledOption[] = [
  { id: 'wizard_king', label: { it: 'Imperatore Magico', en: 'Wizard King' } },
  { id: 'squad_captain', label: { it: 'Capitano di compagnia', en: 'Squad Captain' } },
  { id: 'vice_captain', label: { it: 'Vice-capitano', en: 'Vice-Captain' } },
  { id: 'royal_knight', label: { it: 'Cavaliere Reale', en: 'Royal Knight' } },
  { id: 'grand_magic_knight', label: { it: 'Gran Cavaliere Magico', en: 'Grand Magic Knight' } },
  { id: 'senior_magic_knight', label: { it: 'Cavaliere Magico Senior', en: 'Senior Magic Knight' } },
  { id: 'intermediate_magic_knight', label: { it: 'Cavaliere Magico Intermedio', en: 'Intermediate Magic Knight' } },
  { id: 'junior_magic_knight', label: { it: 'Cavaliere Magico Junior', en: 'Junior Magic Knight' } },
  { id: 'mage_warrior', label: { it: 'Mago Guerriero (Diamond)', en: 'Mage Warrior (Diamond)' } },
  { id: 'spirit_guardian', label: { it: 'Spirit Guardian (Heart)', en: 'Spirit Guardian (Heart)' } },
  { id: 'shogun', label: { it: 'Shōgun (Paese del Sole)', en: 'Shogun (Land of the Sun)' } },
  { id: 'royalty', label: { it: 'Famiglia reale', en: 'Royalty' } },
  { id: 'civilian', label: { it: 'Civile', en: 'Civilian' } },
  { id: 'other', label: { it: 'Altro', en: 'Other' } },
];

/**
 * RUOLI (`characterRoles`): i ruoli specifici di Black Clover. I ruoli
 * universali (protagonist, antagonist, mentor, ally, …) sono già localizzati
 * di default e non vanno ripetuti qui.
 */
export const BLACKCLOVER_ROLES: LabeledOption[] = [
  { id: 'rival', label: { it: 'Rivale', en: 'Rival' } },
  { id: 'wizard_king', label: { it: 'Imperatore Magico', en: 'Wizard King' } },
  { id: 'captain', label: { it: 'Capitano', en: 'Squad Captain' } },
  { id: 'vice_captain', label: { it: 'Vice-capitano', en: 'Vice-Captain' } },
  { id: 'magic_knight', label: { it: 'Cavaliere Magico', en: 'Magic Knight' } },
  { id: 'royal', label: { it: 'Sangue reale', en: 'Royalty' } },
  { id: 'noble', label: { it: 'Nobile', en: 'Noble' } },
  { id: 'commoner', label: { it: 'Popolano', en: 'Commoner' } },
  { id: 'elf', label: { it: 'Elfo', en: 'Elf' } },
  { id: 'devil', label: { it: 'Diavolo', en: 'Devil' } },
  { id: 'spirit', label: { it: 'Spirito', en: 'Spirit' } },
  { id: 'witch', label: { it: 'Strega', en: 'Witch' } },
  { id: 'dark_triad', label: { it: 'Triade Oscura', en: 'Dark Triad' } },
  { id: 'dark_disciple', label: { it: 'Discepolo Oscuro', en: 'Dark Disciple' } },
  { id: 'third_eye', label: { it: 'Terzo Occhio', en: 'Third Eye' } },
  { id: 'paladin', label: { it: 'Paladino', en: 'Paladin' } },
  { id: 'spirit_guardian', label: { it: 'Spirit Guardian', en: 'Spirit Guardian' } },
  { id: 'mage_warrior', label: { it: 'Mago Guerriero', en: 'Mage Warrior' } },
  { id: 'ryuzen_seven', label: { it: 'Sette Ryūzen', en: 'Ryuzen Seven' } },
];
