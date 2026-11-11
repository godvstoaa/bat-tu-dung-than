// ============================================================================
//  ĐỒ PHỐ HUYỀN THÀNH v5 (docs/THANH-MANIFEST.md §3.3, §3.7–3.10) — thứ làm cho phố có đời sống:
//    · nền lô lát đá + sân trước, tường rào mũ ngói ở khe giữa các nhóm nhà (§3.3)
//    · biển hiệu treo màu theo nghề trước mỗi tiệm, mái hiên + sạp trước ~1/4 tiệm (§3.9)
//    · sân trong mỗi ô: nền đất nện, cây, giếng, đèn đá; sân góc: cây + đèn đá (§3.7)
//    · quảng trường phường: đình, cây đa, cổng phường ở ngõ vào, sạp (§3.8)
//    · hàng cây + đèn lồng đại lộ, đèn lồng vành (§3.9) · tháp mốc + chợ ở 8 quảng trường chợ, sạp đầu cầu (§3.10)
//  Mọi thứ nhân bản, dựng theo Ô 256 m quanh người chơi (citylayout.cell), ô xa thì ẩn → vài chục lệnh vẽ.
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as L from './citylayout.js';
import { renderHouses, isRemoved, inPhuPlot } from './city4.js';
import { heightAt } from './terrain.js';
import { addSolidCircle, addSolidOBB } from './obstacles.js';
import { addLight, glowAll } from './lights.js';
import { placeModel, getModelQuality } from './assets.js';
import { GUA, toWorld } from './batquai.js';

const R_BUILD = 300, R_SHOW = 320, R_NEAR = 150; // ô dựng / hiện quanh người chơi · cây, sạp, biển hiệu chỉ hiện trong 150 m (§3.11)
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const rnd01 = (s) => (hash(s) % 10007) / 10007;
const H = (x, z) => heightAt(x, z);

// màu biển hiệu theo nghề (§3.9)
const TRADE = { moc: '#8a5a2e', gom: '#b86a3a', den: '#c8341f', thuhoa: '#2e4a6a', hoavien: '#c25a8a', phongthuy: '#3a6a4a', huong: '#7a2a2a', tratrang: '#4a7a3a', duoc: '#2a6a5a', loren: '#3a3a3a', tuu: '#a8231e', tralau: '#7a4a1e', dichtram: '#6a4a8a', namon: '#1e1e3a' };
const LEAF = ['#4f7a3a', '#5e8a40', '#3e6a34', '#6a8a3a', '#d98aa6', '#c86a3a', '#4a7a52'];
const PAVE = { noi: '#9a9386', trung: '#958b7c', ngoai: '#8f8a7a' };

