import {
  AmbientLight,
  BackSide,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  SphereGeometry,
  UniformsLib,
  UniformsUtils,
  Vector2,
  Vector3,
  type Object3D,
} from 'three';
import { GeometryBatch, batchToMesh } from '../engine/batch';
import type { BuildContext } from '../engine/sceneModule';
import { PartBuilder } from './parts';

/** Stylized ocean: toon-banded colour, foam rings around an elliptic footprint, optional vertex waves. */
export interface OceanOptions {
  radius: number;
  deep: string;
  shallow: string;
  foam: string;
  /** Centre and radii (x, z) of the floating structure: foam forms around it. */
  footprintCenter: [number, number];
  footprintRadii: [number, number];
}

export interface AnimatedObject {
  object: Object3D;
  /** Called only on rendered frames (on-demand rendering: idle scene = no updates). */
  update?: (timeSeconds: number) => void;
}

export function createOcean(ctx: BuildContext, o: OceanOptions): AnimatedObject {
  const segments = ctx.quality.oceanSegments;
  const geo = ctx.tracker.track(new PlaneGeometry(o.radius * 2, o.radius * 2, segments, segments));
  geo.rotateX(-Math.PI / 2);
  const waves = segments > 1 && !ctx.reducedMotion;
  const mat = ctx.tracker.track(
    new ShaderMaterial({
      defines: waves ? { WAVES: 1 } : {},
      uniforms: UniformsUtils.merge([
        UniformsLib.fog,
        {
          uTime: { value: 0 },
          uDeep: { value: new Color(o.deep) },
          uShallow: { value: new Color(o.shallow) },
          uFoam: { value: new Color(o.foam) },
          uCenter: { value: new Vector2(...o.footprintCenter) },
          uRadii: { value: new Vector2(...o.footprintRadii) },
          uSun: { value: new Vector3(0.45, 0.8, 0.35).normalize() },
        },
      ]),
      vertexShader: /* glsl */ `
        uniform float uTime;
        varying vec3 vWorld;
        varying float vWave;
        #include <fog_pars_vertex>
        void main() {
          vec3 p = position;
          float w = 0.0;
          #ifdef WAVES
            w = sin(p.x * 0.09 + uTime * 0.8) * 0.35 + sin(p.z * 0.13 - uTime * 1.1) * 0.25
              + sin((p.x + p.z) * 0.21 + uTime * 1.7) * 0.12;
            p.y += w;
          #endif
          vWave = w;
          vec4 world = modelMatrix * vec4(p, 1.0);
          vWorld = world.xyz;
          vec4 mvPosition = viewMatrix * world;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uDeep;
        uniform vec3 uShallow;
        uniform vec3 uFoam;
        uniform vec2 uCenter;
        uniform vec2 uRadii;
        varying vec3 vWorld;
        varying float vWave;
        #include <fog_pars_fragment>
        void main() {
          float d = length((vWorld.xz - uCenter) / uRadii);
          // Toon bands: deep → shallow near the hull and on wave crests.
          float lift = clamp(vWave * 0.9 + 0.35, 0.0, 1.0) * 0.55 + smoothstep(2.6, 1.0, d) * 0.45;
          float band = floor(lift * 3.0) / 3.0;
          vec3 col = mix(uDeep, uShallow, band);
          // Foam: two animated rings hugging the footprint, broken by a cheap pattern.
          float ring = smoothstep(1.06, 1.0, d) * step(0.93, d);
          float ripple = step(0.82, fract(d * 5.0 - uTime * 0.25)) * smoothstep(1.7, 1.05, d);
          float breakup = step(0.35, fract(sin(dot(floor(vWorld.xz * 1.4), vec2(12.9898, 78.233))) * 43758.5453));
          float foam = max(ring, ripple * breakup);
          // Thin stylized wave strokes on the open sea (anime water), drifting slowly.
          vec2 q = vWorld.xz * vec2(0.045, 0.11) + vec2(uTime * 0.02, 0.0);
          float stroke = step(0.955, fract(q.y + sin(q.x * 6.0) * 0.35)) * step(0.68, fract(sin(dot(floor(q * vec2(3.0, 1.0)), vec2(39.3, 11.7))) * 9123.1));
          col = mix(col, mix(col, uFoam, 0.55), stroke * step(1.6, d));
          col = mix(col, uFoam, clamp(foam, 0.0, 1.0));
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
          #include <fog_fragment>
        }`,
      fog: true,
    }),
  );
  const mesh = new Mesh(geo, mat);
  mesh.name = 'ocean';
  mesh.receiveShadow = false;
  return {
    object: mesh,
    update: waves
      ? (t) => {
          mat.uniforms.uTime.value = t;
        }
      : undefined,
  };
}

