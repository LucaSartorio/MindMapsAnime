import type { Jutsu, Localizable } from '@/types';

const ab = (
  id: string,
  name: string,
  type: string,
  characterIds: string[],
  shortDescription: Localizable,
  extra: Partial<Jutsu> = {},
): Jutsu => ({
  id: `tec-fma-${id}`,
  worldId: 'world-fullmetalalchemist',
  name,
  type,
  characterIds: characterIds.map((c) => `char-fma-${c}`),
  shortDescription,
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...extra,
});

/**
 * Sistema di poteri di Fullmetal Alchemist (`WorldDataset.jutsu`, termine UI «Alchimia»).
 * Un solo facet: `type` = la CATEGORIA definita in `config.ts` (`FMA_ABILITY_CATEGORIES`):
 * principi dell'alchimia, alchimia amestriana, alcahestria di Xing, alchimia proibita,
 * poteri degli Homunculus e alchimia del film di Milos (`canonStatus: 'movie'`).
 * Niente secondo facet (`chakraNature`) e niente automail (tecnologia, non alchimia).
 * Le tecniche dichiarano i propri utilizzatori (`characterIds`): `index.ts` ricava da qui
 * i `jutsuIds` dei personaggi. I testi sono parafrasi originali di fatti (vedi manifest).
 */
