/**
 * Test dei criteri di selezione della Site CI (`node --test`, nessuna dipendenza).
 * Ogni caso riproduce un tipo di Pull Request reale del repository.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyChangedFiles, isSocialOnlyPath } from './ci-site-scope.mjs';

const site = (files) => classifyChangedFiles(files).site;

test('PR della coda social (Content Agent): nessuna build del sito', () => {
  assert.equal(site(['tools/social-engine/content/queue/2026-11-07-luffy-journey-part-05.json']), false);
});

test('PR di receipt / analytics (Publishing e Analyst Agent): nessuna build del sito', () => {
  assert.equal(
    site([
      'tools/social-engine/publication/pending/20261107T061134Z-luffy-instagram.json',
      'tools/social-engine/publication/pending/20261107T061134Z-luffy-tiktok.json',
      'tools/social-engine/analytics/pending/2026-11-07.json',
    ]),
    false,
  );
});

test('modifica al codice del social engine o ai suoi workflow: resta fuori dalla Site CI', () => {
  assert.equal(site(['tools/social-engine/pipeline/queue.ts', '.github/workflows/social-render.yml']), false);
});

test('PR del sito: validazione completa', () => {
  assert.equal(site(['src/seo/metadata.ts']), true);
  assert.equal(site(['src/data/naruto/characters.ts', 'src/data/naruto/slugs.ts']), true);
  assert.equal(site(['public/favicon.png']), true);
  assert.equal(site(['vercel.json']), true);
  assert.equal(site(['index.html']), true);
});

test('PR mista (social + sito): validazione completa', () => {
  assert.equal(site(['tools/social-engine/content/queue/x.json', 'src/data/onepiece/events.ts']), true);
});

test('dipendenze, documentazione, script e la CI stessa: validazione completa', () => {
  assert.equal(site(['package.json']), true);
  assert.equal(site(['package-lock.json']), true);
  assert.equal(site(['CLAUDE.md']), true);
  assert.equal(site(['scripts/ci-site-scope.mjs']), true);
  assert.equal(site(['.github/workflows/site-ci.yml']), true);
});

test('diff vuoto o non calcolabile: validazione completa (nel dubbio si valida)', () => {
  assert.equal(site([]), true);
  assert.equal(site(['', '  ']), true);
});

test('percorsi che somigliano al social engine ma non lo sono: validazione completa', () => {
  assert.equal(isSocialOnlyPath('tools/social-engine-evil/x.ts'), false);
  assert.equal(isSocialOnlyPath('tools/social-engine'), false);
  assert.equal(isSocialOnlyPath('src/tools/social-engine/x.ts'), false);
  assert.equal(isSocialOnlyPath('.github/workflows/social-render.yml.bak'), false);
  assert.equal(isSocialOnlyPath('.github/workflows/nested/social-x.yml'), false);
  assert.equal(isSocialOnlyPath('.github/workflows/site-social-x.yml'), false);
});

test('la decisione elenca i file del sito che la motivano', () => {
  const r = classifyChangedFiles(['tools/social-engine/a.json', 'src/a.ts', 'scripts/b.ts']);
  assert.deepEqual(r.siteFiles, ['src/a.ts', 'scripts/b.ts']);
  assert.match(r.reason, /2\/3/);
});
