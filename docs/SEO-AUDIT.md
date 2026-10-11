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

---

## Audit di indicizzabilità — ottobre 2026

Audit dell'architettura con ~7.000 URL indicizzabili (8 mondi disponibili, IT+EN), eseguito sull'HTML di build reale
(`dist/`), con il server che emula Vercel e confrontato con la documentazione ufficiale di Google Search Central.
Esito: **HEALTHY WITH MINOR FIXES**.

### Inventario URL (dopo le correzioni)

| Famiglia di route | URL | Indicizzabili | In sitemap | Decisione |
| --- | --- | --- | --- | --- |
| `/{lang}`, `/about`, `/support` | 6 | 6 | 6 | A · KEEP |
| `/privacy`, `/cookie-policy` | 4 | 0 | 0 | C · KEEP (`noindex, follow`) |
| `/{lang}/{world}` (disponibili / in arrivo) | 16 / 10 | 16 / 0 | 16 / 0 | A / C · KEEP |
| `/map`, `/timeline`, indici di categoria | 144 | 144 | 144 | A · KEEP |
| `/timeline/page/N`, `/locations/page/N` | 6 | 6 | 6 | A · KEEP (auto-canoniche, link sequenziali) |
| `/characters/{slug}` | 2916 | 2712 | 2712 | A (204 sotto soglia → C) |
| `/locations/{slug}` | 1786 | 1230 | 1230 | A (556 → C) |
| `/abilities/{slug}` | 1524 | 1450 | 1450 | A (74 → C) · G per la coda sottile |
| `/factions/{slug}` | 602 | 580 | 580 | A (22 → C) |
| `/arcs/{slug}` | 354 | 354 | 354 | A |
| `/regions/{slug}` | 186 | 116 | 116 | A (70 → C) |
| `/journeys/{slug}` scritti a mano | 304 | 294 | 294 | A (10 → C) |
| `/journeys/{slug}` **derivati** | 200 | — | 0 | **D** · canonical → pagina del protagonista |
| Query (`?…`), slash finale, maiuscole, slug inesistenti, `/page/1` | — | — | — | robots `Disallow: /*?` · 308 · 404 · 404 |

### Correzioni applicate

1. **`lastmod` rimosso dalle sitemap** (HIGH): era la data dell'ultimo commit su `src/data/<world>`, uguale per
   tutte le URL di un mondo; nei clone shallow delle build CI diventava la data di un commit qualsiasi (verificato:
   depth 1 → il commit `chore(social)` del deploy). Google usa `lastmod` solo se accurato per la pagina.
2. **Eventi sulle pagine personaggio e fazione** (MEDIUM): 950/1458 personaggi e 147/301 fazioni partecipano a eventi
   della timeline che la scheda interattiva mostrava ma la pagina SEO no (e che il gate di qualità contava già). Ora
   la pagina li elenca (periodo, luogo, descrizione, link alla timeline), esclusi gli scontri già in "Battaglie".
   Contenuto specifico mediano dei personaggi: 380 → 608 caratteri.
3. **Percorsi derivati canonicalizzati** (MEDIUM): i 100 cammini generati da `autoJourneys` (200 URL) sono la stessa
   sequenza di eventi/luoghi della pagina del protagonista, con descrizione da template; ora `rel=canonical` →
   personaggio, fuori da sitemap e hreflang, pagina invariata per gli utenti.

### Non applicato (di proposito)

- Nessun noindex di massa né soglie più severe: le pagine sotto soglia sono già `noindex, follow` e fuori sitemap;
  la coda sottile indicizzata (es. tecniche con una frase e 1–2 utilizzatori) va **arricchita nei dati**, non
  nascosta o allungata con testo di riempimento.
- Nessun `rel=prev/next`, nessun noindex sulla paginazione, nessuno structured data aggiuntivo.

---

## Audit di indicizzabilità — ottobre 2026 (2ª passata, dopo `/es` e `/fr`)

Rifatto da zero sull'HTML di build (`dist/`, identico alla produzione: stesse 13.812 URL in sitemap) e confrontato
con la documentazione Google Search Central aggiornata. I ~4.218 URL "rilevati" in Search Console sono solo una
parte delle 13.812 inviate: Google non le ha ancora scansionate tutte, non è un rifiuto.
Esito: **HEALTHY WITH MINOR FIXES**.

### Inventario (per lingua × 4: it, en, es, fr)

