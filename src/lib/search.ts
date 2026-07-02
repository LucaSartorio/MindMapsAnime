import type {
  AnimeWorld,
  SearchResult,
  SearchResultKind,
  SupportedLocale,
  WorldDataset,
} from '@/types';
import { getLocalizedText } from '@/utils/localization';
import { buildWorldGraph, getConnectedEntities, type EntityType } from '@/lib/graph';
import { entityRefLabel } from '@/lib/graphRefs';

/**
 * Ricerca generica con ranking semplice e locale-aware:
 *  - match esatto sul nome (lingua attiva o canonico) → 100
 *  - match prefisso parola sul nome → 70
 *  - match parziale sul nome → 50
 *  - match su alias / tag → 40-60
 *  - match su descrizione → 20
 *
 * Le funzioni sono pure e cercano sia nella lingua attiva sia nei nomi
 * canonici (es. "Konoha" funziona sempre, "Villaggio della Foglia" trova
 * in IT, "Hidden Leaf Village" in EN).
 */

function normalize(text: string | undefined | null): string {
  return (text ?? '').toLowerCase().trim();
}

function scoreText(query: string, text?: string): number {
  if (!text) return 0;
  const q = normalize(query);
  const t = normalize(text);
  if (!q || !t) return 0;
  if (t === q) return 100;
  if (t.split(/\s+/).some((tok) => tok.startsWith(q))) return 70;
  if (t.includes(q)) return 50;
  return 0;
}

function scoreCandidates(query: string, texts: Array<string | undefined>): number {
  let best = 0;
  for (const t of texts) {
    const s = scoreText(query, t);
    if (s > best) best = s;
  }
  return best;
}

function scoreTags(query: string, tags?: string[]): number {
  if (!tags || tags.length === 0) return 0;
  const q = normalize(query);
  for (const tag of tags) {
    const t = normalize(tag);
    if (t === q) return 60;
    if (t.includes(q)) return 35;
  }
  return 0;
}

function makeResult(
  base: Omit<SearchResult, 'score'>,
  candidate: {
    nameCandidates: Array<string | undefined>;
    descriptionCandidates?: Array<string | undefined>;
    tags?: string[];
  },
  query: string,
): SearchResult | null {
  const nameScore = scoreCandidates(query, candidate.nameCandidates);
  const tagsScore = scoreTags(query, candidate.tags);
  const descScore = candidate.descriptionCandidates
    ? Math.min(scoreCandidates(query, candidate.descriptionCandidates), 20)
    : 0;
  const total = nameScore + tagsScore + descScore;
  if (total <= 0) return null;
  return { ...base, score: total };
}

/** Cerca nell'elenco dei mondi (homepage). */
export function searchWorlds(
  query: string,
  worlds: AnimeWorld[],
  locale: SupportedLocale,
): SearchResult[] {
  if (!query) return [];
  const out: SearchResult[] = [];
  for (const w of worlds) {
    const title = w.title;
    const subtitleLocalized = getLocalizedText(w.subtitle, locale);
    const descriptionLocalized = getLocalizedText(w.description, locale);
    const r = makeResult(
      {
        id: w.id,
        kind: 'world',
        title,
        subtitle: subtitleLocalized,
      },
      {
        nameCandidates: [title, subtitleLocalized],
        descriptionCandidates: [descriptionLocalized],
        tags: w.tags,
      },
      query,
    );
    if (r) out.push(r);
  }
  return out.sort((a, b) => b.score - a.score);
}

// Mappa tipo-grafo ↔ tipo-risultato. I nodi-gruppo (race/saga) non hanno una
// scheda propria, quindi non compaiono come risultati di ricerca.
const ENTITY_TYPE_TO_KIND: Partial<Record<EntityType, SearchResultKind>> = {
  place: 'location',
  character: 'character',
  event: 'event',
  arc: 'arc',
  faction: 'faction',
  route: 'route',
  nation: 'nation',
  technique: 'jutsu',
};
const KIND_TO_ENTITY_TYPE: Partial<Record<SearchResultKind, EntityType>> = {
  location: 'place',
  character: 'character',
  event: 'event',
  arc: 'arc',
  faction: 'faction',
  route: 'route',
  nation: 'nation',
  jutsu: 'technique',
};

/**
 * Espande la ricerca alle RELAZIONI: date le coordinate del match in cima
 * (kind+id), ritorna le entità collegate nel knowledge graph come `SearchResult`
 * marcati `relatedTo`. Rende la ⌘K anche un esploratore di relazioni, in modo
 * world-agnostic (nessun termine hardcoded, funziona per ogni dataset).
 */
export function relatedResults(
  dataset: WorldDataset,
  kind: SearchResultKind,
  id: string,
  locale: SupportedLocale,
  relatedToTitle: string,
  limit = 6,
): SearchResult[] {
  const type = KIND_TO_ENTITY_TYPE[kind];
  if (!type) return [];
  const graph = buildWorldGraph(dataset);
  const out: SearchResult[] = [];
  for (const ref of getConnectedEntities(graph, { type, id })) {
    const refKind = ENTITY_TYPE_TO_KIND[ref.type];
    if (!refKind) continue;
    out.push({
      id: ref.id,
      kind: refKind,
      worldId: dataset.world.id,
      title: entityRefLabel(dataset, ref, locale),
      score: 0,
      relatedTo: relatedToTitle,
    });
    if (out.length >= limit) break;
  }
  return out;
}

