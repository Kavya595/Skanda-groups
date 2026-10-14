import React, { useState, useRef, useEffect, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  SITE_GEO,
  SITE_BOUNDARY_GEO,
  localToLatLng,
  layoutRoads,
  parkData,
  statusColors
} from './masterPlanData';

// Clean watermark-free Map tile providers
const TILE_LAYERS = {
  osm: {
    name: 'Map View',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    subdomains: '',
    maxZoom: 19
  },
  satellite: {
    name: 'Satellite View (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    subdomains: '',
    maxZoom: 19
  }
};

const Layout2DView = React.forwardRef(function Layout2DView({
  plots = [],
  selectedPlot = null,
  onSelectPlot = () => {},
  filterStatus = 'all',
  filterFacing = 'all',
  searchTerm = '',
  animateVehicles = false
}, ref) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const plotLayersRef = useRef({});
  const carsGroupRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [activeTileType, setActiveTileType] = useState('osm');
  const [currentZoom, setCurrentZoom] = useState(SITE_GEO.zoom);

  // Expose imperative methods for external toolbar
  React.useImperativeHandle(ref, () => ({
    zoomIn: () => mapInstanceRef.current?.zoomIn(),
    zoomOut: () => mapInstanceRef.current?.zoomOut(),
    reset: () => mapInstanceRef.current?.setView(SITE_GEO.center, SITE_GEO.zoom, { animate: true }),
    setTileType: (type) => {
      if (TILE_LAYERS[type]) setActiveTileType(type);
    }
  }));

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent duplicate map initialization
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      center: SITE_GEO.center,
      zoom: SITE_GEO.zoom,
      minZoom: SITE_GEO.minZoom,
      maxZoom: SITE_GEO.maxZoom,
      zoomControl: false, // External controls in PlotViewerStandalone handle zoom
      attributionControl: false // External attribution placed cleanly at bottom-right
    });

    mapInstanceRef.current = map;

    // Add initial base tile layer (OSM watermark-free)
    const tileConfig = TILE_LAYERS[activeTileType] || TILE_LAYERS.osm;
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      subdomains: tileConfig.subdomains,
      maxZoom: tileConfig.maxZoom
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Track zoom updates for responsive number/label scaling
    const updateZoom = () => setCurrentZoom(map.getZoom());
    map.on('zoom', updateZoom);
    map.on('zoomend', updateZoom);

    // Invalidate size after layout settles
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        map.off('zoom', updateZoom);
        map.off('zoomend', updateZoom);
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Handle Base Tile Layer Switch (OSM vs Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    const tileConfig = TILE_LAYERS[activeTileType] || TILE_LAYERS.osm;
    const newLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      subdomains: tileConfig.subdomains,
      maxZoom: tileConfig.maxZoom
    }).addTo(map);
    tileLayerRef.current = newLayer;
  }, [activeTileType]);

  // 3. Render Site Layers: Boundary, Roads, Park (Clean Plots99 Look)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const staticGroup = L.layerGroup().addTo(map);

    // (A) Site Boundary Polygon
    L.polygon(SITE_BOUNDARY_GEO, {
      color: '#68D391',
      weight: 2.5,
      dashArray: '6, 4',
      fillColor: '#C6F6D5',
      fillOpacity: activeTileType === 'satellite' ? 0.15 : 0.35,
      interactive: false
    }).addTo(staticGroup);

    // Boundary Outer Accent Line
    L.polyline(SITE_BOUNDARY_GEO.concat([SITE_BOUNDARY_GEO[0]]), {
      color: '#276749',
      weight: 1.5,
      interactive: false
    }).addTo(staticGroup);

    // (B) Connected Road Network (Matching Plots99 Screenshot 1)
    layoutRoads.forEach(road => {
      const geoPoly = road.polygon.map(([x, z]) => localToLatLng(x, z));
      const isHighway = road.type === 'highway';

      // Road asphalt surface
      L.polygon(geoPoly, {
        color: '#1A202C',
        weight: 1,
        fillColor: isHighway ? '#171923' : '#2D3748',
        fillOpacity: 0.96,
        interactive: false
      }).addTo(staticGroup);

      // Road Centerlines & Dividers
      if (isHighway) {
        // Yellow median divider for National Highway NH-765
        const [p0, p1, p2, p3] = road.polygon;
        const midTop = localToLatLng((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2);
        const midBottom = localToLatLng((p2[0] + p3[0]) / 2, (p2[1] + p3[1]) / 2);
        L.polyline([midTop, midBottom], {
          color: '#F6E05E',
          weight: 2,
          interactive: false
        }).addTo(staticGroup);
      } else if (road.type === 'arterial') {
        // White dashed centerline for 60ft Arterial Road
        const [p0, p1, p2, p3] = road.polygon;
        const midLeft = localToLatLng((p0[0] + p3[0]) / 2, (p0[1] + p3[1]) / 2);
        const midRight = localToLatLng((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2);
        L.polyline([midLeft, midRight], {
          color: '#FFFFFF',
          weight: 1.5,
          dashArray: '5, 5',
          interactive: false
        }).addTo(staticGroup);
      }

      // Single subtle typography label for the central road (matching Plots99 single 40' Road label)
      if (road.id === 'ROAD-33-MID') {
        const centerGeo = localToLatLng(road.center[0], road.center[1]);
        const roadLabel = L.divIcon({
          className: 'custom-road-label',
          html: `<div style="
            color: rgba(255, 255, 255, 0.85);
            font-size: 8.5px;
            font-weight: 700;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            text-shadow: 0 1px 2px rgba(0,0,0,0.8);
            white-space: nowrap;
            transform: translate(-50%, -50%);
            pointer-events: none;
          ">${road.shortName}</div>`,
          iconSize: [0, 0]
        });
        L.marker(centerGeo, { icon: roadLabel, interactive: false }).addTo(staticGroup);
      }
    });

    // (C) Ac. 0.758 Central Park (Matching Plots99 Screenshot 1)
    const parkGeoPoly = parkData.polygon.map(([x, z]) => localToLatLng(x, z));
    L.polygon(parkGeoPoly, {
      color: '#558B2F',
      weight: 2,
      fillColor: '#8BC34A', // Vibrant Lime Green Lawn
      fillOpacity: 0.95,
      interactive: false
    }).addTo(staticGroup);

    // Park Center Typography directly on grass (Matching Plots99 Screenshot 1)
    const parkCenterGeo = localToLatLng(parkData.center[0], parkData.center[1]);
    const parkBadge = L.divIcon({
      className: 'custom-park-typography',
      html: `<div style="
        text-align: center;
        transform: translate(-50%, -50%);
        pointer-events: none;
        user-select: none;
      ">
        <div style="font-size: 13px; font-weight: 800; font-style: italic; color: #FFFFFF; text-shadow: 0 1px 3px rgba(0,0,0,0.45); letter-spacing: 0.5px;">
          Park
        </div>
        <div style="font-size: 8.5px; font-weight: 700; color: #FFFFFF; text-shadow: 0 1px 2px rgba(0,0,0,0.45); opacity: 0.95;">
          Ac. 0.758
        </div>
      </div>`,
      iconSize: [60, 26],
      iconAnchor: [30, 13]
    });
    L.marker(parkCenterGeo, { icon: parkBadge, interactive: false }).addTo(staticGroup);

    return () => {
      if (mapInstanceRef.current) {
        map.removeLayer(staticGroup);
      }
    };
  }, [activeTileType]);

  // 4. Render Dynamic Interactive Plots Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !plots.length) return;
    const map = mapInstanceRef.current;

    const plotsGroup = L.layerGroup().addTo(map);
    const layersMap = {};

    plots.forEach(plot => {
      // Filter logic
      const matchesStatus = filterStatus === 'all' || plot.status === filterStatus;
      const matchesFacing = filterFacing === 'all' || (plot.facing && plot.facing.toLowerCase().includes(filterFacing.toLowerCase()));
      const matchesSearch = !searchTerm || String(plot.plotNumber).includes(searchTerm.trim());
      const isVisible = matchesStatus && matchesFacing && matchesSearch;

      const isSelected = selectedPlot && selectedPlot.plotNumber === plot.plotNumber;
      const isTargetMatch = searchTerm && String(plot.plotNumber) === searchTerm.trim();
      const baseColors = statusColors[plot.status] || statusColors.available;

      const poly = L.polygon(plot.geoPolygon, {
        color: isSelected ? '#F97316' : baseColors.border,
        weight: isSelected ? 3.5 : 1.2,
        fillColor: baseColors.bg,
        fillOpacity: isVisible ? (isSelected ? 1.0 : 0.88) : 0.2,
        className: `plot-poly-${plot.plotNumber}`
      });

      // Interactive Click / Touch: selects the plot, opening the top-right detail card
      // NOTE: We deliberately do NOT call poly.bindTooltip() here because the user
      // explicitly requested: "on touch dont show plot deatils in layout"
      poly.on('click', () => {
        onSelectPlot(plot);
      });

      poly.addTo(plotsGroup);
      layersMap[plot.plotNumber] = poly;

      // Plot Number Typography (matching Plots99 Screenshots 1 & 5)
      // Overview zoom (currentZoom < 19.0) shows ONLY clean colored plots without crowding.
      // Numbers appear when zoomed in close (>= 19.0) OR if specifically selected/searched.
      const showAllNumbers = currentZoom >= 19.0;
      const shouldShowNumber = isVisible && (showAllNumbers || isSelected || isTargetMatch);

      if (shouldShowNumber) {
        if (isSelected || isTargetMatch) {
          // Elevated Floating Badge for Active/Searched Plot
          const activeIcon = L.divIcon({
            className: `plot-active-label-${plot.plotNumber}`,
            html: `<div style="
              background: #EA580C;
              color: #FFFFFF;
              font-weight: 800;
              font-size: 11px;
              padding: 2px 6px;
              border-radius: 9999px;
              box-shadow: 0 2px 8px rgba(234, 88, 12, 0.5);
              border: 1.5px solid #FFFFFF;
              line-height: 1;
              white-space: nowrap;
              transform: translate(-50%, -50%);
              pointer-events: none;
            ">#${plot.plotNumber}</div>`,
            iconSize: [36, 18],
            iconAnchor: [18, 9]
          });
          L.marker(plot.geoCenter, { icon: activeIcon, interactive: false, zIndexOffset: 1000 }).addTo(plotsGroup);
        } else {
          // Regular Plot Number when zoomed in close (>= 19.0)
          const fontSize = currentZoom >= 19.5 ? '11px' : '10px';
          const numColor = plot.status === 'sold' ? '#7F1D1D' : '#1E293B';
          const numIcon = L.divIcon({
            className: `plot-num-icon-${plot.plotNumber}`,
            html: `<div style="
              font-size: ${fontSize};
              font-weight: 800;
              color: ${numColor};
              text-align: center;
              line-height: 1;
              transform: translate(-50%, -50%);
              pointer-events: none;
              user-select: none;
              letter-spacing: -0.3px;
              text-shadow:
                -1px -1px 0 rgba(255,255,255,0.92),
                 1px -1px 0 rgba(255,255,255,0.92),
                -1px  1px 0 rgba(255,255,255,0.92),
                 1px  1px 0 rgba(255,255,255,0.92);
            ">${plot.plotNumber}</div>`,
            iconSize: [22, 14],
            iconAnchor: [11, 7]
          });
          L.marker(plot.geoCenter, { icon: numIcon, interactive: false }).addTo(plotsGroup);
        }
      }
    });

    plotLayersRef.current = layersMap;

    return () => {
      if (mapInstanceRef.current) {
        map.removeLayer(plotsGroup);
      }
    };
  }, [plots, selectedPlot, filterStatus, filterFacing, searchTerm, currentZoom]);

  // 5. Fly to and focus Selected Plot (NO map tooltip popup, card displays details)
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlot) return;
    const map = mapInstanceRef.current;
    if (selectedPlot.geoCenter) {
      const targetZoom = Math.max(map.getZoom(), 18.5);
      map.flyTo(selectedPlot.geoCenter, targetZoom, { animate: true, duration: 0.8 });
      const layer = plotLayersRef.current[selectedPlot.plotNumber];
      if (layer) {
        layer.bringToFront();
      }
    }
  }, [selectedPlot]);

  // 6. Fly to search target when plot number entered (NO map tooltip popup)
  useEffect(() => {
    if (!mapInstanceRef.current || !searchTerm) return;
    const clean = searchTerm.trim();
    const found = plots.find(p => String(p.plotNumber) === clean);
    if (found && found.geoCenter) {
      const map = mapInstanceRef.current;
      const targetZoom = Math.max(map.getZoom(), 18.5);
      map.flyTo(found.geoCenter, targetZoom, { animate: true, duration: 0.8 });
      const layer = plotLayersRef.current[found.plotNumber];
      if (layer) {
        layer.bringToFront();
      }
    }
  }, [searchTerm, plots]);

  // 7. Optional Animated 2D Vehicles on Roads (Smooth position updates, enabled only when animateVehicles is true)
  useEffect(() => {
    if (!mapInstanceRef.current || !animateVehicles) return;
    const map = mapInstanceRef.current;

    const carsGroup = L.layerGroup().addTo(map);
    carsGroupRef.current = carsGroup;

    // Road waypoints
    const hwyStart = localToLatLng(80, -54);
    const hwyEnd = localToLatLng(80, 64);
    const r60Start = localToLatLng(80, -47);
    const r60End = localToLatLng(-90, -47);
    const r33Start = localToLatLng(-60, 0.5);
    const r33End = localToLatLng(60, 0.5);

    // Initial Marker Instances
    const redSedan = L.marker(hwyStart, {
      icon: L.divIcon({
        html: `<div style="width: 14px; height: 7px; background: #DC2626; border-radius: 2px; border: 1px solid #7F1D1D; box-shadow: 0 1px 3px rgba(0,0,0,0.5); transform: rotate(90deg);"></div>`,
        iconSize: [14, 7]
      }),
      interactive: false
    }).addTo(carsGroup);

    const whiteSuv = L.marker(r60Start, {
      icon: L.divIcon({
        html: `<div style="width: 13px; height: 7px; background: #FFFFFF; border-radius: 2px; border: 1px solid #334155; box-shadow: 0 1px 3px rgba(0,0,0,0.4);"></div>`,
        iconSize: [13, 7]
      }),
      interactive: false
    }).addTo(carsGroup);

    const yellowCar = L.marker(r33Start, {
      icon: L.divIcon({
        html: `<div style="width: 12px; height: 6px; background: #FBBF24; border-radius: 2px; border: 1px solid #78350F; box-shadow: 0 1px 3px rgba(0,0,0,0.4);"></div>`,
        iconSize: [12, 6]
      }),
      interactive: false
    }).addTo(carsGroup);

    let t = 0;
    const animateCars = () => {
      t += 0.003;
      if (t > 1) t = 0;

      const lat1 = hwyStart[0] + (hwyEnd[0] - hwyStart[0]) * t;
      const lng1 = hwyStart[1] + (hwyEnd[1] - hwyStart[1]) * t;
      redSedan.setLatLng([lat1, lng1]);

      const t2 = (t + 0.35) % 1;
      const lat2 = r60Start[0] + (r60End[0] - r60Start[0]) * t2;
      const lng2 = r60Start[1] + (r60End[1] - r60Start[1]) * t2;
      whiteSuv.setLatLng([lat2, lng2]);

      const t3 = (t + 0.7) % 1;
      const lat3 = r33Start[0] + (r33End[0] - r33Start[0]) * t3;
      const lng3 = r33Start[1] + (r33End[1] - r33Start[1]) * t3;
      yellowCar.setLatLng([lat3, lng3]);

      animationFrameRef.current = requestAnimationFrame(animateCars);
    };

    animationFrameRef.current = requestAnimationFrame(animateCars);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mapInstanceRef.current && carsGroup) {
        map.removeLayer(carsGroup);
      }
    };
  }, [animateVehicles]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Leaflet Map DOM Target */}
      <div
        ref={mapContainerRef}
        className="w-full h-full bg-[#E5ECE3] z-0"
        style={{ cursor: 'grab' }}
      />
    </div>
  );
});

export default Layout2DView;
