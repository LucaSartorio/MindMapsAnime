import type { ChakraNature } from '@/types';

/**
 * Override canonici delle nature del chakra per i personaggi principali.
 *
 * Le nature elencate vengono prese **dal databook ufficiale** o da scene
 * canoniche del manga. Per chi non è qui, il sistema deduce le nature
 * dai jutsu collegati (vedi `getCharacterChakraNatures`).
 *
 * Ordine: nature principali prima, supplementari poi.
 */
export const NARUTO_CHAKRA_OVERRIDES: Record<string, ChakraNature[]> = {
  /* ===================== Team 7 ===================== */
  'char-naruto': ['wind', 'yin', 'yang'],
  'char-sasuke': ['lightning', 'fire', 'yin', 'yang'],
  'char-sakura': ['earth', 'water', 'yin'],
  'char-kakashi': ['lightning', 'water', 'earth', 'fire', 'wind', 'yin', 'yang'],
  'char-sai': ['earth', 'water', 'yin'],
  'char-yamato': ['water', 'earth', 'wood'],

  /* ===================== Konoha 11 ===================== */
  'char-shikamaru': ['fire', 'earth', 'yin'],
  'char-choji': ['earth', 'yang'],
  'char-ino': ['water', 'fire', 'yin'],
  'char-hinata': ['fire', 'lightning', 'water', 'yin'],
  'char-kiba': ['earth'],
  'char-shino': ['earth'],
  'char-rock-lee': [],
  'char-tenten': ['fire'],
  'char-neji': ['fire', 'water', 'earth'],

  /* ===================== Sannin ===================== */
  'char-jiraiya': ['fire', 'earth', 'wind', 'water', 'yang'],
  'char-tsunade': ['water', 'earth', 'yang'],
  'char-orochimaru': ['fire', 'wind', 'earth', 'water', 'yin', 'yang'],

  /* ===================== Hokage storici ===================== */
  'char-hashirama': ['fire', 'water', 'earth', 'wind', 'lightning', 'wood', 'yin', 'yang'],
  'char-tobirama': ['water', 'fire', 'earth', 'wind', 'lightning', 'yin', 'yang'],
  'char-hiruzen': ['fire', 'water', 'earth', 'wind', 'lightning', 'yin', 'yang'],
  'char-minato': ['wind', 'lightning', 'yin', 'yang'],

  /* ===================== Akatsuki ===================== */
  'char-itachi': ['fire', 'water', 'wind', 'yin'],
  'char-kisame': ['water', 'wind', 'earth'],
  'char-deidara': ['earth', 'lightning', 'explosion'],
  'char-sasori': ['fire', 'earth', 'water'],
  'char-pain': ['fire', 'water', 'earth', 'wind', 'lightning', 'yin', 'yang'],
  'char-nagato': ['fire', 'water', 'earth', 'wind', 'lightning', 'yin', 'yang'],
  'char-konan': ['fire', 'water', 'wind', 'yin'],
  'char-hidan': ['yin'],
  'char-kakuzu': ['fire', 'wind', 'lightning', 'earth', 'water'],
  'char-obito': ['fire', 'lightning', 'wood', 'yin', 'yang'],
  'char-madara': ['fire', 'water', 'earth', 'wind', 'lightning', 'wood', 'yin', 'yang'],
  'char-zetsu': ['wood', 'yin', 'yang'],
  'char-black-zetsu': ['yin'],

  /* ===================== Kage ===================== */
  'char-a': ['lightning', 'earth'],
  'char-killer-b': ['lightning', 'water'],
  'char-third-raikage': ['lightning', 'earth'],
  'char-mei': ['water', 'fire', 'earth', 'lava', 'boil'],
  'char-chojuro': ['water'],
  'char-onoki': ['earth', 'fire', 'wind', 'dust'],
  'char-kurotsuchi': ['earth', 'water', 'lava'],
  'char-mu': ['earth', 'fire', 'wind', 'dust'],
  'char-gengetsu': ['fire', 'water', 'boil'],
  'char-yagura': ['water', 'yin'],
  'char-gaara': ['wind', 'earth'],
  'char-rasa': ['earth', 'wind', 'magnet'],
  'char-third-kazekage': ['earth', 'wind', 'magnet'],
  'char-mifune': [], // samurai → niente nature ninja

  /* ===================== Sand siblings + altri ===================== */
  'char-temari': ['wind'],
  'char-kankuro': ['earth', 'fire', 'wind'],
  'char-chiyo': ['earth', 'water', 'fire'],

  /* ===================== Otsutsuki / Six Paths ===================== */
  'char-hagoromo': ['fire', 'water', 'earth', 'wind', 'lightning', 'wood', 'yin', 'yang'],
  'char-hamura': ['fire', 'water', 'earth', 'wind', 'lightning', 'yin', 'yang'],
  'char-kaguya': ['fire', 'water', 'earth', 'wind', 'lightning', 'yin', 'yang'],
  'char-momoshiki': ['fire', 'water', 'earth', 'wind', 'lightning', 'yin', 'yang'],
  'char-isshiki': ['yin', 'yang'],
  'char-toneri': ['lightning', 'yin', 'yang'],

  /* ===================== Boruto era ===================== */
  'char-boruto': ['wind', 'lightning', 'yin'],
  'char-sarada': ['lightning', 'fire'],
  'char-mitsuki': ['wind', 'lightning'],
  'char-kawaki': ['wind', 'fire', 'yin', 'yang'],
  'char-shikadai': ['wind', 'yin'],
  'char-inojin': ['earth', 'yin'],
  'char-chocho': ['earth', 'yang'],
  'char-konohamaru': ['fire', 'wind'],
  'char-himawari': ['fire', 'yin'],
  'char-shinki': ['wind', 'earth', 'magnet'],

  /* ===================== altri notabili ===================== */
  'char-guy': [],
  'char-asuma': ['wind', 'fire'],
  'char-kurenai': ['fire', 'yin'],
  'char-anko': ['fire', 'earth'],
  'char-iruka': ['fire', 'water'],
  'char-shisui': ['fire', 'lightning', 'water', 'yin'],
  'char-fugaku': ['fire'],
  'char-mikoto': ['fire'],
  'char-kushina': ['water', 'fire', 'yin'],
  'char-mito': ['water', 'fire', 'yin'],
  'char-karin': ['water', 'fire', 'earth', 'lightning', 'wind', 'yin', 'yang'],
  'char-jugo': ['earth', 'yin'],
  'char-suigetsu': ['water'],
  'char-haku': ['water', 'wind', 'ice'],
  'char-zabuza': ['water', 'earth'],
  'char-hanzo': ['fire', 'water', 'earth', 'wind', 'lightning'],
  'char-danzo': ['fire', 'water', 'wood', 'wind', 'yin', 'yang'],
  'char-sakumo': ['lightning', 'fire'],
  'char-fukasaku': [],
  'char-shima': [],
  'char-kabuto': ['fire', 'wind', 'yin', 'yang'],
  'char-kimimaro': ['water', 'wind'],
};
