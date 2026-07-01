import type { Route } from '@/types';
import { DRAGONBALL_SAGA_COLORS } from './mapConstants';

/**
 * Percorsi narrativi Dragon Ball.
 *
 * I primi 7 percorsi ripercorrono esattamente le 7 SAGHE della legenda
 * "SAGAS" stampata in basso a sinistra sul poster di riferimento (Goku's
 * Boyhood Saga → Majin Buu's Saga), con lo stesso identico colore campionato
 * dai rispettivi riquadri della legenda (vedi `DRAGONBALL_SAGA_COLORS` in
 * `mapConstants.ts`) — così i percorsi sulla mappa del sito usano la stessa
 * codifica cromatica del poster originale. L'ultimo percorso (Torneo del
 * Potere) copre materiale di Dragon Ball Super non presente sul poster e usa
 * quindi un colore proprio, non appartenente alla legenda.
 */
export const dragonballRoutes: Route[] = [
  {
    id: 'route-dbz-saga-goku-boyhood',
    worldId: 'world-dragonball',
    type: 'narrative',
    name: "Goku's Boyhood Saga",
    localizedName: { it: "Saga dell'Infanzia di Goku", en: "Goku's Boyhood Saga" },
    group: { it: 'Sagas · poster', en: 'Sagas · poster' },
    description: {
      it: "Dal Monte Paoz alla Kame House, dall'incontro con Chichi al 21° Torneo Tenkaichi: la prima saga di Dragon Ball, colorata in arancione sulla legenda del poster.",
      en: "From Mt. Paozu to Kame House, from meeting Chichi to the 21st Tenkaichi Budokai: Dragon Ball's first saga, colored orange on the poster's legend.",
    },
    protagonistCharacterIds: ['char-dbz-goku'],
    relatedArcIds: ['arc-dbz-pilaf-saga', 'arc-dbz-tenkaichi-tournament'],
    relatedLocationIds: ['loc-dbz-goku-house', 'loc-dbz-frypan-mountain', 'loc-dbz-kame-house', 'loc-dbz-pilaf-castle', 'loc-dbz-tenkaichi-arena'],
    steps: [
      { order: 1, locationId: 'loc-dbz-goku-house', arcId: 'arc-dbz-pilaf-saga', eventId: 'evt-dbz-bulma-meets-goku', label: { it: 'Monte Paoz', en: 'Mt. Paozu' }, description: { it: 'Incontro con Bulma e inizio della caccia alle Sfere del Drago.', en: 'Meeting Bulma and beginning the Dragon Ball hunt.' } },
      { order: 2, locationId: 'loc-dbz-frypan-mountain', label: { it: 'Monte Frypan', en: 'Frypan Mountain' }, description: { it: 'Goku incontra Chichi mentre Muten Roshi spegne le fiamme con il Kamehameha.', en: 'Goku meets Chichi while Master Roshi puts out the flames with the Kamehameha.' } },
      { order: 3, locationId: 'loc-dbz-kame-house', label: { it: 'Kame House', en: 'Kame House' }, description: { it: 'Addestramento con il Maestro Muten Roshi.', en: 'Training under Master Roshi.' } },
      { order: 4, locationId: 'loc-dbz-pilaf-castle', eventId: 'evt-dbz-pilaf-defeated', label: { it: 'Castello di Pilaf', en: 'Pilaf Castle' }, description: { it: "Sconfitta del piano dell'Imperatore Pilaf.", en: "Emperor Pilaf's scheme is foiled." } },
      { order: 5, locationId: 'loc-dbz-tenkaichi-arena', arcId: 'arc-dbz-tenkaichi-tournament', eventId: 'evt-dbz-21st-tenkaichi', label: { it: 'Isola di Papaya', en: 'Papaya Island' }, description: { it: '21° Torneo Tenkaichi.', en: '21st Tenkaichi Budokai.' } },
    ],
    color: DRAGONBALL_SAGA_COLORS.gokuBoyhood,
    lineStyle: 'solid',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['goku', 'sagas-poster'],
  },
  {
    id: 'route-dbz-saga-red-ribbon',
    worldId: 'world-dragonball',
    type: 'narrative',
    name: "Red Ribbon's Army Saga",
    localizedName: { it: "Saga dell'Esercito Red Ribbon", en: "Red Ribbon's Army Saga" },
    group: { it: 'Sagas · poster', en: 'Sagas · poster' },
    description: {
      it: "Da Muscle Tower al Quartier Generale del Red Ribbon: Goku smantella da solo l'intero esercito. Colorata in rosa/magenta sulla legenda del poster.",
      en: "From Muscle Tower to the Red Ribbon Headquarters: Goku single-handedly dismantles the entire army. Colored pink/magenta on the poster's legend.",
    },
    protagonistCharacterIds: ['char-dbz-goku'],
    relatedArcIds: ['arc-dbz-red-ribbon'],
    relatedLocationIds: ['loc-dbz-korin-tower', 'loc-dbz-muscle-tower', 'loc-dbz-red-ribbon-hq', 'loc-dbz-silver-platoon-base', 'loc-dbz-town-tao'],
    steps: [
      { order: 1, locationId: 'loc-dbz-korin-tower', label: { it: 'Torre di Karin', en: "Korin's Tower" }, description: { it: 'Goku raggiunge la cima della torre in allenamento.', en: 'Goku reaches the top of the tower in training.' } },
      { order: 2, locationId: 'loc-dbz-muscle-tower', label: { it: 'Muscle Tower', en: 'Muscle Tower' }, description: { it: 'Goku abbatte la White Corp.', en: 'Goku takes down the White Corp.' } },
      { order: 3, locationId: 'loc-dbz-silver-platoon-base', label: { it: 'Base del Plotone Argento', en: "Silver Platoon's Base" } },
      { order: 4, locationId: 'loc-dbz-town-tao', label: { it: 'Mercenary Tao ruba i vestiti', en: 'Mercenary Tao steals clothes' } },
      { order: 5, locationId: 'loc-dbz-red-ribbon-hq', eventId: 'evt-dbz-red-ribbon-defeated', label: { it: 'Quartier Generale Red Ribbon', en: 'Red Ribbon Headquarters' }, description: { it: "Distruzione dell'intero esercito Red Ribbon.", en: 'The entire Red Ribbon Army is destroyed.' } },
    ],
    color: DRAGONBALL_SAGA_COLORS.redRibbonArmy,
    lineStyle: 'solid',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['red-ribbon', 'sagas-poster'],
  },
  {
    id: 'route-dbz-saga-piccolo',
    worldId: 'world-dragonball',
    type: 'narrative',
    name: "Piccolo's Saga",
    localizedName: { it: 'Saga di Piccolo', en: "Piccolo's Saga" },
    group: { it: 'Sagas · poster', en: 'Sagas · poster' },
    description: {
      it: "Dalla morte di Muten Roshi per mano del Grande Mago Piccolo alla rivincita di Goku al 23° Torneo Tenkaichi contro Piccolo Junior. Colorata in verde scuro sulla legenda del poster.",
      en: "From Master Roshi's death at King Piccolo's hands to Goku's rematch against Piccolo Jr. at the 23rd Tenkaichi Budokai. Colored dark green on the poster's legend.",
    },
    protagonistCharacterIds: ['char-dbz-goku', 'char-dbz-piccolo'],
    relatedArcIds: ['arc-dbz-king-piccolo', 'arc-dbz-piccolo-jr'],
    relatedLocationIds: ['loc-dbz-battle-3-roshi-piccolo', 'loc-dbz-lookout', 'loc-dbz-tenkaichi-arena'],
    steps: [
      { order: 1, locationId: 'loc-dbz-battle-3-roshi-piccolo', arcId: 'arc-dbz-king-piccolo', eventId: 'evt-dbz-roshi-vs-king-piccolo', label: { it: 'Muten Roshi contro King Piccolo', en: 'Master Roshi vs. King Piccolo' } },
      { order: 2, locationId: 'loc-dbz-lookout', eventId: 'evt-dbz-king-piccolo-defeated', label: { it: 'Sconfitta del Grande Mago Piccolo', en: 'King Piccolo defeated' } },
      { order: 3, locationId: 'loc-dbz-tenkaichi-arena', arcId: 'arc-dbz-piccolo-jr', eventId: 'evt-dbz-piccolo-jr-tournament', label: { it: '23° Torneo Tenkaichi', en: '23rd Tenkaichi Budokai' }, description: { it: 'Goku sconfigge Piccolo Junior.', en: 'Goku defeats Piccolo Jr.' } },
    ],
    color: DRAGONBALL_SAGA_COLORS.piccolo,
    lineStyle: 'solid',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['piccolo', 'sagas-poster'],
  },
  {
    id: 'route-dbz-saga-saiyan',
    worldId: 'world-dragonball',
    type: 'narrative',
    name: 'Saiyan Saga',
    localizedName: { it: 'Saga dei Saiyan', en: 'Saiyan Saga' },
    group: { it: 'Sagas · poster', en: 'Sagas · poster' },
    description: {
      it: "Dall'atterraggio di Raditz all'arrivo di Vegeta e Nappa, fino al durissimo duello finale tra Goku e Vegeta. Colorata in azzurro chiaro sulla legenda del poster.",
      en: "From Raditz's landing to Vegeta and Nappa's arrival, up to the grueling final duel between Goku and Vegeta. Colored light blue on the poster's legend.",
    },
    protagonistCharacterIds: ['char-dbz-goku', 'char-dbz-vegeta'],
    relatedArcIds: ['arc-dbz-saiyan-saga'],
    relatedLocationIds: ['loc-dbz-raditz-landing', 'loc-dbz-battle-5-gohan-training', 'loc-dbz-battle-6-vegeta', 'loc-dbz-battle-12-goku-vegeta'],
    steps: [
      { order: 1, locationId: 'loc-dbz-raditz-landing', eventId: 'evt-dbz-raditz-arrival', label: { it: 'Atterraggio di Raditz', en: "Raditz's Landing" } },
      { order: 2, locationId: 'loc-dbz-battle-5-gohan-training', eventId: 'evt-dbz-gohan-survival-training', label: { it: 'Addestramento di Gohan', en: "Gohan's Training" } },
      { order: 3, locationId: 'loc-dbz-battle-6-vegeta', eventId: 'evt-dbz-vegeta-nappa-battle', label: { it: 'Battaglia con Vegeta e Nappa', en: 'Battle with Vegeta and Nappa' } },
      { order: 4, locationId: 'loc-dbz-battle-12-goku-vegeta', eventId: 'evt-dbz-goku-vegeta-final', label: { it: 'Duello finale Goku-Vegeta', en: 'Final Goku-Vegeta duel' } },
    ],
    color: DRAGONBALL_SAGA_COLORS.saiyan,
    lineStyle: 'solid',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['saiyan', 'sagas-poster'],
  },
  {
    id: 'route-dbz-saga-frieza',
    worldId: 'world-dragonball',
    type: 'mission',
    name: "Frieza's Saga",
    localizedName: { it: 'Saga di Freezer', en: "Frieza's Saga" },
    group: { it: 'Sagas · poster', en: 'Sagas · poster' },
    description: {
      it: "Il viaggio della Capsule Corporation dalla Terra fino al Pianeta Namecc, per usare le Sfere del Drago namecciane e affrontare l'esercito di Freezer. Colorata in giallo sulla legenda del poster.",
      en: "Capsule Corporation's journey from Earth to Planet Namek, to use the Namekian Dragon Balls and face Frieza's army. Colored yellow on the poster's legend.",
    },
    protagonistCharacterIds: ['char-dbz-krillin', 'char-dbz-bulma', 'char-dbz-gohan'],
    relatedCharacterIds: ['char-dbz-goku', 'char-dbz-vegeta', 'char-dbz-frieza'],
    arcId: 'arc-dbz-namek-frieza',
    relatedLocationIds: [
      'loc-dbz-capsule-corp',
      'loc-dbz-space-gate',
      'loc-dbz-earth-gate',
      'loc-dbz-namek-planet',
      'loc-dbz-namek-moori-village',
      'loc-dbz-namek-guru-house',
      'loc-dbz-namek-battlefield-plains',
      'loc-dbz-namek-final-battlefield',
    ],
    // Il percorso attraversa TRE livelli mappa (Terra → mappa cosmica →
    // sotto-mappa di Namecc): gli edge si disegnano solo tra step consecutivi
    // sullo stesso livello, quindi ogni "salto" di livello (step 2→3 e 4→5) è
    // volutamente privo di linea — il tratto riappare sul livello successivo.
    steps: [
      // — Livello Terra —
      { order: 1, locationId: 'loc-dbz-capsule-corp', label: { it: 'Partenza dalla Capsule Corporation', en: 'Departure from Capsule Corporation' }, description: { it: 'Costruzione della navicella spaziale per raggiungere Namecc.', en: 'Building the spaceship to reach Namek.' } },
      { order: 2, locationId: 'loc-dbz-space-gate', label: { it: 'Rotta spaziale verso Namecc', en: 'Space route to Namek' }, description: { it: 'Doppio clic sul pin "Spazio" per salire alla mappa cosmica.', en: 'Double-click the "Space" pin to go up to the cosmic map.' } },
      // — Mappa cosmica —
      { order: 3, locationId: 'loc-dbz-earth-gate', label: { it: 'Partenza dalla Terra', en: 'Departing Earth' } },
      { order: 4, locationId: 'loc-dbz-namek-planet', label: { it: 'Arrivo sul Pianeta Namecc', en: 'Arrival on Planet Namek' }, description: { it: 'Doppio clic sul Pianeta Namecc per scendere sulla sotto-mappa.', en: 'Double-click Planet Namek to drill into its sub-map.' } },
      // — Sotto-mappa di Namecc —
      { order: 5, locationId: 'loc-dbz-namek-moori-village', label: { it: 'Villaggio di Moori', en: "Moori's Village" }, description: { it: 'Crilin e Gohan salvano Dende dalla strage degli uomini di Freezer.', en: "Krillin and Gohan save Dende from the massacre by Frieza's men." } },
      { order: 6, locationId: 'loc-dbz-namek-guru-house', label: { it: 'Casa del Capo Anziano', en: "Grand Elder's House" }, description: { it: 'Potenziale sbloccato e ricerca delle Sfere del Drago namecciane.', en: 'Potential unlocked and the hunt for the Namekian Dragon Balls.' } },
      { order: 7, locationId: 'loc-dbz-namek-battlefield-plains', label: { it: 'Scontro con la Squadra Ginyu', en: 'Clash with the Ginyu Force' } },
      { order: 8, locationId: 'loc-dbz-namek-final-battlefield', eventId: 'evt-dbz-frieza-defeated-namek', label: { it: 'Sconfitta di Freezer su Namecc', en: 'Frieza defeated on Namek' }, description: { it: 'Goku diventa Super Saiyan e sconfigge Freezer prima della distruzione del pianeta.', en: 'Goku becomes a Super Saiyan and defeats Frieza before the planet is destroyed.' } },
    ],
    color: DRAGONBALL_SAGA_COLORS.frieza,
    lineStyle: 'dashed',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['namecc', 'freezer', 'sagas-poster'],
  },
  {
    id: 'route-dbz-saga-androids',
    worldId: 'world-dragonball',
    type: 'narrative',
    name: "Androids' Saga",
    localizedName: { it: 'Saga degli Androidi', en: "Androids' Saga" },
    group: { it: 'Sagas · poster', en: 'Sagas · poster' },
    description: {
      it: "Dall'arrivo di Trunks del Futuro all'attivazione degli Androidi nel laboratorio del Dr. Gero, fino ai Cell Games. Colorata in verde chiaro sulla legenda del poster.",
      en: "From Future Trunks' arrival to the Androids' activation in Dr. Gero's lab, up to the Cell Games. Colored light green on the poster's legend.",
    },
    protagonistCharacterIds: ['char-dbz-future-trunks', 'char-dbz-goku', 'char-dbz-gohan'],
    relatedCharacterIds: ['char-dbz-android-17', 'char-dbz-android-18', 'char-dbz-cell'],
    relatedArcIds: ['arc-dbz-androids', 'arc-dbz-cell-saga'],
    relatedLocationIds: ['loc-dbz-future-trunks-time-machine', 'loc-dbz-gero-lab', 'loc-dbz-battle-8-android19', 'loc-dbz-battle-11-cell-perfect', 'loc-dbz-cell-games-arena'],
    steps: [
      { order: 1, locationId: 'loc-dbz-future-trunks-time-machine', arcId: 'arc-dbz-androids', eventId: 'evt-dbz-future-trunks-arrival', label: { it: 'Arrivo di Trunks del Futuro', en: "Future Trunks' arrival" } },
      { order: 2, locationId: 'loc-dbz-gero-lab', eventId: 'evt-dbz-androids-activated', label: { it: 'Attivazione degli Androidi', en: 'The Androids are activated' } },
      { order: 3, locationId: 'loc-dbz-battle-8-android19', eventId: 'evt-dbz-battle-android-19', label: { it: "Vegeta sconfigge l'Androide C-19", en: 'Vegeta defeats Android 19' } },
      { order: 4, locationId: 'loc-dbz-battle-11-cell-perfect', arcId: 'arc-dbz-cell-saga', eventId: 'evt-dbz-cell-perfect-form', label: { it: 'Cell raggiunge la perfezione', en: 'Cell reaches perfection' } },
      { order: 5, locationId: 'loc-dbz-cell-games-arena', eventId: 'evt-dbz-gohan-defeats-cell', label: { it: 'I Cell Games', en: 'The Cell Games' }, description: { it: 'Gohan Super Saiyan 2 sconfigge Cell.', en: 'Super Saiyan 2 Gohan defeats Cell.' } },
    ],
    color: DRAGONBALL_SAGA_COLORS.androids,
    lineStyle: 'solid',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['androidi', 'cell', 'sagas-poster'],
  },
  {
    id: 'route-dbz-saga-majin-buu',
    worldId: 'world-dragonball',
    type: 'narrative',
    name: "Majin Buu's Saga",
    localizedName: { it: 'Saga di Majin Bu', en: "Majin Buu's Saga" },
    group: { it: 'Sagas · poster', en: 'Sagas · poster' },
    description: {
      it: "Dal 25° Torneo Tenkaichi all'astronave di Babidi, fino alla Genkidama finale contro Kid Bu. Colorata in rosa chiaro sulla legenda del poster.",
      en: "From the 25th Tenkaichi Budokai to Babidi's spaceship, up to the final Spirit Bomb against Kid Buu. Colored light pink on the poster's legend.",
    },
    protagonistCharacterIds: ['char-dbz-goku', 'char-dbz-vegeta', 'char-dbz-gohan'],
    relatedCharacterIds: ['char-dbz-majin-buu', 'char-dbz-kid-buu', 'char-dbz-gotenks'],
    arcId: 'arc-dbz-majin-buu',
    relatedLocationIds: ['loc-dbz-tenkaichi-arena', 'loc-dbz-babidis-spaceship', 'loc-dbz-battle-13-buu', 'loc-dbz-lookout'],
    steps: [
      { order: 1, locationId: 'loc-dbz-tenkaichi-arena', label: { it: '25° Torneo Tenkaichi', en: '25th Tenkaichi Budokai' } },
      { order: 2, locationId: 'loc-dbz-babidis-spaceship', eventId: 'evt-dbz-babidi-arrival', label: { it: 'Astronave di Babidi', en: "Babidi's spaceship" } },
      { order: 3, locationId: 'loc-dbz-battle-13-buu', eventId: 'evt-dbz-genkidama-vs-buu', label: { it: 'Genkidama contro Kid Bu', en: 'Spirit Bomb against Kid Buu' } },
      { order: 4, locationId: 'loc-dbz-lookout', label: { it: 'Ricostruzione della Terra', en: "Earth's restoration" } },
    ],
    color: DRAGONBALL_SAGA_COLORS.majinBuu,
    lineStyle: 'solid',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['majin-bu', 'sagas-poster'],
  },

  /* ------------------- Materiale successivo (non sul poster) ------------------- */
  {
    id: 'route-dbz-tournament-of-power-journey',
    worldId: 'world-dragonball',
    type: 'faction',
    name: 'The Road to the Tournament of Power',
    localizedName: { it: 'La strada verso il Torneo del Potere', en: 'The Road to the Tournament of Power' },
    group: { it: 'Dragon Ball Super', en: 'Dragon Ball Super' },
    description: {
      it: "Dall'addestramento sul Pianeta di Beerus al Mondo del Nulla: il cammino della squadra dell'Universo 7 verso il Torneo del Potere. Arco di Dragon Ball Super non presente sul poster: colore proprio.",
      en: "From training on Beerus's planet to the Null Realm: Universe 7's team journey to the Tournament of Power. A Dragon Ball Super arc not on the poster: its own color.",
    },
    protagonistCharacterIds: ['char-dbz-goku', 'char-dbz-vegeta'],
    relatedCharacterIds: ['char-dbz-whis', 'char-dbz-beerus', 'char-dbz-jiren'],
    arcId: 'arc-dbz-tournament-of-power',
    // Interamente sulla mappa cosmica (in precedenza uno step passava per il pin
    // "Spazio" sulla Terra, spezzando la linea su due livelli: nessun edge era
    // disegnato). Ora i tre step sono tutti sul livello cosmico.
    relatedLocationIds: ['loc-dbz-beerus-planet', 'loc-dbz-earth-gate', 'loc-dbz-tournament-arena'],
    steps: [
      { order: 1, locationId: 'loc-dbz-beerus-planet', label: { it: 'Addestramento con Whis', en: 'Training with Whis' }, description: { it: "Preparazione fisica e spirituale in vista del torneo.", en: 'Physical and spiritual preparation ahead of the tournament.' } },
      { order: 2, locationId: 'loc-dbz-earth-gate', label: { it: "Raduno della squadra dell'Universo 7", en: 'Universe 7 team gathers' }, description: { it: 'Goku recluta i dieci guerrieri che rappresenteranno la Terra e l’Universo 7.', en: 'Goku recruits the ten warriors who will represent Earth and Universe 7.' } },
      { order: 3, locationId: 'loc-dbz-tournament-arena', eventId: 'evt-dbz-tournament-of-power', label: { it: 'Il Torneo del Potere', en: 'The Tournament of Power' }, description: { it: "Lo scontro finale contro Jiren e l'Universo 11.", en: 'The final clash against Jiren and Universe 11.' } },
    ],
    color: '#e10b0b',
    lineStyle: 'dotted',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['torneo-del-potere'],
  },

  /* --------------------------------- Dragon Ball GT --------------------------------- */
  {
    id: 'route-dbz-gt-black-star-journey',
    worldId: 'world-dragonball',
    type: 'mission',
    name: 'Dragon Ball GT · Space Journey',
    localizedName: { it: 'Dragon Ball GT · Viaggio spaziale', en: 'Dragon Ball GT · Space Journey' },
    group: { it: 'Dragon Ball GT', en: 'Dragon Ball GT' },
    description: {
      it: "Dragon Ball GT: dalla Terra allo spazio profondo, il viaggio di Goku, Trunks e Pan a caccia delle Sfere del Drago Nere — Imecca, Gelbo (Luud), il Pianeta Macchina M-2, Beehay, Pital — fino al Nuovo Pianeta Plant della Saga di Baby, e ritorno sulla Terra. Attraversa la mappa della Terra e la sotto-mappa «Spazio (GT)».",
      en: "Dragon Ball GT: from Earth into deep space, the journey of Goku, Trunks and Pan hunting the Black Star Dragon Balls — Imecka, Gelbo (Luud), the Machine Planet M-2, Beehay, Pital — up to New Planet Plant of the Baby Saga, and back to Earth. It spans the Earth map and the 'Space (GT)' sub-map.",
    },
    protagonistCharacterIds: ['char-dbz-goku', 'char-dbz-trunks', 'char-dbz-gt-pan'],
    relatedCharacterIds: ['char-dbz-gt-giru', 'char-dbz-gt-baby', 'char-dbz-vegeta'],
    relatedArcIds: ['arc-dbz-gt-black-star', 'arc-dbz-gt-baby'],
    // Percorso multi-livello: Terra → sotto-mappa «Spazio (GT)». Gli edge si
    // disegnano solo tra step consecutivi sullo stesso livello, quindi il salto
    // di livello (step 2→3) è volutamente privo di linea.
    relatedLocationIds: [
      'loc-dbz-capsule-corp',
      'loc-dbz-gt-space-gate',
      'loc-dbz-gt-earth-gate',
      'loc-dbz-gt-imecka',
      'loc-dbz-gt-gelbo',
      'loc-dbz-gt-m2',
      'loc-dbz-gt-beehay',
      'loc-dbz-gt-pital',
      'loc-dbz-gt-new-plant',
    ],
    steps: [
      // — Livello Terra —
      { order: 1, locationId: 'loc-dbz-capsule-corp', label: { it: 'Partenza dalla Capsule Corporation', en: 'Departure from Capsule Corporation' }, description: { it: 'Goku bambino, Trunks e Pan salpano sulla nave spaziale per recuperare le Sfere del Drago Nere.', en: 'Kid Goku, Trunks and Pan set sail on the starship to recover the Black Star Dragon Balls.' } },
      { order: 2, locationId: 'loc-dbz-gt-space-gate', label: { it: 'Rotta spaziale (GT)', en: 'Space route (GT)' }, description: { it: 'Doppio clic sul pin «Spazio (GT)» per salire alla sotto-mappa spaziale di GT.', en: "Double-click the 'Space (GT)' pin to go up to GT's space sub-map." } },
      // — Sotto-mappa «Spazio (GT)» —
      { order: 3, locationId: 'loc-dbz-gt-earth-gate', label: { it: 'Partenza dalla Terra', en: 'Departing Earth' } },
      { order: 4, locationId: 'loc-dbz-gt-imecka', eventId: 'evt-dbz-gt-imecka-ledgic', label: { it: 'Pianeta Imecca', en: 'Planet Imecka' }, description: { it: 'Scontro con Ledgic; si unisce Giru.', en: 'Clash with Ledgic; Giru joins.' } },
      { order: 5, locationId: 'loc-dbz-gt-gelbo', eventId: 'evt-dbz-gt-luud', label: { it: 'Pianeta Gelbo (Luud)', en: 'Planet Gelbo (Luud)' } },
      { order: 6, locationId: 'loc-dbz-gt-m2', eventId: 'evt-dbz-gt-general-rilldo', label: { it: 'Pianeta Macchina M-2', en: 'Machine Planet M-2' }, description: { it: 'Generale Rilldo, Dr. Myuu e la nascita di Baby.', en: 'General Rilldo, Dr. Myuu and the birth of Baby.' } },
      { order: 7, locationId: 'loc-dbz-gt-beehay', label: { it: 'Pianeta Beehay', en: 'Planet Beehay' } },
      { order: 8, locationId: 'loc-dbz-gt-pital', label: { it: 'Pianeta Pital', en: 'Planet Pital' } },
      { order: 9, locationId: 'loc-dbz-gt-new-plant', eventId: 'evt-dbz-gt-goku-ssj4-vs-baby', label: { it: 'Nuovo Pianeta Plant', en: 'New Planet Plant' }, description: { it: 'Scontro finale della Saga di Baby: Goku Super Saiyan 4 contro Baby.', en: "Baby Saga climax: Super Saiyan 4 Goku vs. Baby." } },
      { order: 10, locationId: 'loc-dbz-gt-earth-gate', label: { it: 'Ritorno sulla Terra', en: 'Return to Earth' }, description: { it: 'Doppio clic su «Terra» per tornare alla mappa principale.', en: "Double-click 'Earth' to return to the main map." } },
    ],
    color: '#9b59b6',
    lineStyle: 'dashed',
    canonStatus: 'anime_only',
    referenceStatus: 'verified',
    tags: ['gt', 'sfere-del-drago-nere', 'spazio'],
  },
];
