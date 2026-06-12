import type { TimelineEvent } from '@/types';

/** Eventi di backstory e della Saga Finale a completamento della timeline. */
const E = (
  id: string, tit: string, ten: string, pit: string, pen: string,
  sit: string, sen: string, lit: string, len: string,
  loc: string, chars: string[], manga: string, order: number, tags: string[], arcId?: string,
): TimelineEvent => ({
  id, worldId: 'world-onepiece',
  title: { it: tit, en: ten },
  description: { it: sit, en: sen },
  longDescription: { it: lit, en: len },
  period: { it: pit, en: pen },
  ...(arcId ? { arcId } : {}),
  locationId: loc, characterIds: chars,
  mangaChapters: [manga], order,
  canon: 'canon', canonStatus: 'canon', referenceStatus: 'verified',
  tags,
});

export const onepieceEventsExtra4: TimelineEvent[] = [
  E('evt-op-rocks-rise', 'I Pirati di Rocks', 'The Rocks Pirates', 'Backstory · ~40 anni fa', 'Backstory · ~40 years ago',
    "La ciurma più temibile prima di Roger, che riuniva futuri Imperatori sotto Rocks D. Xebec.",
    "The most fearsome crew before Roger, gathering future Emperors under Rocks D. Xebec.",
    "Sull’isola di God Valley, 38 anni fa, i Pirati di Rocks — con un giovane Barbabianca, Big Mom, Kaido e Shiki — sfidarono il mondo. Furono annientati dall’alleanza tra il vice-ammiraglio Garp e il «Re dei Pirati» Roger; la morte di Rocks restò un segreto di Stato.",
    "On God Valley island, 38 years ago, the Rocks Pirates — including a young Whitebeard, Big Mom, Kaido and Shiki — challenged the world. They were annihilated by the alliance of Vice Admiral Garp and the future 'Pirate King' Roger; Rocks's death became a state secret.",
    'loc-op-god-valley', ['char-op-rocks', 'char-op-whitebeard', 'char-op-big-mom', 'char-op-kaido', 'char-op-garp', 'char-op-roger'], '1096', -26, ['rocks', 'god-valley', 'backstory'], 'arc-op-god-valley'),

  E('evt-op-reverie-incident', "L’incidente della Reverie", 'The Reverie Incident', 'Saga di Levely', 'Levely Saga',
    "Durante il Consiglio dei Re, Nefertari Cobra incontra il sovrano segreto Imu… e non ne esce vivo.",
    "During the Council of Kings, Nefertari Cobra meets the secret ruler Imu… and does not come out alive.",
    "Alla Reverie di Mary Geoise, re Cobra di Alabasta scopre la verità sul Trono Vuoto e su Imu, che lo elimina; Sabo, infiltratosi, viene incolpato della sua morte, e la principessa Vivi scompare nel nulla. Il primo, diretto sguardo sul cuore oscuro del Governo Mondiale.",
    "At the Mary Geoise Reverie, King Cobra of Alabasta uncovers the truth about the Empty Throne and Imu, who eliminates him; Sabo, having infiltrated, is blamed for the death, and Princess Vivi vanishes. The first direct look into the World Government's dark heart.",
    'loc-op-mary-geoise', ['char-op-cobra', 'char-op-imu', 'char-op-sabo', 'char-op-vivi', 'char-op-saturn'], '908', 70.5, ['reverie', 'imu', 'cobra'], 'arc-op-reverie'),

  E('evt-op-lulusia-erased', 'La cancellazione di Lulusia', 'The Erasure of Lulusia', 'Saga Finale', 'Final Saga',
    "Imu impiega la «Mother Flame» per spazzare via dalle mappe un intero regno.",
    "Imu uses the 'Mother Flame' to wipe an entire kingdom off the maps.",
    "Per eliminare Sabo e dimostrare la potenza dell’arma ancestrale recreata, Imu attiva da Mary Geoise la Mother Flame e fa precipitare dal cielo una distruzione che annienta il Regno di Lulusia. Un crimine occultato al mondo intero.",
    "To eliminate Sabo and show the power of the recreated Ancient Weapon, Imu activates the Mother Flame from Mary Geoise, calling down a destruction from the sky that annihilates the Lulusia Kingdom. A crime hidden from the entire world.",
    'loc-op-lulusia-kingdom', ['char-op-imu'], '1060', 70.6, ['lulusia', 'imu', 'mother-flame', 'uranus']),

  E('evt-op-elbaf-war', 'La guerra di Elbaf', 'The War of Elbaf', 'Saga Finale · Elbaf', 'Final Saga · Elbaf',
    "I giganti di Elbaf scendono in campo: comincia lo scontro aperto con il Governo Mondiale.",
    "The giants of Elbaf take the field: open conflict with the World Government begins.",
    "Sull’isola sacra dei guerrieri, tra il principe maledetto Loki, i Cavalieri di Dio di Garling e l’arrivo dei Cappello di Paglia, esplode la prima grande battaglia della Saga Finale, mentre i Testi Harley svelano la storia dei Tre Mondi.",
    "On the warriors' sacred island — amid the cursed prince Loki, Garling's God's Knights and the arrival of the Straw Hats — the Final Saga's first great battle erupts, as the Harley texts reveal the story of the Three Worlds.",
    'loc-op-elbaf', ['char-op-luffy', 'char-op-loki', 'char-op-dragon', 'char-op-garling'], '1131', 74.5, ['elbaf', 'saga-finale', 'cavalieri-di-dio']),
];
