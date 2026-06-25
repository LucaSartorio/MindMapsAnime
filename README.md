# Mappe Interattive

Piattaforma frontend generica per **mappe interattive di mondi narrativi**
(anime, manga e oltre). Per ogni opera puoi esplorare mondo, nazioni, regioni,
villaggi/luoghi simbolo, personaggi, clan & fazioni, sistema di poteri
(jutsu / nen / frutti del diavolo / tecniche…), archi narrativi, eventi della
timeline e percorsi dei protagonisti.

**Stack:** React 18 + TypeScript (strict) + Vite + Zustand + React Flow
(`@xyflow/react`) + Tailwind CSS + React Router. Vercel Analytics + Speed
Insights per la telemetria. Nessun backend, nessun database remoto — **tutti i
dati vivono in file TypeScript locali** sotto `src/data/`.

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
| Dragon Ball      | `dragonball`    | Coming soon   | Tecniche            |
| Attack on Titan  | `attackontitan` | Coming soon   | Abilità             |

### Dataset attuali

| Entità            | Naruto | Hunter x Hunter | One Piece |
| ----------------- | -----: | --------------: | --------: |
| Personaggi        |    206 |             120 |       367 |
| Clan & fazioni    |     54 |              10 |        44 |
| Team              |     12 |               0 |         0 |
| Tecniche (jutsu)  |    134 |              60 |       117 |
| Archi narrativi   |     32 |               8 |        31 |
| Eventi timeline   |    118 |              93 |       185 |
| Percorsi          |     41 |              16 |        22 |
| Luoghi            |     99 |              43 |       320 |
| Nazioni           |     26 |              14 |         8 |
| Confini (boundary)|     26 |              12 |         0 |
| Livelli mappa     |     10 |               5 |        10 |

**Livelli mappa** = world map + sotto-mappe drill-down:

- **Naruto** — Konoha, Suna, Kiri, Iwa, Kumo, Ame, Oto, Uzushio, Taki.
- **Hunter x Hunter** — Heavens Arena, Zoldyck Estate, Greed Island, East
  Gorteau Palace.
- **One Piece** — Totland, Alabasta, Wano, Skypiea, Dressrosa, Sabaody,
  Marineford, Egghead, Fishman Island.

**Lingue UI:** italiano (default) e inglese — selezionabili dall'interfaccia.

---

## ✦ Comandi

```bash
npm install                 # installa le dipendenze

npm run dev                 # dev server (Vite) → http://localhost:5173
npm run build               # build di produzione: tsc -b + vite build
npm run preview             # anteprima del bundle di produzione

npm run validate:data       # valida TUTTI i dataset (ref rotti, coords, duplicati) — exit 1 se errori
npm run validate:i18n       # chiavi di traduzione mancanti/vuote tra it.ts ed en.ts
npm run extract:boundaries  # rigenera i path SVG dei confini Naruto dalla PNG
npm run find:dots           # rileva i marker rossi dei villaggi nella PNG → coordinate flow
```

> **Gate di correttezza:** `npx tsc -b` (incluso in `npm run build`) deve dare
> zero errori. **Gate dati:** `npm run validate:data` deve dare zero errori
> ogni volta che si tocca `src/data/`.

`npm run lint` (`eslint .`) **non** è configurato — non farci affidamento.

Gli script sotto `scripts/` girano con `tsx --tsconfig scripts/tsconfig.json`
perché importano `src/` tramite l'alias `@/`. Oltre ai 4 esposti come npm
script, `scripts/` contiene tooling per-mondo (estrazione confini HxH, overlay e
snap dei pin One Piece, ottimizzazione mappa HxH).

---

## ✦ Sistema dinamico per-mondo (`WorldConfig`)

Tutte le "voci" che cambiano da un'opera all'altra sono centralizzate in
`AnimeWorld.config` (tipo `WorldConfig` in `src/types/index.ts`), risolte dagli
helper di `src/lib/worldConfig.ts`. La UI non hardcoda mai termini di un'opera:
passa `dataset.world` e ottiene etichette già localizzate.

