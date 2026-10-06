import { useMemo } from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../../components/Backdrop';
import { CallToAction } from '../../components/CallToAction';
import { Hook } from '../../components/Hook';
import { LocationLabel } from '../../components/LocationLabel';
import { LocationMarker } from '../../components/LocationMarker';
import { MapStage } from '../../components/MapStage';
import { Countdown, StepDots } from '../../components/Progress';
import { Reveal } from '../../components/Reveal';
import { RouteLayer } from '../../components/RouteLayer';
import { StopCard } from '../../components/StopCard';
import { cameraAt, clampToMap, fitCamera, keepInView, type CameraKey } from '../../lib/camera';
import { easeInOut, fadeWindow, lerp, progress } from '../../lib/easing';
import { useBrandFonts } from '../../lib/fonts';
import { boundsOf, buildLeg } from '../../lib/geometry';
import { COLORS, FONTS, SAFE } from '../../lib/theme';
import { Kicker } from '../../components/Kicker';
import { planGuess } from './timeline';
import type { GuessCharacterData, GuessCharacterProps } from './types';

export function guessVideoText(d: GuessCharacterData): string {
  return [d.hook, d.cta, d.siteLabel, d.pageLabel, d.world.title, d.answer.name, d.answer.tagline ?? '', ...Object.values(d.copy), ...d.places.flatMap((p) => [p.name, p.region ?? ''])].join(' ');
}

/** Clue framing: all clue pins inside the map band above the clue card. */
const BOX = { w: 760, h: 700, fy: 800 };
const SAFE_BOX = { left: 150, right: 930, top: 420, bottom: 1180 };

/**
 * GuessCharacter — hook → places revealed one by one on the world map (clue
 * cards, route between them) → countdown → REVEAL of the character → CTA.
 * Every place comes from the dataset (journey builder); none names the answer.
 */
export function GuessCharacter({ data }: GuessCharacterProps) {
  useBrandFonts(data ? guessVideoText(data) : '');
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  if (!data) throw new Error('GuessCharacter: missing resolved data (calculateMetadata did not run).');
  const plan = useMemo(() => planGuess(data.durationSeconds, fps, data.places.length), [data.durationSeconds, fps, data.places.length]);
  const points = useMemo(() => data.places.map((p) => p.point), [data.places]);
  const legs = useMemo(() => points.slice(1).map((p, i) => buildLeg(points[i], p)), [points]);
  const keys = useMemo<CameraKey[]>(() => {
    const overview = { x: data.map.width / 2, y: data.map.height / 2, zoom: (width / data.map.width) * 1.1, fy: 900 };
    const fitted = fitCamera(boundsOf(points), BOX, [overview.zoom * 1.05, 2.4]);
    const framed = keepInView(clampToMap(fitted, data.map, { width, top: 330, bottom: 1640 }), points, SAFE_BOX, width);
    return [
      { frame: 0, cam: overview },
      { frame: plan.clues[0].start + 12, cam: framed, easing: easeInOut },
      { frame: plan.think.end, cam: { ...framed, zoom: framed.zoom * 1.06 }, easing: (t) => t },
      { frame: plan.reveal.start + 20, cam: { ...framed, zoom: framed.zoom * 0.92 }, easing: easeInOut },
    ];
  }, [data.map, points, plan, width]);
  const camera = cameraAt(keys, frame);
  const reveal = progress(frame, plan.hook.end - 8, 18, easeInOut);
  const clueIndex = plan.clues.reduce((acc, s, i) => (frame >= s.start ? i : acc), -1);
  const inClues = frame >= plan.clues[0].start && frame < plan.think.start;
  const legProgress = legs.map((_, i) => progress(frame, plan.clues[i + 1].start - 2, 14, easeInOut));
  const screen = points.map((p) => ({ x: (p.x - camera.x) * camera.zoom + width / 2, y: (p.y - camera.y) * camera.zoom + camera.fy }));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink950, fontFamily: FONTS.sans }}>
      <Backdrop />
      <MapStage map={data.map} camera={camera} opacity={lerp(0.3, 1, reveal)} blur={lerp(10, 0, reveal)}>
        <RouteLayer legs={legs} legProgress={legProgress} camera={camera} opacity={reveal * 0.9} />
        {points.map((_, i) => (
          <LocationMarker
            key={i}
            x={screen[i].x}
            y={screen[i].y}
            index={i}
            appear={progress(frame, plan.clues[i].start + 4, 10)}
            active={inClues && i === clueIndex}
            pulse={((frame - plan.clues[i].start) / 36) % 1}
            dim={frame >= plan.reveal.start}
          />
        ))}
        {inClues && clueIndex >= 0 && (
          <LocationLabel x={screen[clueIndex].x} y={screen[clueIndex].y} text={data.places[clueIndex].name} opacity={fadeWindow(frame, plan.clues[clueIndex].start + 6, plan.clues[clueIndex].end, 8, 6)} />
        )}
      </MapStage>

      {frame < plan.hook.end + 2 && <Hook text={data.hook} kicker={`${data.world.title} · ${data.copy.kicker}`} end={plan.hook.end} />}

      {frame >= plan.clues[0].start && frame < plan.reveal.start && (
        <div style={{ position: 'absolute', top: SAFE.top, left: SAFE.side, right: SAFE.side, display: 'flex', flexDirection: 'column', gap: 18, opacity: progress(frame, plan.clues[0].start, 10) }}>
          <Kicker>{`${data.world.title} · ${data.copy.kicker}`}</Kicker>
          <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 84, color: COLORS.white, lineHeight: 1 }}>{data.copy.think}</div>
          <StepDots count={data.places.length} current={inClues ? clueIndex : data.places.length} />
        </div>
      )}

      {inClues && clueIndex >= 0 && (
        <StopCard
          index={clueIndex}
          count={data.places.length}
          stopLabel={data.copy.clue}
          title={data.places[clueIndex].name}
          place={data.places[clueIndex].region ?? data.map.name}
          appear={fadeWindow(frame, plan.clues[clueIndex].start + 2, plan.clues[clueIndex].end, 10, 7)}
          frameWidth={width}
        />
      )}

      <Countdown start={plan.think.start} duration={plan.think.end - plan.think.start} label={data.copy.countdown} />

      {frame >= plan.reveal.start && frame < plan.cta.start + 4 && (
        <Reveal
          kicker={data.copy.answerKicker}
          title={data.answer.name}
          detail={[data.world.title, `${data.journeyPlaces} ${data.copy.places}`].join(' · ')}
          accent={data.world.accent}
          start={plan.reveal.start}
        />
      )}

      {frame >= plan.cta.start && <CallToAction cta={data.cta} tagline={data.copy.brandTagline} siteLabel={data.siteLabel} pageLabel={data.pageLabel} start={plan.cta.start} />}

      {data.audio && <Audio src={staticFile(data.audio.src)} volume={(f) => (data.audio?.volume ?? 0.8) * (1 - progress(f, plan.total - fps, fps, easeInOut))} />}
    </AbsoluteFill>
  );
}
