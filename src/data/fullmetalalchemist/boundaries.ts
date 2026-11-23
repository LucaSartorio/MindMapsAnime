import type { MapBoundary } from '@/types';
import { FMA_AREA_GEOMETRY, type FmaAreaKey } from './boundaryGeometry';

/**
 * Le cinque aree di Amestris come confini della world map (`fma-map-world`, piano 1500 × 1000).
 * Geometria (`svgPathD`, `labelPosition`) GENERATA da `scripts/mapgen/fullmetalalchemist.py` in
 * `boundaryGeometry.ts`: una sola fonte di verità con l'SVG disegnato. Testi a mano, limitati ai fatti
 * delle fonti S4, S5 (cinque aree: Centrale + Nord/Est/Sud/Ovest; Ishval a Est; Briggs a Nord sul confine
 * con la Drachma). I contorni sono schematici: nessuna fonte documenta la forma delle aree.
 */
const SCHEMATIC = {
  it: 'Il contorno di quest\'area è schematico e indicativo: l\'opera non documenta la forma né i confini interni delle aree di Amestris.',
  en: 'This area\'s outline is schematic and indicative: the work does not document the shape or the internal borders of Amestris\'s areas.',
};

const area = (
  key: FmaAreaKey,
  b: Pick<MapBoundary, 'slug' | 'name' | 'localizedName' | 'color' | 'descriptionShort' | 'relatedLocationIds'>,
): MapBoundary => ({
  id: `bnd-fma-${key}`,
  worldId: 'world-fullmetalalchemist',
  mapLevelId: 'fma-map-world',
  type: 'region',
  canonStatus: 'canon',
  referenceStatus: 'verified',
  svgPathD: FMA_AREA_GEOMETRY[key].svgPathD,
  labelPosition: FMA_AREA_GEOMETRY[key].labelPosition,
  nationId: 'nation-fma-amestris',
  descriptionLong: SCHEMATIC,
  tags: ['area'],
  ...b,
});

export const fmaBoundaries: MapBoundary[] = [
  area('central', {
    slug: 'central-area',
    name: 'Central Area',
    localizedName: { it: 'Area Centrale', en: 'Central Area' },
    color: '#8c2f3a',
    descriptionShort: {
      it: 'L\'area centrale di Amestris, che comprende la capitale Central City.',
      en: 'The central area of Amestris, which contains the capital Central City.',
    },
    relatedLocationIds: ['loc-fma-central-city'],
  }),
  area('north', {
    slug: 'north-area',
    name: 'North Area',
    localizedName: { it: 'Area Nord', en: 'North Area' },
    color: '#3f6f95',
    descriptionShort: {
      it: 'L\'area settentrionale di Amestris. Il suo punto più a nord, sul confine con la Drachma, è Fort Briggs.',
      en: 'The northern area of Amestris. Its northernmost point, on the Drachma border, is Fort Briggs.',
    },
    relatedLocationIds: ['loc-fma-fort-briggs'],
  }),
  area('east', {
    slug: 'east-area',
    name: 'East Area',
    localizedName: { it: 'Area Est', en: 'East Area' },
    color: '#a8802f',
    descriptionShort: {
      it: 'L\'area orientale di Amestris, in cui si trova Ishval.',
      en: 'The eastern area of Amestris, where Ishval lies.',
    },
    relatedLocationIds: ['loc-fma-ishval'],
  }),
  area('south', {
    slug: 'south-area',
    name: 'South Area',
    localizedName: { it: 'Area Sud', en: 'South Area' },
    color: '#4f8a5e',
    descriptionShort: {
      it: 'L\'area meridionale di Amestris; a sud del paese si trova Aerugo.',
      en: 'The southern area of Amestris; Aerugo lies to the south of the country.',
    },
    relatedLocationIds: [],
  }),
  area('west', {
    slug: 'west-area',
    name: 'West Area',
    localizedName: { it: 'Area Ovest', en: 'West Area' },
    color: '#7b5b98',
    descriptionShort: {
      it: 'L\'area occidentale di Amestris; a ovest del paese si trova Creta. Sul confine con Creta sorge Table City, nel film «La Stella Sacra di Milos».',
      en: 'The western area of Amestris; Creta lies to the west of the country. Table City, in the film \'The Sacred Star of Milos\', stands on the border with Creta.',
    },
    relatedLocationIds: ['loc-fma-table-city'],
  }),
];
