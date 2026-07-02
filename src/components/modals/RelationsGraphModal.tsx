import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Character, WorldDataset } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/cn';
import { useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getEntityDisplayName } from '@/utils/localization';
import { findCharacter } from '@/lib/entities';

interface RelationsGraphModalProps {
  dataset: WorldDataset;
  characterId: string;
}

type RelKind = 'family' | 'mentor' | 'student' | 'ally' | 'enemy' | 'other';

const REL_COLOR: Record<RelKind, string> = {
  family: '#c084fc',
  mentor: '#38bdf8',
  student: '#2dd4bf',
  ally: '#22c55e',
  enemy: '#ef4444',
  other: '#94a3b8',
};

interface RelNodeData {
  name: string;
  isCenter?: boolean;
  color?: string;
  [key: string]: unknown;
}

function RelNode({ data }: NodeProps) {
  const d = data as RelNodeData;
  return (
    <div
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-medium shadow-panel',
        d.isCenter
          ? 'border-chakra-300 bg-chakra-600 text-white'
          : 'cursor-pointer border-ink-600 bg-ink-800 text-ink-100',
      )}
      style={!d.isCenter && d.color ? { borderColor: d.color } : undefined}
    >
      <Handle type="target" position={Position.Top} className="!pointer-events-none !opacity-0" />
      {d.name}
      <Handle type="source" position={Position.Bottom} className="!pointer-events-none !opacity-0" />
    </div>
  );
}

const NODE_TYPES: NodeTypes = { 'rel-node': RelNode };

interface Connection {
  char: Character;
  kind: RelKind;
  label: string;
}

/**
 * Modalità Relazioni: grafo navigabile dei legami di un personaggio.
 *
 * Il grafo (React Flow) è la rappresentazione VISIVA (aria-hidden, non
 * focusabile). L'interazione accessibile passa dall'elenco sotto: ogni legame è
 * un pulsante che ri-centra il grafo su quel personaggio (tastiera/screen
 * reader). Mostra 1 livello per volta per evitare il caos su tanti personaggi.
 */
export function RelationsGraphModal({ dataset, characterId }: RelationsGraphModalProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const close = useUiStore((s) => s.closeModal);
  const openCharacter = useUiStore((s) => s.openCharacterModal);
  const [focusId, setFocusId] = useState(characterId);

  const focus = findCharacter(dataset, focusId);

  const connections = useMemo<Connection[]>(() => {
    if (!focus) return [];
    const out: Connection[] = [];
    const seen = new Set<string>([focus.id]);
    const add = (ids: string[] | undefined, kind: RelKind, label: string) => {
      for (const id of ids ?? []) {
        if (seen.has(id)) continue;
        const c = findCharacter(dataset, id);
        if (!c) continue;
        seen.add(id);
        out.push({ char: c, kind, label });
      }
    };
    add(focus.family, 'family', t('modals.relations.family'));
    add(focus.teachers, 'mentor', t('modals.relations.mentor'));
    add(focus.students, 'student', t('modals.relations.student'));
    add(focus.allies, 'ally', t('modals.relations.ally'));
    add(focus.enemies, 'enemy', t('modals.relations.enemy'));
    for (const r of focus.relationships ?? []) {
      if (seen.has(r.targetCharacterId)) continue;
      const c = findCharacter(dataset, r.targetCharacterId);
      if (!c) continue;
      seen.add(r.targetCharacterId);
      out.push({ char: c, kind: 'other', label: r.label || t('modals.relations.other') });
    }
    return out;
  }, [focus, dataset, t]);

  const nodes = useMemo<Node<RelNodeData>[]>(() => {
    if (!focus) return [];
    // Raggio proporzionale al numero di legami: con tanti nodi il cerchio si
    // allarga così non si accavallano (fitView riporta tutto in vista).
    const R = Math.max(230, connections.length * 13);
    const center: Node<RelNodeData> = {
      id: focus.id,
      type: 'rel-node',
      position: { x: 0, y: 0 },
      data: { name: getEntityDisplayName(focus, locale) || focus.name, isCenter: true },
      draggable: false,
    };
    const ring = connections.map((c, i) => {
      const angle = (2 * Math.PI * i) / Math.max(1, connections.length) - Math.PI / 2;
      return {
        id: c.char.id,
        type: 'rel-node' as const,
        position: { x: Math.cos(angle) * R, y: Math.sin(angle) * R },
        data: {
          name: getEntityDisplayName(c.char, locale) || c.char.name,
          color: REL_COLOR[c.kind],
        },
        draggable: false,
      };
    });
    return [center, ...ring];
  }, [focus, connections, locale]);

  const edges = useMemo<Edge[]>(() => {
    if (!focus) return [];
    return connections.map((c) => ({
      id: `${focus.id}--${c.char.id}`,
      source: focus.id,
      target: c.char.id,
      label: c.label,
      labelBgPadding: [4, 2],
      labelStyle: { fill: '#e4e7f0', fontSize: 10 },
      labelBgStyle: { fill: '#0c0d11', fillOpacity: 0.85 },
      style: { stroke: REL_COLOR[c.kind], strokeWidth: 1.5 },
    }));
  }, [focus, connections]);

  if (!focus) {
    return (
      <Modal open onClose={close} title={t('modals.notFound')} size="sm">
        <p>{t('modals.invalidRef')}</p>
      </Modal>
    );
  }

  const focusName = getEntityDisplayName(focus, locale) || focus.name;

  return (
    <Modal
      open
      onClose={close}
      placement="center"
      size="xl"
      eyebrow={t('modals.relations.title')}
      title={focusName}
      footer={
        <>
          <Button variant="ghost" onClick={() => openCharacter(focus.id)}>
            {t('modals.relations.openCard')}
          </Button>
          <Button variant="primary" onClick={close}>
            {t('modals.close')}
          </Button>
        </>
      }
    >
      <p className="-mt-1 text-xs text-ink-400">{t('modals.relations.subtitle')}</p>

      {/* Grafo: rappresentazione visiva. Non focusabile / aria-hidden: l'accesso
          da tastiera passa dall'elenco sotto. */}
      <div
        aria-hidden
        className="h-72 overflow-hidden rounded-lg border border-ink-700/60 bg-ink-950/40"
      >
        <ReactFlow
          key={focusId}
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.3}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          panOnDrag
          zoomOnScroll
          proOptions={{ hideAttribution: true }}
          onNodeClick={(_, node) => {
            if (node.id !== focusId) setFocusId(node.id);
          }}
        >
          <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="rgba(255,255,255,0.05)" />
        </ReactFlow>
      </div>

      {/* Elenco accessibile: percorso tastiera/screen reader. */}
      <section aria-label={t('modals.relations.list')}>
        {connections.length === 0 ? (
          <p className="text-sm text-ink-400">{t('modals.relations.empty')}</p>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {connections.map((c) => (
              <li key={c.char.id}>
                <button
                  type="button"
                  onClick={() => setFocusId(c.char.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-600/60 bg-ink-800/60 py-1 pl-1.5 pr-2.5 text-xs text-ink-100 transition hover:border-chakra-500/60 hover:text-white"
                >
                  <span
                    aria-hidden
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: REL_COLOR[c.kind] }}
                  />
                  <span className="font-medium">
                    {getEntityDisplayName(c.char, locale) || c.char.name}
                  </span>
                  <span className="text-ink-400">· {c.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Modal>
  );
}
