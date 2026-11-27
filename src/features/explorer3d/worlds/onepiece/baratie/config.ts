import type { SceneDefinition } from '../../../types';

/**
 * Baratie (One Piece) — scene DATA. Pure TypeScript, no three.js: imported by the scene builder and by
 * `npm run validate:3d`. Units: metres; +X = bow (fish head), +Y = up, water at y = 0, main deck at y = 3.
 *
 * Layout from the visual references (docs/explorer3d/onepiece-baratie.md): a round orange hull; three stacked
 * tiers — T1 oval dining hall on the main deck, T2 octagonal kitchen on the middle level, T3 cooks' quarters on top —
 * with ring terraces on the T1 and T2 roofs; two masts; wooden battle fins deployed as a platform.
 *
 * Hotspots only point at existing, verified dataset ids (location `loc-op-baratie`: characterIds, arcIds, events
 * with `locationId: 'loc-op-baratie'`). Their PLACEMENT inside the ship is a reconstruction choice; the link is canon.
 */
/** High freeboard: the round orange hull is the most recognizable mass of the ship (reference). */
export const DECK_Y = 5;
/** T1 roof = terrace + kitchen floor. */
export const T1_TOP = DECK_Y + 4.5;
/** T2 roof = upper terrace + quarters floor. */
export const T2_TOP = T1_TOP + 3.8;
export const T3_TOP = T2_TOP + 3;
/** Fin platforms sit one step below the main deck. */
export const FIN_Y = DECK_Y - 0.35;

/** Plan geometry shared by the builder and the zones below (single source of truth). */
export const PLAN = {
  t1: { cx: -3, cz: 0, rx: 15, rz: 10.2, segments: 26 },
  t2: { cx: -3, cz: 0, hx: 7.5, hz: 6, chamfer: 2.2 },
  t3: { cx: -4.5, cz: 0, hx: 3.6, hz: 3.4 },
  hallStairs: { minX: -2.5, maxX: 4.5, minZ: 3.6, maxZ: 5.4 },
  head: { x0: 14.6, x1: 26.4 },
} as const;

