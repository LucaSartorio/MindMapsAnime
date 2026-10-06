# AniMapVerse · Mappe Interattive

**Atlante interattivo di mondi narrativi** (anime, manga e oltre): un'unica app
per esplorare mondo, nazioni, regioni, villaggi/luoghi simbolo, personaggi, clan
& fazioni, sistema di poteri (jutsu / nen / frutti del diavolo / tecniche…),
archi narrativi, eventi della timeline e percorsi dei protagonisti — il tutto
connesso da un **knowledge graph derivato** che mostra le relazioni **in modo
contestuale** (mai un groviglio globale): la mappa resta la protagonista, il
grafo è il motore semantico che lega le entità.

**Stack:** React 18 + TypeScript (strict) + Vite + Zustand + React Flow
(`@xyflow/react`) + Tailwind CSS + React Router + i18next. Vercel Analytics +
Speed Insights per la telemetria, attivati dopo il consenso esplicito.
Nessun backend, nessun database remoto — **tutti i dati vivono in file
TypeScript locali** sotto `src/data/`.

Il sito è **pre-renderizzato in HTML statico** durante la build e idratato da
React nel browser. Il repository contiene anche un **motore social interno**
basato su Remotion, separato dal bundle pubblico, che riusa gli stessi dataset
per generare video verticali.

Lo scheletro dell'app è **interamente dataset-driven e dinamico per mondo**:
aggiungere un'opera significa creare un dataset + una config, senza toccare i
componenti.

---

## ✦ Mondi inclusi

| Mondo               | Slug interno         | Slug URL pubblico      | Stato         | Sistema di poteri              |
| ------------------- | -------------------- | ---------------------- | ------------- | ------------------------------ |
| Naruto              | `naruto`             | `naruto`               | ✓ Disponibile | Jutsu                          |
| Hunter x Hunter     | `hunterxhunter`      | `hunter-x-hunter`      | ✓ Disponibile | Nen                            |
| One Piece           | `onepiece`           | `one-piece`            | ✓ Disponibile | Frutti del Diavolo             |
| Dragon Ball         | `dragonball`         | `dragon-ball`          | ✓ Disponibile | Tecniche                       |
| Attack on Titan     | `attackontitan`      | `attack-on-titan`      | ✓ Disponibile | Giganti & Poteri               |
| Bleach              | `bleach`             | `bleach`               | ✓ Disponibile | Zanpakutō & Poteri spirituali   |
| Jujutsu Kaisen      | `jujutsukaisen`      | `jujutsu-kaisen`       | ✓ Disponibile | Tecniche Malefiche             |
| Black Clover        | `blackclover`        | `black-clover`         | ✓ Disponibile | Magia & Grimori                |
| Fullmetal Alchemist | `fullmetalalchemist` | `fullmetal-alchemist`  | In arrivo     | Alchimia                       |
| Frieren             | `frieren`            | `frieren`              | In arrivo     | Magia                          |
| Toriko              | `toriko`             | `toriko`               | In arrivo     | Tecniche Gourmet               |
| Fairy Tail          | `fairytail`          | `fairy-tail`           | In arrivo     | Magia                          |
| Demon Slayer        | `demonslayer`        | `demon-slayer`         | In arrivo     | Respirazioni & Arti Demoniache |

I loader e le cartelle dati usano lo slug interno; le rotte pubbliche usano
`AnimeWorld.urlSlug` (o `slug` se non è specificato).

### Dataset attuali

Conteggi verificati il **6 ottobre 2026** sui dataset caricati dal registro
dell'app, inclusi i percorsi dei personaggi derivati dagli eventi. La fonte di
verità è `src/data/`; `npm run validate:data` stampa i conteggi delle entità
principali e ne verifica l'integrità.

| Entità             | Naruto | Hunter x Hunter | One Piece | Dragon Ball | Bleach | Attack on Titan | Jujutsu Kaisen | Black Clover |
| ------------------ | -----: | --------------: | --------: | ----------: | -----: | --------------: | -------------: | -----------: |
| Personaggi         |    253 |             165 |       418 |         184 |    147 |              82 |             72 |          137 |
| Clan & fazioni     |     57 |              24 |        83 |          21 |     34 |              24 |             15 |           43 |
| Team               |     14 |               0 |         0 |           0 |      0 |               0 |              0 |            0 |
| Tecniche           |    153 |              73 |       125 |         110 |    102 |              40 |             68 |           91 |
| Archi narrativi    |     32 |               8 |        37 |          37 |     17 |              14 |             13 |           19 |
| Eventi timeline    |    160 |             112 |       226 |         190 |    118 |             111 |             83 |           83 |
| Tornei             |      3 |               2 |         2 |           9 |      0 |               0 |              1 |            1 |
| Percorsi           |     47 |              20 |        46 |          27 |     31 |              33 |             24 |           24 |
| Luoghi             |    108 |              77 |       331 |         113 |     77 |              76 |             49 |           90 |
| Nazioni            |     27 |              17 |         8 |           6 |      7 |               8 |             12 |            8 |
| Confini (boundary) |     26 |              12 |         0 |           0 |      0 |               0 |              0 |            0 |
| Livelli mappa      |     10 |               9 |        27 |           8 |      5 |               7 |              6 |            6 |

