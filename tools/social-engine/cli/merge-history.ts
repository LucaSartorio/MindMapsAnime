/**
 * git merge driver for tools/social-engine/history/history.json (see .gitattributes):
 *   git config merge.social-history.driver "npx --no-install tsx tools/social-engine/cli/merge-history.ts %O %A %B"
 * Configured ONLY inside the social workflows, right before they rebase their state
 * commit on a branch that moved. Writes the merged history into %A; exit 1 = conflict.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { mergeHistories } from '../pipeline/historyMerge';

const [baseFile, oursFile, theirsFile] = process.argv.slice(2);
if (!baseFile || !oursFile || !theirsFile) {
  console.error('usage: merge-history.ts <base> <ours> <theirs>');
  process.exit(2);
}
const read = (f: string): unknown => {
  const text = readFileSync(f, 'utf8');
  return text.trim() ? (JSON.parse(text) as unknown) : { schemaVersion: 1, records: {} };
};
const result = mergeHistories(read(baseFile), read(oursFile), read(theirsFile));
if (!result.ok) {
  console.error(`history.json: conflicting changes to ${result.conflicts.join(', ')}`);
  process.exit(1);
}
const records = Object.fromEntries(Object.keys(result.history.records).sort().map((k) => [k, result.history.records[k]]));
writeFileSync(oursFile, `${JSON.stringify({ schemaVersion: 1, records }, null, 2)}\n`);
console.error('history.json: merged field by field');
