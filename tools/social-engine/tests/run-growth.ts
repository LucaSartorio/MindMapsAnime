/** social:growth:test — growth engine tests only (selector, rotation, hooks/CTAs, analytics, performance). */
import { report } from './harness';

await import('./growth.test');
report();
