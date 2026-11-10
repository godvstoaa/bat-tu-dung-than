// ============================================================================
//  HUYỀN GIỚI — kiến trúc ĐẠI QUY MÔ theo vùng (docs/DAI-THE-GIOI-DESIGN.md §C1, §F).
//  Quần thể = nền đá bậc cấp khổng lồ + công trình «trùm» siêu chi tiết (Meshy 4K) + điện phụ,
//  tháp, cổng. Công trình trùm chưa có → dùng mô hình thường phóng to (fallback), không lỗi.
//  Mỗi vùng chỉ nạp khi người chơi tới gần (≤ 900 m) — tiết kiệm bộ nhớ iPhone.
// ============================================================================
import * as THREE from 'three';
import * as T from './terrain.js';
import { placeModel, instanceModel, loadModel, hasLod, warmObject, tickLazyLods, modelAvailable } from './assets.js';
import { rng } from './npc.js';
import { stoneTex } from './textures.js';
import { stoneMaterial } from './ground-tex.js';
import { addPlatform, markTerraceEdges } from './obstacles.js';
import * as BQ from './batquai.js';
import { octWall, cityGates, buildDistrict } from './batquai3d.js';
import { outerWall, outerGates, cityHouses, avenueLanterns, courtyardTrees, wardFeatures, blockWalls } from './cityblocks3d.js';
import { cityIdentity } from './cityident3d.js';
import * as CB from './cityblocks.js';
import { HALLS, PLACES } from './world.js';
import { COURT } from './court.js';
import { addLight, glowAll } from './lights.js';
import { addFootprint } from './collide.js';
import * as AK from './archkit.js';
import { riverBridges, bridgePlatforms, deckTop } from './bridges.js';
import { riverBridgeBody } from './river3d.js';
export { roadPath } from './roads.js';

const H = (x, z) => T.heightAt(x, z);
const R = (g) => T.REGIONS.find((r) => r.id === g);
const RA = (g) => { const r = R(g); return [r.x, r.z]; };
const faceTo = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);

// mô hình đầu tiên có sẵn trong danh sách (công trình trùm → mô hình thường)
// (công trình trùm: dò bằng bản .lod nhẹ, bản chi tiết do placeModel chọn theo chất lượng máy)
// chỉ tra danh sách file — trước đây tải nguyên bản .lod để «thử», rồi placeModel lại tải bản .far (tải đôi)
async function firstAvailable(ids) { for (const id of ids) if (await modelAvailable(id)) return id; return null; }
async function place(g, ids, opts) {
  const id = await firstAvailable([].concat(ids));
  const r = id ? await placeModel(g, id, opts) : null;
  if (r && opts.solid !== false) addFootprint(r.obj, { keep: opts.keep || null });
  return r;
}
// cổng: chặn theo hình khối nhưng chừa lối giữa rộng 2·hw (dọc hướng ry)
const corridor = (x, z, ry, hw) => (px, pz) => Math.abs(Math.cos(ry) * (px - x) - Math.sin(ry) * (pz - z)) > hw;
// cây / nhà nhân bản: cắt lát theo mặt đất tại từng bản sao
const solidTrees = (grp) => grp && addFootprint(grp, { hi: 1.3, ground: H, fill: false });

// --- nền đá bậc cấp (procedural): khối đá lát + 3 tầng thu nhỏ + bậc thang chính diện
const stoneMats = new Map();
function stoneMat(rep) {
  const k = Math.round(rep);
  if (!stoneMats.has(k)) stoneMats.set(k, stoneMaterial({ seed: 51, rows: 6, repeat: [k, k], base: '#8d867b' }));
  return stoneMats.get(k);
}
const trimMat = new THREE.MeshStandardMaterial({ color: '#d9a441', metalness: 0.7, roughness: 0.35 });
/**
 * Nền bậc cấp tại (x, z), hướng ry. Đáy chôn xuống điểm thấp nhất của địa hình dưới nền
 * (bám sườn núi), mặt trên ở `top`. Trả độ cao mặt trên.
 */
