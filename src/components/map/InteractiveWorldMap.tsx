import { useEffect, useMemo } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useViewport,
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
import { selectVisibleLocations } from '@/lib/filters';
import { clusterLocations, spreadOverlappingPins } from '@/lib/clusterPins';
import { buildWorldGraph, relatedPlaceIds } from '@/lib/graph';
import { MapRelationsOverlay } from './MapRelationsOverlay';
import { worldShowsBoundaryHighlight } from '@/lib/worldMapPrefs';
import {
  MapNode,
  MapLayerNode,
  type MapNodeData,
  type MapLayerNodeData,
} from './MapNode';
import { MapClusterNode, type MapClusterNodeData } from './MapClusterNode';
import { MapEdge, type MapEdgeData } from './MapEdge';
import { WorldMapBackground } from './WorldMapBackground';
import { MapBoundaryOverlay } from './MapBoundaryOverlay';
import { MapLabelsLayer } from './MapLabelsLayer';

const NODE_TYPES: NodeTypes = {
  'map-node': MapNode,
  'map-layer': MapLayerNode,
  'map-cluster': MapClusterNode,
};
const EDGE_TYPES: EdgeTypes = { 'map-edge': MapEdge };

interface InteractiveWorldMapProps {
  dataset: WorldDataset;
}

const FIT_VIEW_OPTIONS = { padding: 0.18, duration: 600 } as const;

/**
 * Oltre questo zoom il clustering si scioglie del tutto: a zoom (quasi) massimo
 * si vedono SEMPRE tutti i pin, così i gruppi di luoghi troppo vicini per
 * separarsi con la griglia (es. Cocoyashi/Arlong in One Piece) non restano mai
 * "intrappolati" in un badge che non si apre. `maxZoom` del canvas è 3.
 */
