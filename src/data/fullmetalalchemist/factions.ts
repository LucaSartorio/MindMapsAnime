import type { Faction } from '@/types';

const fac = (f: Omit<Faction, 'worldId'>): Faction => ({
  worldId: 'world-fullmetalalchemist',
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...f,
});

/**
 * Fazioni di Fullmetal Alchemist (batch 7). Tipi usati (tutti già noti a `FACTION_TYPE_LABELS`, nessuna etichetta
 * nuova in `WorldConfig`):
 *  - `army`         → l'esercito di Stato e la guarnigione di Briggs (e, nel film, l'esercito di Creta);
 *  - `organization` → gli Alchimisti di Stato;
 *  - `clan`         → i clan Yao e Chang di Xing;
 *  - `group`        → gli Homunculi, la squadra di Mustang, gli ishvaliani, la banda di Greed, i Pipistrelli Neri.
 *
 * `characterIds` elenca solo personaggi del dataset (52 dopo il batch 10); chi non ha scheda compare per nome
 * nell'organigramma (`structure.ts`, `x()`) o solo nel testo. Organigrammi e ruoli: `structure.ts`.
 * Fonti: S9 (Wikipedia, elenco dei personaggi), S5 (Briggs), S6 (film di Milos) — vedi il manifesto della pipeline.
 */
