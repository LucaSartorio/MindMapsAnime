import type { Localizable } from '@/types';

/**
 * Curiosità realmente tratte dalle SBS di Eiichiro Oda (la sua rubrica di
 * domande e risposte) e dai profili ufficiali (compleanni, età, altezze):
 * dati extra-narrativi, NON ricavati dalla trama. Niente parafrasi delle
 * descrizioni o delle abilità — solo fatti SBS/ufficiali. Merge in `index.ts`.
 */
export const onepieceTrivia: Record<string, Localizable[]> = {
  /* --------------------------- Cappello di Paglia --------------------------- */
  'char-op-luffy': [
    { it: 'Compleanno: 5 maggio. Età: 17 → 19 anni. Altezza: 174 cm.', en: 'Birthday: May 5. Age: 17 → 19. Height: 174 cm.' },
    { it: 'Nazionalità immaginata da Oda nelle SBS: Brasile. Cibo preferito: la carne.', en: 'Real-world nationality imagined by Oda in the SBS: Brazil. Favorite food: meat.' },
    { it: 'In una SBS Oda ha disegnato la ciurma come animali: Rufy è una scimmia (da cui «Monkey»).', en: 'In an SBS Oda drew the crew as animals: Luffy is a monkey (hence "Monkey").' },
  ],
  'char-op-zoro': [
    { it: 'Compleanno: 11 novembre. Età: 19 → 21. Altezza: 181 cm.', en: 'Birthday: November 11. Age: 19 → 21. Height: 181 cm.' },
    { it: 'Nazionalità SBS: Giappone. Cibo preferito: riso bianco e carne di Re del Mare; ama il sakè.', en: 'SBS nationality: Japan. Favorite food: white rice and Sea King meat; he loves ale.' },
    { it: 'Nelle SBS Oda ha confermato con ironia che Zoro ha davvero un pessimo senso dell’orientamento.', en: 'In the SBS Oda jokingly confirmed that Zoro really does have a terrible sense of direction.' },
  ],
  'char-op-nami': [
    { it: 'Compleanno: 3 luglio. Età: 18 → 20. Altezza: 170 cm.', en: 'Birthday: July 3. Age: 18 → 20. Height: 170 cm.' },
    { it: 'Nazionalità SBS: Svezia. Cibo preferito: i mandarini.', en: 'SBS nationality: Sweden. Favorite food: tangerines.' },
  ],
  'char-op-usopp': [
    { it: 'Compleanno: 1 aprile. Età: 17 → 19. Altezza: 176 cm.', en: 'Birthday: April 1. Age: 17 → 19. Height: 176 cm.' },
    { it: 'Nazionalità SBS: Africa.', en: 'SBS nationality: Africa.' },
    { it: 'Nelle SBS Oda conferma con ironia che «Sogeking» è ovviamente Usop… che però continua a negarlo.', en: "In the SBS Oda wryly confirms that 'Sogeking' is obviously Usopp… who nonetheless keeps denying it." },
  ],
  'char-op-sanji': [
    { it: 'Compleanno: 2 marzo. Età: 19 → 21. Altezza: 180 cm.', en: 'Birthday: March 2. Age: 19 → 21. Height: 180 cm.' },
    { it: 'Nazionalità SBS: Francia. Cibo preferito: piatti piccanti e saporiti.', en: 'SBS nationality: France. Favorite food: spicy, savory dishes.' },
    { it: 'Nelle SBS Oda ha precisato che le sopracciglia di Sanji si arricciano in senso opposto a quelle dei fratelli Vinsmoke.', en: "In the SBS Oda clarified that Sanji's eyebrows curl in the opposite direction from his Vinsmoke siblings'." },
  ],
  'char-op-chopper': [
    { it: 'Compleanno: 24 dicembre. Età: 15 → 17. Altezza: ~90 cm (forma base).', en: 'Birthday: December 24. Age: 15 → 17. Height: ~90 cm (base form).' },
    { it: 'Nazionalità SBS: Canada. Cibo preferito: lo zucchero filato e il cioccolato.', en: 'SBS nationality: Canada. Favorite food: cotton candy and chocolate.' },
  ],
  'char-op-robin': [
    { it: 'Compleanno: 6 febbraio. Età: 28 → 30. Altezza: 188 cm.', en: 'Birthday: February 6. Age: 28 → 30. Height: 188 cm.' },
    { it: 'Nazionalità SBS: Russia.', en: 'SBS nationality: Russia.' },
  ],
  'char-op-franky': [
    { it: 'Compleanno: 9 marzo. Età: 34 → 36. Altezza: 240 cm.', en: 'Birthday: March 9. Age: 34 → 36. Height: 240 cm.' },
    { it: 'Nazionalità SBS: U.S.A.', en: 'SBS nationality: U.S.A.' },
  ],
  'char-op-brook': [
    { it: 'Compleanno: 3 aprile. Età: 88 → 90. Altezza: 277 cm.', en: 'Birthday: April 3. Age: 88 → 90. Height: 277 cm.' },
    { it: 'Nazionalità SBS: Austria.', en: 'SBS nationality: Austria.' },
  ],
  'char-op-jinbe': [
    { it: 'Compleanno: 2 aprile. Età: 44 → 46. Altezza: 301 cm.', en: 'Birthday: April 2. Age: 44 → 46. Height: 301 cm.' },
  ],

  /* ----------------- Altri personaggi: solo compleanni/fatti SBS ----------------- */
  'char-op-ace': [
    { it: 'Compleanno: 1 gennaio.', en: 'Birthday: January 1.' },
  ],
  'char-op-sabo': [
    { it: 'Compleanno: 20 marzo.', en: 'Birthday: March 20.' },
  ],
  'char-op-law': [
    { it: 'Compleanno: 6 ottobre. Nelle SBS Oda ha rivelato che il suo cibo preferito sono gli onigiri e che detesta il pane.', en: 'Birthday: October 6. In the SBS Oda revealed that his favorite food is onigiri and that he hates bread.' },
  ],
  'char-op-hancock': [
    { it: 'Compleanno: 2 settembre.', en: 'Birthday: September 2.' },
  ],
  'char-op-shanks': [
    { it: 'Compleanno: 9 marzo.', en: 'Birthday: March 9.' },
  ],
  'char-op-buggy': [
    { it: 'Compleanno: 8 agosto.', en: 'Birthday: August 8.' },
  ],
  'char-op-roger': [
    { it: 'Compleanno: 31 dicembre.', en: 'Birthday: December 31.' },
  ],
  'char-op-crocodile': [
    { it: 'Nelle SBS Oda ha più volte schivato con ironia le domande sul passato di Crocodile, alimentandone il mistero (incluso un possibile legame con Ivankov).', en: "In the SBS Oda has repeatedly, jokingly dodged questions about Crocodile's past, fueling the mystery (including a possible connection to Ivankov)." },
  ],
};
