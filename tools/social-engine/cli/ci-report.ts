/**
 * social:ci:report — turns the last batch's output/render-summary.json into:
 *   1. the artifact folder  .cache/artifact/{videos/*.mp4, manifests/*.json, render-summary.json}
 *      (only what this run produced — no source, cache, bundle or browser);
 *   2. a readable report in $GITHUB_STEP_SUMMARY (stdout when run locally);
 *   3. job outputs in $GITHUB_OUTPUT: rendered_count, failed_count, remaining_count,
 *      has_videos, has_summary, artifact_name.
 * Same code locally and in GitHub Actions (env vars are optional).
 */
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { pipelineDirs, relToRepo } from '../pipeline/dirs';
import { writeJsonAtomic } from '../pipeline/fs';
import { RUN_SUMMARY_FILE, type RunSummary } from '../pipeline/runSummary';

const dirs = pipelineDirs();
const artifactDir = path.join(dirs.cache, 'artifact');
const artifactName = process.env.SOCIAL_ARTIFACT_NAME ?? null;
const mode = process.env.SOCIAL_RUN_MODE ?? 'render';

function output(values: Record<string, string | number | boolean>) {
  const lines = Object.entries(values).map(([k, v]) => `${k}=${String(v)}`);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${lines.join('\n')}\n`);
  else console.log(lines.join('\n'));
}

function report(markdown: string) {
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
  console.log(markdown);
}

const summaryFile = path.join(dirs.output, RUN_SUMMARY_FILE);
rmSync(artifactDir, { recursive: true, force: true });

if (!existsSync(summaryFile)) {
  report(`# AniMapVerse Social Render\n\n**No render summary was produced** (the batch did not run or crashed before the end — see the "Render queued videos" step log).\nQueue state is kept in the repository; nothing is lost.`);
  output({ rendered_count: 0, failed_count: 1, remaining_count: -1, has_videos: false, has_summary: false, artifact_name: artifactName ?? '' });
  process.exit(0);
}

const summary = JSON.parse(readFileSync(summaryFile, 'utf8')) as RunSummary;
mkdirSync(path.join(artifactDir, 'videos'), { recursive: true });
mkdirSync(path.join(artifactDir, 'manifests'), { recursive: true });
const missing: string[] = [];
for (const item of summary.rendered) {
  const stem = path.basename(item.video, '.mp4');
  const video = path.join(dirs.output, `${stem}.mp4`);
  const manifest = path.join(dirs.output, path.basename(item.manifest));
  if (existsSync(video)) copyFileSync(video, path.join(artifactDir, item.video));
  else missing.push(relToRepo(dirs, video));
  if (existsSync(manifest)) copyFileSync(manifest, path.join(artifactDir, item.manifest));
}
writeJsonAtomic(path.join(artifactDir, RUN_SUMMARY_FILE), summary);

const c = summary.counts;
const lines = [
  `# AniMapVerse Social Render${summary.dryRun ? ' — DRY RUN' : ''}`,
  '',
  `| Queued | ${summary.dryRun ? 'Would render' : 'Rendered'} | Failed | Still in queue |`,
  '| ---: | ---: | ---: | ---: |',
  `| ${c.considered} | ${summary.dryRun ? c.planned : c.rendered} | ${c.failed} | ${c.remainingInQueue} |`,
  '',
];
if (summary.rendered.length) {
  lines.push('## Videos', '');
  for (const r of summary.rendered) lines.push(`- **${r.title}** (${r.locale}${r.variant ? `, ${r.variant}` : ''}, ${r.durationSeconds}s) — \`${r.renderId}\` → \`${r.video}\``);
  lines.push('');
}
if (summary.planned.length) {
  lines.push('## Would render', '');
  for (const p of summary.planned) lines.push(`- \`${p.renderId}\` (${p.file})`);
  lines.push('');
}
if (summary.failed.length) {
  lines.push('## Failed', '');
  for (const f of summary.failed) {
    const who = [f.template, f.anime, f.subject].filter(Boolean).join(' · ') || 'unknown content';
    lines.push(`- **${f.file}** — ${f.kind} — ${f.renderId ?? who}`, `  - ${f.errors.join(' / ').replace(/\n\s*/g, ' ')}`);
  }
  lines.push('', 'Failed content was moved to `tools/social-engine/content/failed/` (with a `.error.json`). Fix it and run `npm run social:retry:failed`.', '');
}
if (!summary.dryRun && c.remainingInQueue > 0) lines.push(`> ${c.remainingInQueue} item(s) are still queued (per-run limit). Run the workflow again to render them.`, '');
if (missing.length) lines.push(`> ⚠ Missing video file(s): ${missing.join(', ')}`, '');
if (!summary.dryRun && mode === 'render') lines.push(`**Artifact:** \`${artifactName ?? '(local run)'}\` — \`videos/\`, \`manifests/\`, \`render-summary.json\``);
report(lines.join('\n'));

output({
  rendered_count: c.rendered,
  failed_count: c.failed,
  remaining_count: c.remainingInQueue,
  has_videos: summary.rendered.length > 0,
  has_summary: true,
  artifact_name: artifactName ?? '',
});
