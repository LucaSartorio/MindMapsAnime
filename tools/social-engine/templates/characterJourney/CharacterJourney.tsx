import { useMemo } from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../../components/Backdrop';
import { CallToAction } from '../../components/CallToAction';
import { CharacterHeader } from '../../components/CharacterHeader';
import { Hook } from '../../components/Hook';
import { KeyLocations } from '../../components/KeyLocations';
import { Kicker } from '../../components/Kicker';
import { LocationLabel } from '../../components/LocationLabel';
import { LocationMarker } from '../../components/LocationMarker';
import { MapStage } from '../../components/MapStage';
import { RouteLayer } from '../../components/RouteLayer';
import { StopCard } from '../../components/StopCard';
import { cameraAt, toScreen } from '../../lib/camera';
import { easeInOut, fadeWindow, lerp, progress } from '../../lib/easing';
import { fitFontSize, useBrandFonts } from '../../lib/fonts';
import { buildLeg } from '../../lib/geometry';
import { COLORS, FONTS, SAFE } from '../../lib/theme';
import { buildJourneyCamera } from './camera';
import { planJourney } from './timeline';
import type { CharacterJourneyProps } from './types';

/** Every string the video can show (drives which font subsets must be loaded). */
export function videoText(data: NonNullable<CharacterJourneyProps['data']>): string {
  return [
    data.hook,
    data.cta,
    data.siteLabel,
    data.pageLabel,
    data.map.name,
    data.world.title,
    data.series?.label ?? '',
    data.series?.nextLabel ?? '',
    data.series?.arcRange ?? '',
    ...Object.values(data.character).filter((v): v is string => typeof v === 'string'),
    ...Object.values(data.copy),
    ...data.stops.flatMap((s) => [s.title, s.placeName, s.shortName, s.regionName ?? '', s.arcName ?? '']),
  ].join(' ');
}

/**
 * CharacterJourney — hook → establishing map → animated journey → key
 * locations → CTA. Generic: everything comes from `data` (any world, any
 * character with ≥ 2 places on the map). Pure function of the frame.
 */
