// ============================================================================
//  HUYỀN GIỚI — cây sinh thủ tục kiểu game thật: thân/cành là ống thuôn có vỏ cây,
//  tán là cụm «thẻ lá» (quad có alpha) với pháp tuyến cầu → ánh sáng mềm có khối.
//    pine : thông núi kiểu Hoàng Sơn — thân hơi nghiêng, cành ngang, tán xếp tầng như mây
//    leaf : cây lá rộng — thân chẻ 3–4 nhánh, mỗi nhánh một chùm tán tròn
//  Mỗi loài vài biến thể (seed). Kết quả: { bark: BufferGeometry, foliage: BufferGeometry, height }.
//  Kết cấu (vỏ, lá kim, lá) vẽ bằng canvas — không dùng file ảnh.
// ============================================================================
import * as THREE from 'three';
import { rng } from './textures.js';

// ---------- kết cấu ----------
function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function texOf(c, { srgb = true, repeat = false } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

export function barkTexture(kind) {
  const [c, g] = cv(128, 256), r = rng(kind === 'pine' ? 61 : 67);
  const base = kind === 'pine' ? [92, 70, 54] : [96, 88, 78];
  g.fillStyle = `rgb(${base})`; g.fillRect(0, 0, 128, 256);
  // mảng vỏ (thông: vảy đỏ nâu; lá rộng: vỏ xám nứt dọc)
  for (let i = 0; i < (kind === 'pine' ? 90 : 40); i++) {
    const x = r() * 128, y = r() * 256, w = 8 + r() * 18, h = kind === 'pine' ? 10 + r() * 16 : 30 + r() * 60, k = 0.75 + r() * 0.4;
    g.fillStyle = `rgb(${base.map((v) => Math.min(255, v * k) | 0)})`;
    for (const ox of [-128, 0, 128]) for (const oy of [-256, 0, 256]) { g.beginPath(); g.ellipse(x + ox, y + oy, w / 2, h / 2, 0, 0, Math.PI * 2); g.fill(); }
  }
  g.strokeStyle = 'rgba(25,18,12,0.75)';
  for (let i = 0; i < 26; i++) {
    let x = r() * 128; g.lineWidth = 1 + r() * 2.2; g.beginPath(); g.moveTo(x, 0);
    for (let y = 0; y <= 256; y += 16) { x += (r() - 0.5) * 7; g.lineTo(x, y); }
    g.stroke();
  }
  return texOf(c, { repeat: true });
}

// Cụm lá kim: nhiều chùm kim toả từ tâm, gốc tối, ngọn sáng
function needleTexture() {
  const S = 256, [c, g] = cv(S, S), r = rng(71);
  g.clearRect(0, 0, S, S);
  g.lineCap = 'round';
  for (let k = 0; k < 34; k++) {
    const cx = S / 2 + (r() - 0.5) * S * 0.62, cy = S / 2 + (r() - 0.5) * S * 0.5, n = 22 + (r() * 14 | 0);
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2, len = 10 + r() * 22, x2 = cx + Math.cos(a) * len, y2 = cy + Math.sin(a) * len * 0.8;
      const gr = g.createLinearGradient(cx, cy, x2, y2);
      const t = 0.75 + r() * 0.4;
      gr.addColorStop(0, `rgb(${18 * t | 0},${34 * t | 0},${16 * t | 0})`); gr.addColorStop(1, `rgb(${58 * t | 0},${92 * t | 0},${44 * t | 0})`);
      g.strokeStyle = gr; g.lineWidth = 1.3 + r() * 0.8;
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(x2, y2); g.stroke();
    }
  }
  // xoá mép (thẻ không lộ khung vuông)
  g.globalCompositeOperation = 'destination-in';
  const rg = g.createRadialGradient(S / 2, S / 2, S * 0.3, S / 2, S / 2, S * 0.5);
  rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = rg; g.fillRect(0, 0, S, S);
  return texOf(c);
}

