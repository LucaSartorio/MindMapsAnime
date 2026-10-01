import path from 'node:path';
import type { WebpackOverrideFn } from '@remotion/bundler';

/**
 * Teaches Remotion's webpack the `@/` alias of the app (`@/` → `src/`), so the
 * engine reads the SAME datasets/helpers as the site. Note: `@remotion/*`
 * requests are untouched (the alias only matches `@` or `@/…`).
 */
export function makeWebpackOverride(repoRoot: string): WebpackOverrideFn {
  const src = path.join(repoRoot, 'src');
  return (config) => {
    const alias = config.resolve?.alias;
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: Array.isArray(alias) ? [...alias, { name: '@', alias: src }] : { ...(alias ?? {}), '@': src },
      },
    };
  };
}
