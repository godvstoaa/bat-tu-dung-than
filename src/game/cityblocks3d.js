// ============================================================================
//  NGOẠI THÀNH BÁT QUÁI — dựng 3D theo cityblocks.js.
//   · Tường bát giác trung đoạn 420 + tháp góc + mã diện + 8 cổng lớn.
//   · ~1.800 nhà phố nhân bản theo 3 tầng chi tiết, chia lại theo ô 96 m quanh người chơi:
//       nhà < 22 m → model gốc (~80k tam giác, texture 1024, đổ bóng) — vài nhà sát người chơi
//       nhà < 55 m → model .lod1 (~10k tam giác, texture 512, đổ bóng — scripts/meshy-lod2.mjs)
//       ô < 140 m  → model .lod2 (~3k tam giác, texture 256, không đổ bóng)
//       xa hơn    → khối thủ tục (tường + mái 4 dốc, màu theo model) gộp 1 mesh mỗi ô
//     Va chạm nhà = hộp xoay (obstacles.addSolidOBB), không cắt lát model.
//   · Công trình mốc + lô chủ đề mỗi cung, đèn lồng dọc 8 đại lộ, cây sân trong.
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as T from './terrain.js';
import * as BQ from './batquai.js';
import * as CB from './cityblocks.js';
import { loadModel, instanceModel, warmObject, getModelQuality } from './assets.js';
import { addSolidOBB, addSolidCircle, addSolidSegment, addTall } from './obstacles.js';
import { addLight, glowAll } from './lights.js';
import { place, pond, field, yard, arena, nameBoard, mats } from './batquai3d.js';
import * as CN from './canals.js';
import * as AK from './archkit.js';
import { innerHouses } from './innerfill.js';
import { stoneMaterial } from './ground-tex.js';
import { renderHouses } from './city4.js';

const H = (x, z) => T.heightAt(x, z);
const CLOSE = 0, NEAR = 36, MID = 68, FAR_VC = 220, FAR_MAX = 1200; // FAR_VC: tới đây là .vc2 (~2,5k, màu đỉnh) thay khối hộp — // v4: bậc theo TỪNG NHÀ — < 36 m BẢN GỐC có bóng (.lod1 nhìn gần vỡ mảnh) · < 68 m .lod1 · < 1,2 km khối xa nhân bản (2 lệnh vẽ) · xa hơn ẩn (sương). Bậc sát .mid tắt (nát)
const range = (a, b, s) => { const o = []; for (let x = a; x <= b; x += s) o.push(x); return o; };
const axisRy = (g) => Math.atan2(-g.dir[1], g.dir[0]); // x cục bộ dọc trục u của cung

// ---------------------------------------------------------------------------
// Tường Ngoại Thành + cổng
// ---------------------------------------------------------------------------
// A: trung đoạn (TRUNG_A 420 = tường Trung Thành, OUTER_A 672 = tường Ngoại Thành), WH: cao tường
export function outerWall(grp, A = CB.OUTER_A, WH = 17) {
  const M = mats(), L = A * BQ.TAN8, h = CB.OUTER_GATE_W / 2 - 1, WT = 6;
  const segGeo = [], capGeo = [], merGeo = [];
  const box = (w, hh, d, x, y, z, ry, list) => { const b = new THREE.BoxGeometry(w, hh, d); b.rotateY(ry); b.translate(x, y, z); list.push(b); };
  for (const g of BQ.GUA) {
    for (const [v0, v1] of [[-L, -h], [h, L]]) {
      const a = BQ.toWorld(g, A, v0), b = BQ.toWorld(g, A, v1);
      addSolidSegment(a.x, a.z, b.x, b.z, WT / 2 + 0.4);
      { const L2 = Math.hypot(b.x - a.x, b.z - a.z); addTall((a.x + b.x) / 2, (a.z + b.z) / 2, L2 / 2, WT / 2 + 0.4, Math.atan2(-(b.z - a.z), b.x - a.x), H((a.x + b.x) / 2, (a.z + b.z) / 2) + WH - 1.5); } // mặt thành đi được
      const ex = b.x - a.x, ez = b.z - a.z, len = Math.hypot(ex, ez), n = Math.max(1, Math.ceil(len / 12)), ry = Math.atan2(-ez, ex);
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n, cx = a.x + ex * t, cz = a.z + ez * t, l = len / n + 0.5;
        const wet = H(cx, cz) < -1.5, y = wet ? 0 : H(cx, cz); // v4: sông xuyên tường → thủy môn (tường treo trên vòm, chừa 7 m trên mặt nước −6)
        if (wet) box(l, WH - 1.5 - 1, WT, cx, (WH - 1.5 + 1) / 2, cz, ry, segGeo);
        else box(l, WH, WT, cx, y + WH / 2 - 1.5, cz, ry, segGeo);
        box(l, 1.4, WT + 1.4, cx, y + WH - 0.8, cz, ry, capGeo);
        for (const k of [-0.32, 0, 0.32]) box(1.6, 1.6, 1.1, cx + Math.cos(ry) * k * l, y + WH + 0.6, cz - Math.sin(ry) * k * l, ry, merGeo);
      }
      // mã diện (ụ nhô ra ngoài) giữa đoạn
      const m = BQ.toWorld(g, A + 3, (v0 + v1) / 2), my = H(m.x, m.z);
      box(9, WH + 2, 9, m.x, my + (WH + 2) / 2 - 1.5, m.z, axisRy(g), segGeo);
      addSolidCircle(m.x, m.z, 5.5);
    }
  }
  const mesh = (list, mat) => { const geo = mergeGeometries(list, false); list.forEach((q) => q.dispose()); const o = new THREE.Mesh(geo, mat); o.castShadow = true; o.receiveShadow = true; grp.add(o); return o; };
  mesh(segGeo, M.wall); mesh(capGeo, M.cap); mesh(merGeo, M.wall);
  for (const p of BQ.octVertices(A)) {
    const y = H(p.x, p.z);
    const s = WH / 17; // tháp góc theo cao tường
    const parts = [[new THREE.CylinderGeometry(8 * s, 8.8 * s, 24 * s, 8), M.wall, y + 11 * s], [new THREE.CylinderGeometry(6 * s, 6 * s, 5 * s, 8), M.red, y + 25.5 * s], [new THREE.ConeGeometry(9.6 * s, 6 * s, 8), M.roof, y + 31 * s]];
    for (const [geo, mat, yy] of parts) { const o = new THREE.Mesh(geo, mat); o.position.set(p.x, yy, p.z); o.rotation.y = Math.PI / 8; o.castShadow = true; grp.add(o); }
    addSolidCircle(p.x, p.z, 9 * WH / 17);
  }
}
const corridor = (x, z, ry, hw) => (px, pz) => Math.abs(Math.cos(ry) * (px - x) - Math.sin(ry) * (pz - z)) > hw;
export async function outerGates(grp, A = CB.OUTER_A, WH = 17) {
  for (const g of BQ.GUA) {
    const p = BQ.toWorld(g, A, 0), ry = BQ.faceAxis(g, true);
    if (CN.inCanal(p.x, p.z)) { waterGate(grp, g, A, WH); continue; } // kênh xuyên tường: thủy môn
    await place(grp, ['city_gate', 'gate_sect'], { fit: { width: CB.OUTER_GATE_W * (A > 500 ? 1.45 : 1.25) }, at: { x: p.x, y: H(p.x, p.z), z: p.z, ry }, keep: corridor(p.x, p.z, ry, 6) });
  }
}

