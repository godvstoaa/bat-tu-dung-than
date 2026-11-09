// ============================================================================
//  HUYỀN GIỚI — kết cấu mặt đất sinh thủ tục (không dùng file ảnh).
//  Mỗi lớp trả albedo (RGB) + độ cao (A) + normal map, LIỀN MẠCH khi lặp (noise tuần hoàn,
//  nét vẽ tràn mép được vẽ lặp lại ở phía đối diện).
//    groundLayers(S)  → DataArrayTexture 4 lớp: 0 cỏ nền · 1 đất · 2 đá · 3 đá cuội đường
//    paveSet(opts)    → { map, normalMap } phiến đá lát sân xếp so le (thay bàn cờ cũ)
// ============================================================================
import * as THREE from 'three';
import { rng } from './textures.js';

// ---------- noise tuần hoàn (tile được) ----------
function hash2(i, j, seed) {
  let h = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(seed, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
const wrapI = (i, P) => ((i % P) + P) % P;
// u, v ∈ [0,1): một chu kỳ = P ô lưới → giá trị ở u = 0 và u = 1 trùng nhau
function vnoise(u, v, P, seed) {
  const x = u * P, y = v * P, i = Math.floor(x), j = Math.floor(y);
  const fx = x - i, fy = y - j, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const i0 = wrapI(i, P), j0 = wrapI(j, P), i1 = (i0 + 1) % P, j1 = (j0 + 1) % P;
  const a = hash2(i0, j0, seed), b = hash2(i1, j0, seed), c = hash2(i0, j1, seed), d = hash2(i1, j1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
function fbmT(u, v, P, oct, seed) {
  let a = 0, amp = 0.5, n = 0, p = P;
  for (let o = 0; o < oct; o++) { a += amp * vnoise(u, v, p, seed + o * 31); n += amp; amp *= 0.5; p *= 2; }
  return a / n;
}
// Voronoi tuần hoàn: G×G ô, mỗi ô một điểm → F1, F2, id ô gần nhất
function voronoi(u, v, G, seed, jit = 0.85) {
  const x = u * G, y = v * G, ci = Math.floor(x), cj = Math.floor(y);
  let f1 = 9, f2 = 9, id = 0;
  for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
    const i = ci + di, j = cj + dj, wi = wrapI(i, G), wj = wrapI(j, G);
    const px = i + 0.5 + (hash2(wi, wj, seed) - 0.5) * jit, py = j + 0.5 + (hash2(wi, wj, seed + 7) - 0.5) * jit;
    const d = Math.hypot(x - px, y - py);
    if (d < f1) { f2 = f1; f1 = d; id = wj * G + wi; } else if (d < f2) f2 = d;
  }
  return { f1, f2, id };
}
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const hex = (s) => { const c = new THREE.Color(s); return [c.r, c.g, c.b]; };
const shade = (s, k) => '#' + new THREE.Color(s).multiplyScalar(k).getHexString();
const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// trong Web Worker không có document → OffscreenCanvas
function canvas(S) {
  const c = typeof document !== 'undefined' ? Object.assign(document.createElement('canvas'), { width: S, height: S }) : new OffscreenCanvas(S, S);
  return [c, c.getContext('2d', { willReadFrequently: true })];
}

// Vẽ một hình lặp ở cả 9 bản sao quanh tấm (cho nét tràn mép liền mạch)
function wrapDraw(S, x, y, r, fn) {
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    const ox = x + dx * S, oy = y + dy * S;
    if (ox + r < 0 || oy + r < 0 || ox - r > S || oy - r > S) continue;
    fn(ox, oy);
  }
}

// ---------- normal map từ độ cao (tuần hoàn) ----------
function normalFromHeight(h, S, strength) {
  const out = new Uint8Array(S * S * 4);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const xl = (x - 1 + S) % S, xr = (x + 1) % S, yu = (y - 1 + S) % S, yd = (y + 1) % S;
    const dx = (h[y * S + xr] - h[y * S + xl]) * strength, dy = (h[yd * S + x] - h[yu * S + x]) * strength;
    const n = Math.hypot(dx, dy, 1), k = (y * S + x) * 4;
    out[k] = (-dx / n * 0.5 + 0.5) * 255; out[k + 1] = (-dy / n * 0.5 + 0.5) * 255; out[k + 2] = (1 / n * 0.5 + 0.5) * 255; out[k + 3] = 255;
  }
  return out;
}

// Kết quả chung của một lớp: rgb [0..1] sRGB + độ cao [0..1]
function layer(S) { return { S, rgb: new Float32Array(S * S * 3), h: new Float32Array(S * S) }; }
function fromCanvas(L, ctxC, ctxH) {
  const S = L.S, c = ctxC.getImageData(0, 0, S, S).data, hh = ctxH ? ctxH.getImageData(0, 0, S, S).data : null;
  for (let i = 0; i < S * S; i++) {
    L.rgb[i * 3] = c[i * 4] / 255; L.rgb[i * 3 + 1] = c[i * 4 + 1] / 255; L.rgb[i * 3 + 2] = c[i * 4 + 2] / 255;
    if (hh) L.h[i] = hh[i * 4] / 255;
  }
}
function toCanvas(L, ctxC, ctxH) {
  const S = L.S, ic = ctxC.createImageData(S, S), ih = ctxH?.createImageData(S, S);
  for (let i = 0; i < S * S; i++) {
    ic.data[i * 4] = L.rgb[i * 3] * 255; ic.data[i * 4 + 1] = L.rgb[i * 3 + 1] * 255; ic.data[i * 4 + 2] = L.rgb[i * 3 + 2] * 255; ic.data[i * 4 + 3] = 255;
    if (ih) { const v = L.h[i] * 255; ih.data[i * 4] = ih.data[i * 4 + 1] = ih.data[i * 4 + 2] = v; ih.data[i * 4 + 3] = 255; }
  }
  ctxC.putImageData(ic, 0, 0); if (ih) ctxH.putImageData(ih, 0, 0);
}

// ---------- lớp 0: cỏ nền (nhìn gần thấy ngọn cỏ nằm, xa thành mảng xanh có lốm đốm) ----------
function grassLayer(S) {
  const L = layer(S), r = rng(101);
  const soil = hex('#3b3424'), soil2 = hex('#2c2a1c'), g0 = hex('#4b5f27'), g1 = hex('#5d7030');
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const u = x / S, v = y / S, i = y * S + x;
    const n = fbmT(u, v, 6, 4, 3), m = fbmT(u, v, 3, 3, 9);
    let c = mix3(mix3(soil2, soil, n), mix3(g0, g1, m), sstep(0.3, 0.7, n * 0.6 + m * 0.6));
    const grain = (hash2(x, y, 5) - 0.5) * 0.06;
    L.rgb[i * 3] = c[0] + grain; L.rgb[i * 3 + 1] = c[1] + grain; L.rgb[i * 3 + 2] = c[2] + grain;
    L.h[i] = n * 0.25;
  }
  const [cc, gc] = canvas(S), [hc, gh] = canvas(S);
  toCanvas(L, gc, gh);
  const pal = ['#56702c', '#627a32', '#4a6326', '#6c8236', '#7a8a3c', '#3f5622', '#5a7a2e', '#85903f'];
  const dry = ['#a39a5c', '#b3a66a', '#8f8550'];
  const N = Math.round(S * S / 14);
  gc.lineCap = 'round'; gh.lineCap = 'round';
  for (let k = 0; k < N; k++) {
    const x = r() * S, y = r() * S, len = (5 + r() * 12) * S / 512, a = r() * Math.PI * 2, bend = (r() - 0.5) * 0.9;
    const w = (0.8 + r() * 1.6) * S / 512;
    const isDry = r() < 0.06, col = isDry ? dry[(r() * dry.length) | 0] : pal[(r() * pal.length) | 0];
    const hv = 0.35 + 0.65 * (k / N);
    const ex = Math.cos(a) * len, ey = Math.sin(a) * len, mx = Math.cos(a + bend) * len * 0.5, my = Math.sin(a + bend) * len * 0.5;
    wrapDraw(S, x, y, len + 2, (ox, oy) => {
      gc.strokeStyle = 'rgba(20,24,10,0.35)'; gc.lineWidth = w + 1;
      gc.beginPath(); gc.moveTo(ox + 0.8, oy + 0.8); gc.quadraticCurveTo(ox + mx + 0.8, oy + my + 0.8, ox + ex + 0.8, oy + ey + 0.8); gc.stroke();
      gc.strokeStyle = col; gc.lineWidth = w;
      gc.beginPath(); gc.moveTo(ox, oy); gc.quadraticCurveTo(ox + mx, oy + my, ox + ex, oy + ey); gc.stroke();
      const hs = (hv * 255) | 0; gh.strokeStyle = `rgb(${hs},${hs},${hs})`; gh.lineWidth = w;
      gh.beginPath(); gh.moveTo(ox, oy); gh.quadraticCurveTo(ox + mx, oy + my, ox + ex, oy + ey); gh.stroke();
    });
  }
  // cỏ ba lá lác đác
  for (let k = 0; k < S / 6; k++) {
    const x = r() * S, y = r() * S, s = (1.6 + r() * 1.4) * S / 512;
    wrapDraw(S, x, y, s * 3, (ox, oy) => {
      for (let p = 0; p < 3; p++) { const a = p * 2.1 + r(); gc.fillStyle = '#5f7f34'; gc.beginPath(); gc.arc(ox + Math.cos(a) * s, oy + Math.sin(a) * s, s, 0, Math.PI * 2); gc.fill(); gh.fillStyle = '#d0d0d0'; gh.beginPath(); gh.arc(ox + Math.cos(a) * s, oy + Math.sin(a) * s, s, 0, Math.PI * 2); gh.fill(); }
    });
  }
  fromCanvas(L, gc, gh);
  return L;
}

