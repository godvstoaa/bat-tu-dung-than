// ============================================================================
//  HUYỀN QUÁN SƠN MÔN — dựng 3D khu quán khởi đầu theo court.js.
//  Sân lát đá 120 × 132 m · tường son mái ngói · Sơn Môn + Hậu Môn (gate_sect) · đường thần đạo ·
//  Đại Đỉnh · hồ sen đôi · nền đá hai tầng có lan can và bậc ngự đạo · Chính Đường (palace_grand) ·
//  điện phụ Đông/Tây (hall_main) · lầu chuông / lầu trống · bảo tháp bốn góc · cờ ngũ hành · đèn đá.
//  Mọi model Meshy vào lưới va chạm theo hình khối (collide.js) — không đi xuyên.
// ============================================================================
import * as THREE from 'three';
import { span } from './perf.js';
import * as MD from './models.js';
import * as TX from './textures.js';
import { placeModel, instanceModel } from './assets.js';
import { addFootprint } from './collide.js';
import { addLight, addGlow } from './lights.js';
import { addSolidRect as addSolidRectLocal } from './obstacles.js';
import { COURT, TERRACES, STAIRS, PONDS, MAIN_HALL, TANGY } from './court.js';
import { SETS, ITEM } from './cosmetics.js';
import { stoneMaterial } from './ground-tex.js';
import { shanmen, buildWalls } from './archcity/gates.js';
import { templeGroup } from './archcity/temple.js';
import { archMats, boxUV, SPAN } from './archcity/mats.js';
import { polyRoof, roofProfile } from './tienphu/arch/kit.js';
const MDM = MD.materials();

// sơn môn Nam (cổng chính, 3 vòm) + Hậu Môn (nhỏ hơn) — docs/CONG-TRINH-LAM-LAI-MANIFEST.md §3.1
const SM_S = { W: 22, D: 7, Hb: 7.2, mid: [4.6, 5.8], side: [3.2, 4.5], title: '玄 觀' };
const SM_N = { W: 15, D: 6, Hb: 6.2, mid: [3.6, 4.8], side: [2.4, 3.6], title: '後 山', tile: 'Gray' };

const mk = (geo, mat, x, y, z, g, { ry = 0, rx = 0, shadow = true } = {}) => {
  const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.rotation.set(rx, ry, 0);
  o.castShadow = shadow; o.receiveShadow = true; g.add(o); return o;
};
const box = (w, h, d, mat, x, y, z, g, o) => mk(new THREE.BoxGeometry(w, h, d), mat, x, y, z, g, o);

