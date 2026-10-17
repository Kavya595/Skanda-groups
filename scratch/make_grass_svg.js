import fs from 'fs';

const tuft = (cx, cy) => `
  <path d="M ${cx} ${cy} L ${cx - 3.5} ${cy - 6.5} M ${cx} ${cy} L ${cx} ${cy - 8} M ${cx} ${cy} L ${cx + 3.5} ${cy - 6.5}" 
        stroke="#8da85d" stroke-width="1.4" stroke-linecap="round" fill="none" />
`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <defs>
    <pattern id="grass-tile" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="40" height="40" fill="#c5da96" />
      ${tuft(10, 14)}
      ${tuft(30, 14)}
      ${tuft(0, 34)}
      ${tuft(20, 34)}
      ${tuft(40, 34)}
    </pattern>
  </defs>
  <rect width="300" height="300" fill="url(#grass-tile)" />
</svg>`;

fs.writeFileSync('scratch/test_grass.svg', svg);
console.log('Saved scratch/test_grass.svg');
