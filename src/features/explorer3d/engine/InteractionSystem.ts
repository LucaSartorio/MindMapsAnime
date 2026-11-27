import { CanvasTexture, Group, Raycaster, SRGBColorSpace, Sprite, SpriteMaterial, Vector2, type Camera } from 'three';
import type { HotspotDef, HotspotEntityType } from '../types';
import type { ResourceTracker } from './resources';

/** Marker colour + glyph per entity type: shape AND colour differ (state is never colour-only). */
const STYLE: Record<HotspotEntityType, { color: string; glyph: 'person' | 'diamond' | 'book' | 'pin' | 'flag' }> = {
  character: { color: '#1f7ae0', glyph: 'person' },
  event: { color: '#d9480f', glyph: 'diamond' },
  arc: { color: '#7c3aed', glyph: 'book' },
  place: { color: '#0f9d58', glyph: 'pin' },
  faction: { color: '#b7791f', glyph: 'flag' },
};

function markerTexture(tracker: ResourceTracker, type: HotspotEntityType): CanvasTexture {
  const size = 96;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const { color, glyph } = STYLE[type];
  g.beginPath();
  g.arc(48, 48, 42, 0, Math.PI * 2);
  g.fillStyle = '#ffffff';
  g.fill();
  g.beginPath();
  g.arc(48, 48, 35, 0, Math.PI * 2);
  g.fillStyle = color;
  g.fill();
  g.fillStyle = '#ffffff';
  g.beginPath();
  if (glyph === 'person') {
    g.arc(48, 38, 10, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.ellipse(48, 66, 17, 11, 0, Math.PI, 0);
    g.fill();
  } else if (glyph === 'diamond') {
    g.moveTo(48, 24);
    g.lineTo(70, 48);
    g.lineTo(48, 72);
    g.lineTo(26, 48);
    g.fill();
  } else if (glyph === 'book') {
    g.fillRect(28, 30, 18, 36);
    g.fillRect(50, 30, 18, 36);
  } else if (glyph === 'pin') {
    g.arc(48, 42, 14, Math.PI, 0);
    g.lineTo(48, 72);
    g.fill();
  } else {
    g.fillRect(32, 26, 5, 46);
    g.fillRect(37, 26, 28, 18);
  }
  const tex = tracker.track(new CanvasTexture(c));
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 1;
  return tex;
}

const raycaster = new Raycaster();
const ndc = new Vector2();

/**
 * Hotspot markers (screen-sized sprites, depth-tested so walls hide them) + picking. One texture/material per entity
 * type, shared by every marker of that type. Picking runs on click/tap only, never per frame.
 */
export class HotspotLayer {
  readonly group = new Group();
  private readonly sprites = new Map<string, Sprite>();
  private selected: string | null = null;
  static readonly SIZE = 0.05;

  constructor(tracker: ResourceTracker, hotspots: readonly HotspotDef[]) {
    this.group.name = 'hotspots';
    const materials = new Map<HotspotEntityType, SpriteMaterial>();
    for (const h of hotspots) {
      let mat = materials.get(h.entity.type);
      if (!mat) {
        mat = tracker.track(new SpriteMaterial({ map: markerTexture(tracker, h.entity.type), sizeAttenuation: false, depthWrite: false }));
        materials.set(h.entity.type, mat);
      }
      const s = new Sprite(mat);
      s.position.set(...h.position);
      s.scale.setScalar(HotspotLayer.SIZE);
      s.renderOrder = 10;
      s.userData.hotspotId = h.id;
      s.name = `hotspot:${h.id}`;
      this.sprites.set(h.id, s);
      this.group.add(s);
    }
  }

  /** Hotspot under a canvas point (client coordinates), or null. */
  pick(clientX: number, clientY: number, canvas: HTMLCanvasElement, camera: Camera): string | null {
    const r = canvas.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects([...this.sprites.values()].filter((s) => s.visible), false)[0];
    return (hit?.object.userData.hotspotId as string | undefined) ?? null;
  }

  /** Hotspot at the centre of the view (pointer-lock crosshair). */
  pickCenter(camera: Camera): string | null {
    ndc.set(0, 0);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects([...this.sprites.values()].filter((s) => s.visible), false)[0];
    return (hit?.object.userData.hotspotId as string | undefined) ?? null;
  }

  select(id: string | null): void {
    if (this.selected) this.sprites.get(this.selected)?.scale.setScalar(HotspotLayer.SIZE);
    this.selected = id;
    if (id) this.sprites.get(id)?.scale.setScalar(HotspotLayer.SIZE * 1.45);
  }
}
