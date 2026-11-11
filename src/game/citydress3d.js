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
import { placeModel, getModelQuality, loadModel } from './assets.js';
import { GUA, toWorld } from './batquai.js';
import { seasonOf } from './season.js';

const R_BUILD = 300, R_SHOW = 320, R_NEAR = 150; // ô dựng / hiện quanh người chơi · cây, sạp, biển hiệu chỉ hiện trong 150 m (§3.11)
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const rnd01 = (s) => (hash(s) % 10007) / 10007;
const H = (x, z) => heightAt(x, z);

// màu biển hiệu theo nghề (§3.9)
const TRADE = { moc: '#8a5a2e', gom: '#b86a3a', den: '#c8341f', thuhoa: '#2e4a6a', hoavien: '#c25a8a', phongthuy: '#3a6a4a', huong: '#7a2a2a', tratrang: '#4a7a3a', duoc: '#2a6a5a', loren: '#3a3a3a', tuu: '#a8231e', tralau: '#7a4a1e', dichtram: '#6a4a8a', namon: '#1e1e3a' };
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
  const cone = new THREE.ConeGeometry(1, 1, 7); cone.translate(0, 0.5, 0); // tầng tùng (đáy ở 0)
  const stalk = new THREE.CylinderGeometry(0.05, 0.07, 1, 5); stalk.translate(0, 0.5, 0); // thân tre
  const droop = new THREE.DodecahedronGeometry(1, 0); droop.scale(1, 1.25, 1); droop.translate(0, -0.35, 0); // tán liễu rủ
  const rope = new THREE.BoxGeometry(1, 0.035, 0.035);
  const lanternS = new THREE.SphereGeometry(0.2, 6, 4); lanternS.scale(1, 1.3, 1);
  return { plane, trunk, crown, cone, stalk, droop, wall, well, shedAll, slant, postPair, goods, sign, lamp, post, lantern, rope, lanternS };
})();
const M = (() => {
  const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.9, ...o });
  const lan = std({ color: '#c8341f', emissive: '#ff6a2a', emissiveIntensity: 0.6, roughness: 0.6 });
  return {
    pave: std({ color: '#ffffff', roughness: 0.95 }), court: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.97 }), vc: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88 }),
    wall: std({ color: '#e6e0d2', roughness: 0.92 }), cap: std({ color: '#39404a', roughness: 0.7 }),
    stone: std({ color: '#8f8a80' }), wood: std({ color: '#6a4a30', roughness: 0.8 }), roofTile: std({ color: '#3d4048', roughness: 0.75 }),
    cloth: std({ color: '#ffffff', roughness: 0.8, side: THREE.DoubleSide }), goods: std({ color: '#ffffff', roughness: 0.85 }), sign: std({ color: '#ffffff', roughness: 0.6 }),
    lantern: lan,
  };
})();
glowAll(new THREE.Mesh(G.lantern, M.lantern), { base: 0.5, night: 2.4, color: '#ff8a3c' });
// GIÓ (shader, không tốn CPU — vật liệu cây windMat): một uniform thời gian chung
const WIND = { value: 0 };
function tickWind() { WIND.value = performance.now() / 1000; }

/** gom thể hiện theo khuôn rồi tạo InstancedMesh (một lệnh vẽ / khuôn / ô) */
function batch() {
  const by = new Map(), trees = [];
  const add = (geo, mat, x, y, z, ry = 0, sx = 1, sy = 1, sz = 1, color = null) => { const k = `${geo.uuid}|${mat.uuid}`; let b = by.get(k); if (!b) by.set(k, (b = { geo, mat, list: [] })); b.list.push([x, y, z, ry, sx, sy, sz, color]); };
  const build = (grp, { shadow = false } = {}) => {
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), P = new THREE.Vector3(), S = new THREE.Vector3(), c = new THREE.Color();
    const near = new THREE.Group(); near.name = 'near'; grp.add(near); grp.userData.near = near; // đồ nhỏ: ẩn khi ô xa hơn R_NEAR
    const SMALL = new Set([BAMBOO.culm, BAMBOO.leaf, G.slant, G.postPair, G.goods, G.sign, G.shedAll, G.lamp, G.rope, G.lanternS]);
    for (const { geo, mat, list } of by.values()) {
      const im = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach(([x, y, z, ry, sx, sy, sz, color], i) => { im.setMatrixAt(i, m4.compose(P.set(x, y, z), q.setFromAxisAngle(up, ry), S.set(sx, sy, sz))); if (color) im.setColorAt(i, c.set(color)); });
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
      if (geo === BAMBOO.culm || geo === BAMBOO.leaf) im.onBeforeRender = tickWind; // gió: cập nhật thời gian một lần / khung
      im.castShadow = shadow && geo === BAMBOO.culm; /* chỉ cây đổ bóng — nền / biển / sạp thì không (lượt bóng nhân đôi lệnh vẽ) */ im.receiveShadow = true; im.computeBoundingSphere(); (SMALL.has(geo) ? near : grp).add(im);
    }
  };
  return { add, build, trees };
}

// nhà dựng theo ô (city4.renderHouses có model, chiều cao, khung lô)
let BYCELL = null;
const housesOfCell = (id) => {
  if (!BYCELL) { BYCELL = new Map(); for (const h of renderHouses()) { const c = String(h.key).split(':')[0]; let l = BYCELL.get(c); if (!l) BYCELL.set(c, (l = [])); l.push(h); } }
  return BYCELL.get(id) || [];
};

