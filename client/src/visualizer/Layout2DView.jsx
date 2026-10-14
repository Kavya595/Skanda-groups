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

// Real Google Maps & OpenStreetMap watermark-free tile providers (Zero API Key Required)
export const MAP_LAYERS = {
  google: {
    id: 'google',
    name: 'Google Map',
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps &bull; Kadthal, Srisailam Highway',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 21
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Imagery &bull; Kadthal, Srisailam Highway',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 21
  },
  osm: {
    id: 'osm',
    name: 'OSM',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
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

  const [activeTileType, setActiveTileType] = useState('google');
  const [currentZoom, setCurrentZoom] = useState(SITE_GEO.zoom);

  // Expose imperative methods for external toolbar
  React.useImperativeHandle(ref, () => ({
    zoomIn: () => mapInstanceRef.current?.zoomIn(),
    zoomOut: () => mapInstanceRef.current?.zoomOut(),
    reset: () => mapInstanceRef.current?.setView(SITE_GEO.center, SITE_GEO.zoom, { animate: true }),
    setMapType: (type) => setActiveTileType(type)
  }));

  // 1. Initialize Leaflet Map
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

    // Add base tile layer (Google Maps watermark-free map)
    const layerCfg = MAP_LAYERS[activeTileType] || MAP_LAYERS.google;
    const tileLayer = L.tileLayer(layerCfg.url, {
      attribution: layerCfg.attribution,
      subdomains: layerCfg.subdomains,
      maxZoom: layerCfg.maxZoom
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

  // 1B. Dynamic Base Map Tile Layer Switcher (Google Map vs Satellite vs OSM)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    const layerCfg = MAP_LAYERS[activeTileType] || MAP_LAYERS.google;
    const tileLayer = L.tileLayer(layerCfg.url, {
      attribution: layerCfg.attribution,
      subdomains: layerCfg.subdomains,
      maxZoom: layerCfg.maxZoom
    }).addTo(map);
    tileLayerRef.current = tileLayer;
  }, [activeTileType]);

  // 2. Render Site Layers: Boundary, Roads, Park (Clean Plots99 Look)
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
      fillOpacity: 0.35,
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

      // Road asphalt surface with stone curb border (matching Image 2)
      L.polygon(geoPoly, {
        color: '#4B5563',
        weight: 1.5,
        fillColor: isHighway ? '#15181E' : '#23272F',
        fillOpacity: 0.98,
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
  }, []);

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
      // Display plot numbers reliably on refresh and across viewing zoom levels
      const shouldShowNumber = isVisible;

      if (shouldShowNumber) {
        if (isSelected || isTargetMatch) {
          // Elevated Floating Badge for Active/Searched Plot
          const activeIcon = L.divIcon({
            className: `plot-active-label-${plot.plotNumber}`,
            html: `<div style="
              background: #EA580C;
              color: #FFFFFF;
              font-weight: 800;
              font-size: 10px;
              padding: 2px 5px;
              border-radius: 9999px;
              box-shadow: 0 2px 8px rgba(234, 88, 12, 0.5);
              border: 1.5px solid #FFFFFF;
              line-height: 1;
              white-space: nowrap;
              transform: translate(-50%, -50%);
              pointer-events: none;
            ">#${plot.plotNumber}</div>`,
            iconSize: [32, 16],
            iconAnchor: [16, 8]
          });
          L.marker(plot.geoCenter, { icon: activeIcon, interactive: false, zIndexOffset: 1000 }).addTo(plotsGroup);
        } else {
          // Proportionally scaled typography based on zoom level & plot dimensions
          // Narrow vertical strip plots (Block E plots 1-6 & Block K plots 83-96) get compact non-overlapping typography
          const isNarrow = (plot.plotNumber >= 1 && plot.plotNumber <= 6) || (plot.plotNumber >= 83 && plot.plotNumber <= 96);
          let fontSize = isNarrow ? '7px' : '8px';
          if (currentZoom >= 19.5) {
            fontSize = isNarrow ? '8px' : '9.5px';
          } else if (currentZoom >= 18.5) {
            fontSize = isNarrow ? '7px' : '8.5px';
          }

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
              white-space: nowrap;
              letter-spacing: -0.3px;
              text-shadow:
                -1px -1px 0 #FFFFFF,
                 1px -1px 0 #FFFFFF,
                -1px  1px 0 #FFFFFF,
                 1px  1px 0 #FFFFFF;
            ">${plot.plotNumber}</div>`,
            iconSize: [16, 10],
            iconAnchor: [8, 5]
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

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <style>{`
        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>
      {/* Leaflet Map DOM Target */}
      <div
        ref={mapContainerRef}
        className="w-full h-full bg-[#E5ECE3] z-0"
        style={{ cursor: 'grab' }}
      />

      {/* Top-Left Google Map / Satellite Switcher Pill (matching Google Maps & Plots99 standard) */}
      <div className="absolute top-20 left-16 sm:left-20 z-20 pointer-events-auto flex items-center">
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/90 shadow-xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTileType('google')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTileType === 'google'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Google Maps Roadmap View"
          >
            Google Map
          </button>
          <button
            type="button"
            onClick={() => setActiveTileType('satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTileType === 'satellite'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Google Satellite Imagery"
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => setActiveTileType('osm')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTileType === 'osm'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="OpenStreetMap View"
          >
            OSM
          </button>
        </div>
      </div>
    </div>
  );
});

export default Layout2DView;