// --- khuôn hình dùng chung -----------------------------------------------------------------------------------
const G = (() => {
  const plane = new THREE.PlaneGeometry(1, 1); plane.rotateX(-Math.PI / 2);
  const trunk = new THREE.CylinderGeometry(0.16, 0.26, 1, 6); trunk.translate(0, 0.5, 0);
  const crown = new THREE.DodecahedronGeometry(1, 0); // 36 tam giác / tán (khối 20 mặt chia 1 = 80) — hàng nghìn cây trong tầm
  const wallB = new THREE.BoxGeometry(1, 2.3, 0.4); wallB.translate(0, 1.15, 0);
  const wallC = new THREE.BoxGeometry(1, 0.26, 0.8); wallC.translate(0, 2.4, 0);
  const wellR = new THREE.CylinderGeometry(0.95, 1.05, 0.8, 12); wellR.translate(0, 0.4, 0);
  const wellF = mergeGeometries([(() => { const g = new THREE.BoxGeometry(0.12, 2.2, 0.12); g.translate(-0.9, 1.1, 0); return g; })(), (() => { const g = new THREE.BoxGeometry(0.12, 2.2, 0.12); g.translate(0.9, 1.1, 0); return g; })(), (() => { const g = new THREE.BoxGeometry(2.3, 0.14, 0.14); g.translate(0, 2.15, 0); return g; })(), (() => { const g = new THREE.BoxGeometry(2.6, 0.12, 1.4); g.translate(0, 2.45, 0); return g; })()]);
  const slant = new THREE.BoxGeometry(1, 0.06, 1); slant.rotateX(0.32); slant.translate(0, 2.5, 0.5); // mái hiên vải (rộng 1, vươn 1)
  const postPair = mergeGeometries([(() => { const g = new THREE.BoxGeometry(0.08, 2.4, 0.08); g.translate(-0.45, 1.2, 0.95); return g; })(), (() => { const g = new THREE.BoxGeometry(0.08, 2.4, 0.08); g.translate(0.45, 1.2, 0.95); return g; })(), (() => { const g = new THREE.BoxGeometry(0.9, 0.08, 0.6); g.translate(0, 0.85, 0.6); return g; })()]);
  const goods = new THREE.BoxGeometry(0.8, 0.22, 0.5); goods.translate(0, 1.0, 0.6);
  const sign = new THREE.BoxGeometry(0.08, 1.5, 0.62); sign.translate(0, 0, 0);
  const lamp = mergeGeometries([(() => { const g = new THREE.CylinderGeometry(0.24, 0.32, 0.5, 6); g.translate(0, 0.25, 0); return g; })(), (() => { const g = new THREE.CylinderGeometry(0.11, 0.14, 0.9, 6); g.translate(0, 0.95, 0); return g; })(), (() => { const g = new THREE.BoxGeometry(0.42, 0.36, 0.42); g.translate(0, 1.58, 0); return g; })(), (() => { const g = new THREE.ConeGeometry(0.42, 0.34, 4); g.rotateY(Math.PI / 4); g.translate(0, 1.93, 0); return g; })()]);
  const post = mergeGeometries([(() => { const g = new THREE.CylinderGeometry(0.1, 0.13, 3.6, 6); g.translate(0, 1.8, 0); return g; })(), (() => { const g = new THREE.BoxGeometry(0.9, 0.08, 0.08); g.translate(0.4, 3.45, 0); return g; })()]);
  const lantern = new THREE.SphereGeometry(0.3, 8, 6); lantern.scale(1, 1.25, 1); lantern.translate(0.78, 3.0, 0);
  const shed = new THREE.BoxGeometry(1, 1, 1); shed.translate(0, 0.5, 0);
  const shedRoof = new THREE.ConeGeometry(0.78, 0.5, 4); shedRoof.rotateY(Math.PI / 4); shedRoof.scale(1, 1, 1); shedRoof.translate(0, 1.22, 0);
  // gộp khuôn hai phần thành một (màu theo đỉnh) — bớt lệnh vẽ (THANH-MANIFEST §3.11)
  const paint = (g, hex) => { const c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) a.set([c.r, c.g, c.b], i * 3); g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g; };
  const strip = (g) => { const o = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(o.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'color') o.deleteAttribute(k); return o; };
  const wall = mergeGeometries([paint(strip(wallB.clone()), '#e6e0d2'), paint(strip(wallC.clone()), '#39404a')]);
  const well = mergeGeometries([paint(strip(wellR.clone()), '#8f8a80'), paint(strip(wellF.clone()), '#6a4a30')]);
  const shedAll = mergeGeometries([paint(strip(shed.clone()), '#e2dccd'), paint(strip(shedRoof.clone()), '#3d4048')]);
  return { plane, trunk, crown, wall, well, shedAll, slant, postPair, goods, sign, lamp, post, lantern };
})();
const M = (() => {
  const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.9, ...o });
  const lan = std({ color: '#c8341f', emissive: '#ff6a2a', emissiveIntensity: 0.6, roughness: 0.6 });
  return {
    pave: std({ color: '#ffffff', roughness: 0.95 }), court: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.97 }), vc: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88 }),
    trunk: std({ color: '#5a4030' }), leaf: std({ color: '#ffffff', flatShading: true, roughness: 0.85 }),
    wall: std({ color: '#e6e0d2', roughness: 0.92 }), cap: std({ color: '#39404a', roughness: 0.7 }),
    stone: std({ color: '#8f8a80' }), wood: std({ color: '#6a4a30', roughness: 0.8 }), roofTile: std({ color: '#3d4048', roughness: 0.75 }),
    cloth: std({ color: '#ffffff', roughness: 0.8, side: THREE.DoubleSide }), goods: std({ color: '#ffffff', roughness: 0.85 }), sign: std({ color: '#ffffff', roughness: 0.6 }),
    lantern: lan,
  };
})();
glowAll(new THREE.Mesh(G.lantern, M.lantern), { base: 0.5, night: 2.4, color: '#ff8a3c' });

