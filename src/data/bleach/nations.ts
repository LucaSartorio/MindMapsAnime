import type { Nation } from '@/types';
import { BLEACH_WORLD_COLORS } from './mapConstants';

/**
 * "Nazioni" di Bleach: non regni ma MONDI / DIMENSIONI (facet etichettato
 * «Mondo / Dimensione» via `WorldConfig.nationTerm`). I tre mondi canonici
 * (Mondo dei Vivi, Soul Society, Hueco Mundo), più il Jigoku, i passaggi fra di
 * essi (Dangai) e le due "dimensioni nella dimensione": il Reiōkyū, sopra la
 * Soul Society, e il Wandenreich, nascosto nelle sue ombre.
 *
 * `labelPosition` è sul piano di `bl-map-world` (2000 × 1250). La mappa
 * disegna già i nomi dei mondi: il layer "nomi" resta spento di default.
 */
export const bleachNations: Nation[] = [
  {
    id: 'nation-bl-living-world',
    worldId: 'world-bleach',
    name: 'World of the Living',
    localizedName: { it: 'Mondo dei Vivi', en: 'World of the Living', ja: '現世', fr: 'Monde des Vivants', de: 'Welt der Lebenden', es: 'Mundo de los Vivos' },
    nameLocal: 'Gensei',
    japaneseName: '現世',
    type: 'great_nation',
    description: {
      it: "Il mondo degli esseri umani, dove le anime nascono in un corpo. È qui che gli Shinigami eseguono il konsō per guidare le anime dei morti nella Soul Society, ed è qui che i Hollow vengono a cacciare.",
      en: "The world of human beings, where souls are born into a body. It is here that Soul Reapers perform konsō to guide the souls of the dead to the Soul Society, and here that Hollows come to hunt.",
    },
    descriptionLong: {
      it: "Per Bleach il Mondo dei Vivi è soprattutto Karakura, una città giapponese con una concentrazione di energia spirituale fuori dal comune: è la ragione per cui ci nascono così tante persone sensibili agli spiriti, e quella per cui Aizen la sceglie per forgiare l'Ōken. Il resto del mondo resta sullo sfondo, salvo la vicina Naruki, dove ha sede l'Xcution. L'equilibrio delle anime fra i mondi è il tema che regge tutta la serie: i Quincy distruggono i Hollow invece di purificarli, e questo squilibrio è la radice della guerra di mille anni.",
      en: "In Bleach the World of the Living is above all Karakura, a Japanese town with an unusual concentration of spiritual energy: that is why so many spiritually aware people are born there, and why Aizen picks it to forge the Ōken. The rest of the world stays in the background, except nearby Naruki, home of Xcution. The balance of souls between the worlds is the theme the whole series runs on: the Quincy destroy Hollows instead of purifying them, and that imbalance is the root of the thousand-year war.",
    },
    capitalLocationId: 'loc-bl-karakura',
    labelPosition: { x: 1130, y: 895 },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    color: BLEACH_WORLD_COLORS.living,
    tags: ['mondo', 'karakura', 'umani'],
  },
  {
    id: 'nation-bl-soul-society',
    worldId: 'world-bleach',
    name: 'Soul Society',
    localizedName: { it: 'Soul Society', en: 'Soul Society', ja: '尸魂界', fr: 'Soul Society', de: 'Soul Society', es: 'Sociedad de Almas' },
    japaneseName: '尸魂界',
    type: 'great_nation',
    description: {
      it: "L'aldilà dove approdano le anime purificate: al centro il Seireitei degli Shinigami e della nobiltà, attorno i 320 distretti del Rukongai, sempre più poveri man mano che ci si allontana.",
      en: "The afterlife where purified souls end up: at its centre the Seireitei of the Soul Reapers and the nobility, around it the 320 districts of the Rukongai, poorer and poorer the further out you go.",
    },
    descriptionLong: {
      it: "La Soul Society è governata dalla Central 46, difesa dal Gotei 13 e sorretta, letteralmente, dal Re delle Anime, il cui palazzo galleggia in una dimensione superiore. Il Rukongai è diviso in quattro quadranti (Kita, Minami, Higashi e Nishi), ciascuno di ottanta distretti: il primo è ordinato e tranquillo, l'ottantesimo — come Zaraki, da cui viene Kenpachi — è una terra senza legge. Ichigo ci arriva per salvare Rukia, e da quel momento la Soul Society diventa il centro di ogni guerra della serie: il tradimento di Aizen, l'assalto del Wandenreich, la caduta del Reiōkyū.",
      en: "The Soul Society is ruled by Central 46, defended by the Gotei 13 and held up, quite literally, by the Soul King, whose palace floats in a higher dimension. The Rukongai is split into four quadrants (Kita, Minami, Higashi and Nishi), each of eighty districts: the first is orderly and quiet, the eightieth — like Zaraki, where Kenpachi comes from — is a lawless land. Ichigo arrives to save Rukia, and from then on the Soul Society is the centre of every war in the series: Aizen's betrayal, the Wandenreich's assault, the fall of the Reiōkyū.",
    },
    capitalLocationId: 'loc-bl-seireitei',
    labelPosition: { x: 470, y: 1030 },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    color: BLEACH_WORLD_COLORS.soulSociety,
    tags: ['mondo', 'shinigami', 'gotei-13'],
  },
  {
    id: 'nation-bl-hueco-mundo',
    worldId: 'world-bleach',
    name: 'Hueco Mundo',
    localizedName: { it: 'Hueco Mundo', en: 'Hueco Mundo', ja: '虚圏' },
    japaneseName: '虚圏',
    type: 'great_nation',
    description: {
      it: "Il mondo dei Hollow: un deserto bianco sotto una notte eterna, con alberi di quarzo e, sotto la sabbia, la Foresta dei Menos. Al centro, la fortezza di Las Noches.",
      en: "The world of Hollows: a white desert under an eternal night, with quartz trees and, beneath the sand, the Menos Forest. At its centre, the fortress of Las Noches.",
    },
    descriptionLong: {
      it: "Hueco Mundo è un mondo affamato: i Hollow si divorano a vicenda per evolversi da semplici Hollow a Gillian, Adjuchas e Vasto Lorde, e chi smette di nutrirsi regredisce. Prima di Aizen il suo re era Barragan Louisenbairn, da Las Noches; Aizen lo spodesta, usa lo Hōgyoku per trasformare i Hollow più forti in Arrancar e ne fa un esercito, gli Espada. È qui che Ichigo e i suoi amici vengono a riprendersi Orihime, e qui che, anni dopo, il Wandenreich mette alla prova le sue armi prima di attaccare la Soul Society.",
      en: "Hueco Mundo is a hungry world: Hollows devour one another to evolve from plain Hollows into Gillian, Adjuchas and Vasto Lorde, and those who stop feeding regress. Before Aizen its king was Barragan Louisenbairn, ruling from Las Noches; Aizen overthrows him, uses the Hōgyoku to turn the strongest Hollows into Arrancar and makes an army of them, the Espada. This is where Ichigo and his friends come to take Orihime back, and where, years later, the Wandenreich tests its weapons before attacking the Soul Society.",
    },
    capitalLocationId: 'loc-bl-las-noches',
    labelPosition: { x: 1640, y: 300 },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    color: BLEACH_WORLD_COLORS.huecoMundo,
    tags: ['mondo', 'hollow', 'arrancar'],
  },
  {
    id: 'nation-bl-dangai',
    worldId: 'world-bleach',
    name: 'Dangai (Precipice World)',
    localizedName: { it: 'Dangai (Mondo del Precipizio)', en: 'Dangai (Precipice World)', ja: '断界' },
    japaneseName: '断界',
    type: 'neutral_land',
    description: {
      it: "Lo spazio fra la Soul Society e il Mondo dei Vivi, attraversato aprendo un Senkaimon. Le sue pareti sono la corrente del Kōryū, che inghiotte chi si attarda, e il Kōtotsu lo ripulisce a intervalli regolari.",
      en: "The space between the Soul Society and the World of the Living, crossed by opening a Senkaimon. Its walls are the Kōryū current, which swallows anyone who lingers, and the Kōtotsu sweeps it clean at regular intervals.",
    },
    descriptionLong: {
      it: "Nel Dangai il tempo scorre diversamente: è per questo che Isshin vi porta Ichigo per tre mesi di allenamento che, fuori, durano un'ora, e che Ichigo ne esce con l'Ultimo Getsuga Tenshō. È anche la strada che i ryoka percorrono per invadere la Soul Society, inseguiti dal Kōtotsu.",
      en: "Time flows differently in the Dangai: that is why Isshin takes Ichigo there for three months of training that last an hour outside, and why Ichigo comes out of it with the Final Getsuga Tenshō. It is also the road the ryoka take to invade the Soul Society, chased by the Kōtotsu.",
    },
    capitalLocationId: 'loc-bl-dangai',
    labelPosition: { x: 865, y: 508 },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    color: BLEACH_WORLD_COLORS.dangai,
    tags: ['dimensione', 'senkaimon'],
  },
  {
    id: 'nation-bl-reiokyu',
    worldId: 'world-bleach',
    name: 'Reiōkyū (Soul King Palace)',
    localizedName: { it: 'Reiōkyū (Palazzo del Re)', en: 'Reiōkyū (Soul King Palace)', ja: '霊王宮' },
    japaneseName: '霊王宮',
    type: 'great_nation',
    description: {
      it: "La dimensione sopra la Soul Society dove riposa il Re delle Anime, protetto dalla Divisione Zero. Ci si arriva solo con la chiave reale, l'Ōken, o con il Tenchūren dei suoi guardiani.",
      en: "The dimension above the Soul Society where the Soul King rests, protected by the Royal Guard. It can only be reached with the royal key, the Ōken, or by the Tenchūren of its guardians.",
    },
    descriptionLong: {
      it: "Il Reiōkyū è fatto di città sospese, una per ogni membro della Divisione Zero, attorno al bozzolo in cui il Re delle Anime vive mutilato da un milione di anni, perno dei tre mondi. È l'obiettivo finale di Aizen, che vuole forgiare l'Ōken per raggiungerlo, e di Yhwach, che ci riesce: lo invade, uccide il Re e lo rifonda come Wahrwelt, la sua capitale.",
      en: "The Reiōkyū is made of floating cities, one for each member of the Royal Guard, around the cocoon where the Soul King has lived mutilated for a million years, the linchpin of the three worlds. It is the ultimate goal of Aizen, who wants to forge the Ōken to reach it, and of Yhwach, who succeeds: he invades it, kills the King and refounds it as Wahrwelt, his capital.",
    },
    capitalLocationId: 'loc-bl-reiokyu',
    labelPosition: { x: 770, y: 92 },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    color: BLEACH_WORLD_COLORS.reiokyu,
    tags: ['dimensione', 're-delle-anime', 'divisione-zero'],
  },
  {
    id: 'nation-bl-wandenreich',
    worldId: 'world-bleach',
    name: 'Wandenreich',
    localizedName: { it: 'Wandenreich', en: 'Wandenreich', ja: '見えざる帝国' },
    japaneseName: '見えざる帝国',
    type: 'great_nation',
    description: {
      it: "L'«Impero Invisibile» dei Quincy di Yhwach, nascosto per mille anni nelle ombre del Seireitei (lo Schatten Bereich), con la capitale Silbern.",
      en: "The 'Invisible Empire' of Yhwach's Quincy, hidden for a thousand years in the shadows of the Seireitei (the Schatten Bereich), with Silbern as its capital.",
    },
    descriptionLong: {
      it: "Dopo la sconfitta di mille anni fa, i Quincy sopravvissuti si sono rifugiati dove gli Shinigami non avrebbero mai cercato: dentro la Soul Society stessa, nelle sue ombre. Quando Yhwach ritorna, il Wandenreich dichiara guerra, ruba i Bankai con i medaglioni, uccide Yamamoto e, alla seconda invasione, sostituisce il Seireitei con la propria città.",
      en: "After their defeat a thousand years ago, the surviving Quincy took refuge where the Soul Reapers would never look: inside the Soul Society itself, in its shadows. When Yhwach returns, the Wandenreich declares war, steals Bankai with its medallions, kills Yamamoto and, in the second invasion, replaces the Seireitei with its own city.",
    },
    capitalLocationId: 'loc-bl-silbern',
    labelPosition: { x: 470, y: 760 },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    color: BLEACH_WORLD_COLORS.wandenreich,
    tags: ['quincy', 'yhwach', 'guerra'],
  },
  {
    id: 'nation-bl-hell',
    worldId: 'world-bleach',
    name: 'Hell',
    localizedName: { it: 'Jigoku (Inferno)', en: 'Hell (Jigoku)', ja: '地獄' },
    japaneseName: '地獄',
    type: 'great_nation',
    description: {
      it: "Il mondo dove finiscono le anime che hanno commesso crimini imperdonabili — e, si scopre, quelle dei capitani con un'energia spirituale troppo grande per tornare alla Soul Society.",
      en: "The world where the souls who committed unforgivable crimes end up — and, it turns out, those of captains whose spiritual pressure is too great to return to the Soul Society.",
    },
    descriptionLong: {
      it: "Le porte dei teschi del Jigoku si aprono quando una Zanpakutō purifica un Hollow che in vita ha commesso crimini gravi: è la sorte di Shrieker, il primo a esservi trascinato sotto gli occhi di Ichigo. Il one-shot «No Breaths From Hell» (2021) di Tite Kubo, ambientato una dozzina d'anni dopo la guerra, rivela che anche i capitani defunti vi finiscono: durante il Konsō Reisai per Ukitake l'equilibrio si spezza e il Jigoku comincia a premere sugli altri mondi.",
      en: "Hell's skull gates open when a Zanpakutō purifies a Hollow who committed grave crimes in life: that is Shrieker's fate, the first one to be dragged in before Ichigo's eyes. Tite Kubo's one-shot 'No Breaths From Hell' (2021), set some twelve years after the war, reveals that dead captains end up there too: during the Konsō Reisai for Ukitake the balance breaks and Hell begins pressing on the other worlds.",
    },
    capitalLocationId: 'loc-bl-gates-of-hell',
    labelPosition: { x: 985, y: 1092 },
    canonStatus: 'canon',
    referenceStatus: 'verified',
    color: BLEACH_WORLD_COLORS.hell,
    tags: ['inferno', 'one-shot'],
  },
];
