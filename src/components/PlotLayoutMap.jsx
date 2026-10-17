import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polygon, 
  Popup, 
  Tooltip, 
  Marker,
  useMap,
  useMapEvents 
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, 
  X, 
  Filter, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  ArrowRight,
  Info,
  Box
} from 'lucide-react';
import { STATUS_COLORS, getPlotPathOptions } from '../config/mapStatusColors';
import { SAMPLE_THREE_ADJACENT_PLOTS, SAMPLE_PROJECT_INFO } from '../data/samplePlotsData';
import { 
  VENTURE_LOCATION, 
  VENTURE_BOUNDARY, 
  SURROUNDING_GRASS_POLYGON,
  CENTRAL_ROAD,
  INTERNAL_ROADS,
  PARK_POLYGON,
  PLOT_POLYGONS
} from '../data/ventureGeoData';
import { PLOT_SPECS } from './PlotSpecificationsModal';
import { 
  GrassPatternDefs, 
  GlobalGrassPatternSvg, 
  GRASS_FILL_URL, 
  GRASS_BORDER_COLOR 
} from '../utils/mapGrassPattern';

// Fix Leaflet's default icon paths in bundler environments (Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});


// Map Tile Providers (Zero API Keys Required)
const MAP_LAYERS = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 20
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 20
  }
};

/**
 * MapController Helper:
 * Synchronizes camera bounds, pan-to-plot, and external zoom triggers.
 */
function MapController({ 
  bounds, 
  focusCoords, 
  zoomTrigger, 
  resetTrigger,
  onZoomChange,
  targetZoom = null
}) {
  const map = useMap();
  const onZoomChangeRef = useRef(onZoomChange);
  useEffect(() => {
    onZoomChangeRef.current = onZoomChange;
  });

  // Watch zoom level changes and broadcast to parent on zoomend to avoid thrashing during animations
  useMapEvents({
    zoomend: () => onZoomChangeRef.current?.(map.getZoom())
  });

  useEffect(() => {
    onZoomChangeRef.current?.(map.getZoom());
  }, [map]);

  // Handle direct target zoom level transition (e.g. when zooming out from 3D)
  useEffect(() => {
    if (targetZoom && targetZoom > 0) {
      map.setZoom(targetZoom, { animate: true });
    }
  }, [targetZoom, map]);

  // Auto-fit to active bounds whenever bounds change or reset is triggered
  useEffect(() => {
    if (bounds && bounds.length > 0 && !targetZoom) {
      try {
        map.fitBounds(bounds, { padding: [45, 45], maxZoom: 20 });
      } catch (err) {
        // Fallback gracefully
      }
    }
  }, [bounds, resetTrigger, targetZoom, map]);

  // Pan to selected plot coordinate smoothly when searched or focused
  useEffect(() => {
    if (focusCoords && focusCoords.length === 2) {
      map.panTo(focusCoords, { animate: true });
    }
  }, [focusCoords, map]);

  // Handle external manual zoom triggers (from Nextora toolbar)
  useEffect(() => {
    if (zoomTrigger === 'in') map.zoomIn();
    if (zoomTrigger === 'out') map.zoomOut();
  }, [zoomTrigger, map]);

  return null;
}

/**
 * PlotLayoutMap:
 * Interactive Real-Estate Plot Layout Map using Leaflet.js, React Leaflet, and OpenStreetMap.
 */
