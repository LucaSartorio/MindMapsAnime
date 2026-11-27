import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CylinderGeometry,
  Euler,
  Matrix4,
  Quaternion,
  SphereGeometry,
  Vector3,
} from 'three';
import type { ColorSpec, GeometryBatch } from '../engine/batch';
import type { ResourceTracker } from '../engine/resources';

export type XYZ = readonly [number, number, number];

const tmpM = new Matrix4();
const tmpQ = new Quaternion();
const tmpE = new Euler();
const tmpPos = new Vector3();
const tmpScale = new Vector3();

/**
 * Shared unit geometries + a transform helper. Parts are appended to a `GeometryBatch` (baked into one mesh), so the
 * unit geometries are built once per session and never rendered directly. Segment counts come from the quality
 * level (`curveSegments`): fewer segments on curved surfaces on low-end devices.
 */
export class PartBuilder {
  readonly unitBox: BoxGeometry;
  private readonly cylinders = new Map<string, BufferGeometry>();
  private readonly spheres = new Map<number, BufferGeometry>();
  private prismGeo: BufferGeometry | null = null;

  constructor(
    private readonly tracker: ResourceTracker,
    /** Multiplier for radial segments (0.5 on low, 1 on medium/high). */
    readonly curveSegments: number,
  ) {
    this.unitBox = tracker.track(new BoxGeometry(1, 1, 1));
  }

  seg(n: number): number {
    return Math.max(3, Math.round(n * this.curveSegments));
  }

  matrix(at: XYZ, rot: XYZ = [0, 0, 0], scale: XYZ = [1, 1, 1]): Matrix4 {
    tmpE.set(rot[0], rot[1], rot[2], 'YXZ');
    tmpQ.setFromEuler(tmpE);
    return tmpM.compose(tmpPos.set(at[0], at[1], at[2]), tmpQ, tmpScale.set(scale[0], scale[1], scale[2]));
  }

  /** Box centred at `at`, size [x, y, z], rotated by `rotY` around Y. */
  box(b: GeometryBatch, at: XYZ, size: XYZ, color: ColorSpec, rot: XYZ = [0, 0, 0]): void {
    b.add(this.unitBox, this.matrix(at, rot, size), color);
  }

  /** Box from min/max corners (axis aligned). */
  boxMinMax(b: GeometryBatch, min: XYZ, max: XYZ, color: ColorSpec): void {
    this.box(
      b,
      [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2],
      [max[0] - min[0], max[1] - min[1], max[2] - min[2]],
      color,
    );
  }

  /** Cylinder (or cone/frustum) centred at `at`, axis along local Y. `taper` = radiusTop / radiusBottom. */
  cylinder(b: GeometryBatch, at: XYZ, radius: number, height: number, color: ColorSpec, o: { segments?: number; taper?: number; rot?: XYZ; scaleZ?: number } = {}): void {
    const segments = this.seg(o.segments ?? 16);
    const taper = o.taper ?? 1;
    const key = `${segments}:${taper.toFixed(3)}`;
    let geo = this.cylinders.get(key);
    if (!geo) {
      geo = this.tracker.track(new CylinderGeometry(taper, 1, 1, segments, 1, false));
      this.cylinders.set(key, geo);
    }
    b.add(geo, this.matrix(at, o.rot, [radius, height, radius * (o.scaleZ ?? 1)]), color);
  }

  sphere(b: GeometryBatch, at: XYZ, radius: XYZ | number, color: ColorSpec, segments = 16, rot: XYZ = [0, 0, 0]): void {
    const s = this.seg(segments);
    let geo = this.spheres.get(s);
    if (!geo) {
      geo = this.tracker.track(new SphereGeometry(1, s, Math.max(3, Math.round(s * 0.66))));
      this.spheres.set(s, geo);
    }
    const r: XYZ = typeof radius === 'number' ? [radius, radius, radius] : radius;
    b.add(geo, this.matrix(at, rot, r), color);
  }

  /**
   * Triangular prism: cross-section is the triangle (−0.5,0) (0.5,0) (0,1) in local XY, extruded from z −0.5 to 0.5.
   * Scaled, it makes gables and roof ridges.
   */
  prism(b: GeometryBatch, at: XYZ, size: XYZ, color: ColorSpec, rot: XYZ = [0, 0, 0]): void {
    if (!this.prismGeo) this.prismGeo = this.tracker.track(buildPrism());
    b.add(this.prismGeo, this.matrix(at, rot, size), color);
  }

  /** Adds an arbitrary (tracked by the caller) geometry. */
  custom(b: GeometryBatch, geo: BufferGeometry, at: XYZ, color: ColorSpec, rot: XYZ = [0, 0, 0], scale: XYZ = [1, 1, 1]): void {
    b.add(geo, this.matrix(at, rot, scale), color);
  }
}

function buildPrism(): BufferGeometry {
  const A = [-0.5, 0];
  const B = [0.5, 0];
  const C = [0, 1];
  const tri = (p: number[], z: number) => [p[0], p[1], z];
  const quads: number[][][] = [
    [tri(A, -0.5), tri(B, -0.5), tri(B, 0.5), tri(A, 0.5)], // bottom
    [tri(B, -0.5), tri(C, -0.5), tri(C, 0.5), tri(B, 0.5)], // right slope
    [tri(C, -0.5), tri(A, -0.5), tri(A, 0.5), tri(C, 0.5)], // left slope
  ];
  const pos: number[] = [];
  for (const [a, b, c, d] of quads) pos.push(...a, ...b, ...c, ...a, ...c, ...d);
  // Caps (front/back triangles).
  pos.push(...tri(A, 0.5), ...tri(B, 0.5), ...tri(C, 0.5));
  pos.push(...tri(A, -0.5), ...tri(C, -0.5), ...tri(B, -0.5));
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  g.computeVertexNormals();
  return g;
}
