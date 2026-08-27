import type { Faction } from '@/types';

/**
 * Fazioni di Black Clover · batch 2.
 *
 * Le casate nobiliari mancanti nel primo file e tre voci di tipo `concept`
 * per le istituzioni che reggono il mondo — la linea degli Imperatori Magici,
 * i grimori e le pietre magiche. Sono "fazioni" solo in senso lato, ma
 * l'archivio le rende esplorabili come entità a sé con i loro membri, luoghi
 * e archi collegati (stesso pattern già usato da One Piece).
 */
export const blackcloverFactionsBatch1: Faction[] = [
  {
    id: 'faction-bc-wizard-kings',
    worldId: 'world-blackclover',
    type: 'concept',
    name: 'The Wizard Kings',
    localizedName: { it: 'Gli Imperatori Magici', en: 'The Wizard Kings' },
    japaneseName: '魔法帝',
    nationId: 'nation-bc-clover',
    description: {
      it: "La linea dei ventotto Imperatori Magici del Regno di Clover: il mago più forte del regno, e il titolo per cui Asta e Yuno si sono giurati di battersi.",
      en: "The line of the Clover Kingdom's twenty-eight Wizard Kings: the strongest mage in the kingdom, and the title Asta and Yuno swore to fight each other for.",
    },
    longDescription: {
      it: "Dal primo, Lumiere Silvamillion Clover, che sognava un mondo senza classi, al ventottesimo, Julius Novachrono, che sceglieva i suoi Cavalieri Magici guardando la persona e non il cognome. È l'unica carica del regno che il sangue non basta a ottenere — ed è per questo che due orfani di Hage possono ambirci.",
      en: "From the first, Lumiere Silvamillion Clover, who dreamed of a world without classes, to the twenty-eighth, Julius Novachrono, who picked his Magic Knights by looking at the person and not the surname. It is the one office in the kingdom that blood alone cannot buy — which is why two orphans from Hage can aim for it.",
    },
    characterIds: ['char-bc-lumiere', 'char-bc-julius', 'char-bc-lucius', 'char-bc-conrad', 'char-bc-princia', 'char-bc-edward', 'char-bc-jester', 'char-bc-asta', 'char-bc-yuno'],
    locationIds: ['loc-bc-royal-capital', 'loc-bc-magic-knights-hq'],
    arcIds: ['arc-bc-grimoire-ceremony', 'arc-bc-royal-capital-assault', 'arc-bc-lucius-paladins', 'arc-bc-final-arc', 'arc-bc-movie-sword-wizard-king'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['concetto', 'imperatore-magico', 'clover'],
  },
  {
    id: 'faction-bc-grimoires',
    worldId: 'world-blackclover',
    type: 'concept',
    name: 'The grimoires',
    localizedName: { it: 'I grimori', en: 'The grimoires' },
    japaneseName: '魔導書',
    description: {
      it: "Il libro che sceglie il mago, non il contrario: ogni quindicenne ne riceve uno alla Torre dei Grimori, e il numero di foglie del quadrifoglio in copertina è diventato una scala di valore.",
      en: 'The book that chooses the mage, not the other way around: every fifteen-year-old receives one at the Grimoire Tower, and the number of leaves on the cover clover has become a scale of worth.',
    },
    longDescription: {
      it: "Tre foglie per la normalità, quattro — fede, speranza, amore e fortuna — per i prodigi come Yuno. La quinta foglia è il diavolo, e il grimorio a cinque foglie che raggiunge Asta a Hage è l'eccezione su cui si regge tutta la serie: un libro nero e polveroso per l'unico ragazzo del regno che di mana non ne ha.",
      en: "Three leaves for the ordinary, four — faith, hope, love and luck — for prodigies like Yuno. The fifth leaf is the devil, and the five-leaf grimoire that reaches Asta at Hage is the exception the whole series rests on: a black, dust-covered book for the one boy in the kingdom with no mana at all.",
    },
    characterIds: ['char-bc-asta', 'char-bc-yuno', 'char-bc-liebe', 'char-bc-licht'],
    locationIds: ['loc-bc-grimoire-tower', 'loc-bc-hage'],
    arcIds: ['arc-bc-grimoire-ceremony', 'arc-bc-spade-raid'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['concetto', 'grimorio', 'magia'],
  },
  {
    id: 'faction-bc-magic-stones',
    worldId: 'world-blackclover',
    type: 'concept',
    name: 'The magic stones',
    localizedName: { it: 'Le pietre magiche', en: 'The magic stones' },
    description: {
      it: "Le pietre sparse per il mondo che custodiscono le anime degli elfi: la posta in gioco di tutta la prima metà della serie, e la chiave del rituale della Reincarnazione.",
      en: "The stones scattered across the world that hold the elves' souls: the stake of the entire first half of the series, and the key to the Reincarnation ritual.",
    },
    longDescription: {
      it: "Nean, il Tempio Sottomarino, la Foresta delle Streghe: ogni luogo in cui l'Occhio Magico colpisce ne custodisce una. Chi le raccoglie tutte può riportare in vita un popolo intero — o, come scopre Patry troppo tardi, aprire la porta a un diavolo.",
      en: "Nean, the Undersea Temple, the Witches' Forest: every place the Eye of the Midnight Sun strikes holds one. Whoever gathers them all can bring an entire people back to life — or, as Patry finds out too late, open the door to a devil.",
    },
    characterIds: ['char-bc-patry', 'char-bc-secre', 'char-bc-zagred', 'char-bc-heath', 'char-bc-gifso', 'char-bc-witch-queen'],
    locationIds: ['loc-bc-nean', 'loc-bc-undersea-temple', 'loc-bc-witches-forest', 'loc-bc-shadow-palace'],
    arcIds: ['arc-bc-eye-midnight-sun', 'arc-bc-seabed-temple', 'arc-bc-witches-forest', 'arc-bc-elf-reincarnation'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['concetto', 'pietre-magiche', 'elfi'],
  },
  {
    id: 'faction-bc-house-roselei',
    worldId: 'world-blackclover',
    type: 'clan',
    name: 'House Roselei',
    localizedName: { it: 'Casa Roselei', en: 'House Roselei' },
    nationId: 'nation-bc-clover',
    description: {
      it: "La casa nobiliare di Charlotte Roselei: sulle sue donne pesava una maledizione che impediva loro di amare, spezzata senza saperlo da Yami Sukehiro.",
      en: "Charlotte Roselei's noble house: its women carried a curse that kept them from loving, broken unknowingly by Yami Sukehiro.",
    },
    characterIds: ['char-bc-charlotte'],
    locationIds: ['loc-bc-blue-rose-base'],
    arcIds: ['arc-bc-royal-knights-exam'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['casata', 'nobili', 'charlotte'],
  },
  {
    id: 'faction-bc-house-boismortier',
    worldId: 'world-blackclover',
    type: 'clan',
    name: 'House Boismortier',
    localizedName: { it: 'Casa Boismortier', en: 'House Boismortier' },
    nationId: 'nation-bc-clover',
    description: {
      it: "La casa nobiliare di Rill Boismortier, il capitano più giovane del regno: una famiglia che ha lasciato crescere un artista invece di un soldato.",
      en: "The noble house of Rill Boismortier, the kingdom's youngest captain: a family that let an artist grow up instead of a soldier.",
    },
    characterIds: ['char-bc-rill'],
    locationIds: ['loc-bc-aqua-deer-base'],
    arcIds: ['arc-bc-royal-knights-exam'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['casata', 'nobili', 'rill'],
  },
];
