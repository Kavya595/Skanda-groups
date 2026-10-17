import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const GRASS_PATTERN_ID = 'venture-grass-pattern';
export const GRASS_FILL_URL = `url(#${GRASS_PATTERN_ID})`;
export const GRASS_BG_COLOR = '#c8d7ab';
export const GRASS_BORDER_COLOR = '#8ea75c';

export const GRASS_TUFTS_SVG_D = `
M 8.5 16 L 15.5 16 M 12 16 L 12 8.5 M 12 16 L 9.2 10.5 M 12 16 L 14.8 10.5 M 10.8 16 L 7.2 12.5 M 13.2 16 L 16.8 12.5 
M 32.5 16 L 39.5 16 M 36 16 L 36 8.5 M 36 16 L 33.2 10.5 M 36 16 L 38.8 10.5 M 34.8 16 L 31.2 12.5 M 37.2 16 L 40.8 12.5 
M 20.5 40 L 27.5 40 M 24 40 L 24 32.5 M 24 40 L 21.2 34.5 M 24 40 L 26.8 34.5 M 22.8 40 L 19.2 36.5 M 25.2 40 L 28.8 36.5 
M -3.5 40 L 3.5 40 M 0 40 L 0 32.5 M 0 40 L -2.8 34.5 M 0 40 L 2.8 34.5 M -1.2 40 L -4.8 36.5 M 1.2 40 L 4.8 36.5 
M 44.5 40 L 51.5 40 M 48 40 L 48 32.5 M 48 40 L 45.2 34.5 M 48 40 L 50.8 34.5 M 46.8 40 L 43.2 36.5 M 49.2 40 L 52.8 36.5
`.replace(/\s+/g, ' ').trim();

/**
 * Injects the SVG grass pattern defs directly into a Leaflet Map's overlay SVG container.
 * This guarantees seamless hardware-accelerated SVG pattern rendering across all browsers.
 */
export function injectGrassPatternDefs(map) {
  if (!map) return;
  const overlayPane = map.getPanes ? map.getPanes()?.overlayPane : null;
  if (!overlayPane) return;

  const svgElements = overlayPane.querySelectorAll('svg');
  svgElements.forEach(svg => {
    if (!svg.querySelector(`#${GRASS_PATTERN_ID}`)) {
      let defs = svg.querySelector('defs');
      if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.insertBefore(defs, svg.firstChild);
      }

      if (!defs.querySelector(`#${GRASS_PATTERN_ID}`)) {
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        pattern.setAttribute('id', GRASS_PATTERN_ID);
        pattern.setAttribute('width', '48');
        pattern.setAttribute('height', '48');
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '48');
        rect.setAttribute('height', '48');
        rect.setAttribute('fill', GRASS_BG_COLOR);
        pattern.appendChild(rect);

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', GRASS_TUFTS_SVG_D);
        path.setAttribute('stroke', GRASS_BORDER_COLOR);
        path.setAttribute('stroke-width', '1.3');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('fill', 'none');
        pattern.appendChild(path);

        defs.appendChild(pattern);
      }
    }
  });
}

/**
 * React Component for React-Leaflet MapContainer:
 * Injects and maintains grass pattern defs inside the Leaflet map overlayPane.
 */
export function GrassPatternDefs() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const handler = () => injectGrassPatternDefs(map);
    handler();

    map.on('layeradd', handler);
    map.on('zoomend', handler);

    const overlayPane = map.getPanes()?.overlayPane;
    let observer = null;
    if (overlayPane) {
      observer = new MutationObserver(handler);
      observer.observe(overlayPane, { childList: true, subtree: true });
    }

    return () => {
      map.off('layeradd', handler);
      map.off('zoomend', handler);
      if (observer) observer.disconnect();
    };
  }, [map]);

  return null;
}

/**
 * Global SVG Defs element to place anywhere in the React DOM.
 * Acts as an omnipresent SVG pattern registry.
 */
export function GlobalGrassPatternSvg() {
  return (
    <svg 
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none', opacity: 0 }} 
      aria-hidden="true"
    >
      <defs>
        <pattern id={GRASS_PATTERN_ID} width="48" height="48" patternUnits="userSpaceOnUse">
          <rect width="48" height="48" fill={GRASS_BG_COLOR} />
          <path
            d={GRASS_TUFTS_SVG_D}
            stroke={GRASS_BORDER_COLOR}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </pattern>
      </defs>
    </svg>
  );
}

/**
 * Generates an HTML5 Canvas tile of the grass pattern.
 * Ideal for Three.js CanvasTexture or canvas-based maps.
 */
export function createGrassTileCanvas(width = 48, height = 48) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Base background
  ctx.fillStyle = GRASS_BG_COLOR;
  ctx.fillRect(0, 0, width, height);

  const drawTuft = (cx, cy) => {
    ctx.strokeStyle = GRASS_BORDER_COLOR;
    ctx.lineWidth = 1.3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    // Base bar
    ctx.moveTo(cx - 3.5, cy); ctx.lineTo(cx + 3.5, cy);
    // Center blade
    ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - 7.5);
    // Inner blades
    ctx.moveTo(cx, cy); ctx.lineTo(cx - 2.8, cy - 5.5);
    ctx.moveTo(cx, cy); ctx.lineTo(cx + 2.8, cy - 5.5);
    // Outer blades
    ctx.moveTo(cx - 1.2, cy); ctx.lineTo(cx - 4.8, cy - 3.5);
    ctx.moveTo(cx + 1.2, cy); ctx.lineTo(cx + 4.8, cy - 3.5);
    ctx.stroke();
  };

  drawTuft(12, 16);
  drawTuft(36, 16);
  drawTuft(24, 40);
  drawTuft(0, 40);
  drawTuft(48, 40);

  return canvas;
}
