// ============================================================================
//  THỦY ĐẠO BÁT MÔN 3D (canals.js · bridges.js): hộ thành hà bát giác 25,5 m ôm tường Nội Thành + kênh 22 m giữa
//  đại lộ Khảm (Hưu Môn — nạp thủy) và Tốn (Đỗ Môn — thủy khẩu, xuyên thủy môn ra kênh dẫn xuống sông Huyền Hà).
//  2026-11-10 làm lại cho thuyền lớn: bờ kè đá cao tới đáy −4,3 có bậc bến, cầu đá lưng gù một vòm (tĩnh không 5,5 m,
//  chân cầu gọn trong lòng nước, mặt cầu đi lên được theo dốc), Thủy Các thành thủy tạ trên 4 góc bờ ngoài hào —
//  KHÔNG còn công trình nào giữa dòng. Thuyền hoa / thuyền thuê: boats3d.js.
// ============================================================================
import * as THREE from 'three';
import * as MD from './models.js';
import * as AK from './archkit.js';
import { GUA, TAN8 } from './batquai.js';
import { OUTER_A } from './cityblocks.js';
import { MOAT, AVE_CANAL, OUTLET, CANAL_BED, CANAL_WATER, EXT_PATHS } from './canals.js';
import { cityBridges, deckTop, bridgePlatforms } from './bridges.js';
import { addPlatform } from './obstacles.js';
import { addLight } from './lights.js';
import { waterMaterial } from './water3d.js';
import * as T from './terrain.js';
import * as LAYOUT from './citylayout.js';

const W = (g, u, v) => ({ x: g.dir[0] * u - g.dir[1] * v, z: g.dir[1] * u + g.dir[0] * v });
const axisRy = (g) => Math.atan2(-g.dir[1], g.dir[0]); // x cục bộ dọc trục u
const QUAY = 0.35;

/** cầu gác (b.open): bản mặt cầu dày b.thick theo profile, đỡ trên hàng cột đá (b.cols: toạ độ t) — gầm thông thuyền */
function openBridge(b, mats, bed) {
  const g = new THREE.Group(), n = 64, sh = new THREE.Shape();
  sh.moveTo(-b.L, deckTop(b, -b.L));
  for (let i = 1; i <= n; i++) { const t = -b.L + (2 * b.L * i) / n; sh.lineTo(t, deckTop(b, t)); }
  for (let i = n; i >= 0; i--) { const t = -b.L + (2 * b.L * i) / n; sh.lineTo(t, Math.max(bed, deckTop(b, t) - b.thick - (deckTop(b, t) < b.H - 0.5 ? 0.6 : 0))); }
  const geo = new THREE.ExtrudeGeometry(sh, { depth: b.W, bevelEnabled: false, curveSegments: 4 }); geo.translate(0, 0, -b.W / 2);
  const deck = new THREE.Mesh(geo, mats.stone); deck.castShadow = deck.receiveShadow = true; g.add(deck);
  // dầm đá dưới mép bản + cột tròn hai bên
  for (const t of b.cols || []) for (const sz of [-1, 1]) {
    const top = deckTop(b, t) - b.thick, h = top - bed, c = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, h, 10), mats.coping);
    c.position.set(t, bed + h / 2, sz * (b.W / 2 - 0.7)); c.castShadow = true; g.add(c);
  }
  g.add(bridgeRails(b, mats, n));
  g.position.set(b.x, 0, b.z); g.rotation.y = Math.atan2(-b.az, b.ax);
  return g;
}
/** thân cầu đá: mặt cắt dọc (theo profile mặt cầu) đùn theo bề rộng, khoét vòm cuốn bán nguyệt cho thuyền qua */
export function bridgeBody(b, mats, bed = CANAL_BED) {
  if (b.open) return openBridge(b, mats, bed);
  const g = new THREE.Group();
  const n = 48, sh = new THREE.Shape();
  sh.moveTo(-b.L, bed);
  for (let i = 0; i <= n; i++) { const t = -b.L + (2 * b.L * i) / n; sh.lineTo(t, deckTop(b, t)); }
  sh.lineTo(b.L, bed); sh.lineTo(-b.L, bed);
  if (b.arch) {
    const c = b.archT || 0, R = b.arch, Rw = b.archW || R, hole = new THREE.Path();
    hole.moveTo(c - Rw, bed + 0.05); hole.lineTo(c - Rw, b.water);
    for (let i = 0; i <= 28; i++) { const a = Math.PI - (Math.PI * i) / 28; hole.lineTo(c + Math.cos(a) * Rw, b.water + Math.sin(a) * R); }
    hole.lineTo(c + Rw, bed + 0.05); hole.lineTo(c - Rw, bed + 0.05);
    sh.holes.push(hole);
  }
  const geo = new THREE.ExtrudeGeometry(sh, { depth: b.W, bevelEnabled: false, curveSegments: 6 });
  geo.translate(0, 0, -b.W / 2);
  const body = new THREE.Mesh(geo, mats.stone); body.castShadow = body.receiveShadow = true; g.add(body);
  g.add(bridgeRails(b, mats, n));
  g.position.set(b.x, 0, b.z);
  g.rotation.y = Math.atan2(-b.az, b.ax); // x cục bộ = hướng băng qua nước
  return g;
}
/** lan can hai bên theo dốc mặt cầu + trụ lan can (toạ độ cục bộ của cầu) */
export function bridgeRails(b, mats, n = 48) {
  const rail = [];
  for (const sz of [-1, 1]) for (let i = 0; i < n; i++) {
    const t0 = -b.L + (2 * b.L * i) / n, t1 = -b.L + (2 * b.L * (i + 1)) / n, y0 = deckTop(b, t0), y1 = deckTop(b, t1);
    const len = Math.hypot(t1 - t0, y1 - y0), q = new THREE.BoxGeometry(len, 0.75, 0.26);
    q.rotateZ(Math.atan2(y1 - y0, t1 - t0)); q.translate((t0 + t1) / 2, (y0 + y1) / 2 + 0.38, sz * (b.W / 2 - 0.13)); rail.push(q);
    if (i % 4 === 0) { const p = new THREE.BoxGeometry(0.34, 1.05, 0.34); p.translate(t0, y0 + 0.5, sz * (b.W / 2 - 0.13)); rail.push(p); }
  }
  const rm = new THREE.Mesh(mergeList(rail), mats.coping); rm.castShadow = true;
  return rm;
}
/**
 * Cầu lớn nhiều nhịp (bridges.riverBridges): tường cầu đá từ mặt cầu xuống đáy sông theo mặt đất, khoét vòm cao
 * giữa các trụ (chân vòm đứng tới đáy → nước thông, thuyền qua), lan can, cột đèn, đình giữa cầu.
 * ground(t) = cao độ đất dưới cầu tại toạ độ t.
 */
