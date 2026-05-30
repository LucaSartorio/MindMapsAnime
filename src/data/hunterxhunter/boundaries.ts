import type { MapBoundary } from '@/types';

/**
 * Confini cliccabili per la world map Hunter x Hunter.
 *
 * Tutti i `svgPathD` sono nel viewBox 2000 × 1187 e tracciano le regioni
 * della mappa di riferimento (fan-made) del Mondo Conosciuto. Fungono da
 * aree cliccabili + highlight su hover/selezione (vedi MapRegionPath);
 * l'overlay è invisibile di default perché il PNG porta già etichette e
 * confini disegnati.
 *
 * I contorni delle terre isolate (Yorbian, Azian, Nuovo Continente,
 * Begerossé) sono estratti automaticamente dal PNG con
 * `scripts/hxh-extract-boundaries.ts` (region-growing sul colore + Moore
 * tracing). Le singole nazioni dentro uno stesso continente condividono il
 * colore e non sono separabili: restano poligoni disegnati a mano.
 *
 * Ordine: prima le macro-regioni (Mondo Conosciuto, continenti) così che le
 * hot-zone delle singole nazioni, definite dopo, restino cliccabili sopra.
 *
 * TODO: se sostituisci il PNG, rivedi `svgPathD` e `labelPosition`.
 */
