/** social:publication:test — only the publication-state tests (fast; used by the receipt PR workflow). */
import { report } from './harness';

await import('./publication.test');
report();