/** gom thể hiện theo khuôn rồi tạo InstancedMesh (một lệnh vẽ / khuôn / ô) */
function batch() {
  const by = new Map();
  const add = (geo, mat, x, y, z, ry = 0, sx = 1, sy = 1, sz = 1, color = null) => { const k = `${geo.uuid}|${mat.uuid}`; let b = by.get(k); if (!b) by.set(k, (b = { geo, mat, list: [] })); b.list.push([x, y, z, ry, sx, sy, sz, color]); };
  const build = (grp, { shadow = false } = {}) => {
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), P = new THREE.Vector3(), S = new THREE.Vector3(), c = new THREE.Color();
    const near = new THREE.Group(); near.name = 'near'; grp.add(near); grp.userData.near = near; // đồ nhỏ: ẩn khi ô xa hơn R_NEAR
    const SMALL = new Set([G.trunk, G.crown, G.slant, G.postPair, G.goods, G.sign, G.shedAll, G.lamp]);
    for (const { geo, mat, list } of by.values()) {
      const im = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach(([x, y, z, ry, sx, sy, sz, color], i) => { im.setMatrixAt(i, m4.compose(P.set(x, y, z), q.setFromAxisAngle(up, ry), S.set(sx, sy, sz))); if (color) im.setColorAt(i, c.set(color)); });
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
      im.castShadow = shadow && (geo === G.trunk || geo === G.crown); /* chỉ cây đổ bóng — nền / biển / sạp thì không (lượt bóng nhân đôi lệnh vẽ) */ im.receiveShadow = true; im.computeBoundingSphere(); (SMALL.has(geo) ? near : grp).add(im);
    }
  };
  return { add, build };
}

// nhà dựng theo ô (city4.renderHouses có model, chiều cao, khung lô)
let BYCELL = null;
const housesOfCell = (id) => {
  if (!BYCELL) { BYCELL = new Map(); for (const h of renderHouses()) { const c = String(h.key).split(':')[0]; let l = BYCELL.get(c); if (!l) BYCELL.set(c, (l = [])); l.push(h); } }
  return BYCELL.get(id) || [];
};

function tree(B, x, z, seed, big = 1) {
  const y = H(x, z), r = rnd01(seed), s = (0.8 + 0.5 * r) * big, ht = (3.2 + 2.6 * r) * big;
  const leaf = LEAF[hash(seed) % LEAF.length];
  B.add(G.trunk, M.trunk, x, y, z, 0, s, ht * 0.55, s);
  B.add(G.crown, M.leaf, x, y + ht * 0.72, z, r * 6, 1.9 * s, 1.5 * s, 1.9 * s, leaf);
  B.add(G.crown, M.leaf, x + 0.7 * s, y + ht * 0.95, z - 0.4 * s, r * 3, 1.3 * s, 1.1 * s, 1.3 * s, leaf);
  addSolidCircle(x, z, 0.35 * big);
}
const insideQuad = (P, x, z) => { let sgn = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], cr = (b.x - a.x) * (z - a.z) - (b.z - a.z) * (x - a.x); if (Math.abs(cr) < 1e-9) continue; if (!sgn) sgn = Math.sign(cr); else if (Math.sign(cr) !== sgn) return false; } return true; };

