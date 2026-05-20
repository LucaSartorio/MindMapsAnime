import type {
  Character,
  Location,
  Route,
  StoryArc,
  TimelineEvent,
  WorldDataset,
} from '@/types';

/**
 * Funzioni utility puramente derivative sui collegamenti incrociati
 * fra entità del dataset.
 *
 * Non duplicano logica nei componenti: ognuna è una pura query.
 * Da usare con `useMemo` se ripetute in render frequenti.
 */

/* ----------------------- per arco ----------------------- */

export function charactersByArc(
  dataset: WorldDataset,
  arcId: string,
): Character[] {
  const arc = dataset.arcs.find((a) => a.id === arcId);
  const idsFromArc = new Set(arc?.characterIds ?? []);
  const idsFromCharacters = new Set(
    dataset.characters
      .filter((c) => (c.arcIds ?? []).includes(arcId))
      .map((c) => c.id),
  );
  const all = new Set<string>([...idsFromArc, ...idsFromCharacters]);
  return dataset.characters.filter((c) => all.has(c.id));
}

export function eventsByArc(
  dataset: WorldDataset,
  arcId: string,
): TimelineEvent[] {
  return dataset.events
    .filter((e) => e.arcId === arcId)
    .sort((a, b) => a.order - b.order);
}

export function locationsByArc(
  dataset: WorldDataset,
  arcId: string,
): Location[] {
  const arc = dataset.arcs.find((a) => a.id === arcId);
  const ids = new Set(arc?.locationIds ?? []);
  // Includi anche luoghi dichiarati dagli eventi/route di questo arco.
  for (const e of eventsByArc(dataset, arcId)) {
    if (e.locationId) ids.add(e.locationId);
    for (const lid of e.locationIds ?? []) ids.add(lid);
  }
  return dataset.locations.filter((l) => ids.has(l.id));
}

export function routesByArc(dataset: WorldDataset, arcId: string): Route[] {
  return dataset.routes.filter(
    (r) =>
      r.arcId === arcId ||
      (r.relatedArcIds ?? []).includes(arcId),
  );
}

/* ----------------------- per personaggio ----------------------- */

export function eventsByCharacter(
  dataset: WorldDataset,
  characterId: string,
): TimelineEvent[] {
  return dataset.events
    .filter((e) => (e.characterIds ?? []).includes(characterId))
    .sort((a, b) => a.order - b.order);
}

export function routesByCharacter(
  dataset: WorldDataset,
  characterId: string,
): Route[] {
  return dataset.routes.filter(
    (r) =>
      r.protagonistCharacterIds.includes(characterId) ||
      (r.primaryCharacterIds ?? []).includes(characterId) ||
      (r.relatedCharacterIds ?? []).includes(characterId),
  );
}

export function arcsByCharacter(
  dataset: WorldDataset,
  characterId: string,
): StoryArc[] {
  const fromCharacter = new Set(
    dataset.characters.find((c) => c.id === characterId)?.arcIds ?? [],
  );
  for (const a of dataset.arcs) {
    if ((a.characterIds ?? []).includes(characterId)) fromCharacter.add(a.id);
  }
  return dataset.arcs
    .filter((a) => fromCharacter.has(a.id))
    .sort((a, b) => a.order - b.order);
}

/* ----------------------- per location ----------------------- */

export function arcsByLocation(
  dataset: WorldDataset,
  locationId: string,
): StoryArc[] {
  return dataset.arcs.filter(
    (a) => (a.locationIds ?? []).includes(locationId),
  );
}

export function eventsByLocation(
  dataset: WorldDataset,
  locationId: string,
): TimelineEvent[] {
  return dataset.events
    .filter(
      (e) =>
        e.locationId === locationId ||
        (e.locationIds ?? []).includes(locationId),
    )
    .sort((a, b) => a.order - b.order);
}

export function routesByLocation(
  dataset: WorldDataset,
  locationId: string,
): Route[] {
  return dataset.routes.filter((r) =>
    r.steps.some((s) => s.locationId === locationId),
  );
}

/* ----------------------- per faction / clan ----------------------- */

export function locationsByFaction(
  dataset: WorldDataset,
  factionId: string,
): Location[] {
  const f = dataset.factions.find((x) => x.id === factionId);
  const ids = new Set(f?.locationIds ?? []);
  // Aggiungi luoghi dei membri se utili
  for (const c of dataset.characters) {
    if ((c.factionIds ?? []).includes(factionId) && c.villageLocationId) {
      ids.add(c.villageLocationId);
    }
  }
  return dataset.locations.filter((l) => ids.has(l.id));
}

export function membersOfFaction(
  dataset: WorldDataset,
  factionId: string,
): Character[] {
  const f = dataset.factions.find((x) => x.id === factionId);
  const declared = new Set(f?.characterIds ?? []);
  const inferred = dataset.characters.filter(
    (c) =>
      (c.factionIds ?? []).includes(factionId) ||
      (c.clanIds ?? []).includes(factionId),
  );
  for (const c of inferred) declared.add(c.id);
  return dataset.characters.filter((c) => declared.has(c.id));
}

/* ----------------------- entità orfane / qualità ----------------------- */

/** Personaggi senza clan, faction, team o arco assegnato. */
export function findOrphanCharacters(dataset: WorldDataset): Character[] {
  return dataset.characters.filter(
    (c) =>
      (c.clanIds ?? []).length === 0 &&
      (c.factionIds ?? []).length === 0 &&
      (c.teamIds ?? []).length === 0 &&
      (c.arcIds ?? []).length === 0,
  );
}

/** Location mai citata in eventi, archi o route. */
export function findOrphanLocations(dataset: WorldDataset): Location[] {
  const used = new Set<string>();
  for (const e of dataset.events) {
    if (e.locationId) used.add(e.locationId);
    for (const id of e.locationIds ?? []) used.add(id);
  }
  for (const a of dataset.arcs) {
    for (const id of a.locationIds ?? []) used.add(id);
  }
  for (const r of dataset.routes) {
    for (const s of r.steps) used.add(s.locationId);
  }
  return dataset.locations.filter((l) => !used.has(l.id));
}
