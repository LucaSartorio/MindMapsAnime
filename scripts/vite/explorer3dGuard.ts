import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Plugin } from 'vite';

/**
 * Build gate of the 3D explorer (client build only), run by every `vite build` (so by `npm run build` and Site CI).
 *
 * It reads Rollup's real chunk graph — not source text — and fails the build when:
 *  1. a chunk containing three.js or the 3D engine/viewer/scenes is STATICALLY reachable from the app entry or
 *     from any ordinary lazy route (it would be downloaded or modulepreloaded by ordinary visits);
 *  2. a binary 3D model (glb/gltf/fbx/obj/…) is emitted.
 * The launcher (`src/features/explorer3d/launcher/`, `types.ts`) is the only explorer code allowed in ordinary
 * chunks: it is three-free and reaches the rest through dynamic `import()` only.
 *
 * It also records which chunks carry the explorer (`node_modules/.cache/animapverse/explorer3d-report.json`, outside
 * `dist/` so nothing extra is deployed) for `npm run benchmark:3d:bundle` and `npm run test:3d`.
 */
export const EXPLORER_REPORT = 'node_modules/.cache/animapverse/explorer3d-report.json';

const MODEL_EXT = /\.(glb|gltf|fbx|obj|blend|dae|3ds|usdz?|stl|ply|drc|ktx2?)$/i;

function norm(id: string): string {
  return id.replace(/\\/g, '/');
}

export function isExplorerModule(id: string): boolean {
  const p = norm(id);
  if (p.includes('/node_modules/three/')) return true;
  if (!p.includes('/src/features/explorer3d/')) return false;
  return !p.includes('/src/features/explorer3d/launcher/') && !p.endsWith('/src/features/explorer3d/types.ts');
}

interface ChunkLike {
  type: 'chunk';
  fileName: string;
  isEntry: boolean;
  isDynamicEntry: boolean;
  facadeModuleId: string | null;
  imports: string[];
  modules: Record<string, { renderedLength: number }>;
  code: string;
}

export interface GuardResult {
  explorerChunks: Array<{ file: string; kind: 'viewer' | 'scene' | 'shared'; facade: string | null; bytes: number }>;
  violations: string[];
}

/** Pure analysis of an output bundle (unit-tested in `scripts/test-3d-units.ts`). */
export function analyseBundle(bundle: Record<string, { type: string; fileName: string }>): GuardResult {
  const chunks = Object.values(bundle).filter((c): c is ChunkLike => c.type === 'chunk') as ChunkLike[];
  const byFile = new Map(chunks.map((c) => [c.fileName, c]));
  const heavy = new Set(
    chunks.filter((c) => Object.entries(c.modules).some(([id, m]) => m.renderedLength > 0 && isExplorerModule(id))).map((c) => c.fileName),
  );
  const violations: string[] = [];

  const roots = chunks.filter((c) => c.isEntry || (c.isDynamicEntry && !(c.facadeModuleId && isExplorerModule(c.facadeModuleId))));
  for (const root of roots) {
    // BFS over static imports, remembering the path for a readable error.
    const seen = new Map<string, string[]>([[root.fileName, [root.fileName]]]);
    const queue = [root.fileName];
    while (queue.length) {
      const f = queue.shift()!;
      const path = seen.get(f)!;
      if (heavy.has(f)) {
        violations.push(`3D code statically reachable from ${root.isEntry ? 'the entry' : `lazy chunk ${root.facadeModuleId ? norm(root.facadeModuleId).replace(/^.*\/src\//, 'src/') : root.fileName}`}: ${path.join(' → ')}`);
        continue;
      }
      for (const i of byFile.get(f)?.imports ?? []) {
        if (seen.has(i)) continue;
        seen.set(i, [...path, i]);
        queue.push(i);
      }
    }
  }
  for (const item of Object.values(bundle)) {
    if (MODEL_EXT.test(item.fileName)) violations.push(`binary 3D model emitted: ${item.fileName} (scenes must be procedural)`);
  }

  const explorerChunks = chunks
    .filter((c) => heavy.has(c.fileName))
    .map((c) => {
      const facade = c.facadeModuleId ? norm(c.facadeModuleId) : null;
      const kind: 'viewer' | 'scene' | 'shared' = facade?.includes('/explorer3d/worlds/') ? 'scene' : facade?.includes('/explorer3d/viewer/') ? 'viewer' : 'shared';
      return { file: c.fileName.replace(/^assets\//, ''), kind, facade: facade?.replace(/^.*\/(src|node_modules)\//, '$1/') ?? null, bytes: Buffer.byteLength(c.code) };
    });
  return { explorerChunks, violations };
}

export function explorer3dGuard(opts: { enabled: boolean; ssr: boolean; root: string }): Plugin {
  return {
    name: 'animapverse:explorer3d-guard',
    apply: 'build',
    generateBundle(_options, bundle) {
      if (opts.ssr) return;
      const { explorerChunks, violations } = analyseBundle(bundle as never);
      if (violations.length) {
        this.error(`[explorer3d-guard] ${violations.length} violation(s):\n  - ${violations.join('\n  - ')}`);
      }
      const entry = Object.values(bundle).find((c) => c.type === 'chunk' && (c as unknown as ChunkLike).isEntry)?.fileName ?? null;
      const report = { enabled: opts.enabled, entry, generatedAt: new Date().toISOString(), chunks: explorerChunks };
      const file = resolve(opts.root, EXPLORER_REPORT);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, JSON.stringify(report, null, 2));
      const kb = (n: number) => (n / 1024).toFixed(1);
      const total = explorerChunks.reduce((n, c) => n + c.bytes, 0);
      console.log(`[explorer3d-guard] ${explorerChunks.length} lazy chunk(s), ${kb(total)} KB raw, prototypes ${opts.enabled ? 'ON' : 'OFF'}, isolation OK`);
    },
  };
}
