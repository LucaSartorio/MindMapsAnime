import { Group, Vector3 } from 'three';
import type { HotspotDef, QualityLevel, QualityPreference, SceneDefinition, SpawnDef, ZoneDef } from '../types';
import { createMaterialKit } from '../materials/toon';
import { CollisionWorld, type Feet } from './collision';
import { OrbitCameraController } from './controls/OrbitCameraController';
import { WalkController } from './controls/WalkController';
import { HotspotLayer } from './InteractionSystem';
import { AutoQualityController, QUALITY_PRESETS, initialAutoLevel, resolveQuality, type DeviceHints } from './quality';
import { createRandom } from './random';
import { ResourceTracker } from './resources';
import { SceneRenderer, type RendererStats } from './SceneRenderer';
import type { SceneBuild, SceneModule, ZoneBuild } from './sceneModule';

export type ExplorerMode = 'observe' | 'explore';

export interface SessionTimings {
  rendererInitMs: number;
  buildMs: number;
  firstFrameMs: number;
  interiorBuildMs: Record<string, number>;
}

export interface SessionEvents {
  onZoneChange?: (zone: ZoneDef | null) => void;
  onModeChange?: (mode: ExplorerMode) => void;
  onPointerLockChange?: (locked: boolean) => void;
  onQualityChange?: (level: QualityLevel, struggling: boolean) => void;
  onSelect?: (hotspotId: string | null) => void;
  onContextLost?: () => void;
}

export interface SessionOptions {
  preference: QualityPreference;
  reducedMotion: boolean;
  locationName: string;
  events: SessionEvents;
}

const tmp = new Vector3();

/** Smallest zone containing the point (interiors are smaller than the exterior that contains them). */
export function zoneAt(def: SceneDefinition, p: Feet): ZoneDef | null {
  let best: ZoneDef | null = null;
  let bestVol = Infinity;
  for (const z of def.zones) {
    const { min, max } = z.bounds;
    if (p.x < min[0] || p.x > max[0] || p.y < min[1] - 0.2 || p.y > max[1] || p.z < min[2] || p.z > max[2]) continue;
    const vol = (max[0] - min[0]) * (max[1] - min[1]) * (max[2] - min[2]);
    if (vol < bestVol) {
      best = z;
      bestVol = vol;
    }
  }
  return best;
}

function deviceHints(view: SceneRenderer): DeviceHints {
  const gl = view.renderer.getContext();
  let software = false;
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    software = /swiftshader|llvmpipe|software/i.test(name);
  } catch {
    /* masked */
  }
  const dpr = window.devicePixelRatio || 1;
  return {
    cores: navigator.hardwareConcurrency,
    memoryGb: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
    coarsePointer: window.matchMedia?.('(pointer: coarse)').matches ?? false,
    pixels: window.innerWidth * window.innerHeight * dpr * dpr,
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) as number,
    softwareRenderer: software,
  };
}

/**
 * One open viewer = one session: renderer + one built scene + controllers. Owns every listener, timer and GPU
 * resource it creates and releases them in `dispose()`. React only receives events (zone/lock/quality/selection
 * changes), never per-frame updates.
 */
export class ExplorerSession {
  readonly view: SceneRenderer;
  readonly def: SceneDefinition;
  mode: ExplorerMode = 'observe';
  level: QualityLevel;
  readonly timings: SessionTimings = { rendererInitMs: 0, buildMs: 0, firstFrameMs: 0, interiorBuildMs: {} };

  private tracker = new ResourceTracker();
  private build!: SceneBuild;
  private content = new Group();
  private hotspots!: HotspotLayer;
  private world = new CollisionWorld();
  private orbit!: OrbitCameraController;
  private walk!: WalkController;
  private readonly interiors = new Map<string, ZoneBuild>();
  private auto: AutoQualityController | null = null;
  private preference: QualityPreference;
  private struggling = false;
  private zone: ZoneDef | null = null;
  private pointer: { x: number; y: number; t: number } | null = null;
  /** Listeners of the session (canvas taps): removed in `dispose()`. */
  private readonly sessionCleanups: Array<() => void> = [];
  /** Hooks of the current build: removed on every rebuild. */
  private readonly buildCleanups: Array<() => void> = [];
  private disposed = false;

