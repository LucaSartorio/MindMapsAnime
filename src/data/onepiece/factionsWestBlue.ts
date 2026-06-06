import type { Faction } from '@/types';

/** Fazioni legate a West Blue: gli studiosi di Ohara e i Pirati di Rocks. */
export const onepieceFactionsWestBlue: Faction[] = [
  {
    id: 'faction-op-ohara-scholars',
    worldId: 'world-onepiece',
    type: 'organization',
    name: 'Ohara Scholars',
    localizedName: { it: 'Studiosi di Ohara', en: 'Ohara Scholars' },
    description: {
      it: "Gli archeologi dell'Albero della Conoscenza di Ohara, gli unici capaci di decifrare i Poneglyph e di indagare il Secolo Vuoto. Sterminati dal Buster Call del Governo Mondiale.",
      en: "The archaeologists of Ohara's Tree of Knowledge, the only ones able to decipher the Poneglyphs and investigate the Void Century. Exterminated by the World Government's Buster Call.",
    },
    leaderIds: ['char-op-clover'],
    characterIds: ['char-op-clover', 'char-op-olvia', 'char-op-robin'],
    locationIds: ['loc-op-ohara'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['ohara', 'archeologi', 'west-blue'],
  },
  {
    id: 'faction-op-rocks-pirates',
    worldId: 'world-onepiece',
    type: 'crew',
    name: 'Rocks Pirates',
    localizedName: { it: 'Pirati di Rocks', en: 'Rocks Pirates' },
    description: {
      it: "La ciurma di Rocks D. Xebec, attiva 40 anni prima della storia: un equipaggio che riuniva futuri leggendari (Barbabianca, Kaido, Big Mom, Shiki) e che ambiva a dominare il mondo. Si dissolse a God Valley.",
      en: "Rocks D. Xebec's crew, active 40 years before the story: a band that gathered future legends (Whitebeard, Kaido, Big Mom, Shiki) and sought to rule the world. It dissolved at God Valley.",
    },
    leaderIds: ['char-op-rocks'],
    characterIds: ['char-op-rocks'],
    locationIds: ['loc-op-god-valley'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['ciurma', 'rocks', 'god-valley'],
  },
];
