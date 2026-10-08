import type { SeoLocale } from './config';

/**
 * Testi dei METADATI SEO (title, description, breadcrumb JSON-LD) nelle lingue
 * con URL indicizzabili (`SEO_LOCALES`: it, en, es, fr). Sono una mappa locale `LocalizedText` (consentita da
 * CLAUDE.md): i metadati seguono la lingua dell'URL, non quella dell'interfaccia,
 * così `<title>`, canonical e hreflang dicono sempre la stessa cosa.
 *
 * Regole editoriali: frasi naturali e descrittive, nessun elenco di keyword,
 * nessuna informazione che non derivi dai dati. Il brand va in coda (vedi
 * `withBrand`).
 */
export interface SeoStrings {
  home: { title: string; description: string };
  about: { title: string; description: string };
  support: { title: string; description: string };
  privacy: { title: string; description: string };
  cookies: { title: string; description: string };
  notFound: { title: string; description: string };
  crumbHome: string;
  cat: {
    characters: string;
    locations: string;
    factions: string;
    arcs: string;
    journeys: string;
    regions: string;
    timeline: string;
    map: string;
  };
  page: (n: number) => string;
  world: (w: string) => string;
  worldDesc: (w: string, summary: string) => string;
  worldSoon: (w: string) => string;
  worldSoonDesc: (w: string) => string;
  map: (w: string) => string;
  mapDesc: (w: string, places: number, journeys: number) => string;
  characters: (w: string) => string;
  charactersDesc: (w: string, n: number) => string;
  locations: (w: string) => string;
  locationsDesc: (w: string, n: number) => string;
  factions: (w: string, term: string) => string;
  factionsDesc: (w: string, term: string, n: number) => string;
  arcs: (w: string) => string;
  arcsDesc: (w: string, n: number) => string;
  journeys: (w: string) => string;
  journeysDesc: (w: string, n: number) => string;
  abilities: (w: string, term: string) => string;
  abilitiesDesc: (w: string, term: string, n: number) => string;
  regions: (w: string) => string;
  regionsDesc: (w: string, n: number) => string;
  timeline: (w: string) => string;
  timelineDesc: (w: string, n: number) => string;
  character: (name: string, w: string, hasJourney: boolean) => string;
  characterTail: (name: string, w: string) => string;
  location: (name: string, type: string, w: string) => string;
  locationTail: (name: string, w: string) => string;
  faction: (name: string, type: string, w: string) => string;
  factionTail: (name: string, w: string) => string;
  arc: (name: string, w: string) => string;
  arcTail: (name: string, w: string) => string;
  journey: (name: string, w: string) => string;
  journeyTail: (steps: number, w: string) => string;
  ability: (name: string, term: string, w: string) => string;
  abilityTail: (name: string, w: string) => string;
  region: (name: string, w: string) => string;
  regionTail: (name: string, w: string) => string;
}

