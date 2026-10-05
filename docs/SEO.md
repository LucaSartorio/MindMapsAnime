# SEO — architettura di AniMapVerse

AniMapVerse è una SPA React + Vite. Questa guida descrive come diventa un sito
**SEO-first e data-driven**: ogni mondo, luogo, personaggio, arco, fazione,
percorso, tecnica e regione ha un URL stabile, HTML statico già completo al
primo byte, metadati propri e link reali verso le entità collegate — senza
togliere nulla alla mappa interattiva, che resta il cuore del prodotto.

> Regola d'oro: **niente SEO scritta a mano**. Aggiungere dati (un mondo, un
> personaggio) produce da solo pagine, metadati, sitemap, hreflang e link.

---

## 1. Decisione architetturale: SSG sul codice esistente

| Opzione | Esito |
| --- | --- |
| Migrare a Next.js / Remix | Scartata: riscrittura di routing, store e build per ottenere ciò che Vite già permette. |
| SSR a runtime (funzioni Vercel) | Scartata: i dati sono statici (file TS), un server non aggiunge valore ma costi e latenza. |
| Prerender "headless browser" (Puppeteer) | Scartata: lento, fragile, HTML non deterministico. |
| **SSG con `vite build --ssr` + `renderToString`** | **Scelta.** Stesso albero React del client, eseguito al build per ogni pagina; il client **idrata** (non ricrea) il DOM. |

Pipeline (`npm run build`):

```
tsc -b                      # correttezza TypeScript
npm run test:seo            # invarianti SEO sulle sorgenti (slug, URL, metadati, hreflang, sitemap)
vite build                  # bundle client → dist/  (+ manifest per i modulepreload)
npm run build:ssr           # src/entry-server.tsx → dist-server/ (solo per il build)
npm run prerender           # 1 file HTML per pagina + 404.html + sitemap*.xml + robots.txt + llms.txt
npm run seo:check           # verifica l'HTML generato (bloccante)
```

Punti chiave dell'implementazione:

- `src/entry-server.tsx` rende `AppRoutes` (lo stesso albero del client) con
  `StaticRouter`, dopo aver caricato **tutti** i dataset e i chunk lazy.
- `src/main.tsx` prima del primo render allinea la lingua all'URL e precarica
  dataset + chunk della rotta (`preloadRoute`), poi usa `hydrateRoot`.
  Verificato dallo smoke test: il DOM statico viene **conservato**.
- `lazyWithPreload` (`src/lib/lazyWithPreload.tsx`): un chunk già caricato si
  rende in modo sincrono → nessun fallback "Caricamento…" sopra HTML già visibile.
- `useHydrated` (`src/lib/useHydrated.ts`): ciò che dipende da stato solo-browser
  (banner cookie, mappa React Flow) compare dopo l'idratazione.
- `createSnapshotStore` (`src/store/snapshotStore.ts`): zustand 4.5 usa lo stato
  **iniziale** come snapshot SSR/idratazione; gli store impostati prima del
  render (lingua, mondo attivo) espongono invece lo stato corrente.
- Nessuna libreria per il `<head>`: `src/seo/head.ts` genera una sola lista di
  tag (`data-seo`) che il prerender serializza e il client aggiorna in
  navigazione SPA → mai canonical/description duplicate fra HTML e DOM.

---

## 2. Struttura dei file