export const definition: SceneDefinition = {
  id: 'onepiece-baratie',
  worldId: 'world-onepiece',
  locationId: 'loc-op-baratie',
  seed: 0xba7a1e,
  camera: { position: [50, 28, 44], target: [0, 9, 0], minDistance: 14, maxDistance: 140 },
  bounds: { min: [-70, -3, -70], max: [70, 60, 70] },
  zones: [
    { id: 'exterior', kind: 'exterior', interior: false, reconstruction: 'canon', bounds: { min: [-70, -3, -70], max: [70, 60, 70] } },
    { id: 'deck', kind: 'deck', interior: false, reconstruction: 'canon', bounds: { min: [-26, DECK_Y - 0.5, -13.2], max: [14.6, DECK_Y + 2, 13.2] } },
    { id: 'bow', kind: 'bow', interior: false, reconstruction: 'canon', bounds: { min: [13, DECK_Y - 0.5, -7], max: [28, DECK_Y + 7, 7] } },
    { id: 'stern', kind: 'stern', interior: false, reconstruction: 'canon', bounds: { min: [-27, DECK_Y - 0.5, -11], max: [-17, DECK_Y + 3, 11] } },
    { id: 'fin-port', kind: 'finDeck', interior: false, reconstruction: 'canon', bounds: { min: [-17, FIN_Y - 0.6, -21.5], max: [10, FIN_Y + 1.8, -10.4] } },
    { id: 'fin-starboard', kind: 'finDeck', interior: false, reconstruction: 'canon', bounds: { min: [-17, FIN_Y - 0.6, 10.4], max: [10, FIN_Y + 1.8, 21.5] } },
    { id: 'terrace', kind: 'terrace', interior: false, reconstruction: 'canon', bounds: { min: [-18.2, T1_TOP - 0.3, -10.5], max: [12.2, T1_TOP + 2.3, 10.5] } },
    { id: 'terrace-top', kind: 'terrace', interior: false, reconstruction: 'canon', bounds: { min: [-10.6, T2_TOP - 0.3, -6.2], max: [4.7, T2_TOP + 2.2, 6.2] } },
    { id: 'outer-stairs', kind: 'stairs', interior: false, reconstruction: 'interpretive', bounds: { min: [-6.6, DECK_Y - 0.5, -11.7], max: [1.6, T1_TOP + 0.7, -9.8] } },
    { id: 'upper-stairs', kind: 'stairs', interior: false, reconstruction: 'interpretive', bounds: { min: [-7.1, T1_TOP - 0.3, 5.6], max: [0.9, T2_TOP + 0.7, 7.7] } },
    { id: 'dining-hall', kind: 'diningHall', interior: true, reconstruction: 'canon', footprint: 'ellipse', bounds: { min: [-18, DECK_Y - 0.5, -10.2], max: [12, T1_TOP - 0.4, 10.2] } },
    { id: 'hall-stairs', kind: 'stairs', interior: true, reconstruction: 'interpretive', bounds: { min: [-2.5, DECK_Y - 0.5, 3.6], max: [4.5, T1_TOP - 0.1, 5.4] } },
    { id: 'kitchen', kind: 'kitchen', interior: true, reconstruction: 'canon', bounds: { min: [-10.5, T1_TOP - 0.3, -6], max: [4.5, T2_TOP - 0.3, 6] } },
    { id: 'quarters', kind: 'upperFloor', interior: true, reconstruction: 'interpretive', bounds: { min: [-8.1, T2_TOP - 0.3, -3.4], max: [-0.9, T3_TOP, 3.4] } },
  ],
  spawns: [
    { id: 'bow-porch', zone: 'deck', position: [13.6, DECK_Y, 0], yaw: Math.PI / 2 },
    { id: 'hall', zone: 'dining-hall', position: [8.5, DECK_Y, 0], yaw: Math.PI / 2 },
    { id: 'hall-stairs-bottom', zone: 'dining-hall', position: [6.4, DECK_Y, 4.5], yaw: Math.PI / 2 },
    { id: 'kitchen', zone: 'kitchen', position: [-1, T1_TOP, -1.8], yaw: Math.PI / 2 },
    { id: 'quarters', zone: 'quarters', position: [-2, T2_TOP, 0], yaw: Math.PI / 2 },
    { id: 'terrace', zone: 'terrace', position: [9.5, T1_TOP, 3], yaw: Math.PI / 2 },
    { id: 'outer-stairs-bottom', zone: 'deck', position: [3.2, DECK_Y, -11.0], yaw: Math.PI / 2 },
    { id: 'upper-stairs-bottom', zone: 'terrace', position: [-8.6, T1_TOP, 7.0], yaw: -Math.PI / 2 },
    { id: 'fin-port', zone: 'fin-port', position: [-3, FIN_Y, -14.6], yaw: Math.PI },
    { id: 'fin-starboard', zone: 'fin-starboard', position: [-3, FIN_Y, 14.6], yaw: 0 },
    { id: 'stern', zone: 'stern', position: [-21.5, DECK_Y, 4], yaw: -Math.PI / 2 },
  ],
  defaultSpawn: 'bow-porch',
  hotspots: [
    { id: 'arc', entity: { type: 'arc', id: 'arc-op-baratie' }, position: [5.4, T2_TOP + 1.3, 0], zone: 'exterior' },
    { id: 'luffy', entity: { type: 'character', id: 'char-op-luffy' }, position: [13.6, DECK_Y + 2.2, -2.4], zone: 'deck' },
    { id: 'zeff', entity: { type: 'character', id: 'char-op-zeff' }, position: [-12.4, DECK_Y + 2.1, -4.6], zone: 'dining-hall' },
    { id: 'sanji-intro', entity: { type: 'event', id: 'evt-op-baratie-sanji-intro' }, position: [2, DECK_Y + 2.2, -3.2], zone: 'dining-hall' },
    { id: 'sanji', entity: { type: 'character', id: 'char-op-sanji' }, position: [-8.4, T1_TOP + 2.2, 0], zone: 'kitchen' },
    { id: 'krieg-assault', entity: { type: 'event', id: 'evt-op-baratie-krieg' }, position: [-3, FIN_Y + 1.7, -16.5], zone: 'fin-port' },
    { id: 'zoro-mihawk', entity: { type: 'event', id: 'evt-op-zoro-vs-mihawk' }, position: [-3, FIN_Y + 1.7, 16.5], zone: 'fin-starboard' },
  ],
  provenance: {
    method: 'procedural',
    author: 'AniMapVerse',
    license: 'Original procedural code, part of the AniMapVerse repository',
    sources: [
      { kind: 'manga', label: 'One Piece, Baratie arc (dataset arc-op-baratie, ch. 43-68)' },
      { kind: 'reference', label: 'Ch. 53 "Mackerel Head": the fish-head prow is the detachable Sabagashira No. 1' },
      { kind: 'reference', label: 'Krieg battle: the chefs raise the two side fins as a battle platform' },
      { kind: 'reference', label: 'Fan wiki summaries via search: oval ship, round bottom, four levels (dining, kitchen, cooks\' quarters, fins), cannons in the mouth and along the sides' },
      { kind: 'reference', label: 'Bandai Grand Ship Collection #10 Baratie (official model, 2014): review photos, looked at only for shapes and colours (citation in docs/explorer3d/onepiece-baratie.md)' },
    ],
    // Published on the owner's explicit request. This is NOT a verified rights clearance: see `unresolved`.
    rights: 'owner-approved',
    publication: {
      approvedBy: 'owner',
      date: '2026-11-27',
      reference: 'Owner request to make the Baratie 3D exploration public on animapverse.com; docs/explorer3d/onepiece-baratie.md',
      unresolved: [
        'No licence or permission from the rights holders of One Piece has been requested or verified.',
        'No legal review of whether a recognizable 3D reconstruction of the setting fits the site\'s fan-reference use.',
        'The primary wiki description could not be read (HTTP 402): proportions rely on secondary textual sources.',
        'The location name appears on the sign (generic font, dataset text, not the official logo).',
      ],
    },
    notes: [
      'Shapes are stylized and built only from code; no official artwork, model or texture was embedded, traced or distributed. Reference photos were only looked at.',
      'Canon (work + official model kit): round orange hull with planks, white fish head with orange lips and cannons in the mouth, mint-green tiered restaurant with lattice bands and arched windows, two masts with yellow/white striped sails, wooden battle fins, dining hall below and kitchen on the middle level.',
      'From the official model kit only (supplementary, stylized): the tall orange stern plate, the hip-roofed top house, ring terraces and the sign band layout.',
      'Interpretive: exact proportions (the model is compressed), stair positions, interior layouts and furniture, the cooks\' quarters interior, fins shown deployed.',
      'Hotspot placement inside the ship is interpretive; each hotspot links an entity the dataset already ties to loc-op-baratie.',
      'The sign shows the location name from the dataset in a generic font, not the logo of the work; the top sign is a fork-and-knife pictogram (no text).',
    ],
  },
};