function terrace(g, { x, z, ry = 0, w, d, levels = 3, rise = 3, stepD = 1.6 }) {
  const hs = [];
  for (let i = -1; i <= 1; i += 0.25) for (let j = -1; j <= 1; j += 0.25) {
    const px = x + Math.cos(ry) * i * w / 2 + Math.sin(ry) * j * d / 2, pz = z - Math.sin(ry) * i * w / 2 + Math.cos(ry) * j * d / 2;
    hs.push(H(px, pz));
  }
  hs.sort((p, q) => p - q);
  const lo = hs[0];
  // đặt nền theo mức 65% (không theo đỉnh cao nhất) — trên sườn núi, phần đất cao hơn sẽ «nuốt» chân nền
  const base = hs[Math.floor(hs.length * 0.65)];
  const top = base + levels * rise;
  const grp = new THREE.Group(); grp.position.set(x, 0, z); grp.rotation.y = ry;
  // chân đá tự nhiên (vách núi gồ ghề) từ dưới đất lên mặt nền — thay khối hộp phẳng
  if (base - lo > 2) {
    const hgt = base - lo + 6;
    const geo = new THREE.CylinderGeometry(0.72, 0.95, 1, 11, 7);
    const r = rng(Math.round(x * 7 + z * 13));
    const pos = geo.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      if (Math.abs(v.y) < 0.499) { const n = 0.82 + r() * 0.3; v.x *= n; v.z *= n; v.y += (r() - 0.5) * 0.08; }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    const rock = new THREE.Mesh(geo, rockMat);
    rock.scale.set(w * 0.62, hgt, d * 0.62);
    rock.position.y = base - hgt / 2 + 0.5;
    rock.castShadow = true; rock.receiveShadow = true; grp.add(rock);
  }
  for (let L = 0; L < levels; L++) {
    const k = 1 - L * 0.12;
    const y0 = L === 0 ? Math.min(lo, base) - 3 : base + L * rise;
    const y1 = base + (L + 1) * rise;
    // tầng dưới cùng chỉ cao vừa phải (phần dưới đã có chân đá)
    const yb = L === 0 ? Math.max(y0, base - 8) : y0;
    const m = new THREE.Mesh(new THREE.BoxGeometry(w * k, y1 - yb, d * k), stoneMat((w * k) / 10));
    m.position.y = (yb + y1) / 2; m.castShadow = true; m.receiveShadow = true; grp.add(m);
    // gờ vàng: viền nhô quanh mép, nằm dưới mặt nền (không phủ cả mặt)
    const trim = new THREE.Mesh(new THREE.BoxGeometry(w * k + 0.6, 0.5, d * k + 0.6), trimMat);
    trim.position.y = y1 - 0.45; grp.add(trim);
  }
  // bậc thang chính diện (phía +Z cục bộ) — dừng khi chạm đất
  const steps = Math.ceil((top - lo + 4) / 0.9);
  for (let s = 0; s < steps; s++) {
    const st = new THREE.Mesh(new THREE.BoxGeometry(w * 0.22, 0.9, stepD), stoneMat(3));
    st.position.set(0, top - 0.45 - s * 0.9, d / 2 + stepD / 2 + s * stepD); st.castShadow = true; st.receiveShadow = true;
    const wp = local(x, z, ry, 0, st.position.z);
    if (st.position.y + 0.45 < H(wp.x, wp.z) - 0.5) break;
    grp.add(st);
  }
  g.add(grp);
  addPlatform(x, z, w * 0.98, d * 0.98, ry, top);
  // viền vách quanh mép nền (như court.js › EDGE) — không trèo lên nóc từ hông;
  // cửa bậc phía trước (rộng w·0,22, nửa w·0,11) vẫn mở để leo lên
  markTerraceEdges(x, z, ry, w * 0.98, d * 0.98, { stairW: w * 0.11 });
  return top;
}
const rockMat = new THREE.MeshStandardMaterial({ map: stoneTex({ seed: 77, tiles: 2, repeat: [3, 6], base: '#6f665a' }), roughness: 0.95, flatShading: true });

// Xoay toạ độ cục bộ (dx, dz) quanh tâm theo ry
const local = (cx, cz, ry, dx, dz) => ({ x: cx + Math.cos(ry) * dx + Math.sin(ry) * dz, z: cz - Math.sin(ry) * dx + Math.cos(ry) * dz });

