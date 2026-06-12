import type { Faction } from '@/types';

/**
 * Voci enciclopediche su strumenti e tecnologie del mondo di One Piece
 * (navigazione, comunicazione, materiali). Sono inserite tra le «organizzazioni»
 * come schede a sé, taggate `concetto`, perché il mondo non ha una categoria
 * dedicata agli oggetti.
 */
const K = (
  id: string, name: string, nit: string, nen: string,
  it: string, en: string, lit: string, len: string,
  characterIds: string[] | undefined, locationIds: string[] | undefined, tags: string[],
): Faction => ({
  id, worldId: 'world-onepiece', type: 'concept', name,
  localizedName: { it: nit, en: nen },
  description: { it, en },
  longDescription: { it: lit, en: len },
  ...(characterIds ? { characterIds } : {}),
  ...(locationIds ? { locationIds } : {}),
  canonStatus: 'canon', referenceStatus: 'verified', tags: ['concetto', ...tags],
});

export const onepieceFactionsConcepts: Faction[] = [
  K('concept-op-den-den-mushi', 'Den Den Mushi', 'Den Den Mushi (Lumacofono)', 'Den Den Mushi (Snail-phone)',
    "Lumache speciali usate come telefoni: trasmettono la voce a distanza imitando l’espressione di chi parla.",
    "Special snails used as telephones: they transmit voice over distance, mimicking the speaker's expression.",
    "Esistono in molte varianti: il Baby Den Den Mushi (portatile), il Den Den Mushi Nero (intercettazioni), il Den Den Mushi Dorato (riservato ai Buster Call) e il Visual Den Den Mushi (videochiamata). Sono la spina dorsale delle comunicazioni del mondo.",
    "They come in many variants: the Baby Den Den Mushi (portable), the Black Den Den Mushi (wiretapping), the Golden Den Den Mushi (reserved for Buster Calls) and the Visual Den Den Mushi (video calls). They are the backbone of the world's communications.",
    undefined, undefined, ['tecnologia', 'comunicazione']),
  K('concept-op-log-pose', 'Log Pose', 'Log Pose & Eternal Pose', 'Log Pose & Eternal Pose',
    "La bussola della Rotta Maggiore: registra il magnetismo di un’isola e punta alla successiva.",
    "The Grand Line compass: it records an island's magnetism and points to the next.",
    "Sulla Rotta Maggiore le bussole normali sono inutili: ogni isola ha un proprio campo magnetico. Il Log Pose si «carica» su un’isola e indica la rotta verso la prossima; l’Eternal Pose, invece, resta fissato per sempre su una singola isola.",
    "On the Grand Line ordinary compasses are useless: each island has its own magnetic field. The Log Pose 'sets' to an island and points to the next; the Eternal Pose, instead, stays locked forever onto a single island.",
    ['char-op-nami'], undefined, ['navigazione', 'rotta-maggiore']),
  K('concept-op-vivre-card', 'Vivre Card', 'Vivre Card (Carta della Vita)', 'Vivre Card',
    "Un frammento di carta ricavato da un’unghia che indica la posizione — e lo stato di salute — del suo proprietario.",
    "A scrap of paper made from a fingernail that points to its owner's location — and shows their state of health.",
    "Si consuma se il proprietario è in pericolo e si rigenera quando guarisce; punta sempre verso di lui, ovunque sia. Permette a chi la possiede di ritrovare una persona — o un’isola — attraverso i mari.",
    "It burns away when its owner is in danger and regrows as they recover; it always points toward them, wherever they are. It lets the holder find a person — or an island — across the seas.",
    undefined, undefined, ['navigazione', 'oggetto']),
  K('concept-op-kairoseki', 'Kairoseki', 'Kairoseki (Pietra di Mare)', 'Seastone (Kairoseki)',
    "Pietra che emana la stessa energia del mare: neutralizza i poteri dei Frutti del Diavolo al contatto.",
    "A stone that emits the same energy as the sea: it nullifies Devil Fruit powers on contact.",
    "Rara e preziosa, la pietra di mare indebolisce e immobilizza gli utenti di Frutti del Diavolo come l’acqua stessa. Se ne fanno manette, sbarre delle prigioni (Impel Down), proiettili e perfino il rivestimento delle navi della Marina.",
    "Rare and precious, Seastone weakens and immobilizes Devil Fruit users like the sea itself. It is made into handcuffs, prison bars (Impel Down), bullets and even the hull-coating of Marine ships.",
    undefined, ['loc-op-impel-down'], ['materiale', 'frutti-del-diavolo']),
];
