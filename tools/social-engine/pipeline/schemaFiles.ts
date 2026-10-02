import path from 'node:path';
import { ENGINE_DIR } from '../render/paths';

/** Versioned locations of the generated JSON Schemas (always the real engine dir, never a sandbox). */
export const CONTENT_SCHEMA_FILE = path.join(ENGINE_DIR, 'schemas', 'social-content.schema.json');
export const RECEIPT_SCHEMA_FILE = path.join(ENGINE_DIR, 'publication', 'schemas', 'publication-receipt.schema.json');
