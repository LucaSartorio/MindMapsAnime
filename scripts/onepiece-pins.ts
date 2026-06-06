/**
 * Esporta i pin (location) del dataset One Piece come JSON sullo stdout.
 *
 * Serve da sorgente per lo strumento di overlay (`onepiece-overlay.py`), che li
 * disegna sulla mappa di riferimento per verificare/rifinire le coordinate.
 *
 *   tsx --tsconfig scripts/tsconfig.json scripts/onepiece-pins.ts > /tmp/op-pins.json
 */
import { onepieceDataset, ONEPIECE_MAP_VIEWBOX } from '../src/data/onepiece';

const pins = onepieceDataset.locations
  .filter((l) => l.mapLevelId === 'op-map-world')
  .map((l) => ({
  id: l.id,
  name: l.name,
  x: l.x,
  y: l.y,
  importance: l.importance,
  nationId: l.nationId ?? null,
}));

const byId = new Map(onepieceDataset.locations.map((l) => [l.id, l]));
const routes = onepieceDataset.routes.map((r) => ({
  id: r.id,
  color: r.color ?? '#ffffff',
  lineStyle: r.lineStyle ?? 'solid',
  points: r.steps
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((s) => byId.get(s.locationId))
    .filter((l): l is NonNullable<typeof l> => !!l)
    .map((l) => ({ x: l.x, y: l.y })),
}));

process.stdout.write(
  JSON.stringify({ viewBox: ONEPIECE_MAP_VIEWBOX, pins, routes }, null, 2) + '\n',
);