// THỦY MÔN (2026-11-10): cổng nước ở chỗ kênh xuyên tường Trung Thành (Khảm, Tốn) và Ngoại Thành (Tốn) — vòm nước
// giữa rộng 22 m, cao 7 m trên mặt nước (thuyền hoa, đò, thuyền hàng qua; thuyền buồm cột cao không qua), hai cổng
// đường bộ hai bên (v ±11,8…±19, cao 6 m), trụ đá lấp kín phần còn lại của khe tường (|v| < 27), lầu cổng trên đỉnh.
export const WATER_GATE = { arch: 22, clear: 7, road: [11.8, 19], roadH: 6, depth: 12 };
function waterGate(grp, g, A, WH) {
  const M = mats(), ry = axisRy(g), WG = WATER_GATE, gap = CB.OUTER_GATE_W / 2 - 1, wl = CN.CANAL_WATER;
  const geos = [], caps = [];
  const box = (u0, u1, v0, v1, y0, y1, list = geos) => {
    const c = BQ.toWorld(g, (u0 + u1) / 2 + A, (v0 + v1) / 2), b = new THREE.BoxGeometry(u1 - u0, y1 - y0, v1 - v0);
    b.rotateY(ry); b.translate(c.x, (y0 + y1) / 2, c.z); list.push(b);
  };
  const D = WG.depth / 2, top = WH - 1.5;
  for (const s of [-1, 1]) {
    const v = (a, b) => (s > 0 ? [a, b] : [-b, -a]);
    // trụ ngoài (đặc) + trụ giữa nước / đường (mỏng, đứng trên bờ kè)
    box(-D, D, ...v(WG.road[1], gap + 1), CN.CANAL_BED, top);
    box(-D, D, ...v(WG.arch / 2, WG.road[0]), CN.CANAL_BED, top);
    // xà trên cổng đường bộ
    box(-D, D, ...v(WG.road[0], WG.road[1]), WG.roadH, top);
    const po = BQ.toWorld(g, A, s * ((WG.road[1] + gap + 1) / 2)); addSolidOBB(po.x, po.z, D + 0.3, ((gap + 1) - WG.road[1]) / 2 + 0.3, ry);
    const pi = BQ.toWorld(g, A, s * ((WG.arch / 2 + WG.road[0]) / 2)); addSolidOBB(pi.x, pi.z, D + 0.3, (WG.road[0] - WG.arch / 2) / 2 + 0.2, ry);
  }
  // xà vòm nước (đáy xà = mặt nước + tĩnh không) + vòm cuốn trang trí
  box(-D, D, -WG.arch / 2, WG.arch / 2, wl + WG.clear, top);
  box(-D - 0.6, D + 0.6, -gap - 1.4, gap + 1.4, top, top + 1.4, caps);
  const mesh = (list, mat) => { const geo = mergeGeometries(list, false); list.forEach((q) => q.dispose()); const o = new THREE.Mesh(geo, mat); o.castShadow = o.receiveShadow = true; grp.add(o); return o; };
  mesh(geos, M.wall); mesh(caps, M.cap);
  const arch = new THREE.Mesh(new THREE.TorusGeometry(WG.arch / 2, 0.7, 6, 24, Math.PI), M.cap);
  for (const du of [-D - 0.35, D + 0.35]) { const a = arch.clone(); const c = BQ.toWorld(g, A + du, 0); a.position.set(c.x, wl + WG.clear - WG.arch / 2 + 0.8, c.z); a.rotation.y = ry + Math.PI / 2; a.scale.y = 0.62; grp.add(a); }
  // lầu cổng trên đỉnh
  const { base, shell } = AK.gateHouse({ w: WG.depth - 2, d: gap * 2 - 6, h: 5, plinth: 0.4, roof: 'grey', main: true });
  for (const o of [base, shell]) { const c = BQ.toWorld(g, A, 0); o.position.set(c.x, top + 1.4, c.z); o.rotation.y = ry; grp.add(o); }
}

