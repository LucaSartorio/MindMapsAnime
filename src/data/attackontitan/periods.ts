import type { Localizable } from '@/types';

/**
 * Periodi della timeline (valori fissi, così il filtro non si frammenta). Gli anni
 * sono quelli del calendario delle Mura usato dalla serie.
 */
export const P = {
  ymir: { it: '2.000 anni prima', en: '2,000 years earlier' },
  empire: { it: 'Impero eldiano', en: 'Eldian Empire' },
  titanWar: { it: 'Grande Guerra dei Giganti (~743)', en: 'Great Titan War (~743)' },
  grisha: { it: 'Giovinezza di Grisha (anni 820-830)', en: "Grisha's youth (820s-830s)" },
  before845: { it: 'Prima dell\'845', en: 'Before 845' },
  y845: { it: 'Anno 845', en: 'Year 845' },
  training: { it: 'Anni 846-849', en: 'Years 846-849' },
  y850: { it: 'Anno 850', en: 'Year 850' },
  y851: { it: 'Anni 851-853', en: 'Years 851-853' },
  y854: { it: 'Anno 854', en: 'Year 854' },
  rumbling: { it: 'Il Boato della Terra (854)', en: 'The Rumbling (854)' },
  after: { it: 'Dopo la guerra (857 e oltre)', en: 'After the war (857 onwards)' },
} satisfies Record<string, Localizable>;