// Cụm lá rộng: lá elip có gân, nhiều sắc xanh, dày ở giữa thưa ở mép
function leafTexture() {
  const S = 256, [c, g] = cv(S, S), r = rng(73);
  g.clearRect(0, 0, S, S);
  const pal = [[52, 82, 30], [64, 96, 36], [42, 70, 26], [78, 104, 40], [58, 88, 44]];
  for (let i = 0; i < 260; i++) {
    const a = r() * Math.PI * 2, d = Math.pow(r(), 0.7) * S * 0.42;
    const x = S / 2 + Math.cos(a) * d, y = S / 2 + Math.sin(a) * d * 0.9, rot = r() * Math.PI * 2, L = 9 + r() * 9, W = L * (0.38 + r() * 0.15);
    const col = pal[(r() * pal.length) | 0], k = 0.75 + r() * 0.45 - d / S * 0.3;
    g.save(); g.translate(x, y); g.rotate(rot);
    g.fillStyle = `rgb(${col.map((v) => Math.min(255, v * k) | 0)})`;
    g.beginPath(); g.ellipse(0, 0, L, W, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = `rgba(20,30,10,0.45)`; g.lineWidth = 0.8; g.beginPath(); g.moveTo(-L, 0); g.lineTo(L, 0); g.stroke();
    g.restore();
  }
  return texOf(c);
}

let TEX = null;
export function treeTextures() {
  if (!TEX) TEX = { barkPine: barkTexture('pine'), barkLeaf: barkTexture('leaf'), needle: needleTexture(), leaf: leafTexture() };
  return TEX;
}

// ---------- hình học ----------
function builder() {
  const pos = [], nor = [], uv = [], idx = [];
  return {
    pos, nor, uv, idx,
    v(p, n, u, w) { pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z); uv.push(u, w); return pos.length / 3 - 1; },
    geo() {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx); g.computeBoundingSphere();
      return g;
    },
  };
}

// Ống thuôn theo đường cong qua các điểm (thân, cành). r0 → r1, `sides` mặt.
function tube(B, pts, r0, r1, sides = 7, uvLen = 2.2) {
  const up = new THREE.Vector3(0, 1, 0), T = new THREE.Vector3(), N = new THREE.Vector3(), Bn = new THREE.Vector3(), P = new THREE.Vector3(), D = new THREE.Vector3();
  let len = 0; const rows = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    T.subVectors(b, a).normalize();
    N.crossVectors(Math.abs(T.y) > 0.95 ? new THREE.Vector3(1, 0, 0) : up, T).normalize(); Bn.crossVectors(T, N);
    if (i) len += pts[i].distanceTo(pts[i - 1]);
    const r = r0 + (r1 - r0) * (i / (pts.length - 1)), row = [];
    for (let s = 0; s <= sides; s++) {
      const a2 = (s / sides) * Math.PI * 2;
      D.copy(N).multiplyScalar(Math.cos(a2)).addScaledVector(Bn, Math.sin(a2));
      row.push(B.v(P.copy(pts[i]).addScaledVector(D, r), D, s / sides, len / uvLen));
    }
    rows.push(row);
  }
  for (let i = 0; i < rows.length - 1; i++) for (let s = 0; s < sides; s++) {
    const a = rows[i][s], b = rows[i][s + 1], c = rows[i + 1][s], d = rows[i + 1][s + 1];
    B.idx.push(a, c, b, b, c, d);
  }
}

// Thẻ lá: quad tâm `c`, kích thước w×h, xoay theo hai trục; pháp tuyến «cầu» quanh tâm tán `ctr`
const Q = new THREE.Quaternion(), E = new THREE.Euler();
function card(B, c, w, h, yaw, tilt, ctr, roll = 0) {
  Q.setFromEuler(E.set(tilt, yaw, roll, 'YXZ'));
  const ax = new THREE.Vector3(w / 2, 0, 0).applyQuaternion(Q), ay = new THREE.Vector3(0, 0, h / 2).applyQuaternion(Q);
  const corners = [[-1, -1, 0, 0], [1, -1, 1, 0], [1, 1, 1, 1], [-1, 1, 0, 1]];
  const base = B.pos.length / 3;
  for (const [sx, sy, u, v] of corners) {
    const p = c.clone().addScaledVector(ax, sx).addScaledVector(ay, sy);
    const n = p.clone().sub(ctr).normalize().add(new THREE.Vector3(0, 0.45, 0)).normalize();
    B.v(p, n, u, v);
  }
  B.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
}

