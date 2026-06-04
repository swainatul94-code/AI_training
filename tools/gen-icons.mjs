// Generates branded PNG app icons with zero deps (built-in zlib only).
// Run: node tools/gen-icons.mjs   → writes icon-192.png, icon-512.png, favicon-32.png
import zlib from 'node:zlib';
import { writeFileSync } from 'node:fs';

function lerp(a, b, t) { return a + (b - a) * t; }
function mix(c1, c2, t) { return [lerp(c1[0],c2[0],t), lerp(c1[1],c2[1],t), lerp(c1[2],c2[2],t)]; }

// Brand colors
const BG0 = [10, 14, 22];     // near-black
const BG1 = [26, 19, 53];     // deep purple
const A1  = [122, 162, 255];  // accent blue
const A2  = [157, 122, 255];  // accent purple
const A3  = [255, 209, 102];  // gold

function drawIcon(S) {
  // RGBA buffer
  const buf = Buffer.alloc(S * S * 4);
  const r = S * 0.18;            // corner radius
  const cx = S / 2, cy = S / 2;
  // neural-node motif: 3 nodes (triangle) + center node, edges between
  const nodes = [
    [S*0.30, S*0.34], [S*0.70, S*0.34],
    [S*0.50, S*0.70], [S*0.50, S*0.50],
  ];
  const edges = [[0,3],[1,3],[2,3],[0,1]];
  const nodeR = S * 0.052;
  const edgeW = S * 0.018;

  function inRounded(x, y) {
    // distance into rounded-rect mask
    const dx = Math.max(r - x, 0, x - (S - r));
    const dy = Math.max(r - y, 0, y - (S - r));
    return Math.hypot(dx, dy) <= r;
  }
  function distToSeg(px, py, ax, ay, bx, by) {
    const vx = bx-ax, vy = by-ay; const wx = px-ax, wy = py-ay;
    const t = Math.max(0, Math.min(1, (wx*vx + wy*vy) / (vx*vx + vy*vy)));
    return Math.hypot(px-(ax+vx*t), py-(ay+vy*t));
  }

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      if (!inRounded(x + 0.5, y + 0.5)) { buf[i+3] = 0; continue; }
      // diagonal gradient background
      const t = (x + y) / (2 * S);
      let [rr, gg, bb] = mix(BG0, BG1, t);
      // soft accent glow top-left + gold bottom-right
      const gl = Math.max(0, 1 - Math.hypot(x - S*0.28, y - S*0.28) / (S*0.55));
      [rr, gg, bb] = mix([rr,gg,bb], A1, gl * 0.18);
      const gr = Math.max(0, 1 - Math.hypot(x - S*0.74, y - S*0.74) / (S*0.5));
      [rr, gg, bb] = mix([rr,gg,bb], A3, gr * 0.12);

      // edges (gradient blue→purple), then nodes (white) on top
      let lit = 0, lc = A1;
      for (const [a,b] of edges) {
        const d = distToSeg(x+0.5, y+0.5, nodes[a][0], nodes[a][1], nodes[b][0], nodes[b][1]);
        if (d < edgeW) { lit = Math.max(lit, 1 - d/edgeW); }
      }
      if (lit > 0) {
        const ec = mix(A1, A2, (x)/S);
        [rr, gg, bb] = mix([rr,gg,bb], ec, lit * 0.9);
      }
      for (const [nx, ny] of nodes) {
        const d = Math.hypot(x+0.5 - nx, y+0.5 - ny);
        if (d < nodeR) {
          const k = Math.min(1, (nodeR - d) / (nodeR*0.5));
          [rr, gg, bb] = mix([rr,gg,bb], [245,248,255], k);
        }
      }
      buf[i] = Math.round(rr); buf[i+1] = Math.round(gg); buf[i+2] = Math.round(bb); buf[i+3] = 255;
    }
  }
  return buf;
}

// Minimal PNG encoder (RGBA, no interlace)
function crc32(b){let c,t=[];for(let n=0;n<256;n++){c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}let crc=0xffffffff;for(let i=0;i<b.length;i++)crc=t[(crc^b[i])&0xff]^(crc>>>8);return(crc^0xffffffff)>>>0;}
function chunk(type, data){
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const body = Buffer.concat([t, data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePNG(S, rgba){
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(S,0); ihdr.writeUInt32BE(S,4);
  ihdr[8]=8; ihdr[9]=6; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0; // 8-bit RGBA
  // add filter byte (0) per row
  const stride = S*4;
  const raw = Buffer.alloc((stride+1)*S);
  for (let y=0;y<S;y++){ raw[y*(stride+1)] = 0; rgba.copy(raw, y*(stride+1)+1, y*stride, y*stride+stride); }
  const idat = zlib.deflateSync(raw, {level:9});
  return Buffer.concat([sig, chunk('IHDR',ihdr), chunk('IDAT',idat), chunk('IEND',Buffer.alloc(0))]);
}

for (const S of [512, 192, 32]) {
  const png = encodePNG(S, drawIcon(S));
  const name = S === 32 ? 'favicon-32.png' : `icon-${S}.png`;
  writeFileSync(new URL('../' + name, import.meta.url), png);
  console.log('wrote', name, png.length, 'bytes');
}
