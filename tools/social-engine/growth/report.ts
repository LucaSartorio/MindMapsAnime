import type { Catalog } from '../pipeline/catalog';
import type { NextPlan } from './plan';

/**
 * Human reports of a growth decision (the same text in `social:next`,
 * `social:agent` and the CI step summary). Built only from the plan and its
 * SelectionTrace — never re-decides anything.
 */
export type TitleOf = (anime: string) => string;

/** World slug → title, from the catalog (reports only). */
export function titleResolver(catalog: Catalog): TitleOf {
  const titles = new Map<string, string>();
  for (const t of Object.values(catalog.templates)) for (const i of t?.items ?? []) titles.set(i.anime, i.animeTitle);
  return (anime) => titles.get(anime) ?? anime;
}

const RULE_LABEL: Record<string, string> = {
  MAX_SAME_ANIME_STREAK: 'maxSameAnimeStreak',
  MAX_SAME_CHARACTER_STREAK: 'maxSameCharacterStreak',
  JOURNEY_PART_SPACING: 'journeyPartSpacing',
  JOURNEY_PART_ORDER: 'journeyPartOrder',
  DUPLICATE: 'duplicate',
};

export const ruleLabel = (code: string) => RULE_LABEL[code] ?? code;

/** "SOCIAL CONTENT SELECTION" block: pick, mode, score, recent feed, hard rules, main exclusions, top candidates. */
export function selectionReport(plan: NextPlan, titleOf: TitleOf = (a) => a): string[] {
  const t = plan.trace;
  const lines = ['SOCIAL CONTENT SELECTION', ''];
  if (plan.status === 'backlog') {
    lines.push('Status: BACKLOG — no new selection', `Why: ${plan.reason ?? ''}`);
    for (const b of plan.backlog.unpublished) lines.push(`  publish: ${b.renderId} (${b.contentType}) — missing ${b.missing.join(', ')}`);
    for (const b of plan.backlog.inProgress) lines.push(`  in progress: ${b.id} (${b.state})`);
    return lines;
  }
  if (!t) return [...lines, `Status: ${plan.status} — ${plan.reason ?? ''}`];
  const animes = (xs: string[]) => xs.map(titleOf).join(' + ');
  if (t.status === 'selected') {
    lines.push(`Selected: ${t.renderId}`, `Content type: ${t.contentType}`, `Anime: ${animes(t.animes)}`, `Characters: ${t.characters.join(', ')}`);
  } else lines.push(`Status: BLOCKED — ${plan.reason ?? 'no valid candidate'} (nothing is published)`);
  lines.push(
    `Selection mode: ${t.mode}${t.mode === 'coldstart' ? ` (${t.analytics.contents} scored video(s) < minimumSamples ${t.analytics.minimumSamples})` : ''}`,
    `Analytics: ${plan.analytics.status}${plan.analytics.error ? ` (${plan.analytics.error})` : ''}`,
  );
  if (t.score !== null) lines.push(`Score: ${t.score}`);
  lines.push('', `Recent anime: ${t.recent.map((r) => animes(r.animes)).join(' → ') || '(empty feed)'}`);
  lines.push(`Recent characters: ${t.recent.map((r) => r.characters.join('+')).join(' → ') || '—'}`);
  lines.push(`Recent formats: ${t.recent.map((r) => r.contentType).join(' → ') || '—'}`);
  const k = t.constraints;
  lines.push(
    '',
    `Forced anime rotation: ${k.forcedAnimeRotation ? `YES (${animes(k.blockedAnimes)} × ${k.sameAnimeStreak.length})` : 'no'}`,
    `Character blocked: ${k.blockedCharacters.join(', ') || 'none'}`,
    `Format streak: ${k.contentTypeStreak.contentType ?? '—'} × ${k.contentTypeStreak.length}`,
    `Hard rules triggered: ${Object.entries(t.hardRulesTriggered).map(([c, n]) => `${c} ${n}`).join(' · ') || 'none'}`,
    `Candidates: ${t.candidates.eligible}/${t.candidates.considered} valid (${Object.entries(t.candidates.byContentType).map(([c, v]) => `${c} ${v.eligible}/${v.considered}`).join(' · ')})`,
  );
  if (t.excluded.length) {
    lines.push('', 'Excluded (rotation rules first, then potential):');
    for (const e of t.excluded.slice(0, 6)) lines.push(`  ${e.renderId}`, `    reason: ${e.reasons.map(ruleLabel).join(', ')} · potential ${e.potentialScore}`);
  }
  if (t.ranked.length) {
    lines.push('', 'Valid candidates (score):');
    for (const r of t.ranked.slice(0, 5)) lines.push(`  ${r.renderId}  ${r.score}`);
  }
  lines.push('', 'Why:', ...t.explanation.map((e) => `  ${e}`));
  return lines;
}