**Livelli mappa** = world map + sotto-mappe drill-down:

- **Naruto** — Konoha, Suna, Kiri, Iwa, Kumo, Ame, Oto, Uzushio, Taki.
- **Hunter x Hunter** — Heavens Arena, Zoldyck Estate, Greed Island, East
  Gorteau Palace, Yorknew City, Whale Island, NGL, Black Whale 1.
- **One Piece** — Totland, Alabasta, Wano, Skypiea, Dressrosa, Sabaody,
  Marineford, Egghead, Fishman Island.
- **Dragon Ball** — Terra (world map), Universo, Namecc, Spazio (GT), Aldilà (Via del
  Serpente, Re Yama, Re Kaiō, Gran Kaiō, Inferno), Santuario di Dio e Torre di Karin,
  Isola di Papaya (Torneo Tenkaichi), Città dell'Ovest (Capsule Corporation).
- **One Piece** (altre sotto-mappe) — Impel Down, Enies Lobby, Water 7, Thriller
  Bark, Zou, Punk Hazard, Amazon Lily, Drum, Marijoa, Dawn, Loguetown, Jaya,
  Ohara, Elbaf, God Valley, Germa, Spazio.
- **Black Clover** — Capitale Reale, fortezza di Spade, Regno di Heart, Regno di
  Diamond, Inframondo.
- **Bleach** — I Tre Mondi (world map: Soul Society, Mondo dei Vivi, Hueco
  Mundo, Dangai, Reiōkyū, Inferno), Karakura, Seireitei, Hueco Mundo (Las
  Noches), Reiōkyū. Mappe **SVG originali** ricostruite da noi
  (`scripts/bleach-maps.py` → `public/assets/worlds/bleach/maps/`), nessuna
  immagine ufficiale.
- **Attack on Titan** — Il Mondo (la Terra capovolta, come nella serie: Marley,
  Medio Oriente, Hizuru, Paradis), l'isola di Paradis, Dentro le Mura (i tre
  cerchi in scala con i dodici distretti), Shiganshina, Trost, Liberio, i
  Sentieri. Mappe **SVG originali** generate da `scripts/mapgen/aot.py` sui
  contorni Natural Earth (dominio pubblico) → `public/assets/worlds/attackontitan/maps/`.
- **Jujutsu Kaisen** — Il Giappone (world map: contorni Natural Earth, le prefetture e
  le dieci colonie del Culling Game, riquadro di Okinawa), Tokyo (Istituto, Shibuya,
  Shinjuku, le colonie Tokyo n.1 e n.2), Shibuya dentro il Velo (strade e stazioni
  reali), l'Istituto di arti occulte di Tokyo (campus immaginato: la serie non ne
  mostra una pianta), Kyoto, Sendai. Mappe **SVG originali** generate da
  `scripts/mapgen/jjk.py` → `public/assets/worlds/jujutsukaisen/maps/`.

**Ogni livello ha una mappa.** Dove l'opera non offre una mappa utilizzabile,
la sotto-mappa è un **SVG originale** disegnato da AniMapVerse (50 mappe:
Naruto 9, Hunter x Hunter 8, One Piece 21, Dragon Ball 7, Black Clover 5),
generato da `scripts/mapgen/<mondo>.py` su un toolkit comune
(`scripts/mapgen/kit.py`: coste, foreste, montagne, edifici, cartigli). Gli script
sono deterministici e riscrivono anche le coordinate dei pin, così pin e disegno
restano allineati: `python3 scripts/mapgen/naruto.py` (idem `hxh`, `onepiece`,
`dragonball`, `blackclover`).

**Lingue UI:** italiano (default), inglese, spagnolo, francese, tedesco e
giapponese. I contenuti narrativi sono scritti in italiano e inglese; tutti
gli otto mondi disponibili hanno anche l'overlay spagnolo e URL `/es`.
Francese, tedesco e giapponese usano il fallback dei contenuti sugli URL `/en`.
Il flusso di traduzione è descritto in [`docs/I18N.md`](docs/I18N.md).

---

## ✦ Esperienza & funzionalità