export const hxhBoundaries: MapBoundary[] = [
  /* ============= MACRO-REGIONI ============= */
  {
    id: 'boundary-hxh-known-world',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'known-world',
    name: 'Known World',
    localizedName: { it: 'Mondo Conosciuto', en: 'Known World' },
    type: 'special_area',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    svgPathD:
      'M 530 309 L 1450 309 L 1450 973 L 530 973 Z',
    labelPosition: { x: 970, y: 560 },
    color: '#7fb2c8',
    descriptionShort: {
      it: 'La porzione esplorata e mappata del mondo di Hunter x Hunter, racchiusa dal confine tratteggiato in mezzo al Lago Mobius.',
      en: 'The explored, charted portion of the Hunter x Hunter world, enclosed by the dashed border amid Lake Mobius.',
    },
    tags: ['known-world'],
  },
  {
    id: 'boundary-hxh-dark-continent',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'dark-continent',
    name: 'Dark Continent',
    localizedName: { it: 'Continente Oscuro', en: 'Dark Continent' },
    type: 'region',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    svgPathD:
      'M 0 0 L 2000 0 L 2000 250 L 1500 205 L 1000 160 L 500 205 L 0 250 Z',
    labelPosition: { x: 980, y: 70 },
    nationId: 'nation-hxh-dark-continent',
    color: '#3a3326',
    descriptionShort: {
      it: 'La terra inesplorata che circonda il Lago Mobius e il Mondo Conosciuto, dimora delle Cinque Calamità.',
      en: 'The unexplored land encircling Lake Mobius and the Known World, home to the Five Calamities.',
    },
    tags: ['continente-oscuro', 'calamita'],
  },
  {
    id: 'boundary-hxh-yorbian',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'yorbian',
    name: 'Yorbian Continent',
    localizedName: { it: 'Continente di Yorbian', en: 'Yorbian Continent' },
    type: 'region',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    svgPathD:
      'M 866 589 L 862 616 L 874 608 L 879 613 L 890 610 L 898 623 L 896 638 L 903 629 L 919 631 L 920 639 L 900 652 L 912 646 L 932 652 L 927 668 L 931 676 L 918 692 L 906 691 L 898 702 L 865 716 L 854 736 L 846 732 L 850 744 L 791 763 L 796 774 L 790 782 L 804 762 L 823 758 L 838 768 L 842 754 L 852 756 L 864 781 L 848 790 L 824 787 L 820 802 L 808 803 L 813 822 L 807 827 L 787 814 L 806 800 L 787 794 L 788 783 L 777 783 L 777 797 L 766 793 L 779 803 L 784 823 L 756 810 L 745 816 L 750 824 L 773 825 L 778 847 L 772 852 L 767 842 L 765 856 L 755 849 L 743 861 L 705 856 L 697 848 L 681 852 L 677 839 L 690 837 L 675 833 L 672 825 L 679 824 L 669 821 L 708 809 L 709 831 L 735 839 L 742 828 L 723 814 L 730 799 L 702 798 L 673 809 L 660 800 L 662 817 L 609 802 L 627 765 L 619 774 L 613 767 L 599 770 L 616 742 L 614 720 L 603 710 L 612 695 L 599 674 L 613 675 L 635 642 L 618 633 L 604 652 L 599 638 L 588 648 L 575 627 L 605 624 L 619 611 L 636 608 L 655 617 L 663 617 L 659 610 L 664 609 L 707 613 L 735 625 L 756 645 L 755 652 L 812 666 L 814 658 L 857 643 L 853 606 L 866 590 Z',
    labelPosition: { x: 754, y: 720 },
    nationId: 'nation-hxh-yorbian',
    color: '#9ec27a',
    descriptionShort: {
      it: 'Il continente sud-occidentale del Mondo Conosciuto: Stati Uniti di Saherta e Mitene Union.',
      en: 'The south-western continent of the Known World: United States of Saherta and Mitene Union.',
    },
    tags: ['continente', 'yorbian'],
  },
  {
    id: 'boundary-hxh-azian',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'azian',
    name: 'Azian Continent',
    localizedName: { it: 'Continente di Azian', en: 'Azian Continent' },
    type: 'region',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    svgPathD:
      'M 1277 317 L 1294 323 L 1294 341 L 1311 345 L 1327 370 L 1325 414 L 1343 431 L 1346 445 L 1360 430 L 1383 445 L 1391 439 L 1371 413 L 1344 404 L 1357 392 L 1354 374 L 1380 386 L 1385 406 L 1416 431 L 1421 458 L 1397 484 L 1388 484 L 1388 466 L 1369 472 L 1387 522 L 1387 555 L 1377 572 L 1404 584 L 1374 581 L 1364 571 L 1355 577 L 1366 603 L 1391 598 L 1394 611 L 1380 616 L 1380 623 L 1396 627 L 1409 621 L 1408 638 L 1434 659 L 1427 669 L 1420 674 L 1407 663 L 1395 662 L 1381 645 L 1354 649 L 1306 638 L 1291 628 L 1288 610 L 1272 602 L 1220 609 L 1205 596 L 1178 599 L 1155 584 L 1146 560 L 1130 547 L 1166 537 L 1209 479 L 1196 471 L 1172 491 L 1162 471 L 1166 449 L 1220 433 L 1239 442 L 1246 425 L 1259 423 L 1255 460 L 1264 463 L 1280 453 L 1283 434 L 1262 409 L 1291 388 L 1291 355 L 1270 330 L 1277 318 Z',
    labelPosition: { x: 1280, y: 480 },
    nationId: 'nation-hxh-azian',
    color: '#9ec27a',
    descriptionShort: {
      it: 'Il vasto continente orientale del Mondo Conosciuto: Regno di Kakin e Federazione di Ochima.',
      en: 'The large eastern continent of the Known World: Kingdom of Kakin and Federation of Ochima.',
    },
    tags: ['continente', 'azian'],
  },
  {
    id: 'boundary-hxh-new-continent',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'new-continent',
    name: 'New Continent',
    localizedName: { it: 'Nuovo Continente', en: 'New Continent' },
    type: 'region',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    svgPathD:
      'M 1574 316 L 1584 320 L 1588 334 L 1611 334 L 1617 356 L 1609 370 L 1623 376 L 1636 405 L 1633 450 L 1649 463 L 1655 481 L 1641 501 L 1640 522 L 1618 530 L 1609 544 L 1593 551 L 1580 551 L 1569 535 L 1530 542 L 1513 527 L 1520 509 L 1511 492 L 1523 478 L 1527 449 L 1545 427 L 1526 395 L 1527 372 L 1573 317 Z',
    labelPosition: { x: 1582, y: 462 },
    nationId: 'nation-hxh-new-continent',
    color: '#c9b896',
    descriptionShort: {
      it: 'Terra emersa oltre il confine orientale del Mondo Conosciuto, separata dal Lago Mobius.',
      en: 'Landmass beyond the eastern border of the Known World, separated by Lake Mobius.',
    },
    tags: ['nuovo-continente'],
  },

  /* ============= NORD-OVEST (Padokia / Mimbo / Kukan'yu) ============= */
  {
    id: 'boundary-hxh-padokia',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'padokia',
    name: 'Republic of Padokia',
    localizedName: { it: 'Repubblica di Padokia', en: 'Republic of Padokia' },
    type: 'minor_nation',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    svgPathD:
      'M 690 315 L 770 305 L 815 330 L 810 375 L 760 395 L 700 385 L 680 350 Z',
    labelPosition: { x: 744, y: 347 },
    nationId: 'nation-hxh-padokia',
    color: '#a7c98a',
    descriptionShort: {
      it: 'Repubblica nord-occidentale che ospita il Monte Kukuroo, sede della famiglia Zoldyck.',
      en: 'North-western republic home to Kukuroo Mountain, seat of the Zoldyck family.',
    },
    tags: ['zoldyck'],
  },
  {
    id: 'boundary-hxh-mimbo',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'mimbo',
    name: 'Mimbo Republic',
    localizedName: { it: 'Repubblica di Mimbo', en: 'Mimbo Republic' },
    type: 'minor_nation',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    svgPathD:
      'M 690 365 L 760 365 L 790 395 L 760 420 L 705 422 L 678 398 Z',
    labelPosition: { x: 732, y: 392 },
    nationId: 'nation-hxh-mimbo',
    color: '#a7c98a',
    descriptionShort: {
      it: 'Repubblica del gruppo di terre nord-occidentali, vicina alla Torre Celeste.',
      en: 'Republic of the north-western landmass group, near Heavens Arena.',
    },
    tags: ['mimbo'],
  },
  {
    id: 'boundary-hxh-kukanyu',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'kukanyu',
    name: "Kukan'yu Kingdom",
    localizedName: { it: "Regno di Kukan'yu", en: "Kukan'yu Kingdom" },
    type: 'minor_nation',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    svgPathD:
      'M 590 420 L 670 415 L 695 450 L 670 485 L 615 495 L 585 460 Z',
    labelPosition: { x: 634, y: 452 },
    nationId: 'nation-hxh-kukanyu',
    color: '#a7c98a',
    descriptionShort: {
      it: "Regno nord-occidentale che ospita la Città di Zaban, sede della fase finale dell'Esame per Hunter.",
      en: "North-western kingdom home to Zaban City, site of the Hunter Exam's final phase.",
    },
    tags: ['kukanyu', 'hunter-exam'],
  },

  /* ============= YORBIAN (Saherta / Mitene) ============= */
  {
    id: 'boundary-hxh-saherta',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'saherta',
    name: 'United States of Saherta',
    localizedName: { it: 'Stati Uniti di Saherta', en: 'United States of Saherta' },
    type: 'great_nation',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    svgPathD:
      'M 615 645 L 715 640 L 745 670 L 720 705 L 645 708 L 610 678 Z',
    labelPosition: { x: 666, y: 673 },
    nationId: 'nation-hxh-saherta',
    color: '#8fbf6e',
    descriptionShort: {
      it: 'Grande federazione del continente di Yorbian, fra le potenze del Mondo Conosciuto.',
      en: 'Large federation of the Yorbian continent, among the powers of the Known World.',
    },
    tags: ['saherta', 'yorbian'],
  },
  {
    id: 'boundary-hxh-mitene',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'mitene',
    name: 'Mitene Union',
    localizedName: { it: 'Unione di Mitene', en: 'Mitene Union' },
    type: 'great_nation',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    svgPathD:
      'M 720 880 L 820 870 L 855 905 L 835 950 L 760 962 L 705 925 Z',
    labelPosition: { x: 784, y: 912 },
    nationId: 'nation-hxh-mitene',
    color: '#8fbf6e',
    descriptionShort: {
      it: 'Unione di stati nel sud di Yorbian; al suo interno la regione autonoma NGL.',
      en: 'Union of states in southern Yorbian; the NGL autonomous region lies within it.',
    },
    tags: ['mitene', 'ngl'],
  },

  /* ============= AZIAN (Kakin / Ochima) ============= */
  {
    id: 'boundary-hxh-kakin',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'kakin',
    name: 'Kingdom of Kakin',
    localizedName: { it: 'Regno di Kakin', en: 'Kingdom of Kakin' },
    type: 'great_nation',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    svgPathD:
      'M 1160 490 L 1260 485 L 1290 525 L 1260 565 L 1185 570 L 1150 530 Z',
    labelPosition: { x: 1210, y: 525 },
    nationId: 'nation-hxh-kakin',
    color: '#8fbf6e',
    descriptionShort: {
      it: 'Monarchia emergente del continente di Azian, da cui salpa la spedizione verso il Continente Oscuro.',
      en: 'Emerging monarchy of the Azian continent, from which the Dark Continent expedition sets sail.',
    },
    tags: ['kakin', 'successione'],
  },
  {
    id: 'boundary-hxh-ochima',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'ochima',
    name: 'Federation of Ochima',
    localizedName: { it: 'Federazione di Ochima', en: 'Federation of Ochima' },
    type: 'great_nation',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    svgPathD:
      'M 1255 610 L 1370 605 L 1410 650 L 1380 700 L 1300 715 L 1250 670 Z',
    labelPosition: { x: 1308, y: 655 },
    nationId: 'nation-hxh-ochima',
    color: '#8fbf6e',
    descriptionShort: {
      it: 'Federazione del sud del continente di Azian, fra le grandi potenze del Mondo Conosciuto.',
      en: 'Federation in southern Azian, among the great powers of the Known World.',
    },
    tags: ['ochima'],
  },

  /* ============= ISOLE CENTRO-MERIDIONALI ============= */
  {
    id: 'boundary-hxh-begerosse',
    worldId: 'world-hunterxhunter',
    mapLevelId: 'hxh-map-world',
    slug: 'begerosse',
    name: 'Begerossé Union',
    localizedName: { it: 'Unione di Begerossé', en: 'Begerossé Union' },
    type: 'island',
    canonStatus: 'canon',
    referenceStatus: 'verified',
    svgPathD:
      'M 1053 760 L 1089 778 L 1126 761 L 1147 767 L 1155 797 L 1150 813 L 1095 835 L 1080 822 L 1062 832 L 1036 802 L 1037 770 L 1052 761 Z',
    labelPosition: { x: 1118, y: 815 },
    nationId: 'nation-hxh-begerosse',
    color: '#8fbf6e',
    descriptionShort: {
      it: 'Unione insulare al centro-sud del Mondo Conosciuto, fra Yorbian e Azian.',
      en: 'Island union in the south-central Known World, between Yorbian and Azian.',
    },
    tags: ['begerosse'],
  },
];
