---
name: optimize-performance
description: Measure then improve performance (bundle/chunks, images, lazy loading, hydration, React/map rendering, build time, mobile) with baseline and after numbers. Use for "migliora le performance", "reduce bundle".
argument-hint: [target: bundle|map|hydration|images|build|mobile|all]
---

# Optimize performance: $ARGUMENTS

Owner: `qa-performance-engineer` measures; `frontend-specialist` / `map-engineer` implement. No claim without two
measurements taken the same way.

1. **Baseline** (pick what the target needs, save numbers in the scratchpad):
   - bundle: `npx vite build` → sizes of entry, vendor, map route and lazy chunks (gzip column);
   - build: `/usr/bin/time -v npm run build` (wall time, max RSS) or individual steps (`npm run prerender`);
   - runtime: Playwright script in the scratchpad on `npm run preview:static` (`performance.now()` around
     interactions, `PerformanceObserver` for long tasks, React commit counts via a temporary profiler only if needed);
   - images: list the largest files (`find public/assets -type f -size +200k -exec ls -lh {} +`). Never run
     `npm run optimize:images` (destructive: deletes originals, needs `sharp`, PERF-02); map rasters go through
     `python3 scripts/optimize-map-images.py` (selective, non-destructive) only after a baseline.
   Lab numbers ≠ field data (LCP/INP/CLS for real users live in Vercel Speed Insights, not in the repo).
2. **Find the cause** before changing code (largest module in the chunk, unnecessary eager import, re-render on
   every zoom tick, unmemoized dataset scans, oversized SVG/PNG).
3. **Change one thing at a time**, keep readability; respect SSR/hydration (lazy chunks go through `lazyWithPreload`
   in `src/routes/lazyPages.tsx` so pre-render keeps working).
4. **Re-measure** with the same command; keep the change only if it helps and nothing regresses (`npm run smoke`,
   which runs the full build first: no separate `npm run build`).
5. **Report** table: metric · baseline · after · delta · method; regressions; rollback note (commit to revert).
