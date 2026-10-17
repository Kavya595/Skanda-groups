import fs from 'fs';

// Helper to draw grass tuft on an HTML5 canvas context or SVG
export function generateGrassSvgTile(width = 48, height = 48) {
  const tuft = (cx, cy) => `
    <path d="M ${cx} ${cy} L ${cx - 3.5} ${cy - 7} M ${cx} ${cy} L ${cx} ${cy - 8.5} M ${cx} ${cy} L ${cx + 3.5} ${cy - 7} M ${cx} ${cy} L ${cx - 6} ${cy - 4.5} M ${cx} ${cy} L ${cx + 6} ${cy - 4.5}" 
          stroke="#8ea75c" stroke-width="1.35" stroke-linecap="round" fill="none" />
  `;

  return `
    <pattern id="grass-pattern" width="${width}" height="${height}" patternUnits="userSpaceOnUse">
      <rect width="${width}" height="${height}" fill="#c5d89d" />
      ${tuft(12, 16)}
      ${tuft(36, 16)}
      ${tuft(24, 40)}
      ${tuft(0, 40)}
      ${tuft(48, 40)}
    </pattern>
  `;
}

console.log('Grass SVG Tile template generated successfully');
