import type { ReactNode } from 'react';
import { AbsoluteFill, Img, staticFile, useVideoConfig } from 'remotion';
import type { Camera } from '../lib/camera';
import { COLORS } from '../lib/theme';

const OVERLAY_MASK = 'linear-gradient(to bottom, transparent 0%, transparent 13%, black 21%, black 100%)';

export type MapStageMap = { width: number; height: number; backgroundSrc?: string; boundaries: string[] };

/**
 * Native map renderer for videos (NOT a screenshot, NOT the site's React Flow
 * canvas, which is tied to browser interaction): the world-map image of the
 * level + its boundary paths, in the SAME viewBox as the site's pin
 * coordinates, moved by a camera. Image graded darker so the red route pops.
 */
export function MapStage({ map, camera, opacity = 1, blur = 0, children }: {
  map: MapStageMap;
  camera: Camera;
  opacity?: number;
  blur?: number;
  children?: ReactNode;
}) {
  const { width } = useVideoConfig();
  const tx = width / 2 - camera.x * camera.zoom;
  const ty = camera.fy - camera.y * camera.zoom;
  const edge = Math.max(map.width, map.height) * 0.05;

  return (
    <AbsoluteFill style={{ opacity, filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: map.width,
          height: map.height,
          transformOrigin: '0 0',
          transform: `translate(${tx}px, ${ty}px) scale(${camera.zoom})`,
        }}
      >
        {map.backgroundSrc ? (
          <>
            <Img src={staticFile(map.backgroundSrc)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
            {/* Dark grade as an overlay (a CSS filter would be re-rasterized every frame). */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,10,14,0.5)' }} />
          </>
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: COLORS.ink800 }} />
        )}
        <svg viewBox={`0 0 ${map.width} ${map.height}`} width={map.width} height={map.height} style={{ position: 'absolute', inset: 0 }}>
          {map.boundaries.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={1.4} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          ))}
        </svg>
        {/* Soft edges: the map dissolves into the backdrop instead of ending on a hard line (cheap gradients, no blur). */}
        {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
          <div
            key={side}
            style={{
              position: 'absolute',
              [side]: 0,
              ...(side === 'top' || side === 'bottom' ? { left: 0, right: 0, height: edge } : { top: 0, bottom: 0, width: edge }),
              background: `linear-gradient(to ${{ top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[side]}, ${COLORS.ink950}, transparent)`,
            }}
          />
        ))}
      </div>
      {/* Screen-space vignette + top/bottom shade for text legibility. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${COLORS.ink950} 0%, ${COLORS.ink950}cc 13%, transparent 30%, transparent 60%, ${COLORS.ink950}cc 80%, ${COLORS.ink950} 100%)`,
        }}
      />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 85% 70% at 50% 46%, transparent 55%, rgba(0,0,0,0.55) 100%)' }} />
      {/* Overlays (route, pins, labels) fade out under the header so a long leg never crosses the title. */}
      <AbsoluteFill style={{ maskImage: OVERLAY_MASK, WebkitMaskImage: OVERLAY_MASK }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
}