```
src/seo/
  config.ts       SITE (brand, origin, profili reali), lingue SEO, robots, prefissi tecnici, page size
  categories.ts   categorie con pagina (characters, locations, …) ↔ dataset ↔ nodi del grafo
  slug.ts         sistema di slug centralizzato (slugify, indice id↔slug, collisioni, redirect)
  paths.ts        costruttori/parsing degli URL pubblici, swap lingua, URL assoluti
  metadata.ts     resolveSeoPath (esiste?), isIndexable, breadcrumb, buildPageMeta (title/desc/hreflang/JSON-LD)
  strings.ts      template dei metadati IT/EN (testi naturali, niente keyword stuffing)
  schema.ts       JSON-LD (Organization, WebSite, WebPage/CollectionPage/AboutPage, BreadcrumbList)
  quality.ts      soglie di contenuto per index/noindex delle entità
  links.ts        nodo del knowledge graph → URL crawlabile (eventi → ancora in timeline)
  routes.ts       enumerazione data-driven di TUTTE le pagine + redirect degli slug rinominati
  sitemap.ts      sitemap index + sitemap per gruppo, con hreflang
  head.ts         tag <head> (serializzazione statica + applicazione client)
  images.ts       immagine della mappa principale (LCP) con dimensioni esplicite
  useSeoLang.ts / useEntityPage.ts   hook client
src/pages/seo/    landing del mondo, pagina mappa, entità, directory, timeline (SSR-safe)
src/components/seo/  <Seo> (sync head), <Breadcrumbs>, <CardLink>
scripts/prerender.ts · scripts/seo-check.ts · scripts/test-seo.ts · scripts/serve-static.ts
```

---

## 3. URL strategy

```
/{lang}                                   home                    (lang ∈ it | en)
/{lang}/about · /support · /privacy · /cookie-policy
/{lang}/{world}                           landing del mondo (hub)
/{lang}/{world}/map                       mappa interattiva
/{lang}/{world}/{category}                indice (characters, locations, factions, arcs, journeys, abilities, regions)
/{lang}/{world}/{category}/page/{n}       pagine successive (solo directory paginate, n ≥ 2)
/{lang}/{world}/{category}/{slug}         pagina entità
/{lang}/{world}/timeline[/page/{n}]       cronologia (ogni evento ha l'ancora #event-…)
```

- **Minuscolo, senza slash finale, senza query**. Gli URL sono permanenti.
- **Segmenti in inglese per entrambe le lingue** (`/it/naruto/characters/…`):
  le versioni IT/EN differiscono solo per il prefisso → hreflang sempre
  bidirezionale, nessuna tabella di traduzione degli slug da mantenere.
- Segmento del mondo = `AnimeWorld.urlSlug` (es. `hunter-x-hunter`, `one-piece`),
  separato dallo `slug` interno (`hunterxhunter`) usato da dati/asset/store.
- `/` → **307** verso `/it` (Accept-Language italiano) o `/en` (vercel.json).
- Gli stati della SPA restano query (`/en/naruto/map?character=char-itachi`
  apre la scheda sulla mappa): la canonical è sempre l'URL pulito e robots.txt
  esclude gli URL con query dal crawling.

### Lingue