// ---------- lớp 1: đất (đất nện, sỏi nhỏ, vệt ẩm, lá khô) ----------
function dirtLayer(S) {
  const L = layer(S), r = rng(202);
  const a = hex('#776247'), b = hex('#8c7556'), d = hex('#5a4934');
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const u = x / S, v = y / S, i = y * S + x;
    const n = fbmT(u, v, 5, 5, 21), m = fbmT(u, v, 2, 3, 27);
    let c = mix3(a, b, n);
    c = mix3(c, d, sstep(0.55, 0.8, m) * 0.6); // vệt ẩm
    const grain = (hash2(x, y, 23) - 0.5) * 0.09;
    L.rgb[i * 3] = c[0] + grain; L.rgb[i * 3 + 1] = c[1] + grain; L.rgb[i * 3 + 2] = c[2] + grain;
    L.h[i] = 0.25 + n * 0.25 - sstep(0.55, 0.8, m) * 0.1 + grain * 0.6;
  }
  const [, gc] = canvas(S), [, gh] = canvas(S);
  toCanvas(L, gc, gh);
  const N = Math.round(S * S / 900);
  for (let k = 0; k < N; k++) {
    const x = r() * S, y = r() * S, rx = (1.5 + r() * r() * 6) * S / 512, ry = rx * (0.6 + r() * 0.4), rot = r() * 3.14;
    const t = 0.62 + r() * 0.22, col = `rgb(${(146 * t) | 0},${(132 * t) | 0},${(112 * t) | 0})`;
    wrapDraw(S, x, y, rx + 2, (ox, oy) => {
      gc.fillStyle = 'rgba(30,22,12,0.35)'; gc.beginPath(); gc.ellipse(ox + 0.7, oy + 0.9, rx, ry, rot, 0, Math.PI * 2); gc.fill();
      gc.fillStyle = col; gc.beginPath(); gc.ellipse(ox, oy, rx, ry, rot, 0, Math.PI * 2); gc.fill();
      const gr = gh.createRadialGradient(ox, oy, 0, ox, oy, rx); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#808080');
      gh.fillStyle = gr; gh.beginPath(); gh.ellipse(ox, oy, rx, ry, rot, 0, Math.PI * 2); gh.fill();
    });
  }
  // cành, lá khô
  for (let k = 0; k < S / 10; k++) {
    const x = r() * S, y = r() * S, len = (6 + r() * 14) * S / 512, a0 = r() * 6.28;
    wrapDraw(S, x, y, len + 2, (ox, oy) => {
      gc.strokeStyle = r() < 0.5 ? '#4a3622' : '#8a6a3a'; gc.lineWidth = (0.8 + r()) * S / 512;
      gc.beginPath(); gc.moveTo(ox, oy); gc.lineTo(ox + Math.cos(a0) * len, oy + Math.sin(a0) * len); gc.stroke();
    });
  }
  fromCanvas(L, gc, gh);
  return L;
}