export interface SkyOptions {
  top: string;
  horizon: string;
  sunDirection: Vector3;
}

export function createSky(ctx: BuildContext, o: SkyOptions): Mesh {
  const geo = ctx.tracker.track(new SphereGeometry(ctx.quality.fogFar * 1.6, 24, 12));
  const mat = ctx.tracker.track(
    new ShaderMaterial({
      uniforms: {
        uTop: { value: new Color(o.top) },
        uHorizon: { value: new Color(o.horizon) },
        uSun: { value: o.sunDirection.clone().normalize() },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop;
        uniform vec3 uHorizon;
        uniform vec3 uSun;
        varying vec3 vDir;
        void main() {
          float h = clamp(vDir.y, 0.0, 1.0);
          vec3 col = mix(uHorizon, uTop, pow(h, 0.55));
          float sun = smoothstep(0.9975, 0.999, dot(vDir, uSun));
          float halo = smoothstep(0.96, 1.0, dot(vDir, uSun)) * 0.25;
          col = mix(col, vec3(1.0, 0.97, 0.88), clamp(sun + halo, 0.0, 1.0));
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`,
      side: BackSide,
      depthWrite: false,
      fog: false,
    }),
  );
  const mesh = new Mesh(geo, mat);
  mesh.name = 'sky';
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  return mesh;
}

/** Puffy toon clouds from merged spheres (one draw call), placed with the scene seed. */
export function createClouds(ctx: BuildContext, count: number, ring: [number, number], height: [number, number]): Object3D | null {
  const pb = new PartBuilder(ctx.tracker, ctx.level === 'low' ? 0.5 : 0.8);
  const b = new GeometryBatch();
  const rnd = ctx.random;
  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2;
    const r = ring[0] + rnd() * (ring[1] - ring[0]);
    const cx = Math.cos(a) * r;
    const cz = Math.sin(a) * r;
    const cy = height[0] + rnd() * (height[1] - height[0]);
    const puffs = 4 + Math.floor(rnd() * 4);
    const size = 8 + rnd() * 10;
    for (let k = 0; k < puffs; k++) {
      const ox = (k - puffs / 2) * size * 0.55;
      const s = size * (0.55 + rnd() * 0.5);
      pb.sphere(b, [cx + ox * Math.cos(a + 1.57), cy + rnd() * size * 0.25, cz + ox * Math.sin(a + 1.57)], [s, s * 0.6, s * 0.8], k % 2 ? '#ffffff' : '#f1f4fb', 10);
    }
  }
  return batchToMesh(b, ctx.tracker, { name: 'clouds', material: ctx.materials.glow });
}

export interface LightRig {
  group: Group;
  sun: DirectionalLight;
}

/** Sun + sky/sea hemisphere fill. Shadows only where the preset allows them, with a tight camera on the subject. */
export function createDaylight(ctx: BuildContext, sunDirection: Vector3, shadowHalfExtent: number): LightRig {
  const group = new Group();
  group.name = 'lights';
  const hemi = new HemisphereLight('#cfe8ff', '#3b6e8f', 1.25);
  const ambient = new AmbientLight('#ffffff', 0.35);
  const sun = ctx.tracker.track(new DirectionalLight('#fff3dd', 2.4)); // dispose() frees its shadow map
  sun.position.copy(sunDirection).multiplyScalar(80);
  sun.target.position.set(0, 0, 0);
  if (ctx.quality.shadows) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(ctx.quality.shadowMapSize, ctx.quality.shadowMapSize);
    const cam = sun.shadow.camera;
    cam.left = -shadowHalfExtent;
    cam.right = shadowHalfExtent;
    cam.top = shadowHalfExtent;
    cam.bottom = -shadowHalfExtent;
    cam.near = 10;
    cam.far = 200;
    sun.shadow.bias = -0.0012;
    sun.shadow.normalBias = 0.09;
  }
  group.add(hemi, ambient, sun, sun.target);
  return { group, sun };
}
