/**
 * social:catalog — scans the real datasets and writes what can be produced:
 *   catalog/catalog.json   available contents (+ history status) — the agent's menu
 *   catalog/excluded.json  everything else, with the reason
 */
import { buildCatalog, catalogSummary, writeCatalog } from '../pipeline/catalog';
import { pipelineDirs, relToRepo } from '../pipeline/dirs';
import { loadHistory } from '../pipeline/history';
import { fail } from './common';

async function main() {
  const dirs = pipelineDirs();
  const built = await buildCatalog(dirs, loadHistory(dirs), new Date().toISOString());
  if (process.argv.includes('--check')) {
    console.log(catalogSummary(built).join('\n'));
    return;
  }
  writeCatalog(dirs, built);
  console.log(`\n${catalogSummary(built).join('\n')}\n`);
  console.log(`✔ ${relToRepo(dirs, dirs.catalog)}/catalog.json · excluded.json\n`);
}

main().catch((err: unknown) => fail(err instanceof Error ? err.message : String(err)));
