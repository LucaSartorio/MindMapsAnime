import { useMemo } from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../../components/Backdrop';
import { CallToAction } from '../../components/CallToAction';
import { Hook } from '../../components/Hook';
import { Kicker } from '../../components/Kicker';
import { LocationMarker } from '../../components/LocationMarker';
import { MapStage } from '../../components/MapStage';
import { Reveal } from '../../components/Reveal';
import { RouteLayer } from '../../components/RouteLayer';
import { CountUp, VersusBars } from '../../components/Versus';
import { cameraAt, clampToMap, fitCamera, keepInView, toScreen, type CameraKey } from '../../lib/camera';
import { easeInOut, lerp, progress } from '../../lib/easing';
import { fillTemplate } from '../../config/copy';
import { fitFontSize, useBrandFonts } from '../../lib/fonts';
import { boundsOf, buildLeg } from '../../lib/geometry';
import { COLORS, FONTS, SAFE } from '../../lib/theme';
import type { Span } from '../characterJourney/timeline';
import { planVersus } from './timeline';
import type { CharacterVersusData, CharacterVersusProps, VersusSide } from './types';

export function versusVideoText(d: CharacterVersusData): string {
  return [d.hook, d.cta, d.siteLabel, ...Object.values(d.copy), ...[d.a, d.b].flatMap((s) => [s.name, s.worldTitle, s.map.name, String(s.places)]), 'VS'].join(' ');
}

const BOX = { w: 780, h: 760, fy: 900 };
const SAFE_BOX = { left: 140, right: 940, top: 560, bottom: 1300 };

/** One side: its world map, the journey drawn quickly, the places counter. */
function SideScene({ side, span, copy }: { side: VersusSide; span: Span; copy: CharacterVersusData['copy'] }) {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const legs = useMemo(() => side.route.slice(1).map((p, i) => buildLeg(side.route[i], p)), [side.route]);
  const keys = useMemo<CameraKey[]>(() => {
    const overview = { x: side.map.width / 2, y: side.map.height / 2, zoom: (width / side.map.width) * 1.1, fy: 900 };
    const fitted = fitCamera(boundsOf(side.route), BOX, [overview.zoom * 1.02, 2.2]);
    const framed = keepInView(clampToMap(fitted, side.map, { width, top: 420, bottom: 1640 }), side.route, SAFE_BOX, width);
    return [
      { frame: span.start, cam: overview },
      { frame: span.start + 18, cam: framed, easing: easeInOut },
      { frame: span.end, cam: { ...framed, zoom: framed.zoom * 1.05 }, easing: (t) => t },
    ];
  }, [side, span, width]);
  if (frame < span.start || frame >= span.end) return null;
  const camera = cameraAt(keys, frame);
  const draw = span.end - span.start - 40;
  const legProgress = legs.map((_, i) => progress(frame, span.start + 14 + (draw * i) / Math.max(1, legs.length), draw / Math.max(1, legs.length), easeInOut));
  const enter = progress(frame, span.start, 10);
  const exit = progress(frame, span.end - 8, 8);
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - exit) }}>
      <MapStage map={side.map} camera={camera}>
        <RouteLayer legs={legs} legProgress={legProgress} camera={camera} />
        {side.route.map((p, i) => {
          const s = toScreen(camera, p, width);
          const t = i === 0 ? span.start + 14 : span.start + 14 + (draw * i) / Math.max(1, legs.length);
          return <LocationMarker key={i} x={s.x} y={s.y} index={i} appear={progress(frame, t, 8)} active={false} pulse={0} emphasis={0.8} />;
        })}
      </MapStage>
      <div style={{ position: 'absolute', top: SAFE.top, left: SAFE.side, right: SAFE.side, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Kicker color={side.accent}>{side.worldTitle}</Kicker>
        <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: fitFontSize(side.name, { maxWidth: width - SAFE.side * 2, maxLines: 2, max: 92, min: 56, glyph: 0.62 }), color: COLORS.white, lineHeight: 1.04, textShadow: '0 4px 24px rgba(0,0,0,0.8)' }}>
          {side.name}
        </div>
      </div>
      <div style={{ position: 'absolute', left: SAFE.side, right: SAFE.side, bottom: SAFE.bottom, display: 'flex', alignItems: 'baseline', gap: 24 }}>
        <CountUp value={side.places} start={span.start + 14} duration={draw} style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 150, color: COLORS.white, textShadow: `0 0 40px ${side.accent}aa` }} />
        <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 48, color: COLORS.ink100 }}>{copy.places}</div>
      </div>
    </AbsoluteFill>
  );
}

/**
 * CharacterVersus — "who travelled more?": hook → side A on its map → side B
 * on its map → bars → winner reveal → CTA. Only real dataset numbers
 * (distinct places on the world map; story arcs break ties).
 */
export function CharacterVersus({ data }: CharacterVersusProps) {
  useBrandFonts(data ? versusVideoText(data) : '');
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!data) throw new Error('CharacterVersus: missing resolved data (calculateMetadata did not run).');
  const plan = useMemo(() => planVersus(data.durationSeconds, fps), [data.durationSeconds, fps]);
  const { a, b, copy } = data;
  const winnerSide = data.winner === 'a' ? a : data.winner === 'b' ? b : null;
  const entry = (s: VersusSide, isWinner: boolean) => ({ name: s.name, world: s.worldTitle, value: s.places, secondary: `${s.arcs} ${copy.arcs}`, accent: s.accent, winner: isWinner });
  const revealTitle = winnerSide ? fillTemplate(copy.wins, { name: winnerSide.name }) : copy.tie;
  const loser = data.winner === 'a' ? b : a;
  const detail = winnerSide
    ? data.decidedBy === 'places'
      ? `${winnerSide.places} ${copy.places} vs ${loser.places}`
      : `${winnerSide.arcs} ${copy.arcs} vs ${loser.arcs}`
    : `${a.places} ${copy.places} · ${a.arcs} ${copy.arcs}`;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink950, fontFamily: FONTS.sans }}>
      <Backdrop />
      {frame < plan.hook.end + 2 && (
        <AbsoluteFill style={{ opacity: lerp(1, 0, progress(frame, plan.hook.end - 8, 8)) }}>
          <Hook text={data.hook} kicker={`${copy.kicker} · ${a.worldTitle}${a.anime !== b.anime ? ` × ${b.worldTitle}` : ''}`} end={plan.hook.end} />
        </AbsoluteFill>
      )}
      <SideScene side={a} span={plan.a} copy={copy} />
      <SideScene side={b} span={plan.b} copy={copy} />
      {frame >= plan.compare.start && frame < plan.reveal.start + 6 && <VersusBars title={copy.kicker} unit={copy.places} entries={[entry(a, data.winner === 'a'), entry(b, data.winner === 'b')]} start={plan.compare.start} />}
      {frame >= plan.reveal.start && frame < plan.cta.start + 4 && <Reveal kicker={copy.kicker} title={revealTitle} detail={detail} accent={winnerSide?.accent ?? COLORS.red500} start={plan.reveal.start} />}
      {frame >= plan.cta.start && <CallToAction cta={data.cta} tagline={copy.brandTagline} siteLabel={data.siteLabel} pageLabel={data.pageLabel} start={plan.cta.start} />}
      {data.audio && <Audio src={staticFile(data.audio.src)} volume={(f) => (data.audio?.volume ?? 0.8) * (1 - progress(f, plan.total - fps, fps, easeInOut))} />}
    </AbsoluteFill>
  );
}
