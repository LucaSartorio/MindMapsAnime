import type { Route, TimelineEvent, WorldDataset } from '@/types';
import { getEntityDisplayName, getLocalizedText } from '@/utils/localization';

/**
 * Percorsi dei personaggi derivati dagli eventi. Ogni personaggio principale o
 * di primo piano che non è protagonista di un percorso scritto a mano ne riceve
 * uno: i luoghi dei suoi eventi canon, in ordine cronologico (le tappe
 * consecutive nello stesso luogo si fondono). Servono almeno 3 tappe diverse.
 * Nessun dato duplicato: tappe, archi ed eventi restano quelli del dataset.
 */
/** Tag che marca un percorso derivato (vedi `isDerivedJourney`). */
export const DERIVED_JOURNEY_TAG = 'cammino-derivato';

/**
 * Un percorso derivato è una PROIEZIONE della pagina del suo protagonista
 * (stessi eventi e luoghi, in ordine): la pagina resta utile per seguire il
 * cammino sulla mappa, ma per Search la risorsa canonica è il personaggio
 * (`canonicalTargetPath` in `src/seo/metadata.ts`).
 */
export function isDerivedJourney(route: Route): boolean {
  return route.tags?.includes(DERIVED_JOURNEY_TAG) ?? false;
}

const COLORS = ['#f59e0b', '#38bdf8', '#a78bfa', '#34d399', '#f472b6', '#fb7185', '#facc15', '#60a5fa'];
const MIN_STOPS = 3;

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function withCharacterJourneys<T extends WorldDataset>(dataset: T): T {
  const covered = new Set(dataset.routes.flatMap((r) => [...r.protagonistCharacterIds, ...(r.primaryCharacterIds ?? [])]));
  const locById = new Map(dataset.locations.map((l) => [l.id, l]));
  const events = [...dataset.events].filter((e) => e.canon === 'canon').sort((a, b) => a.order - b.order);
  const extra: Route[] = [];
  for (const c of dataset.characters) {
    if (c.importance !== 'main' && c.importance !== 'major') continue;
    if (covered.has(c.id)) continue;
    const mine = events.filter((e) => e.characterIds?.includes(c.id) && e.locationId && locById.has(e.locationId));
    const stops: TimelineEvent[] = [];
    for (const e of mine) if (stops[stops.length - 1]?.locationId !== e.locationId) stops.push(e);
    if (new Set(stops.map((e) => e.locationId)).size < MIN_STOPS) continue;
    const short = c.id.replace(/^char-([a-z]+-)?/, '');
    const nameIt = getEntityDisplayName(c, 'it');
    const nameEn = getEntityDisplayName(c, 'en');
    const place = (e: TimelineEvent, l: 'it' | 'en') => getEntityDisplayName(locById.get(e.locationId!)!, l);
    const first = stops[0];
    const last = stops[stops.length - 1];
    extra.push({
      id: `route-journey-${short}`,
      slug: `${short}-journey`,
      worldId: dataset.world.id,
      type: 'character',
      name: `${nameEn}'s journey`,
      localizedName: { it: `Il cammino di ${nameIt}`, en: `${nameEn}'s journey` },
      group: { it: 'Cammini dei personaggi', en: 'Character journeys' },
      description: {
        it: `I luoghi della storia di ${nameIt} in ordine cronologico: ${stops.length} tappe, da ${place(first, 'it')} a ${place(last, 'it')}.`,
        en: `The places of ${nameEn}'s story in chronological order: ${stops.length} stops, from ${place(first, 'en')} to ${place(last, 'en')}.`,
      },
      protagonistCharacterIds: [c.id],
      relatedEventIds: stops.map((e) => e.id),
      relatedArcIds: [...new Set(stops.map((e) => e.arcId).filter((a): a is string => !!a))],
      steps: stops.map((e, i) => ({
        order: i + 1,
        locationId: e.locationId!,
        eventId: e.id,
        ...(e.arcId ? { arcId: e.arcId } : {}),
        label: { it: getLocalizedText(e.title, 'it'), en: getLocalizedText(e.title, 'en') },
      })),
      color: COLORS[hash(c.id) % COLORS.length],
      lineStyle: 'dashed',
      canonStatus: 'canon',
      referenceStatus: 'verified',
      tags: [DERIVED_JOURNEY_TAG],
    });
  }
  return { ...dataset, routes: [...dataset.routes, ...extra] };
}
