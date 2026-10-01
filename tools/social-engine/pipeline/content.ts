import { createHash } from 'node:crypto';
import path from 'node:path';
import { Collector, isObj, type Obj } from '../config/schema';
import type { SocialVideoConfig, VideoLocale } from '../config/types';
import { DEFAULT_LOCALE } from '../config/defaults';
import { findTemplate, parseSocialVideoConfig } from '../templates/registry';
import type { ResolvedVideo, TemplateDefinition } from '../templates/types';
import type { PipelineDirs } from './dirs';
import type { RecordIdentity } from './history';
import { isInside, isRegularFile } from './fs';
import { contentIdFor, fileStemFor, isSafeSegment, renderIdFor } from './ids';

/**
 * A content request = what a person or an agent drops in `content/queue/`:
 * a video config (`SocialVideoConfig`) + a few pipeline fields. The contract is
 * documented in docs/SOCIAL_AGENT_CONTRACT.md and schemas/social-content.schema.json.
 */
export const PIPELINE_KEYS = ['id', 'variant', 'status', 'notes', 'allowRerender'] as const;
export const MAX_NOTES = 500;

export type ContentRequest = {
  config: SocialVideoConfig;
  /** Optional: when given, must equal the computed content id. */
  id?: string;
  /** Editorial variant (a new hook/angle on content already rendered). */
  variant: string | null;
  /** Free text for humans (why this content). Never rendered. */
  notes?: string;
  /** Human override to re-render an already rendered video (agents must not set it). */
  allowRerender: boolean;
};

export type RequestParseResult = { ok: true; request: ContentRequest } | { ok: false; errors: string[] };

export function parseContentRequest(input: unknown): RequestParseResult {
  if (!isObj(input)) return { ok: false, errors: ['content: must be a JSON object'] };
  const c = new Collector();
  const pipeline: Obj = {};
  const video: Obj = {};
  for (const [k, v] of Object.entries(input)) ((PIPELINE_KEYS as readonly string[]).includes(k) ? pipeline : video)[k] = v;

  if (pipeline.id !== undefined && (typeof pipeline.id !== 'string' || !pipeline.id.trim())) c.push('id', 'must be a non-empty string');
  let variant: string | null = null;
  if (pipeline.variant !== undefined) {
    if (typeof pipeline.variant !== 'string' || !isSafeSegment(pipeline.variant)) c.push('variant', 'must be a lowercase slug (a-z, 0-9, "-"), max 80 chars');
    else variant = pipeline.variant;
  }
  if (pipeline.status !== undefined && pipeline.status !== 'queued') c.push('status', 'when present must be "queued" (the pipeline owns every other state)');
  if (pipeline.notes !== undefined && (typeof pipeline.notes !== 'string' || pipeline.notes.length > MAX_NOTES)) c.push('notes', `must be a string of at most ${MAX_NOTES} characters`);
  if (pipeline.allowRerender !== undefined && typeof pipeline.allowRerender !== 'boolean') c.push('allowRerender', 'must be a boolean');

  const parsed = parseSocialVideoConfig(video);
  const errors = [...c.errors, ...(parsed.ok ? [] : parsed.errors)];
  if (!parsed.ok || errors.length) return { ok: false, errors };
  return {
    ok: true,
    request: {
      config: parsed.config,
      ...(typeof pipeline.id === 'string' ? { id: pipeline.id.trim() } : {}),
      variant,
      ...(typeof pipeline.notes === 'string' ? { notes: pipeline.notes } : {}),
      allowRerender: pipeline.allowRerender === true,
    },
  };
}

/** A request whose data has been resolved: ids, files, props — everything needed to render. */
export type PlannedContent = {
  request: ContentRequest;
  template: TemplateDefinition;
  resolved: ResolvedVideo;
  contentId: string;
  renderId: string;
  locale: VideoLocale;
  variant: string | null;
  fileStem: string;
  /** Validated absolute path of the soundtrack + its staged public path. */
  audio?: { from: string; to: string; volume: number };
};