// ---------------------------------------------------------------------------
// Nhà phố: 3 tầng chi tiết theo ô
// ---------------------------------------------------------------------------
// bản .lod2 (texture 256) giữ hệ số kim loại của bản gốc nhưng mất chi tiết bản đồ → nhà trông như bạc;
// dùng vật liệu riêng không kim loại, nhám
const MATTE = new Map();
const matte = (m) => { if (!MATTE.has(m)) { const c = m.clone(); c.metalness = 0; c.metalnessMap = null; c.roughness = 0.9; c.roughnessMap = null; MATTE.set(m, c); } return MATTE.get(m); };
// bậc gần / sát: giữ bản đồ nhám nhưng bỏ kim loại → cùng họ sắc với bậc vừa (hết «đổi màu» khi qua ngưỡng 40 m)
const DIEL = new Map();
const diel = (m) => { if (!DIEL.has(m)) { const c = m.clone(); c.metalness = 0; c.metalnessMap = null; c.roughness = Math.max(0.75, c.roughness); DIEL.set(m, c); } return DIEL.get(m); };
// Tỷ lệ nhà thật (2026-11-10): mô hình giữ tỷ lệ gốc theo mặt tiền (nhà 2 tầng ≈ 7–8 m, 1 tầng 4–6 m bên cạnh người 1,72 m);
// bỏ «×1,3 phố tu tiên» + kéo cao ngẫu nhiên (từng làm nhà 11–16 m, cửa cao ~3 m). Nhà liền vách: mẫu lấp đủ bề ngang lô
// (chồng mép mái 1,5%) — mẫu đổi ở lớp hình không còn bị thu hẹp để hở hai bên; chiều sâu ép vừa lô khi mẫu sâu hơn.
const HCAP = { bq_drum_tower: 16, bq_tower_house: 11, bq_granary: 10, bq_yamen: 12 };
export const houseScale = (h, size) => {
  const kx = ((h.lotF || h.f) * 1.015) / (size.x || 1);
  const kz = h.d ? (h.ht ? Math.min(kx * 1.5, h.d / (size.z || 1)) : Math.min(kx, h.d / (size.z || 1))) : kx; // v5: nhà ống — kéo sâu tới 1,5× cho kín lô
  // v5 (THANH-MANIFEST §3.5): chiều cao mái đích theo cấp đường (city4 đã chọn model gần đích; kéo dọc ≤ 0,85–1,25 lần)
  if (h.ht) return { kx, ky: Math.min(kx * 1.25, Math.max(kx * 0.85, h.ht / (size.y || 1))), kz };
  const vary = 1 + Math.min(0.12, Math.max(-0.04, ((h.ys || 1) - 1) * 0.2)); // nhịp cao thấp nhẹ (≤ 12%)
  const ky = Math.min(kx * vary, (HCAP[h.id] || 10.5) / (size.y || 1));
  return { kx, ky, kz };
};
export const houseHeight = (h, sp) => {
  const nat = (h.lotF || h.f) * 1.015 * sp.hd;
  if (h.ht) return Math.min(nat * 1.25, Math.max(nat * 0.85, h.ht));
  return Math.min(nat * (1 + Math.min(0.12, Math.max(-0.04, ((h.ys || 1) - 1) * 0.2))), HCAP[h.id] || 10.5);
};
// chỉ đổ bóng: không ghi màu / độ sâu ở lượt vẽ chính (lượt bóng dùng vật liệu độ sâu riêng của three)
const SHADOW_ONLY = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
export function instancedSet(gltf, houses, { shadow, flat = false }) {
  const root = gltf.scene; root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root), size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
  const meshes = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    const f = flat ? matte : diel;
    const im = new THREE.InstancedMesh(o.geometry, Array.isArray(o.material) ? o.material.map(f) : f(o.material), houses.length);
    im.castShadow = shadow; im.receiveShadow = true; im.count = 0; im.frustumCulled = false; im.visible = false;
    im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(houses.length * 3).fill(1), 3); // tông màu theo cung (citylook.js)
    meshes.push({ im, local: o.matrixWorld.clone() });
  });
  const cols = new Float32Array(houses.length * 3).fill(1);
  houses.forEach((h, i) => { if (h.tint) cols.set(h.tint, i * 3); });
  // ma trận dựng sẵn cho từng nhà × từng mesh con (ghi lại chỉ là sao chép mảng)
  const M = new THREE.Matrix4(), B = new THREE.Matrix4(), S = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), P = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
  const mats4 = meshes.map(() => new Float32Array(houses.length * 16));
  houses.forEach((h, i) => {
    const { kx, ky, kz } = houseScale(h, size), k = kz;
    B.makeTranslation(-center.x, -box.min.y, -center.z).premultiply(S.makeScale(kx, ky, kz));
    q.setFromAxisAngle(up, h.ry);
    // mẫu nông hơn khung nhà (mặt tiền tiệm, nhà đặc trưng): đẩy ra sát mặt phố, cửa nằm đúng chỗ cửa cũ
    const sh = h.d ? Math.max(0, (h.d - size.z * k) / 2) : 0;
    meshes.forEach((m, j) => { M.compose(P.set(h.x + Math.sin(h.ry) * sh, h.y, h.z + Math.cos(h.ry) * sh), q, one).multiply(B).multiply(m.local); M.toArray(mats4[j], i * 16); });
  });
  return {
    meshes,
    write(idxList) {
      meshes.forEach((m, j) => {
        const dst = m.im.instanceMatrix.array, src = mats4[j];
        const cd = m.im.instanceColor.array;
        idxList.forEach((hi, n) => { dst.set(src.subarray(hi * 16, hi * 16 + 16), n * 16); cd.set(cols.subarray(hi * 3, hi * 3 + 3), n * 3); });
        m.im.count = idxList.length; m.im.visible = idxList.length > 0; // bộ rỗng không tốn lệnh vẽ (26 mẫu × 3 tầng)
        if (idxList.length) { m.im.instanceMatrix.needsUpdate = true; m.im.instanceColor.needsUpdate = true; }
      });
    },
  };
}
// mái chái (hip roof) kiểu Á Đông: mép mái hắt nhẹ, bờ nóc dài ~55% mặt tiền — không phải chóp nón
function hipRoof(W, D, Hh, y0) {
  const w = W / 2, d = D / 2, r = W * 0.28, lift = Hh * 0.12, y1 = y0 + Hh;
  // 4 góc mép mái (hắt lên một chút) + 2 đầu bờ nóc
  const A = [-w, y0 + lift, -d], B = [w, y0 + lift, -d], C = [w, y0 + lift, d], Dd = [-w, y0 + lift, d];
  const E = [-r, y1, 0], F = [r, y1, 0];
  const mid = (p, q) => [(p[0] + q[0]) / 2, y0, (p[2] + q[2]) / 2]; // giữa mép võng xuống (đường cong mái)
  const ab = mid(A, B), cd = mid(C, Dd);
  const tris = [A, ab, E, ab, F, E, ab, B, F, C, cd, F, cd, E, F, cd, Dd, E, B, C, F, Dd, A, E];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(tris.flat(), 3));
  g.computeVertexNormals();
  return g;
}
// khối xa: tường + mái 4 dốc, màu theo model (lệch sáng tối nhẹ), gộp theo ô
function farGeometry(list) {
  const geos = [], col = new THREE.Color(), tmp = new THREE.Color();
  for (const h of list) {
    const sp = CB.HOUSE_SPECS[h.id], Ht = houseHeight(h, sp), wh = Ht * 0.55, rh = Ht * 0.45, F = (h.lotF || h.f);
    const tint = 0.9 + ((h.x * 7.31 + h.z * 3.17) % 1 + 1) % 1 * 0.2;
    const wall = new THREE.BoxGeometry(F * 1.0, wh, h.d * 0.94); wall.translate(0, wh / 2, 0);
    const roof = hipRoof(F * 1.06, h.d * 1.18, rh, wh);
    for (const [geo, c] of [[wall, sp.wall], [roof, sp.roof]]) {
      const g2 = geo.index ? geo.toNonIndexed() : geo; geo !== g2 && geo.dispose();
      col.set(c).multiplyScalar(tint); if (h.tint) col.multiply(tmp.setRGB(h.tint[0], h.tint[1], h.tint[2])); tmp.copy(col);
      const n = g2.attributes.position.count, arr = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { arr[i * 3] = tmp.r; arr[i * 3 + 1] = tmp.g; arr[i * 3 + 2] = tmp.b; }
      g2.setAttribute('color', new THREE.BufferAttribute(arr, 3)); g2.deleteAttribute('uv');
      g2.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(h.x, h.y, h.z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), h.ry), new THREE.Vector3(1, 1, 1)));
      geos.push(g2);
    }
  }
  const out = mergeGeometries(geos, false); geos.forEach((g) => g.dispose());
  return out;
}
const farMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, flatShading: true });
const farMatI = new THREE.MeshStandardMaterial({ roughness: 0.92, flatShading: true });
/** khối xa nhân bản: khối đơn vị (rộng 1, cao 1, sâu 1) co giãn (F, Ht, d) — cùng tỉ lệ farGeometry (tường 0,55 · mái 0,45) */
function farInstances(houses) {
  const n = houses.length;
  const wallG = new THREE.BoxGeometry(1, 0.55, 0.94); wallG.translate(0, 0.275, 0);
  const roofG = hipRoof(1.06, 1.18, 0.45, 0.55);
  const mk = (g) => { const im = new THREE.InstancedMesh(g, farMatI, n); im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3); im.count = 0; im.frustumCulled = false; im.receiveShadow = true; return im; };
  const wall = mk(wallG), roof = mk(roofG);
  const M = new Float32Array(n * 16), CW = new Float32Array(n * 3), CR = new Float32Array(n * 3);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), P = new THREE.Vector3(), S = new THREE.Vector3(), col = new THREE.Color(), tmp = new THREE.Color();
  houses.forEach((h, i) => {
    const sp = CB.HOUSE_SPECS[h.id] || CB.HOUSE_SPECS.bq_house_tiled, Ht = houseHeight(h, sp), F = (h.lotF || h.f);
    const tint = 0.9 + ((h.x * 7.31 + h.z * 3.17) % 1 + 1) % 1 * 0.2;
    m4.compose(P.set(h.x, h.y, h.z), q.setFromAxisAngle(up, h.ry), S.set(F, Ht, h.d)).toArray(M, i * 16);
    for (const [c, arr] of [[sp.wall, CW], [sp.roof, CR]]) { col.set(c).multiplyScalar(tint); if (h.tint) col.multiply(tmp.setRGB(h.tint[0], h.tint[1], h.tint[2])); arr.set([col.r, col.g, col.b], i * 3); }
  });
  return {
    wall, roof,
    write(tierOf) {
      let k = 0;
      const wm = wall.instanceMatrix.array, rm = roof.instanceMatrix.array, wc = wall.instanceColor.array, rc = roof.instanceColor.array;
      for (let i = 0; i < n; i++) if (tierOf[i] === 2) { wm.set(M.subarray(i * 16, i * 16 + 16), k * 16); rm.set(M.subarray(i * 16, i * 16 + 16), k * 16); wc.set(CW.subarray(i * 3, i * 3 + 3), k * 3); rc.set(CR.subarray(i * 3, i * 3 + 3), k * 3); k++; }
      for (const im of [wall, roof]) { im.count = k; im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; }
    },
  };
}

