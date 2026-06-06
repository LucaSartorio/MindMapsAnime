import type { Faction } from '@/types';

/** Fazioni delle saghe di Paradise: Baroque Works, Pirati di Wapol, Shandia. */
export const onepieceFactionsParadise: Faction[] = [
  {
    id: 'faction-op-baroque-works',
    worldId: 'world-onepiece',
    type: 'organization',
    name: 'Baroque Works',
    localizedName: { it: 'Baroque Works', en: 'Baroque Works' },
    description: {
      it: "Organizzazione criminale segreta guidata da Crocodile («Mr. 0»), con agenti in codice numerico e cacciatori di taglie. Il suo scopo nascosto: rovesciare il regno di Alabasta.",
      en: "A secret criminal organization led by Crocodile ('Mr. 0'), with numbered code-named agents and bounty hunters. Its hidden goal: to overthrow the kingdom of Alabasta.",
    },
    leaderIds: ['char-op-crocodile'],
    characterIds: ['char-op-crocodile', 'char-op-robin'],
    locationIds: ['loc-op-alabasta', 'loc-op-rainbase', 'loc-op-whisky-peak'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['alabasta', 'criminale'],
  },
  {
    id: 'faction-op-wapol-pirates',
    worldId: 'world-onepiece',
    type: 'crew',
    name: 'Wapol Pirates',
    localizedName: { it: 'Pirati di Wapol', en: 'Wapol Pirates' },
    description: {
      it: "La ciurma dell'ex re Wapol, che tornò a Drum Island per riprendersi con la forza il regno e opprimerne gli abitanti.",
      en: "The crew of the former king Wapol, who returned to Drum Island to seize the kingdom by force and oppress its people.",
    },
    leaderIds: ['char-op-wapol'],
    characterIds: ['char-op-wapol'],
    locationIds: ['loc-op-drum-island'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['drum', 'ciurma'],
  },
  {
    id: 'faction-op-shandia',
    worldId: 'world-onepiece',
    type: 'group',
    name: 'Shandia',
    localizedName: { it: 'Shandia', en: 'Shandia' },
    description: {
      it: "Il popolo guerriero discendente degli abitanti di Shandora, che da generazioni combatte per riprendersi la terra ancestrale finita in cielo come Upper Yard.",
      en: "The warrior people descended from the inhabitants of Shandora, who for generations have fought to reclaim their ancestral land, risen into the sky as Upper Yard.",
    },
    characterIds: ['char-op-wiper'],
    locationIds: ['loc-op-upper-yard', 'loc-op-skypiea'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['skypiea', 'shandia', 'guerrieri'],
  },
];
