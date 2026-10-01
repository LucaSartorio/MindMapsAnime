/** social:schema — regenerates schemas/social-content.schema.json from the TypeScript constants. */
import path from 'node:path';
import { pipelineDirs } from '../pipeline/dirs';
import { writeJsonAtomic } from '../pipeline/fs';
import { buildContentSchema } from '../pipeline/schema';
import { ENGINE_DIR } from '../render/paths';

const file = path.join(ENGINE_DIR, 'schemas', 'social-content.schema.json');
writeJsonAtomic(file, buildContentSchema());
console.log(`✔ ${path.relative(pipelineDirs().repoRoot, file)}`);