| Famiglia | Per lingua | Indicizzabili | Sitemap | Decisione |
| --- | --- | --- | --- | --- |
| `/{lang}`, `/about`, `/support` | 3 | 3 | ✅ | A · KEEP |
| `/privacy`, `/cookie-policy` | 2 | 0 | — | C · KEEP |
| `/{world}` disponibili / in arrivo (solo it/en) | 8 / 5 | 8 / 0 | ✅ / — | A / C · KEEP |
| `/map`, `/timeline`, 7 indici di categoria | 72 | 72 | ✅ | A · KEEP |
| `/timeline/page/N`, `/locations/page/N` | 3 | 3 | ✅ | A · KEEP (auto-canoniche, `<a href>` in sequenza) |
| `/characters/{slug}` | 1458 | 1356 | ✅ | A · 102 → C (thin) |
| `/locations/{slug}` | 893 | 614 | ✅ | A · 279 → C (thin) |
| `/abilities/{slug}` | 762 | 725 | ✅ | A · 37 → C · coda corta = G |
| `/factions/{slug}` | 301 | 290 | ✅ | A · 11 → C |
| `/arcs/{slug}` | 177 | 177 | ✅ | A |
| `/regions/{slug}` | 93 | 58 | ✅ | A · 35 → C |
| `/journeys/{slug}` scritti a mano / derivati | 152 / 99 | 147 / — | ✅ / — | A / D (canonical → personaggio) |
| Slug rinominati | 3 | — | — | E (meta refresh 0 = permanente) · KEEP |
| Query, slash finale, maiuscole, `/page/1`, pagine fuori range, slug ignoti | — | — | — | robots `/*?` · 308 · 404 |

Verifiche: 0 disaccordi fra sitemap, robots e canonical su 16.102 pagine; nessun `lastmod`; nessun duplicato;
ogni target hreflang è in sitemap; sitemap max 3.268 URL / 2,2 MB; ogni entità indicizzabile è linkata da una pagina
hub (mediana 9 link contestuali in entrata); `/es` e `/fr` tradotti davvero (testo identico all'inglese < 0,2 %,
solo nomi giapponesi e numeri di episodio); coppie con lo stesso nome in categorie diverse (luogo/arco, luogo/regione)
con somiglianza ≤ 0,44 (Jaccard): risorse distinte.

### Correzione applicata

- **Tipo di fazione e classificazione delle tecniche non tradotti** (MEDIUM): title, scheda "Tipo" e card della
  landing usavano `humanizeId(f.type)` → "Pirati di Cappello di Paglia (Crew)", "Clan Uchiwa (Group)" su ~870 title
  `/it`, `/es`, `/fr`. Ora `getFactionTypeLabel` / `getAbilityClassificationLabel` (le stesse mappe delle schede
  interattive). Test di regressione in `test:seo`.

### Revisione dei contenuti (G, nei dati — non nel codice)

Le pagine indicizzate con meno testo proprio non sono comparse oscure ma **entità principali di Naruto** con
descrizioni di una riga (mediana 75 caratteri per i personaggi main/major contro 211–538 degli altri mondi; 30 su
51 sotto 120): Sakura, Madara, Obito, Minato, Tsunade, Jiraiya, Orochimaru, Gaara, Hashirama, Kaguya, gli Akatsuki Deidara, Sasori, Hidan, Kakuzu, Kisame… Le pagine
restano utili (relazioni, battaglie, eventi, fazioni, luoghi) e vanno **arricchite** con testo verificato it/en (poi
`i18n:extract`/`merge` per es/fr), non nascoste. Stessa cosa, in misura minore, per Dragon Ball (8) e HxH (5) e per
la coda delle tecniche con una frase e un utilizzatore.

### Non applicato (di proposito)

- Soglie più severe per le tecniche: la regola "testo + collegamenti" escluderebbe Six Eyes, Infinity, Zabimaru,
  Hie Hie no Mi (entità note, cercate). Le relazioni "ereditate" (fazioni dell'utilizzatore) gonfiano il conteggio,
  ma il rimedio è il testo nei dati, non un noindex.
- Redirect server-side per i 3 slug rinominati: `vercel.json` è statico; il meta refresh 0 è trattato da Google come
  permanente. Da rivalutare se i rinomini aumentano.
- Link `?character=…` verso la mappa (bloccati da robots): sono stati UI, la canonical è `/map`; spostarli su `#`
  cambierebbe il deep-link senza un beneficio misurato. Da monitorare ("Indicizzata ma bloccata da robots.txt").
- Link interni verso i percorsi derivati (canonical → personaggio): sono navigazione utile; la canonical basta.
- `lastmod`, `rel=prev/next`, noindex sulla paginazione, structured data aggiuntivi: nessuna base nelle linee guida.
