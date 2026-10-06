import type { ComponentType } from 'react';
import type { Collector, Obj } from '../config/schema';
import type { SocialVideoConfig, TemplateId, VideoLocale } from '../config/types';
import type { LoadedWorld } from '../data/world';
import type { SocialFacts } from '../growth/metadata';
import type { CoverProps } from '../components/Cover';

/** Who/what a video is about, in canonical (permanent) slugs — the basis of content ids. */
export type ContentIdentity = {
  /** Internal world slug (`naruto`, `onepiece`): permanent, never translated. */
  anime: string;
  /** Canonical SEO slug of the subject (`itachi-uchiha`): permanent, language-independent. */
  subject: string;
  /** Display name in the rendered locale (logs, manifests). */
  subjectName: string;
  locale: VideoLocale;
  /** Part key (`part-01`) when the content is one part of a series; null for a single video. */
  segment: string | null;
};

/** Series facts of a part (manifest, render summary, history, catalog). */
export type SegmentInfo = {
  segment: string;
  partNumber: number;
  partCount: number;
  arcIds: string[];
  arcTitles: string[];
  firstArc: string | null;
  lastArc: string | null;
  segmentStopCount: number;
  fullJourneyStopCount: number;
  segmentationVersion: number;
  fingerprint: string;
};

/** What a template returns once its data is resolved and validated. */
export type ResolvedVideo = {
  identity: ContentIdentity;
  /** Series facts when the content is a part, else null. */
  segment: SegmentInfo | null;
  /** Serializable Remotion input props (config + resolved data). */
  props: Record<string, unknown>;
  durationSeconds: number;
  /** Public-dir relative files the render needs (staged next to the bundle). */
  publicAssets: string[];
  /** Human-readable plan printed by the CLIs (`--dry-run`, validate). */
  summary: string[];
  /** Small, publication-friendly facts copied into the render manifest. */
  manifest: Record<string, string | number | string[]>;
  /** Normalized config fields written back to the queue entry (e.g. a versus' subject + opponent). Default: `{ subject }`. */
  canonicalConfig?: Record<string, unknown>;
  /** Editorial facts for the growth engine (feed rules, captions). */
  social: SocialFacts;
  /** Cover still, rendered next to the MP4. */
  cover: CoverProps;
};

export type ResolveOptions = {
  /** Public-dir relative path of an already-staged soundtrack. */
  audio?: { src: string; volume: number };
};

/** Why a subject can't be produced by a template (catalog report). */
export type ExclusionReason =
  | 'missing_slug'
  | 'no_journey_data'
  | 'missing_coordinates'
  | 'single_location'
  | 'missing_translation'
  | 'not_guessable'
  | 'not_in_versus_roster';

/** One producible content, as listed in catalog.json (compact, agent-oriented). */
export type CatalogCandidate = {
  subject: string;
  /** Part of a series (null = single video). Parts of one subject are listed in order. */
  segment: (SegmentInfo & { arcTitlesByLocale: Record<VideoLocale, string[]> }) | null;
  subjectId: string;
  displayName: Record<VideoLocale, string>;
  /** Locales whose text is really authored for this content (no fallback). */
  locales: VideoLocale[];
  recommendedDurationSeconds: number;
  /** Template-specific, flat, small facts that help choosing (importance, places…). */
  facts: Record<string, string | number>;
  /** Extra fields of the queue request (e.g. a versus' `opponent`). */
  request?: Record<string, unknown>;
};

export type CatalogExclusion = { subject: string | null; subjectId: string; displayName: string; reason: ExclusionReason; detail?: string };

export type CatalogScan = { candidates: CatalogCandidate[]; excluded: CatalogExclusion[] };

/** JSON-Schema fragment of a template's own fields (composed into schemas/social-content.schema.json). */
export type TemplateSchemaFragment = { properties: Record<string, unknown>; required: string[] };

/**
 * A video template. Adding one = a folder in `templates/` exporting a
 * definition + an entry in `templates/registry.ts`; the CLIs, the catalog, the
 * queue, the JSON schema and Studio pick it up from there (no switch elsewhere).
 * Methods use method syntax on purpose (bivariant params) so definitions with a
 * narrower config type fit the registry.
 */
export type TemplateDefinition<C extends SocialVideoConfig = SocialVideoConfig> = {
  id: TemplateId;
  /** Remotion composition id (PascalCase). */
  compositionId: string;
  /** Kebab-case name used by the CLIs, content ids and file names (`character-journey`). */
  cliName: string;
  description: string;
  /** Example config, also the Studio default props. */
  example: C;
  /** Template-specific config keys (besides the shared ones). */
  configKeys: readonly string[];
  parseConfig(input: Obj, collector: Collector): C;
  /** Builds a config for a catalog subject (queue CLI). */
  configFor(anime: string, subject: string, locale: VideoLocale, segment?: string): C;
  resolve(config: C, options?: ResolveOptions): Promise<ResolvedVideo>;
  /**
   * Every subject of a world this template can (or can't, with a reason) produce.
   * `context.worlds` = every available world (cross-world templates like versus).
   */
  scan(world: LoadedWorld, context: { worlds: LoadedWorld[] }): CatalogScan;
  schema: TemplateSchemaFragment;
  /** Registers the `<Composition>` (rendered by `Root.tsx`). */
  Composition: ComponentType;
};
