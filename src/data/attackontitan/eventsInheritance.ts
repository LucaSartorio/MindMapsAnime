import type { TimelineEvent } from '@/types';
import { ev } from './eventHelpers';
import { P } from './periods';

/**
 * Passaggi di eredità dei Nove Giganti che mancavano alla timeline. Il tag
 * `eredita-gigante` (anche sugli eventi già presenti: Kruger → Grisha, Grisha →
 * Eren, Bertolt → Armin, il Martello, Porco → Falco…) accende i luoghi sulla
 * mappa con il filtro «Evidenzia le eredità dei Nove Giganti».
 */
export const aotEventsInheritance: TimelineEvent[] = [
  ev({
    id: 'evt-aot-frieda-inherits',
    title: { it: 'Frieda eredita il Fondatore', en: 'Frieda inherits the Founder' },
    description: {
      it: "Quando il tempo di Uri Reiss si esaurisce, il Gigante Fondatore passa alla nipote Frieda, la figlia maggiore di Rod: nella cappella sotterranea della famiglia lei si trasforma e divora lo zio. Con il potere eredita anche il voto di Karl Fritz, che le impedisce di usarlo contro i Giganti.",
      en: "When Uri Reiss's time runs out, the Founding Titan passes to his niece Frieda, Rod's eldest daughter: in the family's underground chapel she transforms and devours her uncle. Along with the power she inherits Karl Fritz's vow, which stops her from using it against the Titans.",
    },
    period: P.before845,
    arcId: 'arc-aot-uprising',
    locationId: 'loc-aot-reiss-chapel',
    characterIds: ['char-aot-frieda-reiss', 'char-aot-uri-reiss', 'char-aot-rod-reiss'],
    mangaChapters: ['~63'],
    animeEpisodes: ['ep. 43'],
    order: 145,
    tags: ['fondatore', 'reiss', 'eredita-gigante'],
  }),
  ev({
    id: 'evt-aot-porco-eats-ymir',
    title: { it: 'Ymir si consegna a Marley', en: 'Ymir gives herself up to Marley' },
    description: {
      it: "Portata via da Reiner e Bertolt, Ymir accetta di tornare a Marley e lascia che il Mascella torni ai Galliard: Porco la divora, recuperando il potere che era stato di suo fratello Marcel. Prima di morire Ymir scrive una lettera per Historia.",
      en: "Taken away by Reiner and Bertolt, Ymir agrees to return to Marley and lets the Jaw go back to the Galliards: Porco devours her, recovering the power that had been his brother Marcel's. Before dying Ymir writes a letter to Historia.",
    },
    period: P.y850,
    arcId: 'arc-aot-return-to-shiganshina',
    locationId: 'loc-aot-marley',
    characterIds: ['char-aot-ymir', 'char-aot-porco', 'char-aot-reiner', 'char-aot-historia', 'char-aot-marcel'],
    mangaChapters: ['~89'],
    order: 690,
    tags: ['mascella', 'ymir', 'eredita-gigante'],
  }),
];
