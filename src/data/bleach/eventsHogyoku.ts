import type { TimelineEvent } from '@/types';
import { ev } from './events';
import { P } from './periods';

/**
 * La storia dello Hōgyoku. Il tag `hogyoku` (anche sugli eventi già presenti:
 * il Sōkyoku, il tradimento di Aizen, la fusione, il sigillo di Urahara) accende
 * i luoghi sulla mappa con il filtro «Evidenzia il percorso dello Hōgyoku».
 */
export const bleachEventsHogyoku: TimelineEvent[] = [
  ev({
    id: 'evt-bl-hogyoku-created',
    title: { it: 'La creazione dello Hōgyoku', en: 'The creation of the Hōgyoku' },
    description: {
      it: "Da capitano della Dodicesima Divisione Kisuke Urahara crea lo Hōgyoku, la sfera capace di abbattere il confine fra Shinigami e Hollow. Capisce presto che è troppo pericoloso e, non riuscendo a distruggerlo, decide di nasconderlo. Anche Aizen ne costruisce uno proprio, incompleto.",
      en: "As captain of the Twelfth Division, Kisuke Urahara creates the Hōgyoku, the orb able to break the boundary between Soul Reapers and Hollows. He soon realises it is too dangerous and, unable to destroy it, decides to hide it. Aizen builds an incomplete one of his own as well.",
    },
    period: P.pendulum,
    arcId: 'arc-bl-turn-back-pendulum',
    locationId: 'loc-bl-division-12',
    characterIds: ['char-bl-urahara', 'char-bl-aizen'],
    mangaChapters: ['~178'],
    order: 45,
    tags: ['hogyoku', 'urahara'],
  }),
  ev({
    id: 'evt-bl-hogyoku-in-rukia',
    title: { it: 'Lo Hōgyoku nascosto in Rukia', en: 'The Hōgyoku hidden in Rukia' },
    description: {
      it: "Rimasta senza poteri, Rukia si rivolge a Urahara per un corpo artificiale. Il gigai che lui le dà non le permette di recuperare l'energia spirituale e serve a un altro scopo: dentro la sua anima Urahara ha nascosto lo Hōgyoku. È per estrarlo che Aizen manovrerà la sua condanna a morte.",
      en: "Left without her powers, Rukia turns to Urahara for an artificial body. The gigai he gives her stops her from recovering her spiritual energy and serves another purpose: Urahara has hidden the Hōgyoku inside her soul. It is to extract it that Aizen will engineer her death sentence.",
    },
    period: P.agent,
    arcId: 'arc-bl-agent',
    locationId: 'loc-bl-urahara-shop',
    characterIds: ['char-bl-rukia', 'char-bl-urahara', 'char-bl-aizen'],
    mangaChapters: ['~178'],
    order: 205,
    tags: ['hogyoku', 'urahara', 'rukia'],
  }),
];
