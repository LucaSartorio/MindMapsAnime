import { fillTemplate } from '../config/copy';
import { MAX_HOOK_CHARS } from '../config/defaults';
import { GROWTH_CONFIG, HOOK_TYPES, type GrowthConfig, type HookType } from './config';
import type { FeedItem } from './feed';
import type { Rng } from './rng';

/**
 * Hook engine: a bank of deterministic, typed hook templates (no AI text).
 * Placeholders: {character} {anime} {places} {arcs} {part} {total} {prev}
 * {count} {characterA} {characterB} {animeA} {animeB}. A template is usable
 * only when every placeholder it needs is known AND the filled text fits the
 * video (≤ MAX_HOOK_CHARS). Guess hooks never contain the answer.
 */
export type HookRole = 'single' | 'first' | 'continuation' | 'last';
export type HookTemplate = { id: string; contentType: string; hookType: HookType; text: string; roles?: HookRole[] };

export const HOOK_BANK: HookTemplate[] = [
  // character-journey — single videos and Part 1
  { id: 'cj-question-1', contentType: 'character-journey', hookType: 'question', text: 'Can you name every place {character} visited?', roles: ['single', 'first'] },
  { id: 'cj-question-2', contentType: 'character-journey', hookType: 'question', text: "Do you remember where {character}'s journey began?", roles: ['first'] },
  { id: 'cj-question-3', contentType: 'character-journey', hookType: 'question', text: 'How well do you know where {character} has been?', roles: ['single', 'first'] },
  { id: 'cj-challenge-1', contentType: 'character-journey', hookType: 'challenge', text: 'Only real {anime} fans know all these places.', roles: ['single', 'first'] },
  { id: 'cj-challenge-2', contentType: 'character-journey', hookType: 'challenge', text: 'Name every stop before {character} gets there.', roles: ['single', 'first', 'continuation', 'last'] },
  { id: 'cj-curiosity-1', contentType: 'character-journey', hookType: 'curiosity', text: "{character}'s journey is bigger than you remember.", roles: ['single', 'first'] },
  { id: 'cj-curiosity-2', contentType: 'character-journey', hookType: 'curiosity', text: "You've never seen {character}'s journey like this.", roles: ['single', 'first'] },
  { id: 'cj-fact-1', contentType: 'character-journey', hookType: 'fact', text: '{character} visited {places} places across {anime}.', roles: ['single', 'first'] },
  { id: 'cj-fact-2', contentType: 'character-journey', hookType: 'fact', text: '{places} places. {arcs} story arcs. One journey: {character}.', roles: ['single', 'first'] },
  // character-journey — later parts
  { id: 'cj-cont-question-1', contentType: 'character-journey', hookType: 'question', text: 'Where did {character} go next? Part {part} of {total}.', roles: ['continuation', 'last'] },
  { id: 'cj-cont-challenge-1', contentType: 'character-journey', hookType: 'challenge', text: 'Remember where Part {prev} ended? Part {part} starts now.', roles: ['continuation', 'last'] },
  { id: 'cj-cont-fact-1', contentType: 'character-journey', hookType: 'fact', text: "{character}'s journey continues — Part {part} of {total}.", roles: ['continuation'] },
  { id: 'cj-cont-curiosity-1', contentType: 'character-journey', hookType: 'curiosity', text: "Part {part} of {total}: {character}'s journey keeps growing.", roles: ['continuation'] },
  { id: 'cj-last-fact-1', contentType: 'character-journey', hookType: 'fact', text: "The final stretch of {character}'s journey — Part {part} of {total}.", roles: ['last'] },
  // guess-character (never the answer)
  { id: 'gc-challenge-1', contentType: 'guess-character', hookType: 'challenge', text: 'Guess the {anime} character from the places they visited.' },
  { id: 'gc-challenge-2', contentType: 'guess-character', hookType: 'challenge', text: 'Only real {anime} fans get this before the last place.' },
  { id: 'gc-question-1', contentType: 'guess-character', hookType: 'question', text: 'Who visited all these places?' },
  { id: 'gc-question-2', contentType: 'guess-character', hookType: 'question', text: 'Can you guess this {anime} character?' },
  { id: 'gc-curiosity-1', contentType: 'guess-character', hookType: 'curiosity', text: '{count} places. One {anime} character. Who is it?' },
  { id: 'gc-fact-1', contentType: 'guess-character', hookType: 'fact', text: 'These {count} places belong to one {anime} character.' },
  // character-versus
  { id: 'cv-versus-1', contentType: 'character-versus', hookType: 'versus', text: 'Who travelled more: {characterA} or {characterB}?' },
  { id: 'cv-versus-2', contentType: 'character-versus', hookType: 'versus', text: '{characterA} vs {characterB}: whose journey is bigger?' },
  { id: 'cv-question-1', contentType: 'character-versus', hookType: 'question', text: 'Who covered more ground, {characterA} or {characterB}?' },
  { id: 'cv-challenge-1', contentType: 'character-versus', hookType: 'challenge', text: 'Pick your side before the reveal: {characterA} or {characterB}?' },
  { id: 'cv-curiosity-1', contentType: 'character-versus', hookType: 'curiosity', text: '{characterA} or {characterB}: who explored more of their world?' },
];

