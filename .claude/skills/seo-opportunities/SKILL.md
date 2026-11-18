---
name: seo-opportunities
description: Find and rank SEO issues and opportunities (thin/noindex, orphans, internal links, /es /fr translation gaps, titles, sitemap/hreflang/canonical) without inventing traffic data. Use for "controlla il SEO".
argument-hint: [world] [quick] [path-to-search-console-export.csv]
---

# SEO opportunities: $ARGUMENTS

Owner: `seo-growth-engineer` (read `.claude/rules/seo.md`, `docs/SEO.md`). Never change thresholds, slugs or the
index/noindex policy to "win" pages.

**Mode**: FULL (default, all of step 1) unless the arguments contain the word `quick`. A request for a complete
check, a release, or anything about canonical/hreflang/sitemap/titles/links in the HTML is always FULL. QUICK skips
`npm run build` and the `dist/` sample: it uses `data:coverage` (incl. its per-category indexable counts),
`i18n:status`, `translatedLocales` and `test:seo`, and every item that needs the generated HTML (canonical, hreflang,
sitemap, duplicate titles, broken links, the prerender per-language summary) is reported as
`not verified — needs FULL`, never as verified or absent.

1. **Facts from the repo** (no Google data unless the owner provides an export path in the arguments):
   - `npm run data:coverage -- <world>` → thin pages per category, orphans;
   - `npm run i18n:status` + `translatedLocales` in `worlds.ts` → pages blocked from /es /fr indexing;
   - `npm run test:seo`; then `npm run build` → `seo:check` output (canonical, hreflang, duplicate titles, broken
     links), prerender per-language indexable summary;
   - sample `dist/<lang>/<world>/...` HTML (grep `<title>`, `rel="canonical"`, `hreflang`) only for suspicious pages.
2. **If an export (CSV) is given**: read it, join on URL path, and use real impressions/clicks/positions to rank.
3. **Classify every item**: `verified issue` (failing check / evidence in dist) · `opportunity` (data-backed: e.g.
   40 character pages just under the threshold whose relations exist) · `hypothesis` (needs field data).
4. **Rank** by (pages affected × likely value) / effort; prefer fixes that improve real content and links
   (enrichment, relation groups, hub pages) over template text.
5. **Report** a table: item · class · evidence · pages affected · fix · owner skill (`/enrich-anime-world`,
   `/sync-translations`, `/optimize-map`). Implement only if the owner asks.
