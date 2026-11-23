import type { Location } from '@/types';

/**
 * Luoghi di Fullmetal Alchemist (batch 4, perimetro ridotto): SOLO quelli la cui area è documentata (S4, S5, S6).
 * Non compaiono (posizione non documentata): Resembool, Liore, Youswell, le città capoluogo, Dublith, Rush Valley,
 * Baschool, Xenotime, le rovine di Xerxes, il Quinto Laboratorio, le ferrovie.
 *
 * `x`/`y` sono scritte da `apply_pins` del generatore `scripts/mapgen/fullmetalalchemist.py` (dizionario `PINS`,
 * piano 1500 × 1000): non modificarle a mano. Il posto esatto dentro l'area è schematico.
 * `eventIds`/`arcIds` non sono salvati qui: derivano dal `locationId` degli eventi.
 */
const loc = (l: Omit<Location, 'worldId' | 'mapLevelId' | 'nationId' | 'canonStatus' | 'referenceStatus'> &
  Partial<Pick<Location, 'canonStatus' | 'referenceStatus'>>): Location => ({
  worldId: 'world-fullmetalalchemist',
  mapLevelId: 'fma-map-world',
  nationId: 'nation-fma-amestris',
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...l,
});

export const fmaLocations: Location[] = [
  loc({
    id: 'loc-fma-central-city',
    name: 'Central City',
    type: 'city',
    x: 752,
    y: 590,
    importance: 'main',
    boundaryId: 'bnd-fma-central',
    shortDescription: {
      it: 'La capitale di Amestris, nell\'Area Centrale.',
      en: 'The capital of Amestris, in the Central Area.',
    },
    tags: ['capitale'],
  }),
  loc({
    id: 'loc-fma-fort-briggs',
    name: 'Fort Briggs',
    type: 'landmark',
    x: 640,
    y: 246,
    importance: 'main',
    boundaryId: 'bnd-fma-north',
    characterIds: ['char-fma-olivier-mira-armstrong'],
    shortDescription: {
      it: 'Fortezza nel punto più a nord dell\'Area Nord, sul confine con la Drachma, costruita attraverso una valle di montagna e comandata da Olivier Mira Armstrong.',
      en: 'A fortress at the northernmost point of the North Area, on the Drachma border, built across a mountain valley and commanded by Olivier Mira Armstrong.',
    },
    tags: ['fortezza', 'confine'],
  }),
  loc({
    id: 'loc-fma-ishval',
    name: 'Ishval',
    type: 'region',
    x: 1070,
    y: 610,
    importance: 'main',
    boundaryId: 'bnd-fma-east',
    referenceStatus: 'needs_verification',
    shortDescription: {
      it: 'La terra degli ishvaliani, nell\'Area Est di Amestris. La posizione precisa dentro l\'area non è documentata: il pin è indicativo.',
      en: 'The land of the Ishvalans, in the East Area of Amestris. Its exact position inside the area is not documented: the pin is indicative.',
    },
    tags: ['ishval'],
  }),
  loc({
    id: 'loc-fma-table-city',
    name: 'Table City',
    type: 'region',
    x: 356,
    y: 604,
    importance: 'secondary',
    boundaryId: 'bnd-fma-west',
    canonStatus: 'movie',
    shortDescription: {
      it: 'Zona remota sul confine fra Amestris e Creta, raggiungibile in treno, nel film «La Stella Sacra di Milos» (2011). La Valle di Milos si trova nei dintorni, attorno e al di sotto.',
      en: 'A remote area on the Amestris-Creta border, reached by train, in the film \'The Sacred Star of Milos\' (2011). The Valley of Milos lies around and below it.',
    },
    tags: ['film', 'milos', 'confine'],
  }),
];