// ---------- lớp 2: đá núi (thớ lớp, nứt, địa y) ----------
function rockLayer(S) {
  const L = layer(S);
  // thớ lớp nằm ngang (trên vách dốc, chiếu triplanar → vân ngang như đá trầm tích), sắc ấm/lạnh
  // loang lổ, khe nứt mảnh thưa, địa y lấm tấm — tránh mạng nứt dày kiểu «mai rùa»
  const a = hex('#857f74'), b = hex('#a39c8f'), warm = hex('#9a8a76'), dk = hex('#5a544c'), li = hex('#8d9160'), li2 = hex('#b4ab80');
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const u = x / S, v = y / S, i = y * S + x;
    const n = fbmT(u, v, 4, 5, 41), w = fbmT(u, v, 2, 3, 47), big = fbmT(u, v, 1, 2, 49);
    const band = Math.sin((v * 3 + w * 1.1 + n * 0.8) * Math.PI * 2);
    const strata = 0.5 + 0.5 * band, ledge = sstep(0.86, 0.98, band) * sstep(0.35, 0.6, w);   // gờ lớp đứt đoạn
    const groove = sstep(-0.93, -0.995, band) * sstep(0.4, 0.65, n);
    const rc = 1 - Math.abs(fbmT(u, v, 5, 3, 57) * 2 - 1);
    const crack = sstep(0.975, 0.996, rc) * sstep(0.35, 0.6, fbmT(u, v, 3, 2, 55));
    let c = mix3(mix3(a, b, n * 0.8 + strata * 0.2), warm, sstep(0.45, 0.7, big) * 0.6);
    c = mix3(c, [c[0] * 1.12, c[1] * 1.12, c[2] * 1.1], ledge * 0.5);
    c = mix3(c, dk, Math.min(1, crack + groove * 0.6) * 0.6);
    const lic = sstep(0.62, 0.68, fbmT(u, v, 12, 4, 59)) * sstep(0.45, 0.6, w);
    c = mix3(c, hash2(x >> 2, y >> 2, 61) < 0.5 ? li : li2, lic * 0.4);
    const grain = (hash2(x, y, 43) - 0.5) * 0.08;
    L.rgb[i * 3] = c[0] + grain; L.rgb[i * 3 + 1] = c[1] + grain; L.rgb[i * 3 + 2] = c[2] + grain;
    L.h[i] = 0.35 + n * 0.4 + strata * 0.15 + ledge * 0.1 - crack * 0.3 - groove * 0.15;
  }
  return L;
}