// Quần thể cung điện: nền + chính điện + 2 điện phụ + 2 tháp + nghi môn phía trước
async function palaceComplex(g, { x, z, ry, scale = 1, main = ['palace_grand', 'hall_main'], tower = ['tower_nine', 'library_tower'], gate = true, stepD = 1.6 }) {
  const W = 150 * scale, D = 120 * scale;
  const top = terrace(g, { x, z, ry, w: W, d: D, levels: 3, rise: 3.2 * scale, stepD });
  const c = local(x, z, ry, 0, -D * 0.12);
  await place(g, main, { fit: { width: 92 * scale }, at: { x: c.x, y: top, z: c.z, ry } });
  for (const sx of [-1, 1]) {
    const s = local(x, z, ry, sx * W * 0.36, D * 0.12);
    await place(g, 'hall_main', { fit: { width: 34 * scale }, at: { x: s.x, y: top, z: s.z, ry: ry - sx * Math.PI / 2 } });
    const t = local(x, z, ry, sx * W * 0.42, -D * 0.38);
    await place(g, tower, { fit: { height: 62 * scale }, at: { x: t.x, y: top, z: t.z, ry } });
  }
  if (gate) {
    const gt = local(x, z, ry, 0, D * 0.62 + 18 * scale);
    await place(g, ['sect_gate_grand', 'gate_sect'], { fit: { width: 46 * scale }, at: { x: gt.x, y: H(gt.x, gt.z), z: gt.z, ry }, keep: corridor(gt.x, gt.z, ry, 5.5 * scale) });
  }
  return top;
}

// --- Huyền Thành = BÁT QUÁI THÀNH (batquai.js / batquai3d.js): tường bát giác + 8 cổng Bát Môn,
// Trung Cung là Sơn Môn, 8 khu theo Hậu Thiên Bát Quái. Vành tường tròn + dãy phố cũ đã thay.
const SPOTS = [
  { at: [0, 0], place: async (g) => {
    octWall(g);
    await cityGates(g);
    // Hậu Sơn: quần thể điện tựa núi sau Sơn Môn (cổng là Hậu Môn của Sơn Môn), bậc ngắn
    await palaceComplex(g, { x: 0, z: -116, ry: 0, scale: 0.6, main: ['cliff_palace', 'palace_grand'], gate: false, stepD: 0.9 });
    await instanceModel(g, 'rock_island', [[150, 170, -120], [-170, 230, 60], [80, 270, 200], [-90, 210, -210]].map(([x, y, z], i) => ({ x, y, z, ry: i * 1.3, s: 60 + i * 14 })), { fitKey: 'max' });
  } },
  { at: RA('tubinh'), place: async (g) => {
    const p = R('tubinh'); const ry = faceTo(p.x, p.z, 0, 0);
    const top = terrace(g, { x: p.x, z: p.z, ry, w: 190, d: 160, levels: 3, rise: 5 });
    await place(g, ['cliff_palace', 'palace_grand', 'hall_main'], { fit: { width: 170 }, at: { x: p.x, y: top, z: p.z, ry } });
    for (const sx of [-1, 1]) { const t = local(p.x, p.z, ry, sx * 88, 40); await place(g, ['tower_nine', 'library_tower'], { fit: { height: 80 }, at: { x: t.x, y: top, z: t.z, ry } }); }
    solidTrees(await instanceModel(g, 'tree_pine', pinesNear(p.x, p.z, 300, 40, 11)));
  } },
  { at: RA('manh'), place: async (g) => { const p = R('manh'); await palaceComplex(g, { x: p.x, z: p.z, ry: faceTo(p.x, p.z, 0, 0), scale: 0.75 }); await place(g, 'cauldron', { fit: { height: 22 }, at: { x: p.x + 70, y: H(p.x + 70, p.z + 60), z: p.z + 60, ry: 0 } }); solidTrees(await instanceModel(g, 'tree_pine', pinesNear(p.x, p.z, 320, 30, 12))); } },
  { at: RA('trichthien'), place: async (g) => {
    const p = R('trichthien'); const ry = faceTo(p.x, p.z, 0, 0);
    const top = terrace(g, { x: p.x, z: p.z, ry, w: 120, d: 120, levels: 3, rise: 4 });
    await place(g, 'observatory', { fit: { width: 90 }, at: { x: p.x, y: top, z: p.z, ry } });
    const t = local(p.x, p.z, ry, 0, -70); await place(g, ['tower_nine', 'library_tower'], { fit: { height: 110 }, at: { x: t.x, y: H(t.x, t.z), z: t.z, ry } });
    solidTrees(await instanceModel(g, 'tree_pine', pinesNear(p.x, p.z, 260, 30, 13)));
  } },
  { at: RA('cungthong'), place: async (g) => {
    const p = R('cungthong');
    for (const [dx, dz] of [[-1, -1], [-1, 0.2], [0.2, -1]]) { const s = shore(p.x, p.z, dx, dz); await place(g, 'tea_pavilion', { fit: { width: 34 }, at: { x: s.x, y: H(s.x, s.z), z: s.z, ry: faceTo(s.x, s.z, p.x, p.z) } }); }
    // (thuyền đứng yên trên hồ → thuyền NPC thật: boats3d.js)
  } },
  { at: RA('thulau'), place: async (g) => {
    const p = R('thulau'); const ry = faceTo(p.x, p.z, 0, 0);
    const top = terrace(g, { x: p.x, z: p.z, ry, w: 110, d: 110, levels: 3, rise: 3.5 });
    await place(g, ['tower_nine', 'library_tower'], { fit: { height: 112 }, at: { x: p.x, y: top, z: p.z, ry } });
    for (const sx of [-1, 1]) { const s = local(p.x, p.z, ry, sx * 42, 30); await place(g, 'library_tower', { fit: { height: 48 }, at: { x: s.x, y: top, z: s.z, ry } }); }
  } },
  { at: RA('phongthuy'), place: async (g) => { const p = R('phongthuy'); await palaceComplex(g, { x: p.x, z: p.z - 40, ry: faceTo(p.x, p.z, 0, 0), scale: 0.6 }); await place(g, 'luopan_stand', { fit: { height: 18 }, at: { x: p.x, y: H(p.x, p.z + 50), z: p.z + 50, ry: faceTo(p.x, p.z + 50, 0, 0) } }); } },
  { at: RA('lichduong'), place: async (g) => { const p = R('lichduong'); await palaceComplex(g, { x: p.x, z: p.z - 40, ry: faceTo(p.x, p.z, 0, 0), scale: 0.6 }); } },
  { at: [T.SKY_ISLAND.x, T.SKY_ISLAND.z], place: async (g) => {
    const s = T.SKY_ISLAND;
    await place(g, ['sky_palace', 'rock_island'], { solid: false, fit: { width: 240 }, at: { x: s.x, y: s.y - 60, z: s.z, ry: 0 } }); // đảo bay ở y 460 trên Ngoại Thành — không chặn mặt đất bên dưới
  } },
];

