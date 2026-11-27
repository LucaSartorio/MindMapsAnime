import { Color, InstancedMesh, Matrix4, Quaternion, Vector3, Euler, type BufferGeometry, type Material } from 'three';
import { GeometryBatch } from '../engine/batch';
import type { ResourceTracker } from '../engine/resources';
import type { PartBuilder } from './parts';

/**
 * Furniture as small baked geometries rendered with `InstancedMesh`: 40 chairs = 1 geometry + 1 draw call.
 * Every piece is parametric (sizes, colours) and centred on its floor footprint (y = 0 at the feet).
 */
export function chairGeometry(pb: PartBuilder, tracker: ResourceTracker, wood: string, cushion: string): BufferGeometry {
  const b = new GeometryBatch();
  pb.box(b, [0, 0.47, 0], [0.46, 0.06, 0.46], cushion);
  for (const [x, z] of [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]] as const) pb.box(b, [x, 0.22, z], [0.05, 0.44, 0.05], wood);
  pb.box(b, [0, 0.82, -0.21], [0.46, 0.5, 0.05], wood);
  pb.box(b, [0, 0.98, -0.21], [0.5, 0.07, 0.07], wood);
  return b.build(tracker)!;
}

export function roundTableGeometry(pb: PartBuilder, tracker: ResourceTracker, wood: string, cloth: string, radius: number): BufferGeometry {
  const b = new GeometryBatch();
  pb.cylinder(b, [0, 0.76, 0], radius, 0.05, cloth, { segments: 20 });
  pb.cylinder(b, [0, 0.66, 0], radius * 1.02, 0.18, cloth, { segments: 20, taper: 0.98 });
  pb.cylinder(b, [0, 0.36, 0], 0.07, 0.62, wood, { segments: 8 });
  pb.cylinder(b, [0, 0.03, 0], 0.32, 0.06, wood, { segments: 12 });
  // Plates and a candle: tiny but they make it read as a restaurant.
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    pb.cylinder(b, [Math.cos(a) * radius * 0.62, 0.8, Math.sin(a) * radius * 0.62], 0.12, 0.02, '#f7f4ec', { segments: 12 });
  }
  pb.cylinder(b, [0, 0.86, 0], 0.03, 0.16, '#fff6d8', { segments: 6 });
  return b.build(tracker)!;
}

export interface Placement {
  x: number;
  y: number;
  z: number;
  yaw: number;
  color?: string;
}

const m = new Matrix4();
const q = new Quaternion();
const e = new Euler();
const p = new Vector3();
const s = new Vector3(1, 1, 1);

/** One `InstancedMesh` for many placements of the same piece. Optional per-instance tint (multiplies vertex colour). */
export function instanced(name: string, geo: BufferGeometry, material: Material, placements: Placement[]): InstancedMesh {
  const mesh = new InstancedMesh(geo, material, placements.length);
  mesh.name = name;
  placements.forEach((pl, i) => {
    e.set(0, pl.yaw, 0);
    q.setFromEuler(e);
    m.compose(p.set(pl.x, pl.y, pl.z), q, s);
    mesh.setMatrixAt(i, m);
    if (pl.color) mesh.setColorAt(i, new Color(pl.color));
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  mesh.computeBoundingSphere();
  return mesh;
}

/** Chairs evenly spaced around a round table, facing it. */
export function chairsAround(x: number, y: number, z: number, count: number, distance: number, phase = 0): Placement[] {
  const out: Placement[] = [];
  for (let i = 0; i < count; i++) {
    const a = phase + (i / count) * Math.PI * 2;
    // Chair back is at local −Z: rotate so the back faces away from the table centre.
    out.push({ x: x + Math.cos(a) * distance, y, z: z + Math.sin(a) * distance, yaw: -a - Math.PI / 2 });
  }
  return out;
}