export const fmaAbilities: Jutsu[] = [
  /* ============================ I PRINCIPI ============================ */
  ab('equivalent-exchange', 'Equivalent Exchange', 'principle', ['edward-elric', 'alphonse-elric'], {
    it: "La legge che regge l'alchimia: per ottenere qualcosa bisogna perdere qualcosa di valore uguale. Creare richiede che tutti i componenti siano presenti; il tentativo di riportare in vita la madre mostra ai fratelli Elric quanto sia alto il prezzo di violarla.",
    en: 'The law that governs alchemy: to obtain something, something of equal value must be lost. Creating requires every component to be present; the attempt to revive their mother shows the Elric brothers how high the price of breaking it is.',
  }, { localizedName: { it: 'Scambio equivalente', en: 'Equivalent Exchange', ja: '等価交換' }, japaneseName: '等価交換', tags: ['principi'] }),
  ab('transmutation-circle', 'Transmutation circle', 'principle', ['roy-mustang', 'solf-j-kimblee', 'may-chang', 'scar'], {
    it: "Il disegno con cui l'alchimista crea o rimodella una sostanza. Alcuni lo portano addosso: i guanti di Mustang, i palmi tatuati di Kimblee, i cerchi con cui May usa l'alcahestria.",
    en: 'The pattern an alchemist draws to create or reshape a substance. Some wear it: Mustang\'s gloves, Kimblee\'s tattooed palms, the circles May uses for alkahestry.',
  }, { localizedName: { it: 'Cerchio di trasmutazione', en: 'Transmutation circle', ja: '錬成陣' }, japaneseName: '錬成陣', tags: ['principi'] }),
  ab('truth-and-the-gate', 'The Truth and the Gate', 'principle', ['edward-elric', 'alphonse-elric', 'izumi-curtis', 'father'], {
    it: "Entità onnisciente che fa rispettare le leggi dell'alchimia: chi tenta la trasmutazione umana si ritrova davanti alla sua Porta, vede tutta l'informazione dell'universo e paga con ciò che ha più caro, spesso una parte del corpo. Chi sopravvive con la mente intatta può poi trasmutare senza cerchio.",
    en: 'An all-knowing entity that enforces the laws of alchemy: whoever attempts human transmutation faces its Gate, sees all the information in the universe and pays with something dear, often a part of the body. Those who come back with their mind intact can later transmute without a circle.',
  }, {
    localizedName: { it: 'La Verità e la Porta', en: 'The Truth and the Gate', ja: '真理の扉' },
    japaneseName: '真理の扉',
    longDescription: {
      it: "Ogni essere vivente ha la propria Porta. Edward e Izumi vedono la Verità dopo una trasmutazione umana fallita; Father, nel finale, usa le anime catturate per raggiungere l'essere oltre la Porta. Alla fine Edward offre alla Porta la propria capacità di fare alchimia in cambio del corpo di Alphonse.",
      en: 'Every living being has its own Gate. Edward and Izumi see the Truth after a failed human transmutation; in the finale Father uses the captured souls to reach the being beyond the Gate. At the end Edward offers the Gate his own ability to perform alchemy in exchange for Alphonse\'s body.',
    },
    tags: ['principi', 'anima'],
  }),

  /* ============================ ALCHIMIA AMESTRIANA ============================ */
  ab('alchemy-without-a-circle', 'Alchemy without a circle', 'amestrian_alchemy', ['edward-elric', 'alphonse-elric', 'izumi-curtis'], {
    it: "Chi ha visto la Verità può trasmutare senza disegnare un cerchio: a Edward basta battere le mani. Anche Izumi ne è capace, e Alphonse acquisisce la stessa abilità; le loro trasmutazioni sono descritte come particolarmente potenti.",
    en: 'Those who have seen the Truth can transmute without drawing a circle: Edward only has to clap his hands. Izumi can do it too, and Alphonse eventually gains the same ability; their transmutations are described as especially powerful.',
  }, { localizedName: { it: 'Alchimia senza cerchio', en: 'Alchemy without a circle' }, tags: ['anima'] }),
  ab('flame-alchemy', 'Flame alchemy', 'amestrian_alchemy', ['roy-mustang'], {
    it: "L'alchimia di Roy Mustang, l'«Alchimista di Fuoco»: i cerchi sui guanti generano scintille, e variando la densità dell'ossigeno nell'aria crea e dirige fiamme a distanza. Con i guanti bagnati non funziona. Gli appunti della tecnica sono tatuati sulla schiena di Riza Hawkeye.",
    en: 'The alchemy of Roy Mustang, the Flame Alchemist: the circles on his gloves produce sparks, and by varying the oxygen density of the air he creates and directs flames at a distance. It does not work with the gloves wet. The notes of the technique are tattooed on Riza Hawkeye\'s back.',
  }, { localizedName: { it: 'Alchimia del fuoco', en: 'Flame alchemy' }, tags: ['fuoco'] }),
  ab('strong-arm-alchemy', 'Strong Arm alchemy', 'amestrian_alchemy', ['alex-louis-armstrong'], {
    it: "Armstrong, l'«Alchimista del Braccio Forte», indossa un cestus che gli permette di rimodellare qualsiasi oggetto solido colpisca; le sue trasmutazioni sono tramandate nella famiglia attraverso le generazioni.",
    en: 'Armstrong, the Strong Arm Alchemist, wears a cestus that lets him reshape any solid object he punches; the talent is described as passed down through his family across generations.',
  }, { localizedName: { it: 'Alchimia del Braccio Forte', en: 'Strong Arm alchemy' }, tags: ['pugno'] }),
  ab('explosive-alchemy', 'Explosive alchemy', 'amestrian_alchemy', ['solf-j-kimblee'], {
    it: "Kimblee, l'«Alchimista Cremisi», ha cerchi tatuati sui palmi e, battendo le mani, trasforma in una bomba qualsiasi cosa tocchi. Nella guerra di Ishval la usa per massacrare, aiutandosi con una Pietra Filosofale imperfetta che ne amplifica i poteri.",
    en: 'Kimblee, the Crimson Alchemist, has circles tattooed on his palms and, by clapping, turns anything he touches into a bomb. In the Ishvalan war he uses it to massacre, helped by an imperfect Philosopher\'s Stone that amplifies his powers.',
  }, { localizedName: { it: 'Alchimia esplosiva', en: 'Explosive alchemy' }, tags: ['esplosione'] }),
  ab('chimeric-alchemy', 'Chimeric alchemy', 'amestrian_alchemy', ['shou-tucker'], {
    it: "La fusione di due o più esseri viventi in una chimera: richiede una profonda conoscenza dell'anatomia, e invertirla è ancora più difficile. Il Capitolo 1 la mostra già; chimere umane vengono create in segreto dall'esercito.",
    en: 'The fusion of two or more living beings into a chimera: it demands deep knowledge of anatomy, and reversing it is harder still. Chapter 1 already shows it; human chimeras are created in secret by the military.',
  }, { localizedName: { it: 'Alchimia chimerica', en: 'Chimeric alchemy', ja: '合成獣' }, japaneseName: '合成獣', clanIds: ['faction-fma-greeds-gang'], tags: ['chimere'] }),
  ab('blood-seal', 'Blood seal', 'amestrian_alchemy', ['edward-elric', 'alphonse-elric'], {
    it: "Il sigillo di sangue con cui Edward lega l'anima di Alphonse a un'armatura: finché il segno resta intatto, Alphonse è quasi invulnerabile ma non prova alcuna sensazione.",
    en: 'The blood mark with which Edward binds Alphonse\'s soul to a suit of armor: as long as the mark stays intact Alphonse is nearly invulnerable but feels nothing.',
  }, { localizedName: { it: 'Sigillo di sangue', en: 'Blood seal' }, tags: ['sangue', 'anima'] }),

  /* ============================ ALCAHESTRIA ============================ */
  ab('alkahestry', 'Alkahestry', 'alkahestry', ['may-chang', 'alphonse-elric', 'van-hohenheim'], {
    it: "L'arte di Xing affine all'alchimia, più orientata alla medicina e alle trasmutazioni a distanza, che attinge a un'energia diversa da quella amestriana. Nel manga è presentata come tecnica sviluppata da Hohenheim; nell'epilogo Alphonse parte per Xing per studiarla.",
    en: 'The Xingese art akin to alchemy, better suited to medicine and ranged transmutations, drawing on a different energy from the Amestrian kind. The manga presents it as a technique developed by Hohenheim; in the epilogue Alphonse leaves for Xing to study it.',
  }, { localizedName: { it: 'Alcahestria', en: 'Alkahestry', ja: '錬丹術' }, japaneseName: '錬丹術', tags: ['xing', 'guarigione'] }),
  ab('may-ranged-alkahestry', 'Ranged alkahestry with knives', 'alkahestry', ['may-chang'], {
    it: "May lancia coltelli (hyō) che fanno da supporto: un cerchio sul bersaglio e uno vicino a lei le permettono di manipolare la materia a distanza. È l'unica a usare nella storia l'alcahestria tradizionale di Xing.",
    en: 'May throws knives that serve as anchors: one circle on the target and one near herself let her manipulate matter at a distance. She is the only character shown using traditional Xingese alkahestry.',
  }, { localizedName: { it: 'Alcahestria a distanza con i coltelli', en: 'Ranged alkahestry with knives' }, tags: ['xing', 'coltelli'] }),
  ab('qi-sensing', 'Qi sensing', 'alkahestry', ['ling-yao', 'lan-fan', 'may-chang'], {
    it: "Gli Xingesi percepiscono il qi: riconoscono gli Homunculus e avvertono molte anime in uno stesso luogo. Ling, per esempio, riesce a percepire gli Homunculus.",
    en: 'Xingese people can sense qi: they spot Homunculi and detect many souls in one place. Ling, for example, can sense Homunculi.',
  }, { localizedName: { it: 'Percezione del qi', en: 'Qi sensing' }, tags: ['xing', 'anima'] }),
  ab('scar-destruction', "Scar's destruction", 'alkahestry', ['scar'], {
    it: "Il braccio destro che il fratello di Scar gli innesta non trasmuta: scompone gli oggetti nei loro elementi, distruggendoli. Il potere, proibito dalla fede ishvaliana, deriva dalle ricerche del fratello sull'alcahestria e non è bloccato dalla neutralizzazione di Father.",
    en: 'The right arm that Scar\'s brother grafts onto him does not transmute: it breaks objects down into their elements, destroying them. The power, forbidden by the Ishvalan faith, draws on his brother\'s research into alkahestry and is not blocked by Father\'s neutralization.',
  }, { localizedName: { it: 'Distruzione di Scar', en: "Scar's destruction" }, tags: ['distruzione', 'ishval'] }),
  ab('scar-reconstruction', "Scar's reconstruction", 'alkahestry', ['scar'], {
    it: "Il secondo cerchio tatuato di Scar, sul braccio sinistro, serve a creare ciò che il destro distrugge.",
    en: 'The second circle tattooed on Scar, on his left arm, is used to create what the right one destroys.',
  }, { localizedName: { it: 'Ricostruzione di Scar', en: "Scar's reconstruction" }, referenceStatus: 'needs_verification', tags: ['ishval'] }),

  /* ============================ ALCHIMIA PROIBITA ============================ */
  ab('human-transmutation', 'Human transmutation', 'forbidden_alchemy', ['edward-elric', 'alphonse-elric', 'izumi-curtis', 'roy-mustang'], {
    it: "L'unico tabù dell'alchimia: tentare di creare o riportare in vita un essere umano fallisce sempre, produce un corpo deforme di breve vita e porta alla Porta della Verità. Edward e Alphonse la tentano per la madre, Izumi per il figlio; Mustang vi è costretto come sacrificio.",
    en: 'The one taboo of alchemy: attempting to create or revive a human being always fails, produces a botched short-lived body and leads to the Gate of Truth. Edward and Alphonse attempt it for their mother and Izumi for her child; Mustang is forced through it as a sacrifice.',
  }, { localizedName: { it: 'Trasmutazione umana', en: 'Human transmutation', ja: '人体錬成' }, japaneseName: '人体錬成', tags: ['tabu', 'anima'] }),
  ab('philosophers-stone', "Philosopher's Stone", 'forbidden_alchemy', ['father', 'king-bradley', 'solf-j-kimblee', 'ling-yao', 'van-hohenheim', 'lust', 'gluttony', 'envy', 'greed'], {
    it: "Ottenuta intrappolando migliaia di anime umane, è l'unico modo noto per aggirare lo Scambio Equivalente: dà una forma di immortalità, trasmutazioni facili e rigenerazione. Alimenta gli Homunculus e può anche guarire, ma resta una cosa terribile fatta con vite umane.",
    en: 'Made by trapping thousands of human souls, it is the only known way around Equivalent Exchange: it grants a form of immortality, easy transmutation and regeneration. It powers the Homunculi and can also heal, but it remains a terrible thing built from human lives.',
  }, {
    localizedName: { it: 'Pietra Filosofale', en: "Philosopher's Stone", ja: '賢者の石' },
    japaneseName: '賢者の石',
    tags: ['pietra-filosofale', 'anima'],
  }),
  ab('nationwide-transmutation-circle', 'Nationwide transmutation circle', 'forbidden_alchemy', ['father', 'sloth', 'scar'], {
    it: "Il piano di Father: i cerchi sparsi per Amestris, tracciati sottoterra anche da Sloth, formano un unico cerchio gigantesco che, nel giorno dell'eclissi, assorbe le anime del paese. Scar e i profughi ishvaliani ne attivano uno corretto che ostacola il piano.",
    en: 'Father\'s plan: the circles scattered across Amestris, dug underground by Sloth among others, form a single gigantic circle that on the day of the eclipse absorbs the country\'s souls. Scar and the Ishvalan refugees activate a corrected one that obstructs the plan.',
  }, { localizedName: { it: 'Cerchio di trasmutazione nazionale', en: 'Nationwide transmutation circle' }, tags: ['pietra-filosofale', 'anima'] }),
  ab('hohenheim-stone-shards', "Hohenheim's Stone shards", 'forbidden_alchemy', ['van-hohenheim'], {
    it: "Hohenheim porta frammenti di Pietra Filosofale con cui, nel finale, annulla la trasmutazione di Father: attivati dall'eclissi, liberano le anime rubate.",
    en: 'Hohenheim carries fragments of Philosopher\'s Stone with which, in the finale, he nullifies Father\'s transmutation: activated by the eclipse, they free the stolen souls.',
  }, { localizedName: { it: 'Frammenti di Pietra di Hohenheim', en: "Hohenheim's Stone shards" }, longDescription: { it: "Hohenheim fugge da Xerxes portando con sé le anime dei suoi cittadini e, secoli dopo, ne custodisce i frammenti di Pietra. Quando affronta Father da solo, questi non riesce a prendergli la Pietra; nel giorno dell'eclissi i frammenti, attivati, liberano le anime rubate.", en: 'Hohenheim flees Xerxes carrying the souls of its citizens and, centuries later, keeps fragments of the Stone. When he faces Father alone, Father fails to take his Stone; on the day of the eclipse the activated fragments free the stolen souls.' }, tags: ['pietra-filosofale', 'anima'] }),

  /* ============================ POTERI DEGLI HOMUNCULUS ============================ */
  ab('ultimate-spear', 'Ultimate Spear', 'homunculus', ['lust'], {
    it: "Le dita di Lust si allungano fino a grandi distanze e tagliano quasi ogni sostanza esistente: per questo è la «Lancia Suprema». Mustang la brucia finché la sua Pietra si esaurisce.",
    en: 'Lust\'s fingers extend to great lengths and cut through nearly any substance on Earth, which is why she is the "Ultimate Spear". Mustang burns her until her Stone is depleted.',
  }, { localizedName: { it: 'Lancia Suprema', en: 'Ultimate Spear', ja: '最強の矛' }, japaneseName: '最強の矛', longDescription: { it: 'Lust usa le dita-lancia per estorcere informazioni a Jean Havoc, che lascia paralizzato con un colpo alla schiena, e per ferire Maes Hughes. Muore per mano di Mustang, che la brucia ripetutamente fino a esaurirle la Pietra: la sua abilità non la protegge dal fuoco.', en: "Lust uses her spear-fingers to extract information from Jean Havoc, whom she leaves paralysed with a stab through the spine, and to wound Maes Hughes. She dies at Mustang's hands, who burns her repeatedly until her Stone is depleted: her ability does not shield her from fire." }, tags: ['lama'] }),
  ab('devouring-maw', 'Devouring maw', 'homunculus', ['gluttony'], {
    it: "Mascelle potenti e saliva acida; quando si attiva, lo stomaco di Gluttony si apre e tutto ciò che inghiotte finisce in una dimensione infernale piena di sangue. L'energia della sua Pietra può esaurirsi.",
    en: 'Powerful jaws and acidic saliva; when activated, Gluttony\'s stomach opens and whatever he swallows is sent to a hellish dimension full of blood. The energy of his Stone can run out.',
  }, { localizedName: { it: 'Fauci divoratrici', en: 'Devouring maw' }, tags: ['sangue'] }),
  ab('shapeshifting', 'Shapeshifting', 'homunculus', ['envy'], {
    it: "Envy assume l'aspetto di chiunque e può trasformarsi in una enorme forma mostruosa: ne approfitta per infiltrarsi e impersonare le persone, come quando uccide Maes Hughes presentandosi come sua moglie Gracia.",
    en: 'Envy can take anyone\'s appearance as well as a massive monstrous form, and uses it to infiltrate and impersonate people, as when it kills Maes Hughes by appearing as his wife Gracia.',
  }, { localizedName: { it: 'Mutaforma', en: 'Shapeshifting' }, tags: ['metamorfosi'] }),
  ab('ultimate-shield', 'Ultimate Shield', 'homunculus', ['greed'], {
    it: "Greed riorganizza gli atomi di carbonio del proprio corpo in un'armatura dura come il diamante: lo «Scudo Supremo». Se viene fuso, rimane solo la sua Pietra.",
    en: 'Greed rearranges the carbon atoms of his body into diamond-hard armor: the "Ultimate Shield". If melted down, only his Stone remains.',
  }, { localizedName: { it: 'Scudo Supremo', en: 'Ultimate Shield', ja: '最強の盾' }, japaneseName: '最強の盾', longDescription: { it: 'Greed compare in due fasi: la prima incarnazione viene fusa nella propria Pietra e consumata da Father; la seconda occupa il corpo di Ling Yao. Alla fine si sacrifica per indebolire Father, permettendo a Edward di colpirlo.', en: "Greed appears in two phases: the first incarnation is melted into his Stone and consumed by Father; the second occupies Ling Yao's body. In the end he sacrifices himself to weaken Father, letting Edward strike him." }, tags: ['cristallo'] }),
  ab('sloth-strength-and-speed', 'Superhuman strength and speed', 'homunculus', ['sloth'], {
    it: "Sloth è fisicamente potentissimo ed è il più veloce degli Homunculus; è anche chi scava il grande cerchio nazionale di Father.",
    en: 'Sloth is physically very powerful and the fastest of the Homunculi; it is also the one who digs Father\'s great nationwide circle.',
  }, { localizedName: { it: 'Forza e velocità sovrumane', en: 'Superhuman strength and speed' }, longDescription: { it: 'Sloth fa la guardia a Father ed è pigro per natura. Al Forte Briggs è Olivier Armstrong a fermarlo congelandolo, mentre nel manga muore per mano dei fratelli Armstrong insieme a Izumi e Sig Curtis, accettando la morte con un sorriso.', en: 'Sloth stands guard over Father and is lazy by nature. At Fort Briggs it is Olivier Armstrong who stops it by freezing it, while in the manga it is killed by the Armstrong siblings together with Izumi and Sig Curtis, accepting death with a smile.' }, tags: ['velocita'] }),
  ab('shadow-manipulation', 'Shadow manipulation', 'homunculus', ['pride'], {
    it: "Pride distrugge o manipola ciò che la sua ombra tocca, vede attraverso di essa, può possedere altri recidendo i legami con la loro anima e assume i tratti di ciò che divora. Ha bisogno di una fonte di luce, e una luce intensa può «uccidere» l'ombra.",
    en: 'Pride destroys or manipulates whatever its shadow touches, sees through it, can possess others by severing their soul connections and takes on the traits of what it eats. It needs a light source, and bright light can "kill" the shadow.',
  }, { localizedName: { it: "Manipolazione dell'ombra", en: 'Shadow manipulation' }, tags: ['ombra'] }),
  ab('ultimate-eye', 'Ultimate Eye', 'homunculus', ['king-bradley'], {
    it: "L'«Occhio Supremo» di Wrath gli permette di prevedere le mosse dell'avversario e gli dà una vista superiore; ma Bradley invecchia come un essere umano, e questo frena la velocità dell'Occhio.",
    en: 'Wrath\'s "Ultimate Eye" lets him predict an opponent\'s moves and gives him superior eyesight; but Bradley ages like a human, which hampers the speed of the Eye.',
  }, { localizedName: { it: 'Occhio Supremo', en: 'Ultimate Eye' }, longDescription: { it: "Bradley è il Führer di Amestris, cresciuto come capo ideale: da bambino gli viene innestata nel sangue una Pietra Filosofale, e fra tutti i candidati è l'unico a sopravvivere. Oltre all'Occhio è un abile spadaccino.", en: "Bradley is the Führer of Amestris, raised as the ideal leader: a Philosopher's Stone was injected into his blood, and he was the only one to survive. Besides the Eye he is a skilled swordsman." }, tags: ['occhio'] }),
  ab('father-soul-absorption', "Father's soul absorption", 'homunculus', ['father'], {
    it: "Father assorbe anime per costruire la propria Pietra Filosofale e può cambiare forma e creare nuovi corpi; è indebolito quando la sua Pietra viene danneggiata.",
    en: 'Father absorbs souls to build his own Philosopher\'s Stone and can change shape and create new bodies; he is weakened when his Stone is damaged.',
  }, { localizedName: { it: 'Assorbimento delle anime di Father', en: "Father's soul absorption" }, longDescription: { it: "Father nasce a Xerxes dal sangue dello schiavo Van Hohenheim, crea gli Homunculus e muove l'esercito dall'ombra. Nel giorno dell'eclissi assorbe le anime di Amestris; Edward gli trafigge il petto e Father viene trascinato per sempre attraverso la Porta.", en: 'Father is born in Xerxes from the blood of the slave Van Hohenheim, creates the Homunculi and moves the military from the shadows. On the day of the eclipse he absorbs the souls of Amestris; Edward pierces his chest and Father is pulled through the Gate for good.' }, tags: ['anima', 'metamorfosi'] }),
  ab('alchemy-negation', 'Alchemy negation', 'homunculus', ['father'], {
    it: "Rimanendo sottoterra sopra le placche tettoniche, Father può annullare l'alchimia che attinge all'energia tettonica, come quella degli alchimisti amestriani. L'alcahestria e il potere di Scar non ne sono bloccati.",
    en: 'By staying underground above the tectonic plates, Father can negate alchemy that draws on tectonic energy, like that of the Amestrian alchemists. Alkahestry and Scar\'s power are not blocked by it.',
  }, { localizedName: { it: "Annullamento dell'alchimia", en: 'Alchemy negation' }, tags: ['terra'] }),
  ab('homunculus-regeneration', 'Stone-powered regeneration', 'homunculus', ['lust', 'gluttony', 'envy', 'greed'], {
    it: "Gli Homunculus muoiono soltanto quando la loro Pietra si esaurisce: finché ne resta energia si rigenerano dalle ferite, ed è per questo che vanno logorati o distrutti fin dalla Pietra.",
    en: 'Homunculi die only when their Stone is depleted: while energy remains they regenerate from wounds, which is why they must be worn down or destroyed down to the Stone.',
  }, { localizedName: { it: 'Rigenerazione tramite la Pietra', en: 'Stone-powered regeneration' }, tags: ['pietra-filosofale'] }),

  /* ============================ IL FILM DI MILOS (movie) ============================ */
  ab('milos-healing-alchemy', 'Healing alchemy of Milos', 'milos', ['julia-crichton', 'melvin-voyager'], {
    it: "Una forma di alchimia che i fratelli Elric non conoscono, capace di guarire le ferite: la usa Julia, e anche il falso «Ashleigh», che la sfrutta per trasformare l'acqua in neve.",
    en: 'A form of alchemy the Elrics do not know, able to heal injuries: Julia uses it, and so does the fake "Ashleigh", who uses it to turn water into snow.',
  }, { localizedName: { it: 'Alchimia curativa di Milos', en: 'Healing alchemy of Milos' }, canonStatus: 'movie', tags: ['film', 'guarigione'] }),
  ab('sanguine-star', 'Sanguine Star', 'milos', ['julia-crichton', 'ashleigh-crichton'], {
    it: "Pietra rossa luminosa che gli Elric sospettano sia una Pietra Filosofale: per crearla serve un cerchio tridimensionale tracciato col sangue, attivato col sangue di Miranda, e dovrebbe controllare il magma. Ashleigh ne ingoia una per curare le sue ferite; Julia ne ingoia una per fermare la lava e, curando il fratello, apre la Porta e perde la gamba sinistra.",
    en: 'A glowing red stone the Elrics suspect is a Philosopher\'s Stone: creating it takes a three-dimensional circle drawn in blood and activated with Miranda\'s blood, and it is meant to control magma. Ashleigh swallows one to heal his wounds; Julia swallows one to stop the lava and, healing her brother, opens the Gate and loses her left leg.',
  }, {
    localizedName: { it: 'Stella Sanguigna', en: 'Sanguine Star' },
    canonStatus: 'movie',
    referenceStatus: 'needs_verification',
    tags: ['film', 'pietra-filosofale', 'sangue'],
  }),
];
