# SEO audit — prima / dopo

Audit tecnico eseguito sulla codebase e sull'HTML di build reale (`dist/`), poi
verificato con un server che emula Vercel (`npm run preview:static`), Chromium
headless (`npm run smoke`) e axe (`npm run audit:a11y`). Architettura in
[`SEO.md`](SEO.md).

## SEO AUDIT BEFORE

| # | Problema | Severity | Impatto |
| --- | --- | --- | --- |
| 1 | `robots.txt` con `Disallow: /assets/`: bloccava **tutto il JS/CSS** (e le immagini delle mappe). | CRITICAL | Googlebot non poteva renderizzare la SPA: vedeva solo l'HTML statico quasi vuoto. |
| 2 | `vercel.json` riscriveva `/(.*)` su `/index.html`; `WorldRoute` faceva `<Navigate to=".">` sui path sconosciuti. | CRITICAL | Soft-404: ogni URL inesistente rispondeva 200 con contenuto duplicato. |
| 3 | Le entità (≈2.700 fra personaggi, luoghi, fazioni, archi, percorsi, tecniche, regioni) esistevano solo come stato UI (`?character=id` sopra la mappa). | CRITICAL | Nessuna pagina indicizzabile per entità; nessun link crawlabile (card `<button>`, pin React Flow). |
| 4 | `#root` pre-renderizzato con solo H1+descrizione in un box 1×1 px nascosto e un link a Home. | CRITICAL | Nessun contenuto né link nell'HTML iniziale; testo nascosto a rischio "cloaking". |
| 5 | Lingua solo in localStorage: stesso URL per IT/EN, `<html lang="it">` fisso, nessun hreflang, `og:locale:alternate` per 6 lingue senza URL. | HIGH | Versione inglese non indicizzabile; segnali linguistici contraddittori. |
| 6 | Meta pre-renderizzati + react-helmet che aggiungeva i propri (senza rimuovere quelli statici). | HIGH | Canonical/description duplicate nel DOM renderizzato. |
| 7 | Sitemap di 38 URL, `lastmod` = data del build su ogni URL, mondi "in arrivo" inclusi. | HIGH | Discovery minima, `lastmod` inaffidabile (Google lo ignora), pagine sottili in sitemap. |
| 8 | Brand incoerente: "Mappe Interattive"/"Interactive Maps" in title, `og:site_name`, JSON-LD, manifest, H1. | HIGH | Google non associa il sito al nome **AniMapVerse**. |
| 9 | Homepage: solo 3 mondi nel DOM (Dragon Ball e Black Clover dietro "Mostra tutti"). | HIGH | Due mondi disponibili senza link crawlabile dalla home. |
| 10 | Chunk iniziale 884 KB (272 KB gzip): React Flow in ogni pagina (modale relazioni importata staticamente), 6 lingue, layout-mondo eager. | HIGH | JS/parse inutili su home e pagine di contenuto (LCP/INP). |
| 11 | URL poco leggibili (`/worlds/hunterxhunter`, `/worlds/onepiece`), pagina `/supporta` solo italiana. | MEDIUM | Query "hunter x hunter map", "one piece map" meno allineate; URL non internazionali. |
| 12 | Immagine della mappa (LCP) con `loading="lazy"`, nessun preload; nessun preload dei font. | MEDIUM | LCP ritardato sulla pagina più importante. |
| 13 | `Cache-Control: immutable` per 1 anno anche su `/assets/worlds/*` (file NON hashati). | MEDIUM | Mappe aggiornate servite vecchie per mesi. |
| 14 | Breadcrumb solo JSON-LD su poche pagine, niente breadcrumb visibili; nessun `Organization`/logo. | MEDIUM | Gerarchia poco chiara a utenti e motori. |
| 15 | Mondi "in arrivo" indicizzabili. | MEDIUM | Pagine sottili indicizzate. |
| 16 | `/favicon.ico` assente (404); immagine OG e manifest col vecchio brand, solo in italiano. | LOW | Favicon nei risultati meno affidabile; anteprime social incoerenti. |
| 17 | Nessuna regola `www` → apex, nessun `x-default`. | LOW | Possibili duplicati host / fallback lingua non dichiarato. |

## SEO AFTER

