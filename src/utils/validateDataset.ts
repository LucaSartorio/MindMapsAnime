import type { WorldDataset } from '@/types';

/**
 * Validatore dataset.
 *
 * Esegue una serie di controlli di integrità sui dati di un mondo:
 *  - id duplicati
 *  - riferimenti a id inesistenti
 *  - record minimi mancanti (nome, order)
 *  - route con meno di 2 step
 *  - step con locationId inesistente
 *  - eventi → archi inesistenti
 *  - personaggi → clan/faction/team inesistenti
 *  - location → eventi/arc inesistenti
 *  - entità senza canonStatus/referenceStatus
 *
 * Il validatore non muta nulla. Restituisce errori e warning.
 */

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  severity: ValidationSeverity;
  code: string;
  entity: string;
  id?: string;
  message: string;
}

export interface ValidationReport {
  issues: ValidationIssue[];
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  hasErrors: boolean;
  hasWarnings: boolean;
}

function addIssue(
  list: ValidationIssue[],
  severity: ValidationSeverity,
  code: string,
  entity: string,
  message: string,
  id?: string,
) {
  list.push({ severity, code, entity, id, message });
}

function checkUnique<T extends { id: string }>(
  items: T[] | undefined,
  entity: string,
  out: ValidationIssue[],
) {
  if (!items) return;
  const seen = new Set<string>();
  for (const it of items) {
    if (!it.id) {
      addIssue(out, 'error', 'missing_id', entity, `${entity} senza id`);
      continue;
    }
    if (seen.has(it.id)) {
      addIssue(
        out,
        'error',
        'duplicate_id',
        entity,
        `${entity} id duplicato: ${it.id}`,
        it.id,
      );
    }
    seen.add(it.id);
  }
}

function checkRef(
  refIds: string[] | undefined,
  pool: Set<string>,
  entity: string,
  field: string,
  ownerId: string,
  out: ValidationIssue[],
) {
  if (!refIds) return;
  for (const id of refIds) {
    if (!pool.has(id)) {
      addIssue(
        out,
        'error',
        'broken_ref',
        entity,
        `${entity} ${ownerId}.${field} riferisce id inesistente: ${id}`,
        ownerId,
      );
    }
  }
}

function checkSingleRef(
  refId: string | undefined,
  pool: Set<string>,
  entity: string,
  field: string,
  ownerId: string,
  out: ValidationIssue[],
) {
  if (!refId) return;
  if (!pool.has(refId)) {
    addIssue(
      out,
      'error',
      'broken_ref',
      entity,
      `${entity} ${ownerId}.${field} riferisce id inesistente: ${refId}`,
      ownerId,
    );
  }
}