function shore(cx, cz, dx, dz) {
  const n = Math.hypot(dx, dz);
  for (let d = 0; d < 400; d += 2) { const x = cx + (dx / n) * d, z = cz + (dz / n) * d; if (H(x, z) > T.WATER + 0.8) return { x, z }; }
  return { x: cx, z: cz };
}
function pinesNear(cx, cz, rad, n, seed) {
  const r = rng(seed); const out = [];
  for (let i = 0; i < n * 6 && out.length < n; i++) {
    const a = r() * Math.PI * 2, d = rad * (0.45 + 0.55 * Math.sqrt(r()));
    const x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d, y = H(x, z);
    if (y < T.WATER + 2 || T.slopeAt(x, z) > 0.8) continue;
    out.push({ x, y: y - 0.4, z, ry: r() * 6.28, s: 16 + r() * 12 });
  }
  return out;
}

// Sơn môn lớn trên đường vào 4 tông môn
for (const id of ['tubinh', 'manh', 'trichthien', 'cungthong']) {
  const p = R(id); const n = Math.hypot(p.x, p.z);
  const x = p.x - (p.x / n) * p.r * 1.05, z = p.z - (p.z / n) * p.r * 1.05;
  SPOTS.push({ at: [x, z], place: async (g) => { await place(g, ['sect_gate_grand', 'gate_sect'], { fit: { width: 70 }, at: { x, y: H(x, z), z, ry: faceTo(x, z, 0, 0) }, keep: corridor(x, z, faceTo(x, z, 0, 0), 8) }); } });
}
// Nam Môn Đại Kiều: cầu đá nhiều nhịp qua sông Huyền Hà thẳng Nam cửa Cảnh Môn (bridges.riverBridges) — mặt cầu đi
// được theo dốc, nhịp giữa 40 m, tĩnh không ~30 m; đình nghỉ giữa cầu, cột đèn đá, hai lầu cầu ở hai đầu
for (const b of riverBridges()) SPOTS.push({ at: [b.x, b.z], place: async (g) => {
  const k = AK.kit();
  const along = (t) => ({ x: b.x + b.ax * t, z: b.z + b.az * t });
  g.add(riverBridgeBody(b, { stone: k.pave, coping: k.stone }, (t) => { const p = along(t); return H(p.x, p.z); }));
  for (const p of bridgePlatforms(b)) addPlatform(p.x, p.z, p.w, p.d, p.ry, p.top, p.top - b.thick);
  const ry = Math.atan2(b.ax, b.az);
  { const c = along(0), y = deckTop(b, 0); const { base, shell } = AK.hall({ w: 9, d: 10, h: 4.2, plinth: 0.25, open: true, storeys: 1, roof: 'green' }); for (const o of [base, shell]) { o.position.set(c.x, y, c.z); o.rotation.y = ry; g.add(o); } }
  for (const sg of [-1, 1]) { const t = sg * (b.L - 6), c = along(t), y = deckTop(b, t); const { base, shell } = AK.gateHouse({ w: b.W + 2, d: 6, h: 5, plinth: 0.2, roof: 'grey', main: true }); for (const o of [base, shell]) { o.position.set(c.x, y, c.z); o.rotation.y = ry; g.add(o); } }
  for (let t = -b.L + 14; t < b.L - 12; t += 18) for (const sn of [-1, 1]) {
    if (Math.abs(t) < 8) continue;
    const c = along(t), x = c.x + sn * (b.W / 2 - 0.5) * b.az, z = c.z - sn * (b.W / 2 - 0.5) * b.ax, y = deckTop(b, t) + 1.4;
    addLight(x, y + 1.4, z, { color: '#ffb35c', power: 0.9 });
  }
} });