`SEO_LOCALES = ['it', 'en', 'es']`. Italiano e inglese sono le lingue in cui i
dataset sono **scritti** (`SOURCE_LOCALES`): ogni mondo esiste in entrambe.
Lo **spagnolo** ha home e pagine informative proprie (l'interfaccia è tradotta),
ma un **mondo** esiste in `/es` solo se il suo dataset è tradotto
(`AnimeWorld.translatedLocales` + overlay `src/data/<slug>/i18n/es.ts`, vedi
docs/I18N.md); per gli altri mondi i link costruiti in spagnolo ricadono su
`/en` (`worldPath` → `seoLocaleFor`) e `/es/<mondo>` è un 404. Una pagina entità
`/es` è indicizzabile solo se OGNI suo testo è tradotto. Giapponese, francese e
tedesco restano lingue solo-UI applicate sugli URL `/en`: dare loro URL propri
senza contenuti tradotti creerebbe quasi-duplicati. Il selettore lingua porta
alla stessa pagina nella lingua URL corretta per quella pagina.

---

## 4. Slug (stabili e indipendenti dalla lingua)

Uno slug pubblicato è **permanente**: identico in `/it` e `/en`, non cambia se
l'entità viene tradotta, rinominata o riordinata nel dataset.

- **Derivazione** (`src/seo/slug.ts`, unica fonte): dal **nome inglese**
  (`getEntityDisplayName(e, 'en')`), ASCII kebab-case — diacritici normalizzati,
  apostrofi rimossi, `&` → `and`; nome non latino → slug dall'id. Vale **solo
  per le entità nuove**.
- **Lock pubblicato** (`src/data/<world>/slugs.ts`, `SeoSlugLock`, importato in
  `seoSlugs` del dataset): mappa `categoria → id → slug` di tutti gli slug già
  online, generata da `npm run seo:slugs` e **mai modificata a mano**.
  Precedenza: `entity.slug` (pin esplicito) → lock → derivato. Così tradurre
  `localizedName` (es. il nome inglese di un percorso di Naruto) non sposta
  l'URL: lo slug resta quello congelato.
- **Collisioni** nella stessa categoria: la prima entità tiene lo slug base, le
  altre ricevono un suffisso dall'id; uno slug del lock il cui id non esiste più
  resta **riservato** (non viene riassegnato a un'altra entità).
- **Rinomina volontaria di un URL**: impostare `slug: 'nuovo-slug'` sull'entità
  e lanciare `npm run seo:slugs` → il lock registra il vecchio slug in
  `redirects` (redirect permanente: pagina con meta refresh 0 + canonical, e
  `<Navigate replace>` sul client). In alternativa `previousSlugs: ['vecchio']`.
  I redirect puntano sempre allo slug **vivo** (niente catene, verificato da
  `test:seo`).
- slug riservati: `page`, `map`, `index`, `new`, `edit`.

**Workflow per contenuti nuovi**: aggiungi l'entità → `npm run seo:slugs` (il
nuovo slug entra nel lock) → commit del file `slugs.ts` insieme ai dati.
Controlli: `validate:data` (errori `slug_not_locked`, `slug_lock_missing`,
`duplicate_slug`, `invalid_slug`; avvisi `slug_renamed`, `slug_collision`),
`test:seo` (nessuna entità fuori dal lock, stesso slug in ogni lingua, redirect
validi), `npm run seo:slugs -- --check` (lock aggiornato).

---

## 5. Cosa viene indicizzato

| Pagina | Index | Note |
| --- | --- | --- |
| Home, About, Support | ✅ | |
| Privacy, Cookie policy | ❌ `noindex, follow` | pagine legali, fuori dalla sitemap |
| Landing mondo, mappa, indici, directory, timeline (anche `/page/N`) | ✅ | ogni pagina paginata è auto-canonica |
| Mondo "in arrivo" | ❌ | solo landing segnaposto, finché non ha dati |
| Pagina entità | ✅ se supera la soglia **e** il testo è davvero in quella lingua | altrimenti `noindex, follow` |
| Percorso **derivato** (`isDerivedJourney`, `route-journey-*`) | ↪ `index, follow` + **canonical → pagina del protagonista** | proiezione degli eventi/luoghi già mostrati sulla pagina personaggio: fuori da sitemap e hreflang (`canonicalTargetPath`); i percorsi scritti a mano restano canonici di sé |
| 404, redirect di slug | ❌ | |
| Query (`?character=…`), `/og/*`, `/share/*`, `/social/*`, `/render/*` | ❌ | robots.txt + X-Robots-Tag |

**Soglia di qualità** (`src/seo/quality.ts`): testo descrittivo (breve + lungo
+ trivia + tappe) e numero di entità collegate nel knowledge graph. Esempio
personaggi: ≥ 220 caratteri, oppure ≥ 90 + 3 collegamenti, oppure ≥ 40 + 8
collegamenti. Tutte le pagine vengono comunque generate (sono utili agli
utenti e fanno parte del grafo di link): sotto soglia sono solo `noindex`.

**Lingua reale**: una stringa `Localizable` semplice è testo italiano non
tradotto. La pagina `/en` di un'entità con sola descrizione italiana resta
`noindex` (niente finte traduzioni). Per questo **ogni testo narrativo va
scritto `{ it, en }`** (vedi §5b): oggi nessuna pagina è esclusa per
traduzione mancante.

**Motivi di esclusione** (`noindexReason` in `src/seo/metadata.ts`, riepilogati
per lingua dal prerender a fine build): `legal_page`, `coming_soon`,
`thin_content` (sotto soglia in entrambe le lingue), `not_translated`.

### 5b. Localizzazione obbligatoria IT/EN dei contenuti SEO

Lo **schema** dei campi `Localizable` (`src/utils/localizableFields.ts`) elenca,
per ogni tipo di entità, quali campi sono **testo** (descrizioni, titoli,
periodi, etichette delle relazioni, tappe dei percorsi… → devono essere
`{ it, en }` con entrambe le lingue non vuote) e quali sono **nomi**
(`localizedName`, titolo dell'opera → stringa semplice ammessa se il nome è
uguale in tutte le lingue). Quando si aggiunge un campo `Localizable` a
un'entità va aggiunto anche lì.

```ts
shortDescription: {
  it: 'Protagonista. Jinchūriki di Kurama, ninja della Foglia.',
  en: "Protagonist. Kurama's jinchūriki, a Leaf ninja.",
},
```

Nomi canonici (Uchiha, Akatsuki, Konohagakure, Rasengan) invariati; nessuna
lore o parola chiave inventata; se il nome italiano diverge dal doppiaggio
inglese, `localizedName: { it, en }`.

Controlli (bloccanti): `npm run validate:i18n` (errori `plain_string`,
`missing_it`, `missing_en`, `empty`, `missing_field`; avvisi euristici
`en_looks_italian`, `it_looks_english`, `italian_name_without_en`),
`test:seo` (nessun campo di testo non localizzato), `seo:check` (nessuna pagina
`/en` indicizzabile con description italiana).

---

## 6. Canonical, hreflang, metadati

- **Canonical**: assoluta, `https://animapverse.com`, senza query/hash, uguale
  all'URL della pagina (le pagine paginate sono auto-canoniche). La 404 non ne ha.
- **hreflang**: `it`, `en`, `x-default` (→ versione inglese, o la prima
  disponibile) **solo fra le versioni indicizzabili** della stessa pagina;
  reciproco per costruzione, ripetuto anche nella sitemap (`xhtml:link`).
- **`<html lang>`**: lingua dell'URL nell'HTML statico; sul client la lingua
  dell'interfaccia (es. `ja` su `/en/...`).
- **Title/description**: da `src/seo/strings.ts`, nella lingua dell'URL; la
  description usa il testo reale dell'entità + una coda contestuale.
  Nomi duplicati in una categoria vengono disambiguati (livello di mappa / id).
- **Open Graph / Twitter**: su ogni pagina; immagine di default
  `/og-image.png`. Punto di estensione per card per-entità: `ogImageFor()` in
  `metadata.ts` (le future card vivranno sotto `/og/`, già escluso da robots).

---

## 7. Structured data

Solo tipi pertinenti, niente dati inventati:

- Home: `WebSite` + `Organization` (nome AniMapVerse, logo, profili Instagram/X reali).
- Pagine interne: `WebPage` / `CollectionPage` / `AboutPage` + `BreadcrumbList`.
- `about`: l'opera come `CreativeWorkSeries` con autore/editore **solo** se
  presenti in `AnimeWorld.metadata`; per le entità anche un `Thing` (personaggi
  e luoghi sono di finzione: niente `Person`/`Place`).
- Nessun `Article`, rating, review, prezzo, data o SearchAction.
  AniMapVerse è il sito; le opere restano dei rispettivi titolari (nota
  visibile in fondo alle pagine).

---

## 8. Sitemap, robots, redirect, 404

- `sitemap.xml` = **indice** → `sitemap-pages.xml` + `sitemap-<world>.xml`
  (una per mondo, entrambe le lingue, hreflang inclusi). Solo URL canonici
  indicizzabili e **canonici di sé**. **Nessun `lastmod`**: Google lo usa solo
  se è "consistently and verifiably accurate" per la pagina. La data
  dell'ultimo commit su `src/data/<world>` (usata fino a ottobre 2026) era
  condivisa da tutte le URL di un mondo e, nei clone shallow delle build CI,
  diventava la data di un commit qualsiasi (anche estraneo ai dati) → migliaia
  di pagine invariate "modificate oggi". Reintrodurlo solo con una data per URL
  verificabile (es. impronta del contenuto per pagina); `seo:check` fallisce se
  una sitemap ha la stessa data su tutte le URL.
- `robots.txt` (generato): `Allow: /`, `Disallow: /*?` e i prefissi tecnici,
  `Sitemap:`. **JS/CSS non sono bloccati** (prima `/assets/` era in Disallow
  e impediva a Google di renderizzare la SPA).
- `vercel.json`: nessun fallback SPA (un path inesistente riceve `404.html`
  con **status 404**); 308 dalle vecchie rotte (`/worlds/...`, `/about`,
  `/supporta`, …) verso le nuove in un solo salto; `www` → apex; cache immutabile
  solo per gli asset con hash; `X-Robots-Tag: noindex` sui prefissi tecnici.
- HTTP → HTTPS lo fa già Vercel. In **Vercel → Domains** tenere `animapverse.com`
  come dominio principale e `www.animapverse.com` come redirect.

---

## 9. Internal linking

- Header del mondo: Panoramica, Mappa, Personaggi, Luoghi, Fazioni,
  Tecniche, Archi, Percorsi (link reali, solo le categorie presenti).
- Breadcrumb visibile (`<nav><ol>`) + `BreadcrumbList`, dalla stessa struttura.
- Pagina entità: ogni relazione del knowledge graph (`getGraphContextForEntity`,
  `characterConnections`, `relatedPlaceIds`) è un `<a href>` verso l'entità
  collegata; archi con precedente/successivo; eventi → ancora in timeline.
- Card degli archivi = veri link (`CardLink`): il click apre comunque la scheda.
- Schede modali sulla mappa → link "Apri la pagina completa" (↗).
- Mappa: l'HTML statico contiene un indice di link (regioni, luoghi principali,
  percorsi); dopo l'idratazione subentra React Flow.
