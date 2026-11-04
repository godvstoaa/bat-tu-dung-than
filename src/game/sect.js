// ============================================================================
//  HUYỀN QUÁN SƠN MÔN — dựng 3D khu quán khởi đầu theo court.js.
//  Sân lát đá 120 × 132 m · tường son mái ngói · Sơn Môn + Hậu Môn (gate_sect) · đường thần đạo ·
//  Đại Đỉnh · hồ sen đôi · nền đá hai tầng có lan can và bậc ngự đạo · Chính Đường (palace_grand) ·
//  điện phụ Đông/Tây (hall_main) · lầu chuông / lầu trống · bảo tháp bốn góc · cờ ngũ hành · đèn đá.
//  Mọi model Meshy vào lưới va chạm theo hình khối (collide.js) — không đi xuyên.
// ============================================================================
import * as THREE from 'three';
import * as MD from './models.js';
import * as TX from './textures.js';
import { placeModel, instanceModel } from './assets.js';
import { addFootprint } from './collide.js';
import { addLight, addGlow } from './lights.js';
import { COURT, TERRACES, STAIRS, PONDS, MAIN_HALL } from './court.js';

const mk = (geo, mat, x, y, z, g, { ry = 0, rx = 0, shadow = true } = {}) => {
  const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.rotation.set(rx, ry, 0);
  o.castShadow = shadow; o.receiveShadow = true; g.add(o); return o;
};
const box = (w, h, d, mat, x, y, z, g, o) => mk(new THREE.BoxGeometry(w, h, d), mat, x, y, z, g, o);

function mats() {
  const W = COURT.x1 - COURT.x0, D = COURT.z1 - COURT.z0;
  return {
    pave: new THREE.MeshStandardMaterial({ map: TX.stoneTex({ seed: 29, tiles: 4, repeat: [W / 6.4, D / 6.4], base: '#8f877a' }), roughness: 0.92 }),
    path: new THREE.MeshStandardMaterial({ map: TX.stoneTex({ seed: 31, tiles: 2, repeat: [2, 14], base: '#a39a8a' }), roughness: 0.88 }),
    terrace: new THREE.MeshStandardMaterial({ map: TX.stoneTex({ seed: 44, tiles: 3, repeat: [10, 1], base: '#958e82' }), roughness: 0.88 }),
    top: new THREE.MeshStandardMaterial({ map: TX.stoneTex({ seed: 45, tiles: 4, repeat: [12, 10], base: '#8c8478' }), roughness: 0.92 }),
    marble: new THREE.MeshStandardMaterial({ color: '#cbc3b2', roughness: 0.7 }),
    plaster: new THREE.MeshStandardMaterial({ map: TX.lacquerTex('#9b2a1f', { seed: 21, gold: 0.05, repeat: [24, 1], streak: 0.05 }), roughness: 0.8 }),
    base: new THREE.MeshStandardMaterial({ color: '#4d4740', roughness: 0.95 }),
    gold: new THREE.MeshStandardMaterial({ color: '#d4a63c', roughness: 0.32, metalness: 0.85 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2b2622', roughness: 0.9 }),
    lampGlow: new THREE.MeshStandardMaterial({ color: '#ffd9a0', emissive: '#ffb050', emissiveIntensity: 1, roughness: 0.6 }),
  };
}

// lan can đá: trụ mỗi 2 m + tay vịn (x0,z0)→(x1,z1), ở độ cao y; bỏ đoạn giao với các khoảng hở
function balustrade(g, m, x0, z0, x1, z1, y, gaps = []) {
  const len = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(len / 2));
  const ry = -Math.atan2(z1 - z0, x1 - x0);
  const inGap = (x, z) => gaps.some(([a, b, c, d]) => x >= a && x <= c && z >= b && z <= d);
  for (let k = 0; k < n; k++) {
    const t0 = k / n, t1 = (k + 1) / n;
    const ax = x0 + (x1 - x0) * t0, az = z0 + (z1 - z0) * t0, bx = x0 + (x1 - x0) * t1, bz = z0 + (z1 - z0) * t1;
    if (inGap(ax, az) || inGap(bx, bz)) continue;
    box(0.32, 1.1, 0.32, m.marble, ax, y + 0.55, az, g);
    box(0.4, 0.12, 0.4, m.gold, ax, y + 1.16, az, g, { shadow: false });
    box(len / n, 0.14, 0.2, m.marble, (ax + bx) / 2, y + 0.92, (az + bz) / 2, g, { ry });
    box(len / n, 0.1, 0.16, m.marble, (ax + bx) / 2, y + 0.3, (az + bz) / 2, g, { ry, shadow: false });
  }
}

// đèn đá (thạch đăng): đế, thân, hộp đèn sáng, mái nhỏ — đăng ký đèn điểm
function stoneLantern(g, m, x, z, y = 0, s = 1) {
  const L = new THREE.Group(); L.position.set(x, y, z); L.scale.setScalar(s); g.add(L);
  box(0.9, 0.3, 0.9, m.base, 0, 0.15, 0, L);
  box(0.36, 1.3, 0.36, m.marble, 0, 0.95, 0, L);
  box(0.8, 0.14, 0.8, m.marble, 0, 1.66, 0, L);
  box(0.56, 0.56, 0.56, m.lampGlow, 0, 2.0, 0, L, { shadow: false });
  for (const [dx, dz] of [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]]) box(0.08, 0.6, 0.08, m.dark, dx, 2.0, dz, L);
  mk(new THREE.ConeGeometry(0.72, 0.5, 4), m.dark, 0, 2.55, 0, L, { ry: Math.PI / 4 });
  mk(new THREE.SphereGeometry(0.1, 8, 6), m.gold, 0, 2.85, 0, L);
  addLight(x, y + 2.0 * s, z, { color: '#ffb35c', power: 1.1 });
  addFootprint(L, { base: y });
}

