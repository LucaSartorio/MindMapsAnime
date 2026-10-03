/**
 * social:render — AD-HOC render of one video (preview, stills, experiments).
 * Not recorded in history and written to output/preview/: anything meant to be
 * published goes through the queue (`social:queue` + `social:render:queue`).
 *
 *   npm run social:render -- --config tools/social-engine/examples/itachi-character-journey.json
 *   npm run social:render -- --template character-journey --anime naruto --character itachi-uchiha --still 40,200
 *
 * Exit codes: 0 ok · 1 invalid config/data or render failure · 2 usage error.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { SocialEngineError } from '../lib/errors';
import { planContent, parseContentRequest } from '../pipeline/content';
import { pipelineDirs } from '../pipeline/dirs';
import { safeJoin } from '../pipeline/fs';
import { writeManifest } from '../pipeline/manifest';
import { ENTRY_POINT, detectBrowserExecutable } from '../render/paths';
import { createRenderSession } from '../render/session';
import { templateNames } from '../templates/registry';
import { parseArgs, type FlagSpec } from './args';
import { fail, numberFlag, stringFlag } from './common';

const SPEC: FlagSpec = {
  config: 'string', template: 'string', anime: 'string', character: 'string', subject: 'string', segment: 'string', locale: 'string',
  hook: 'string', cta: 'string', duration: 'string', 'max-stops': 'string', variant: 'string', audio: 'string',
  'audio-volume': 'string', out: 'string', 'browser-executable': 'string', concurrency: 'string', still: 'string',
  frames: 'string', 'dry-run': 'boolean', help: 'boolean',
};

const HELP = `Usage: npm run social:render -- [options]      (ad-hoc; use the queue for real content)

  --config <file.json>        Content/video config. Flags below override it.
  --template <name>           ${templateNames()}
  --anime <slug>              naruto | hunterxhunter | onepiece | dragonball | blackclover | bleach | attackontitan (or URL slug)
  --character <slug|id>       e.g. itachi-uchiha, char-itachi, luffy (alias: --subject)
  --segment <part-NN>         part of a multi-part journey (required for series)
  --locale <en|it>  --hook <text>  --cta <text>  --duration <12–60>  --max-stops <2–8>  --variant <slug>
  --audio <file>              royalty-free track inside tools/social-engine/audio/ (+ --audio-volume 0..1)
  --out <file.mp4>            default tools/social-engine/output/preview/<anime>_<subject>_<template>_<locale>.mp4
  --still <f1,f2,…>           PNG stills instead of the MP4      --frames <from-to>  partial MP4
  --browser-executable <path> headless Chromium (auto-detected from PLAYWRIGHT_BROWSERS_PATH)
  --concurrency <n>           frames rendered in parallel      --dry-run  validate + print the plan
`;

function rawFrom(flags: Record<string, string | boolean>): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  const file = stringFlag(flags, 'config');
  if (file) {
    const abs = path.resolve(process.cwd(), file);
    if (!existsSync(abs)) fail(`Config file not found: ${file}`, 2);
    try {
      Object.assign(raw, JSON.parse(readFileSync(abs, 'utf8')) as Record<string, unknown>);
    } catch (err) {
      fail(`${file}: invalid JSON (${(err as Error).message})`);
    }
  }
  const set = (key: string, value: unknown) => value !== undefined && (raw[key] = value);
  set('template', stringFlag(flags, 'template'));
  set('anime', stringFlag(flags, 'anime'));
  set('subject', stringFlag(flags, 'character') ?? stringFlag(flags, 'subject'));
  set('segment', stringFlag(flags, 'segment'));
  set('locale', stringFlag(flags, 'locale'));
  set('hook', stringFlag(flags, 'hook'));
  set('cta', stringFlag(flags, 'cta'));
  set('variant', stringFlag(flags, 'variant'));
  set('durationSeconds', numberFlag(flags, 'duration'));
  const maxStops = numberFlag(flags, 'max-stops');
  if (maxStops !== undefined) raw.journey = { ...((raw.journey as object | undefined) ?? {}), maxStops };
  const audio = stringFlag(flags, 'audio');
  if (audio) raw.audio = { src: audio, ...(numberFlag(flags, 'audio-volume') !== undefined ? { volume: numberFlag(flags, 'audio-volume') } : {}) };
  return raw;
}

async function main() {
  const { flags, errors } = parseArgs(process.argv.slice(2), SPEC);
  if (flags.help) return console.log(HELP);
  if (errors.length) fail(`${errors.join('\n  ')}\n\n${HELP}`, 2);
  if (!flags.config && !flags.template) fail(`Pass --config <file> or --template <name>.\n\n${HELP}`, 2);

  const dirs = pipelineDirs();
  const raw = rawFrom(flags);
  const parsed = parseContentRequest(raw);
  if (!parsed.ok) fail(`Invalid config:\n  - ${parsed.errors.join('\n  - ')}`);
  let plan;
  try {
    plan = await planContent(dirs, parsed.request);
  } catch (err) {
    if (err instanceof SocialEngineError || err instanceof Error) fail(err.message);
    throw err;
  }
  const out = stringFlag(flags, 'out');
  if (out && path.extname(out).toLowerCase() !== '.mp4') fail(`--out must end with .mp4 (got ${out})`, 2);
  const outputLocation = out ? path.resolve(process.cwd(), out) : safeJoin(dirs.output, 'preview', `${plan.fileStem}.mp4`);

  console.log(`\n▶ ${plan.template.compositionId} · ${plan.renderId}`);
  for (const line of plan.resolved.summary) console.log(`  ${line}`);
  console.log(`  output: ${path.relative(process.cwd(), outputLocation)}`);
  if (flags['dry-run']) return console.log('\n✔ Config and data are valid (dry run, nothing rendered).\n');

  console.log('\n… bundling');
  const session = await createRenderSession({
    dirs,
    entryPoint: ENTRY_POINT,
    assets: plan.resolved.publicAssets,
    audio: plan.audio ? [plan.audio] : [],
    browserExecutable: detectBrowserExecutable(stringFlag(flags, 'browser-executable')),
  });
  const job = { compositionId: plan.template.compositionId, props: plan.resolved.props, durationSeconds: plan.resolved.durationSeconds };

  const still = stringFlag(flags, 'still');
  if (still) {
    for (const frame of still.split(',').map((f) => Number(f.trim()))) {
      const output = outputLocation.replace(/\.mp4$/i, `-f${String(frame).padStart(4, '0')}.png`);
      await session.renderStill(job, frame, output).catch((err: Error) => fail(err.message, 2));
      console.log(`  ✔ ${path.relative(process.cwd(), output)}`);
    }
    return;
  }
  let frameRange: [number, number] | null = null;
  const frames = stringFlag(flags, 'frames');
  if (frames) {
    const m = /^(\d+)-(\d+)$/.exec(frames);
    if (!m || Number(m[1]) > Number(m[2])) fail('--frames must be "from-to"', 2);
    frameRange = [Number(m[1]), Number(m[2])];
  }
  const started = Date.now();
  let last = -1;
  const info = await session.renderVideo(job, outputLocation, {
    concurrency: numberFlag(flags, 'concurrency') ?? null,
    frameRange,
    muted: !plan.audio,
    onProgress: (p) => {
      const pct = Math.floor(p * 100);
      if (pct >= last + 10 || pct === 100) {
        last = pct;
        console.log(`  rendering ${pct}%`);
      }
    },
  });
  if (!frameRange) writeManifest(dirs, plan, outputLocation, info, new Date().toISOString(), raw);
  const size = (statSync(outputLocation).size / 1024 / 1024).toFixed(1);
  const seconds = ((frameRange ? frameRange[1] - frameRange[0] + 1 : info.durationInFrames) / info.fps).toFixed(1);
  console.log(`\n✔ ${path.relative(process.cwd(), outputLocation)} · ${info.width}×${info.height} · ${info.fps} fps · ${seconds}s · ${size} MB · ${((Date.now() - started) / 1000).toFixed(0)}s\n`);
}

main().catch((err: unknown) => {
  console.error(err);
  fail('Render failed (see the error above).');
});