export type HookChoice = { hookId: string; hookType: HookType; hook: string };

export function fillHook(t: HookTemplate, vars: Record<string, string>): string | null {
  const text = fillTemplate(t.text, vars);
  if (/\{\w+\}/.test(text) || text.length > MAX_HOOK_CHARS) return null;
  return text;
}

/** Usable hooks for a content, after the cooldowns (most recent hook templates can't be reused). */
export function hookOptions(contentType: string, role: HookRole, vars: Record<string, string>, feed: readonly FeedItem[], config: GrowthConfig = GROWTH_CONFIG): (HookChoice & { recentType: boolean })[] {
  const recent = feed.slice(Math.max(0, feed.length - config.hookCooldown));
  const usedIds = new Set(recent.map((f) => f.hookId).filter(Boolean));
  const lastType = feed[feed.length - 1]?.hookType ?? null;
  const all = HOOK_BANK.filter((t) => t.contentType === contentType && (!t.roles || t.roles.includes(role)))
    .map((t) => ({ t, hook: fillHook(t, vars) }))
    .filter((x): x is { t: HookTemplate; hook: string } => x.hook !== null);
  const fresh = all.filter((x) => !usedIds.has(x.t.id));
  // Never run out: if every template was used recently, fall back to the full set.
  return (fresh.length ? fresh : all).map(({ t, hook }) => ({ hookId: t.id, hookType: t.hookType, hook, recentType: t.hookType === lastType }));
}

/**
 * Picks the hook: the same hook type as the previous video is avoided when
 * possible; among the rest, exploit = best-performing hook type (`typeScores`,
 * 0–100, shrunk toward the mean by the caller), explore / cold start = the hook
 * type used least recently. Ties are broken by the seeded rng.
 */
export function chooseHook(args: {
  contentType: string;
  role: HookRole;
  vars: Record<string, string>;
  feed: readonly FeedItem[];
  mode: 'exploit' | 'explore' | 'coldstart';
  typeScores?: Partial<Record<HookType, number>>;
  rng: Rng;
  config?: GrowthConfig;
}): HookChoice | null {
  const config = args.config ?? GROWTH_CONFIG;
  const options = hookOptions(args.contentType, args.role, args.vars, args.feed, config);
  if (!options.length) return null;
  const pool = options.some((o) => !o.recentType) ? options.filter((o) => !o.recentType) : options;
  const lastUse = (type: HookType) => {
    for (let i = args.feed.length - 1; i >= 0; i--) if (args.feed[i].hookType === type) return args.feed.length - 1 - i;
    return Number.POSITIVE_INFINITY;
  };
  const score = (o: HookChoice) =>
    args.mode === 'exploit' ? (args.typeScores?.[o.hookType] ?? 50) : Math.min(lastUse(o.hookType), 50) + HOOK_TYPES.indexOf(o.hookType) * 0.001;
  const best = Math.max(...pool.map(score));
  const top = pool.filter((o) => Math.abs(score(o) - best) < 1e-9);
  const picked = top[Math.floor(args.rng() * top.length)] ?? top[0];
  return { hookId: picked.hookId, hookType: picked.hookType, hook: picked.hook };
}
