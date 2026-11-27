import { ACESFilmicToneMapping, Fog, PCFSoftShadowMap, PerspectiveCamera, Scene, SRGBColorSpace, WebGLRenderer } from 'three';

export interface RendererStats {
  calls: number;
  triangles: number;
  lines: number;
  points: number;
  /** Live GPU objects as counted by three.js (`renderer.info.memory`): counts, NOT bytes. */
  geometries: number;
  textures: number;
  programs: number;
  frames: number;
  pixelRatio: number;
}

export interface SceneRendererOptions {
  antialias: boolean;
  onContextLost: () => void;
  onContextRestored: () => void;
}

/** A per-frame hook; returning `true` asks for another frame (inertia, movement in progress). */
export type FrameHook = (dt: number, time: number) => boolean | void;

/**
 * Owns the WebGL context of ONE viewer session and its render loop.
 *
 * Rendering is on demand: `requestRender()` draws one frame; `setContinuous(reason, true)` keeps a loop running
 * while at least one reason is active (walking, orbit inertia); hooks may extend it. When nothing changes, no frame
 * is drawn (0 % GPU). Hidden tab → the loop stops. `dispose()` releases the context immediately
 * (`forceContextLoss`), removes every listener and the canvas: after it, nothing of the session survives.
 */
export class SceneRenderer {
  readonly renderer: WebGLRenderer;
  readonly scene = new Scene();
  readonly camera = new PerspectiveCamera(55, 1, 0.1, 2000);
  readonly canvas: HTMLCanvasElement;
  /** Frame-to-frame time of consecutive continuous frames (auto quality input). */
  onFrameTime: ((ms: number) => void) | null = null;

  private raf = 0;
  private dirty = true;
  private lastTime = 0;
  private wasContinuous = false;
  private hidden = false;
  private disposed = false;
  private frames = 0;
  private dprMin = 1;
  private dprMax = 1;
  private readonly continuous = new Set<string>();
  private readonly hooks = new Set<FrameHook>();
  private readonly resizeObserver: ResizeObserver;
  private readonly cleanups: Array<() => void> = [];

  constructor(
    private readonly host: HTMLElement,
    opts: SceneRendererOptions,
  ) {
    this.renderer = new WebGLRenderer({ antialias: opts.antialias, powerPreference: 'high-performance', alpha: false });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.canvas = this.renderer.domElement;
    this.canvas.style.display = 'block';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.touchAction = 'none';
    this.canvas.tabIndex = 0;
    this.canvas.dataset.explorer3d = 'canvas';
    host.appendChild(this.canvas);
    this.scene.fog = new Fog('#bfe1f5', 60, 400);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
    this.resize();

    this.listen(document, 'visibilitychange', () => {
      this.hidden = document.visibilityState === 'hidden';
      if (this.hidden) this.stopLoop();
      else this.schedule();
    });
    this.listen(this.canvas, 'webglcontextlost', (e) => {
      e.preventDefault();
      this.stopLoop();
      opts.onContextLost();
    });
    this.listen(this.canvas, 'webglcontextrestored', () => opts.onContextRestored());
    this.watchPixelRatio();
  }

  /** Re-evaluates DPR when it changes without a resize (window moved to another screen, browser zoom). */
  private watchPixelRatio(): void {
    if (this.disposed || !window.matchMedia) return;
    const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    const onChange = () => {
      mq.removeEventListener('change', onChange);
      this.resize();
      this.watchPixelRatio();
    };
    mq.addEventListener('change', onChange);
    this.cleanups.push(() => mq.removeEventListener('change', onChange));
  }

  private listen<K extends string>(target: EventTarget, type: K, fn: (e: Event) => void): void {
    target.addEventListener(type, fn);
    this.cleanups.push(() => target.removeEventListener(type, fn));
  }

  setPixelRatio(min: number, max: number): void {
    this.dprMin = min;
    this.dprMax = max;
    this.resize();
  }

  setShadows(enabled: boolean): void {
    if (this.renderer.shadowMap.enabled === enabled) return;
    this.renderer.shadowMap.enabled = enabled;
    this.renderer.shadowMap.needsUpdate = true;
    // Materials must be recompiled with/without shadow code.
    this.scene.traverse((o) => {
      const m = (o as { material?: { needsUpdate: boolean } | Array<{ needsUpdate: boolean }> }).material;
      if (Array.isArray(m)) m.forEach((x) => (x.needsUpdate = true));
      else if (m) m.needsUpdate = true;
    });
    this.requestRender();
  }

  private resize(): void {
    if (this.disposed) return;
    const w = Math.max(1, this.host.clientWidth);
    const h = Math.max(1, this.host.clientHeight);
    const dpr = Math.min(this.dprMax, Math.max(this.dprMin, window.devicePixelRatio || 1));
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.requestRender();
  }

  requestRender(): void {
    this.dirty = true;
    this.schedule();
  }

  setContinuous(reason: string, on: boolean): void {
    if (on) this.continuous.add(reason);
    else this.continuous.delete(reason);
    if (on) this.schedule();
  }

  addFrameHook(hook: FrameHook): () => void {
    this.hooks.add(hook);
    return () => this.hooks.delete(hook);
  }

  private schedule(): void {
    if (this.raf || this.hidden || this.disposed) return;
    this.raf = requestAnimationFrame(this.tick);
  }

  private stopLoop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.lastTime = 0;
    this.wasContinuous = false;
  }

  private readonly tick = (now: number): void => {
    this.raf = 0;
    if (this.disposed) return;
    const t = now / 1000;
    const dt = this.lastTime ? Math.min(0.1, t - this.lastTime) : 1 / 60;
    const continuousNow = this.continuous.size > 0;
    let more = false;
    for (const hook of this.hooks) if (hook(dt, t)) more = true;
    this.dirty = false;
    this.renderer.render(this.scene, this.camera);
    this.frames++;
    if (this.onFrameTime && this.wasContinuous && continuousNow && this.lastTime) this.onFrameTime((t - this.lastTime) * 1000);
    this.lastTime = t;
    this.wasContinuous = continuousNow;
    if (more || this.continuous.size > 0 || this.dirty) this.schedule();
    else this.lastTime = 0;
  };

  get running(): boolean {
    return this.raf !== 0;
  }

  stats(): RendererStats {
    const i = this.renderer.info;
    return {
      calls: i.render.calls,
      triangles: i.render.triangles,
      lines: i.render.lines,
      points: i.render.points,
      geometries: i.memory.geometries,
      textures: i.memory.textures,
      programs: i.programs?.length ?? 0,
      frames: this.frames,
      pixelRatio: this.renderer.getPixelRatio(),
    };
  }

  /** Stops everything and releases the WebGL context. Resources owned by the scene are freed by its tracker first. */
  dispose(): void {
    if (this.disposed) return;
    this.stopLoop();
    this.disposed = true;
    this.hooks.clear();
    this.continuous.clear();
    this.onFrameTime = null;
    this.resizeObserver.disconnect();
    for (const c of this.cleanups.splice(0)) c();
    this.scene.clear();
    this.renderer.renderLists.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.canvas.remove();
  }
}
