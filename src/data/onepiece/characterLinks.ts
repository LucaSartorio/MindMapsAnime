import type { Character } from '@/types';

/**
 * «Tela di ragno» del dataset One Piece.
 *
 * Le ondate di personaggi minori (Extra5–7, film) sono state definite con i soli
 * dati anagrafici; qui si aggiungono — in modo centralizzato — i collegamenti
 * narrativi (archi, eventi, alleati, nemici, parenti, relazioni) che li intrecciano
 * al resto del mondo. Il merge è additivo: unisce gli array senza sovrascrivere
 * quanto già dichiarato nei file di definizione. Tutti gli id referenziati esistono
 * nel dataset (verificato da `validate:data`).
 */
type Rel = { targetCharacterId: string; label: string };
interface LinkPatch {
  factionIds?: string[];
  locationIds?: string[];
  arcIds?: string[];
  eventIds?: string[];
  allies?: string[];
  enemies?: string[];
  family?: string[];
  teachers?: string[];
  students?: string[];
  relationships?: Rel[];
}

const L = (
  arcIds?: string[], eventIds?: string[], allies?: string[], enemies?: string[],
  family?: string[], relationships?: Rel[],
): LinkPatch => ({
  ...(arcIds ? { arcIds } : {}),
  ...(eventIds ? { eventIds } : {}),
  ...(allies ? { allies } : {}),
  ...(enemies ? { enemies } : {}),
  ...(family ? { family } : {}),
  ...(relationships ? { relationships } : {}),
});

