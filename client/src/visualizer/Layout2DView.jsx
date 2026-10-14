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

// Real Google Maps Roadmap tile provider (Zero API Key Required)
export const GOOGLE_MAP_LAYER = {
  url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
  attribution: '&copy; Google Maps &bull; Kadthal, Srisailam Highway',
  subdomains: ['0', '1', '2', '3'],
  maxZoom: 21
};

export const MAP_LAYERS = {
  google: GOOGLE_MAP_LAYER
};

// Perimeter Surrounding Greenery Belts Around Layout (Matching Real Kadthal Landscape)
const SURROUNDING_GREEN_BUFFERS = [
  // 1. West Agricultural & Plantation Green Belt
  {
    id: 'green-west',
    name: 'West Agricultural & Plantation Belt',
    polygon: [
      [-128, -62],
      [-92, -62],
      [-92, 74],
      [-128, 74]
    ],
    fillColor: '#79B746',
    borderColor: '#4F8528'
  },
  // 2. North Green Buffer Corridor (Behind 60ft Road to Maisigandi)
  {
    id: 'green-north',
    name: 'North Green Buffer Corridor',
    polygon: [
      [-128, -82],
      [114, -82],
      [114, -52],
      [-128, -52]
    ],
    fillColor: '#70AB3E',
    borderColor: '#4A7D24'
  },
  // 3. South Plantation Green Buffer Belt
  {
    id: 'green-south',
    name: 'South Plantation Green Buffer',
    polygon: [
      [-128, 66],
      [114, 66],
      [114, 96],
      [-128, 96]
    ],
    fillColor: '#79B746',
    borderColor: '#4F8528'
  },
  // 4. East Highway Landscaped Verge Buffer (NH-765)
  {
    id: 'green-east',
    name: 'Highway Landscaped Green Buffer',
    polygon: [
      [88, -82],
      [118, -82],
      [118, 96],
      [88, 96]
    ],
    fillColor: '#659E36',
    borderColor: '#417020'
  }
];

// Outer Canopy Shade Tree Coordinates scattered in the Surrounding Greenery Belts
const OUTER_CANOPY_TREE_COORDS = [
  // West Buffer Trees
  [-114, -50], [-114, -30], [-114, -10], [-114, 10], [-114, 30], [-114, 50], [-114, 65],
  // North Buffer Trees
  [-105, -67], [-75, -67], [-45, -67], [-15, -67], [15, -67], [45, -67], [75, -67], [98, -67],
  // South Buffer Trees
  [-105, 81], [-75, 81], [-45, 81], [-15, 81], [15, 81], [45, 81], [75, 81], [98, 81],
  // East Highway Outer Trees
  [104, -50], [104, -25], [104, 0], [104, 25], [104, 50], [104, 75]
];