- `seo:check` verifica ~170.000 link interni a ogni build (nessun 404 ammesso).

---

## 10. Performance

- Bundle iniziale: **884 KB → 457 KB** (gzip 272 → 147 KB). React Flow non è più
  nel chunk principale (modale relazioni lazy); `WorldRoute` + layout-mondo sono
  un chunk separato; ja/fr/de/es sono chunk caricati on-demand.
- HTML statico con contenuto: LCP non dipende più dall'esecuzione di JS.
- Preload per pagina: 2 font critici (woff2), `modulepreload` dei chunk della
  rotta (niente waterfall), immagine della mappa con `fetchpriority=high`
  sulla rotta `/map` (e `loading="eager"` nel canvas).
- Dimensioni esplicite sulle immagini della mappa (anti-CLS), `lazy` sulle
  card sotto la piega.
- Costo: HTML più pesante (pagina entità ~8 KB gzip; archivio più grande
  ~65 KB gzip), build +~30 s, ~5.500 file HTML.
- Soglia futura: se un archivio interattivo supera ~600 voci, passarlo tra le
  directory paginate (`PAGINATED_CATEGORIES` in `categories.ts`).

---

## 11. Come aggiungere un nuovo anime (zero lavoro SEO)

1. Dataset + `WorldConfig` + registry come da CLAUDE.md ("Adding a new world").
2. In `src/data/worlds.ts` impostare `urlSlug` (kebab-case, permanente) e
   `metadata.author/publisher` reali (finiscono nel JSON-LD `about`).
