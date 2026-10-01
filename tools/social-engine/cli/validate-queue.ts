/**
 * social:validate:queue — checks every queued file WITHOUT rendering or
 * changing anything: JSON, schema, template, anime, subject, renderable data,
 * duplicates (in the queue and against history). Exit 1 if any is invalid.
 */
import { pipelineDirs, relToRepo } from '../pipeline/dirs';
import { loadHistory } from '../pipeline/history';
import { inspectQueue } from '../pipeline/queue';
import { fail } from './common';

async function main() {
  const dirs = pipelineDirs();
  const items = await inspectQueue(dirs, loadHistory(dirs));
  console.log(`\n${relToRepo(dirs, dirs.queue)}: ${items.length} file(s)`);
  for (const i of items) {
    if (i.ok) {
      console.log(`  ✔ ${i.name}\n      ${i.plan.renderId} · ${i.plan.resolved.durationSeconds}s · "${String((i.plan.resolved.props as { data?: { hook?: string } }).data?.hook ?? '')}"`);
      for (const n of i.notes) console.log(`      note: ${n}`);
    } else {
      console.log(`  ✖ ${i.name}  [${i.kind}]\n      ${i.errors.join('\n').split('\n').map((l) => l.trim()).join('\n      ')}`);
    }
  }
  const bad = items.filter((i) => !i.ok).length;
  console.log(`\n${items.length - bad} valid · ${bad} invalid\n`);
  if (bad) process.exitCode = 1;
}

main().catch((err: unknown) => fail(err instanceof Error ? err.message : String(err)));
