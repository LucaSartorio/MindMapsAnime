import type { Jutsu } from '@/types';

/** Frutti del Diavolo aggiuntivi legati ai nuovi personaggi. */
const G = (
  id: string, name: string, ln: { it: string; en: string },
  type: 'paramecia' | 'zoan' | 'logia', characterIds: string[],
  it: string, en: string, tags: string[] = [],
  referenceStatus: 'verified' | 'needs_verification' = 'verified',
): Jutsu => ({
  id, worldId: 'world-onepiece', name, localizedName: ln, type, characterIds,
  shortDescription: { it, en }, canonStatus: 'canon', referenceStatus,
  tags: ['frutto-del-diavolo', type, ...tags],
});

export const onepieceDevilFruitsExtra2: Jutsu[] = [
  G('fruit-op-pamu-pamu', 'Pamu Pamu no Mi', { it: 'Frutto Esplosione Esplosione', en: 'Pop-Pop Fruit' }, 'paramecia', ['char-op-gladius'],
    'Permette di «gonfiare» e far esplodere qualsiasi cosa, dal terreno ai propri capelli: il potere di Gladius dei Donquijote.',
    "Lets one 'inflate' and detonate anything, from the ground to one's own hair: Gladius of the Donquixote.", ['donquijote', 'dressrosa']),
  G('fruit-op-buki-buki', 'Buki Buki no Mi', { it: 'Frutto Arma Arma', en: 'Weapon-Weapon Fruit' }, 'paramecia', ['char-op-baby-5'],
    'Trasforma qualsiasi parte del corpo in armi — pistole, falci, cannoni: il potere di Baby 5 dei Donquijote.',
    'Turns any body part into weapons — guns, scythes, cannons: Baby 5 of the Donquixote.', ['donquijote', 'dressrosa']),
  G('fruit-op-guru-guru', 'Guru Guru no Mi', { it: 'Frutto Rotazione Rotazione', en: 'Spin-Spin Fruit' }, 'paramecia', [],
    'Permette di far ruotare vorticosamente le proprie membra come eliche per volare e attaccare: il potere di Buffalo.',
    'Lets one spin limbs like propellers to fly and attack: the power of Buffalo of the Donquixote.', ['donquijote', 'dressrosa'], 'needs_verification'),
  G('fruit-op-shima-shima', 'Shima Shima no Mi', { it: 'Frutto Isola Isola', en: 'Island-Island Fruit' }, 'paramecia', ['char-op-pizarro'],
    "Permette di fondersi e controllare un'intera isola, manovrandone il terreno: il potere di Avalo Pizarro di Barbanera.",
    "Lets one merge with and control an entire island, manipulating its terrain: Avalo Pizarro of the Blackbeard Pirates.", ['barbanera']),
  G('fruit-op-toki-toki', 'Toki Toki no Mi', { it: 'Frutto Tempo Tempo', en: 'Time-Time Fruit' }, 'paramecia', ['char-op-toki'],
    'Permette di proiettare sé stessi e gli altri in avanti nel tempo: il potere con cui Kozuki Toki salvò il futuro di Wano.',
    "Lets one send oneself and others forward in time: the power with which Kozuki Toki saved Wano's future.", ['wano', 'kozuki']),
  G('fruit-op-uma-uma-pegasus', 'Uma Uma no Mi, Model: Pegasus', { it: 'Frutto Cavallo Cavallo (Pegaso)', en: 'Horse-Horse Fruit (Pegasus)' }, 'zoan', [],
    "Zoan mitologico del cavallo alato Pegaso, mangiato da Stronger, il cavallo del medico di Barbanera Doc Q.",
    "Mythical Zoan of the winged horse Pegasus, eaten by Stronger, the horse of Blackbeard's doctor Doc Q.", ['barbanera', 'mitologico'], 'needs_verification'),
];
