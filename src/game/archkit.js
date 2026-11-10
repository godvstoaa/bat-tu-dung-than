// ============================================================================
//  BỘ KIẾN TRÚC THỦ TỤC (three.js) — dựng biệt phủ đúng tỉ lệ người 1,9 m bằng hình khối nhẹ, không model
//  Meshy 300k: nền đá có bậc, hàng cột sơn son, vách cửa bức bàn (song gỗ), xà vẽ màu, mái cong ngói ống
//  đầu đao (models.roof), tường bao trát vôi có ngói nóc, ảnh bích, cầu đá, hồ có bờ đá, non bộ, cây.
//  Mọi hàm trả THREE.Group toạ độ cục bộ; mansion3d.js gộp theo vật liệu (models.mergeStatic).
// ============================================================================
import * as THREE from 'three';
import { lotusLife, waterSurface } from './lotus.js';
import * as MD from './models.js';
import * as TX from './textures.js';
import { stoneMaterial } from './ground-tex.js';

let K = null;
const std = (o) => new THREE.MeshStandardMaterial(o);
function canvas(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t;
}
/** vật liệu dùng chung của bộ kiến trúc */
export function kit() {
  if (K) return K;
  const m = MD.materials();
  // song cửa bức bàn: khung gỗ son + ô song giấy dán
  const lattice = canvas(128, 256, (g, w, h) => {
    g.fillStyle = '#7a2a1c'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#e8dcc0'; g.fillRect(10, 12, w - 20, h * 0.58);
    g.strokeStyle = '#6a2418'; g.lineWidth = 4;
    for (let x = 10; x <= w - 10; x += 18) { g.beginPath(); g.moveTo(x, 12); g.lineTo(x, 12 + h * 0.58); g.stroke(); }
    for (let y = 12; y <= 12 + h * 0.58; y += 18) { g.beginPath(); g.moveTo(10, y); g.lineTo(w - 10, y); g.stroke(); }
    g.fillStyle = '#5a1c12'; g.fillRect(10, h * 0.66, w - 20, h * 0.28);
    g.strokeStyle = '#c99a3a'; g.lineWidth = 2; g.strokeRect(18, h * 0.69, w - 36, h * 0.22);
  });
  // xà vẽ màu (thải họa): lam – lục – vàng
  const beam = canvas(256, 32, (g, w, h) => {
    const cols = ['#24506e', '#2f6b4a', '#24506e', '#2f6b4a'];
    cols.forEach((c, i) => { g.fillStyle = c; g.fillRect((i * w) / 4, 0, w / 4, h); });
    g.fillStyle = '#d9a441'; for (let i = 0; i <= 4; i++) g.fillRect((i * w) / 4 - 3, 0, 6, h);
    g.fillStyle = '#e8e2d2'; for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse((i + 0.5) * w / 4, h / 2, 14, 8, 0, 0, Math.PI * 2); g.fill(); }
  });
  const plaster = canvas(128, 128, (g, w, h) => {
    g.fillStyle = '#e6dfcf'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(120,100,70,${Math.random() * 0.06})`; g.fillRect(Math.random() * w, Math.random() * h, 3, 3); }
  });
  const planks = canvas(128, 128, (g, w, h) => { g.fillStyle = '#6a4630'; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { g.fillStyle = `rgba(0,0,0,${0.08 + (i % 3) * 0.04})`; g.fillRect(0, i * 16, w, 2); } });
  const roofGreen = m.roof.clone(); roofGreen.color = new THREE.Color('#7fae78');
  K = {
    ...m,
    lattice: std({ map: lattice, roughness: 0.7 }),
    beam: std({ map: beam, roughness: 0.55 }),
    plaster: std({ map: plaster, roughness: 0.95 }),
    redWall: std({ color: '#9a3324', roughness: 0.9 }),
    floor: std({ map: planks, roughness: 0.8 }),
    pave: stoneMaterial({ seed: 61, rows: 8, repeat: [1, 1], base: '#8e877c', roughness: 0.92 }),
    tileCap: std({ color: '#3a3f46', roughness: 0.75 }),
    roofGreen,
    water: std({ color: '#355d66', roughness: 0.08, metalness: 0.25, transparent: true, opacity: 0.88 }),
    rockG: std({ map: TX.rockTex(), color: '#9a958c', roughness: 0.95, flatShading: true }),
    willow: std({ color: '#6f9a4a', roughness: 0.85, flatShading: true }),
    doorRed: std({ color: '#8e1f16', roughness: 0.5 }),
    nail: std({ color: '#d9a441', roughness: 0.3, metalness: 0.8 }),
  };
  return K;
}

const box = (w, h, d, mat, x, y, z, ry = 0) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); o.position.set(x, y, z); o.rotation.y = ry; o.castShadow = true; o.receiveShadow = true; return o; };
const cyl = (r1, r2, h, mat, x, y, z, seg = 10) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; return o; };
/** đặt UV hộp theo mét (vật liệu lặp) */
function uvMeters(geo, scale = 1) {
  const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i));
    const u = ax > 0.5 ? p.getZ(i) : p.getX(i), v = ay > 0.5 ? p.getZ(i) : p.getY(i);
    uv.setXY(i, u / scale, v / scale);
  }
  uv.needsUpdate = true; return geo;
}
const boxM = (w, h, d, mat, x, y, z, ry = 0, sc = 2) => { const o = box(w, h, d, mat, x, y, z, ry); uvMeters(o.geometry, sc); return o; };

/** Nền đá + bậc (trước / sau). Trả Group. */
export function plinth({ w, d, h, back = false, stairW = 4 }) {
  const k = kit(), g = new THREE.Group(), W = w + 2.4, D = d + 2.4;
  g.add(boxM(W, h, D, k.pave, 0, h / 2, 0, 0, 3));
  g.add(box(W + 0.2, 0.16, D + 0.2, k.stoneDark, 0, h - 0.08, 0));
  const n = Math.max(1, Math.round(h / 0.22));
  for (const sz of back ? [1, -1] : [1]) for (let i = 0; i < n; i++) {
    const sh = h * (i + 1) / n, sd = 0.34;
    g.add(boxM(stairW, sh, sd, k.pave, 0, sh / 2, sz * (D / 2 + (n - i - 0.5) * sd), 0, 2));
  }
  return g;
}

/**
 * Gian nhà kiểu cung điện. Cửa trước (+z) giữa, cửa sau nếu back. storeys 2: thêm mái hiên giữa + lan can.
 * Trả { base, shell } (base: nền + sàn — gộp chung cả phủ; shell: vách, cột, xà, mái — mờ khi người chơi vào trong).
 */
export function hall({ w, d, h, plinth: ph = 0.8, back = false, storeys = 1, roof = 'grey', open = false, doorW = 2.4, stage = false, octa = false }) {
  const k = kit(), base = plinth({ w, d, h: ph, back: back && !open, stairW: Math.min(6, w * 0.3) }), shell = new THREE.Group();
  // nền cao ≥ 1 m: lan can đá trắng quanh mép nền (chừa lối bậc) — kiểu bạch ngọc lan can cung điện
  if (ph >= 1) {
    const W2 = w + 2.4, D2 = d + 2.4, sw = Math.min(6, w * 0.3) / 2 + 0.3, marble = k.white;
    const railSeg = (x0, z0, x1, z1) => { const L = Math.hypot(x1 - x0, z1 - z0); if (L < 0.3) return; const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, ry = Math.atan2(-(z1 - z0), x1 - x0); base.add(box(L, 0.12, 0.18, marble, cx, ph + 0.9, cz, ry)); base.add(box(L, 0.1, 0.22, marble, cx, ph + 0.12, cz, ry)); const n = Math.max(1, Math.round(L / 1.6)); for (let i = 0; i <= n; i++) { const t = i / n; base.add(box(0.2, 1.05, 0.2, marble, x0 + (x1 - x0) * t, ph + 0.52, z0 + (z1 - z0) * t)); } };
    const hx = W2 / 2 - 0.15, hz = D2 / 2 - 0.15;
    railSeg(-hx, hz, -sw, hz); railSeg(sw, hz, hx, hz);
    if (back && !open) { railSeg(-hx, -hz, -sw, -hz); railSeg(sw, -hz, hx, -hz); } else railSeg(-hx, -hz, hx, -hz);
    railSeg(-hx, -hz, -hx, hz); railSeg(hx, -hz, hx, hz);
  }
  const y0 = ph, hw = w / 2, hd = d / 2;
  base.add(boxM(w - 0.1, 0.04, d - 0.1, open && !stage ? k.pave : k.floor, 0, y0 + 0.02, 0, 0, 2));
  // cột: hành lang hiên quanh vách (lùi ra 0,7 m)
  const bays = Math.max(2, Math.round(w / 3.8)), bayW = (w + 1.4) / bays, colH = storeys > 1 ? h * 0.5 : h;
  const cols = [];
  for (let i = 0; i <= bays; i++) for (const sz of [1, -1]) cols.push([-hw - 0.7 + i * bayW, sz * (hd + 0.7)]);
  const sb = Math.max(1, Math.round(d / 3.8));
  for (let j = 1; j < sb; j++) for (const sx of [1, -1]) cols.push([sx * (hw + 0.7), -hd - 0.7 + j * (d + 1.4) / sb]);
  if (octa) { cols.length = 0; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + Math.PI / 8; cols.push([Math.cos(a) * hw, Math.sin(a) * hd]); } }
  for (const [x, z] of cols) { shell.add(cyl(0.34, 0.38, 0.22, k.stone, x, y0 + 0.11, z, 8)); shell.add(cyl(0.2, 0.22, colH, k.son, x, y0 + colH / 2, z, 10)); }
  // vách
  const wallT = 0.24, dh = Math.min(3.1, h - 0.6);
  if (!open) {
    const front = (sz, door) => {
      const side = door ? (w - doorW) / 2 : w;
      if (door) for (const sx of [-1, 1]) shell.add(boxM(side, h, wallT, k.lattice, sx * (doorW / 2 + side / 2), y0 + h / 2, sz * hd, 0, Math.min(2.2, h)));
      else shell.add(boxM(w, h, wallT, k.lattice, 0, y0 + h / 2, sz * hd, 0, Math.min(2.2, h)));
      if (door) { shell.add(boxM(doorW, h - dh, wallT, k.lattice, 0, y0 + dh + (h - dh) / 2, sz * hd, 0, 2)); shell.add(box(doorW + 0.3, 0.22, wallT + 0.1, k.son, 0, y0 + dh, sz * hd)); }
      shell.add(box(w, 0.7, wallT + 0.06, k.redWall, 0, y0 + 0.35, sz * hd)); // chân vách
    };
    front(1, true); front(-1, back);
    for (const sx of [1, -1]) { shell.add(boxM(wallT, h, d, k.plaster, sx * hw, y0 + h / 2, 0, 0, 2)); shell.add(box(wallT + 0.06, 0.9, d, k.redWall, sx * hw, y0 + 0.45, 0)); }
  } else if (stage) shell.add(boxM(w, h, wallT, k.lattice, 0, y0 + h / 2, -hd, 0, 2)); // hý lâu: phông hậu đài
  // xà vẽ màu quanh đầu cột + hàng đấu củng (khối đỡ mái) + đèn lồng treo hai góc hiên trước
  const yb = y0 + colH - 0.3;
  for (const sz of [1, -1]) for (let x = -hw - 0.6; x <= hw + 0.6; x += 0.95) { shell.add(box(0.42, 0.32, 0.5, k.beam, x, yb + 0.42, sz * (hd + 0.7))); shell.add(box(0.6, 0.12, 0.62, k.gold, x, yb + 0.64, sz * (hd + 0.7))); }
  for (const sx of [-1, 1]) { const lan = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), k.lanternRed); lan.scale.y = 1.35; lan.position.set(sx * (hw - 0.4), yb - 1.1, hd + 1.4); shell.add(lan); shell.add(cyl(0.03, 0.03, 0.9, k.ink, sx * (hw - 0.4), yb - 0.4, hd + 1.4, 4)); }
  for (const sz of [1, -1]) shell.add(boxM(w + 1.8, 0.5, 0.3, k.beam, 0, yb, sz * (hd + 0.7), 0, 4));
  for (const sx of [1, -1]) shell.add(boxM(0.3, 0.5, d + 1.8, k.beam, sx * (hw + 0.7), yb, 0, 0, 4));
  // tầng hai: mái hiên giữa + lan can + vách tầng trên lùi vào
  if (storeys > 1) {
    const ym = y0 + colH + 0.1;
    const eave = MD.roof(w + 3.4, d + 3.4, 1.2, { upturn: 0.5, mats: { ...k, roof: roof === 'green' ? k.roofGreen : k.roof } });
    eave.position.y = ym - 0.6; eave.scale.y = 0.8; shell.add(eave);
    shell.add(box(w + 1.6, 0.9, 0.12, k.son, 0, ym + 0.9, hd + 0.7)); shell.add(box(w + 1.6, 0.9, 0.12, k.son, 0, ym + 0.9, -hd - 0.7));
    for (let i = 0; i <= bays; i++) for (const sz of [1, -1]) shell.add(cyl(0.18, 0.2, h - colH, k.son, -hw - 0.7 + i * bayW, ym + (h - colH) / 2, sz * (hd + 0.7), 8));
    shell.add(boxM(w + 1.4, 0.4, d + 1.4, k.beam, 0, y0 + h - 0.2, 0, 0, 4));
  }
  // mái chính: lớn hơn thân 3 m mỗi chiều, cao theo chiều sâu
  const rH = Math.max(1.8, Math.min(5.2, (d + 3) * 0.27)), R = MD.roof(w + 3.4, d + 3.4, rH, { upturn: 0.62, mats: { ...k, roof: roof === 'green' ? k.roofGreen : k.roof } });
  R.position.y = y0 + h; shell.add(R);
  return { base, shell, roofTop: y0 + h + rH };
}

/** Nhà cổng phủ (3 gian, lối giữa mở, cửa son đinh vàng hai bên) */
export function gateHouse({ w, d, h, plinth: ph = 0.9, roof = 'grey', main = false }) {
  const k = kit(), { base, shell } = hall({ w, d, h, plinth: ph, open: true, roof });
  const side = (w - 4) / 2;
  for (const sx of [-1, 1]) {
    shell.add(boxM(side, h, 0.3, main ? k.redWall : k.plaster, sx * (2 + side / 2), ph + h / 2, 0, 0, 2));
  }
  // cửa son đinh vàng (mở hé sát hai bên lối)
  for (const sx of [-1, 1]) {
    const door = box(1.9, Math.min(3.6, h - 0.6), 0.14, k.doorRed, sx * 2.9, ph + Math.min(3.6, h - 0.6) / 2, 0.8, sx * 0.55);
    shell.add(door);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { const n = new THREE.Mesh(new THREE.SphereGeometry(0.05, 5, 4), k.nail); n.position.set(-0.7 + c * 0.47, -1.3 + r * 0.6, 0.09); door.add(n); }
  }
  // biển phủ trên lối giữa (để trống — mansion3d.js gắn biển tên)
  return { base, shell };
}

/** Tường bao trát vôi + ngói nóc + chân đá. list: [{ x, z, len, ry, h, t, screen? }] */
export function walls(list) {
  const k = kit(), g = new THREE.Group();
  for (const w of list) {
    const body = boxM(w.len, w.h, w.t, w.screen ? k.redWall : k.plaster, w.x, w.h / 2, w.z, w.ry, 2.5); g.add(body);
    g.add(box(w.len + 0.1, 0.5, w.t + 0.5, k.tileCap, w.x, w.h + 0.1, w.z, w.ry));
    g.add(box(w.len + 0.06, 0.6, w.t + 0.08, k.stoneDark, w.x, 0.3, w.z, w.ry));
    if (w.screen) { const f = box(w.len * 0.6, w.h * 0.45, 0.06, k.lattice, w.x, w.h * 0.55, w.z + w.t / 2 + 0.03, w.ry); g.add(f); }
  }
  return g;
}

/** Hồ elip có bờ đá + sen; cầu đá vòm qua hồ */
export function pond({ x, z, rx, rz }, bridge) {
  const k = kit(), g = new THREE.Group();
  const shape = new THREE.Shape(); shape.absellipse(0, 0, rx, rz, 0, Math.PI * 2);
  const wgeo = new THREE.ShapeGeometry(shape, 48); wgeo.rotateX(-Math.PI / 2);
  const water = waterSurface(rx * 2, rz * 2, { ellipse: true }); water.position.set(x, 0.12, z); g.add(water);
  const bed = new THREE.Mesh(wgeo.clone(), k.stoneDark); bed.position.set(x, 0.04, z); g.add(bed);
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2, s = 0.6 + ((i * 37) % 7) / 10;
    const r = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), k.rockG);
    r.position.set(x + Math.cos(a) * (rx + 0.4), s * 0.35, z + Math.sin(a) * (rz + 0.4)); r.scale.y = 0.55; r.rotation.y = i; r.castShadow = true; g.add(r);
  }
  lotusLife(g, { x0: x - rx, x1: x + rx, z0: z - rz, z1: z + rz, y: 0.12, ellipse: true, seed: Math.round(x * 3 + z * 7 + rx * 11) }); // sen + cá (lotus.js)
  if (bridge) { // cầu vòm: 14 đoạn bậc theo cung tròn + lan can
    const L = Math.abs(bridge.z0 - bridge.z1), n = 14, H = 1.6;
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n, tm = (t0 + t1) / 2, y = Math.sin(tm * Math.PI) * H;
      const zz = bridge.z0 + (bridge.z1 - bridge.z0) * tm;
      const seg = boxM(bridge.w, 0.35, L / n + 0.05, k.pave, bridge.x, y + 0.2, zz, 0, 2);
      seg.rotation.x = Math.cos(tm * Math.PI) * Math.atan2(H * Math.PI, L) * (bridge.z1 > bridge.z0 ? -1 : 1); g.add(seg);
      for (const sx of [-1, 1]) g.add(box(0.15, 0.7, L / n, k.stone, bridge.x + sx * (bridge.w / 2 - 0.05), y + 0.7, zz));
    }
  }
  return g;
}

/** Non bộ: cụm đá chồng, hang xuyên dọc trục x */
export function rockery({ x, z, w, d, tunnel }) {
  const k = kit(), g = new THREE.Group();
  let s = 7;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (const sz of [1, -1]) {
    const cz = z + sz * (tunnel / 2 + (d / 2 - tunnel / 2) / 2), hd = (d / 2 - tunnel / 2) / 2;
    for (let i = 0; i < 16; i++) {
      const sc = 1 + r() * 2.2, o = new THREE.Mesh(new THREE.DodecahedronGeometry(sc, 0), k.rockG);
      o.position.set(x + (r() - 0.5) * w * 0.9, sc * 0.6 + r() * 2.2, cz + (r() - 0.5) * hd * 1.6);
      o.scale.set(1, 0.8 + r() * 0.9, 1); o.rotation.set(r(), r() * 6, r()); o.castShadow = true; o.receiveShadow = true; g.add(o);
    }
  }
  // đá vòm trên miệng hang
  for (let i = 0; i < 5; i++) { const o = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5, 0), k.rockG); o.position.set(x - w * 0.3 + i * w * 0.15, 3.4 + (i % 2) * 0.5, z); o.scale.set(1.3, 0.6, 1.1); o.castShadow = true; g.add(o); }
  return g;
}

/** Cây thủ tục nhẹ: willow (liễu rủ) · pine · peach (đào / hải đường) · bamboo (khóm trúc) */
export function tree(kind, seed = 1) {
  const k = kit(), g = new THREE.Group();
  let s = seed * 9301 + 49297;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  if (kind === 'bamboo') {
    for (let i = 0; i < 9; i++) { const h = 5 + r() * 3, o = cyl(0.06, 0.07, h, k.bamboo, (r() - 0.5) * 2, h / 2, (r() - 0.5) * 2, 6); o.rotation.z = (r() - 0.5) * 0.12; g.add(o); }
    for (let i = 0; i < 7; i++) { const o = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 0), k.leaf); o.position.set((r() - 0.5) * 2.4, 4 + r() * 3, (r() - 0.5) * 2.4); o.scale.set(1, 1.5, 1); o.castShadow = true; g.add(o); }
    return g;
  }
  const H = kind === 'pine' ? 7 : kind === 'willow' ? 6 : 4.5;
  const tr = cyl(0.18, 0.3, H * 0.55, k.bark, 0, H * 0.27, 0, 7); tr.rotation.z = (r() - 0.5) * 0.15; g.add(tr);
  const mat = kind === 'pine' ? k.pine : kind === 'willow' ? k.willow : k.blossom;
  if (kind === 'pine') for (let i = 0; i < 4; i++) { const o = new THREE.Mesh(new THREE.ConeGeometry(2.4 - i * 0.45, 1.8, 7), mat); o.position.set((r() - 0.5) * 0.6, H * 0.5 + i * 1.1, (r() - 0.5) * 0.6); o.castShadow = true; g.add(o); }
  else if (kind === 'willow') for (let i = 0; i < 6; i++) { const o = new THREE.Mesh(new THREE.ConeGeometry(1.3, 3.6, 7, 1, true), mat); const a = i * 1.05; o.position.set(Math.cos(a) * 1.3, H * 0.62, Math.sin(a) * 1.3); o.rotation.x = Math.PI; o.castShadow = true; g.add(o); }
  else for (let i = 0; i < 6; i++) { const o = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2 + r() * 0.5, 0), mat); o.position.set((r() - 0.5) * 2.4, H * 0.62 + r() * 1.4, (r() - 0.5) * 2.4); o.castShadow = true; g.add(o); }
  return g;
}

/** Đèn đá (thạch đăng) */
export function stoneLantern() {
  const k = kit(), g = new THREE.Group();
  g.add(box(0.7, 0.3, 0.7, k.stone, 0, 0.15, 0), cyl(0.15, 0.18, 0.9, k.stone, 0, 0.75, 0, 8), box(0.65, 0.5, 0.65, k.stone, 0, 1.45, 0));
  const lamp = box(0.4, 0.3, 0.4, k.lanternRed, 0, 1.45, 0); lamp.scale.set(1.05, 1, 1.05); g.add(lamp);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.62, 0.45, 4), k.stone); cap.position.y = 1.95; cap.rotation.y = Math.PI / 4; cap.castShadow = true; g.add(cap);
  return g;
}

/** Bản xa (16 phủ gộp một mesh): tường bao + khối gian + mái 4 dốc, màu đỉnh — vài trăm tam giác mỗi phủ */
export function farProxyGeometry(list) {
  const geos = [], col = new THREE.Color();
  let est = 0; // chỉ số khuôn viên (aEst) — mansion3d ẩn riêng bản xa của khuôn viên đã dựng chi tiết
  const push = (geo, c, M) => { const g2 = geo.index ? geo.toNonIndexed() : geo; g2.applyMatrix4(M); g2.deleteAttribute('uv'); const n = g2.attributes.position.count, a = new Float32Array(n * 3); col.set(c); for (let i = 0; i < n; i++) a.set([col.r, col.g, col.b], i * 3); g2.setAttribute('color', new THREE.BufferAttribute(a, 3)); g2.setAttribute('aEst', new THREE.BufferAttribute(new Float32Array(n).fill(est), 1)); geos.push(g2); };
  const T = (x, y, z, ry, sx = 1, sy = 1, sz = 1) => new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), ry), new THREE.Vector3(sx, sy, sz));
  for (const it of list) {
    est = list.indexOf(it);
    const P = T(it.x, 0, it.z, it.ry);
    for (const w of it.walls) push(new THREE.BoxGeometry(w.len, w.h, w.t), it.fenceCol || '#ddd5c4', P.clone().multiply(T(w.x, w.h / 2, w.z, w.ry)));
    for (const h of it.halls) {
      const L = P.clone().multiply(T(h.x, 0, h.z, h.ry));
      push(new THREE.BoxGeometry(h.w + 2.4, h.plinth || 0.6, h.d + 2.4), '#8a8378', L.clone().multiply(T(0, (h.plinth || 0.6) / 2, 0, 0)));
      push(new THREE.BoxGeometry(h.w, h.h, h.d), it.body || '#8e2a1f', L.clone().multiply(T(0, (h.plinth || 0.6) + h.h / 2, 0, 0)));
      const rH = Math.max(1.8, Math.min(5.2, (h.d + 3) * 0.27)), roof = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4, 1); roof.rotateY(Math.PI / 4);
      push(roof, it.roofCol || (it.green ? '#5f8a5a' : '#3d434b'), L.clone().multiply(T(0, (h.plinth || 0.6) + h.h + rH / 2, 0, 0, h.w + 3.4, rH, h.d + 3.4)));
    }
  }
  return geos;
}