3. Scrivere ogni testo narrativo `{ it, en }` (§5b), poi `npm run seo:slugs`
   e importare il `slugs.ts` generato nel dataset (`seoSlugs`).
4. `npm run build`. Automaticamente: landing, mappa, indici, pagine entità,
   timeline, metadati IT/EN, hreflang, `sitemap-<world>.xml`, link nell'header,
   nella home e in `llms.txt`. `test:seo` e `seo:check` verificano tutto.

## 12. Come aggiungere un nuovo tipo di entità

1. Aggiungere la categoria in `SEO_CATEGORIES` + `categoryEntities` +
   `CATEGORY_ENTITY_TYPE` (`src/seo/categories.ts`).
2. Title/description in `src/seo/strings.ts` (IT/EN) e il `case` in
   `buildPageMeta`; soglie in `quality.ts`.
3. Template in `src/pages/seo/EntityPage.tsx` (sezioni dai dati) e indice
   (directory in `DirectoryPage` o archivio esistente).
4. Emettere gli archi nel knowledge graph (`buildWorldGraph`) così i link
   compaiono da soli nelle altre pagine.
5. `npm run build` (i test coprono slug, URL, metadati, sitemap).

---

## 13. Verifica

```bash
npm run build                 # include test:seo e seo:check
npm run preview:static        # http://localhost:4173 con redirect/404 reali
curl -sI localhost:4173/questo-url-non-esiste    # → 404
curl -sI localhost:4173/worlds/naruto            # → 308 /it/naruto/map
npm run validate:data         # integrità dati + lock slug + contenuti sotto soglia
npm run validate:i18n         # chiavi UI + campi Localizable di tutti i mondi
npm run seo:slugs -- --check  # lock degli slug aggiornato
npm run smoke                 # browser: rotte, idratazione, lingua, 404, header responsive
BASE=http://localhost:4173 npm run audit:a11y   # axe WCAG 2.2 AA
```

