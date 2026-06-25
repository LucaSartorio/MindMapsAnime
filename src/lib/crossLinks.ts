import type { Character, Jutsu, StoryArc, WorldDataset } from '@/types';

/**
 * Densifica i collegamenti incrociati di un dataset **a runtime** (non
 * tocca i file sorgente). Lavora in modo idempotente: applicarlo più
 * volte non produce duplicati.
 *
 * Cosa fa, in ordine:
 *
 *  1. Allies / Enemies / Family bidirezionali — se A ha B fra gli alleati
 *     ma B non ha A, aggiunge il backlink in B. Lo stesso per family,
 *     enemies, teachers↔students.
 *
 *  2. Backlink jutsu → char e char → jutsu — se `jutsu.characterIds`
 *     elenca X, X.jutsuIds avrà quel jutsu; e viceversa.
 *
 *  3. Backlink arc.characterIds → char.arcIds — così il modale del
 *     personaggio mostra anche gli archi che lo elencano senza che lui
 *     "sappia" di essere lì.
 *
 *  4. Backlink event.characterIds → char.eventIds — analogo.
 *
 *  5. Backlink event.arcId → arc.eventIds — i modali archi mostrano la
 *     timeline anche quando l'arco non ha lista eventi esplicita.
 *
 * Tutto è idempotente perché usa `Set` come buffer prima di reimmettere
 * gli array.
 */
export function densifyCrossLinks(ds: WorldDataset): WorldDataset {
  const characters = ds.characters.map((c) => ({
    ...c,
    family: new Set(c.family ?? []),
    allies: new Set(c.allies ?? []),
    enemies: new Set(c.enemies ?? []),
    teachers: new Set(c.teachers ?? []),
    students: new Set(c.students ?? []),
    jutsuIds: new Set(c.jutsuIds ?? []),
    arcIds: new Set(c.arcIds ?? []),
    eventIds: new Set(c.eventIds ?? []),
  }));

  const idIdx = new Map<string, (typeof characters)[number]>();
  for (const c of characters) idIdx.set(c.id, c);

  // ---- 1) symmetric pair fields
  const mirrorPair = (
    a: (typeof characters)[number],
    bId: string,
    field: 'family' | 'allies' | 'enemies',
  ) => {
    const b = idIdx.get(bId);
    if (!b) return;
    b[field].add(a.id);
  };

  for (const c of characters) {
    for (const id of c.family) mirrorPair(c, id, 'family');
    for (const id of c.allies) mirrorPair(c, id, 'allies');
    for (const id of c.enemies) mirrorPair(c, id, 'enemies');
    for (const id of c.teachers) {
      const t = idIdx.get(id);
      if (t) t.students.add(c.id);
    }
    for (const id of c.students) {
      const s = idIdx.get(id);
      if (s) s.teachers.add(c.id);
    }
  }

  // ---- 2) jutsu <-> characters
  const jutsuArr = (ds.jutsu ?? []).map((j) => ({
    ...j,
    characterIds: new Set(j.characterIds ?? []),
  }));
  const jutsuIdx = new Map(jutsuArr.map((j) => [j.id, j]));

  for (const c of characters) {
    for (const jid of c.jutsuIds) {
      const j = jutsuIdx.get(jid);
      if (j) j.characterIds.add(c.id);
    }
  }
  for (const j of jutsuArr) {
    for (const cid of j.characterIds) {
      const c = idIdx.get(cid);
      if (c) c.jutsuIds.add(j.id);
    }
  }

  // ---- 3) arcs.characterIds <-> char.arcIds
  const arcs = ds.arcs.map((a) => ({
    ...a,
    characterIds: new Set(a.characterIds ?? []),
    eventIds: new Set(a.eventIds ?? []),
  }));
  const arcIdx = new Map(arcs.map((a) => [a.id, a]));

  for (const c of characters) {
    for (const aid of c.arcIds) {
      const a = arcIdx.get(aid);
      if (a) a.characterIds.add(c.id);
    }
  }
  for (const a of arcs) {
    for (const cid of a.characterIds) {
      const c = idIdx.get(cid);
      if (c) c.arcIds.add(a.id);
    }
  }

  // ---- 4) events.characterIds <-> char.eventIds
  //         events.arcId        -> arc.eventIds  (5)
  for (const ev of ds.events) {
    for (const cid of ev.characterIds ?? []) {
      const c = idIdx.get(cid);
      if (c) c.eventIds.add(ev.id);
    }
    if (ev.arcId) {
      const a = arcIdx.get(ev.arcId);
      if (a) a.eventIds.add(ev.id);
    }
  }

  // ---- back to arrays
  const finalCharacters: Character[] = characters.map((c) => ({
    ...c,
    family: [...c.family],
    allies: [...c.allies],
    enemies: [...c.enemies],
    teachers: [...c.teachers],
    students: [...c.students],
    jutsuIds: [...c.jutsuIds],
    arcIds: [...c.arcIds],
    eventIds: [...c.eventIds],
  }));
  const finalJutsu: Jutsu[] = jutsuArr.map((j) => ({
    ...j,
    characterIds: [...j.characterIds],
  }));
  const finalArcs: StoryArc[] = arcs.map((a) => ({
    ...a,
    characterIds: [...a.characterIds],
    eventIds: [...a.eventIds],
  }));

  return {
    ...ds,
    characters: finalCharacters,
    jutsu: finalJutsu,
    arcs: finalArcs,
  };
}
