import React, { useState, useRef, useEffect, useMemo, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import {
  SITE_GEO,
  SITE_BOUNDARY_GEO,
  localToLatLng,
  layoutRoads,
  parkData,
  statusColors
} from './masterPlanData';
import {
  WALK_ROADS,
  BlockBordersAndAvenueTrees,
  ConnectedRoadNetwork,
  ParkArea3D,
  GrandEntranceArch,
  MovingVehicles3D,
  Plot3D,
  MeasureOverlay
} from './Layout3DView';

// Google Maps Roadmap tile provider (Zero API Key Required)
export const GOOGLE_MAP_LAYER = {
  url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
  attribution: '&copy; Google Maps &bull; Kadthal, Srisailam Highway',
  subdomains: ['0', '1', '2', '3'],
  maxZoom: 21
};

export { WALK_ROADS };

/**
 * Synchronizes Three.js OrthographicCamera to Leaflet map center, zoom, and container dimensions
 * Produces sub-pixel alignment (< 0.2px discrepancy across entire layout) with real Google Maps tiles.
 */
function LeafletSyncCamera({ mapInstance }) {
  const { camera } = useThree();

  useFrame(() => {
    if (!mapInstance) return;

    const center = mapInstance.getCenter();
    const zoom = mapInstance.getZoom();
    const size = mapInstance.getSize();
    if (!size || size.x === 0 || size.y === 0) return;

    // Standard Web Mercator calculation for meters per pixel at current latitude
    const latRad = (center.lat * Math.PI) / 180;
    const metersPerPixel = (Math.cos(latRad) * 2 * Math.PI * 6378137) / (256 * Math.pow(2, zoom));

    // Convert geographic Leaflet center (lat, lng) to local Three.js (x, z)
    // Origin (0, 0) is at SITE_GEO.center [16.9555, 78.5125]
    const targetX = (center.lng - SITE_GEO.center[1]) * 106399;
    const targetZ = -(center.lat - SITE_GEO.center[0]) * 110649;

    const halfW = (size.x / 2) * metersPerPixel;
    const halfH = (size.y / 2) * metersPerPixel;

    camera.left = -halfW;
    camera.right = halfW;
    camera.top = halfH;
    camera.bottom = -halfH;
    camera.position.set(targetX, 500, targetZ);
    // Point UP towards North (-Z in local coordinates) so screen top is North
    camera.up.set(0, 0, -1);
    camera.lookAt(targetX, 0, targetZ);
    camera.updateProjectionMatrix();
  });

  return null;
}

/**
 * First-person perspective camera controller for Street Walk / Road Travel mode
 */
function RoadWalkCamera({ walkRoadIndex = 0, walkProgress = 0, onWalkProgressChange }) {
  const { camera, gl } = useThree();
  const road = WALK_ROADS[walkRoadIndex] || WALK_ROADS[0];
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const progRef = useRef(walkProgress);
  const yawRef = useRef(road.forwardYaw || Math.PI / 2);
  const pitchRef = useRef(-0.02);

  useEffect(() => {
    progRef.current = walkProgress;
  }, [walkProgress]);

  useEffect(() => {
    yawRef.current = road.forwardYaw || Math.PI / 2;
    pitchRef.current = -0.02;
  }, [walkRoadIndex]);

  useEffect(() => {
    const dom = gl.domElement;
    const onDown = (e) => {
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };

      const moveDelta = -dy * 0.0028;
      const nextProg = Math.max(0, Math.min(1, progRef.current + moveDelta));
      progRef.current = nextProg;
      if (onWalkProgressChange) onWalkProgressChange(nextProg);

      yawRef.current -= dx * 0.005;
      pitchRef.current = Math.max(-0.35, Math.min(0.35, pitchRef.current - dy * 0.0008));
    };
    const onUp = () => { isDragging.current = false; };
    const onWheel = (e) => {
      e.preventDefault();
      const moveStep = -Math.sign(e.deltaY) * 0.035;
      const nextProg = Math.max(0, Math.min(1, progRef.current + moveStep));
      progRef.current = nextProg;
      if (onWalkProgressChange) onWalkProgressChange(nextProg);
    };

    dom.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      dom.removeEventListener('wheel', onWheel);
    };
  }, [gl, onWalkProgressChange]);

  useFrame(() => {
    let tx, ty = road.cameraHeight || 2.1, tz;
    if (road.axis === 'x') {
      tx = road.startX + (road.endX - road.startX) * progRef.current;
      tz = road.z;
    } else {
      tx = road.x;
      tz = road.startZ + (road.endZ - road.startZ) * progRef.current;
    }

    camera.position.set(tx, ty, tz);
    camera.up.set(0, 1, 0);
    const lookDist = 18;
    const lx = tx + Math.sin(yawRef.current) * Math.cos(pitchRef.current) * lookDist;
    const ly = ty + Math.sin(pitchRef.current) * lookDist;
    const lz = tz - Math.cos(yawRef.current) * Math.cos(pitchRef.current) * lookDist;
    camera.lookAt(lx, ly, lz);
  });

  return null;
}

