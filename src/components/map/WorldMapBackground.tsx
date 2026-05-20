import type { MapLevel, WorldDataset } from '@/types';

interface WorldMapBackgroundProps {
  level: MapLevel;
  dataset: WorldDataset;
}

/**
 * Sfondo della mappa. Tre comportamenti possibili:
 *
 * 1. Asset registrato con `url` → carica l'immagine/SVG (es. Naruto World Map).
 * 2. Map level "konoha" → placeholder SVG concettuale del villaggio.
 * 3. Fallback → placeholder generico con label "no map".
 *
 * Il container è scalato per condividere il viewBox della mappa logica.
 * Tutti i layer (boundaries, labels, React Flow nodi) si allineano usando
 * lo stesso sistema coordinate.
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
        className="absolute inset-0 h-full w-full object-contain select-none pointer-events-none"
        draggable={false}
      />
    );
  }

  if (level.slug === 'konoha') {
    return <KonohaPlaceholder level={level} />;
  }
  return <GenericPlaceholder level={level} />;
}

function GenericPlaceholder({ level }: { level: MapLevel }) {
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
      </defs>
      <rect width={level.width} height={level.height} fill="url(#bg-radial)" />
      <text
        x={level.width / 2}
        y={level.height / 2}
        textAnchor="middle"
        fontSize="22"
        fontFamily="JetBrains Mono, monospace"
        fill="rgba(255,255,255,0.3)"
      >
        no map asset
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
      <rect width={level.width} height={level.height} fill="url(#leaf-grad)" />
      <rect width={level.width} height={level.height} fill="url(#leaf-pat)" />
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
