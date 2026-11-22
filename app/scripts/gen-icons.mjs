import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
const RED = [0xE3, 0x26, 0x2B];
const CRC_TABLE = buildCrcTable();

function buildCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const name = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])), 0);
  return Buffer.concat([len, name, data, crc]);
}

function encodePng(size, pixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  const stride = size * 4;
  const raw = Buffer.alloc(size * (stride + 1));
  for (let y = 0; y < size; y++) {
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

function drawIcon(size, maskable) {
  const pixels = Buffer.alloc(size * size * 4);
  const c = size / 2;
  const halfLen = Math.round(size * (maskable ? 0.35 : 0.3125));
  const halfThick = Math.round(size * (maskable ? 0.06 : 0.0664));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cross = (Math.abs(x - c) <= halfLen && Math.abs(y - c) <= halfThick)
        || (Math.abs(x - c) <= halfThick && Math.abs(y - c) <= halfLen);
      const i = (y * size + x) * 4;
      pixels[i] = cross ? 255 : RED[0];
      pixels[i + 1] = cross ? 255 : RED[1];
      pixels[i + 2] = cross ? 255 : RED[2];
      pixels[i + 3] = 255;
    }
  }
  return pixels;
}

function writeIcon(name, size, maskable) {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, name), encodePng(size, drawIcon(size, maskable)));
  console.log(`${name} : ${size}x${size}`);
}

export function generateIcons() {
  writeIcon('icon-192.png', 192, false);
  writeIcon('icon-512.png', 512, false);
  writeIcon('icon-maskable-512.png', 512, true);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateIcons();
}