// cờ phướn ngũ hành trên cột cao
const WX_FLAG = ['#2f8f4a', '#c6301f', '#d29a2a', '#e8e2cf', '#2c5fb0'];
function flag(g0, m, x, z, y, i) {
  const g = new THREE.Group(); g0.add(g);
  box(0.24, 10, 0.24, m.dark, x, y + 5, z, g);
  mk(new THREE.SphereGeometry(0.22, 10, 8), m.gold, x, y + 10.1, z, g);
  box(1.6, 0.12, 0.12, m.gold, x + 0.75, y + 9.6, z, g);
  const cloth = new THREE.MeshStandardMaterial({ color: WX_FLAG[i % 5], roughness: 0.85, side: THREE.DoubleSide });
  const b = mk(new THREE.PlaneGeometry(1.4, 5.2, 1, 6), cloth, x + 0.8, y + 6.9, z, g, { ry: Math.PI / 2 });
  const p = b.geometry.attributes.position;
  for (let k = 0; k < p.count; k++) p.setZ(k, Math.sin((p.getY(k) + 2.6) * 0.9) * 0.18);
  b.geometry.computeVertexNormals();
  addFootprint(g, { base: y, hi: 1.6 });
}

async function solid(res, opts) {
  if (res?.obj) addFootprint(res.obj, opts);
  return res;
}
let bigHook = null; // render3d: công trình lớn che camera thì làm mờ

/**
 * Dựng sơn môn. Trả { root, pickables[] } — mặt sân + nền đá cho raycast chọn điểm đi.
 * Model Meshy nạp bất đồng bộ (không chặn khung hình đầu).
 */
