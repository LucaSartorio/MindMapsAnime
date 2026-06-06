/**
 * Esporta i pin (location) del dataset One Piece come JSON sullo stdout.
 *
 * Serve da sorgente per lo strumento di overlay (`onepiece-overlay.py`), che li
 * disegna sulla mappa di riferimento per verificare/rifinire le coordinate.
 *
 *   tsx --tsconfig scripts/tsconfig.json scripts/onepiece-pins.ts > /tmp/op-pins.json
 */
import { onepieceDataset, ONEPIECE_MAP_VIEWBOX } from '../src/data/onepiece';

const pins = onepieceDataset.locations.map((l) => ({
  id: l.id,
  name: l.name,
  x: l.x,
  y: l.y,
  importance: l.importance,
  nationId: l.nationId ?? null,
}));

process.stdout.write(
  JSON.stringify({ viewBox: ONEPIECE_MAP_VIEWBOX, pins }, null, 2) + '\n',
);
