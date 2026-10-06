import { ENTRY_POINT, detectBrowserExecutable } from '../render/paths';
import { createRenderSession } from '../render/session';
import type { RendererFactory } from '../pipeline/batch';
import type { PipelineDirs } from '../pipeline/dirs';
import { COVER_COMPOSITION_ID } from '../components/Cover';

/** Prints a clean error and exits (1 = invalid content/data/render, 2 = usage). */
export function fail(message: string, code = 1): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(code);
}

export function stringFlag(flags: Record<string, string | boolean>, key: string): string | undefined {
  return typeof flags[key] === 'string' ? (flags[key] as string) : undefined;
}

export function numberFlag(flags: Record<string, string | boolean>, key: string): number | undefined {
  const raw = stringFlag(flags, key);
  if (raw === undefined) return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n)) fail(`--${key} must be a number (got "${raw}")`, 2);
  return n;
}

/** Comma-separated list flag (`--id a,b`). */
export function listFlag(flags: Record<string, string | boolean>, key: string): string[] | undefined {
  const raw = stringFlag(flags, key);
  return raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : undefined;
}

/** Real renderer for the batch: one shared Remotion bundle, videos rendered one at a time. */
export function remotionRendererFactory(dirs: PipelineDirs, opts: { browserExecutable?: string; concurrency?: number | null }): RendererFactory {
  return async (plans) => {
    console.log('\n… bundling (once for the whole batch)');
    const session = await createRenderSession({
      dirs,
      entryPoint: ENTRY_POINT,
      assets: plans.flatMap((p) => p.resolved.publicAssets),
      audio: plans.flatMap((p) => (p.audio ? [{ from: p.audio.from, to: p.audio.to }] : [])),
      browserExecutable: detectBrowserExecutable(opts.browserExecutable),
    });
    return {
      render: (plan, outputFile) => {
        let last = -1;
        return session.renderVideo(
          { compositionId: plan.template.compositionId, props: plan.resolved.props, durationSeconds: plan.resolved.durationSeconds },
          outputFile,
          {
            concurrency: opts.concurrency ?? null,
            muted: !plan.audio,
            onProgress: (p) => {
              const pct = Math.floor(p * 100);
              if (pct >= last + 25 || pct === 100) {
                last = pct;
                process.stdout.write(`  rendering ${pct}%\n`);
              }
            },
          },
        );
      },
      renderCover: (plan, outputFile) =>
        session.renderStill({ compositionId: COVER_COMPOSITION_ID, props: plan.resolved.cover as unknown as Record<string, unknown>, durationSeconds: 1 }, 0, outputFile),
    };
  };
}