// ============================================================================
//  CÂY v5.2 (docs/CAY-QUAN-MANIFEST.md §2) — model cây Meshy thật (cành, thân, tán), không còn khối đa giác:
//    gần ≤ 45 m: <id>.vc (~4–5k tam giác, màu nướng từ texture) · 45–150 m: <id>.vc2 (~1k) · xa hơn: ẩn (§3.11)
//    8 loài theo chỗ trồng (hoè / du ở đại lộ, đào / anh đào / phong / tùng / tre ở sân vườn, liễu quanh quảng trường)
//    — hoè, du, phong là model đào / anh đào nhuộm lại màu tán (đỉnh sáng = tán; thân sẫm giữ nguyên)
//    gió: shader đỉnh (biên độ ~2 % chiều cao từ 35 % thân trở lên), CPU chỉ cập nhật một uniform thời gian
// ============================================================================
export const TREE_SP = {
  // w: bề ngang / tự nhiên · thin: hệ số thân ở gốc (co về tâm thân) · lift: tán bắt đầu ở tỉ lệ chiều cao này
  hoe: { id: 'tree_peach', re: 'green', h: [7, 10], w: 1.15, thin: 0.4, lift: 0.42 },
  du: { id: 'lib_blossom', re: 'deep', h: [8, 11], w: 1.1, thin: 0.45, lift: 0.4 },
  dao: { id: 'tree_peach', re: null, h: [4, 5.5], w: 1.05, thin: 0.65, lift: 0.34 },
  anhdao: { id: 'lib_blossom', re: null, h: [4.5, 6], w: 1.05, thin: 0.65, lift: 0.34 },
  phong: { id: 'lib_blossom', re: 'autumn', h: [5, 7], w: 1.05, thin: 0.6, lift: 0.36 },
  lieu: { id: 'lib_willow', re: null, h: [6, 8.5], w: 1, thin: 0.6, lift: 0.36 },
  tung: { id: 'lib_bonsai', re: null, h: [6, 9], w: 1.05, thin: 0.6, lift: 0.34 },
};
const TREE_TIERS = [['hi', 'vch', 16], ['near', 'vc', 45], ['far', 'vc2', 150]]; // [bậc, đuôi file, bán kính tới (m)] — máy yếu nhân TREE_LOW
const TREE_LOW = 0.65;
const GARDEN_SP = [['dao', 0.2], ['anhdao', 0.16], ['phong', 0.14], ['tung', 0.14], ['tre', 0.14], ['hoe', 0.12], ['lieu', 0.1]];
function speciesOf(seed, table = GARDEN_SP) { const r = rnd01(seed + 'sp'); let a = 0; for (const [k, p] of table) { a += p; if (r <= a) return k; } return table[0][0]; }
const RECOLOR = { green: [0.25, 0.42, 0.22, 0.46], deep: [0.31, 0.38, 0.16, 0.36], autumn: [0.045, 0.72, 0.36, 0.58] }; // [sắc, bão hoà, sáng thấp, sáng cao] (sRGB)
// khuôn cây: tải <id>.<bậc>, gộp lưới, gốc thân về (0,0,0), cao = 1 (gió / co giãn theo mét), nhuộm tán nếu cần
const TGEO = new Map();
export function treeGeo(sp, tier) {
  const T = TREE_SP[sp], k = `${T.id}|${T.re}|${tier}`;
  if (TGEO.has(k)) return TGEO.get(k);
  const pr = loadModel(`${T.id}.${tier}`).then((g) => {
    if (!g) return null;
    const parts = []; g.scene.updateMatrixWorld(true);
    const f32 = (a, n) => { const o = new Float32Array(a.count * n); for (let i = 0; i < a.count; i++) { o[i * n] = a.getX(i); o[i * n + 1] = a.getY(i); if (n > 2) o[i * n + 2] = a.getZ(i); } return new THREE.BufferAttribute(o, n); };
    g.scene.traverse((o) => {
      if (!o.isMesh) return;
      const src = o.geometry, out = new THREE.BufferGeometry();
      out.setAttribute('position', f32(src.attributes.position, 3));
      out.setAttribute('color', src.attributes.color ? f32(src.attributes.color, 3) : new THREE.BufferAttribute(new Float32Array(src.attributes.position.count * 3).fill(0.5), 3));
      if (src.index) out.setIndex(new THREE.BufferAttribute(Uint32Array.from(src.index.array), 1));
      out.applyMatrix4(o.matrixWorld); parts.push(out);
    });
    if (!parts.length) return null;
    const geo = parts.length > 1 ? mergeGeometries(parts) : parts[0];
    geo.computeBoundingBox();
    const b = geo.boundingBox, ht = b.max.y - b.min.y || 1, P = geo.attributes.position;
    let sx = 0, sz = 0, n = 0; for (let i = 0; i < P.count; i++) if (P.getY(i) < b.min.y + ht * 0.06) { sx += P.getX(i); sz += P.getZ(i); n++; } // tâm gốc thân
    geo.translate(-(n ? sx / n : (b.min.x + b.max.x) / 2), -b.min.y, -(n ? sz / n : (b.min.z + b.max.z) / 2)); geo.scale(1 / ht, 1 / ht, 1 / ht);
    // «cây hoá» model dáng bonsai: thân thon lại (co về tâm thân từng lát cao) và vươn cao (tán bắt đầu ở `lift` thay vì 30 %)
    // — phóng nguyên một cây cảnh lên 8 m thì gốc to 1,5 m, tán sát đất (ảnh 2026-11-12)
    if (T.thin < 1 || T.lift) {
      const C = geo.attributes.color, NS = 24, cx = new Float32Array(NS), cz = new Float32Array(NS), cn = new Float32Array(NS), col = new THREE.Color(), hsl = {};
      for (let i = 0; i < P.count; i++) { col.setRGB(C.getX(i), C.getY(i), C.getZ(i)); col.getHSL(hsl, THREE.SRGBColorSpace); if (hsl.l > 0.45) continue; const s = Math.min(NS - 1, Math.floor(P.getY(i) * NS)); cx[s] += P.getX(i); cz[s] += P.getZ(i); cn[s]++; }
      let px = 0, pz = 0; for (let s = 0; s < NS; s++) { if (cn[s]) { px = cx[s] / cn[s]; pz = cz[s] / cn[s]; } cx[s] = px; cz[s] = pz; } // lát không có thân: lấy tâm lát dưới
      const lift = T.lift || 0.3, thin = T.thin ?? 1;
      for (let i = 0; i < P.count; i++) {
        const y = P.getY(i), s = Math.min(NS - 1, Math.floor(y * NS)), t = Math.min(1, Math.max(0, (y - 0.22) / 0.33)), k = thin + (1 - thin) * t * t * (3 - 2 * t);
        const ny = y < 0.3 ? y * (lift / 0.3) : lift + (y - 0.3) * ((1 - lift) / 0.7);
        P.setXYZ(i, cx[s] + (P.getX(i) - cx[s]) * k, ny, cz[s] + (P.getZ(i) - cz[s]) * k);
      }
    }
    const LEAF = new Uint8Array(P.count); { const C = geo.attributes.color, col = new THREE.Color(), hsl = {}; for (let i = 0; i < P.count; i++) { col.setRGB(C.getX(i), C.getY(i), C.getZ(i)); col.getHSL(hsl, THREE.SRGBColorSpace); LEAF[i] = hsl.l > 0.45 || (hsl.s > 0.25 && hsl.h > 0.12 && hsl.h < 0.45 && hsl.l > 0.2) ? 1 : 0; } } // tán: sáng (hoa) hoặc xanh lá
    if (T.re) {
      const t = RECOLOR[T.re], c = geo.attributes.color, col = new THREE.Color(), hsl = {};
      for (let i = 0; i < c.count; i++) { col.setRGB(c.getX(i), c.getY(i), c.getZ(i)); col.getHSL(hsl, THREE.SRGBColorSpace); if (hsl.l > 0.45) { const q = Math.min(1, (hsl.l - 0.45) / 0.5); col.setHSL(t[0] + (q - 0.5) * 0.04, t[1], t[2] + (t[3] - t[2]) * q, THREE.SRGBColorSpace); c.setXYZ(i, col.r, col.g, col.b); } }
    }
    geo.computeVertexNormals();
    geo.setAttribute('leafm', new THREE.BufferAttribute(Float32Array.from(LEAF), 1)); // mặt nạ tán (đổi màu theo mùa — G-5.3)
    // pháp tuyến cầu cho tán (kỹ thuật cây stylized — CAY-QUAN-MANIFEST §1): lá hướng ra từ tâm tán → tán sáng như một khối
    // mềm, không còn từng mặt tam giác gãy sáng tối khi đứng gần. Thân giữ pháp tuyến thật.
    {
      const N = geo.attributes.normal, leaf = LEAF;
      let ax = 0, ay = 0, az = 0, an = 0;
      for (let i = 0; i < P.count; i++) { if (P.getY(i) < 0.3) leaf[i] = 0; if (leaf[i]) { ax += P.getX(i); ay += P.getY(i); az += P.getZ(i); an++; } }
      if (an) { ax /= an; ay /= an; az /= an; }
      const v = new THREE.Vector3(), w = new THREE.Vector3();
      for (let i = 0; i < P.count; i++) {
        if (!leaf[i]) continue;
        v.set(P.getX(i) - ax, (P.getY(i) - ay) * 1.3 + 0.08, P.getZ(i) - az).normalize();
        w.set(N.getX(i), N.getY(i), N.getZ(i)); if (w.dot(v) < 0) w.negate();
        v.multiplyScalar(0.78).addScaledVector(w, 0.22).normalize(); N.setXYZ(i, v.x, v.y, v.z);
      }
    }
    // điểm chùm lá (thẻ lá gần — §2.1): lấy mẫu đỉnh tán rải đều (cách nhau ≥ 0,1 chiều cao), giữ màu tán tại đó
    {
      const C = geo.attributes.color, pts = [], cols = [], K = 40;
      for (let pass = 0; pass < 3 && pts.length / 3 < K; pass++) {
        const minD = [0.13, 0.09, 0.06][pass];
        for (let i = (pass * 7919) % 97; i < P.count && pts.length / 3 < K; i += 97) {
          if (!LEAF[i]) continue;
          const x = P.getX(i), y = P.getY(i), z = P.getZ(i);
          let ok = true; for (let j = 0; j < pts.length; j += 3) if (Math.hypot(pts[j] - x, pts[j + 1] - y, pts[j + 2] - z) < minD) { ok = false; break; }
          if (ok) { pts.push(x, y, z); cols.push(C.getX(i), C.getY(i), C.getZ(i)); }
        }
      }
      // màu thẻ: kéo về màu trung bình tán (mẫu rơi vào đỉnh tối ở lõi tán → thẻ đen) và sáng hơn chút (texture lá xám 170–255)
      const m = [0, 1, 2].map((a) => { let v = 0; for (let j = a; j < cols.length; j += 3) v += cols[j]; return v / (cols.length / 3 || 1); });
      for (let j = 0; j < cols.length; j++) cols[j] = (cols[j] * 0.4 + m[j % 3] * 0.6) * 1.25;
      geo.userData.cards = { pos: Float32Array.from(pts), col: Float32Array.from(cols) };
    }
    geo.computeBoundingSphere();
    return geo;
  }).catch(() => null);
  TGEO.set(k, pr); return pr;
}
// vật liệu cây: màu đỉnh + gió (uniform thời gian chung, cập nhật một lần / khung khi có cây được vẽ)
// MÙA (goal G-5.3, CAY-QUAN-MANIFEST §5): theo tiết khí giờ Việt Nam — Lập xuân 4/2 · Lập hạ 5/5 · Lập thu 7/8 · Lập đông 7/11.
// Chỉ đổi uniform màu tán + tỉ lệ lá rụng (không thêm tam giác). Đào / mai giữ hoa suốt đông → Tết (đào Tết, mai Tết);
// đông Việt Nam không trụi hẳn: rụng ≤ 30 %. Thử mùa khác: localStorage 'huyenquan:season' = xuan | ha | thu | dong.
export { seasonOf };
const SEASON_LOOK = { // loài → mùa → [màu tán sRGB | null = màu model, độ pha, tỉ lệ lá rụng]
  dao: { xuan: [null, 0, 0], ha: ['#5e8a3a', 0.85, 0], thu: ['#9a9a40', 0.55, 0.1], dong: [null, 0, 0] },
  anhdao: { xuan: [null, 0, 0], ha: ['#5a8a40', 0.85, 0], thu: ['#c8783a', 0.6, 0.1], dong: [null, 0, 0] },
  phong: { xuan: ['#7aa04a', 0.75, 0], ha: ['#4e7a34', 0.85, 0], thu: [null, 0, 0], dong: ['#5e2a1c', 0.7, 0.4] },
  hoe: { xuan: ['#8ab04e', 0.45, 0], ha: [null, 0, 0], thu: ['#b0a040', 0.5, 0.05], dong: ['#9a9050', 0.35, 0.15] },
  du: { xuan: ['#6a9a48', 0.4, 0], ha: [null, 0, 0], thu: ['#c8a032', 0.6, 0.08], dong: ['#8a8048', 0.4, 0.2] },
  lieu: { xuan: ['#a8c060', 0.5, 0], ha: [null, 0, 0], thu: ['#b8a040', 0.5, 0.1], dong: ['#a09a58', 0.45, 0.25] },
  tung: { xuan: [null, 0, 0], ha: [null, 0, 0], thu: [null, 0, 0], dong: [null, 0, 0] },
};
const SEASON_U = new Map(); // loài → uniform dùng chung cho thân + thẻ lá
let SEASON_NOW = null;
function seasonU(sp) {
  if (!SEASON_U.has(sp)) SEASON_U.set(sp, { uSeasonTint: { value: new THREE.Color(1, 1, 1) }, uSeasonMix: { value: 0 }, uSparse: { value: 0 } });
  return SEASON_U.get(sp);
}
/** áp mùa hiện tại vào uniform (gọi lúc dựng và mỗi lần chia bậc cây — đổi mùa giữa phiên tự cập nhật) */
export function applySeason(now = Date.now()) {
  const se = seasonOf(now); if (se === SEASON_NOW) return se; SEASON_NOW = se;
  for (const sp of Object.keys(SEASON_LOOK)) { const [hex, mix, sparse] = SEASON_LOOK[sp][se], u = seasonU(sp); if (hex) u.uSeasonTint.value.set(hex); u.uSeasonMix.value = hex ? mix : 0; u.uSparse.value = sparse; }
  return se;
}
function windMat(amp, extra = {}, flat = false, sp = null) {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, side: THREE.DoubleSide, ...extra });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uWind = WIND;
    if (sp) {
      Object.assign(sh.uniforms, seasonU(sp));
      sh.vertexShader = (flat ? '' : 'attribute float leafm;\n') + 'varying float vLeaf;\nvarying vec3 vWP;\n' + sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
        vLeaf = ${flat ? '1.0' : 'leafm'};
        #ifdef USE_INSTANCING
          vWP = (modelMatrix * instanceMatrix * vec4(${flat ? 'vec3(0.0)' : 'transformed'}, 1.0)).xyz;
        #else
          vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;
        #endif`);
      sh.fragmentShader = 'uniform vec3 uSeasonTint;\nuniform float uSeasonMix;\nuniform float uSparse;\nvarying float vLeaf;\nvarying vec3 vWP;\n' + sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
        if (vLeaf > 0.5) {
          float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
          diffuseColor.rgb = mix(diffuseColor.rgb, uSeasonTint * (0.45 + lum * 1.6), uSeasonMix);
          if (uSparse > 0.0 && fract(sin(dot(floor(vWP * 2.5), vec3(12.9898, 78.233, 37.719))) * 43758.5453) < uSparse) discard;
        }`);
    }
    sh.vertexShader = 'uniform float uWind;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      #ifdef USE_INSTANCING
        vec2 wp = vec2(instanceMatrix[3][0], instanceMatrix[3][2]);
      #else
        vec2 wp = vec2(0.0);
      #endif
      float ph = dot(wp, vec2(0.131, 0.173));
      float wk = ${flat ? '1.0' : 'smoothstep(0.35, 1.0, position.y)'} * ${amp.toFixed(3)};
      transformed.x += (sin(uWind * 1.3 + ph) * 0.016 + sin(uWind * 3.9 + ph * 1.7 + position.y * 6.0) * 0.006) * wk;
      transformed.z += (cos(uWind * 1.05 + ph * 0.8) * 0.012 + sin(uWind * 4.4 + ph + position.x * 7.0) * 0.005) * wk;`);
    // hai mặt nhưng KHÔNG lật pháp tuyến mặt sau: pháp tuyến cầu của tán phải giữ hướng ra ngoài ở cả hai phía lá
    sh.fragmentShader = sh.fragmentShader.replace('float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;', 'float faceDirection = 1.0;');
  };
  m.customProgramCacheKey = () => `tree-wind-${amp}-${extra.map ? 'map' : 'vc'}-${flat}-${sp || ''}`;
  return m;
}
const TREE_MAT = { base: windMat(1) }; // tre (thân không đổi mùa)
const SP_MAT = new Map(); // loài → { body, card }
const spMat = (sp) => { if (!SP_MAT.has(sp)) SP_MAT.set(sp, { body: windMat(sp === 'lieu' ? 1.6 : 1, {}, false, sp), card: windMat(4, { map: CARD.tex, alphaTest: 0.45 }, true, sp) }); return SP_MAT.get(sp); };
applySeason();
// THẺ LÁ: chùm 3 tấm chéo nhau, texture lá bầu dục (trắng xám → nhuộm theo màu tán từng chùm), alpha cắt, pháp tuyến cầu
const CARD = (() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const q = cv.getContext('2d');
  const rr = (k) => { const v = Math.sin(k * 78.233 + 1.7) * 43758.5453; return v - Math.floor(v); };
  for (let k = 0; k < 34; k++) {
    const a = rr(k) * Math.PI * 2, len = 16 + rr(k + 11) * 14, rad = 34 * Math.sqrt(rr(k + 5)), x0 = 64 + Math.cos(a) * rad, y0 = 64 + Math.sin(a) * rad * 0.85;
    const v = 170 + Math.floor(rr(k + 3) * 85); q.fillStyle = `rgb(${v},${v},${v})`;
    q.save(); q.translate(x0, y0); q.rotate(a + (rr(k + 9) - 0.5)); q.beginPath(); q.ellipse(0, 0, len / 2, len / 4.2, 0, 0, Math.PI * 2); q.fill();
    q.strokeStyle = `rgba(0,0,0,0.18)`; q.lineWidth = 1; q.beginPath(); q.moveTo(-len / 2, 0); q.lineTo(len / 2, 0); q.stroke(); q.restore(); // gân lá
  }
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const quads = []; for (let k = 0; k < 3; k++) { const g = new THREE.PlaneGeometry(1, 1); g.rotateX(k === 2 ? Math.PI / 2 : 0); g.rotateY(k * Math.PI / 2.4); quads.push(g); }
  const geo = mergeGeometries(quads); const P = geo.attributes.position, N = geo.attributes.normal;
  for (let i = 0; i < N.count; i++) { const x = P.getX(i), y = P.getY(i) + 0.35, z = P.getZ(i), l = Math.hypot(x, y, z) || 1; N.setXYZ(i, x / l, y / l, z / l); }
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(P.count * 3).fill(1), 3));
  return { geo, tex };
})();
const CARD_SP = new Set(['hoe', 'du', 'dao', 'anhdao', 'phong']); // liễu, tùng: tán sẵn mảnh (cành rủ / đám lá kim) — không cần thẻ
/** ghi một cây vào lô của ô (InstancedMesh dựng sau khi khuôn tải xong — xem TreeSet trong cityDress) */
function tree(B, x, z, seed, big = 1, kind = null) {
  const sp = kind || speciesOf(seed), y = H(x, z), r = rnd01(seed), r2 = rnd01(seed + 'b');
  if (sp === 'tre') { bamboo(B, x, y, z, seed, big); addSolidCircle(x, z, 0.8 * big); return; }
  const T = TREE_SP[sp], grow = big > 1 ? 1 + (big - 1) * 0.45 : big;
  const ht = (T.h[0] + (T.h[1] - T.h[0]) * r) * grow * (0.92 + 0.16 * r2), wd = ht * T.w * (0.9 + 0.2 * rnd01(seed + 'w'));
  B.trees.push({ sp, x, y: y - 0.05, z, ry: r * 6.283, ht, wd, tone: 0.92 + 0.16 * rnd01(seed + 't') });
  addSolidCircle(x, z, 0.35 * Math.max(1, grow));
}
// TRE (thủ tục): thân 5 cạnh có đốt sẫm + chùm lá dạng thẻ (texture lá vẽ canvas, alpha cắt, pháp tuyến cầu) — §2.4
const BAMBOO = (() => {
  const culm = new THREE.CylinderGeometry(0.045, 0.06, 1, 5, 24, true); culm.translate(0, 0.5, 0);
  const P = culm.attributes.position, col = new Float32Array(P.count * 3);
  for (let i = 0; i < P.count; i++) { const y = P.getY(i), node = Math.round(y * 24) % 2 === 0; col.set(node ? [0.36, 0.42, 0.2] : [0.46 + 0.1 * y, 0.58 + 0.05 * y, 0.24], i * 3); } // đốt: vạch sẫm mỗi ~1/12 thân
  culm.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const q = cv.getContext('2d');
  const rr = (k) => { const v = Math.sin(k * 12.9898) * 43758.5453; return v - Math.floor(v); };
  for (let k = 0; k < 28; k++) { // lá tre: thuôn dài, mũi nhọn, xoè từ cành
    const a = -Math.PI / 2 + (rr(k) - 0.5) * 2.8, len = 30 + rr(k + 7) * 28, x0 = 64 + (rr(k + 3) - 0.5) * 44, y0 = 48 + rr(k + 5) * 64;
    q.save(); q.translate(x0, y0); q.rotate(a); q.fillStyle = ['#5f8a34', '#4e7a2c', '#6e9a3e', '#7aa648', '#476e2a'][k % 5];
    q.beginPath(); q.moveTo(0, 0); q.quadraticCurveTo(len * 0.45, -5, len, 0); q.quadraticCurveTo(len * 0.45, 5, 0, 0); q.fill(); q.restore();
  }
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const quads = []; for (let k = 0; k < 3; k++) { const g = new THREE.PlaneGeometry(1, 1); g.rotateY(k * Math.PI / 3); quads.push(g); }
  const leaf = mergeGeometries(quads);
  const pos = leaf.attributes.position, nrm = leaf.attributes.normal;
  for (let i = 0; i < nrm.count; i++) { const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), l = Math.hypot(x, y + 0.4, z) || 1; nrm.setXYZ(i, x / l, (y + 0.4) / l, z / l); } // pháp tuyến cầu: chùm lá sáng như một khối mềm
  leaf.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pos.count * 3).fill(1), 3));
  return { culm, leaf, mat: windMat(1.3, { map: tex, alphaTest: 0.5 }) };
})();
function bamboo(B, x, y, z, seed, big) {
  const n = 7 + (hash(seed) % 6), r0 = rnd01(seed) * 6;
  for (let i = 0; i < n; i++) {
    const a = i * 2.39 + r0, d = 0.2 + 0.6 * rnd01(seed + i), h = (6 + 4 * rnd01(seed + 'h' + i)) * big, sx = x + Math.cos(a) * d, sz = z + Math.sin(a) * d;
    B.add(BAMBOO.culm, TREE_MAT.base, sx, y, sz, a, 1, h, 1, ['#ffffff', '#e8f0d8', '#d8e4c0'][i % 3]);
    const nl = 3 + (hash(seed + 'l' + i) % 3);
    for (let k = 0; k < nl; k++) { const t = 0.55 + 0.42 * (k / nl), la = a + k * 2.1, o = 0.25 + 0.2 * (k % 2); B.add(BAMBOO.leaf, BAMBOO.mat, sx + Math.cos(la) * o, y + h * t, sz + Math.sin(la) * o, la, 1.5, 1.3, 1.5, ['#ffffff', '#e2ecd0', '#f2f6e2'][k % 3]); }
  }
}
/**
 * Bộ cây của một ô: mỗi loài hai InstancedMesh (gần .vc / xa .vc2), chia lại theo khoảng cách người chơi.
 * Ma trận tính sẵn một lần; chia lại chỉ chép ma trận (≤ 3 lần / giây, khi người chơi đi > 6 m).
 */