/** Cerca dentro un singolo dataset (un mondo) cercando in IT/EN/canonico. */
export function searchDataset(
  query: string,
  dataset: WorldDataset,
  locale: SupportedLocale,
): SearchResult[] {
  if (!query) return [];
  const out: SearchResult[] = [];

  for (const l of dataset.locations) {
    const localized = getLocalizedText(l.localizedName, locale);
    const r = makeResult(
      {
        id: l.id,
        kind: 'location',
        worldId: l.worldId,
        title: localized || l.name,
        subtitle: l.type,
      },
      {
        nameCandidates: [
          l.name,
          localized,
          getLocalizedText(l.localizedName, 'it'),
          getLocalizedText(l.localizedName, 'en'),
          l.nameLocal,
        ],
        descriptionCandidates: [
          getLocalizedText(l.shortDescription, locale),
        ],
        tags: l.tags,
      },
      query,
    );
    if (r) out.push(r);
  }
  for (const c of dataset.characters) {
    const r = makeResult(
      {
        id: c.id,
        kind: 'character',
        worldId: c.worldId,
        title: c.name,
        subtitle: c.rank,
      },
      {
        nameCandidates: [c.name, c.nameLocal, ...(c.aliases ?? [])],
        descriptionCandidates: [getLocalizedText(c.shortDescription, locale)],
        tags: c.tags,
      },
      query,
    );
    if (r) out.push(r);
  }
  for (const f of dataset.factions) {
    const localized = getLocalizedText(f.localizedName, locale);
    const r = makeResult(
      {
        id: f.id,
        kind: 'faction',
        worldId: f.worldId,
        title: localized || f.name,
        subtitle: f.type,
      },
      {
        nameCandidates: [f.name, localized, f.nameLocal, f.japaneseName],
        descriptionCandidates: [getLocalizedText(f.description, locale)],
        tags: f.tags,
      },
      query,
    );
    if (r) out.push(r);
  }
  for (const a of dataset.arcs) {
    const localized = getLocalizedText(a.localizedName, locale);
    const r = makeResult(
      {
        id: a.id,
        kind: 'arc',
        worldId: a.worldId,
        title: localized || a.name,
        subtitle: getLocalizedText(a.saga, locale),
      },
      {
        nameCandidates: [a.name, localized],
        descriptionCandidates: [getLocalizedText(a.description, locale)],
        tags: a.tags,
      },
      query,
    );
    if (r) out.push(r);
  }
  for (const e of dataset.events) {
    const titleLocalized = getLocalizedText(e.title, locale);
    const r = makeResult(
      {
        id: e.id,
        kind: 'event',
        worldId: e.worldId,
        title: titleLocalized,
        subtitle: getLocalizedText(e.period, locale),
      },
      {
        nameCandidates: [
          getLocalizedText(e.title, 'it'),
          getLocalizedText(e.title, 'en'),
        ],
        descriptionCandidates: [getLocalizedText(e.description, locale)],
        tags: e.tags,
      },
      query,
    );
    if (r) out.push(r);
  }
  for (const n of dataset.nations) {
    const localized = getLocalizedText(n.localizedName, locale);
    const r = makeResult(
      {
        id: n.id,
        kind: 'nation',
        worldId: n.worldId,
        title: localized || n.name,
        subtitle: n.nameLocal,
      },
      {
        nameCandidates: [n.name, localized, n.nameLocal, n.japaneseName],
        descriptionCandidates: [getLocalizedText(n.description, locale)],
        tags: n.tags,
      },
      query,
    );
    if (r) out.push(r);
  }
  for (const ro of dataset.routes) {
    const localized = getLocalizedText(ro.localizedName, locale);
    const r = makeResult(
      {
        id: ro.id,
        kind: 'route',
        worldId: ro.worldId,
        title: localized || ro.name,
      },
      {
        nameCandidates: [ro.name, localized],
        descriptionCandidates: [getLocalizedText(ro.description, locale)],
        tags: ro.tags,
      },
      query,
    );
    if (r) out.push(r);
  }
  for (const j of dataset.jutsu ?? []) {
    const localized = getLocalizedText(j.localizedName, locale);
    const r = makeResult(
      {
        id: j.id,
        kind: 'jutsu',
        worldId: j.worldId,
        title: localized || j.name,
        subtitle: j.type,
      },
      {
        nameCandidates: [
          j.name,
          localized,
          getLocalizedText(j.localizedName, 'it'),
          getLocalizedText(j.localizedName, 'en'),
          j.japaneseName,
        ],
        descriptionCandidates: [getLocalizedText(j.shortDescription, locale)],
        tags: j.tags,
      },
      query,
    );
    if (r) out.push(r);
  }
  for (const b of dataset.boundaries ?? []) {
    const localized = getLocalizedText(b.localizedName, locale);
    const r = makeResult(
      {
        id: b.id,
        kind: 'boundary',
        worldId: b.worldId,
        title: localized || b.name,
        subtitle: b.type.replace('_', ' '),
      },
      {
        nameCandidates: [b.name, localized, b.japaneseName],
        descriptionCandidates: [
          getLocalizedText(b.descriptionShort, locale),
        ],
        tags: b.tags,
      },
      query,
    );
    if (r) out.push(r);
  }

  return out.sort((a, b) => b.score - a.score);
}