// Authoritative Avenue Palm Trees along Block Borders on Road Verges (Zero Encroachment on Plots)
const AVENUE_TREE_COORDS = [
  // Block A (facing 60ft road, Road V1, Central Blvd)
  [-54, -43.2], [-46.5, -43.2], [-39, -43.2],
  [-34.8, -35], [-34.8, -23], [-34.8, -11],
  [-54, -1.8], [-46.5, -1.8], [-39, -1.8],

  // Block B (facing Road V1, 60ft road, Road V2, Central Blvd)
  [-30.2, -35], [-30.2, -23], [-30.2, -11],
  [-25, -43.2], [-18, -43.2], [-11, -43.2],
  [-5.8, -35], [-5.8, -23], [-5.8, -11],
  [-25, -1.8], [-18, -1.8], [-11, -1.8],

  // Block C (facing Road V2, 60ft road, Road V3, Central Blvd)
  [-1.2, -35], [-1.2, -23], [-1.2, -11],
  [4, -43.2], [11, -43.2], [18, -43.2],
  [23.2, -35], [23.2, -23], [23.2, -11],
  [4, -1.8], [11, -1.8], [18, -1.8],

  // Block D (facing Road V3, 60ft road, Road V4, Central Blvd)
  [27.8, -35], [27.8, -23], [27.8, -11],
  [33, -43.2], [39.5, -43.2], [46, -43.2],
  [51.2, -35], [51.2, -23], [51.2, -11],
  [33, -1.8], [39.5, -1.8], [46, -1.8],

  // Block E (facing Road V4, Service Road, Central Blvd)
  [55.8, -35], [55.8, -23], [55.8, -11],
  [64.2, -35], [64.2, -23], [64.2, -11],
  [60, -1.8],

  // Block F (facing Central Blvd, Road V0)
  [-71.5, 2.8],
  [-63.8, 14], [-63.8, 26], [-63.8, 38], [-63.8, 50],

  // Block G (facing Road V0, Central Blvd, Road V1, South road)
  [-59.2, 14], [-59.2, 26], [-59.2, 38], [-59.2, 50],
  [-54, 2.8], [-46.5, 2.8], [-39, 2.8],
  [-34.8, 14], [-34.8, 26], [-34.8, 38], [-34.8, 50],
  [-54, 61.2], [-46.5, 61.2], [-39, 61.2],

  // Block H (facing Road V1, Central Blvd, Road V2, South road)
  [-30.2, 14], [-30.2, 26], [-30.2, 38], [-30.2, 50],
  [-25, 2.8], [-18, 2.8], [-11, 2.8],
  [-5.8, 14], [-5.8, 26], [-5.8, 38], [-5.8, 50],
  [-25, 61.2], [-18, 61.2], [-11, 61.2],

  // Block I (facing Road V2, Central Blvd, Road V3, South road)
  [-1.2, 14], [-1.2, 26], [-1.2, 38], [-1.2, 50],
  [4, 2.8], [11, 2.8], [18, 2.8],
  [23.2, 14], [23.2, 26], [23.2, 38], [23.2, 50],
  [4, 61.2], [11, 61.2], [18, 61.2],

  // Block J (facing Road V3, Central Blvd, Road V4, South road)
  [27.8, 14], [27.8, 26], [27.8, 38], [27.8, 50],
  [33, 2.8], [39.5, 2.8], [46, 2.8],
  [51.2, 14], [51.2, 26], [51.2, 38], [51.2, 50],
  [33, 61.2], [39.5, 61.2], [46, 61.2],

  // Block K (facing Road V4, Central Blvd, Service Road, South road)
  [55.8, 14], [55.8, 26], [55.8, 38], [55.8, 50],
  [63.5, 2.8],
  [71.2, 14], [71.2, 26], [71.2, 38], [71.2, 50],
  [63.5, 61.2]
];