export async function cityHouses(grp) {
  // v4 (thành ×10): ~22.900 nhà từ citylayout qua city4.renderHouses (mặt tiền đúng loại tiệm, nhà theo cung) + nhà chen Sơn Môn
  const houses = [...renderHouses(), ...innerHouses().map((h) => ({ ...h, lotF: h.f }))].map((h) => ({ ...h, y: H(h.x, h.z) }));
  for (const h of houses) addSolidOBB(h.x, h.z, h.hw - 0.04, h.hd - 0.25, h.ry); // va chạm theo khung lô — nhà liền vách, không lọt khe
  houses.forEach((h) => { const sp = CB.HOUSE_SPECS[h.id]; if (sp) addTall(h.x, h.z, h.hw - 0.04, h.hd - 0.25, h.ry, h.y + houseHeight(h, sp) * 0.62); }); // mái (leo trèo) // lớp hình: mẫu đặc trưng, mặt tiền tiệm, màu cung
  // ô không gian
  // v4: khối xa NHÂN BẢN THEO TỪNG NHÀ (tường + mái 4 dốc, khối đơn vị co giãn theo nhà, màu theo mẫu) — 2 lệnh vẽ cho cả
  // thành, và mỗi nhà đổi bậc theo khoảng cách CỦA NÓ (trước: gộp theo ô → cả ô 96 m lên .lod1 khi người chơi tới gần mép ô)
  const far = farInstances(houses); grp.add(far.wall, far.roof);
  // mỗi model 3 bộ nhân bản: vừa (.lod2, ~3k, texture 256 — NẠP SẴN, nhẹ), gần (.lod1, ~10k) và sát (.mid, ~20k)
  // NẠP LƯỜI: chỉ khi có nhà của mẫu đó lọt vào tầm (2026-11-10: trước đây nạp sẵn cả 3 bậc × 26 mẫu ≈ 32 MB
  // trên màn nạp). Chưa nạp xong thì nhà gần tạm dùng bậc thấp hơn đã có.
  const models = [];
  const ids = Object.keys(CB.HOUSE_SPECS).filter((id) => houses.some((h) => h.id === id));
  // v4: bậc vừa dùng .lod1 (sạch) — .lod2 giản lược quá tay, hình nhà nát vụn (kiểm 2026-11-11: dựng nhân bản riêng .lod2 vs .lod1)
  const base = await Promise.all(ids.map(async (id) => (await loadModel(`${id}.vc`)) || (await loadModel(`${id}.lod1`)) || (await loadModel(`${id}.far`)) || (await loadModel(`${id}.lod`)))); // bậc vừa: .vc (màu nướng vào đỉnh, không vỡ mảnh — scripts/meshy-vclod.mjs)
  const base2 = await Promise.all(ids.map((id) => loadModel(`${id}.vc2`))); // bậc xa (~2,5k tam giác, ~70 KB/mẫu) — thay khối hộp tới FAR_VC
  ids.forEach((id, n) => {
    const g = base[n]; if (!g) return;
    const mine = houses.map((h, i) => (h.id === id ? i : -1)).filter((i) => i >= 0);
    const list = mine.map((i) => houses[i]);
    const mid = instancedSet(g, list, { shadow: false, flat: true });
    for (const m of mid.meshes) grp.add(m.im);
    const far2 = base2[n] ? instancedSet(base2[n], list, { shadow: false, flat: true }) : null;
    if (far2) for (const m of far2.meshes) grp.add(m.im);
    models.push({ id, mine, list, local: new Map(mine.map((hi, j) => [hi, j])), close: null, near: null, nearSh: null, gMid: g, mid, far2, want: new Set(), busy: new Set() });
  });
  await warmObject(grp);
  let dirty = false, lastPx = 0, lastPz = 0;
  const pend = new Set();
  // nạp bậc chi tiết cho một mẫu (near = .lod1, close = .mid), dựng bộ nhân bản, hâm nóng rồi mới gắn vào cảnh
  const want = (m, tier) => {
    if (m[tier] || m.busy.has(tier)) return;
    m.busy.add(tier);
    const p = (async () => {
      /* 2026-11-11: nhà gần dùng BẢN GỐC (~80k) — .lod1 / .mid nhìn gần vỡ mảnh, texture kéo sọc (ảnh người chơi); bản rút gọn chỉ còn ở bậc vừa (≥ 36 m) */
      const g = (await loadModel(m.id)) || (await loadModel(`${m.id}.vc`)) || (await loadModel(`${m.id}.lod1`));
      if (!g) return;
      // bóng nhà gần: đổ bằng bản .vc (~9k) VÔ HÌNH thay bản gốc 80k — bóng ở độ phân giải bản đồ bóng không khác,
      // mà lượt bóng bớt ~70k tam giác / nhà (đo 2026-11-12: 9 nhà gần = ~720k tam giác chỉ để vẽ bóng)
      const proxy = tier === 'near' && m.gMid && m.gMid !== g;
      const set = instancedSet(g, m.list, { shadow: !proxy });
      if (proxy) { m.nearSh = instancedSet(m.gMid, m.list, { shadow: true, flat: true }); for (const x of m.nearSh.meshes) { x.im.material = SHADOW_ONLY; x.im.receiveShadow = false; grp.add(x.im); } }
      const tmp = new THREE.Group(); for (const x of set.meshes) tmp.add(x.im);
      await warmObject(tmp);
      for (const x of set.meshes) grp.add(x.im);
      m[tier] = set; dirty = true; update(lastPx, lastPz);
    })().catch((e) => console.warn('[city]', m.id, tier, e)).finally(() => { m.busy.delete(tier); pend.delete(p); });
    pend.add(p);
  };
  let lastX = Infinity, lastZ = Infinity, lastTier = null;
  const update = (px, pz) => {
    lastPx = px; lastPz = pz;
    if (!dirty && Math.hypot(px - lastX, pz - lastZ) < 6) return;
    lastX = px; lastZ = pz;
    let changed = dirty; dirty = false;
    // bậc từng nhà: 0 gần (.lod1, bóng) · 1 vừa (.lod1) · 2 khối xa · 3 ẩn (ngoài FAR_MAX — sương che)
    const low = getModelQuality() === 'low', nr = low ? 24 : NEAR, md = low ? 45 : MID, vd = low ? 140 : FAR_VC, fm = low ? 800 : FAR_MAX; // máy yếu: vòng bản gốc hẹp hơn (24 m) nhưng VẪN có — trước đây 0 m nên đứng sát nhà vẫn thấy bản rút gọn vỡ mảnh
    const tierNow = new Int8Array(houses.length);
    for (let i = 0; i < houses.length; i++) { const d = Math.hypot(houses[i].x - px, houses[i].z - pz); tierNow[i] = d < nr ? 0 : d < md ? 1 : d < vd ? 4 : d < fm ? 2 : 3; }
    if (!lastTier || tierNow.some((t, i) => t !== lastTier[i])) changed = true;
    lastTier = tierNow;
    if (!changed) return;
    const tierOf = lastTier;
    far.write(tierOf);
    for (const m of models) {
      const c = [], n = [], v = [], f2 = [];
      for (const hi of m.mine) { const t = tierOf[hi], j = m.local.get(hi); if (t === -1) c.push(j); else if (t === 0) n.push(j); else if (t === 1) v.push(j); else if (t === 4) f2.push(j); }
      if (c.length) { want(m, 'close'); want(m, 'near'); } else if (n.length) want(m, 'near');
      // bậc chưa có → dồn sang bậc thấp hơn đã có (cùng một bộ nhân bản thì gộp danh sách)
      const out = new Map([[m.mid, []]]); if (m.near) out.set(m.near, []); if (m.close) out.set(m.close, []);
      out.get(m.close || m.near || m.mid).push(...c); out.get(m.near || m.mid).push(...n); out.get(m.mid).push(...v);
      if (m.nearSh) m.nearSh.write(m.near ? n : []);
      if (m.far2) m.far2.write(f2); else out.get(m.mid).push(...f2); // không có .vc2 → bậc vừa
      for (const [set, l] of out) set.write(l);
    }
  };
  update(0, 0);
  // màn nạp chờ bậc chi tiết của các nhà ngay quanh chỗ xuất phát (tối đa 6 giây), còn lại nạp sau
  const settle = (px, pz) => { update(px, pz); return Promise.race([Promise.all([...pend]), new Promise((r) => setTimeout(r, 6000))]); };
  return { update, settle, count: houses.length };
}