/** vườn sau nhà (kiểu sân trong Eixample / vườn nhà ống): luống rau, đất, sân gạch, cây ăn quả, kho nhỏ — chừa bán kính `keep` quanh tâm */
function garden(B, P, ct, cx, cz, low, keep) {
  const xs = P.map((p) => p.x), zs = P.map((p) => p.z), x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
  const ry = Math.atan2(P[1].x - P[0].x, P[1].z - P[0].z), step = low ? 15 : 11;
  let k = 0;
  for (let gx = x0 + step / 2; gx < x1; gx += step) for (let gz = z0 + step / 2; gz < z1; gz += step) {
    const sd = `${ct.block}|${k++}`, jx = gx + (rnd01(sd + 'x') - 0.5) * step * 0.6, jz = gz + (rnd01(sd + 'z') - 0.5) * step * 0.6;
    if (!insideQuad(P, jx, jz) || Math.hypot(jx - cx, jz - cz) < keep) continue;
    const r = rnd01(sd);
    if (r < 0.42) tree(B, jx, jz, sd, ct.villa ? 1.15 : 0.95);
    else if (r < 0.78) B.add(G.plane, M.pave, jx, H(jx, jz) + 0.045, jz, ry, 3.5 + 3 * rnd01(sd + 'w'), 1, 6 + 4 * rnd01(sd + 'd'), ['#5e7a34', '#4e6a2e', '#7a6a3a', '#6a7a3a', '#8a7a52'][hash(sd) % 5]);
    else if (r < 0.88 && !low) { const w = 2.4 + 1.2 * rnd01(sd + 's'); B.add(G.shedAll, M.vc, jx, H(jx, jz), jz, ry, w, 2.2, w * 0.8); addSolidOBB(jx, jz, w / 2, w * 0.4, ry); }
  }
}
/** sạp chợ thủ tục (mái vải + cột + hàng) xếp lưới trong đa giác, tránh các vùng `avoid` [{x,z,r}] (kiểu chợ Biện Kinh) */
function market(B, P, seed, avoid, low) {
  const xs = P.map((p) => p.x), zs = P.map((p) => p.z), x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
  const ry = Math.atan2(P[1].x - P[0].x, P[1].z - P[0].z), cs = Math.cos(ry), sn = Math.sin(ry), sx = low ? 12 : 8, sz = low ? 14 : 9;
  let k = 0;
  for (let a = x0 + 7; a < x1 - 6; a += sx) for (let b = z0 + 7; b < z1 - 6; b += sz) {
    const sd = `${seed}|${k++}`, x = a + (rnd01(sd) - 0.5) * 1.2, z = b + (rnd01(sd + 'b') - 0.5) * 1.2;
    if (!insideQuad(P, x, z) || avoid.some((q) => Math.hypot(x - q.x, z - q.z) < q.r) || rnd01(sd + 'e') < 0.15) continue;
    // khoảng cách tới mép ≥ 6 m
    let edge = Infinity; for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length], vx = q.x - p.x, vz = q.z - p.z, l = vx * vx + vz * vz || 1, t = Math.max(0, Math.min(1, ((x - p.x) * vx + (z - p.z) * vz) / l)); edge = Math.min(edge, Math.hypot(x - p.x - vx * t, z - p.z - vz * t)); }
    if (edge < 6) continue;
    const y = H(x, z), w = 3 + rnd01(sd + 'w'), cloth = ['#c8a050', '#a8432f', '#4a6a8a', '#7a8a4a', '#e6dcc8', '#8a4a6a'][hash(sd) % 6], rr = ry + (hash(sd) & 1 ? 0 : Math.PI);
    B.add(G.slant, M.cloth, x, y, z, rr, w, 1, 2, cloth); B.add(G.postPair, M.wood, x, y, z, rr, w, 1, 2); B.add(G.goods, M.goods, x, y, z, rr, w / 1.1, 1, 1.8, ['#c9a86a', '#8a6a4a', '#d8c9ae', '#6a8a4a', '#b8452c'][hash(sd + 'g') % 5]);
    addSolidOBB(x + sn * 1.2 * (hash(sd) & 1 ? 1 : -1), z + cs * 1.2 * (hash(sd) & 1 ? 1 : -1), w / 2, 0.6, rr);
  }
}
/** một sạp thủ tục: mái vải + cột + hàng hoá */
function stall(B, x, z, ry, sd) {
  const y = H(x, z), w = 3 + rnd01(sd + 'w'), cloth = ['#c8a050', '#a8432f', '#4a6a8a', '#7a8a4a', '#e6dcc8', '#8a4a6a'][hash(sd) % 6];
  B.add(G.slant, M.cloth, x, y, z, ry, w, 1, 2, cloth); B.add(G.postPair, M.wood, x, y, z, ry, w, 1, 2); B.add(G.goods, M.goods, x, y, z, ry, w / 1.1, 1, 1.8, ['#c9a86a', '#8a6a4a', '#d8c9ae', '#6a8a4a', '#b8452c'][hash(sd + 'g') % 5]);
  addSolidOBB(x + Math.sin(ry) * 1.2, z + Math.cos(ry) * 1.2, w / 2, 0.6, ry);
}
/** cây dọc mép đa giác (lùi 3 m vào trong), mỗi ~step m */
function ring(B, P, cx, cz, step, seed, big = 1) {
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], L0 = Math.hypot(b.x - a.x, b.z - a.z), n = Math.max(1, Math.floor(L0 / step));
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n; let x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t; const d = Math.hypot(cx - x, cz - z) || 1; x += ((cx - x) / d) * 3; z += ((cz - z) / d) * 3;
      tree(B, x, z, `${seed}|${i}|${k}`, big);
    }
  }
}
/** dựng đồ phố của một ô 256 m */
function buildCell(id, low) {
  const C = L.cell(id); if (!C) return null;
  const grp = new THREE.Group(); grp.name = `dress:${id}`;
  const B = batch(), models = [], DIST = new Map(C.houses.map((q) => [q.id, q.district]));
  // 1) nền lô lát đá + sân trước (che cỏ dưới nhà / trước cửa) · biển hiệu · mái hiên + sạp
  for (const h of housesOfCell(id)) {
    const nx = Math.sin(h.ry), nz = Math.cos(h.ry), tx = Math.cos(h.ry), tz = -Math.sin(h.ry);
    const ext = (h.setback || 0) + 1.6, y = H(h.x, h.z) + 0.03;
    const dist = String(DIST.get(h.key) || 'noi').split('-')[0];
    const pv = PAVE[dist] || PAVE.ngoai, tone = 0.92 + 0.12 * rnd01(`${h.key}|pv`);
    B.add(G.plane, M.pave, h.x + nx * ext / 2, y, h.z + nz * ext / 2, h.ry, h.f + 0.3, 1, h.d + ext, new THREE.Color(pv).multiplyScalar(tone).getStyle());
    if (h.use === 'shop' || h.use === 'fortune') {
      const col = TRADE[h.type] || (h.use === 'fortune' ? '#5a2a7a' : '#7a2a20'), side = (hash(h.key) & 1) ? 1 : -1;
      const fx = h.x + nx * (h.hd + 0.35) + tx * side * (h.f * 0.5 - 0.6), fz = h.z + nz * (h.hd + 0.35) + tz * side * (h.f * 0.5 - 0.6);
      B.add(G.sign, M.sign, fx, y + 3.1, fz, h.ry + Math.PI / 2, 1, 1, 1, col);
      if (!low && hash(`${h.key}|aw`) % 4 === 0 && h.f >= 5.5) { // mái hiên + sạp lấn ra 1,5 m (§3.9)
        const ax = h.x + nx * h.hd, az = h.z + nz * h.hd, w = Math.min(h.f - 1, 4.2), cloth = ['#c8a050', '#a8432f', '#4a6a8a', '#7a8a4a', '#e6dcc8'][hash(h.key) % 5];
        B.add(G.slant, M.cloth, ax, y, az, h.ry, w, 1, 1.5, cloth);
        B.add(G.postPair, M.wood, ax, y, az, h.ry, w / 1, 1, 1.5);
        B.add(G.goods, M.goods, ax, y, az, h.ry, w / 1.1, 1, 1.4, ['#c9a86a', '#8a6a4a', '#d8c9ae', '#6a8a4a'][hash(`${h.key}g`) % 4]);
      }
    }
  }
  // 2) tường rào mũ ngói ở khe giữa các nhóm nhà (§3.3) — chạy song song phố, lùi 3 m
  for (const g of C.gaps) {
    if (inPhuPlot(g.x, g.z)) continue;
    const ry = Math.atan2(g.nx, g.nz), y = H(g.x, g.z);
    B.add(G.wall, M.vc, g.x, y, g.z, ry, g.w + 0.5, 1, 1);
    addSolidOBB(g.x, g.z, g.w / 2 + 0.2, 0.3, ry);
    if (!low && hash(`${g.x},${g.z}`) % 3 === 0) tree(B, g.x - g.nx * 2.2, g.z - g.nz * 2.2, `gap${g.x},${g.z}`, 0.8); // cây sau tường
  }
  // 3) sân góc: cây + đèn đá
  for (const s of C.gardens) { if (inPhuPlot(s.x, s.z)) continue; tree(B, s.x, s.z, `gd${s.x},${s.z}`, 1.1); const lx = s.x + s.nx * 3, lz = s.z + s.nz * 3; B.add(G.lamp, M.stone, lx, H(lx, lz), lz, 0); }
  // 4) sân trong: nền đất nện (vườn: cỏ đậm + ao), cây, giếng, đèn đá · quảng trường phường: đình, cây đa, cổng, sạp
  const pos = [], col = [], cc = new THREE.Color();
  for (const ct of C.courts) {
    if (ct.poly.some((p) => inPhuPlot(p.x, p.z))) continue;
    const P = ct.poly, base = pos.length / 3, tone = ct.villa ? '#56703c' : '#6e7448';
    for (const p of P) { pos.push(p.x, H(p.x, p.z) + 0.025, p.z); cc.set(tone).multiplyScalar(0.94 + 0.1 * rnd01(`${p.x}|${p.z}`)); col.push(cc.r, cc.g, cc.b); }
    const idx = pos.idx ||= [];
    const cr = (P[1].x - P[0].x) * (P[2].z - P[0].z) - (P[1].z - P[0].z) * (P[2].x - P[0].x);
    if (cr < 0) idx.push(base, base + 1, base + 2, base, base + 2, base + 3); else idx.push(base, base + 2, base + 1, base, base + 3, base + 2);
    const cx = P.reduce((a, p) => a + p.x, 0) / 4, cz = P.reduce((a, p) => a + p.z, 0) / 4;
    if (ct.square) {
      // quảng trường phường (§3.8): đình giữa, cây đa, giếng, cổng phường ở ngõ vào, sạp
      const ward = L.wards().find((w) => w.id === ct.ward), face = ct.passes[0] ? Math.atan2(ct.passes[0].nx, ct.passes[0].nz) : 0;
      models.push(['dinh', hash(ct.ward) & 1 ? 'lib_wood_pavilion' : 'bq_music_pav', { width: 14 }, cx, cz, face]);
      addSolidCircle(cx, cz, 6);
      // sân lát 30 × 30 m quanh đình (Alexander: quảng trường nhỏ, không phải bãi trống) + vòng cây quanh sân lát
      const SQ = 15, c1 = Math.cos(face), s1 = Math.sin(face), sq = [[-SQ, -SQ], [SQ, -SQ], [SQ, SQ], [-SQ, SQ]].map(([a, b]) => ({ x: cx + a * c1 + b * s1, z: cz - a * s1 + b * c1 }));
      B.add(G.plane, M.pave, cx, H(cx, cz) + 0.05, cz, face, 2 * SQ, 1, 2 * SQ, '#a39a88');
      ring(B, sq, cx, cz, 9, `sq${ct.block}`, 1.05);
      garden(B, P, ct, cx, cz, low, 22);
      tree(B, cx + 14 * Math.cos(face + 1.2), cz + 14 * Math.sin(face + 1.2), `banyan${ct.ward}`, 2.3);
      const wx = cx + 12 * Math.cos(face - 1.9), wz = cz + 12 * Math.sin(face - 1.9);
      B.add(G.well, M.vc, wx, H(wx, wz), wz); addSolidCircle(wx, wz, 1.1);
      for (const ps of ct.passes) { const gx = ps.x - ps.nx * (L.CITY.COURT_INSET + 1), gz = ps.z - ps.nz * (L.CITY.COURT_INSET + 1); models.push(['paifang', 'lib_paifang', { width: 8 }, gx, gz, Math.atan2(ps.nx, ps.nz)]); }
      if (!low) for (let k = 0; k < 4; k++) { const a = face + Math.PI * (0.55 + k * 0.3), sx = cx + 10 * Math.cos(a), sz = cz + 10 * Math.sin(a); stall(B, sx, sz, a + Math.PI / 2, `ws${ct.block}${k}`); } // sạp thủ tục (model thư viện 9k tam giác / sạp là quá nặng)
      grp.userData.ward = ward?.name;
    } else {
      garden(B, P, ct, cx, cz, low, 4);
      if (hash(ct.block) % 3 === 0) { B.add(G.well, M.vc, cx, H(cx, cz), cz, rnd01(ct.block) * 3); addSolidCircle(cx, cz, 1.1); }
      else { B.add(G.lamp, M.stone, cx, H(cx, cz), cz); addSolidCircle(cx, cz, 0.4); }
    }
  }
  if (pos.length) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.setIndex(pos.idx); geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, M.court); m.receiveShadow = true; grp.add(m);
  }
  // 5) đại lộ: hàng cây hai bên mỗi ~14 m, đèn lồng mỗi ~28 m · vành: đèn lồng mỗi ~32 m (§3.9)
  for (const r of C.roads) {
    if (r.bridge || (r.kind !== 'avenue' && r.kind !== 'ring')) continue;
    const Lr = Math.hypot(r.b.x - r.a.x, r.b.z - r.a.z), tx = (r.b.x - r.a.x) / Lr, tz = (r.b.z - r.a.z) / Lr, nx = -tz, nz = tx;
    const step = r.kind === 'avenue' ? 14 : 32, off = r.w / 2 - 1.2;
    for (let s = step / 2; s < Lr; s += step) {
      const px = r.a.x + tx * s, pz = r.a.z + tz * s;
      if (px < C.x0 || px >= C.x1 || pz < C.z0 || pz >= C.z1) continue;
      const k = Math.round(s / step);
      for (const sv of [-1, 1]) {
        const x = px + nx * off * sv, z = pz + nz * off * sv;
        if (nearCross(C, x, z, r)) continue;
        if (inPhuPlot(x, z)) continue;
        if (r.kind === 'avenue' && !low) tree(B, x, z, `${r.id}|${k}|${sv}`, 0.95);
        if ((r.kind === 'avenue' && k % 2 === 0) || r.kind === 'ring') {
          const lx = x - tx * 3, lz = z - tz * 3, ry = Math.atan2(-nx * sv, -nz * sv) - Math.PI / 2;
          B.add(G.post, M.wood, lx, H(lx, lz), lz, ry); B.add(G.lantern, M.lantern, lx, H(lx, lz), lz, ry); addSolidCircle(lx, lz, 0.3);
          if (k % 4 === 0) addLight(lx, H(lx, lz) + 3, lz, { color: '#ffa04a', power: 1 });
        }
      }
    }
  }
  // 6a) mọi quảng trường (chợ, sảnh, trung tâm): lát đá + hàng cây quanh mép
  const pq = [], pc = [], pi = [];
  for (const p of L.plazas()) for (const P of p.polys) {
    const cx = P.reduce((a, q) => a + q.x, 0) / P.length, cz = P.reduce((a, q) => a + q.z, 0) / P.length;
    if (!(cx >= C.x0 && cx < C.x1 && cz >= C.z0 && cz < C.z1)) continue;
    const b0 = pq.length / 3;
    for (const q of P) { pq.push(q.x, H(q.x, q.z) + 0.03, q.z); cc.set('#a49c8c').multiplyScalar(0.95 + 0.08 * rnd01(`${q.x}${q.z}`)); pc.push(cc.r, cc.g, cc.b); }
    const cr = (P[1].x - P[0].x) * (P[2].z - P[0].z) - (P[1].z - P[0].z) * (P[2].x - P[0].x);
    if (cr < 0) pi.push(b0, b0 + 1, b0 + 2, b0, b0 + 2, b0 + 3); else pi.push(b0, b0 + 2, b0 + 1, b0, b0 + 3, b0 + 2);
    if (!low) ring(B, P, cx, cz, 13, `pl${p.id}${cx}`, 1.05);
    const avoid = [{ x: p.centre.x, z: p.centre.z, r: p.id.startsWith('plaza-trung') ? 26 : 14 }, ...L.landmarks().filter((m) => m.plaza === p.id).map((m) => ({ x: m.x, z: m.z, r: 34 })), ...L.stations().filter((st) => Math.hypot(st.x - cx, st.z - cz) < 120).map((st) => ({ x: st.x, z: st.z, r: 12 }))];
    if (p.id.startsWith('plaza-trung')) { const P0 = p.polys[0]; avoid.push({ x: P0.reduce((a, q) => a + q.x, 0) / 4, z: P0.reduce((a, q) => a + q.z, 0) / 4, r: 24 }); }
    market(B, P, `mk${p.id}${Math.round(cx)}`, avoid, low);
  }
  if (pq.length) { const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pq, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(pc, 3)); geo.setIndex(pi); geo.computeVertexNormals(); const m = new THREE.Mesh(geo, M.court); m.receiveShadow = true; grp.add(m); }
  // 6) quảng trường chợ Trung Thành: tháp mốc + vòng sạp (§3.10) · đầu cầu: sạp hai bên (kiểu Biện Kinh)
  for (const p of L.plazas()) {
    if (!p.id.startsWith('plaza-trung') || !(p.centre.x >= C.x0 && p.centre.x < C.x1 && p.centre.z >= C.z0 && p.centre.z < C.z1)) continue;
    const P0 = p.polys[0], c0 = { x: P0.reduce((a, q) => a + q.x, 0) / 4, z: P0.reduce((a, q) => a + q.z, 0) / 4 };
    models.push(['thap', hash(p.id) & 1 ? 'bq_pagoda' : 'lib_pagoda_red', { height: 30 }, c0.x, c0.z, 0]); addSolidCircle(c0.x, c0.z, 9);

  }
  for (const b of C.bridges) for (const end of [-1, 1]) {
    const t = end * (b.L + 6), x0 = b.x + b.ax * t, z0 = b.z + b.az * t;
    if (!(x0 >= C.x0 && x0 < C.x1 && z0 >= C.z0 && z0 < C.z1)) continue;
    for (const sv of [-1, 1]) for (let k = 0; k < (b.kind === 'road' ? 3 : 2); k++) {
      const along = end * k * 6, off = sv * (b.W / 2 + 3.5), x = x0 + b.ax * along - b.az * off, z = z0 + b.az * along + b.ax * off;
      stall(B, x, z, Math.atan2(-b.az * sv, b.ax * sv), `br${b.id}${end}${sv}${k}`);
    }
  }
  B.build(grp, { shadow: !low });
  // model thư viện (LOD tự nạp — xa: bản .vc, gần: bản gốc)
  for (const [, id, fit, x, z, ry] of models) placeModel(grp, id, { fit, at: { x, y: H(x, z), z, ry } }).catch(() => null);
  return grp;
}
function nearCross(C, x, z, self) { // bỏ cây / đèn trên lòng đường cắt ngang (giao lộ)
  for (const r of C.roads) {
    if (r === self || r.bridge) continue;
    const vx = r.b.x - r.a.x, vz = r.b.z - r.a.z, l = vx * vx + vz * vz || 1, t = Math.max(0, Math.min(1, ((x - r.a.x) * vx + (z - r.a.z) * vz) / l));
    if (Math.hypot(x - r.a.x - vx * t, z - r.a.z - vz * t) < r.w / 2 + 2) return true;
  }
  return false;
}

