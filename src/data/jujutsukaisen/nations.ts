import type { Localizable, Nation } from '@/types';

const pref = (
  id: string,
  name: string,
  ja: string,
  label: { x: number; y: number },
  description: Localizable,
  extra: Partial<Nation> = {},
): Nation => ({
  id: `nation-jjk-${id}`,
  worldId: 'world-jujutsukaisen',
  name,
  localizedName: { it: name, en: name, ja },
  japaneseName: ja,
  type: 'minor_nation',
  description,
  labelPosition: label,
  canonStatus: 'canon',
  referenceStatus: 'verified',
  tags: ['prefettura'],
  ...extra,
});

/**
 * «Nazioni» di Jujutsu Kaisen: le PREFETTURE reali del Giappone in cui si svolge la
 * storia (facet etichettato «Regione / Prefettura» via `WorldConfig.nationTerm`).
 * `labelPosition` è sul piano di `jjk-map-japan` (1800 × 1600).
 */
export const jjkNations: Nation[] = [
  pref('tokyo', 'Tokyo', '東京都', { x: 1091, y: 1053 }, {
    it: "La metropoli al centro di tutto: qui ci sono l'istituto di arti occulte, Shibuya, Shinjuku e due delle dieci colonie del Culling Game. Quasi tutti gli scontri decisivi della serie avvengono nei suoi quartieri.",
    en: 'The metropolis at the heart of everything: here are the jujutsu high school, Shibuya, Shinjuku and two of the ten Culling Game colonies. Almost every decisive battle of the series takes place in its wards.',
  }, {
    type: 'great_nation',
    capitalLocationId: 'loc-jjk-tokyo',
    descriptionLong: {
      it: "Il mondo dell'occulto si concentra dove si concentrano le persone: le emozioni negative degli abitanti generano spiriti maledetti, e Tokyo ne produce più di ogni altro luogo. Gojo lo dice a Nobara appena arrivata: le maledizioni della capitale sono di un altro livello rispetto a quelle di campagna. Dopo l'Incidente di Shibuya la città viene invasa dagli spiriti, il governo perde il controllo e i quartieri centrali diventano colonie.",
      en: "The jujutsu world concentrates where people concentrate: the inhabitants' negative emotions give birth to cursed spirits, and Tokyo produces more than anywhere else. Gojo tells Nobara as soon as she arrives: the capital's curses are on another level from those in the countryside. After the Shibuya Incident the city is overrun by curses, the government loses control and the central wards become colonies.",
    },
    color: '#5a4b9c',
  }),
  pref('kanagawa', 'Kanagawa', '神奈川県', { x: 1083, y: 1106 }, {
    it: "La prefettura a sud di Tokyo. A Kawasaki Mahito uccide tre ragazzi in un cinema e incontra Junpei Yoshino, studente del liceo Satozakura. Lì Yuji e Nanami indagano sulla loro prima missione insieme.",
    en: 'The prefecture south of Tokyo. In Kawasaki Mahito kills three boys in a cinema and meets Junpei Yoshino, a student at Satozakura High School. There Yuji and Nanami investigate on their first mission together.',
  }),
  pref('saitama', 'Saitama', '埼玉県', { x: 1072, y: 1029 }, {
    it: "La prefettura a nord di Tokyo. Nelle sue valli si trova il ponte Yasohachi, dove Yuji e Nobara affrontano Eso e Kechizu, due dei Dipinti della Morte, nella loro prima missione dopo l'Evento di Scambio.",
    en: 'The prefecture north of Tokyo. In its valleys lies the Yasohachi Bridge, where Yuji and Nobara face Eso and Kechizu, two of the Death Paintings, on their first mission after the Goodwill Event.',
  }),
  pref('miyagi', 'Miyagi', '宮城県', { x: 1196, y: 789 }, {
    it: "La prefettura di Sendai, la città dove Yuji è cresciuto con il nonno: qui comincia la storia, e qui sorge una delle colonie del Culling Game.",
    en: 'The prefecture of Sendai, the city where Yuji grew up with his grandfather: here the story begins, and here stands one of the Culling Game colonies.',
  }, { capitalLocationId: 'loc-jjk-sendai' }),
  pref('kyoto', 'Kyoto', '京都府', { x: 779, y: 1111 }, {
    it: "L'antica capitale, sede dell'istituto di arti occulte gemello di quello di Tokyo e roccaforte della tradizione: i grandi clan e i vertici conservatori del mondo occulto guardano da qui. Una delle colonie del Culling Game.",
    en: "The old capital, home to the sister school of Tokyo's jujutsu high and a stronghold of tradition: the great clans and the conservative leadership of the jujutsu world look on from here. One of the Culling Game colonies.",
  }, { type: 'great_nation', capitalLocationId: 'loc-jjk-kyoto', color: '#3f7fb5' }),
  pref('kagoshima', 'Kagoshima', '鹿児島県', { x: 393, y: 1470 }, {
    it: "La prefettura più meridionale di Kyushu, con il vulcano Sakurajima: la colonia di Sakurajima è quella in cui Maki ritrova Noritoshi Kamo e distrugge lo spirito di Naoya.",
    en: 'The southernmost prefecture of Kyushu, with the Sakurajima volcano: the Sakurajima colony is where Maki meets up with Noritoshi Kamo and destroys Naoya\'s spirit.',
  }),
  pref('okinawa', 'Okinawa', '沖縄県', { x: 1540, y: 1400 }, {
    it: "L'arcipelago a sud-ovest del Giappone. Nel 2006 Gojo e Geto vi portano Riko Amanai per salvare la sua governante Kuroi, e le regalano un giorno di vacanza al mare.",
    en: 'The archipelago south-west of Japan. In 2006 Gojo and Geto take Riko Amanai there to rescue her caretaker Kuroi, and give her a day of holiday by the sea before the end.',
  }),
  pref('aomori', 'Aomori', '青森県', { x: 1181, y: 576 }, {
    it: "La prefettura all'estremità settentrionale di Honshu, sede della colonia più a nord del Culling Game.",
    en: 'The prefecture at the northern tip of Honshu, home to the northernmost Culling Game colony.',
  }, { referenceStatus: 'needs_verification' }),
  pref('iwate', 'Iwate', '岩手県', { x: 1235, y: 693 }, {
    it: "La prefettura del Tohoku fra Aomori e Miyagi, una delle dieci sedi delle colonie del Culling Game.",
    en: 'The Tohoku prefecture between Aomori and Miyagi, one of the ten seats of the Culling Game colonies.',
  }, { referenceStatus: 'needs_verification' }),
  pref('aichi', 'Aichi', '愛知県', { x: 916, y: 1134 }, {
    it: "La prefettura di Nagoya, nel cuore di Honshu: una delle dieci colonie del Culling Game.",
    en: 'The prefecture of Nagoya, in the heart of Honshu: one of the ten Culling Game colonies.',
  }, { referenceStatus: 'needs_verification' }),
  pref('osaka', 'Osaka', '大阪府', { x: 779, y: 1177 }, {
    it: "La seconda metropoli del Giappone, a pochi chilometri da Kyoto: una delle dieci colonie del Culling Game.",
    en: "Japan's second metropolis, a few kilometres from Kyoto: one of the ten Culling Game colonies.",
  }, { referenceStatus: 'needs_verification' }),
  pref('hiroshima', 'Hiroshima', '広島県', { x: 557, y: 1172 }, {
    it: "La prefettura affacciata sul mare interno di Seto: una delle dieci colonie del Culling Game.",
    en: 'The prefecture facing the Seto Inland Sea: one of the ten Culling Game colonies.',
  }, { referenceStatus: 'needs_verification' }),
];
