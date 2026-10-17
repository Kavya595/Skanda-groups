import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Compass, 
  ChevronDown, 
  ChevronUp,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  VENTURE_LOCATION, 
  VENTURE_BOUNDARY, 
  SURROUNDING_GRASS_POLYGON,
  ROAD_LABELS,
  ROAD_VEHICLES,
  PARK_POLYGON, 
  CENTRAL_ROAD, 
  INTERNAL_ROADS, 
  PLOT_POLYGONS 
} from '../data/ventureGeoData';
import { PLOT_SPECS } from './PlotSpecificationsModal';
import { STATUS_COLORS } from '../config/mapStatusColors';
import { injectGrassPatternDefs, GRASS_FILL_URL, GRASS_BORDER_COLOR } from '../utils/mapGrassPattern';

export { STATUS_COLORS };

// Fix Leaflet's default icon paths in bundler environments (Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

// Free, open vector cartography tile provider (Zero API key required, matching Plots99)
const OPEN_TILE_PROVIDER = {
  url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  options: {
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 20,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }
};

export default function GoogleMapsPlotLayout({
  plotLookup = {},
  onSelectPlot = () => {},
  selectedPlot = null,
  isPlotHighlighted = () => true,
  onEnquire = () => {},
  onBook = () => {}
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polygonsMapRef = useRef({});
  const markersMapRef = useRef({});

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(true);

  // Initialize Zero-API Leaflet Map (Plots99 Architecture)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // 1. Center map at Kadthal Challampally venture
    const centerLatLng = [VENTURE_LOCATION.center.lat, VENTURE_LOCATION.center.lng];
    const map = L.map(mapContainerRef.current, {
      center: centerLatLng,
      zoom: 18,
      minZoom: 13,
      maxZoom: 20,
      zoomControl: false,
      attributionControl: false
    });
    mapInstanceRef.current = map;

    // 2. Add clean vector cartography tiles (Zero API key)
    const baseLayer = L.tileLayer(OPEN_TILE_PROVIDER.url, OPEN_TILE_PROVIDER.options);
    baseLayer.addTo(map);

    // 3. Surrounding Authentic Grass Area (Matching User Image 2)
    if (SURROUNDING_GRASS_POLYGON && SURROUNDING_GRASS_POLYGON.length > 0) {
      injectGrassPatternDefs(map);
      const grassLatLngs = SURROUNDING_GRASS_POLYGON.map(pt => [pt.lat, pt.lng]);
      L.polygon(grassLatLngs, {
        color: GRASS_BORDER_COLOR,
        weight: 1.5,
        opacity: 0.85,
        fillColor: GRASS_FILL_URL,
        fillOpacity: 1.0,
        interactive: false
      }).addTo(map);

      map.on('zoomend', () => injectGrassPatternDefs(map));
      map.on('layeradd', () => injectGrassPatternDefs(map));

      // Subtle decorative tree markers along the lawn perimeter
      [
        { lat: 16.97608, lng: 78.5118 },
        { lat: 16.97598, lng: 78.5132 },
        { lat: 16.97425, lng: 78.5118 },
        { lat: 16.97430, lng: 78.5132 }
      ].forEach(pos => {
        const treeIcon = L.divIcon({
          className: 'venture-tree-icon',
          html: `<div style="font-size: 13px; opacity: 0.75; user-select: none;">🌲</div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });
        L.marker([pos.lat, pos.lng], { icon: treeIcon, interactive: false }).addTo(map);
      });
    }


    // 5. Central 33' East-West Main Road
    const centralRoadLatLngs = CENTRAL_ROAD.coordinates.map(pt => [pt.lat, pt.lng]);
    L.polygon(centralRoadLatLngs, {
      color: '#334155',
      weight: 1,
      opacity: 1,
      fillColor: '#1e293b',
      fillOpacity: 0.95,
      interactive: false
    }).addTo(map);

    // 6. Internal 33' Vertical Roads
    INTERNAL_ROADS.forEach(road => {
      const roadLatLngs = road.coordinates.map(pt => [pt.lat, pt.lng]);
      L.polygon(roadLatLngs, {
        color: '#334155',
        weight: 1,
        opacity: 1,
        fillColor: '#1e293b',
        fillOpacity: 0.95,
        interactive: false
      }).addTo(map);
    });

    // 7. Road Name Badges & Labels
    if (ROAD_LABELS && ROAD_LABELS.length > 0) {
      ROAD_LABELS.forEach(label => {
        const roadTextIcon = L.divIcon({
          className: 'road-label-badge',
          html: `
            <div style="
              color: #ffffff;
              font-size: ${label.vertical ? '7.5px' : '9px'};
              font-weight: 800;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              font-family: monospace, ui-monospace, sans-serif;
              white-space: nowrap;
              transform: ${label.vertical ? 'rotate(90deg)' : 'none'};
              text-shadow: 0 1px 3px rgba(0,0,0,0.9);
              pointer-events: none;
              user-select: none;
            ">
              ${label.text}
            </div>
          `,
          iconSize: [80, 16],
          iconAnchor: [40, 8]
        });
        L.marker([label.lat, label.lng], { icon: roadTextIcon, interactive: false }).addTo(map);
      });
    }

    // 8. Road Vehicles (Cute car markers matching Plots99 visual style)
    if (ROAD_VEHICLES && ROAD_VEHICLES.length > 0) {
      ROAD_VEHICLES.forEach(veh => {
        const vehIcon = L.divIcon({
          className: 'road-veh-icon',
          html: `<div style="font-size: 13px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.5)); user-select: none;">${veh.icon}</div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });
        L.marker([veh.lat, veh.lng], { icon: vehIcon, interactive: false }).addTo(map);
      });
    }

    // 9. Park & Open Space Reserve Area (Ac. 0.758 cents)
    const parkLatLngs = PARK_POLYGON.coordinates.map(pt => [pt.lat, pt.lng]);
    L.polygon(parkLatLngs, {
      color: '#166534',
      weight: 1.5,
      opacity: 0.9,
      fillColor: '#84cc16',
      fillOpacity: 0.75,
      interactive: true
    }).addTo(map);

    // Park Center Title Marker
    const parkLabelIcon = L.divIcon({
      className: 'park-title-icon',
      html: `
        <div style="
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(21, 128, 61, 0.9);
          color: #ffffff;
          padding: 3px 8px;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 800;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          pointer-events: none;
          white-space: nowrap;
          user-select: none;
        ">
          <span>🌳 Park &bull; Ac. 0.758 Cts</span>
        </div>
      `,
      iconSize: [140, 24],
      iconAnchor: [70, 12]
    });
    L.marker([PARK_POLYGON.center.lat, PARK_POLYGON.center.lng], { 
      icon: parkLabelIcon, 
      interactive: false 
    }).addTo(map);

    // 10. Individual Plots (1 to 96)
    Object.entries(PLOT_POLYGONS).forEach(([plotNumStr, geoData]) => {
      const plotNum = Number(plotNumStr);
      const plot = plotLookup[plotNum] || {
        id: plotNum,
        number: plotNum,
        sqYards: PLOT_SPECS[plotNum]?.sqYards || 202,
        status: 'available',
        facing: 'East'
      };

      const statusStyle = STATUS_COLORS[plot.status] || STATUS_COLORS.available;
      const plotLatLngs = geoData.coordinates.map(pt => [pt.lat, pt.lng]);

      // Draw plot polygon
      const poly = L.polygon(plotLatLngs, {
        color: statusStyle.stroke,
        weight: 1.5,
        opacity: 1.0,
        fillColor: statusStyle.fill,
        fillOpacity: 0.72,
        className: `plot-polygon-${plotNum}`
      }).addTo(map);

      // Hover and click handling
      poly.on('click', () => {
        const freshPlot = plotLookup[plotNum] || plot;
        onSelectPlot(freshPlot);
      });

      poly.on('mouseover', () => {
        if (selectedPlot?.number !== plotNum) {
          poly.setStyle({
            color: '#ffffff',
            weight: 2.5,
            fillOpacity: 0.90
          });
        }
      });

      poly.on('mouseout', () => {
        if (selectedPlot?.number !== plotNum) {
          const currentPlot = plotLookup[plotNum] || plot;
          const currentStyle = STATUS_COLORS[currentPlot.status] || STATUS_COLORS.available;
          const isMatch = isPlotHighlighted(currentPlot);
          poly.setStyle({
            color: currentStyle.stroke,
            weight: 1.5,
            fillOpacity: isMatch ? 0.72 : 0.18
          });
        }
      });

      polygonsMapRef.current[plotNum] = poly;

      // Plot Center Circular White Badge with Bold Black Number (Plots99 Style)
      const badgeIcon = L.divIcon({
        className: 'venture-plot-badge-wrapper',
        html: `
          <div style="
            width: 24px; 
            height: 24px; 
            border-radius: 50%; 
            background: #ffffff; 
            border: 1.5px solid #000000; 
            color: #000000; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 10.5px; 
            font-weight: 900; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.35);
            user-select: none;
            cursor: pointer;
          ">
            ${plotNum}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([geoData.center.lat, geoData.center.lng], {
        icon: badgeIcon,
        interactive: true
      }).addTo(map);

      marker.on('click', () => {
        const freshPlot = plotLookup[plotNum] || plot;
        onSelectPlot(freshPlot);
      });

      markersMapRef.current[plotNum] = marker;
    });

    // Auto-fit to venture boundary with smooth padding
    const boundaryBounds = L.latLngBounds(VENTURE_BOUNDARY.map(pt => [pt.lat, pt.lng]));
    map.fitBounds(boundaryBounds, { padding: [40, 40] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      polygonsMapRef.current = {};
      markersMapRef.current = {};
    };
  }, []);

  // Update polygon colors and styles when selectedPlot, plotLookup, or filters change
  useEffect(() => {
    Object.entries(polygonsMapRef.current).forEach(([plotNumStr, poly]) => {
      const plotNum = Number(plotNumStr);
      const plot = plotLookup[plotNum] || { id: plotNum, number: plotNum, status: 'available' };
      const statusStyle = STATUS_COLORS[plot.status] || STATUS_COLORS.available;
      const isSelected = selectedPlot?.number === plotNum || selectedPlot?.id === plotNum;
      const isMatched = isPlotHighlighted(plot);

      if (isSelected) {
        poly.setStyle({
          color: '#F58220', // Skandha saffron highlight
          weight: 4,
          opacity: 1.0,
          fillColor: statusStyle.fill,
          fillOpacity: 0.95
        });
        poly.bringToFront();
      } else {
        poly.setStyle({
          color: statusStyle.stroke,
          weight: 1.5,
          opacity: isMatched ? 1.0 : 0.3,
          fillColor: statusStyle.fill,
          fillOpacity: isMatched ? 0.72 : 0.15
        });
      }
    });
  }, [selectedPlot, plotLookup, isPlotHighlighted]);

  // Zoom Helpers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetBounds = () => {
    if (!mapInstanceRef.current) return;
    const boundaryBounds = L.latLngBounds(VENTURE_BOUNDARY.map(pt => [pt.lat, pt.lng]));
    mapInstanceRef.current.fitBounds(boundaryBounds, { padding: [40, 40] });
  };

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Inventory Totals for Plots99 Widget
  const totalPlotsCount = 96;
  const availablePlotsCount = useMemo(() => {
    return Object.values(plotLookup).filter(p => p.status === 'available').length || 85;
  }, [plotLookup]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-100 select-none">
      
      {/* 1. Interactive Map Surface (100% Zero API Keys Required) */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full relative"
      />

      {/* 2. Top-Left Plots99 Venture Branding Badge */}
      <div className="absolute top-4 left-4 z-[500] max-w-[calc(100vw-120px)] sm:max-w-lg">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:px-4 sm:py-2.5 shadow-xl border border-gray-200/80 flex items-center gap-2.5 text-xs text-gray-800">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#F58220] to-[#E06600] text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-gray-900 text-sm tracking-tight truncate">
                Skandha Grand Valley
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                DTCP Sanctioned
              </span>
            </div>
            <p className="text-[11px] text-gray-500 truncate font-medium">
              Kadthal, Challampally &bull; TLP NO. 87/2024/H &bull; RERA: PO2400009081
            </p>
          </div>
        </div>
      </div>

      {/* 3. Right Action Controls (Zoom, Reset, Fullscreen) */}
      <div className="absolute top-4 right-4 z-[500] flex flex-col gap-2">
        {/* Zoom Buttons */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-lg border border-gray-200 flex flex-col gap-1 text-xs">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-gray-800 hover:bg-gray-100 cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-gray-800 hover:bg-gray-100 cursor-pointer"
            title="Zoom Out"
          >
            &minus;
          </button>
        </div>

        {/* Reset View Button */}
        <button
          type="button"
          onClick={handleResetBounds}
          className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[#F58220] hover:bg-orange-50 transition-colors cursor-pointer"
          title="Reset Venture View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[#F58220] hover:bg-orange-50 transition-colors cursor-pointer"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* 4. Bottom-Right Floating Plots Widget (Plots99 Style) */}
      <div className="absolute bottom-4 right-4 z-[500]">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-gray-200 shadow-xl flex items-center gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-left">
            <span className="font-extrabold text-gray-900 block leading-tight text-xs">
              Plots Layout
            </span>
            <span className="text-[10.5px] font-semibold text-gray-600">
              {availablePlotsCount} Available &bull; {totalPlotsCount} Total
            </span>
          </div>
        </div>
      </div>

      {/* 5. Floating Status Legend (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-[500]">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            className="w-full px-3 py-2 flex items-center justify-between gap-3 font-bold text-gray-800 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#F58220]" />
              <span>Plot Status Legend</span>
            </div>
            {isLegendOpen ? <ChevronDown className="w-3.5 h-3.5 text-gray-500" /> : <ChevronUp className="w-3.5 h-3.5 text-gray-500" />}
          </button>

          {isLegendOpen && (
            <div className="px-3 pb-2.5 pt-1 border-t border-gray-100 grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#22c55e] border border-emerald-700 shadow-xs" />
                <span className="text-gray-700 font-semibold">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#2563eb] border border-blue-700 shadow-xs" />
                <span className="text-gray-700 font-semibold">Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ef4444] border border-red-700 shadow-xs" />
                <span className="text-gray-700 font-semibold">Sold</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#f59e0b] border border-amber-700 shadow-xs" />
                <span className="text-gray-700 font-semibold">Reserved</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2 pt-1 border-t border-gray-100">
                <span className="w-3 h-3 rounded-full border-2 border-[#F58220] bg-white shadow-xs" />
                <span className="text-gray-700 font-semibold">Selected Highlight</span>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
