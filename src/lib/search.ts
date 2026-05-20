import type {
  AnimeWorld,
  SearchResult,
  WorldDataset,
} from '@/types';

/**
 * Ricerca generica con ranking semplice:
 *  - match esatto sul nome → 100
 *  - match prefisso parola sul nome → 70
 *  - match parziale sul nome → 50
 *  - match su tag → 35
 *  - match su descrizione → 20
 *
 * Risultati filtrati e ordinati per score decrescente.
 * Le funzioni sono pure: nessun side-effect, comode da usare in useMemo.
 */

function normalize(text: string): string {
  return text.toLowerCase().trim();
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
    name: string;
    description?: string;
    tags?: string[];
  },
  query: string,
): SearchResult | null {
  const nameScore = scoreText(query, candidate.name);
  const tagsScore = scoreTags(query, candidate.tags);
  const descScore =
    candidate.description !== undefined
      ? Math.min(scoreText(query, candidate.description), 20)
      : 0;
  const total = nameScore + tagsScore + descScore;
  if (total <= 0) return null;
  return { ...base, score: total };
}

/** Cerca nell'elenco dei mondi (usato in homepage). */
export function searchWorlds(
  query: string,
  worlds: AnimeWorld[],
): SearchResult[] {
  if (!query) return [];
  const out: SearchResult[] = [];
  for (const w of worlds) {
    const r = makeResult(
      {
        id: w.id,
        kind: 'world',
        title: w.title,
        subtitle: w.subtitle,
      },
      { name: w.title, description: w.description, tags: w.tags },
      query,
    );
    if (r) out.push(r);
  }
  return out.sort((a, b) => b.score - a.score);
}

/** Cerca dentro un singolo dataset (un mondo). */
export function searchDataset(
  query: string,
  dataset: WorldDataset,
): SearchResult[] {
  if (!query) return [];
  const out: SearchResult[] = [];

  for (const l of dataset.locations) {
    const r = makeResult(
      {
        id: l.id,
        kind: 'location',
        worldId: l.worldId,
        title: l.name,
        subtitle: l.type,
      },
      {
        name: `${l.name} ${l.nameLocal ?? ''}`,
        description: l.shortDescription,
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
        name: `${c.name} ${c.nameLocal ?? ''}`,
        description: c.shortDescription,
        tags: c.tags,
      },
      query,
    );
    if (r) out.push(r);
  }
  for (const f of dataset.factions) {
    const r = makeResult(
      {
        id: f.id,
        kind: 'faction',
        worldId: f.worldId,
        title: f.name,
        subtitle: f.type,
      },
      { name: f.name, description: f.description, tags: f.tags },
      query,
    );
    if (r) out.push(r);
  }
  for (const a of dataset.arcs) {
    const r = makeResult(
      {
        id: a.id,
        kind: 'arc',
        worldId: a.worldId,
        title: a.name,
        subtitle: a.saga,
      },
      { name: a.name, description: a.description, tags: a.tags },
      query,
    );
    if (r) out.push(r);
  }
  for (const e of dataset.events) {
    const r = makeResult(
      {
        id: e.id,
        kind: 'event',
        worldId: e.worldId,
        title: e.title,
        subtitle: e.period,
      },
      { name: e.title, description: e.description, tags: e.tags },
      query,
    );
    if (r) out.push(r);
  }
  for (const n of dataset.nations) {
    const r = makeResult(
      {
        id: n.id,
        kind: 'nation',
        worldId: n.worldId,
        title: n.name,
        subtitle: n.nameLocal,
      },
      { name: n.name, description: n.description, tags: n.tags },
      query,
    );
    if (r) out.push(r);
  }
  for (const ro of dataset.routes) {
    const r = makeResult(
      {
        id: ro.id,
        kind: 'route',
        worldId: ro.worldId,
        title: ro.name,
      },
      { name: ro.name, description: ro.description, tags: ro.tags },
      query,
    );
    if (r) out.push(r);
  }

  return out.sort((a, b) => b.score - a.score);
}
