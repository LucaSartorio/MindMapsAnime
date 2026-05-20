import type { Nation } from '@/types';

/**
 * Nazioni principali dell'universo Naruto.
 * Dati seed orientativi: le posizioni esatte sulle mappe non ufficiali
 * vanno verificate prima della pubblicazione.
 */
export const narutoNations: Nation[] = [
  {
    id: 'nation-fire',
    worldId: 'world-naruto',
    name: 'Land of Fire',
    nameLocal: 'Hi no Kuni',
    description:
      'Una delle più grandi nazioni del continente, foreste dense e clima caldo. Sede di Konohagakure.',
    capitalLocationId: 'loc-konoha',
    color: '#f06600',
    tags: ['paese-onorevole', 'foreste', 'hokage'],
  },
  {
    id: 'nation-wind',
    worldId: 'world-naruto',
    name: 'Land of Wind',
    nameLocal: 'Kaze no Kuni',
    description:
      'Vasti deserti e dune. Casa del Kazekage e di Sunagakure.',
    capitalLocationId: 'loc-suna',
    color: '#d4be78',
    tags: ['deserto', 'sabbia'],
  },
  {
    id: 'nation-water',
    worldId: 'world-naruto',
    name: 'Land of Water',
    nameLocal: 'Mizu no Kuni',
    description:
      'Arcipelago di isole nebbiose, sede di Kirigakure.',
    capitalLocationId: 'loc-kiri',
    color: '#4cb6ff',
    tags: ['isole', 'nebbia'],
  },
  {
    id: 'nation-earth',
    worldId: 'world-naruto',
    name: 'Land of Earth',
    nameLocal: 'Tsuchi no Kuni',
    description:
      'Terre rocciose e canyon. Sede di Iwagakure.',
    capitalLocationId: 'loc-iwa',
    color: '#963c03',
    tags: ['rocce', 'tsuchikage'],
  },
  {
    id: 'nation-lightning',
    worldId: 'world-naruto',
    name: 'Land of Lightning',
    nameLocal: 'Kaminari no Kuni',
    description:
      'Montagne aspre, alte tensioni. Sede di Kumogakure.',
    capitalLocationId: 'loc-kumo',
    color: '#1f9aff',
    tags: ['montagne', 'raikage'],
  },
];
