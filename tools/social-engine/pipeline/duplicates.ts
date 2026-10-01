import type { History } from './history';
import { recordsOf } from './history';

/**
 * Duplicate policy (see docs/SOCIAL_AGENT_CONTRACT.md):
 *
 * - The unit of uniqueness is the renderId (content + locale + variant).
 * - BLOCKED  same renderId already queued, being rendered, already rendered or published.
 *            → a new edition of the same content needs a new `variant`;
 *              a human can force a re-render with `allowRerender: true`.
 * - ALLOWED  same renderId that FAILED (that's a retry).
 * - ALLOWED + note  same content in another locale/variant (reported, so the
 *            caller knows the subject was already covered).
 */
export type DuplicateVerdict = { ok: true; notes: string[] } | { ok: false; reason: string };

export function checkDuplicate(args: {
  renderId: string;
  contentId: string;
  history: History;
  /** renderId → file name of OTHER entries currently in the queue. */
  queued: Map<string, string>;
  allowRerender: boolean;
}): DuplicateVerdict {
  const { renderId, contentId, history, queued, allowRerender } = args;
  const inQueue = queued.get(renderId);
  if (inQueue) return { ok: false, reason: `duplicate: ${renderId} is already queued (${inQueue})` };
  const record = history.records[renderId];
  if (record && (record.renderStatus === 'rendered' || record.publicationStatus !== 'notPublished') && !allowRerender) {
    const when = record.renderedAt ? ` on ${record.renderedAt.slice(0, 10)}` : '';
    return { ok: false, reason: `duplicate: ${renderId} was already rendered${when}. Use a new "variant" for a new edition.` };
  }
  const notes: string[] = [];
  if (record?.renderStatus === 'failed') notes.push(`retry of a failed render (${record.attempts} attempt(s))`);
  if (record?.renderStatus === 'rendered' && allowRerender) notes.push('re-render forced by allowRerender');
  const siblings = recordsOf(history, contentId).filter((r) => r.renderId !== renderId && r.renderStatus === 'rendered');
  if (siblings.length) notes.push(`same content already rendered as: ${siblings.map((r) => r.renderId.split('@')[1]).join(', ')}`);
  return { ok: true, notes };
}
