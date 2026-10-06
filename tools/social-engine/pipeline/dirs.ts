import path from 'node:path';
import { ENGINE_DIR, PUBLIC_DIR, REPO_ROOT } from '../render/paths';

/**
 * Every directory the pipeline reads or writes, from ONE root (default
 * `tools/social-engine/`, override with SOCIAL_PIPELINE_ROOT — the tests use a
 * temporary sandbox the same way).
 *
 *   SOURCE (versioned)            RUNTIME (git-ignored)
 *   catalog/  catalog.json         output/   *.mp4 + *.manifest.json
 *   content/queue/   to render     .cache/   bundle, staged assets, queue.lock
 *   content/rendered/ done         audio/    local royalty-free tracks
 *   content/failed/  + .error.json
 *   content/archive/ set aside
 *   history/history.json
 *   schemas/
 *   publication/pending/  receipts to apply (written by the Publishing Agent)
 *   publication/applied/  audit trail of applied receipts
 *   publication/failed/   rejected receipts + .error.json
 *   publication/schemas/  publication-receipt.schema.json
 *   analytics/pending/    metric snapshots to apply (Analyst Agent) · applied/ · failed/
 *   analytics/metrics.json latest metrics per renderId × platform
 */
export type PipelineDirs = {
  root: string;
  catalog: string;
  queue: string;
  rendered: string;
  failed: string;
  archive: string;
  history: string;
  historyFile: string;
  output: string;
  cache: string;
  audio: string;
  lockFile: string;
  publicationPending: string;
  publicationApplied: string;
  publicationFailed: string;
  analyticsPending: string;
  analyticsApplied: string;
  analyticsFailed: string;
  /** Latest metrics per renderId × platform (written only by social:analytics:apply). */
  metricsFile: string;
  publicDir: string;
  repoRoot: string;
};

export function pipelineDirs(root: string = process.env.SOCIAL_PIPELINE_ROOT ? path.resolve(process.env.SOCIAL_PIPELINE_ROOT) : ENGINE_DIR): PipelineDirs {
  const cache = path.join(root, '.cache');
  return {
    root,
    catalog: path.join(root, 'catalog'),
    queue: path.join(root, 'content', 'queue'),
    rendered: path.join(root, 'content', 'rendered'),
    failed: path.join(root, 'content', 'failed'),
    archive: path.join(root, 'content', 'archive'),
    history: path.join(root, 'history'),
    historyFile: path.join(root, 'history', 'history.json'),
    output: path.join(root, 'output'),
    cache,
    audio: path.join(root, 'audio'),
    // One lock for every writer of history.json (batch render, publication apply).
    lockFile: path.join(cache, 'queue.lock'),
    publicationPending: path.join(root, 'publication', 'pending'),
    publicationApplied: path.join(root, 'publication', 'applied'),
    publicationFailed: path.join(root, 'publication', 'failed'),
    analyticsPending: path.join(root, 'analytics', 'pending'),
    analyticsApplied: path.join(root, 'analytics', 'applied'),
    analyticsFailed: path.join(root, 'analytics', 'failed'),
    metricsFile: path.join(root, 'analytics', 'metrics.json'),
    publicDir: PUBLIC_DIR,
    repoRoot: REPO_ROOT,
  };
}

/** Repo-relative path with forward slashes (stable in history/manifests across machines). */
export function relToRepo(dirs: PipelineDirs, file: string): string {
  return path.relative(dirs.repoRoot, file).split(path.sep).join('/');
}