// Bàn sảnh nghề (world.js › HALLS): án thư quay về phía thành, đình gỗ che phía sau, bonsai bên cạnh,
// trạm xe kiệu + ngựa (đi nhanh) — model thư viện CC0 (assets-meshy/library, đóng gói lib_*)
for (const h of HALLS) {
  const { x, z } = h.world;
  const ry = faceTo(x, z, 0, 0);
  const at = (dx, dz) => { const p = local(x, z, ry, dx, dz); return { x: p.x, y: H(p.x, p.z), z: p.z, ry }; };
  SPOTS.push({ at: [x, z], place: async (g) => {
    addFootprint((await placeModel(g, 'scholar_desk', { fit: { width: 3.2 }, at: at(0, -1.5) }))?.obj);
    await place(g, 'lib_wood_pavilion', { fit: { width: 7 }, at: at(0, -3.4) });
    await place(g, 'lib_bonsai', { fit: { height: 2.4 }, at: at(3.6, -1.2) });
    if (h.id === 'thuvien') for (const sx of [-1, 1]) await place(g, 'lib_bookshelf', { fit: { height: 3.2 }, at: at(sx * 4.5, -3.5) });
    if (h.region !== 'thanh') {
      await place(g, 'lib_cart', { fit: { width: 4.2 }, at: { ...at(-9, 6), ry: ry + Math.PI / 2 } });
      await place(g, 'lib_horse', { fit: { height: 2.2 }, at: { ...at(-9, 10.5), ry: ry + Math.PI / 2 } });
    }
    await lanternPosts(g, [at(-2.6, 2.6), at(2.6, 2.6)]);
  } });
}

// Cột đèn lồng: cột gỗ thủ công + đèn lồng thư viện (bản lod nhẹ, nhân bản tức thời)
const postMat = new THREE.MeshStandardMaterial({ color: '#4a2c20', roughness: 0.8 });
const postGeo = new THREE.CylinderGeometry(0.09, 0.12, 3.4, 8); postGeo.translate(0, 1.7, 0);
const armGeo = new THREE.BoxGeometry(0.9, 0.08, 0.08); armGeo.translate(0.4, 3.3, 0);
async function lanternPosts(g, pts) {
  for (const p of pts) { const a = new THREE.Mesh(postGeo, postMat); a.position.set(p.x, p.y, p.z); a.castShadow = true; g.add(a); const b = new THREE.Mesh(armGeo, postMat); b.position.copy(a.position); b.rotation.y = p.ry || 0; g.add(b); addFootprint(a, { hi: 1.6 }); }
  const items = pts.map((p) => ({ x: p.x + Math.cos(p.ry || 0) * 0.75, y: p.y + 2.25, z: p.z - Math.sin(p.ry || 0) * 0.75, ry: p.ry || 0, s: 0.95 }));
  const lan = await instanceModel(g, 'lib_lantern.lod', items);
  if (lan) glowAll(lan, { base: 0.5, night: 2.4, color: '#ff8a3c' });
  // mỗi đèn lồng là một nguồn sáng (render3d gán đèn điểm cho các đèn gần người chơi)
  for (const it of items) addLight(it.x, it.y + 0.4, it.z, { color: '#ffa04a', power: 1 });
}

