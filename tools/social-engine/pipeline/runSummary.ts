import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { BatchResult } from './batch';
import type { PipelineDirs } from './dirs';
import { writeJsonAtomic } from './fs';
import { parseContentId, parseRenderId } from './ids';
import type { RenderManifest } from './manifest';
import { listContentFiles } from './queue';

/**
 * Machine-readable report of ONE batch run — `output/render-summary.json`.
 * It travels in the GitHub artifact next to the videos, so a future agent can
 * find out what a run produced (and what failed) without parsing logs.
 * Video/manifest paths are relative to the artifact root (`videos/`, `manifests/`).
 */
export const RUN_SUMMARY_FILE = 'render-summary.json';

export type RunSummaryItem = {
  renderId: string;
  contentId: string;
  template: string;
  anime: string;
  subject: string;
  locale: string;
  variant: string | null;
  /** Series: id, part key and position (null for a single video). */
  seriesId: string | null;
  segment: string | null;
  partNumber: number | null;
  partCount: number | null;
  title: string;
  durationSeconds: number;
  sha256: string;
  video: string;
  manifest: string;
  /** Cover still inside the artifact, null when none. */
  cover: string | null;
  sourceFile: string;
};

export type RunSummaryFailure = {
  file: string;
  kind: string;
  renderId: string | null;
  contentId: string | null;
  template: string | null;
  anime: string | null;
  subject: string | null;
  segment: string | null;
  errors: string[];
};

export type RunSummary = {
  runVersion: 1;
  generatedAt: string;
  dryRun: boolean;
  github: { runId: string; runNumber: string; runAttempt: string; sha: string; ref: string; workflow: string; artifactName: string | null } | null;
  counts: { considered: number; rendered: number; failed: number; planned: number; remainingInQueue: number };
  rendered: RunSummaryItem[];
  failed: RunSummaryFailure[];
  planned: { file: string; renderId: string }[];
};

const str = (v: unknown) => (typeof v === 'string' ? v : null);

export function buildRunSummary(dirs: PipelineDirs, result: BatchResult, now: string): RunSummary {
  const rendered = result.rendered.map((r): RunSummaryItem => {
    const manifest = JSON.parse(readFileSync(path.join(dirs.repoRoot, r.manifestFile), 'utf8')) as RenderManifest;
    return {
      renderId: r.renderId,
      contentId: manifest.contentId,
      template: manifest.template,
      anime: manifest.anime,
      subject: manifest.subject,
      locale: manifest.locale,
      variant: manifest.variant,
      seriesId: manifest.segment?.seriesId ?? null,
      segment: manifest.segment?.segment ?? null,
      partNumber: manifest.segment?.partNumber ?? null,
      partCount: manifest.segment?.partCount ?? null,
      title: String(manifest.publication.title ?? manifest.subjectName),
      durationSeconds: manifest.durationSeconds,
      sha256: manifest.sha256,
      video: `videos/${path.basename(r.outputFile)}`,
      manifest: `manifests/${path.basename(r.manifestFile)}`,
      cover: manifest.cover ? `covers/${path.basename(manifest.cover)}` : null,
      sourceFile: r.file,
    };
  });
  const fromRender = (renderId: string | null) => {
    if (!renderId) return { contentId: null, template: null, anime: null, subject: null, segment: null };
    const { contentId } = parseRenderId(renderId);
    const { template, anime, subject, segment } = parseContentId(contentId);
    return { contentId, template, anime, subject, segment };
  };
  const failed: RunSummaryFailure[] = [
    ...result.failed.map((f) => ({ file: f.name, kind: 'render', renderId: f.renderId, ...fromRender(f.renderId), errors: [f.error] })),
    ...result.rejected.map((r) => {
      const raw = (typeof r.raw === 'object' && r.raw !== null ? r.raw : {}) as Record<string, unknown>;
      return { file: r.name, kind: r.kind, renderId: null, contentId: str(raw.id), template: str(raw.template), anime: str(raw.anime), subject: str(raw.subject), segment: str(raw.segment), errors: r.errors };
    }),
  ];
  const env = process.env;
  return {
    runVersion: 1,
    generatedAt: now,
    dryRun: result.dryRun,
    github: env.GITHUB_RUN_ID
      ? {
          runId: env.GITHUB_RUN_ID,
          runNumber: env.GITHUB_RUN_NUMBER ?? '',
          runAttempt: env.GITHUB_RUN_ATTEMPT ?? '',
          sha: env.GITHUB_SHA ?? '',
          ref: env.GITHUB_REF_NAME ?? '',
          workflow: env.GITHUB_WORKFLOW ?? '',
          artifactName: env.SOCIAL_ARTIFACT_NAME ?? null,
        }
      : null,
    counts: {
      considered: result.considered,
      rendered: rendered.length,
      failed: failed.length,
      planned: result.planned.length,
      remainingInQueue: listContentFiles(dirs.queue).entries.length,
    },
    rendered,
    failed,
    planned: result.dryRun ? result.planned.map((p) => ({ file: p.name, renderId: p.renderId })) : [],
  };
}

export function writeRunSummary(dirs: PipelineDirs, summary: RunSummary): string {
  const file = path.join(dirs.output, RUN_SUMMARY_FILE);
  writeJsonAtomic(file, summary);
  return file;
}
