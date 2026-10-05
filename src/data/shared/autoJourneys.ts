import type { Route, TimelineEvent, WorldDataset } from '@/types';
import type { SupportedLocale } from '@/types/i18n';
import { getEntityDisplayName, getLocalizedText } from '@/utils/localization';

/**
 * Percorsi dei personaggi derivati dagli eventi. Ogni personaggio principale o
 * di primo piano che non è protagonista di un percorso scritto a mano ne riceve
 * uno: i luoghi dei suoi eventi canon, in ordine cronologico (le tappe
 * consecutive nello stesso luogo si fondono). Servono almeno 3 tappe diverse.
 * Nessun dato duplicato: tappe, archi ed eventi restano quelli del dataset.
 */
const COLORS = ['#f59e0b', '#38bdf8', '#a78bfa', '#34d399', '#f472b6', '#fb7185', '#facc15', '#60a5fa'];
const MIN_STOPS = 3;
/** Tag dei cammini derivati (esclusi dagli overlay di traduzione: si rigenerano). */
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

/**
 * Testi dei cammini derivati per lingua. it/en sono generati con il dataset; le
 * lingue degli overlay (`src/data/shared/translations.ts`) li ricevono da
 * `localizeCharacterJourneys` dopo che nomi e titoli sono stati tradotti.
 */
interface JourneyText {
  name: (who: string) => string;
  group: string;
  description: (who: string, stops: number, from: string, to: string) => string;
}
const JOURNEY_TEXT: Partial<Record<SupportedLocale, JourneyText>> = {
  it: {
    name: (w) => `Il cammino di ${w}`,
    group: 'Cammini dei personaggi',
    description: (w, n, a, b) => `I luoghi della storia di ${w} in ordine cronologico: ${n} tappe, da ${a} a ${b}.`,
  },
  en: {
    name: (w) => `${w}'s journey`,
    group: 'Character journeys',
    description: (w, n, a, b) => `The places of ${w}'s story in chronological order: ${n} stops, from ${a} to ${b}.`,
  },
  es: {
    name: (w) => `El camino de ${w}`,
    group: 'Caminos de los personajes',
    description: (w, n, a, b) => `Los lugares de la historia de ${w} en orden cronológico: ${n} etapas, de ${a} a ${b}.`,
  },
};

/** Riempie in `locale` i testi di un cammino derivato (in place). */
function fillJourney(route: Route, dataset: WorldDataset, locale: SupportedLocale): void {
  const tx = JOURNEY_TEXT[locale];
  if (!tx) return;
  const who = getEntityDisplayName(dataset.characters.find((c) => c.id === route.protagonistCharacterIds[0]), locale);
  const place = (id: string) => getEntityDisplayName(dataset.locations.find((l) => l.id === id), locale);
  const events = new Map(dataset.events.map((e) => [e.id, e]));
  const first = route.steps[0];
  const last = route.steps[route.steps.length - 1];
  const set = (v: unknown, text: string) => {
    if (v && typeof v === 'object') (v as Partial<Record<SupportedLocale, string>>)[locale] = text;
  };
  set(route.localizedName, tx.name(who));
  set(route.group, tx.group);
  set(route.description, tx.description(who, route.steps.length, place(first.locationId), place(last.locationId)));
  for (const step of route.steps) {
    const ev = step.eventId ? events.get(step.eventId) : undefined;
    if (ev) set(step.label, getLocalizedText(ev.title, locale));
  }
}

/** Rigenera nella lingua di un overlay appena applicato i cammini derivati. */
export function localizeCharacterJourneys(dataset: WorldDataset, locale: SupportedLocale): void {
  for (const r of dataset.routes) if (isDerivedJourney(r)) fillJourney(r, dataset, locale);
}

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
    const route: Route = {
      id: `route-journey-${short}`,
      slug: `${short}-journey`,
      worldId: dataset.world.id,
      type: 'character',
      name: `${getEntityDisplayName(c, 'en')}'s journey`,
      localizedName: { it: '', en: '' },
      group: { it: '', en: '' },
      description: { it: '', en: '' },
      protagonistCharacterIds: [c.id],
      relatedEventIds: stops.map((e) => e.id),
      relatedArcIds: [...new Set(stops.map((e) => e.arcId).filter((a): a is string => !!a))],
      steps: stops.map((e, i) => ({
        order: i + 1,
        locationId: e.locationId!,
        eventId: e.id,
        ...(e.arcId ? { arcId: e.arcId } : {}),
        label: { it: '', en: '' },
      })),
      color: COLORS[hash(c.id) % COLORS.length],
      lineStyle: 'dashed',
      canonStatus: 'canon',
      referenceStatus: 'verified',
      tags: [DERIVED_JOURNEY_TAG],
    };
    // Lingue sorgente subito; le altre quando arriva il loro overlay.
    fillJourney(route, dataset, 'it');
    fillJourney(route, dataset, 'en');
    extra.push(route);
  }
  return { ...dataset, routes: [...dataset.routes, ...extra] };
}
