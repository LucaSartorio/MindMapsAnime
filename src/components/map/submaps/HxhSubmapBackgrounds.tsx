import type { MapLevel } from '@/types';

/**
 * Sfondi SVG dedicati per le sotto-mappe di Hunter x Hunter.
 *
 * Sono schemi stilizzati ma fedeli alla descrizione canonica di ciascun
 * luogo: la Torre Celeste come grattacielo conico a piani, il Monte Kukuroo
 * con la Porta della Prova, Greed Island come isola con le città-carta, il
 * Palazzo di East Gorteau come pianta simmetrica. Le forme sono allineate
 * alle coordinate dei pin definite in submapLocations.ts.
 *
 * Generati localmente (nessun asset ufficiale). viewBox = width×height del
 * relativo MapLevel.
 */

interface Props {
  level: MapLevel;
}

const GOLD = 'rgba(212,190,120,0.55)';
const GOLD_SOFT = 'rgba(212,190,120,0.22)';
const INK = 'rgba(255,255,255,0.30)';

function Frame({ level, children, label }: Props & { children: React.ReactNode; label: string }) {
  return (
    <svg
      viewBox={`0 0 ${level.width} ${level.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id={`bg-${level.id}`} cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor="#161a22" />
          <stop offset="100%" stopColor="#070709" />
        </radialGradient>
      </defs>
      <rect width={level.width} height={level.height} fill={`url(#bg-${level.id})`} />
      {children}
      <text
        x="32"
        y={level.height - 26}
        fill={INK}
        fontSize="15"
        fontFamily="JetBrains Mono, monospace"
      >
        ※ {label} · schema concettuale
      </text>
    </svg>
  );
}

/** Torre Celeste: grattacielo conico a piani (entrance↓, 200°, 251°↑). */
export function HeavensArenaBackground({ level }: Props) {
  const cx = level.width / 2;
  // Larghezza che si restringe salendo: terra in basso, vetta in alto.
  const floors: { y: number; halfBottom: number; halfTop: number }[] = [];
  const top = 180;
  const bottom = level.height - 120;
  const steps = 16;
  for (let i = 0; i < steps; i++) {
    const y0 = bottom - ((bottom - top) * i) / steps;
    const y1 = bottom - ((bottom - top) * (i + 1)) / steps;
    const halfBottom = 360 - (300 * i) / steps;
    const halfTop = 360 - (300 * (i + 1)) / steps;
    floors.push({ y: y0, halfBottom, halfTop });
    void y1;
  }
  return (
    <Frame level={level} label="Torre Celeste (Heavens Arena)">
      {/* Base / suolo */}
      <ellipse cx={cx} cy={level.height - 90} rx={420} ry={48} fill={GOLD_SOFT} />
      {/* Corpo della torre a piani */}
      {floors.map((f, i) => {
        const yTop = f.y - (level.height - 120 - 180) / 16;
        return (
          <polygon
            key={i}
            points={`${cx - f.halfBottom},${f.y} ${cx + f.halfBottom},${f.y} ${cx + f.halfTop},${yTop} ${cx - f.halfTop},${yTop}`}
            fill={i % 2 === 0 ? 'rgba(180,140,80,0.08)' : 'rgba(180,140,80,0.05)'}
            stroke={GOLD_SOFT}
            strokeWidth="1.5"
          />
        );
      })}
      {/* Guglia */}
      <polygon
        points={`${cx - 60},200 ${cx + 60},200 ${cx},150`}
        fill="rgba(180,140,80,0.10)"
        stroke={GOLD}
        strokeWidth="1.5"
      />
      {/* Marcatori dei piani chiave (allineati ai pin) */}
      <line x1={cx + 70} y1={760} x2={cx + 380} y2={760} stroke={GOLD} strokeWidth="1" strokeDasharray="4 6" />
      <text x={cx + 388} y={765} fill={GOLD} fontSize="20" fontFamily="Cinzel, serif">200F</text>
      <line x1={cx + 70} y1={280} x2={cx + 300} y2={280} stroke={GOLD} strokeWidth="1" strokeDasharray="4 6" />
      <text x={cx + 308} y={285} fill={GOLD} fontSize="20" fontFamily="Cinzel, serif">251F</text>
    </Frame>
  );
}

/** Monte Kukuroo: montagna con Porta della Prova a sinistra, sentiero in salita. */
export function ZoldyckEstateBackground({ level }: Props) {
  const { width: w, height: h } = level;
  return (
    <Frame level={level} label="Monte Kukuroo · Tenuta Zoldyck">
      {/* Profilo della montagna (sale da sinistra verso destra/alto) */}
      <path
        d={`M 0 ${h} L 120 ${h - 260} L 320 ${h - 360} L 560 ${h - 470} L 820 ${h - 540} L 1000 ${h - 560} L ${w} ${h - 520} L ${w} ${h} Z`}
        fill="rgba(120,140,110,0.08)"
        stroke={GOLD_SOFT}
        strokeWidth="2"
      />
      {/* Creste interne */}
      <path
        d={`M 200 ${h - 120} L 420 ${h - 320} L 700 ${h - 430} L 920 ${h - 500}`}
        fill="none"
        stroke={GOLD_SOFT}
        strokeWidth="1.5"
      />
      {/* Porta della Prova (grande cancello a sinistra) */}
      <g transform={`translate(180,540)`}>
        <rect x="-46" y="-150" width="40" height="170" fill="rgba(180,140,80,0.12)" stroke={GOLD} strokeWidth="2" />
        <rect x="6" y="-150" width="40" height="170" fill="rgba(180,140,80,0.12)" stroke={GOLD} strokeWidth="2" />
        <rect x="-52" y="-168" width="104" height="20" fill="rgba(180,140,80,0.15)" stroke={GOLD} strokeWidth="2" />
      </g>
      {/* Sentiero verso la residenza */}
      <path
        d="M 240 600 Q 440 470 560 420 T 860 380"
        fill="none"
        stroke={GOLD}
        strokeWidth="2"
        strokeDasharray="6 8"
      />
    </Frame>
  );
}

/** Greed Island: isola con coste, città-carta e porto. */
export function GreedIslandBackground({ level }: Props) {
  const { width: w, height: h } = level;
  return (
    <Frame level={level} label="Greed Island · il gioco">
      {/* Mare */}
      <rect width={w} height={h} fill="rgba(40,90,120,0.10)" />
      {/* Sagoma dell'isola */}
      <path
        d={`M 260 360 Q 240 200 440 170 Q 640 130 820 200 Q 1010 150 1100 320 Q 1170 470 1040 640
            Q 1080 770 900 800 Q 720 850 560 770 Q 400 800 320 660 Q 220 520 260 360 Z`}
        fill="rgba(150,170,110,0.12)"
        stroke={GOLD}
        strokeWidth="2.5"
      />
      {/* Rilievi interni */}
      <path d="M 520 360 Q 640 300 760 360" fill="none" stroke={GOLD_SOFT} strokeWidth="1.5" />
      <path d="M 560 520 Q 700 470 840 520" fill="none" stroke={GOLD_SOFT} strokeWidth="1.5" />
      {/* Segnaposto città (cerchietti agli ancoraggi dei pin) */}
      {[
        [400, 360],
        [780, 280],
        [520, 700],
        [950, 640],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="9" fill="none" stroke={GOLD} strokeWidth="2" />
      ))}
    </Frame>
  );
}

/** Palazzo di East Gorteau: pianta simmetrica con asse centrale. */
export function EastGorteauPalaceBackground({ level }: Props) {
  const cx = level.width / 2;
  return (
    <Frame level={level} label="Palazzo di East Gorteau">
      {/* Cinta muraria */}
      <rect x="160" y="160" width={level.width - 320} height={level.height - 300} rx="18"
        fill="rgba(180,140,80,0.04)" stroke={GOLD_SOFT} strokeWidth="2" strokeDasharray="10 8" />
      {/* Asse centrale (cancello → cortile → trono) */}
      <line x1={cx} y1={820} x2={cx} y2={240} stroke={GOLD_SOFT} strokeWidth="2" strokeDasharray="6 8" />
      {/* Cancello (basso) */}
      <rect x={cx - 70} y={780} width="140" height="40" fill="rgba(180,140,80,0.12)" stroke={GOLD} strokeWidth="2" />
      {/* Cortile (centro) */}
      <rect x={cx - 160} y={460} width="320" height="170" rx="10"
        fill="rgba(180,140,80,0.06)" stroke={GOLD_SOFT} strokeWidth="1.5" />
      {/* Sala del trono (alto, corpo principale) */}
      <rect x={cx - 130} y={210} width="260" height="160" rx="8"
        fill="rgba(180,140,80,0.10)" stroke={GOLD} strokeWidth="2" />
      <polygon points={`${cx - 130},210 ${cx + 130},210 ${cx},150`}
        fill="rgba(180,140,80,0.10)" stroke={GOLD} strokeWidth="1.5" />
      {/* Ala destra: sala del Gungi */}
      <rect x={860} y={300} width="160" height="120" rx="8"
        fill="rgba(180,140,80,0.06)" stroke={GOLD_SOFT} strokeWidth="1.5" />
      <line x1={cx + 130} y1={300} x2={860} y2={360} stroke={GOLD_SOFT} strokeWidth="1.5" strokeDasharray="5 7" />
    </Frame>
  );
}

/** Restituisce lo sfondo dedicato per lo slug della sotto-mappa HxH, se esiste. */
export function getHxhSubmapBackground(level: MapLevel): React.ReactElement | null {
  switch (level.slug) {
    case 'heavens-arena':
      return <HeavensArenaBackground level={level} />;
    case 'zoldyck-estate':
      return <ZoldyckEstateBackground level={level} />;
    case 'greed-island':
      return <GreedIslandBackground level={level} />;
    case 'east-gorteau-palace':
      return <EastGorteauPalaceBackground level={level} />;
    default:
      return null;
  }
}
