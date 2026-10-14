import React, { useState, useRef, useEffect, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Compass,
  Layers,
  MapPin,
  Navigation,
  Sparkles,
  Maximize2,
  RotateCcw,
  Plus,
  Minus
} from 'lucide-react';
import {
  SITE_GEO,
  SITE_BOUNDARY_GEO,
  localToLatLng,
  layoutRoads,
  parkData,
  statusColors
} from './masterPlanData';

// Map tile providers
const TILE_LAYERS = {
  carto: {
    name: 'Map View (Carto)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/" target="_blank" rel="noopener noreferrer">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  },
  satellite: {
    name: 'Satellite View (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    subdomains: '',
    maxZoom: 19
  },
  osm: {
    name: 'Standard OSM',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    subdomains: '',
    maxZoom: 19
  }
};

// Surrounding Kadthal Landmarks for GIS orientation
const GIS_LANDMARKS = [
  {
    name: 'Maisigandi Maisamma Temple',
    pos: [17.1042, 78.5118],
    desc: 'Renowned Spiritual Landmark • 0.8 km North',
    iconColor: '#D97706'
  },
  {
    name: 'Srisailam Highway (NH-765)',
    pos: [17.0985, 78.5098],
    desc: '4-Lane Express Corridor (Direct Frontage)',
    iconColor: '#2563EB'
  },
  {
    name: 'Kadthal Town Center & RRR Junction',
    pos: [17.0920, 78.5040],
    desc: 'Commercial Hub & Proposed RRR Exit',
    iconColor: '#7C3AED'
  }
];

const Layout2DView = React.forwardRef(function Layout2DView({
  plots = [],
  selectedPlot = null,
  onSelectPlot = () => {},
  filterStatus = 'all',
  filterFacing = 'all',
  searchTerm = ''
}, ref) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const plotLayersRef = useRef({});
  const carsGroupRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [activeTileType, setActiveTileType] = useState('carto');
  const [currentZoom, setCurrentZoom] = useState(SITE_GEO.zoom);

  // Expose imperative methods for external toolbar
  React.useImperativeHandle(ref, () => ({
    zoomIn: () => mapInstanceRef.current?.zoomIn(),
    zoomOut: () => mapInstanceRef.current?.zoomOut(),
    reset: () => mapInstanceRef.current?.setView(SITE_GEO.center, SITE_GEO.zoom, { animate: true }),
    setTileType: (type) => setActiveTileType(type)
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
      zoomControl: false, // We render custom zoom controls matching Plots99
      attributionControl: false // Custom attribution placed cleanly at bottom-right
    });

    mapInstanceRef.current = map;

    // Add initial base tile layer
    const tileConfig = TILE_LAYERS[activeTileType];
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

  // 2. Handle Base Tile Layer Switch (Carto / Satellite / OSM)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    const tileConfig = TILE_LAYERS[activeTileType];
    const newLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      subdomains: tileConfig.subdomains,
      maxZoom: tileConfig.maxZoom
    }).addTo(map);
    tileLayerRef.current = newLayer;
  }, [activeTileType]);

  // 3. Render Site Layers: Boundary, Roads, Park, Landmarks
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

    // Boundary Outer Glow / Accent
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
        // Yellow median divider
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

      // Road Typography Label Pill
      const centerGeo = localToLatLng(road.center[0], road.center[1]);
      const roadLabel = L.divIcon({
        className: 'custom-road-label',
        html: `<div style="
          background: rgba(15, 23, 42, 0.75);
          color: #E2E8F0;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 1px 5px;
          border-radius: 4px;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(255,255,255,0.2);
        ">${road.shortName}</div>`,
        iconSize: [0, 0]
      });
      L.marker(centerGeo, { icon: roadLabel, interactive: false }).addTo(staticGroup);
    });

    // (C) Ac. 0.758 Central Park (Matching Plots99 Screenshots 1 & 5)
    const parkGeoPoly = parkData.polygon.map(([x, z]) => localToLatLng(x, z));
    L.polygon(parkGeoPoly, {
      color: '#558B2F',
      weight: 2,
      fillColor: '#8BC34A', // Vibrant Lime Green
      fillOpacity: 0.95,
      interactive: true
    }).bindTooltip(`<strong>${parkData.name}</strong><br/>Ac. 0.758 Cents • Landscaped Garden`, {
      direction: 'top'
    }).addTo(staticGroup);

    // Park Center Label Badge (Matching Plots99 Screenshots 1 & 5)
    const parkCenterGeo = localToLatLng(parkData.center[0], parkData.center[1]);
    const parkBadge = L.divIcon({
      className: 'custom-park-badge',
      html: `<div style="
        background: rgba(255, 255, 255, 0.94);
        backdrop-filter: blur(4px);
        padding: 2.5px 8px;
        border-radius: 6px;
        border: 1px solid rgba(46, 125, 50, 0.4);
        box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -50%);
        pointer-events: none;
        white-space: nowrap;
      ">
        <div style="font-size: 11px; font-weight: 800; color: #166534; display: flex; align-items: center; gap: 4px;">
          <span style="font-size: 11px;">🌳</span> Park
        </div>
        <div style="font-size: 8.5px; font-weight: 600; color: #2E7D32;">
          Ac. 0.758
        </div>
      </div>`,
      iconSize: [64, 32],
      iconAnchor: [32, 16]
    });
    L.marker(parkCenterGeo, { icon: parkBadge, interactive: false }).addTo(staticGroup);

    // Scattered Crisp Vector Flower Blossoms inside Park Lawn (matching Plots99 Screenshot 5)
    // Distributed safely inside park boundary (X: -88 to -58, Z: -42 to -10) away from center badge and plot borders
    const parkFlowerBlossoms = [
      { pos: [-82, -35], type: 'daisy' },
      { pos: [-65, -34], type: 'coral' },
      { pos: [-81, -17], type: 'daisy' },
      { pos: [-66, -18], type: 'coral' },
      { pos: [-73, -36], type: 'daisy' }
    ];

    const daisyFlowerSvg = `<svg width="12" height="12" viewBox="0 0 20 20" fill="none" style="display:block;">
      <circle cx="10" cy="10" r="3" fill="#F59E0B"/>
      <circle cx="10" cy="4" r="3" fill="#FFFFFF"/>
      <circle cx="10" cy="16" r="3" fill="#FFFFFF"/>
      <circle cx="4" cy="10" r="3" fill="#FFFFFF"/>
      <circle cx="16" cy="10" r="3" fill="#FFFFFF"/>
      <circle cx="5.8" cy="5.8" r="2.8" fill="#FFFFFF"/>
      <circle cx="14.2" cy="14.2" r="2.8" fill="#FFFFFF"/>
      <circle cx="5.8" cy="14.2" r="2.8" fill="#FFFFFF"/>
      <circle cx="14.2" cy="5.8" r="2.8" fill="#FFFFFF"/>
    </svg>`;

    const coralFlowerSvg = `<svg width="11" height="11" viewBox="0 0 20 20" fill="none" style="display:block;">
      <circle cx="10" cy="10" r="3.2" fill="#DC2626"/>
      <circle cx="10" cy="4.5" r="3" fill="#FB923C"/>
      <circle cx="10" cy="15.5" r="3" fill="#FB923C"/>
      <circle cx="4.5" cy="10" r="3" fill="#FB923C"/>
      <circle cx="15.5" cy="10" r="3" fill="#FB923C"/>
    </svg>`;

    parkFlowerBlossoms.forEach(fl => {
      const flGeo = localToLatLng(fl.pos[0], fl.pos[1]);
      const flIcon = L.divIcon({
        className: 'park-flower-blossom',
        html: `<div style="
          transform: translate(-50%, -50%);
          pointer-events: none;
          filter: drop-shadow(0 1px 1.5px rgba(0,0,0,0.25));
        ">${fl.type === 'daisy' ? daisyFlowerSvg : coralFlowerSvg}</div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
      L.marker(flGeo, { icon: flIcon, interactive: false }).addTo(staticGroup);
    });

    // (D) Surrounding GIS Landmark Pins
    GIS_LANDMARKS.forEach(lm => {
      const lmIcon = L.divIcon({
        className: 'custom-gis-landmark',
        html: `<div style="
          background: white;
          color: #0F172A;
          border: 1.5px solid ${lm.iconColor};
          padding: 2px 6px;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 700;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.15);
          white-space: nowrap;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${lm.iconColor};"></span>
          <span>${lm.name}</span>
        </div>`,
        iconSize: [0, 0]
      });
      L.marker(lm.pos, { icon: lmIcon })
        .bindTooltip(`<strong>${lm.name}</strong><br/>${lm.desc}`, { direction: 'top' })
        .addTo(staticGroup);
    });

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

    // (A) Overview Block Labels when zoomed out (< 17.5) to prevent number overlaps
    if (currentZoom < 17.5) {
      const BLOCK_LABELS = [
        { name: 'Block A', pos: [-47, -22.5] },
        { name: 'Block B', pos: [-18, -22.5] },
        { name: 'Block C', pos: [11, -22.5] },
        { name: 'Block D', pos: [39.5, -22.5] },
        { name: 'Block E', pos: [60, -22.5] },
        { name: 'Block F', pos: [-71.5, 32] },
        { name: 'Block G', pos: [-47, 32] },
        { name: 'Block H', pos: [-18, 32] },
        { name: 'Block I', pos: [11, 32] },
        { name: 'Block J', pos: [39.5, 32] },
        { name: 'Block K', pos: [63.5, 32] }
      ];

      BLOCK_LABELS.forEach(block => {
        const blockGeo = localToLatLng(block.pos[0], block.pos[1]);
        const blockIcon = L.divIcon({
          className: 'block-overview-pill',
          html: `<div style="
            background: rgba(255, 255, 255, 0.94);
            color: #1E293B;
            font-size: 10px;
            font-weight: 700;
            padding: 1.5px 7px;
            border-radius: 9999px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            border: 1px solid rgba(0,0,0,0.1);
            transform: translate(-50%, -50%);
            pointer-events: none;
            white-space: nowrap;
            letter-spacing: 0.3px;
          ">${block.name}</div>`,
          iconSize: [60, 20],
          iconAnchor: [30, 10]
        });
        L.marker(blockGeo, { icon: blockIcon, interactive: false }).addTo(plotsGroup);
      });
    }

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

      // Interactive Click
      poly.on('click', () => {
        onSelectPlot(plot);
      });

      // Hover Tooltip
      poly.bindTooltip(
        `<div style="font-family: sans-serif; font-size: 11px; padding: 2px 4px;">
          <strong>Plot #${plot.plotNumber}</strong> (${plot.status.toUpperCase()})<br/>
          Facing: <strong>${plot.facing}</strong><br/>
          Area: <strong>${plot.areaSqYds} yd²</strong> (${plot.dimensions})
        </div>`,
        { sticky: true, opacity: 0.95 }
      );

      poly.addTo(plotsGroup);
      layersMap[plot.plotNumber] = poly;

      // Plot Number Typography (matching Plots99 Screenshots 1 & 5)
      // Display if visible and at zoom >= 17.5, OR if specifically selected/searched
      const showAllNumbers = currentZoom >= 17.5;
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
          // Regular Plot Number - Dynamic sizing with 4-way halo shadow for zero collision & max legibility
          const fontSize = currentZoom >= 19 ? '11px' : currentZoom >= 18.2 ? '9.5px' : '8.5px';
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
            iconSize: [20, 12],
            iconAnchor: [10, 6]
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

  // 5. Fly to and focus Selected Plot with tooltip
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlot) return;
    const map = mapInstanceRef.current;
    if (selectedPlot.geoCenter) {
      const targetZoom = Math.max(map.getZoom(), 18);
      map.flyTo(selectedPlot.geoCenter, targetZoom, { animate: true, duration: 0.8 });
      const layer = plotLayersRef.current[selectedPlot.plotNumber];
      if (layer) {
        layer.bringToFront();
        layer.openTooltip();
      }
    }
  }, [selectedPlot]);

  // 6. Fly to search target when plot number entered
  useEffect(() => {
    if (!mapInstanceRef.current || !searchTerm) return;
    const clean = searchTerm.trim();
    const found = plots.find(p => String(p.plotNumber) === clean);
    if (found && found.geoCenter) {
      const map = mapInstanceRef.current;
      const targetZoom = Math.max(map.getZoom(), 18);
      map.flyTo(found.geoCenter, targetZoom, { animate: true, duration: 0.8 });
      const layer = plotLayersRef.current[found.plotNumber];
      if (layer) {
        layer.bringToFront();
        layer.openTooltip();
      }
    }
  }, [searchTerm, plots]);

  // 7. Animated 2D Vehicles on Roads (matching user requirement)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const carsGroup = L.layerGroup().addTo(map);
    carsGroupRef.current = carsGroup;

    // Highway waypoints (North to South along Srisailam Highway)
    const hwyStart = localToLatLng(80, -54);
    const hwyEnd = localToLatLng(80, 64);

    // 60' Road waypoints (East to West)
    const r60Start = localToLatLng(80, -47);
    const r60End = localToLatLng(-90, -47);

    // 33' Boulevard waypoints (West to East)
    const r33Start = localToLatLng(-60, 0.5);
    const r33End = localToLatLng(60, 0.5);

    let t = 0;
    const animateCars = () => {
      t += 0.003;
      if (t > 1) t = 0;

      carsGroup.clearLayers();

      // Car 1: Red Sedan on Highway Southbound (matching Screenshot 3)
      const lat1 = hwyStart[0] + (hwyEnd[0] - hwyStart[0]) * t;
      const lng1 = hwyStart[1] + (hwyEnd[1] - hwyStart[1]) * t;
      const redSedan = L.divIcon({
        html: `<div style="
          width: 14px; height: 7px;
          background: #DC2626;
          border-radius: 2px;
          border: 1px solid #7F1D1D;
          box-shadow: 0 1px 3px rgba(0,0,0,0.5);
          transform: rotate(90deg);
        "></div>`,
        iconSize: [14, 7]
      });
      L.marker([lat1, lng1], { icon: redSedan, interactive: false }).addTo(carsGroup);

      // Car 2: White SUV on 60ft Road Westbound
      const lat2 = r60Start[0] + (r60End[0] - r60Start[0]) * ((t + 0.35) % 1);
      const lng2 = r60Start[1] + (r60End[1] - r60Start[1]) * ((t + 0.35) % 1);
      const whiteSuv = L.divIcon({
        html: `<div style="
          width: 13px; height: 7px;
          background: #FFFFFF;
          border-radius: 2px;
          border: 1px solid #334155;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [13, 7]
      });
      L.marker([lat2, lng2], { icon: whiteSuv, interactive: false }).addTo(carsGroup);

      // Car 3: Yellow Hatchback on 33' Main Boulevard Eastbound
      const lat3 = r33Start[0] + (r33End[0] - r33Start[0]) * ((t + 0.7) % 1);
      const lng3 = r33Start[1] + (r33End[1] - r33Start[1]) * ((t + 0.7) % 1);
      const yellowCar = L.divIcon({
        html: `<div style="
          width: 12px; height: 6px;
          background: #FBBF24;
          border-radius: 2px;
          border: 1px solid #78350F;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [12, 6]
      });
      L.marker([lat3, lng3], { icon: yellowCar, interactive: false }).addTo(carsGroup);

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
  }, []);

  // Zoom controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleReset = useCallback(() => {
    mapInstanceRef.current?.setView(SITE_GEO.center, SITE_GEO.zoom, { animate: true });
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Leaflet Map DOM Target */}
      <div
        ref={mapContainerRef}
        className="w-full h-full bg-[#E5ECE3] z-0"
        style={{ cursor: 'grab' }}
      />

      {/* Top-Left Geographic Information Pill */}
      <div className="absolute top-4 left-4 z-20 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-brand-orange">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <span>Kadthal, Srisailam Highway</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                17.0985° N, 78.5085° E
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              DTCP &amp; TS RERA Registered Venture &bull; Dynamic Master Plan Overlay
            </div>
          </div>
        </div>
      </div>

      {/* Top-Right Map Layer Mode Switcher (Map vs Satellite) */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto flex items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/90 shadow-xl flex items-center gap-1">
          <button
            onClick={() => setActiveTileType('carto')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTileType === 'carto'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Map View
          </button>
          <button
            onClick={() => setActiveTileType('satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTileType === 'satellite'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setActiveTileType('osm')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTileType === 'osm'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            OSM
          </button>
        </div>

        {/* Reset Camera Fit Button */}
        <button
          onClick={handleReset}
          className="w-9 h-9 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl text-slate-700 hover:text-brand-orange flex items-center justify-center transition-all hover:scale-105"
          title="Reset View to Layout Center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Right Map Attribution (Exact Match to Screenshots 1 & 5) */}
      <div className="absolute bottom-2 right-24 z-20 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xs text-[10px] text-slate-600 px-2 py-0.5 rounded shadow-xs font-sans">
          &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline pointer-events-auto">OpenStreetMap contributors</a>
        </div>
      </div>
    </div>
  );
});

export default Layout2DView;
