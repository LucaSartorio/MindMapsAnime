import type { Jutsu, Localizable } from '@/types';

type Origin = Jutsu['chakraNature'];

const ab = (
  id: string,
  name: string,
  type: string,
  origin: Origin,
  characterIds: string[],
  shortDescription: Localizable,
  extra: Partial<Jutsu> = {},
): Jutsu => ({
  id: `tit-aot-${id}`,
  worldId: 'world-attackontitan',
  name,
  type,
  chakraNature: origin,
  characterIds: characterIds.map((c) => `char-aot-${c}`),
  shortDescription,
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...extra,
});

const MARLEY_NINE: Origin = ['ymir', 'eldian_empire', 'marley'];
const PARADIS_NINE: Origin = ['ymir', 'eldian_empire', 'paradis'];
const TITAN: Origin = ['ymir'];

/**
 * Poteri di Attack on Titan (`WorldDataset.jutsu`, termine UI «Giganti & Poteri»).
 * Due facet, definiti in `config.ts`:
 *  - `type` = la CATEGORIA: i Nove Giganti, i poteri dei Giganti, il sangue reale,
 *    gli Ackerman, l'equipaggiamento, le armi, la scienza, le tattiche;
 *  - `chakraNature` = l'ORIGINE: Ymir, l'Impero eldiano, Paradis, Marley, Hizuru.
 *
 * Ogni Gigante dei Nove è una scheda con i suoi detentori noti in ordine; le forme
 * dei personaggi sono anche sulla loro scheda, in «Trasformazioni».
 */
