// ============================================================================
//  THUYỀN 3D (boats.js): mô hình thủ tục 3 loại — đò chèo 6 m (mui tre), thuyền hoa 14 m (lầu son, mái cong, đèn
//  lồng), thuyền buồm 22 m (hai cột, buồm cánh dơi có nẹp tre) — nổi theo mặt sóng (water.waveHeight / waveSlope:
//  chòng chành, chồm). Đội thuyền NPC: thuyền hoa vòng hào / xuôi kênh, thuyền buồm buôn chạy giữa lạch Huyền Hà,
//  đò dạo hồ — chạy theo tuyến, chậm lại khi gần người chơi / thuyền khác. Thuyền của người chơi và người khác.
// ============================================================================
import * as THREE from 'three';
import * as MD from './models.js';
import * as AK from './archkit.js';
import { BOAT_TYPES, TYPE_BY_IDX } from './boats.js';
import { waterAt, waveHeight, waveSlope, waterTime } from './water.js';
import { riverPoints } from './waterways.js';
import * as T from './terrain.js';
import { addGlow } from './lights.js';

const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.8, ...o });
let M = null;
function mats() {
  if (M) return M;
  const k = AK.kit();
  M = {
    hull: std({ color: '#5a3a22', roughness: 0.75 }), hullDark: std({ color: '#3a2416', roughness: 0.8 }),
    deck: k.floor, bamboo: std({ color: '#b89a5a', roughness: 0.9 }), mat: std({ color: '#8a7448', roughness: 0.95, side: THREE.DoubleSide }),
    red: std({ color: '#9a2a1c', roughness: 0.6 }), lattice: k.lattice, roof: k.roof, roofGreen: k.roofGreen || k.roof, gold: std({ color: '#c99a3a', roughness: 0.4, metalness: 0.4 }),
    sail: std({ color: '#c8a46a', roughness: 0.95, side: THREE.DoubleSide }), mast: std({ color: '#4a3020', roughness: 0.8 }),
    lantern: std({ color: '#d8341c', emissive: '#ff5a1e', emissiveIntensity: 0.8, roughness: 0.6 }),
    k,
  };
  addGlow(M.lantern, { base: 0.8, night: 2.6, color: '#ff7a3c' });
  return M;
}
/** thân thuyền: mặt cắt chữ U đùn theo chiều dài, hai đầu thu nhọn / vểnh (lấy mẫu dọc trục z) */
function hullGeo(len, beam, depth, sheer = 0.5) {
  const nz = 24, nu = 10, pos = [], idx = [];
  for (let i = 0; i <= nz; i++) {
    const t = i / nz, z = (t - 0.5) * len, e = 1 - Math.pow(Math.abs(t - 0.5) * 2, 2.2); // bề rộng thu về hai đầu
    const w = beam / 2 * (0.12 + 0.88 * e), lift = sheer * Math.pow(Math.abs(t - 0.5) * 2, 2) * depth; // hai đầu vểnh
    for (let j = 0; j <= nu; j++) {
      const a = Math.PI * (j / nu), x = -Math.cos(a) * w, y = -Math.sin(a) * depth * (0.25 + 0.75 * e) + lift;
      pos.push(x, y, z);
    }
  }
  for (let i = 0; i < nz; i++) for (let j = 0; j < nu; j++) { const a = i * (nu + 1) + j, b = a + nu + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
const box = (g, w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); g.add(m); return m; };
/** mô hình thuyền (trục dọc = +z cục bộ, gốc = mặt nước ở tâm thân) */
export function makeBoat(id) {
  const t = BOAT_TYPES[id], m = mats(), g = new THREE.Group();
  const hull = new THREE.Mesh(hullGeo(t.len, t.beam, t.draft + (id === 'do' ? 0.35 : 0.6), id === 'buom' ? 0.7 : 0.45), m.hull); hull.position.y = 0.25 + (id === 'buom' ? 0.6 : 0.2); g.add(hull);
  const deckY = hull.position.y - 0.02;
  box(g, t.beam * 0.82, 0.08, t.len * 0.8, m.deck, 0, deckY, 0);
  box(g, t.beam * 0.92, 0.14, 0.14, m.hullDark, 0, deckY + 0.1, t.len * 0.4); // xà mũi
  if (id === 'do') {
    // mui tre cong giữa thân
    const arc = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 2.2, 12, 1, true, -Math.PI / 2, Math.PI), m.mat); arc.rotation.x = Math.PI / 2; arc.rotation.z = Math.PI / 2; arc.position.set(0, deckY + 0.35, -0.3); arc.scale.set(1, 1, 0.9); g.add(arc);
    const oar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.2, 5), m.bamboo); oar.rotation.x = 1.15; oar.position.set(0, deckY + 0.4, -2.6); g.add(oar);
  } else if (id === 'hoa') {
    box(g, t.beam * 0.7, 2.0, t.len * 0.42, m.lattice, 0, deckY + 1.0, -0.6);
    const R = MD.roof(t.len * 0.52, t.beam * 1.0, 1.1, { upturn: 0.65, mats: { ...m.k, roof: m.roofGreen } }); R.rotation.y = Math.PI / 2; R.position.set(0, deckY + 2.0, -0.6); g.add(R);
    for (const [x, z] of [[-1.3, 2.2], [1.3, 2.2], [-1.3, -3.4], [1.3, -3.4]]) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), m.lantern); l.scale.y = 1.3; l.position.set(x, deckY + 1.75, z); g.add(l); }
    box(g, t.beam * 0.9, 0.5, 0.12, m.red, 0, deckY + 0.3, t.len * 0.22); // lan can mũi
  } else {
    box(g, t.beam * 0.75, 1.6, t.len * 0.22, m.lattice, 0, deckY + 0.8, -t.len * 0.3); // lầu lái
    const R = MD.roof(t.len * 0.26, t.beam * 0.95, 0.8, { upturn: 0.5, mats: m.k }); R.rotation.y = Math.PI / 2; R.position.set(0, deckY + 1.6, -t.len * 0.3); g.add(R);
    for (const [z, hgt, sw] of [[t.len * 0.12, t.height - 0.4, 7.5], [-t.len * 0.08, t.height * 0.78, 5.5]]) {
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, hgt, 7), m.mast); mast.position.set(0, deckY + hgt / 2, z); g.add(mast);
      // buồm cánh dơi: tấm cong có nẹp tre ngang
      const sh = new THREE.Shape(); sh.moveTo(-sw * 0.15, 0.6); sh.lineTo(sw * 0.85, 0.9); sh.quadraticCurveTo(sw, hgt * 0.55, sw * 0.7, hgt - 0.6); sh.lineTo(-sw * 0.3, hgt - 1.2); sh.lineTo(-sw * 0.15, 0.6);
      const sg = new THREE.ShapeGeometry(sh, 8); const sail = new THREE.Mesh(sg, m.sail); sail.rotation.y = Math.PI / 2; sail.position.set(0.05, deckY, z); sail.userData.sail = true; g.add(sail);
      for (let k = 1; k < 6; k++) { const yy = deckY + 0.6 + (hgt - 1.6) * (k / 6); const bt = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, sw * 1.05, 4), m.bamboo); bt.rotation.x = Math.PI / 2; bt.position.set(0.12, yy, z - sw * 0.35); g.add(bt); }
    }
  }
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  g.userData.type = id;
  return g;
}
/** đặt thuyền lên mặt sóng: vị trí, hướng h, chòng chành theo độ dốc sóng */
export function floatBoat(obj, x, z, h, t = waterTime()) {
  const w = waterAt(x, z), level = w ? w.level : T.WATER, amp = w ? (w.kind === 'river' || w.kind === 'lake' ? w.amp : w.amp * Math.min(1, w.depth / 1.5)) : 0;
  const len = BOAT_TYPES[obj.userData.type]?.len || 6, damp = Math.min(1, 6 / len); // thuyền dài chòng chành ít
  const y = level + waveHeight(x, z, t, amp) * (0.6 + 0.4 * damp);
  const sl = waveSlope(x, z, t, amp), fx = Math.sin(h), fz = Math.cos(h);
  obj.position.set(x, y, z);
  obj.rotation.order = 'YXZ'; obj.rotation.y = h;
  obj.rotation.x = -(sl.gx * fx + sl.gz * fz) * damp * 0.9; // chồm theo dốc dọc thân
  obj.rotation.z = (sl.gx * fz - sl.gz * fx) * damp * 0.9;   // nghiêng theo dốc ngang
  return y;
}