| # | Fix | File principali | Risultato |
| --- | --- | --- | --- |
| 1 | robots.txt generato: `Allow: /`, niente blocco di JS/CSS/immagini; `Disallow: /*?` (stati UI) e route tecniche; `Sitemap:`. | `scripts/prerender.ts`, `src/seo/config.ts` | Rendering completo per i crawler. |
| 2 | Niente fallback SPA: `404.html` con status **404**; path sconosciuti → `NotFoundPage` (mai redirect silenziosi). | `vercel.json`, `src/routes/WorldRoute.tsx`, `src/seo/metadata.ts` | `/questo-url-non-esiste-123` → 404 (verificato). |
| 3 | Pagine entità data-driven per 7 categorie + indici, directory paginate, timeline con ancore; card archivio come link reali; link "pagina completa" nelle schede. | `src/seo/*`, `src/pages/seo/*`, `src/components/seo/CardLink.tsx`, `src/components/common/Modal.tsx` | 5.552 pagine generate; ~171.000 link interni verificati, 0 rotti. |
| 4 | SSG vero: `vite build --ssr` + `renderToString` dello stesso albero React, poi `hydrateRoot` (DOM conservato, verificato). | `src/entry-server.tsx`, `src/main.tsx`, `src/lib/lazyWithPreload.tsx`, `src/lib/useHydrated.ts`, `src/store/snapshotStore.ts` | HTML iniziale con H1, testo, breadcrumb e link reali. |
| 5 | URL `/it/...` e `/en/...`, hreflang it/en/x-default reciproci solo fra versioni indicizzabili, `<html lang>` per URL; selettore lingua → pagina equivalente. | `src/seo/paths.ts`, `src/seo/metadata.ts`, `src/routes/AppRouter.tsx`, `LanguageSwitcher.tsx` | 1.920 URL IT + 1.761 URL EN indicizzabili. |
| 6 | Head manager unico (`data-seo`) al posto di react-helmet-async (dipendenza rimossa). | `src/seo/head.ts`, `src/components/seo/Seo.tsx` | 1 canonical, 1 description in HTML e DOM (verificato anche dopo navigazione SPA). |
| 7 | Sitemap index + una sitemap per mondo con `xhtml:link`; `lastmod` = ultimo commit dei dati del mondo; solo URL canonici indicizzabili. | `src/seo/sitemap.ts`, `scripts/prerender.ts` | 3.681 URL, validati da `seo:check`. |
| 8 | Brand **AniMapVerse** ovunque (title, og:site_name, WebSite+Organization con logo e profili reali, manifest, header, OG image). | `src/seo/config.ts`, `src/seo/schema.ts`, `public/*`, i18n | Identità coerente per il nome del sito. |
| 9 | Home: tutti i mondi disponibili sempre visibili (link reali), "in arrivo" dopo. H1 descrittivo. | `HomePage.tsx`, `HeroSection.tsx` | 5 mondi linkati dall'HTML statico. |
| 10 | Chunk iniziale 457 KB (147 KB gzip): `WorldRoute` lazy, modale relazioni lazy (React Flow solo su /map), lingue ja/fr/de/es on-demand, `modulepreload` per rotta. | `src/routes/lazyPages.tsx`, `ModalRoot.tsx`, `src/i18n/index.ts` | −46% JS iniziale. |
| 11 | `urlSlug` leggibili (`hunter-x-hunter`, `one-piece`, `dragon-ball`…); 308 da tutte le vecchie rotte in un salto (query conservate). | `src/data/worlds.ts`, `vercel.json` | Bookmark e deep link esistenti funzionano. |
| 12 | Map image `eager` + `fetchpriority=high` + `<link rel=preload>` sulla rotta mappa; preload di 2 font woff2; dimensioni esplicite. | `WorldMapBackground.tsx`, `MapPage.tsx`, `scripts/prerender.ts` | LCP anticipato, niente CLS. |
| 13 | Cache immutabile solo per asset hashati; 1 giorno + SWR per `/assets/worlds/*`. | `vercel.json` | Aggiornamenti delle mappe visibili. |
| 14 | Breadcrumb visibili + `BreadcrumbList` dalla stessa struttura; `WebPage`/`CollectionPage` con `about` (opera + autore/editore reali). | `Breadcrumbs.tsx`, `src/seo/schema.ts` | Gerarchia esplicita. |
| 15 | Index/noindex per qualità e lingua reale; mondi "in arrivo", legali, 404 noindex. | `src/seo/quality.ts`, `src/seo/metadata.ts` | ~1.870 pagine sottili o non tradotte restano `noindex, follow`. |
| 16 | `favicon.ico` (16/32/48), OG image e manifest rinnovati. | `public/` | — |
| 17 | `www` → apex (308), `x-default` → EN, `/` → 307 per Accept-Language. | `vercel.json` | Un solo host canonico. |

## Da fare (contenuto, non codice)

- **Tradurre in inglese le ~220 descrizioni di Naruto scritte solo in italiano**
  (stringhe semplici in `src/data/naruto/`): è il blocco principale per le query
  inglesi su Naruto (es. le pagine EN di Itachi e Sasuke oggi sono `noindex`).
  Appena tradotte diventano indicizzabili senza modifiche al codice.
- Arricchire le entità sotto soglia (soprattutto luoghi minori e tecniche HxH).
- Verificare in Search Console dopo il deploy (checklist in `SEO.md` §14).