export default function PlotLayoutMap({
  plotsData = null,
  onSelectPlot = () => {},
  selectedPlot = null,
  appliedFilters = null,
  onEnquire = () => {},
  onBook = () => {},
  showRightToolbar = true, // Hide when embedded inside NextoraLayoutViewer to prevent overlapping
  externalZoomTrigger = null,
  externalResetTrigger = 0,
  onZoomChange = () => {},
  initialDataset = 'venture', // 'venture' (All 96 Plots) or 'sample' (3 Adjacent Plots Demo)
  mapLayer = 'osm', // 'osm' | 'satellite'
  onMapLayerChange = null,
  targetZoom = null,
  onSwitchTo3D = null
}) {
  const [datasetMode, setDatasetMode] = useState(initialDataset); // 'venture' | 'sample'
  const [currentZoom, setCurrentZoom] = useState(18);
  const [hoveredPlotNumber, setHoveredPlotNumber] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [internalZoomAction, setInternalZoomAction] = useState(null);
  const [internalResetCount, setInternalResetCount] = useState(0);
  const [focusedCoords, setFocusedCoords] = useState(null);
  const [is3DTilt, setIs3DTilt] = useState(false);
  const [mapLayerType, setMapLayerType] = useState(mapLayer);

  useEffect(() => {
    if (mapLayer && mapLayer !== mapLayerType) {
      setMapLayerType(mapLayer);
    }
  }, [mapLayer]);

  const handleMapLayerSelect = (type) => {
    setMapLayerType(type);
    onMapLayerChange?.(type);
  };

  // Search and Filter States (Used when standalone)
  const [searchPlotNo, setSearchPlotNo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [facingFilter, setFacingFilter] = useState('all');
  const [minAreaFilter, setMinAreaFilter] = useState('');
  const [maxAreaFilter, setMaxAreaFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');

  const containerRef = useRef(null);

  // Sync zoom changes to parent and local state
  const handleZoomUpdate = useCallback((newZoom) => {
    setCurrentZoom(newZoom);
    onZoomChange?.(newZoom);
  }, [onZoomChange]);

  // Combine internal and external zoom/reset triggers
  const activeZoomTrigger = externalZoomTrigger || internalZoomAction;
  const activeResetTrigger = (externalResetTrigger || 0) + internalResetCount;

  // Build the active dataset: Either the 3-adjacent sample plots or the real 96-plot venture
  const activePlots = useMemo(() => {
    if (datasetMode === 'sample') {
      return SAMPLE_THREE_ADJACENT_PLOTS;
    }

    // Venture Mode: 96 plots mapped with real Kadthal Challampally coordinates
    return Object.entries(PLOT_POLYGONS).map(([numStr, geo]) => {
      const num = Number(numStr);
      const spec = PLOT_SPECS[num] || {};
      const externalPlot = plotsData?.find?.(p => p.number === num || p.id === num);

      const sq = externalPlot?.sqYards || spec.sqYards || 202;
      const status = (externalPlot?.status || 'available').toLowerCase();
      const facing = externalPlot?.facing || spec.facing || 'East';
      const dimensions = externalPlot?.dimensions || spec.dimensions || "33' × 55'";
      const roadWidth = externalPlot?.roadWidth || "33' B.T. Road";
      const price = externalPlot?.price || (sq * 12500);

      // Convert geoData coordinates to Leaflet's [lat, lng] array
      const leafletCoords = geo.coordinates.map(pt => [pt.lat, pt.lng]);

      return {
        id: `plot-${num}`,
        plotNumber: num,
        projectId: 'alekya-brundavan',
        areaSqYards: sq,
        price,
        status,
        facing,
        dimensions,
        roadWidth,
        isCorner: !!spec.isCorner,
        center: [geo.center.lat, geo.center.lng],
        coordinates: leafletCoords
      };
    });
  }, [datasetMode, plotsData]);

  // Compute map bounds for auto-fit
  const mapBounds = useMemo(() => {
    if (datasetMode === 'sample') {
      return [
        [16.97520, 78.51100],
        [16.97550, 78.51190]
      ];
    }
    // Venture bounds
    return VENTURE_BOUNDARY.map(pt => [pt.lat, pt.lng]);
  }, [datasetMode]);

  // Dynamic status count calculations from current data
  const plotStats = useMemo(() => {
    let total = activePlots.length;
    let available = 0;
    let reserved = 0;
    let sold = 0;
    let booked = 0;

    activePlots.forEach(p => {
      const s = p.status.toLowerCase();
      if (s === 'available') available++;
      else if (s === 'reserved') reserved++;
      else if (s === 'sold') sold++;
      else if (s === 'booked') booked++;
    });

    return { total, available, reserved, sold, booked };
  }, [activePlots]);

  // Filter Matching Logic (Supports both external appliedFilters and local search drawer)
  const isPlotMatched = useCallback((plot) => {
    if (!plot) return false;

    // Use external appliedFilters if provided (from NextoraLayoutViewer)
    if (appliedFilters) {
      if (appliedFilters.plotNo && !plot.plotNumber.toString().includes(appliedFilters.plotNo)) {
        return false;
      }
      if (appliedFilters.status && appliedFilters.status !== 'all' && plot.status !== appliedFilters.status) {
        return false;
      }
      if (appliedFilters.facing && appliedFilters.facing !== 'all') {
        if (appliedFilters.facing === 'Corner' && !plot.isCorner) return false;
        if (appliedFilters.facing !== 'Corner' && !plot.facing.toLowerCase().includes(appliedFilters.facing.toLowerCase())) {
          return false;
        }
      }
      const sq = Number(plot.areaSqYards) || 0;
      if (appliedFilters.minArea && sq < appliedFilters.minArea) return false;
      if (appliedFilters.maxArea && sq > appliedFilters.maxArea) return false;
      return true;
    }

    // Local filter state
    if (searchPlotNo.trim() && !plot.plotNumber.toString().includes(searchPlotNo.trim())) {
      return false;
    }
    if (statusFilter !== 'all' && plot.status !== statusFilter) {
      return false;
    }
    if (facingFilter !== 'all') {
      if (facingFilter === 'Corner' && !plot.isCorner) return false;
      if (facingFilter !== 'Corner' && !plot.facing.toLowerCase().includes(facingFilter.toLowerCase())) {
        return false;
      }
    }
    const sq = Number(plot.areaSqYards) || 0;
    if (minAreaFilter && sq < Number(minAreaFilter)) return false;
    if (maxAreaFilter && sq > Number(maxAreaFilter)) return false;

    const price = Number(plot.price) || 0;
    if (minPriceFilter && price < Number(minPriceFilter)) return false;
    if (maxPriceFilter && price > Number(maxPriceFilter)) return false;

    return true;
  }, [appliedFilters, searchPlotNo, statusFilter, facingFilter, minAreaFilter, maxAreaFilter, minPriceFilter, maxPriceFilter]);

  // Matching plots counter
  const matchedPlotsCount = useMemo(() => {
    return activePlots.filter(p => isPlotMatched(p)).length;
  }, [activePlots, isPlotMatched]);

  // Reset local filters
  const handleResetFilters = () => {
    setSearchPlotNo('');
    setStatusFilter('all');
    setFacingFilter('all');
    setMinAreaFilter('');
    setMaxAreaFilter('');
    setMinPriceFilter('');
    setMaxPriceFilter('');
  };

  // Zoom and Pan Handlers (Local)
  const handleZoom = (direction) => {
    setInternalZoomAction(direction);
    setTimeout(() => setInternalZoomAction(null), 100);
  };

  const handleResetView = () => {
    setInternalResetCount(prev => prev + 1);
    setFocusedCoords(null);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const formatCurrency = (val) => {
    if (!val || val === 0) return 'Price on Request';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Default Center Coordinate
  const initialCenter = datasetMode === 'sample' 
    ? SAMPLE_PROJECT_INFO.center 
    : [VENTURE_LOCATION.center.lat, VENTURE_LOCATION.center.lng];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-[#eef2f6] select-none font-sans"
    >
      {/* Custom Styles for Clean Leaflet Tooltips without grey boxes */}
      <style>{`
        .plot-badge-leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .plot-badge-leaflet-tooltip::before {
          display: none !important;
        }
        .park-tooltip-badge {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .park-tooltip-badge::before {
          display: none !important;
        }
      `}</style>

      {/* =========================================================================
          1. DEMONSTRATION MODE NOTIFICATION BANNER
         ========================================================================= */}
      {datasetMode === 'sample' && (
        <div className="absolute top-0 inset-x-0 z-[1000] bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-2 text-xs font-semibold shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              <strong>Sample Layout Active:</strong> Displaying 3 adjacent sample plots sharing boundaries with sample prices.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDatasetMode('venture')}
            className="px-2.5 py-1 rounded-lg bg-white text-orange-700 hover:bg-orange-50 font-bold text-[11px] transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            Switch to Venture Layout (96 Plots) &rarr;
          </button>
        </div>
      )}



      {/* Omnipresent SVG grass pattern defs */}
      <GlobalGrassPatternSvg />

      {/* =========================================================================
          2. REACT LEAFLET MAP CONTAINER WITH 3D PERSPECTIVE TILT
         ========================================================================= */}
      <div 
        className="w-full h-full overflow-hidden relative"
        style={is3DTilt ? {
          perspective: '1200px'
        } : undefined}
      >
        <MapContainer
          center={initialCenter}
          zoom={18}
          minZoom={9}
          maxZoom={20}
          zoomControl={false}
          attributionControl={true}
          className="w-full h-full z-0 transition-transform duration-700"
          style={is3DTilt ? {
            transform: 'rotateX(46deg) rotateZ(-7deg) scale(1.15)',
            transformOrigin: '50% 60%',
            filter: 'contrast(1.05) saturate(1.08)'
          } : undefined}
        >
        {/* Dynamic Tile Layer (OpenStreetMap Vector or ESRI Satellite) */}
        <TileLayer
          key={mapLayerType}
          url={MAP_LAYERS[mapLayerType]?.url || MAP_LAYERS.osm.url}
          attribution={MAP_LAYERS[mapLayerType]?.attribution || MAP_LAYERS.osm.attribution}
          maxZoom={20}
        />

        {/* Dynamic Bounds & Camera Controller */}
        <MapController 
          bounds={mapBounds}
          focusCoords={focusedCoords}
          zoomTrigger={activeZoomTrigger}
          resetTrigger={activeResetTrigger}
          onZoomChange={handleZoomUpdate}
          targetZoom={targetZoom}
        />

        {/* Dynamic SVG Grass Pattern Provider inside Leaflet overlay */}
        <GrassPatternDefs />

        {/* -----------------------------------------------------------------------
            Venture Infrastructure (Only rendered in Venture Mode)
           ----------------------------------------------------------------------- */}
        {datasetMode === 'venture' && (
          <>
            {/* Surrounding Authentic Grass Polygon (Exact match to User Image 2) */}
            <Polygon
              positions={SURROUNDING_GRASS_POLYGON.map(pt => [pt.lat, pt.lng])}
              pathOptions={{
                color: GRASS_BORDER_COLOR,
                weight: 1.5,
                opacity: 0.85,
                fillColor: GRASS_FILL_URL,
                fillOpacity: 1.0
              }}
              interactive={false}
            />


            {/* Central 33' East-West Main Road */}
            <Polygon
              positions={CENTRAL_ROAD.coordinates.map(pt => [pt.lat, pt.lng])}
              pathOptions={{
                color: '#334155',
                weight: 1,
                fillColor: '#1e293b',
                fillOpacity: 0.95
              }}
              interactive={false}
            />

            {/* Internal 33' Vertical Streets */}
            {INTERNAL_ROADS.map(road => (
              <Polygon
                key={road.id}
                positions={road.coordinates.map(pt => [pt.lat, pt.lng])}
                pathOptions={{
                  color: '#334155',
                  weight: 1,
                  fillColor: '#1e293b',
                  fillOpacity: 0.95
                }}
                interactive={false}
              />
            ))}

            {/* Park & Open Space Reserve Area (Ac. 0.758 cents) */}
            <Polygon
              positions={PARK_POLYGON.coordinates.map(pt => [pt.lat, pt.lng])}
              pathOptions={{
                color: '#166534',
                weight: 1.5,
                opacity: 0.9,
                fillColor: '#84cc16',
                fillOpacity: 0.75
              }}
              interactive={true}
            >
              {/* Only show park text badge when zoomed in enough (zoom >= 19) */}
              {currentZoom >= 19 && (
                <Tooltip permanent direction="center" className="park-tooltip-badge">
                  <span className="font-bold text-[10px] text-white bg-emerald-800/90 px-2 py-0.5 rounded-full shadow">
                    🌳 Park (Ac. 0.758 Cts)
                  </span>
                </Tooltip>
              )}
            </Polygon>
          </>
        )}

        {/* -----------------------------------------------------------------------
            Zoom-Out Dot Marker (When currentZoom < 17)
            When zoomed out, the 96 individual plot tooltips disappear,
            and this sleek pulsing dot represents the venture in Kadthal.
           ----------------------------------------------------------------------- */}
        {currentZoom < 17 && (
          <Marker
            position={initialCenter}
            icon={L.divIcon({
              className: 'venture-dot-pin-marker',
              html: currentZoom >= 14 ? `
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  background: #F58220;
                  color: #ffffff;
                  padding: 4px 10px;
                  border-radius: 9999px;
                  font-weight: 800;
                  font-size: 11px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.35);
                  border: 2px solid #ffffff;
                  white-space: nowrap;
                  cursor: pointer;
                  user-select: none;
                ">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff; display: inline-block;"></span>
                  <span>${datasetMode === 'sample' ? 'Sample Plots' : 'Skandha Grand Valley (96 Plots)'}</span>
                </div>
              ` : `
                <div style="
                  position: relative; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  cursor: pointer;
                ">
                  <div style="
                    width: 16px; 
                    height: 16px; 
                    border-radius: 50%; 
                    background: #F58220; 
                    border: 2.5px solid #ffffff; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
                  "></div>
                </div>
              `,
              iconSize: currentZoom >= 14 ? [180, 28] : [16, 16],
              iconAnchor: currentZoom >= 14 ? [90, 14] : [8, 8]
            })}
            eventHandlers={{
              click: () => {
                setFocusedCoords(initialCenter);
              }
            }}
          >
            <Popup>
              <div className="text-xs p-1 text-gray-900 font-sans">
                <strong className="block text-sm text-[#F58220]">
                  {datasetMode === 'sample' ? SAMPLE_PROJECT_INFO.name : 'Skandha Grand Valley'}
                </strong>
                <p className="text-[11px] text-gray-600 mt-1">
                  {datasetMode === 'sample' ? '3 Demonstration Plots' : '96 DTCP Sanctioned Plots • Kadthal Challampally'}
                </p>
                <button
                  type="button"
                  onClick={() => setFocusedCoords(initialCenter)}
                  className="mt-2 w-full py-1 rounded bg-[#F58220] text-white font-bold text-[11px] cursor-pointer"
                >
                  Zoom Into Layout &rarr;
                </button>
              </div>
            </Popup>
          </Marker>
        )}

        {/* -----------------------------------------------------------------------
            Individual Plot Polygons with Dynamic Colors & Interactive Popups
           ----------------------------------------------------------------------- */}
        {activePlots.map((plot) => {
          const isSelected = selectedPlot?.plotNumber === plot.plotNumber || selectedPlot?.number === plot.plotNumber || selectedPlot?.id === plot.id;
          const isHovered = hoveredPlotNumber === plot.plotNumber;
          const isMatched = isPlotMatched(plot);

          const pathOptions = getPlotPathOptions(plot.status, isSelected, isMatched, isHovered);

          return (
            <Polygon
              key={plot.id}
              positions={plot.coordinates}
              pathOptions={pathOptions}
              eventHandlers={{
                click: () => {
                  onSelectPlot(plot);
                },
                mouseover: () => setHoveredPlotNumber(plot.plotNumber),
                mouseout: () => setHoveredPlotNumber(null)
              }}
            >
              {/* Plot Number Label: ONLY RENDERED WHEN ZOOMED IN (zoom >= 19) to prevent stacking overlap */}
              {currentZoom >= 19 && (
                <Tooltip 
                  permanent 
                  direction="center" 
                  className="plot-badge-leaflet-tooltip"
                >
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border border-gray-900 text-gray-950 font-black text-[9px] sm:text-[10px] flex items-center justify-center shadow-md select-none transition-transform ${
                    isSelected ? 'scale-125 border-orange-600 ring-2 ring-orange-500' : ''
                  }`}>
                    {plot.plotNumber}
                  </div>
                </Tooltip>
              )}

              {/* Interactive Popup Details on Click */}
              <Popup className="plot-custom-popup" autoPanPadding={[20, 20]}>
                <div className="p-1 min-w-[220px] max-w-[260px] text-gray-900 font-sans">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Residential Plot
                      </span>
                      <h4 className="text-base font-black text-gray-900 leading-tight">
                        Plot #{plot.plotNumber}
                      </h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold capitalize border ${
                      STATUS_COLORS[plot.status]?.badgeBg || 'bg-gray-100 text-gray-800'
                    }`}>
                      {STATUS_COLORS[plot.status]?.label || plot.status}
                    </span>
                  </div>

                  {/* Specs Table */}
                  <div className="py-2.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Area:</span>
                      <span className="font-bold text-gray-900">
                        {plot.areaSqYards} Sq.Yds ({Math.round(plot.areaSqYards * 9)} Sq.Ft)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Dimensions:</span>
                      <span className="font-semibold text-gray-800">
                        {plot.dimensions || "33' × 55'"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Facing:</span>
                      <span className="font-semibold text-gray-800">
                        {plot.facing} {plot.isCorner ? '(Corner)' : ''}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Road:</span>
                      <span className="font-semibold text-gray-800">
                        {plot.roadWidth || "33' B.T. Road"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-gray-700">
                      <span className="font-bold">Price:</span>
                      <span className="font-black text-emerald-700 text-sm">
                        {formatCurrency(plot.price)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEnquire(plot)}
                      className="flex-1 py-1.5 rounded-lg bg-[#F58220] hover:bg-[#E06600] text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Enquire</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    {plot.status === 'available' && (
                      <button
                        type="button"
                        onClick={() => onBook(plot)}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Book Plot</span>
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>
      </div>



      {/* =========================================================================
          4. RIGHT FLOATING CONTROLS (Only shown when standalone; hidden when embedded)
         ========================================================================= */}
      {showRightToolbar && (
        <div className={`absolute ${datasetMode === 'sample' ? 'top-12' : 'top-4'} right-4 z-[500] flex flex-col gap-2`}>
          {/* Search & Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`w-10 h-10 rounded-2xl shadow-lg border border-gray-200/80 backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer ${
              isFilterOpen || searchPlotNo || statusFilter !== 'all' || facingFilter !== 'all'
                ? 'bg-[#F58220] text-white shadow-orange-500/20' 
                : 'bg-white/95 text-gray-700 hover:bg-orange-50 hover:text-[#F58220]'
            }`}
            title="Search & Filter Plots"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Zoom In & Out */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-lg border border-gray-200 flex flex-col gap-1 text-xs">
            <button
              type="button"
              onClick={() => handleZoom('in')}
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-gray-800 hover:bg-gray-100 cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => handleZoom('out')}
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-gray-800 hover:bg-gray-100 cursor-pointer"
              title="Zoom Out"
            >
              &minus;
            </button>
          </div>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={handleResetView}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[#F58220] hover:bg-orange-50 transition-colors cursor-pointer"
            title="Reset View to Bounds"
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
      )}

      {/* =========================================================================
          5. SEARCH & FILTER DRAWER (When standalone)
         ========================================================================= */}
      {showRightToolbar && isFilterOpen && (
        <div 
          className="absolute top-16 right-16 z-[600] w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-3xl border border-gray-200/90 shadow-2xl p-4 animate-in slide-in-from-right-4 duration-200 text-left text-xs"
          role="dialog"
          aria-label="Filter and Search Plots"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-gray-100">
            <div className="flex items-center gap-1.5 font-black text-gray-900 text-sm">
              <Filter className="w-4 h-4 text-[#F58220]" />
              <span>Search & Filter Plots</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Plot Number Input */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Plot Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchPlotNo}
                  onChange={(e) => setSearchPlotNo(e.target.value)}
                  placeholder="e.g. 15, 23, 101"
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#F58220] shadow-xs text-xs font-semibold"
                />
                {searchPlotNo && (
                  <button
                    type="button"
                    onClick={() => setSearchPlotNo('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Availability Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-900 font-semibold focus:outline-none focus:border-[#F58220] shadow-xs text-xs"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available (Green)</option>
                <option value="reserved">Reserved / On Hold (Orange)</option>
                <option value="booked">Booked (Blue)</option>
                <option value="sold">Sold (Red)</option>
              </select>
            </div>

            {/* Facing Filter */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Facing Direction
              </label>
              <select
                value={facingFilter}
                onChange={(e) => setFacingFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-900 font-semibold focus:outline-none focus:border-[#F58220] shadow-xs text-xs"
              >
                <option value="all">All Directions</option>
                <option value="East">East Facing</option>
                <option value="West">West Facing</option>
                <option value="North">North Facing</option>
                <option value="South">South Facing</option>
                <option value="Corner">Corner Plots Only</option>
              </select>
            </div>

            {/* Area Range (Sq.Yards) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10.5px] font-bold text-gray-600 mb-1">
                  Min Area (Yds)
                </label>
                <input
                  type="number"
                  value={minAreaFilter}
                  onChange={(e) => setMinAreaFilter(e.target.value)}
                  placeholder="Min"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#F58220] shadow-xs text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10.5px] font-bold text-gray-600 mb-1">
                  Max Area (Yds)
                </label>
                <input
                  type="number"
                  value={maxAreaFilter}
                  onChange={(e) => setMaxAreaFilter(e.target.value)}
                  placeholder="Max"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#F58220] shadow-xs text-xs font-semibold"
                />
              </div>
            </div>

            {/* Matches Counter */}
            <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 font-bold flex items-center justify-between text-[11px]">
              <span>Matching Inventory:</span>
              <span className="px-2 py-0.5 rounded-md bg-white text-orange-700 shadow-xs font-black">
                {matchedPlotsCount} / {activePlots.length}
              </span>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full py-2 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors cursor-pointer text-center text-xs"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. DYNAMIC AVAILABILITY LEGEND (BOTTOM-LEFT)
         ========================================================================= */}
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
            <div className="px-3 pb-2.5 pt-1 border-t border-gray-100 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
              {/* Available */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] border border-emerald-700 shadow-xs" />
                  <span className="text-gray-700 font-semibold">Available</span>
                </div>
                <span className="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.2 rounded">
                  {plotStats.available}
                </span>
              </div>

              {/* Reserved */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-amber-700 shadow-xs" />
                  <span className="text-gray-700 font-semibold">Reserved</span>
                </div>
                <span className="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.2 rounded">
                  {plotStats.reserved}
                </span>
              </div>

              {/* Booked */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] border border-blue-700 shadow-xs" />
                  <span className="text-gray-700 font-semibold">Booked</span>
                </div>
                <span className="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.2 rounded">
                  {plotStats.booked}
                </span>
              </div>

              {/* Sold */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-red-700 shadow-xs" />
                  <span className="text-gray-700 font-semibold">Sold</span>
                </div>
                <span className="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.2 rounded">
                  {plotStats.sold}
                </span>
              </div>

              {/* Total & Selected */}
              <div className="flex items-center justify-between col-span-2 pt-1 border-t border-gray-100 text-[10.5px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#F58220] bg-white shadow-xs" />
                  <span className="text-gray-600 font-bold">Selected Highlight</span>
                </div>
                <span className="font-black text-gray-900">
                  Total: {plotStats.total} Plots
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          7. BOTTOM-RIGHT FLOATING TOTALS WIDGET (Plots99 Style)
         ========================================================================= */}
      <div className="absolute bottom-4 right-4 z-[500]">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-gray-200 shadow-xl flex items-center gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-left">
            <span className="font-extrabold text-gray-900 block leading-tight text-xs">
              Interactive Leaflet Map
            </span>
            <span className="text-[10.5px] font-semibold text-gray-600">
              {plotStats.available} Available &bull; {plotStats.total} Total
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
