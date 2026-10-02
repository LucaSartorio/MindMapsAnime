import { PLATFORMS, PUBLICATION_PROVIDERS } from './history';
import {
  ISO_TIMESTAMP_RE,
  MAX_ERROR_CHARS,
  MAX_RECEIPT_NOTES,
  MAX_URL_CHARS,
  PROVIDER_REF_RE,
  PROVIDER_UUID_RE,
  RECEIPT_FIELDS,
  RECEIPT_STATUSES,
  RECEIPT_VERSION,
  RECORDED_BY_RE,
  RENDER_ID_PATTERN,
  receiptFieldsFor,
  type ReceiptField,
} from './publication';

/**
 * JSON Schema (draft 2020-12) of a publication receipt — GENERATED from the
 * same table the TypeScript parser uses (`npm run social:schema` writes
 * publication/schemas/publication-receipt.schema.json; `social:validate` fails
 * if it's stale). The machine-readable half of docs/SOCIAL_PUBLISHING_CONTRACT.md.
 * The parser is stricter where JSON Schema can't express it (real calendar
 * dates, URL parsing, duplicate keys, history and state transitions).
 */
export const RECEIPT_SCHEMA_ID = `https://animapverse.com/schemas/publication-receipt.v${RECEIPT_VERSION}.schema.json`;

function propertySchema(field: ReceiptField): Record<string, unknown> {
  const { kind, description } = RECEIPT_FIELDS[field];
  switch (kind) {
    case 'schemaRef':
      return { type: 'string', maxLength: 200, description };
    case 'const':
      return { const: RECEIPT_VERSION, description };
    case 'renderId':
      return { type: 'string', pattern: RENDER_ID_PATTERN, maxLength: 400, description };
    case 'platform':
      return { enum: [...PLATFORMS], description };
    case 'provider':
      return { enum: [...PUBLICATION_PROVIDERS], description };
    case 'status':
      return { enum: [...RECEIPT_STATUSES], description };
    case 'timestamp':
      return { type: 'string', format: 'date-time', pattern: ISO_TIMESTAMP_RE.source, description };
    case 'providerRef':
      return { type: 'string', pattern: PROVIDER_REF_RE.source, description };
    case 'providerUuid':
      return { type: 'string', pattern: PROVIDER_UUID_RE.source, description };
    case 'url':
      return { type: 'string', format: 'uri', pattern: '^https://[^\\s@/]+\\.[^\\s@/]+(?:/\\S*)?$', maxLength: MAX_URL_CHARS, description };
    case 'error':
      return { type: 'string', minLength: 1, maxLength: MAX_ERROR_CHARS, description };
    case 'recordedBy':
      return { type: 'string', pattern: RECORDED_BY_RE.source, description };
    case 'notes':
      return { type: 'string', maxLength: MAX_RECEIPT_NOTES, description };
    default: {
      const never: never = kind;
      throw new Error(`unknown field kind ${String(never)}`);
    }
  }
}

export function buildReceiptSchema(): Record<string, unknown> {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: RECEIPT_SCHEMA_ID,
    title: 'AniMapVerse publication receipt',
    description:
      'ONE event (scheduled / published / failed) for ONE rendered video on ONE platform, written by the external Publishing Agent into tools/social-engine/publication/pending/. See docs/SOCIAL_PUBLISHING_CONTRACT.md.',
    oneOf: RECEIPT_STATUSES.map((status) => {
      const { required, allowed } = receiptFieldsFor(status);
      return {
        title: status,
        type: 'object',
        additionalProperties: false,
        required,
        properties: Object.fromEntries(allowed.map((f) => [f, f === 'status' ? { const: status, description: RECEIPT_FIELDS.status.description } : propertySchema(f)])),
      };
    }),
  };
}
