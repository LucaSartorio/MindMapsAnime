import type { Localizable } from '@/types';

/**
 * Periodi narrativi condivisi da eventi e step dei percorsi (filtro «periodo»
 * della timeline). Valori fissi: un evento usa SEMPRE uno di questi oggetti,
 * così il filtro non si frammenta in varianti dello stesso testo.
 */
export const P = {
  primordial: { it: 'Un milione di anni prima', en: 'A million years earlier' },
  thousand: { it: 'Mille anni prima', en: 'A thousand years earlier' },
  ancient: { it: 'Prima della storia', en: 'Before the story' },
  pendulum: { it: '110 anni prima', en: '110 years earlier' },
  decades: { it: 'Decenni prima', en: 'Decades earlier' },
  twenty: { it: 'Circa vent’anni prima', en: 'About twenty years earlier' },
  childhood: { it: 'Infanzia di Ichigo', en: "Ichigo's childhood" },
  agent: { it: 'Sostituto Shinigami', en: 'Substitute Soul Reaper' },
  soulSociety: { it: 'Soul Society', en: 'Soul Society' },
  arrancar: { it: 'Arrancar', en: 'Arrancar' },
  fullbring: { it: 'Fullbring', en: 'Fullbring' },
  bloodWar: { it: 'Guerra dei Mille Anni', en: 'Thousand-Year Blood War' },
  epilogue: { it: 'Dieci anni dopo', en: 'Ten years later' },
  hell: { it: 'Dopo la guerra · Inferno', en: 'After the war · Hell' },
  filler: { it: 'Archi originali dell’anime', en: 'Anime-original arcs' },
} satisfies Record<string, Localizable>;