  constructor(
    host: HTMLElement,
    private readonly module: SceneModule,
    private readonly opts: SessionOptions,
  ) {
    const t0 = performance.now();
    this.def = module.definition;
    this.preference = opts.preference;
    this.view = new SceneRenderer(host, {
      // MSAA only where it pays: explicit medium/high, or auto on a fine pointer with a low-DPR screen.
      antialias:
        opts.preference === 'medium' ||
        opts.preference === 'high' ||
        (opts.preference === 'auto' && (window.devicePixelRatio || 1) < 2 && !(window.matchMedia?.('(pointer: coarse)').matches ?? false)),
      onContextLost: () => opts.events.onContextLost?.(),
      onContextRestored: () => undefined,
    });
    this.timings.rendererInitMs = performance.now() - t0;
    const autoLevel = initialAutoLevel(deviceHints(this.view));
    this.level = resolveQuality(opts.preference, autoLevel);
    if (opts.preference === 'auto') this.auto = new AutoQualityController(autoLevel);
    this.view.onFrameTime = (ms) => this.onFrameTime(ms);
    this.view.scene.add(this.content);
    this.buildScene();

    const canvas = this.view.canvas;
    const down = (e: Event) => {
      const p = e as PointerEvent;
      this.pointer = { x: p.clientX, y: p.clientY, t: performance.now() };
    };
    const up = (e: Event) => {
      const p = e as PointerEvent;
      const start = this.pointer;
      this.pointer = null;
      if (!start || Math.hypot(p.clientX - start.x, p.clientY - start.y) > 6 || performance.now() - start.t > 450) return;
      this.onTap(p.clientX, p.clientY);
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointerup', up);
    this.sessionCleanups.push(() => {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointerup', up);
    });

    const tFrame = performance.now();
    const removeFirst = this.view.addFrameHook(() => {
      this.timings.firstFrameMs = performance.now() - tFrame;
      removeFirst();
    });
    this.view.requestRender();
  }

  /** (Re)builds the scene content at the current level, reusing the WebGL context. */
  private buildScene(): void {
    const t0 = performance.now();
    const quality = QUALITY_PRESETS[this.level];
    const prevPose = this.orbit ? { pos: this.view.camera.position.clone(), target: this.orbit.controls.target.clone() } : null;
    const prevWalk = this.walk ? { ...this.walk.feet, yaw: this.walk.yaw } : null;
    this.teardownContent();

    this.tracker = new ResourceTracker();
    const materials = createMaterialKit(this.tracker);
    this.build = this.module.build({
      level: this.level,
      quality,
      tracker: this.tracker,
      materials,
      random: createRandom(this.def.seed),
      reducedMotion: this.opts.reducedMotion,
      locationName: this.opts.locationName,
    });
    this.content.add(this.build.root);
    this.world = new CollisionWorld();
    this.world.add(this.build.colliders);
    this.hotspots = new HotspotLayer(this.tracker, this.def.hotspots);
    this.content.add(this.hotspots.group);

    this.orbit = new OrbitCameraController(this.view, this.def.camera, this.def.bounds, this.opts.reducedMotion);
    this.walk = new WalkController(this.view, this.world, {
      onPointerLockChange: (l) => this.opts.events.onPointerLockChange?.(l),
      onMove: (feet) => this.onWalk(feet),
    });
    const removeLod = this.view.addFrameHook((_dt, t) => {
      this.updateDetails();
      for (const a of this.build.animate) a(t);
      return false;
    });
    this.buildCleanups.push(removeLod);

    this.applyRuntimeQuality();
    if (prevPose) {
      this.view.camera.position.copy(prevPose.pos);
      this.orbit.controls.target.copy(prevPose.target);
    } else {
      this.orbit.reset();
    }
    this.timings.buildMs = performance.now() - t0;
    if (this.mode === 'explore') {
      this.mode = 'observe';
      this.setMode('explore');
      if (prevWalk) this.walk.teleport({ id: 'restore', zone: '', position: [prevWalk.x, prevWalk.y, prevWalk.z], yaw: prevWalk.yaw });
    } else {
      this.orbit.enable();
    }
    this.view.requestRender();
  }

  private teardownContent(): void {
    this.orbit?.dispose();
    this.walk?.dispose();
    for (const c of this.buildCleanups.splice(0)) c();
    this.content.clear();
    this.interiors.clear();
    this.tracker.disposeAll();
  }

  private applyRuntimeQuality(): void {
    const q = QUALITY_PRESETS[this.level];
    this.view.setPixelRatio(q.dprMin, q.dprMax);
    this.view.setShadows(q.shadows);
    const fog = this.view.scene.fog as { far: number; near: number } | null;
    if (fog) {
      fog.far = q.fogFar;
      fog.near = q.fogFar * 0.25;
    }
    this.view.scene.traverse((o) => {
      if (o.name.endsWith(':ink') || o.name.endsWith(':outline')) o.visible = q.outlines;
    });
    this.view.requestRender();
  }

  private updateDetails(): void {
    const max = QUALITY_PRESETS[this.level].detailDistance;
    const cam = this.view.camera.position;
    for (const d of this.build.details) d.object.visible = tmp.copy(d.center).distanceTo(cam) < max;
  }

  private onFrameTime(ms: number): void {
    if (!this.auto) return;
    const next = this.auto.sample(ms);
    const struggling = this.auto.struggling;
    if (next) {
      this.level = next;
      this.applyRuntimeQuality();
    }
    // Events only on transitions: never one React update per frame.
    if (next || struggling !== this.struggling) {
      this.struggling = struggling;
      this.opts.events.onQualityChange?.(this.level, struggling);
    }
  }

  private onWalk(feet: Readonly<Feet>): void {
    // Zone loading: build an interior group the first time the player approaches it.
    for (const [key, group] of Object.entries(this.build.interiors)) {
      if (this.interiors.has(key)) continue;
      const zones = this.def.zones.filter((z) => group.zones.includes(z.id));
      const near = zones.some((z) => {
        const { min, max } = z.bounds;
        const m = 8;
        return feet.x > min[0] - m && feet.x < max[0] + m && feet.z > min[2] - m && feet.z < max[2] + m;
      });
      if (near) this.loadInterior(key, group.build);
    }
    const z = zoneAt(this.def, feet);
    if (z?.id !== this.zone?.id) {
      this.zone = z;
      this.opts.events.onZoneChange?.(z);
    }
  }

  private loadInterior(key: string, factory: () => ZoneBuild): void {
    const t0 = performance.now();
    const zb = factory();
    this.interiors.set(key, zb);
    this.world.add(zb.colliders);
    zb.object.visible = this.mode === 'explore';
    this.content.add(zb.object);
    this.timings.interiorBuildMs[key] = Math.round(performance.now() - t0);
    this.applyRuntimeQuality();
  }

  private onTap(x: number, y: number): void {
    if (this.mode === 'explore' && this.walk.pointerLocked) {
      this.select(this.hotspots.pickCenter(this.view.camera));
      return;
    }
    const id = this.hotspots.pick(x, y, this.view.canvas, this.view.camera);
    if (id) this.select(id);
    else if (this.mode === 'explore') this.walk.requestPointerLock();
  }

  select(id: string | null): void {
    this.hotspots.select(id);
    this.view.requestRender();
    this.opts.events.onSelect?.(id);
  }

  setMode(mode: ExplorerMode): void {
    if (mode === this.mode) return;
    this.mode = mode;
    this.opts.events.onModeChange?.(mode);
    if (mode === 'explore') {
      this.orbit.disable();
      this.walk.enable(this.spawn(this.def.defaultSpawn));
      for (const zb of this.interiors.values()) zb.object.visible = true;
    } else {
      this.walk.disable();
      for (const zb of this.interiors.values()) zb.object.visible = false;
      this.orbit.reset();
      this.orbit.enable();
      this.zone = null;
      this.opts.events.onZoneChange?.(null);
    }
    this.view.requestRender();
  }

  private spawn(id: string): SpawnDef {
    return this.def.spawns.find((s) => s.id === id) ?? this.def.spawns[0];
  }

  resetView(): void {
    if (this.mode === 'observe') this.orbit.reset();
    else this.walk.teleport(this.spawn(this.def.defaultSpawn));
  }

  /** Brings a hotspot into view: orbit focus outdoors; indoors, walk to the zone's spawn facing the marker. */
  focusHotspot(id: string): void {
    const h: HotspotDef | undefined = this.def.hotspots.find((x) => x.id === id);
    if (!h) return;
    const zone = this.def.zones.find((z) => z.id === h.zone);
    if (zone?.interior) {
      this.setMode('explore');
      const s = this.def.spawns.find((sp) => sp.zone === h.zone) ?? this.spawn(this.def.defaultSpawn);
      const yaw = Math.atan2(-(h.position[0] - s.position[0]), -(h.position[2] - s.position[2]));
      this.walk.teleport({ ...s, yaw });
    } else if (this.mode === 'observe') {
      this.orbit.focus(h.position);
    } else {
      const s = this.def.spawns.find((sp) => sp.zone === h.zone) ?? this.spawn(this.def.defaultSpawn);
      const yaw = Math.atan2(-(h.position[0] - s.position[0]), -(h.position[2] - s.position[2]));
      this.walk.teleport({ ...s, yaw });
    }
    this.select(id);
  }

  orbitNudge(dTheta: number, dPhi: number, zoom = 1): void {
    if (this.mode === 'observe') this.orbit.nudge(dTheta, dPhi, zoom);
  }

  requestPointerLock(): void {
    this.walk.requestPointerLock();
  }

  setJoystick(x: number, y: number): void {
    this.walk.setJoystick(x, y);
  }

  lookBy(dx: number, dy: number): void {
    this.walk.look(dx, dy);
  }

  setQualityPreference(pref: QualityPreference): void {
    if (pref === this.preference) return;
    this.preference = pref;
    this.struggling = false;
    if (pref === 'auto') {
      this.auto = new AutoQualityController(this.level);
      this.opts.events.onQualityChange?.(this.level, false);
      return;
    }
    this.auto = null;
    if (pref !== this.level) {
      // Explicit choice: rebuild geometry at that level (curve/ocean resolution), same WebGL context.
      this.level = pref;
      this.buildScene();
    }
    this.opts.events.onQualityChange?.(this.level, false);
  }

  stats(): RendererStats & { interiors: string[]; trackedResources: number; mode: ExplorerMode; level: QualityLevel; zone: string | null; feet: Feet; running: boolean } {
    return {
      ...this.view.stats(),
      interiors: [...this.interiors.keys()],
      trackedResources: this.tracker.size,
      mode: this.mode,
      level: this.level,
      zone: this.zone?.id ?? null,
      feet: { ...this.walk.feet },
      running: this.view.running,
    };
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.teardownContent();
    for (const c of this.sessionCleanups.splice(0)) c();
    this.view.dispose();
  }
}
