import fs from 'fs';

function generateTuft(cx, cy) {
  return `
    <!-- Tuft at ${cx}, ${cy} -->
    <path d="
      M ${cx - 3.5} ${cy} L ${cx + 3.5} ${cy}
      M ${cx} ${cy} L ${cx} ${cy - 7}
      M ${cx} ${cy} L ${cx - 2.6} ${cy - 5.2}
      M ${cx} ${cy} L ${cx + 2.6} ${cy - 5.2}
      M ${cx - 1.2} ${cy} L ${cx - 4.5} ${cy - 3.2}
      M ${cx + 1.2} ${cy} L ${cx + 4.5} ${cy - 3.2}
    " stroke="#8ea75c" stroke-width="1.25" stroke-linecap="round" fill="none" />
  `;
}

const w = 48;
const h = 48;

const patternDefs = `
  <pattern id="grass-pattern" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
    <rect width="${w}" height="${h}" fill="#c8d7ab" />
    ${generateTuft(12, 18)}
    ${generateTuft(36, 18)}
    ${generateTuft(24, 42)}
    ${generateTuft(0, 42)}
    ${generateTuft(48, 42)}
  </pattern>
`;

const previewSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <defs>
    ${patternDefs}
  </defs>
  <rect width="300" height="300" fill="url(#grass-pattern)" />
</svg>
`;

fs.writeFileSync('scratch/preview_grass_pattern.svg', previewSvg);
console.log('Generated scratch/preview_grass_pattern.svg');
