import type { Jutsu } from '@/types';

/**
 * Tecniche ninja Naruto · Batch 4 — coda finale.
 *
 * Tecniche ricorrenti del cast principale che mancavano:
 * - Multi Shadow Clone (variante massiva del Kage Bunshin)
 * - Tsuga (Inuzuka)
 * - Body Pathway Derangement (Shikamaru)
 * - Mind Body Switch Reversal (Yamanaka)
 * - Lightning Release: Wave (Sasuke giovane)
 */
export const narutoJutsuBatch4: Jutsu[] = [
  {
    id: 'jutsu-multi-shadow-clone',
    worldId: 'world-naruto',
    name: 'Multi Shadow Clone Technique',
    localizedName: {
      it: 'Tecnica della Moltiplicazione di Cloni Ombra',
      en: 'Multi Shadow Clone Technique',
    },
    japaneseName: '多重影分身の術 (Tajū Kage Bunshin no Jutsu)',
    type: 'ninjutsu',
    classification: ['clone', 'kekkei_genkai'],
    chakraNature: ['yin'],
    rank: 'A',
    characterIds: ['char-naruto'],
    series: ['naruto', 'shippuden', 'boruto'],
    shortDescription: {
      it: 'Variante massiva del Kage Bunshin: il chakra è suddiviso fra centinaia di cloni anziché pochi. Tecnica firma di Naruto grazie alle riserve di Kurama.',
      en: 'Massive variant of the Shadow Clone Technique: chakra is split across hundreds of clones rather than a few. Naruto\'s signature thanks to Kurama\'s reserves.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['naruto', 'clone', 'kage-bunshin'],
  },
  {
    id: 'jutsu-tsuga',
    worldId: 'world-naruto',
    name: 'Passing Fang (Tsūga)',
    localizedName: { it: 'Zanna su Zanna (Tsūga)', en: 'Passing Fang (Tsūga)' },
    japaneseName: '通牙',
    type: 'taijutsu',
    classification: ['kekkei_genkai', 'offensive'],
    rank: 'C',
    characterIds: ['char-kiba'],
    clanIds: ['clan-inuzuka'],
    series: ['naruto', 'shippuden'],
    shortDescription: {
      it: 'Tecnica base del clan Inuzuka: l\'utente ruota su sé stesso a grande velocità trasformandosi in una trapanatrice di carne, spesso in coppia col proprio ninken.',
      en: 'Inuzuka clan staple: the user spins at high speed turning into a drilling projectile, often performed in pair with the ninken.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['inuzuka', 'taijutsu'],
  },
  {
    id: 'jutsu-body-pathway-derangement',
    worldId: 'world-naruto',
    name: 'Body Pathway Derangement',
    localizedName: {
      it: 'Disordine dei Percorsi Corporei',
      en: 'Body Pathway Derangement',
    },
    japaneseName: '体内経絡攪乱',
    type: 'ninjutsu',
    classification: ['supplementary', 'medical'],
    chakraNature: ['lightning'],
    rank: 'A',
    characterIds: ['char-kakashi'],
    series: ['shippuden'],
    shortDescription: {
      it: 'Tecnica medica di Kakashi: invia un impulso elettrico mirato che incrocia i segnali nervosi del nemico, ribaltando il senso dei suoi movimenti.',
      en: 'Kakashi\'s medical technique: sends a precise electric pulse that crosses the target\'s nerve signals, reversing the intent of every motion.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['kakashi', 'lightning', 'medical'],
  },
  {
    id: 'jutsu-mind-body-switch-reversal',
    worldId: 'world-naruto',
    name: 'Mind Body Switch Reversal',
    localizedName: {
      it: 'Inversione dello Scambio Mente-Corpo',
      en: 'Mind Body Switch Reversal',
    },
    japaneseName: '心転身の術返し',
    type: 'ninjutsu',
    classification: ['kekkei_genkai', 'supplementary'],
    chakraNature: ['yin'],
    rank: 'B',
    characterIds: ['char-ino'],
    clanIds: ['clan-yamanaka'],
    series: ['shippuden'],
    shortDescription: {
      it: 'Contro-tecnica Yamanaka che ritorce contro l\'aggressore una tecnica di possessione mentale, intrappolandone la coscienza nel proprio corpo.',
      en: 'Yamanaka counter that turns a mind-possession technique back on the attacker, trapping their consciousness inside their own body.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['yamanaka', 'mind'],
  },
  {
    id: 'jutsu-perfect-susanoo',
    worldId: 'world-naruto',
    name: 'Complete Body — Susanoo',
    localizedName: {
      it: 'Susanoo Perfetto (Corpo Completo)',
      en: 'Complete Body — Susanoo',
    },
    japaneseName: '完成体須佐能乎',
    type: 'doujutsu',
    classification: ['kekkei_genkai', 'dojutsu', 'offensive', 'defensive'],
    chakraNature: ['yin', 'yang'],
    rank: 'S',
    characterIds: ['char-madara', 'char-sasuke', 'char-itachi'],
    clanIds: ['clan-uchiha'],
    series: ['shippuden'],
    shortDescription: {
      it: 'Stadio supremo del Susanoo, una gigantesca armatura-samurai di chakra capace di abbattere un Tailed Beast. Solo gli Uchiha con il Mangekyō Eterno possono evocarla.',
      en: 'Ultimate stage of Susanoo, a colossal samurai-armor of chakra strong enough to fell a Tailed Beast. Only Uchiha with the Eternal Mangekyō can summon it.',
    },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['uchiha', 'mangekyo', 'susanoo'],
  },
];
