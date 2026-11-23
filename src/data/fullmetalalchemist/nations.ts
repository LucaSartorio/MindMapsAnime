import type { Nation } from '@/types';

/**
 * Nazioni di Fullmetal Alchemist (batch 4, perimetro ridotto): Amestris e i quattro vicini citati dalle fonti.
 * Fonti (`docs/world-pipeline/fullmetalalchemist.md`): S4, S5 (aree, vicini, Drachma più grande, Briggs sul confine
 * con la Drachma), S6 (Table City sul confine con Creta). Xing a est oltre un deserto è solo S8 (community):
 * `needs_verification`. Aerugo: solo la direzione (sud). Nessun'altra informazione politica è documentata qui.
 * `labelPosition` sul piano 1500 × 1000 della mappa del mondo, come le etichette disegnate nell'SVG.
 */
const nation = (n: Omit<Nation, 'worldId' | 'canonStatus' | 'referenceStatus'> & Partial<Pick<Nation, 'referenceStatus'>>): Nation => ({
  worldId: 'world-fullmetalalchemist',
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...n,
});

export const fmaNations: Nation[] = [
  nation({
    id: 'nation-fma-amestris',
    name: 'Amestris',
    type: 'great_nation',
    description: {
      it: 'Paese senza sbocco sul mare, diviso in cinque aree: Centrale, con la capitale Central City, e Nord, Est, Sud e Ovest.',
      en: 'A landlocked country divided into five areas: Central, with the capital Central City, and North, East, South and West.',
    },
    capitalLocationId: 'loc-fma-central-city',
    relatedLocationIds: ['loc-fma-central-city', 'loc-fma-fort-briggs', 'loc-fma-ishval', 'loc-fma-table-city'],
    labelPosition: { x: 752, y: 468 },
    color: '#8c2f3a',
    tags: ['amestris'],
  }),
  nation({
    id: 'nation-fma-drachma',
    name: 'Drachma',
    type: 'great_nation',
    description: {
      it: 'Paese a nord di Amestris, più grande di quest\'ultimo. Sul confine fra i due si trovano i Monti Briggs.',
      en: 'The country north of Amestris, larger than Amestris itself. The Briggs mountains lie on the border between the two.',
    },
    labelPosition: { x: 820, y: 80 },
    color: '#3b4757',
    tags: ['vicino'],
  }),
  nation({
    id: 'nation-fma-creta',
    name: 'Creta',
    type: 'minor_nation',
    description: {
      it: 'Paese confinante a ovest di Amestris.',
      en: 'The neighbouring country to the west of Amestris.',
    },
    labelPosition: { x: 166, y: 520 },
    color: '#4a4a38',
    tags: ['vicino'],
  }),
  nation({
    id: 'nation-fma-aerugo',
    name: 'Aerugo',
    type: 'minor_nation',
    description: {
      it: 'Paese confinante a sud di Amestris. Delle sue dimensioni e dei suoi confini non è documentato altro.',
      en: 'The neighbouring country to the south of Amestris. Nothing else about its size or borders is documented here.',
    },
    labelPosition: { x: 750, y: 905 },
    color: '#40504d',
    tags: ['vicino'],
  }),
  nation({
    id: 'nation-fma-xing',
    name: 'Xing',
    type: 'uncertain',
    description: {
      it: 'Paese a est di Amestris, oltre un deserto. La posizione deriva da una sola fonte della community e resta da verificare.',
      en: 'A country east of Amestris, beyond a desert. The position comes from a single community source and still needs verification.',
    },
    referenceStatus: 'needs_verification',
    labelPosition: { x: 1432, y: 520 },
    color: '#5b4a2c',
    tags: ['vicino'],
  }),
];
