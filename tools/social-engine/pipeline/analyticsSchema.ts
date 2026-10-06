import { PLATFORMS, PUBLICATION_PROVIDERS } from './history';
import { PLATFORM_METRICS, RATE_METRICS, SNAPSHOT_VERSION } from './analytics';
import { ISO_TIMESTAMP_RE, MAX_RECEIPT_NOTES, PROVIDER_UUID_RE, RECORDED_BY_RE, RENDER_ID_PATTERN } from './publication';

/**
 * JSON Schema of an analytics snapshot — GENERATED from the same constants as
 * the parser (`npm run social:schema` → analytics/schemas/analytics-snapshot.schema.json).
 * One variant per platform: only that network's metrics are allowed.
 */
export const SNAPSHOT_SCHEMA_ID = `https://animapverse.com/schemas/analytics-snapshot.v${SNAPSHOT_VERSION}.schema.json`;

export function buildSnapshotSchema(): Record<string, unknown> {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: SNAPSHOT_SCHEMA_ID,
    title: 'AniMapVerse analytics snapshot',
    description:
      'Latest metrics of ONE published video on ONE platform, written by the external Analyst Agent (Metricool) into tools/social-engine/analytics/pending/. Values: number ≥ 0, or null when the network does not provide it (yet). See docs/SOCIAL_ANALYTICS_CONTRACT.md.',
    oneOf: PLATFORMS.map((platform) => ({
      title: platform,
      type: 'object',
      additionalProperties: false,
      required: ['snapshotVersion', 'renderId', 'platform', 'provider', 'collectedAt', 'metrics'],
      properties: {
        $schema: { type: 'string', maxLength: 200 },
        snapshotVersion: { const: SNAPSHOT_VERSION },
        renderId: { type: 'string', pattern: RENDER_ID_PATTERN, maxLength: 400 },
        platform: { const: platform },
        provider: { enum: [...PUBLICATION_PROVIDERS] },
        collectedAt: { type: 'string', format: 'date-time', pattern: ISO_TIMESTAMP_RE.source, description: 'When the metrics were read in Metricool (ISO 8601 with offset).' },
        providerPostUuid: { type: 'string', pattern: PROVIDER_UUID_RE.source },
        metrics: {
          type: 'object',
          additionalProperties: false,
          minProperties: 1,
          properties: Object.fromEntries(
            PLATFORM_METRICS[platform].map((m) => [
              m,
              { type: ['number', 'null'], minimum: 0, ...((RATE_METRICS as readonly string[]).includes(m) ? { maximum: 1, description: 'Rate 0..1' } : {}) },
            ]),
          ),
        },
        recordedBy: { type: 'string', pattern: RECORDED_BY_RE.source },
        notes: { type: 'string', maxLength: MAX_RECEIPT_NOTES },
      },
    })),
  };
}