// ---------------------------------------------------------------------------
// Tường rào nối mặt phố (vôi trắng, mũ ngói) + nền lát đá trong lô phố
// ---------------------------------------------------------------------------
export function blockWalls(grp) {
  const C = CB.generateCity(), n = C.walls.length;
  const body = new THREE.BoxGeometry(1, CB.WALL_H, CB.WALL_T); body.translate(0, CB.WALL_H / 2, 0);
  const cap = new THREE.BoxGeometry(1, 0.28, CB.WALL_T + 0.36); cap.translate(0, CB.WALL_H + 0.1, 0);
  const mB = new THREE.MeshStandardMaterial({ color: '#e6e0d2', roughness: 0.92 }), mC = new THREE.MeshStandardMaterial({ color: '#39404a', roughness: 0.7 });
  const iB = new THREE.InstancedMesh(body, mB, n), iC = new THREE.InstancedMesh(cap, mC, n);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), P = new THREE.Vector3(), S = new THREE.Vector3();
  C.walls.forEach((w, i) => {
    m4.compose(P.set(w.x, H(w.x, w.z), w.z), q.setFromAxisAngle(up, w.ry), S.set(w.len, 1, 1));
    iB.setMatrixAt(i, m4); iC.setMatrixAt(i, m4);
    addSolidOBB(w.x, w.z, w.len / 2, CB.WALL_T / 2 + 0.1, w.ry);
  });
  for (const o of [iB, iC]) { o.castShadow = true; o.receiveShadow = true; o.computeBoundingSphere(); grp.add(o); }
}
export function pavedBlocks(grp) {
  const C = CB.generateCity(), pos = [], uv = [], idx = [];
  for (const b of C.blocks) {
    const g = BQ.guaById(b.g.id || b.g);
    const cs = [[b.u0, b.v0], [b.u1, b.v0], [b.u1, b.v1], [b.u0, b.v1]].map(([u, v]) => BQ.toWorld(g, u, v));
    const k = pos.length / 3;
    for (const c of cs) { pos.push(c.x, H(c.x, c.z) + 0.035, c.z); uv.push(c.x / 6, c.z / 6); }
    // thứ tự đỉnh theo chiều để mặt hướng lên (+y)
    const cross = (cs[1].x - cs[0].x) * (cs[2].z - cs[0].z) - (cs[1].z - cs[0].z) * (cs[2].x - cs[0].x);
    if (cross < 0) idx.push(k, k + 1, k + 2, k, k + 2, k + 3); else idx.push(k, k + 2, k + 1, k, k + 3, k + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx); geo.computeVertexNormals();
  const mat = stoneMaterial({ seed: 23, rows: 9, repeat: [1, 1], base: '#958d80', roughness: 0.93 });
  mat.polygonOffset = true; mat.polygonOffsetFactor = -1;
  const m = new THREE.Mesh(geo, mat); m.receiveShadow = true; grp.add(m);
}

// ---------------------------------------------------------------------------
// Đèn lồng dọc 8 đại lộ, cây sân trong
// ---------------------------------------------------------------------------
export async function avenueLanterns(grp) {
  const pts = [];
  for (const g of BQ.GUA) for (const u of [...range(CB.RINGS[0].a + 6, 396, 24), ...range(450, 640, 24)]) for (const sv of [-1, 1]) {
    // đại lộ có kênh giữa: cột đèn trên bờ kè (v ±11,9) soi xuống nước; đại lộ thường: mép đường
    const w = BQ.toWorld(g, u, sv * (CN.AVE_CANAL.gua.includes(g.id) ? CN.AVE_CANAL.v1 + 0.9 : CB.GRAND_W / 2 + 0.4));
    pts.push({ x: w.x, y: H(w.x, w.z), z: w.z, ry: Math.atan2(sv * g.dir[0], sv * g.dir[1]) });
  }
  const M = mats();
  const post = new THREE.CylinderGeometry(0.1, 0.13, 3.6, 6); post.translate(0, 1.8, 0);
  const arm = new THREE.BoxGeometry(0.9, 0.08, 0.08); arm.translate(0.4, 3.45, 0);
  const geo = mergeGeometries([post, arm], false);
  const im = new THREE.InstancedMesh(geo, M.wood, pts.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), one = new THREE.Vector3(1, 1, 1);
  pts.forEach((p, i) => { im.setMatrixAt(i, m4.compose(new THREE.Vector3(p.x, p.y, p.z), q.setFromAxisAngle(up, p.ry), one)); addSolidCircle(p.x, p.z, 0.3); });
  im.castShadow = true; grp.add(im);
  // đèn lồng thủ tục (160 chiếc — model thư viện 12k tam giác/chiếc là quá nặng ở số lượng này)
  const items = pts.map((p) => ({ x: p.x + Math.cos(p.ry) * 0.75, y: p.y + 2.75, z: p.z - Math.sin(p.ry) * 0.75 }));
  const lgeo = new THREE.SphereGeometry(0.32, 10, 6); lgeo.scale(1, 1.25, 1);
  const lan = new THREE.InstancedMesh(lgeo, new THREE.MeshStandardMaterial({ color: '#c8341f', emissive: '#ff6a2a', emissiveIntensity: 0.6, roughness: 0.6 }), items.length);
  items.forEach((it, i) => lan.setMatrixAt(i, m4.makeTranslation(it.x, it.y, it.z)));
  grp.add(lan); glowAll(lan, { base: 0.5, night: 2.4, color: '#ff8a3c' });
  for (const it of items) addLight(it.x, it.y + 0.4, it.z, { color: '#ffa04a', power: 1 });
}
export async function courtyardTrees(grp) {
  const C = CB.generateCity(), by = {};
  for (const t of C.trees) (by[t.kind] ||= []).push(t);
  for (const [kind, list] of Object.entries(by)) {
    const s = { lib_willow: 10, tree_pine: 12 }[kind] || 8;
    // bản .lod (~12k tam giác) — bản gốc cây thư viện 70k tam giác/cây quá nặng khi rải khắp thành
    await instanceModel(grp, kind.startsWith('lib_') ? `${kind}.lod` : kind, list.map((t, i) => ({ x: t.x, y: H(t.x, t.z), z: t.z, ry: i * 1.7, s })));
    for (const t of list) addSolidCircle(t.x, t.z, 0.6);
  }
}

// ---------------------------------------------------------------------------
// Công trình mốc + lô chủ đề của cung g
// ---------------------------------------------------------------------------
function plaza(grp, g, r, color = '#9a9183') {
  const lg = new THREE.Group(), w = BQ.toWorld(g, r.u, r.v);
  lg.position.set(w.x, H(w.x, w.z) + 0.03, w.z); lg.rotation.y = axisRy(g);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(r.w, r.d), new THREE.MeshStandardMaterial({ color, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -1 }));
  m.rotation.x = -Math.PI / 2; m.receiveShadow = true; lg.add(m); grp.add(lg);
}
function sign(grp, g, u, v, text, ry) {
  const w = BQ.toWorld(g, u, v), b = nameBoard(text, ry);
  b.position.set(w.x, H(w.x, w.z), w.z); grp.add(b); addSolidCircle(w.x, w.z, 0.3);
}
export async function wardFeatures(grp, g) {
  const C = CB.generateCity();
  const lm = C.landmarks.find((l) => l.g === g.id), th = C.themes.find((t) => t.g === g.id);
  if (lm) {
    plaza(grp, g, lm);
    const w = BQ.toWorld(g, lm.u, lm.v), ry = BQ.faceAvenue(g, lm.v);
    await place(grp, lm.model, { fit: { width: lm.W }, at: { x: w.x, y: H(w.x, w.z), z: w.z, ry } });
    sign(grp, g, lm.u - lm.w / 2 + 3, lm.v - Math.sign(lm.v) * (lm.d / 2 - 1.5), lm.name, BQ.faceAvenue(g, lm.v));
  }
  if (!th) return;
  const R = { u: th.u, v: th.v, w: th.w - 2, d: th.d - 2 };
  const half = (k) => ({ u: R.u + (k ? 1 : -1) * R.w / 4, v: R.v, w: R.w / 2 - 3, d: R.d - 2 });
  switch (th.kind) {
    case 'market': {
      plaza(grp, g, R, '#a39a88');
      const items = [];
      for (let a = 0; a < 5; a++) for (let b = 0; b < 3; b++) {
        const u = R.u - R.w / 2 + 6 + a * ((R.w - 12) / 4), v = R.v - R.d / 2 + 6 + b * ((R.d - 12) / 2);
        const w = BQ.toWorld(g, u, v); items.push({ x: w.x, y: H(w.x, w.z), z: w.z, ry: axisRy(g) + (b % 2 ? Math.PI : 0), s: 5 });
        addSolidOBB(w.x, w.z, 2.4, 2.0, axisRy(g));
      }
      await instanceModel(grp, 'lib_stall_timber', items, { fitKey: 'width' }); // bậc .vc (hasLod) — bản .lod vỡ mảnh
      break;
    }
    case 'fields': field(grp, g, half(0)); field(grp, g, half(1)); break;
    case 'herbs': {
      field(grp, g, { ...half(0), herb: true }); field(grp, g, { ...half(1), herb: true });
      break;
    }
    case 'lake': case 'pond': {
      pond(grp, g, { u: R.u, v: R.v, w: R.w - 2, d: R.d - 2 });
      const w = BQ.toWorld(g, R.u, R.v);
      await place(grp, th.kind === 'lake' ? ['bq_music_pav', 'lib_garden_pav'] : ['lib_garden_pav'], { fit: { width: 13 }, at: { x: w.x, y: H(w.x, w.z), z: w.z, ry: BQ.faceAvenue(g, R.v) } });
      break;
    }
    case 'yard': await yard(grp, g, { u: R.u, v: R.v, w: R.w - 2, d: R.d - 2 }); break;
    case 'arena': plaza(grp, g, R); arena(grp, g, { u: R.u, v: R.v, r: Math.min(R.w, R.d) / 2 - 3 }); break;
    case 'rocks': {
      plaza(grp, g, R, '#8c8577');
      const items = [];
      for (let k = 0; k < 6; k++) { const u = R.u + (k % 3 - 1) * R.w * 0.3, v = R.v + (k < 3 ? -1 : 1) * R.d * 0.22; const w = BQ.toWorld(g, u, v); items.push({ x: w.x, y: H(w.x, w.z) - 0.6, z: w.z, ry: k * 1.3, s: 5 + (k % 3) * 1.5 }); addSolidCircle(w.x, w.z, 2.2 + (k % 3) * 0.6); }
      await instanceModel(grp, 'rock_island', items, { fitKey: 'max' });
      break;
    }
    default: break;
  }
  sign(grp, g, R.u - R.w / 2 + 2, R.v - Math.sign(R.v) * (R.d / 2 - 0.8), th.name, BQ.faceAvenue(g, R.v));
}
