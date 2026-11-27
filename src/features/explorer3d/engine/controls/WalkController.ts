import { Euler } from 'three';
import type { CollisionWorld, Feet } from '../collision';
import type { SceneRenderer } from '../SceneRenderer';
import type { SpawnDef } from '../../types';

const euler = new Euler(0, 0, 0, 'YXZ');
const MOVE_KEYS: Record<string, [number, number]> = {
  KeyW: [0, 1],
  ArrowUp: [0, 1],
  KeyS: [0, -1],
  ArrowDown: [0, -1],
  KeyA: [-1, 0],
  ArrowLeft: [-1, 0],
  KeyD: [1, 0],
  ArrowRight: [1, 0],
};

function isFormField(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
}

export interface WalkOptions {
  eyeHeight: number;
  walkSpeed: number;
  runSpeed: number;
  /** Look sensitivity, radians per pixel. */
  lookSpeed: number;
  onPointerLockChange?: (locked: boolean) => void;
  /** Called once per rendered frame while walking (zone tracking); keep it cheap. */
  onMove?: (feet: Readonly<Feet>) => void;
}

const DEFAULTS: WalkOptions = { eyeHeight: 1.62, walkSpeed: 3.4, runSpeed: 6.5, lookSpeed: 0.0026 };

/**
 * Exploration mode: first-person walking with collisions.
 *  - desktop: WASD/arrows (+Shift to run), mouse look with pointer lock (requested only by an explicit click on the
 *    canvas, released with Esc by the browser) or drag-to-look without lock;
 *  - touch: `setJoystick()` from the virtual joystick, drag on the canvas to look.
 * Renders only while something moves (keys held, joystick, inertia, falling).
 */
export class WalkController {
  readonly feet: Feet = { x: 0, y: 0, z: 0 };
  yaw = 0;
  pitch = 0;
  private enabled = false;
  private readonly keys = new Set<string>();
  private run = false;
  private joy: [number, number] = [0, 0];
  private vx = 0;
  private vz = 0;
  private locked = false;
  private drag: { id: number; x: number; y: number } | null = null;
  private readonly opts: WalkOptions;
  private readonly removeHook: () => void;
  private readonly cleanups: Array<() => void> = [];

  constructor(
    private readonly view: SceneRenderer,
    private readonly world: CollisionWorld,
    opts: Partial<WalkOptions> = {},
  ) {
    this.opts = { ...DEFAULTS, ...opts };
    this.removeHook = view.addFrameHook((dt) => this.step(dt));
    const canvas = view.canvas;
    this.on(window, 'keydown', (e) => this.onKey(e as KeyboardEvent, true));
    this.on(window, 'keyup', (e) => this.onKey(e as KeyboardEvent, false));
    this.on(window, 'blur', () => {
      this.keys.clear();
      this.run = false;
    });
    this.on(document, 'pointerlockchange', () => {
      this.locked = document.pointerLockElement === canvas;
      this.opts.onPointerLockChange?.(this.locked);
    });
    this.on(document, 'mousemove', (e) => {
      if (!this.enabled || !this.locked) return;
      const m = e as MouseEvent;
      this.look(m.movementX, m.movementY);
    });
    this.on(canvas, 'pointerdown', (e) => {
      if (!this.enabled || this.locked) return;
      const p = e as PointerEvent;
      this.drag = { id: p.pointerId, x: p.clientX, y: p.clientY };
    });
    this.on(window, 'pointermove', (e) => {
      const p = e as PointerEvent;
      if (!this.enabled || !this.drag || p.pointerId !== this.drag.id) return;
      this.look(p.clientX - this.drag.x, p.clientY - this.drag.y);
      this.drag.x = p.clientX;
      this.drag.y = p.clientY;
    });
    const endDrag = (e: Event) => {
      if (this.drag && (e as PointerEvent).pointerId === this.drag.id) this.drag = null;
    };
    this.on(window, 'pointerup', endDrag);
    this.on(window, 'pointercancel', endDrag);
  }

