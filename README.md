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
Speed Insights per la telemetria. Nessun backend, nessun database remoto —
**tutti i dati vivono in file TypeScript locali** sotto `src/data/`.

Lo scheletro dell'app è **interamente dataset-driven e dinamico per mondo**:
aggiungere un'opera significa creare un dataset + una config, senza toccare i
componenti.

---

## ✦ Mondi inclusi

| Mondo            | Slug            | Stato         | Sistema di poteri   |
| ---------------- | --------------- | ------------- | ------------------- |
| Naruto           | `naruto`        | ✓ Disponibile | Jutsu               |
| Hunter x Hunter  | `hunterxhunter` | ✓ Disponibile | Nen                 |
| One Piece        | `onepiece`      | ✓ Disponibile | Frutti del Diavolo  |
| Dragon Ball      | `dragonball`    | ✓ Disponibile | Tecniche            |
| Attack on Titan  | `attackontitan` | Coming soon   | Abilità             |

### Dataset attuali

| Entità             | Naruto | Hunter x Hunter | One Piece | Dragon Ball |
| ------------------ | -----: | --------------: | --------: | ----------: |
| Personaggi         |    250 |             156 |       417 |          75 |
| Clan & fazioni     |     57 |              20 |        83 |          21 |
| Team               |     14 |               0 |         0 |           0 |
| Tecniche           |    153 |              73 |       125 |          23 |
| Archi narrativi    |     32 |               8 |        31 |          36 |
| Eventi timeline    |    118 |             103 |       202 |          90 |
| Percorsi           |     41 |              16 |        22 |           9 |
| Luoghi             |    108 |              60 |       331 |          81 |
| Nazioni            |     27 |              17 |         8 |           6 |
| Confini (boundary) |     26 |              12 |         0 |           0 |
| Livelli mappa      |     10 |               5 |        10 |           4 |

**Livelli mappa** = world map + sotto-mappe drill-down:

- **Naruto** — Konoha, Suna, Kiri, Iwa, Kumo, Ame, Oto, Uzushio, Taki.
- **Hunter x Hunter** — Heavens Arena, Zoldyck Estate, Greed Island, East
  Gorteau Palace.
- **One Piece** — Totland, Alabasta, Wano, Skypiea, Dressrosa, Sabaody,
  Marineford, Egghead, Fishman Island.
- **Dragon Ball** — Terra (world map), Universo, Namecc, Spazio (GT).

**Lingue UI:** italiano (default) e inglese — selezionabili dall'interfaccia.

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
- **Accessibilità WCAG 2.2 AA** — pattern WAI-ARIA (tab, disclosure, combobox,
  switch), focus trap/restore, `inert`; verifica con `npm run audit:a11y`
  (axe-core).

---

## ✦ Comandi

```bash
npm install                 # installa le dipendenze

npm run dev                 # dev server (Vite) → http://localhost:5173
npm run build               # produzione: tsc -b + vite build + prerender (SEO)
npm run prerender           # inietta meta/OG/JSON-LD per rotta + sitemap.xml
npm run preview             # anteprima del bundle di produzione

npm run validate:data       # valida TUTTI i dataset (ref rotti, coords, duplicati) — exit 1 se errori
npm run validate:i18n       # chiavi di traduzione mancanti/vuote tra it.ts ed en.ts
npm run audit:a11y          # audit axe-core WCAG 2.2 AA (avvia prima `npm run preview`)

npm run extract:boundaries  # rigenera i path SVG dei confini Naruto dalla PNG
npm run find:dots           # rileva i marker rossi dei villaggi nella PNG → coordinate flow
npm run optimize:images     # ottimizza le immagini degli asset
```

> **Gate di correttezza:** `npx tsc -b` (incluso in `npm run build`) deve dare
> zero errori. **Gate dati:** `npm run validate:data` deve dare zero errori
> ogni volta che si tocca `src/data/`; **i18n:** `npm run validate:i18n` deve
> restare a zero quando si cambiano le stringhe UI.

`npm run lint` (`eslint .`) **non** è configurato — non farci affidamento.

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

| Path                       | Descrizione                                       |
| -------------------------- | ------------------------------------------------- |
| `/`                        | Homepage con la griglia dei mondi                 |
| `/about`                   | Informazioni sul progetto                         |
| `/worlds/:slug`            | Mappa interattiva del mondo                       |
| `/worlds/:slug/characters` | Archivio personaggi (filtri + gradi dinamici)     |
| `/worlds/:slug/clans`      | Archivio clan & fazioni (tipi derivati dai dati)  |
| `/worlds/:slug/jutsu`      | Archivio tecniche (termine/categorie per-mondo)   |
| `/worlds/:slug/arcs`       | Archivio archi narrativi                          |

