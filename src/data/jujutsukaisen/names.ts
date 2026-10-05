import type { SourceNames } from '@/data/shared/translations';

/**
 * Nomi it/en che differiscono dal `name` dei dati o lo correggono (doppiaggi ed
 * edizioni ufficiali): personaggi, epiteti, gradi, clan, tecniche, luoghi.
 * Chiavi = quelle degli overlay (vedi `withSourceNames`, docs/I18N.md).
 */
export const jjkNames: SourceNames = {
  "characters[char-jjk-ogami].name": { it: "Nonna Ogami", en: "Granny Ogami" },
  "characters[char-jjk-gojo].aliases[0]": { it: "Il più forte", en: "The Strongest" },
  "characters[char-jjk-gojo].aliases[1]": { it: "Il più forte", en: "The Strongest" },
  "characters[char-jjk-mechamaru].aliases[1]": { it: "Mechamaru", en: "Mechamaru" },
  "characters[char-jjk-sukuna].aliases[0]": { it: "Re delle Maledizioni", en: "King of Curses" },
  "characters[char-jjk-sukuna].aliases[1]": { it: "Re delle Maledizioni", en: "King of Curses" },
  "characters[char-jjk-toji].aliases[0]": { it: "L'assassino di stregoni", en: "Sorcerer Killer" },
  "characters[char-jjk-toji].aliases[2]": { it: "L'assassino di stregoni", en: "Sorcerer Killer" },
  "characters[char-jjk-hana].aliases[0]": { it: "Angelo", en: "Angel" },
  "characters[char-jjk-hana].aliases[1]": { it: "Angelo", en: "Angel" },
};
