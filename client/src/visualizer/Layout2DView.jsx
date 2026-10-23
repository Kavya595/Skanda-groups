import React, { useState, useRef, useEffect } from 'react';
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
  google: GOOGLE_MAP_LAYER,
  roadmap: GOOGLE_MAP_LAYER
};

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
  const plotLayersRef = useRef({});
  const onSelectPlotRef = useRef(onSelectPlot);

  // Keep onSelectPlotRef updated without triggering map re-initialization
  useEffect(() => {
    onSelectPlotRef.current = onSelectPlot;
  }, [onSelectPlot]);

  const [currentZoom, setCurrentZoom] = useState(SITE_GEO.zoom);

  // Expose imperative methods for external toolbar with smooth, slow, gentle zoom steps
  React.useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.zoomIn(0.25);
      }
    },
    zoomOut: () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.zoomOut(0.25);
      }
    },
    reset: () => mapInstanceRef.current?.setView(SITE_GEO.center, SITE_GEO.zoom, { animate: true }),
    setMapType: () => {}
  }));

  // 1. Initialize Leaflet Map and Permanent Base Master Plan Layers (Surrounding Greenery, Boundary, Roads, Park)
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
      zoomSnap: 0.1,             // Fine fractional zoom levels (no jarring jumps)
      zoomDelta: 0.25,            // Small, gradual steps per button click
      wheelPxPerZoomLevel: 180,   // Slow, smooth mouse wheel zoom rate
      scrollWheelZoom: true,
      touchZoom: true,
      doubleClickZoom: true,
      zoomAnimation: true,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Add base tile layer (Clean Google Maps Roadmap)
    L.tileLayer(GOOGLE_MAP_LAYER.url, {
      attribution: GOOGLE_MAP_LAYER.attribution,
      subdomains: GOOGLE_MAP_LAYER.subdomains,
      maxZoom: GOOGLE_MAP_LAYER.maxZoom
    }).addTo(map);

    // Track zoom updates for responsive typography scaling
    const updateZoom = () => setCurrentZoom(map.getZoom());
    map.on('zoom', updateZoom);
    map.on('zoomend', updateZoom);

    // Clicking empty map background deselects plot safely
    map.on('click', (e) => {
      if (e?.originalEvent?._plotClicked) return;
      const target = e?.originalEvent?.target;
      if (target && (target.tagName === 'path' || target.closest?.('.leaflet-interactive'))) {
        return;
      }
      if (onSelectPlotRef.current) {
        onSelectPlotRef.current(null);
      }
    });

    // -------------------------------------------------------------
    // Permanent Static Master Plan Group (Always Persistent on Map)
    // -------------------------------------------------------------
    const staticGroup = L.layerGroup().addTo(map);

    // (A) DTCP Sanctioned Layout Boundary Polygon (Exact cuts matching brochure)
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

    // (C) Connected Road Network with White Curb Margins & Deep Asphalt
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
      }
    });

    // (D) Clean Ac. 0.758 Central Park (Jogging Track & Emerald Lawn, No Tree Dots)
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
      color: '#3B6E0E',
      weight: 1.8,
      fillColor: '#68B31E',
      fillOpacity: 0.98,
      interactive: false
    }).addTo(staticGroup);

    const entranceGeo = localToLatLng(63, 0.5);

    // (F) Dedicated Surrounding Green Estate Buffer (Matching Plots99 Image 1)
    const estateBufferLocal = [
      [-132, -72], [-120, -84], [-60, -86], [0, -82], [55, -78], [88, -66],
      [98, -20], [104, 18], [96, 70], [68, 86], [18, 92], [-35, 90],
      [-88, 88], [-118, 76], [-134, 20], [-134, -35]
    ];
    const estateBufferGeo = estateBufferLocal.map(([x, z]) => localToLatLng(x, z));
    L.polygon(estateBufferGeo, {
      color: '#16A34A',
      weight: 1.8,
      fillColor: '#86EFAC',
      fillOpacity: 0.22,
      dashArray: '4, 4',
      interactive: false
    }).addTo(staticGroup);

    // (G) 100 Feet Road Corridor connecting Srisailam Highway directly to Site (from Official Flyer)
    const road100FtHwyPoint = localToLatLng(80, 0.5);
    L.polyline([entranceGeo, road100FtHwyPoint], {
      color: '#F59E0B',
      weight: 4,
      opacity: 0.85,
      interactive: false
    }).addTo(staticGroup);

    // (H) Authentic Regional Landmarks situated on map (Matching Google Maps exact location)
    const flyerLandmarks = [
      {
        pos: [16.9545, 78.5145], // Sri Maisigandi Maisamma Temple (East near Srisailam Highway)
        title: "Maisigandi Ramalingeswara Temple",
        badge: "🛕 Maisigandi Temple (1 min)",
        style: "background: #78350F; color: #FEF08A; border: 1.5px solid #F59E0B;"
      },
      {
        pos: [16.9723, 78.5098], // Kadthal Toll Plaza on NH-765 Srisailam Highway
        title: "Kadthal Toll Plaza (NH-765)",
        badge: "🛣️ Kadthal Toll Plaza (NH-765)",
        style: "background: #0F172A; color: #FEF08A; border: 1.5px solid #F59E0B;"
      },
      {
        pos: [16.9605, 78.4938], // Big Daddy Resort (North-East of site)
        title: "Big Daddy Resort",
        badge: "🌴 Big Daddy Resort",
        style: "background: #064E3B; color: #A7F3D0; border: 1.5px solid #10B981;"
      },
      {
        pos: [16.9610, 78.4870], // Vampuguda (North-West of site)
        title: "Vampuguda",
        badge: "🏡 Vampuguda",
        style: "background: #1E293B; color: #CBD5E1; border: 1px solid #475569;"
      },
      {
        pos: [16.9850, 78.4900], // Kadthal Town & Mandal Hq
        title: "Kadthal Town & Mandal Hq",
        badge: "🏛️ Kadthal Municipality",
        style: "background: #0F172A; color: #E2E8F0; border: 1.5px solid #64748B;"
      },
      {
        pos: [16.9780, 78.5135], // Towards Hyderabad & ORR Exit 14 via Srisailam Highway
        title: "To Hyderabad & ORR Exit 14",
        badge: "⬆ Srisailam Highway &bull; To ORR Exit 14 & Hyderabad",
        style: "background: #B45309; color: #FFFFFF; border: 1px solid #FDE68A;"
      }
    ];

    flyerLandmarks.forEach((lm) => {
      const lmIcon = L.divIcon({
        className: 'flyer-landmark-icon',
        html: `
          <div style="
            ${lm.style}
            border-radius: 6px;
            padding: 2px 6px;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 0.4px;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
            transform: translate(-50%, -50%);
            pointer-events: none;
          ">
            ${lm.badge}
          </div>
        `,
        iconSize: [0, 0]
      });
      L.marker(lm.pos, { icon: lmIcon, interactive: false }).addTo(staticGroup);
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
  }, []); // Run ONCE on mount

  // 1b. Render Zoom-Responsive Master Plan Annotations (Park Typography, Road Labels, Stubs strictly bounded)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const annotationsGroup = L.layerGroup().addTo(map);

    // --- (A) PARK INNER LAWN TYPOGRAPHY (Strictly constrained within lawn polygon boundaries) ---
    // Inner lawn coordinates: [-86.2, -40.2] to [-59.8, -4.8], centroid: [-73.0, -22.5]
    const ptParkTL = map.latLngToLayerPoint(localToLatLng(-86.2, -40.2));
    const ptParkBR = map.latLngToLayerPoint(localToLatLng(-59.8, -4.8));
    const parkPixelW = Math.abs(ptParkBR.x - ptParkTL.x);
    const parkPixelH = Math.abs(ptParkBR.y - ptParkTL.y);

    if (parkPixelW >= 20 && parkPixelH >= 18) {
      const maxParkW = Math.max(16, Math.floor(parkPixelW * 0.90));
      const maxParkH = Math.max(14, Math.floor(parkPixelH * 0.90));

      let parkContent = '';
      if (parkPixelW >= 125) {
        // High zoom (Zoom >= 19.5): Complete DTCP Sanctioned specifications
        parkContent = `
          <div style="font-size: 8.5px; font-weight: 800; color: #FFFFFF; text-shadow: 0 1px 3px rgba(0,0,0,0.85); letter-spacing: 0.3px; line-height: 1.15; margin-bottom: 2px;">
            SITE RESERVED FOR<br/>OPEN SPACE (PARK)
          </div>
          <div style="font-size: 6.8px; font-weight: 700; color: #FEF08A; text-shadow: 0 1px 2px rgba(0,0,0,0.85); line-height: 1.15;">
            Ac. 0.758 cents<br/>209'-9" &times; 169'-3" &times; 201'-6"
          </div>
        `;
      } else if (parkPixelW >= 70) {
        // Medium zoom (Zoom 18.5 - 19.4): Clear Park title and acreage
        parkContent = `
          <div style="font-size: 7.2px; font-weight: 800; color: #FFFFFF; text-shadow: 0 1px 3px rgba(0,0,0,0.85); letter-spacing: 0.2px; line-height: 1.15; margin-bottom: 2px;">
            OPEN SPACE (PARK)
          </div>
          <div style="font-size: 6.2px; font-weight: 700; color: #FEF08A; text-shadow: 0 1px 2px rgba(0,0,0,0.85); line-height: 1.1;">
            Ac. 0.758 cents
          </div>
        `;
      } else if (parkPixelW >= 38) {
        // Moderate zoom (Zoom 17.5 - 18.4): Compact 2-line title strictly inside
        parkContent = `
          <div style="font-size: 6px; font-weight: 800; color: #FFFFFF; text-shadow: 0 1px 2px rgba(0,0,0,0.85); line-height: 1.1;">
            PARK
          </div>
          <div style="font-size: 5px; font-weight: 700; color: #FEF08A; text-shadow: 0 1px 2px rgba(0,0,0,0.85); line-height: 1.0;">
            0.758 Ac
          </div>
        `;
      } else {
        // Small zoom / minimized (Zoom < 17.5): Micro badge strictly inside green lawn
        parkContent = `
          <div style="font-size: 5px; font-weight: 800; color: #FFFFFF; text-shadow: 0 1px 2px rgba(0,0,0,0.85); line-height: 1.0;">
            PARK
          </div>
        `;
      }

      const parkCenterGeo = localToLatLng(-73.0, -22.5);
      const parkIcon = L.divIcon({
        className: 'custom-park-typography',
        html: `
          <div style="
            width: ${maxParkW}px;
            height: ${maxParkH}px;
            max-width: ${maxParkW}px;
            max-height: ${maxParkH}px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            overflow: hidden;
            box-sizing: border-box;
            padding: 1px 2px;
            user-select: none;
            pointer-events: none;
          ">
            ${parkContent}
          </div>
        `,
        iconSize: [maxParkW, maxParkH],
        iconAnchor: [maxParkW / 2, maxParkH / 2]
      });
      L.marker(parkCenterGeo, { icon: parkIcon, interactive: false }).addTo(annotationsGroup);
    }

    // --- (B) ROAD LABELS (Bounded to asphalt geometry & curb margins) ---
    // 1. Proposed 60'-0" Wide Arterial Road
    const ptTop60 = map.latLngToLayerPoint(localToLatLng(-9, -52));
    const ptBottom60 = map.latLngToLayerPoint(localToLatLng(-9, -42));
    const h60 = Math.abs(ptBottom60.y - ptTop60.y);
    const ptLeft60 = map.latLngToLayerPoint(localToLatLng(-88, -47));
    const ptRight60 = map.latLngToLayerPoint(localToLatLng(70, -47));
    const w60 = Math.abs(ptRight60.x - ptLeft60.x);

    if (h60 >= 11) {
      const labelW60 = Math.min(Math.floor(w60 * 0.85), 280);
      const labelH60 = Math.max(Math.floor(h60 * 0.82), 8);

      let text60 = "PROP. 60'-0\" WIDE ROAD ⇔ MASIGANDI TEMPLE";
      let font60 = '8px';
      if (h60 < 18) {
        text60 = "60' ROAD";
        font60 = '6px';
      } else if (h60 < 26) {
        text60 = "60' ROAD ⇔ MASIGANDI TEMPLE";
        font60 = '7px';
      }

      const r60Icon = L.divIcon({
        className: 'r60-road-label',
        html: `
          <div style="
            width: ${labelW60}px;
            height: ${labelH60}px;
            max-width: ${labelW60}px;
            max-height: ${labelH60}px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #F8FAFC;
            font-size: ${font60};
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            text-shadow: 0 1px 3px rgba(0,0,0,0.95);
            pointer-events: none;
            user-select: none;
          ">${text60}</div>
        `,
        iconSize: [labelW60, labelH60],
        iconAnchor: [labelW60 / 2, labelH60 / 2]
      });
      L.marker(localToLatLng(-9, -47), { icon: r60Icon, interactive: false }).addTo(annotationsGroup);
    }

    // 2. Proposed 33'-0" Central Boulevard (Internal Main Road)
    const ptTop33 = map.latLngToLayerPoint(localToLatLng(-12.5, -3));
    const ptBottom33 = map.latLngToLayerPoint(localToLatLng(-12.5, 4));
    const h33 = Math.abs(ptBottom33.y - ptTop33.y);
    const ptLeft33 = map.latLngToLayerPoint(localToLatLng(-88, 0.5));
    const ptRight33 = map.latLngToLayerPoint(localToLatLng(63, 0.5));
    const w33 = Math.abs(ptRight33.x - ptLeft33.x);

    if (h33 >= 10.5) {
      const labelW33 = Math.min(Math.floor(w33 * 0.75), 180);
      const labelH33 = Math.max(Math.floor(h33 * 0.82), 8);

      let text33 = "33' MAIN BOULEVARD";
      let font33 = '7.5px';
      if (h33 < 15) {
        text33 = "33' ROAD";
        font33 = '5.5px';
      } else if (h33 < 22) {
        text33 = "33' MAIN ROAD";
        font33 = '6.5px';
      }

      const r33Icon = L.divIcon({
        className: 'custom-road-label',
        html: `
          <div style="
            width: ${labelW33}px;
            height: ${labelH33}px;
            max-width: ${labelW33}px;
            max-height: ${labelH33}px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: rgba(255, 255, 255, 0.95);
            font-size: ${font33};
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            text-shadow: 0 1px 3px rgba(0,0,0,0.95);
            pointer-events: none;
            user-select: none;
          ">${text33}</div>
        `,
        iconSize: [labelW33, labelH33],
        iconAnchor: [labelW33 / 2, labelH33 / 2]
      });
      L.marker(localToLatLng(-12.5, 0.5), { icon: r33Icon, interactive: false }).addTo(annotationsGroup);
    }

    // 3. Srisailam Highway (NH-765)
    const ptLeftHwy = map.latLngToLayerPoint(localToLatLng(74, 5));
    const ptRightHwy = map.latLngToLayerPoint(localToLatLng(90, 5));
    const wHwy = Math.abs(ptRightHwy.x - ptLeftHwy.x);
    const ptTopHwy = map.latLngToLayerPoint(localToLatLng(82, -56));
    const ptBottomHwy = map.latLngToLayerPoint(localToLatLng(82, 66));
    const hwyLength = Math.abs(ptBottomHwy.y - ptTopHwy.y);

    // Strictly ensure text fits inside highway length and thickness, and hide when zoomed out
    if (currentZoom >= 18.5 && wHwy >= 12 && hwyLength >= 80) {
      const maxHwyW = Math.min(Math.floor(hwyLength * 0.70), 160);
      let textHwy = "SRISAILAM HIGHWAY (NH-765)";
      let fontHwy = '8px';
      if (hwyLength < 130 || currentZoom < 19.3) {
        textHwy = "SRISAILAM HWY (NH-765)";
        fontHwy = '7px';
      }
      if (hwyLength < 95 || currentZoom < 18.8) {
        textHwy = "NH-765";
        fontHwy = '6px';
      }

      const hwyLabel = L.divIcon({
        className: 'hwy-road-label',
        html: `
          <div style="
            width: ${maxHwyW}px;
            max-width: ${maxHwyW}px;
            color: #FEF08A;
            font-size: ${fontHwy};
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            text-shadow: 0 1px 3px rgba(0,0,0,0.95);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
            transform: translate(-50%, -50%) rotate(90deg);
            pointer-events: none;
            user-select: none;
          ">${textHwy}</div>
        `,
        iconSize: [0, 0]
      });
      L.marker(localToLatLng(82, 5), { icon: hwyLabel, interactive: false }).addTo(annotationsGroup);
    }

    // 4. Grand Entrance Arch (Only when zoomed in enough >= 18.8, placed on the approach margin)
    if (currentZoom >= 18.8) {
      const entranceGeo = localToLatLng(66.5, 0.5);
      const archIcon = L.divIcon({
        className: 'entrance-arch-icon',
        html: `
          <div style="
            background: #0F172A;
            color: #FEF08A;
            border: 1px solid #F59E0B;
            border-radius: 3px;
            padding: 1.5px 4.5px;
            font-size: ${currentZoom >= 19.5 ? '7px' : '6px'};
            font-weight: 800;
            letter-spacing: 0.4px;
            text-transform: uppercase;
            box-shadow: 0 2px 5px rgba(0,0,0,0.45);
            white-space: nowrap;
            transform: translate(-50%, -50%);
            pointer-events: none;
          ">
            ⛩️ ENTRANCE ARCH
          </div>
        `,
        iconSize: [0, 0]
      });
      L.marker(entranceGeo, { icon: archIcon, interactive: false }).addTo(annotationsGroup);
    }

    // 5. 4th Phase road openings labels (Brochure stubs)
    if (currentZoom >= 18.5) {
      const phase4Positions = [
        [-61.5, 53.5],
        [-32.5, 65.5],
        [-3.5, 65.5],
        [25.5, 65.5],
        [53.5, 69.0]
      ];
      phase4Positions.forEach(([px, pz]) => {
        const p4Marker = L.divIcon({
          className: 'phase4-stub-label',
          html: `
            <div style="
              background: rgba(15, 23, 42, 0.88);
              color: #E2E8F0;
              border: 1px solid #64748B;
              border-radius: 3px;
              padding: 1px 4px;
              font-size: ${currentZoom >= 19 ? '7.5px' : '6.5px'};
              font-weight: 800;
              letter-spacing: 0.4px;
              white-space: nowrap;
              box-shadow: 0 1px 4px rgba(0,0,0,0.4);
              transform: translate(-50%, -50%);
              pointer-events: none;
            ">&darr; 4th Phase</div>
          `,
          iconSize: [0, 0]
        });
        L.marker(localToLatLng(px, pz), { icon: p4Marker, interactive: false }).addTo(annotationsGroup);
      });
    }

    // 6. 100' Connecting Road label (Only when zoomed in >= 19.2)
    if (currentZoom >= 19.2) {
      const road100FtLabel = L.divIcon({
        className: 'r100-label',
        html: `
          <div style="
            background: #1E293B;
            color: #FEF08A;
            border: 1px solid #F59E0B;
            border-radius: 4px;
            padding: 1px 4px;
            font-size: 7px;
            font-weight: 800;
            letter-spacing: 0.5px;
            white-space: nowrap;
            transform: translate(-50%, -50%);
            pointer-events: none;
            box-shadow: 0 1px 4px rgba(0,0,0,0.4);
          ">100' CONNECTING ROAD</div>
        `,
        iconSize: [0, 0]
      });
      L.marker(localToLatLng(74, 0.5), { icon: road100FtLabel, interactive: false }).addTo(annotationsGroup);
    }

    return () => {
      if (mapInstanceRef.current) {
        map.removeLayer(annotationsGroup);
      }
    };
  }, [currentZoom]);

  // 2. Render Dynamic Interactive Plots Layer (Clean, Attractive Layout Blocks)
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

      // Clean Plot Number Typography (matching Plots99 Screenshots)
      // When zoomed out (< 18.2), HIDE individual numbers so they never clutter or spill out of boundaries (Fix for Image 1)
      const shouldShowNumber = isVisible && (currentZoom >= 18.2 || isSelected || isTargetMatch);

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
          // Proportionally scaled typography strictly contained within plot bounds
          const isNarrow = (plot.plotNumber >= 1 && plot.plotNumber <= 6) || (plot.plotNumber >= 83 && plot.plotNumber <= 96);
          let fontSize = '6.5px';
          let showDims = false;

          if (currentZoom >= 19.8) {
            fontSize = isNarrow ? '8.5px' : '10px';
            showDims = !isNarrow;
          } else if (currentZoom >= 18.8) {
            fontSize = isNarrow ? '7px' : '8.5px';
          } else if (currentZoom >= 18.2) {
            fontSize = isNarrow ? '5.5px' : '6.5px';
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
  }, [plots, selectedPlot, filterStatus, filterFacing, searchTerm, currentZoom]);

  // 3. Focus Selected Plot WITHOUT automatic zoom (User requirement: "dont zoom in and zoom out automatically")
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlot) return;
    const layer = plotLayersRef.current[selectedPlot.plotNumber];
    if (layer) {
      layer.bringToFront();
    }
  }, [selectedPlot]);

  // 4. Highlight search target when plot number entered WITHOUT automatic zoom
  useEffect(() => {
    if (!mapInstanceRef.current || !searchTerm) return;
    const clean = searchTerm.trim();
    const digits = clean.replace(/\D/g, '');
    let found = plots.find(p => String(p.plotNumber) === clean || (digits && String(p.plotNumber) === digits));
    if (!found && clean.length >= 1) {
      found = plots.find(p => String(p.plotNumber).includes(clean));
    }
    if (found) {
      const layer = plotLayersRef.current[found.plotNumber];
      if (layer) {
        layer.bringToFront();
      }
    }
  }, [searchTerm, plots]);

  // 5. Animated 2D Vehicles Driving along Highway & Venture Streets with Zoom-Proportional Scaling
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
      // 5. Golden Amber Sedan: 33ft Central Boulevard (Eastbound Lane)
      {
        id: 'r33-e',
        color: '#D97706',
        start: [-75, 2.25],
        end: [60, 2.25],
        heading: 0, // Eastbound
        speed: 0.0018,
        offset: 0.35
      },
      // 6. Emerald Green Hatchback: 33ft Central Boulevard (Westbound Lane)
      {
        id: 'r33-w',
        color: '#059669',
        start: [60, -1.25],
        end: [-75, -1.25],
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

    const carScale = currentZoom >= 20 ? 1.25 : currentZoom >= 19 ? 0.95 : currentZoom >= 18 ? 0.65 : currentZoom >= 17.5 ? 0.45 : 0;

    if (carScale <= 0) {
      return () => {
        if (mapInstanceRef.current && vehiclesGroup) {
          map.removeLayer(vehiclesGroup);
        }
      };
    }

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
        .leaflet-div-icon {
          background: transparent !important;
          border: none !important;
        }
        .entrance-arch-icon, .custom-park-typography, .hwy-road-label, .r60-road-label, .custom-road-label, .green-buffer-label, .phase4-stub-label, .r100-label {
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
