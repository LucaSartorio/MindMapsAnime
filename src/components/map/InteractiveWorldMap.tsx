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

const NODE_TYPES: NodeTypes = { 'map-node': MapNode };
const EDGE_TYPES: EdgeTypes = { 'map-edge': MapEdge };

interface InteractiveWorldMapProps {
  dataset: WorldDataset;
}

/**
 * Canvas React Flow puro: nodi + edges + sfondo.
 * Nessun overlay UI qui dentro — i floating panel sono renderizzati dal
 * WorldLayout sopra il canvas con `pointer-events-none/auto`.
 *
 * Comportamento:
 *  - fitView all'avvio
 *  - fitView al cambio mapLevel
 *  - fitView al reset (viewportResetKey)
 *  - fitView ai nodi del percorso selezionato
 *  - click su nodo apre LocationDetailsModal (via store UI)
 *  - doppio click su nodo con sottomappa → cambia mapLevel
 */
export function InteractiveWorldMap(props: InteractiveWorldMapProps) {
  return (
    <ReactFlowProvider>
      <InteractiveWorldMapInner {...props} />
    </ReactFlowProvider>
  );
}

const FIT_VIEW_OPTIONS = { padding: 0.22, duration: 600 } as const;

function InteractiveWorldMapInner({ dataset }: InteractiveWorldMapProps) {
  const activeMapLevelId = useMapStore((s) => s.activeMapLevelId);
  const selectedLocationId = useMapStore((s) => s.selectedLocationId);
  const selectedRouteId = useMapStore((s) => s.selectedRouteId);
  const filters = useMapStore((s) => s.filters);
  const viewportResetKey = useMapStore((s) => s.viewportResetKey);
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);
  const openLocationModal = useUiStore((s) => s.openLocationModal);
  const { fitView, setCenter, getZoom, fitBounds } = useReactFlow();

  const activeLevel = useMemo(
    () =>
      dataset.mapLevels.find((l) => l.id === activeMapLevelId) ??
      dataset.mapLevels[0],
    [dataset.mapLevels, activeMapLevelId],
  );

  // Locations del livello corrente filtrate
  const visibleLocations = useMemo<Location[]>(() => {
    const base = dataset.locations.filter(
      (l) => l.mapLevelId === activeLevel.id,
    );
    return filterLocations(base, filters, dataset);
  }, [dataset, activeLevel.id, filters]);

  // Highlight derivato dalla route selezionata
  const route: Route | undefined = useMemo(
    () => dataset.routes.find((r) => r.id === selectedRouteId),
    [dataset.routes, selectedRouteId],
  );
  const highlightedLocationIds = useMemo(
    () => new Set(route?.steps.map((s) => s.locationId) ?? []),
    [route],
  );

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

  const edges = useMemo<Edge<MapEdgeData>[]>(() => {
    if (!route || !filters.showRoutes) return [];
    const steps = [...route.steps].sort((a, b) => a.order - b.order);
    const out: Edge<MapEdgeData>[] = [];
    for (let i = 0; i < steps.length - 1; i++) {
      const source = steps[i];
      const target = steps[i + 1];
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

  // fitView al cambio mapLevel o filtri principali
  useEffect(() => {
    const id = setTimeout(() => fitView(FIT_VIEW_OPTIONS), 80);
    return () => clearTimeout(id);
  }, [activeLevel.id, fitView]);

  // fitView su reset esplicito
  useEffect(() => {
    fitView(FIT_VIEW_OPTIONS);
  }, [viewportResetKey, fitView]);

  // fitBounds sui nodi del percorso selezionato (se almeno 2)
  useEffect(() => {
    if (!route) return;
    const stepLocs = route.steps
      .map((s) => dataset.locations.find((l) => l.id === s.locationId))
      .filter((l): l is Location => !!l)
      .filter((l) => l.mapLevelId === activeLevel.id);
    if (stepLocs.length < 2) return;
    const xs = stepLocs.map((l) => l.x);
    const ys = stepLocs.map((l) => l.y);
    const minX = Math.min(...xs) - 80;
    const maxX = Math.max(...xs) + 220; // padding extra a destra per le label
    const minY = Math.min(...ys) - 80;
    const maxY = Math.max(...ys) + 80;
    const id = setTimeout(
      () =>
        fitBounds(
          { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
          { padding: 0.2, duration: 700 },
        ),
      80,
    );
    return () => clearTimeout(id);
  }, [route, dataset.locations, activeLevel.id, fitBounds]);

  // Centra sul luogo selezionato (smooth)
  useEffect(() => {
    if (!selectedLocationId) return;
    const loc = visibleLocations.find((l) => l.id === selectedLocationId);
    if (!loc) return;
    const id = setTimeout(() => {
      setCenter(loc.x + 40, loc.y, {
        zoom: Math.max(getZoom(), 1.1),
        duration: 700,
      });
    }, 50);
    return () => clearTimeout(id);
  }, [selectedLocationId, visibleLocations, setCenter, getZoom]);

  function handleNodeClick(_: unknown, node: Node) {
    setSelectedLocation(node.id);
    openLocationModal(node.id);
  }
  function handleNodeDoubleClick(_: unknown, node: Node) {
    const loc = dataset.locations.find((l) => l.id === node.id);
    if (loc?.subMapLevelId) {
      setActiveMapLevel(loc.subMapLevelId);
    }
  }

  return (
    <div className="relative h-full w-full">
      {/* Sfondo SVG / immagine: scalato sul viewport React Flow */}
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
        fitViewOptions={FIT_VIEW_OPTIONS}
        minZoom={0.25}
        maxZoom={2.5}
        defaultEdgeOptions={{ type: 'map-edge' }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        elementsSelectable
        panOnScroll
        zoomOnPinch
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={32}
          size={1}
          color="rgba(255,255,255,0.05)"
        />
        {/* Zoom controls: a sinistra, sotto il cluster top-left della WorldLayout */}
        <Controls
          showInteractive={false}
          position="top-left"
          className="!shadow-none"
          style={{ marginTop: 56 }}
        />
        {/* MiniMap: in alto a destra, sotto il cluster MapControls */}
        <MiniMap
          pannable
          zoomable
          position="top-right"
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
          style={{ marginTop: 56 }}
        />
      </ReactFlow>
    </div>
  );
}
