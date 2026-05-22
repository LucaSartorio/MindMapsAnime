# Anime Interactive Maps

Piattaforma frontend generica per **mappe interattive di anime e manga**.
Per ogni opera puoi esplorare mondo, nazioni, villaggi, luoghi simbolo,
personaggi, clan & fazioni, jutsu/tecniche, archi narrativi, eventi della
timeline e percorsi dei protagonisti.

**Stack:** React 18 + TypeScript (strict) + Vite + Zustand + React Flow
(`@xyflow/react`) + Tailwind CSS + React Router.
Nessun backend, nessun database remoto — tutti i dati vivono in file
TypeScript locali sotto `src/data/`.

---

## ✦ Mondi inclusi

| Mondo           | Slug            | Stato         |
| --------------- | --------------- | ------------- |
| Naruto          | `naruto`        | ✓ Disponibile |
| Hunter x Hunter | `hunterxhunter` | Coming soon   |

### Dataset Naruto (stato attuale)

| Entità        | Quantità |
| ------------- | -------- |
| Personaggi    | 131      |
| Clan & fazioni | 51      |
| Team          | 10       |
| Jutsu         | 101      |
| Archi narrativi | 23     |
| Eventi timeline | 111    |
| Percorsi      | 41       |
| Luoghi        | 88       |
| Nazioni       | 26       |
| Confini (boundaries) | 26 |
| Livelli mappa | 10       |

**Livelli mappa:** mondo (Nazioni Elementali) + 9 sotto-mappe:
Konohagakure, Sunagakure, Kirigakure, Iwagakure, Kumogakure, Amegakure,
Otogakure, Uzushiogakure, Takigakure.

**Lingue UI:** italiano (default) e inglese — selezionabile dall'interfaccia.

---

## ✦ Comandi

```bash
# installa le dipendenze
npm install

# avvia il dev server (Vite) → http://localhost:5173
npm run dev

# build di produzione  (tsc -b + vite build)
npm run build

# anteprima del bundle produzione
npm run preview

# valida l'integrità del dataset (ref, coords, duplicati) — exit 1 se errori
npm run validate:data

# controlla le chiavi di traduzione mancanti tra en.ts e it.ts
npm run validate:i18n

# rigenera i path SVG dei confini nazionali dalla PNG di mappa
npm run extract:boundaries

# rileva i puntini rossi (marker villaggi) nella PNG e restituisce le coordinate
npm run find:dots
```

> `npm run build` esegue `tsc -b` come gate di correttezza: zero errori TypeScript
> sono richiesti prima del deploy. `npm run validate:data` è il gate dati.

Gli script sotto `scripts/` girano con `tsx --tsconfig scripts/tsconfig.json`
perché importano `src/` tramite l'alias `@/`.

---

## ✦ Rotte applicazione

| Path                           | Descrizione                                |
| ------------------------------ | ------------------------------------------ |
| `/`                            | Homepage con la griglia dei mondi          |
| `/about`                       | Informazioni sul progetto                  |
| `/worlds/:slug`                | Mappa interattiva del mondo                |
| `/worlds/:slug/characters`     | Archivio personaggi (filtri + gradi ninja) |
| `/worlds/:slug/clans`          | Archivio clan & fazioni                    |
| `/worlds/:slug/jutsu`          | Archivio jutsu                             |
| `/worlds/:slug/arcs`           | Archivio archi narrativi                   |
| `/worlds/:slug/sources`        | Fonti, asset e note editoriali             |

I mondi con `status: 'coming_soon'` aprono automaticamente una pagina segnaposto
senza necessità di routing manuale.

---

## ✦ Albero cartelle (sorgenti principali)