export const fmaFactions: Faction[] = [
  /* ============================ ESERCITO E STATO ============================ */
  fac({
    id: 'faction-fma-state-military',
    type: 'army',
    name: 'Amestris State Military',
    localizedName: { it: "Esercito di Stato di Amestris", en: 'Amestris State Military' },
    nationId: 'nation-fma-amestris',
    description: {
      it: "Le forze armate dello Stato di Amestris, al cui vertice sta il Führer King Bradley; ne fanno parte ufficiali come Roy Mustang, Riza Hawkeye, Maes Hughes e Olivier Mira Armstrong.",
      en: 'The armed forces of the state of Amestris, headed by the Führer King Bradley; officers such as Roy Mustang, Riza Hawkeye, Maes Hughes and Olivier Mira Armstrong belong to it.',
    },
    longDescription: {
      it: "L'esercito governa di fatto Amestris, e il suo capo, il Führer Bradley, è in realtà l'homunculus Wrath: dietro lo Stato agiscono gli Homunculi di Father. Fu l'esercito a condurre la guerra di sterminio di Ishval, durante la quale Kimblee uccise i propri superiori. Dopo la morte di Hughes, Mustang scopre la manovra e si rivolge contro i vertici; Olivier Mira Armstrong porta le truppe di Briggs a Central per collaborare con lui e prendere il controllo dello Stato. La squadra di Mustang e la guarnigione di Briggs sono descritte a parte.",
      en: "The military effectively runs Amestris, and its head, the Führer Bradley, is in truth the homunculus Wrath: Father's Homunculi act behind the state. It was the military that waged the Ishvalan war of extermination, during which Kimblee killed his own commanders. After Hughes's death Mustang uncovers the scheme and turns against the leadership; Olivier Mira Armstrong brings the Briggs troops to Central to work with him and take control of the state. Mustang's squad and the Briggs garrison are described separately.",
    },
    leaderIds: ['char-fma-king-bradley'],
    characterIds: [
      'char-fma-king-bradley',
      'char-fma-roy-mustang',
      'char-fma-riza-hawkeye',
      'char-fma-maes-hughes',
      'char-fma-jean-havoc',
      'char-fma-alex-louis-armstrong',
      'char-fma-olivier-mira-armstrong',
      'char-fma-solf-j-kimblee',
    ],
    locationIds: ['loc-fma-central-city', 'loc-fma-fort-briggs'],
    arcIds: ['arc-fma-scars-of-ishval', 'arc-fma-briggs', 'arc-fma-promised-day'],
    tags: ['esercito', 'amestris', 'stato'],
  }),
  fac({
    id: 'faction-fma-state-alchemists',
    type: 'organization',
    name: 'State Alchemists',
    localizedName: { it: 'Alchimisti di Stato', en: 'State Alchemists' },
    japaneseName: '国家錬金術師',
    nationId: 'nation-fma-amestris',
    description: {
      it: "Gli alchimisti riconosciuti dallo Stato di Amestris e legati all'esercito: ciascuno porta un titolo, come «Alchimista d'Acciaio» per Edward o «Alchimista di Fuoco» per Mustang.",
      en: "The alchemists certified by the state of Amestris and tied to its military: each bears a title, such as 'Fullmetal Alchemist' for Edward or 'Flame Alchemist' for Mustang.",
    },
    longDescription: {
      it: "Edward è il più giovane Alchimista di Stato della storia, entrato a dodici anni. Fra gli altri membri ci sono Mustang, Alex Louis Armstrong, Solf J. Kimblee, che si è fatto un nome nella guerra di Ishval, e Shou Tucker, che ottenne il titolo creando una chimera parlante. Scar inizia la sua vendetta colpendo proprio gli Alchimisti di Stato.",
      en: "Edward is the youngest State Alchemist in history, having joined at twelve. Other members include Mustang, Alex Louis Armstrong, Solf J. Kimblee, who made his name in the Ishvalan war, and Shou Tucker, who earned the title by creating a talking chimera. Scar begins his revenge by striking State Alchemists.",
    },
    leaderIds: [],
    characterIds: [
      'char-fma-edward-elric',
      'char-fma-roy-mustang',
      'char-fma-alex-louis-armstrong',
      'char-fma-solf-j-kimblee',
      'char-fma-shou-tucker',
    ],
    arcIds: ['arc-fma-scar'],
    tags: ['alchimisti-di-stato', 'esercito'],
  }),
  fac({
    id: 'faction-fma-mustang-squadron',
    type: 'group',
    name: "Mustang's squadron",
    localizedName: { it: 'La squadra di Mustang', en: "Mustang's squadron" },
    nationId: 'nation-fma-amestris',
    description: {
      it: "Il gruppo di subordinati fedeli a Roy Mustang: Hawkeye, Havoc, Breda, Falman e Fuery. Non ha un nome ufficiale.",
      en: "The group of subordinates loyal to Roy Mustang: Hawkeye, Havoc, Breda, Falman and Fuery. It has no official name.",
    },
    longDescription: {
      it: "Ciascuno dei suoi membri fu scelto per una qualità specifica; gli Homunculi spezzano il gruppo trasferendo i suoi componenti in sedi diverse. Breda, Fuery e Hawkeye lasciano poi l'esercito per aiutare Mustang a rovesciare Bradley. Havoc, paralizzato da Lust, resta al suo fianco anche dopo l'infortunio. Breda, Falman e Fuery hanno ciascuno una scheda.",
      en: "Each member was picked for a specific quality; the Homunculi break the group up by transferring its members to different postings. Breda, Fuery and Hawkeye later leave the military to help Mustang overthrow Bradley. Havoc, paralysed by Lust, stays at his side even after the injury. Breda, Falman and Fuery each have a character page.",
    },
    leaderIds: ['char-fma-roy-mustang'],
    characterIds: [
      'char-fma-roy-mustang',
      'char-fma-riza-hawkeye',
      'char-fma-jean-havoc',
      'char-fma-vato-falman',
      'char-fma-heymans-breda',
      'char-fma-kain-fuery',
    ],
    arcIds: ['arc-fma-briggs'],
    tags: ['esercito', 'mustang'],
    referenceStatus: 'needs_verification',
  }),
  fac({
    id: 'faction-fma-briggs-garrison',
    type: 'army',
    name: 'Briggs garrison',
    localizedName: { it: 'Guarnigione di Briggs', en: 'Briggs garrison' },
    japaneseName: 'ブリッグズ要塞',
    nationId: 'nation-fma-amestris',
    villageLocationId: 'loc-fma-fort-briggs',
    description: {
      it: "Le truppe della Fortezza di Briggs, nel nord di Amestris, che sorveglia il confine con Drachma sotto il comando di Olivier Mira Armstrong.",
      en: "The troops of Fort Briggs in northern Amestris, which guards the border with Drachma under the command of Olivier Mira Armstrong.",
    },
    longDescription: {
      it: "I soldati di Briggs rispondono solo a Olivier, anche se lei non ha il controllo diretto del forte. Fra loro ci sono Miles, per un quarto ishvaliano, che resta nell'esercito sperando di cambiare l'opinione sugli ishvaliani, e Buccaneer, che muore combattendo Bradley; Falman viene trasferito a Briggs dopo lo scioglimento della squadra di Mustang. Quando gli Homunculi minacciano il governo, Olivier porta le truppe a Central.",
      en: "Briggs soldiers answer only to Olivier, even though she does not have direct control of the fort. Among them are Miles, a quarter Ishvalan, who stays in the military hoping to change views of the Ishvalans, and Buccaneer, who dies fighting Bradley; Falman is transferred to Briggs after Mustang's squad is broken up. When the Homunculi threaten the government, Olivier brings the troops to Central.",
    },
    leaderIds: ['char-fma-olivier-mira-armstrong'],
    characterIds: ['char-fma-olivier-mira-armstrong', 'char-fma-miles', 'char-fma-buccaneer', 'char-fma-vato-falman'],
    locationIds: ['loc-fma-fort-briggs'],
    arcIds: ['arc-fma-briggs'],
    tags: ['briggs', 'esercito', 'drachma'],
  }),

  /* ================================ HOMUNCULI ================================ */
  fac({
    id: 'faction-fma-homunculi',
    type: 'group',
    name: 'The Homunculi',
    localizedName: { it: 'Gli Homunculi', en: 'The Homunculi' },
    japaneseName: 'ホムンクルス',
    nationId: 'nation-fma-amestris',
    description: {
      it: "Le creature di Father, ciascuna legata a uno dei sette peccati capitali e marchiata da un tatuaggio con l'uroboro: Pride, Wrath, Envy, Greed, Gluttony, Sloth e Lust.",
      en: "Father's creatures, each tied to one of the seven deadly sins and marked with an ouroboros tattoo: Pride, Wrath, Envy, Greed, Gluttony, Sloth and Lust.",
    },
    longDescription: {
      it: "Father è il loro capo e il principale antagonista. Wrath è il Führer King Bradley, un umano a cui Father ha impiantato una Pietra Filosofale, e Pride vive come Selim, il suo figlio adottivo: così il gruppo guida lo Stato dall'ombra. Greed è l'homunculus ribelle che tradisce il gruppo. Nel corso della storia gli Homunculi cadono uno a uno: Lust per mano di Mustang, Sloth per quella degli Armstrong, di Izumi e di Sig, Envy con la propria mano dopo le parole di Edward.",
      en: "Father is their leader and the main antagonist. Wrath is the Führer King Bradley, a human into whom Father implanted a Philosopher's Stone, and Pride lives as Selim, his adopted son: so the group steers the state from the shadows. Greed is the rogue homunculus who betrays the group. Over the story the Homunculi fall one by one: Lust at Mustang's hands, Sloth at those of the Armstrongs, Izumi and Sig, Envy by its own hand after Edward's words.",
    },
    leaderIds: ['char-fma-father'],
    characterIds: [
      'char-fma-father',
      'char-fma-king-bradley',
      'char-fma-pride',
      'char-fma-lust',
      'char-fma-gluttony',
      'char-fma-envy',
      'char-fma-greed',
      'char-fma-sloth',
    ],
    arcIds: ['arc-fma-briggs', 'arc-fma-promised-day'],
    tags: ['homunculi', 'father', 'sette-peccati'],
  }),
  fac({
    id: 'faction-fma-greeds-gang',
    type: 'group',
    name: "Greed's gang",
    localizedName: { it: 'La banda di Greed', en: "Greed's gang" },
    nationId: 'nation-fma-amestris',
    description: {
      it: "I subalterni di Greed, fra cui le sue chimere umane: Dolcetto, Loa e Martel, con Bido. Il loro rifugio è il locale Devil's Nest.",
      en: "Greed's followers, including his human chimeras Dolcetto, Loa and Martel, with Bido. Their hideout is the Devil's Nest bar.",
    },
    longDescription: {
      it: "Greed li considera suoi «possedimenti». Bradley fa irruzione al Devil's Nest per catturarlo; nell'assalto i suoi soldati uccidono Ulchi. I nomi dei membri variano a seconda delle edizioni (Dolcetto/Dorochet, Loa/Law/Roa, Martel/Marta) e ciascuno ha una scheda (Dolcetto, Loa, Martel, Bido).",
      en: "Greed regards them as his 'possessions'. Bradley raids the Devil's Nest to capture him; in the attack his soldiers kill Ulchi. Member names vary between editions (Dolcetto/Dorochet, Loa/Law/Roa, Martel/Marta) and each has a character page (Dolcetto, Loa, Martel, Bido).",
    },
    leaderIds: ['char-fma-greed'],
    characterIds: ['char-fma-greed', 'char-fma-dolcetto', 'char-fma-loa', 'char-fma-martel', 'char-fma-bido'],
    arcIds: ['arc-fma-briggs'],
    tags: ['greed', 'chimere'],
    referenceStatus: 'needs_verification',
  }),

  /* ============================== ISHVAL E XING ============================== */
  fac({
    id: 'faction-fma-ishvalans',
    type: 'group',
    name: 'Ishvalans',
    localizedName: { it: 'Gli ishvaliani', en: 'The Ishvalans' },
    japaneseName: 'イシュヴァール人',
    nationId: 'nation-fma-amestris',
    description: {
      it: "Il popolo religioso di Ishval, riconoscibile per la pelle scura e gli occhi rossi, che adora il dio Ishballah; Scar è uno dei sopravvissuti.",
      en: "The religious people of Ishval, recognisable by brown skin and red eyes, who worship the god Ishballah; Scar is one of the survivors.",
    },
    longDescription: {
      it: "La guerra civile di Ishval, innescata da Envy, si trasformò in una campagna di sterminio dell'esercito di Stato che uccise la maggior parte degli ishvaliani. I superstiti vivono da profughi e nei bassifondi. Fra le loro vittime ci furono anche i parenti e gli amici di Scar; Marcoh aveva sacrificato ishvaliani per creare Pietre Filosofali. Nel finale Scar accetta di aiutare a ricostruire Ishval.",
      en: "The Ishvalan civil war, triggered by Envy, turned into a campaign of extermination by the State Military that killed most Ishvalans. Survivors live as refugees and in slums. Their victims included Scar's family and friends; Marcoh had sacrificed Ishvalans to create Philosopher's Stones. In the finale Scar agrees to help rebuild Ishval.",
    },
    leaderIds: [],
    characterIds: ['char-fma-scar'],
    locationIds: ['loc-fma-ishval'],
    arcIds: ['arc-fma-scar', 'arc-fma-scars-of-ishval', 'arc-fma-scars-return'],
    tags: ['ishval', 'religione'],
  }),
  fac({
    id: 'faction-fma-yao-clan',
    type: 'clan',
    name: 'Yao clan',
    localizedName: { it: 'Clan Yao', en: 'Yao clan' },
    nationId: 'nation-fma-xing',
    description: {
      it: "Uno dei clan di Xing, rappresentato dal principe Ling Yao; i suoi fedeli sono Lan Fan e Fu.",
      en: "One of the clans of Xing, represented by Prince Ling Yao; his retainers are Lan Fan and Fu.",
    },
    longDescription: {
      it: "Xing è divisa in cinquanta clan sotto un solo imperatore, che ha avuto un figlio da ciascuna famiglia. Ling, dodicesimo principe, mira a succedere al padre e crede che il potere dipenda dall'appoggio del popolo; dopo la guerra diventa imperatore con l'intento di unire i clan. Fu, suo guardiano e nonno di Lan Fan, non ha ancora una scheda.",
      en: "Xing is divided into fifty clans under one emperor, who fathered a child in each family. Ling, the twelfth prince, aims to replace his father and believes power depends on the people's support; after the war he becomes emperor intending to unite the clans. Fu, his bodyguard and Lan Fan's grandfather, does not have a character page yet.",
    },
    leaderIds: [],
    characterIds: ['char-fma-ling-yao', 'char-fma-lan-fan', 'char-fma-fu'],
    arcIds: ['arc-fma-envoy-from-the-east'],
    tags: ['xing', 'clan'],
  }),
  fac({
    id: 'faction-fma-chang-clan',
    type: 'clan',
    name: 'Chang clan',
    localizedName: { it: 'Clan Chang', en: 'Chang clan' },
    nationId: 'nation-fma-xing',
    description: {
      it: "Uno dei clan di Xing, rappresentato dalla diciassettesima principessa May Chang, che pratica l'alcahestria.",
      en: "One of the clans of Xing, represented by May Chang, the seventeenth princess, who practises alkahestry.",
    },
    longDescription: {
      it: "May è una delle figlie dell'imperatore di Xing e arriva ad Amestris con la sua panda Xiao Mei. Si allea prima con Scar e poi con Alphonse; nel finale è con Ling, rassicurata dalla sua promessa di non punire le altre famiglie.",
      en: "May is one of the emperor of Xing's children and comes to Amestris with her pet panda Xiao Mei. She teams up first with Scar and then with Alphonse; in the finale she is with Ling, reassured by his promise not to punish the other families.",
    },
    leaderIds: [],
    characterIds: ['char-fma-may-chang'],
    arcIds: ['arc-fma-envoy-from-the-east'],
    tags: ['xing', 'clan', 'alcahestria'],
  }),

  /* ============================ FILM «STELLA DI MILOS» ============================ */
  fac({
    id: 'faction-fma-milos-black-bats',
    type: 'group',
    name: 'Black Bats (Milosian resistance)',
    localizedName: { it: 'Pipistrelli Neri (resistenza di Milos)', en: 'Black Bats (Milosian resistance)' },
    description: {
      it: "I ribelli di Milos che vogliono riprendersi Table City dagli occupanti di Amestris: soldati volanti guidati da Miranda, uccisa da Atlas. Julia Crichton è cresciuta nella resistenza di Milos.",
      en: "The Milosian rebels who want to reclaim Table City from its Amestrian occupiers: flying soldiers led by Miranda, who is killed by Atlas. Julia Crichton was raised by the Milosian resistance.",
    },
    longDescription: {
      it: "Milos sorgeva sulla collina dove oggi c'è Table City; prima Creta e poi Amestris la invasero e occuparono, costringendo i milosiani a vivere nella Valle in povertà. Julia vuole usare la Pietra Filosofale per ottenere l'indipendenza di Milos, che alla fine dichiara. Le fonti descrivono i Pipistrelli Neri come la fazione ribelle di Milos e Julia come parte della resistenza di Milos: li trattiamo come lo stesso movimento, ma l'appartenenza di Julia ai Pipistrelli Neri non è dichiarata esplicitamente.",
      en: "Milos stood on the hill where Table City now stands; first Creta and then Amestris invaded and occupied it, forcing the Milosians to live in the Valley in poverty. Julia wants to use the Philosopher's Stone to win Milos's independence, which is finally declared. Sources describe the Black Bats as Milos's rebel faction and Julia as part of Milos's resistance: we treat them as the same movement, but Julia's membership of the Black Bats is not explicitly stated.",
    },
    leaderIds: [],
    characterIds: ['char-fma-julia-crichton', 'char-fma-miranda'],
    locationIds: ['loc-fma-table-city'],
    arcIds: ['arc-fma-sacred-star-of-milos'],
    tags: ['film', 'milos', 'resistenza'],
    canonStatus: 'movie',
    referenceStatus: 'needs_verification',
  }),
  fac({
    id: 'faction-fma-cretan-army-milos',
    type: 'army',
    name: 'Cretan army at Table City',
    localizedName: { it: "Esercito cretese a Table City", en: 'Cretan army at Table City' },
    nationId: 'nation-fma-creta',
    description: {
      it: "Le forze di Creta al confine fra Table City e Milos, guidate dal colonnello Herschel, cioè Ashleigh Crichton.",
      en: "The Cretan forces on the border between Table City and Milos, led by Colonel Herschel, that is Ashleigh Crichton.",
    },
    longDescription: {
      it: "Herschel impiega chimere-lupo della polizia segreta cretese e, con amarezza, tenta di distruggere Milos facendo esplodere una centrale termica cretese e mandando la lava verso la Valle. Quando cade, senza il suo comandante le forze cretesi si ritirano.",
      en: "Herschel uses wolf chimeras from the Cretan secret police and, out of bitterness, tries to destroy Milos by blowing up a Cretan thermal power plant and sending lava toward the Valley. When he falls, without their commander the Cretan forces retreat.",
    },
    leaderIds: ['char-fma-ashleigh-crichton'],
    characterIds: ['char-fma-ashleigh-crichton'],
    locationIds: ['loc-fma-table-city'],
    arcIds: ['arc-fma-sacred-star-of-milos'],
    tags: ['film', 'creta'],
    canonStatus: 'movie',
  }),
];
