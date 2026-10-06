import { Collector, isObj, type ConfigParseResult } from '../config/schema';
import type { TemplateId } from '../config/types';
import { compact } from '../config/schema';
import { characterJourneyTemplate } from './characterJourney';
import { characterVersusTemplate } from './characterVersus';
import { guessCharacterTemplate } from './guessCharacter';
import type { TemplateDefinition } from './types';

/**
 * Central template registry — the ONLY place that lists templates.
 * Future: locationSpotlight, arcTimeline, worldComparison, factionOverview,
 * didYouKnow → add a folder + one line here.
 */
export const TEMPLATES: Record<TemplateId, TemplateDefinition> = {
  characterJourney: characterJourneyTemplate,
  guessCharacter: guessCharacterTemplate,
  characterVersus: characterVersusTemplate,
};

export const TEMPLATE_LIST: TemplateDefinition[] = Object.values(TEMPLATES);

/** Accepts the id (`characterJourney`) or the CLI name (`character-journey`), case-insensitive. */
export function findTemplate(name: string): TemplateDefinition | undefined {
  const key = name.replace(/[-_\s]/g, '').toLowerCase();
  return TEMPLATE_LIST.find((t) => t.id.toLowerCase() === key);
}

export function templateNames(): string {
  return TEMPLATE_LIST.map((t) => `${t.cliName} (${t.id})`).join(', ');
}

/** Validates any config (parsed JSON / CLI flags) and dispatches to its template. */
export function parseSocialVideoConfig(input: unknown): ConfigParseResult {
  if (!isObj(input)) return { ok: false, errors: ['config: must be a JSON object'] };
  if (typeof input.template !== 'string') return { ok: false, errors: [`template: is required (one of: ${templateNames()})`] };
  const template = findTemplate(input.template);
  if (!template) return { ok: false, errors: [`template: unknown template "${input.template}" (available: ${templateNames()})`] };
  const c = new Collector();
  const config = template.parseConfig({ ...input, template: template.id }, c);
  return c.errors.length ? { ok: false, errors: c.errors } : { ok: true, config: compact(config) };
}