const Layout2DView = React.forwardRef(function Layout2DView({
  plots = [],
  selectedPlot = null,
  onSelectPlot = () => {},
  filterStatus = 'all',
  filterFacing = 'all',
  searchTerm = '',
  animateVehicles = true
}, ref) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const plotLayersRef = useRef({});

  const [currentZoom, setCurrentZoom] = useState(SITE_GEO.zoom);

  // Expose imperative methods for external toolbar
  React.useImperativeHandle(ref, () => ({
    zoomIn: () => mapInstanceRef.current?.zoomIn(),
    zoomOut: () => mapInstanceRef.current?.zoomOut(),
    reset: () => mapInstanceRef.current?.setView(SITE_GEO.center, SITE_GEO.zoom, { animate: true }),
    setMapType: () => {}
  }));

  // 1. Initialize Leaflet Map with Pure Google Maps Roadmap
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      center: SITE_GEO.center,
      zoom: SITE_GEO.zoom,
      minZoom: SITE_GEO.minZoom,
      maxZoom: SITE_GEO.maxZoom,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Add base tile layer (Google Maps roadmap)
    const tileLayer = L.tileLayer(GOOGLE_MAP_LAYER.url, {
      attribution: GOOGLE_MAP_LAYER.attribution,
      subdomains: GOOGLE_MAP_LAYER.subdomains,
      maxZoom: GOOGLE_MAP_LAYER.maxZoom
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Track zoom updates for responsive number/label scaling
    const updateZoom = () => setCurrentZoom(map.getZoom());
    map.on('zoom', updateZoom);
    map.on('zoomend', updateZoom);

    // Clicking map background deselects any currently active plot
    map.on('click', (e) => {
      // If user clicked the canvas background rather than a plot polygon
      if (e.originalEvent && !e.originalEvent._plotClicked) {
        onSelectPlot(null);
      }
    });

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
  }, [onSelectPlot]);

  // 2. Render Site Layers: Surrounding Greenery, Boundary, Roads, Park, Avenue Trees & Entrance
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const staticGroup = L.layerGroup().addTo(map);

    // (A) Surrounding Greenery Buffer Belts Around Layout
    SURROUNDING_GREEN_BUFFERS.forEach(buff => {
      const geoPoly = buff.polygon.map(([x, z]) => localToLatLng(x, z));
      L.polygon(geoPoly, {
        color: buff.borderColor,
        weight: 1.5,
        fillColor: buff.fillColor,
        fillOpacity: 0.88,
        interactive: false
      }).addTo(staticGroup);
    });

    // Outer Canopy Shade Trees in the Surrounding Greenery
    OUTER_CANOPY_TREE_COORDS.forEach(([tx, tz]) => {
      const geo = localToLatLng(tx, tz);
      const treeIcon = L.divIcon({
        className: 'canopy-tree-icon',
        html: `
          <svg width="22" height="22" viewBox="0 0 24 24" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.25)); pointer-events: none;">
            <circle cx="12" cy="12" r="11" fill="#3D7022" opacity="0.9" />
            <circle cx="12" cy="12" r="8.5" fill="#528F2E" />
            <circle cx="10" cy="9.5" r="5" fill="#6CB53D" opacity="0.85" />
            <circle cx="12" cy="12" r="2" fill="#2E1C0C" />
          </svg>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });
      L.marker(geo, { icon: treeIcon, interactive: false }).addTo(staticGroup);
    });

    // (B) DTCP Sanctioned Layout Boundary Polygon
    L.polygon(SITE_BOUNDARY_GEO, {
      color: '#15803D',
      weight: 3.0,
      fillColor: '#D1FAE5',
      fillOpacity: 0.25,
      interactive: false
    }).addTo(staticGroup);

    // Boundary White Accent Outer Line
    L.polyline(SITE_BOUNDARY_GEO.concat([SITE_BOUNDARY_GEO[0]]), {
      color: '#FFFFFF',
      weight: 1.5,
      dashArray: '6, 4',
      interactive: false
    }).addTo(staticGroup);

    // (C) Connected Road Network with Curbs & High-Definition Asphalt
    layoutRoads.forEach(road => {
      const geoPoly = road.polygon.map(([x, z]) => localToLatLng(x, z));
      const isHighway = road.type === 'highway';
      const isArterial = road.type === 'arterial';

      // Outer White Curb Stone Edges (Road Margin Lines)
      L.polygon(geoPoly, {
        color: '#E2E8F0',
        weight: 2.2,
        fillColor: isHighway ? '#111418' : '#1A1E24',
        fillOpacity: 0.98,
        interactive: false
      }).addTo(staticGroup);

      // Road Centerlines & Dividers
      if (isHighway) {
        // Double Yellow Median Divider for National Highway NH-765
        const [p0, p1, p2, p3] = road.polygon;
        const midTop = localToLatLng((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2);
        const midBottom = localToLatLng((p2[0] + p3[0]) / 2, (p2[1] + p3[1]) / 2);
        L.polyline([midTop, midBottom], {
          color: '#FBBF24',
          weight: 2.8,
          interactive: false
        }).addTo(staticGroup);

        // Highway Label
        const hwyCenter = localToLatLng(road.center[0], road.center[1]);
        const hwyLabel = L.divIcon({
          className: 'hwy-road-label',
          html: `
            <div style="
              color: #FEF08A;
              font-size: 8.5px;
              font-weight: 800;
              letter-spacing: 0.8px;
              text-transform: uppercase;
              text-shadow: 0 1px 3px rgba(0,0,0,0.9);
              white-space: nowrap;
              transform: translate(-50%, -50%) rotate(90deg);
              pointer-events: none;
            ">SRISAILAM HIGHWAY (NH-765)</div>
          `,
          iconSize: [0, 0]
        });
        L.marker(hwyCenter, { icon: hwyLabel, interactive: false }).addTo(staticGroup);

      } else if (isArterial) {
        // White Dashed Centerline for 60ft Arterial Road
        const [p0, p1, p2, p3] = road.polygon;
        const midLeft = localToLatLng((p0[0] + p3[0]) / 2, (p0[1] + p3[1]) / 2);
        const midRight = localToLatLng((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2);
        L.polyline([midLeft, midRight], {
          color: '#FFFFFF',
          weight: 2,
          dashArray: '6, 6',
          interactive: false
        }).addTo(staticGroup);

        // 60ft Road Label
        const r60Center = localToLatLng(road.center[0], road.center[1]);
        const r60Label = L.divIcon({
          className: 'r60-road-label',
          html: `
            <div style="
              color: #F8FAFC;
              font-size: 8px;
              font-weight: 800;
              letter-spacing: 0.6px;
              text-transform: uppercase;
              text-shadow: 0 1px 2px rgba(0,0,0,0.9);
              white-space: nowrap;
              transform: translate(-50%, -50%);
              pointer-events: none;
            ">60' ROAD (TO MAISIGANDI)</div>
          `,
          iconSize: [0, 0]
        });
        L.marker(r60Center, { icon: r60Label, interactive: false }).addTo(staticGroup);

      } else if (road.id === 'ROAD-33-MID') {
        // White Dashed Centerline for Central Boulevard
        const [p0, p1, p2, p3] = road.polygon;
        const midLeft = localToLatLng((p0[0] + p3[0]) / 2, (p0[1] + p3[1]) / 2);
        const midRight = localToLatLng((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2);
        L.polyline([midLeft, midRight], {
          color: 'rgba(255, 255, 255, 0.7)',
          weight: 1.5,
          dashArray: '5, 5',
          interactive: false
        }).addTo(staticGroup);

        // 33ft Main Boulevard Typography
        const centerGeo = localToLatLng(road.center[0], road.center[1]);
        const roadLabel = L.divIcon({
          className: 'custom-road-label',
          html: `
            <div style="
              color: rgba(255, 255, 255, 0.95);
              font-size: 8px;
              font-weight: 800;
              letter-spacing: 0.6px;
              text-transform: uppercase;
              text-shadow: 0 1px 3px rgba(0,0,0,0.9);
              white-space: nowrap;
              transform: translate(-50%, -50%);
              pointer-events: none;
            ">33' MAIN BOULEVARD</div>
          `,
          iconSize: [0, 0]
        });
        L.marker(centerGeo, { icon: roadLabel, interactive: false }).addTo(staticGroup);
      }
    });

    // (D) Ac. 0.758 Central Park with Jogging Track & Manicured Lawn
    const parkOuterGeo = parkData.polygon.map(([x, z]) => localToLatLng(x, z));
    // Perimeter Walking / Jogging Track (Warm Sandstone Paver Border)
    L.polygon(parkOuterGeo, {
      color: '#B45309',
      weight: 1.5,
      fillColor: '#FDE68A',
      fillOpacity: 0.95,
      interactive: false
    }).addTo(staticGroup);

    // Inner Lush Grass Lawn
    const parkInnerPoly = [
      [-86.2, -40.2],
      [-59.8, -40.2],
      [-59.8, -4.8],
      [-86.2, -4.8]
    ].map(([x, z]) => localToLatLng(x, z));

    L.polygon(parkInnerPoly, {
      color: '#4A7C12',
      weight: 1.5,
      fillColor: '#7CB518',
      fillOpacity: 0.98,
      interactive: false
    }).addTo(staticGroup);

    // Park Center Typography directly on grass
    const parkCenterGeo = localToLatLng(parkData.center[0], parkData.center[1]);
    const parkBadge = L.divIcon({
      className: 'custom-park-typography',
      html: `
        <div style="
          text-align: center;
          transform: translate(-50%, -50%);
          pointer-events: none;
          user-select: none;
        ">
          <div style="font-size: 11px; font-weight: 800; color: #FFFFFF; text-shadow: 0 1px 3px rgba(0,0,0,0.6); letter-spacing: 0.5px;">
            CENTRAL PARK
          </div>
          <div style="font-size: 8px; font-weight: 700; color: #FEF08A; text-shadow: 0 1px 2px rgba(0,0,0,0.6);">
            Ac. 0.758 &bull; Jogging Track
          </div>
        </div>
      `,
      iconSize: [70, 26],
      iconAnchor: [35, 13]
    });
    L.marker(parkCenterGeo, { icon: parkBadge, interactive: false }).addTo(staticGroup);

    // Park Perimeter Palm Trees
    const parkPerimeterTrees = [
      [-86, -41], [-80, -41], [-74, -41], [-68, -41], [-62, -41],
      [-86, -4], [-80, -4], [-74, -4], [-68, -4], [-62, -4],
      [-87, -33], [-87, -25], [-87, -17], [-87, -9],
      [-59, -33], [-59, -25], [-59, -17], [-59, -9]
    ];
    parkPerimeterTrees.forEach(([px, pz]) => {
      const geo = localToLatLng(px, pz);
      const icon = L.divIcon({
        className: 'park-palm-tree-icon',
        html: `
          <svg width="12" height="12" viewBox="0 0 16 16" style="filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3)); pointer-events: none;">
            <circle cx="8" cy="8" r="7" fill="#4D7C0F" opacity="0.9" />
            <path d="M8 1 L8 15 M1 8 L15 8 M3 3 L13 13 M3 13 L13 3" stroke="#84CC16" stroke-width="1.4" stroke-linecap="round" />
            <circle cx="8" cy="8" r="3" fill="#A3E635" />
            <circle cx="8" cy="8" r="1.2" fill="#3D2817" />
          </svg>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
      L.marker(geo, { icon, interactive: false }).addTo(staticGroup);
    });

    // (E) Avenue Palm Trees along Block Borders on Road Verges (Matching 3D Models)
    AVENUE_TREE_COORDS.forEach(([tx, tz]) => {
      const geo = localToLatLng(tx, tz);
      const palmIcon = L.divIcon({
        className: 'avenue-palm-tree-icon',
        html: `
          <svg width="14" height="14" viewBox="0 0 18 18" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.35)); pointer-events: none;">
            <circle cx="9" cy="9" r="8" fill="#528F22" opacity="0.92" />
            <path d="M9 1.5 L9 16.5 M1.5 9 L16.5 9 M3.5 3.5 L14.5 14.5 M3.5 14.5 L14.5 3.5" stroke="#78B82B" stroke-width="1.6" stroke-linecap="round" />
            <circle cx="9" cy="9" r="3.8" fill="#88C734" />
            <circle cx="9" cy="9" r="1.4" fill="#3E2A18" />
          </svg>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });
      L.marker(geo, { icon: palmIcon, interactive: false }).addTo(staticGroup);
    });

    // (F) Grand Entrance Arch Symbol connecting to Service Road
    const entranceGeo = localToLatLng(63, 0.5);
    const archIcon = L.divIcon({
      className: 'entrance-arch-icon',
      html: `
        <div style="
          background: #0F172A;
          color: #FEF08A;
          border: 1.5px solid #F59E0B;
          border-radius: 4px;
          padding: 2px 5px;
          font-size: 7.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          box-shadow: 0 2px 6px rgba(0,0,0,0.45);
          white-space: nowrap;
          transform: translate(-50%, -50%) rotate(90deg);
          pointer-events: none;
        ">
          ⛩️ ENTRANCE ARCH
        </div>
      `,
      iconSize: [0, 0]
    });
    L.marker(entranceGeo, { icon: archIcon, interactive: false }).addTo(staticGroup);

    return () => {
      if (mapInstanceRef.current) {
        map.removeLayer(staticGroup);
      }
    };
  }, []);

  // 3. Render Dynamic Interactive Plots Layer
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
        color: isSelected ? '#EA580C' : '#FFFFFF',
        weight: isSelected ? 3.5 : 1.2,
        fillColor: baseColors.bg,
        fillOpacity: isVisible ? (isSelected ? 1.0 : 0.92) : 0.2,
        className: `plot-poly-${plot.plotNumber}`
      });

      // Interactive Click: selects the plot, opening the detail card
      poly.on('click', (e) => {
        if (e.originalEvent) {
          e.originalEvent._plotClicked = true;
        }
        onSelectPlot(plot);
      });

      // Hover Effect for Realistic Interactive CAD Feel
      poly.on('mouseover', () => {
        if (!isSelected) {
          poly.setStyle({
            color: '#2563EB',
            weight: 2.2,
            fillOpacity: 1.0
          });
        }
      });

      poly.on('mouseout', () => {
        if (!isSelected) {
          poly.setStyle({
            color: '#FFFFFF',
            weight: 1.2,
            fillOpacity: isVisible ? 0.92 : 0.2
          });
        }
      });

      poly.addTo(plotsGroup);
      layersMap[plot.plotNumber] = poly;

      // Plot Number & Dimension Typography (matching Plots99 Screenshots)
      const shouldShowNumber = isVisible;

      if (shouldShowNumber) {
        if (isSelected || isTargetMatch) {
          // Elevated Floating Badge for Active/Searched Plot
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
            iconSize: [34, 16],
            iconAnchor: [17, 8]
          });
          L.marker(plot.geoCenter, { icon: activeIcon, interactive: false, zIndexOffset: 1000 }).addTo(plotsGroup);
        } else {
          // Proportionally scaled typography based on zoom level & plot dimensions
          const isNarrow = (plot.plotNumber >= 1 && plot.plotNumber <= 6) || (plot.plotNumber >= 83 && plot.plotNumber <= 96);
          let fontSize = isNarrow ? '7px' : '8px';
          let showDims = false;

          if (currentZoom >= 19.8) {
            fontSize = isNarrow ? '8.5px' : '10px';
            showDims = !isNarrow;
          } else if (currentZoom >= 18.8) {
            fontSize = isNarrow ? '7.5px' : '9px';
          }

          const numColor = plot.status === 'sold' ? '#991B1B' : '#0F172A';
          const dimText = plot.dimensions ? plot.dimensions.split('x')[0].trim() : `${plot.areaSqYds} sq.yd`;

          const numIcon = L.divIcon({
            className: `plot-num-icon-${plot.plotNumber}`,
            html: `
              <div style="
                text-align: center;
                line-height: 1.1;
                transform: translate(-50%, -50%);
                pointer-events: none;
                user-select: none;
                white-space: nowrap;
              ">
                <div style="
                  font-size: ${fontSize};
                  font-weight: 800;
                  color: ${numColor};
                  letter-spacing: -0.3px;
                  text-shadow:
                    -1px -1px 0 #FFFFFF,
                     1px -1px 0 #FFFFFF,
                    -1px  1px 0 #FFFFFF,
                     1px  1px 0 #FFFFFF;
                ">${plot.plotNumber}</div>
                ${showDims ? `
                  <div style="
                    font-size: 6px;
                    font-weight: 700;
                    color: #475569;
                    margin-top: 1px;
                    letter-spacing: -0.2px;
                    text-shadow: 0 1px 2px #FFFFFF;
                  ">${dimText}</div>
                ` : ''}
              </div>
            `,
            iconSize: [24, 14],
            iconAnchor: [12, 7]
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
  }, [plots, selectedPlot, filterStatus, filterFacing, searchTerm, currentZoom, onSelectPlot]);

  // 4. Fly to and focus Selected Plot
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

  // 5. Fly to search target when plot number entered
  useEffect(() => {
    if (!mapInstanceRef.current || !searchTerm) return;
    const clean = searchTerm.trim();
    const digits = clean.replace(/\D/g, '');
    let found = plots.find(p => String(p.plotNumber) === clean || (digits && String(p.plotNumber) === digits));
    if (!found && clean.length >= 1) {
      found = plots.find(p => String(p.plotNumber).includes(clean));
    }
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

  // 6. Animated 2D Vehicles Driving along Highway & Venture Streets with Zoom-Proportional Scaling
  useEffect(() => {
    if (!mapInstanceRef.current || animateVehicles === false) return;
    const map = mapInstanceRef.current;

    const vehiclesGroup = L.layerGroup().addTo(map);

    const vehicleConfigs = [
      // 1. Red Sport Sedan: Srisailam Highway NH-765 (Southbound)
      {
        id: 'hwy-s',
        color: '#DC2626',
        start: [78, -55],
        end: [78, 65],
        heading: 90, // Southbound
        speed: 0.0028,
        offset: 0
      },
      // 2. Pearl White SUV: Srisailam Highway NH-765 (Northbound)
      {
        id: 'hwy-n',
        color: '#FFFFFF',
        start: [82, 65],
        end: [82, -55],
        heading: 270, // Northbound
        speed: 0.0032,
        offset: 0.48
      },
      // 3. Royal Blue Sedan: 60ft Road (Eastbound towards Highway)
      {
        id: 'r60-e',
        color: '#2563EB',
        start: [-88, -44.5],
        end: [72, -44.5],
        heading: 0, // Eastbound
        speed: 0.0022,
        offset: 0.15
      },
      // 4. Midnight Slate Car: 60ft Road (Westbound towards Maisigandi)
      {
        id: 'r60-w',
        color: '#1E293B',
        start: [72, -49.5],
        end: [-88, -49.5],
        heading: 180, // Westbound
        speed: 0.0024,
        offset: 0.62
      },
      // 5. Golden Amber Sedan: 33ft Central Boulevard (Eastbound)
      {
        id: 'r33-e',
        color: '#D97706',
        start: [-75, 1.8],
        end: [60, 1.8],
        heading: 0, // Eastbound
        speed: 0.0018,
        offset: 0.35
      },
      // 6. Emerald Green Hatchback: 33ft Central Boulevard (Westbound)
      {
        id: 'r33-w',
        color: '#059669',
        start: [60, -1.0],
        end: [-75, -1.0],
        heading: 180, // Westbound
        speed: 0.002,
        offset: 0.82
      },
      // 7. Violet Crossover: Vertical Road V2 (Southbound)
      {
        id: 'rv2-s',
        color: '#7C3AED',
        start: [-3.5, -38],
        end: [-3.5, 56],
        heading: 90, // Southbound
        speed: 0.0017,
        offset: 0.52
      }
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
            <!-- Front windshield -->
            <div style="position: absolute; right: 3px; top: 1px; width: 3.5px; height: 5px; background: rgba(30,41,59,0.85); border-radius: 1px;"></div>
            <!-- Rear glass -->
            <div style="position: absolute; left: 2.5px; top: 1px; width: 2.5px; height: 5px; background: rgba(30,41,59,0.85); border-radius: 1px;"></div>
            <!-- Roof -->
            <div style="position: absolute; left: 5px; top: 1px; width: 5px; height: 5px; background: ${cfg.color}; filter: brightness(1.15);"></div>
            <!-- Headlights -->
            <div style="position: absolute; right: -1px; top: 1px; width: 2px; height: 2px; background: #FEF08A; border-radius: 1px;"></div>
            <div style="position: absolute; right: -1px; bottom: 1px; width: 2px; height: 2px; background: #FEF08A; border-radius: 1px;"></div>
            <!-- Taillights -->
            <div style="position: absolute; left: -1px; top: 1px; width: 1.5px; height: 2px; background: #EF4444; border-radius: 1px;"></div>
            <div style="position: absolute; left: -1px; bottom: 1px; width: 1.5px; height: 2px; background: #EF4444; border-radius: 1px;"></div>
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
        const latLng = localToLatLng(curX, curZ);
        marker.setLatLng(latLng);
      });
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (mapInstanceRef.current && vehiclesGroup) {
        map.removeLayer(vehiclesGroup);
      }
    };
  }, [animateVehicles, currentZoom]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <style>{`
        .leaflet-control-attribution {
          display: none !important;
        }
        .canopy-tree-icon, .park-palm-tree-icon, .avenue-palm-tree-icon, .entrance-arch-icon {
          pointer-events: none !important;
        }
      `}</style>
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
