import {
  BackSide,
  Color,
  DataTexture,
  LineBasicMaterial,
  MeshBasicMaterial,
  MeshToonMaterial,
  NearestFilter,
  RGBAFormat,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
} from 'three';
import type { ResourceTracker } from '../engine/resources';

/**
 * The shared, cel-shaded material kit of a viewer session. Few materials on purpose: every architectural part is
 * vertex-coloured, so a whole zone collapses into one or two draw calls whatever its number of parts.
 * Everything is procedural (a 4-texel gradient ramp, shader code): no image file is loaded.
 */
export interface MaterialKit {
  /** Lit, cel-shaded, vertex-coloured (walls, hulls, furniture). */
  toon: MeshToonMaterial;
  /** Unlit, vertex-coloured: window glass, lamps, flames (they "glow" without lights). */
  glow: MeshBasicMaterial;
  /** Ink lines on hard edges (EdgesGeometry). */
  ink: LineBasicMaterial;
  /** Ink silhouette for smooth shapes (inverted hull, shares the geometry of the mesh it outlines). */
  outline: ShaderMaterial;
}

/** 4-band light ramp: the "anime" look of MeshToonMaterial comes from this texture. */
function gradientRamp(tracker: ResourceTracker): DataTexture {
  // Soft anime shading: the darkest band stays readable (reference: lit, colourful surfaces even in shade).
  const tones = [128, 178, 228, 255];
  const data = new Uint8Array(tones.length * 4);
  tones.forEach((v, i) => data.set([v, v, v, 255], i * 4));
  const tex = tracker.track(new DataTexture(data, tones.length, 1, RGBAFormat));
  tex.minFilter = NearestFilter;
  tex.magFilter = NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

export const INK_COLOR = new Color('#2b1d16');

export function createMaterialKit(tracker: ResourceTracker): MaterialKit {
  const gradientMap = gradientRamp(tracker);
  const toon = tracker.track(new MeshToonMaterial({ vertexColors: true, gradientMap }));
  const glow = tracker.track(new MeshBasicMaterial({ vertexColors: true }));
  const ink = tracker.track(new LineBasicMaterial({ color: INK_COLOR, transparent: true, opacity: 0.85 }));
  const outline = tracker.track(
    new ShaderMaterial({
      uniforms: UniformsUtils.merge([UniformsLib.fog, { uColor: { value: INK_COLOR.clone() }, uThickness: { value: 0.07 } }]),
      vertexShader: /* glsl */ `
        uniform float uThickness;
        #include <fog_pars_vertex>
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position + normal * uThickness, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        #include <fog_pars_fragment>
        void main() {
          gl_FragColor = vec4(uColor, 1.0);
          #include <colorspace_fragment>
          #include <fog_fragment>
        }`,
      side: BackSide,
      fog: true,
    }),
  );
  return { toon, glow, ink, outline };
}
