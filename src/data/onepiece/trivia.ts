import type { Localizable } from '@/types';

/**
 * Curiosità tratte dalle SBS (la rubrica di domande e risposte di Eiichiro Oda)
 * e dalle copertine, agganciate ai personaggi e mostrate nel loro modale.
 * Compleanni, altezze, età pre/post salto temporale, le nazionalità «reali»
 * immaginate da Oda e le gag più note. Merge centralizzato in `index.ts`.
 */
export const onepieceTrivia: Record<string, Localizable[]> = {
  /* --------------------------- Cappello di Paglia --------------------------- */
  'char-op-luffy': [
    { it: 'Compleanno: 5 maggio. Età: 17 → 19 anni (dopo i due anni). Altezza: 174 cm.', en: 'Birthday: May 5. Age: 17 → 19 (after the two years). Height: 174 cm.' },
    { it: 'Nazionalità immaginata da Oda nelle SBS: Brasile.', en: "Real-world nationality imagined by Oda in the SBS: Brazil." },
    { it: 'Senza il Frutto del Diavolo, secondo le SBS, sarebbe un nuotatore eccezionale. Cibo preferito: la carne.', en: "Without his Devil Fruit, per the SBS, he'd be an outstanding swimmer. Favorite food: meat." },
  ],
  'char-op-zoro': [
    { it: 'Compleanno: 11 novembre. Età: 19 → 21. Altezza: 181 cm.', en: 'Birthday: November 11. Age: 19 → 21. Height: 181 cm.' },
    { it: 'Nazionalità SBS: Giappone.', en: 'SBS nationality: Japan.' },
    { it: 'Il suo pessimo senso dell’orientamento, gag confermata nelle SBS, gli fa sbagliare strada ovunque.', en: 'His terrible sense of direction, a running gag confirmed in the SBS, makes him get lost everywhere.' },
  ],
  'char-op-nami': [
    { it: 'Compleanno: 3 luglio. Età: 18 → 20. Altezza: 170 cm.', en: 'Birthday: July 3. Age: 18 → 20. Height: 170 cm.' },
    { it: 'Nazionalità SBS: Svezia.', en: 'SBS nationality: Sweden.' },
    { it: 'Adora i mandarini — in memoria del boschetto di Bellemère — e il denaro.', en: 'She loves tangerines — in memory of Bellemère’s grove — and money.' },
  ],
  'char-op-usopp': [
    { it: 'Compleanno: 1 aprile. Età: 17 → 19. Altezza: 176 cm.', en: 'Birthday: April 1. Age: 17 → 19. Height: 176 cm.' },
    { it: 'Nazionalità SBS: Africa.', en: 'SBS nationality: Africa.' },
    { it: 'Nelle SBS Oda conferma con ironia che «Sogeking» è ovviamente Usop… che però continua a negarlo.', en: "In the SBS Oda wryly confirms that 'Sogeking' is obviously Usopp… who nonetheless keeps denying it." },
  ],
  'char-op-sanji': [
    { it: 'Compleanno: 2 marzo. Età: 19 → 21. Altezza: 180 cm.', en: 'Birthday: March 2. Age: 19 → 21. Height: 180 cm.' },
    { it: 'Nazionalità SBS: Francia.', en: 'SBS nationality: France.' },
    { it: 'Non alza mai un dito contro una donna, costi quel che costi: un codice ereditato da Zeff. Le sue sopracciglia si arricciano al contrario rispetto ai fratelli Vinsmoke.', en: "He never raises a hand against a woman, whatever the cost: a code inherited from Zeff. His eyebrows curl the opposite way from his Vinsmoke siblings." },
  ],
  'char-op-chopper': [
    { it: 'Compleanno: 24 dicembre. Età: 15 → 17. Altezza: ~90 cm (forma base).', en: 'Birthday: December 24. Age: 15 → 17. Height: ~90 cm (base form).' },
    { it: 'Nazionalità SBS: Canada.', en: 'SBS nationality: Canada.' },
    { it: 'Va matto per lo zucchero filato; se lo insulti mentre lo lodi, fa comunque la danza della gioia.', en: 'He’s crazy for cotton candy; insult him while praising him and he’ll do his happy dance anyway.' },
  ],
  'char-op-robin': [
    { it: 'Compleanno: 6 febbraio. Età: 28 → 30. Altezza: 188 cm.', en: 'Birthday: February 6. Age: 28 → 30. Height: 188 cm.' },
    { it: 'Nazionalità SBS: Russia.', en: 'SBS nationality: Russia.' },
    { it: 'È l’unica della ciurma a trovare divertenti certe situazioni macabre — un tratto che ha fin da bambina.', en: 'She’s the only crewmate who finds certain macabre situations funny — a trait she’s had since childhood.' },
  ],
  'char-op-franky': [
    { it: 'Compleanno: 9 marzo. Età: 34 → 36. Altezza: 240 cm (corpo cyborg).', en: 'Birthday: March 9. Age: 34 → 36. Height: 240 cm (cyborg body).' },
    { it: 'Nazionalità SBS: U.S.A.', en: 'SBS nationality: U.S.A.' },
    { it: 'Funziona a cola: senza, le sue prestazioni crollano. Ha costruito la Thousand Sunny con il prezioso legno dell’Albero Adam.', en: 'He runs on cola: without it, his performance collapses. He built the Thousand Sunny from the precious Adam Wood.' },
  ],
  'char-op-brook': [
    { it: 'Compleanno: 3 aprile. Età: 88 → 90. Altezza: 277 cm.', en: 'Birthday: April 3. Age: 88 → 90. Height: 277 cm.' },
    { it: 'Nazionalità SBS: Austria.', en: 'SBS nationality: Austria.' },
    { it: 'Dietro le sue battute sull’aldilà («Yohohoho!») ci sono 50 anni passati da solo, morto e risorto, ad aspettare i compagni.', en: "Behind his afterlife jokes ('Yohohoho!') lie 50 years spent alone, dead and revived, waiting for his crewmates." },
  ],
  'char-op-jinbe': [
    { it: 'Compleanno: 2 aprile. Età: 44 → 46. Altezza: 301 cm.', en: 'Birthday: April 2. Age: 44 → 46. Height: 301 cm.' },
    { it: 'Uomo-pesce squalo balena, timoniere della ciurma ed ex Corsaro: l’ultimo a unirsi ai Cappello di Paglia.', en: 'A whale-shark fish-man, the crew’s helmsman and a former Warlord: the last to join the Straw Hats.' },
  ],

  /* --------------------------- Altri personaggi --------------------------- */
  'char-op-ace': [
    { it: 'Compleanno: 1 gennaio. Figlio di Gol D. Roger e Portgas D. Rouge, che lo tenne in grembo venti mesi per proteggerlo dalla Marina.', en: 'Birthday: January 1. Son of Gol D. Roger and Portgas D. Rouge, who carried him for twenty months to protect him from the Marines.' },
  ],
  'char-op-sabo': [
    { it: 'Compleanno: 20 marzo. Dopo lo sparo del Drago Celeste perse la memoria, ritrovandola anni dopo alla notizia della morte di Ace.', en: "Birthday: March 20. After the Celestial Dragon's gunshot he lost his memory, regaining it years later at the news of Ace's death." },
  ],
  'char-op-law': [
    { it: 'Compleanno: 6 ottobre. Nelle SBS: cibo preferito gli onigiri, detesta il pane (gag ricorrente).', en: 'Birthday: October 6. In the SBS: favorite food onigiri, hates bread (a running gag).' },
  ],
  'char-op-hancock': [
    { it: 'Compleanno: 2 settembre. Considerata la donna più bella del mondo; come le sorelle porta il nome di un serpente Gorgone.', en: 'Birthday: September 2. Considered the most beautiful woman in the world; like her sisters she bears the name of a Gorgon snake.' },
  ],
  'char-op-shanks': [
    { it: 'Compleanno: 9 marzo. Spende un patrimonio in alcol; da giovane fu mozzo sulla nave di Roger insieme a Bagy.', en: 'Birthday: March 9. He spends a fortune on liquor; in his youth he was a cabin boy on Roger’s ship alongside Buggy.' },
  ],
  'char-op-buggy': [
    { it: 'Compleanno: 8 agosto. Ex mozzo della ciurma di Roger con Shanks; il Frutto Smembra lo rende immune ai tagli ma non sa nuotare.', en: "Birthday: August 8. A former cabin boy of Roger's crew with Shanks; the Chop-Chop Fruit makes him immune to cuts but unable to swim." },
  ],
};
