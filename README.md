# Anime Interactive Maps

Piattaforma frontend generica dedicata alle **mappe interattive di anime e
manga**. Per ogni opera supportata puoi esplorare mondo, nazioni, villaggi,
luoghi simbolo, personaggi, archi narrativi, eventi e percorsi dei protagonisti.

**Stack:** React + TypeScript + Vite + Zustand + React Flow + Tailwind CSS +
React Router. Nessun backend, nessun database remoto. Tutti i dati vivono in
file TypeScript locali e il sito è pronto al deploy su Vercel/Netlify.

---

## ✦ Mondi inclusi

| Mondo            | Slug              | Stato         |
| ---------------- | ----------------- | ------------- |
| Naruto           | `naruto`          | ✓ Disponibile |
| Hunter x Hunter  | `hunterxhunter`   | Coming soon   |

Il mondo Naruto include: 28 luoghi (world + sotto-mappa Konoha), 20 personaggi,
12 clan + 3 fazioni, 14 archi, 30+ eventi timeline, 8 percorsi, 5 nazioni, 2
livelli mappa.

---

## ✦ Comandi

```bash
# installa le dipendenze
npm install

# avvia il dev server (Vite)
npm run dev
# → http://localhost:5173/

# build di produzione (tsc + vite build)
npm run build

# anteprima del bundle buildato
npm run preview
```

---

## ✦ Albero cartelle

```
.
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.node.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   ├── favicon.svg
│   └── assets/worlds/naruto/       ← assets autorizzati locali (vuota)
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── styles/globals.css
    ├── types/
    │   └── index.ts                ← tipi generici WorldDataset, Location, ...
    ├── data/
    │   ├── worlds.ts               ← registro animeWorlds
    │   ├── registry.ts             ← risolve dataset per slug
    │   ├── hunterxhunter/index.ts  ← placeholder coming soon
    │   └── naruto/
    │       ├── index.ts            ← narutoDataset
    │       ├── assets.ts
    │       ├── mapLevels.ts        ← world + konoha
    │       ├── nations.ts
    │       ├── locations.ts        ← 28 luoghi
    │       ├── characters.ts       ← 20 personaggi
    │       ├── clans.ts            ← 12 clan
    │       ├── factions.ts         ← Akatsuki, Allied Shinobi, ANBU
    │       ├── arcs.ts             ← 14 archi narrativi
    │       ├── events.ts           ← 30+ eventi timeline
    │       └── routes.ts           ← 8 percorsi
    ├── store/
    │   ├── index.ts
    │   ├── useWorldStore.ts        ← mondo attivo
    │   ├── useMapStore.ts          ← selezioni, filtri, viewport reset
    │   ├── useUiStore.ts           ← pannelli aperti/chiusi
    │   └── useSearchStore.ts
    ├── lib/
    │   ├── cn.ts
    │   ├── search.ts               ← ricerca con ranking
    │   └── filters.ts              ← funzioni pure di filtraggio
    ├── routes/
    │   ├── AppRouter.tsx
    │   └── WorldRoute.tsx          ← risolve dataset per :worldSlug
    ├── pages/
    │   ├── AboutPage.tsx
    │   ├── ComingSoonWorldPage.tsx
    │   ├── NotFoundPage.tsx
    │   ├── SourcesPage.tsx
    │   └── WorldMapPage.tsx
    └── components/
        ├── common/                 ← Badge, Button, Card, Drawer, Modal,
        │                             EmptyState, SourceNotice, StatusPill
        ├── home/                   ← HomePage, HeroSection, WorldGrid,
        │                             WorldCard, ComingSoonBadge
        ├── layout/                 ← AppShell, TopNav, WorldLayout,
        │                             LeftFiltersPanel, RightDetailsPanel,
        │                             BottomTimelinePanel
        ├── map/                    ← InteractiveWorldMap, MapNode, MapEdge,
        │                             MapControls, MapLegend, MapLevelSwitcher,
        │                             LocationDetailCard, RouteOverlay,
        │                             WorldMapBackground
        ├── timeline/               ← Timeline, TimelineEventCard,
        │                             TimelineFilters
        ├── search/                 ← GlobalSearch, SearchResults
        └── archive/                ← CharactersPage, CharacterCard,
                                      ClansAndFactionsPage, ClanFactionCard,
                                      StoryArcsPage, StoryArcCard
```

