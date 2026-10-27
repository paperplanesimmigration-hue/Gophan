import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Function to generate an uncompressed or zlib-compressed valid PNG file
function createPng(width, height, r, g, b, textOverlay) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per channel
  ihdrData.writeUInt8(6, 9); // RGBA color type
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw image data with scanline filter bytes
  const bytesPerPixel = 4;
  const rowSize = 1 + width * bytesPerPixel;
  const rawData = Buffer.alloc(height * rowSize);

  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.min(width, height) / 2;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Gold coin circular crest
      if (dist < maxR * 0.88) {
        // Indian Saffron / Gold gradient
        const t = (y / height);
        rawData[pxOffset] = Math.min(255, Math.floor(r * (1.2 - t * 0.4)));
        rawData[pxOffset + 1] = Math.min(255, Math.floor(g * (1.2 - t * 0.4)));
        rawData[pxOffset + 2] = Math.min(255, Math.floor(b * (1.2 - t * 0.4)));
        rawData[pxOffset + 3] = 255;
      } else if (dist < maxR * 0.94) {
        // Gold rim
        rawData[pxOffset] = 250;
        rawData[pxOffset + 1] = 204;
        rawData[pxOffset + 2] = 21;
        rawData[pxOffset + 3] = 255;
      } else {
        // Dark amber/stone border
        rawData[pxOffset] = 28;
        rawData[pxOffset + 1] = 25;
        rawData[pxOffset + 2] = 23;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);

  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeInt32BE(crc, 8 + len);
  return buf;
}

// CRC32 implementation for PNG chunks
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xff];
  }
  return ~c;
}

const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

// Output icons
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating compliant PWA & Android Play Store PNG icons...');

// Standard 192x192
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, 234, 88, 12));
// Standard 512x512 Play Store Launcher Icon
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, 234, 88, 12));
// Maskable 512x512 with safe zone padding
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, 245, 158, 11));
// iOS Safari apple-touch-icon 180x180
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, 234, 88, 12));
// Favicon
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(48, 48, 245, 158, 11));

console.log('✓ All PWA & Android Play Store icons generated in /public!');