- **Mappa interattiva** (React Flow) — pin tinti per categoria (il colore non è
  mai l'unico segnale: icona + etichetta restano), **clustering** in world-space
  quando i pin si affollano, **confini** cliccabili, e **drill-down** nelle
  sotto-mappe con doppio clic sui luoghi che ne hanno una.
- **Knowledge graph derivato** (`src/lib/graph/`) — una *proiezione* del dataset
  (nessun dato duplicato, memoizzata per-dataset): motore unico per **focus
  mode** (evidenzia il contesto collegato), overlay di connessioni sulla mappa,
  e la sezione **Relazioni** presente in ogni scheda. Include nodi-gruppo
  world-agnostic (`razza`, `saga`) emessi solo dove il campo esiste.
- **Ricerca globale ⌘K** — combobox accessibile che raggiunge ogni entità e,
  sul match forte, ne mostra anche le **entità correlate** dal grafo.
- **Story Mode & Relations Mode** — storia guidata evento-per-evento lungo un
  arco (la mappa fa da palcoscenico) e grafo navigabile delle relazioni di un
  personaggio (con elenco accessibile).
- **Timeline narrativa con riproduzione** — un tasto ▶ ripercorre **tutti gli
  eventi uno per uno**; durante la play il pannello collassa in una barra
  compatta con Pausa/Riprendi/Stop.
- **"Segui il percorso"** — stepper Prev/Next/Play che cammina la mappa tappa
  per tappa; le tappe si **illuminano anche sulla scheda** (fatto/corrente).
- **Schede dettaglio** come pannello docked (non coprono la mappa), con **tab**
  accessibili per le schede lunghe.
- **Design system & shell mappa** — tool rail unica (rail verticale su desktop,
  **bottom nav** su mobile), drawer Filtri/Livelli separati, pannelli
  galleggianti (legenda/timeline/percorsi) che su mobile si aprono dalla bottom
  nav uno alla volta per non coprire la mappa.
- **Obiettivo di accessibilità WCAG 2.2 AA** — pattern WAI-ARIA (tab, disclosure, combobox,
  switch), focus trap/restore, `inert`; verifica con `npm run audit:a11y`
  (axe-core).

---

## ✦ Comandi

Per uno sviluppo coerente con GitHub Actions usa **Node.js 22**. Il repository
include `package-lock.json`: `npm ci` installa le versioni bloccate in un
checkout pulito; usa `npm install` quando aggiorni le dipendenze.

```bash
npm ci                      # installa le dipendenze dal lockfile

npm run dev                 # dev server (Vite) → http://localhost:5173
npm run build               # tsc -b + test:seo + i18n:audit + vite build + build:ssr + prerender + seo:check
npm run build:ssr           # bundle per il pre-rendering → dist-server/ (solo build, non pubblicato)
npm run prerender           # dopo le build client/SSR: HTML statico + sitemap/robots/llms.txt
npm run test:seo            # invarianti SEO sulle sorgenti (slug, URL, metadati, hreflang, sitemap)
npm run seo:check           # verifica l'HTML generato in dist/ (canonical, hreflang, link rotti…) — bloccante
npm run preview:static      # serve dist/ con la semantica di Vercel (redirect, 404 veri) → :4173
npm run preview             # anteprima Vite (NB: risponde 200 a qualsiasi path)
npm run smoke               # build + test browser: rotte, idratazione, lingue, modali, 404 e header

npm run validate:data       # valida TUTTI i dataset (ref rotti, coords, duplicati) — exit 1 se errori
npm run validate:i18n       # chiavi UI nelle 6 lingue + testi narrativi obbligatori IT/EN
npm run i18n:audit          # nomi ed etichette nelle lingue con URL propri (incluso nella build)
npm run i18n:status         # overlay dei dataset: copertura, chiavi mancanti, obsolete e orfane
npm run seo:slugs           # aggiorna il lock degli slug pubblicati quando aggiungi entità
npm run coverage:chapters   # report della copertura dei riferimenti ai capitoli
npm run audit:a11y          # report axe-core (richiede preview attivo e Chromium, vedi Accessibilità)

npm run extract:boundaries  # rigenera i path SVG dei confini Naruto dalla PNG
npm run find:dots           # rileva i marker rossi dei villaggi nella PNG → coordinate flow
npm run optimize:images     # ottimizza i raster; richiede sharp (attualmente non dichiarato)
```

> **Gate di build:** tutti i passaggi di `npm run build` sono bloccanti.
> **Gate dati e traduzioni:** esegui anche `npm run validate:data` e
> `npm run validate:i18n` quando cambi i dataset; valida le chiavi UI quando
> cambi le stringhe dell'interfaccia. Per nuove entità aggiorna il lock con
> `npm run seo:slugs`. Per modifiche alle interazioni esegui `npm run smoke`.

`npm run lint` (`eslint .`) **non** è operativo: mancano dipendenza e
configurazione ESLint. Anche il controllo TypeScript degli script
(`npx tsc -p scripts/tsconfig.json --noEmit`) segnala l'import di `sharp`
mancante in `scripts/optimize-images.ts`; la build dell'app non include quel
progetto TypeScript. Gli script eseguiti con `tsx` non effettuano typecheck.

Gli script sotto `scripts/` girano con `tsx --tsconfig scripts/tsconfig.json`
perché importano `src/` tramite l'alias `@/`. Oltre a quelli esposti come npm
script, `scripts/` contiene tooling per-mondo (estrazione confini HxH, overlay e
snap dei pin One Piece, ottimizzazione mappa HxH, pin Dragon Ball).

---

## ✦ Sistema dinamico per-mondo (`WorldConfig`)

Tutte le "voci" che cambiano da un'opera all'altra sono centralizzate in
`AnimeWorld.config` (tipo `WorldConfig` in `src/types/index.ts`), risolte dagli
helper di `src/lib/worldConfig.ts`. La UI non hardcoda mai termini di un'opera:
passa `dataset.world` e ottiene etichette già localizzate.

| Config                 | A cosa serve                                              | Esempio                                   |
| ---------------------- | --------------------------------------------------------- | ----------------------------------------- |
| `ability.term`         | Nome del sistema di poteri (nav, modali, archivio)        | Jutsu · Nen · Frutti del Diavolo · Tecniche |
| `ability.categories`   | Etichette delle categorie di tecnica                      | enhancement → "Potenziamento"             |
| `ability.attribute`    | Attributo secondario (Naruto: natura del chakra)          | omesso su HxH → niente filtro natura      |
| `ability.showHandSeals`/`showRank` | Sigilli delle mani / rango E…S (solo Naruto)  | `false` su HxH/One Piece                  |
| `characterRank`        | Sistema di gradi dei personaggi + ordine                  | Grado ninja (Naruto)                      |
| `characterRoles`       | Ruoli specifici dell'opera                                | kage, jinchuriki, akatsuki                |
| `nationTerm`/`placesTerm`/`factionsTerm` | Etichette dei facet                     | "Mare / Isola", "Ciurme & Fazioni"        |
| `featured`             | Liste curate per le vetrine archivio                      | jutsu/clan in evidenza                    |

**Risoluzione etichette a cascata:** config del mondo → mappa "nota"
(Naruto/HxH) → `humanizeId()`. Così un id sconosciuto di un mondo futuro ottiene
comunque un'etichetta leggibile, senza toccare union globali o mappe di label.

I campi tipizzati delle entità (`Jutsu.type`, `Character.role`,
`Character.ninjaRank`, `Faction.type`, …) accettano **stringhe libere**: i tipi
"noti" (`JutsuType`, `NinjaRank`, …) restano come riferimento/autocomplete, ma
ogni mondo può introdurre i propri id.

Filtri e legenda sono **derivati dai dati**: i tipi di luogo, i gradi e i tipi
di fazione mostrati sono solo quelli realmente presenti nel mondo attivo.

---

## ✦ Rotte applicazione

Tutte le pagine pubbliche vivono sotto un prefisso di lingua (`it` | `en` | `es`) e
sono **pre-renderizzate** in HTML statico (architettura SEO in
[`docs/SEO.md`](docs/SEO.md)).

| Path                                   | Descrizione                                             |
| -------------------------------------- | ------------------------------------------------------- |
| `/`                                    | Redirect per lingua: `/it`, `/es` o fallback `/en`      |
| `/{lang}`                              | Homepage con la griglia dei mondi                       |
| `/{lang}/about` · `/{lang}/support`     | Informazioni · Supporta il progetto                     |
| `/{lang}/privacy` · `/{lang}/cookie-policy` | Informative privacy e cookie                        |
| `/{lang}/{world}`                      | Landing del mondo (hub con link a tutto)                |
| `/{lang}/{world}/map`                  | Mappa interattiva                                       |
| `/{lang}/{world}/characters`           | Archivio personaggi (filtri + gradi dinamici)           |
| `/{lang}/{world}/factions`             | Archivio clan & fazioni                                 |
| `/{lang}/{world}/abilities`            | Archivio tecniche (termine/categorie per-mondo)         |
| `/{lang}/{world}/arcs`                 | Archivio archi narrativi                                |
| `/{lang}/{world}/{locations,journeys,regions}` | Directory di luoghi, percorsi, regioni               |
| `/{lang}/{world}/timeline`             | Cronologia degli eventi                                 |
| `/{lang}/{world}/{category}/{slug}`    | Pagina di un'entità (es. `/en/naruto/characters/itachi-uchiha`) |

Le vecchie rotte (`/worlds/:slug/...`, `/about`, `/supporta`…) rispondono con
un redirect 308 alle nuove (vedi `vercel.json`).

Le modali di dettaglio sono **deep-linkabili** (es. `?location=<id>`): l'URL
riflette la scheda aperta ed è condivisibile. I mondi con
`status: 'coming_soon'` aprono automaticamente una pagina segnaposto
(`ComingSoonWorldPage`) senza routing manuale.

Un mondo ha URL `/es` solo se la lingua è dichiarata in
`AnimeWorld.translatedLocales` e il relativo overlay è registrato. Le altre
lingue UI usano URL `/en`. Gli slug delle entità sono stabili e indipendenti
dalla lingua; le versioni indicizzabili sono collegate tramite `hreflang`.

---

## ✦ Albero cartelle (sorgenti principali)

```
src/
├── main.tsx · App.tsx          ← boot, idratazione, router e analytics con consenso
├── entry-server.tsx            ← rendering React usato solo durante la build SSG
├── types/index.ts              ← tipi generici: WorldDataset, AnimeWorld,
│                                 WorldConfig, Location, Character, Faction, Jutsu…
├── types/i18n.ts               ← lingue UI/sorgente, Localizable e fallback
├── data/
│   ├── worlds.ts               ← registro animeWorlds (status, theme, config)
│   ├── registry.ts             ← loader lazy, loadWorldDataset/getLoadedWorldDataset,
│   │                             cache e overlay di traduzione
│   ├── shared/                 ← percorsi derivati, traduzioni e helper comuni dei dati
│   ├── naruto/                 ← dataset Naruto (jutsu, clan+factions, teams, …)
│   ├── hunterxhunter/          ← dataset HxH (nen, 8 sotto-mappe)
│   ├── onepiece/               ← dataset One Piece (frutti, 26 sotto-mappe)
│   ├── dragonball/             ← dataset Dragon Ball (tecniche, 7 sotto-mappe)
│   ├── blackclover/            ← dataset Black Clover (magia, 5 sotto-mappe)
│   ├── bleach/                 ← dataset Bleach (poteri spirituali, 4 sotto-mappe)
│   ├── attackontitan/          ← dataset Attack on Titan (giganti, 6 sotto-mappe)
│   └── jujutsukaisen/          ← dataset Jujutsu Kaisen (tecniche malefiche, 5 sotto-mappe)
├── store/                      ← Zustand: useWorldStore, useMapStore,
│                                 useUiStore, useLocaleStore, consenso, ricerca, segnalazioni
├── i18n/                       ← init i18next + resources/{it,en,es,fr,de,ja}.ts
├── seo/                        ← URL, slug, metadati, qualità, JSON-LD e sitemap
├── pages/                      ← pagine informative e WorldMapPage
│   └── seo/                    ← landing, directory, pagine entità e timeline
├── lib/
│   ├── graph/                  ← knowledge graph derivato (buildWorldGraph, query,
│   │                             coMembers, relatedPlaceIds, characterConnections)
│   ├── graphRefs.ts · relationGroups.ts · useOpenEntityRef.ts  ← livello relazioni schede
│   ├── mapMode.ts · mapSelectors.ts       ← modalità mappa derivata · selettori visibili
│   ├── entities.ts · search.ts · filters.ts · clusterPins.ts · crossLinks.ts
│   ├── worldConfig.ts · locationTypes.ts · worldMapPrefs.ts · series.ts · cn.ts
├── utils/
│   ├── localization.ts         ← getLocalizedText + label enum localizzate
│   ├── entityImage.ts · worldCursor.ts · buildIndexes.ts · validateDataset.ts
├── routes/                     ← AppRouter, WorldRoute (lazy-load pagine)
└── components/
    ├── common/                 ← Modal, Drawer, Tabs, FloatingPanel, RelationsPanel,
    │                             EntityImage, Badge/Button/Card…
    ├── home/ · layout/         ← HomePage/WorldGrid · AppShell/TopNav/WorldLayout
    ├── map/                    ← InteractiveWorldMap, MapNode/Cluster, boundary,
    │                             ToolRail, MapLegendFloating, StoryModePanel,
    │                             RouteStepper, MapModeIndicator, MapFocusBreadcrumb…
    ├── filters/ · drawers/     ← primitive filtri (chip/section/toggle) · Filtri+Livelli
    ├── timeline/ · search/     ← TimelineBottomSheet · GlobalSearchDropdown
    ├── onboarding/             ← OnboardingOverlay (aiuto "come esplorare")
    ├── archive/                ← CharactersPage, ClansAndFactionsPage, JutsuPage, …
    ├── battles/ · family/ · factions/ · tournaments/ ← viste narrative condivise
    ├── seo/                    ← Seo, Breadcrumbs e link alle pagine delle entità
    ├── cookie/ · report/       ← consenso e modulo di segnalazione
    └── modals/                 ← ModalRoot + modali dettaglio per ogni entità
```

Ogni cartella mondo assembla il dataset in `index.ts`: entità, asset, livelli
mappa, configurazioni e lock SEO in `slugs.ts`; `i18n/es.ts` e
`i18n/es.meta.json` contengono l'overlay spagnolo e le impronte dei sorgenti.
Alcuni campi, come confini o tornei, esistono solo nei mondi che li utilizzano.

Fuori da `src/`: `public/` ospita gli asset statici, `scripts/` i validatori e
i generatori, `tools/social-engine/` il motore video e la sua pipeline,
`docs/` la documentazione tecnica e `.github/workflows/` i workflow social.
`dist/` e `dist-server/` sono output generati e ignorati da Git.

---

## ✦ Sistema di coordinate mappa

Ogni mondo ha il **proprio piano viewBox**, pari a `MapLevel.width/height` del
suo world map. I dati di posizione (location `x/y`, boundary `svgPathD`,
`labelPosition`) vivono in quel piano.

| Mondo           | Costante                    | viewBox         |
| --------------- | --------------------------- | --------------- |
| Naruto          | `NARUTO_MAP_VIEWBOX`         | 1500 × 882.2204 |
| Hunter x Hunter | `HXH_MAP_VIEWBOX`            | 2000 × 1187     |
| One Piece       | `ONEPIECE_MAP_VIEWBOX`       | 2000 × 1000     |
| Dragon Ball     | `DRAGONBALL_MAP_VIEWBOX`     | 1785 × 1261     |
| Black Clover    | `BLACKCLOVER_MAP_VIEWBOX`    | 1500 × 1057     |
| Bleach          | `BLEACH_WORLD_VIEWBOX`       | 2000 × 1250     |
| Attack on Titan | `AOT_WORLD_VIEWBOX`          | 2000 × 950      |
| Jujutsu Kaisen  | `JJK_JAPAN_VIEWBOX`          | 1800 × 1600     |

Esempio di conversione (Naruto, PNG di riferimento 990 × 579 px):

```
flowX = px_x / 990 * 1500
flowY = px_y / 579 * 882.2204
```

Gli script PNG-reader (`find:dots`, `extract:boundaries`, …) emettono coordinate
**già convertite** nel piano flow del mondo — incollale direttamente nei dati.
Le sotto-mappe hanno `width/height` propri nel rispettivo `MapLevel`. Se
sostituisci l'immagine di una mappa, mantieni lo stesso viewBox o tutti i pin si
spostano.

---

## ✦ Tipo `Localizable` e i18n

Le stringhe **dati** usano `Localizable`: stringa semplice, oggetto
`LocalizedText` con `it`/`en` e lingue aggiuntive facoltative, oppure mappa
parziale delle lingue supportate. Per i **nuovi testi narrativi** scrivi sempre
`{ it: "…", en: "…" }`: una stringa semplice o un testo senza entrambe le
lingue sorgente non supera i controlli di localizzazione dei contenuti SEO.
Risolvile **sempre** con `getLocalizedText(value, locale)` /
`getEntityDisplayName(...)` (`src/utils/localization.ts`) — mai mettere un
oggetto `Localizable` direttamente in JSX: un oggetto non è un figlio React
valido. **ID, slug e chiavi non si traducono mai.**

Le stringhe **UI** vivono in `src/i18n/resources/{it,en,es,fr,de,ja}.ts`:
mantieni le chiavi allineate nelle sei lingue (`npm run validate:i18n`).
Default italiano; persistenza in `localStorage` con chiave
`animeInteractiveMaps.locale`. La lingua dell'URL determina i contenuti;
una preferenza UI compatibile può restare attiva sul relativo URL di fallback.

Gli overlay dei dataset (`src/data/<slug>/i18n/<lingua>.ts`) sono chunk lazy
separati dai dati sorgente. `npm run i18n:status` segnala anche le traduzioni
obsolete tramite gli hash in `<lingua>.meta.json`; `i18n:extract` e
`i18n:merge` gestiscono estrazione e aggiornamento. I nomi localizzati nelle
lingue sorgente sono raccolti nei file per-mondo `names.ts`. Vedi
[`docs/I18N.md`](docs/I18N.md) per la procedura completa.

---

## ✦ Aggiungere un nuovo anime / manga

1. **Registra il mondo** in `src/data/worlds.ts` con `slug`, `urlSlug`,
   `status`, `theme`, metadati reali dell'opera (`metadata.author/publisher`) e la
   `config` per-mondo (termine del sistema di poteri, gradi, ruoli, vetrine…):

   ```ts
   {
     id: 'world-onepiece', slug: 'onepiece', urlSlug: 'one-piece', title: 'One Piece',
     status: 'available',
     theme: { primary: '#…', accent: '#…', highlight: '#…' },
     defaultMapLevelId: 'op-map-world',
     availableMapLevelIds: ['op-map-world', /* sotto-mappe… */],
     metadata: { author: 'Eiichiro Oda', publisher: 'Shueisha' },
     config: {
       ability: {
         term: { it: 'Frutti del Diavolo', en: 'Devil Fruits' },
         categories: [{ id: 'paramecia', label: 'Paramecia' }, /* … */],
       },
       nationTerm: { it: 'Mare / Isola', en: 'Sea / Island' },
     },
   }
   ```

2. **Crea la cartella dataset** `src/data/<slug>/` con i file entità
   (`assets`, `mapLevels`, `mapConstants`, `nations`, `boundaries`, `locations`,
   `characters`, `factions`/`clans`, `arcs`, `events`, `routes`, tecniche…) e un
   `index.ts` che esporta `<slug>Dataset: WorldDataset`.

3. **Registra il loader lazy** in `worldDatasetLoaders` dentro
   `src/data/registry.ts`, con un `import()` dinamico che risolve il dataset.
   I campi narrativi devono avere entrambe le lingue sorgente IT/EN.

4. **Congela gli slug pubblici:** esegui `npm run seo:slugs`, importa il file
   generato `slugs.ts` nell'`index.ts` del mondo e assegnalo a `seoSlugs`.
   Gli slug pubblicati restano riservati; una rinomina genera un redirect.

5. **Valida:** `npm run validate:data`, `npm run validate:i18n` e
   `npm run build` devono passare prima del merge. Per pubblicare anche lo
   spagnolo, completa l'overlay, registra il loader in
   `worldTranslationLoaders`, aggiungi `es` a `translatedLocales` e verifica
   anche `npm run smoke` (procedura in [`docs/I18N.md`](docs/I18N.md)).

Mappa, filtri, legenda, timeline, archivi, ricerca globale, knowledge graph e
modali si adattano automaticamente al nuovo dataset e alla sua config — zero
modifiche ai componenti.

---

## ✦ Immagini: mappe, schede e loghi

**Sfondo mappa** — imposta `backgroundAssetId` nel `MapLevel` e aggiungi un
`AssetReference` in `src/data/<slug>/assets.ts` (campi obbligatori `license`,
`author`, `source`, `url`). `WorldMapBackground` mostra l'immagine se `url` è
valorizzato, altrimenti un placeholder SVG generato.

**Schede entità** — `EntityImage` genera un placeholder SVG tematico; per usare
un'immagine reale basta un **drop-in** con il nome = id dell'entità, per
qualunque mondo (auto-discovery a build-time via `import.meta.glob`):

```
src/assets/worlds/<slug>/{characters,jutsu,clans,locations,arcs}/<entityId>.<ext>
```

**Placeholder per-mondo** — ogni opera ha i suoi simboli, dichiarati nel registro
`src/lib/worldPlaceholders.ts` e disegnati da `src/components/common/entityArt.tsx`
(forme originali, mai artwork ufficiale):

| Mondo           | Personaggi           | Poteri              | Clan / fazioni      |
| --------------- | -------------------- | ------------------- | ------------------- |
| Naruto          | protettore frontale  | spirale di chakra   | stemma a scudo      |
| One Piece       | cappello di paglia   | Frutto del Diavolo  | Jolly Roger         |
| Dragon Ball     | capigliatura a punte | sfera di ki         | sfera del drago     |
| Hunter x Hunter | aura Nen             | esagramma Nen       | placca da Hunter    |
| Black Clover    | grimorio + quadrifoglio | cerchio magico   | stendardo di compagnia |
| Bleach          | lama (zanpakutō)     | fendente            | stemma a stella     |
| Attack on Titan | cappuccio (mantello) | fendente            | Ali della Libertà   |
| Jujutsu Kaisen  | benda sugli occhi    | maledizione         | stemma a stella     |

I colori di fondo derivano dal `theme` del mondo, con una variazione per entità
volutamente stretta: schede diverse restano distinguibili senza uscire dalla
palette dell'opera. Un mondo non elencato usa forme neutre ma **già colorate col
suo tema**: aggiungere un anime non richiede modifiche ai componenti — basta una
voce nel registro per dargli simboli dedicati (i mondi "in arrivo" ce l'hanno già).

**Logo del mondo** (card homepage) — `src/assets/worlds/logos/<slug>.<ext>`,
scoperto automaticamente a build-time come le immagini delle entità.

Formati: `jpg, jpeg, png, webp, avif, svg`. **Non** inserire immagini protette da
copyright senza i diritti.

---

## ✦ Accessibilità

L'app punta a **WCAG 2.2 AA**. Le interazioni seguono i pattern WAI-ARIA
(tablist con roving tabindex, disclosure, combobox ⌘K, switch), i overlay
intrappolano il focus e lo **restituiscono al trigger** alla chiusura, i drawer
chiusi sono `inert` (fuori dal tab order e dall'albero a11y). Il colore non è
mai l'unico segnale (icone + etichette + stati ARIA). Verifica con
`npm run audit:a11y` (axe-core): avvia prima `npm run preview`; gli scenari
coprono mappa, drawer filtri, schede docked, timeline, story/relations mode e
overlay di ricerca.

Per gli smoke test installa Chromium con `npx playwright install chromium`.
L'audit a11y usa invece `PW_CHROME` per selezionare l'eseguibile (il default
è `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`); `BASE` cambia l'URL
del preview, il cui default è `http://localhost:4173`:

```bash
PW_CHROME=/percorso/al/chromium npm run audit:a11y
```

**Limite attuale dell'audit:** le violazioni e gli errori degli scenari sono
stampati senza impostare un exit code di errore, e vari click falliti vengono
ignorati. Leggi il report e verifica che gli stati attesi siano stati aperti;
un exit code 0 non costituisce un gate affidabile né una certificazione WCAG.

---

## ✦ Motore social interno

`tools/social-engine/` riusa i dataset e gli helper del sito per generare video
verticali con **Remotion**. Non aggiunge rotte o endpoint al sito e non viene
importato dal bundle pubblico. I formati implementati sono **Character
Journey**, **Guess Character** e **Character Versus**; `guess-location` e
`journey-comparison` sono dichiarati per sviluppi futuri.

La pipeline segue questo flusso:

```text
dataset → catalogo + piano editoriale → JSON in content/queue/
        → validazione e controllo duplicati → rendering MP4 + manifest
        → storico e artifact GitHub → pubblicazione esterna
        → ricevute di pubblicazione / metriche → storico, catalogo e nuovo piano
```

Il growth engine è l'**unica fonte della selezione**: l'automazione
giornaliera non sceglie mai un formato (niente "oggi un Character Journey"),
esegue `catalog/next.json`. Il selettore rispetta le regole rigide (massimo 2
contenuti consecutivi dello stesso anime, mai lo stesso personaggio due volte
di fila, parti in ordine con spaziatura), pubblica prima i video già
renderizzati e mai pubblicati (backlog) e spiega ogni scelta con una
`SelectionTrace`; le metriche, quando disponibili, ordinano solo i candidati
validi (senza metriche: cold start). La pubblicazione è affidata a un agente esterno tramite
Metricool: il repository valida e applica le ricevute, **non chiama le API
dei social per pubblicare**. Il codice non chiama modelli AI.

```bash
npm run social:validate              # typecheck + test di engine, pipeline, segmenti, pubblicazione e growth
npm run social:catalog               # rigenera catalogo, performance e piano editoriale dai dati/storico
npm run social:agent -- --dry-run    # ciclo giornaliero in 12 step sullo stato reale, non scrive nulla
npm run social:next                  # prossimo contenuto nel piano editoriale + spiegazione (trace)
npm run social:queue -- --from proposta.json
npm run social:validate:queue        # valida la coda senza renderizzare
npm run social:editorial:check        # controlla le regole editoriali della coda
npm run social:editorial:check:selection # + il contenuto in coda deve essere la selezione del growth engine
npm run social:render:queue:dry      # pianifica senza modificare lo stato
npm run social:render:queue          # rendering della coda + manifest + storico
npm run social:retry:failed          # riprova i contenuti falliti
npm run social:studio               # anteprima locale dei template Remotion
npm run social:publication:validate # valida le ricevute di pubblicazione
npm run social:publication:apply:dry # mostra le transizioni senza applicarle
npm run social:analytics:validate   # valida gli snapshot delle metriche
npm run social:performance          # report dei punteggi per contenuto/piattaforma
```

I test della pipeline usano anche renderer simulati; il rendering effettivo
richiede Chromium. Video, cache e audio locali sono ignorati da Git; coda,
storico, catalogo, ricevute e snapshot applicati sono versionati.

Documentazione di riferimento:

- [`docs/SOCIAL_ENGINE.md`](docs/SOCIAL_ENGINE.md): motore, rendering locale/cloud e growth.
- [`docs/SOCIAL_AGENT_CONTRACT.md`](docs/SOCIAL_AGENT_CONTRACT.md): richieste del Content Agent.
- [`docs/SOCIAL_PUBLISHING_CONTRACT.md`](docs/SOCIAL_PUBLISHING_CONTRACT.md): pubblicazione esterna e ricevute.
- [`docs/SOCIAL_ANALYTICS_CONTRACT.md`](docs/SOCIAL_ANALYTICS_CONTRACT.md): snapshot delle metriche.

---

## ✦ Workflow GitHub e verifiche

I quattro workflow versionati in `.github/workflows/` gestiscono il motore social:

| Workflow | Quando parte | Responsabilità |
| -------- | ------------ | -------------- |
| `social-validate.yml` | PR che toccano engine/coda, workflow social o dipendenze | Validazione coda, regole editoriali + selezione del growth engine, dry run e test |
| `social-render.yml` | Push su `main` della coda o avvio manuale | Rendering, artifact e commit dello stato |
| `social-publication-validate.yml` | PR con ricevute/snapshot in `pending/` | Controllo dello scope, validazione e test |
| `social-publication-state.yml` | Push su `main` di ricevute/snapshot o avvio manuale | Applicazione e commit dello stato aggiornato |

Le PR social vengono validate con token in sola lettura e senza secrets;
i job che persistono lo stato hanno permesso di scrittura. Rendering e
applicazione delle ricevute hanno gruppi di concorrenza dedicati e protezioni
contro i cicli di commit automatici.

Non è presente un workflow generale del sito nel repository: i controlli
elencati in **Comandi** vanno eseguiti localmente o configurati nel servizio
CI/deploy. `npm run build` include TypeScript dell'app e di Vite, test SEO,
audit delle lingue pubblicate, build client/SSR, pre-rendering e controllo
dell'HTML generato; `validate:data`, `validate:i18n`, smoke e test social sono
comandi separati. Le impostazioni remote e le regole di protezione del branch
non sono definite da questo README.

---

## ✦ Copyright & dati narrativi

- I dati narrativi sono **seed iniziali**: vanno verificati su fonti ufficiali
  prima della pubblicazione.
- I riferimenti a capitoli/episodi non confermati restano
  `referenceStatus: 'needs_verification'` (e in UI compaiono con un avviso);
  i contenuti non-canon usano il `canonStatus` corrispondente.
- **Nessuna immagine ufficiale** è inclusa nel repository: ogni asset deve avere
  `license`, `author`, `source`, `url` documentati nel rispettivo `assets.ts`.

---

## ✦ Deploy

App React/Vite pre-renderizzata con output `dist/`, deployata su **Vercel**
(Analytics + Speed Insights integrati in `src/App.tsx`, montati solo dopo il
consenso). Preset "Vite", comando `npm run build` (che
esegue anche il pre-rendering SEO), output `dist/`. **Nessun rewrite SPA**: ogni
pagina esiste come file statico e i path sconosciuti ricevono `404.html` con
status 404 (niente soft-404). Redirect e header sono in `vercel.json`.

Le variabili pubbliche opzionali sono descritte in `.env.example`:
`VITE_WEB3FORMS_ACCESS_KEY` per il modulo segnalazioni e `VITE_PAYPAL_URL` per
il link di supporto. In locale possono vivere in `.env.local`; in produzione
vanno configurate su Vercel prima della build. Ogni variabile `VITE_*` usata
dal client è incorporata nel bundle pubblico, quindi non deve contenere secrets.

---

## ✦ Licenza

Codice del progetto: MIT. Contenuti narrativi e asset di terzi restano di
proprietà dei rispettivi titolari.
