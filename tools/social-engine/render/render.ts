/**
 * social:render — private CLI that renders a social video to MP4.
 *
 *   npm run social:render -- --config tools/social-engine/examples/itachi-character-journey.json
 *   npm run social:render -- --template character-journey --anime naruto --character itachi-uchiha
 *
 * Pipeline: flags/JSON → validated config → data resolved from the site's
 * datasets (Node) → Remotion bundle → H.264 MP4 in tools/social-engine/output/.
 * Exit codes: 0 ok · 1 invalid config/data or render failure · 2 usage error.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { VERTICAL_FORMAT } from '../config/defaults';
import { SocialEngineError } from '../lib/errors';
import { findTemplate, parseSocialVideoConfig, templateNames } from '../templates/registry';
import { parseArgs, type FlagSpec } from './args';
import { makeWebpackOverride } from './webpack';
import { CACHE_DIR, ENTRY_POINT, PUBLIC_DIR, REPO_ROOT, detectBrowserExecutable, resolveOutputPath } from './paths';

const SPEC: FlagSpec = {
  config: 'string',
  template: 'string',
  anime: 'string',
  character: 'string',
  subject: 'string',
  locale: 'string',
  hook: 'string',
  cta: 'string',
  duration: 'string',
  'max-stops': 'string',
  audio: 'string',
  'audio-volume': 'string',
  out: 'string',
  'browser-executable': 'string',
  concurrency: 'string',
  still: 'string',
  frames: 'string',
  'dry-run': 'boolean',
  help: 'boolean',
};

const HELP = `Usage: npm run social:render -- [options]

  --config <file.json>        Video config (see docs/SOCIAL_ENGINE.md). Flags below override it.
  --template <name>           ${templateNames()}
  --anime <slug>              naruto | hunterxhunter | onepiece | dragonball | blackclover (or URL slug)
  --character <slug|id>       e.g. itachi-uchiha or char-itachi (alias: --subject)
  --locale <en|it>            default en
  --hook <text> / --cta <text>
  --duration <seconds>        12–60, default 22
  --max-stops <n>             2–8, default 6
  --audio <file>              optional local royalty-free track (+ --audio-volume 0..1)
  --out <file.mp4>            default tools/social-engine/output/<subject>-<template>-<locale>.mp4
  --browser-executable <path> headless Chromium (auto-detected from PLAYWRIGHT_BROWSERS_PATH)
  --concurrency <n>           parallel frame renders
  --still <f1,f2,…>           render PNG stills of these frames instead of the MP4 (quick review / thumbnails)
  --frames <from-to>          render only a frame range of the MP4 (quick preview)
  --dry-run                   validate + print the plan, don't render
`;

function fail(message: string, code = 1): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(code);
}

function num(value: string | boolean | undefined, name: string): number | undefined {
  if (value === undefined || typeof value === 'boolean') return undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) fail(`--${name} must be a number (got "${value}")`, 2);
  return n;
}

function readJson(file: string): Record<string, unknown> {
  const abs = path.resolve(process.cwd(), file);
  if (!existsSync(abs)) fail(`Config file not found: ${file}`, 2);
  try {
    const parsed: unknown = JSON.parse(readFileSync(abs, 'utf8'));
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) fail(`${file}: must contain a JSON object`);
    return parsed as Record<string, unknown>;
  } catch (err) {
    return fail(`${file}: invalid JSON (${err instanceof Error ? err.message : String(err)})`);
  }
}

/** Flags → raw config (merged over --config). Validation happens in the registry. */
function rawConfigFrom(flags: Record<string, string | boolean>): Record<string, unknown> {
  const raw: Record<string, unknown> = typeof flags.config === 'string' ? readJson(flags.config) : {};
  const s = (k: string) => (typeof flags[k] === 'string' ? (flags[k] as string) : undefined);
  const set = (key: string, value: unknown) => {
    if (value !== undefined) raw[key] = value;
  };
  set('template', s('template'));
  set('anime', s('anime'));
  set('subject', s('character') ?? s('subject'));
  set('locale', s('locale'));
  set('hook', s('hook'));
  set('cta', s('cta'));
  set('durationSeconds', num(flags.duration, 'duration'));
  const maxStops = num(flags['max-stops'], 'max-stops');
  if (maxStops !== undefined) raw.journey = { ...(typeof raw.journey === 'object' && raw.journey ? raw.journey : {}), maxStops };
  if (s('audio')) raw.audio = { src: s('audio'), ...(num(flags['audio-volume'], 'audio-volume') !== undefined ? { volume: num(flags['audio-volume'], 'audio-volume') } : {}) };
  return raw;
}

/** Copies exactly the public files this video uses (+ audio) into a clean staging public dir. */
function stagePublicDir(assets: string[], audio?: { from: string; to: string }): string {
  const dir = path.join(CACHE_DIR, 'public');
  rmSync(dir, { recursive: true, force: true });
  for (const rel of assets) {
    const from = path.join(PUBLIC_DIR, rel);
    if (!existsSync(from)) fail(`Missing public asset: public/${rel}`);
    mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    copyFileSync(from, path.join(dir, rel));
  }
  if (audio) {
    mkdirSync(path.dirname(path.join(dir, audio.to)), { recursive: true });
    copyFileSync(audio.from, path.join(dir, audio.to));
  }
  return dir;
}

