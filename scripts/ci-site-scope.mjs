#!/usr/bin/env node
/**
 * Site CI (`.github/workflows/site-ci.yml`) — quali Pull Request devono passare
 * la validazione completa del sito?
 *
 * Le automazioni social aprono ogni giorno PR che toccano SOLO il social
 * engine (coda, receipt di pubblicazione, snapshot analytics). Il sito non
 * importa mai `tools/social-engine` (regola in CLAUDE.md, verificata da
 * `social:validate`), quindi per quelle PR la build completa (~16.000 pagine)
 * non verifica niente di nuovo: il social engine ha già i suoi workflow.
 *
 * Regola (conservativa: nel dubbio si valida tutto):
 *   - ogni file sotto `tools/social-engine/` o un workflow `social-*.yml`
 *     → PR "solo social", validazione del sito non necessaria;
 *   - qualsiasi altro file (src/, scripts/, public/, package*.json, vercel.json,
 *     docs, questo script, site-ci.yml…) → validazione completa;
 *   - nessun file (diff vuoto o non calcolabile) → validazione completa.
 *
 * Nessuna dipendenza npm: gira prima di `npm ci`.
 *
 * CLI: legge l'elenco dei file (uno per riga) da stdin, stampa la decisione e,
 * dentro GitHub Actions, scrive `site=true|false` in $GITHUB_OUTPUT.
 *   git diff --name-only --no-renames HEAD^1 HEAD | node scripts/ci-site-scope.mjs
 */
import { appendFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Prefissi dei file che appartengono SOLO alle automazioni social. */
export const SOCIAL_ONLY_PREFIXES = ['tools/social-engine/'];

/** Workflow del social engine (`.github/workflows/social-*.yml`). */
const SOCIAL_WORKFLOW = /^\.github\/workflows\/social-[^/]+\.ya?ml$/;

/** Il file appartiene solo al social engine? */
export function isSocialOnlyPath(file) {
  return SOCIAL_ONLY_PREFIXES.some((p) => file.startsWith(p)) || SOCIAL_WORKFLOW.test(file);
}

/**
 * @param {string[]} files percorsi relativi alla radice del repository
 * @returns {{ site: boolean, reason: string, siteFiles: string[] }}
 */
export function classifyChangedFiles(files) {
  const clean = files.map((f) => f.trim()).filter(Boolean);
  if (clean.length === 0) {
    return { site: true, reason: 'nessun file modificato rilevato: validazione completa per sicurezza', siteFiles: [] };
  }
  const siteFiles = clean.filter((f) => !isSocialOnlyPath(f));
  if (siteFiles.length === 0) {
    return { site: false, reason: `${clean.length} file, tutti del social engine: validazione del sito non necessaria`, siteFiles };
  }
  return { site: true, reason: `${siteFiles.length}/${clean.length} file fuori dal social engine: validazione completa`, siteFiles };
}

function main() {
  const files = readFileSync(0, 'utf8').split('\n');
  const { site, reason, siteFiles } = classifyChangedFiles(files);
  console.log(`[site-ci] ${reason}`);
  for (const f of siteFiles.slice(0, 20)) console.log(`  · ${f}`);
  if (siteFiles.length > 20) console.log(`  · … altri ${siteFiles.length - 20}`);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `site=${site}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
