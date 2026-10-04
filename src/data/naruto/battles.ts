import type { BattleOutcome } from '@/types';
import { battleKit } from '../shared/battleKit';

const { win, stop, draw } = battleKit('char-');
const L = (it: string, en: string) => ({ it, en });

/** Esiti degli scontri di Naruto (bilancio nella scheda personaggio). */
export const narutoBattles: Record<string, BattleOutcome> = {
  'ev-valley-end-hashirama-madara': win(['hashirama'], ['madara']),
  'ev-neji-vs-hinata': win(['neji'], ['hinata']),
  'ev-rock-lee-vs-gaara': win(['gaara'], ['rock-lee']),
  'ev-naruto-vs-gaara': win(['naruto'], ['gaara']),
  'ev-sannin-battle-tanzaku': win(['tsunade', 'jiraiya', 'naruto'], ['orochimaru', 'kabuto'], L('Orochimaru e Kabuto si ritirano.', 'Orochimaru and Kabuto retreat.')),
  'ev-kimimaro-vs-lee-gaara': stop(['rock-lee', 'gaara'], ['kimimaro'], L('Kimimaro muore per la malattia nel mezzo dell’attacco.', 'Kimimaro dies of his illness in the middle of his attack.')),
  'ev-valley-end-1': win(['sasuke'], ['naruto']),
  'ev-hidan-kakuzu': win(['hidan', 'kakuzu'], ['asuma', 'shikamaru']),
  'ev-shikamaru-vs-hidan': win(['shikamaru'], ['hidan']),
  'ev-kakuzu-defeated': win(['naruto', 'kakashi'], ['kakuzu']),
  'ev-deidara-vs-sasuke': win(['sasuke'], ['deidara'], L('Deidara si fa esplodere; Sasuke si salva con Manda.', 'Deidara blows himself up; Sasuke saves himself with Manda.')),
  'ev-jiraiya-vs-pain': win(['pain'], ['jiraiya']),
  'ev-itachi-vs-sasuke': win(['sasuke'], ['itachi'], L('Itachi muore per la malattia dopo aver tolto il sigillo maledetto a Sasuke.', "Itachi dies of his illness after removing Sasuke's cursed seal.")),
  'ev-killer-b-vs-sasuke': stop(['sasuke'], ['killer-b'], L('Taka crede di averlo catturato, ma Killer B è fuggito lasciando un tentacolo.', 'Taka believes it has captured him, but Killer B has escaped, leaving a tentacle behind.')),
  'ev-kakashi-dies-pain': win(['pain'], ['kakashi']),
  'ev-naruto-vs-pain-ame': win(['naruto'], ['pain']),
  'ev-danzo-vs-sasuke': win(['sasuke'], ['danzo']),
  'ev-konan-defeat': win(['obito'], ['konan']),
  'ev-kisame-captured': win(['guy'], ['kisame']),
  'ev-mifune-vs-hanzo': win(['mifune'], ['hanzo']),
  'ev-gaara-onoki-vs-madara': win(['madara'], ['gaara', 'onoki', 'a', 'mei', 'tsunade']),
  'ev-itachi-nagato': win(['itachi', 'naruto', 'killer-b'], ['nagato']),
  'ev-kabuto-vs-itachi': win(['itachi', 'sasuke'], ['kabuto']),
  'ev-obito-vs-kakashi': win(['kakashi'], ['obito']),
  'ev-team-7-vs-kaguya': win(['naruto', 'sasuke', 'sakura', 'kakashi'], ['kaguya']),
  'ev-valley-end-2': draw(['naruto'], ['sasuke'], L('Entrambi perdono un braccio; Sasuke si dichiara sconfitto.', 'Both lose an arm; Sasuke admits defeat.')),
  'ev-boro-battle': win(['boruto', 'sarada', 'mitsuki', 'kawaki'], ['boro']),
  'ev-hiruzen-vs-orochimaru': stop(['hiruzen'], ['orochimaru'], L('Hiruzen muore sigillando le braccia di Orochimaru.', "Hiruzen dies sealing Orochimaru's arms.")),
  'ev-sasuke-reunion-hideout': stop(['naruto', 'sakura', 'sai', 'yamato'], ['sasuke']),
  'ev-kakashi-vs-zabuza-haku-edo': win(['kakashi'], ['zabuza', 'haku']),
  'ev-darui-vs-gold-silver': win(['darui'], ['kinkaku', 'ginkaku']),
};