export function riverBridgeBody(b, mats, ground) {
  const g = new THREE.Group(), sh = new THREE.Shape(), n = 120;
  const under = (t) => deckTop(b, t) - b.thick;
  sh.moveTo(-b.L, deckTop(b, -b.L));
  for (let i = 1; i <= n; i++) { const t = -b.L + (2 * b.L * i) / n; sh.lineTo(t, deckTop(b, t)); }
  // đáy: từ đầu Nam về đầu Bắc — bám đất, khoét vòm giữa các «gối» (mố hai đầu + trụ)
  const sup = [{ a: b.L, c: b.L }, ...b.piers.map((p) => ({ a: p.t + p.hd, c: p.t - p.hd })).sort((x, y) => y.a - x.a), { a: -b.L, c: -b.L }];
  const gnd = (t) => Math.min(ground(t), under(t) - 0.5);
  sh.lineTo(b.L, gnd(b.L));
  for (let i = 0; i + 1 < sup.length; i++) {
    const right = sup[i].c, left = sup[i + 1].a; // khoảng hở từ right (lớn) về left (nhỏ)
    sh.lineTo(right, gnd(right));
    const r = (right - left) / 2, mid = (right + left) / 2;
    let low = Infinity; for (let k = 0; k <= 10; k++) low = Math.min(low, under(left + ((right - left) * k) / 10));
    const spring = low - 0.9 - r;
    if (r > 3 && spring > Math.max(gnd(right), gnd(left)) + 1) {
      sh.lineTo(right, spring);
      for (let k = 1; k <= 20; k++) { const a = (Math.PI * k) / 20; sh.lineTo(mid + Math.cos(a) * r, spring + Math.sin(a) * r); }
      sh.lineTo(left, gnd(left));
    } else {
      for (let k = 1; k <= 12; k++) { const t = right - ((right - left) * k) / 12; sh.lineTo(t, gnd(t)); }
    }
    if (i + 1 < sup.length - 1) sh.lineTo(sup[i + 1].c, gnd(sup[i + 1].c)); // chân trụ
  }
  sh.lineTo(-b.L, deckTop(b, -b.L));
  const geo = new THREE.ExtrudeGeometry(sh, { depth: b.W, bevelEnabled: false, curveSegments: 4 });
  geo.translate(0, 0, -b.W / 2);
  const body = new THREE.Mesh(geo, mats.stone); body.castShadow = body.receiveShadow = true; g.add(body);
  // đế trụ hình thoi rẽ nước (mũi nhọn hai phía dòng chảy)
  for (const p of b.piers) {
    const y0 = ground(p.t) - 0.5, y1 = b.water + 1.2, cut = new THREE.CylinderGeometry(p.hd * 1.5, p.hd * 1.7, y1 - y0, 4);
    const m = new THREE.Mesh(cut, mats.coping); m.position.set(p.t, (y0 + y1) / 2, 0); m.scale.set(1, 1, (b.W / 2 + 2.5) / (p.hd * 1.5)); m.rotation.y = Math.PI / 4; m.castShadow = true; g.add(m);
  }
  g.add(bridgeRails(b, mats, n));
  g.position.set(b.x, 0, b.z);
  g.rotation.y = Math.atan2(-b.az, b.ax);
  return g;
}
function mergeList(list) {
  // gộp đơn giản (không cần BufferGeometryUtils ở đây): nối thuộc tính vị trí / pháp tuyến
  let nPos = 0, nIdx = 0; for (const q of list) { nPos += q.attributes.position.count; nIdx += q.index ? q.index.count : q.attributes.position.count; }
  const pos = new Float32Array(nPos * 3), nor = new Float32Array(nPos * 3), idx = new Uint32Array(nIdx); let o = 0, oi = 0;
  for (const q of list) {
    pos.set(q.attributes.position.array, o * 3); nor.set(q.attributes.normal.array, o * 3);
    const I = q.index ? q.index.array : Array.from({ length: q.attributes.position.count }, (_, i) => i);
    for (let i = 0; i < I.length; i++) idx[oi + i] = I[i] + o;
    o += q.attributes.position.count; oi += I.length; q.dispose();
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setIndex(new THREE.BufferAttribute(idx, 1));
  return g;
}

export function createRiver(scene) {
  // v4 (thành ×10): hào / kênh Bát Môn cũ đã bỏ. Sông Huyền Hà + Nam Khê chảy xuyên phía Nam thành giữa BỜ KÈ ĐÁ ĐỨNG
  // (mặt phố y 0 → mặt nước −6); mặt nước là mặt nước thế giới (world3d), ở đây dựng tường kè + mũ kè + bậc bến mỗi ~150 m.
  const grp = new THREE.Group(); grp.name = 'river'; scene.add(grp);
  const k = AK.kit(), stone = k.pave, coping = k.stone;
  const walls = new THREE.Group(); grp.add(walls);
  const TOP = 0.35, BED = -7.5;
  for (const ch of LAYOUT.water().channels) {
    const P = ch.pts;
    for (const side of [-1, 1]) {
      let lastStep = -1e9;
      for (let i = 0; i + 6 < P.length; i += 6) {
        const a = P[i], b = P[i + 6];
        const off = (p) => ({ x: p.x - p.tz * side * (p.w + 0.4), z: p.z + p.tx * side * (p.w + 0.4) });
        const A = off(a), B = off(b), mx = (A.x + B.x) / 2, mz = (A.z + B.z) / 2;
        if (T.cityOctDist(mx, mz) > -4) continue; // chỉ trong thành (ngoài thành bờ tự nhiên)
        if (Math.hypot(mx - LAYOUT.water().lake.x, mz - LAYOUT.water().lake.z) < LAYOUT.water().lake.r + 20) continue;
        const len = Math.hypot(B.x - A.x, B.z - A.z) + 0.6, ry = Math.atan2(-(B.z - A.z), B.x - A.x);
        const w = new THREE.Mesh(new THREE.BoxGeometry(len, TOP - BED, 1.0), stone); w.position.set(mx, (TOP + BED) / 2, mz); w.rotation.y = ry; w.receiveShadow = true; walls.add(w);
        const c = new THREE.Mesh(new THREE.BoxGeometry(len, 0.25, 1.4), coping); c.position.set(mx, TOP + 0.12, mz); c.rotation.y = ry; walls.add(c);
        // bậc bến xuống nước (người bơi lên bờ / chủ đò): 9 bậc 0,7 m — nền đi được
        if (a.s - lastStep > 150) {
          lastStep = a.s;
          const nx = a.tz * side, nz = -a.tx * side; // hướng ra giữa dòng
          for (let j = 0; j < 9; j++) {
            const y = TOP - 0.7 * (j + 1), px = A.x + nx * (0.6 + j * 0.55), pz = A.z + nz * (0.6 + j * 0.55);
            const st = new THREE.Mesh(new THREE.BoxGeometry(4, y - BED, 0.55), coping); st.position.set(px, (y + BED) / 2, pz); st.rotation.y = ry; walls.add(st);
            addPlatform(px, pz, 4, 0.56, ry, y);
          }
        }
      }
    }
  }
  MD.mergeStatic(walls);
  return { group: grp, update() {} };
}