export function makePine(seed) {
  const r = rng(seed), bark = builder(), fol = builder();
  const H = 11 + r() * 3, lean = (r() - 0.5) * 0.25, la = r() * Math.PI * 2;
  const trunk = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8, bend = Math.sin(t * 2.2 + r()) * 0.35;
    trunk.push(new THREE.Vector3(Math.cos(la) * (lean * t * H + bend * t), t * H, Math.sin(la) * (lean * t * H + bend * t)));
  }
  tube(bark, trunk, 0.42 + r() * 0.12, 0.1, 8);
  const at = (t) => { const f = t * 8, i = Math.min(7, Math.floor(f)); return trunk[i].clone().lerp(trunk[i + 1], f - i); };
  const pads = [];
  const nB = 6 + (r() * 3 | 0);
  for (let b = 0; b < nB; b++) {
    const t = 0.38 + (b / nB) * 0.55 + (r() - 0.5) * 0.04, o = at(t), a = b * 2.39996 + r() * 0.6;
    const L = (1 - t) * 6.5 + 1.2 + r() * 1.2, dir = new THREE.Vector3(Math.cos(a), 0.08 + r() * 0.18, Math.sin(a)).normalize();
    const mid = o.clone().addScaledVector(dir, L * 0.55).add(new THREE.Vector3(0, -0.15 * L * 0.2, 0)), end = o.clone().addScaledVector(dir, L);
    tube(bark, [o, mid, end], 0.13 * (1 - t) + 0.05, 0.03, 5);
    pads.push({ c: end.clone().add(new THREE.Vector3(0, 0.25, 0)), R: 1.4 + L * 0.28 }, { c: mid.clone().add(new THREE.Vector3(0, 0.3, 0)), R: 0.9 + L * 0.16 });
  }
  pads.push({ c: at(1).add(new THREE.Vector3(0, 0.2, 0)), R: 1.8 + r() * 0.6 });
  // mỗi tầng tán: đĩa dẹt nhiều thẻ nằm gần ngang (dáng mây) + vài thẻ đứng cho khối khi nhìn ngang
  for (const p of pads) {
    const n = Math.round(6 + p.R * 3);
    for (let k = 0; k < n; k++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * p.R * 0.75;
      const c = p.c.clone().add(new THREE.Vector3(Math.cos(a) * d, (r() - 0.4) * 0.45, Math.sin(a) * d));
      const s = (0.9 + r() * 0.7) * Math.min(2.4, p.R * 0.9);
      card(fol, c, s, s, r() * 6.28, -Math.PI / 2 + (r() - 0.5) * 0.7, p.c.clone().add(new THREE.Vector3(0, -0.6, 0)));
    }
    for (let k = 0; k < 3; k++) card(fol, p.c.clone().add(new THREE.Vector3(0, 0.1, 0)), p.R * 1.5, p.R * 0.75, r() * 6.28, 0, p.c);
  }
  return { bark: bark.geo(), foliage: fol.geo(), height: H + 1.5 };
}

export function makeLeafTree(seed) {
  const r = rng(seed), bark = builder(), fol = builder();
  const H0 = 3 + r() * 1.5;
  const trunk = [new THREE.Vector3(0, 0, 0), new THREE.Vector3((r() - 0.5) * 0.3, H0 * 0.5, (r() - 0.5) * 0.3), new THREE.Vector3((r() - 0.5) * 0.5, H0, (r() - 0.5) * 0.5)];
  tube(bark, trunk, 0.45 + r() * 0.1, 0.3, 8);
  const top = trunk[2], clumps = [];
  const nL = 3 + (r() * 2 | 0);
  for (let i = 0; i < nL; i++) {
    const a = (i / nL) * Math.PI * 2 + r() * 0.8, up = 3 + r() * 3, out = 1.8 + r() * 1.8;
    const end = top.clone().add(new THREE.Vector3(Math.cos(a) * out, up, Math.sin(a) * out));
    const mid = top.clone().lerp(end, 0.5).add(new THREE.Vector3(0, -0.3, 0));
    tube(bark, [top, mid, end], 0.24, 0.08, 6);
    clumps.push({ c: end.clone().add(new THREE.Vector3(0, 0.6, 0)), R: 1.9 + r() * 1.1 });
  }
  clumps.push({ c: top.clone().add(new THREE.Vector3(0, 6 + r() * 1.5, 0)), R: 2.3 + r() * 0.8 });
  for (const p of clumps) {
    const n = Math.round(10 + p.R * 5);
    for (let k = 0; k < n; k++) {
      // điểm trên vỏ cầu (dẹt dưới) → tán tròn đầy, lõi không rỗng
      const u = r() * 2 - 1, th = r() * Math.PI * 2, rr = Math.sqrt(1 - u * u), d = p.R * (0.55 + r() * 0.45);
      const c = p.c.clone().add(new THREE.Vector3(Math.cos(th) * rr * d, u * d * 0.75, Math.sin(th) * rr * d));
      const s = 1.3 + r() * 1.1;
      card(fol, c, s, s, th + Math.PI / 2, (r() - 0.5) * 1.6, p.c, (r() - 0.5) * 1.2);
    }
  }
  const height = clumps.reduce((m, c) => Math.max(m, c.c.y + c.R * 0.8), 0);
  return { bark: bark.geo(), foliage: fol.geo(), height };
}
