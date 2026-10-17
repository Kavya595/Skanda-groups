import fs from 'fs';
import zlib from 'zlib';

const buf = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/brain/20a6c604-8932-495e-8ae3-9bc46296be63/.user_uploaded/media_1792135725152_6716c0c5.png');

let offset = 8, width, height, bitDepth, colorType, idatChunks = [];
while (offset < buf.length) {
  const len = buf.readUInt32BE(offset);
  const type = buf.toString('ascii', offset + 4, offset + 8);
  if (type === 'IHDR') {
    width = buf.readUInt32BE(offset + 8);
    height = buf.readUInt32BE(offset + 12);
    bitDepth = buf.readUInt8(offset + 16);
    colorType = buf.readUInt8(offset + 17);
  } else if (type === 'IDAT') idatChunks.push(buf.slice(offset + 8, offset + 8 + len));
  offset += 12 + len;
}
const compressed = Buffer.concat(idatChunks);
zlib.inflate(compressed, (err, decompressed) => {
  const bpp = colorType === 6 ? 4 : 3;
  const stride = 1 + width * bpp;
  const raw = Buffer.alloc(width * height * bpp);
  let prevRow = Buffer.alloc(width * bpp);
  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * stride];
    const row = Buffer.alloc(width * bpp);
    const srcRow = decompressed.slice(y * stride + 1, (y + 1) * stride);
    for (let x = 0; x < width * bpp; x++) {
      const a = x >= bpp ? row[x - bpp] : 0, b = prevRow[x], c = x >= bpp ? prevRow[x - bpp] : 0;
      let val = srcRow[x];
      if (filter === 1) val = (val + a) & 0xff;
      else if (filter === 2) val = (val + b) & 0xff;
      else if (filter === 3) val = (val + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        val = (val + ((pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c))) & 0xff;
      }
      row[x] = val;
    }
    row.copy(raw, y * width * bpp);
    prevRow = row;
  }

  // Crop a 48x48 tile centered on tuft at (28, 16)
  // Let's create an SVG representation of this tile so we can see it
  const cropX = 14;
  const cropY = 0;
  const cropW = 48;
  const cropH = 48;
  
  let rects = '';
  for (let dy = 0; dy < cropH; dy++) {
    for (let dx = 0; dx < cropW; dx++) {
      const sx = cropX + dx;
      const sy = cropY + dy;
      const idx = (sy * width + sx) * bpp;
      const r = raw[idx], g = raw[idx+1], b = raw[idx+2];
      const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      rects += `<rect x="${dx * 6}" y="${dy * 6}" width="6" height="6" fill="${hex}" />\n`;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cropW * 6}" height="${cropH * 6}" viewBox="0 0 ${cropW * 6} ${cropH * 6}">
    ${rects}
  </svg>`;

  fs.writeFileSync('scratch/crop_tuft.svg', svg);
  console.log('Saved scratch/crop_tuft.svg');
});