export function validateDataset(dataset: WorldDataset): ValidationReport {
  const issues: ValidationIssue[] = [];

  // Unicità
  checkUnique(dataset.characters, 'character', issues);
  checkUnique(dataset.factions, 'faction', issues);
  checkUnique(dataset.teams, 'team', issues);
  checkUnique(dataset.arcs, 'arc', issues);
  checkUnique(dataset.events, 'event', issues);
  checkUnique(dataset.locations, 'location', issues);
  checkUnique(dataset.routes, 'route', issues);
  checkUnique(dataset.nations, 'nation', issues);
  checkUnique(dataset.boundaries, 'boundary', issues);
  checkUnique(dataset.mapLevels, 'mapLevel', issues);
  checkUnique(dataset.assets, 'asset', issues);

  // Pool di id validi
  const cId = new Set(dataset.characters.map((x) => x.id));
  const fId = new Set(dataset.factions.map((x) => x.id));
  const tId = new Set((dataset.teams ?? []).map((x) => x.id));
  const aId = new Set(dataset.arcs.map((x) => x.id));
  const eId = new Set(dataset.events.map((x) => x.id));
  const lId = new Set(dataset.locations.map((x) => x.id));
  const rId = new Set(dataset.routes.map((x) => x.id));
  const nId = new Set(dataset.nations.map((x) => x.id));
  const bId = new Set((dataset.boundaries ?? []).map((x) => x.id));
  const mlId = new Set(dataset.mapLevels.map((x) => x.id));

  /* ---------- Characters ---------- */
  for (const c of dataset.characters) {
    if (!c.name)
      addIssue(issues, 'error', 'missing_name', 'character', `Character ${c.id} senza nome`, c.id);
    if (!c.canonStatus)
      addIssue(issues, 'warning', 'missing_canon', 'character', `Character ${c.id} senza canonStatus`, c.id);
    if (!c.referenceStatus)
      addIssue(issues, 'warning', 'missing_reference', 'character', `Character ${c.id} senza referenceStatus`, c.id);
    checkSingleRef(c.villageLocationId, lId, 'character', 'villageLocationId', c.id, issues);
    checkSingleRef(c.nationId, nId, 'character', 'nationId', c.id, issues);
    checkRef(c.clanIds, fId, 'character', 'clanIds', c.id, issues);
    checkRef(c.factionIds, fId, 'character', 'factionIds', c.id, issues);
    checkRef(c.teamIds, tId, 'character', 'teamIds', c.id, issues);
    checkRef(c.arcIds, aId, 'character', 'arcIds', c.id, issues);
    checkRef(c.eventIds, eId, 'character', 'eventIds', c.id, issues);
    checkRef(c.locationIds, lId, 'character', 'locationIds', c.id, issues);
    checkRef(c.routeIds, rId, 'character', 'routeIds', c.id, issues);
    checkRef(c.teachers, cId, 'character', 'teachers', c.id, issues);
    checkRef(c.students, cId, 'character', 'students', c.id, issues);
    checkRef(c.family, cId, 'character', 'family', c.id, issues);
    checkRef(c.allies, cId, 'character', 'allies', c.id, issues);
    checkRef(c.enemies, cId, 'character', 'enemies', c.id, issues);
    if (c.relationships) {
      for (const rel of c.relationships) {
        checkSingleRef(rel.targetCharacterId, cId, 'character', 'relationships.targetCharacterId', c.id, issues);
      }
    }
  }

  /* ---------- Factions ---------- */
  for (const f of dataset.factions) {
    if (!f.name)
      addIssue(issues, 'error', 'missing_name', 'faction', `Faction ${f.id} senza nome`, f.id);
    if (!f.canonStatus)
      addIssue(issues, 'warning', 'missing_canon', 'faction', `Faction ${f.id} senza canonStatus`, f.id);
    checkSingleRef(f.villageLocationId, lId, 'faction', 'villageLocationId', f.id, issues);
    checkSingleRef(f.nationId, nId, 'faction', 'nationId', f.id, issues);
    checkRef(f.leaderIds, cId, 'faction', 'leaderIds', f.id, issues);
    checkRef(f.characterIds, cId, 'faction', 'characterIds', f.id, issues);
    checkRef(f.locationIds, lId, 'faction', 'locationIds', f.id, issues);
    checkRef(f.arcIds, aId, 'faction', 'arcIds', f.id, issues);
    checkRef(f.eventIds, eId, 'faction', 'eventIds', f.id, issues);
    checkRef(f.routeIds, rId, 'faction', 'routeIds', f.id, issues);
  }

  /* ---------- Teams ---------- */
  for (const t of dataset.teams ?? []) {
    if (!t.name)
      addIssue(issues, 'error', 'missing_name', 'team', `Team ${t.id} senza nome`, t.id);
    checkSingleRef(t.leaderId, cId, 'team', 'leaderId', t.id, issues);
    checkRef(t.memberIds, cId, 'team', 'memberIds', t.id, issues);
    checkSingleRef(t.villageLocationId, lId, 'team', 'villageLocationId', t.id, issues);
    checkSingleRef(t.nationId, nId, 'team', 'nationId', t.id, issues);
    checkRef(t.arcIds, aId, 'team', 'arcIds', t.id, issues);
    checkRef(t.eventIds, eId, 'team', 'eventIds', t.id, issues);
    checkRef(t.routeIds, rId, 'team', 'routeIds', t.id, issues);
  }

  /* ---------- Arcs ---------- */
  for (const a of dataset.arcs) {
    if (!a.name)
      addIssue(issues, 'error', 'missing_name', 'arc', `Arc ${a.id} senza nome`, a.id);
    if (a.order === undefined || a.order === null)
      addIssue(issues, 'error', 'missing_order', 'arc', `Arc ${a.id} senza order`, a.id);
    if (!a.canon)
      addIssue(issues, 'warning', 'missing_canon', 'arc', `Arc ${a.id} senza canon`, a.id);
    checkRef(a.locationIds, lId, 'arc', 'locationIds', a.id, issues);
    checkRef(a.characterIds, cId, 'arc', 'characterIds', a.id, issues);
    checkRef(a.factionIds, fId, 'arc', 'factionIds', a.id, issues);
    checkRef(a.eventIds, eId, 'arc', 'eventIds', a.id, issues);
    checkRef(a.routeIds, rId, 'arc', 'routeIds', a.id, issues);
    checkRef(a.nationIds, nId, 'arc', 'nationIds', a.id, issues);
    checkRef(a.boundaryIds, bId, 'arc', 'boundaryIds', a.id, issues);
  }

  /* ---------- Events ---------- */
  for (const e of dataset.events) {
    if (!e.title)
      addIssue(issues, 'error', 'missing_name', 'event', `Event ${e.id} senza titolo`, e.id);
    if (e.order === undefined || e.order === null)
      addIssue(issues, 'error', 'missing_order', 'event', `Event ${e.id} senza order`, e.id);
    if (!e.canon)
      addIssue(issues, 'warning', 'missing_canon', 'event', `Event ${e.id} senza canon`, e.id);
    if (!e.referenceStatus)
      addIssue(issues, 'warning', 'missing_reference', 'event', `Event ${e.id} senza referenceStatus`, e.id);
    checkSingleRef(e.arcId, aId, 'event', 'arcId', e.id, issues);
    checkSingleRef(e.locationId, lId, 'event', 'locationId', e.id, issues);
    checkRef(e.locationIds, lId, 'event', 'locationIds', e.id, issues);
    checkRef(e.boundaryIds, bId, 'event', 'boundaryIds', e.id, issues);
    checkRef(e.nationIds, nId, 'event', 'nationIds', e.id, issues);
    checkRef(e.characterIds, cId, 'event', 'characterIds', e.id, issues);
    checkRef(e.clanIds, fId, 'event', 'clanIds', e.id, issues);
    checkRef(e.factionIds, fId, 'event', 'factionIds', e.id, issues);
    checkRef(e.routeIds, rId, 'event', 'routeIds', e.id, issues);
  }

  /* ---------- Locations ---------- */
  const asId = new Set(dataset.assets.map((x) => x.id));
  for (const l of dataset.locations) {
    if (!l.name)
      addIssue(issues, 'error', 'missing_name', 'location', `Location ${l.id} senza nome`, l.id);
    if (!mlId.has(l.mapLevelId))
      addIssue(issues, 'error', 'broken_ref', 'location', `Location ${l.id} mapLevelId inesistente: ${l.mapLevelId}`, l.id);
    // Coordinate finite e plausibili
    if (!Number.isFinite(l.x) || !Number.isFinite(l.y))
      addIssue(issues, 'error', 'bad_coordinates', 'location', `Location ${l.id} coordinate non valide (${l.x},${l.y})`, l.id);
    checkSingleRef(l.nationId, nId, 'location', 'nationId', l.id, issues);
    checkSingleRef(l.boundaryId, bId, 'location', 'boundaryId', l.id, issues);
    checkSingleRef(l.subMapLevelId, mlId, 'location', 'subMapLevelId', l.id, issues);
    checkRef(l.clanIds, fId, 'location', 'clanIds', l.id, issues);
    checkRef(l.characterIds, cId, 'location', 'characterIds', l.id, issues);
    checkRef(l.eventIds, eId, 'location', 'eventIds', l.id, issues);
    checkRef(l.arcIds, aId, 'location', 'arcIds', l.id, issues);
    checkRef(l.assetIds, asId, 'location', 'assetIds', l.id, issues);
  }

  /* ---------- Map levels ---------- */
  for (const ml of dataset.mapLevels) {
    if (ml.parentLevelId && !mlId.has(ml.parentLevelId))
      addIssue(issues, 'error', 'broken_ref', 'mapLevel', `MapLevel ${ml.id} parentLevelId inesistente: ${ml.parentLevelId}`, ml.id);
    if (ml.triggerLocationId && !lId.has(ml.triggerLocationId))
      addIssue(issues, 'error', 'broken_ref', 'mapLevel', `MapLevel ${ml.id} triggerLocationId inesistente: ${ml.triggerLocationId}`, ml.id);
    if (ml.backgroundAssetId && !asId.has(ml.backgroundAssetId))
      addIssue(issues, 'warning', 'broken_ref', 'mapLevel', `MapLevel ${ml.id} backgroundAssetId inesistente: ${ml.backgroundAssetId}`, ml.id);
  }

  /* ---------- Routes ---------- */
  for (const r of dataset.routes) {
    if (!r.name)
      addIssue(issues, 'error', 'missing_name', 'route', `Route ${r.id} senza nome`, r.id);
    if (!r.steps || r.steps.length < 2)
      addIssue(issues, 'error', 'too_few_steps', 'route', `Route ${r.id} con meno di 2 step`, r.id);
    checkSingleRef(r.arcId, aId, 'route', 'arcId', r.id, issues);
    checkRef(r.protagonistCharacterIds, cId, 'route', 'protagonistCharacterIds', r.id, issues);
    checkRef(r.primaryCharacterIds, cId, 'route', 'primaryCharacterIds', r.id, issues);
    checkRef(r.relatedCharacterIds, cId, 'route', 'relatedCharacterIds', r.id, issues);
    checkRef(r.relatedArcIds, aId, 'route', 'relatedArcIds', r.id, issues);
    checkRef(r.relatedEventIds, eId, 'route', 'relatedEventIds', r.id, issues);
    checkRef(r.relatedLocationIds, lId, 'route', 'relatedLocationIds', r.id, issues);
    if (r.steps) {
      for (const s of r.steps) {
        checkSingleRef(s.locationId, lId, 'route', `step#${s.order}.locationId`, r.id, issues);
        checkSingleRef(s.eventId, eId, 'route', `step#${s.order}.eventId`, r.id, issues);
        checkSingleRef(s.arcId, aId, 'route', `step#${s.order}.arcId`, r.id, issues);
      }
    }
  }

  /* ---------- Nations ---------- */
  for (const n of dataset.nations) {
    checkSingleRef(n.capitalLocationId, lId, 'nation', 'capitalLocationId', n.id, issues);
    checkSingleRef(n.boundaryId, bId, 'nation', 'boundaryId', n.id, issues);
    checkRef(n.hiddenVillageIds, lId, 'nation', 'hiddenVillageIds', n.id, issues);
    checkRef(n.relatedLocationIds, lId, 'nation', 'relatedLocationIds', n.id, issues);
    checkRef(n.relatedArcIds, aId, 'nation', 'relatedArcIds', n.id, issues);
    checkRef(n.relatedEventIds, eId, 'nation', 'relatedEventIds', n.id, issues);
  }

  /* ---------- Boundaries ---------- */
  for (const b of dataset.boundaries ?? []) {
    if (!mlId.has(b.mapLevelId))
      addIssue(issues, 'error', 'broken_ref', 'boundary', `Boundary ${b.id} mapLevelId inesistente: ${b.mapLevelId}`, b.id);
    checkSingleRef(b.nationId, nId, 'boundary', 'nationId', b.id, issues);
    checkRef(b.relatedLocationIds, lId, 'boundary', 'relatedLocationIds', b.id, issues);
    checkRef(b.relatedCharacterIds, cId, 'boundary', 'relatedCharacterIds', b.id, issues);
    checkRef(b.relatedArcIds, aId, 'boundary', 'relatedArcIds', b.id, issues);
    checkRef(b.relatedEventIds, eId, 'boundary', 'relatedEventIds', b.id, issues);
  }

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  return {
    issues,
    errors,
    warnings,
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
  };
}