// ---------- lớp 3: đá cuội đường (viên tròn cạnh, mạch đất có rêu) ----------
function cobbleLayer(S) {
  const L = layer(S);
  const stones = ['#a0988a', '#8b8476', '#aca290', '#827b70', '#978d7c', '#b3a896'].map(hex);
  const gap = hex('#4a3f30'), moss = hex('#4d5a2e');
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const u = x / S, v = y / S, i = y * S + x;
    const vo = voronoi(u, v, 9, 71, 0.75);
    const edge = vo.f2 - vo.f1;
    const stone = sstep(0.04, 0.13, edge);
    const base = stones[(hash2(vo.id, 3, 73) * stones.length) | 0];
    const n = fbmT(u, v, 16, 3, 79);
    let sc = mix3(base, [base[0] * 0.8, base[1] * 0.8, base[2] * 0.78], n);
    sc = mix3(sc, [sc[0] * 1.12, sc[1] * 1.12, sc[2] * 1.1], sstep(0.25, 0.0, vo.f1) * 0.5); // mặt mòn bóng
    const gc = mix3(gap, moss, sstep(0.5, 0.7, fbmT(u, v, 6, 3, 83)));
    const c = mix3(gc, sc, stone);
    const grain = (hash2(x, y, 89) - 0.5) * 0.06;
    L.rgb[i * 3] = c[0] + grain; L.rgb[i * 3 + 1] = c[1] + grain; L.rgb[i * 3 + 2] = c[2] + grain;
    L.h[i] = stone * (0.55 + 0.45 * (1 - Math.min(1, vo.f1 * vo.f1 * 2.2))) + n * 0.05;
  }
  return L;
}

