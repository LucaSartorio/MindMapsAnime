/**
 * The GitHub Actions run the pipeline is executing in (null locally). Read
 * from the standard GITHUB_* variables — no token, nothing secret.
 */
export type CiRun = { runId: string; runAttempt: string; runUrl: string; workflow: string };

export function ciRunFromEnv(env: NodeJS.ProcessEnv = process.env): CiRun | null {
  if (!env.GITHUB_RUN_ID) return null;
  const server = env.GITHUB_SERVER_URL ?? 'https://github.com';
  return {
    runId: env.GITHUB_RUN_ID,
    runAttempt: env.GITHUB_RUN_ATTEMPT ?? '1',
    runUrl: env.GITHUB_REPOSITORY ? `${server}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}` : '',
    workflow: env.GITHUB_WORKFLOW ?? '',
  };
}

/** Days GitHub keeps a render artifact (must match `retention-days` in social-render.yml). */
export const DEFAULT_ARTIFACT_RETENTION_DAYS = 30;

/** Artifact of the current render run, when the workflow names one (SOCIAL_ARTIFACT_NAME). */
export function ciArtifactFromEnv(env: NodeJS.ProcessEnv = process.env): (CiRun & { name: string; retentionDays: number }) | null {
  const run = ciRunFromEnv(env);
  if (!run || !env.SOCIAL_ARTIFACT_NAME) return null;
  const days = Number(env.SOCIAL_ARTIFACT_RETENTION_DAYS ?? DEFAULT_ARTIFACT_RETENTION_DAYS);
  return { ...run, name: env.SOCIAL_ARTIFACT_NAME, retentionDays: Number.isInteger(days) && days > 0 ? days : DEFAULT_ARTIFACT_RETENTION_DAYS };
}
