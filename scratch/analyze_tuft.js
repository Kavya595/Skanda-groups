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
  
  const tuftPixels = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * bpp;
      const r = raw[idx], g = raw[idx+1], b = raw[idx+2];
      if (r < 185 && g < 200 && b < 160) {
        tuftPixels.push({x, y, r, g, b});
      }
    }
  }
  
  const clusters = [];
  for (const pt of tuftPixels) {
    let found = false;
    for (const cl of clusters) {
      if (Math.abs(cl.x - pt.x) < 8 && Math.abs(cl.y - pt.y) < 8) {
        cl.pts.push(pt);
        cl.x = Math.round(cl.pts.reduce((s, p) => s + p.x, 0) / cl.pts.length);
        cl.y = Math.round(cl.pts.reduce((s, p) => s + p.y, 0) / cl.pts.length);
        found = true;
        break;
      }
    }
    if (!found) clusters.push({ x: pt.x, y: pt.y, pts: [pt] });
  }
  
  const validClusters = clusters.filter(c => c.pts.length >= 8 && c.x < 180 && c.y < 180);
  console.log('Tuft count found:', validClusters.length);
  validClusters.sort((a,b) => a.y - b.y || a.x - b.x);
  console.log('Sample tuft positions (x, y, ptCount):');
  validClusters.slice(0, 15).forEach(c => console.log(`  x: ${c.x}, y: ${c.y}, pts: ${c.pts.length}`));
  
  // Inspect single tuft shape in detail
  const t = validClusters[1];
  console.log('Tuft at', t.x, t.y, 'pixel bounds:');
  const minX = Math.min(...t.pts.map(p => p.x));
  const maxX = Math.max(...t.pts.map(p => p.x));
  const minY = Math.min(...t.pts.map(p => p.y));
  const maxY = Math.max(...t.pts.map(p => p.y));
  console.log(`Width: ${maxX - minX + 1}, Height: ${maxY - minY + 1}`);
  for (let y = minY; y <= maxY; y++) {
    let rowStr = '';
    for (let x = minX; x <= maxX; x++) {
      const p = t.pts.find(pt => pt.x === x && pt.y === y);
      rowStr += p ? '#' : ' ';
    }
    console.log(rowStr);
  }

});