// ---------- phiến đá lát sân: xếp so le, mạch vữa, mòn, ố, sứt góc ----------
function paveLayer(S, { seed = 7, rows = 4, base = '#8f877a', grout = '#4d463d', varK = 0.07 } = {}) {
  const L = layer(S), r = rng(seed);
  const bc = hex(base), gcol = hex(grout);
  const rowH = S / rows;
  // chia mỗi hàng thành phiến dài 1–2 lần chiều cao hàng, lệch so le
  const slabs = [];
  for (let j = 0; j < rows; j++) {
    const off = (j % 2 ? 0.5 : 0) * rowH + r() * rowH * 0.3;
    let x = off; const row = [];
    while (x < off + S - 1) { const w = Math.min(off + S - x, rowH * (1 + Math.round(r() * 2) * 0.5)); row.push({ x0: x, x1: x + w, k: 1 + (r() - 0.5) * 2 * varK, tint: r(), id: slabs.length + row.length }); x += w; }
    slabs.push({ off, row });
  }
  const gw = Math.max(0.6, S / 700); // nửa bề rộng mạch vữa (~1 cm)
  for (let y = 0; y < S; y++) {
    const j = Math.floor(y / rowH), R = slabs[j], yl = y - j * rowH;
    for (let x = 0; x < S; x++) {
      const i = y * S + x, u = x / S, v = y / S;
      let xx = x; if (xx < R.off) xx += S;
      const sl = R.row.find((s) => xx >= s.x0 && xx < s.x1) || R.row[R.row.length - 1];
      const dEdge = Math.min(yl, rowH - yl, xx - sl.x0, sl.x1 - xx);
      const chip = hash2(sl.id, 1, seed) < 0.35 ? fbmT(u, v, 24, 2, seed + sl.id) * 6 : 0; // sứt cạnh
      const inSlab = sstep(gw, gw + 1.6 + chip, dEdge);
      const n = fbmT(u, v, 8, 4, seed + 11), stain = sstep(0.6, 0.85, fbmT(u, v, 3, 3, seed + 13));
      let c = [bc[0] * sl.k, bc[1] * sl.k, bc[2] * sl.k * (0.97 + sl.tint * 0.06)];
      c = mix3(c, [c[0] * 0.9, c[1] * 0.89, c[2] * 0.87], n);
      c = mix3(c, [c[0] * 0.7, c[1] * 0.72, c[2] * 0.62], stain * 0.5);           // ố nước
      c = mix3(c, [c[0] * 1.08, c[1] * 1.07, c[2] * 1.05], sstep(rowH * 0.15, rowH * 0.45, dEdge) * 0.35); // giữa phiến mòn sáng
      const cr = hash2(sl.id, 9, seed) < 0.08 ? 1 - sstep(0, 1.2, Math.abs(fbmT(u, v, 12, 2, sl.id + 5) - 0.5) * S / 12) : 0; // vết nứt
      c = mix3(c, [c[0] * 0.55, c[1] * 0.55, c[2] * 0.55], cr * 0.7);
      const fin = mix3(mix3(gcol, [0.3, 0.34, 0.2], sstep(0.6, 0.8, n) * 0.35), c, inSlab);
      const grain = (hash2(x, y, seed + 17) - 0.5) * 0.05;
      L.rgb[i * 3] = fin[0] + grain; L.rgb[i * 3 + 1] = fin[1] + grain; L.rgb[i * 3 + 2] = fin[2] + grain;
      L.h[i] = inSlab * (0.75 + n * 0.15) - cr * 0.2;
    }
  }
  return L;
}

// ---------- đóng gói ----------
function rgba(L) {
  const S = L.S, out = new Uint8Array(S * S * 4);
  for (let i = 0; i < S * S; i++) {
    out[i * 4] = Math.max(0, Math.min(255, L.rgb[i * 3] * 255));
    out[i * 4 + 1] = Math.max(0, Math.min(255, L.rgb[i * 3 + 1] * 255));
    out[i * 4 + 2] = Math.max(0, Math.min(255, L.rgb[i * 3 + 2] * 255));
    out[i * 4 + 3] = Math.max(0, Math.min(255, L.h[i] * 255));
  }
  return out;
}
function arrayTex(data, S, n, srgb) {
  const t = new THREE.DataArrayTexture(data, S, S, n);
  t.format = THREE.RGBAFormat; t.type = THREE.UnsignedByteType;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}

export const GROUND_LAYERS = { grass: 0, dirt: 1, rock: 2, cobble: 3 };