// ---------------------------------------------------------------------------
// Đội thuyền NPC: tuyến + tốc độ; giảm tốc khi có người chơi / thuyền gần phía trước
// ---------------------------------------------------------------------------
function route(pts, loop) { const seg = []; let L = 0; for (let i = 0; i + 1 < pts.length; i++) { const a = pts[i], b = pts[i + 1], l = Math.hypot(b.x - a.x, b.z - a.z); seg.push({ a, b, l, s: L }); L += l; } if (loop) { const a = pts[pts.length - 1], b = pts[0], l = Math.hypot(b.x - a.x, b.z - a.z); seg.push({ a, b, l, s: L }); L += l; } return { seg, L, loop }; }
function along(R, s) {
  if (R.loop) s = ((s % R.L) + R.L) % R.L; else s = Math.max(0, Math.min(R.L - 1e-3, s));
  let lo = 0, hi = R.seg.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (R.seg[mid].s <= s) lo = mid; else hi = mid - 1; }
  const q = R.seg[lo], k = (s - q.s) / (q.l || 1);
  return { x: q.a.x + (q.b.x - q.a.x) * k, z: q.a.z + (q.b.z - q.a.z) * k, h: Math.atan2(q.b.x - q.a.x, q.b.z - q.a.z) };
}
export function createFleet(scene) {
  const grp = new THREE.Group(); grp.name = 'fleet'; scene.add(grp);
  const ships = [];
  const add = (type, R, n, speed, dir = 1) => {
    for (let i = 0; i < n; i++) {
      const obj = makeBoat(type); MD.mergeStatic(obj); grp.add(obj);
      ships.push({ obj, type, R, s: (i / n) * R.L, speed: speed * (0.9 + (i % 3) * 0.08), dir, cur: speed, pos: null });
    }
  };
  // v4: hào / kênh cũ đã bỏ. Sông Huyền Hà: đoạn TRONG THÀNH (qua 5 cầu tĩnh không 9 m) chỉ thuyền hoa / đò; thuyền buồm
  // cột 12 m chạy đoạn NGOÀI THÀNH phía Tây (thủy môn chặn buồm)
  const P = riverPoints();
  for (const side of [-1, 1]) {
    const lane = P.filter((_, i) => i % 6 === 0).map((p) => ({ x: p.x - p.tz * side * 10, z: p.z + p.tx * side * 10 }));
    const inCity = lane.filter((p) => T.cityOctDist(p.x, p.z) < -30), west = lane.filter((p) => T.cityOctDist(p.x, p.z) > 60 && p.x < 0);
    if (inCity.length > 4) { add('hoa', route(side > 0 ? inCity : inCity.reverse(), false), 3, 1.1); add('do', route(side > 0 ? inCity.slice().reverse() : inCity, false), 2, 1.2); }
    if (west.length > 4) add('buom', route(side > 0 ? west : west.reverse(), false), 2, 3.2);
  }
  // hồ: đò dạo vòng
  { const L = T.REGIONS.find((r) => r.id === 'cungthong'); const pts = []; for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; pts.push({ x: L.x + Math.cos(a) * 110, z: L.z + Math.sin(a) * 110 }); } add('do', route(pts, true), 3, 1.0); add('buom', route(pts.map((p) => ({ x: L.x + (p.x - L.x) * 1.35, z: L.z + (p.z - L.z) * 1.35 })), true), 1, 2.6); }
  let vis = 0;
  return {
    group: grp,
    ships,
    /** người chơi tại (px, pz); others: [{x, z}] (thuyền / người khác) để tránh va */
    update(dt, px, pz, others = []) {
      const t = waterTime();
      vis += dt;
      for (const S of ships) {
        const p0 = S.pos || along(S.R, S.s);
        const d = Math.hypot(p0.x - px, p0.z - pz);
        // xa người chơi > 900 m: không vẽ, vẫn tiến (rẻ)
        const near = d < 900;
        // tránh va: có vật cản trong 1,5 thân phía trước → chậm dần tới dừng
        const len = BOAT_TYPES[S.type].len, fx = Math.sin(p0.h), fz = Math.cos(p0.h) * 1;
        let block = false;
        for (const o of [{ x: px, z: pz }, ...others, ...ships.filter((q) => q !== S && q.pos).map((q) => q.pos)]) {
          const ox = o.x - p0.x, oz = o.z - p0.z, ahead = (ox * fx + oz * fz) * S.dir, side = Math.abs(ox * fz - oz * fx);
          if (ahead > 0 && ahead < len * 1.6 && side < BOAT_TYPES[S.type].beam + 2) { block = true; break; }
        }
        S.cur += ((block ? 0 : S.speed) - S.cur) * Math.min(1, dt * (block ? 1.5 : 0.4));
        S.s += S.cur * dt * S.dir;
        if (!S.R.loop && (S.s >= S.R.L - 1 || S.s <= 0)) { S.dir = -S.dir; S.s = Math.max(0, Math.min(S.R.L - 1, S.s)); }
        const p = along(S.R, S.s); if (S.dir < 0) p.h += Math.PI;
        // quay đầu mượt
        if (S.pos) { let dh = ((p.h - S.pos.h + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; p.h = S.pos.h + dh * Math.min(1, dt * 1.2); }
        S.pos = p;
        S.obj.visible = near;
        if (near) floatBoat(S.obj, p.x, p.z, p.h, t);
      }
    },
  };
}
/** thuyền của người khác (theo loại mã mạng) — cache mô hình theo id người chơi */
export function makeBoatByIdx(idx) { const t = TYPE_BY_IDX[idx] || BOAT_TYPES.do; return makeBoat(Object.keys(BOAT_TYPES).find((k) => BOAT_TYPES[k] === t)); }
