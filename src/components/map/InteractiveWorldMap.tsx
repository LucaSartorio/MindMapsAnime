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
import type { Location, Route, WorldDataset } from '@/types';
import { useMapStore, useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { filterLocations } from '@/lib/filters';
import { worldShowsBoundaryHighlight } from '@/lib/worldMapPrefs';
import {
  MapNode,
  MapLayerNode,
  type MapNodeData,
  type MapLayerNodeData,
} from './MapNode';
import { MapEdge, type MapEdgeData } from './MapEdge';
import { WorldMapBackground } from './WorldMapBackground';
import { MapBoundaryOverlay } from './MapBoundaryOverlay';
import { MapLabelsLayer } from './MapLabelsLayer';

const NODE_TYPES: NodeTypes = {
  'map-node': MapNode,
  'map-layer': MapLayerNode,
};
const EDGE_TYPES: EdgeTypes = { 'map-edge': MapEdge };

interface InteractiveWorldMapProps {
  dataset: WorldDataset;
}

const FIT_VIEW_OPTIONS = { padding: 0.18, duration: 600 } as const;

export function InteractiveWorldMap(props: InteractiveWorldMapProps) {
  return (
    <ReactFlowProvider>
      <InteractiveWorldMapInner {...props} />
    </ReactFlowProvider>
  );
}

function InteractiveWorldMapInner({ dataset }: InteractiveWorldMapProps) {
  const locale = useLocaleStore((s) => s.locale);
  const activeMapLevelId = useMapStore((s) => s.activeMapLevelId);
  const selectedLocationId = useMapStore((s) => s.selectedLocationId);
  const selectedRouteId = useMapStore((s) => s.selectedRouteId);
  const filters = useMapStore((s) => s.filters);
  const visibleLayers = useMapStore((s) => s.visibleLayers);
  const viewportResetKey = useMapStore((s) => s.viewportResetKey);
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);
  const setHoveredBoundary = useMapStore((s) => s.setHoveredBoundary);
  const openLocationModal = useUiStore((s) => s.openLocationModal);
  const { fitView, setCenter, getZoom, fitBounds } = useReactFlow();

  const activeLevel = useMemo(
    () =>
      dataset.mapLevels.find((l) => l.id === activeMapLevelId) ??
      dataset.mapLevels[0],
    [dataset.mapLevels, activeMapLevelId],
  );

  // Locations del livello, filtrate + filtro layer (main/minor villages, special places)
  const visibleLocations = useMemo<Location[]>(() => {
    const base = dataset.locations.filter(
      (l) => l.mapLevelId === activeLevel.id,
    );
    const filtered = filterLocations(base, filters, dataset);
    return filtered.filter((l) => {
      if (l.type === 'village') {
        return l.importance === 'main'
          ? visibleLayers.mainVillages
          : visibleLayers.minorVillages;
      }
      return visibleLayers.specialPlaces;
    });
  }, [dataset, activeLevel.id, filters, visibleLayers]);

  const route: Route | undefined = useMemo(
    () => dataset.routes.find((r) => r.id === selectedRouteId),
    [dataset.routes, selectedRouteId],
  );
  const highlightedLocationIds = useMemo(
    () => new Set(route?.steps.map((s) => s.locationId) ?? []),
    [route],
  );

  // Nodi: layer di sfondo (z=0), layer confini (z=1), layer labels (z=2),
  // pin location (default React Flow).
  const nodes = useMemo<Node<MapNodeData | MapLayerNodeData>[]>(() => {
    const layerNodes: Node<MapLayerNodeData>[] = [
      {
        id: '__layer-background',
        type: 'map-layer',
        position: { x: 0, y: 0 },
        data: {
          width: activeLevel.width,
          height: activeLevel.height,
          z: 0,
          content: (
            <div
              className="relative"
              style={{ width: activeLevel.width, height: activeLevel.height }}
            >
              <WorldMapBackground level={activeLevel} dataset={dataset} />
            </div>
          ),
        },
        draggable: false,
        selectable: false,
        deletable: false,
        focusable: false,
        zIndex: -10,
        style: { pointerEvents: 'none' as const },
      },
      {
        id: '__layer-boundaries',
        type: 'map-layer',
        position: { x: 0, y: 0 },
        data: {
          width: activeLevel.width,
          height: activeLevel.height,
          z: 1,
          content: <MapBoundaryOverlay dataset={dataset} level={activeLevel} />,
        },
        draggable: false,
        selectable: false,
        deletable: false,
        focusable: false,
        zIndex: -5,
        style: { pointerEvents: 'none' as const },
      },
      {
        id: '__layer-labels',
        type: 'map-layer',
        position: { x: 0, y: 0 },
        data: {
          width: activeLevel.width,
          height: activeLevel.height,
          z: 2,
          content: <MapLabelsLayer dataset={dataset} level={activeLevel} />,
        },
        draggable: false,
        selectable: false,
        deletable: false,
        focusable: false,
        zIndex: -1,
        style: { pointerEvents: 'none' as const },
      },
    ];

    const pinNodes: Node<MapNodeData>[] = visibleLocations.map((loc) => ({
      id: loc.id,
      type: 'map-node',
      position: { x: loc.x, y: loc.y },
      data: {
        label: getLocalizedText(loc.localizedName, locale) || loc.name,
        type: loc.type,
        importance: loc.importance,
        selected: loc.id === selectedLocationId,
        highlighted: highlightedLocationIds.has(loc.id),
        hasSubMap: !!loc.subMapLevelId,
      },
      draggable: false,
      selectable: true,
    }));

    return [...layerNodes, ...pinNodes];
  }, [
    activeLevel,
    dataset,
    visibleLocations,
    selectedLocationId,
    highlightedLocationIds,
    locale,
  ]);

  const edges = useMemo<Edge<MapEdgeData>[]>(() => {
    if (!route || !filters.showRoutes) return [];
    // Canon check: usa `canonStatus` se presente, altrimenti `referenceStatus`
    // come proxy ("verified" → canon-like).
    const isCanonRoute = route.canonStatus
      ? route.canonStatus === 'canon'
      : route.referenceStatus === 'verified';
    if (isCanonRoute && !visibleLayers.routesCanon) return [];
    if (!isCanonRoute && !visibleLayers.routesNonCanon) return [];
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
          label: getLocalizedText(target.label, locale) || undefined,
          order: target.order,
        },
      });
    }
    return out;
  }, [route, dataset.locations, activeLevel.id, filters.showRoutes, visibleLayers, locale]);

  // fitView al cambio level
  useEffect(() => {
    const id = setTimeout(() => fitView(FIT_VIEW_OPTIONS), 80);
    return () => clearTimeout(id);
  }, [activeLevel.id, fitView]);

  // fitView su reset esplicito
  useEffect(() => {
    fitView(FIT_VIEW_OPTIONS);
  }, [viewportResetKey, fitView]);

  // fitBounds sui nodi del percorso selezionato
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
    const maxX = Math.max(...xs) + 220;
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

  // Centra sul luogo selezionato
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
    // ignora layer
    if (node.id.startsWith('__layer-')) return;
    setSelectedLocation(node.id);
    openLocationModal(node.id);
  }
  function handleNodeDoubleClick(_: unknown, node: Node) {
    if (node.id.startsWith('__layer-')) return;
    const loc = dataset.locations.find((l) => l.id === node.id);
    if (loc?.subMapLevelId) {
      setActiveMapLevel(loc.subMapLevelId);
    }
  }
  // Passando sopra un pin si rivela il confine della sua nazione/regione
  // (i confini minori sono nascosti finché non si passa sul loro POI).
  function handleNodeMouseEnter(_: unknown, node: Node) {
    if (node.id.startsWith('__layer-')) return;
    // Mondi con mappa illustrata (es. HxH) non usano l'overlay dei confini.
    if (!worldShowsBoundaryHighlight(dataset.world)) return;
    const loc = dataset.locations.find((l) => l.id === node.id);
    if (!loc?.boundaryId) return;
    // Solo i confini MINORI si rivelano passando sul POI; le grandi nazioni
    // si evidenziano passando sulla loro area (per non "allagare" la mappa
    // quando si scorre sui villaggi interni a una grande nazione).
    const b = dataset.boundaries?.find((x) => x.id === loc.boundaryId);
    if (b && b.type !== 'great_nation') setHoveredBoundary(loc.boundaryId);
  }
  function handleNodeMouseLeave(_: unknown, node: Node) {
    if (node.id.startsWith('__layer-')) return;
    setHoveredBoundary(null);
  }

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        fitView
        fitViewOptions={FIT_VIEW_OPTIONS}
        minZoom={0.2}
        maxZoom={3}
        defaultEdgeOptions={{ type: 'map-edge' }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        elementsSelectable
        zoomOnScroll
        zoomOnPinch
        panOnDrag
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={32}
          size={1}
          color="rgba(255,255,255,0.04)"
        />
        <Controls
          showInteractive={false}
          position="top-left"
          className="!shadow-none"
          style={{ marginTop: 56 }}
        />
        <MiniMap
          pannable
          zoomable
          position="top-right"
          maskColor="rgba(7,7,9,0.85)"
          nodeColor={(n) => {
            if (n.id.startsWith('__layer-')) return 'transparent';
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
