import { copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import type { PipelineDirs } from '../pipeline/dirs';
import { safeJoin } from '../pipeline/fs';
import { makeWebpackOverride } from './webpack';

/**
 * One Remotion bundle shared by every video of a run (bundling is the slow,
 * fixed cost). The public dir is a clean staging copy of exactly the assets
 * the run needs (+ soundtracks), never the whole site `public/`.
 */
export type StagedAudio = { from: string; to: string };
export type VideoJob = { compositionId: string; props: Record<string, unknown>; durationSeconds: number };
export type VideoInfo = { width: number; height: number; fps: number; durationInFrames: number };
export type RenderVideoOptions = {
  /** Frames rendered in parallel INSIDE one video (videos are always rendered one at a time). */
  concurrency?: number | null;
  frameRange?: [number, number] | null;
  muted?: boolean;
  onProgress?: (progress: number) => void;
};

export type RenderSession = {
  renderVideo(job: VideoJob, outputLocation: string, options?: RenderVideoOptions): Promise<VideoInfo>;
  renderStill(job: VideoJob, frame: number, output: string): Promise<void>;
};

export async function createRenderSession(opts: {
  dirs: PipelineDirs;
  entryPoint: string;
  assets: string[];
  audio: StagedAudio[];
  browserExecutable?: string;
}): Promise<RenderSession> {
  const { dirs, browserExecutable } = opts;
  const publicDir = path.join(dirs.cache, 'public');
  rmSync(publicDir, { recursive: true, force: true });
  for (const rel of new Set(opts.assets)) {
    const from = safeJoin(dirs.publicDir, rel);
    if (!existsSync(from)) throw new Error(`Missing public asset: public/${rel}`);
    const to = safeJoin(publicDir, rel);
    mkdirSync(path.dirname(to), { recursive: true });
    copyFileSync(from, to);
  }
  for (const a of opts.audio) {
    const to = safeJoin(publicDir, a.to);
    mkdirSync(path.dirname(to), { recursive: true });
    copyFileSync(a.from, to);
  }
  const serveUrl = await bundle({
    entryPoint: opts.entryPoint,
    publicDir,
    outDir: path.join(dirs.cache, 'bundle'),
    webpackOverride: makeWebpackOverride(dirs.repoRoot),
  });

  const select = async (job: VideoJob) => {
    const composition = await selectComposition({ serveUrl, id: job.compositionId, inputProps: job.props, browserExecutable });
    const expected = Math.round(job.durationSeconds * composition.fps);
    if (composition.durationInFrames !== expected) throw new Error(`Duration mismatch: ${composition.durationInFrames} frames, expected ${expected}`);
    return composition;
  };

  return {
    async renderVideo(job, outputLocation, options = {}) {
      const composition = await select(job);
      mkdirSync(path.dirname(outputLocation), { recursive: true });
      await renderMedia({
        composition,
        serveUrl,
        inputProps: job.props,
        codec: 'h264',
        pixelFormat: 'yuv420p',
        crf: 18,
        // PNG frames → standard limited-range yuv420p (JPEG frames would give full-range yuvj420p).
        imageFormat: 'png',
        muted: options.muted ?? false,
        outputLocation,
        overwrite: true,
        browserExecutable,
        concurrency: options.concurrency ?? null,
        frameRange: options.frameRange ?? null,
        onProgress: ({ progress }) => options.onProgress?.(progress),
      });
      return { width: composition.width, height: composition.height, fps: composition.fps, durationInFrames: composition.durationInFrames };
    },
    async renderStill(job, frame, output) {
      const composition = await select(job);
      if (!Number.isInteger(frame) || frame < 0 || frame >= composition.durationInFrames) {
        throw new Error(`Still frame must be an integer in 0..${composition.durationInFrames - 1}`);
      }
      await renderStill({ composition, serveUrl, inputProps: job.props, frame, output, imageFormat: 'png', overwrite: true, browserExecutable });
    },
  };
}
