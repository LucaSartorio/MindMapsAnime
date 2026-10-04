import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getEntityDisplayName } from '@/utils/localization';
import { areSpouses, familyTree, parentsOf } from '@/lib/familyTree';

const BOX_W = 132;
const BOX_H = 30;
const GAP_X = 12;
const ROW_GAP = 34;
const PAD = 8;
const MAX_CHARS = 18;
const clip = (s: string) => (s.length > MAX_CHARS ? `${s.slice(0, MAX_CHARS - 1)}…` : s);

interface Box {
  id: string;
  x: number;
  y: number;
}

/**
 * Albero genealogico in SVG. Ogni riquadro è un link (`hrefFor`) alla pagina del
 * parente; `onSelect` permette alla scheda di aprire il modale invece di navigare.
 * Righe: nonni → genitori → fratelli · personaggio · coniugi → figli → nipoti.
 */
export function FamilyTreeSvg({
  dataset,
  characterId,
  hrefFor,
  onSelect,
}: {
  dataset: WorldDataset;
  characterId: string;
  hrefFor: (id: string) => string | undefined;
  onSelect?: (id: string) => void;
}) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const tree = familyTree(dataset, characterId);
  if (!tree) return null;
  const byId = new Map(dataset.characters.map((c) => [c.id, c]));
  const name = (id: string) => (byId.get(id) ? getEntityDisplayName(byId.get(id)!, locale) : id);

  const rows = [
    tree.grandparents,
    tree.parents,
    [...tree.siblings, tree.self, ...tree.spouses],
    tree.children,
    tree.grandchildren,
  ].filter((r) => r.length > 0);
  const widest = Math.max(...rows.map((r) => r.length));
  const width = PAD * 2 + widest * BOX_W + (widest - 1) * GAP_X;
  const height = PAD * 2 + rows.length * BOX_H + (rows.length - 1) * ROW_GAP;
  const boxes: Box[][] = rows.map((row, ri) => {
    const rowW = row.length * BOX_W + (row.length - 1) * GAP_X;
    const x0 = (width - rowW) / 2;
    return row.map((id, i) => ({ id, x: x0 + i * (BOX_W + GAP_X), y: PAD + ri * (BOX_H + ROW_GAP) }));
  });

  // Connettori fra righe consecutive: ogni figlio è collegato ai suoi genitori
  // della riga sopra (una barra per gruppo di fratelli).
  const lines: string[] = [];
  for (let r = 0; r < boxes.length - 1; r++) {
    const groups = new Map<string, { parents: Box[]; kids: Box[] }>();
    for (const kid of boxes[r + 1]) {
      const ps = boxes[r].filter((b) => parentsOf(dataset, kid.id).includes(b.id));
      if (!ps.length) continue;
      const key = ps.map((b) => b.id).sort().join('|');
      const grp = groups.get(key) ?? { parents: ps, kids: [] };
      grp.kids.push(kid);
      groups.set(key, grp);
    }
    [...groups.values()].forEach(({ parents, kids }, gi) => {
      const midY = parents[0].y + BOX_H + ROW_GAP / 2 + (gi % 3) * 4 - 4;
      const xs = [...parents, ...kids].map((b) => b.x + BOX_W / 2);
      lines.push(`M${Math.min(...xs)},${midY} H${Math.max(...xs)}`);
      for (const b of parents) lines.push(`M${b.x + BOX_W / 2},${b.y + BOX_H} V${midY}`);
      for (const b of kids) lines.push(`M${b.x + BOX_W / 2},${midY} V${b.y}`);
    });
  }
  // Coniugi: linea tratteggiata fra riquadri vicini della stessa riga.
  const marriage: string[] = [];
  for (const row of boxes)
    for (let i = 0; i + 1 < row.length; i++)
      if (areSpouses(dataset, row[i].id, row[i + 1].id))
        marriage.push(`M${row[i].x + BOX_W},${row[i].y + BOX_H / 2} H${row[i + 1].x}`);

  return (
    <div className="overflow-x-auto rounded-lg border border-ink-700/60 bg-ink-950/60 p-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="block max-w-none font-sans"
        aria-label={t('familyTree.aria', { name: name(tree.self) })}
        role="group"
      >
        <path d={lines.join(' ')} fill="none" className="stroke-ink-600" strokeWidth={1.5} />
        <path d={marriage.join(' ')} fill="none" className="stroke-ember-500" strokeWidth={1.5} strokeDasharray="4 3" />
        {boxes.flat().map((b) => {
          const isSelf = b.id === tree.self;
          const label = name(b.id);
          const body = (
            <>
              <rect
                x={b.x}
                y={b.y}
                width={BOX_W}
                height={BOX_H}
                rx={6}
                className={isSelf ? 'fill-ember-900 stroke-ember-500' : 'fill-ink-900 stroke-ink-600'}
                strokeWidth={isSelf ? 1.5 : 1}
              />
              <text
                x={b.x + BOX_W / 2}
                y={b.y + BOX_H / 2 + 4}
                textAnchor="middle"
                fontSize={12}
                fontWeight={isSelf ? 700 : 400}
                className={isSelf ? 'fill-ember-100' : 'fill-ink-100'}
              >
                {clip(label)}
              </text>
              <title>{label}</title>
            </>
          );
          const href = isSelf ? undefined : hrefFor(b.id);
          if (!href) return <g key={b.id}>{body}</g>;
          return (
            <a
              key={b.id}
              href={href}
              className="cursor-pointer [&_rect]:hover:stroke-chakra-400 focus:outline-none [&_rect]:focus-visible:stroke-chakra-300"
              onClick={(e) => {
                if (!onSelect) return;
                e.preventDefault();
                onSelect(b.id);
              }}
            >
              {body}
            </a>
          );
        })}
      </svg>
    </div>
  );
}