export const SEO_STRINGS: Record<SeoLocale, SeoStrings> = {
  it: {
    home: {
      title: 'AniMapVerse — Mappe interattive dei mondi anime e manga',
      description:
        'AniMapVerse è un atlante interattivo dei mondi anime e manga: mappe, luoghi, personaggi, archi narrativi, fazioni e percorsi dei protagonisti di Naruto, One Piece, Hunter x Hunter e altri.',
    },
    about: {
      title: 'Cos’è AniMapVerse',
      description:
        'AniMapVerse è un progetto indipendente che trasforma i mondi di anime e manga in mappe interattive e collegate: architettura, fonti e obiettivi del progetto.',
    },
    support: {
      title: 'Supporta AniMapVerse',
      description:
        'AniMapVerse è gratuito e senza pubblicità. Scopri come sostenere il progetto e aiutare ad aggiungere nuovi mondi, mappe e funzionalità.',
    },
    privacy: {
      title: 'Informativa sulla privacy',
      description: 'Informativa sulla privacy di AniMapVerse ai sensi del GDPR (Reg. UE 2016/679).',
    },
    cookies: {
      title: 'Cookie Policy',
      description: 'Cookie Policy di AniMapVerse: cookie tecnici e di analisi, gestione del consenso.',
    },
    notFound: {
      title: 'Pagina non trovata',
      description: 'La pagina che cerchi non esiste o è stata spostata.',
    },
    crumbHome: 'Home',
    cat: {
      characters: 'Personaggi',
      locations: 'Luoghi',
      factions: 'Fazioni',
      arcs: 'Archi narrativi',
      journeys: 'Percorsi',
      regions: 'Regioni',
      timeline: 'Cronologia',
      map: 'Mappa interattiva',
    },
    page: (n) => `Pagina ${n}`,
    world: (w) => `Mappa interattiva di ${w}: luoghi, personaggi e percorsi`,
    worldDesc: (w, s) => `${s} Esplora la mappa interattiva di ${w} su AniMapVerse.`,
    worldSoon: (w) => `${w} — mappa interattiva in arrivo`,
    worldSoonDesc: (w) => `La mappa interattiva di ${w} è in preparazione su AniMapVerse.`,
    map: (w) => `Mappa del mondo di ${w} — esplora la mappa interattiva`,
    mapDesc: (w, p, j) =>
      `Esplora la mappa interattiva del mondo di ${w}: ${p} luoghi, ${j} percorsi dei personaggi, timeline degli eventi e filtri per archi narrativi e fazioni.`,
    characters: (w) => `Personaggi di ${w}: schede, luoghi e archi narrativi`,
    charactersDesc: (w, n) =>
      `I ${n} personaggi di ${w} su AniMapVerse: ruoli, affiliazioni, luoghi collegati, archi narrativi e percorsi sulla mappa interattiva.`,
    locations: (w) => `Luoghi di ${w} sulla mappa interattiva`,
    locationsDesc: (w, n) =>
      `Tutti i ${n} luoghi di ${w} — villaggi, città, regioni e luoghi iconici — con la loro storia e la posizione sulla mappa interattiva.`,
    factions: (w, t) => `${t} di ${w}: membri, luoghi e archi`,
    factionsDesc: (w, t, n) =>
      `${n} ${t.toLowerCase()} di ${w}: leader, membri, territori e archi narrativi in cui compaiono, collegati alla mappa interattiva.`,
    arcs: (w) => `Archi narrativi di ${w}: eventi e luoghi`,
    arcsDesc: (w, n) =>
      `I ${n} archi narrativi di ${w} in ordine cronologico, con eventi, personaggi e luoghi di ogni arco sulla mappa interattiva.`,
    journeys: (w) => `Percorsi dei personaggi di ${w} sulla mappa`,
    journeysDesc: (w, n) =>
      `${n} percorsi di ${w} tappa per tappa: segui i viaggi dei protagonisti attraverso i luoghi del mondo sulla mappa interattiva.`,
    abilities: (w, t) => `${t} di ${w}: elenco e utilizzatori`,
    abilitiesDesc: (w, t, n) =>
      `${n} voci di ${t} in ${w}: descrizioni, categorie e personaggi che le usano.`,
    regions: (w) => `Regioni e territori di ${w}`,
    regionsDesc: (w, n) =>
      `Le ${n} regioni e territori del mondo di ${w}, con i luoghi che contengono e la loro posizione sulla mappa interattiva.`,
    timeline: (w) => `Cronologia di ${w}: gli eventi in ordine`,
    timelineDesc: (w, n) =>
      `La cronologia di ${w} in ${n} eventi: dove e quando accadono, archi narrativi e luoghi collegati sulla mappa interattiva.`,
    character: (name, w, j) =>
      j ? `${name}: percorso e luoghi — mappa di ${w}` : `${name} — personaggio di ${w}, luoghi e archi`,
    characterTail: (name, w) =>
      `Scopri i luoghi, gli archi narrativi e i collegamenti di ${name} sulla mappa interattiva di ${w}.`,
    location: (name, type, w) => `${name} (${type}) — mappa interattiva di ${w}`,
    locationTail: (name, w) =>
      `Personaggi, eventi e archi legati a ${name} e la sua posizione sulla mappa interattiva di ${w}.`,
    faction: (name, type, w) => `${name} (${type}) — ${w}: membri e luoghi`,
    factionTail: (name, w) => `Membri, luoghi e archi narrativi di ${name} nel mondo di ${w}.`,
    arc: (name, w) => `${name} — arco narrativo di ${w}: eventi e luoghi`,
    arcTail: (name, w) => `Eventi, personaggi e luoghi dell'arco ${name} sulla mappa interattiva di ${w}.`,
    journey: (name, w) => `${name} — percorso sulla mappa di ${w}`,
    journeyTail: (steps, w) => `Segui il percorso tappa per tappa (${steps} tappe) sulla mappa interattiva di ${w}.`,
    ability: (name, term, w) => `${name} — ${term} di ${w}`,
    abilityTail: (name, w) => `Chi usa ${name} e a quali personaggi e fazioni di ${w} è collegata.`,
    region: (name, w) => `${name} — regione di ${w}: luoghi e mappa`,
    regionTail: (name, w) => `Luoghi, fazioni e archi di ${name} sulla mappa interattiva di ${w}.`,
  },
  en: {
    home: {
      title: 'AniMapVerse — Interactive Anime & Manga World Maps',
      description:
        'AniMapVerse is an interactive atlas of anime and manga worlds: explore maps, locations, characters, story arcs, factions and character journeys from Naruto, One Piece, Hunter x Hunter and more.',
    },
    about: {
      title: 'About AniMapVerse',
      description:
        'AniMapVerse is an independent project that turns anime and manga worlds into connected, interactive maps: architecture, sources and goals of the project.',
    },
    support: {
      title: 'Support AniMapVerse',
      description:
        'AniMapVerse is free and ad-free. Find out how to support the project and help add new worlds, maps and features.',
    },
    privacy: {
      title: 'Privacy Policy',
      description: 'AniMapVerse privacy policy under the GDPR (EU Regulation 2016/679).',
    },
    cookies: {
      title: 'Cookie Policy',
      description: 'AniMapVerse cookie policy: technical and analytics cookies, consent management.',
    },
    notFound: {
      title: 'Page not found',
      description: 'The page you are looking for does not exist or has been moved.',
    },
    crumbHome: 'Home',
    cat: {
      characters: 'Characters',
      locations: 'Locations',
      factions: 'Factions',
      arcs: 'Story arcs',
      journeys: 'Journeys',
      regions: 'Regions',
      timeline: 'Timeline',
      map: 'Interactive map',
    },
    page: (n) => `Page ${n}`,
    world: (w) => `${w} Interactive Map: Locations, Characters & Journeys`,
    worldDesc: (w, s) => `${s} Explore the interactive ${w} map on AniMapVerse.`,
    worldSoon: (w) => `${w} — Interactive Map Coming Soon`,
    worldSoonDesc: (w) => `The interactive ${w} map is in the works on AniMapVerse.`,
    map: (w) => `${w} World Map — Explore the Interactive Map`,
    mapDesc: (w, p, j) =>
      `Explore the interactive ${w} world map: ${p} locations, ${j} character journeys, an event timeline and filters by story arc and faction.`,
    characters: (w) => `${w} Characters: Profiles, Locations & Story Arcs`,
    charactersDesc: (w, n) =>
      `All ${n} ${w} characters on AniMapVerse: roles, affiliations, connected locations, story arcs and journeys on the interactive map.`,
    locations: (w) => `${w} Locations on the Interactive Map`,
    locationsDesc: (w, n) =>
      `All ${n} ${w} locations — villages, cities, regions and landmarks — with their story and their position on the interactive map.`,
    factions: (w, t) => `${w} ${t}: Members, Locations & Arcs`,
    factionsDesc: (w, t, n) =>
      `${n} ${w} ${t.toLowerCase()}: leaders, members, territories and the story arcs they appear in, linked to the interactive map.`,
    arcs: (w) => `${w} Story Arcs: Events & Locations`,
    arcsDesc: (w, n) =>
      `All ${n} ${w} story arcs in chronological order, with the events, characters and locations of each arc on the interactive map.`,
    journeys: (w) => `${w} Character Journeys on the Map`,
    journeysDesc: (w, n) =>
      `${n} ${w} journeys step by step: follow the main characters' travels across the world on the interactive map.`,
    abilities: (w, t) => `${w} ${t}: List & Users`,
    abilitiesDesc: (w, t, n) => `${n} ${w} ${t} entries: descriptions, categories and the characters who use them.`,
    regions: (w) => `${w} Regions & Territories`,
    regionsDesc: (w, n) =>
      `The ${n} regions and territories of the ${w} world, with the locations they contain and their position on the interactive map.`,
    timeline: (w) => `${w} Timeline: Events in Order`,
    timelineDesc: (w, n) =>
      `The ${w} timeline in ${n} events: where and when they happen, with the related story arcs and locations on the interactive map.`,
    character: (name, w, j) =>
      j ? `${name}: Journey & Locations — ${w} Map` : `${name} — ${w} Character, Locations & Arcs`,
    characterTail: (name, w) =>
      `Discover ${name}'s locations, story arcs and connections on the interactive ${w} map.`,
    location: (name, type, w) => `${name} (${type}) — ${w} Interactive Map`,
    locationTail: (name, w) =>
      `Characters, events and story arcs tied to ${name}, and its position on the interactive ${w} map.`,
    faction: (name, type, w) => `${name} (${type}) — ${w}: Members & Locations`,
    factionTail: (name, w) => `Members, locations and story arcs of ${name} in the ${w} world.`,
    arc: (name, w) => `${name} — ${w} Story Arc: Events & Locations`,
    arcTail: (name, w) => `Events, characters and locations of the ${name} arc on the interactive ${w} map.`,
    journey: (name, w) => `${name} — Journey on the ${w} Map`,
    journeyTail: (steps, w) => `Follow the journey step by step (${steps} stops) on the interactive ${w} map.`,
    ability: (name, term, w) => `${name} — ${w} ${term}`,
    abilityTail: (name, w) => `Who uses ${name} and which ${w} characters and factions it is connected to.`,
    region: (name, w) => `${name} — ${w} Region: Locations & Map`,
    regionTail: (name, w) => `Locations, factions and story arcs of ${name} on the interactive ${w} map.`,
  },
  es: {
    home: {
      title: 'AniMapVerse — Mapas interactivos de mundos de anime y manga',
      description:
        'AniMapVerse es un atlas interactivo del anime y el manga: mapas, lugares, personajes, arcos, facciones y recorridos de Naruto, One Piece, Hunter x Hunter y más.',
    },
    about: {
      title: 'Qué es AniMapVerse',
      description:
        'AniMapVerse es un proyecto independiente que convierte los mundos de anime y manga en mapas interactivos y conectados: arquitectura, fuentes y objetivos del proyecto.',
    },
    support: {
      title: 'Apoya AniMapVerse',
      description:
        'AniMapVerse es gratuito y sin publicidad. Descubre cómo apoyar el proyecto y ayudar a añadir nuevos mundos, mapas y funciones.',
    },
    privacy: {
      title: 'Política de privacidad',
      description: 'Política de privacidad de AniMapVerse conforme al RGPD (Reglamento UE 2016/679).',
    },
    cookies: {
      title: 'Política de cookies',
      description: 'Política de cookies de AniMapVerse: cookies técnicas y de análisis, gestión del consentimiento.',
    },
    notFound: {
      title: 'Página no encontrada',
      description: 'La página que buscas no existe o se ha movido.',
    },
    crumbHome: 'Inicio',
    cat: {
      characters: 'Personajes',
      locations: 'Lugares',
      factions: 'Facciones',
      arcs: 'Arcos argumentales',
      journeys: 'Recorridos',
      regions: 'Regiones',
      timeline: 'Cronología',
      map: 'Mapa interactivo',
    },
    page: (n) => `Página ${n}`,
    world: (w) => `Mapa interactivo de ${w}: lugares, personajes y recorridos`,
    worldDesc: (w, s) => `${s} Explora el mapa interactivo de ${w} en AniMapVerse.`,
    worldSoon: (w) => `${w} — mapa interactivo próximamente`,
    worldSoonDesc: (w) => `El mapa interactivo de ${w} está en preparación en AniMapVerse.`,
    map: (w) => `Mapa del mundo de ${w} — explora el mapa interactivo`,
    mapDesc: (w, p, j) =>
      `Explora el mapa interactivo del mundo de ${w}: ${p} lugares, ${j} recorridos de personajes, una cronología de eventos y filtros por arco argumental y facción.`,
    characters: (w) => `Personajes de ${w}: fichas, lugares y arcos argumentales`,
    charactersDesc: (w, n) =>
      `Los ${n} personajes de ${w} en AniMapVerse: roles, afiliaciones, lugares relacionados, arcos argumentales y recorridos en el mapa interactivo.`,
    locations: (w) => `Lugares de ${w} en el mapa interactivo`,
    locationsDesc: (w, n) =>
      `Los ${n} lugares de ${w} — aldeas, ciudades, regiones y lugares emblemáticos — con su historia y su posición en el mapa interactivo.`,
    factions: (w, t) => `${t} de ${w}: miembros, lugares y arcos`,
    factionsDesc: (w, t, n) =>
      `${n} ${t.toLowerCase()} de ${w}: líderes, miembros, territorios y los arcos argumentales en los que aparecen, conectados al mapa interactivo.`,
    arcs: (w) => `Arcos argumentales de ${w}: eventos y lugares`,
    arcsDesc: (w, n) =>
      `Los ${n} arcos argumentales de ${w} en orden cronológico, con los eventos, personajes y lugares de cada arco en el mapa interactivo.`,
    journeys: (w) => `Recorridos de los personajes de ${w} en el mapa`,
    journeysDesc: (w, n) =>
      `${n} recorridos de ${w} etapa por etapa: sigue los viajes de los protagonistas por los lugares del mundo en el mapa interactivo.`,
    abilities: (w, t) => `${t} de ${w}: lista y usuarios`,
    abilitiesDesc: (w, t, n) => `${n} entradas de ${t} en ${w}: descripciones, categorías y los personajes que las usan.`,
    regions: (w) => `Regiones y territorios de ${w}`,
    regionsDesc: (w, n) =>
      `Las ${n} regiones y territorios del mundo de ${w}, con los lugares que contienen y su posición en el mapa interactivo.`,
    timeline: (w) => `Cronología de ${w}: los eventos en orden`,
    timelineDesc: (w, n) =>
      `La cronología de ${w} en ${n} eventos: dónde y cuándo ocurren, con los arcos argumentales y los lugares relacionados en el mapa interactivo.`,
    character: (name, w, j) =>
      j ? `${name}: recorrido y lugares — mapa de ${w}` : `${name} — personaje de ${w}, lugares y arcos`,
    characterTail: (name, w) =>
      `Descubre los lugares, los arcos argumentales y las conexiones de ${name} en el mapa interactivo de ${w}.`,
    location: (name, type, w) => `${name} (${type}) — mapa interactivo de ${w}`,
    locationTail: (name, w) =>
      `Personajes, eventos y arcos ligados a ${name} y su posición en el mapa interactivo de ${w}.`,
    faction: (name, type, w) => `${name} (${type}) — ${w}: miembros y lugares`,
    factionTail: (name, w) => `Miembros, lugares y arcos argumentales de ${name} en el mundo de ${w}.`,
    arc: (name, w) => `${name} — arco argumental de ${w}: eventos y lugares`,
    arcTail: (name, w) => `Eventos, personajes y lugares del arco ${name} en el mapa interactivo de ${w}.`,
    journey: (name, w) => `${name} — recorrido en el mapa de ${w}`,
    journeyTail: (steps, w) => `Sigue el recorrido etapa por etapa (${steps} etapas) en el mapa interactivo de ${w}.`,
    ability: (name, term, w) => `${name} — ${term} de ${w}`,
    abilityTail: (name, w) => `Quién usa ${name} y con qué personajes y facciones de ${w} está conectada.`,
    region: (name, w) => `${name} — región de ${w}: lugares y mapa`,
    regionTail: (name, w) => `Lugares, facciones y arcos de ${name} en el mapa interactivo de ${w}.`,
  },
  fr: {
    home: {
      title: 'AniMapVerse — Cartes interactives des mondes d\'anime et de manga',
      description:
        'AniMapVerse est un atlas interactif de l\'anime et du manga : cartes, lieux, personnages, arcs, factions et parcours de Naruto, One Piece, Hunter x Hunter et bien d\'autres.',
    },
    about: {
      title: 'Qu\'est-ce qu\'AniMapVerse',
      description:
        'AniMapVerse est un projet indépendant qui transforme les mondes d\'anime et de manga en cartes interactives et connectées : architecture, sources et objectifs du projet.',
    },
    support: {
      title: 'Soutenir AniMapVerse',
      description:
        'AniMapVerse est gratuit et sans publicité. Découvrez comment soutenir le projet et aider à ajouter de nouveaux mondes, cartes et fonctionnalités.',
    },
    privacy: {
      title: 'Politique de confidentialité',
      description: 'Politique de confidentialité d\'AniMapVerse conforme au RGPD (règlement UE 2016/679).',
    },
    cookies: {
      title: 'Politique relative aux cookies',
      description: 'Politique relative aux cookies d\'AniMapVerse : cookies techniques et de mesure d\'audience, gestion du consentement.',
    },
    notFound: {
      title: 'Page introuvable',
      description: 'La page que vous cherchez n\'existe pas ou a été déplacée.',
    },
    crumbHome: 'Accueil',
    cat: {
      characters: 'Personnages',
      locations: 'Lieux',
      factions: 'Factions',
      arcs: 'Arcs narratifs',
      journeys: 'Parcours',
      regions: 'Régions',
      timeline: 'Chronologie',
      map: 'Carte interactive',
    },
    page: (n) => `Page ${n}`,
    world: (w) => `Carte interactive de ${w} : lieux, personnages et parcours`,
    worldDesc: (w, s) => `${s} Explorez la carte interactive de ${w} sur AniMapVerse.`,
    worldSoon: (w) => `${w} — carte interactive bientôt disponible`,
    worldSoonDesc: (w) => `La carte interactive de ${w} est en préparation sur AniMapVerse.`,
    map: (w) => `Carte du monde de ${w} — explorez la carte interactive`,
    mapDesc: (w, p, j) =>
      `Explorez la carte interactive du monde de ${w} : ${p} lieux, ${j} parcours de personnages, une chronologie des événements et des filtres par arc narratif et par faction.`,
    characters: (w) => `Personnages de ${w} : fiches, lieux et arcs narratifs`,
    charactersDesc: (w, n) =>
      `Les ${n} personnages de ${w} sur AniMapVerse : rôles, affiliations, lieux liés, arcs narratifs et parcours sur la carte interactive.`,
    locations: (w) => `Lieux de ${w} sur la carte interactive`,
    locationsDesc: (w, n) =>
      `Les ${n} lieux de ${w} — villages, villes, régions et lieux emblématiques — avec leur histoire et leur position sur la carte interactive.`,
    factions: (w, t) => `${t} de ${w} : membres, lieux et arcs`,
    factionsDesc: (w, t, n) =>
      `${n} ${t.toLowerCase()} de ${w} : chefs, membres, territoires et arcs narratifs où ils apparaissent, reliés à la carte interactive.`,
    arcs: (w) => `Arcs narratifs de ${w} : événements et lieux`,
    arcsDesc: (w, n) =>
      `Les ${n} arcs narratifs de ${w} dans l\'ordre chronologique, avec les événements, les personnages et les lieux de chaque arc sur la carte interactive.`,
    journeys: (w) => `Parcours des personnages de ${w} sur la carte`,
    journeysDesc: (w, n) =>
      `${n} parcours de ${w} étape par étape : suivez les voyages des protagonistes à travers les lieux du monde sur la carte interactive.`,
    abilities: (w, t) => `${t} de ${w} : liste et utilisateurs`,
    abilitiesDesc: (w, t, n) => `${n} entrées de ${t} dans ${w} : descriptions, catégories et personnages qui les utilisent.`,
    regions: (w) => `Régions et territoires de ${w}`,
    regionsDesc: (w, n) =>
      `Les ${n} régions et territoires du monde de ${w}, avec les lieux qu\'ils contiennent et leur position sur la carte interactive.`,
    timeline: (w) => `Chronologie de ${w} : les événements dans l\'ordre`,
    timelineDesc: (w, n) =>
      `La chronologie de ${w} en ${n} événements : où et quand ils se déroulent, avec les arcs narratifs et les lieux liés sur la carte interactive.`,
    character: (name, w, j) =>
      j ? `${name} : parcours et lieux — carte de ${w}` : `${name} — personnage de ${w}, lieux et arcs`,
    characterTail: (name, w) =>
      `Découvrez les lieux, les arcs narratifs et les liens de ${name} sur la carte interactive de ${w}.`,
    location: (name, type, w) => `${name} (${type}) — carte interactive de ${w}`,
    locationTail: (name, w) =>
      `Personnages, événements et arcs liés à ${name} et sa position sur la carte interactive de ${w}.`,
    faction: (name, type, w) => `${name} (${type}) — ${w} : membres et lieux`,
    factionTail: (name, w) => `Membres, lieux et arcs narratifs de ${name} dans le monde de ${w}.`,
    arc: (name, w) => `${name} — arc narratif de ${w} : événements et lieux`,
    arcTail: (name, w) => `Événements, personnages et lieux de l\'arc ${name} sur la carte interactive de ${w}.`,
    journey: (name, w) => `${name} — parcours sur la carte de ${w}`,
    journeyTail: (steps, w) => `Suivez le parcours étape par étape (${steps} étapes) sur la carte interactive de ${w}.`,
    ability: (name, term, w) => `${name} — ${term} de ${w}`,
    abilityTail: (name, w) => `Qui utilise ${name} et à quels personnages et factions de ${w} cette technique est liée.`,
    region: (name, w) => `${name} — région de ${w} : lieux et carte`,
    regionTail: (name, w) => `Lieux, factions et arcs de ${name} sur la carte interactive de ${w}.`,
  },
};