In produzione: *URL Inspection* di Search Console ("Visualizza pagina
sottoposta a scansione") e il [Rich Results Test](https://search.google.com/test/rich-results).

---

## 14. Checklist Google Search Console / Bing

- **Sitemap**: `https://animapverse.com/sitemap.xml`
- **Robots**: `https://animapverse.com/robots.txt`

1. Search Console → *Aggiungi proprietà* → tipo **Dominio** `animapverse.com`
   (verifica DNS TXT dal pannello del registrar/Vercel DNS).
2. *Sitemap* → invia `https://animapverse.com/sitemap.xml` (l'indice elenca le
   sitemap per mondo: lo stato di ogni file compare separatamente).
3. *Controllo URL* → richiedi l'indicizzazione di:
   `https://animapverse.com/en`, `/it`,
   `/en/naruto`, `/en/one-piece`, `/en/hunter-x-hunter`, `/en/dragon-ball`,
   `/en/black-clover`, `/en/naruto/map`, `/en/one-piece/journeys`.
4. Controlla un'entità (es. `/en/one-piece/characters/monkey-d-luffy`) con
   "Visualizza pagina sottoposta a scansione": title, canonical, H1 e link
   devono essere già nell'HTML.
5. *Pagine* (copertura) dopo 1–2 settimane: le "Escluse da tag noindex" sono
   attese (entità sotto soglia o non tradotte); i vecchi `/worlds/...` devono
   comparire come "Pagina con reindirizzamento".
6. *Miglioramenti → Breadcrumb*: nessun errore atteso.
7. *Impostazioni internazionali*: hreflang ok (report legacy, se disponibile).
8. **Bing Webmaster Tools** → *Importa da Google Search Console* (più rapido)
   oppure aggiungi il sito e invia la stessa sitemap.

### IndexNow (valutato, non attivato)

Vantaggi: notifica immediata a Bing/Yandex degli URL cambiati. Costi: una
chiave da pubblicare, un passo post-deploy che invii solo gli URL **modificati**
(inviarli tutti a ogni deploy sarebbe spam) e quindi un confronto fra sitemap
vecchia e nuova. Con aggiornamenti settimanali il
beneficio è marginale: da riconsiderare se il ritmo di pubblicazione aumenta.

### `llms.txt`

Generato al build come sommario complementare (mondi + sitemap). Non
sostituisce sitemap, robots o HTML semantico.
