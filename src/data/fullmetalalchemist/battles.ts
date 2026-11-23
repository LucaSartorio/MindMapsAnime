import type { BattleOutcome } from '@/types';
import { battleKit } from '../shared/battleKit';

const { win, stop } = battleKit('char-fma-');
const L = (it: string, en: string) => ({ it, en });

/**
 * Esiti degli scontri di Fullmetal Alchemist (bilancio nella scheda personaggio), solo dove le fonti
 * (riassunti di Brotherhood S16, voci Wikipedia S6/S9/S10, descrizioni degli eventi) dichiarano l'esito.
 * Scontri senza esito dichiarato o con un combattente senza scheda non compaiono (Quinto Laboratorio:
 * Barry e Slicer senza scheda; Greed vs Edward a Dublith; Edward vs Envy nel ventre di Gluttony;
 * Alphonse vs Pride e Kimblee; assalto di Bradley a Central; scontro di Hohenheim con Father).
 * `sides` ⊂ `characterIds` di ogni evento: nessun evento è stato modificato.
 */
export const fmaBattles: Record<string, BattleOutcome> = {
  'evt-fma-scar-attacks-elrics': stop(
    ['scar'],
    ['edward-elric', 'alphonse-elric', 'roy-mustang', 'alex-louis-armstrong'],
    L('Scar ferisce Alphonse e distrugge il braccio di Edward; all\'arrivo di Mustang e Armstrong fugge.', 'Scar wounds Alphonse and destroys Edward\'s arm; when Mustang and Armstrong arrive he escapes.'),
  ),
  'evt-fma-bradley-raids-greeds-hideout': win(
    ['king-bradley'],
    ['greed'],
    L('Greed è ridotto a una pietra, che Father assorbe.', 'Greed is reduced to a stone, which Father absorbs.'),
  ),
  'evt-fma-mustang-kills-lust': win(['roy-mustang'], ['lust'], L('Lust si riduce in cenere.', 'Lust crumbles to ash.')),
  'evt-fma-olivier-and-sloth': stop(
    ['olivier-mira-armstrong'],
    ['sloth'],
    L('Olivier e i suoi soldati bloccano Sloth congelandolo: non è sconfitto.', 'Olivier and her troops halt Sloth by freezing him: he is not defeated.'),
  ),
  'evt-fma-briggs-repels-drachma': win(
    ['olivier-mira-armstrong'],
    ['solf-j-kimblee'],
    L('Il presidio di Briggs respinge l\'attacco condotto con l\'esercito di Drachma.', 'The Briggs garrison repels the attack launched together with the Drachman army.'),
  ),
  'evt-fma-sloth-killed': win(
    ['alex-louis-armstrong', 'olivier-mira-armstrong', 'izumi-curtis'],
    ['sloth'],
    L('Nell\'ultimo tratto dello scontro si uniscono Izumi e Sig, che non ha una scheda.', 'Izumi and Sig, who has no page, join the final stretch of the fight.'),
  ),
  'evt-fma-mustang-burns-envy': stop(
    ['roy-mustang'],
    ['envy'],
    L('Edward ferma Mustang; Envy distrugge da solo la propria pietra.', 'Edward stops Mustang; Envy destroys his own stone.'),
  ),
  'evt-fma-scar-kills-bradley': win(['scar'], ['king-bradley']),
  'evt-fma-pride-destroyed': win(
    ['edward-elric'],
    ['pride'],
    L('Pride è ridotto a un neonato privo di poteri.', 'Pride is reduced to a powerless infant.'),
  ),
  'evt-fma-final-battle-father-defeated': win(
    ['edward-elric', 'alphonse-elric', 'greed'],
    ['father'],
    L('Greed si sacrifica per indebolire Father; Edward lo manda oltre il Portale.', 'Greed sacrifices himself to weaken Father; Edward sends him through the Gate.'),
  ),
  'evt-fma-milos-lava-and-independence': win(
    ['ashleigh-crichton'],
    ['melvin-voyager'],
    L('Ashleigh uccide Atlas, che si faceva chiamare Melvin Voyager.', 'Ashleigh kills Atlas, who had been posing as Melvin Voyager.'),
  ),
};