---

## ✦ Rotte

| Path                                | Descrizione                                  |
| ----------------------------------- | -------------------------------------------- |
| `/`                                 | Homepage con grid degli anime disponibili    |
| `/about`                            | About del progetto                           |
| `/worlds/:slug`                     | Mappa interattiva del mondo                  |
| `/worlds/:slug/characters`          | Archivio personaggi                          |
| `/worlds/:slug/clans`               | Archivio clan e fazioni                      |
| `/worlds/:slug/arcs`                | Archivio archi narrativi                     |
| `/worlds/:slug/sources`             | Fonti, asset e disclaimer copyright          |

Mondi con `status: coming_soon` aprono automaticamente una pagina di stato
("La mappa interattiva non è ancora disponibile") con il bottone per tornare in
homepage.

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
     tags: [...],
   }
   ```

2. **Crea la cartella dataset** `src/data/onepiece/` con i file:
   - `assets.ts`, `nations.ts`, `mapLevels.ts`, `locations.ts`,
     `characters.ts`, `clans.ts`, `factions.ts`, `arcs.ts`, `events.ts`,
     `routes.ts`
   - `index.ts` che esporta `onepieceDataset: WorldDataset`

3. **Registra il dataset** in `src/data/registry.ts`:

   ```ts
   import { onepieceDataset } from '@/data/onepiece';

   export const worldDatasets = {
     [narutoDataset.world.slug]: narutoDataset,
     [onepieceDataset.world.slug]: onepieceDataset,
   };
   ```

Tutto il resto (rotta, mappa, filtri, timeline, archivi, ricerca) si adatta
automaticamente al nuovo dataset.

---

## ✦ Sostituire la mappa placeholder

Quando hai una mappa autorizzata, evita di sovrascrivere lo SVG generato in
`src/components/map/WorldMapBackground.tsx`. Invece:

1. Salva l'immagine in `public/assets/worlds/<slug>/your-map.jpg`.
2. Aggiungi un `AssetReference` in `src/data/<slug>/assets.ts` con campi
   obbligatori (`license`, `author`, `source`, `url`).
3. Imposta il `backgroundAssetId` del `MapLevel` corrispondente.

Il componente `WorldMapBackground` userà l'immagine se `asset.url` è valorizzato,
altrimenti continuerà a usare il placeholder SVG locale.

---

## ✦ Copyright & dati narrativi

- I dati narrativi presenti sono **seed iniziali**: vanno verificati prima
  della pubblicazione.
- I riferimenti a capitoli manga / episodi anime non confermati sono marcati
  con `referenceStatus: "needs_verification"` e mostrati in UI come
  "Dato da verificare".
- **Nessuna immagine ufficiale** è inclusa. Tutto il visual è generato
  localmente in SVG o testo. Le immagini autorizzate vanno aggiunte in
  `public/assets/worlds/<slug>/` con licenza e autore documentati nel
  rispettivo `assets.ts`.

---

## ✦ TODO seed Naruto (da verificare)

- [ ] Confermare numeri di capitolo/episodio sugli eventi e archi (campi
      `mangaChapters` / `animeEpisodes` per ora vuoti dove non sicuri).
- [ ] Verificare confini territoriali e posizioni esatte sulla mappa.
- [ ] Confermare la posizione delle sotto-mappe (Konoha).
- [ ] Aggiungere altre sotto-mappe (Sunagakure, Akatsuki HQ).
- [ ] Verificare lo status post-serie dei personaggi (alive/deceased) per
      coerenza con Boruto.
- [ ] Sostituire i placeholder SVG con asset autorizzati.

---

## ✦ Deploy

Compatibile out-of-the-box con Vercel / Netlify. Punti di attenzione:

- **Vercel:** preset "Vite" → comando `npm run build`, output `dist/`.
- **Netlify:** comando `npm run build`, publish `dist/`.
- Aggiungi una rewrite SPA per tutte le rotte → `/index.html`:
  - Vercel `vercel.json`:
    ```json
    { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
    ```
  - Netlify `_redirects`:
    ```
    /*  /index.html  200
    ```

---

## ✦ License

Codice del progetto: MIT (proposta). Contenuti narrativi e asset di terzi
restano dei rispettivi proprietari.
