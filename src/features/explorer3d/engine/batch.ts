import {
  BufferAttribute,
  BufferGeometry,
  Color,
  EdgesGeometry,
  LineSegments,
  Matrix3,
  Matrix4,
  Mesh,
  Vector3,
  type Material,
} from 'three';
import type { ResourceTracker } from './resources';

/**
 * Per-vertex colour: a constant, or a function of the world-space position/normal (stripes, gradients). When the
 * source geometry has its own `color` attribute, the function also receives that vertex colour (`src`).
 */
export type ColorSpec = Color | string | ((p: Vector3, n: Vector3, src?: Color) => Color);

/** Keeps the colours baked into the source geometry (e.g. a striped sail). */
export const SOURCE_COLORS: ColorSpec = (_p, _n, src) => src ?? WHITE;
const WHITE = new Color(1, 1, 1);

/** Growable Float32 buffer (avoids number[] → Float32Array copies of large meshes). */
class FloatBuffer {
  data = new Float32Array(4096);
  length = 0;
  push3(a: number, b: number, c: number): void {
    if (this.length + 3 > this.data.length) {
      const next = new Float32Array(this.data.length * 2);
      next.set(this.data);
      this.data = next;
    }
    this.data[this.length++] = a;
    this.data[this.length++] = b;
    this.data[this.length++] = c;
  }
  view(): Float32Array {
    return this.data.slice(0, this.length);
  }
}

const tmpP = new Vector3();
const tmpN = new Vector3();
const tmpNormalMatrix = new Matrix3();
const tmpColor = new Color();
const tmpSrc = new Color();

/**
 * Collects many small parts (already-built `BufferGeometry` + transform + colour) and bakes them into ONE
 * non-indexed, vertex-coloured geometry. A zone with 1,500 boxes becomes one draw call. Source geometries are
 * not modified and can be shared (unit box, unit cylinder) — the caller owns and tracks them.
 */
export class GeometryBatch {
  private readonly pos = new FloatBuffer();
  private readonly nor = new FloatBuffer();
  private readonly col = new FloatBuffer();
  parts = 0;

  add(geo: BufferGeometry, matrix: Matrix4, color: ColorSpec): void {
    const position = geo.getAttribute('position');
    const normal = geo.getAttribute('normal');
    const srcColor = geo.getAttribute('color');
    const index = geo.getIndex();
    tmpNormalMatrix.getNormalMatrix(matrix);
    const fixed = typeof color === 'function' ? null : color instanceof Color ? color : tmpColor.set(color).clone();
    const count = index ? index.count : position.count;
    for (let i = 0; i < count; i++) {
      const v = index ? index.getX(i) : i;
      tmpP.fromBufferAttribute(position, v).applyMatrix4(matrix);
      tmpN.fromBufferAttribute(normal, v).applyMatrix3(tmpNormalMatrix).normalize();
      this.pos.push3(tmpP.x, tmpP.y, tmpP.z);
      this.nor.push3(tmpN.x, tmpN.y, tmpN.z);
      const c =
        fixed ??
        (color as (p: Vector3, n: Vector3, src?: Color) => Color)(tmpP, tmpN, srcColor ? tmpSrc.fromBufferAttribute(srcColor as never, v) : undefined);
      this.col.push3(c.r, c.g, c.b);
    }
    this.parts++;
  }

  get vertexCount(): number {
    return this.pos.length / 3;
  }

  /** Bakes the collected parts; returns `null` when empty. The geometry is tracked for disposal. */
  build(tracker: ResourceTracker): BufferGeometry | null {
    if (this.pos.length === 0) return null;
    const g = tracker.track(new BufferGeometry());
    g.setAttribute('position', new BufferAttribute(this.pos.view(), 3));
    g.setAttribute('normal', new BufferAttribute(this.nor.view(), 3));
    g.setAttribute('color', new BufferAttribute(this.col.view(), 3));
    g.computeBoundingSphere();
    g.computeBoundingBox();
    return g;
  }
}

export interface BatchMeshOptions {
  name: string;
  material: Material;
  castShadow?: boolean;
  receiveShadow?: boolean;
  /** Hard-edge ink lines (architecture). Skipped when `inkMaterial` is not given (low quality). */
  inkMaterial?: Material;
  inkThresholdDeg?: number;
  /** Silhouette ink (smooth shapes: hulls, fish head). */
  outlineMaterial?: Material;
}

/** Turns a batch into a mesh (+ optional ink children). Returns `null` for an empty batch. */
export function batchToMesh(batch: GeometryBatch, tracker: ResourceTracker, o: BatchMeshOptions): Mesh | null {
  const geo = batch.build(tracker);
  if (!geo) return null;
  const mesh = new Mesh(geo, o.material);
  mesh.name = o.name;
  mesh.castShadow = !!o.castShadow;
  mesh.receiveShadow = !!o.receiveShadow;
  mesh.matrixAutoUpdate = false;
  if (o.inkMaterial) {
    const edges = tracker.track(new EdgesGeometry(geo, o.inkThresholdDeg ?? 32));
    const lines = new LineSegments(edges, o.inkMaterial);
    lines.name = `${o.name}:ink`;
    lines.matrixAutoUpdate = false;
    mesh.add(lines);
  }
  if (o.outlineMaterial) {
    const hull = new Mesh(geo, o.outlineMaterial); // same geometry: no extra memory
    hull.name = `${o.name}:outline`;
    hull.matrixAutoUpdate = false;
    mesh.add(hull);
  }
  return mesh;
}