export const onepieceCharacterLinks: Record<string, LinkPatch> = {
  /* ===================== East Blue ===================== */
  'char-op-makino': L(['arc-op-romance-dawn'], ['evt-op-shanks-hat'], ['char-op-luffy', 'char-op-shanks']),
  'char-op-woop-slap': L(['arc-op-romance-dawn'], undefined, ['char-op-luffy', 'char-op-makino']),
  'char-op-higuma': L(['arc-op-romance-dawn'], ['evt-op-shanks-hat'], undefined, ['char-op-shanks', 'char-op-luffy']),
  'char-op-dadan': L(['arc-op-romance-dawn'], ['evt-op-ace-death'], ['char-op-ace', 'char-op-sabo', 'char-op-luffy'], undefined, undefined,
    [{ targetCharacterId: 'char-op-garp', label: 'Le affidò i tre fratelli' }, { targetCharacterId: 'char-op-ace', label: 'Lo crebbe come un figlio' }]),
  'char-op-bluejam': L(['arc-op-romance-dawn'], undefined, undefined, ['char-op-ace', 'char-op-sabo', 'char-op-luffy']),
  'char-op-koushiro': L(['arc-op-romance-dawn'], undefined, ['char-op-zoro'], undefined, ['char-op-kuina'],
    [{ targetCharacterId: 'char-op-zoro', label: 'Allievo' }, { targetCharacterId: 'char-op-kuina', label: 'Figlia' }]),
  'char-op-kuina': L(['arc-op-romance-dawn'], undefined, ['char-op-zoro'], undefined, ['char-op-koushiro'],
    [{ targetCharacterId: 'char-op-zoro', label: "Rivale d'infanzia" }]),
  'char-op-kaya': L(['arc-op-syrup-village'], ['evt-op-usopp-kuro'], ['char-op-usopp', 'char-op-merry'], ['char-op-kuro']),
  'char-op-merry': L(['arc-op-syrup-village'], ['evt-op-usopp-kuro'], ['char-op-kaya', 'char-op-usopp'], ['char-op-kuro'],
    undefined, [{ targetCharacterId: 'char-op-kaya', label: 'Maggiordomo' }]),
  'char-op-banchina': L(['arc-op-syrup-village'], undefined, undefined, undefined, ['char-op-usopp', 'char-op-yasopp'],
    [{ targetCharacterId: 'char-op-usopp', label: 'Figlio' }, { targetCharacterId: 'char-op-yasopp', label: 'Marito' }]),
  'char-op-tamanegi': L(['arc-op-syrup-village'], undefined, ['char-op-usopp', 'char-op-piiman', 'char-op-ninjin']),
  'char-op-piiman': L(['arc-op-syrup-village'], undefined, ['char-op-usopp', 'char-op-tamanegi', 'char-op-ninjin']),
  'char-op-ninjin': L(['arc-op-syrup-village'], undefined, ['char-op-usopp', 'char-op-tamanegi', 'char-op-piiman']),
  'char-op-patty': L(['arc-op-baratie'], ['evt-op-baratie-krieg'], ['char-op-sanji', 'char-op-zeff', 'char-op-carne'], ['char-op-don-krieg']),
  'char-op-carne': L(['arc-op-baratie'], ['evt-op-baratie-krieg'], ['char-op-sanji', 'char-op-zeff', 'char-op-patty'], ['char-op-don-krieg']),
  'char-op-gin': L(['arc-op-baratie'], ['evt-op-baratie-krieg', 'evt-op-fight-luffy-don-krieg'], ['char-op-sanji'], undefined, undefined,
    [{ targetCharacterId: 'char-op-don-krieg', label: 'Capitano' }, { targetCharacterId: 'char-op-sanji', label: 'Lo sfamò da nemico' }]),
  'char-op-pearl': L(['arc-op-baratie'], ['evt-op-baratie-krieg'], ['char-op-don-krieg', 'char-op-gin'], ['char-op-sanji']),
  'char-op-fullbody': L(['arc-op-baratie', 'arc-op-alabasta'], undefined, ['char-op-hina', 'char-op-jango'], ['char-op-sanji']),
  'char-op-nojiko': L(['arc-op-arlong-park'], ['evt-op-arlong-nami-past', 'evt-op-arlong-liberation'], ['char-op-nami', 'char-op-genzo'], ['char-op-arlong'],
    ['char-op-nami'], [{ targetCharacterId: 'char-op-nami', label: 'Sorella adottiva' }, { targetCharacterId: 'char-op-bellemere', label: 'Madre adottiva' }]),
  'char-op-genzo': L(['arc-op-arlong-park'], ['evt-op-arlong-liberation'], ['char-op-nami', 'char-op-nojiko'], ['char-op-arlong']),
  'char-op-kuroobi': L(['arc-op-arlong-park'], ['evt-op-fight-luffy-arlong', 'evt-op-arlong-liberation'], ['char-op-arlong', 'char-op-chew', 'char-op-hatchan'], ['char-op-sanji']),
  'char-op-chew': L(['arc-op-arlong-park'], ['evt-op-arlong-liberation'], ['char-op-arlong', 'char-op-kuroobi', 'char-op-hatchan'], ['char-op-usopp']),
  'char-op-nezumi': L(['arc-op-arlong-park'], undefined, ['char-op-arlong'], ['char-op-nami', 'char-op-luffy']),
  'char-op-ipponmatsu': L(['arc-op-loguetown'], ['evt-op-loguetown-zoro-swords'], undefined, undefined, undefined,
    [{ targetCharacterId: 'char-op-zoro', label: 'Gli vendette la Sandai Kitetsu' }]),
  'char-op-daddy-masterson': L(['arc-op-loguetown'], undefined, undefined, undefined, undefined,
    [{ targetCharacterId: 'char-op-usopp', label: 'Sfida di tiro' }]),
  'char-op-johnny': L(['arc-op-baratie', 'arc-op-arlong-park'], undefined, ['char-op-zoro', 'char-op-luffy', 'char-op-yosaku'], ['char-op-arlong']),
  'char-op-yosaku': L(['arc-op-baratie', 'arc-op-arlong-park'], undefined, ['char-op-zoro', 'char-op-luffy', 'char-op-johnny'], ['char-op-arlong']),

  /* ===================== Little Garden / Drum / Alabasta ===================== */
  'char-op-dorry': L(undefined, ['evt-op-little-garden'], ['char-op-luffy', 'char-op-vivi', 'char-op-brogy']),
  'char-op-brogy': L(undefined, ['evt-op-little-garden'], ['char-op-luffy', 'char-op-vivi', 'char-op-dorry']),
  'char-op-chess': L(['arc-op-drum'], ['evt-op-drum-wapol', 'evt-op-fight-luffy-wapol'], ['char-op-wapol', 'char-op-kuromarimo'], ['char-op-luffy']),
  'char-op-kuromarimo': L(['arc-op-drum'], ['evt-op-drum-wapol', 'evt-op-fight-luffy-wapol'], ['char-op-wapol', 'char-op-chess'], ['char-op-luffy']),
  'char-op-igaram': L(['arc-op-alabasta'], ['evt-op-alabasta-war'], ['char-op-vivi', 'char-op-cobra'], ['char-op-crocodile'],
    undefined, [{ targetCharacterId: 'char-op-vivi', label: 'Capo della scorta' }]),
  'char-op-chaka': L(['arc-op-alabasta'], ['evt-op-alabasta-war'], ['char-op-vivi', 'char-op-cobra', 'char-op-pell'], ['char-op-crocodile']),
  'char-op-toto': L(['arc-op-alabasta'], undefined, ['char-op-vivi', 'char-op-luffy'], undefined, ['char-op-koza']),
  'char-op-daz-bones': L(['arc-op-alabasta', 'arc-op-impel-down'], ['evt-op-impel-breakout', 'evt-op-alabasta-war'], ['char-op-crocodile', 'char-op-miss-doublefinger'], ['char-op-zoro'],
    undefined, [{ targetCharacterId: 'char-op-crocodile', label: 'Capo (Mr. 0)' }]),
  'char-op-miss-doublefinger': L(['arc-op-alabasta'], ['evt-op-alabasta-war'], ['char-op-crocodile', 'char-op-daz-bones'], ['char-op-nami']),
  'char-op-mr-3': L(['arc-op-alabasta', 'arc-op-impel-down', 'arc-op-marineford'], ['evt-op-impel-breakout', 'evt-op-little-garden'], ['char-op-buggy', 'char-op-crocodile', 'char-op-miss-goldenweek'], ['char-op-luffy', 'char-op-vivi']),
  'char-op-miss-goldenweek': L(['arc-op-alabasta'], undefined, ['char-op-mr-3'], ['char-op-luffy']),
  'char-op-mr-5': L(['arc-op-alabasta'], ['evt-op-whisky-peak'], ['char-op-crocodile', 'char-op-miss-valentine'], ['char-op-vivi', 'char-op-luffy']),
  'char-op-miss-valentine': L(['arc-op-alabasta'], ['evt-op-whisky-peak'], ['char-op-crocodile', 'char-op-mr-5'], ['char-op-vivi']),
  'char-op-mr-4': L(['arc-op-alabasta'], undefined, ['char-op-crocodile', 'char-op-miss-merry-christmas'], ['char-op-usopp', 'char-op-chopper']),
  'char-op-miss-merry-christmas': L(['arc-op-alabasta'], undefined, ['char-op-crocodile', 'char-op-mr-4'], ['char-op-usopp', 'char-op-chopper']),

  /* ===================== Jaya / Skypiea / Long Ring ===================== */
  'char-op-masira': L(['arc-op-jaya', 'arc-op-skypiea'], ['evt-op-sky-knock-up'], ['char-op-cricket', 'char-op-luffy', 'char-op-shoujou'], undefined, ['char-op-shoujou']),
  'char-op-shoujou': L(['arc-op-jaya', 'arc-op-skypiea'], ['evt-op-sky-knock-up'], ['char-op-cricket', 'char-op-luffy', 'char-op-masira'], undefined, ['char-op-masira']),
  'char-op-pagaya': L(['arc-op-skypiea'], undefined, ['char-op-luffy', 'char-op-conis'], ['char-op-enel'], ['char-op-conis'],
    [{ targetCharacterId: 'char-op-conis', label: 'Figlia' }]),
  'char-op-aisa': L(['arc-op-skypiea'], ['evt-op-skypiea-bell', 'evt-op-skypiea-enel'], ['char-op-wiper', 'char-op-luffy', 'char-op-calgara'], ['char-op-enel']),
  'char-op-ohm': L(['arc-op-skypiea'], ['evt-op-skypiea-enel'], ['char-op-enel', 'char-op-shura'], ['char-op-zoro'],
    undefined, [{ targetCharacterId: 'char-op-enel', label: 'Sacerdote al suo servizio' }]),
  'char-op-gedatsu': L(['arc-op-skypiea'], ['evt-op-skypiea-enel'], ['char-op-enel', 'char-op-satori'], ['char-op-luffy']),
  'char-op-satori': L(['arc-op-skypiea'], ['evt-op-skypiea-enel'], ['char-op-enel', 'char-op-gedatsu'], ['char-op-luffy']),
  'char-op-shura': L(['arc-op-skypiea'], ['evt-op-skypiea-enel'], ['char-op-enel', 'char-op-ohm'], ['char-op-wiper']),
  'char-op-yama': L(['arc-op-skypiea'], ['evt-op-skypiea-enel'], ['char-op-enel'], ['char-op-luffy']),
  'char-op-tonjit': L(['arc-op-long-ring'], undefined, ['char-op-luffy', 'char-op-nami']),
  'char-op-porche': L(['arc-op-long-ring'], ['evt-op-fight-luffy-foxy'], ['char-op-foxy'], ['char-op-luffy'],
    undefined, [{ targetCharacterId: 'char-op-foxy', label: 'Capitano' }]),

  /* ===================== Water Seven / Enies Lobby ===================== */
  'char-op-paulie': L(['arc-op-water-seven', 'arc-op-enies-lobby'], ['evt-op-ws-cp9-reveal'], ['char-op-iceburg', 'char-op-franky'], ['char-op-lucci']),
  'char-op-kokoro': L(['arc-op-water-seven', 'arc-op-enies-lobby'], undefined, ['char-op-luffy', 'char-op-franky'], undefined, ['char-op-chimney'],
    [{ targetCharacterId: 'char-op-tom', label: 'Vecchia conoscente' }]),
  'char-op-tom': L(['arc-op-water-seven'], undefined, ['char-op-roger'], undefined, undefined,
    [{ targetCharacterId: 'char-op-franky', label: 'Allievo (Cutty Flam)' }, { targetCharacterId: 'char-op-iceburg', label: 'Allievo' }]),
  'char-op-spandine': L(['arc-op-ohara'], ['evt-op-ohara-buster-call'], undefined, ['char-op-olvia', 'char-op-saul'], ['char-op-spandam'],
    [{ targetCharacterId: 'char-op-spandam', label: 'Figlio' }]),
  'char-op-oimo': L(['arc-op-enies-lobby'], ['evt-op-el-gates-justice'], ['char-op-luffy', 'char-op-franky', 'char-op-kashii'], undefined, undefined,
    [{ targetCharacterId: 'char-op-kashii', label: "Compagno d'armi" }]),
  'char-op-kashii': L(['arc-op-enies-lobby'], ['evt-op-el-gates-justice'], ['char-op-luffy', 'char-op-franky', 'char-op-oimo']),

  /* ===================== Thriller Bark ===================== */
  'char-op-lola': L(['arc-op-thriller-bark'], undefined, ['char-op-nami'], undefined, ['char-op-big-mom', 'char-op-chiffon'],
    [{ targetCharacterId: 'char-op-nami', label: 'Le donò la Vivre Card' }, { targetCharacterId: 'char-op-big-mom', label: 'Madre' }]),
  'char-op-cindry': L(['arc-op-thriller-bark'], undefined, ['char-op-hogback'], undefined, undefined,
    [{ targetCharacterId: 'char-op-hogback', label: 'La resuscitò come zombie' }]),

  /* ===================== Sabaody / Amazon Lily ===================== */
  'char-op-shakky': L(['arc-op-sabaody'], undefined, ['char-op-rayleigh', 'char-op-luffy'], undefined, undefined,
    [{ targetCharacterId: 'char-op-rayleigh', label: 'Compagna' }]),
  'char-op-duval': L(['arc-op-sabaody'], undefined, ['char-op-sanji', 'char-op-luffy'], undefined, undefined,
    [{ targetCharacterId: 'char-op-sanji', label: '«Rifatto» da un suo calcio' }]),
  'char-op-charloss': L(['arc-op-sabaody'], ['evt-op-sab-celestial'], undefined, ['char-op-luffy']),
  'char-op-pappag': L(['arc-op-sabaody', 'arc-op-fishman-island'], undefined, ['char-op-hatchan', 'char-op-camie']),
  'char-op-ran': L(['arc-op-amazon-lily'], undefined, ['char-op-hancock', 'char-op-marguerite', 'char-op-gloriosa']),

  /* ===================== Impel Down ===================== */
  'char-op-hannyabal': L(['arc-op-impel-down'], ['evt-op-impel-breakout'], ['char-op-magellan'], ['char-op-luffy'],
    undefined, [{ targetCharacterId: 'char-op-magellan', label: 'Ne ambisce il posto' }]),
  'char-op-sadi': L(['arc-op-impel-down'], ['evt-op-impel-breakout'], ['char-op-magellan', 'char-op-saldeath'], ['char-op-luffy']),
  'char-op-saldeath': L(['arc-op-impel-down'], ['evt-op-impel-breakout'], ['char-op-magellan', 'char-op-sadi'], ['char-op-luffy']),

  /* ===================== Marineford (comandanti di Barbabianca) ===================== */
  'char-op-namur': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-blamenco': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-rakuyo': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-fossa': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-curiel': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-haruta': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-atmos': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-blenheim': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-speed-jiru': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-whitebeard', 'char-op-ace', 'char-op-marco'], ['char-op-akainu']),
  'char-op-momonga': L(['arc-op-marineford'], ['evt-op-marineford-war'], ['char-op-sengoku', 'char-op-hancock'], ['char-op-whitebeard']),
  'char-op-onigumo': L(['arc-op-marineford'], ['evt-op-mf-ace-freed'], ['char-op-akainu', 'char-op-sengoku'], ['char-op-ace', 'char-op-luffy']),

  /* ===================== Fish-Man Island ===================== */
  'char-op-ryuboshi': L(['arc-op-fishman-island'], ['evt-op-fishman-island'], ['char-op-luffy', 'char-op-fukaboshi'], ['char-op-hody'],
    ['char-op-shirahoshi', 'char-op-neptune', 'char-op-fukaboshi']),
  'char-op-manboshi': L(['arc-op-fishman-island'], ['evt-op-fishman-island'], ['char-op-luffy', 'char-op-fukaboshi'], ['char-op-hody'],
    ['char-op-shirahoshi', 'char-op-neptune', 'char-op-fukaboshi']),
  'char-op-vander-decken': L(['arc-op-fishman-island'], ['evt-op-fmi-noah'], ['char-op-hody'], ['char-op-shirahoshi', 'char-op-luffy'],
    undefined, [{ targetCharacterId: 'char-op-shirahoshi', label: 'Ossessione' }]),

  /* ===================== Punk Hazard ===================== */
  'char-op-brownbeard': L(['arc-op-punk-hazard'], ['evt-op-ph-alliance'], ['char-op-luffy', 'char-op-law'], ['char-op-caesar']),
  'char-op-mocha': L(['arc-op-punk-hazard'], ['evt-op-ph-caesar-gas'], ['char-op-chopper', 'char-op-luffy'], ['char-op-caesar']),

  /* ===================== Dressrosa ===================== */
  'char-op-dellinger': L(['arc-op-dressrosa'], ['evt-op-doflamingo-defeat'], ['char-op-doflamingo', 'char-op-diamante'], ['char-op-luffy'],
    undefined, [{ targetCharacterId: 'char-op-doflamingo', label: 'Capo' }]),
  'char-op-lao-g': L(['arc-op-dressrosa'], ['evt-op-doflamingo-defeat'], ['char-op-doflamingo'], ['char-op-kyros']),
  'char-op-buffalo': L(['arc-op-dressrosa', 'arc-op-punk-hazard'], ['evt-op-doflamingo-defeat'], ['char-op-doflamingo', 'char-op-caesar'], ['char-op-luffy']),
  'char-op-scarlett': L(['arc-op-dressrosa'], undefined, undefined, ['char-op-diamante'], ['char-op-kyros', 'char-op-rebecca', 'char-op-viola', 'char-op-riku'],
    [{ targetCharacterId: 'char-op-kyros', label: 'Moglie' }, { targetCharacterId: 'char-op-rebecca', label: 'Figlia' }]),
  'char-op-leo': L(['arc-op-dressrosa'], ['evt-op-dr-tontatta', 'evt-op-doflamingo-defeat'], ['char-op-luffy', 'char-op-mansherry'], ['char-op-doflamingo']),
  'char-op-mansherry': L(['arc-op-dressrosa'], ['evt-op-dr-tontatta'], ['char-op-leo', 'char-op-luffy'], ['char-op-doflamingo']),

  /* ===================== Zou ===================== */
  'char-op-wanda': L(['arc-op-zou'], ['evt-op-zou-alliance', 'evt-op-fight-jack-minks'], ['char-op-inuarashi', 'char-op-nekomamushi', 'char-op-luffy'], ['char-op-jack']),
  'char-op-shishilian': L(['arc-op-zou'], ['evt-op-fight-jack-minks'], ['char-op-inuarashi', 'char-op-wanda'], ['char-op-jack']),

  /* ===================== Whole Cake Island (famiglia Charlotte) ===================== */
  'char-op-mont-dor': L(['arc-op-whole-cake'], ['evt-op-wci-wedding'], ['char-op-big-mom', 'char-op-katakuri'], ['char-op-luffy'],
    ['char-op-big-mom'], [{ targetCharacterId: 'char-op-big-mom', label: 'Madre' }]),
  'char-op-opera': L(['arc-op-whole-cake'], undefined, ['char-op-big-mom'], ['char-op-luffy'], ['char-op-big-mom'],
    [{ targetCharacterId: 'char-op-big-mom', label: 'Madre' }]),
  'char-op-galette': L(['arc-op-whole-cake'], ['evt-op-wci-wedding'], ['char-op-big-mom', 'char-op-katakuri'], ['char-op-luffy'], ['char-op-big-mom'],
    [{ targetCharacterId: 'char-op-big-mom', label: 'Madre' }]),
  'char-op-amande': L(['arc-op-whole-cake'], ['evt-op-wci-wedding'], ['char-op-big-mom'], ['char-op-luffy'], ['char-op-big-mom'],
    [{ targetCharacterId: 'char-op-big-mom', label: 'Madre' }]),
  'char-op-praline': L(['arc-op-whole-cake'], undefined, ['char-op-big-mom', 'char-op-aladine', 'char-op-jinbe'], undefined, ['char-op-big-mom'],
    [{ targetCharacterId: 'char-op-aladine', label: 'Marito' }, { targetCharacterId: 'char-op-big-mom', label: 'Madre' }]),
  'char-op-flampe': L(['arc-op-whole-cake'], ['evt-op-katakuri-duel'], ['char-op-big-mom'], ['char-op-luffy'], ['char-op-big-mom', 'char-op-katakuri'],
    [{ targetCharacterId: 'char-op-katakuri', label: 'Idolo poi tradito' }]),
  'char-op-streusen': L(['arc-op-whole-cake'], undefined, ['char-op-big-mom'], undefined, undefined,
    [{ targetCharacterId: 'char-op-big-mom', label: 'Cuoco capo' }]),
  'char-op-pound': L(['arc-op-whole-cake'], undefined, ['char-op-chiffon'], undefined, ['char-op-chiffon', 'char-op-lola', 'char-op-big-mom'],
    [{ targetCharacterId: 'char-op-big-mom', label: 'Ex consorte' }, { targetCharacterId: 'char-op-chiffon', label: 'Figlia' }]),
  'char-op-vito': L(['arc-op-whole-cake'], undefined, ['char-op-bege', 'char-op-chiffon'], undefined, undefined,
    [{ targetCharacterId: 'char-op-bege', label: 'Capo' }]),
  'char-op-zeus': L(['arc-op-whole-cake', 'arc-op-wano'], undefined, ['char-op-nami'], ['char-op-big-mom'], undefined,
    [{ targetCharacterId: 'char-op-nami', label: 'Arma del Clima Tact' }, { targetCharacterId: 'char-op-big-mom', label: 'Creatore' }]),

  /* ===================== Wano / Egghead / era di Roger ===================== */
  'char-op-sukiyaki': L(['arc-op-wano'], undefined, ['char-op-momonosuke', 'char-op-hiyori'], ['char-op-orochi'], ['char-op-oden', 'char-op-momonosuke', 'char-op-hiyori'],
    [{ targetCharacterId: 'char-op-oden', label: 'Padre' }]),
  'char-op-guernica': L(['arc-op-wano'], ['evt-op-onigashima-war'], ['char-op-doflamingo'], ['char-op-luffy'], undefined,
    [{ targetCharacterId: 'char-op-kaido', label: 'Eliminato da lui' }]),
  'char-op-s-snake': L(['arc-op-egghead'], ['evt-op-egghead-attack'], ['char-op-saturn', 'char-op-kizaru'], ['char-op-luffy'], undefined,
    [{ targetCharacterId: 'char-op-hancock', label: 'Modello genetico' }, { targetCharacterId: 'char-op-vegapunk', label: 'Creazione' }]),
  'char-op-s-shark': L(['arc-op-egghead'], ['evt-op-egghead-attack'], ['char-op-saturn', 'char-op-kizaru'], ['char-op-luffy'], undefined,
    [{ targetCharacterId: 'char-op-jinbe', label: 'Modello genetico' }, { targetCharacterId: 'char-op-vegapunk', label: 'Creazione' }]),
  'char-op-shimotsuki-ushimaru': L(['arc-op-wano'], undefined, ['char-op-oden'], ['char-op-kaido', 'char-op-orochi']),

  /* ===================== Film ===================== */
  'char-op-uta': L(undefined, undefined, ['char-op-luffy'], undefined, ['char-op-shanks'],
    [{ targetCharacterId: 'char-op-shanks', label: 'Padre adottivo' }, { targetCharacterId: 'char-op-luffy', label: "Amica d'infanzia" }]),
  'char-op-gild-tesoro': L(undefined, undefined, undefined, ['char-op-luffy']),
  'char-op-douglas-bullet': L(undefined, undefined, undefined, ['char-op-luffy', 'char-op-buggy'], undefined,
    [{ targetCharacterId: 'char-op-roger', label: 'Ex ciurma di Roger' }]),
  'char-op-zephyr': L(undefined, undefined, undefined, ['char-op-luffy'], undefined,
    [{ targetCharacterId: 'char-op-sengoku', label: 'Ex Marina' }]),
  'char-op-shiki': L(undefined, undefined, undefined, ['char-op-luffy'], undefined,
    [{ targetCharacterId: 'char-op-roger', label: "Rivale dell'epoca" }, { targetCharacterId: 'char-op-garp', label: 'Nemico storico' }]),
  'char-op-gasparde': L(undefined, undefined, undefined, ['char-op-luffy']),
  'char-op-saga': L(undefined, undefined, ['char-op-zoro'], undefined, undefined,
    [{ targetCharacterId: 'char-op-zoro', label: 'Vecchio amico spadaccino' }]),
  'char-op-baron-omatsuri': L(undefined, undefined, undefined, ['char-op-luffy']),
  'char-op-ratchet': L(undefined, undefined, undefined, ['char-op-luffy']),
  'char-op-bear-king': L(undefined, undefined, undefined, ['char-op-luffy']),
  'char-op-el-drago': L(undefined, undefined, undefined, ['char-op-luffy']),
};