```
src/
├── types/index.ts              ← tipi generici: WorldDataset, Location,
│                                 Character, Faction, Jutsu, NinjaRank, …
├── data/
│   ├── worlds.ts               ← registro animeWorlds (status, theme, slug)
│   ├── registry.ts             ← worldDatasets map, getWorldDataset(slug)
│   ├── hunterxhunter/index.ts  ← placeholder coming soon
│   └── naruto/
│       ├── index.ts            ← narutoDataset: WorldDataset (assembly)
│       ├── assets.ts           ← AssetReference con license/author/url
│       ├── mapLevels.ts        ← 10 livelli mappa
│       ├── mapConstants.ts     ← NARUTO_MAP_VIEWBOX (1500 × 882.2)
│       ├── nations.ts          ← 26 nazioni
│       ├── boundaries.ts       ← 26 confini SVG con localizedName IT/EN
│       ├── locations.ts        ← 88 luoghi con coordinate e cross-ref
│       ├── characters.ts       ← 90 personaggi principali + ninjaRank
│       ├── charactersExtra.ts  ← 41 personaggi secondari + ninjaRank
│       ├── clans.ts            ← clan principali
│       ├── factions.ts         ← fazioni principali (Akatsuki, ANBU, …)
│       ├── factionsExtra.ts    ← clan/fazioni secondarie
│       ├── jutsu.ts            ← 101 jutsu con chakraNature/handSeals
│       ├── arcs.ts             ← 23 archi con localizedName IT/EN
│       ├── events.ts           ← 111 eventi timeline
│       ├── routes.ts           ← percorsi narrativi (es. Team 7)
│       ├── characterRoutes.ts  ← percorsi dei singoli personaggi
│       ├── teams.ts            ← 10 team
│       ├── relations.ts        ← relazioni inter-personaggio
│       └── dataQuality.ts      ← note editoriali e TODO dati
├── store/
│   ├── useWorldStore.ts        ← mondo attivo
│   ├── useMapStore.ts          ← livello mappa, selezioni, filtri, viewport
│   ├── useUiStore.ts           ← modal attivo, pannelli
│   └── useLocaleStore.ts       ← locale (it | en), persistenza localStorage
├── i18n/
│   ├── index.ts                ← inizializzazione i18next
│   └── resources/
│       ├── it.ts               ← stringhe UI italiano (default)
│       └── en.ts               ← stringhe UI inglese
├── lib/
│   ├── cn.ts                   ← classnames helper
│   ├── entities.ts             ← findCharacter, findLocation, findJutsu, …
│   ├── search.ts               ← ricerca globale con ranking
│   └── filters.ts              ← funzioni pure di filtraggio mappa
├── utils/
│   ├── localization.ts         ← getLocalizedText, getNinjaRankLabel, …
│   ├── buildIndexes.ts         ← Map<id, entity> per lookup O(1)
│   └── validateDataset.ts      ← logica di validazione (usata dallo script)
├── routes/
│   ├── AppRouter.tsx
│   └── WorldRoute.tsx          ← risolve dataset per :worldSlug, lazy-load pagine
└── components/
    ├── common/                 ← Badge, Button, Card, Modal, Drawer,
    │                             EmptyState, StatusPill, SourceNotice
    ├── home/                   ← HomePage, WorldGrid, WorldCard
    ├── layout/                 ← AppShell, TopNav, WorldLayout
    ├── map/                    ← InteractiveWorldMap, MapNode, MapEdge,
    │                             MapLabelsLayer, MapBoundaryOverlay,
    │                             MapControls, MapLegendFloating,
    │                             MapLevelSwitcher, RoutesFloatingPanel,
    │                             WorldMapBackground
    ├── timeline/               ← TimelineBottomSheet, TimelineEventCard,
    │                             TimelineFilters
    ├── search/                 ← GlobalSearchDropdown
    ├── drawers/                ← FiltersDrawer
    ├── archive/                ← CharactersPage, CharacterCard,
    │                             ClansAndFactionsPage, ClanFactionCard,
    │                             JutsuPage, JutsuCard,
    │                             StoryArcsPage, StoryArcCard
    └── modals/                 ← ModalRoot, CharacterDetailsModal,
                                  FactionDetailsModal, JutsuDetailsModal,
                                  LocationDetailsModal, NationDetailsModal,
                                  BoundaryDetailsModal, RouteDetailsModal,
                                  StoryArcDetailsModal,
                                  TimelineEventDetailsModal
```

---

## ✦ Sistema di coordinate mappa

I dati di posizione (location `x/y`, boundary `svgPathD`, `labelPosition`)
vivono nel piano **viewBox 1500 × 882.2204** (`NARUTO_MAP_VIEWBOX` in
`src/data/naruto/mapConstants.ts`). La PNG di riferimento è **990 × 579 px**.

Conversione pixel PNG → coordinate flow:

```
flowX = px_x / 990 * 1500
flowY = px_y / 579 * 882.2204
```