// --- dữ liệu thô (chạy được trong Web Worker — gen.worker.js) ---
export function groundLayersData(S = 512) {
  const layers = [grassLayer(S), dirtLayer(S), rockLayer(S), cobbleLayer(S)];
  const strength = [3.2, 4.5, 6, 7].map((k) => k * S / 512);
  const alb = new Uint8Array(S * S * 4 * layers.length), nrm = new Uint8Array(S * S * 4 * layers.length);
  layers.forEach((L, k) => { alb.set(rgba(L), k * S * S * 4); nrm.set(normalFromHeight(L.h, S, strength[k]), k * S * S * 4); });
  return { alb, nrm, S, n: layers.length };
}
export function paveData({ seed = 7, rows = 4, base = '#8f877a', S = 512, grout } = {}) {
  grout = grout || shade(base, 0.62);
  const L = paveLayer(S, { seed, rows, base, grout });
  return { alb: rgba(L), nrm: normalFromHeight(L.h, S, 5 * S / 512), S };
}
export function waterNormalData(S = 256) {
  const h = new Float32Array(S * S);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const u = x / S, v = y / S;
    h[y * S + x] = fbmT(u, v, 4, 4, 301) * 0.6 + fbmT((u + v * 0.5) % 1, v, 8, 3, 307) * 0.4;
  }
  return { nrm: normalFromHeight(h, S, 9 * S / 256), S };
}

// --- bọc thành texture (luồng chính) ---
export function layersTexture(data, S, n, srgb) { return arrayTex(data, S, n, srgb); }

// Texture tạm 4×4 cùng kiểu với bản thật → đổi sang bản thật KHÔNG phải biên dịch lại shader
export function placeholderArray(n, rgbList, srgb) {
  const d = new Uint8Array(4 * 4 * 4 * n);
  for (let k = 0; k < n; k++) for (let i = 0; i < 16; i++) d.set([...rgbList[k % rgbList.length], 128], (k * 16 + i) * 4);
  return arrayTex(d, 4, n, srgb);
}

function dataTex(data, S, srgb, repeat) {
  const t = new THREE.DataTexture(data, S, S, THREE.RGBAFormat, THREE.UnsignedByteType);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]);
  t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}
const flat = (rgb) => { const d = new Uint8Array(64); for (let i = 0; i < 16; i++) d.set([...rgb, 255], i * 4); return d; };

// Bộ sinh (luồng chính hoặc Worker) — gen.js gán vào; mặc định chạy tại chỗ
let generator = (op, args) => Promise.resolve(op === 'pave' ? paveData(args) : null);
export function setGenerator(fn) { generator = fn; }

// Phiến lát sân: cùng dữ liệu cho nhiều vật liệu (repeat khác nhau) → cache lời hứa theo khoá
const paveCache = new Map();
function paveAsync(o) {
  const key = `${o.seed}|${o.rows}|${o.base}|${o.S}|${o.grout || ''}`;
  if (!paveCache.has(key)) paveCache.set(key, generator('pave', o));
  return paveCache.get(key);
}
const pending = new Set();
/** Lời hứa xong khi mọi vật liệu đá đã có kết cấu thật (màn nạp chờ cái này). */
export function stoneReady() { return Promise.all([...pending]); }

// Vật liệu đá lát dùng chung (sân, nền bậc, tường thành, sàn điện): albedo + normal map,
// phiến xếp so le. Trả vật liệu NGAY (kết cấu tạm cùng màu nền), kết cấu thật sinh nền (Worker)
// rồi thay vào — không chặn luồng chính.
export function stoneMaterial({ seed = 7, rows = 8, base = '#8f877a', repeat = [1, 1], roughness = 0.9, normalScale = 0.9, grout, S } = {}) {
  const c = new THREE.Color(base), rgb = [c.r * 255 | 0, c.g * 255 | 0, c.b * 255 | 0];
  const mat = new THREE.MeshStandardMaterial({
    map: dataTex(flat(rgb), 4, true, repeat), normalMap: dataTex(flat([128, 128, 255]), 4, false, repeat),
    normalScale: new THREE.Vector2(normalScale, normalScale), roughness,
  });
  const p = paveAsync({ seed, rows, base, S: S || (rows > 6 ? 512 : 256), grout }).then((d) => {
    if (!d) return;
    const old = [mat.map, mat.normalMap];
    mat.map = dataTex(d.alb, d.S, true, repeat); mat.normalMap = dataTex(d.nrm, d.S, false, repeat);
    old.forEach((t) => t.dispose());
  }).finally(() => pending.delete(p));
  pending.add(p);
  return mat;
}

export function waterNormalTexture({ nrm, S }) {
  const t = new THREE.DataTexture(nrm, S, S, THREE.RGBAFormat, THREE.UnsignedByteType);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}
