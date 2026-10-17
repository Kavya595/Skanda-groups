import fs from 'fs';
import zlib from 'zlib';

// Fast CRC32
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const typeAndData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([lenBuf, typeAndData, crcBuf]);
}

function encodeRGBAtoPNG(width, height, rgbaBuffer) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines with filter type 0 (None)
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    scanlines[y * (1 + width * 4)] = 0; // Filter None
    rgbaBuffer.copy(scanlines, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// 1. Decode original media image
const rawPng = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/brain/20a6c604-8932-495e-8ae3-9bc46296be63/.user_uploaded/media_1791875751935_c70a40fe.png');
let pos = 8;
const chunks = [];
let srcW = 0, srcH = 0;

while (pos < rawPng.length) {
  const len = rawPng.readUInt32BE(pos);
  const type = rawPng.subarray(pos + 4, pos + 8).toString('ascii');
  if (type === 'IHDR') {
    srcW = rawPng.readUInt32BE(pos + 8);
    srcH = rawPng.readUInt32BE(pos + 12);
  } else if (type === 'IDAT') {
    chunks.push(rawPng.subarray(pos + 8, pos + 8 + len));
  }
  pos += 12 + len;
}

const decompressed = zlib.inflateSync(Buffer.concat(chunks));
const bpp = 4;
const stride = 1 + srcW * bpp;
const srcPixels = Buffer.alloc(srcW * srcH * 4);

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

for (let y = 0; y < srcH; y++) {
  const filterType = decompressed[y * stride];
  const rowStart = y * stride + 1;
  const prevRowStart = (y - 1) * srcW * 4;
  const outRowStart = y * srcW * 4;
  for (let x = 0; x < srcW * bpp; x++) {
    const raw = decompressed[rowStart + x];
    const a = x >= bpp ? srcPixels[outRowStart + x - bpp] : 0;
    const b = y > 0 ? srcPixels[prevRowStart + x] : 0;
    const c = (y > 0 && x >= bpp) ? srcPixels[prevRowStart + x - bpp] : 0;
    let val = 0;
    if (filterType === 0) val = raw;
    else if (filterType === 1) val = (raw + a) & 0xff;
    else if (filterType === 2) val = (raw + b) & 0xff;
    else if (filterType === 3) val = (raw + Math.floor((a + b) / 2)) & 0xff;
    else if (filterType === 4) val = (raw + paeth(a, b, c)) & 0xff;
    srcPixels[outRowStart + x] = val;
  }
}

// 2. Locate tree bounding box and trunk base
let minX = srcW, maxX = 0, minY = srcH, maxY = 0;
for (let y = 0; y < srcH; y++) {
  for (let x = 0; x < srcW; x++) {
    const idx = (y * srcW + x) * 4;
    const r = srcPixels[idx], g = srcPixels[idx+1], b = srcPixels[idx+2];
    if (r < 235 || g < 235 || b < 235) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

// Trunk base at the very bottom
let baseXs = [];
for (let x = minX; x <= maxX; x++) {
  const idx = (maxY * srcW + x) * 4;
  const r = srcPixels[idx], g = srcPixels[idx+1], b = srcPixels[idx+2];
  if (r < 230 || g < 230 || b < 230) baseXs.push(x);
}
const trunkBaseX = baseXs.length ? (Math.min(...baseXs) + Math.max(...baseXs)) / 2 : (minX + maxX) / 2;

console.log('Original tree bounds:', { minX, maxX, minY, maxY, trunkBaseX });

// Target high-definition texture: 512 x 512
// Place the tree with trunk base centered at X = 256, and bottom touching Y = 500
const outW = 512;
const outH = 512;
const outPixels = Buffer.alloc(outW * outH * 4); // all zeros = transparent

const treeHeight = maxY - minY + 1;
// Target tree height in 512 texture = 460 px
const scale = 460 / treeHeight;
const targetBaseX = 256;
const targetBaseY = 500;

for (let sy = minY; sy <= maxY; sy++) {
  for (let sx = minX; sx <= maxX; sx++) {
    const sIdx = (sy * srcW + sx) * 4;
    const r = srcPixels[sIdx];
    const g = srcPixels[sIdx + 1];
    const b = srcPixels[sIdx + 2];

    // Background thresholding with smooth alpha feathering
    let alpha = 255;
    const brightness = (r + g + b) / 3;

    if (brightness > 242) {
      alpha = 0;
    } else if (brightness > 218) {
      // Feather smoothly from 218 to 242
      alpha = Math.round(255 * (242 - brightness) / 24);
    }

    if (alpha <= 0) continue;

    // Destination coordinates mapped from source relative to trunkBase
    const dx = Math.round(targetBaseX + (sx - trunkBaseX) * scale);
    const dy = Math.round(targetBaseY - (maxY - sy) * scale);

    if (dx >= 0 && dx < outW && dy >= 0 && dy < outH) {
      // Bilinear/point splat 2x2 to avoid gaps when upscaling
      for (let oy = 0; oy <= Math.ceil(scale); oy++) {
        for (let ox = 0; ox <= Math.ceil(scale); ox++) {
          const px = dx + ox;
          const py = dy + oy;
          if (px < outW && py < outH) {
            const outIdx = (py * outW + px) * 4;
            // Write only if higher alpha
            if (alpha > outPixels[outIdx + 3]) {
              outPixels[outIdx] = r;
              outPixels[outIdx + 1] = g;
              outPixels[outIdx + 2] = b;
              outPixels[outIdx + 3] = alpha;
            }
          }
        }
      }
    }
  }
}

const pngOutput = encodeRGBAtoPNG(outW, outH, outPixels);
fs.writeFileSync('public/images/coconut-tree-transparent.png', pngOutput);
console.log('Successfully generated public/images/coconut-tree-transparent.png! Size:', pngOutput.length, 'bytes');
