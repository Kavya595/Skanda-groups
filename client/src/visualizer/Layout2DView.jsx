import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  SITE_GEO,
  SITE_BOUNDARY_GEO,
  localToLatLng,
  layoutRoads,
  parkData,
  statusColors,
  REGIONAL_LANDMARKS
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



const Layout2DView = React.forwardRef(function Layout2DView({
  plots = [],
  selectedPlot = null,
  onSelectPlot = () => {},
  filterStatus = 'all',
  filterFacing = 'all',
  searchTerm = '',
  animateVehicles = true,
  isLocationMapMode = false,
  onLandmarkSelect = () => {}
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

  // Expose imperative methods for external toolbar
  React.useImperativeHandle(ref, () => ({
    zoomIn: () => mapInstanceRef.current?.zoomIn(),
    zoomOut: () => mapInstanceRef.current?.zoomOut(),
    reset: () => mapInstanceRef.current?.setView(SITE_GEO.center, SITE_GEO.zoom, { animate: true }),
    showLocationMap: (show = true) => {
      if (!mapInstanceRef.current) return;
      if (show) {
        const bounds = L.latLngBounds([SITE_GEO.center, ...REGIONAL_LANDMARKS.map(l => l.coordinates)]);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], animate: true });
      } else {
        mapInstanceRef.current.setView(SITE_GEO.center, SITE_GEO.zoom, { animate: true });
      }
    },
    focusLandmark: (id) => {
      const lm = REGIONAL_LANDMARKS.find(l => l.id === id);
      if (lm && mapInstanceRef.current) {
        mapInstanceRef.current.setView(lm.coordinates, 15, { animate: true });
      }
    },
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
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Add base tile layer (Google Maps roadmap)
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
              text-shadow: 0 1px 3px rgba(0,0,0,0.9);
              white-space: nowrap;
              transform: translate(-50%, -50%);
              pointer-events: none;
            ">PROP. 60'-0" WIDE ROAD &nbsp;&hArr;&nbsp; MASIGANDI TEMPLE</div>
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

    // 4th Phase road openings labels matching brochure
    const phase4Positions = [
      [-61.5, 53.5], // Road V0 opening to 4th Phase
      [-32.5, 65.5], // Road V1 opening to 4th Phase
      [-3.5, 65.5],  // Road V2 opening to 4th Phase
      [25.5, 65.5],  // Road V3 opening to 4th Phase
      [53.5, 69.0]   // Road V4 opening to 4th Phase
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
            padding: 1px 5px;
            font-size: 7.5px;
            font-weight: 800;
            letter-spacing: 0.5px;
            white-space: nowrap;
            box-shadow: 0 1px 4px rgba(0,0,0,0.4);
            transform: translate(-50%, -50%);
            pointer-events: none;
          ">&darr; 4th Phase</div>
        `,
        iconSize: [0, 0]
      });
      L.marker(localToLatLng(px, pz), { icon: p4Marker, interactive: false }).addTo(staticGroup);
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
          <div style="font-size: 10px; font-weight: 800; color: #FFFFFF; text-shadow: 0 1px 3px rgba(0,0,0,0.7); letter-spacing: 0.5px;">
            SITE RESERVED FOR OPEN SPACE (PARK)
          </div>
          <div style="font-size: 7.5px; font-weight: 700; color: #FEF08A; text-shadow: 0 1px 2px rgba(0,0,0,0.7);">
            Ac. 0.758 cents &bull; 209'-9" x 169'-3" x 201'-6"
          </div>
        </div>
      `,
      iconSize: [140, 26],
      iconAnchor: [70, 13]
    });
    L.marker(parkCenterGeo, { icon: parkBadge, interactive: false }).addTo(staticGroup);

    // (E) Grand Entrance Arch Symbol connecting to Service Road
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
  }, [plots, selectedPlot, filterStatus, filterFacing, searchTerm, currentZoom]);

  // 3. Fly to and focus Selected Plot
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

  // 4. Fly to search target when plot number entered
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

  // 3. Render Regional Landmarks & Connectivity when in Location Map mode or zoomed out
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const shouldShow = isLocationMapMode || currentZoom <= 15;

    if (!shouldShow) return;

    const landmarkGroup = L.layerGroup().addTo(map);

    // Pulsing concentric radar circles around Alekhya's Brundavan
    const radarDistances = [
      { r: 800, label: '800m (Maisigandi)' },
      { r: 2500, label: '2.5 km (Kadthal)' },
      { r: 5000, label: '5 km (RRR Corridor)' },
      { r: 15000, label: '15 km (Pharma City)' },
      { r: 28000, label: '28 km (RGIA Airport)' }
    ];

    radarDistances.forEach(({ r }) => {
      L.circle(SITE_GEO.center, {
        radius: r,
        color: '#10B981',
        weight: 1.2,
        dashArray: '4, 8',
        fill: false,
        opacity: 0.45,
        interactive: false
      }).addTo(landmarkGroup);
    });

    REGIONAL_LANDMARKS.forEach((lm) => {
      const isSite = lm.id === 'LM-SITE';
      const markerLatLng = lm.coordinates;

      // Connecting dashline from layout to landmark
      if (!isSite) {
        L.polyline([SITE_GEO.center, markerLatLng], {
          color: lm.color || '#3B82F6',
          weight: 2,
          dashArray: '6, 6',
          opacity: 0.65,
          interactive: false
        }).addTo(landmarkGroup);
      }

      // Rich DivIcon for Landmark
      const lmIcon = L.divIcon({
        className: `regional-lm-${lm.id}`,
        html: `
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            background: rgba(15, 23, 42, 0.95);
            border: 2px solid ${lm.color || '#38BDF8'};
            color: #FFFFFF;
            padding: 4px 8px;
            border-radius: 9999px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            white-space: nowrap;
            cursor: pointer;
            transform: translate(-50%, -50%);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          ">
            <span style="font-size: 13px;">${lm.icon}</span>
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 10px; font-weight: 800; color: #FFFFFF; line-height: 1.1;">${lm.shortName}</span>
              <span style="font-size: 8px; font-weight: 700; color: #FEF08A;">${lm.time} (${lm.distance})</span>
            </div>
          </div>
        `,
        iconSize: [0, 0]
      });

      const marker = L.marker(markerLatLng, { icon: lmIcon, interactive: true }).addTo(landmarkGroup);

      // Popup with directions & full info
      const popupHtml = `
        <div style="font-family: inherit; min-width: 200px; padding: 4px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 20px;">${lm.icon}</span>
            <div>
              <div style="font-weight: 800; font-size: 13px; color: #0F172A;">${lm.name}</div>
              <div style="font-size: 9.5px; font-weight: 700; color: #64748B; text-transform: uppercase;">${lm.categoryLabel}</div>
            </div>
          </div>
          <p style="font-size: 11px; color: #334155; margin: 6px 0 8px 0; line-height: 1.4;">${lm.desc}</p>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px 8px; margin-bottom: 8px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748B;">Travel Time:</span>
              <strong style="color: #0F172A;">⏱️ ${lm.time}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748B;">Distance:</span>
              <strong style="color: #0F172A;">📍 ${lm.distance}</strong>
            </div>
          </div>
          <a
            href="${lm.mapsUrl}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              display: block;
              text-align: center;
              background: #059669;
              color: #FFFFFF;
              font-weight: 700;
              font-size: 11px;
              padding: 6px 10px;
              border-radius: 6px;
              text-decoration: none;
              box-shadow: 0 2px 4px rgba(5, 150, 105, 0.3);
            "
          >
            🧭 Get Driving Directions &rarr;
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        if (onLandmarkSelect) onLandmarkSelect(lm);
      });
    });

    return () => {
      if (mapInstanceRef.current && landmarkGroup) {
        map.removeLayer(landmarkGroup);
      }
    };
  }, [isLocationMapMode, currentZoom, onLandmarkSelect]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <style>{`
        .leaflet-control-attribution {
          display: none !important;
        }
        .entrance-arch-icon, .custom-park-typography, .hwy-road-label, .r60-road-label, .custom-road-label, .green-buffer-label {
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
