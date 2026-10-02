import { useState } from 'react';
import type { MapLevel, WorldDataset } from '@/types';

interface WorldMapBackgroundProps {
  level: MapLevel;
  dataset: WorldDataset;
}

/**
 * Sfondo della mappa.
 *
 * 1. Map level con asset `url` (es. world map PNG di riferimento) → <img>.
 *    Se l'immagine non è ancora stata copiata nel repo, `onError` mostra
 *    uno stato neutro (niente icona rotta).
 * 2. Sotto-mappa senza immagine → placeholder generico di sotto-mappa.
 * 3. Fallback → placeholder generico.
 *
 * Tutti i mondi disponibili hanno un'immagine per ogni livello: dove l'opera
 * non offre una mappa utilizzabile, è un SVG originale generato da
 * `scripts/mapgen/` (o `scripts/bleach-maps.py`). I placeholder restano per i
 * mondi futuri finché non ricevono le loro mappe.
 */
export function WorldMapBackground({ level, dataset }: WorldMapBackgroundProps) {
  const asset = level.backgroundAssetId
    ? dataset.assets.find((a) => a.id === level.backgroundAssetId)
    : undefined;

  const [imgFailed, setImgFailed] = useState(false);

  if (asset?.url && !imgFailed) {
    return (
      <img
        src={asset.url}
        alt={`Map · ${level.name}`}
        // È l'elemento più grande della rotta /map (LCP): niente lazy-load, e
        // priorità alta (è lo stesso URL precaricato dall'HTML statico).
        loading="eager"
        decoding="async"
        {...({ fetchpriority: 'high' } as Record<string, string>)}
        className="absolute inset-0 h-full w-full object-contain select-none pointer-events-none"
        draggable={false}
        onError={() => setImgFailed(true)}
      />
    );
  }

  // Immagine attesa ma non presente → stato neutro con istruzioni
  if (asset?.url && imgFailed) {
    return <MissingImagePlaceholder level={level} url={asset.url} />;
  }

  if (level.parentLevelId) {
    return <VillageSubmapPlaceholder level={level} />;
  }
  return <GenericPlaceholder level={level} />;
}

function MissingImagePlaceholder({
  level,
  url,
}: {
  level: MapLevel;
  url: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${level.width} ${level.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="missing-bg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#13151b" />
          <stop offset="100%" stopColor="#070709" />
        </radialGradient>
      </defs>
      <rect width={level.width} height={level.height} fill="url(#missing-bg)" />
      <rect
        x="30"
        y="30"
        width={level.width - 60}
        height={level.height - 60}
        rx="24"
        fill="none"
        stroke="rgba(212,190,120,0.2)"
        strokeWidth="1.5"
        strokeDasharray="8 10"
      />
      <text
        x={level.width / 2}
        y={level.height / 2 - 14}
        textAnchor="middle"
        fontSize="26"
        fontFamily="Cinzel, serif"
        fill="rgba(255,255,255,0.45)"
      >
        {level.name}
      </text>
      <text
        x={level.width / 2}
        y={level.height / 2 + 22}
        textAnchor="middle"
        fontSize="15"
        fontFamily="JetBrains Mono, monospace"
        fill="rgba(255,255,255,0.32)"
      >
        map image not found · copy: {url}
      </text>
    </svg>
  );
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
    </svg>
  );
}

function VillageSubmapPlaceholder({ level }: { level: MapLevel }) {
  return (
    <svg
      viewBox={`0 0 ${level.width} ${level.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id={`vbg-${level.id}`} cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#161a22" />
          <stop offset="100%" stopColor="#070709" />
        </radialGradient>
        <pattern
          id={`vgrid-${level.id}`}
          width="56"
          height="56"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M56 0 H0 V56"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width={level.width} height={level.height} fill={`url(#vbg-${level.id})`} />
      <rect width={level.width} height={level.height} fill={`url(#vgrid-${level.id})`} />
      {/* Cinta muraria stilizzata */}
      <ellipse
        cx={level.width / 2}
        cy={level.height / 2}
        rx={level.width / 2 - 60}
        ry={level.height / 2 - 50}
        fill="rgba(180,140,80,0.05)"
        stroke="rgba(212,190,120,0.35)"
        strokeWidth="2"
        strokeDasharray="10 8"
      />
      <text
        x="40"
        y={level.height - 26}
        fill="rgba(255,255,255,0.3)"
        fontSize="14"
        fontFamily="JetBrains Mono, monospace"
      >
        ※ {level.name} · schema concettuale · posizioni indicative
      </text>
    </svg>
  );
}
