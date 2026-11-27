import { Spherical, Vector3 } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { CameraDef, Box3Def } from '../../types';
import type { SceneRenderer } from '../SceneRenderer';

const tmp = new Vector3();
const sph = new Spherical();
const last = new Vector3();
/** Below this camera travel per frame (metres) inertia is invisible: stop rendering instead of easing for seconds. */
const SETTLE_EPS = 0.004;

/**
 * Observation mode: orbit / zoom / pan around the location (three.js OrbitControls), on-demand rendering with
 * inertia (no inertia under `prefers-reduced-motion`). Keyboard orbit for users who do not drag.
 */
export class OrbitCameraController {
  readonly controls: OrbitControls;
  private interacting = false;
  private enabled = false;
  private stillFrames = 0;
  /** True while the frame hook itself calls `controls.update()`: its 'change' must not request another frame. */
  private inHook = false;
  private readonly removeHook: () => void;

  constructor(
    private readonly view: SceneRenderer,
    private readonly def: CameraDef,
    private readonly bounds: Box3Def,
    reducedMotion: boolean,
  ) {
    const c = new OrbitControls(view.camera, view.canvas);
    c.enableDamping = !reducedMotion;
    c.dampingFactor = 0.09;
    c.minDistance = def.minDistance;
    c.maxDistance = def.maxDistance;
    c.maxPolarAngle = Math.PI / 2 - 0.06; // stay above the horizon / water
    c.screenSpacePanning = true;
    c.zoomToCursor = false;
    c.enabled = false;
    c.addEventListener('change', this.onChange);
    c.addEventListener('start', this.onStart);
    c.addEventListener('end', this.onEnd);
    this.controls = c;
    this.removeHook = view.addFrameHook(() => {
      if (!this.enabled) return false;
      last.copy(view.camera.position);
      this.inHook = true;
      const changed = c.update();
      this.inHook = false;
      this.clampTarget();
      if (this.interacting) {
        this.stillFrames = 0;
        return true;
      }
      // OrbitControls damping decays per frame, so on slow devices it lasts for seconds: end it once the motion is
      // no longer visible (3 frames under SETTLE_EPS).
      this.stillFrames = changed && last.distanceTo(view.camera.position) > SETTLE_EPS ? 0 : this.stillFrames + 1;
      return this.stillFrames < 3;
    });
  }

  private readonly onChange = () => {
    if (!this.inHook) this.view.requestRender();
  };
  private readonly onStart = () => {
    this.interacting = true;
    this.stillFrames = 0;
    this.view.requestRender();
  };
  private readonly onEnd = () => {
    this.interacting = false;
    this.view.requestRender();
  };

  private clampTarget(): void {
    const t = this.controls.target;
    const b = this.bounds;
    t.set(
      Math.min(b.max[0], Math.max(b.min[0], t.x)),
      Math.min(b.max[1], Math.max(0, t.y)),
      Math.min(b.max[2], Math.max(b.min[2], t.z)),
    );
  }

  enable(): void {
    this.enabled = true;
    this.controls.enabled = true;
    this.view.requestRender();
  }

  disable(): void {
    this.enabled = false;
    this.controls.enabled = false;
    this.interacting = false;
  }

  reset(): void {
    this.view.camera.position.set(...this.def.position);
    this.controls.target.set(...this.def.target);
    this.view.camera.lookAt(this.controls.target);
    this.controls.update();
    this.view.requestRender();
  }

  /** Frames a point of interest, keeping the current viewing direction. */
  focus(point: readonly [number, number, number], distance = 16): void {
    const dir = tmp.copy(this.view.camera.position).sub(this.controls.target).normalize();
    this.controls.target.set(...point);
    this.view.camera.position.copy(this.controls.target).addScaledVector(dir, Math.max(this.def.minDistance, distance));
    this.controls.update();
    this.view.requestRender();
  }

  /** Keyboard orbit: angles in radians, `zoom` > 1 moves away. */
  nudge(dTheta: number, dPhi: number, zoom = 1): void {
    const target = this.controls.target;
    tmp.copy(this.view.camera.position).sub(target);
    sph.setFromVector3(tmp);
    sph.theta += dTheta;
    sph.phi = Math.min(this.controls.maxPolarAngle, Math.max(0.15, sph.phi + dPhi));
    sph.radius = Math.min(this.def.maxDistance, Math.max(this.def.minDistance, sph.radius * zoom));
    tmp.setFromSpherical(sph);
    this.view.camera.position.copy(target).add(tmp);
    this.view.camera.lookAt(target);
    this.controls.update();
    this.view.requestRender();
  }

  dispose(): void {
    this.removeHook();
    this.controls.removeEventListener('change', this.onChange);
    this.controls.removeEventListener('start', this.onStart);
    this.controls.removeEventListener('end', this.onEnd);
    this.controls.dispose();
  }
}