const CLUSTER_OFF_ZOOM = 2.6;

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
  const resetSelections = useMapStore((s) => s.resetSelections);
  const setHoveredBoundary = useMapStore((s) => s.setHoveredBoundary);
  const openLocationModal = useUiStore((s) => s.openLocationModal);
  const { fitView, setCenter, getZoom, fitBounds } = useReactFlow();
  // Zoom corrente per il clustering. Quantizzato a passi di 0.05 così i cluster
  // si ricalcolano solo a soglie discrete (non a ogni frame di zoom/pinch).
  const { zoom } = useViewport();
  const quantizedZoom = Math.round(zoom * 20) / 20;

  const activeLevel = useMemo(
    () =>
      dataset.mapLevels.find((l) => l.id === activeMapLevelId) ??
      dataset.mapLevels[0],
    [dataset.mapLevels, activeMapLevelId],
  );

  // Locations del livello, filtrate + filtro layer (per importanza: principali /
  // secondari·speciali / minori). La distinzione è sull'`importance` così da
  // valere per ogni mondo (non solo dove i luoghi sono di tipo "village").
  const visibleLocations = useMemo<Location[]>(
    () => selectVisibleLocations(dataset, activeLevel.id, filters, visibleLayers),
    [dataset, activeLevel.id, filters, visibleLayers],
  );

  // Scosta i pin quasi sovrapposti così a zoom alto restano distinti/cliccabili.
  const spreadLocations = useMemo(
    () => spreadOverlappingPins(visibleLocations),
    [visibleLocations],
  );

  // Knowledge graph derivato del mondo (memoizzato per-dataset): motore unico
  // per le relazioni contestuali (focus mode + overlay).
  const graph = useMemo(() => buildWorldGraph(dataset), [dataset]);

  const route: Route | undefined = useMemo(
    () => dataset.routes.find((r) => r.id === selectedRouteId),
    [dataset.routes, selectedRouteId],
  );
  const highlightedLocationIds = useMemo(
    () => new Set(route?.steps.map((s) => s.locationId) ?? []),
    [route],
  );

  // Luoghi da tenere sempre come pin singoli (mai dentro un cluster): quello
  // selezionato e le tappe del percorso attivo (per non rompere gli archi).
  const keepIds = useMemo(() => {
    const s = new Set<string>(highlightedLocationIds);
    if (selectedLocationId) s.add(selectedLocationId);
    return s;
  }, [highlightedLocationIds, selectedLocationId]);

  const clusterEntries = useMemo(
    () =>
      quantizedZoom >= CLUSTER_OFF_ZOOM
        ? spreadLocations.map((location) => ({ kind: 'pin' as const, location }))
        : clusterLocations(spreadLocations, quantizedZoom, keepIds),
    [spreadLocations, quantizedZoom, keepIds],
  );

  // Focus mode: quando c'è una selezione (luogo o percorso), calcola i luoghi
  // "collegati" (stesso arco, stessi personaggi, stesso percorso). I pin non
  // collegati vengono attenuati (`dimmed`) per far risaltare il contesto.
  // `null` = nessun focus attivo (mappa piena).
  const focusRelatedIds = useMemo<Set<string> | null>(() => {
    if (!selectedLocationId && !selectedRouteId) return null;
    const set = new Set<string>();
    if (route) for (const s of route.steps) set.add(s.locationId);
    // Luoghi collegati derivati dal knowledge graph (stesso arco / personaggi /
    // rotta): un'unica sorgente invece del calcolo inline duplicato.
    if (selectedLocationId) {
      for (const id of relatedPlaceIds(graph, selectedLocationId)) set.add(id);
    }
    return set;
  }, [selectedLocationId, selectedRouteId, route, graph]);

  // Layer nodi (sfondo, confini, labels): dipendono SOLO da livello+dataset,
  // non dalla selezione. Memoizzati a parte così cliccare un pin non
  // ricostruisce (né ri-renderizza) l'overlay confini SVG e le labels —
  // mantengono identità e i loro nodi memo vengono saltati da React Flow.
  const layerNodes = useMemo<Node<MapLayerNodeData>[]>(() => {
    return [
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
  }, [activeLevel, dataset]);

  // Pin location + cluster: derivati dalle voci clusterizzate. I singoli pin
  // dipendono da selezione/locale; i cluster dal solo zoom quantizzato.
  const pinNodes = useMemo<Node<MapNodeData | MapClusterNodeData>[]>(() => {
    return clusterEntries.map((entry) => {
      if (entry.kind === 'cluster') {
        const c = entry.cluster;
        return {
          id: c.id,
          type: 'map-cluster',
          position: { x: c.x, y: c.y },
          data: { count: c.count, bbox: c.bbox },
          draggable: false,
          selectable: false,
        };
      }
      const loc = entry.location;
      return {
        id: loc.id,
        type: 'map-node',
        position: { x: loc.x, y: loc.y },
        data: {
          label: getLocalizedText(loc.localizedName, locale) || loc.name,
          type: loc.type,
          importance: loc.importance,
          selected: loc.id === selectedLocationId,
          highlighted: highlightedLocationIds.has(loc.id),
          poneglyph: filters.highlightPoneglyphs && !!loc.poneglyph,
          hasSubMap: !!loc.subMapLevelId,
          dimmed: !!focusRelatedIds && !focusRelatedIds.has(loc.id),
        },
        draggable: false,
        selectable: true,
      };
    });
  }, [
    clusterEntries,
    selectedLocationId,
    highlightedLocationIds,
    filters.highlightPoneglyphs,
    focusRelatedIds,
    locale,
  ]);

  // Overlay dei connettori contestuali: presente solo quando un luogo è
  // selezionato (e ha collegati visibili). Sotto i pin, sopra lo sfondo.
  const relationsLayerNode = useMemo<Node<MapLayerNodeData> | null>(() => {
    if (!selectedLocationId || !focusRelatedIds) return null;
    return {
      id: '__layer-relations',
      type: 'map-layer',
      position: { x: 0, y: 0 },
      data: {
        width: activeLevel.width,
        height: activeLevel.height,
        z: 1,
        content: (
          <MapRelationsOverlay
            level={activeLevel}
            fromId={selectedLocationId}
            relatedIds={focusRelatedIds}
            locations={spreadLocations}
          />
        ),
      },
      draggable: false,
      selectable: false,
      deletable: false,
      focusable: false,
      zIndex: -2,
      style: { pointerEvents: 'none' as const },
    };
  }, [selectedLocationId, focusRelatedIds, spreadLocations, activeLevel]);

  const nodes = useMemo<Node<MapNodeData | MapLayerNodeData | MapClusterNodeData>[]>(
    () => [
      ...layerNodes,
      ...(relationsLayerNode ? [relationsLayerNode] : []),
      ...pinNodes,
    ],
    [layerNodes, relationsLayerNode, pinNodes],
  );

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

  // Centra sul luogo selezionato (coord. "spread", così centra sul pin renderizzato)
  useEffect(() => {
    if (!selectedLocationId) return;
    const loc = spreadLocations.find((l) => l.id === selectedLocationId);
    if (!loc) return;
    const id = setTimeout(() => {
      setCenter(loc.x + 40, loc.y, {
        zoom: Math.max(getZoom(), 1.1),
        duration: 700,
      });
    }, 50);
    return () => clearTimeout(id);
  }, [selectedLocationId, spreadLocations, setCenter, getZoom]);

  function handleNodeClick(_: unknown, node: Node) {
    // ignora layer
    if (node.id.startsWith('__layer-')) return;
    // Cluster: zoom sul bounding box dei membri → il cluster si "apre".
    if (node.id.startsWith('__cluster-')) {
      const { bbox } = node.data as MapClusterNodeData;
      const pad = 60;
      fitBounds(
        {
          x: bbox.x - pad,
          y: bbox.y - pad,
          width: bbox.width + pad * 2,
          height: bbox.height + pad * 2,
        },
        { padding: 0.2, duration: 500 },
      );
      return;
    }
    setSelectedLocation(node.id);
    openLocationModal(node.id);
  }
  // Click sullo sfondo mappa: esce dal focus (deseleziona). Con una scheda
  // aperta lo scrim la intercetta prima, quindi qui arriva solo a mappa "libera".
  function handlePaneClick() {
    if (selectedLocationId || selectedRouteId) resetSelections();
  }
  function handleNodeDoubleClick(_: unknown, node: Node) {
    if (node.id.startsWith('__layer-') || node.id.startsWith('__cluster-')) return;
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
        onPaneClick={handlePaneClick}
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
      </ReactFlow>
    </div>
  );
}
