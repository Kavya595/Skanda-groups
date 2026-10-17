import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import { RotateCcw, ZoomIn, ZoomOut, Map as MapIcon } from 'lucide-react';
import ChallampallyMasterplan from './ChallampallyMasterplan';

// Exact GPS coordinates for Challampally, Kadthal (Alekhya Brundhavanam)
const VENTURE_CENTER = [16.9750, 78.5120];

export default function GoogleMapLayoutViewer({
  plotLookup = {},
  onSelectPlot = () => {},
  selectedPlotId = null,
  isPlotHighlighted = () => true
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const [portalNode, setPortalNode] = useState(null);
  const [mapStyle, setMapStyle] = useState('carto'); // 'carto' | 'google' (NO SATELLITE)
  const [currentZoom, setCurrentZoom] = useState(17.5);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // 1. Create Leaflet map centered at Challampally, Kadthal
    const map = L.map(mapContainerRef.current, {
      center: VENTURE_CENTER,
      zoom: 17.5,
      minZoom: 12,
      maxZoom: 21,
      zoomControl: false,
      attributionControl: false
    });
    mapInstanceRef.current = map;

    // 2. Add Clean Vector Roadmap Tiles (Matching user reference Images 1-5 - NO SATELLITE)
    // CartoDB Voyager: Soft pastel roads, natural green park/forest zones, clean topography
    const cartoVoyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: ['a', 'b', 'c', 'd'],
      maxZoom: 20
    });
    cartoVoyager.addTo(map);
    tileLayerRef.current = cartoVoyager;

    // 3. Anchor Masterplan with Leaflet native Marker & DivIcon
    const anchorDiv = L.DomUtil.create('div', 'venture-masterplan-anchor');
    anchorDiv.style.position = 'relative';
    anchorDiv.style.pointerEvents = 'auto';

    L.DomEvent.disableClickPropagation(anchorDiv);
    L.DomEvent.disableScrollPropagation(anchorDiv);

    const layoutDivIcon = L.divIcon({
      html: anchorDiv,
      className: 'venture-layout-marker-wrapper',
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });

    L.marker(VENTURE_CENTER, {
      icon: layoutDivIcon,
      interactive: false,
      zIndexOffset: 1000
    }).addTo(map);

    setPortalNode(anchorDiv);

    // Track zoom for proportional scaling
    const handleZoomChange = () => {
      setCurrentZoom(map.getZoom());
    };

    map.on('zoom animatemove viewreset', handleZoomChange);

    return () => {
      map.off('zoom animatemove viewreset', handleZoomChange);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch between Carto Voyager (clean roadmap) and Google Maps (street view)
  const handleSwitchMapStyle = (style) => {
    setMapStyle(style);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let newLayer;
    if (style === 'carto') {
      newLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        subdomains: ['a', 'b', 'c', 'd'],
        maxZoom: 20
      });
    } else {
      newLayer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 21,
        maxNativeZoom: 20
      });
    }

    newLayer.addTo(map);
    tileLayerRef.current = newLayer;
  };

  // Recenter map camera to Challampally venture
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo(VENTURE_CENTER, 17.5, { duration: 1.0 });
  };

  const handleZoom = (delta) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setZoom(map.getZoom() + delta);
  };

  // Mathematical zoom scale factor locked to Web Mercator tile scaling
  const zoomScale = Math.min(3.5, Math.max(0.18, Math.pow(2, currentZoom - 17.5)));

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#f4f7fb]">
      {/* 1. CLEAN VECTOR GOOGLE / CARTO MAP CANVAS (NO SATELLITE) */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-0" 
      />

      {/* 2. MASTERPLAN ON MAP WITH NATURAL GREEN BUFFER & ENTRANCE ROAD (MATCHING IMAGES 3, 4, 5) */}
      {portalNode && createPortal(
        <div 
          style={{
            position: 'absolute',
            left: '-500px',
            top: '-230px',
            width: '1000px',
            transformOrigin: 'center center',
            transform: `scale(${zoomScale})`,
            pointerEvents: 'auto'
          }}
          className="transition-transform duration-75 flex flex-col items-center"
        >
          {/* Organic Green Venture Landscape Parcel (matching user reference Images 2, 3, 4) */}
          <div className="relative p-6 sm:p-7 rounded-[32px] bg-[#86efac]/90 border-2 border-[#4ade80] shadow-2xl flex flex-col items-center">
            
            {/* Approach Black Top Road from Left (matching user reference Images 3 & 4) */}
            <div className="absolute -left-28 top-8 w-32 h-6 bg-[#111827] border-y border-black flex items-center justify-center -rotate-12 shadow-md pointer-events-none">
              <span className="text-[7.5px] font-mono font-bold text-white tracking-wider whitespace-nowrap">
                33' APPROACH ROAD
              </span>
            </div>

            {/* Authentic DTCP Masterplan with white circle badges & black numbers (matching Image 5) */}
            <ChallampallyMasterplan
              plotLookup={plotLookup}
              onSelectPlot={onSelectPlot}
              selectedPlotId={selectedPlotId}
              isPlotHighlighted={isPlotHighlighted}
            />
          </div>
        </div>,
        portalNode
      )}

      {/* 3. FLOATING MAP CONTROLS (TOP RIGHT) - CLEAN, NO OBSTRUCTIVE TOP-LEFT BAR */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Map Style Switcher (Roadmap vs Google Map - NO SATELLITE) */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-gray-200/80 shadow-lg flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => handleSwitchMapStyle('carto')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapStyle === 'carto' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-gray-700 hover:text-emerald-700 hover:bg-gray-100'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMapStyle('google')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapStyle === 'google' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-700 hover:text-blue-700 hover:bg-gray-100'
            }`}
          >
            <span>🗺️</span>
            <span>Google Map</span>
          </button>
        </div>

        {/* Recenter & Zoom Controls */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-gray-200/80 shadow-lg flex flex-col gap-1 items-center">
          <button
            type="button"
            onClick={handleRecenter}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-700 hover:text-[#f58220] hover:bg-gray-100 transition-colors cursor-pointer"
            title="Recenter to Challampally Venture"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="w-6 h-px bg-gray-200" />
          <button
            type="button"
            onClick={() => handleZoom(1)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer font-black text-sm"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(-1)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer font-black text-sm"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. SLEEK BOTTOM-RIGHT PLOTS SUMMARY BADGE (EXACT MATCH TO IMAGE 5 BOTTOM-RIGHT BADGE) */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-gray-200 shadow-xl flex flex-col items-center pointer-events-auto text-center">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          DTCP Plots
        </span>
        <span className="text-xs font-black text-emerald-700">
          96 Total Plots
        </span>
      </div>

      {/* 5. SLEEK BOTTOM HELPER BAR */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gray-200 text-[11px] text-gray-800 shadow-lg flex items-center gap-3 pointer-events-auto">
        <span className="flex items-center gap-1.5 font-bold text-emerald-700">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Green: Available
        </span>
        <span className="text-gray-300">&bull;</span>
        <span className="flex items-center gap-1.5 font-bold text-blue-700">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> Blue: Booked
        </span>
        <span className="text-gray-300">&bull;</span>
        <span className="flex items-center gap-1.5 font-bold text-red-700">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /> Red: Sold
        </span>
        <span className="text-gray-300">&bull;</span>
        <span className="text-gray-500">Challampally, Kadthal &bull; Click any plot to inspect</span>
      </div>
    </div>
  );
}