const uniq = (a?: string[], b?: string[]): string[] | undefined => {
  if (!a && !b) return undefined;
  return Array.from(new Set([...(a ?? []), ...(b ?? [])]));
};

/** Applica i collegamenti della «tela» ai personaggi, unendo gli array in modo additivo. */
export function withCharacterLinks(characters: Character[]): Character[] {
  return characters.map((c) => {
    const patch = onepieceCharacterLinks[c.id];
    if (!patch) return c;
    const relationships = [...(c.relationships ?? []), ...(patch.relationships ?? [])];
    return {
      ...c,
      ...(uniq(c.factionIds, patch.factionIds) ? { factionIds: uniq(c.factionIds, patch.factionIds) } : {}),
      ...(uniq(c.locationIds, patch.locationIds) ? { locationIds: uniq(c.locationIds, patch.locationIds) } : {}),
      ...(uniq(c.arcIds, patch.arcIds) ? { arcIds: uniq(c.arcIds, patch.arcIds) } : {}),
      ...(uniq(c.eventIds, patch.eventIds) ? { eventIds: uniq(c.eventIds, patch.eventIds) } : {}),
      ...(uniq(c.allies, patch.allies) ? { allies: uniq(c.allies, patch.allies) } : {}),
      ...(uniq(c.enemies, patch.enemies) ? { enemies: uniq(c.enemies, patch.enemies) } : {}),
      ...(uniq(c.family, patch.family) ? { family: uniq(c.family, patch.family) } : {}),
      ...(uniq(c.teachers, patch.teachers) ? { teachers: uniq(c.teachers, patch.teachers) } : {}),
      ...(uniq(c.students, patch.students) ? { students: uniq(c.students, patch.students) } : {}),
      ...(relationships.length ? { relationships } : {}),
    };
  });
}