// Phố chợ + cảnh quan bằng model thư viện (đặt thêm, không thay hệ cũ — thiếu file thì bỏ qua)
SPOTS.push({ at: [0, 60], place: async (g) => {
  // quầy chợ hai bên đại lộ Nam, chừa giữa đường đi
  for (let z = 80; z <= 132; z += 22) for (const sx of [-1, 1]) await place(g, 'lib_stall_timber', { fit: { width: 5.5 }, at: { x: sx * 10.5, y: H(sx * 10.5, z), z: z + (sx > 0 ? 11 : 0), ry: sx > 0 ? -Math.PI / 2 : Math.PI / 2 } });
  // cột đèn dọc đại lộ, cách 12 m
  const posts = [];
  for (let z = 74; z <= 134; z += 12) for (const sx of [-1, 1]) posts.push({ x: sx * 6.5, y: H(sx * 6.5, z), z, ry: sx > 0 ? Math.PI : 0 });
  await lanternPosts(g, posts);
  // cổng chào giữa đại lộ + trạm xe ngoài cửa thành
  await place(g, 'lib_paifang', { fit: { width: 26 }, at: { x: 0, y: 0, z: 104, ry: 0 }, keep: corridor(0, 104, 0, 4) });
  await place(g, 'lib_cart', { fit: { width: 4.2 }, at: { x: 10, y: H(10, 180), z: 180, ry: Math.PI / 2 } });
  await place(g, 'lib_horse', { fit: { height: 2.2 }, at: { x: 10, y: H(10, 184.5), z: 184.5, ry: Math.PI / 2 } });
} });
// Ngoại Thành (cityblocks.js / cityblocks3d.js): tường bát giác 420 m + 8 cổng lớn, ~1.800 nhà phố 3 tầng chi tiết,
// đèn lồng 8 đại lộ, cây sân trong; mỗi cung một công trình mốc + lô chủ đề (vùng nạp riêng)
SPOTS.push({ at: [0, 0], place: async (g) => {
  outerWall(g, CB.TRUNG_A, 24); // tường Trung Thành (tường ngoài cũ) — cao 24 m
  outerWall(g, CB.OUTER_A, 34); // tường Ngoại Thành quanh vành phủ — hùng thành 34 m
  blockWalls(g);
  await outerGates(g, CB.TRUNG_A, 24);
  await outerGates(g, CB.OUTER_A, 34);
  const hs = await cityHouses(g);
  LOD_UPDATERS.push(hs.update);
  await hs.settle(3, 42); // nhà quanh sân Sơn Môn (chỗ xuất phát) có bậc chi tiết trước khi mở màn
  await cityIdentity(g); // nền lát theo cung, biển tiệm, biển nhà rao bán, đồ bày phố, kênh Khảm, 16 cổng phường
  await avenueLanterns(g);
  await courtyardTrees(g);
} });
for (const gg of BQ.GUA) { const c = BQ.toWorld(gg, 528, 0); SPOTS.push({ at: [c.x, c.z], place: (g) => wardFeatures(g, gg) }); }
for (const gg of BQ.GUA) {
  const c = gg.id === 'kan' ? { x: 0, z: -74 } : BQ.toWorld(gg, 118, 0);
  SPOTS.push({ at: [c.x, c.z], place: async (g) => {
    await buildDistrict(g, gg, { lanternPosts, solidTrees });
    if (g.userData.lod) LOD_UPDATERS.push(g.userData.lod);
  } });
}
// Cùng Thông Hồ: đình vườn bên Sảnh Điều Hậu, liễu + đào ven hồ
SPOTS.push({ at: [560 * T.SCALE, 560 * T.SCALE], place: async (g) => {
  { const x = 462 * T.SCALE, z = 402 * T.SCALE, c = R('cungthong'); await place(g, 'lib_garden_pav', { fit: { width: 16 }, at: { x, y: H(x, z), z, ry: faceTo(x, z, c.x, c.z) } }); }
  const p = R('cungthong');
  const ring = []; for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; const s = shore(p.x, p.z, Math.cos(a), Math.sin(a)); ring.push({ x: s.x, y: H(s.x, s.z), z: s.z, ry: a, s: i % 3 === 0 ? 10 : 13 }); }
  solidTrees(await instanceModel(g, 'lib_willow', ring.filter((_, i) => i % 3 !== 0)));
  solidTrees(await instanceModel(g, 'lib_blossom', ring.filter((_, i) => i % 3 === 0)));
} });
// Trích Thiên: tháp năm tầng bên đài quan tinh · chân Tử Bình: nhà trên núi cạnh đường đá
SPOTS.push({ at: RA('trichthien'), place: async (g) => {
  const p = R('trichthien'); const ry = faceTo(p.x, p.z, 0, 0); const t = local(p.x, p.z, ry, 75, 20);
  await place(g, 'lib_pagoda5', { fit: { height: 52 }, at: { x: t.x, y: H(t.x, t.z), z: t.z, ry } });
} });
SPOTS.push({ at: [-420 * T.SCALE, -380 * T.SCALE], place: async (g) => {
  const x = -430 * T.SCALE, z = -330 * T.SCALE; await place(g, 'lib_mtn_house', { fit: { width: 34 }, at: { x, y: H(x, z), z, ry: faceTo(x, z, 0, 0) } });
} });

