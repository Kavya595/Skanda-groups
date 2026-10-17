import fs from 'fs';

function tuftPath(cx, cy) {
  return `
    M ${cx - 3.5} ${cy} L ${cx + 3.5} ${cy}
    M ${cx} ${cy} L ${cx} ${cy - 7.5}
    M ${cx} ${cy} L ${cx - 2.8} ${cy - 5.5}
    M ${cx} ${cy} L ${cx + 2.8} ${cy - 5.5}
    M ${cx - 1.2} ${cy} L ${cx - 4.8} ${cy - 3.5}
    M ${cx + 1.2} ${cy} L ${cx + 4.8} ${cy - 3.5}
  `.replace(/\s+/g, ' ').trim();
}

console.log('Tuft at (12, 16):', tuftPath(12, 16));
console.log('Tuft at (36, 16):', tuftPath(36, 16));
console.log('Tuft at (24, 40):', tuftPath(24, 40));
console.log('Tuft at (0, 40):', tuftPath(0, 40));
console.log('Tuft at (48, 40):', tuftPath(48, 40));
