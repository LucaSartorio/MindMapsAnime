import type { SceneDefinition } from '../../../types';

/**
 * Baratie (One Piece) — scene DATA. Pure TypeScript, no three.js: imported by the scene builder and by
 * `npm run validate:3d`. Units: metres; +X = bow (fish head), +Y = up, water at y = 0, main deck at y = 3.
 *
 * Hotspots only point at existing, verified dataset ids (location `loc-op-baratie`: characterIds, arcIds, events
 * with `locationId: 'loc-op-baratie'`). Their PLACEMENT inside the ship is a reconstruction choice; the link is canon.
 */
export const DECK_Y = 3;
export const UPPER_Y = 7.5;

export const definition: SceneDefinition = {
  id: 'onepiece-baratie',
  worldId: 'world-onepiece',
  locationId: 'loc-op-baratie',
  seed: 0xba7a1e,
  camera: { position: [52, 30, 46], target: [-1, 6, 0], minDistance: 14, maxDistance: 140 },
  bounds: { min: [-70, -3, -70], max: [70, 60, 70] },
  zones: [
    { id: 'exterior', kind: 'exterior', interior: false, reconstruction: 'canon', bounds: { min: [-70, -3, -70], max: [70, 60, 70] } },
    { id: 'deck', kind: 'deck', interior: false, reconstruction: 'canon', bounds: { min: [-27, 2.5, -12.5], max: [15.6, 5, 12.5] } },
    { id: 'bow', kind: 'bow', interior: false, reconstruction: 'canon', bounds: { min: [12, 2.5, -7], max: [34, 10, 7] } },
    { id: 'stern', kind: 'stern', interior: false, reconstruction: 'interpretive', bounds: { min: [-35, 2.5, -11], max: [-14, 6, 11] } },
    { id: 'fin-port', kind: 'finDeck', interior: false, reconstruction: 'canon', bounds: { min: [-14, 1.8, -23], max: [9, 4.5, -10.4] } },
    { id: 'fin-starboard', kind: 'finDeck', interior: false, reconstruction: 'canon', bounds: { min: [-14, 1.8, 10.4], max: [9, 4.5, 23] } },
    { id: 'terrace', kind: 'terrace', interior: false, reconstruction: 'interpretive', bounds: { min: [-4, 7, -8.2], max: [12.2, 10, 8.2] } },
    { id: 'outer-stairs', kind: 'stairs', interior: false, reconstruction: 'interpretive', bounds: { min: [0.8, 2.5, -9.7], max: [9.6, 8.2, -8] } },
    { id: 'dining-hall', kind: 'diningHall', interior: true, reconstruction: 'canon', bounds: { min: [-4, 2.5, -8], max: [12, 7.1, 8] } },
    { id: 'corridor', kind: 'corridor', interior: true, reconstruction: 'interpretive', bounds: { min: [-7, 2.5, -8], max: [-4, 7.1, 8] } },
    { id: 'kitchen', kind: 'kitchen', interior: true, reconstruction: 'canon', bounds: { min: [-14, 2.5, -8], max: [-7, 7.1, 8] } },
    { id: 'kitchen-stairs', kind: 'stairs', interior: true, reconstruction: 'interpretive', bounds: { min: [-13.8, 2.5, -5.6], max: [-12.2, 8.2, 0.4] } },
    { id: 'upper-floor', kind: 'upperFloor', interior: true, reconstruction: 'interpretive', bounds: { min: [-14, 7.2, -8], max: [-4, 11.5, 8] } },
  ],
  spawns: [
    { id: 'bow-porch', zone: 'deck', position: [14.4, 3, 0], yaw: Math.PI / 2 },
    { id: 'hall', zone: 'dining-hall', position: [9.5, 3, 0], yaw: Math.PI / 2 },
    { id: 'kitchen', zone: 'kitchen', position: [-8.2, 3, 3.2], yaw: Math.PI / 2 },
    { id: 'upper', zone: 'upper-floor', position: [-5.2, UPPER_Y, 2], yaw: Math.PI / 2 },
    { id: 'terrace', zone: 'terrace', position: [9, UPPER_Y, 2], yaw: Math.PI / 2 },
    { id: 'fin-port', zone: 'fin-port', position: [-3, 2.7, -14.5], yaw: Math.PI },
    { id: 'fin-starboard', zone: 'fin-starboard', position: [-3, 2.7, 14.5], yaw: 0 },
    { id: 'stern', zone: 'stern', position: [-19.5, 3, 4.5], yaw: -Math.PI / 2 },
  ],
  defaultSpawn: 'bow-porch',
  hotspots: [
    { id: 'arc', entity: { type: 'arc', id: 'arc-op-baratie' }, position: [-3.1, 15.2, 0], zone: 'exterior' },
    { id: 'luffy', entity: { type: 'character', id: 'char-op-luffy' }, position: [14.6, 5.2, -2.2], zone: 'deck' },
    { id: 'zeff', entity: { type: 'character', id: 'char-op-zeff' }, position: [-2.2, 5.1, -5.4], zone: 'dining-hall' },
    { id: 'sanji-intro', entity: { type: 'event', id: 'evt-op-baratie-sanji-intro' }, position: [4, 5.2, 2.4], zone: 'dining-hall' },
    { id: 'sanji', entity: { type: 'character', id: 'char-op-sanji' }, position: [-10.2, 5.2, 5.6], zone: 'kitchen' },
    { id: 'krieg-assault', entity: { type: 'event', id: 'evt-op-baratie-krieg' }, position: [-2, 4.6, -17.5], zone: 'fin-port' },
    { id: 'zoro-mihawk', entity: { type: 'event', id: 'evt-op-zoro-vs-mihawk' }, position: [-2, 4.6, 17.5], zone: 'fin-starboard' },
  ],
  provenance: {
    method: 'procedural',
    author: 'AniMapVerse',
    license: 'Original procedural code, part of the AniMapVerse repository',
    sources: [
      { kind: 'manga', label: 'One Piece, Baratie arc (dataset arc-op-baratie, ch. 43-68)' },
      { kind: 'reference', label: 'Ch. 53 "Mackerel Head": the fish-head prow is the detachable Sabagashira No. 1' },
      { kind: 'reference', label: 'Krieg battle: the chefs raise the two side fins as a battle platform' },
    ],
    rights: 'pending-owner-review',
    notes: [
      'Shapes are stylized and built only from code; no official artwork, model or texture was used or traced.',
      'Canon: floating restaurant ship, large fish-head prow, two deployable side fins used as a battle platform, mast, kitchen and dining hall.',
      'Interpretive: exact proportions and colours (mackerel blue-green head chosen from the name "Sabagashira"), the stern tail fin, the rooftop terrace, the exterior and kitchen stairs, the corridor and the whole upper floor layout.',
      'Hotspot placement inside the ship is interpretive; each hotspot links an entity the dataset already ties to loc-op-baratie.',
      'The sign shows the location name from the dataset in a generic font, not the logo of the work.',
    ],
  },
};
