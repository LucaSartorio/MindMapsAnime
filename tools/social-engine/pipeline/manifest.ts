import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import type { VideoInfo } from '../render/session';
import type { PlannedContent } from './content';
import type { PipelineDirs } from './dirs';
import { relToRepo } from './dirs';
import { writeJsonAtomic } from './fs';
import { seriesIdOf } from './ids';
import type { SegmentInfo } from '../templates/types';

/**
 * `<stem>.manifest.json` next to every MP4: what the video is, where it came
 * from and the facts a future publisher needs (title, hook, page URL…).
 */
export type RenderManifest = {
  schemaVersion: 1;
  contentId: string;
  renderId: string;
  template: string;
  anime: string;
  subject: string;
  subjectName: string;
  locale: string;
  variant: string | null;
  /** Series facts when the video is one part of a multi-part journey (null for a single video). */
  segment: (SegmentInfo & { seriesId: string }) | null;
  renderedAt: string;
  durationSeconds: number;
  frames: number;
  fps: number;
  resolution: string;
  codec: 'h264';
  file: string;
  fileBytes: number;
  sha256: string;
  publication: Record<string, string | number | string[]>;
  sourceConfig: unknown;
};

export function writeManifest(dirs: PipelineDirs, plan: PlannedContent, video: string, info: VideoInfo, renderedAt: string, sourceConfig: unknown): string {
  const manifestFile = video.replace(/\.mp4$/i, '.manifest.json');
  const manifest: RenderManifest = {
    schemaVersion: 1,
    contentId: plan.contentId,
    renderId: plan.renderId,
    template: plan.template.id,
    anime: plan.resolved.identity.anime,
    subject: plan.resolved.identity.subject,
    subjectName: plan.resolved.identity.subjectName,
    locale: plan.locale,
    variant: plan.variant,
    segment: plan.resolved.segment ? { seriesId: seriesIdOf(plan.contentId), ...plan.resolved.segment } : null,
    renderedAt,
    durationSeconds: info.durationInFrames / info.fps,
    frames: info.durationInFrames,
    fps: info.fps,
    resolution: `${info.width}x${info.height}`,
    codec: 'h264',
    file: relToRepo(dirs, video),
    fileBytes: statSync(video).size,
    sha256: createHash('sha256').update(readFileSync(video)).digest('hex'),
    publication: plan.resolved.manifest,
    sourceConfig,
  };
  writeJsonAtomic(manifestFile, manifest);
  return manifestFile;
}