/**
 * Unified Layout Master Visualizer
 * The real Google Maps Leaflet layer is ALWAYS active as the base map for both 2D and 3D.
 * When switching to 3D, Three.js volumetric plots, avenue palm trees, moving cars, entrance arch,
 * and central park render directly on top of the general map in exact real-time sub-pixel lockstep.
 */
const LayoutMasterView = React.forwardRef(function LayoutMasterView({
  viewMode = '3d', // '2d' | '3d'
  plots = [],
  selectedPlot = null,
  onSelectPlot = () => {},
  cameraPreset = 'overview',
  searchTerm = '',
  filterStatus = 'all',
  filterFacing = 'all',
  walkRoadIndex = 0,
  walkProgress = 0,
  onWalkProgressChange,
  animateVehicles = true,
  isMeasureMode = false,
  measurePoints = [],
  onMeasurePoint,
  onRoadClick,
  onParkClick
}, ref) {
  const mapContainerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(SITE_GEO.zoom);
  const [hoveredPlotNumber, setHoveredPlotNumber] = useState(null);

  const onSelectPlotRef = useRef(onSelectPlot);
  const onParkClickRef = useRef(onParkClick);
  const onRoadClickRef = useRef(onRoadClick);

  useEffect(() => {
    onSelectPlotRef.current = onSelectPlot;
    onParkClickRef.current = onParkClick;
    onRoadClickRef.current = onRoadClick;
  }, [onSelectPlot, onParkClick, onRoadClick]);

  // Imperative API for external toolbar buttons
  useImperativeHandle(ref, () => ({
    zoomIn: () => mapInstance?.zoomIn(),
    zoomOut: () => mapInstance?.zoomOut(),
    reset: () => {
      mapInstance?.setView(SITE_GEO.center, SITE_GEO.zoom, { animate: true });
    },
    setMapType: () => {}
  }));

  // 1. Initialize Leaflet Map (Runs ONCE on mount, NEVER destroyed during 2D <-> 3D toggle)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: SITE_GEO.center,
      zoom: SITE_GEO.zoom,
      minZoom: 10,
      maxZoom: 21,
      zoomControl: false,
      attributionControl: false
    });

    // Add base tile layer (Google Maps roadmap)
    L.tileLayer(GOOGLE_MAP_LAYER.url, {
      attribution: GOOGLE_MAP_LAYER.attribution,
      subdomains: GOOGLE_MAP_LAYER.subdomains,
      maxZoom: GOOGLE_MAP_LAYER.maxZoom
    }).addTo(map);

    const updateZoom = () => setCurrentZoom(map.getZoom());
    map.on('zoom', updateZoom);
    map.on('zoomend', updateZoom);

    // Clicking empty map background deselects plot safely
    map.on('click', (e) => {
      if (e?.originalEvent?._plotClicked) return;
      const target = e?.originalEvent?.target;
      if (target && (target.tagName === 'path' || target.closest?.('.leaflet-interactive'))) return;
      if (onSelectPlotRef.current) onSelectPlotRef.current(null);
    });

    // -------------------------------------------------------------
    // Base Master Plan Features on Leaflet (Always Persistent)
    // -------------------------------------------------------------
    const staticGroup = L.layerGroup().addTo(map);

    // Layout Boundary Polygon
    L.polygon(SITE_BOUNDARY_GEO, {
      color: '#15803D',
      weight: 3.5,
      fillColor: '#F0FDF4',
      fillOpacity: 0.35,
      interactive: false
    }).addTo(staticGroup);

    // Boundary White Accent Outer Line
    L.polyline(SITE_BOUNDARY_GEO.concat([SITE_BOUNDARY_GEO[0]]), {
      color: '#FFFFFF',
      weight: 1.8,
      dashArray: '6, 4',
      interactive: false
    }).addTo(staticGroup);

    // Connected Road Network on Map
    layoutRoads.forEach(road => {
      const geoPoly = road.polygon.map(([x, z]) => localToLatLng(x, z));
      const isHighway = road.type === 'highway';
      const isArterial = road.type === 'arterial';

      L.polygon(geoPoly, {
        color: '#E2E8F0',
        weight: 2.2,
        fillColor: isHighway ? '#111418' : '#1A1E24',
        fillOpacity: 0.98,
        interactive: true
      }).on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        if (onRoadClickRef.current) onRoadClickRef.current(road);
      }).addTo(staticGroup);

      if (isHighway) {
        const [p0, p1, p2, p3] = road.polygon;
        const midTop = localToLatLng((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2);
        const midBottom = localToLatLng((p2[0] + p3[0]) / 2, (p2[1] + p3[1]) / 2);
        L.polyline([midTop, midBottom], {
          color: '#FBBF24',
          weight: 2.8,
          interactive: false
        }).addTo(staticGroup);
      } else if (isArterial) {
        const [p0, p1, p2, p3] = road.polygon;
        const midLeft = localToLatLng((p0[0] + p3[0]) / 2, (p0[1] + p3[1]) / 2);
        const midRight = localToLatLng((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2);
        L.polyline([midLeft, midRight], {
          color: '#FFFFFF',
          weight: 2,
          dashArray: '6, 6',
          interactive: false
        }).addTo(staticGroup);
      } else if (road.id === 'ROAD-33-MID') {
        const [p0, p1, p2, p3] = road.polygon;
        const midLeft = localToLatLng((p0[0] + p3[0]) / 2, (p0[1] + p3[1]) / 2);
        const midRight = localToLatLng((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2);
        L.polyline([midLeft, midRight], {
          color: 'rgba(255, 255, 255, 0.7)',
          weight: 1.5,
          dashArray: '5, 5',
          interactive: false
        }).addTo(staticGroup);
      }
    });

    // Park Area on Map
    const parkOuterGeo = parkData.polygon.map(([x, z]) => localToLatLng(x, z));
    L.polygon(parkOuterGeo, {
      color: '#B45309',
      weight: 1.5,
      fillColor: '#FDE68A',
      fillOpacity: 0.95,
      interactive: true
    }).on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      if (onParkClickRef.current) onParkClickRef.current();
    }).addTo(staticGroup);

    const parkInnerPoly = [
      [-86.2, -40.2],
      [-59.8, -40.2],
      [-59.8, -4.8],
      [-86.2, -4.8]
    ].map(([x, z]) => localToLatLng(x, z));

    L.polygon(parkInnerPoly, {
      color: '#3B6E0E',
      weight: 1.8,
      fillColor: '#68B31E',
      fillOpacity: 0.98,
      interactive: true
    }).on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      if (onParkClickRef.current) onParkClickRef.current();
    }).addTo(staticGroup);

    // Invalidate size once layout renders
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    setMapInstance(map);

    return () => {
      clearTimeout(timer);
      map.off('zoom', updateZoom);
      map.off('zoomend', updateZoom);
      map.remove();
      setMapInstance(null);
    };
  }, []);

  // 2. Regional Location Marker Pin when zoomed out (Zoom <= 15)
  // Lets the user minimize the layout to see all of Telangana, with a clear pin marking the venture
  useEffect(() => {
    if (!mapInstance) return;

    if (currentZoom > 15) return;

    const pinIcon = L.divIcon({
      className: 'regional-venture-pin',
      html: `
        <div style="
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(15, 23, 42, 0.92);
          border: 1.5px solid #F15A24;
          padding: 4px 10px;
          border-radius: 9999px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.45);
          transform: translate(-50%, -100%);
          cursor: pointer;
          white-space: nowrap;
          pointer-events: auto;
        ">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: #10B981;"></div>
          <div style="color: #FFFFFF; font-size: 10px; font-weight: 800; letter-spacing: 0.5px;">
            ALEKHYA'S BRUNDAVAN
          </div>
          <div style="color: #FBBF24; font-size: 8px; font-weight: 700;">KADTHAL</div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });

    const marker = L.marker(SITE_GEO.center, { icon: pinIcon, interactive: true })
      .on('click', () => {
        mapInstance.setView(SITE_GEO.center, 18, { animate: true });
      })
      .addTo(mapInstance);

    return () => {
      mapInstance.removeLayer(marker);
    };
  }, [mapInstance, currentZoom]);

  // 3. Render Plots Layer on Leaflet (Always captures clicks and hovers in both 2D and 3D)
  useEffect(() => {
    if (!mapInstance || !plots.length) return;

    const plotsGroup = L.layerGroup().addTo(mapInstance);
    const is3D = viewMode === '3d';

    plots.forEach(plot => {
      const matchesStatus = filterStatus === 'all' || plot.status === filterStatus;
      const matchesFacing = filterFacing === 'all' || (plot.facing && plot.facing.toLowerCase().includes(filterFacing.toLowerCase()));
      const matchesSearch = !searchTerm || String(plot.plotNumber).includes(searchTerm.trim());
      const isVisible = matchesStatus && matchesFacing && matchesSearch;

      const isSelected = selectedPlot && selectedPlot.plotNumber === plot.plotNumber;
      const baseColors = statusColors[plot.status] || statusColors.available;

      const poly = L.polygon(plot.geoPolygon, {
        color: is3D ? 'transparent' : (isSelected ? '#EA580C' : '#FFFFFF'),
        weight: is3D ? 0 : (isSelected ? 3.5 : 1.2),
        fillColor: is3D ? 'transparent' : baseColors.bg,
        fillOpacity: is3D ? 0.001 : (isVisible ? (isSelected ? 1.0 : 0.92) : 0.2),
        className: `plot-interactive-${plot.plotNumber}`
      });

      // Interactive Click: selects the plot in both 2D and 3D mode
      poly.on('click', (e) => {
        if (e) {
          if (e.originalEvent) {
            e.originalEvent._plotClicked = true;
          }
          L.DomEvent.stopPropagation(e);
        }
        if (onSelectPlotRef.current) {
          onSelectPlotRef.current(plot);
        }
      });

      // Hover feedback: in 3D, highlights the 3D plot and cursor
      poly.on('mouseover', () => {
        setHoveredPlotNumber(plot.plotNumber);
        if (!is3D && !isSelected) {
          poly.setStyle({
            color: '#2563EB',
            weight: 2.2,
            fillOpacity: 1.0
          });
        }
      });

      poly.on('mouseout', () => {
        setHoveredPlotNumber(null);
        if (!is3D && !isSelected) {
          poly.setStyle({
            color: '#FFFFFF',
            weight: 1.2,
            fillOpacity: isVisible ? 0.92 : 0.2
          });
        }
      });

      poly.addTo(plotsGroup);

      // In 2D only: render typography numbers and dimensions directly on the map
      if (!is3D && isVisible) {
        const isTargetMatch = searchTerm && String(plot.plotNumber) === searchTerm.trim();
        if (isSelected || isTargetMatch) {
          const activeIcon = L.divIcon({
            className: `plot-active-label-${plot.plotNumber}`,
            html: `
              <div style="
                background: #EA580C;
                color: #FFFFFF;
                font-weight: 800;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 9999px;
                box-shadow: 0 3px 10px rgba(234, 88, 12, 0.6);
                border: 1.5px solid #FFFFFF;
                line-height: 1;
                white-space: nowrap;
                transform: translate(-50%, -50%);
                pointer-events: none;
              ">#${plot.plotNumber}</div>
            `,
            iconSize: [0, 0]
          });
          L.marker(plot.geoCenter, { icon: activeIcon, interactive: false }).addTo(plotsGroup);
        } else if (currentZoom >= 18) {
          const numIcon = L.divIcon({
            className: `plot-num-label-${plot.plotNumber}`,
            html: `
              <div style="
                color: ${plot.status === 'sold' ? '#7F1D1D' : '#0F172A'};
                font-size: ${currentZoom >= 20 ? 11 : currentZoom >= 19 ? 9.5 : 8}px;
                font-weight: 800;
                line-height: 1;
                text-align: center;
                white-space: nowrap;
                transform: translate(-50%, -50%);
                pointer-events: none;
              ">${plot.plotNumber}</div>
            `,
            iconSize: [0, 0]
          });
          L.marker(plot.geoCenter, { icon: numIcon, interactive: false }).addTo(plotsGroup);
        }
      }
    });

    return () => {
      mapInstance.removeLayer(plotsGroup);
    };
  }, [mapInstance, plots, selectedPlot, filterStatus, filterFacing, searchTerm, viewMode, currentZoom]);

  // 4. Moving Vehicles in 2D mode
  useEffect(() => {
    if (viewMode !== '2d' || !animateVehicles || !mapInstance) return;

    const vehiclesGroup = L.layerGroup().addTo(mapInstance);
    const vehicleConfigs = [
      { id: 'hwy-s', color: '#F8FAFC', start: [77, -50], end: [77, 60], heading: 90, speed: 0.0035, offset: 0.1 },
      { id: 'hwy-n', color: '#059669', start: [83, 60], end: [83, -50], heading: 270, speed: 0.0032, offset: 0.55 },
      { id: 'r60-e', color: '#E2E8F0', start: [-75, -44.5], end: [65, -44.5], heading: 0, speed: 0.0026, offset: 0.2 },
      { id: 'r60-w', color: '#2563EB', start: [65, -49.5], end: [-75, -49.5], heading: 180, speed: 0.0024, offset: 0.62 },
      { id: 'r33-e', color: '#D97706', start: [-75, 1.8], end: [60, 1.8], heading: 0, speed: 0.0018, offset: 0.35 },
      { id: 'r33-w', color: '#059669', start: [60, -1.0], end: [-75, -1.0], heading: 180, speed: 0.002, offset: 0.82 },
      { id: 'rv2-s', color: '#7C3AED', start: [-3.5, -38], end: [-3.5, 56], heading: 90, speed: 0.0017, offset: 0.52 }
    ];

    const carScale = currentZoom >= 20 ? 1.5 : currentZoom >= 19 ? 1.25 : 1.0;
    const markers = vehicleConfigs.map(cfg => {
      const startLatLng = localToLatLng(cfg.start[0], cfg.start[1]);
      const icon = L.divIcon({
        className: `leaflet-car-${cfg.id}`,
        html: `
          <div style="
            width: 17px;
            height: 9px;
            background: ${cfg.color};
            border-radius: 2.5px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.45);
            border: 1px solid rgba(0,0,0,0.3);
            position: relative;
            transform: rotate(${cfg.heading}deg) scale(${carScale});
            transform-origin: center center;
          ">
            <div style="position: absolute; right: 3px; top: 1px; width: 3.5px; height: 5px; background: rgba(30,41,59,0.85); border-radius: 1px;"></div>
            <div style="position: absolute; left: 2.5px; top: 1px; width: 2.5px; height: 5px; background: rgba(30,41,59,0.85); border-radius: 1px;"></div>
            <div style="position: absolute; right: -1px; top: 1px; width: 2px; height: 2px; background: #FEF08A; border-radius: 1px;"></div>
            <div style="position: absolute; right: -1px; bottom: 1px; width: 2px; height: 2px; background: #FEF08A; border-radius: 1px;"></div>
          </div>
        `,
        iconSize: [17, 9],
        iconAnchor: [8.5, 4.5]
      });

      const marker = L.marker(startLatLng, { icon, interactive: false }).addTo(vehiclesGroup);
      return { marker, cfg };
    });

    let progress = 0;
    let animId = null;
    const tick = () => {
      progress += 0.0015;
      markers.forEach(({ marker, cfg }) => {
        const t = (progress * (cfg.speed / 0.002) + cfg.offset) % 1;
        const curX = cfg.start[0] + (cfg.end[0] - cfg.start[0]) * t;
        const curZ = cfg.start[1] + (cfg.end[1] - cfg.start[1]) * t;
        marker.setLatLng(localToLatLng(curX, curZ));
      });
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      mapInstance.removeLayer(vehiclesGroup);
    };
  }, [viewMode, animateVehicles, mapInstance, currentZoom]);

  const cleanSearch = (searchTerm || '').trim();

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#E5ECE3]">
      <style>{`
        .leaflet-control-attribution {
          display: none !important;
        }
        .regional-venture-pin {
          pointer-events: auto !important;
        }
      `}</style>

      {/* 1. Underlying Perpetual Leaflet Map (Infinite continuous Google Maps tiles) */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 z-0 w-full h-full bg-[#E5ECE3]"
        style={{ cursor: 'grab' }}
      />

      {/* 2. 3D WebGL Layer Overlaid on the General Map (Exact Sub-Pixel Synchronization) */}
      {viewMode === '3d' && (
        <div
          className={`absolute inset-0 z-10 ${
            cameraPreset === 'roadWalk' ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-none'
          }`}
        >
          <Canvas
            shadows={false}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          >
            {/* Bright, Crisp, Natural Sunlight */}
            <ambientLight intensity={1.15} />
            <directionalLight position={[40, 80, -30]} intensity={0.7} />

            {/* Camera: Street Walk Mode vs Synchronized General Map Mode */}
            {cameraPreset === 'roadWalk' ? (
              <>
                <PerspectiveCamera makeDefault fov={55} near={0.1} far={1000} />
                <RoadWalkCamera
                  walkRoadIndex={walkRoadIndex}
                  walkProgress={walkProgress}
                  onWalkProgressChange={onWalkProgressChange}
                />
              </>
            ) : (
              <>
                <OrthographicCamera makeDefault near={0.1} far={2000} />
                <LeafletSyncCamera mapInstance={mapInstance} />
              </>
            )}

            {/* 3D Road Network with Real Asphalt & Kerb Stones */}
            <ConnectedRoadNetwork onRoadClick={onRoadClick} />

            {/* Ac. 0.758 Park Area with Flowers, Perimeter Palms & Cycad Shrubs */}
            <ParkArea3D onParkClick={onParkClick} />

            {/* Full Avenue Plantation along both sides of Every Block Street */}
            <BlockBordersAndAvenueTrees />

            {/* 3D Moving Vehicles along Highway & Internal Roads */}
            <MovingVehicles3D animate={animateVehicles} />

            {/* Grand Entrance Arch at Srisailam Highway */}
            <GrandEntranceArch position={[63, 0, 0.5]} />

            {/* 3D Volumetric Plots with Plinth Elevation, Bevel Edges, Numbers & Dimensions */}
            <group>
              {plots.map((plot) => {
                const matchesSearch = !cleanSearch || String(plot.plotNumber).includes(cleanSearch);
                const matchesStatus = !filterStatus || filterStatus === 'all' || plot.status === filterStatus;
                const matchesFacing = !filterFacing || filterFacing === 'all' || (plot.facing && plot.facing.toLowerCase().includes(filterFacing.toLowerCase()));
                const isMatch = matchesSearch && matchesStatus && matchesFacing;
                const hasActiveFilter = Boolean(cleanSearch) || (filterStatus && filterStatus !== 'all') || (filterFacing && filterFacing !== 'all');
                const isDimmed = hasActiveFilter && !isMatch;
                const isSearchedMatch = Boolean(cleanSearch) && String(plot.plotNumber) === cleanSearch;

                return (
                  <Plot3D
                    key={plot.plotNumber}
                    plot={plot}
                    isSelected={selectedPlot?.plotNumber === plot.plotNumber}
                    isHovered={hoveredPlotNumber === plot.plotNumber}
                    isDimmed={isDimmed}
                    isSearchedMatch={isSearchedMatch}
                    onSelect={onSelectPlot}
                    isMeasureMode={isMeasureMode}
                    onMeasurePoint={onMeasurePoint}
                  />
                );
              })}
            </group>

            {/* Interactive Measure Tool Line */}
            {isMeasureMode && <MeasureOverlay points={measurePoints} />}
          </Canvas>
        </div>
      )}
    </div>
  );
});

export default LayoutMasterView;
