import { useEffect, useMemo } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type EdgeTypes,
  type Node,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type {
  Location,
  Route,
  WorldDataset,
} from '@/types';
import { useMapStore, useUiStore } from '@/store';
import { filterLocations } from '@/lib/filters';
import { MapNode, type MapNodeData } from './MapNode';
import { MapEdge, type MapEdgeData } from './MapEdge';
import { WorldMapBackground } from './WorldMapBackground';
import { MapLegend } from './MapLegend';
import { MapLevelSwitcher } from './MapLevelSwitcher';
import { MapControls } from './MapControls';
import { RouteOverlay } from './RouteOverlay';

const NODE_TYPES: NodeTypes = { 'map-node': MapNode };
const EDGE_TYPES: EdgeTypes = { 'map-edge': MapEdge };

interface InteractiveWorldMapProps {
  dataset: WorldDataset;
}

/** Wrapper richiesto da React Flow per usare gli hook del provider. */
export function InteractiveWorldMap(props: InteractiveWorldMapProps) {
  return (
    <ReactFlowProvider>
      <InteractiveWorldMapInner {...props} />
    </ReactFlowProvider>
  );
}

function InteractiveWorldMapInner({ dataset }: InteractiveWorldMapProps) {
  const activeMapLevelId = useMapStore((s) => s.activeMapLevelId);
  const selectedLocationId = useMapStore((s) => s.selectedLocationId);
  const selectedRouteId = useMapStore((s) => s.selectedRouteId);
  const filters = useMapStore((s) => s.filters);
  const viewportResetKey = useMapStore((s) => s.viewportResetKey);
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);
  const setRightPanel = useUiStore((s) => s.setRightPanel);
  const { fitView, setCenter, getZoom } = useReactFlow();

  // Determina map level corrente
  const activeLevel = useMemo(
    () =>
      dataset.mapLevels.find((l) => l.id === activeMapLevelId) ??
      dataset.mapLevels[0],
    [dataset.mapLevels, activeMapLevelId],
  );

  // Locations del livello corrente, filtrate
  const visibleLocations = useMemo<Location[]>(() => {
    const base = dataset.locations.filter(
      (l) => l.mapLevelId === activeLevel.id,
    );
    return filterLocations(base, filters, dataset);
  }, [dataset, activeLevel.id, filters]);

  // Highlight ID derivati dalla route selezionata
  const route: Route | undefined = useMemo(
    () => dataset.routes.find((r) => r.id === selectedRouteId),
    [dataset.routes, selectedRouteId],
  );
  const highlightedLocationIds = useMemo(
    () => new Set(route?.steps.map((s) => s.locationId) ?? []),
    [route],
  );

  // Costruzione nodi React Flow (memo)
  const nodes = useMemo<Node<MapNodeData>[]>(() => {
    return visibleLocations.map((loc) => ({
      id: loc.id,
      type: 'map-node',
      position: { x: loc.x, y: loc.y },
      data: {
        label: loc.name,
        type: loc.type,
        importance: loc.importance,
        selected: loc.id === selectedLocationId,
        highlighted: highlightedLocationIds.has(loc.id),
        hasSubMap: !!loc.subMapLevelId,
      },
      draggable: false,
      selectable: true,
    }));
  }, [visibleLocations, selectedLocationId, highlightedLocationIds]);

  // Edges: tracciamo solo la route selezionata se filters.showRoutes attivo
  const edges = useMemo<Edge<MapEdgeData>[]>(() => {
    if (!route || !filters.showRoutes) return [];
    const steps = [...route.steps].sort((a, b) => a.order - b.order);
    const out: Edge<MapEdgeData>[] = [];
    for (let i = 0; i < steps.length - 1; i++) {
      const source = steps[i];
      const target = steps[i + 1];
      // Disegnamo l'edge solo se entrambi gli step appartengono al map level corrente.
      const sourceLoc = dataset.locations.find((l) => l.id === source.locationId);
      const targetLoc = dataset.locations.find((l) => l.id === target.locationId);
      if (!sourceLoc || !targetLoc) continue;
      if (
        sourceLoc.mapLevelId !== activeLevel.id ||
        targetLoc.mapLevelId !== activeLevel.id
      )
        continue;
      out.push({
        id: `${route.id}-${source.order}-${target.order}`,
        type: 'map-edge',
        source: sourceLoc.id,
        target: targetLoc.id,
        data: {
          color: route.color,
          label: target.label,
          order: target.order,
        },
      });
    }
    return out;
  }, [route, dataset.locations, activeLevel.id, filters.showRoutes]);

  // Quando cambia la selezione di location, centriamo la viewport
  useEffect(() => {
    if (!selectedLocationId) return;
    const loc = visibleLocations.find((l) => l.id === selectedLocationId);
    if (!loc) return;
    // Centriamo con un piccolo delay per lasciare a React Flow il tempo di renderizzare.
    const id = setTimeout(() => {
      setCenter(loc.x + 40, loc.y, { zoom: Math.max(getZoom(), 1), duration: 700 });
    }, 50);
    return () => clearTimeout(id);
  }, [selectedLocationId, visibleLocations, setCenter, getZoom]);

  // Reset viewport esterno
  useEffect(() => {
    fitView({ padding: 0.18, duration: 500 });
    // dipende esplicitamente da viewportResetKey per reagire al pulsante
  }, [viewportResetKey, fitView, activeLevel.id]);

  // Quando l'utente cambia map level, fitView automatico
  useEffect(() => {
    const id = setTimeout(() => fitView({ padding: 0.2, duration: 600 }), 80);
    return () => clearTimeout(id);
  }, [activeLevel.id, fitView]);

  function handleNodeClick(_: unknown, node: Node) {
    setSelectedLocation(node.id);
    setRightPanel(true);
  }

  function handleNodeDoubleClick(_: unknown, node: Node) {
    const loc = dataset.locations.find((l) => l.id === node.id);
    if (loc?.subMapLevelId) {
      setActiveMapLevel(loc.subMapLevelId);
    }
  }

  return (
    <div className="relative h-full w-full">
      {/* Sfondo SVG / immagine */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <WorldMapBackground level={activeLevel} dataset={dataset} />
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        fitView
        minZoom={0.3}
        maxZoom={2.5}
        defaultEdgeOptions={{ type: 'map-edge' }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        elementsSelectable
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={32}
          size={1}
          color="rgba(255,255,255,0.06)"
        />
        <Controls showInteractive={false} className="!shadow-none" />
        <MiniMap
          pannable
          zoomable
          maskColor="rgba(7,7,9,0.85)"
          nodeColor={(n) => {
            const d = n.data as MapNodeData;
            return d.selected
              ? '#ff8311'
              : d.highlighted
                ? '#ffa654'
                : '#1f9aff';
          }}
          nodeStrokeColor="#0c0d11"
        />
      </ReactFlow>

      {/* Overlay UI: in alto a sinistra → level switcher, in alto a destra → controls */}
      <div className="pointer-events-none absolute inset-0 p-3 sm:p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="pointer-events-auto">
            <MapLevelSwitcher
              levels={dataset.mapLevels}
              activeId={activeLevel.id}
              onChange={setActiveMapLevel}
            />
          </div>
          <div className="pointer-events-auto">
            <MapControls />
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 flex-wrap">
          <div className="pointer-events-auto">
            <RouteOverlay dataset={dataset} />
          </div>
          <div className="pointer-events-auto hidden lg:block">
            <MapLegend />
          </div>
        </div>
      </div>
    </div>
  );
}