export const aotAbilities: Jutsu[] = [
  /* ============================== I NOVE GIGANTI ============================== */
  ab('founding-titan', 'Founding Titan', 'nine_titans', PARADIS_NINE, ['ymir-fritz', 'karl-fritz', 'uri-reiss', 'frieda-reiss', 'grisha', 'eren'], {
    it: "Il Gigante che controlla tutti gli altri Giganti e riscrive i ricordi e i corpi degli Eldiani attraverso i Sentieri. Il pieno potere richiede il sangue reale — o il contatto con chi lo ha.",
    en: 'The Titan that controls all other Titans and rewrites the memories and bodies of Eldians through the Paths. Its full power requires royal blood — or contact with someone who has it.',
  }, {
    japaneseName: '始祖の巨人',
    longDescription: {
      it: "Dal 145° re in poi chi lo eredita di sangue reale subisce il «voto di rinuncia alla guerra» di Karl Fritz. Detentori noti: Karl Fritz e i suoi successori, Uri Reiss, Frieda Reiss, Grisha Yeager (che non è di sangue reale), Eren Yeager. Eren lo usa insieme a Zeke per scatenare il Boato della Terra; la sua forma finale è uno scheletro colossale alto come una montagna.",
      en: "From the 145th king onwards, whoever inherits it with royal blood is bound by Karl Fritz's 'vow renouncing war'. Known holders: Karl Fritz and his successors, Uri Reiss, Frieda Reiss, Grisha Yeager (who is not of royal blood), Eren Yeager. Eren uses it with Zeke to unleash the Rumbling; its final form is a colossal skeleton as tall as a mountain.",
    },
    tags: ['nove-giganti', 'fondatore'],
  }),
  ab('attack-titan', 'Attack Titan', 'nine_titans', PARADIS_NINE, ['kruger', 'grisha', 'eren'], {
    it: "Il Gigante che «ha sempre lottato per la libertà»: vede i ricordi dei detentori futuri, oltre a quelli dei passati. Detentori noti: Eren Kruger, Grisha Yeager, Eren Yeager.",
    en: "The Titan that 'has always fought for freedom': it sees the memories of future holders, as well as past ones. Known holders: Eren Kruger, Grisha Yeager, Eren Yeager.",
  }, {
    japaneseName: '進撃の巨人',
    longDescription: {
      it: "Non ha poteri spettacolari ma una volontà propria: nessun detentore ha mai servito Marley fino in fondo. Il potere di vedere il futuro — e di inviare ricordi al passato — chiude il cerchio della storia: è Eren, da adulto, a spingere suo padre a divorare i Reiss.",
      en: "It has no spectacular powers but a will of its own: no holder has ever truly served Marley. The power to see the future — and to send memories into the past — closes the story's loop: it is Eren, as an adult, who pushes his father to devour the Reiss family.",
    },
    tags: ['nove-giganti', 'liberta'],
  }),
  ab('colossal-titan', 'Colossal Titan', 'nine_titans', MARLEY_NINE, ['bertolt', 'armin'], {
    it: "Il più grande dei Nove, alto circa 60 metri: la trasformazione è un'esplosione paragonabile a una bomba, e il corpo emette vapore bollente. Detentori: Bertolt Hoover, poi Armin Arlert.",
    en: 'The largest of the Nine, about 60 metres tall: the transformation is an explosion comparable to a bomb, and the body emits scalding steam. Holders: Bertolt Hoover, then Armin Arlert.',
  }, {
    japaneseName: '超大型巨人',
    longDescription: {
      it: "È il Gigante che nell'845 apre la breccia nel cancello di Shiganshina e nell'850 quello di Trost. Il suo corpo si consuma rapidamente: lento e vulnerabile, è un'arma di distruzione più che di combattimento. Armin lo usa per distruggere la flotta di Marley nel porto di Liberio e, nella battaglia finale, lo fa esplodere contro l'ultimo Gigante di Eren.",
      en: "It is the Titan that breaches the Shiganshina gate in 845 and the Trost gate in 850. Its body burns away quickly: slow and vulnerable, it is a weapon of destruction rather than of combat. Armin uses it to destroy Marley's fleet in Liberio's harbour and, in the final battle, detonates it against Eren's last Titan.",
    },
    tags: ['nove-giganti', 'colossale'],
  }),
  ab('armored-titan', 'Armored Titan', 'nine_titans', MARLEY_NINE, ['reiner'], {
    it: "Un Gigante di circa 15 metri ricoperto di placche indurite: un ariete corazzato. Detentore: Reiner Braun.",
    en: 'A Titan of about 15 metres covered in hardened plates: an armoured battering ram. Holder: Reiner Braun.',
  }, {
    japaneseName: '鎧の巨人',
    longDescription: {
      it: "Nell'845 sfonda il cancello interno di Shiganshina, condannando Wall Maria. Le placche resistono alle lame ma non alle lance-tuono, e le giunture restano scoperte. Gabi è stata designata come sua erede.",
      en: "In 845 it smashes Shiganshina's inner gate, dooming Wall Maria. Its plates resist blades but not Thunder Spears, and its joints stay exposed. Gabi has been designated as its heir.",
    },
    tags: ['nove-giganti', 'corazzato'],
  }),
  ab('female-titan', 'Female Titan', 'nine_titans', MARLEY_NINE, ['annie'], {
    it: "Un Gigante agile e versatile di circa 14 metri, capace di indurire parti del corpo e di attirare i Giganti puri con un urlo. Detentrice: Annie Leonhart.",
    en: 'An agile, versatile Titan about 14 metres tall, able to harden parts of its body and to draw pure Titans with a scream. Holder: Annie Leonhart.',
  }, {
    japaneseName: '女型の巨人',
    longDescription: {
      it: "Annie lo usa nella 57ª spedizione per catturare Eren e massacra la squadra Levi; a Stohess, messa alle strette, si chiude in un cristallo indistruttibile da cui uscirà solo durante il Boato.",
      en: 'Annie uses it on the 57th expedition to capture Eren and slaughters the Levi Squad; at Stohess, cornered, she encases herself in an unbreakable crystal she will only leave during the Rumbling.',
    },
    tags: ['nove-giganti', 'femmina'],
  }),
  ab('beast-titan', 'Beast Titan', 'nine_titans', MARLEY_NINE, ['ksaver', 'zeke'], {
    it: "Un Gigante dall'aspetto animale, diverso a ogni detentore: quello di Zeke è una scimmia di 17 metri dalle braccia lunghissime che lancia massi come proiettili. Detentori: Tom Ksaver, Zeke Yeager.",
    en: "A Titan of animal appearance, different with each holder: Zeke's is a 17-metre ape with very long arms that hurls boulders like shells. Holders: Tom Ksaver, Zeke Yeager.",
  }, {
    japaneseName: '獣の巨人',
    longDescription: {
      it: "Grazie al sangue reale, Zeke può trasformare con il suo grido gli Eldiani che hanno ingerito il suo fluido spinale e comandare i Giganti puri. A Shiganshina la sua pioggia di pietre annienta le reclute di Erwin.",
      en: "Thanks to his royal blood, Zeke can use his scream to transform Eldians who have ingested his spinal fluid and command pure Titans. At Shiganshina his barrage of stones annihilates Erwin's recruits.",
    },
    tags: ['nove-giganti', 'bestia'],
  }),
  ab('jaw-titan', 'Jaw Titan', 'nine_titans', MARLEY_NINE, ['marcel', 'ymir', 'porco', 'falco'], {
    it: "Il più piccolo e il più veloce dei Nove, con mascelle e artigli capaci di frantumare quasi tutto, persino le placche indurite. Detentori: Marcel Galliard, Ymir, Porco Galliard, Falco Grice.",
    en: 'The smallest and fastest of the Nine, with jaws and claws able to crush almost anything, even hardened plates. Holders: Marcel Galliard, Ymir, Porco Galliard, Falco Grice.',
  }, {
    japaneseName: '顎の巨人',
    longDescription: {
      it: "Ymir lo ottiene divorando Marcel dopo sessant'anni da Gigante puro nelle terre esterne; Porco lo riprende divorando lei. Falco, che lo eredita da Porco, sviluppa forme alate, retaggio della Bestia di Zeke di cui aveva bevuto il fluido.",
      en: "Ymir gets it by devouring Marcel after sixty years as a pure Titan in the outer lands; Porco takes it back by devouring her. Falco, who inherits it from Porco, develops winged forms, a legacy of Zeke's Beast whose fluid he had drunk.",
    },
    tags: ['nove-giganti', 'mascella'],
  }),
  ab('cart-titan', 'Cart Titan', 'nine_titans', MARLEY_NINE, ['pieck'], {
    it: "Un Gigante quadrupede dalla resistenza straordinaria: può restare trasformato per mesi e trasportare armi, cannoni e soldati sulla schiena. Detentrice: Pieck Finger.",
    en: 'A quadruped Titan of extraordinary endurance: it can stay transformed for months and carry weapons, cannons and soldiers on its back. Holder: Pieck Finger.',
  }, {
    japaneseName: '車力の巨人',
    tags: ['nove-giganti', 'carro'],
  }),
  ab('war-hammer-titan', 'War Hammer Titan', 'nine_titans', MARLEY_NINE, ['lara-tybur', 'eren'], {
    it: "Il Gigante che crea armi e strutture di carne indurita — lance, martelli, muri. Il detentore può restare chiuso in un cristallo sotto terra, collegato al corpo da un cordone. Custodito dai Tybur (Lara Tybur), poi divorato da Eren.",
    en: 'The Titan that creates weapons and structures of hardened flesh — spikes, hammers, walls. The holder can stay sealed in an underground crystal, linked to the body by a cord. Kept by the Tybur family (Lara Tybur), then devoured by Eren.',
  }, {
    japaneseName: '戦鎚の巨人',
    tags: ['nove-giganti', 'martello'],
  }),
  /* ============================ POTERI DEI GIGANTI ============================ */
  ab('titan-transformation', 'Titan transformation', 'titan_power', TITAN, ['eren', 'reiner', 'bertolt', 'annie', 'zeke', 'ymir', 'porco', 'pieck', 'armin', 'falco', 'grisha', 'kruger', 'frieda-reiss', 'lara-tybur'], {
    it: "Un mutaforma si trasforma ferendosi con uno scopo preciso: un fulmine colpisce, e il corpo del Gigante nasce intorno a lui, collegato alla nuca. Senza uno scopo chiaro la trasformazione fallisce.",
    en: 'A shifter transforms by injuring themselves with a clear purpose: lightning strikes, and the Titan body forms around them, linked at the nape. Without a clear purpose the transformation fails.',
  }, { japaneseName: '巨人化', tags: ['giganti', 'mutaforma'] }),
  ab('regeneration', 'Regeneration', 'titan_power', TITAN, ['eren', 'reiner', 'annie', 'zeke', 'ymir', 'porco', 'falco', 'armin'], {
    it: "I Giganti e i mutaforma rigenerano arti e organi mutilati, a prezzo di energia: l'unico punto mortale è la nuca, dove si trova il mutaforma o il cuore del Gigante puro.",
    en: 'Titans and shifters regenerate severed limbs and organs, at a cost in energy: the only lethal spot is the nape, where the shifter or the pure Titan\'s core lies.',
  }, { japaneseName: '再生', tags: ['giganti'] }),
  ab('hardening', 'Hardening', 'titan_power', TITAN, ['eren', 'reiner', 'annie', 'lara-tybur'], {
    it: "La capacità di rendere la pelle di un Gigante dura come il cristallo. Eren la ottiene bevendo il siero «Armatura» nella cappella dei Reiss e la usa per sigillare il cancello di Shiganshina.",
    en: "The ability to make a Titan's skin as hard as crystal. Eren gains it by drinking the 'Armor' serum in the Reiss chapel and uses it to seal the Shiganshina gate.",
  }, { japaneseName: '硬質化', tags: ['giganti'] }),
  ab('crystallization', 'Crystallization', 'titan_power', TITAN, ['annie', 'lara-tybur'], {
    it: "L'indurimento portato all'estremo: il mutaforma si chiude in un cristallo che nessuna arma intacca. Annie vi resta per quattro anni, sotto la sorveglianza dell'esercito di Paradis.",
    en: "Hardening taken to the extreme: the shifter seals themselves in a crystal no weapon can scratch. Annie stays inside for four years, under the watch of Paradis's army.",
  }, { japaneseName: '結晶化', tags: ['giganti', 'cristallo'] }),
  ab('partial-transformation', 'Partial transformation', 'titan_power', TITAN, ['eren', 'falco'], {
    it: "Trasformare solo una parte del corpo — un braccio, una mano — o creare una sagoma di Gigante parziale. Eren lo fa a Trost per proteggere i compagni dal colpo di cannone.",
    en: "Transforming only part of the body — an arm, a hand — or forming a partial Titan frame. Eren does it at Trost to shield his friends from the cannon shot.",
  }, { japaneseName: '部分的巨人化', tags: ['giganti'] }),
  ab('steam-emission', 'Steam emission', 'titan_power', ['ymir', 'marley', 'paradis'], ['bertolt', 'armin'], {
    it: "Il Colossale può consumare la propria carne in una tempesta di vapore bollente che respinge chiunque si avvicini; a Shiganshina Armin si lascia bruciare per tenerlo occupato.",
    en: 'The Colossal can burn its own flesh into a storm of scalding steam that repels anyone approaching; at Shiganshina Armin lets himself be burned to keep it busy.',
  }, { japaneseName: '蒸気', tags: ['colossale'] }),
  ab('female-scream', "Female Titan's scream", 'titan_power', ['ymir', 'marley'], ['annie'], {
    it: "Un urlo che richiama i Giganti puri vicini: nella Foresta degli Alberi Giganti Annie lo usa per far divorare il corpo del Gigante dai Giganti puri e fuggire senza essere scoperta.",
    en: "A scream that draws nearby pure Titans: in the Forest of Giant Trees Annie uses it to have pure Titans devour her Titan body so she can escape undetected.",
  }, { longDescription: { it: "È un potere che permette al Gigante Femmina di usare i Giganti puri come arma o come diversivo. Mentre i Giganti divorano il suo corpo abbandonato, Annie si confonde fra i soldati del Corpo di Ricerca con l'attrezzatura di manovra e torna nella foresta a dare la caccia a Eren.", en: "It is a power that lets the Female Titan use pure Titans as a weapon or a diversion. While the Titans devour her abandoned body, Annie blends in among the Survey Corps soldiers with her mobility gear and returns to the forest to hunt Eren." }, japaneseName: '叫び', tags: ['femmina'] }),
  ab('zeke-scream', "Zeke's scream", 'royal_blood', ['ymir', 'marley'], ['zeke'], {
    it: "Grazie al sangue reale, il grido della Bestia di Zeke trasforma all'istante in Giganti puri gli Eldiani che hanno ingerito il suo fluido spinale, e li comanda.",
    en: "Thanks to royal blood, the scream of Zeke's Beast instantly turns Eldians who have ingested his spinal fluid into pure Titans, and commands them.",
  }, {
    japaneseName: 'ジークの叫び',
    longDescription: {
      it: "Lo usa a Ragako e Utgard nell'850, a Shiganshina sui soldati che avevano bevuto il vino, e a Fort Salta sulle truppe di Marley.",
      en: 'He uses it at Ragako and Utgard in 850, at Shiganshina on the soldiers who had drunk the wine, and at Fort Salta on the Marleyan troops.',
    },
    tags: ['bestia', 'sangue-reale'],
  }),
  ab('future-memories', 'Future memories', 'titan_power', ['ymir', 'paradis'], ['eren', 'grisha', 'kruger'], {
    it: "Il potere esclusivo del Gigante d'Attacco: i detentori vedono frammenti dei ricordi dei loro successori. Eren usa i Sentieri per far vedere a suo padre il futuro e spingerlo a uccidere i Reiss.",
    en: "The Attack Titan's exclusive power: holders see fragments of their successors' memories. Eren uses the Paths to show his father the future and push him to kill the Reiss family.",
  }, { japaneseName: '未来の記憶', tags: ['attacco', 'sentieri'] }),
  ab('memory-inheritance', 'Memory inheritance', 'titan_power', TITAN, ['eren', 'reiner', 'zeke', 'armin', 'porco', 'falco'], {
    it: "Chi eredita uno dei Nove ne riceve anche i ricordi dei detentori precedenti, a frammenti, spesso attraverso un contatto o uno stimolo. Armin prova i sentimenti di Bertolt per Annie; Porco vede i ricordi di Ymir.",
    en: "Whoever inherits one of the Nine also receives fragments of the previous holders' memories, often through a contact or a trigger. Armin feels Bertolt's feelings for Annie; Porco sees Ymir's memories.",
  }, { japaneseName: '記憶の継承', tags: ['nove-giganti'] }),
  ab('curse-of-ymir', 'Curse of Ymir', 'titan_power', TITAN, ['eren', 'reiner', 'zeke', 'annie', 'pieck', 'porco', 'armin', 'falco', 'kruger', 'grisha', 'frieda-reiss', 'uri-reiss'], {
    it: "Chi eredita uno dei Nove muore tredici anni dopo — gli stessi anni che Ymir visse dopo aver ottenuto il potere. Nessun mutaforma vi sfugge.",
    en: 'Whoever inherits one of the Nine dies thirteen years later — the same span Ymir lived after gaining the power. No shifter escapes it.',
  }, { japaneseName: 'ユミルの呪い', tags: ['maledizione', 'nove-giganti'] }),
  ab('pure-titans', 'Pure Titans', 'titan_power', ['ymir', 'eldian_empire', 'marley'], ['ymir', 'carla', 'dina'], {
    it: "I Giganti senza mente in cui si trasformano gli Eldiani iniettati di siero: vagano e divorano gli esseri umani senza bisogno di nutrirsi. Marley li ha creati per un secolo esiliando i «traditori» a Paradis.",
    en: 'The mindless Titans that Eldians injected with serum turn into: they roam and devour humans with no need for food. For a century Marley created them by exiling "traitors" to Paradis.',
  }, {
    japaneseName: '無垢の巨人',
    longDescription: {
      it: "I Giganti anomali (奇行種) si muovono in modo imprevedibile. Un Gigante puro torna umano solo divorando un mutaforma: così Ymir ottiene la Mascella e Eren, da bambino, eredita da suo padre l'Attacco e il Fondatore. Il Gigante che divora Carla è Dina Fritz.",
      en: 'Abnormal Titans (奇行種) move unpredictably. A pure Titan only turns human again by devouring a shifter: that is how Ymir obtains the Jaw and Eren, as a child, inherits the Attack and the Founder from his father. The Titan that devours Carla is Dina Fritz.',
    },
    tags: ['giganti-puri'],
  }),
  /* =============================== SANGUE REALE =============================== */
  ab('coordinate', 'The Coordinate', 'royal_blood', ['ymir', 'eldian_empire'], ['ymir-fritz', 'eren', 'zeke'], {
    it: "Il punto in cui convergono tutti i Sentieri, dove Ymir modella i Giganti: chi vi accede con il Fondatore e il sangue reale può comandare ogni Eldiano. Eren lo raggiunge attraverso Zeke.",
    en: 'The point where all the Paths converge, where Ymir shapes the Titans: whoever reaches it with the Founder and royal blood can command every Eldian. Eren reaches it through Zeke.',
  }, { japaneseName: '座標', tags: ['sentieri', 'fondatore'] }),
  ab('memory-manipulation', 'Memory manipulation', 'royal_blood', ['eldian_empire', 'paradis'], ['karl-fritz', 'uri-reiss', 'frieda-reiss'], {
    it: "Con il Fondatore il sovrano può riscrivere i ricordi degli Eldiani: Karl Fritz cancella il passato del suo popolo dentro le Mura; Frieda cancella a Historia il ricordo dei loro incontri.",
    en: "With the Founder the ruler can rewrite Eldians' memories: Karl Fritz erases his people's past inside the Walls; Frieda erases Historia's memory of their meetings.",
  }, { japaneseName: '記憶の改竄', tags: ['fondatore', 'mura'] }),
  ab('wall-titans', 'Wall Titans', 'royal_blood', ['eldian_empire', 'paradis'], ['karl-fritz', 'eren'], {
    it: "Le Mura sono fatte di milioni di Giganti Colossali induriti, uno accanto all'altro. Karl Fritz minacciò il mondo di risvegliarli se Paradis fosse stata attaccata.",
    en: 'The Walls are made of millions of hardened Colossal Titans, side by side. Karl Fritz threatened the world with awakening them if Paradis were attacked.',
  }, { japaneseName: '壁の巨人', tags: ['mura', 'boato'] }),
  ab('rumbling', 'The Rumbling', 'royal_blood', ['eldian_empire', 'paradis'], ['eren', 'zeke'], {
    it: "Il Boato della Terra: i Giganti delle Mura si risvegliano e marciano sul mondo, calpestando tutto. Eren lo scatena nell'854; fermato a Fort Salta, uccide l'80% dell'umanità.",
    en: 'The Rumbling: the Wall Titans awaken and march across the world, trampling everything. Eren unleashes it in 854; stopped at Fort Salta, it kills 80% of humanity.',
  }, { japaneseName: '地鳴らし', tags: ['boato', 'fondatore'] }),
  /* ================================= ACKERMAN ================================= */
  ab('ackerman-power', 'Ackerman power', 'ackerman', ['eldian_empire'], ['levi', 'mikasa', 'kenny'], {
    it: "Gli Ackerman possono attingere in forma umana alla forza dei Giganti attraverso i Sentieri: forza, riflessi e istinto sovrumani, che si «risvegliano» in un momento di estremo pericolo, e l'immunità alla manipolazione dei ricordi.",
    en: "Ackermans can draw on the strength of the Titans in human form through the Paths: superhuman strength, reflexes and instinct, which 'awaken' in a moment of extreme danger, and immunity to memory manipulation.",
  }, { japaneseName: 'アッカーマンの力', tags: ['ackerman'] }),
  /* =============================== SIERO E SCIENZA =============================== */
  ab('titan-serum', 'Titan serum', 'science', ['marley', 'paradis'], ['grisha', 'rod-reiss', 'kenny', 'levi', 'armin', 'eren'], {
    it: "Il liquido che, iniettato a un Eldiano, lo trasforma in un Gigante puro; da un mutaforma se ne ricavano versioni che permettono di ereditare uno dei Nove divorandolo. Levi lo usa per salvare Armin invece di Erwin.",
    en: 'The liquid that turns an injected Eldian into a pure Titan; from a shifter come versions that let one inherit one of the Nine by devouring them. Levi uses it to save Armin instead of Erwin.',
  }, { japaneseName: '巨人化の薬', tags: ['siero'] }),
  ab('hardening-serum', "'Armor' serum", 'science', ['paradis'], ['eren'], {
    it: "La fiala etichettata «Armatura Braun» (ヨロイ・ブラウン) nella borsa di Rod Reiss, ricavata dal Corazzato: Eren la beve nella cappella e ottiene l'indurimento, che gli serve per sostenere la caverna e poi per sigillare Shiganshina.",
    en: "The vial labelled 'Armor Braun' (ヨロイ・ブラウン) in Rod Reiss's bag, derived from the Armored Titan: Eren drinks it in the chapel and gains hardening, which he uses to hold up the cavern and later to seal Shiganshina.",
  }, { japaneseName: 'ヨロイ・ブラウン', tags: ['siero', 'indurimento'] }),
  ab('spinal-fluid', "Zeke's spinal fluid", 'science', ['marley'], ['zeke', 'yelena', 'falco'], {
    it: "Il fluido spinale di Zeke, versato nel vino servito ai vertici di Paradis e nel gas di Ragako: chi lo ingerisce si trasforma in Gigante al suo grido.",
    en: "Zeke's spinal fluid, poured into the wine served to Paradis's leadership and into the gas at Ragako: whoever ingests it turns into a Titan at his scream.",
  }, { japaneseName: 'ジークの脊髄液', tags: ['siero', 'bestia'] }),
  ab('iceburst-stone', 'Iceburst stone', 'science', ['paradis'], ['hange'], {
    it: "Il minerale estratto sottoterra a Paradis che alimenta il gas dell'attrezzatura di manovra; insieme ai giacimenti fossili dell'isola, è una delle risorse che fanno gola al mondo.",
    en: "The mineral mined underground on Paradis that powers the omni-directional mobility gear's gas; together with the island's fossil fuel deposits, it is one of the resources the world covets.",
  }, { longDescription: { it: "Il gas dell'attrezzatura nasce dalla combustione della pietra: senza iceburst non ci sarebbe manovra tridimensionale, e quindi nessuna difesa contro i Giganti. Hange e i suoi tecnici sono fra i pochi a conoscerne il funzionamento; con i Volontari Paradis scopre quanto vale per il mondo esterno.", en: "The gear's gas comes from burning the stone: without iceburst there would be no omni-directional mobility, and so no defence against the Titans. Hange and her technicians are among the few who understand how it works; with the Volunteers, Paradis discovers how much it is worth to the outside world." }, japaneseName: '氷爆石', tags: ['risorse', 'paradis'] }),
  /* ============================== EQUIPAGGIAMENTO ============================== */
  ab('odm-gear', 'Omni-directional mobility gear', 'equipment', ['paradis'], ['eren', 'mikasa', 'armin', 'levi', 'erwin', 'hange', 'jean', 'connie', 'sasha', 'historia', 'mike', 'petra', 'kenny', 'isabel', 'farlan', 'hannes', 'rico'], {
    it: "L'attrezzatura a gas compresso che permette ai soldati di Paradis di muoversi in tre dimensioni con due rampini, e di raggiungere la nuca dei Giganti. Senza edifici o alberi è quasi inutile.",
    en: "The compressed-gas rig that lets Paradis soldiers move in three dimensions with two grappling hooks and reach a Titan's nape. Without buildings or trees it is almost useless.",
  }, {
    localizedName: { it: 'Attrezzatura per la manovra tridimensionale', en: 'Omni-directional mobility gear', ja: '立体機動装置' },
    japaneseName: '立体機動装置',
    tags: ['equipaggiamento', 'mura'],
  }),
  ab('ultrahard-blades', 'Ultrahard steel blades', 'equipment', ['paradis'], ['eren', 'mikasa', 'levi', 'jean', 'connie', 'sasha', 'hannes'], {
    it: "Le lame intercambiabili in acciaio ultraduro fatte per tagliare la nuca dei Giganti: si spezzano e si sostituiscono dal fodero dell'attrezzatura.",
    en: 'The replaceable ultrahard steel blades made to slice a Titan\'s nape: they snap and are swapped from the gear\'s scabbards.',
  }, { japaneseName: '超硬質スチール', tags: ['equipaggiamento'] }),
  ab('anti-personnel-odm', 'Anti-personnel ODM gear', 'equipment', ['paradis'], ['kenny', 'levi', 'mikasa'], {
    it: "La versione dell'attrezzatura di manovra della squadra di Kenny, con pistole a colpo singolo al posto delle lame: costruita per uccidere esseri umani. Il Corpo di Ricerca la adotta contro Marley.",
    en: "The version of the gear used by Kenny's squad, with single-shot pistols instead of blades: built to kill humans. The Survey Corps adopts it against Marley.",
  }, { japaneseName: '対人立体機動装置', tags: ['equipaggiamento', 'rivolta'] }),
  ab('flare-signals', 'Flare signals', 'equipment', ['paradis'], ['erwin', 'rico', 'hange'], {
    it: "I razzi colorati con cui il Corpo di Ricerca comunica sul campo: il rosso segnala un Gigante, il nero un anomalo, il verde la direzione; il giallo annuncia la fine di un'operazione.",
    en: 'The coloured flares the Survey Corps uses to communicate in the field: red marks a Titan, black an abnormal, green the heading; yellow announces the end of an operation.',
  }, { japaneseName: '信煙弾', tags: ['equipaggiamento', 'comunicazione'] }),
  ab('flying-boat', 'The flying boat', 'equipment', ['hizuru', 'marley'], ['hange', 'onyankopon', 'kiyomi', 'magath'], {
    it: "L'idrovolante degli Azumabito ancorato a Odiha, l'unico mezzo per raggiungere Eren che marcia sul continente. Hange muore per farlo decollare.",
    en: 'The Azumabito seaplane moored at Odiha, the only way to reach Eren marching across the continent. Hange dies so it can take off.',
  }, { japaneseName: '飛行艇', tags: ['equipaggiamento', 'alleanza'] }),
  ab('airship', 'Airships', 'equipment', ['marley'], ['zeke', 'reiner', 'pieck', 'porco', 'magath', 'eren'], {
    it: "I dirigibili di Marley: il Corpo di Ricerca ne cattura uno per fuggire da Liberio dopo il raid, e Marley li usa per lanciare l'attacco a sorpresa su Shiganshina.",
    en: "Marley's airships: the Survey Corps seizes one to flee Liberio after the raid, and Marley uses them to launch the surprise attack on Shiganshina.",
  }, { japaneseName: '飛行船', tags: ['equipaggiamento', 'marley'] }),
  /* =================================== ARMI =================================== */
  ab('thunder-spear', 'Thunder Spears', 'weapon', ['paradis'], ['hange', 'armin', 'jean', 'connie', 'mikasa', 'floch', 'levi'], {
    it: "Lance esplosive sviluppate da Hange per perforare la corazza dei mutaforma: si piantano nel bersaglio e detonano qualche secondo dopo. A Shiganshina perforano la corazza del Corazzato sulla nuca.",
    en: "Explosive lances developed by Hange to pierce shifters' armour: they lodge in the target and detonate a few seconds later. At Shiganshina they breach the Armored Titan's nape armour.",
  }, { japaneseName: '雷槍', tags: ['armi', 'shiganshina'] }),
  ab('anti-titan-rifle', 'Anti-Titan rifle', 'weapon', ['marley'], ['gabi'], {
    it: "Il fucile di grosso calibro di Marley pensato per colpire i Giganti: Gabi lo usa a Shiganshina per decapitare Eren con un solo colpo, un istante prima del contatto con Zeke.",
    en: "Marley's large-calibre rifle designed to hit Titans: Gabi uses it at Shiganshina to decapitate Eren with a single shot, a moment before his contact with Zeke.",
  }, { longDescription: { it: 'Marley la sviluppa quando capisce che i Giganti possono essere abbattuti dalle armi moderne. Gabi, cresciuta come aspirante Guerriera e tiratrice eccezionale, la porta con sé a Shiganshina e con un solo colpo cambia il corso della guerra.', en: 'Marley develops it when it realises Titans can be brought down by modern weapons. Gabi, raised as a Warrior candidate and an exceptional marksman, carries it to Shiganshina and with a single shot changes the course of the war.' }, japaneseName: '対巨人ライフル', tags: ['armi', 'marley'] }),
  ab('anti-titan-artillery', 'Anti-Titan artillery', 'weapon', ['marley', 'paradis'], ['magath', 'pixis'], {
    it: "I cannoni delle Mura, che riescono a malapena a rallentare un Gigante, e l'artiglieria moderna di Marley, capace di abbatterne uno: a Fort Slava le corazzate del Medio Oriente mettono in seria difficoltà i Giganti di Marley.",
    en: "The Wall cannons, which can barely slow a Titan, and Marley's modern artillery, able to bring one down: at Fort Slava the Mid-East battleships put Marley's Titans in serious trouble.",
  }, { japaneseName: '対巨人砲', tags: ['armi'] }),
  /* ================================= TATTICHE ================================= */
  ab('long-range-formation', 'Long-Distance Scouting Formation', 'tactic', ['paradis'], ['erwin', 'levi', 'hange', 'mike'], {
    it: "La formazione ideata da Erwin per le spedizioni: le squadre si dispongono a raggiera e con i razzi segnalano i Giganti per evitarli invece di combatterli. Riduce drasticamente le perdite.",
    en: 'The formation Erwin devised for expeditions: squads spread out in a wide arc and use flares to signal Titans so as to avoid them rather than fight. It drastically reduces losses.',
  }, { japaneseName: '長距離索敵陣形', tags: ['tattica', 'corpo-di-ricerca'] }),
];
