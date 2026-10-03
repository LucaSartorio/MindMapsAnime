import type { Localizable } from '@/types';

/**
 * Periodi della timeline (valori fissi, così il filtro non si frammenta). La serie
 * data con precisione i suoi eventi chiave: la Parata della Notte il 24 dicembre 2017,
 * l'Incidente di Shibuya il 31 ottobre 2018, lo scontro di Shinjuku il 24 dicembre 2018.
 */
export const P = {
  heian: { it: 'Era Heian (oltre 1.000 anni fa)', en: 'Heian era (over 1,000 years ago)' },
  meiji: { it: 'Era Meiji (circa 150 anni fa)', en: 'Meiji era (about 150 years ago)' },
  past: { it: 'Prima del 2006', en: 'Before 2006' },
  y2006: { it: '2006-2007', en: '2006-2007' },
  y2017: { it: '2017', en: '2017' },
  y2018: { it: '2018 · prima di Shibuya', en: '2018 · before Shibuya' },
  shibuya: { it: '31 ottobre 2018 · Shibuya', en: '31 October 2018 · Shibuya' },
  culling: { it: 'Novembre-dicembre 2018 · Culling Game', en: 'November-December 2018 · Culling Game' },
  shinjuku: { it: '24 dicembre 2018 · Shinjuku', en: '24 December 2018 · Shinjuku' },
  after: { it: '2019 · dopo la guerra', en: '2019 · after the war' },
} satisfies Record<string, Localizable>;