// ---------------------------------------------------------------------------
// Địa danh mới (world.js › PLACES — toạ độ là nguồn duy nhất, trùng chỗ mô hình).
//  · Lão Tùng gác cổng Sơn Môn: cổng tại (0, z1+1.2) (sect.js › gate_sect, trùng
//    render3d › GATE_SM — bark tutorial kích trong bán kính 16 m) → ông đứng bên
//    phải lối vào, lệch trục 6 m, lùi 4,8 m (ngoài hành lang cổng |x| ≤ 3,4 và
//    tường son z ≤ z1+1,4; cách hàng đèn z=74 > 1,5 m), người thật cao ~1,9 m,
//    solid chỉ thân nhỏ để khách lại gần đọc bark.
//  · Am Vân Cốc: nhà núi sau Hậu Sơn, cạnh quần thể cliff_palace (0,-116) —
//    mép nhà cách nền điện ~5 m, không đè nền bậc (x ≤ -45,5 · z ≤ -152,5);
//    bàn thoại Khổng Tiên Sinh (scholar_desk) 5 m trước mặt am + chiếu cói
//    ngồi đàm đạo (không solid, đi đè được) + biển tên địa danh.
// ---------------------------------------------------------------------------
const boardMat = new THREE.MeshStandardMaterial({ color: '#4a2c20', roughness: 0.8 });
function nameBoard(text, ry = 0) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 160;
  const t2 = c.getContext('2d');
  t2.fillStyle = '#33210f'; t2.fillRect(0, 0, 512, 160);
  t2.strokeStyle = '#d9a441'; t2.lineWidth = 10; t2.strokeRect(8, 8, 496, 144);
  t2.fillStyle = '#f3df9a'; t2.textAlign = 'center'; t2.textBaseline = 'middle';
  t2.font = `bold ${Math.min(88, Math.floor(3800 / Math.max(1, text.length)))}px serif`;
  t2.fillText(text, 256, 84);
  const tex = new THREE.CanvasTexture(c); tex.anisotropy = 4;
  const grp = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 2.1, 8), boardMat); post.position.y = 1.05; post.castShadow = true;
  const card = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.75), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 })); card.position.y = 2.15; card.castShadow = true;
  grp.add(post, card); grp.rotation.y = ry;
  return grp;
}
// Lão Tùng tại cổng Sơn Môn
const laotung = PLACES.find((q) => q.id === 'laotung');
SPOTS.push({ at: [laotung.world.x, laotung.world.z], place: async (g) => {
  const gz = COURT.z1 + 1.2, { x, z } = laotung.world;
  const ry = faceTo(x, z, 0, gz + 12); // quay mặt ra đường, nhìn dọc lối vào phía Nam
  await place(g, 'lib_ong_lao', { fit: { width: 1.2 }, at: { x, y: H(x, z), z, ry } });
  const bx = x + 1.9, bz = z - 1.6; // biển tên sau vai, tránh lối đi
  const board = nameBoard(laotung.name, ry); board.position.set(bx, H(bx, bz), bz); g.add(board);
  addFootprint(board, { hi: 1.6 });
} });
// Am Vân Cốc + bàn thoại Khổng Tiên Sinh
const amvancoc = PLACES.find((q) => q.id === 'amvancoc');
SPOTS.push({ at: [amvancoc.world.x, amvancoc.world.z], place: async (g) => {
  const { x, z } = amvancoc.world;
  const ry = faceTo(x, z, 0, -76); // quay nhà về phía bậc điện Hậu Sơn (lối tiếp khách)
  await place(g, 'lib_mtn_house', { fit: { width: 21 }, at: { x, y: H(x, z), z, ry } });
  const fx = x + Math.sin(ry) * 11.5, fz = z + Math.cos(ry) * 11.5; // ~5 m tính từ mép nhà
  await place(g, 'scholar_desk', { fit: { width: 3.2 }, at: { x: fx, y: H(fx, fz), z: fz, ry } });
  // chiếu cói ngay cạnh bàn: mặt phẳng màu rơm sát đất (+0,02 chống z-fighting), không solid
  const mx = fx + Math.sin(ry) * 2.2, mz = fz + Math.cos(ry) * 2.2;
  const co = new THREE.PlaneGeometry(2.2, 3.2); co.rotateX(-Math.PI / 2);
  const chieu = new THREE.Mesh(co, new THREE.MeshStandardMaterial({ color: '#c9a86a', roughness: 0.95 }));
  chieu.position.set(mx, H(mx, mz) + 0.02, mz); chieu.rotation.y = ry; chieu.receiveShadow = true; g.add(chieu);
  const px = fx + Math.cos(ry) * 2.8, pz = fz - Math.sin(ry) * 2.8; // biển tên bên phải bàn
  const board = nameBoard(amvancoc.name, ry); board.position.set(px, H(px, pz), pz); g.add(board);
  addFootprint(board, { hi: 1.6 });
} });