export function CharacterJourney({ data }: CharacterJourneyProps) {
  useBrandFonts(data ? videoText(data) : '');
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  if (!data) throw new Error('CharacterJourney: missing resolved data (calculateMetadata did not run).');

  const plan = useMemo(() => planJourney(data.durationSeconds, fps, data.stops.length), [data.durationSeconds, fps, data.stops.length]);
  const points = useMemo(() => data.stops.map((s) => s.point), [data.stops]);
  const legs = useMemo(() => points.slice(1).map((p, i) => buildLeg(points[i], p)), [points]);
  const cameraKeys = useMemo(() => buildJourneyCamera(points, data.map, plan, width), [points, data.map, plan, width]);
  const camera = cameraAt(cameraKeys, frame);
  const { copy } = data;

  // --- scene state ------------------------------------------------------------
  const reveal = progress(frame, plan.hook.end - 8, 18, easeInOut); // map comes out of the blur
  const inRecap = frame >= plan.recap.start;
  const activeIndex = inRecap ? -1 : plan.stops.reduce((acc, s, i) => (frame >= s.arrive ? i : acc), -1);
  const legProgress = legs.map((_, i) => {
    const t = plan.stops[i + 1];
    return progress(frame, t.travelStart + 2, t.arrive - t.travelStart - 2, easeInOut);
  });
  const headerAppear = progress(frame, plan.intro.start, 14) * (1 - progress(frame, plan.cta.start, 10));
  const introText = fadeWindow(frame, plan.intro.start + 6, plan.stops[0].arrive - 4, 12, 8);
  const recapAppear = progress(frame, plan.recap.start + Math.round(fps * 0.5), 12) * (1 - progress(frame, plan.cta.start, 8));
  const highlightSet = new Set(data.highlights);
  // Recap labels: chosen once on the settled recap framing; a label that would
  // overlap one already placed is skipped (its pin number + the list still name it).
  const recapLabels = useMemo(() => {
    const cam = cameraAt(cameraKeys, Math.min(plan.recap.start + Math.round(fps * 1.2), plan.recap.end));
    const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
    return data.highlights.filter((i) => {
      const p = toScreen(cam, points[i], width);
      const text = data.stops[i].regionName ?? data.stops[i].shortName;
      const w = text.length * 26 * 0.58 + 48;
      const box = { x0: p.x - w / 2 - 8, x1: p.x + w / 2 + 8, y0: p.y - 44 - 50, y1: p.y - 44 + 8 };
      if (placed.some((b) => box.x0 < b.x1 && b.x0 < box.x1 && box.y0 < b.y1 && b.y0 < box.y1)) return false;
      placed.push(box);
      return true;
    });
  }, [cameraKeys, plan, fps, data.highlights, data.stops, points, width]);
  // "0 story arcs" says nothing: the arcs count only appears when the data has arcs.
  const statsLine = [`${data.stats.stops} ${copy.stops}`, ...(data.stats.arcs > 0 ? [`${data.stats.arcs} ${copy.arcs}`] : [])].join(' · ');
  const screen = points.map((p) => toScreen(camera, p, width));
  // Paint order: in the recap, key stops go on top of other pins at the same place.
  const markerOrder = points.map((_, i) => i).sort((a, b) => (inRecap ? Number(highlightSet.has(a)) - Number(highlightSet.has(b)) : 0) || a - b);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink950, fontFamily: FONTS.sans }}>
      <Backdrop />
      <MapStage map={data.map} camera={camera} opacity={lerp(0.3, 1, reveal)} blur={lerp(10, 0, reveal)}>
        <RouteLayer legs={legs} legProgress={legProgress} camera={camera} opacity={reveal} />
        {markerOrder.map((i) => {
          const p = screen[i];
          const timing = plan.stops[i];
          const emphasis = inRecap ? (highlightSet.has(i) ? 1.15 : 0.8) : 1;
          return (
            <LocationMarker
              key={i}
              x={p.x}
              y={p.y}
              index={i}
              appear={progress(frame, timing.arrive - 4, 10)}
              active={i === activeIndex}
              pulse={((frame - timing.arrive) / 36) % 1}
              emphasis={emphasis}
              dim={inRecap && !highlightSet.has(i)}
            />
          );
        })}
        {activeIndex >= 0 && (
          <LocationLabel
            x={screen[activeIndex].x}
            y={screen[activeIndex].y}
            text={data.stops[activeIndex].regionName ?? data.stops[activeIndex].shortName}
            opacity={fadeWindow(frame, plan.stops[activeIndex].arrive, plan.stops[activeIndex].leave, 8, 6)}
          />
        )}
        {inRecap &&
          recapLabels.map((i) => (
            <LocationLabel
              key={i}
              x={screen[i].x}
              y={screen[i].y}
              text={data.stops[i].regionName ?? data.stops[i].shortName}
              size={26}
              offset={44}
              opacity={recapAppear}
            />
          ))}
      </MapStage>

      {frame < plan.hook.end + 2 && <Hook text={data.hook} kicker={`${data.world.title} · ${data.series ? data.series.label : copy.templateLabel}`} end={plan.hook.end} />}

      <CharacterHeader
        name={data.character.name}
        initials={data.character.initials}
        tagline={[data.world.title, data.character.tagline].filter(Boolean).join(' · ')}
        kicker={copy.templateLabel}
        badge={data.series?.label}
        appear={headerAppear}
      />

      {introText > 0 && (
        <div style={{ position: 'absolute', left: SAFE.side, right: SAFE.side, bottom: SAFE.bottom + 40, opacity: introText, transform: `translateY(${(1 - introText) * 24}px)`, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Kicker>{copy.mapKicker}</Kicker>
          <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 70, color: COLORS.white, lineHeight: 1.05, textShadow: '0 4px 24px rgba(0,0,0,0.8)' }}>{data.map.name}</div>
          {data.series?.arcRange && (
            // Narrative range of this part: one line, shrinks then ellipsizes on long arc names.
            <div
              style={{
                fontFamily: FONTS.sans,
                fontWeight: 600,
                fontSize: fitFontSize(data.series.arcRange, { maxWidth: width - SAFE.side * 2, maxLines: 1, max: 38, min: 26, glyph: 0.52 }),
                color: COLORS.ink100,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {data.series.arcRange}
            </div>
          )}
          <div style={{ fontFamily: FONTS.sans, fontWeight: 500, fontSize: 32, color: COLORS.ink200 }}>
            {statsLine}
          </div>
        </div>
      )}

      {activeIndex >= 0 && (
        <StopCard
          index={activeIndex}
          count={data.stops.length}
          stopLabel={copy.stop}
          title={data.stops[activeIndex].title}
          place={[data.stops[activeIndex].placeName, data.stops[activeIndex].regionName].filter(Boolean).join(' · ')}
          arc={data.stops[activeIndex].arcName}
          appear={fadeWindow(frame, plan.stops[activeIndex].arrive - 2, plan.stops[activeIndex].leave, 10, 7)}
          frameWidth={width}
        />
      )}

      <KeyLocations
        heading={copy.keyLocations}
        stats={statsLine}
        start={plan.recap.start + Math.round(fps * 0.5)}
        appear={recapAppear}
        items={data.highlights.map((i) => {
          const s = data.stops[i];
          const what = s.title !== s.placeName ? s.title : s.arcName;
          const detail = [what, s.regionName].filter(Boolean).join(' · ');
          return { number: i + 1, name: s.placeName, detail };
        })}
      />

      {frame >= plan.cta.start && (
        <CallToAction cta={data.cta} kicker={data.series?.nextLabel} tagline={copy.brandTagline} siteLabel={data.siteLabel} pageLabel={data.pageLabel} start={plan.cta.start} />
      )}

      {data.audio && (
        <Audio
          src={staticFile(data.audio.src)}
          volume={(f) => (data.audio?.volume ?? 0.8) * (1 - progress(f, plan.total - fps, fps, easeInOut))}
        />
      )}
    </AbsoluteFill>
  );
}