async function main() {
  const { flags, errors } = parseArgs(process.argv.slice(2), SPEC);
  if (flags.help) {
    console.log(HELP);
    return;
  }
  if (errors.length) fail(`${errors.join('\n  ')}\n\n${HELP}`, 2);
  if (!flags.config && !flags.template) fail(`Pass --config <file> or --template <name>.\n\n${HELP}`, 2);

  const parsed = parseSocialVideoConfig(rawConfigFrom(flags));
  if (!parsed.ok) fail(`Invalid config:\n  - ${parsed.errors.join('\n  - ')}`);
  const config = parsed.config;
  const template = findTemplate(config.template);
  if (!template) fail(`Unknown template "${config.template}"`);

  // Optional soundtrack: must be a local file, staged under audio/.
  let audio: { from: string; to: string; volume: number } | undefined;
  if (config.audio) {
    const from = path.resolve(REPO_ROOT, config.audio.src);
    if (!existsSync(from) || !statSync(from).isFile()) fail(`Audio file not found: ${config.audio.src}`);
    audio = { from, to: `audio/soundtrack${path.extname(from).toLowerCase()}`, volume: config.audio.volume ?? 0.8 };
  }

  let resolved;
  try {
    resolved = await template.resolve(config, audio ? { audio: { src: audio.to, volume: audio.volume } } : undefined);
  } catch (err) {
    if (err instanceof SocialEngineError) fail(err.message);
    throw err;
  }
  let outputLocation: string;
  try {
    outputLocation = resolveOutputPath(resolved.outputBaseName, typeof flags.out === 'string' ? flags.out : undefined);
  } catch (err) {
    return fail(err instanceof Error ? err.message : String(err), 2);
  }

  console.log(`\n▶ ${template.compositionId}`);
  for (const line of resolved.summary) console.log(`  ${line}`);
  console.log(`  output: ${path.relative(process.cwd(), outputLocation)}`);
  if (flags['dry-run']) {
    console.log('\n✔ Config and data are valid (dry run, nothing rendered).\n');
    return;
  }

  const browserExecutable = detectBrowserExecutable(typeof flags['browser-executable'] === 'string' ? flags['browser-executable'] : undefined);
  const publicDir = stagePublicDir(resolved.publicAssets, audio);
  mkdirSync(path.dirname(outputLocation), { recursive: true });

  console.log('\n… bundling');
  const serveUrl = await bundle({
    entryPoint: ENTRY_POINT,
    publicDir,
    outDir: path.join(CACHE_DIR, 'bundle'),
    webpackOverride: makeWebpackOverride(REPO_ROOT),
  });

  const inputProps = resolved.props;
  const composition = await selectComposition({ serveUrl, id: template.compositionId, inputProps, browserExecutable });
  const expected = Math.round(resolved.durationSeconds * VERTICAL_FORMAT.fps);
  if (composition.durationInFrames !== expected) fail(`Duration mismatch: ${composition.durationInFrames} frames, expected ${expected}`);

  const stillFlag = typeof flags.still === 'string' ? flags.still : undefined;
  if (stillFlag) {
    const frames = stillFlag.split(',').map((f) => Number(f.trim()));
    if (frames.some((f) => !Number.isInteger(f) || f < 0 || f >= composition.durationInFrames)) {
      fail(`--still frames must be integers in 0..${composition.durationInFrames - 1}`, 2);
    }
    for (const frame of frames) {
      const output = outputLocation.replace(/\.mp4$/i, `-f${String(frame).padStart(4, '0')}.png`);
      await renderStill({ composition, serveUrl, inputProps, frame, output, imageFormat: 'png', overwrite: true, browserExecutable });
      console.log(`  ✔ ${path.relative(process.cwd(), output)}`);
    }
    return;
  }
  let frameRange: [number, number] | undefined;
  if (typeof flags.frames === 'string') {
    const m = /^(\d+)-(\d+)$/.exec(flags.frames);
    if (!m || Number(m[1]) > Number(m[2]) || Number(m[2]) >= composition.durationInFrames) {
      fail(`--frames must be "from-to" within 0..${composition.durationInFrames - 1}`, 2);
    }
    frameRange = [Number(m[1]), Number(m[2])];
  }

  let lastPct = -1;
  const started = Date.now();
  await renderMedia({
    composition,
    serveUrl,
    inputProps,
    codec: 'h264',
    pixelFormat: 'yuv420p',
    crf: 18,
    // PNG frames → standard limited-range yuv420p (JPEG frames would yield
    // full-range yuvj420p, which some platforms re-grade).
    imageFormat: 'png',
    muted: !audio,
    outputLocation,
    overwrite: true,
    browserExecutable,
    concurrency: num(flags.concurrency, 'concurrency') ?? null,
    frameRange: frameRange ?? null,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 100);
      if (pct >= lastPct + 10 || pct === 100) {
        lastPct = pct;
        console.log(`  rendering ${pct}%`);
      }
    },
  });
  const size = (statSync(outputLocation).size / 1024 / 1024).toFixed(1);
  console.log(
    `\n✔ ${path.relative(process.cwd(), outputLocation)} · ${composition.width}×${composition.height} · ${composition.fps} fps · ` +
      `${((frameRange ? frameRange[1] - frameRange[0] + 1 : composition.durationInFrames) / composition.fps).toFixed(1)}s · ${size} MB · ${((Date.now() - started) / 1000).toFixed(0)}s\n`,
  );
}

main().catch((err: unknown) => {
  console.error(err);
  fail('Render failed (see the error above).');
});
