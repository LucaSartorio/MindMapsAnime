import type { ComponentType } from 'react';
import type { Collector, Obj } from '../config/schema';
import type { SocialVideoConfig, TemplateId } from '../config/types';

/** What a template returns once its data is resolved and validated. */
export type ResolvedVideo = {
  /** Serializable Remotion input props (config + resolved data). */
  props: Record<string, unknown>;
  durationSeconds: number;
  /** Deterministic file name, without extension. */
  outputBaseName: string;
  /** Public-dir relative files the render needs (staged next to the bundle). */
  publicAssets: string[];
  /** Human-readable plan printed by the CLI (`--dry-run`, validate). */
  summary: string[];
};

export type ResolveOptions = {
  /** Public-dir relative path of an already-staged soundtrack. */
  audio?: { src: string; volume: number };
};

/**
 * A video template. Adding one = a folder in `templates/` exporting a
 * definition + an entry in `templates/registry.ts`; the CLI, validation and
 * Studio pick it up from there (no switch to update elsewhere).
 * Methods use method syntax on purpose (bivariant params) so definitions with a
 * narrower config type fit the registry.
 */
export type TemplateDefinition<C extends SocialVideoConfig = SocialVideoConfig> = {
  id: TemplateId;
  /** Remotion composition id (PascalCase). */
  compositionId: string;
  /** Kebab-case name used by the CLI (`--template character-journey`). */
  cliName: string;
  description: string;
  /** Example config, also the Studio default props. */
  example: C;
  parseConfig(input: Obj, collector: Collector): C;
  resolve(config: C, options?: ResolveOptions): Promise<ResolvedVideo>;
  /** Registers the `<Composition>` (rendered by `Root.tsx`). */
  Composition: ComponentType;
};