/**
 * Lớp đồ phố: { update(px, pz) } — dựng dần (1 ô / lần gọi) các ô trong R_BUILD quanh người chơi, ẩn ô ngoài R_SHOW.
 */
export function cityDress(parent) {
  const root = new THREE.Group(); root.name = 'citydress'; parent.add(root);
  const built = new Map(); let lx = Infinity, lz = Infinity, queue = [];
  const low = () => getModelQuality() === 'low';
  // ô hiện trong R_SHOW; đồ nhỏ (cây, sạp, biển hiệu) chỉ trong R_NEAR (khoảng cách từ người chơi tới hộp ô)
  const vis = (id, g, px, pz) => { if (!g) return; const [i, j] = id.split('_').map(Number), cx = -4096 + (i + 0.5) * 256, cz = -4096 + (j + 0.5) * 256, d = Math.max(Math.abs(cx - px), Math.abs(cz - pz)) - 128; g.visible = d < R_SHOW; if (g.userData.near) g.userData.near.visible = d < R_NEAR; };
  const make = (id, px, pz) => { const g = buildCell(id, low()); built.set(id, g); if (g) { root.add(g); vis(id, g, px, pz); } };
  function update(px, pz) {
    if (Math.hypot(px - lx, pz - lz) > 24) {
      lx = px; lz = pz;
      queue = L.cellsInRange(px, pz, R_BUILD).filter((id) => !built.has(id))
        .sort((a, b) => { const c = (id) => { const [i, j] = id.split('_').map(Number); return Math.hypot(-4096 + (i + 0.5) * 256 - px, -4096 + (j + 0.5) * 256 - pz); }; return c(a) - c(b); });
      for (const [id, g] of built) vis(id, g, px, pz);
    }
    // dựng trong ngân sách ~18 ms mỗi lần gọi (landmarks gọi 0,4–1,5 s / lần)
    const t0 = performance.now();
    while (queue.length && performance.now() - t0 < 18) make(queue.shift(), px, pz);
  }
  return { update, root, settle: (px, pz, n = 12) => { lx = Infinity; update(px, pz); for (let k = 0; k < n && queue.length; k++) make(queue.shift(), px, pz); } };
}
export const _test = { buildCell };
