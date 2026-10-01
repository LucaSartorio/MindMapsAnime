/**
 * social:queue — add content to the render queue (validated, de-duplicated).
 *
 *   npm run social:queue -- --template character-journey --anime naruto --character sasuke-uchiha --locale en
 *   npm run social:queue -- --from agent-proposal.json        # one request or an ARRAY of requests
 *   npm run social:queue -- --list
 *
 * Writes content/queue/NNNN-<anime>_<subject>_<template>_<locale>.json with
 * every default made explicit. Exit 1 when any request is rejected.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pipelineDirs, relToRepo } from '../pipeline/dirs';
import { enqueueMany } from '../pipeline/enqueue';
import { loadHistory } from '../pipeline/history';
import { inspectQueue, listContentFiles } from '../pipeline/queue';
import { templateNames } from '../templates/registry';
import { parseArgs, type FlagSpec } from './args';
import { fail, numberFlag, stringFlag } from './common';

const SPEC: FlagSpec = {
  template: 'string', anime: 'string', character: 'string', subject: 'string', locale: 'string', hook: 'string',
  cta: 'string', duration: 'string', variant: 'string', 'max-stops': 'string', notes: 'string', from: 'string',
  force: 'boolean', list: 'boolean', 'dry-run': 'boolean', help: 'boolean',
};

const HELP = `Usage: npm run social:queue -- [options]

  --template <name> --anime <slug> --character <slug|id>   (${templateNames()})
  --locale <en|it>  --hook <text>  --cta <text>  --duration <12–60>  --max-stops <2–8>
  --variant <slug>     new editorial edition of content already rendered
  --notes <text>       why this content (kept in the file, never rendered)
  --force              allow re-rendering an already rendered video (human override)
  --from <file.json>   enqueue one request or an array of requests (agent output)
  --list               show queue / failed / rendered
  --dry-run            validate only, write nothing
`;

function list() {
  const dirs = pipelineDirs();
  const history = loadHistory(dirs);
  return inspectQueue(dirs, history).then((items) => {
    console.log(`\nqueue (${relToRepo(dirs, dirs.queue)}):`);
    if (!items.length) console.log('  (empty)');
    for (const i of items) console.log(i.ok ? `  ✔ ${i.name}  →  ${i.plan.renderId}` : `  ✖ ${i.name}  [${i.kind}] ${i.errors.join('; ')}`);
    console.log(`failed:   ${listContentFiles(dirs.failed).entries.length}`);
    console.log(`rendered: ${listContentFiles(dirs.rendered).entries.length}`);
    const counts = Object.values(history.records).reduce<Record<string, number>>((acc, r) => ((acc[r.renderStatus] = (acc[r.renderStatus] ?? 0) + 1), acc), {});
    console.log(`history:  ${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(' · ') || 'empty'}\n`);
  });
}

async function main() {
  const { flags, errors } = parseArgs(process.argv.slice(2), SPEC);
  if (flags.help) return console.log(HELP);
  if (errors.length) fail(`${errors.join('\n  ')}\n\n${HELP}`, 2);
  if (flags.list) return list();

  let raws: unknown[];
  const from = stringFlag(flags, 'from');
  if (from) {
    const abs = path.resolve(process.cwd(), from);
    if (!existsSync(abs)) fail(`File not found: ${from}`, 2);
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(abs, 'utf8'));
    } catch (err) {
      fail(`${from}: invalid JSON (${(err as Error).message})`);
    }
    raws = Array.isArray(parsed) ? parsed : [parsed];
  } else {
    if (!flags.template) fail(`Pass --template/--anime/--character, --from <file> or --list.\n\n${HELP}`, 2);
    const raw: Record<string, unknown> = {};
    const set = (key: string, value: unknown) => value !== undefined && (raw[key] = value);
    set('template', stringFlag(flags, 'template'));
    set('anime', stringFlag(flags, 'anime'));
    set('subject', stringFlag(flags, 'character') ?? stringFlag(flags, 'subject'));
    set('locale', stringFlag(flags, 'locale'));
    set('hook', stringFlag(flags, 'hook'));
    set('cta', stringFlag(flags, 'cta'));
    set('variant', stringFlag(flags, 'variant'));
    set('notes', stringFlag(flags, 'notes'));
    set('durationSeconds', numberFlag(flags, 'duration'));
    const maxStops = numberFlag(flags, 'max-stops');
    if (maxStops !== undefined) raw.journey = { maxStops };
    if (flags.force) raw.allowRerender = true;
    raws = [raw];
  }

  const dirs = pipelineDirs();
  const results = await enqueueMany(dirs, raws, { dryRun: Boolean(flags['dry-run']) });
  let rejected = 0;
  results.forEach((r, i) => {
    const label = raws.length > 1 ? `#${i + 1} ` : '';
    if (r.ok) {
      console.log(`\n✔ ${label}${flags['dry-run'] ? 'would queue' : 'queued'} ${r.renderId}`);
      console.log(`  file: ${relToRepo(dirs, path.join(dirs.queue, r.file))}`);
      console.log(`  hook: "${String(r.entry.hook ?? '')}"  · ${String(r.entry.durationSeconds)}s`);
      for (const n of r.notes) console.log(`  note: ${n}`);
    } else {
      rejected++;
      console.log(`\n✖ ${label}rejected:\n  - ${r.errors.join('\n  - ')}`);
    }
  });
  console.log(`\n${results.length - rejected} accepted · ${rejected} rejected\n`);
  if (rejected) process.exitCode = 1;
}

main().catch((err: unknown) => fail(err instanceof Error ? err.message : String(err)));
