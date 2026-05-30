import type { Nation } from '@/types';

/**
 * Nazioni / macro-regioni di Hunter x Hunter.
 *
 * La geografia di HxH è volutamente vaga nell'opera: queste voci sono un
 * primo scheletro e sono marcate `needs_verification` finché non si
 * consolidano confini e capitali. La mappa vera è rimandata a fase successiva.
 */
export const hxhNations: Nation[] = [
  {
    id: 'nation-hxh-padokia',
    worldId: 'world-hunterxhunter',
    name: 'Republic of Padokia',
    localizedName: { it: 'Repubblica di Padokia', en: 'Republic of Padokia' },
    type: 'uncertain',
    description: {
      it: 'Repubblica che ospita il Monte Kukuroo, sede della tenuta della famiglia Zoldyck.',
      en: 'Republic home to Kukuroo Mountain, site of the Zoldyck family estate.',
    },
    relatedLocationIds: ['loc-hxh-zoldyck-estate'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['zoldyck'],
  },
  {
    id: 'nation-hxh-kakin',
    worldId: 'world-hunterxhunter',
    name: 'Kingdom of Kakin',
    localizedName: { it: 'Regno di Kakin', en: 'Kingdom of Kakin' },
    type: 'great_nation',
    description: {
      it: 'Monarchia emergente guidata da Re Nasubi Hui Guo Rou. Promuove la spedizione verso il Continente Oscuro.',
      en: 'Emerging monarchy led by King Nasubi Hui Guo Rou. Sponsor of the expedition toward the Dark Continent.',
    },
    relatedLocationIds: ['loc-hxh-kakin'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['kakin', 'successione'],
  },
  {
    id: 'nation-hxh-east-gorteau',
    worldId: 'world-hunterxhunter',
    name: 'Republic of East Gorteau',
    localizedName: { it: 'Repubblica di East Gorteau', en: 'Republic of East Gorteau' },
    type: 'great_nation',
    description: {
      it: 'Stato dittatoriale isolazionista, teatro della crisi delle Formiche Chimera e della loro regina.',
      en: 'Isolationist dictatorship, stage of the Chimera Ant crisis and their King.',
    },
    relatedLocationIds: ['loc-hxh-east-gorteau'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['chimera-ant'],
  },
  {
    id: 'nation-hxh-ngl',
    worldId: 'world-hunterxhunter',
    name: 'Neo-Green Life Autonomous Region',
    localizedName: { it: 'Regione Autonoma Neo-Green Life (NGL)', en: 'Neo-Green Life Autonomous Region (NGL)' },
    type: 'minor_nation',
    description: {
      it: 'Nazione che rifiuta la tecnologia, in realtà fronte per il traffico di droga. Luogo di nascita della regina delle Formiche Chimera.',
      en: 'A technology-rejecting nation, secretly a drug-trafficking front. Birthplace of the Chimera Ant Queen.',
    },
    relatedLocationIds: ['loc-hxh-ngl'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['chimera-ant'],
  },
  {
    id: 'nation-hxh-dark-continent',
    worldId: 'world-hunterxhunter',
    name: 'Dark Continent',
    localizedName: { it: 'Continente Oscuro', en: 'Dark Continent' },
    type: 'uncertain',
    description: {
      it: 'Vasta terra inesplorata oltre il mondo conosciuto, dimora delle cinque grandi calamità e di creature leggendarie.',
      en: 'Vast unexplored land beyond the known world, home to the five great calamities and legendary creatures.',
    },
    relatedLocationIds: ['loc-hxh-dark-continent'],
    canonStatus: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['continente-oscuro'],
  },
];