/**
 * Audio must be a regular file inside `<root>/audio/` (relative path, allowed
 * extension): a content file can never read anything else on disk.
 */
export function resolveAudioPath(dirs: PipelineDirs, src: string): string {
  if (path.isAbsolute(src) || src.split(/[\\/]/).includes('..')) throw new Error(`audio.src must be a relative path inside ${path.basename(dirs.root)}/audio/ (got "${src}")`);
  const rel = src.replace(/^audio[\\/]/, '');
  const abs = path.resolve(dirs.audio, rel);
  if (!isInside(dirs.audio, abs)) throw new Error(`audio.src escapes the audio directory: "${src}"`);
  if (!isRegularFile(abs)) throw new Error(`Audio file not found: audio/${rel}`);
  return abs;
}

/** Resolves a request against the real data. Throws SocialEngineError / Error with a clear message. */
export async function planContent(dirs: PipelineDirs, request: ContentRequest): Promise<PlannedContent> {
  const template = findTemplate(request.config.template);
  if (!template) throw new Error(`Unknown template "${request.config.template}"`);
  let audio: PlannedContent['audio'];
  if (request.config.audio) {
    const from = resolveAudioPath(dirs, request.config.audio.src);
    const hash = createHash('sha1').update(from).digest('hex').slice(0, 12);
    audio = { from, to: `audio/${hash}${path.extname(from).toLowerCase()}`, volume: request.config.audio.volume ?? 0.8 };
  }
  const resolved = await template.resolve(request.config, audio ? { audio: { src: audio.to, volume: audio.volume } } : undefined);
  const contentId = contentIdFor(template.cliName, resolved.identity.anime, resolved.identity.subject, resolved.identity.segment);
  if (request.id !== undefined && request.id !== contentId) {
    throw new Error(`id mismatch: the config describes "${contentId}" but id says "${request.id}" (omit id, or fix it)`);
  }
  const locale = request.config.locale ?? DEFAULT_LOCALE;
  const key = { contentId, locale, variant: request.variant };
  return { request, template, resolved, contentId, renderId: renderIdFor(key), locale, variant: request.variant, fileStem: fileStemFor(key), audio };
}

/**
 * Canonical JSON written to the queue: defaults applied explicitly (locale,
 * duration, hook, CTA) and the subject normalized to its catalog slug, so the
 * file alone says exactly what will be rendered.
 */
export function canonicalQueueEntry(plan: PlannedContent): Obj {
  const data = (plan.resolved.props as { data?: { hook?: string; cta?: string } }).data;
  const { template, anime: _anime, locale: _locale, durationSeconds: _d, hook: _h, cta: _c, ...rest } = plan.request.config;
  const subject = 'subject' in rest ? { subject: plan.resolved.identity.subject } : {};
  const segment = plan.resolved.identity.segment ? { segment: plan.resolved.identity.segment } : {};
  // Fixed, readable key order: identity → what to say → optional tuning.
  return {
    $schema: '../../schemas/social-content.schema.json',
    id: plan.contentId,
    status: 'queued',
    template,
    anime: plan.resolved.identity.anime,
    ...subject,
    ...segment,
    locale: plan.locale,
    ...(plan.variant ? { variant: plan.variant } : {}),
    durationSeconds: plan.resolved.durationSeconds,
    ...(data?.hook ? { hook: data.hook } : {}),
    ...(data?.cta ? { cta: data.cta } : {}),
    ...rest,
    ...subject,
    ...(plan.request.notes ? { notes: plan.request.notes } : {}),
    ...(plan.request.allowRerender ? { allowRerender: true } : {}),
  };
}

/** History identity of a planned content (shared by the queue CLI and the batch). */
export function recordIdentity(plan: PlannedContent): RecordIdentity {
  return {
    renderId: plan.renderId,
    contentId: plan.contentId,
    template: plan.template.id,
    anime: plan.resolved.identity.anime,
    subject: plan.resolved.identity.subject,
    locale: plan.locale,
    variant: plan.variant,
    segment: plan.resolved.identity.segment,
    segmentFingerprint: plan.resolved.segment?.fingerprint ?? null,
  };
}
