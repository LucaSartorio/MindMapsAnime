/**
 * Arc-based segmentation of a character journey (pure, deterministic, generic).
 *
 * Input: the chronological journey ALREADY built by `buildCharacterJourney`
 * (projected, ordered, consecutive same-pin stops merged). Nothing here
 * re-reads the dataset or re-orders stops.
 *
 *   1. every stop gets an EFFECTIVE arc (its own; else the previous stop's;
 *      leading stops take the first known arc) → consecutive runs = arc groups;
 *   2. a journey of ≤ SINGLE_MAX stops stays ONE video;
 *   3. a longer one is partitioned into consecutive parts by dynamic
 *      programming over cut positions, minimising a penalty that prefers
 *      6 stops (5–7 almost as good, 8 accepted), forbids 1-stop parts, avoids
 *      a tiny final remainder, cuts at arc boundaries and only splits INSIDE an
 *      arc when that arc alone is bigger than SOFT_MAX (huge arcs).
 * The global optimum over the whole sequence → no greedy "6,6,2" endings.
 */
export const SEGMENTATION_VERSION = 1;
export const TARGET_STOPS = 6;
export const SOFT_MAX_STOPS = 8;
/** Journeys up to this many stops are a single video (no series). */
export const SINGLE_MAX_STOPS = 8;

/** Penalty of a part of `n` stops (n > SOFT_MAX is impossible). */
export const SIZE_PENALTY: Readonly<Record<number, number>> = { 1: 1000, 2: 60, 3: 25, 4: 6, 5: 1, 6: 0, 7: 1, 8: 4 };
/** Extra penalty when the LAST part is a 1–3 stop remainder. */
export const SMALL_TAIL_PENALTY = 15;
/** Cutting inside an arc that would fit in one part: strongly discouraged (still possible when nothing else works). */
export const SPLIT_SMALL_ARC_PENALTY = 200;
/** Cutting inside an arc bigger than SOFT_MAX: unavoidable, so cheap. */
export const SPLIT_HUGE_ARC_PENALTY = 3;

export type ArcTagged = { arcId?: string };

/** Effective arc per stop (see 1. above). `null` only when the whole journey has no arc. */
export function effectiveArcs(stops: readonly ArcTagged[]): (string | null)[] {
  const first = stops.find((s) => s.arcId)?.arcId ?? null;
  let current: string | null = first;
  return stops.map((s) => (current = s.arcId ?? current));
}

/** Consecutive runs of the same effective arc: `[{ arcId, start, size }]`. */
export function arcGroups(stops: readonly ArcTagged[]): { arcId: string | null; start: number; size: number }[] {
  const arcs = effectiveArcs(stops);
  const groups: { arcId: string | null; start: number; size: number }[] = [];
  arcs.forEach((arcId, i) => {
    const last = groups[groups.length - 1];
    if (last && last.arcId === arcId) last.size++;
    else groups.push({ arcId, start: i, size: 1 });
  });
  return groups;
}

/**
 * Optimal partition of a sequence of arc groups (sizes, in order) into parts
 * of 1..SOFT_MAX stops. Returns the part sizes. Exported for the tests.
 */
export function partitionSizes(groupSizes: readonly number[]): number[] {
  const n = groupSizes.reduce((a, b) => a + b, 0);
  if (n === 0) return [];
  if (n <= SINGLE_MAX_STOPS) return [n];
  // Cut cost at each position 1..n-1: free at an arc boundary, else depends on the arc's size.
  const cutCost: number[] = new Array<number>(n + 1).fill(0);
  let pos = 0;
  for (const size of groupSizes) {
    for (let k = 1; k < size; k++) cutCost[pos + k] = size > SOFT_MAX_STOPS ? SPLIT_HUGE_ARC_PENALTY : SPLIT_SMALL_ARC_PENALTY;
    pos += size;
  }
  const best: number[] = new Array<number>(n + 1).fill(Infinity);
  const choice: number[] = new Array<number>(n + 1).fill(0);
  best[0] = 0;
  for (let j = 1; j <= n; j++) {
    // Longest part first + strict "<": ties resolve the same way every time.
    for (let len = Math.min(SOFT_MAX_STOPS, j); len >= 1; len--) {
      const i = j - len;
      if (!Number.isFinite(best[i])) continue;
      const tail = j === n && len <= 3 ? SMALL_TAIL_PENALTY : 0;
      const cost = best[i] + SIZE_PENALTY[len] + (j < n ? cutCost[j] : 0) + tail;
      if (cost < best[j]) {
        best[j] = cost;
        choice[j] = len;
      }
    }
  }
  const sizes: number[] = [];
  for (let j = n; j > 0; j -= choice[j]) sizes.unshift(choice[j]);
  return sizes;
}

export type JourneySegment = {
  /** 1-based, chronological. */
  partNumber: number;
  partCount: number;
  /** `part-01` … (only meaningful when partCount > 1). */
  key: string;
  /** Stop index range in the full journey: [start, end). */
  start: number;
  end: number;
  /** Distinct effective arcs covered, in order. */
  arcIds: string[];
};

export type JourneySegmentation = {
  version: number;
  mode: 'single' | 'series';
  segments: JourneySegment[];
};

/**
 * `part-01` for segmentation version 1. A future algorithm version gets its own
 * keys (`part-01-v2`), so an old "part-01" can never silently change meaning:
 * history/catalog keep telling the two apart.
 */
export function segmentKey(partNumber: number, version: number = SEGMENTATION_VERSION): string {
  const base = `part-${String(partNumber).padStart(2, '0')}`;
  return version === 1 ? base : `${base}-v${version}`;
}

export function segmentJourney(stops: readonly ArcTagged[]): JourneySegmentation {
  const groups = arcGroups(stops);
  const sizes = partitionSizes(groups.map((g) => g.size));
  const arcs = effectiveArcs(stops);
  let start = 0;
  const segments = sizes.map((size, i) => {
    const seg: JourneySegment = {
      partNumber: i + 1,
      partCount: sizes.length,
      key: segmentKey(i + 1),
      start,
      end: start + size,
      arcIds: [...new Set(arcs.slice(start, start + size).filter((a): a is string => a !== null))],
    };
    start += size;
    return seg;
  });
  return { version: SEGMENTATION_VERSION, mode: segments.length > 1 ? 'series' : 'single', segments };
}

/** Small deterministic content hash (FNV-1a, 32 bit) — works in Node and in the Remotion bundle. */
export function fingerprint(parts: readonly string[]): string {
  let h = 0x811c9dc5;
  for (const ch of parts.join('|')) {
    h ^= ch.codePointAt(0) ?? 0;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}
