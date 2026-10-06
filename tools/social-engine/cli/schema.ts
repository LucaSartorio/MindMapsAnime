/**
 * social:schema — regenerates the JSON Schemas from the TypeScript constants:
 *   schemas/social-content.schema.json                     (content requests)
 *   publication/schemas/publication-receipt.schema.json    (publication receipts)
 *   analytics/schemas/analytics-snapshot.schema.json       (analytics snapshots)
 */
import path from 'node:path';
import { pipelineDirs } from '../pipeline/dirs';
import { writeJsonAtomic } from '../pipeline/fs';
import { buildReceiptSchema } from '../pipeline/publicationSchema';
import { buildContentSchema } from '../pipeline/schema';
import { CONTENT_SCHEMA_FILE, RECEIPT_SCHEMA_FILE, SNAPSHOT_SCHEMA_FILE } from '../pipeline/schemaFiles';
import { buildSnapshotSchema } from '../pipeline/analyticsSchema';

for (const [file, schema] of [[CONTENT_SCHEMA_FILE, buildContentSchema()], [RECEIPT_SCHEMA_FILE, buildReceiptSchema()], [SNAPSHOT_SCHEMA_FILE, buildSnapshotSchema()]] as const) {
  writeJsonAtomic(file, schema);
  console.log(`✔ ${path.relative(pipelineDirs().repoRoot, file)}`);
}
