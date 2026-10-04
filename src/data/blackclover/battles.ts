import type { BattleOutcome } from '@/types';
import { battleKit } from '../shared/battleKit';

const { win } = battleKit('char-bc-');

/** Esiti degli scontri di Black Clover (bilancio nella scheda personaggio). */
export const bcBattles: Record<string, BattleOutcome> = {
  'evt-bc-lumiere-vs-licht': win(['lumiere'], ['licht']),
  'evt-bc-asta-vs-sekke': win(['asta'], ['sekke']),
  'evt-bc-asta-vs-mars': win(['asta', 'yuno'], ['mars']),
  'evt-bc-asta-vs-vetto': win(['asta', 'noelle', 'yami'], ['vetto']),
  'evt-bc-asta-vs-ladros': win(['asta', 'mars'], ['ladros']),
  'evt-bc-yami-vs-licht': win(['patry'], ['yami']),
  'evt-bc-mereoleona-vs-rufel': win(['mereoleona'], ['rufel']),
  'evt-bc-asta-vs-zagred': win(['asta', 'licht'], ['zagred']),
  'evt-bc-gaja-vs-vanica': win(['vanica'], ['gaja']),
  'evt-bc-asta-vs-dante': win(['asta', 'yami'], ['dante']),
  'evt-bc-yuno-vs-zenon': win(['yuno', 'langris'], ['zenon']),
  'evt-bc-noelle-vs-vanica': win(['noelle'], ['vanica']),
  'evt-bc-captains-vs-lucifero': win(['lucifero'], ['mereoleona', 'nozel', 'yuno', 'noelle', 'charlotte', 'jack']),
  'evt-bc-asta-vs-lily': win(['asta'], ['lily']),
};