export function buildSect(scene, { ripple, onBig = null }) {
  const root = new THREE.Group(); root.name = 'sect'; scene.add(root);
  const m = mats();
  const W = COURT.x1 - COURT.x0, D = COURT.z1 - COURT.z0;
  const pick = [];
  // khối thủ công tĩnh: dựng vào deco rồi gộp theo vật liệu (ít draw call); mặt chọn điểm để riêng
  const deco = new THREE.Group(); deco.name = 'sect-deco'; root.add(deco);
  bigHook = onBig;

  // --- sân lát đá + thần đạo + vòng Đại Đỉnh
  const pave = mk(new THREE.PlaneGeometry(W + 2, D + 2), m.pave, 0, 0, 0, root, { rx: -Math.PI / 2, shadow: false }); pick.push(pave);
  pick.push(mk(new THREE.PlaneGeometry(8, COURT.z1 - 13), m.path, 0, 0.015, (COURT.z1 + 13) / 2, root, { rx: -Math.PI / 2, shadow: false }));
  pick.push(mk(new THREE.PlaneGeometry(76, 5), m.path, 0, 0.012, 30, root, { rx: -Math.PI / 2, shadow: false }));
  pick.push(mk(new THREE.CircleGeometry(8, 48), m.path, 0, 0.02, 27.5, root, { rx: -Math.PI / 2, shadow: false }));
  mk(new THREE.TorusGeometry(8, 0.12, 6, 64), m.gold, 0, 0.03, 27.5, deco, { rx: Math.PI / 2, shadow: false });
  mk(new THREE.TorusGeometry(6.6, 0.08, 6, 64), m.gold, 0, 0.03, 27.5, deco, { rx: Math.PI / 2, shadow: false });

  // --- tường bao: chân đá, thân son, gờ vàng, mái ngói
  const T = COURT.wall, H = COURT.wallH;
  const wall = (x0, z0, x1, z1) => {
    const len = Math.hypot(x1 - x0, z1 - z0); if (len < 0.5) return;
    const x = (x0 + x1) / 2, z = (z0 + z1) / 2, ry = -Math.atan2(z1 - z0, x1 - x0);
    box(len, 1.2, T + 0.3, m.base, x, 0.6, z, deco, { ry });
    box(len, H - 1.2, T, m.plaster, x, 1.2 + (H - 1.2) / 2, z, deco, { ry });
    box(len, 0.2, T + 0.1, m.gold, x, H - 0.4, z, deco, { ry, shadow: false });
    const r = MD.roof(len + 0.8, T + 2.2, 0.9, { upturn: 0.12 }); r.position.set(x, H, z); r.rotation.y = ry; deco.add(r);
    // trụ gạch mỗi 10 m
    const n = Math.floor(len / 10);
    for (let k = 1; k < n; k++) { const t = k / n; box(1.0, H - 0.6, T + 0.5, m.base, x0 + (x1 - x0) * t, (H - 0.6) / 2, z0 + (z1 - z0) * t, deco, { ry }); }
  };
  const xo = COURT.x0 - T / 2, xe = COURT.x1 + T / 2, zn = COURT.z0 - T / 2, zs = COURT.z1 + T / 2;
  wall(xo, zn, xo, zs); wall(xe, zn, xe, zs);
  wall(xo, zs, -COURT.gateS - 6, zs); wall(COURT.gateS + 6, zs, xe, zs);
  wall(xo, zn, -COURT.gateN - 4, zn); wall(COURT.gateN + 4, zn, xe, zn);

  // --- nền đá hai tầng
  for (const t of TERRACES) {
    const w = t.x1 - t.x0, d = t.z1 - t.z0, cx = (t.x0 + t.x1) / 2, cz = (t.z0 + t.z1) / 2;
    box(w, t.top, d, m.terrace, cx, t.top / 2, cz, deco);
    pick.push(mk(new THREE.PlaneGeometry(w - 0.2, d - 0.2), m.top, cx, t.top + 0.005, cz, root, { rx: -Math.PI / 2, shadow: false }));
    box(w + 0.5, 0.35, d + 0.5, m.marble, cx, t.top - 0.12, cz, deco);
    box(w + 0.7, 0.4, d + 0.7, m.base, cx, 0.2, cz, deco);
    const gaps = STAIRS.map((s) => [s.x0 - 0.1, Math.min(s.zLow, s.zHigh) - 1, s.x1 + 0.1, Math.max(s.zLow, s.zHigh) + 1]);
    balustrade(deco, m, t.x0 + 0.25, t.z1 - 0.25, t.x1 - 0.25, t.z1 - 0.25, t.top, gaps);
    balustrade(deco, m, t.x0 + 0.25, t.z0 + 0.25, t.x1 - 0.25, t.z0 + 0.25, t.top, gaps);
    balustrade(deco, m, t.x0 + 0.25, t.z0 + 0.25, t.x0 + 0.25, t.z1 - 0.25, t.top, gaps);
    balustrade(deco, m, t.x1 - 0.25, t.z0 + 0.25, t.x1 - 0.25, t.z1 - 0.25, t.top, gaps);
  }
  // --- bậc + má bậc + ngự đạo chạm rồng (dải đá dốc giữa bậc chính)
  for (const [si, s] of STAIRS.entries()) {
    const n = Math.round((s.y1 - s.y0) / 0.4), dir = Math.sign(s.zHigh - s.zLow), depth = Math.abs(s.zHigh - s.zLow) / n, w = s.x1 - s.x0;
    for (let k = 0; k < n; k++) {
      const top = s.y0 + (k + 1) * 0.4, z = s.zLow + dir * (k + 0.5) * depth;
      box(w, top, depth, m.terrace, (s.x0 + s.x1) / 2, top / 2, z, deco);
      box(w, 0.04, 0.12, m.gold, (s.x0 + s.x1) / 2, top, z - dir * depth / 2, deco, { shadow: false });
      for (const x of [s.x0 - 0.3, s.x1 + 0.3]) box(0.6, top + 0.9, depth, m.marble, x, (top + 0.9) / 2, z, deco);
    }
    if (si === 0) {
      const len = Math.hypot(s.zLow - s.zHigh, s.y1 - s.y0), ang = Math.atan2(s.y1 - s.y0, Math.abs(s.zLow - s.zHigh));
      const carv = new THREE.MeshStandardMaterial({ map: TX.lacquerTex('#9d8f78', { seed: 61, gold: 0.9, repeat: [1, 3], streak: 0.3 }), roughness: 0.5, metalness: 0.2 });
      mk(new THREE.BoxGeometry(3.2, 0.2, len), carv, 0, (s.y0 + s.y1) / 2 + 0.25, (s.zLow + s.zHigh) / 2, deco, { rx: ang });
    }
  }

  // --- đèn đá dọc thần đạo + quanh nền
  for (let z = 18; z <= 62; z += 8) for (const sx of [-1, 1]) stoneLantern(deco, m, sx * 5.6, z);
  for (const sx of [-1, 1]) { stoneLantern(deco, m, sx * 10.5, 10.5, 0, 1.3); stoneLantern(deco, m, sx * 9.5, -2.5, 2, 1.1); stoneLantern(deco, m, sx * 30, 4, 2); }
  // --- cờ ngũ hành trên mép trước tầng 1
  [-30, -24, -18, -12, 12, 18, 24, 30].forEach((x, i) => flag(deco, m, x, 6.6, 2, i));

  // --- hồ sen Tây (hồ Đông là gian «sen», dựng trong render3d)
  const pw = PONDS[1]; const westPond = MD.pond(ripple, undefined, { cz: 0, W: pw.W, D: pw.D }); westPond.position.set(pw.cx, 0, pw.cz); deco.add(westPond);
  for (const p of PONDS) {
    const x0 = p.cx - p.W / 2 - 0.4, x1 = p.cx + p.W / 2 + 0.4, z0 = p.cz - p.D / 2 - 0.4, z1 = p.cz + p.D / 2 + 0.4;
    balustrade(deco, m, x0, z1, x1, z1, 0.32, p.id === 'sen' ? [[p.cx - 9, z1 - 1, p.cx - 3, z1 + 1]] : []);
    balustrade(deco, m, x0, z0, x1, z0, 0.32); balustrade(deco, m, x0, z0, x0, z1, 0.32); balustrade(deco, m, x1, z0, x1, z1, 0.32);
  }

  addGlow(m.lampGlow, { base: 0.4, night: 2.6, color: '#ffb050' });
  MD.mergeStatic(deco);

  // --- model Meshy (bất đồng bộ) — tất cả vào lưới va chạm theo hình khối
  (async () => {
    // Sơn Môn + Hậu Môn: khoét lối giữa vòm cổng
    const big = (r) => { if (r?.obj && bigHook) bigHook(r.obj); return r; };
    big(await solid(await placeModel(root, 'gate_sect', { fit: { width: 30 }, at: { x: 0, y: 0, z: COURT.z1 + 1.2, ry: 0 } }), { keep: (x) => Math.abs(x) > 3.4 }));
    big(await solid(await placeModel(root, 'gate_sect', { fit: { width: 20 }, at: { x: 0, y: 0, z: COURT.z0 - 1.2, ry: Math.PI } }), { keep: (x) => Math.abs(x) > 2.3 }));
    // Chính Đường trên tầng 2 — lùi lại nếu mặt tiền lấn tới bệ thầy
    const hall = await placeModel(root, 'palace_grand', { fit: { width: MAIN_HALL.w }, at: { x: MAIN_HALL.x, y: 4, z: MAIN_HALL.z, ry: 0 } });
    if (hall) {
      const b = new THREE.Box3().setFromObject(hall.obj);
      if (b.max.z > -16) { hall.obj.position.z -= b.max.z + 16; hall.obj.updateMatrixWorld(true); }
      addFootprint(hall.obj, { base: 4 });
      big(hall);
    }
    // Đại Đỉnh giữa sân
    await solid(await placeModel(root, 'cauldron', { fit: { height: 5.5 }, at: { x: 0, y: 0, z: 27.5, ry: 0 } }));
    // điện phụ Đông / Tây, lầu chuông / lầu trống (quay vào trục)
    for (const sx of [-1, 1]) {
      big(await solid(await placeModel(root, 'hall_main', { fit: { width: 22 }, at: { x: sx * 47, y: 0, z: -36, ry: -sx * Math.PI / 2 } })));
      big(await solid(await placeModel(root, 'lib_pavilion2', { hd: false, fit: { width: 12 }, at: { x: sx * 47, y: 0, z: -9, ry: -sx * Math.PI / 2 } })));
    }
    // bảo tháp bốn góc
    for (const sx of [-1, 1]) {
      await solid(await placeModel(root, 'lib_pagoda5', { hd: false, fit: { height: 26 }, at: { x: sx * 53, y: 0, z: -58, ry: 0 } }));
      await solid(await placeModel(root, 'lib_pagoda_red', { hd: false, fit: { height: 20 }, at: { x: sx * 53, y: 0, z: 58, ry: 0 } }));
    }
    // cây: tùng dọc tường Đông/Tây, đào nở quanh hai cánh
    const pines = [];
    for (let z = -48; z <= 48; z += 12) for (const sx of [-1, 1]) if (z < -50 || z > -22) pines.push({ x: sx * 57, y: 0, z, ry: z * 0.37, s: 11 });
    for (const x of [-44, -30, 30, 44]) pines.push({ x, y: 0, z: -61, ry: x, s: 10 });
    const pg = await instanceModel(root, 'tree_pine', pines); if (pg) addFootprint(pg, { hi: 1.3, ground: () => 0 });
    const bl = await instanceModel(root, 'tree_peach', [[-52, 30], [52, 30], [-24, 14], [24, 14], [-52, 46], [52, 46]].map(([x, z], i) => ({ x, y: 0, z, ry: i * 1.3, s: 7 })));
    if (bl) addFootprint(bl, { hi: 1.3, ground: () => 0 });
  })().catch((e) => console.warn('[sect]', e));

  return { root, pickables: pick };
}
