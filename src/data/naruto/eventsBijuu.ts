import type { TimelineEvent } from '@/types';

/**
 * La caccia ai cercoteri. Il tag `cercoterio` (anche sugli eventi già presenti:
 * la cattura di Hashirama, l'attacco di Kurama, il rapimento di Gaara…) accende
 * i luoghi sulla mappa con il filtro «Evidenzia catture e sigilli dei Cercoteri»
 * (WorldConfig.mapMarkers). Le catture fuori scena dell'Akatsuki non hanno un
 * luogo certo: restano nella timeline senza pin.
 */
const SHIPPUDEN = { it: 'Naruto Shippuden', en: 'Naruto Shippuden' };

export const narutoEventsBijuu: TimelineEvent[] = [
  {
    id: 'ev-mito-seals-kurama',
    worldId: 'world-naruto',
    title: { it: 'Mito Uzumaki, prima forza portante della Volpe', en: 'Mito Uzumaki, first jinchūriki of the Fox' },
    description: {
      it: "Dopo la battaglia della Valle della Fine Mito Uzumaki, moglie di Hashirama, sigilla Kurama dentro di sé e diventa la prima forza portante della Volpe a Nove Code. Prima di morire il cercoterio passa a Kushina Uzumaki, venuta a Konoha dal Vortice.",
      en: "After the battle at the Valley of the End, Mito Uzumaki, Hashirama's wife, seals Kurama inside herself and becomes the first jinchūriki of the Nine-Tailed Fox. Before her death the tailed beast passes to Kushina Uzumaki, who came to Konoha from the Whirlpool.",
    },
    period: { it: 'Prima della serie', en: 'Before the series' },
    arcId: 'arc-pre-series',
    mangaChapters: ['~500'],
    locationId: 'loc-konoha',
    characterIds: ['char-mito', 'char-kurama', 'char-hashirama', 'char-kushina'],
    order: 0,
    canon: 'canon',
    referenceStatus: 'verified',
    tags: ['cercoterio', 'uzumaki'],
  },
  {
    id: 'ev-yugito-captured',
    worldId: 'world-naruto',
    title: { it: 'La cattura di Yugito Nii', en: 'The capture of Yugito Nii' },
    description: {
      it: "Hidan e Kakuzu catturano Yugito Nii, kunoichi di Kumo e forza portante del Due Code Matatabi. Il cercoterio viene estratto e sigillato nella Statua Demoniaca dell'Akatsuki.",
      en: "Hidan and Kakuzu capture Yugito Nii, a Kumo kunoichi and jinchūriki of the Two-Tails Matatabi. The tailed beast is extracted and sealed into the Akatsuki's Demonic Statue.",
    },
    period: SHIPPUDEN,
    arcId: 'arc-akatsuki-suppression',
    characterIds: ['char-yugito', 'char-matatabi', 'char-hidan', 'char-kakuzu'],
    factionIds: ['faction-akatsuki'],
    order: 0,
    canon: 'canon',
    referenceStatus: 'verified',
    tags: ['cercoterio', 'akatsuki'],
  },
  {
    id: 'ev-three-tails-captured',
    worldId: 'world-naruto',
    title: { it: 'La cattura del Tre Code', en: 'The capture of the Three-Tails' },
    description: {
      it: "Dopo la morte del Mizukage Yagura, Isobu, il Tre Code, vaga senza forza portante. Deidara e Tobi lo catturano e l'Akatsuki lo sigilla.",
      en: 'After the death of Mizukage Yagura, Isobu, the Three-Tails, roams without a jinchūriki. Deidara and Tobi capture it and the Akatsuki seals it.',
    },
    period: SHIPPUDEN,
    arcId: 'arc-akatsuki-suppression',
    characterIds: ['char-isobu', 'char-deidara', 'char-obito', 'char-yagura'],
    factionIds: ['faction-akatsuki'],
    order: 0,
    canon: 'canon',
    referenceStatus: 'verified',
    tags: ['cercoterio', 'akatsuki'],
  },
  {
    id: 'ev-roshi-captured',
    worldId: 'world-naruto',
    title: { it: 'La cattura di Rōshi', en: 'The capture of Rōshi' },
    description: {
      it: "Kisame Hoshigaki cattura Rōshi, il ninja di Iwa forza portante del Quattro Code Son Gokū.",
      en: 'Kisame Hoshigaki captures Rōshi, the Iwa ninja who is the jinchūriki of the Four-Tails Son Gokū.',
    },
    period: SHIPPUDEN,
    arcId: 'arc-akatsuki-suppression',
    characterIds: ['char-roshi', 'char-son-goku', 'char-kisame'],
    factionIds: ['faction-akatsuki'],
    order: 0,
    canon: 'canon',
    referenceStatus: 'verified',
    tags: ['cercoterio', 'akatsuki'],
  },
  {
    id: 'ev-fu-captured',
    worldId: 'world-naruto',
    title: { it: 'La cattura di Fū', en: 'The capture of Fū' },
    description: {
      it: "Fū, kunoichi di Taki e forza portante del Sette Code Chōmei, viene catturata dalla coppia Kakuzu e Hidan.",
      en: 'Fū, a Taki kunoichi and jinchūriki of the Seven-Tails Chōmei, is captured by the Kakuzu and Hidan pair.',
    },
    period: SHIPPUDEN,
    arcId: 'arc-akatsuki-suppression',
    characterIds: ['char-fu', 'char-chomei', 'char-kakuzu', 'char-hidan'],
    factionIds: ['faction-akatsuki'],
    order: 0,
    canon: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['cercoterio', 'akatsuki'],
  },
  {
    id: 'ev-han-utakata-captured',
    worldId: 'world-naruto',
    title: { it: 'Le catture di Han e Utakata', en: 'The captures of Han and Utakata' },
    description: {
      it: "Fuori scena l'Akatsuki cattura anche Han, forza portante del Cinque Code Kokuō, e Utakata, forza portante del Sei Code Saiken. Nell'anime la cattura di Utakata è opera di Pain.",
      en: "Off-screen the Akatsuki also captures Han, jinchūriki of the Five-Tails Kokuō, and Utakata, jinchūriki of the Six-Tails Saiken. In the anime Utakata's capture is carried out by Pain.",
    },
    period: SHIPPUDEN,
    arcId: 'arc-akatsuki-suppression',
    characterIds: ['char-han', 'char-kokuo', 'char-utakata', 'char-saiken', 'char-pain'],
    factionIds: ['faction-akatsuki'],
    order: 0,
    canon: 'canon',
    referenceStatus: 'needs_verification',
    tags: ['cercoterio', 'akatsuki'],
  },
];
