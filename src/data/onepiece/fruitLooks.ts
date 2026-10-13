import type { FruitLook } from '@/types';

/**
 * Aspetto dei Frutti del Diavolo per le immagini generate (`FruitArt`).
 *
 * Solo i frutti che la serie MOSTRA come frutto (38 su 122): ogni voce traduce in
 * forme e colori la descrizione testuale dell'aspetto (sezione "Appearance" della
 * One Piece Wiki). Nessuna immagine è scaricata o ricalcata: sono disegni propri
 * ricostruiti dalla descrizione. I frutti mai mostrati non hanno un aspetto
 * canonico e restano col simbolo generico (tipo + elemento), per non inventarlo.
 */
export const onepieceFruitLooks: Record<string, FruitLook> = {
  // Logia ------------------------------------------------------------------
  /** Tondo, arancione, fatto di componenti a fiamma con una spirale ciascuno; stelo a spirale. */
  'fruit-op-mera-mera': { body: 'flames', color: '#f08a2a', swirl: '#b8401a', stem: 'curl' },
  /** Sferico grigiastro, a sbuffi di nuvola con spirale, simile a un melone; stelo verde. */
  'fruit-op-moku-moku': { body: 'cloud', color: '#b9bec8', swirl: '#6f7584', stem: 'curl' },
  /** Cactus a botte sferico color sabbia con due braccia tozze in alto; stelo a T. */
  'fruit-op-suna-suna': { body: 'cactus', color: '#d9b878', swirl: '#8f6f3a', stem: 'T' },
  /** Pera giallo oro con escrescenze appuntite come scintille; stelo a saetta. */
  'fruit-op-goro-goro': { body: 'pear', color: '#f0c22e', swirl: '#a87a12', stem: 'zigzag', features: ['sparks'] },
  /** Grande, viola chiaro, fatto di gocce con spirale, come un'ananas/grappolo; foglie in cima. */
  'fruit-op-yami-yami': { body: 'tears', color: '#a98ad2', swirl: '#5f4690', stem: 'leaves' },

  // Paramecia ---------------------------------------------------------------
  /** Pera blu con la parte bassa "crepata"; spirali in alto; stelo a T arricciato. */
  'fruit-op-gura-gura': { body: 'pear', color: '#5b8de0', swirl: '#2c4f96', stem: 'T', features: ['cracks', 'half_swirls'] },
  /** Rosso, a cuore come una fragola, con spirali; stelo che si arriccia verso l'alto. */
  'fruit-op-ope-ope': { body: 'heart', color: '#d8323c', swirl: '#8a1622', stem: 'curl' },
  /** A pera, lilla pallido, stelo arricciato fucsia. */
  'fruit-op-ito-ito': { body: 'pear', color: '#d9c5ee', swirl: '#8e6cb8', stem: 'curl', stemColor: '#d23c9c' },
  /** Fiore rosa con spirali a "S" sui petali; stelo in cima. */
  'fruit-op-hana-hana': { body: 'flower', color: '#f39cc3', color2: '#e8789e', swirl: '#b8487a', stem: 'curl' },
  /** Sferico dorato con quattro escrescenze tozze in basso, come un teschio; stelo verde. */
  'fruit-op-yomi-yomi': { body: 'skull', color: '#e9c246', swirl: '#9a7a18', stem: 'T' },
  /** Bianco crema, si stringe in basso e si allarga in un piede piatto (mochi); stelo a T. */
  'fruit-op-mochi-mochi': { body: 'mochi', color: '#f4ead2', swirl: '#b8a47a', stem: 'T' },
  /** Rosa carne con tre lobi in cima, come una zampa a tre dita; stelo dal lobo centrale. */
  'fruit-op-nikyu-nikyu': { body: 'paw', color: '#f2b6a6', swirl: '#b87060', stem: 'T' },
  /** Due frutti a cuore (rosso e viola) con cuoricini rosa, steli uniti a cuore. */
  'fruit-op-mero-mero': {
    body: 'twin_hearts',
    color: '#d8323c',
    color2: '#8a4ab8',
    color3: '#f6a6c8',
    stem: 'heart',
    features: ['heart_pattern'],
  },
  /** Sferico nero puro con spirali, foglie laterali come il colletto di un mantello. */
  'fruit-op-kage-kage': { body: 'round', color: '#2a2833', color2: '#3f6a3a', swirl: '#5d5a70', stem: 'T', features: ['collar'] },
  /** Giallo pallido, cinque sezioni allungate che salgono, con spirale e due occhi (fantasmini). */
  'fruit-op-horo-horo': { body: 'ghosts', color: '#f3e7a2', swirl: '#a8954a', stem: 'base' },
  /** Ovale rosso-arancio fatto di sferette con spirale (lampone); ciuffo di foglie. */
  'fruit-op-bara-bara': { body: 'berry', color: '#e2532c', swirl: '#8f2a12', stem: 'leaves' },
  /** Prugna viola divisa da uno zigzag come una bocca; interno arancione; stelo arricciato. */
  'fruit-op-baku-baku': { body: 'jaws', color: '#7b3b9c', color2: '#f08a2a', swirl: '#43205a', stem: 'curl' },
  /** Viola scuro come una mela/bomba, spirali a "S", stelo giallo a miccia sfilacciata. */
  'fruit-op-bomu-bomu': { body: 'apple', color: '#3b2a5c', swirl: '#7a62a8', stem: 'fuse' },
  /** Cilindrico rosa come un peso da bilancia; stelo spesso a T. */
  'fruit-op-kilo-kilo': { body: 'weight', color: '#f39cc3', swirl: '#b8487a', stem: 'T' },
  /** Pera bianca col cappello "sciolto" come una candela; stelo con gocce di cera. */
  'fruit-op-doru-doru': { body: 'pear', color: '#f3efe4', swirl: '#a8a090', stem: 'drip', features: ['drips'] },
  /** Casco di banane-lama: filo bianco e dorso grigio scuro con spirali. */
  'fruit-op-supa-supa': { body: 'blades', color: '#f2f2f2', color2: '#5a5d68', swirl: '#9a9daa', stem: 'base' },
  /** Due frutti arancioni a strisce rosa, steli uniti. */
  'fruit-op-mane-mane': { body: 'twin', color: '#f08a2c', color2: '#f39cc3', swirl: '#a8501a', stem: 'twin', features: ['stripes'] },
  /** Melone viola con spirali e stelo arricciato (interno verde). */
  'fruit-op-awa-awa': { body: 'melon', color: '#9a6ad2', swirl: '#583690', stem: 'curl', features: ['ribs'] },
  /** Grappolo di sfere argento con fulmini, avvolto da una liana gialla; stelo a saetta. */
  'fruit-op-jiki-jiki': { body: 'grapes', color: '#c9cdd6', swirl: '#6f7584', stem: 'zigzag', stemColor: '#e8c84a', features: ['vine', 'sparks'] },
  /** Sferico a spicchi di colori diversi uniti da punti di cucitura; stelo-ago. */
  'fruit-op-nui-nui': { body: 'segments', color: '#f08a2a', color2: '#5b8de0', color3: '#9ccc4a', stem: 'needle' },
  /** A ruota: guscio rosso con spirali e nucleo giallo a spirale; stelo a otto coricato. */
  'fruit-op-hobi-hobi': { body: 'wheel', color: '#d8323c', color2: '#f2e08a', swirl: '#8a1622', stem: 'eight' },
  /** Rosa lucido come una pesca, spirali a "S", stelo verde. */
  'fruit-op-sube-sube': { body: 'peach', color: '#f5a8ba', swirl: '#c0607a', stem: 'curl' },

  // Zoan ----------------------------------------------------------------------
  /** (Gomu Gomu) Viola, sferico come un melone, spirali a "S", stelo arricciato. */
  'fruit-op-hito-hito-nika': { body: 'melon', color: '#8a4ab8', swirl: '#4a2276', stem: 'curl' },
  /** Ovale come una pigna a scaglie blu, ognuna con un ovale scuro e la spirale; due steli. */
  'fruit-op-uo-uo': { body: 'scales', color: '#2f5fc8', color2: '#8ab6f2', color3: '#1d3a7a', stem: 'double' },
  /** Il duplicato artificiale (Momonosuke) riprende l'aspetto dell'originale. */
  'fruit-op-ryu-ryu-azure': { body: 'scales', color: '#2f5fc8', color2: '#8ab6f2', color3: '#1d3a7a', stem: 'double' },
  /** Tondo e schiacciato arancione come un cachi, spirali solo nella metà alta; foglie brune. */
  'fruit-op-inu-inu-makami': { body: 'persimmon', color: '#f08a2a', swirl: '#a8501a', stem: 'bush', features: ['half_swirls'] },
  /** Viola, a scaglie come un'ananas; sette steli con estremità triangolari. */
  'fruit-op-hebi-hebi-yamata': { body: 'pineapple', color: '#7b4ab8', swirl: '#40206e', stem: 'seven' },
  /** Rosso a casco di banane con spirali; stelo verde chiaro che unisce le sezioni. */
  'fruit-op-ushi-ushi-giraffe': { body: 'bananas', color: '#d8423a', swirl: '#861e18', stem: 'base', stemColor: '#8fd06a' },
  /** Come una testa di leopardo: macchie e orecchie (spirali dentro); stelo a T. */
  'fruit-op-neko-neko-leopard': { body: 'round', color: '#e9b443', swirl: '#a87a20', stem: 'T', features: ['ears', 'spots'] },
  /** (Chopper) A fungo: cappello rosso, gambo biancastro, spirali a "S". */
  'fruit-op-hito-hito': { body: 'mushroom', color: '#d8323c', color2: '#f2ecdc', swirl: '#8a1622', stem: 'curl' },
  /** Come una fragola-testa di bisonte nera con corna bianche; peduncolo a T. */
  'fruit-op-ushi-ushi-bison': { body: 'strawberry', color: '#2a2833', swirl: '#5d5a70', stem: 'T', features: ['horns'] },
  /** Diventato una mela: piccola, indaco, spirali, stelo arricciato. */
  'fruit-op-sara-sara-axolotl': { body: 'apple', color: '#4a4ab8', swirl: '#24246e', stem: 'curl' },
  /** Come un'ananas verde a frutticini appuntiti con spirale; corona di foglie-fiamma blu e gialle. */
  'fruit-op-tori-tori-phoenix': { body: 'fruitlets', color: '#4fa04a', swirl: '#24601e', stem: 'crown', color2: '#3a8ae0', color3: '#f2d040' },
  /** SMILE: mele colorate con macchie di un altro colore, ognuna con una macchia dentro. */
  'fruit-op-smile': { body: 'apple', color: '#e04a4a', color2: '#f2d040', color3: '#3a8ae0', swirl: '#8a1e1e', stem: 'curl', features: ['rings'] },
};
