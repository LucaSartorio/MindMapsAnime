import type { MapLevel, Nation, WorldDataset } from '@/types';

interface WorldMapBackgroundProps {
  level: MapLevel;
  dataset: WorldDataset;
}

/**
 * Sfondo della mappa.
 * Quando un MapLevel ha un asset valido (con url) lo renderizziamo come immagine.
 * Altrimenti generiamo uno sfondo SVG concettuale e stilizzato, derivato dalle
 * nazioni del dataset. NON è una mappa ufficiale, solo un placeholder.
 */
export function WorldMapBackground({ level, dataset }: WorldMapBackgroundProps) {
  const asset = level.backgroundAssetId
    ? dataset.assets.find((a) => a.id === level.backgroundAssetId)
    : undefined;

  if (asset?.url) {
    return (
      <img
        src={asset.url}
        alt={`Mappa di ${level.name}`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />
    );
  }

  // Fallback: SVG placeholder
  if (level.slug === 'konoha') {
    return <KonohaPlaceholder level={level} />;
  }
  return <ElementalNationsPlaceholder level={level} dataset={dataset} />;
}

function ElementalNationsPlaceholder({
  level,
  dataset,
}: {
  level: MapLevel;
  dataset: WorldDataset;
}) {
  // Regioni indicative per le Nazioni Elementali Naruto.
  // Pure stilizzazione, NON corrisponde a una mappa ufficiale.
  const regions: { id: string; d: string; nation?: Nation }[] = [
    {
      id: 'r-water',
      d: 'M1100 150 q150 -40 250 60 q70 140 -40 220 q-160 80 -260 -40 q-80 -140 50 -240 Z',
      nation: dataset.nations.find((n) => n.id === 'nation-water'),
    },
    {
      id: 'r-earth',
      d: 'M120 120 q200 -60 380 80 q40 140 -120 220 q-200 60 -320 -60 q-80 -140 60 -240 Z',
      nation: dataset.nations.find((n) => n.id === 'nation-earth'),
    },
    {
      id: 'r-lightning',
      d: 'M1000 470 q160 -40 280 100 q60 160 -100 240 q-200 60 -300 -80 q-60 -160 120 -260 Z',
      nation: dataset.nations.find((n) => n.id === 'nation-lightning'),
    },
    {
      id: 'r-wind',
      d: 'M300 540 q160 -40 320 80 q60 140 -120 240 q-220 80 -340 -40 q-100 -160 140 -280 Z',
      nation: dataset.nations.find((n) => n.id === 'nation-wind'),
    },
    {
      id: 'r-fire',
      d: 'M620 380 q220 -50 360 90 q60 180 -160 280 q-260 80 -360 -80 q-100 -180 160 -290 Z',
      nation: dataset.nations.find((n) => n.id === 'nation-fire'),
    },
  ];

  return (
    <svg
      viewBox={`0 0 ${level.width} ${level.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="bg-radial" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#13151b" />
          <stop offset="100%" stopColor="#070709" />
        </radialGradient>
        <pattern
          id="bg-cross"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0 V80 M0 40 H80"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect
        width={level.width}
        height={level.height}
        fill="url(#bg-radial)"
      />
      <rect
        width={level.width}
        height={level.height}
        fill="url(#bg-cross)"
      />
      {/* Bordo continente */}
      <rect
        x="30"
        y="30"
        width={level.width - 60}
        height={level.height - 60}
        rx="32"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1.5"
        strokeDasharray="6 8"
      />
      {regions.map((r) =>
        r.nation ? (
          <g key={r.id} opacity="0.55">
            <path
              d={r.d}
              fill={r.nation.color ?? '#3a3f4f'}
              fillOpacity="0.15"
              stroke={r.nation.color ?? '#5b6275'}
              strokeOpacity="0.5"
              strokeWidth="1.5"
            />
          </g>
        ) : null,
      )}
      {regions.map((r) =>
        r.nation ? (
          <text
            key={`${r.id}-label`}
            x={parseFloat(r.d.split(' ')[1])}
            y={parseFloat(r.d.split(' ')[2]) + 40}
            fill={r.nation.color ?? '#b6bbcb'}
            fillOpacity="0.7"
            fontSize="20"
            fontFamily="Cinzel, serif"
            textAnchor="start"
          >
            {r.nation.name}
          </text>
        ) : null,
      )}
      {/* Indicazione confini "non ufficiali" */}
      <text
        x="40"
        y={level.height - 28}
        fill="rgba(255,255,255,0.35)"
        fontSize="14"
        fontFamily="JetBrains Mono, monospace"
      >
        ※ placeholder · confini indicativi · non ufficiali
      </text>
    </svg>
  );
}

function KonohaPlaceholder({ level }: { level: MapLevel }) {
  return (
    <svg
      viewBox={`0 0 ${level.width} ${level.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="leaf-grad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#1a2d20" />
          <stop offset="100%" stopColor="#070709" />
        </radialGradient>
        <pattern
          id="leaf-pat"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 0 C40 18, 40 42, 30 60 C20 42, 20 18, 30 0"
            fill="rgba(140,200,140,0.05)"
          />
        </pattern>
      </defs>
      <rect
        width={level.width}
        height={level.height}
        fill="url(#leaf-grad)"
      />
      <rect
        width={level.width}
        height={level.height}
        fill="url(#leaf-pat)"
      />
      {/* Mura del villaggio */}
      <ellipse
        cx={level.width / 2}
        cy={level.height / 2}
        rx={level.width / 2 - 60}
        ry={level.height / 2 - 60}
        fill="rgba(180,140,80,0.07)"
        stroke="rgba(212,190,120,0.45)"
        strokeWidth="2"
        strokeDasharray="8 6"
      />
      {/* Roccia degli Hokage stilizzata */}
      <path
        d="M 100 240 q 220 -120 1000 -10 q 30 70 -40 90 H 100 Z"
        fill="rgba(180,140,80,0.1)"
        stroke="rgba(212,190,120,0.3)"
        strokeWidth="1.5"
      />
      <text
        x="160"
        y="220"
        fill="rgba(212,190,120,0.6)"
        fontSize="14"
        fontFamily="JetBrains Mono, monospace"
      >
        Hokage Rock (concept)
      </text>
      <text
        x="40"
        y={level.height - 28}
        fill="rgba(255,255,255,0.35)"
        fontSize="14"
        fontFamily="JetBrains Mono, monospace"
      >
        ※ schema concettuale di Konoha · posizioni indicative
      </text>
    </svg>
  );
}