function mats() {
  const W = COURT.x1 - COURT.x0, D = COURT.z1 - COURT.z0;
  return {
    pave: stoneMaterial({ seed: 29, rows: 8, repeat: [W / 6.4, D / 6.4], base: '#a59d8e', roughness: 0.92 }),
    path: stoneMaterial({ seed: 31, rows: 3, repeat: [2, 14], base: '#b5ad9c', roughness: 0.85 }),
    terrace: stoneMaterial({ seed: 44, rows: 3, repeat: [10, 1], base: '#a8a092', roughness: 0.88 }),
    top: stoneMaterial({ seed: 45, rows: 8, repeat: [12, 10], base: '#a09888', roughness: 0.92 }),
    marble: stoneMaterial({ seed: 93, rows: 1, base: '#cbc4b5', S: 256, roughness: 0.62, normalScale: 0.5 }),
    plaster: new THREE.MeshStandardMaterial({ map: TX.lacquerTex('#9b2a1f', { seed: 21, gold: 0.05, repeat: [24, 1], streak: 0.05 }), roughness: 0.8 }),
    base: stoneMaterial({ seed: 95, rows: 1, base: '#6a645b', S: 256, roughness: 0.95 }),
    gold: new THREE.MeshStandardMaterial({ color: '#d4a63c', roughness: 0.32, metalness: 0.85 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2b2622', roughness: 0.9 }),
    lampGlow: new THREE.MeshStandardMaterial({ color: '#c9b48a', emissive: '#ffb050', emissiveIntensity: 1, roughness: 0.75 }),
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

// đèn đá (thạch đăng) tạc nguyên khối đá: bệ bát giác, thân tròn thuôn, đài đỡ, khám đèn
// lục giác có 6 trụ (ánh đèn lọt qua khe), mái đá lục giác, búp đỉnh — đăng ký đèn điểm.
// (Bản cũ: hộp vuông trắng + mái chóp đen sơn → trông như đèn nhựa.)
function stoneLantern(g, m, x, z, y = 0, s = 1) {
  // (2026-11-19) dáng tiện tròn mượt (lathe 16 cạnh) + mái đá lục giác cong vểnh góc (polyRoof) thay nón 6 cạnh
  const L = new THREE.Group(); L.position.set(x, y, z); L.scale.setScalar(s); g.add(L);
  const lt = (prof, seg, mat, yy) => mk(new THREE.LatheGeometry(prof.map(([r, h]) => new THREE.Vector2(r, h)), seg), mat, 0, yy, 0, L);
  lt([[0.001, 0], [0.62, 0], [0.62, 0.16], [0.5, 0.22], [0.46, 0.36], [0.36, 0.44], [0.001, 0.44]], 8, m.base, 0);          // bệ bát giác
  lt([[0.001, 0], [0.24, 0], [0.18, 0.12], [0.15, 0.55], [0.17, 0.85], [0.22, 0.95], [0.001, 0.95]], 16, m.marble, 0.44);    // thân tiện
  lt([[0.001, 0], [0.2, 0], [0.44, 0.1], [0.46, 0.18], [0.001, 0.18]], 6, m.marble, 1.39);                                    // đài đỡ lục giác
  mk(new THREE.CylinderGeometry(0.22, 0.22, 0.42, 6), m.lampGlow, 0, 1.79, 0, L, { shadow: false });
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2 + Math.PI / 6; box(0.08, 0.46, 0.08, m.marble, Math.cos(a) * 0.3, 1.8, Math.sin(a) * 0.3, L, { ry: -a }); }
  const prof = roofProfile(0.62, [[0.18, 0.18], 0.5, 0.9], 0, 8);
  const r = polyRoof({ n: 6, ae: 0.62, yE: 2.04, prof, lift: 0.12, rib: 9, ribW: 0.05, thick: 0.08, rot: Math.PI / 6 });
  mk(r.tiles, m.marble, 0, 0, 0, L); mk(r.eaveEdge, m.marble, 0, 0, 0, L);
  lt([[0.001, 0], [0.09, 0], [0.13, 0.08], [0.1, 0.18], [0.04, 0.24], [0.06, 0.3], [0.001, 0.42]], 12, m.marble, r.top - 0.04); // búp đỉnh
  addLight(x, y + 1.85 * s, z, { color: '#ffb35c', power: 1.1 });
  addFootprint(L, { base: y });
}

// cờ phướn ngũ hành trên cột cao
const WX_FLAG = ['#2f8f4a', '#c6301f', '#d29a2a', '#e8e2cf', '#2c5fb0'];
function flag(g0, m, x, z, y, i) {
  const g = new THREE.Group(); g0.add(g);
  mk(new THREE.CylinderGeometry(0.11, 0.15, 10, 14), MDM.son, x, y + 5, z, g);                                  // cột gỗ son tròn (chiếu ba mặt)
  for (const sz of [-1, 1]) box(0.34, 1.3, 0.22, m.base, x, y + 0.65, z + sz * 0.2, g);                           // đá giáp cột 夹杆石
  box(0.34, 0.12, 0.66, m.base, x, y + 1.36, z, g);
  mk(new THREE.LatheGeometry([[0.001, 0], [0.14, 0], [0.2, 0.12], [0.12, 0.26], [0.16, 0.4], [0.05, 0.58], [0.001, 0.72]].map(([r, h]) => new THREE.Vector2(r, h)), 12), m.gold, x, y + 10, z, g);
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
/** cây sân sơn môn (render3d trồng bằng archcity/trees.cityTrees): du tùng dọc tường Đông / Tây + hàng Bắc, anh đào quanh hai cánh */
export const COURT_TREES = (() => {
  const out = [];
  for (let z = -48; z <= 48; z += 12) for (const sx of [-1, 1]) if (z < -50 || z > -22) out.push({ kind: 'thongcn', x: sx * 57, z, s: 0.85 + ((z + 48) % 5) * 0.06 });
  for (const x of [-44, -30, 30, 44]) out.push({ kind: 'thongcn', x, z: -61, s: 0.9 });
  for (const [x, z] of [[-52, 30], [52, 30], [-24, 14], [24, 14], [-52, 46], [52, 46]]) out.push({ kind: 'sakura', x, z, s: 0.85 });
  return out;
})();

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

  // --- tường bao (docs/CONG-TRINH-LAM-LAI-MANIFEST.md §3.1): chân đá + thân trát đỏ + gờ gạch + nắp ngói hai mái, cao 5 m —
  //     vật liệu lặp theo mét (archcity/mats.js); nối kín vào hồi sơn môn (Nam rộng 22 → |x| ≥ 11; Hậu Môn 15 → |x| ≥ 7,5)
  const T = COURT.wall;
  const xo = COURT.x0 - T / 2, xe = COURT.x1 + T / 2, zn = COURT.z0 - T / 2, zs = COURT.z1 + T / 2;
  const walls = buildWalls([[xo, zn, xo, zs], [xe, zn, xe, zs], [xo, zs, -SM_S.W / 2, zs], [SM_S.W / 2, zs, xe, zs], [xo, zn, -SM_N.W / 2, zn], [SM_N.W / 2, zn, xe, zn]], { T, H: COURT.wallH });
  root.add(walls);

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
    balustrade(deco, m, x0, z1, x1, z1, 0.32, [[p.cx + p.gap[0], z1 - 1, p.cx + p.gap[1], z1 + 1]]); // lối xuống hồ (court.PONDS gap)
    balustrade(deco, m, x0, z0, x1, z0, 0.32); balustrade(deco, m, x0, z0, x0, z1, 0.32); balustrade(deco, m, x1, z0, x1, z1, 0.32);
  }

  // --- Tàng Y Các: hai giá treo phẩm phục ngũ hành bên quầy Thợ May (quầy là model, nạp bất đồng bộ)
  const robes = [];
  for (const sx of [-1, 1]) {
    const R = new THREE.Group(); R.position.set(TANGY.x + sx * 4.2, 0, TANGY.z - 0.2); R.rotation.y = sx * 0.35; deco.add(R);
    for (const dx of [-1.1, 1.1]) box(0.1, 2.4, 0.1, m.dark, dx, 1.2, 0, R);
    box(2.4, 0.08, 0.08, m.gold, 0, 2.35, 0, R);
    SETS.slice(sx < 0 ? 0 : 3, sx < 0 ? 3 : 5).forEach((st, i, arr) => {
      const it = ITEM[st.pieces[0]], c = new THREE.Color().setHSL(it.look.pri[0], it.look.pri[1] * 0.9, it.look.pri[2] * 0.55);
      const robe = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 1.5, 1, 4), new THREE.MeshStandardMaterial({ color: c, roughness: 0.75, side: THREE.DoubleSide }));
      robe.position.set((i - (arr.length - 1) / 2) * 0.72, 1.55, 0.02); robe.castShadow = true; R.add(robe); robes.push(robe);
      const sash = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.1), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(it.look.acc[0], it.look.acc[1], it.look.acc[2] * 0.6), side: THREE.DoubleSide }));
      sash.position.set(robe.position.x, 1.45, 0.03); R.add(sash);
    });
    addFootprint(R, { base: 0 });
  }
  for (const sx of [-1, 1]) stoneLantern(deco, m, TANGY.x + sx * 2.6, TANGY.z + 1.6, 0, 0.75);
  // ma-nơ-canh mặc phẩm phục bộ ngũ hành trước đình (xoay chậm khoe áo — nhóm động, không gộp)
  const manq = new THREE.Group(); root.add(manq);
  const wood = new THREE.MeshStandardMaterial({ color: '#b98a5a', roughness: 0.6 });
  ['y_moc', 'y_hoa', 'y_thuy'].forEach((id, i) => {
    const it = ITEM[id], g = new THREE.Group(); g.position.set(TANGY.x + (i - 1) * 1.5, 0, TANGY.z + 0.2); manq.add(g);
    const c = new THREE.Color().setHSL(it.look.pri[0], Math.min(1, it.look.pri[1]), it.look.pri[2] * 0.5);
    const a2 = new THREE.Color().setHSL(it.look.acc[0], it.look.acc[1], it.look.acc[2] * 0.55);
    box(0.5, 0.08, 0.5, m.dark, 0, 0.04, 0, g);
    mk(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6), m.dark, 0, 0.3, 0, g);
    mk(new THREE.LatheGeometry([[0.001, 0], [0.34, 0.02], [0.3, 0.45], [0.2, 0.9], [0.24, 1.05], [0.14, 1.12], [0.001, 1.14]].map(([r, y]) => new THREE.Vector2(r, y)), 18), new THREE.MeshStandardMaterial({ color: c, roughness: 0.7 }), 0, 0.5, 0, g);
    mk(new THREE.CylinderGeometry(0.205, 0.215, 0.1, 18), new THREE.MeshStandardMaterial({ color: a2, roughness: 0.6 }), 0, 1.15, 0, g);
    mk(new THREE.SphereGeometry(0.12, 12, 10), wood, 0, 1.78, 0, g);
    g.userData.spin = i;
  });
  manq.userData.update = (t) => manq.children.forEach((g) => { g.rotation.y = Math.sin(t * 0.4 + g.userData.spin * 2) * 0.6; });
  root.userData.manq = manq;
  addSolidRectLocal(TANGY.x - 2.4, TANGY.z - 0.2, TANGY.x + 2.4, TANGY.z + 0.6);
  addGlow(m.lampGlow, { base: 0.4, night: 2.6, color: '#ffb050' });
  // (2026-11-19) nền đá / bậc / lan can / đèn đá: vật liệu lặp theo mét (đá khối, cẩm thạch) thay texture canvas kéo theo hộp
  { const A = archMats(), swap = new Map([[m.terrace, A.stone], [m.base, A.stone], [m.marble, A.marble], [m.top, A.floor]]);
    deco.traverse((o) => { if (!o.isMesh || Array.isArray(o.material) || !swap.has(o.material)) return; const t = swap.get(o.material); o.geometry = boxUV(o.geometry, { span: SPAN[t.userData.tiled], index: true }); o.material = t; }); }
  span('sect:merge', () => MD.mergeStatic(deco));

  // --- model Meshy (bất đồng bộ) — tất cả vào lưới va chạm theo hình khối
  const loaded = (async () => {
    // Sơn Môn + Hậu Môn: khoét lối giữa vòm cổng.
    // §4(5) (vá 2026-11-14): kẹp fit 30/20 → 14 (luật cổng tông môn 14×5,1×8,2 — bảng §1 dòng 8);
    // keep là toạ độ THẾ GIỚI theo mét (collide.js:178) nên KHÔNG co hệ số 14/30: khe |x|>3,4
    // giữ nguyên = lối đi 6,8 m thông suốt (CHỐT gạch 5 của duyệt).
    const big = (r) => { if (r?.obj && bigHook) bigHook(r.obj); return r; };
    // §3.1 (2026-11-19): sơn môn dựng thủ tục thay gate_sect Meshy (14 × 8,2 m, 36 px/m) — Nam 22 × ~13 m, Hậu Môn 15 m
    for (const [S, z, ry, keepX] of [[SM_S, COURT.z1 + T / 2, 0, SM_S.mid[0] / 2 - 0.2], [SM_N, COURT.z0 - T / 2, Math.PI, SM_N.mid[0] / 2 - 0.2]]) {
      const { group } = shanmen(S); group.position.set(0, 0, z); group.rotation.y = ry; root.add(group);
      addFootprint(group, { keep: (x) => Math.abs(x) > keepX });
      if (bigHook) bigHook(group);
    }
    // (2026-11-19, docs/CONG-TRINH-LAM-LAI-MANIFEST.md goal 2) công trình sân dựng thủ tục (archcity/temple.js) thay Meshy mờ:
    //   Chính Đường 9 gian ngói vàng · điện phụ 5 gian · chung / cổ lâu 2 tầng · tháp bát giác 5 tầng (Bắc) / vuông 3 tầng (Nam) · đình Tàng Y
    const put = (id, x, y, z, ry, opts = {}) => { const o = templeGroup(id).clone(); o.position.set(x, y, z); o.rotation.y = ry; root.add(o); addFootprint(o, opts); return o; };
    big({ obj: put('main', MAIN_HALL.x, 4, MAIN_HALL.z, 0, { base: 4 }) });
    put('kiosk', TANGY.x, 0, TANGY.z - 1.6, 0);
    // Đại Đỉnh giữa sân
    await solid(await placeModel(root, 'cauldron', { fit: { height: 5.5 }, at: { x: 0, y: 0, z: 27.5, ry: 0 } }));
    for (const sx of [-1, 1]) {
      big({ obj: put('side', sx * 47, 0, -36, -sx * Math.PI / 2) });
      big({ obj: put('bell', sx * 47, 0, -9, -sx * Math.PI / 2) });
      put('pagodaN', sx * 53, 0, -58, Math.PI / 8);
      put('pagodaS', sx * 53, 0, 58, 0);
    }
    // cây sân: chuyển sang render3d (archcity/trees.js — model lib_tp_* thay tree_pine / tree_peach cũ), xem COURT_TREES
  })().catch((e) => console.warn('[sect]', e));

  // `loaded`: mọi mô hình Meshy của sơn môn đã đặt xong (màn nạp chờ, có giới hạn thời gian)
  return { root, pickables: pick, loaded, update: (t) => root.userData.manq?.userData.update(t) };
}