| Config                 | A cosa serve                                              | Esempio                                   |
| ---------------------- | --------------------------------------------------------- | ----------------------------------------- |
| `ability.term`         | Nome del sistema di poteri (nav, modali, archivio)        | Jutsu · Nen · Frutti del Diavolo          |
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

I mondi con `status: 'coming_soon'` aprono automaticamente una pagina segnaposto
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
│   └── onepiece/               ← dataset One Piece (frutti, 9 sotto-mappe)
│       └── …                     ogni cartella: index.ts + assets, mapLevels,
│                                 mapConstants, nations, boundaries, locations,
│                                 characters*, factions/clans, arcs, events,
│                                 routes, …
├── store/                      ← Zustand: useWorldStore, useMapStore,
│                                 useUiStore, useLocaleStore
├── i18n/
│   ├── index.ts                ← init i18next (default IT, key localStorage)
│   └── resources/{it,en}.ts    ← stringhe UI
├── lib/
│   ├── cn.ts                   ← classnames helper
│   ├── entities.ts             ← findCharacter/Location/Jutsu/… per id
│   ├── search.ts               ← ricerca globale con ranking
│   ├── filters.ts              ← funzioni pure di filtraggio (+ cache WeakMap)
│   ├── series.ts               ← blocchi narrativi Naruto (Parte 1/Shippuden/…)
│   ├── worldConfig.ts          ← risoluzione config per-mondo (termini, label)
│   ├── locationTypes.ts        ← icone + ordine tipi di luogo (pin/filtri/legenda)
│   └── worldMapPrefs.ts        ← preferenze di resa mappa per-mondo (overlay confini)
├── utils/
│   ├── localization.ts         ← getLocalizedText + label enum localizzate
│   ├── entityImage.ts          ← placeholder SVG + drop-in immagini (tutti i mondi)
│   ├── worldCursor.ts          ← cursore tematico per-mondo
│   ├── buildIndexes.ts         ← Map<id, entity> per lookup O(1)
│   └── validateDataset.ts      ← logica di validazione (usata dallo script)
├── routes/                     ← AppRouter, WorldRoute (lazy-load pagine)
└── components/
    ├── common/                 ← Badge, Button, Card, Modal, Drawer, EntityImage…
    ├── home/ · layout/         ← HomePage/WorldGrid · AppShell/TopNav/WorldLayout
    ├── map/                    ← InteractiveWorldMap, MapNode, MapBoundaryOverlay,
    │                             MapLegendFloating, MapLevelSwitcher, …
    ├── timeline/ · search/ · drawers/   ← timeline · ricerca · FiltersDrawer
    ├── archive/                ← CharactersPage, ClansAndFactionsPage, JutsuPage,
    │                             StoryArcsPage (+ relative Card)
    └── modals/                 ← ModalRoot + modali dettaglio per ogni entità
```

---

## ✦ Sistema di coordinate mappa

Ogni mondo ha il **proprio piano viewBox**, pari a `MapLevel.width/height` del
suo world map. I dati di posizione (location `x/y`, boundary `svgPathD`,
`labelPosition`) vivono in quel piano.

| Mondo           | Costante                    | viewBox        |
| --------------- | --------------------------- | -------------- |
| Naruto          | `NARUTO_MAP_VIEWBOX`        | 1500 × 882.2204 |
| Hunter x Hunter | `HXH_MAP_VIEWBOX`           | 2000 × 1187    |
| One Piece       | `ONEPIECE_MAP_VIEWBOX`      | 2000 × 1000    |

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

Le stringhe **UI** vivono in `src/i18n/resources/{it,en}.ts`. Default italiano;
persistenza in `localStorage` con chiave `animeInteractiveMaps.locale`.

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

4. **Valida:** `npm run validate:data` (0 errori prima di qualunque merge).

Mappa, filtri, legenda, timeline, archivi, ricerca globale e modali si adattano
automaticamente al nuovo dataset e alla sua config.

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
già integrati in `src/App.tsx`). Preset "Vite", comando `npm run build`, output
`dist/`. Per il routing SPA, rewrite di tutte le rotte su `/index.html`.

---

## ✦ Licenza

Codice del progetto: MIT. Contenuti narrativi e asset di terzi restano di
proprietà dei rispettivi titolari.