Gli script `find:dots` ed `extract:boundaries` emettono coordinate già
convertite in questo piano — incollale direttamente nei file dati.
Le sotto-mappe hanno width/height propri definiti nel rispettivo `MapLevel`.

---

## ✦ Tipo `Localizable` e i18n

Le stringhe dati usano il tipo `Localizable = string | { it: string; en: string }`.
Risolvile **sempre** tramite `getLocalizedText(value, locale)` (in
`src/utils/localization.ts`) — mai inserire un oggetto `Localizable`
direttamente in JSX (darebbe `[object Object]`).

Le stringhe UI vivono in `src/i18n/resources/{it,en}.ts`. La lingua di default
è l'italiano; la persistenza usa la chiave localStorage
`animeInteractiveMaps.locale`.

---

## ✦ Aggiungere un nuovo anime / manga

1. **Registra il mondo** in `src/data/worlds.ts`:

   ```ts
   {
     id: 'world-onepiece',
     slug: 'onepiece',
     title: 'One Piece',
     status: 'available',
     theme: { primary: '#...', accent: '#...', highlight: '#...' },
     availableMapLevelIds: ['onepiece-map-world'],
     defaultMapLevelId: 'onepiece-map-world',
   }
   ```

2. **Crea la cartella dataset** `src/data/onepiece/` con:
   `assets.ts`, `mapLevels.ts`, `mapConstants.ts`, `nations.ts`,
   `boundaries.ts`, `locations.ts`, `characters.ts`, `clans.ts`,
   `factions.ts`, `jutsu.ts`, `arcs.ts`, `events.ts`, `routes.ts`,
   `characterRoutes.ts`, `teams.ts` — e `index.ts` che esporta
   `onepieceDataset: WorldDataset`.

3. **Registra il dataset** in `src/data/registry.ts`:

   ```ts
   import { onepieceDataset } from '@/data/onepiece';

   export const worldDatasets = {
     naruto: narutoDataset,
     onepiece: onepieceDataset,
   };
   ```

4. **Valida:** `npm run validate:data` (0 errori richiesti prima di qualunque
   merge).

Mappa, filtri, timeline, archivi, ricerca globale e modal si adattano
automaticamente al nuovo dataset.

---

## ✦ Sostituire i placeholder mappa

1. Salva l'immagine autorizzata in `public/assets/worlds/<slug>/map.jpg`.
2. Aggiungi un `AssetReference` in `src/data/<slug>/assets.ts` con i campi
   obbligatori `license`, `author`, `source`, `url`.
3. Imposta `backgroundAssetId` nel `MapLevel` corrispondente.

`WorldMapBackground` mostra l'immagine se `asset.url` è valorizzato,
altrimenti usa il placeholder SVG generato localmente.

---

## ✦ Copyright & dati narrativi

- I dati narrativi sono **seed iniziali**: vanno verificati su fonti ufficiali
  prima della pubblicazione.
- I riferimenti a capitoli/episodi non ancora confermati restano marcati
  `referenceStatus: 'needs_verification'` e mostrati in UI con un avviso.
- **Nessuna immagine ufficiale** è inclusa nel repository. Ogni asset deve avere
  `license`, `author`, `source` e `url` documentati nel rispettivo `assets.ts`.

---

## ✦ TODO aperti (Naruto)

- [ ] Confermare numeri di capitolo/episodio sugli eventi (molti ancora vuoti).
- [ ] Verificare le posizioni esatte sulla mappa per luoghi secondari e confini.
- [ ] Tradurre in bilingue i testi `shortDescription`/`longDescription` ancora
      in singola lingua italiana (rotte, eventi, location minori).
- [ ] Sostituire i placeholder SVG con asset autorizzati.
- [ ] Aggiungere sotto-mappe mancanti (es. Valle della Fine, Monte Myoboku).

---

## ✦ Deploy

Compatibile con Vercel e Netlify (SPA su Vite, output `dist/`).

**Vercel** — preset "Vite", comando `npm run build`, output `dist/`.
Aggiungi `vercel.json` per il rewrite SPA:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**Netlify** — comando `npm run build`, publish `dist/`.
Aggiungi `public/_redirects`:
```
/*  /index.html  200
```

---

## ✦ Licenza

Codice del progetto: MIT. Contenuti narrativi e asset di terzi restano di
proprietà dei rispettivi titolari.