  private on(target: EventTarget, type: string, fn: (e: Event) => void): void {
    target.addEventListener(type, fn);
    this.cleanups.push(() => target.removeEventListener(type, fn));
  }

  private onKey(e: KeyboardEvent, down: boolean): void {
    if (!this.enabled || isFormField(e.target)) return;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.run = down;
    if (!(e.code in MOVE_KEYS)) return;
    e.preventDefault();
    if (down) this.keys.add(e.code);
    else this.keys.delete(e.code);
    this.view.requestRender();
  }

  /** Explicit user gesture only (a click on the canvas): pointer lock is never requested automatically. */
  requestPointerLock(): void {
    if (!this.enabled || this.locked) return;
    const req = this.view.canvas.requestPointerLock?.bind(this.view.canvas);
    try {
      const r = req?.() as unknown;
      if (r && typeof (r as Promise<void>).catch === 'function') (r as Promise<void>).catch(() => undefined);
    } catch {
      /* unsupported (iframes, some mobiles): drag-to-look still works */
    }
  }

  get pointerLocked(): boolean {
    return this.locked;
  }

  look(dxPx: number, dyPx: number): void {
    this.yaw -= dxPx * this.opts.lookSpeed;
    this.pitch = Math.max(-1.35, Math.min(1.35, this.pitch - dyPx * this.opts.lookSpeed));
    this.applyCamera();
    this.view.requestRender();
  }

  setJoystick(x: number, y: number): void {
    this.joy = [x, y];
    if (x || y) this.view.requestRender();
  }

  enable(spawn: SpawnDef): void {
    this.enabled = true;
    this.teleport(spawn);
  }

  teleport(spawn: SpawnDef): void {
    this.feet.x = spawn.position[0];
    this.feet.y = spawn.position[1];
    this.feet.z = spawn.position[2];
    this.yaw = spawn.yaw;
    this.pitch = 0;
    this.vx = this.vz = 0;
    this.world.resetMotion();
    this.applyCamera();
    this.opts.onMove?.(this.feet);
    this.view.requestRender();
  }

  disable(): void {
    this.enabled = false;
    this.keys.clear();
    this.joy = [0, 0];
    this.drag = null;
    if (this.locked) document.exitPointerLock?.();
  }

  private applyCamera(): void {
    const cam = this.view.camera;
    cam.position.set(this.feet.x, this.feet.y + this.opts.eyeHeight, this.feet.z);
    euler.set(this.pitch, this.yaw, 0);
    cam.quaternion.setFromEuler(euler);
  }

  private step(dt: number): boolean {
    if (!this.enabled) return false;
    let ix = this.joy[0];
    let iz = this.joy[1];
    for (const k of this.keys) {
      ix += MOVE_KEYS[k][0];
      iz += MOVE_KEYS[k][1];
    }
    const len = Math.hypot(ix, iz);
    if (len > 1) {
      ix /= len;
      iz /= len;
    }
    const speed = this.run ? this.opts.runSpeed : this.opts.walkSpeed;
    const sin = Math.sin(this.yaw);
    const cos = Math.cos(this.yaw);
    // forward = (−sin, −cos), right = (cos, −sin)
    const tx = (ix * cos - iz * sin) * speed;
    const tz = (-ix * sin - iz * cos) * speed;
    const k = Math.min(1, dt * 10);
    this.vx += (tx - this.vx) * k;
    this.vz += (tz - this.vz) * k;
    if (Math.abs(this.vx) < 0.01) this.vx = 0;
    if (Math.abs(this.vz) < 0.01) this.vz = 0;
    const moving = this.vx !== 0 || this.vz !== 0;
    if (moving || this.world.falling) {
      this.world.move(this.feet, this.vx * dt, this.vz * dt, dt);
      this.applyCamera();
      this.opts.onMove?.(this.feet);
    }
    return moving || len > 0 || this.world.falling;
  }

  dispose(): void {
    this.disable();
    this.removeHook();
    for (const c of this.cleanups.splice(0)) c();
  }
}
