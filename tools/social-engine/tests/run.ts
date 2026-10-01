/** social:validate — engine + pipeline tests, run sequentially with one summary. */
import { report } from './harness';

await import('./engine.test');
await import('./pipeline.test');
report();
