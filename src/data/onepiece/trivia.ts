import type { Localizable } from '@/types';

/**
 * Curiosità tratte dalle SBS (la rubrica di domande e risposte di Eiichiro Oda)
 * e dalle copertine, agganciate ai personaggi e mostrate nel loro modale.
 * Compleanni, altezze, età pre/post salto temporale, le nazionalità «reali»
 * immaginate da Oda, i cibi preferiti e le gag più note. Merge centralizzato
 * in `index.ts`.
 */
export const onepieceTrivia: Record<string, Localizable[]> = {
  /* --------------------------- Cappello di Paglia --------------------------- */
  'char-op-luffy': [
    { it: 'Compleanno: 5 maggio. Età: 17 → 19 anni (dopo i due anni). Altezza: 174 cm.', en: 'Birthday: May 5. Age: 17 → 19 (after the two years). Height: 174 cm.' },
    { it: 'Nazionalità immaginata da Oda nelle SBS: Brasile.', en: 'Real-world nationality imagined by Oda in the SBS: Brazil.' },
    { it: 'Senza il Frutto del Diavolo, secondo le SBS, sarebbe un nuotatore eccezionale. Cibo preferito: la carne.', en: "Without his Devil Fruit, per the SBS, he'd be an outstanding swimmer. Favorite food: meat." },
    { it: 'Se fosse un animale, Oda lo immagina come una scimmia — da cui il cognome «Monkey».', en: 'If he were an animal, Oda imagines a monkey — hence the surname "Monkey".' },
  ],
  'char-op-zoro': [
    { it: 'Compleanno: 11 novembre. Età: 19 → 21. Altezza: 181 cm.', en: 'Birthday: November 11. Age: 19 → 21. Height: 181 cm.' },
    { it: 'Nazionalità SBS: Giappone.', en: 'SBS nationality: Japan.' },
    { it: 'Il suo pessimo senso dell’orientamento, gag confermata nelle SBS, gli fa sbagliare strada ovunque.', en: 'His terrible sense of direction, a running gag confirmed in the SBS, makes him get lost everywhere.' },
    { it: 'Cibo preferito: riso bianco e carne di Re del Mare; va matto per il sakè.', en: 'Favorite food: white rice and Sea King meat; he loves ale.' },
  ],
  'char-op-nami': [
    { it: 'Compleanno: 3 luglio. Età: 18 → 20. Altezza: 170 cm.', en: 'Birthday: July 3. Age: 18 → 20. Height: 170 cm.' },
    { it: 'Nazionalità SBS: Svezia.', en: 'SBS nationality: Sweden.' },
    { it: 'Adora i mandarini — in memoria del boschetto di Bellemère — e il denaro.', en: 'She loves tangerines — in memory of Bellemère’s grove — and money.' },
    { it: 'Il tatuaggio sul braccio unisce un mulinello e un mandarino, a ricordo di Bellemère e Genzo (al posto del marchio di Arlong).', en: 'Her arm tattoo combines a pinwheel and a tangerine, in memory of Bellemère and Genzo (replacing Arlong’s mark).' },
  ],
  'char-op-usopp': [
    { it: 'Compleanno: 1 aprile. Età: 17 → 19. Altezza: 176 cm.', en: 'Birthday: April 1. Age: 17 → 19. Height: 176 cm.' },
    { it: 'Nazionalità SBS: Africa.', en: 'SBS nationality: Africa.' },
    { it: 'Nelle SBS Oda conferma con ironia che «Sogeking» è ovviamente Usop… che però continua a negarlo.', en: "In the SBS Oda wryly confirms that 'Sogeking' is obviously Usopp… who nonetheless keeps denying it." },
    { it: 'Soffre di croniche «malattie immaginarie» che spuntano ogni volta che il pericolo è vicino.', en: 'He suffers chronic "imaginary illnesses" that flare up whenever danger is near.' },
  ],
  'char-op-sanji': [
    { it: 'Compleanno: 2 marzo. Età: 19 → 21. Altezza: 180 cm.', en: 'Birthday: March 2. Age: 19 → 21. Height: 180 cm.' },
    { it: 'Nazionalità SBS: Francia.', en: 'SBS nationality: France.' },
    { it: 'Non alza mai un dito contro una donna, costi quel che costi: un codice ereditato da Zeff. Le sue sopracciglia si arricciano al contrario rispetto ai fratelli Vinsmoke.', en: "He never raises a hand against a woman, whatever the cost: a code inherited from Zeff. His eyebrows curl the opposite way from his Vinsmoke siblings." },
    { it: 'Da cuoco non spreca mai il cibo; ama i piatti piccanti e saporiti.', en: 'As a cook he never wastes food; he loves spicy, savory dishes.' },
  ],
  'char-op-chopper': [
    { it: 'Compleanno: 24 dicembre. Età: 15 → 17. Altezza: ~90 cm (forma base).', en: 'Birthday: December 24. Age: 15 → 17. Height: ~90 cm (base form).' },
    { it: 'Nazionalità SBS: Canada.', en: 'SBS nationality: Canada.' },
    { it: 'Va matto per lo zucchero filato; se lo insulti mentre lo lodi, fa comunque la danza della gioia.', en: 'He’s crazy for cotton candy; insult him while praising him and he’ll do his happy dance anyway.' },
    { it: 'Trasforma il proprio corpo grazie alle «Rumble Ball» e al Frutto Uomo Uomo, pur essendo una renna.', en: 'He reshapes his body with "Rumble Balls" and the Human-Human Fruit, despite being a reindeer.' },
  ],
  'char-op-robin': [
    { it: 'Compleanno: 6 febbraio. Età: 28 → 30. Altezza: 188 cm.', en: 'Birthday: February 6. Age: 28 → 30. Height: 188 cm.' },
    { it: 'Nazionalità SBS: Russia.', en: 'SBS nationality: Russia.' },
    { it: 'È l’unica della ciurma a trovare divertenti certe situazioni macabre — un tratto che ha fin da bambina.', en: 'She’s the only crewmate who finds certain macabre situations funny — a trait she’s had since childhood.' },
    { it: 'Conosce molte lingue ed è l’unica al mondo, da bambina di Ohara, capace di leggere i Poneglyph.', en: 'She knows many languages and is the only person alive — since her Ohara childhood — able to read the Poneglyphs.' },
  ],
  'char-op-franky': [
    { it: 'Compleanno: 9 marzo. Età: 34 → 36. Altezza: 240 cm (corpo cyborg).', en: 'Birthday: March 9. Age: 34 → 36. Height: 240 cm (cyborg body).' },
    { it: 'Nazionalità SBS: U.S.A.', en: 'SBS nationality: U.S.A.' },
    { it: 'Funziona a cola: senza, le sue prestazioni crollano. Ha costruito la Thousand Sunny con il prezioso legno dell’Albero Adam.', en: 'He runs on cola: without it, his performance collapses. He built the Thousand Sunny from the precious Adam Wood.' },
    { it: 'Il suo vero nome è Cutty Flam; cambia acconciatura premendosi il naso.', en: 'His real name is Cutty Flam; he changes hairstyle by pressing his nose.' },
  ],
  'char-op-brook': [
    { it: 'Compleanno: 3 aprile. Età: 88 → 90. Altezza: 277 cm.', en: 'Birthday: April 3. Age: 88 → 90. Height: 277 cm.' },
    { it: 'Nazionalità SBS: Austria.', en: 'SBS nationality: Austria.' },
    { it: 'Dietro le sue battute sull’aldilà («Yohohoho!») ci sono 50 anni passati da solo, morto e risorto, ad aspettare i compagni.', en: "Behind his afterlife jokes ('Yohohoho!') lie 50 years spent alone, dead and revived, waiting for his crewmates." },
    { it: 'Il suo afro è «benedetto»: gli permette di restare riconoscibile anche da scheletro.', en: 'His afro is "blessed": it lets him stay recognizable even as a skeleton.' },
  ],
  'char-op-jinbe': [
    { it: 'Compleanno: 2 aprile. Età: 44 → 46. Altezza: 301 cm.', en: 'Birthday: April 2. Age: 44 → 46. Height: 301 cm.' },
    { it: 'Uomo-pesce squalo balena, timoniere della ciurma ed ex Corsaro: l’ultimo a unirsi ai Cappello di Paglia.', en: 'A whale-shark fish-man, the crew’s helmsman and a former Warlord: the last to join the Straw Hats.' },
    { it: 'Maestro del Karate degli Uomini-Pesce, capace di usare l’acqua stessa come arma.', en: 'A master of Fish-Man Karate, able to wield water itself as a weapon.' },
  ],

  /* --------------------------- Famiglia ASL / leggende --------------------------- */
  'char-op-ace': [
    { it: 'Compleanno: 1 gennaio. Figlio di Gol D. Roger e Portgas D. Rouge, che lo tenne in grembo venti mesi per proteggerlo dalla Marina.', en: 'Birthday: January 1. Son of Gol D. Roger and Portgas D. Rouge, who carried him for twenty months to protect him from the Marines.' },
    { it: 'Prese il cognome della madre per rinnegare quello del padre; comandante della 2ª divisione di Barbabianca.', en: "He took his mother's surname to reject his father's; commander of Whitebeard's 2nd division." },
  ],
  'char-op-sabo': [
    { it: 'Compleanno: 20 marzo. Dopo lo sparo del Drago Celeste perse la memoria, ritrovandola anni dopo alla notizia della morte di Ace.', en: "Birthday: March 20. After the Celestial Dragon's gunshot he lost his memory, regaining it years later at the news of Ace's death." },
    { it: 'Numero due dell’Armata Rivoluzionaria; ereditò il Frutto Fiamma di Ace vincendolo a Dressrosa.', en: "No. 2 of the Revolutionary Army; he inherited Ace's Flame-Flame Fruit by winning it in Dressrosa." },
  ],
  'char-op-roger': [
    { it: 'Compleanno: 31 dicembre. Non fu catturato: malato, si consegnò alla Marina per chiudere la sua era con un sorriso, dando il via all’Era dei Pirati.', en: 'Birthday: December 31. He was not captured: terminally ill, he turned himself in to end his era with a smile, launching the Great Pirate Era.' },
    { it: 'Unico ad aver raggiunto Laugh Tale e letto il Rio Poneglyph; udiva la «Voce di Tutte le Cose».', en: 'The only one to reach Laugh Tale and read the Rio Poneglyph; he could hear the "Voice of All Things".' },
  ],
  'char-op-whitebeard': [
    { it: 'Edward Newgate, «l’uomo più vicino al One Piece» e il più forte del mondo. Chiamava «figli» tutti i membri della sua ciurma.', en: 'Edward Newgate, "the man closest to One Piece" and the strongest in the world. He called every crew member his "son".' },
  ],
  'char-op-garp': [
    { it: '«Garp il Pugno», eroe della Marina che mise più volte all’angolo Roger. Nonno di Rufy e padre del rivoluzionario Dragon: una famiglia divisa in tre fronti.', en: '"Garp the Fist", a Marine hero who repeatedly cornered Roger. Grandfather of Luffy and father of the revolutionary Dragon: a family split across three sides.' },
  ],

  /* --------------------------- Imperatori / Corsari / Marina --------------------------- */
  'char-op-shanks': [
    { it: 'Compleanno: 9 marzo. Spende un patrimonio in alcol; da giovane fu mozzo sulla nave di Roger insieme a Bagy.', en: 'Birthday: March 9. He spends a fortune on liquor; in his youth he was a cabin boy on Roger’s ship alongside Buggy.' },
    { it: 'Privo di poteri del Frutto del Diavolo, è un Imperatore solo grazie ad Ambizione, spada e carisma.', en: 'Without any Devil Fruit power, he is an Emperor through Haki, swordsmanship and charisma alone.' },
  ],
  'char-op-buggy': [
    { it: 'Compleanno: 8 agosto. Ex mozzo della ciurma di Roger con Shanks; il Frutto Smembra lo rende immune ai tagli ma non sa nuotare.', en: "Birthday: August 8. A former cabin boy of Roger's crew with Shanks; the Chop-Chop Fruit makes him immune to cuts but unable to swim." },
    { it: 'La sua fama è quasi tutta frutto di equivoci fortunati: è diventato Corsaro e poi Imperatore… quasi per sbaglio.', en: 'His fame is almost entirely the product of lucky misunderstandings: he became a Warlord and then an Emperor… almost by accident.' },
  ],
  'char-op-big-mom': [
    { it: 'Charlotte Linlin: da neonata cresceva senza sosta. Sogna un mondo dove tutte le razze convivano alla stessa tavola.', en: 'Charlotte Linlin: as a baby she grew without stopping. She dreams of a world where all races live together at one table.' },
  ],
  'char-op-kaido': [
    { it: '«La creatura più forte del mondo». Ha tentato di togliersi la vita innumerevoli volte — e di farsi giustiziare — senza mai riuscirci.', en: '"The strongest creature in the world." He has tried to take his own life — and to be executed — countless times, never succeeding.' },
  ],
  'char-op-mihawk': [
    { it: 'Il più grande spadaccino del mondo. Vive solitario nel castello di Kuraigana e allenò Zoro durante i due anni di separazione.', en: "The world's greatest swordsman. He lives alone in Kuraigana Castle and trained Zoro during the two-year separation." },
  ],
  'char-op-crocodile': [
    { it: 'Nelle SBS Oda ha più volte schivato con ironia le domande sul passato di Crocodile e su un suo possibile legame con Ivankov.', en: "In the SBS Oda has repeatedly, jokingly dodged questions about Crocodile's past and a possible connection to Ivankov." },
  ],
  'char-op-ivankov': [
    { it: '«Regina» degli okama del Kamabakka. Il suo Frutto Ormone può alterare gli ormoni — e persino il sesso — di chiunque.', en: '"Queen" of the okama of Kamabakka. His Hormone-Hormone Fruit can alter anyone’s hormones — even their sex.' },
  ],
  'char-op-kuma': [
    { it: 'Da re tiranno a rivoluzionario, poi Corsaro e infine Pacifista: il Governo lo trasformò in un’arma senza volontà. Uno dei personaggi più tragici.', en: 'From tyrant king to revolutionary, then Warlord and finally Pacifista: the Government turned him into a will-less weapon. One of the most tragic characters.' },
  ],
  'char-op-vegapunk': [
    { it: 'Lo scienziato più geniale del mondo, «con 500 anni di anticipo» sul suo tempo; ha suddiviso la propria mente in sei satelliti.', en: "The world's most brilliant scientist, '500 years ahead' of his time; he split his mind into six satellites." },
  ],
  'char-op-doflamingo': [
    { it: 'Ex Drago Celeste che rinunciò allo status. Sotto lo pseudonimo «Joker» dominava il mercato nero del mondo, armi e Frutti SMILE compresi.', en: 'A former Celestial Dragon who renounced his status. Under the alias "Joker" he ruled the world’s black market, weapons and SMILE fruits included.' },
  ],
  'char-op-law': [
    { it: 'Compleanno: 6 ottobre. Nelle SBS: cibo preferito gli onigiri, detesta il pane (gag ricorrente).', en: 'Birthday: October 6. In the SBS: favorite food onigiri, hates bread (a running gag).' },
    { it: 'Il «D.» nascosto nel suo nome completo — Trafalgar D. Water Law — sconvolse Doflamingo: appartiene alla stirpe del «nemico di Dio».', en: 'The hidden "D." in his full name — Trafalgar D. Water Law — shocked Doflamingo: it marks him as one of the bloodline of the "enemy of God".' },
  ],
  'char-op-kid': [
    { it: 'Eustass Kid, Supernova rivale di Rufy e Law. Perse il braccio sinistro e lo ricostruì con rottami di metallo grazie al suo potere magnetico.', en: 'Eustass Kid, a Supernova rival of Luffy and Law. He lost his left arm and rebuilt it from metal scrap using his magnetic power.' },
  ],
  'char-op-katakuri': [
    { it: 'Comandante imbattuto di Big Mom. Nascondeva sotto la sciarpa una bocca enorme, frutto degli scherni dell’infanzia, e padroneggia l’Ambizione che vede nel futuro.', en: "Big Mom's undefeated commander. He hid an enormous mouth — the legacy of childhood mockery — under his scarf, and masters the Haki that sees the future." },
  ],
  'char-op-hancock': [
    { it: 'Compleanno: 2 settembre. Considerata la donna più bella del mondo; come le sorelle porta il nome di un serpente Gorgone.', en: 'Birthday: September 2. Considered the most beautiful woman in the world; like her sisters she bears the name of a Gorgon snake.' },
    { it: 'Da bambina fu resa schiava dai Draghi Celesti con le sorelle: un trauma nascosto dietro la sua arroganza.', en: 'As a child she was enslaved by the Celestial Dragons with her sisters: a trauma hidden behind her arrogance.' },
  ],
  'char-op-shirahoshi': [
    { it: 'Principessa sirena di Fish-Man Island e attuale arma ancestrale Poseidon: può richiamare e comandare i giganteschi Re del Mare.', en: 'Mermaid princess of Fish-Man Island and the current Ancient Weapon Poseidon: she can summon and command the giant Sea Kings.' },
  ],

  /* --------------------------- Supernove --------------------------- */
  'char-op-killer': [
    { it: 'Braccio destro di Kid. A Wano, come l’assassino «Kamazo», fu costretto a mangiare uno SMILE difettoso che lo fa ridere a comando — anche quando vorrebbe piangere.', en: "Kid's right hand. In Wano, as the assassin 'Kamazo', he was forced to eat a defective SMILE that makes him laugh on command — even when he wants to cry." },
  ],
  'char-op-hawkins': [
    { it: 'Basil Hawkins, «il Mago». Con i tarocchi predice le probabilità di sopravvivenza e, col Frutto Paglia, trasforma il corpo in un fantoccio voodoo.', en: 'Basil Hawkins, "the Magician". With tarot cards he predicts survival odds and, with the Straw-Straw Fruit, turns his body into a voodoo doll.' },
  ],
  'char-op-apoo': [
    { it: 'Scratchmen Apoo, «il Demone del Suono». Trasforma il proprio corpo in strumenti musicali e converte i suoni in attacchi a distanza.', en: 'Scratchmen Apoo, "the Roar of the Sea". He turns his body into musical instruments and converts sound into ranged attacks.' },
  ],
  'char-op-drake': [
    { it: 'X Drake, ex contrammiraglio della Marina e capo dell’unità segreta SWORD, infiltrato tra i Pirati delle Cento Bestie. Zoan dell’allosauro.', en: 'X Drake, a former Marine rear admiral and head of the secret unit SWORD, infiltrated among the Beasts Pirates. Allosaurus Zoan.' },
  ],
  'char-op-urouge': [
    { it: 'Urouge, «il Monaco Folle». Il suo Frutto converte il danno subìto in pura forza fisica: più lo colpisci, più diventa grosso.', en: 'Urouge, "the Mad Monk". His fruit converts damage taken into raw physical strength: the more you hit him, the bigger he grows.' },
  ],
  'char-op-bonney': [
    { it: 'Jewelry Bonney manipola l’età propria e altrui. Figlia di Bartholomew Kuma, è legata da un terribile segreto ai Draghi Celesti.', en: "Jewelry Bonney manipulates her own and others' age. The daughter of Bartholomew Kuma, she's bound by a terrible secret to the Celestial Dragons." },
  ],
  'char-op-bege': [
    { it: 'Capone «Gang» Bege, boss mafioso. Il Frutto Castello gli permette di ospitare un’intera fortezza — e un esercito — dentro il proprio corpo.', en: 'Capone "Gang" Bege, a mafia boss. The Castle-Castle Fruit lets him house an entire fortress — and an army — inside his own body.' },
  ],

  /* --------------------------- Ammiragli --------------------------- */
  'char-op-akainu': [
    { it: 'Sakazuki, attuale Grand’Ammiraglio. Il magma del suo Frutto «sovrasta» il fuoco; incarna la «Giustizia Assoluta» più spietata.', en: 'Sakazuki, the current Fleet Admiral. His fruit\'s magma "outranks" fire; he embodies the most ruthless "Absolute Justice".' },
  ],
  'char-op-aokiji': [
    { it: 'Kuzan, ex ammiraglio del ghiaccio. Lasciò la Marina dopo aver perso contro Akainu la corsa a Grand’Ammiraglio; oggi è affiliato a Barbanera.', en: "Kuzan, the former ice admiral. He left the Marines after losing the race for Fleet Admiral to Akainu; today he's affiliated with Blackbeard." },
  ],
  'char-op-kizaru': [
    { it: 'Borsalino, ammiraglio della luce. Si muove e colpisce alla velocità della luce; flemmatico e ambiguo, segue gli ordini senza farsi domande.', en: 'Borsalino, the light admiral. He moves and strikes at the speed of light; laid-back and ambiguous, he follows orders without question.' },
  ],
  'char-op-fujitora': [
    { it: 'Issho, ammiraglio cieco che controlla la gravità: si accecò di proposito per non vedere più il male del mondo. Vuole abolire il sistema dei Corsari.', en: 'Issho, the blind admiral who controls gravity: he blinded himself on purpose so as not to see the world\'s evil any longer. He seeks to abolish the Warlord system.' },
  ],
  'char-op-greenbull': [
    { it: 'Aramaki «Toro Verde», ammiraglio dai poteri vegetali. Può restare anni senza mangiare, assorbendo nutrimento dalla vita che lo circonda.', en: 'Aramaki "Green Bull", the admiral of plant powers. He can go years without eating, absorbing nourishment from the life around him.' },
  ],

  /* --------------------------- Marina / Wano / altri --------------------------- */
  'char-op-smoker': [
    { it: 'Cacciatore implacabile dal Frutto Fumo e dal manganello di pietra di mare. Insegue Rufy fin dai tempi di Loguetown, mosso da una giustizia tutta sua.', en: 'A relentless hunter with the Smoke-Smoke Fruit and a Seastone jutte. He has chased Luffy since Loguetown, driven by a justice all his own.' },
  ],
  'char-op-tashigi': [
    { it: 'Spadaccina della Marina, è identica alla defunta Kuina: una somiglianza che turba profondamente Zoro ogni volta che la incontra.', en: 'A Marine swordswoman, she is identical to the late Kuina: a resemblance that deeply unsettles Zoro whenever they meet.' },
  ],
  'char-op-coby': [
    { it: 'Da timido mozzo di Alvida a eroe della Marina: a Marineford risvegliò l’Ambizione dell’Osservazione. Sogna di diventare ammiraglio.', en: "From Alvida's timid chore-boy to a Marine hero: at Marineford he awakened Observation Haki. He dreams of becoming an admiral." },
  ],
  'char-op-magellan': [
    { it: 'Direttore di Impel Down: il Frutto Veleno lo rende mortale al solo tatto, ma — gag celebre — lo costringe a passare ore in bagno.', en: 'Warden of Impel Down: the Venom-Venom Fruit makes him lethal to the touch, but — a famous gag — forces him to spend hours on the toilet.' },
  ],
  'char-op-enel': [
    { it: 'Falso «Dio» di Skypiea: il Frutto Fulmine lo rende quasi onnipotente tra le nuvole, e il «Mantra» (Ambizione) gli fa prevedere le mosse. Dopo la sconfitta partì per la Luna.', en: "The false 'God' of Skypiea: the Rumble-Rumble Fruit makes him near-omnipotent among the clouds, and 'Mantra' (Haki) lets him foresee moves. After his defeat he left for the Moon." },
  ],
  'char-op-marco': [
    { it: 'Marco la Fenice, primo comandante di Barbabianca. Lo Zoan mitologico della fenice gli dona fiamme azzurre che rigenerano le ferite.', en: "Marco the Phoenix, Whitebeard's first-division commander. The mythical phoenix Zoan grants him blue flames that heal wounds." },
  ],
  'char-op-yamato': [
    { it: 'Figlio/a di Kaido, si identifica come Kozuki Oden dopo averne letto il diario. Possiede lo Zoan mitologico del lupo divino Okuchi no Makami.', en: "Kaido's child, who identifies as Kozuki Oden after reading his journal. They wield the mythical Zoan of the guardian wolf Okuchi no Makami." },
  ],
  'char-op-kinemon': [
    { it: 'Capo dei Nove Foderi Rossi e maestro dello stile «Volpe di Fuoco», capace di tagliare le fiamme. Con un’arte da kitsune sa travestire chiunque.', en: "Leader of the Nine Red Scabbards and master of the 'Foxfire' style, able to cut flames. With a kitsune art he can disguise anyone." },
  ],
  'char-op-momonosuke': [
    { it: 'Kozuki Momonosuke, erede di Wano. Mangiò un Frutto artificiale del drago creato da Vegapunk; la madre Toki lo proiettò vent’anni nel futuro.', en: 'Kozuki Momonosuke, heir of Wano. He ate an artificial dragon fruit made by Vegapunk; his mother Toki sent him twenty years into the future.' },
  ],
  'char-op-pudding': [
    { it: 'Charlotte Pudding, ibrida del clan dei Tre Occhi. Da finta promessa sposa-trappola di Sanji, finì per innamorarsene davvero.', en: 'Charlotte Pudding, a hybrid of the Three-Eye Tribe. From a fake bride-trap for Sanji, she ended up truly falling for him.' },
  ],
  'char-op-perospero': [
    { it: 'Charlotte Perospero, primogenito di Big Mom e Ministro delle Caramelle. Il Frutto Lecca Lecca gli permette di creare e plasmare caramello solido.', en: "Charlotte Perospero, Big Mom's eldest son and Minister of Candy. The Lick-Lick Fruit lets him create and shape solid candy." },
  ],
};