const TM = new THREE.Matrix4(), CM = new THREE.Matrix4(), CP = new THREE.Vector3(), CQ = new THREE.Quaternion(), CE = new THREE.Euler(), CS = new THREE.Vector3();
function treeSet(list, near, shadow) {
  const bySp = new Map();
  for (const t of list) { let l = bySp.get(t.sp); if (!l) bySp.set(t.sp, (l = [])); l.push(t); }
  const sets = [], m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), P = new THREE.Vector3(), S = new THREE.Vector3(), c = new THREE.Color();
  const E = { px: 0, pz: 0, lx: Infinity, lz: Infinity, at: 0, k: 1 };
  for (const [sp, l] of bySp) {
    const mats = new Float32Array(l.length * 16), cols = new Float32Array(l.length * 3);
    l.forEach((t, i) => { m4.compose(P.set(t.x, t.y, t.z), q.setFromAxisAngle(up, t.ry), S.set(t.wd, t.ht, t.wd)).toArray(mats, i * 16); c.setRGB(t.tone, t.tone, t.tone).toArray(cols, i * 3); });
    const S0 = { l, mats, cols, ims: null, card: null, cards: null, tones: l.map((t) => t.tone) };
    sets.push(S0);
    Promise.all(TREE_TIERS.map(([, suf]) => treeGeo(sp, suf))).then((geos) => {
      const mat = spMat(sp).body, ims = [];
      TREE_TIERS.forEach(([tier], j) => {
        const geo = geos[j] || geos[1] || geos[2]; if (!geo) return ims.push(null);
        const im = new THREE.InstancedMesh(geo, mat, l.length); im.count = 0; im.frustumCulled = false; im.visible = false;
        im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(l.length * 3), 3);
        im.castShadow = shadow && tier !== 'far'; im.receiveShadow = true; im.onBeforeRender = tickWind; im.name = `tree:${sp}:${tier}`;
        near.add(im); ims.push(im);
      });
      const cd = geos[0]?.userData.cards;
      if (CARD_SP.has(sp) && cd && cd.pos.length) {
        const n = Math.min(l.length, 40) * (cd.pos.length / 3); // tối đa 40 cây gần / ô có thẻ lá
        const im = new THREE.InstancedMesh(CARD.geo, spMat(sp).card, n); im.count = 0; im.frustumCulled = false; im.visible = false;
        im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3); im.receiveShadow = true; im.onBeforeRender = tickWind; im.name = `tree:${sp}:card`;
        near.add(im); S0.card = im; S0.cards = cd;
      }
      S0.ims = ims; E.lx = Infinity; E.assign(E.px, E.pz, E.k);
    });
  }
  /** chia lại bậc theo khoảng cách (gần: chi tiết cao; xa hơn bậc cuối: không vẽ) — ≤ 3 lần / giây, khi đi > 6 m */
  E.assign = (px, pz, k = 1) => {
    E.px = px; E.pz = pz; E.k = k; applySeason();
    const now = performance.now();
    if (Math.hypot(px - E.lx, pz - E.lz) < 6 || now - E.at < 330) return;
    E.lx = px; E.lz = pz; E.at = now;
    const R = TREE_TIERS.map(([, , r]) => r * k);
    for (const S0 of sets) {
      if (!S0.ims) continue;
      const n = TREE_TIERS.map(() => 0);
      S0.l.forEach((t, i) => {
        const d = Math.hypot(t.x - px, t.z - pz); let j = 0; while (j < R.length && d >= R[j]) j++;
        const im = S0.ims[j]; if (!im) return;
        im.instanceMatrix.array.set(S0.mats.subarray(i * 16, i * 16 + 16), n[j] * 16); im.instanceColor.array.set(S0.cols.subarray(i * 3, i * 3 + 3), n[j] * 3); n[j]++;
      });
      S0.ims.forEach((im, j) => { if (!im) return; im.count = n[j]; im.visible = n[j] > 0; im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; });
      if (S0.card) { // thẻ lá cho cây gần (bậc hi + near), mỗi chùm một tấm xoay ngẫu nhiên, cỡ ~16 % chiều cao cây
        const im = S0.card, cd = S0.cards, K = cd.pos.length / 3, cap = im.instanceMatrix.count; let c = 0;
        S0.l.forEach((t, i) => {
          if (c + K > cap || Math.hypot(t.x - px, t.z - pz) >= R[1]) return;
          TM.fromArray(S0.mats, i * 16);
          for (let k = 0; k < K; k++) {
            CP.set(cd.pos[k * 3], cd.pos[k * 3 + 1], cd.pos[k * 3 + 2]).applyMatrix4(TM);
            const h = (i * 31 + k * 17) % 97 / 97, sc = t.ht * (0.13 + 0.06 * h);
            CQ.setFromEuler(CE.set((h - 0.5) * 0.6, h * 6.283 + k, (0.5 - h) * 0.4));
            CM.compose(CP, CQ, CS.set(sc, sc, sc)).toArray(im.instanceMatrix.array, c * 16);
            const tone = S0.tones[i] * (0.85 + 0.3 * h); im.instanceColor.array.set([cd.col[k * 3] * tone, cd.col[k * 3 + 1] * tone, cd.col[k * 3 + 2] * tone], c * 3); c++;
          }
        });
        im.count = c; im.visible = c > 0; im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true;
      }
    }
  };
  return E;
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
function ring(B, P, cx, cz, step, seed, big = 1, kind = null) {
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], L0 = Math.hypot(b.x - a.x, b.z - a.z), n = Math.max(1, Math.floor(L0 / step));
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n; let x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t; const d = Math.hypot(cx - x, cz - z) || 1; x += ((cx - x) / d) * 3; z += ((cz - z) / d) * 3;
      tree(B, x, z, `${seed}|${i}|${k}`, big, kind);
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
    if (!low && hash(`${g.x},${g.z}`) % 3 === 0) tree(B, g.x - g.nx * 2.2, g.z - g.nz * 2.2, `gap${g.x},${g.z}`, 0.8, speciesOf(`gap${g.x},${g.z}`, [['tre', 0.55], ['dao', 0.25], ['anhdao', 0.2]])); // cây sau tường: khóm tre / đào
  }
  // 3) sân góc: cây + đèn đá
  for (const s of C.gardens) { if (inPhuPlot(s.x, s.z)) continue; tree(B, s.x, s.z, `gd${s.x},${s.z}`, 1, speciesOf(`gd${s.x},${s.z}`, [['anhdao', 0.3], ['phong', 0.25], ['tung', 0.25], ['dao', 0.2]])); const lx = s.x + s.nx * 3, lz = s.z + s.nz * 3; B.add(G.lamp, M.stone, lx, H(lx, lz), lz, 0); }
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
      ring(B, sq, cx, cz, 9, `sq${ct.block}`, 1, 'hoe'); // sân đình: hàng hoè (phố hoè Trường An)
      garden(B, P, ct, cx, cz, low, 22);
      tree(B, cx + 14 * Math.cos(face + 1.2), cz + 14 * Math.sin(face + 1.2), `banyan${ct.ward}`, 1.8, 'du'); // cây đa / du cổ thụ của phường
      { const fx = Math.sin(face), fz = Math.cos(face); for (const sv of [-1, 1]) tree(B, cx + fx * 8 + fz * 7 * sv, cz + fz * 8 - fx * 7 * sv, `tung${ct.block}${sv}`, 1, 'tung'); } // đôi tùng trước đình
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
        if (r.kind === 'avenue' && !low) tree(B, x, z, `${r.id}|${k}|${sv}`, 1, hash(`${r.id}|${sv}`) & 1 ? 'hoe' : 'du'); // đại lộ: mỗi bên một hàng hoè hoặc du (Trường An), cao thấp / xoay khác nhau
        if ((r.kind === 'avenue' && k % 2 === 0) || r.kind === 'ring') {
          const lx = x - tx * 3, lz = z - tz * 3, ry = Math.atan2(-nx * sv, -nz * sv) - Math.PI / 2;
          B.add(G.post, M.wood, lx, H(lx, lz), lz, ry); B.add(G.lantern, M.lantern, lx, H(lx, lz), lz, ry); addSolidCircle(lx, lz, 0.3);
          if (k % 4 === 0) addLight(lx, H(lx, lz) + 3, lz, { color: '#ffa04a', power: 1 });
        }
        // hàng quán vỉa hè đại lộ (Biện Kinh: «xâm nhai» — sạp lấn mép đường), xen giữa hai gốc cây
        if (r.kind === 'avenue' && !low && k % 3 === (sv > 0 ? 1 : 2)) { const sx = px + tx * step / 2 + nx * (off - 1.6) * sv, sz = pz + tz * step / 2 + nz * (off - 1.6) * sv; if (!nearCross(C, sx, sz, r)) stall(B, sx, sz, Math.atan2(-nx * sv, -nz * sv), `av${r.id}${k}${sv}`); }
      }
    }
  }
  // 5b) dây đèn lồng giăng ngang phố nhánh Nội / Trung Thành (mỗi ~22 m, 5 đèn / dây, cao 5,4 m)
  if (!low) for (const r of C.roads) {
    if (r.bridge || (r.kind !== 'street' && r.kind !== 'lane')) continue;
    const Lr = Math.hypot(r.b.x - r.a.x, r.b.z - r.a.z); if (Lr < 30) continue;
    const tx = (r.b.x - r.a.x) / Lr, tz = (r.b.z - r.a.z) / Lr, ry = Math.atan2(tx, tz) + Math.PI / 2;
    for (let s = 14; s < Lr - 10; s += 22) {
      const x = r.a.x + tx * s, z = r.a.z + tz * s;
      if (x < C.x0 || x >= C.x1 || z < C.z0 || z >= C.z1 || nearCross(C, x, z, r) || inPhuPlot(x, z)) continue;
      const ring0 = L.districtOf(x, z).ring; if (ring0 !== 'noi' && ring0 !== 'trung') continue;
      const y = H(x, z) + 5.4, wd = r.w + 2;
      B.add(G.rope, M.wood, x, y, z, ry, wd, 1, 1);
      for (let q = -2; q <= 2; q++) { const o = q * wd / 6, lx = x - tz * o, lz = z + tx * o; B.add(G.lanternS, M.lantern, lx, y - 0.35 - 0.25 * (1 - (q / 2.5) ** 2), lz, 0, 1, 1, 1); }
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
    if (!low) ring(B, P, cx, cz, 13, `pl${p.id}${cx}`, 1, hash(p.id) & 1 ? 'lieu' : 'hoe'); // quảng trường: liễu hoặc hoè quanh mép
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
  if (B.trees.length) grp.userData.trees = treeSet(B.trees, grp.userData.near, !low);
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
    for (const g of built.values()) if (g?.userData.trees && g.userData.near.visible) g.userData.trees.assign(px, pz, low() ? TREE_LOW : 1); // cây: bậc chi tiết theo khoảng cách
    // dựng trong ngân sách ~18 ms mỗi lần gọi (landmarks gọi 0,4–1,5 s / lần)
    const t0 = performance.now();
    while (queue.length && performance.now() - t0 < 18) make(queue.shift(), px, pz);
  }
  return { update, root, settle: (px, pz, n = 12) => { lx = Infinity; update(px, pz); for (let k = 0; k < n && queue.length; k++) make(queue.shift(), px, pz); } };
}
export const _test = { buildCell, treeSet };