// Đường đá: roads.js — vẽ thẳng vào địa hình (world3d.js), không còn dải mesh nổi.

const LOD_UPDATERS = [];
// tầm nạp vùng khi đang chơi (vùng xa chỉ có bản .lod nhẹ, chi tiết nạp lười — assets.tickLazyLods)
const LOAD_R = 1500; // thế giới v3 (×1,6): vùng tông môn cách tâm ~1.000–1.300 m

export function createLandmarks(scene) {
  const root = new THREE.Group(); root.name = 'landmarks'; scene.add(root);
  const done = new Set();
  let last = 0; const born = performance.now();
  // khởi động nạp các vùng trong tầm; trả lời hứa của những vùng vừa khởi động
  const start = (px, pz, R) => {
    const ps = [];
    SPOTS.forEach((s, i) => {
      if (done.has(i) || Math.hypot(px - s.at[0], pz - s.at[1]) > R) return;
      done.add(i);
      // dựng xong + hâm nóng (biên dịch shader, đẩy texture) rồi MỚI đưa vào cảnh → vùng mới hiện ra
      // không làm khựng khung hình (root ở gốc toạ độ nên ma trận thế giới không đổi khi gắn sau)
      const g = new THREE.Group();
      ps.push(s.place(g).then(() => warmObject(g)).then(() => root.add(g)).catch((e) => { console.warn('[landmarks]', e); root.add(g); }));
    });
    return ps;
  };
  return {
    root,
    /** Màn nạp: dựng trước các vùng gần (≤ R m) — vùng xa tiếp tục nạp nền khi đã vào game. */
    prepare(px, pz, R = 320) { return Promise.all(start(px, pz, R)); },
    update(px, pz, now = performance.now()) {
      if (now - last < (now - born < 20000 ? 400 : 1500)) return; last = now; // 20 giây đầu: nạp bậc chi tiết dồn dập
      for (const u of LOD_UPDATERS) u(px, pz);
      tickLazyLods(px, pz);
      start(px, pz, LOAD_R);
    },
  };
}