Le modali di dettaglio sono **deep-linkabili** (es. `?location=<id>`): l'URL
riflette la scheda aperta ed è condivisibile. I mondi con
`status: 'coming_soon'` aprono automaticamente una pagina segnaposto
(`ComingSoonWorldPage`) senza routing manuale.

---

## ✦ Albero cartelle (sorgenti principali)

```
src/
├── types/index.ts              ← tipi generici: WorldDataset, AnimeWorld,
│                                 WorldConfig, Location, Character, Faction, Jutsu…
├── data/
│   ├── worlds.ts               ← registro animeWorlds (status, theme, config)
│   ├── registry.ts             ← worldDatasets map, getWorldDataset(slug)
│   ├── naruto/                 ← dataset Naruto (jutsu, clan+factions, teams, …)
│   ├── hunterxhunter/          ← dataset HxH (nen, 4 sotto-mappe)
│   ├── onepiece/               ← dataset One Piece (frutti, 9 sotto-mappe)
│   └── dragonball/             ← dataset Dragon Ball (tecniche, Terra/Universo/Namecc/GT)
│       └── …                     ogni cartella: index.ts + assets, mapLevels,
│                                 mapConstants, nations, boundaries, locations,
│                                 characters*, factions/clans, arcs, events, routes…
├── store/                      ← Zustand: useWorldStore, useMapStore,
│                                 useUiStore, useLocaleStore
├── i18n/{index.ts, resources/{it,en}.ts}   ← init i18next (default IT) + stringhe UI
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
    └── modals/                 ← ModalRoot + modali dettaglio per ogni entità
```

---

## ✦ Sistema di coordinate mappa

Ogni mondo ha il **proprio piano viewBox**, pari a `MapLevel.width/height` del
suo world map. I dati di posizione (location `x/y`, boundary `svgPathD`,
`labelPosition`) vivono in quel piano.

| Mondo           | Costante                    | viewBox         |
| --------------- | --------------------------- | --------------- |
| Naruto          | `NARUTO_MAP_VIEWBOX`        | 1500 × 882.2204 |
| Hunter x Hunter | `HXH_MAP_VIEWBOX`           | 2000 × 1187     |
| One Piece       | `ONEPIECE_MAP_VIEWBOX`      | 2000 × 1000     |
| Dragon Ball     | `DRAGONBALL_MAP_VIEWBOX`    | 1785 × 1261     |

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

Le stringhe **dati** usano `Localizable = string | { it: string; en: string }`.
Risolvile **sempre** con `getLocalizedText(value, locale)` /
`getEntityDisplayName(...)` (`src/utils/localization.ts`) — mai mettere un
oggetto `Localizable` direttamente in JSX (darebbe `[object Object]` e non
compila). **ID, slug e chiavi non si traducono mai.**

Le stringhe **UI** vivono in `src/i18n/resources/{it,en}.ts` (tieni le chiavi
allineate tra i due file). Default italiano; persistenza in `localStorage` con
chiave `animeInteractiveMaps.locale`.

---

## ✦ Aggiungere un nuovo anime / manga

1. **Registra il mondo** in `src/data/worlds.ts` con `status`, `theme` e la
   `config` per-mondo (termine del sistema di poteri, gradi, ruoli, vetrine…):

   ```ts
   {
     id: 'world-onepiece', slug: 'onepiece', title: 'One Piece',
     status: 'available',
     theme: { primary: '#…', accent: '#…', highlight: '#…' },
     defaultMapLevelId: 'onepiece-map-world',
     availableMapLevelIds: ['onepiece-map-world', /* sotto-mappe… */],
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

3. **Registra il dataset** in `src/data/registry.ts` (import + voce nella mappa
   `worldDatasets`).

4. **Valida:** `npx tsc -b` e `npm run validate:data` (0 errori prima di
   qualunque merge).

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

**Logo del mondo** (card homepage) — `src/assets/worlds/logos/<slug>.png`.

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

SPA Vite con output `dist/`, deployata su **Vercel** (Analytics + Speed Insights
già integrati in `src/App.tsx`). Preset "Vite", comando `npm run build` (che
esegue anche il prerender SEO), output `dist/`. Per il routing SPA, rewrite di
tutte le rotte su `/index.html`.

---

## ✦ Licenza

Codice del progetto: MIT. Contenuti narrativi e asset di terzi restano di
proprietà dei rispettivi titolari.
